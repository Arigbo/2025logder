"use client"
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';

// --- Utility Function to Simulate API Call ---
async function fetchApartments() {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return dummy apartment data with more details
  return [
    { id: '1', name: 'Cozy Studio near University A', location: 'University Avenue', price: 150000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x250/E0E0E0/333333?text=Apartment+1' },
    { id: '2', name: 'Spacious 2-Bedroom near Tech Campus', location: 'Innovation Hub', price: 280000, bedrooms: 2, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x250/D0D0D0/333333?text=Apartment+2' },
    { id: '3', name: 'Modern Loft in Downtown', location: 'City Center', price: 200000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x250/C0C0C0/333333?text=Apartment+3' },
    { id: '4', name: 'Affordable Room in Shared House', location: 'Student District', price: 80000, bedrooms: 1, bathrooms: 0, isNewListing: false, imageUrl: 'https://placehold.co/400x250/B0B0B0/333333?text=Apartment+4' },
    { id: '5', name: 'Bright 3-Bedroom Family Home', location: 'Quiet Suburb', price: 350000, bedrooms: 3, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x250/A0A0A0/333333?text=Apartment+5' },
    { id: '6', name: 'Compact Studio near Arts College', location: 'Bohemian Quarter', price: 120000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x250/909090/333333?text=Apartment+6' },
    { id: '7', name: 'Large 4-Bedroom House with Garden', location: 'Greenwich Estate', price: 550000, bedrooms: 4, bathrooms: 3, isNewListing: false, imageUrl: 'https://placehold.co/400x250/F0F0F0/333333?text=Apartment+7' },
    { id: '8', name: 'Executive 2-Bedroom Apartment', location: 'Business District', price: 400000, bedrooms: 2, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x250/E5E5E5/333333?text=Apartment+8' },
    { id: '9', name: 'Quaint 1-Bedroom Cottage', location: 'Riverside Village', price: 100000, bedrooms: 1, bathrooms: 1, isNewListing: false, imageUrl: 'https://placehold.co/400x250/D5D5D5/333333?text=Apartment+9' },
    { id: '10', name: 'Modern 3-Bedroom Townhouse', location: 'City Center', price: 450000, bedrooms: 3, bathrooms: 2, isNewListing: true, imageUrl: 'https://placehold.co/400x250/AEEEEE/333333?text=Apartment+10' },
    { id: '11', name: 'Spacious 5-Bedroom Villa', location: 'Quiet Suburb', price: 800000, bedrooms: 5, bathrooms: 4, isNewListing: false, imageUrl: 'https://placehold.co/400x250/B0E0E6/333333?text=Apartment+11' },
    { id: '12', name: 'Compact 1-Bedroom Flat', location: 'Student District', price: 95000, bedrooms: 1, bathrooms: 1, isNewListing: false, imageUrl: 'https://placehold.co/400x250/ADD8E6/333333?text=Apartment+12' },
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
  const [showFiltersModal, setShowFiltersModal] = useState(false); // New state for modal visibility

  // User Status State (simulated)
  const [userStatus, setUserStatus] = useState('Guest'); // Default to Guest

  // Price Slider specific states and refs
  const priceRangeRef = useRef(null);
  const [minPriceSlider, setMinPriceSlider] = useState(80000);
  const [maxPriceSlider, setMaxPriceSlider] = useState(800000);
  const priceMinRange = 80000;
  const priceMaxRange = 800000;

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
    setMinPrice(priceMinRange);
    setMaxPrice(priceMaxRange);
    setMinPriceSlider(priceMinRange);
    setMaxPriceSlider(priceMaxRange);
    setBedroomsFilter('any');
    setBathroomsFilter('any');
    setIsNewListingFilter(false);
    setLocationFilter('any');
    setSortBy('name_asc');
  };

  const uniqueLocations = Array.from(new Set(allApartments.map(apt => apt.location)));

  // Price slider logic
  const getPercentage = (value) => {
    return ((value - priceMinRange) / (priceMaxRange - priceMinRange)) * 100;
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialMin = minPriceSlider;
    const initialMax = maxPriceSlider;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const trackWidth = priceRangeRef.current ? priceRangeRef.current.offsetWidth : 1;
      const pricePerPixel = (priceMaxRange - priceMinRange) / trackWidth;

      if (type === 'min') {
        let newMin = initialMin + deltaX * pricePerPixel;
        newMin = Math.round(Math.max(priceMinRange, Math.min(newMin, maxPriceSlider - 10000)));
        handlePriceChange([newMin, maxPriceSlider]);
      } else { // type === 'max'
        let newMax = initialMax + deltaX * pricePerPixel;
        newMax = Math.round(Math.min(priceMaxRange, Math.max(newMax, minPriceSlider + 10000)));
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


  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading apartments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with User Status */}
      <div style={styles.header}>
        <h1 style={styles.heading(isTablet, isMobile)}>Discover Your Perfect Apartment</h1>
        <div style={styles.userStatus}>Welcome, {userStatus}!</div>
      </div>
      <p style={styles.subheading(isMobile)}>Browse a curated selection of student-friendly accommodations.</p>

      {/* Filter and Sort Controls */}
      <div style={styles.controlsSection}>
        <div style={styles.searchBarContainer(isMobile)}>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput(isMobile)}
          />
          {isMobile && (
            <button
              style={styles.filterToggleButton}
              onClick={() => setShowFiltersModal(true)} // Open modal on click
            >
              Show Filters
            </button>
          )}
           {!isMobile && ( // Show desktop filters
             <div style={styles.desktopFiltersContainer}>
                 {/* Location Filter */}
                 <div style={styles.filterGroup}>
                     <label htmlFor="location" style={styles.filterLabel}>Location:</label>
                     <select
                         id="location"
                         value={locationFilter}
                         onChange={(e) => setLocationFilter(e.target.value)}
                         style={styles.filterSelect}
                     >
                         <option value="any">Any</option>
                         {uniqueLocations.map(loc => (
                             <option key={loc} value={loc}>{loc}</option>
                         ))}
                     </select>
                 </div>

                 {/* Bedrooms Filter */}
                 <div style={styles.filterGroup}>
                   <label htmlFor="bedrooms" style={styles.filterLabel}>Beds:</label>
                   <select
                     id="bedrooms"
                     value={bedroomsFilter}
                     onChange={(e) => setBedroomsFilter(e.target.value)}
                     style={styles.filterSelect}
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
                 <div style={styles.filterGroup}>
                   <label htmlFor="bathrooms" style={styles.filterLabel}>Baths:</label>
                   <select
                     id="bathrooms"
                     value={bathroomsFilter}
                     onChange={(e) => setBathroomsFilter(e.target.value)}
                     style={styles.filterSelect}
                   >
                     <option value="any">Any</option>
                     <option value="1">1</option>
                     <option value="2+">2+</option>
                     <option value="3+">3+</option>
                   </select>
                 </div>

                 {/* Sort By */}
                 <div style={styles.filterGroup}>
                   <label htmlFor="sortBy" style={styles.filterLabel}>Sort By:</label>
                   <select
                     id="sortBy"
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     style={styles.filterSelect}
                   >
                     <option value="name_asc">Name (A-Z)</option>
                     <option value="name_desc">Name (Z-A)</option>
                     <option value="price_asc">Price (Low to High)</option>
                     <option value="price_desc">Price (High to Low)</option>
                     <option value="location_asc">Location (A-Z)</option>
                     <option value="location_desc">Location (Z-A)</option>
                   </select>
                 </div>
             </div>
           )}
        </div>
      </div>

      {filteredApartments.length === 0 && !loading && !error ? (
        <div style={styles.emptyState}>
          <p>No apartments match your current filter criteria.</p>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredApartments.map((apartment, index) => (
            <Link key={apartment.id} href={`/apartments/${apartment.id}`} passHref legacyBehavior>
              <a style={{ ...styles.card, animationDelay: `${index * 0.1}s` }}>
                {apartment.isNewListing && <div style={styles.newListingBadge}>✨ New Listing</div>}
                <img
                  src={apartment.imageUrl}
                  alt={apartment.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x250/CCCCCC/666666?text=Image+Not+Found';
                  }}
                />
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{apartment.name}</h2>
                  <p style={styles.cardLocation}>{apartment.location}</p>
                  <div style={styles.cardInfoGrid}>
                    <span style={styles.cardInfoItem}>
                      <span style={styles.icon}>🛏️</span> {apartment.bedrooms} Bed
                    </span>
                    <span style={styles.cardInfoItem}>
                      <span style={styles.icon}>🛁</span> {apartment.bathrooms} Bath
                    </span>
                  </div>
                  <p style={styles.cardPrice}>Starting from <span style={styles.priceHighlight}>₦{apartment.price.toLocaleString()}/month</span></p>
                  <button style={styles.viewDetailsButton}>View Details</button>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <div style={styles.filterModalOverlay(showFiltersModal)} onClick={() => setShowFiltersModal(false)}>
        <div style={styles.filterModalContent(showFiltersModal)} onClick={(e) => e.stopPropagation()}>
          <div style={styles.filterModalHeader}>
            <h3>Filter Options</h3>
            <button style={styles.filterModalCloseButton} onClick={() => setShowFiltersModal(false)}>
              &#x2715;
            </button>
          </div>
          <div style={styles.filterModalBody}>
            {/* Location Filter */}
            <div style={styles.filterGroup(true)}>
                <label htmlFor="modalLocation" style={styles.filterLabel}>Location:</label>
                <select
                    id="modalLocation"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="any">Any</option>
                    {uniqueLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* Price Range Slider */}
            <div style={{ ...styles.filterGroup(true), ...styles.priceRangeGroup }}>
              <label style={styles.filterLabel}>Price Range (₦):</label>
              <div style={styles.priceSliderWrapper}>
                <div style={styles.priceSliderTrack} ref={priceRangeRef}>
                  <div
                    style={{
                      ...styles.priceSliderRange,
                      left: `${getPercentage(minPriceSlider)}%`,
                      width: `${getPercentage(maxPriceSlider) - getPercentage(minPriceSlider)}%`,
                    }}
                  ></div>
                  <div
                    style={{ ...styles.priceSliderThumb, left: `${getPercentage(minPriceSlider)}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'min')}
                  ></div>
                  <div
                    style={{ ...styles.priceSliderThumb, left: `${getPercentage(maxPriceSlider)}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'max')}
                  ></div>
                </div>
                <div style={styles.priceValueDisplay}>
                  <span>₦{minPriceSlider.toLocaleString()}</span>
                  <span>₦{maxPriceSlider.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div style={styles.filterGroup(true)}>
              <label htmlFor="modalBedrooms" style={styles.filterLabel}>Bedrooms:</label>
              <select
                id="modalBedrooms"
                value={bedroomsFilter}
                onChange={(e) => setBedroomsFilter(e.target.value)}
                style={styles.filterSelect}
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
            <div style={styles.filterGroup(true)}>
              <label htmlFor="modalBathrooms" style={styles.filterLabel}>Bathrooms:</label>
              <select
                id="modalBathrooms"
                value={bathroomsFilter}
                onChange={(e) => setBathroomsFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="any">Any</option>
                <option value="1">1</option>
                <option value="2+">2+</option>
                <option value="3+">3+</option>
              </select>
            </div>

            {/* New Listing Filter */}
            <div style={styles.filterGroupCheckbox}>
                <input
                    type="checkbox"
                    id="modalNewListing"
                    checked={isNewListingFilter}
                    onChange={(e) => setIsNewListingFilter(e.target.checked)}
                    style={styles.filterCheckbox}
                />
                <label htmlFor="modalNewListing" style={styles.filterLabel}>New Listings Only</label>
            </div>

            {/* Sort By */}
            <div style={styles.filterGroup(true)}>
              <label htmlFor="modalSortBy" style={styles.filterLabel}>Sort By:</label>
              <select
                id="modalSortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.filterSelect}
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
            <div style={styles.clearButtonContainer(true)}>
                <button onClick={clearFilters} style={styles.clearFiltersButton}>
                    Clear Filters
                </button>
            </div>
            <button style={styles.applyFiltersButton} onClick={() => setShowFiltersModal(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Inline Styles ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    color: '#343a40',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap', // Allow wrapping on smaller screens
    gap: '10px', // Space between elements when wrapped
  },
  userStatus: {
    backgroundColor: '#e9ecef',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#495057',
  },
  heading: (isTablet, isMobile) => ({
    textAlign: isMobile ? 'center' : 'left', // Align left on larger screens
    marginBottom: isMobile ? '15px' : '0',
    color: '#1a202c',
    fontSize: isMobile ? '2.2em' : (isTablet ? '2.8em' : '3.2em'),
    fontWeight: '800',
    textShadow: '0 2px 5px rgba(0,0,0,0.05)',
    flexGrow: 1, // Allow heading to take space
  }),
  subheading: (isMobile) => ({
    textAlign: 'center',
    marginBottom: '50px',
    color: '#4a5568',
    fontSize: isMobile ? '1em' : '1.2em',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto 50px auto',
  }),
  loadingText: {
    textAlign: 'center',
    fontSize: '1.4em',
    color: '#6c757d',
    paddingTop: '80px',
  },
  errorText: {
    textAlign: 'center',
    fontSize: '1.4em',
    color: '#dc3545',
    paddingTop: '80px',
  },
  controlsSection: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchBarContainer: (isMobile) => ({
    display: 'flex',
    gap: '15px',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
  }),
  searchInput: (isMobile) => ({
    flexGrow: 1,
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontSize: '1em',
    fontFamily: '"Inter", sans-serif',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    width: isMobile ? '100%' : 'auto',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
      outline: 'none',
    },
  }),
  filterToggleButton: {
    backgroundColor: '#607d8b',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    '&:hover': {
      backgroundColor: '#4a6572',
      transform: 'translateY(-2px)',
    },
  },
  desktopFiltersContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping on larger screens too if needed
    gap: '15px',
    flexGrow: 2, // Allow desktop filters to take up more space
    justifyContent: 'flex-end', // Align filters to the right
  },
  filtersAndSortContainer: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: '1fr', // Always 1 column in modal for simplicity
    gap: '20px',
    paddingTop: isMobile ? '0' : '20px', // No top padding if it's the modal
    borderTop: isMobile ? 'none' : '1px solid #edf2f7',
  }),
  filterGroup: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: '10px',
  }),
  priceRangeGroup: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'stretch',
    padding: '10px 0',
  },
  priceSliderWrapper: {
    position: 'relative',
    height: '40px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  priceSliderTrack: {
    position: 'relative',
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  priceSliderRange: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: '5px',
  },
  priceSliderThumb: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'grab',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
    zIndex: 2,
    '&:hover': {
      backgroundColor: '#0056b3',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      transform: 'translate(-50%, -50%) scale(1.1)',
    },
    '&:active': {
      cursor: 'grabbing',
    }
  },
  priceValueDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#343a40',
    fontSize: '0.9em',
  },
  filterGroupCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '0.95em',
    minWidth: '70px',
  },
  filterInput: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontSize: '0.95em',
    fontFamily: '"Inter", sans-serif',
    flexGrow: 1,
    minWidth: '80px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
      outline: 'none',
    },
  },
  filterSelect: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontSize: '0.95em',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: 'white',
    cursor: 'pointer',
    flexGrow: 1,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
      outline: 'none',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    },
  },
  filterCheckbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#007bff',
  },
  clearButtonContainer: (isMobile) => ({
    gridColumn: '1 / -1', // Span full width in modal too
    display: 'flex',
    justifyContent: 'center',
    marginTop: isMobile ? '10px' : '0',
  }),
  clearFiltersButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    '&:hover': {
      backgroundColor: '#c82333',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(220,53,69,0.3)',
    },
  },
  applyFiltersButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    marginTop: '20px', // Space from other filters
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    '&:hover': {
        backgroundColor: '#218838',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(40,167,69,0.3)',
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    animation: 'fadeInUpCard 0.6s ease-out forwards',
    opacity: 0,
    position: 'relative',
    '@keyframes fadeInUpCard': {
        'from': {
            opacity: 0,
            transform: 'translateY(30px)',
        },
        'to': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '&:hover': {
      transform: 'translateY(-10px) rotateZ(1deg)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
    },
  },
  newListingBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '0.8em',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderBottom: '1px solid #edf2f7',
    borderRadius: '12px 12px 0 0',
  },
  cardContent: {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '1.6em',
    margin: '0 0 10px 0',
    color: '#2d3748',
    fontWeight: '700',
  },
  cardLocation: {
    fontSize: '1em',
    margin: '0 0 12px 0',
    color: '#718096',
  },
  cardInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
    fontSize: '0.95em',
    color: '#4a5568',
  },
  cardInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  icon: {
    fontSize: '1.2em',
    lineHeight: '1',
  },
  cardPrice: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#4a5568',
  },
  priceHighlight: {
    color: '#007bff',
    textShadow: '0 1px 2px rgba(0,123,255,0.1)',
  },
  viewDetailsButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.05em',
    fontWeight: '600',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 10px rgba(0,123,255,0.3)',
    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: '0 8px 15px rgba(0,123,255,0.4)',
    },
  },
  emptyState: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#7f8c8d',
    padding: '50px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e9e9e9',
    marginTop: '30px',
  },
  // --- Filter Modal Styles ---
  filterModalOverlay: (isOpen) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isOpen ? 'block' : 'none', // Control display with isOpen
    zIndex: 999,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isOpen ? 1 : 0,
  }),
  filterModalContent: (isOpen) => ({
    position: 'fixed',
    top: 0,
    right: isOpen ? '0' : '-350px', // Slide in from right
    width: '300px', // Fixed width for the modal
    maxWidth: '90%',
    height: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '-4px 0 15px rgba(0,0,0,0.2)',
    zIndex: 1000,
    transition: 'right 0.3s ease-in-out', // Slide animation
    display: 'flex',
    flexDirection: 'column',
    padding: '25px',
    boxSizing: 'border-box',
    overflowY: 'auto', // Enable scrolling if content overflows
  }),
  filterModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  filterModalCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8em', // Larger close button
    cursor: 'pointer',
    color: '#90a4ae',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#607d8b',
    },
  },
  filterModalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
};
