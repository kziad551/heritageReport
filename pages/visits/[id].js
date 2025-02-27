import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import styles from "../../styles/VisitDetails.module.css";

const VisitDetails = ({ visit }) => {
  const [customLabels, setCustomLabels] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageRotations, setImageRotations] = useState({});
  const router = useRouter();
  const baseUrl = "https://heritage.top-wp.com";

  useEffect(() => {
    const savedLabels = JSON.parse(localStorage.getItem("customLabels")) || {};
    setCustomLabels(savedLabels);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleLabelChange = (defaultLabel, newLabel) => {
    const updatedLabels = { ...customLabels, [defaultLabel]: newLabel };
    setCustomLabels(updatedLabels);
    localStorage.setItem("customLabels", JSON.stringify(updatedLabels));
  };

  const getLabel = (defaultLabel) => {
    return customLabels[defaultLabel] || defaultLabel;
  };

  if (!visit) {
    return <div>Loading...</div>;
  }

  const visitId = visit.data[0].id;
  const visits = visit.data[0].attributes;

  const ImageGrid = ({ images, title }) => {
    if (!images?.data?.length) return null;
    
    const imageUrls = images.data.map(item => item.attributes.formats?.small?.url || item.attributes.url);
    
    const handleRotate = (index, direction) => {
      setImageRotations(prev => ({
        ...prev,
        [title + index]: ((prev[title + index] || 0) + (direction === 'left' ? -90 : 90)) % 360
      }));
    };

    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
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
                  src={`${baseUrl}${url}`}
                  alt={`${title} ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className={styles.image}
                />
              </div>
            </div>
<<<<<<< HEAD
          ))}
=======
          </section>
          <section className="section">
            <h3>Site Description</h3>
            <div className="grid-container">
              <div className="grid-item">
                <div>
                  <a>Gps:</a> {visits.gpsLocation}
                </div>
                <div>
                  <a>Governorate:</a> {visits.governorate}
                </div>
                <div>
                  <a>District:</a> {visits.district}
                </div>
                <div>
                  <a>City:</a> {visits.city}
                </div>
                <div>
                  <a>Street:</a> {visits.street}
                </div>
                <div>
                  <a>Plot Number:</a> {visits.plotNumber}
                </div>
                <div>
                  <a>Historical or Archaeological site:</a>{" "}
                  {visits.historicalorarchaeologicalsite}
                </div>
                <div>
                  <a>
                    Does the building conatin any distinctive architectural
                    elements:
                  </a>{" "}
                  {visits.distinctiveArchitecturalElements}
                </div>
                <div>
                  <a>Location type:</a> {visits.locationtype}
                </div>
                <div>
                  <a>The building's name:</a> {visits.buildingName}
                </div>
                <div>
                  <a>Build date:</a> {visits.buildDate}
                </div>
                <div>
                  <a>Architectural Style:</a> {visits.architecturalStyle}
                </div>
              </div>

              <div className="grid-item">
                <div>
                  <a>Current Photo of the Site:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imagecurrentPhotoOfSite.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
                <div>
                  <a>Site Photos before the event:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imagesitephotosBeforeEvent.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
                <div>
                  <a>General Condition of the site:</a>{" "}
                  {visits.generalConditionOfSite}
                </div>
                <div>
                  <a>The state of the site before the event:</a>{" "}
                  {visits.stateBeforeTheEvent}
                </div>
                <div>
                  <a>Intangible Heritage activites:</a>{" "}
                  {visits.intangibleHeritageActivities}
                </div>
                <div>
                  <a>Member of an internal organization:</a>{" "}
                  {visits.memberofaninternalOrganization}
                </div>
                <div>
                  <a>Protection level:</a> {visits.protectionlevel}
                </div>
                <div>
                  <a>Site ownership:</a> {visits.siteOwnership}
                </div>
                <div>
                  <a>The owner's name:</a> {visits.ownerName}
                </div>
                <div>
                  <a>
                    The name of the responsible person who can be contacted:
                  </a>{" "}
                  {visits.responsiblePerson}
                </div>
                <div>
                  <a>Building height:</a> {visits.buildingHeight}
                </div>
                <div>
                  <a>The number of floors:</a> {visits.numberOfFloors}
                </div>
                <div>
                  <a>Category:</a> {visits.category}
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <h3> Socio-Economical & Heritage Situation</h3>

            <div className="grid-container">
              <div className="grid-item">
                <div>
                  <a>Type of use of the site/building:</a>{" "}
                  {visits.typeUseTheSite}
                </div>
                <div>
                  <a>Did his job stay the same:</a> {visits.staySameJob}
                </div>
                <div>
                  <a>What is the new job:</a> {visits.whatnewJob}
                </div>
                <div>
                  <a>Type of use after a disaster:</a> {visits.usageType}
                </div>
              </div>
              <div className="grid-item">
                <div>
                  <a>Financial situation of the owner before the blast:</a>{" "}
                  {visits.financialSituationBeforeBlast}
                </div>
                <div>
                  <a>Financial situation of the owner after the blast:</a>{" "}
                  {visits.financialSituationAfterBlast}
                </div>
                <div>
                  <a>Type of assistance for restoration:</a>{" "}
                  {visits.typeOfAssistance}
                </div>
                <div>
                  <a>Urgent need for funds:</a> {visits.urgentNeed}
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <h3>Safety Check Up</h3>
            <div className="grid-container">
              <div className="grid-item">
                <div>
                  <a>Is it safe to enter:</a> {visits.safeToEnter}
                </div>
                <div>
                  <a>Is there electricity:</a> {visits.electricity}
                </div>
                <div>
                  <a>Is there Gas:</a> {visits.gas}
                </div>
                <div>
                  <a>Is there a water leak:</a> {visits.floodWater}
                </div>
              </div>
              <div className="grid-item">
                <div>
                  <a>Level of damage to the floor:</a>{" "}
                  {visits.levelOfDamageToFloor}
                </div>
                <div>
                  <a>Level of damage to the ceiling:</a>{" "}
                  {visits.levelDamageCeiling}
                </div>
                <div>
                  <a>Level of damage to the archaeological remains:</a>{" "}
                  {visits.levelDamageArchaeological}
                </div>
                <div>
                  <a>Structural problem:</a> {visits.structuralproblem}
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <h3>External Security Assessment</h3>
            <div className="grid-container">
              <div className="grid-item">
                <h4>External Walls</h4>

                <div>
                  <a>Material:</a> {visits.exmaterialsConstructionSystem}
                </div>
                <div>
                  <a>Cladding material:</a> {visits.expaper}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.exLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.exTypeOfDamage}
                </div>
                <div>
                  <a>Conservation priority:</a> {visits.exConservPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageexPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>

              <div className="grid-item">
                <h4>Sculpture in the facade</h4>
                <div>
                  <a>Level of damage:</a> {visits.roofLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.roofTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.roofConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageroofPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Outside Floor</h4>

                <div>
                  <a>Material:</a> {visits.outsideMaterial}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.outsideLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.outsideTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.outsideConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageoutsidePhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Main entrance doors</h4>
                <div>
                  <a>Number:</a> {visits.entranceNumber}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.entranceLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.entranceTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.entranceConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageentrancePhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>External windows</h4>
                <div>
                  <a>Number of windows:</a> {visits.externalNumber}
                </div>
                <div>
                  <a>Material:</a> {visits.externalWindowsMaterial}
                </div>
                <div>
                  <a>Security window:</a> {visits.externalSecurityWindow}
                </div>
                <div>
                  <a>The number of windows affected:</a>{" "}
                  {visits.externalNumberWindows}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.externalLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.externalTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.externalConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageexternalPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Structural Elements</h4>

                <div>
                  <a>Structural system:</a> {visits.stracturalSystem}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.structuralLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.structuralTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.structuralConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imagestructuralPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
            </div>
          </section>
          <section className="section">
            <h3> Internal Security Assessment</h3>
            <div className="grid-container">
              <div className="grid-item">
                <h4>Internal walls</h4>

                <div>
                  <a>Material:</a> {visits.internalWallsMaterial}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.inWallsLevelDamage}
                </div>
                <div>
                  <a>Type of damage :</a> {visits.inWallsTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.inWallsConservationPriority}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageinWallsPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Featured items on the walls</h4>
                <div>
                  <a>Level of damage:</a> {visits.featureditemsLevelDamage}
                </div>
                <div>
                  <a>Type of damage: </a>
                  {visits.featureditemsTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.featureditemsConservationPrio}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageinfeatureditemsphotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Ceiling</h4>

                <div>
                  <a>Roof style:</a> {visits.internalroofstyle}
                </div>
                <div>
                  <a>Material:</a> {visits.inCeillingMaterial}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.inCeillingLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.inCeillingTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.inCeillingConservationPrio}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageinCeillingPhotos2.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Floor</h4>
                <div>
                  <a>Material:</a> {visits.inFloorMaterial}
                </div>
                <div>
                  <a>Level of damage:</a> {visits.inFloorLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a> {visits.inFloorTypeDamage}
                </div>
                <div>
                  <a>Conservation priority:</a> {visits.inFloorConservationPrio}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imageinFloorPhotos.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <h4>Archaeological remains</h4>

                <div>
                  <a>Type:</a> {visits.archaeologicalremainsType}
                </div>
                <div>
                  <a>Material:</a> {visits.archaeologicalremainsmaterial}
                </div>
                <div>
                  <a>Level of damage:</a>{" "}
                  {visits.archaeologicalremainsLevelDamage}
                </div>
                <div>
                  <a>Type of damage:</a>{" "}
                  {visits.archaeologicalremainsTypedamage}
                </div>
                <div>
                  <a>Conservation priority:</a>{" "}
                  {visits.archaeologicalremainsConservationPrio}
                </div>
                <div>
                  <a>Photos:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imagearchaeologicalremainsphotos.map(
                          (imageUrl, index) => (
                            <div key={index}>
                              <Image
                                src={`${baseUrl}${imageUrl}`}
                                alt={`Image ${index}`}
                                width={300}
                                height={200}
                              />
                            </div>
                          )
                        )}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="grid-container">
              <div className="grid-item">
                <div>
                  <a>General notes on security work needed:</a>{" "}
                  {visits.inCollectionNotes2}
                </div>
                <div>
                  <a>General notes about the building:</a>{" "}
                  {visits.generalNotesAboutBuilding}
                </div>
                <div>
                  <a>General photos of the building:</a>{" "}
                  {
                    <>
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                      >
                        {imagegeneralPhotosBuilding.map((imageUrl, index) => (
                          <div key={index}>
                            <Image
                              src={`${baseUrl}${imageUrl}`}
                              alt={`Image ${index}`}
                              width={300}
                              height={200}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </>
                  }
                </div>
              </div>
              <div className="grid-item">
                <div>
                  <a>The local community's relationship with the site:</a>{" "}
                  {visits.relationshipWithSite}
                </div>
                <div>
                  <a>Own notes:</a> {visits.OwnNotes}
                </div>
              </div>
            </div>
          </section>
>>>>>>> 7f75ee20366c527f749fdc3fff96f16423d1311d
        </div>
      </div>
    );
  };

  const InfoSection = ({ title, items }) => (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.grid}>
        {items.map(([label, value]) => (
          <div key={label} className={styles.infoItem}>
            <div className={styles.label}>
              {isEditing ? (
                <input
                  type="text"
                  value={getLabel(label)}
                  onChange={(e) => handleLabelChange(label, e.target.value)}
                  className={styles.labelInput}
                />
              ) : (
                getLabel(label)
              )}
            </div>
            <div className={styles.value}>{value || "N/A"}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Heritage - Visit Details</title>
      </Head>

      <div className={styles.header}>
        <h1 className={styles.title}>Visit Details</h1>
        <button className={styles.editButton} onClick={handleEditClick}>
          {isEditing ? "Save Changes" : "Edit Labels"}
        </button>
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
