import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/VisitDetails.module.css";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import { saveAs } from "file-saver";

let pdfMake;
let pdfFonts;

// Define fonts
const fonts = {
  Cairo: {
    normal: '/fonts/Cairo-Regular.ttf',
    bold: '/fonts/Cairo-Regular.ttf',
    italics: '/fonts/Cairo-Regular.ttf',
    bolditalics: '/fonts/Cairo-Regular.ttf'
  }
};

// Create vfs function
const loadFonts = async () => {
  try {
    // Load Cairo font from local file using absolute path
    const fontResponse = await fetch('/fonts/Cairo-Regular.ttf');
    if (!fontResponse.ok) {
      throw new Error('Failed to load font file');
    }
    const fontArrayBuffer = await fontResponse.arrayBuffer();

    // Create VFS object with Cairo font
    const vfs = {};
    vfs['Cairo-Regular.ttf'] = fontArrayBuffer;

    return vfs;
  } catch (error) {
    console.error('Error loading fonts:', error);
    // Fallback to default fonts if loading fails
    pdfMake.vfs = pdfFonts.vfs;
    throw error;
  }
};

const VisitDetails = ({ visit }) => {
  const [customLabels, setCustomLabels] = useState({});
  const [customTitles, setCustomTitles] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageRotations, setImageRotations] = useState({});
  const router = useRouter();
  const baseUrl = "https://heritage.top-wp.com";
  const loadedImages = useRef(new Map());
  const [loadedImageUrls, setLoadedImageUrls] = useState(new Map());
  const scrollPosition = useRef(0);
  const [editingField, setEditingField] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const savedLabels = JSON.parse(localStorage.getItem("customLabels")) || {};
    const savedTitles = JSON.parse(localStorage.getItem("customTitles")) || {};
    const savedRotations = JSON.parse(localStorage.getItem(`imageRotations_${visit?.data[0]?.id}`)) || {};
    setCustomLabels(savedLabels);
    setCustomTitles(savedTitles);
    setImageRotations(savedRotations);
  }, [visit?.data[0]?.id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const handleEditClick = () => {
    if (isEditing) {
      localStorage.setItem("customLabels", JSON.stringify(customLabels));
      localStorage.setItem("customTitles", JSON.stringify(customTitles));
    }
    setIsEditing(!isEditing);
  };

  const handleLabelChange = (e, defaultLabel) => {
    const value = e.target.value;
    setCustomLabels(prev => ({
      ...prev,
      [defaultLabel]: value
    }));
  };

  const handleTitleChange = (e, defaultTitle) => {
    const value = e.target.value;
    setCustomTitles(prev => ({
      ...prev,
      [defaultTitle]: value
    }));
  };

  const handleInputKeyDown = (e, onSave) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingField(null);
    }
  };

  const getLabel = (defaultLabel) => {
    return customLabels[defaultLabel] || defaultLabel;
  };

  const getTitle = (defaultTitle) => {
    return customTitles[defaultTitle] || defaultTitle;
  };

  const EditableText = ({ type, value, defaultValue, onChange, className }) => {
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      if (editingField === defaultValue && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editingField]);

    const handleSave = () => {
      onChange({ target: { value: editValue } }, defaultValue);
      setEditingField(null);
    };

    const handleDoubleClick = () => {
      setEditValue(value);
      setEditingField(defaultValue);
    };

    if (editingField === defaultValue) {
      return (
        <div className={styles.editableInputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => handleInputKeyDown(e, handleSave)}
            className={`${className} ${styles.editableInput}`}
            autoComplete="off"
            spellCheck="false"
          />
          <div className={styles.editingIndicator}>
            <span>Press Enter to save or Esc to cancel</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${className} ${styles.editableText} ${isEditing ? styles.editable : ''}`}
        onDoubleClick={isEditing ? handleDoubleClick : undefined}
      >
        {value}
        {isEditing && (
          <div className={styles.editHint}>
            <span>Double-click to edit</span>
          </div>
        )}
      </div>
    );
  };

  if (!visit) {
    return <div>Loading...</div>;
  }

  const visitId = visit.data[0].id;
  const visits = visit.data[0].attributes;

  // Helper function to fetch image as blob
  const fetchImageAsBlob = async (url) => {
    try {
      const token = localStorage.getItem("token");
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/proxy-image?url=${encodedUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Empty image received');
      }

      return blob;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error(`Image fetch failed: ${error.message}`);
    }
  };

  const ImageGrid = ({ images, title }) => {
    if (!images?.data?.length) return null;
    
    const imageUrls = images.data.map(item => {
      const url = item.attributes.formats?.small?.url || item.attributes.url;
      return url.startsWith('http') ? url : `${baseUrl}${url}`;
    });
    
    const handleRotate = (index, direction) => {
      setImageRotations(prev => {
        const newRotations = {
          ...prev,
          [title + index]: ((prev[title + index] || 0) + (direction === 'left' ? -90 : 90)) % 360
        };
        // Save to localStorage whenever rotation changes
        localStorage.setItem(`imageRotations_${visit?.data[0]?.id}`, JSON.stringify(newRotations));
        return newRotations;
      });
    };

    useEffect(() => {
      // Add all image URLs to loadedImageUrls map once when component mounts
      imageUrls.forEach((url, index) => {
        setLoadedImageUrls(prev => {
          if (!prev.has(`${title}-${index}`)) {
            const newMap = new Map(prev);
            newMap.set(`${title}-${index}`, url);
            return newMap;
          }
          return prev;
        });
      });
    }, [imageUrls, title]);

    return (
      <div className={styles.section}>
        <EditableText
          type="title"
          value={getTitle(title)}
          defaultValue={title}
          onChange={handleTitleChange}
          className={styles.sectionTitle}
        />
        <div className={styles.imageGrid}>
          {imageUrls.map((url, index) => (
            <div key={index} className={styles.imageContainer}>
              <div className={styles.rotationControls}>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleRotate(index, 'left');
                }}>↺</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleRotate(index, 'right');
                }}>↻</button>
              </div>
              <div 
                className={styles.imageWrapper}
                style={{ transform: `rotate(${imageRotations[title + index] || 0}deg)` }}
              >
                <Image
                  src={url}
                  alt={`${title} ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className={styles.image}
                  unoptimized={true}
                  priority={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const InfoSection = ({ title, items }) => (
    <div className={styles.section}>
      <EditableText
        type="title"
        value={getTitle(title)}
        defaultValue={title}
        onChange={handleTitleChange}
        className={styles.sectionTitle}
      />
      <div className={styles.grid}>
        {items.map(([label, value]) => (
          <div key={label} className={styles.infoItem}>
            <EditableText
              type="label"
              value={getLabel(label)}
              defaultValue={label}
              onChange={handleLabelChange}
              className={styles.label}
            />
            <div className={styles.value}>{value || "N/A"}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleExport = async () => {
    alert("Generating document... This may take a few moments.");

    try {
      // Create a new document with modern formatting
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440
              }
            }
          },
          children: []
        }]
      });

      // All content will be added to the children array
      const children = [];

      // Add cover page
      children.push(
        new Paragraph({
          text: "Heritage Visit Report",
          heading: HeadingLevel.TITLE,
          spacing: { after: 300, before: 300 },
          style: {
            paragraph: {
              alignment: "CENTER"
            },
            run: {
              size: 48,
              font: "Arial",
              bold: true,
              color: "2E74B5"
            }
          }
        }),
        new Paragraph({
          text: `Visit ID: ${visitId}`,
          spacing: { after: 300 },
          style: {
            paragraph: {
              alignment: "CENTER"
            },
            run: {
              size: 28,
              font: "Arial"
            }
          }
        }),
        new Paragraph({
          text: `Generated on ${new Date().toLocaleDateString()}`,
          spacing: { after: 800 },
          style: {
            paragraph: {
              alignment: "CENTER"
            },
            run: {
              size: 24,
              font: "Arial",
              color: "666666"
            }
          }
        }),
        // Page break after cover
        new Paragraph({
          text: "",
          pageBreakBefore: true
        })
      );

      // Helper function to add content sections
      const addContentSection = (title, data) => {
        children.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
            style: {
              paragraph: {
                alignment: "LEFT"
              },
              run: {
                size: 32,
                font: "Arial",
                bold: true,
                color: "2E74B5"
              }
            }
          })
        );

        Object.entries(data).forEach(([label, value]) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${label}: `,
                  bold: true,
                  size: 24,
                  font: "Arial",
                  color: "000000"
                }),
                new TextRun({
                  text: value?.toString() || "N/A",
                  size: 24,
                  font: "Arial",
                  color: "333333"
                })
              ],
              spacing: { before: 120, after: 120 },
              style: {
                paragraph: {
                  spacing: {
                    line: 360 // 1.5 line spacing
                  }
                }
              }
            })
          );
        });
      };

      // Add main content sections
      addContentSection('Basic Information', {
        "Visit ID": visitId,
        "User": visits.user,
        "Visit Date": visits.visitdate,
        "Created Date": visits.createdAt
      });

      addContentSection('Site Description', {
        "GPS Location": visits.gpsLocation,
        "Governorate": visits.governorate,
        "District": visits.district,
        "City": visits.city,
        "Street": visits.street,
        "Plot Number": visits.plotNumber,
        "Historical or Archaeological site": visits.historicalorarchaeologicalsite,
        "Building Name": visits.buildingName,
        "Build Date": visits.buildDate,
        "Architectural Style": visits.architecturalStyle,
        "Location type": visits.locationtype,
        "Protection level": visits.protectionlevel,
        "Site ownership": visits.siteOwnership,
        "Owner's name": visits.ownerName,
        "Responsible person": visits.responsiblePerson,
        "Building height": visits.buildingHeight,
        "Number of floors": visits.numberOfFloors,
        "Category": visits.category,
        "General Condition of the site": visits.generalConditionOfSite,
        "The state of the site before the event": visits.stateBeforeTheEvent,
        "Intangible Heritage activities": visits.intangibleHeritageActivities,
        "Member of an internal organization": visits.memberofaninternalOrganization
      });

      // Helper function to add images with better layout
      const addImagesToDoc = async (images, title) => {
        if (images?.data?.length) {
          children.push(
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
              style: {
                paragraph: {
                  alignment: "LEFT"
                },
                run: {
                  size: 28,
                  font: "Arial",
                  bold: true,
                  color: "2E74B5"
                }
              }
            })
          );

          for (let i = 0; i < Math.min(images.data.length, 3); i++) {
            try {
              const imageKey = `${title}-${i}`;
              let imageUrl = loadedImageUrls.get(imageKey);
              
              if (!imageUrl) {
                const imageData = images.data[i];
                const url = imageData.attributes.formats?.thumbnail?.url || 
                           imageData.attributes.formats?.small?.url || 
                           imageData.attributes.url;
                imageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
              }

              const blob = await fetchImageAsBlob(imageUrl);
              const arrayBuffer = await blob.arrayBuffer();
              
              children.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: arrayBuffer,
                      transformation: {
                        width: 700,
                        height: 500
                      }
                    })
                  ],
                  spacing: { before: 120, after: 120 },
                  style: {
                    paragraph: {
                      alignment: "CENTER"
                    }
                  }
                })
              );
            } catch (error) {
              console.error(`Error processing image ${i + 1} from ${title}:`, error);
              children.push(
                new Paragraph({
                  text: `[Unable to load image ${i + 1} from ${title}]`,
                  spacing: { before: 120, after: 120 },
                  style: {
                    paragraph: {
                      alignment: "CENTER"
                    },
                    run: {
                      size: 24,
                      font: "Arial",
                      color: "FF0000"
                    }
                  }
                })
              );
            }
          }
        }
      };

      // Process images in a more organized way
      const imageCategories = [
        { images: visits.currentPhotoOfSite, title: "Current Site Photos" },
        { images: visits.sitephotosBeforeEvent, title: "Site Photos Before Event" },
        { images: visits.inFloorPhotos, title: "Floor Photos" },
        { images: visits.exPhotos, title: "External Wall Photos" },
        { images: visits.roofPhotos, title: "Roof Photos" },
        { images: visits.outsidePhotos, title: "Outside Photos" },
        { images: visits.entrancePhotos, title: "Entrance Photos" },
        { images: visits.externalPhotos, title: "External Photos" },
        { images: visits.structuralPhotos, title: "Structural Photos" },
        { images: visits.inWallsPhotos, title: "Internal Wall Photos" },
        { images: visits.infeatureditemsphotos, title: "Featured Items Photos" },
        { images: visits.inCeillingPhotos2, title: "Ceiling Photos" },
        { images: visits.archaeologicalremainsphotos, title: "Archaeological Remains Photos" },
        { images: visits.generalPhotosBuilding, title: "General Building Photos" }
      ];

      // Add images section
      children.push(
        new Paragraph({
          text: "Site Documentation",
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { before: 400, after: 200 },
          style: {
            paragraph: {
              alignment: "LEFT"
            },
            run: {
              size: 32,
              font: "Arial",
              bold: true,
              color: "2E74B5"
            }
          }
        })
      );

      console.log('Processing image categories...');
      for (const category of imageCategories) {
        if (category.images?.data?.length > 0) {
          await addImagesToDoc(category.images, category.title);
        }
      }

      // Update the document with all content
      doc.addSection({
        children: children
      });

      // Generate Word document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `heritage-visit-${visitId}.docx`);
      alert("Document generated successfully!");

    } catch (error) {
      console.error("Error generating document:", error);
      alert(`Error generating document: ${error.message}. Please try again.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Heritage - Visit Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css" media="print">
          {`
            @page {
              size: A4;
              margin: 2cm;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `}
        </style>
      </Head>

      <div className={styles.header}>
        <h1 className={styles.title}>Visit Details</h1>
        <div className={styles.headerButtons}>
          <button className={styles.editButton} onClick={handleEditClick}>
            {isEditing ? "Save Changes" : "Edit Labels"}
          </button>
          <button className={styles.printButton} onClick={handlePrint}>
            Print Report
          </button>
        </div>
      </div>

      <InfoSection
        title="Basic Information"
        items={[
          ["Visit ID", visitId],
          ["User", visits.user],
          ["Visit Date", visits.visitdate],
          ["Created Date", visits.createdAt]
        ]}
      />

      <InfoSection
        title="Site Description"
        items={[
          ["GPS Location", visits.gpsLocation],
          ["Governorate", visits.governorate],
          ["District", visits.district],
          ["City", visits.city],
          ["Street", visits.street],
          ["Plot Number", visits.plotNumber],
          ["Historical or Archaeological site", visits.historicalorarchaeologicalsite],
          ["Building Name", visits.buildingName],
          ["Build Date", visits.buildDate],
          ["Architectural Style", visits.architecturalStyle],
          ["Location type", visits.locationtype],
          ["Protection level", visits.protectionlevel],
          ["Site ownership", visits.siteOwnership],
          ["Owner's name", visits.ownerName],
          ["Responsible person", visits.responsiblePerson],
          ["Building height", visits.buildingHeight],
          ["Number of floors", visits.numberOfFloors],
          ["Category", visits.category],
          ["General Condition of the site", visits.generalConditionOfSite],
          ["The state of the site before the event", visits.stateBeforeTheEvent],
          ["Intangible Heritage activities", visits.intangibleHeritageActivities],
          ["Member of an internal organization", visits.memberofaninternalOrganization]
        ]}
      />
      <ImageGrid images={visits.currentPhotoOfSite} title="Current Photos of Site" />
      <ImageGrid images={visits.sitephotosBeforeEvent} title="Site Photos Before Event" />

      <InfoSection
        title="Socio-Economical & Heritage Situation"
        items={[
          ["Type of use of the site/building", visits.typeUseTheSite],
          ["Did his job stay the same", visits.staySameJob],
          ["What is the new job", visits.whatnewJob],
          ["Type of use after a disaster", visits.usageType],
          ["Financial situation before blast", visits.financialSituationBeforeBlast],
          ["Financial situation after blast", visits.financialSituationAfterBlast],
          ["Type of assistance for restoration", visits.typeOfAssistance],
          ["Urgent need for funds", visits.urgentNeed]
        ]}
      />

      <InfoSection
        title="Safety Check Up"
        items={[
          ["Is it safe to enter", visits.safeToEnter],
          ["Is there electricity", visits.electricity],
          ["Is there Gas", visits.gas],
          ["Is there a water leak", visits.floodWater],
          ["Level of damage to the floor", visits.levelOfDamageToFloor],
          ["Level of damage to the ceiling", visits.levelDamageCeiling],
          ["Level of damage to the archaeological remains", visits.levelDamageArchaeological],
          ["Structural problem", visits.structuralproblem]
        ]}
      />
      <ImageGrid images={visits.inFloorPhotos} title="Floor Photos" />

      <InfoSection
        title="External Security Assessment - External Walls"
        items={[
          ["Material", visits.exmaterialsConstructionSystem],
          ["Cladding material", visits.expaper],
          ["Level of damage", visits.exLevelDamage],
          ["Type of damage", visits.exTypeOfDamage],
          ["Conservation priority", visits.exConservPriority]
        ]}
      />
      <ImageGrid images={visits.exPhotos} title="External Wall Photos" />

      <InfoSection
        title="External Security Assessment - Sculpture in the facade"
        items={[
          ["Level of damage", visits.roofLevelDamage],
          ["Type of damage", visits.roofTypeDamage],
          ["Conservation priority", visits.roofConservationPriority]
        ]}
      />
      <ImageGrid images={visits.roofPhotos} title="Roof Photos" />

      <InfoSection
        title="External Security Assessment - Outside Floor"
        items={[
          ["Material", visits.outsideMaterial],
          ["Level of damage", visits.outsideLevelDamage],
          ["Type of damage", visits.outsideTypeDamage],
          ["Conservation priority", visits.outsideConservationPriority]
        ]}
      />
      <ImageGrid images={visits.outsidePhotos} title="Outside Photos" />

      <InfoSection
        title="External Security Assessment - Main entrance doors"
        items={[
          ["Number", visits.entranceNumber],
          ["Level of damage", visits.entranceLevelDamage],
          ["Type of damage", visits.entranceTypeDamage],
          ["Conservation priority", visits.entranceConservationPriority]
        ]}
      />
      <ImageGrid images={visits.entrancePhotos} title="Entrance Photos" />

      <InfoSection
        title="External Security Assessment - External windows"
        items={[
          ["Number of windows", visits.externalNumber],
          ["Material", visits.externalWindowsMaterial],
          ["Security window", visits.externalSecurityWindow],
          ["Number of windows affected", visits.externalNumberWindows],
          ["Level of damage", visits.externalLevelDamage],
          ["Type of damage", visits.externalTypeDamage],
          ["Conservation priority", visits.externalConservationPriority]
        ]}
      />
      <ImageGrid images={visits.externalPhotos} title="External Photos" />

      <InfoSection
        title="External Security Assessment - Structural Elements"
        items={[
          ["Structural system", visits.stracturalSystem],
          ["Level of damage", visits.structuralLevelDamage],
          ["Type of damage", visits.structuralTypeDamage],
          ["Conservation priority", visits.structuralConservationPriority]
        ]}
      />
      <ImageGrid images={visits.structuralPhotos} title="Structural Photos" />

      <InfoSection
        title="Internal Security Assessment - Internal walls"
        items={[
          ["Material", visits.internalWallsMaterial],
          ["Level of damage", visits.inWallsLevelDamage],
          ["Type of damage", visits.inWallsTypeDamage],
          ["Conservation priority", visits.inWallsConservationPriority]
        ]}
      />
      <ImageGrid images={visits.inWallsPhotos} title="Internal Wall Photos" />

      <InfoSection
        title="Internal Security Assessment - Featured items on the walls"
        items={[
          ["Level of damage", visits.featureditemsLevelDamage],
          ["Type of damage", visits.featureditemsTypeDamage],
          ["Conservation priority", visits.featureditemsConservationPrio]
        ]}
      />
      <ImageGrid images={visits.infeatureditemsphotos} title="Featured Items Photos" />

      <InfoSection
        title="Internal Security Assessment - Ceiling"
        items={[
          ["Roof style", visits.internalroofstyle],
          ["Material", visits.inCeillingMaterial],
          ["Level of damage", visits.inCeillingLevelDamage],
          ["Type of damage", visits.inCeillingTypeDamage],
          ["Conservation priority", visits.inCeillingConservationPrio]
        ]}
      />
      <ImageGrid images={visits.inCeillingPhotos2} title="Ceiling Photos" />

      <InfoSection
        title="Internal Security Assessment - Archaeological remains"
        items={[
          ["Type", visits.archaeologicalremainsType],
          ["Material", visits.archaeologicalremainsmaterial],
          ["Level of damage", visits.archaeologicalremainsLevelDamage],
          ["Type of damage", visits.archaeologicalremainsTypedamage],
          ["Conservation priority", visits.archaeologicalremainsConservationPrio]
        ]}
      />
      <ImageGrid images={visits.archaeologicalremainsphotos} title="Archaeological Remains Photos" />

      <ImageGrid images={visits.generalPhotosBuilding} title="General Building Photos" />

      <InfoSection
        title="Final Notes"
        items={[
          ["General notes on security work needed", visits.inCollectionNotes2],
          ["General notes about the building", visits.generalNotesAboutBuilding],
          ["The local community's relationship with the site", visits.relationshipWithSite],
          ["Own notes", visits.OwnNotes]
        ]}
      />
    </div>
  );
};

export default VisitDetails;

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const response = await fetch(
    `https://heritage.top-wp.com/api/visits/?filters[id]=${id}&populate=*`
  );
  const data = await response.json();

  if (!data || !data.data || data.data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      visit: data,
    },
  };
}
