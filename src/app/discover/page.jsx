'use client'
// pages/discover.js
import { useEffect, useState, useCallback, useRef } from 'react';

// --- Utility Function to Simulate API Call ---
async function fetchApartments() {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return dummy apartment data with more details
  return [
    { id: '1', name: 'Cozy Studio near University A', location: 'University Avenue', price: 150000, bedrooms: 1, bathrooms: 1, isNewListing: true,
      images: [
        'https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+1',
        'https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+2',
        'https://placehold.co/600x400/F0F4F8/333333?text=Apartment+1+-+Pic+3',
      ]
    },
    { id: '2', name: 'Spacious 2-Bedroom near Tech Campus', location: 'Innovation Hub', price: 280000, bedrooms: 2, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+1',
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+2',
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+3',
      ]
    },
    { id: '3', name: 'Modern Loft in Downtown', location: 'City Center', price: 200000, bedrooms: 1, bathrooms: 1, isNewListing: true,
      images: [
        'https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+1',
        'https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+2',
      ]
    },
    { id: '4', name: 'Affordable Room in Shared House', location: 'Student District', price: 80000, bedrooms: 1, bathrooms: 0, isNewListing: false,
      images: [
        'https://placehold.co/600x400/D8E0E4/333333?text=Apartment+4+-+Pic+1',
      ]
    },
    { id: '5', name: 'Bright 3-Bedroom Family Home', location: 'Quiet Suburb', price: 350000, bedrooms: 3, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+1',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+2',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+3',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+4',
      ]
    },
    { id: '6', name: 'Compact Studio near Arts College', location: 'Bohemian Quarter', price: 120000, bedrooms: 1, bathrooms: 1, isNewListing: true,
      images: [
        'https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+1',
        'https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+2',
      ]
    },
    { id: '7', name: 'Large 4-Bedroom House with Garden', location: 'Greenwich Estate', price: 550000, bedrooms: 4, bathrooms: 3, isNewListing: false,
      images: [
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+1',
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+2',
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+3',
      ]
    },
    { id: '8', name: 'Executive 2-Bedroom Apartment', location: 'Business District', price: 400000, bedrooms: 2, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+1',
        'https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+2',
      ]
    },
    { id: '9', name: 'Quaint 1-Bedroom Cottage', location: 'Riverside Village', price: 100000, bedrooms: 1, bathrooms: 1, isNewListing: false,
      images: [
        'https://placehold.co/600x400/B0B8BC/333333?text=Apartment+9+-+Pic+1',
      ]
    },
    { id: '10', name: 'Modern 3-Bedroom Townhouse', location: 'City Center', price: 450000, bedrooms: 3, bathrooms: 2, isNewListing: true,
      images: [
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+1',
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+2',
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+3',
      ]
    },
    { id: '11', name: 'Spacious 5-Bedroom Villa', location: 'Quiet Suburb', price: 800000, bedrooms: 5, bathrooms: 4, isNewListing: false,
      images: [
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+1',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+2',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+3',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+4',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+5',
      ]
    },
    { id: '12', name: 'Compact 1-Bedroom Flat', location: 'Student District', price: 95000, bedrooms: 1, bathrooms: 1, isNewListing: false,
      images: [
        'https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+1',
        'https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+2',
      ]
    },
  ];
}

