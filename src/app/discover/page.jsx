"use client";
// pages/discover.js
import { useEffect, useState, useCallback, useRef } from "react";
// Removed Swiper imports to resolve compilation errors
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';

// --- Utility Function to Simulate API Call ---
async function fetchApartments() {
  // Simulate network delay for a more realistic experience
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy apartment data with more details
  return [
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
  ];
}

// --- MapView Component (Placeholder) ---
const MapView = ({ onBackToListings }) => {
  return (
    <div className="map-view-container">
      <button className="map-view-back-button" onClick={onBackToListings}>
        &larr; Back to Listings
      </button>
      <h3 className="map-view-title">Interactive Map View (Conceptual)</h3>
      <p className="map-view-description">
        This section will feature an advanced interactive map with capabilities
        like:
      </p>
      <ul className="map-features-list">
        <li>
          <span className="map-feature-icon">✏️</span> **Drawing Tool:** Define
          custom search areas on the map.
        </li>
        <li>
          <span className="map-feature-icon">📍</span> **Points of Interest
          (POI):** Display nearby schools, hospitals, parks, and public
          transport.
        </li>
        <li>
          <span className="map-feature-icon">🔥</span> **Heatmap:** Visualize
          areas with high apartment density or average prices.
        </li>
      </ul>
      <img
        src="https://placehold.co/800x600/E0E7EB/333333?text=Interactive+Map+Placeholder"
        alt="Placeholder Map"
        className="map-placeholder-image"
      />
      <p className="map-view-note">
        Full map integration requires a dedicated map library and significant
        development. This is a conceptual view.
      </p>
    </div>
  );
};

