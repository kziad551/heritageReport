import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../../components/Navbar";
import Head from "next/head";

const VisitDetails = ({ visit }) => {
  const visitId = visit.data[0].id;
  const visits = visit.data[0].attributes;

  const baseUrl = "https://heritage.top-wp.com";
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, []);

  if (!visit) {
    return <div>Loading...</div>;
  }

  const currentPhotoOfSite = visits.currentPhotoOfSite;
  const sitephotosBeforeEvent = visits.sitephotosBeforeEvent;
  const exPhotos = visits.exPhotos;
  const roofPhotos = visits.roofPhotos;
  const outsidePhotos = visits.outsidePhotos;
  const entrancePhotos = visits.entrancePhotos;
  const externalPhotos = visits.externalPhotos;
  const structuralPhotos = visits.structuralPhotos;
  const inWallsPhotos = visits.inWallsPhotos;
  const inCeillingPhotos2 = visits.inCeillingPhotos2;
  const inFloorPhotos = visits.inFloorPhotos;
  const archaeologicalremainsphotos = visits.archaeologicalremainsphotos;
  const generalPhotosBuilding = visits.generalPhotosBuilding;
  const infeatureditemsphotos = visits.infeatureditemsphotos;

  let imagecurrentPhotoOfSite = [];
  let imagesitephotosBeforeEvent = [];
  let imageexPhotos = [];
  let imageroofPhotos = [];
  let imageoutsidePhotos = [];
  let imageentrancePhotos = [];
  let imageexternalPhotos = [];
  let imagestructuralPhotos = [];
  let imageinWallsPhotos = [];
  let imageinCeillingPhotos2 = [];
  let imageinFloorPhotos = [];
  let imagearchaeologicalremainsphotos = [];
  let imagegeneralPhotosBuilding = [];
  let imageinfeatureditemsphotos = [];

  if (currentPhotoOfSite && currentPhotoOfSite.data) {
    imagecurrentPhotoOfSite = currentPhotoOfSite.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }

  if (sitephotosBeforeEvent && sitephotosBeforeEvent.data) {
    imagesitephotosBeforeEvent = sitephotosBeforeEvent.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (exPhotos && exPhotos.data) {
    imageexPhotos = exPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (roofPhotos && roofPhotos.data) {
    imageroofPhotos = roofPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (outsidePhotos && outsidePhotos.data) {
    imageoutsidePhotos = outsidePhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (entrancePhotos && entrancePhotos.data) {
    imageentrancePhotos = entrancePhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (externalPhotos && externalPhotos.data) {
    imageexternalPhotos = externalPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (structuralPhotos && structuralPhotos.data) {
    imagestructuralPhotos = structuralPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (inWallsPhotos && inWallsPhotos.data) {
    imageinWallsPhotos = inWallsPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (inCeillingPhotos2 && inCeillingPhotos2.data) {
    imageinCeillingPhotos2 = inCeillingPhotos2.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (inFloorPhotos && inFloorPhotos.data) {
    imageinFloorPhotos = inFloorPhotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (archaeologicalremainsphotos && archaeologicalremainsphotos.data) {
    imagearchaeologicalremainsphotos = archaeologicalremainsphotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (generalPhotosBuilding && generalPhotosBuilding.data) {
    imagegeneralPhotosBuilding = generalPhotosBuilding.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }
  if (infeatureditemsphotos && infeatureditemsphotos.data) {
    imageinfeatureditemsphotos = infeatureditemsphotos.data.map(
      (item) =>item.attributes.formats?.small?.url || item.attributes.url
    );
  }


  
  return (
    
    <div>
       <Head>
        <title>Heritage</title>
      </Head>
      

      <div className="container">
        <h1>Visit Details</h1>

        <div className="visitcontainer">
          <section className="section">
            <h3>Securing Cultural Heritage After An Emergency</h3>
            <div className="grid-container">
              <div className="grid-item">
                <div>
                  <a>Visit ID:</a> {visitId}
                </div>
                <div>
                  <a>User:</a> {visits.user}
                </div>
              </div>
              <div className="grid-item">
                <div>
                  <a>Visit Date:</a> {visits.visitdate}
                </div>
                <div>
                  <a>Created Date:</a> {visits.createdAt}
                </div>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const { id } = params;

  // Check if the user is logged in based on your authentication mechanism
  // For example, you can check if the user's session exists or if there is a valid authentication token

  const response = await fetch(
    `https://heritage.top-wp.com/api/visits/?filters[id]=${id}&populate=*`
  );
  const data = await response.json();

  if (!data || !data.data || data.data.length === 0) {
    // Handle case where visit data is not available
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
