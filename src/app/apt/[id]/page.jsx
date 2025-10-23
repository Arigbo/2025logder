"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ContactAgentModal } from "../../component/discover/contact";
import { ShareModal } from "../../component/discover/share";
import saveBookmark from "../../../utils/savebookmark";
import { isBookmarked as checkIsBookmarked } from "../../../utils/savebookmark";
const apartments = {
  1: {
    id: "1",
    name: "Cozy Studio near University A",
    location: "University Avenue",
    price: 150000,
    bedrooms: 1,
    bathrooms: 1,
    isNewListing: true,
    images: [
      "https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+1",
      "https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+2",
      "https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+3",
    ],
    agentName: "Alice Johnson",
    agentPhone: "+2348011122233",
    agentImage: "https://placehold.co/60x60/66BB6A/ffffff?text=AJ",
    propertyType: "Studio",
    amenities: ["WiFi", "Parking"],
    datePosted: new Date("2025-07-14T10:00:00Z"),
    description:
      "A charming studio apartment perfect for students or young professionals. Located just steps away from University A, it features a compact yet functional layout with ample natural light. Includes a modern kitchenette, a cozy sleeping area, and a private bathroom. Excellent transport links and local cafes are within easy reach.",
    petPolicy: "No Pets",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["24/7 Electricity", "Security Cameras"],
    propertyFeatures: ["Balcony"],
    proximity: ["Near Public Transport"],
    accessibilityFeatures: ["Ground Floor"],
    virtualTourUrl: "https://www.example.com/virtual-tour-1",
    videoTourUrl: "https://www.example.com/video-tour-1",
  },
  2: {
    id: "2",
    name: "Spacious 2-Bedroom near Tech Campus",
    location: "Innovation Hub",
    price: 280000,
    bedrooms: 2,
    bathrooms: 2,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+1",
      "https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+2",
      "https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+3",
    ],
    agentName: "Bob Williams",
    agentPhone: "+2348044455566",
    agentImage: "https://placehold.co/60x60/42A5F5/ffffff?text=BW",
    propertyType: "Apartment",
    amenities: ["Gym", "Pool", "WiFi"],
    datePosted: new Date("2025-07-10T14:30:00Z"),
    description:
      "Discover this spacious two-bedroom apartment, ideally situated near the bustling Innovation Hub and Tech Campus. It boasts two generous bathrooms, a large open-plan living area, and a fully equipped kitchen. Residents enjoy access to premium building amenities including a state-of-the-art gym and a refreshing swimming pool. Perfect for tech professionals seeking convenience and comfort.",
    petPolicy: "Pet-Friendly",
    furnishingStatus: "Furnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["Gym", "Pool", "Elevator", "Security Cameras"],
    propertyFeatures: ["Ensuite Bathroom"],
    proximity: ["Near Schools", "Near Public Transport"],
    virtualTourUrl: "https://www.example.com/virtual-tour-2",
    videoTourUrl: "https://www.example.com/video-tour-2",
  },
  3: {
    id: "3",
    name: "Modern Loft in Downtown",
    location: "City Center",
    price: 200000,
    bedrooms: 1,
    bathrooms: 1,
    isNewListing: true,
    images: [
      "https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+1",
      "https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+2",
    ],
    agentName: "Charlie Davis",
    agentPhone: "+2348077788899",
    agentImage: "https://placehold.co/60x60/FF7043/ffffff?text=CD",
    propertyType: "Condo",
    amenities: ["Parking", "Security"],
    datePosted: new Date("2025-07-15T08:00:00Z"),
    description:
      "Experience urban living at its finest in this modern loft located in the heart of the City Center. This one-bedroom, one-bathroom condo features high ceilings, exposed brick accents, and large windows offering stunning city views. Comes with secure parking and 24/7 security, providing peace of mind. Enjoy vibrant nightlife, dining, and cultural attractions just outside your door.",
    petPolicy: "Small Pets Only",
    furnishingStatus: "Semi-Furnished",
    leaseTerm: "Monthly",
    buildingAmenities: ["Security Cameras", "Elevator"],
    propertyFeatures: ["Balcony", "Walk-in Closet"],
    proximity: ["Near Markets/Supermarkets"],
    accessibilityFeatures: ["Elevator Access"],
    virtualTourUrl: "", // No virtual tour
    videoTourUrl: "https://www.example.com/video-tour-3",
  },
  4: {
    id: "4",
    name: "Affordable Room in Shared House",
    location: "Student District",
    price: 80000,
    bedrooms: 1,
    bathrooms: 0,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/D8E0E4/333333?text=Apartment+4+-+Pic+1",
    ],
    agentName: "Diana Miller",
    agentPhone: "+2348012398765",
    agentImage: "https://placehold.co/60x60/9E9E9E/ffffff?text=DM",
    propertyType: "Shared Room",
    amenities: ["WiFi"],
    datePosted: new Date("2025-07-01T18:00:00Z"),
    description:
      "An excellent opportunity for students seeking affordable accommodation in a lively student district. This private room in a shared house offers a comfortable living space with access to communal kitchen and bathroom facilities. High-speed WiFi is included, making it ideal for studies and entertainment. Close to campus and public transport.",
    petPolicy: "No Pets",
    furnishingStatus: "Furnished",
    leaseTerm: "Long-Term",
    buildingAmenities: [],
    propertyFeatures: [],
    proximity: ["Near Schools", "Near Public Transport"],
    accessibilityFeatures: [],
    virtualTourUrl: "",
    videoTourUrl: "",
  },
  5: {
    id: "5",
    name: "Bright 3-Bedroom Family Home",
    location: "Quiet Suburb",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+1",
      "https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+2",
      "https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+3",
      "https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+4",
    ],
    agentName: "Eve Brown",
    agentPhone: "+2348045678901",
    agentImage: "https://placehold.co/60x60/616161/ffffff?text=EB",
    propertyType: "House",
    amenities: ["Garden", "Parking"],
    datePosted: new Date("2025-06-25T09:00:00Z"),
    description:
      "This bright and spacious three-bedroom family home is nestled in a quiet, family-friendly suburb. Featuring two generous bathrooms, a large garden perfect for outdoor activities, and ample parking space. The interior boasts large living areas and a contemporary kitchen. Enjoy peaceful living with easy access to schools and parks.",
    petPolicy: "Pet-Friendly",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["Borehole Water"],
    propertyFeatures: ["Garden", "Study Room"],
    proximity: ["Near Schools", "Near Hospitals"],
    accessibilityFeatures: ["Ground Floor"],
    virtualTourUrl: "https://www.example.com/virtual-tour-5",
    videoTourUrl: "",
  },
  6: {
    id: "6",
    name: "Compact Studio near Arts College",
    location: "Bohemian Quarter",
    price: 120000,
    bedrooms: 1,
    bathrooms: 1,
    isNewListing: true,
    images: [
      "https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+1",
      "https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+2",
    ],
    agentName: "Frank White",
    agentPhone: "+2348078901234",
    agentImage: "https://placehold.co/60x60/212121/ffffff?text=FW",
    propertyType: "Studio",
    amenities: ["WiFi"],
    datePosted: new Date("2025-07-13T16:00:00Z"),
    description:
      "A compact and stylish studio apartment situated in the vibrant Bohemian Quarter, perfect for art students or creative individuals. This unit offers a smart use of space with integrated living and sleeping areas, a sleek kitchenette, and a private shower room. Enjoy the artistic atmosphere and numerous galleries and cafes nearby. WiFi included for convenience.",
    petPolicy: "No Pets",
    furnishingStatus: "Furnished",
    leaseTerm: "Monthly",
    buildingAmenities: [],
    propertyFeatures: [],
    proximity: ["Near Markets/Supermarkets"],
    accessibilityFeatures: [],
    virtualTourUrl: "",
    videoTourUrl: "",
  },
  7: {
    id: "7",
    name: "Large 4-Bedroom House with Garden",
    location: "Greenwich Estate",
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+1",
      "https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+2",
      "https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+3",
    ],
    agentName: "Grace Green",
    agentPhone: "+2348090123456",
    agentImage: "https://placehold.co/60x60/66BB6A/ffffff?text=GG",
    propertyType: "House",
    amenities: ["Garden", "Parking", "Pet-Friendly"],
    datePosted: new Date("2025-06-10T11:00:00Z"),
    description:
      "An expansive four-bedroom house located in the prestigious Greenwich Estate, offering luxurious family living. This home features three full bathrooms, a sprawling private garden, and ample parking. It's a pet-friendly property, ensuring your furry friends are welcome. Ideal for large families seeking space, comfort, and tranquility in a prime location.",
    petPolicy: "Pet-Friendly",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["Generator", "Borehole Water"],
    propertyFeatures: ["Garden", "Maid's Room"],
    proximity: ["Near Schools"],
    accessibilityFeatures: [],
    virtualTourUrl: "https://www.example.com/virtual-tour-7",
    videoTourUrl: "https://www.example.com/video-tour-7",
  },
  8: {
    id: "8",
    name: "Executive 2-Bedroom Apartment",
    location: "Business District",
    price: 400000,
    bedrooms: 2,
    bathrooms: 2,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+1",
      "https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+2",
    ],
    agentName: "Henry King",
    agentPhone: "+2348023456789",
    agentImage: "https://placehold.co/60x60/42A5F5/ffffff?text=HK",
    propertyType: "Apartment",
    amenities: ["Gym", "Security"],
    datePosted: new Date("2025-07-05T09:00:00Z"),
    description:
      "A premium two-bedroom, two-bathroom executive apartment in the heart of the Business District. This unit offers sophisticated living with high-end finishes, a modern kitchen, and spacious bedrooms. Building amenities include a fully equipped gym and round-the-clock security, providing a safe and convenient lifestyle for busy professionals.",
    petPolicy: "No Pets",
    furnishingStatus: "Semi-Furnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["Gym", "Security Cameras", "Concierge Service"],
    propertyFeatures: ["Ensuite Bathroom", "Walk-in Closet"],
    proximity: ["Near Public Transport", "Near Markets/Supermarkets"],
    accessibilityFeatures: ["Elevator Access"],
    virtualTourUrl: "https://www.example.com/virtual-tour-8",
    videoTourUrl: "",
  },
  9: {
    id: "9",
    name: "Quaint 1-Bedroom Cottage",
    location: "Riverside Village",
    price: 100000,
    bedrooms: 1,
    bathrooms: 1,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/B0B8BC/333333?text=Apartment+9+-+Pic+1",
    ],
    agentName: "Ivy Lee",
    agentPhone: "+2348056789012",
    agentImage: "https://placehold.co/60x60/FF7043/ffffff?text=IL",
    propertyType: "House",
    amenities: ["Garden"],
    datePosted: new Date("2025-07-12T13:00:00Z"),
    description:
      "Escape to this quaint one-bedroom cottage nestled in the picturesque Riverside Village. This charming home features a cozy living area, a compact kitchen, and a private garden, perfect for relaxation. Enjoy the tranquility of village life with scenic river views and easy access to nature trails. Ideal for singles or couples seeking a peaceful retreat.",
    petPolicy: "Pet-Friendly",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Short-Term",
    buildingAmenities: [],
    propertyFeatures: ["Garden"],
    proximity: [],
    accessibilityFeatures: ["Ground Floor"],
    virtualTourUrl: "",
    videoTourUrl: "",
  },
  10: {
    id: "10",
    name: "Modern 3-Bedroom Townhouse",
    location: "City Center",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    isNewListing: true,
    images: [
      "https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+1",
      "https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+2",
      "https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+3",
    ],
    agentName: "Jack Chan",
    agentPhone: "+2348089012345",
    agentImage: "https://placehold.co/60x60/9E9E9E/ffffff?text=JC",
    propertyType: "Townhouse",
    amenities: ["Parking", "WiFi"],
    datePosted: new Date("2025-07-15T18:00:00Z"),
    description:
      "A newly listed modern three-bedroom townhouse located conveniently in the City Center. This multi-level home offers two full bathrooms, spacious living areas, and a contemporary kitchen. Includes private parking and high-speed WiFi. Enjoy the benefits of urban living with ample space and modern comforts, perfect for families or roommates.",
    petPolicy: "No Pets",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Long-Term",
    buildingAmenities: ["24/7 Electricity", "Borehole Water"],
    propertyFeatures: ["Balcony", "Study Room"],
    proximity: ["Near Public Transport", "Near Markets/Supermarkets"],
    accessibilityFeatures: [],
    virtualTourUrl: "https://www.example.com/virtual-tour-10",
    videoTourUrl: "https://www.example.com/video-tour-10",
  },
  11: {
    id: "11",
    name: "Spacious 5-Bedroom Villa",
    location: "Quiet Suburb",
    price: 800000,
    bedrooms: 5,
    bathrooms: 4,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+1",
      "https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+2",
      "https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+3",
      "https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+4",
      "https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+5",
    ],
    agentName: "Karen Chen",
    agentPhone: "+2348012345670",
    agentImage: "https://placehold.co/60x60/616161/ffffff?text=KC",
    propertyType: "House",
    amenities: ["Pool", "Garden", "Security"],
    datePosted: new Date("2025-06-01T10:00:00Z"),
    description:
      "An exquisite five-bedroom villa offering unparalleled luxury in a serene, quiet suburb. This expansive property features four lavish bathrooms, a private swimming pool, a beautifully landscaped garden, and robust security systems. Ideal for large families or those who love to entertain, providing ample space and privacy. A true oasis of comfort and elegance.",
    petPolicy: "Pet-Friendly",
    furnishingStatus: "Semi-Furnished",
    leaseTerm: "Long-Term",
    buildingAmenities: [
      "Pool",
      "Security Cameras",
      "Generator",
      "Concierge Service",
    ],
    propertyFeatures: ["Garden", "Maid's Room", "Balcony"],
    proximity: ["Near Hospitals"],
    accessibilityFeatures: [],
    virtualTourUrl: "https://www.example.com/virtual-tour-11",
    videoTourUrl: "https://www.example.com/video-tour-11",
  },
  12: {
    id: "12",
    name: "Compact 1-Bedroom Flat",
    location: "Student District",
    price: 95000,
    bedrooms: 1,
    bathrooms: 1,
    isNewListing: false,
    images: [
      "https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+1",
      "https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+2",
    ],
    agentName: "Leo Wong",
    agentPhone: "+2348098765432",
    agentImage: "https://placehold.co/60x60/212121/ffffff?text=LW",
    propertyType: "Apartment",
    amenities: ["WiFi"],
    datePosted: new Date("2025-07-08T15:00:00Z"),
    description:
      "A practical and compact one-bedroom flat, perfectly suited for students or single occupants in the bustling Student District. This unit offers a comfortable living space with a separate bedroom, a small kitchen, and a private bathroom. WiFi is available, ensuring connectivity for studies and leisure. Conveniently located near university facilities and local amenities.",
    petPolicy: "No Pets",
    furnishingStatus: "Unfurnished",
    leaseTerm: "Monthly",
    buildingAmenities: [],
    propertyFeatures: [],
    proximity: ["Near Schools", "Near Public Transport"],
    accessibilityFeatures: ["Elevator Access"],
    virtualTourUrl: "",
    videoTourUrl: "",
  },
};
export default function SingleApartment() {
  const { id } = useParams();
  const apartment = apartments[id];
  if (!apartment) return null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contact, setContact] = useState();
  const [copy, setCopy] = useState();
  const apartmentUrl = `http://localhost:3000/apt/${apartment.id}`;
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? apartment.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === apartment.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const [isBookmarked, setIsBookmarked] = useState(
    checkIsBookmarked(apartment.id)
  );

  const handleBookmarkToggle = () => {
    // 2. Call the utility function to update localStorage
    saveBookmark(apartment.id);

    // 3. Immediately update the component's state to re-render the icon
    setIsBookmarked((prev) => !prev);

    // NOTE: This assumes saveBookmark reliably updates localStorage,
    // and the toggle logic in saveBookmark is correct.
  };
  return (
    <div className="apartment-page">
      <header className="apartment-header">
        <div className="apartment-header-inner">
          <a href="/discover">
            <i className="fas fa-arrow-left"></i>
          </a>
          <h1>{apartment.name}</h1>
        </div>
      </header>
      {/* Custom Image Slider */}
      <div className="apartment-image-slider">
        <img
          src={apartment.images[currentImageIndex]}
          alt={`${apartment.name} - Image ${currentImageIndex + 1}`}
          className="apartment-details-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/FF0000/FFFFFF?text=IMAGE+LOAD+FAILED"; // More distinct fallback
          }}
        />
        {apartment.images.length > 1 && (
          <>
            <button
              className="slider-arrow left-arrow"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              &lt;
            </button>
            <button
              className="slider-arrow right-arrow"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              &gt;
            </button>
            <div className="slider-dots">
              {apartment.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                ></span>
              ))}
            </div>
          </>
        )}
        {/* Bookmark and Share Icons */}
        <div className="apartment-action-icons">
          <button
            // 4. Use the state variable (isBookmarked) to conditionally apply the class
            className={`icon-button ${isBookmarked ? "bookmarked" : ""}`}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark apartment"}
            onClick={handleBookmarkToggle}
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              // 5. Use the state variable to change the SVG fill color
              fill="currentColor"
            >
              <path d="M17 3H7C5.89543 3 5 3.89543 5 5V21L12 18L19 21V5C19 3.89543 18.1046 3 17 3Z" />
            </svg>
          </button>
          <button
            className="icon-button"
            aria-label="Share apartment"
            onClick={() => setCopy(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L16.04 7.15C16.56 7.62 17.24 7.92 18 7.92C19.66 7.92 21 6.58 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L7.96 9.85C7.44 9.38 6.76 9.08 6 9.08C4.34 9.08 3 10.42 3 12C3 13.58 4.34 14.92 6 14.92C6.76 14.92 7.44 14.62 7.96 14.15L15.09 18.3C15.04 18.53 15 18.76 15 19C15 20.66 16.34 22 18 22C19.66 22 21 20.66 21 19C21 17.34 19.66 16.08 18 16.08Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="apartment-details-info">
        <h3 id="apartment-details-title" className="apartment-details-title">
          {apartment.name}
        </h3>
        <p className="apartment-details-location">{apartment.location}</p>
        <div className="apartment-details-specs">
          <span>🛏️ {apartment.bedrooms} Bed</span>
          <span>🛁 {apartment.bathrooms} Bath</span>
        </div>
        <p className="apartment-details-price">
          ₦{apartment.price.toLocaleString()}/month
        </p>
        <p className="apartment-details-description">{apartment.description}</p>

        {/* New Advanced Details */}
        <div className="advanced-details-grid">
          <div className="advanced-details-grid-inner">
            {apartment.petPolicy && (
              <div className="detail-item">
                <strong>Pet Policy:</strong> {apartment.petPolicy}
              </div>
            )}
            {apartment.furnishingStatus && (
              <div className="detail-item">
                <strong>Furnishing:</strong> {apartment.furnishingStatus}
              </div>
            )}
            {apartment.leaseTerm && (
              <div className="detail-item">
                <strong>Lease Term:</strong> {apartment.leaseTerm}
              </div>
            )}
          </div>
        </div>

        {/* Amenities List */}
        {(apartment.amenities && apartment.amenities.length > 0) ||
        (apartment.buildingAmenities &&
          apartment.buildingAmenities.length > 0) ? (
          <div className="apartment-amenities">
            <div className="apartment-amenities-inner">
              <h4>Amenities:</h4>
              <ul>
                {apartment.amenities &&
                  apartment.amenities.map((amenity, index) => (
                    <li key={`gen-amenity-${index}`}>
                      <svg
                        className="amenity-check-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {amenity}
                    </li>
                  ))}
                {apartment.buildingAmenities &&
                  apartment.buildingAmenities.map((amenity, index) => (
                    <li key={`bldg-amenity-${index}`}>
                      <svg
                        className="amenity-check-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {amenity} (Building)
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : null}

        {/* Property Features List */}
        {apartment.propertyFeatures &&
          apartment.propertyFeatures.length > 0 && (
            <div className="apartment-features">
              <div className="apartment-features-inner">
                <h4>Property Features:</h4>
                <ul>
                  {apartment.propertyFeatures.map((feature, index) => (
                    <li key={`prop-feature-${index}`}>
                      <svg
                        className="amenity-check-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        {/* Proximity & Accessibility */}
        {(apartment.proximity && apartment.proximity.length > 0) ||
        (apartment.accessibilityFeatures &&
          apartment.accessibilityFeatures.length > 0) ? (
          <div className="apartment-additional-info">
            <div className="apartment-additional-info-inner">
              {apartment.proximity && apartment.proximity.length > 0 && (
                <div>
                  <h4>Proximity:</h4>
                  <ul>
                    {apartment.proximity.map((item, index) => (
                      <li key={`proximity-${index}`}>🗺️ {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {apartment.accessibilityFeatures &&
                apartment.accessibilityFeatures.length > 0 && (
                  <div>
                    <h4>Accessibility:</h4>
                    <ul>
                      {apartment.accessibilityFeatures.map((item, index) => (
                        <li key={`access-${index}`}>♿ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        ) : null}

        {/* Virtual Tours/Video Walkthroughs */}
        {(apartment.virtualTourUrl || apartment.videoTourUrl) && (
          <div className="tour-buttons">
            {apartment.virtualTourUrl && (
              <a
                href={apartment.virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tour-button"
              >
                View 3D Virtual Tour
              </a>
            )}
            {apartment.videoTourUrl && (
              <a
                href={apartment.videoTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tour-button"
              >
                Watch Video Walkthrough
              </a>
            )}
          </div>
        )}

        {/* Contact & Apply Buttons */}
        <div className="action-buttons-group">
          <button
            className="apartment-details-contact-button"
            onClick={() => setContact(true)}
          >
            Contact Agent
          </button>
          <button className="apartment-details-apply-button">Apply Now</button>
        </div>

        {/* Reviews Section (Conceptual) */}
        <div className="reviews-section">
          <h4>Reviews & Ratings (Conceptual)</h4>
          <p className="reviews-placeholder">
            This section will display user reviews and ratings for this
            property. You can leave your own review after a viewing or stay.
          </p>
          <button className="leave-review-button">Leave a Review</button>
        </div>

        {/* Similar Apartments (Conceptual) */}
        <div className="similar-apartments-section">
          <h4>Similar Apartments (Conceptual)</h4>
          <p className="similar-apartments-placeholder">
            Based on your preferences and this listing, here are some other
            apartments you might like.
          </p>
          {/* In a real app, this would be a carousel or grid of similar apartment cards */}
          <div className="similar-apartments-grid"></div>
          <p className="similar-apartments-note">
            This feature uses a recommendation engine to suggest relevant
            listings.
          </p>
        </div>
      </div>
      {contact && (
        <ContactAgentModal
          setContact={setContact}
          agentImage={apartment.agentImage}
          agentName={apartment.agentName}
          agentPhone={apartment.agentPhone}
          apartmentName={apartment.name}
        />
      )}
      {copy && (
        <ShareModal
          setCopy={setCopy}
          apartmentName={apartment.name}
          apartmentUrl={apartmentUrl}
        />
      )}
    </div>
  );
}