// --- DiscoverPage Component ---
export default function DiscoverPage() {
  const [allApartments, setAllApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(80000);
  const [maxPrice, setMaxPrice] = useState(800000);
  const [bedroomsFilter, setBedroomsFilter] = useState('any');
  const [bathroomsFilter, setBathroomsFilter] = useState('any');
  const [isNewListingFilter, setIsNewListingFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState('any');
  const [sortBy, setSortBy] = useState('name_asc');
  const [showFiltersModal, setShowFiltersModal] = useState(false); // State for filter modal visibility
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile navigation menu
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State for user dropdown
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse
  const [theme, setTheme] = useState('light'); // State for theme

  // New states for Apartment Details Modal/Page
  const [selectedApartment, setSelectedApartment] = useState(null); // Stores the apartment object for details view
  const [currentPage, setCurrentPage] = useState('list'); // 'list' or 'details'


  // User Status State (simulated)
  const [userStatus, setUserStatus] = useState('Guest'); // Default to Guest
  const [userAvatar, setUserAvatar] = useState('https://placehold.co/40x40/cccccc/ffffff?text=U'); // Placeholder avatar

  // Price Slider specific states and refs
  const priceRangeRef = useRef(null);
  const userDropdownRef = useRef(null); // Ref for user dropdown
  const [minPriceSlider, setMinPriceSlider] = useState(80000);
  const [maxPriceSlider, setMaxPriceSlider] = useState(800000);
  // These will now be dynamically set based on fetched data
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


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownRef]);

  // Effect to apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 768;


  useEffect(() => {
    const getApartments = async () => {
      try {
        const data = await fetchApartments();
        setAllApartments(data);
        const prices = data.map(apt => apt.price);
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
        setError('Failed to load apartments. Please try again later.');
        console.error('Error fetching apartments:', err);
      } finally {
        setLoading(false);
      }
    };
    getApartments();
  }, []);


  // Memoized function for applying filters and sorting
  const applyFiltersAndSort = useCallback((apartmentsToFilter = allApartments, currentMinPrice = minPrice, currentMaxPrice = maxPrice) => {
    let updatedApartments = [...apartmentsToFilter];

    // 1. Apply Search Term Filter
    if (searchTerm) {
      updatedApartments = updatedApartments.filter(apt =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Apply Price Filter using the currentMinPrice and currentMaxPrice
    updatedApartments = updatedApartments.filter(apt =>
      apt.price >= currentMinPrice && apt.price <= currentMaxPrice
    );

    // 3. Apply Bedrooms Filter
    if (bedroomsFilter !== 'any') {
      updatedApartments = updatedApartments.filter(apt => {
        if (bedroomsFilter === '3+') {
          return apt.bedrooms >= 3;
        } else if (bedroomsFilter === '4+') {
          return apt.bedrooms >= 4;
        } else if (bedroomsFilter === '5+') {
          return apt.bedrooms >= 5;
        }
        return apt.bedrooms === parseInt(bedroomsFilter, 10);
      });
    }

    // 4. Apply Bathrooms Filter
    if (bathroomsFilter !== 'any') {
      updatedApartments = updatedApartments.filter(apt => {
        if (bathroomsFilter === '2+') {
          return apt.bathrooms >= 2;
        } else if (bathroomsFilter === '3+') {
          return apt.bathrooms >= 3;
        }
        return apt.bathrooms === parseInt(bathroomsFilter, 10);
      });
    }

    // 5. Apply New Listing Filter
    if (isNewListingFilter) {
        updatedApartments = updatedApartments.filter(apt => apt.isNewListing);
    }

    // 6. Apply Location Filter
    if (locationFilter !== 'any') {
        updatedApartments = updatedApartments.filter(apt => apt.location === locationFilter);
    }

    // 7. Apply Sorting
    updatedApartments.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      } else if (sortBy === 'price_asc') {
        return a.price - b.price;
      } else if (sortBy === 'price_desc') {
        return b.price - a.price;
      } else if (sortBy === 'location_asc') {
        return a.location.localeCompare(b.location);
      } else if (sortBy === 'location_desc') {
        return b.location.localeCompare(a.location);
      }
      return 0; // No specific sort
    });

    setFilteredApartments(updatedApartments);
  }, [allApartments, searchTerm, minPrice, maxPrice, bedroomsFilter, bathroomsFilter, isNewListingFilter, locationFilter, sortBy]);


  // Effect to re-apply filters and sort when filter/sort states change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort, searchTerm, minPrice, maxPrice, bedroomsFilter, bathroomsFilter, isNewListingFilter, locationFilter, sortBy]);


  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice(actualMinPriceRange); // Use actual min/max for clear
    setMaxPrice(actualMaxPriceRange); // Use actual min/max for clear
    setMinPriceSlider(actualMinPriceRange);
    setMaxPriceSlider(actualMaxPriceRange);
    setBedroomsFilter('any');
    setBathroomsFilter('any');
    setIsNewListingFilter(false);
    setLocationFilter('any');
    setSortBy('name_asc');
  };

  const uniqueLocations = Array.from(new Set(allApartments.map(apt => apt.location)));

  // Price slider logic
  const getPercentage = (value) => {
    return ((value - actualMinPriceRange) / (actualMaxPriceRange - actualMinPriceRange)) * 100;
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialMin = minPriceSlider;
    const initialMax = maxPriceSlider;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const trackWidth = priceRangeRef.current ? priceRangeRef.current.offsetWidth : 1;
      const pricePerPixel = (actualMaxPriceRange - actualMinPriceRange) / trackWidth; // Use actual dynamic range

      if (type === 'min') {
        let newMin = initialMin + deltaX * pricePerPixel;
        newMin = Math.round(Math.max(actualMinPriceRange, Math.min(newMin, maxPriceSlider - 10000))); // Use actual dynamic range
        handlePriceChange([newMin, maxPriceSlider]);
      } else { // type === 'max'
        let newMax = initialMax + deltaX * pricePerPixel;
        newMax = Math.round(Math.min(actualMaxPriceRange, Math.max(newMax, minPriceSlider + 10000))); // Use actual dynamic range
        handlePriceChange([minPriceSlider, newMax]);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Apartment Details Page/Modal Component
  const ApartmentDetailsView = ({ apartment, onClose, onBackToListings, isMobileView }) => {
    if (!apartment) return null;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % apartment.images.length);
    };

    const goToPrevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + apartment.images.length) % apartment.images.length
      );
    };

    return (
      <div className={isMobileView ? "apartment-details-page-overlay" : "apartment-details-modal-overlay show"}
           onClick={isMobileView ? undefined : onClose} // Only close modal on overlay click
           role="dialog"
           aria-modal="true"
           aria-labelledby="apartment-details-title"
      >
        <div className={isMobileView ? "apartment-details-page-content" : "apartment-details-modal-content"}
             onClick={(e) => e.stopPropagation()}>
          {isMobileView ? (
            <button className="apartment-details-back-button" onClick={onBackToListings} aria-label="Back to listings">
              &larr; Back to Listings
            </button>
          ) : (
            <button className="apartment-details-close-button" onClick={onClose} aria-label="Close apartment details">
              &#x2715;
            </button>
          )}

          {/* Image Slider */}
          <div className="apartment-image-slider">
            <img
              src={apartment.images[currentImageIndex]}
              alt={`${apartment.name} - Image ${currentImageIndex + 1}`}
              className="apartment-details-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/CCCCCC/666666?text=Image+Not+Found';
              }}
            />
            {apartment.images.length > 1 && (
              <>
                <button className="slider-arrow left-arrow" onClick={goToPrevImage} aria-label="Previous image">
                  &#10094;
                </button>
                <button className="slider-arrow right-arrow" onClick={goToNextImage} aria-label="Next image">
                  &#10095;
                </button>
                <div className="slider-dots">
                  {apartment.images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    ></span>
                  ))}
                </div>
              </>
            )}
            {/* Bookmark and Share Icons */}
            <div className="apartment-action-icons">
                <button className="icon-button" aria-label="Bookmark apartment">
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.89543 3 5 3.89543 5 5V21L12 18L19 21V5C19 3.89543 18.1046 3 17 3Z"/>
                    </svg>
                </button>
                <button className="icon-button" aria-label="Share apartment">
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L16.04 7.15C16.56 7.62 17.24 7.92 18 7.92C19.66 7.92 21 6.58 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L7.96 9.85C7.44 9.38 6.76 9.08 6 9.08C4.34 9.08 3 10.42 3 12C3 13.58 4.34 14.92 6 14.92C6.76 14.92 7.44 14.62 7.96 14.15L15.09 18.3C15.04 18.53 15 18.76 15 19C15 20.66 16.34 22 18 22C19.66 22 21 20.66 21 19C21 17.34 19.66 16.08 18 16.08Z"/>
                    </svg>
                </button>
            </div>
          </div>

          <div className="apartment-details-info">
            <h3 id="apartment-details-title" className="apartment-details-title">{apartment.name}</h3>
            <p className="apartment-details-location">{apartment.location}</p>
            <div className="apartment-details-specs">
              <span>🛏️ {apartment.bedrooms} Bed</span>
              <span>🛁 {apartment.bathrooms} Bath</span>
            </div>
            <p className="apartment-details-price">₦{apartment.price.toLocaleString()}/month</p>
            <p className="apartment-details-description">
              This is a beautiful {apartment.bedrooms}-bedroom, {apartment.bathrooms}-bathroom apartment located in the vibrant {apartment.location} area.
              It offers spacious living with modern amenities, perfect for comfortable living.
              The property features a modern kitchen, bright living spaces, and easy access to local amenities and public transport.
              Ideal for students, professionals, or small families.
            </p>
            <button className="apartment-details-contact-button">Contact Agent</button>
          </div>
        </div>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="app-container">
        <p className="loading-text">Loading apartments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  // Main render logic
  return (
    <>
      {/* Render the main app container if not on a mobile details page */}
      {!(currentPage === 'details' && isMobile) && (
        <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed-mode' : ''}`}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

            /* --- Base Styles & Variables --- */
            * {
              box-sizing: border-box;
            }

            :root {
              --primary-color: #66BB6A; /* Fresh Green */
              --primary-dark: #4CAF50;
              --secondary-color: #42A5F5; /* Sky Blue */
              --accent-color: #FF7043; /* Orange for highlights */
              --text-dark: #212121;
              --text-medium: #616161;
              --text-light: #9E9E9E;
              --bg-main: #F5F7FA; /* Light Gray Blue */
              --bg-element: #FFFFFF;
              --border-light: #E0E0E0;
              --shadow-subtle: rgba(0, 0, 0, 0.05);
              --shadow-medium: rgba(0, 0, 0, 0.1);
              --border-radius-sm: 4px;
              --border-radius-md: 8px;
              --border-radius-lg: 10px;
              --input-border: var(--border-light);
              --input-bg: var(--bg-element);
              --card-border: var(--border-light);
            }

            .dark-theme {
              --primary-color: #66BB6A;
              --primary-dark: #4CAF50;
              --secondary-color: #64B5F6;
              --text-dark: #E0E0E0;
              --text-medium: #B0B0B0;
              --text-light: #888888;
              --bg-main: #2C2C2C;
              --bg-element: #1E1E1E;
              --border-light: #444444;
              --shadow-subtle: rgba(0, 0, 0, 0.2);
              --shadow-medium: rgba(0, 0, 0, 0.4);
              --input-border: #666666;
              --input-bg: #3A3A3A;
              --card-border: #3A3A3A;
            }

            body, html, #__next {
              height: 100%;
              margin: 0;
              font-family: 'Inter', sans-serif;
              background-color: var(--bg-main);
              color: var(--text-dark);
              line-height: 1.6;
              transition: background-color 0.3s ease, color 0.3s ease;
            }

            .app-container {
              display: grid;
              grid-template-columns: 1fr; /* Default to single column for mobile */
              grid-template-rows: auto 1fr; /* Header row, then content row */
              height: 100vh;
              max-width: 100%;
              margin: 0 auto;
              overflow: hidden;
              background-color: var(--bg-main);
            }

            /* --- Responsive Header (Top Bar) --- */
            .responsive-header {
              grid-column: 1 / -1; /* Spans all columns */
              grid-row: 1;
              background-color: var(--bg-element);
              padding: 15px 20px;
              box-shadow: 0 2px 8px var(--shadow-subtle);
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 1000;
              flex-shrink: 0;
              border-bottom: 1px solid var(--border-light);
            }

            .responsive-header .mobile-only {
              display: flex;
            }
            .responsive-header .app-header-title {
              font-size: 1.4em;
              font-weight: 700;
              color: var(--primary-color);
              margin: 0;
              flex-grow: 1;
              text-align: center;
            }
            .responsive-header .hamburger-menu {
              flex-direction: column;
              gap: 5px;
              cursor: pointer;
              padding: 5px;
              border-radius: var(--border-radius-sm);
              transition: background-color 0.2s ease;
              margin-right: 15px;
            }
            .responsive-header .hamburger-menu:hover {
              background-color: var(--border-light);
            }
            .responsive-header .hamburger-menu .bar {
              width: 25px;
              height: 3px;
              background-color: var(--text-dark);
              border-radius: 2px;
              transition: all 0.3s ease;
            }

            .responsive-header .desktop-header-content {
              display: none;
            }

            /* --- User Status & Dropdown --- */
            .nav-user-status {
              background-color: var(--bg-main);
              padding: 6px 12px;
              border-radius: var(--border-radius-md);
              font-size: 0.85em;
              font-weight: 600;
              color: var(--primary-dark);
              box-shadow: 0 1px 3px var(--shadow-subtle);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              position: relative;
              margin-left: auto;
            }
            .nav-user-status img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              object-fit: cover;
            }
            .user-dropdown {
              position: absolute;
              top: calc(100% + 10px);
              right: 0;
              background-color: var(--bg-element);
              border-radius: var(--border-radius-md);
              box-shadow: 0 4px 15px var(--shadow-medium);
              min-width: 150px;
              z-index: 1001;
              opacity: 0;
              visibility: hidden;
              transform: translateY(-10px);
              transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
            }
            .user-dropdown.show {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            .user-dropdown-item {
              display: block;
              padding: 10px 15px;
              text-decoration: none;
              color: var(--text-dark);
              font-size: 0.95em;
              font-weight: 500;
              transition: background-color 0.2s ease, color 0.2s ease;
            }
            .user-dropdown-item:first-child {
              border-top-left-radius: var(--border-radius-md);
              border-top-right-radius: var(--border-radius-md);
            }
            .user-dropdown-item:last-child {
              border-bottom-left-radius: var(--border-radius-md);
              border-bottom-right-radius: var(--border-radius-md);
            }
            .user-dropdown-item:hover {
              background-color: var(--bg-main);
              color: var(--primary-color);
            }
            .user-dropdown-item.theme-toggle-button {
              background: none;
              border: none;
              text-align: left;
              width: 100%;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.95em;
              font-weight: 500;
              color: var(--text-dark);
              padding: 10px 15px;
            }
            .user-dropdown-item.theme-toggle-button:hover {
              background-color: var(--bg-main);
              color: var(--primary-color);
            }
            .theme-toggle-button .theme-icon {
              width: 20px;
              height: 20px;
              fill: currentColor;
              transition: transform 0.3s ease, fill 0.3s ease;
            }
            .theme-toggle-button .theme-icon.dark-mode {
              transform: rotate(30deg);
            }
            .theme-toggle-button .theme-icon.light-mode {
              transform: rotate(90deg);
            }

            /* --- Sidebar Navigation --- */
            .app-sidebar {
              grid-column: 1;
              grid-row: 1 / -1;
              background-color: var(--bg-element);
              width: 250px;
              padding: 20px;
              box-shadow: 2px 0 8px var(--shadow-subtle);
              display: none; /* Hidden by default for mobile, shown on desktop */
              flex-direction: column;
              gap: 30px;
              flex-shrink: 0;
              border-right: 1px solid var(--border-light);
              overflow-y: auto;
              transition: width 0.3s ease, padding 0.3s ease;
              position: relative;
            }
            .app-sidebar .navbar-brand {
              font-size: 1.8em;
              font-weight: 800;
              color: var(--primary-color);
              text-decoration: none;
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 20px;
              white-space: nowrap;
              overflow: hidden;
              transition: all 0.3s ease;
              justify-content: flex-start;
            }
            .app-sidebar .navbar-brand .logo-icon {
              font-size: 1.2em;
            }
            .app-sidebar .nav-links {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .app-sidebar .nav-link {
              text-decoration: none;
              color: var(--text-medium);
              font-weight: 500;
              font-size: 1.1em;
              padding: 10px 0;
              transition: color 0.2s ease, transform 0.2s ease;
              position: relative;
              display: flex;
              align-items: center;
              gap: 10px;
              white-space: nowrap;
              overflow: hidden;
            }
            .app-sidebar .nav-link:hover {
              color: var(--primary-color);
              transform: translateX(5px);
            }
            .app-sidebar .nav-link::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: -5px;
              width: 0;
              height: 2px;
              background-color: var(--primary-color);
              transition: width 0.3s ease;
            }
            .app-sidebar .nav-link:hover::after {
              width: 100%;
            }
            .app-sidebar .nav-link .link-text {
                transition: opacity 0.3s ease, width 0.3s ease;
                overflow: hidden;
                white-space: nowrap;
            }

            /* Sidebar Toggle Button */
            .sidebar-toggle-button {
              position: absolute;
              bottom: 20px;
              right: 10px;
              background-color: transparent;
              color: var(--text-medium);
              border: none;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: none;
              transition: all 0.3s ease;
              z-index: 10;
            }
            .sidebar-toggle-button:hover {
              background-color: var(--border-light);
              color: var(--primary-color);
              transform: scale(1.1);
            }
            .sidebar-toggle-button .icon {
              font-size: 1.2em;
              transition: transform 0.3s ease;
            }

            /* --- Main Content Area --- */
            .main-content {
              grid-column: 1;
              grid-row: 2;
              flex-grow: 1;
              overflow-y: auto;
              padding: 20px;
              background-color: var(--bg-main);
            }

            /* Controls Section */
            .controls-section {
              background-color: var(--bg-element);
              padding: 20px;
              border-radius: var(--border-radius-lg);
              box-shadow: 0 4px 15px var(--shadow-medium);
              margin-bottom: 20px;
              border: 1px solid var(--border-light);
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .search-bar-container {
              display: flex;
              gap: 10px;
              align-items: center;
              flex-wrap: nowrap;
            }
            .search-input {
              flex: 1;
              padding: 10px 15px;
              border-radius: var(--border-radius-md);
              border: 1px solid var(--input-border);
              font-size: 1em;
              font-family: 'Inter', sans-serif;
              transition: all 0.2s ease;
              min-width: unset;
              box-shadow: inset 0 1px 3px var(--shadow-subtle);
              background-color: var(--input-bg);
              color: var(--text-dark);
            }
            .search-input:focus {
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
              outline: none;
            }
            .filter-toggle-button {
              background-color: var(--secondary-color);
              color: white;
              padding: 10px 15px;
              border-radius: var(--border-radius-md);
              border: none;
              cursor: pointer;
              font-size: 0.95em;
              font-weight: 600;
              transition: all 0.2s ease;
              white-space: nowrap;
              box-shadow: 0 2px 5px var(--shadow-subtle);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .filter-toggle-button .filter-icon {
              width: 20px;
              height: 20px;
              fill: currentColor;
            }
            .filter-toggle-button:hover {
              background-color: #1976D2;
              transform: translateY(-1px);
              box-shadow: 0 4px 8px var(--shadow-medium);
            }
            .desktop-filters-container {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              flex: 2;
              justify-content: flex-end;
              align-items: flex-end;
              padding-top: 10px;
              border-top: 1px solid var(--border-light);
              margin-top: 10px;
            }
            .filter-group {
              display: flex;
              flex-direction: column;
              gap: 5px;
              flex-basis: calc(33% - 10px);
              min-width: 120px;
            }
            .filter-label {
              font-weight: 500;
              color: var(--text-medium);
              font-size: 0.9em;
              margin-bottom: 2px;
            }
            .filter-select {
              padding: 8px 12px;
              border-radius: var(--border-radius-md);
              border: 1px solid var(--input-border);
              font-size: 0.9em;
              font-family: 'Inter', sans-serif;
              background-color: var(--input-bg);
              color: var(--text-dark);
              cursor: pointer;
              transition: all 0.2s ease;
              appearance: none;
              background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23495057'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
              background-repeat: no-repeat;
              background-position: right 0.6rem center;
              background-size: 1em;
              box-shadow: inset 0 1px 3px var(--shadow-subtle);
            }
            .filter-select:focus {
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
              outline: none;
            }
            .filter-checkbox-group {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 0;
              margin-top: auto;
            }
            .filter-checkbox {
              width: 18px;
              height: 18px;
              cursor: pointer;
              accent-color: var(--primary-color);
              border-radius: 4px;
            }

            /* Price Slider */
            .price-range-group {
              width: 100%;
              margin-top: 10px;
            }
            .price-slider-wrapper {
              position: relative;
              height: 30px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .price-slider-track {
              position: relative;
              width: 100%;
              height: 4px;
              background-color: var(--border-light);
              border-radius: 2px;
              cursor: pointer;
            }
            .price-slider-range {
              position: absolute;
              height: 100%;
              background-color: var(--primary-color);
              border-radius: 2px;
            }
            .price-slider-thumb {
              position: absolute;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--primary-color);
              border: 2px solid var(--bg-element);
              box-shadow: 0 1px 4px var(--shadow-medium);
              top: 50%;
              transform: translate(-50%, -50%);
              cursor: grab;
              transition: all 0.1s ease;
              z-index: 2;
            }
            .price-slider-thumb:hover {
              background-color: var(--primary-dark);
              box-shadow: 0 2px 6px var(--shadow-medium);
              transform: translate(-50%, -50%) scale(1.05);
            }
            .price-slider-thumb:active {
              cursor: grabbing;
            }
            .price-value-display {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
              font-weight: 500;
              color: var(--text-dark);
              font-size: 0.85em;
            }

            /* --- Apartment Grid & Card --- */
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 25px;
            }

            .card {
              display: flex;
              flex-direction: column;
              border: 1px solid var(--card-border);
              border-radius: var(--border-radius-lg);
              overflow: hidden;
              text-decoration: none;
              color: inherit;
              background-color: var(--bg-element);
              cursor: pointer;
              box-shadow: 0 4px 12px var(--shadow-subtle);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              position: relative;
              opacity: 0;
              transform: translateY(15px);
              animation: fadeInUp 0.5s ease-out forwards;
            }
            @keyframes fadeInUp {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 20px var(--shadow-medium);
            }
            .new-listing-badge {
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: var(--primary-color);
              color: white;
              padding: 4px 8px;
              border-radius: var(--border-radius-sm);
              font-size: 0.75em;
              font-weight: bold;
              z-index: 10;
              box-shadow: 0 1px 3px var(--shadow-subtle);
            }
            .image {
              width: 100%;
              height: 180px;
              object-fit: cover;
              border-bottom: 1px solid var(--card-border);
              border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
            }
            .card-content {
              padding: 15px;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .card-title {
              font-size: 1.2em;
              font-weight: 700;
              margin-bottom: 5px;
              color: var(--text-dark);
              line-height: 1.3;
            }
            .card-location {
              color: var(--text-light);
              font-size: 0.85em;
              margin-bottom: 10px;
            }
            .card-info-grid {
              display: flex;
              gap: 10px;
              margin-bottom: 12px;
              flex-wrap: wrap;
            }
            .card-info-item {
              display: flex;
              align-items: center;
              font-size: 0.8em;
              color: var(--text-medium);
              font-weight: 500;
            }
            .icon {
              margin-right: 5px;
              font-size: 1em;
            }
            .card-price {
              font-size: 1em;
              font-weight: 600;
              color: var(--text-dark);
              margin-bottom: 15px;
            }
            .price-highlight {
              font-size: 1.1em;
              font-weight: 700;
              color: var(--primary-color);
            }
            .view-details-button {
              background-color: var(--primary-color);
              color: white;
              padding: 9px 15px;
              border-radius: var(--border-radius-md);
              border: none;
              cursor: pointer;
              font-size: 0.9em;
              font-weight: 600;
              transition: all 0.2s ease;
              width: 100%;
              box-shadow: 0 1px 3px var(--shadow-subtle);
            }
            .view-details-button:hover {
              background-color: var(--primary-dark);
              transform: translateY(-1px);
              box-shadow: 0 2px 5px var(--shadow-medium);
            }

            /* --- Empty State --- */
            .empty-state {
              text-align: center;
              font-size: 1em;
              color: var(--text-light);
              padding: 50px 20px;
              background-color: var(--bg-element);
              border-radius: var(--border-radius-lg);
              box-shadow: 0 4px 12px var(--shadow-subtle);
              margin-top: 40px;
            }

            /* --- Filter Modal --- */
            .filter-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2000;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .filter-modal-overlay.show {
              opacity: 1;
              visibility: visible;
            }
            .filter-modal-content {
              background-color: var(--bg-element);
              border-radius: var(--border-radius-lg);
              padding: 25px;
              width: 90%;
              max-width: 400px;
              box-shadow: 0 10px 30px var(--shadow-medium);
              transform: translateY(20px);
              opacity: 0;
              transition: transform 0.3s ease-out, opacity 0.3s ease-out;
              display: flex;
              flex-direction: column;
              gap: 15px;
              position: relative;
              max-height: 90vh; /* Ensure modal doesn't exceed viewport height */
              overflow-y: auto; /* Enable scrolling for content if needed */
            }
            .filter-modal-overlay.show .filter-modal-content {
              transform: translateY(0);
              opacity: 1;
            }
            .filter-modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid var(--border-light);
            }
            .filter-modal-header h3 {
              margin: 0;
              font-size: 1.3em;
              color: var(--text-dark);
            }
            .filter-modal-close-button {
              background: none;
              border: none;
              font-size: 1.5em;
              color: var(--text-light);
              cursor: pointer;
              padding: 5px;
              border-radius: 50%;
              transition: all 0.2s ease;
            }
            .filter-modal-close-button:hover {
              background-color: var(--bg-main);
              color: var(--text-dark);
            }
            .filter-modal-body {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .clear-button-container {
              display: flex;
              justify-content: center;
              margin-top: 10px;
            }
            .clear-filters-button, .apply-filters-button {
              padding: 10px 18px;
              border-radius: var(--border-radius-md);
              border: none;
              cursor: pointer;
              font-size: 0.95em;
              font-weight: 600;
              transition: all 0.2s ease;
              width: 100%;
              box-shadow: 0 1px 3px var(--shadow-subtle);
            }
            .clear-filters-button {
              background-color: #f44336;
              color: white;
            }
            .clear-filters-button:hover {
              background-color: #d32f2f;
              transform: translateY(-1px);
              box-shadow: 0 2px 5px var(--shadow-medium);
            }
            .apply-filters-button {
              background-color: var(--primary-color);
              color: white;
              margin-top: 10px;
            }
            .apply-filters-button:hover {
              background-color: var(--primary-dark);
              transform: translateY(-1px);
              box-shadow: 0 2px 5px var(--shadow-medium);
            }

            /* --- Mobile Navigation Menu (Overlay) --- */
            .mobile-menu-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              z-index: 2000;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .mobile-menu-overlay.show {
              opacity: 1;
              visibility: visible;
            }
            .mobile-menu-content {
              background-color: var(--bg-element);
              padding: 30px;
              border-radius: var(--border-radius-lg);
              width: 80%;
              max-width: 300px;
              height: 100%;
              box-shadow: 0 10px 30px var(--shadow-medium);
              transform: translateX(-100%);
              opacity: 0;
              transition: transform 0.3s ease-out, opacity 0.3s ease-out;
              display: flex;
              flex-direction: column;
              gap: 20px;
              position: relative;
              overflow-y: auto;
            }
            .mobile-menu-overlay.show .mobile-menu-content {
              transform: translateX(0);
              opacity: 1;
            }
            .mobile-menu-close-button {
              position: absolute;
              top: 15px;
              right: 15px;
              background: none;
              border: none;
              font-size: 1.8em;
              color: var(--text-light);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .mobile-menu-close-button:hover {
              color: var(--text-dark);
              transform: rotate(90deg);
            }
            .mobile-nav-links {
              display: flex;
              flex-direction: column;
              gap: 15px;
              margin-top: 20px;
            }
            .mobile-nav-link {
              text-decoration: none;
              color: var(--text-dark);
              font-weight: 600;
              font-size: 1.1em;
              padding: 10px 0;
              border-bottom: 1px solid var(--border-light);
              transition: color 0.2s ease, background-color 0.2s ease;
            }
            .mobile-nav-link:hover {
              color: var(--primary-color);
              background-color: var(--bg-main);
            }
            .mobile-nav-user-status {
              display: flex;
              align-items: center;
              gap: 10px;
              font-weight: 600;
              color: var(--primary-dark);
              background-color: var(--bg-main);
              padding: 10px 15px;
              border-radius: var(--border-radius-md);
              margin-top: 15px;
              box-shadow: 0 1px 3px var(--shadow-subtle);
            }
            .mobile-nav-user-status img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              object-fit: cover;
            }

            /* --- Apartment Details Modal (Desktop) & Page (Mobile) Styling --- */
            .apartment-details-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2000;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .apartment-details-modal-overlay.show {
              opacity: 1;
              visibility: visible;
            }
            .apartment-details-modal-content {
              background-color: var(--bg-element);
              border-radius: var(--border-radius-lg);
              padding: 30px;
              width: 90%;
              max-width: 700px;
              box-shadow: 0 12px 40px var(--shadow-medium);
              transform: translateY(30px);
              opacity: 0;
              transition: transform 0.3s ease-out, opacity 0.3s ease-out;
              display: flex;
              flex-direction: column;
              gap: 20px;
              position: relative;
              max-height: 90vh;
              overflow-y: auto;
            }
            .apartment-details-modal-overlay.show .apartment-details-modal-content {
              transform: translateY(0);
              opacity: 1;
            }

            /* Full-page apartment details for mobile */
            .apartment-details-page-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--bg-main);
                z-index: 1999;
                overflow-y: auto;
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }
            .apartment-details-page-content {
                background-color: var(--bg-element);
                width: 100%;
                min-height: 100%;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                position: relative;
            }

            .apartment-details-close-button {
              position: absolute;
              top: 15px;
              right: 15px;
              background: none;
              border: none;
              font-size: 1.8em;
              color: var(--text-light);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .apartment-details-close-button:hover {
              color: var(--text-dark);
              transform: rotate(90deg);
            }

            .apartment-details-back-button {
                background-color: transparent;
                border: none;
                color: var(--primary-color);
                font-size: 1.1em;
                font-weight: 600;
                padding: 10px 0;
                cursor: pointer;
                text-align: left;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: color 0.2s ease, transform 0.2s ease;
            }
            .apartment-details-back-button:hover {
                color: var(--primary-dark);
                transform: translateX(-5px);
            }

            /* Image Slider Specific Styles */
            .apartment-image-slider {
              position: relative;
              width: 100%;
              height: 250px; /* Fixed height for slider */
              border-radius: var(--border-radius-md);
              overflow: hidden;
              margin-bottom: 15px;
              background-color: #f0f0f0; /* Placeholder background */
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .apartment-image-slider .apartment-details-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0; /* Image itself shouldn't have radius here */
                margin-bottom: 0; /* Reset margin */
                transition: opacity 0.5s ease-in-out; /* Fade transition */
            }

            .slider-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background-color: rgba(0, 0, 0, 0.5);
              color: white;
              border: none;
              padding: 10px 15px;
              font-size: 1.5em;
              cursor: pointer;
              z-index: 10;
              border-radius: var(--border-radius-md);
              transition: background-color 0.3s ease;
            }
            .slider-arrow:hover {
              background-color: rgba(0, 0, 0, 0.7);
            }
            .left-arrow {
              left: 10px;
            }
            .right-arrow {
              right: 10px;
            }

            .slider-dots {
              position: absolute;
              bottom: 10px;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              gap: 8px;
              z-index: 10;
            }
            .dot {
              width: 10px;
              height: 10px;
              background-color: rgba(255, 255, 255, 0.6);
              border-radius: 50%;
              cursor: pointer;
              transition: background-color 0.3s ease, transform 0.2s ease;
            }
            .dot.active {
              background-color: var(--primary-color);
              transform: scale(1.2);
            }

            /* Bookmark and Share Icons */
            .apartment-action-icons {
                position: absolute;
                top: 15px;
                right: 15px;
                z-index: 10;
                display: flex;
                gap: 10px;
            }
            .icon-button {
                background-color: rgba(255, 255, 255, 0.8);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.2s ease, transform 0.2s ease;
            }
            .icon-button:hover {
                background-color: var(--primary-color);
                color: white;
                transform: scale(1.1);
            }
            .icon-button svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }


            .apartment-details-info {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .apartment-details-title {
              font-size: 1.8em;
              font-weight: 700;
              color: var(--text-dark);
              margin-bottom: 5px;
            }
            .apartment-details-location {
              font-size: 1.1em;
              color: var(--text-medium);
              margin-bottom: 10px;
            }
            .apartment-details-specs {
              display: flex;
              gap: 20px;
              font-size: 1em;
              color: var(--text-medium);
              margin-bottom: 15px;
            }
            .apartment-details-price {
              font-size: 1.4em;
              font-weight: 700;
              color: var(--primary-color);
              margin-bottom: 20px;
            }
            .apartment-details-description {
              font-size: 1em;
              color: var(--text-dark);
              line-height: 1.7;
              margin-bottom: 25px;
            }
            .apartment-details-contact-button {
              background-color: var(--primary-color);
              color: white;
              padding: 12px 25px;
              border-radius: var(--border-radius-md);
              border: none;
              cursor: pointer;
              font-size: 1.1em;
              font-weight: 600;
              transition: all 0.2s ease;
              align-self: flex-start;
              box-shadow: 0 2px 8px var(--shadow-subtle);
            }
            .apartment-details-contact-button:hover {
              background-color: var(--primary-dark);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px var(--shadow-medium);
            }


            /* --- Responsive Media Queries --- */
            @media (max-width: 480px) { /* Mobile specific adjustments */
                .responsive-header {
                    padding: 10px 15px;
                }
                .responsive-header .app-header-title {
                    font-size: 1.2em;
                }
                .responsive-header .hamburger-menu {
                    margin-right: 10px;
                }
                .nav-user-status {
                    padding: 5px 10px;
                    font-size: 0.8em;
                }
                .nav-user-status img {
                    width: 20px;
                    height: 20px;
                }

                .main-content {
                    padding: 15px;
                }
                .controls-section {
                    padding: 15px;
                    gap: 10px;
                }
                .search-input {
                    padding: 8px 12px;
                    font-size: 0.9em;
                }
                .filter-toggle-button {
                    padding: 8px 12px;
                    font-size: 0.85em;
                }
                .grid {
                    gap: 15px;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Smaller min-width for mobile cards */
                }
                .card-content {
                    padding: 12px;
                }
                .card-title {
                    font-size: 1.1em;
                }
                .card-location {
                    font-size: 0.8em;
                }
                .card-info-item {
                    font-size: 0.75em;
                }
                .card-price {
                    font-size: 0.9em;
                }
                .view-details-button {
                    padding: 8px 12px;
                    font-size: 0.85em;
                }

                /* Filter Modal on small screens */
                .filter-modal-content {
                    padding: 20px;
                    gap: 15px;
                }
                .filter-modal-header {
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                }
                .filter-modal-header h3 {
                    font-size: 1.2em;
                }
                .filter-modal-close-button {
                    font-size: 1.4em;
                }
                .filter-group, .filter-checkbox-group {
                    gap: 5px;
                }
                .filter-label {
                    font-size: 0.9em;
                }
                .filter-select {
                    padding: 8px 12px;
                    font-size: 0.9em;
                }
                .filter-checkbox {
                    width: 16px;
                    height: 16px;
                }
                .price-slider-wrapper {
                    height: 30px;
                }
                .price-value-display {
                    font-size: 0.8em;
                }
                .clear-filters-button, .apply-filters-button {
                    padding: 10px 18px;
                    font-size: 0.9em;
                }

                /* Apartment details full page on mobile */
                .apartment-details-page-content {
                    padding: 15px;
                    gap: 10px;
                }
                .apartment-details-image {
                    height: 180px;
                }
                .apartment-details-title {
                    font-size: 1.5em;
                }
                .apartment-details-location {
                    font-size: 1em;
                }
                .apartment-details-specs {
                    font-size: 0.9em;
                }
                .apartment-details-price {
                    font-size: 1.2em;
                }
                .apartment-details-description {
                    font-size: 0.9em;
                }
                .apartment-details-contact-button {
                    padding: 10px 20px;
                    font-size: 1em;
                }
                .apartment-details-back-button {
                    font-size: 1em;
                    padding: 8px 0;
                }

                .apartment-image-slider {
                    height: 180px; /* Adjust slider height for mobile */
                }
                .slider-arrow {
                    padding: 8px 12px;
                    font-size: 1.2em;
                }
                .slider-dots {
                    bottom: 5px;
                    gap: 6px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                }
                .apartment-action-icons {
                    top: 10px;
                    right: 10px;
                    gap: 8px;
                }
                .icon-button {
                    width: 32px;
                    height: 32px;
                }
                .icon-button svg {
                    width: 18px;
                    height: 18px;
                }
            }

            @media (min-width: 769px) { /* Desktop/Tablet specific adjustments */
              .app-container {
                grid-template-columns: 250px 1fr;
                transition: grid-template-columns 0.3s ease;
              }
              .app-container.sidebar-collapsed-mode {
                grid-template-columns: 60px 1fr;
              }

              .responsive-header {
                grid-column: 2 / -1;
                justify-content: flex-end;
              }
              .responsive-header .mobile-only {
                display: none;
              }
              .responsive-header .desktop-header-content {
                display: flex;
                flex-grow: 1;
                justify-content: center;
              }
              .responsive-header .app-header-title {
                text-align: center;
                margin-left: 0;
              }
              .responsive-header .nav-user-status {
                margin-left: auto;
              }

              .app-sidebar {
                display: flex;
              }
              .app-container.sidebar-collapsed-mode .app-sidebar {
                width: 60px;
                padding: 20px 10px;
              }
              .app-container.sidebar-collapsed-mode .app-sidebar .navbar-brand {
                justify-content: center;
                width: 40px;
                margin: 0 auto 20px auto;
              }
              .app-container.sidebar-collapsed-mode .app-sidebar .navbar-brand span:not(.logo-icon) {
                opacity: 0;
                width: 0;
                overflow: hidden;
                transition: opacity 0.3s ease, width 0.3s ease;
              }
              .app-container.sidebar-collapsed-mode .app-sidebar .nav-link {
                justify-content: center;
                padding: 10px 0;
              }
              .app-container.sidebar-collapsed-mode .app-sidebar .nav-link .link-text {
                opacity: 0;
                width: 0;
                overflow: hidden;
                transition: opacity 0.3s ease, width 0.3s ease;
              }
              .app-container.sidebar-collapsed-mode .sidebar-toggle-button .icon {
                transform: rotate(180deg);
              }

              .main-content {
                grid-column: 2;
                grid-row: 2;
              }

              .filter-toggle-button {
                display: flex;
              }
              .desktop-filters-container {
                display: none;
              }
              .search-bar-container {
                flex-direction: row;
                justify-content: space-between;
              }
            }
          `}</style>

          {/* Responsive Header (Top Bar) */}
          <header className="responsive-header">
            {/* Mobile-only elements */}
            <div className="hamburger-menu mobile-only" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <h1 className="app-header-title mobile-only">Discover Apartments</h1>

            {/* Desktop-only header content (e.g., centered title) */}
            <div className="desktop-header-content">
              <h1 className="app-header-title">Discover Apartments</h1>
            </div>

            {/* User status (always present, but its container's flex behavior changes) */}
            <div className="nav-user-status" onClick={() => setShowUserDropdown(!showUserDropdown)} ref={userDropdownRef}>
              <img src={userAvatar} alt="User Avatar" />
              <span>{userStatus}</span>
              <div className={`user-dropdown ${showUserDropdown ? 'show' : ''}`}>
                <a href="#" className="user-dropdown-item">Profile</a>
                <a href="#" className="user-dropdown-item">Settings</a>
                <button className="user-dropdown-item theme-toggle-button" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <>
                      <svg className="theme-icon light-mode" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM20 12H22V10H20V12ZM2 12H4V10H2V12ZM11 2V4H13V2H11ZM11 20V22H13V20H11ZM18.364 5.63604L19.7782 4.22183L21.1924 5.63604L19.7782 7.05025L18.364 5.63604ZM4.22183 19.7782L5.63604 21.1924L7.05025 19.7782L5.63604 18.364L4.22183 19.7782ZM18.364 18.364L19.7782 19.7782L21.1924 18.364L19.7782 16.9497L18.364 18.364ZM4.22183 4.22183L5.63604 5.63604L7.05025 4.22183L5.63604 2.80762L4.22183 4.22183Z"/>
                      </svg>
                      <span>Switch to Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <svg className="theme-icon dark-mode" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 15C15.866 15 19 18.134 19 22H5C5 18.134 8.13401 15 12 15ZM12 17C9.23858 17 7 19.2386 7 22H17C17 19.2386 14.7614 17 12 17Z"/>
                      </svg>
                      <span>Switch to Light Mode</span>
                    </>
                  )}
                </button>
                <a href="#" className="user-dropdown-item">Logout</a>
              </div>
            </div>
          </header>

          {/* Sidebar Navigation */}
          <aside className="app-sidebar">
            <a href="#" className="navbar-brand">
              <span className="logo-icon">🏠</span> <span className="link-text">Lodger</span>
            </a>
            <div className="nav-links">
              <a href="#" className="nav-link">
                <span className="icon">🏠</span> <span className="link-text">Home</span>
              </a>
              <a href="#" className="nav-link">
                <span className="icon">🔍</span> <span className="link-text">Discover</span>
              </a>
              <a href="#" className="nav-link">
                <span className="icon">ℹ️</span> <span className="link-text">About Us</span>
              </a>
              <a href="#" className="nav-link">
                <span className="icon">📞</span> <span className="link-text">Contact</span>
              </a>
            </div>
            <button className="sidebar-toggle-button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </aside>

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
                  <svg className="filter-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/>
                  </svg>
                </button>
                {!isTablet && (
                  <div className="desktop-filters-container">
                    {/* This content will now be hidden and the modal will be used instead */}
                  </div>
                )}
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
                    onClick={() => {
                      setSelectedApartment(apartment);
                      setCurrentPage('details'); // Always set to details, then ApartmentDetailsView will decide modal/page
                    }}
                  >
                      {apartment.isNewListing && <div className="new-listing-badge">✨ New Listing</div>}
                      <img
                        src={apartment.images[0] || 'https://placehold.co/400x280/CCCCCC/666666?text=Image+Not+Found'} // Use first image or fallback
                        alt={apartment.name}
                        className="image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x280/CCCCCC/666666?text=Image+Not+Found';
                        }}
                      />
                      <div className="card-content">
                        <h2 className="card-title">{apartment.name}</h2>
                        <p className="card-location">{apartment.location}</p>
                        <div className="card-info-grid">
                          <span className="card-info-item">
                            <span className="icon">🛏️</span> {apartment.bedrooms} Bed
                          </span>
                          <span className="card-info-item">
                            <span className="icon">🛁</span> {apartment.bathrooms} Bath
                          </span>
                        </div>
                        <p className="card-price">₦{apartment.price.toLocaleString()}/month</p>
                        <button className="view-details-button">View Details</button>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </main>

          {/* Filter Modal */}
          <div className={`filter-modal-overlay ${showFiltersModal ? 'show' : ''}`} onClick={() => setShowFiltersModal(false)}
               role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
            <div className={`filter-modal-content ${showFiltersModal ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="filter-modal-header">
                <h3 id="filter-modal-title">Filter Options</h3>
                <button className="filter-modal-close-button" onClick={() => setShowFiltersModal(false)} aria-label="Close filter options">
                  &#x2715;
                </button>
              </div>
              <div className="filter-modal-body">
                {/* Location Filter */}
                <div className="filter-group">
                    <label htmlFor="modalLocation" className="filter-label">Location:</label>
                    <select
                        id="modalLocation"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="any">Any</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range Slider */}
                <div className="filter-group price-range-group">
                  <label className="filter-label">Price Range (₦):</label>
                  <div className="price-slider-wrapper">
                    <div className="price-slider-track" ref={priceRangeRef}>
                      <div
                        className="price-slider-range"
                        style={{
                          left: `${getPercentage(minPriceSlider)}%`,
                          width: `${getPercentage(maxPriceSlider) - getPercentage(minPriceSlider)}%`,
                        }}
                      ></div>
                      <div
                        className="price-slider-thumb"
                        style={{ left: `${getPercentage(minPriceSlider)}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'min')}
                        role="slider"
                        aria-label="Minimum price"
                        aria-valuemin={actualMinPriceRange}
                        aria-valuemax={actualMaxPriceRange}
                        aria-valuenow={minPriceSlider}
                      ></div>
                      <div
                        className="price-slider-thumb"
                        style={{ left: `${getPercentage(maxPriceSlider)}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 'max')}
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
                  <label htmlFor="modalBedrooms" className="filter-label">Bedrooms:</label>
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
                  <label htmlFor="modalBathrooms" className="filter-label">Bathrooms:</label>
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
                    <label htmlFor="modalNewListing" className="filter-label">New Listings Only</label>
                </div>

                {/* Sort By */}
                <div className="filter-group">
                  <label htmlFor="modalSortBy" className="filter-label">Sort By:</label>
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
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="clear-button-container">
                    <button onClick={clearFilters} className="clear-filters-button">
                        Clear Filters
                    </button>
                </div>
                <button className="apply-filters-button" onClick={() => setShowFiltersModal(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu (Overlay) */}
          <div className={`mobile-menu-overlay ${showMobileMenu ? 'show' : ''}`} onClick={() => setShowMobileMenu(false)}>
            <div className={`mobile-menu-content ${showMobileMenu ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button className="mobile-menu-close-button" onClick={() => setShowMobileMenu(false)}>
                &#x2715;
              </button>
              <div className="mobile-nav-links">
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>Home</a>
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>Discover</a>
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>About Us</a>
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>Contact</a>
                <div className="mobile-nav-user-status">
                  <img src={userAvatar} alt="User Avatar" />
                  <span>{userStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Apartment Details View (Modal for Desktop, Full Page for Mobile) */}
      {selectedApartment && (
        <ApartmentDetailsView
          apartment={selectedApartment}
          onClose={() => {
            setSelectedApartment(null);
            setCurrentPage('list'); // Go back to list view
          }}
          onBackToListings={() => {
            setSelectedApartment(null);
            setCurrentPage('list'); // Go back to list view
          }}
          isMobileView={isMobile} // Pass isMobile prop
        />
      )}
    </>
  );
}