// --- LoginModal Component (Simulated) ---
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isLogin) {
      if (email === "user@example.com" && password === "password123") {
        setSuccess("Login successful!");
        onLoginSuccess({ name: "John Doe", email: "user@example.com" });
        setTimeout(onClose, 1500);
      } else {
        setError("Invalid email or password.");
      }
    } else {
      // Signup
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
      } else if (!name || !email || !password) {
        setError("Please fill in all fields.");
      } else {
        setSuccess("Signup successful! Please log in.");
        setIsLogin(true); // Switch to login tab after successful signup
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="login-modal-overlay show"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h3 id="login-modal-title">{isLogin ? "Login" : "Sign Up"}</h3>
          <button
            className="login-modal-close-button"
            onClick={onClose}
            aria-label="Close login/signup form"
          >
            &#x2715;
          </button>
        </div>
        <div className="login-tabs">
          <button
            className={`login-tab-button ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`login-tab-button ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="signupName">Name:</label>
              <input
                type="text"
                id="signupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="loginEmail">{isLogin ? "Email:" : "Email:"}</label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}
          {error && <p className="login-error-message">{error}</p>}
          {success && <p className="login-success-message">{success}</p>}
          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- CompareModal Component (Conceptual) ---
const CompareModal = ({ apartments, onClose }) => {
  if (apartments.length === 0) {
    return (
      <div className="compare-modal-overlay show" onClick={onClose}>
        <div
          className="compare-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="compare-modal-header">
            <h3 id="compare-modal-title">Compare Apartments</h3>
            <button className="compare-modal-close-button" onClick={onClose}>
              &#x2715;
            </button>
          </div>
          <p className="empty-state">Select up to 3 apartments to compare.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="compare-modal-overlay show"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        className="compare-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="compare-modal-header">
          <h3 id="compare-modal-title">
            Compare Apartments ({apartments.length} selected)
          </h3>
          <button
            className="compare-modal-close-button"
            onClick={onClose}
            aria-label="Close comparison view"
          >
            &#x2715;
          </button>
        </div>
        <div className="compare-grid">
          {apartments.map((apt) => (
            <div key={apt.id} className="compare-card">
              <img
                src={apt.images[0]}
                alt={apt.name}
                className="compare-image"
              />
              <h4 className="compare-card-title">{apt.name}</h4>
              <p className="compare-card-price">
                ₦{apt.price.toLocaleString()}/month
              </p>
              <ul className="compare-features-list">
                <li>🛏️ {apt.bedrooms} Bed</li>
                <li>🛁 {apt.bathrooms} Bath</li>
                {apt.petPolicy && <li>🐾 Pet Policy: {apt.petPolicy}</li>}
                {apt.furnishingStatus && (
                  <li>🛋️ Furnishing: {apt.furnishingStatus}</li>
                )}
                {apt.leaseTerm && <li>🗓️ Lease Term: {apt.leaseTerm}</li>}
                {apt.buildingAmenities && apt.buildingAmenities.length > 0 && (
                  <li>🏢 Bldg Amenities: {apt.buildingAmenities.join(", ")}</li>
                )}
                {apt.propertyFeatures && apt.propertyFeatures.length > 0 && (
                  <li>🏡 Features: {apt.propertyFeatures.join(", ")}</li>
                )}
                {apt.proximity && apt.proximity.length > 0 && (
                  <li>🗺️ Proximity: {apt.proximity.join(", ")}</li>
                )}
                {apt.accessibilityFeatures &&
                  apt.accessibilityFeatures.length > 0 && (
                    <li>
                      ♿ Accessibility: {apt.accessibilityFeatures.join(", ")}
                    </li>
                  )}
                {/* Add more features here */}
              </ul>
            </div>
          ))}
        </div>
        <p className="compare-note">
          This is a conceptual comparison tool. Full implementation would allow
          more detailed side-by-side analysis.
        </p>
      </div>
    </div>
  );
};

// --- RentalApplicationModal Component (Conceptual) ---
const RentalApplicationModal = ({ apartmentName, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      // In a real app, you'd handle form data and document uploads here
      setSubmitSuccess(true);
      console.log(`Application submitted for ${apartmentName}`);
      setTimeout(onClose, 2500); // Close after success message
    } catch (error) {
      setSubmitError("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="application-modal-overlay show"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div
        className="application-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="application-modal-header">
          <h3 id="application-modal-title">Apply for {apartmentName}</h3>
          <button
            className="application-modal-close-button"
            onClick={onClose}
            aria-label="Close application form"
          >
            &#x2715;
          </button>
        </div>
        {submitSuccess ? (
          <div className="application-success-message">
            <p>🎉 Your application has been submitted successfully!</p>
            <p>We will review it and get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <p className="application-intro">
              Please fill out the form below to submit your rental application.
              You can also upload required documents.
            </p>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Email:</label>
              <input
                type="email"
                id="contactEmail"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number:</label>
              <input
                type="tel"
                id="contactPhone"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="incomeProof">
                Proof of Income (e.g., Pay Stubs, Bank Statement):
              </label>
              <input
                type="file"
                id="incomeProof"
                className="form-input-file"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p className="file-instruction">
                Max file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, PNG.
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="idProof">
                Government ID (e.g., Passport, Driver's License):
              </label>
              <input
                type="file"
                id="idProof"
                className="form-input-file"
                accept=".pdf,.jpg,.png"
              />
              <p className="file-instruction">
                Max file size: 5MB. Supported formats: PDF, JPG, PNG.
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="references">References (Optional):</label>
              <textarea
                id="references"
                rows="3"
                className="form-textarea"
                placeholder="Provide names and contact info for references..."
              ></textarea>
            </div>
            {submitError && (
              <p className="application-error-message">{submitError}</p>
            )}
            <button
              type="submit"
              className="application-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <p className="application-note">
              Note: This is a conceptual application form. In a real
              application, data would be securely processed.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// --- LoginModal Component (Simulated) ---
// (Already defined above, keeping it here for completeness if it was separate)

// --- DiscoverPage Component ---
export default function DiscoverPage() {
  const [allApartments, setAllApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(80000);
  const [maxPrice, setMaxPrice] = useState(800000);
  const [bedroomsFilter, setBedroomsFilter] = useState("any");
  const [bathroomsFilter, setBathroomsFilter] = useState("any");
  const [isNewListingFilter, setIsNewListingFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState("any");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("any");
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [sortBy, setSortBy] = useState("name_asc");

  // New Advanced Filter States
  const [petPolicyFilter, setPetPolicyFilter] = useState("any");
  const [furnishingStatusFilter, setFurnishingStatusFilter] = useState("any");
  const [leaseTermFilter, setLeaseTermFilter] = useState("any");
  const [buildingAmenitiesFilter, setBuildingAmenitiesFilter] = useState([]);
  const [propertyFeaturesFilter, setPropertyFeaturesFilter] = useState([]);
  const [proximityFilter, setProximityFilter] = useState("any");
  const [accessibilityFeaturesFilter, setAccessibilityFeaturesFilter] =
    useState([]);

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [theme, setTheme] = useState("light");

  // Apartment Details Modal/Page States
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [currentPage, setCurrentPage] = useState("list"); // 'list', 'details', 'map', 'bookmarks', 'saved-searches', 'profile', 'dashboard', 'compare'
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [bookmarkedApartments, setBookmarkedApartments] = useState([]);

  // New Compare Feature State
  const [apartmentsToCompare, setApartmentsToCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // New Application Management State
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // User Status State (simulated)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userStatus, setUserStatus] = useState("Guest");
  const [userAvatar, setUserAvatar] = useState(
    "https://placehold.co/40x40/cccccc/ffffff?text=U"
  );
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john.doe@example.com");
  const [userPhone, setuserPhone] = useState("+2348012345678");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Price Slider specific states and refs
  const priceRangeRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [minPriceSlider, setMinPriceSlider] = useState(80000);
  const [maxPriceSlider, setMaxPriceSlider] = useState(800000);
  const [actualMinPriceRange, setActualMinPriceRange] = useState(80000);
  const [actualMaxPriceRange, setActualMaxPriceRange] = useState(800000);

  // Debounce for price slider updates to avoid excessive re-renders during drag
  const debounceTimeoutRef = useRef(null);
  const handlePriceChange = useCallback(([newMin, newMax]) => {
    setMinPriceSlider(newMin);
    setMaxPriceSlider(newMax);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setMinPrice(newMin);
      setMaxPrice(newMax);
    }, 200);
  }, []);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookmarks = localStorage.getItem("lodgerBookmarks");
      if (storedBookmarks) {
        setBookmarkedApartments(JSON.parse(storedBookmarks));
      }
      const storedUser = localStorage.getItem("lodgerLoggedInUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);
        setIsLoggedIn(true);
        setUserStatus(user.name);
        setUserAvatar(
          `https://placehold.co/40x40/${Math.floor(
            Math.random() * 16777215
          ).toString(16)}/ffffff?text=${user.name.charAt(0).toUpperCase()}`
        );
        setUserName(user.name);
        setUserEmail(user.email);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "lodgerBookmarks",
        JSON.stringify(bookmarkedApartments)
      );
    }
  }, [bookmarkedApartments]);

  // Toggle bookmark for an apartment
  const toggleBookmark = useCallback((apartmentId) => {
    setBookmarkedApartments((prevBookmarks) => {
      if (prevBookmarks.includes(apartmentId)) {
        return prevBookmarks.filter((id) => id !== apartmentId);
      } else {
        return [...prevBookmarks, apartmentId];
      }
    });
  }, []);

  // Toggle apartment for comparison
  const toggleCompare = useCallback((apartment) => {
    setApartmentsToCompare((prevCompare) => {
      if (prevCompare.some((apt) => apt.id === apartment.id)) {
        return prevCompare.filter((apt) => apt.id !== apartment.id);
      } else {
        if (prevCompare.length < 3) {
          // Limit comparison to 3 apartments
          return [...prevCompare, apartment];
        } else {
          // Optionally, show a message that max limit is reached
          console.log("Maximum 3 apartments can be compared.");
          return prevCompare;
        }
      }
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef]);

  // Effect to apply theme class to body
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Updated responsive breakpoints
  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth > 640 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  useEffect(() => {
    const getApartments = async () => {
      try {
        const data = await fetchApartments();
        setAllApartments(data);
        const prices = data.map((apt) => apt.price);
        const dynamicMinPrice = Math.min(...prices);
        const dynamicMaxPrice = Math.max(...prices);

        // Set the actual min/max prices for the slider bounds
        setActualMinPriceRange(dynamicMinPrice);
        setActualMaxPriceRange(dynamicMaxPrice);

        // Set initial filter values to the dynamic range
        setMinPrice(dynamicMinPrice);
        setMaxPrice(dynamicMaxPrice);
        setMinPriceSlider(dynamicMinPrice);
        setMaxPriceSlider(dynamicMaxPrice);

        applyFiltersAndSort(data, dynamicMinPrice, dynamicMaxPrice);
      } catch (err) {
        setError("Failed to load apartments. Please try again later.");
        console.error("Error fetching apartments:", err);
      } finally {
        setLoading(false);
      }
    };
    getApartments();
  }, []);

  // Memoized function for applying filters and sorting
  const applyFiltersAndSort = useCallback(
    (
      apartmentsToFilter = allApartments,
      currentMinPrice = minPrice,
      currentMaxPrice = maxPrice
    ) => {
      let updatedApartments = [...apartmentsToFilter];

      // If on bookmarks page, filter by bookmarked apartments first
      if (currentPage === "bookmarks") {
        updatedApartments = updatedApartments.filter((apt) =>
          bookmarkedApartments.includes(apt.id)
        );
        // No further filters (search, price, etc.) applied on bookmarks page for simplicity
        // If needed, add them here:
        // if (searchTerm) { ... }
        // if (currentMinPrice !== actualMinPriceRange || currentMaxPrice !== actualMaxPriceRange) { ... }
      } else {
        // Apply Search Term Filter only on 'list' page
        if (searchTerm) {
          updatedApartments = updatedApartments.filter(
            (apt) =>
              apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              apt.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply Price Filter using the currentMinPrice and currentMaxPrice only on 'list' page
        updatedApartments = updatedApartments.filter(
          (apt) => apt.price >= currentMinPrice && apt.price <= currentMaxPrice
        );

        // Apply Bedrooms Filter
        if (bedroomsFilter !== "any") {
          updatedApartments = updatedApartments.filter((apt) => {
            if (bedroomsFilter === "3+") {
              return apt.bedrooms >= 3;
            } else if (bedroomsFilter === "4+") {
              return apt.bedrooms >= 4;
            } else if (bedroomsFilter === "5+") {
              return apt.bedrooms >= 5;
            }
            return apt.bedrooms === parseInt(bedroomsFilter, 10);
          });
        }

        // Apply Bathrooms Filter
        if (bathroomsFilter !== "any") {
          updatedApartments = updatedApartments.filter((apt) => {
            if (bathroomsFilter === "2+") {
              return apt.bathrooms >= 2;
            } else if (bathroomsFilter === "3+") {
              return apt.bathrooms >= 3;
            }
            return apt.bathrooms === parseInt(bathroomsFilter, 10);
          });
        }

        // Apply New Listing Filter
        if (isNewListingFilter) {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.isNewListing
          );
        }

        // Apply Location Filter
        if (locationFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.location === locationFilter
          );
        }

        // Apply Property Type Filter
        if (propertyTypeFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.propertyType === propertyTypeFilter
          );
        }

        // Apply Amenities Filter (General)
        if (amenitiesFilter.length > 0) {
          updatedApartments = updatedApartments.filter((apt) =>
            amenitiesFilter.every(
              (amenity) => apt.amenities && apt.amenities.includes(amenity)
            )
          );
        }

        // Apply Date Posted Filter
        if (datePostedFilter !== "any") {
          const now = new Date();
          updatedApartments = updatedApartments.filter((apt) => {
            const postedDate = new Date(apt.datePosted);
            const diffTime = Math.abs(now.getTime() - postedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

            if (datePostedFilter === "24h") {
              return diffDays <= 1;
            } else if (datePostedFilter === "7d") {
              return diffDays <= 7;
            } else if (datePostedFilter === "30d") {
              return diffDays <= 30;
            }
            return true;
          });
        }

        // --- New Advanced Filters ---
        if (petPolicyFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.petPolicy === petPolicyFilter
          );
        }
        if (furnishingStatusFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.furnishingStatus === furnishingStatusFilter
          );
        }
        if (leaseTermFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.leaseTerm === leaseTermFilter
          );
        }
        if (buildingAmenitiesFilter.length > 0) {
          updatedApartments = updatedApartments.filter((apt) =>
            buildingAmenitiesFilter.every(
              (amenity) =>
                apt.buildingAmenities && apt.buildingAmenities.includes(amenity)
            )
          );
        }
        if (propertyFeaturesFilter.length > 0) {
          updatedApartments = updatedApartments.filter((apt) =>
            propertyFeaturesFilter.every(
              (feature) =>
                apt.propertyFeatures && apt.propertyFeatures.includes(feature)
            )
          );
        }
        if (proximityFilter !== "any") {
          updatedApartments = updatedApartments.filter(
            (apt) => apt.proximity && apt.proximity.includes(proximityFilter)
          );
        }
        if (accessibilityFeaturesFilter.length > 0) {
          updatedApartments = updatedApartments.filter((apt) =>
            accessibilityFeaturesFilter.every(
              (feature) =>
                apt.accessibilityFeatures &&
                apt.accessibilityFeatures.includes(feature)
            )
          );
        }
      }

      // Apply Sorting
      updatedApartments.sort((a, b) => {
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "name_desc") {
          return b.name.localeCompare(a.name);
        } else if (sortBy === "price_asc") {
          return a.price - b.price;
        } else if (sortBy === "price_desc") {
          return b.price - a.price;
        } else if (sortBy === "location_asc") {
          return a.location.localeCompare(b.location);
        } else if (sortBy === "location_desc") {
          return b.location.localeCompare(a.location);
        } else if (sortBy === "date_desc") {
          // New sort by date posted (newest first)
          return (
            new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
          );
        } else if (sortBy === "date_asc") {
          // New sort by date posted (oldest first)
          return (
            new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
          );
        }
        return 0; // No specific sort
      });

      setFilteredApartments(updatedApartments);
    },
    [
      allApartments,
      searchTerm,
      minPrice,
      maxPrice,
      bedroomsFilter,
      bathroomsFilter,
      isNewListingFilter,
      locationFilter,
      propertyTypeFilter,
      amenitiesFilter,
      datePostedFilter,
      bookmarkedApartments,
      currentPage,
      petPolicyFilter,
      furnishingStatusFilter,
      leaseTermFilter,
      buildingAmenitiesFilter,
      propertyFeaturesFilter,
      proximityFilter,
      accessibilityFeaturesFilter,
      sortBy,
    ]
  );

  // Effect to re-apply filters and sort when filter/sort states change
  useEffect(() => {
    applyFiltersAndSort();
  }, [
    applyFiltersAndSort,
    searchTerm,
    minPrice,
    maxPrice,
    bedroomsFilter,
    bathroomsFilter,
    isNewListingFilter,
    locationFilter,
    propertyTypeFilter,
    amenitiesFilter,
    datePostedFilter,
    sortBy,
    bookmarkedApartments,
    currentPage,
    petPolicyFilter,
    furnishingStatusFilter,
    leaseTermFilter,
    buildingAmenitiesFilter,
    propertyFeaturesFilter,
    proximityFilter,
    accessibilityFeaturesFilter,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice(actualMinPriceRange); // Use actual min/max for clear
    setMaxPrice(actualMaxPriceRange); // Use actual min/max for clear
    setMinPriceSlider(actualMinPriceRange);
    setMaxPriceSlider(actualMaxPriceRange);
    setBedroomsFilter("any");
    setBathroomsFilter("any");
    setIsNewListingFilter(false);
    setLocationFilter("any");
    setPropertyTypeFilter("any");
    setAmenitiesFilter([]);
    setDatePostedFilter("any");
    setSortBy("name_asc");
    // Clear new advanced filters
    setPetPolicyFilter("any");
    setFurnishingStatusFilter("any");
    setLeaseTermFilter("any");
    setBuildingAmenitiesFilter([]);
    setPropertyFeaturesFilter([]);
    setProximityFilter("any");
    setAccessibilityFeaturesFilter([]);
  };

  const uniqueLocations = Array.from(
    new Set(allApartments.map((apt) => apt.location))
  );
  const uniquePropertyTypes = Array.from(
    new Set(allApartments.map((apt) => apt.propertyType))
  );
  const availableAmenities = [
    "WiFi",
    "Parking",
    "Gym",
    "Pool",
    "Garden",
    "Security",
    "Pet-Friendly",
  ]; // General amenities
  const availableBuildingAmenities = [
    "24/7 Electricity",
    "Borehole Water",
    "Generator",
    "Elevator",
    "Security Cameras",
    "Concierge Service",
  ];
  const availablePropertyFeatures = [
    "Balcony",
    "Ensuite Bathroom",
    "Walk-in Closet",
    "Study Room",
    "Maid's Room",
  ];
  const availableProximityOptions = [
    "Near Schools",
    "Near Hospitals",
    "Near Public Transport",
    "Near Markets/Supermarkets",
  ];
  const availableAccessibilityFeatures = [
    "Wheelchair Accessible",
    "Ground Floor",
    "Elevator Access",
  ];

  const handleAmenityChange = (amenity) => {
    setAmenitiesFilter((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };
  const handleBuildingAmenityChange = (amenity) => {
    setBuildingAmenitiesFilter((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };
  const handlePropertyFeatureChange = (feature) => {
    setPropertyFeaturesFilter((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };
  const handleAccessibilityFeatureChange = (feature) => {
    setAccessibilityFeaturesFilter((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  // Price slider logic (reverted to custom implementation)
  const getPercentage = (value) => {
    return (
      ((value - actualMinPriceRange) /
        (actualMaxPriceRange - actualMinPriceRange)) *
      100
    );
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialMin = minPriceSlider;
    const initialMax = maxPriceSlider;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const trackWidth = priceRangeRef.current
        ? priceRangeRef.current.offsetWidth
        : 1;
      const pricePerPixel =
        (actualMaxPriceRange - actualMinPriceRange) / trackWidth; // Use actual dynamic range

      if (type === "min") {
        let newMin = initialMin + deltaX * pricePerPixel;
        newMin = Math.round(
          Math.max(
            actualMinPriceRange,
            Math.min(newMin, maxPriceSlider - 10000)
          )
        ); // Use actual dynamic range
        handlePriceChange([newMin, maxPriceSlider]);
      } else {
        // type === 'max'
        let newMax = initialMax + deltaX * pricePerPixel;
        newMax = Math.round(
          Math.min(
            actualMaxPriceRange,
            Math.max(newMax, minPriceSlider + 10000)
          )
        ); // Use actual dynamic range
        handlePriceChange([minPriceSlider, newMax]);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Share Modal Component
  const ShareModal = ({ apartmentUrl, apartmentName, onClose }) => {
    const [copySuccess, setCopySuccess] = useState("");

    const handleCopyLink = () => {
      const el = document.createElement("textarea");
      el.value = apartmentUrl;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopySuccess("Link copied!");
      } catch (err) {
        setCopySuccess("Failed to copy link.");
        console.error("Failed to copy: ", err);
      }
      document.body.removeChild(el);
      setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
    };

    const shareOptions = [
      {
        name: "Copy Link",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
          </svg>
        ),
        onClick: handleCopyLink,
      },
      {
        name: "WhatsApp",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.51 2 2 6.51 2 12.04C2 14.11 2.69 16.03 3.85 17.58L2.01 22L6.64 20.59C8.07 21.43 9.9 22 12.04 22C17.57 22 22.08 17.49 22.08 12.04C22.08 6.51 17.57 2 12.04 2ZM17.28 16.48C17.04 16.92 16.14 17.42 15.65 17.5C15.16 17.58 14.49 17.62 11.72 16.48C8.95 15.34 7.21 12.98 7.04 12.72C6.87 12.46 6.19 11.56 6.19 10.74C6.19 9.92 6.77 9.68 7.04 9.42C7.31 9.16 7.6 9.07 7.78 8.89C7.96 8.71 8.04 8.62 8.13 8.44C8.21 8.26 8.13 8.17 8.04 7.99C7.96 7.81 7.31 6.26 7.04 5.61C6.77 4.96 6.51 5.04 6.24 5.04C5.97 5.04 5.61 5.04 5.34 5.04C5.07 5.04 4.62 5.13 4.26 5.5C3.9 5.86 2.99 6.76 2.99 8.5C2.99 10.24 4.26 11.98 4.44 12.25C4.62 12.52 6.87 15.86 10.04 17.21C12.55 18.3 12.91 18.17 13.59 18.17C14.27 18.17 14.73 18.08 15.18 17.81C15.63 17.54 16.62 16.92 16.98 16.48C17.34 16.04 17.42 15.86 17.5 15.77C17.58 15.69 17.58 15.51 17.28 16.48Z" />
          </svg>
        ),
        href: `whatsapp://send?text=Check out this apartment: ${apartmentName} - ${encodeURIComponent(
          apartmentUrl
        )}`,
      },
      {
        name: "Email",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
          </svg>
        ),
        href: `mailto:?subject=Check out this apartment!&body=I found this apartment on Lodger and thought you might like it: ${apartmentName} - ${encodeURIComponent(
          apartmentUrl
        )}`,
      },
      {
        name: "Twitter",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.51 7.6 3.68 5.14c-.36.62-.56 1.35-.56 2.13 0 1.49.75 2.81 1.91 3.56-.7-.02-1.36-.21-1.93-.53v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.71 2.14 2.95 4.03 2.98-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C3.17 20.37 5.56 21 8 21c8.49 0 13.13-7.01 13.13-13.13 0-.2-.01-.4-.02-.6.9-.65 1.68-1.47 2.3-2.4z" />
          </svg>
        ),
        href: `https://twitter.com/intent/tweet?text=Check out this apartment: ${apartmentName}&url=${encodeURIComponent(
          apartmentUrl
        )}`,
      },
    ];

    return (
      <div
        className="share-modal-overlay show"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div
          className="share-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="share-modal-header">
            <h3 id="share-modal-title">Share Apartment</h3>
            <button
              className="share-modal-close-button"
              onClick={onClose}
              aria-label="Close share options"
            >
              &#x2715;
            </button>
          </div>
          <div className="share-options-grid">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="share-option-item"
                onClick={option.onClick || (() => {})}
              >
                <div className="share-option-icon">{option.icon}</div>
                <span>{option.name}</span>
              </a>
            ))}
          </div>
          {copySuccess && <p className="copy-success-message">{copySuccess}</p>}
        </div>
      </div>
    );
  };

  // Apartment Details Page/Modal Component
  const ApartmentDetailsView = ({
    apartment,
    onClose,
    onBackToListings,
    isMobileView,
    onContactAgentClick,
    onToggleBookmark,
    isBookmarked,
    onApplyNowClick,
  }) => {
    if (!apartment) return null;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    // Construct a dummy URL for the apartment (in a real app, this would be a real URL)
    const apartmentShareUrl = `${window.location.origin}/apartments/${apartment.id}`;

    return (
      <div
        className={
          isMobileView
            ? "apartment-details-page-overlay"
            : "apartment-details-modal-overlay show"
        }
        onClick={isMobileView ? undefined : onClose} // Only close modal on overlay click
        role="dialog"
        aria-modal="true"
        aria-labelledby="apartment-details-title"
      >
        <div
          className={
            isMobileView
              ? "apartment-details-page-content"
              : "apartment-details-modal-content"
          }
          onClick={(e) => e.stopPropagation()}
        >
          {isMobileView ? (
            <button
              className="apartment-details-back-button"
              onClick={onBackToListings}
              aria-label="Back to listings"
            >
              &larr; Back to Listings
            </button>
          ) : (
            <button
              className="apartment-details-close-button"
              onClick={onClose}
              aria-label="Close apartment details"
            >
              &#x2715;
            </button>
          )}

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
                className={`icon-button ${isBookmarked ? "bookmarked" : ""}`}
                aria-label="Bookmark apartment"
                onClick={() => onToggleBookmark(apartment.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "var(--primary-color)" : "currentColor"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 3H7C5.89543 3 5 3.89543 5 5V21L12 18L19 21V5C19 3.89543 18.1046 3 17 3Z" />
                </svg>
              </button>
              <button
                className="icon-button"
                aria-label="Share apartment"
                onClick={() => setShowShareModal(true)}
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
            <h3
              id="apartment-details-title"
              className="apartment-details-title"
            >
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
            <p className="apartment-details-description">
              {apartment.description}
            </p>

            {/* New Advanced Details */}
            <div className="advanced-details-grid">
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

            {/* Amenities List */}
            {(apartment.amenities && apartment.amenities.length > 0) ||
            (apartment.buildingAmenities &&
              apartment.buildingAmenities.length > 0) ? (
              <div className="apartment-amenities">
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
            ) : null}

            {/* Property Features List */}
            {apartment.propertyFeatures &&
              apartment.propertyFeatures.length > 0 && (
                <div className="apartment-features">
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
              )}

            {/* Proximity & Accessibility */}
            {(apartment.proximity && apartment.proximity.length > 0) ||
            (apartment.accessibilityFeatures &&
              apartment.accessibilityFeatures.length > 0) ? (
              <div className="apartment-additional-info">
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
                onClick={onContactAgentClick}
              >
                Contact Agent
              </button>
              <button
                className="apartment-details-apply-button"
                onClick={onApplyNowClick}
              >
                Apply Now
              </button>
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
              <div className="similar-apartments-grid">
                <div className="similar-card">
                  <img
                    src="https://placehold.co/150x100/F0F4F8/333333?text=Similar+Apt+1"
                    alt="Similar Apartment 1"
                  />
                  <p>Studio in Downtown</p>
                  <p>₦180,000/month</p>
                </div>
                <div className="similar-card">
                  <img
                    src="https://placehold.co/150x100/E8EEF2/333333?text=Similar+Apt+2"
                    alt="Similar Apartment 2"
                  />
                  <p>1 Bed near Park</p>
                  <p>₦220,000/month</p>
                </div>
              </div>
              <p className="similar-apartments-note">
                This feature uses a recommendation engine to suggest relevant
                listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New Contact Agent Modal Component
  const ContactAgentModal = ({
    apartmentName,
    onClose,
    userName,
    userEmail,
    userPhone,
    agentName,
    agentPhone,
    agentImage,
  }) => {
    const [name, setName] = useState(userName || "");
    const [email, setEmail] = useState(userEmail || "");
    const [phone, setPhone] = useState(userPhone || ""); // New phone state
    const [message, setMessage] = useState("");
    const [preferredDate, setPreferredDate] = useState(""); // New state for preferred date
    const [preferredTime, setPreferredTime] = useState(""); // New state for preferred time
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSending(true);
      setSendSuccess(false);
      setSendError(null);

      // Simulate sending message
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
        if (
          name &&
          email &&
          phone &&
          message &&
          preferredDate &&
          preferredTime
        ) {
          // Basic validation including phone, date, and time
          setSendSuccess(true);
          // In a real app, you'd send this data to a backend
          console.log("Message Sent:", {
            name,
            email,
            phone,
            message,
            apartmentName,
            agentName,
            agentPhone,
            preferredDate,
            preferredTime,
          });
          // Optionally clear form fields after success
          setName(userName || ""); // Reset to initial user data
          setEmail(userEmail || "");
          setPhone(userPhone || "");
          setMessage("");
          setPreferredDate("");
          setPreferredTime("");
        } else {
          throw new Error(
            "Please fill in all required fields (Name, Email, Phone, Message, Preferred Date, Preferred Time)."
          );
        }
      } catch (err) {
        setSendError(err.message || "Failed to send message.");
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div
        className="contact-modal-overlay show"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div
          className="contact-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="contact-modal-header">
            <h3 id="contact-modal-title">Contact Agent for {apartmentName}</h3>
            <button
              className="contact-modal-close-button"
              onClick={onClose}
              aria-label="Close contact form"
            >
              &#x2715;
            </button>
          </div>

          {/* Agent Information */}
          <div className="agent-info-section">
            <img
              src={agentImage}
              alt={agentName}
              className="agent-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/60x60/cccccc/ffffff?text=AG";
              }}
            />
            <div className="agent-details">
              <p className="agent-name">{agentName}</p>
              <p className="agent-phone">📞 {agentPhone}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-modal-form">
            <div className="form-group">
              <label htmlFor="contactName">Your Name:</label>
              <input
                type="text"
                id="contactName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Your Email:</label>
              <input
                type="email"
                id="contactEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Your Phone Number:</label>
              <input
                type="tel" // Use type="tel" for phone numbers
                id="contactPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="form-input"
              />
              <p className="phone-instruction">
                Please provide an active WhatsApp number.
              </p>
            </div>
            {/* New fields for Preferred Date and Time */}
            <div className="form-group">
              <label htmlFor="preferredDate">Preferred Viewing Date:</label>
              <input
                type="date"
                id="preferredDate"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="preferredTime">Preferred Viewing Time:</label>
              <input
                type="time"
                id="preferredTime"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactMessage">Message:</label>
              <textarea
                id="contactMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
                className="form-textarea"
              ></textarea>
            </div>
            {sendSuccess && (
              <p className="send-success-message">Message sent successfully!</p>
            )}
            {sendError && (
              <p className="send-error-message">Error: {sendError}</p>
            )}
            <button
              type="submit"
              className="send-message-button"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="main-content">
        <p className="loading-text">Loading apartments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  // Main render logic
  return (
    <>
        {/* Main Content Area */}
        <main className="main-content">
          {/* Filter and Search Controls */}
          <div className="controls-section">
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button
                className="filter-toggle-button"
                onClick={() => setShowFiltersModal(true)}
              >
                <svg
                  className="filter-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" />
                </svg>
              </button>
              <button
                className="map-view-button"
                onClick={() => setCurrentPage("map")}
              >
                <svg
                  className="map-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
                </svg>
                Map View
              </button>
              <button
                className="compare-button-main"
                onClick={() => setShowCompareModal(true)}
                disabled={apartmentsToCompare.length === 0}
              >
                <svg
                  className="compare-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H10V23H12V1H10V3ZM10 19H5V5H10V19ZM19 3H14V5H19V19H14V21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" />
                </svg>
                Compare ({apartmentsToCompare.length})
              </button>
              {/* Removed desktop-filters-container as it's now handled by the modal */}
            </div>
          </div>

          {filteredApartments.length === 0 && !loading && !error ? (
            <div className="empty-state">
              <p>No apartments match your current filter criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid">
              {filteredApartments.map((apartment, index) => (
                // Conditional rendering for click behavior based on screen size
                <div
                  key={apartment.id}
                  className="card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {apartment.isNewListing && (
                    <div className="new-listing-badge">✨ New Listing</div>
                  )}
                  <img
                    src={
                      apartment.images[0] ||
                      "https://placehold.co/400x280/CCCCCC/666666?text=Image+Not+Found"
                    } // Use first image or fallback
                    alt={apartment.name}
                    className="image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x280/FF0000/FFFFFF?text=IMAGE+LOAD+FAILED"; // More distinct fallback
                    }}
                  />
                  <div className="card-content">
                    <h2 className="card-title">{apartment.name}</h2>
                    <p className="card-location">{apartment.location}</p>
                    <div className="card-info-grid">
                      <span className="card-info-item">
                        <span className="icon">🛏️</span> {apartment.bedrooms}{" "}
                        Bed
                      </span>
                      <span className="card-info-item">
                        <span className="icon">🛁</span> {apartment.bathrooms}{" "}
                        Bath
                      </span>
                    </div>
                    <p className="card-price">
                      ₦{apartment.price.toLocaleString()}/month
                    </p>
                    <button
                      className="view-details-button"
                      onClick={() => {
                        setSelectedApartment(apartment);
                        setCurrentPage("details"); // Always set to details, then ApartmentDetailsView will decide modal/page
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className={`compare-card-button ${
                        apartmentsToCompare.some(
                          (apt) => apt.id === apartment.id
                        )
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleCompare(apartment)}
                      disabled={
                        apartmentsToCompare.length >= 3 &&
                        !apartmentsToCompare.some(
                          (apt) => apt.id === apartment.id
                        )
                      }
                    >
                      {apartmentsToCompare.some(
                        (apt) => apt.id === apartment.id
                      )
                        ? "Remove from Compare"
                        : "Add to Compare"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Filter Modal */}
        <div
          className={`filter-modal-overlay ${showFiltersModal ? "show" : ""}`}
          onClick={() => setShowFiltersModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
        >
          <div
            className={`filter-modal-content ${showFiltersModal ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-modal-header">
              <h3 id="filter-modal-title">Filter Options</h3>
              <button
                className="filter-modal-close-button"
                onClick={() => setShowFiltersModal(false)}
                aria-label="Close filter options"
              >
                &#x2715;
              </button>
            </div>
            <div className="filter-modal-body">
              {/* Location Filter */}
              <div className="filter-group">
                <label htmlFor="modalLocation" className="filter-label">
                  Location:
                </label>
                <select
                  id="modalLocation"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="filter-group">
                <label htmlFor="modalPropertyType" className="filter-label">
                  Property Type:
                </label>
                <select
                  id="modalPropertyType"
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  {uniquePropertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amenities Filter (General) */}
              <div className="filter-group">
                <label className="filter-label">General Amenities:</label>
                <div className="amenities-checkbox-grid">
                  {availableAmenities.map((amenity) => (
                    <div
                      key={`gen-amenity-${amenity}`}
                      className="filter-checkbox-group"
                    >
                      <input
                        type="checkbox"
                        id={`gen-amenity-${amenity}`}
                        checked={amenitiesFilter.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="filter-checkbox"
                      />
                      <label
                        htmlFor={`gen-amenity-${amenity}`}
                        className="filter-label"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* New: Building Amenities Filter */}
              <div className="filter-group">
                <label className="filter-label">Building Amenities:</label>
                <div className="amenities-checkbox-grid">
                  {availableBuildingAmenities.map((amenity) => (
                    <div
                      key={`bldg-amenity-${amenity}`}
                      className="filter-checkbox-group"
                    >
                      <input
                        type="checkbox"
                        id={`bldg-amenity-${amenity}`}
                        checked={buildingAmenitiesFilter.includes(amenity)}
                        onChange={() => handleBuildingAmenityChange(amenity)}
                        className="filter-checkbox"
                      />
                      <label
                        htmlFor={`bldg-amenity-${amenity}`}
                        className="filter-label"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* New: Property Features Filter */}
              <div className="filter-group">
                <label className="filter-label">Property Features:</label>
                <div className="amenities-checkbox-grid">
                  {availablePropertyFeatures.map((feature) => (
                    <div
                      key={`prop-feature-${feature}`}
                      className="filter-checkbox-group"
                    >
                      <input
                        type="checkbox"
                        id={`prop-feature-${feature}`}
                        checked={propertyFeaturesFilter.includes(feature)}
                        onChange={() => handlePropertyFeatureChange(feature)}
                        className="filter-checkbox"
                      />
                      <label
                        htmlFor={`prop-feature-${feature}`}
                        className="filter-label"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* New: Pet Policy Filter */}
              <div className="filter-group">
                <label htmlFor="modalPetPolicy" className="filter-label">
                  Pet Policy:
                </label>
                <select
                  id="modalPetPolicy"
                  value={petPolicyFilter}
                  onChange={(e) => setPetPolicyFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  <option value="Pet-Friendly">Pet-Friendly</option>
                  <option value="No Pets">No Pets</option>
                  <option value="Small Pets Only">Small Pets Only</option>
                </select>
              </div>

              {/* New: Furnishing Status Filter */}
              <div className="filter-group">
                <label htmlFor="modalFurnishingStatus" className="filter-label">
                  Furnishing Status:
                </label>
                <select
                  id="modalFurnishingStatus"
                  value={furnishingStatusFilter}
                  onChange={(e) => setFurnishingStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                </select>
              </div>

              {/* New: Lease Term Filter */}
              <div className="filter-group">
                <label htmlFor="modalLeaseTerm" className="filter-label">
                  Lease Term:
                </label>
                <select
                  id="modalLeaseTerm"
                  value={leaseTermFilter}
                  onChange={(e) => setLeaseTermFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  <option value="Short-Term">Short-Term</option>
                  <option value="Long-Term">Long-Term</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {/* New: Proximity Filter */}
              <div className="filter-group">
                <label htmlFor="modalProximity" className="filter-label">
                  Proximity To:
                </label>
                <select
                  id="modalProximity"
                  value={proximityFilter}
                  onChange={(e) => setProximityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  {availableProximityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* New: Accessibility Features Filter */}
              <div className="filter-group">
                <label className="filter-label">Accessibility Features:</label>
                <div className="amenities-checkbox-grid">
                  {availableAccessibilityFeatures.map((feature) => (
                    <div
                      key={`access-feature-${feature}`}
                      className="filter-checkbox-group"
                    >
                      <input
                        type="checkbox"
                        id={`access-feature-${feature}`}
                        checked={accessibilityFeaturesFilter.includes(feature)}
                        onChange={() =>
                          handleAccessibilityFeatureChange(feature)
                        }
                        className="filter-checkbox"
                      />
                      <label
                        htmlFor={`access-feature-${feature}`}
                        className="filter-label"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Posted Filter */}
              <div className="filter-group">
                <label htmlFor="modalDatePosted" className="filter-label">
                  Date Posted:
                </label>
                <select
                  id="modalDatePosted"
                  value={datePostedFilter}
                  onChange={(e) => setDatePostedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              {/* Price Range Slider (reverted to custom implementation) */}
              <div className="filter-group price-range-group">
                <label className="filter-label">Price Range (₦):</label>
                <div className="price-slider-wrapper">
                  <div className="price-slider-track" ref={priceRangeRef}>
                    <div
                      className="price-slider-range"
                      style={{
                        left: `${getPercentage(minPriceSlider)}%`,
                        width: `${
                          getPercentage(maxPriceSlider) -
                          getPercentage(minPriceSlider)
                        }%`,
                      }}
                    ></div>
                    <div
                      className="price-slider-thumb"
                      style={{ left: `${getPercentage(minPriceSlider)}%` }}
                      onMouseDown={(e) => handleMouseDown(e, "min")}
                      role="slider"
                      aria-label="Minimum price"
                      aria-valuemin={actualMinPriceRange}
                      aria-valuemax={actualMaxPriceRange}
                      aria-valuenow={minPriceSlider}
                    ></div>
                    <div
                      className="price-slider-thumb"
                      style={{ left: `${getPercentage(maxPriceSlider)}%` }}
                      onMouseDown={(e) => handleMouseDown(e, "max")}
                      role="slider"
                      aria-label="Maximum price"
                      aria-valuemin={actualMinPriceRange}
                      aria-valuemax={actualMaxPriceRange}
                      aria-valuenow={maxPriceSlider}
                    ></div>
                  </div>
                  <div className="price-value-display">
                    <span>₦{minPriceSlider.toLocaleString()}</span>
                    <span>₦{maxPriceSlider.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div className="filter-group">
                <label htmlFor="modalBedrooms" className="filter-label">
                  Bedrooms:
                </label>
                <select
                  id="modalBedrooms"
                  value={bedroomsFilter}
                  onChange={(e) => setBedroomsFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  <option value="0">0 (Studio)</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              {/* Bathrooms Filter */}
              <div className="filter-group">
                <label htmlFor="modalBathrooms" className="filter-label">
                  Bathrooms:
                </label>
                <select
                  id="modalBathrooms"
                  value={bathroomsFilter}
                  onChange={(e) => setBathroomsFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="any">Any</option>
                  <option value="1">1</option>
                  <option value="2+">2+</option>
                  <option value="3+">3+</option>
                </select>
              </div>

              {/* New Listing Filter */}
              <div className="filter-checkbox-group">
                <input
                  type="checkbox"
                  id="modalNewListing"
                  checked={isNewListingFilter}
                  onChange={(e) => setIsNewListingFilter(e.target.checked)}
                  className="filter-checkbox"
                />
                <label htmlFor="modalNewListing" className="filter-label">
                  New Listings Only
                </label>
              </div>

              {/* Sort By */}
              <div className="filter-group">
                <label htmlFor="modalSortBy" className="filter-label">
                  Sort By:
                </label>
                <select
                  id="modalSortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="location_asc">Location (A-Z)</option>
                  <option value="location_desc">Location (Z-A)</option>
                  <option value="date_desc">Date Posted (Newest First)</option>
                  <option value="date_asc">Date Posted (Oldest First)</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="clear-button-container">
                <button onClick={clearFilters} className="clear-filters-button">
                  Clear Filters
                </button>
              </div>
              <button
                className="save-search-button"
                onClick={() => {
                  alert(
                    "Search criteria saved! You will receive alerts for new matching listings. (Conceptual Feature)"
                  );
                  setShowFiltersModal(false);
                }}
              >
                Save Search & Get Alerts
              </button>
              <button
                className="apply-filters-button"
                onClick={() => setShowFiltersModal(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu (Overlay) */}
        <div
          className={`mobile-menu-overlay ${showMobileMenu ? "show" : ""}`}
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className={`mobile-menu-content ${showMobileMenu ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mobile-menu-close-button"
              onClick={() => setShowMobileMenu(false)}
            >
              &#x2715;
            </button>
            <a href="#" className="mobile-nav-brand">
              <span className="logo-icon">🏠</span> Lodger
            </a>
            <div className="mobile-nav-links">
              <a
                href="#"
                className={`mobile-nav-link ${
                  currentPage === "list" ? "active" : ""
                }`}
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage("list");
                }}
              >
                <span className="icon">🔍</span> Discover
              </a>
              <a
                href="#"
                className={`mobile-nav-link ${
                  currentPage === "bookmarks" ? "active" : ""
                }`}
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage("bookmarks");
                }}
              >
                <span className="icon">⭐</span> Bookmarks
              </a>
              <a
                href="#"
                className={`mobile-nav-link ${
                  currentPage === "saved-searches" ? "active" : ""
                }`}
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage("saved-searches");
                  alert(
                    "This would navigate to your saved searches dashboard. (Conceptual Feature)"
                  );
                }}
              >
                <span className="icon">💾</span> Saved Searches
              </a>
              <a
                href="#"
                className={`mobile-nav-link ${
                  currentPage === "profile" ? "active" : ""
                }`}
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage("profile");
                  alert(
                    "This would navigate to your user profile. (Conceptual Feature)"
                  );
                }}
              >
                <span className="icon">👤</span> Profile
              </a>
              <a
                href="#"
                className={`mobile-nav-link ${
                  currentPage === "dashboard" ? "active" : ""
                }`}
                onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage("dashboard");
                  alert(
                    "This would navigate to your user dashboard. (Conceptual Feature)"
                  );
                }}
              >
                <span className="icon">📊</span> Dashboard
              </a>
              <a
                href="#"
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="icon">ℹ️</span> About Us
              </a>
              <a
                href="#"
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="icon">📞</span> Contact
              </a>
            </div>
            <div
              className="mobile-nav-user-status"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img src={userAvatar} alt="User Avatar" />
              <span>{userStatus}</span>
            </div>
            <div className="mobile-nav-user-actions">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setCurrentPage("profile");
                      alert(
                        "This would navigate to your user profile. (Conceptual Feature)"
                      );
                    }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setCurrentPage("dashboard");
                      alert(
                        "This would navigate to your user dashboard. (Conceptual Feature)"
                      );
                    }}
                  >
                    Dashboard
                  </button>
                  <button onClick={toggleTheme}>
                    {theme === "light"
                      ? "Switch to Dark Mode"
                      : "Switch to Light Mode"}
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setLoggedInUser(null);
                      setUserStatus("Guest");
                      setUserAvatar(
                        "https://placehold.co/40x40/cccccc/ffffff?text=U"
                      );
                      localStorage.removeItem("lodgerLoggedInUser");
                      setShowMobileMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLoginModal(true);
                  }}
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>


      {/* Map View */}
      {currentPage === "map" && (
        <MapView onBackToListings={() => setCurrentPage("list")} />
      )}
      {/* Apartment Details View (Modal for Desktop, Full Page for Mobile) */}
      {selectedApartment && (
        <ApartmentDetailsView
          apartment={selectedApartment}
          onClose={() => {
            setSelectedApartment(null);
            setCurrentPage("list"); // Go back to list view
          }}
          onBackToListings={() => {
            setSelectedApartment(null);
            setCurrentPage("list"); // Go back to list view
          }}
          isMobileView={isMobile} // Pass isMobile prop
          onContactAgentClick={() => setShowContactModal(true)} // Pass handler to open contact modal
          onToggleBookmark={toggleBookmark} // Pass toggle bookmark function
          isBookmarked={bookmarkedApartments.includes(selectedApartment.id)} // Pass bookmark status
          onApplyNowClick={() => setShowApplicationModal(true)} // Pass handler for apply now
        />
      )}

      {/* Contact Agent Modal */}
      {showContactModal && selectedApartment && (
        <ContactAgentModal
          apartmentName={selectedApartment.name}
          onClose={() => setShowContactModal(false)}
          userName={userName} // Pass simulated user name
          userEmail={userEmail} // Pass simulated user email
          userPhone={userPhone} // Pass simulated user phone
          agentName={selectedApartment.agentName} // Pass agent name
          agentPhone={selectedApartment.agentPhone} // Pass agent phone
          agentImage={selectedApartment.agentImage} // Pass agent image
        />
      )}

      {/* Share Modal */}
      {showShareModal && selectedApartment && (
        <ShareModal
          apartmentUrl={`${window.location.origin}/apartments/${selectedApartment.id}`} // Example URL
          apartmentName={selectedApartment.name}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Login/Sign Up Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => {
            setLoggedInUser(user);
            setIsLoggedIn(true);
            setUserStatus(user.name);
            setUserAvatar(
              `https://placehold.co/40x40/${Math.floor(
                Math.random() * 16777215
              ).toString(16)}/ffffff?text=${user.name.charAt(0).toUpperCase()}`
            );
            localStorage.setItem("lodgerLoggedInUser", JSON.stringify(user));
          }}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          apartments={apartmentsToCompare}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {/* Rental Application Modal */}
      {showApplicationModal && selectedApartment && (
        <RentalApplicationModal
          apartmentName={selectedApartment.name}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </>
  );
}
