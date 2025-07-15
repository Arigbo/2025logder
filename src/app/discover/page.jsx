'use client'
// pages/discover.js
import { useEffect, useState, useCallback, useRef } from 'react';

// --- Utility Function to Simulate API Call ---
async function fetchApartments() {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return dummy apartment data with more details
  return [
    { id: '1', name: 'Cozy Studio near University A', location: 'University Avenue', price: 150000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x280/F0F4F8/333333?text=Apartment+1' },
    { id: '2', name: 'Spacious 2-Bedroom near Tech Campus', location: 'Innovation Hub', price: 280000, bedrooms: 2, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x280/E8EEF2/333333?text=Apartment+2' },
    { id: '3', name: 'Modern Loft in Downtown', location: 'City Center', price: 200000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x280/E0E7EB/333333?text=Apartment+3' },
    { id: '4', name: 'Affordable Room in Shared House', location: 'Student District', price: 80000, bedrooms: 1, bathrooms: 0, isNewListing: false, imageUrl: 'https://placehold.co/400x280/D8E0E4/333333?text=Apartment+4' },
    { id: '5', name: 'Bright 3-Bedroom Family Home', location: 'Quiet Suburb', price: 350000, bedrooms: 3, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x280/D0D8DC/333333?text=Apartment+5' },
    { id: '6', name: 'Compact Studio near Arts College', location: 'Bohemian Quarter', price: 120000, bedrooms: 1, bathrooms: 1, isNewListing: true, imageUrl: 'https://placehold.co/400x280/C8D0D4/333333?text=Apartment+6' },
    { id: '7', name: 'Large 4-Bedroom House with Garden', location: 'Greenwich Estate', price: 550000, bedrooms: 4, bathrooms: 3, isNewListing: false, imageUrl: 'https://placehold.co/400x280/C0C8CC/333333?text=Apartment+7' },
    { id: '8', name: 'Executive 2-Bedroom Apartment', location: 'Business District', price: 400000, bedrooms: 2, bathrooms: 2, isNewListing: false, imageUrl: 'https://placehold.co/400x280/B8C0C4/333333?text=Apartment+8' },
    { id: '9', name: 'Quaint 1-Bedroom Cottage', location: 'Riverside Village', price: 100000, bedrooms: 1, bathrooms: 1, isNewListing: false, imageUrl: 'https://placehold.co/400x280/B0B8BC/333333?text=Apartment+9' },
    { id: '10', name: 'Modern 3-Bedroom Townhouse', location: 'City Center', price: 450000, bedrooms: 3, bathrooms: 2, isNewListing: true, imageUrl: 'https://placehold.co/400x280/A8B0B4/333333?text=Apartment+10' },
    { id: '11', name: 'Spacious 5-Bedroom Villa', location: 'Quiet Suburb', price: 800000, bedrooms: 5, bathrooms: 4, isNewListing: false, imageUrl: 'https://placehold.co/400x280/A0A8AC/333333?text=Apartment+11' },
    { id: '12', name: 'Compact 1-Bedroom Flat', location: 'Student District', price: 95000, bedrooms: 1, bathrooms: 1, isNewListing: false, imageUrl: 'https://placehold.co/400x280/98A0A4/333333?text=Apartment+12' },
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
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile navigation menu
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State for user dropdown
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for sidebar collapse
  const [theme, setTheme] = useState('light'); // New state for theme


  // User Status State (simulated)
  const [userStatus, setUserStatus] = useState('Guest'); // Default to Guest
  const [userAvatar, setUserAvatar] = useState('https://placehold.co/40x40/cccccc/ffffff?text=U'); // Placeholder avatar

  // Price Slider specific states and refs
  const priceRangeRef = useRef(null);
  const userDropdownRef = useRef(null); // Ref for user dropdown
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
  const isTablet = windowWidth <= 768; // Used for showing filter button on tablets too


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

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed-mode' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Universal box-sizing for consistent layout */
        * {
          box-sizing: border-box;
        }

        :root {
          --primary-color: #4CAF50; /* Green */
          --primary-dark: #388E3C;
          --secondary-color: #2196F3; /* Blue */
          --text-dark: #333;
          --text-medium: #555;
          --text-light: #777;
          --bg-main: #f9f9f9;
          --bg-element: #ffffff;
          --border-light: #eee;
          --shadow-subtle: rgba(0, 0, 0, 0.05);
          --shadow-medium: rgba(0, 0, 0, 0.1);
        }

        .dark-theme {
          --primary-color: #66BB6A; /* Lighter green for dark mode */
          --primary-dark: #4CAF50;
          --secondary-color: #64B5F6; /* Lighter blue for dark mode */
          --text-dark: #E0E0E0; /* Light gray text */
          --text-medium: #B0B0B0;
          --text-light: #888888;
          --bg-main: #2C2C2C; /* Dark background */
          --bg-element: #1E1E1E; /* Darker background for elements */
          --border-light: #444444;
          --shadow-subtle: rgba(0, 0, 0, 0.2);
          --shadow-medium: rgba(0, 0, 0, 0.4);
        }

        body, html, #__next {
          height: 100%;
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-main);
          color: var(--text-dark);
          line-height: 1.6;
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

        /* Responsive Header (Top Bar) */
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

        /* Mobile specific header elements */
        .responsive-header .mobile-only {
          display: flex; /* Show mobile elements by default */
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

        /* Desktop specific header elements (hidden by default, shown via media query) */
        .responsive-header .desktop-header-content {
          display: none; /* Hidden by default */
        }

        /* Common user status styling */
        .nav-user-status {
          background-color: var(--bg-main); /* Adjusted for theme */
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
          background-color: var(--bg-element); /* Adjusted for theme */
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
          background-color: var(--bg-main); /* Adjusted for theme */
          color: var(--primary-color);
        }
        .user-dropdown-item.theme-toggle-button {
          background: none;
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
        }
        .user-dropdown-item.theme-toggle-button:hover {
          background-color: var(--bg-main); /* Adjusted for theme */
        }


        /* Sidebar Navigation */
        .app-sidebar {
          grid-column: 1;
          grid-row: 1 / -1; /* Spans from header to end of content */
          background-color: var(--bg-element); /* Adjusted for theme */
          width: 250px; /* Fixed width for sidebar */
          padding: 20px;
          box-shadow: 2px 0 8px var(--shadow-subtle);
          display: none; /* Hidden by default for mobile, shown on desktop */
          flex-direction: column;
          gap: 30px;
          flex-shrink: 0;
          border-right: 1px solid var(--border-light);
          overflow-y: auto; /* Enable scrolling for long sidebars */
          transition: width 0.3s ease, padding 0.3s ease; /* Smooth transition for sidebar itself */
          position: relative; /* For positioning toggle button */
        }
        .app-sidebar .navbar-brand {
          font-size: 1.8em;
          font-weight: 800;
          color: var(--primary-color);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px; /* Space below brand */
          white-space: nowrap;
          overflow: hidden; /* Hide overflow during transition */
          transition: all 0.3s ease;
          justify-content: flex-start; /* Default alignment */
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
          overflow: hidden; /* Hide overflow during transition */
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
        .app-sidebar .nav-link .link-text { /* Added for explicit control over text */
            transition: opacity 0.3s ease, width 0.3s ease;
            overflow: hidden;
            white-space: nowrap;
        }


        /* Sidebar Toggle Button */
        .sidebar-toggle-button {
          position: absolute;
          bottom: 20px; /* Moved to bottom */
          right: 10px; /* Position inside sidebar */
          background-color: transparent; /* Removed background */
          color: var(--text-medium); /* Changed color to blend */
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: none; /* Removed shadow */
          transition: all 0.3s ease;
          z-index: 10;
        }
        .sidebar-toggle-button:hover {
          background-color: var(--border-light); /* Subtle hover effect */
          color: var(--primary-color);
          transform: scale(1.1); /* Slightly larger scale on hover */
        }
        .sidebar-toggle-button .icon {
          font-size: 1.2em;
          transition: transform 0.3s ease;
        }


        /* Main Content Area */
        .main-content {
          grid-column: 1; /* Default to single column for mobile */
          grid-row: 2; /* Below the header for mobile */
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px;
          background-color: var(--bg-main);
        }

        /* Controls Section */
        .controls-section {
          background-color: var(--bg-element); /* Adjusted for theme */
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
          border: 1px solid var(--input-border); /* Adjusted for theme */
          font-size: 1em;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          min-width: unset;
          box-shadow: inset 0 1px 3px var(--shadow-subtle);
          background-color: var(--input-bg); /* Adjusted for theme */
          color: var(--text-dark); /* Adjusted for theme */
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
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .filter-label {
          font-weight: 500;
          color: var(--text-medium);
          font-size: 0.9em;
        }
        .filter-select {
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--input-border); /* Adjusted for theme */
          font-size: 0.9em;
          font-family: 'Inter', sans-serif;
          background-color: var(--input-bg); /* Adjusted for theme */
          color: var(--text-dark); /* Adjusted for theme */
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
        .filter-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: var(--primary-color);
          border-radius: 3px;
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
          background-color: var(--border-light); /* Adjusted for theme */
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
          border: 2px solid var(--bg-element); /* Adjusted for theme */
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

        /* Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        /* Card */
        .card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--card-border); /* Adjusted for theme */
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          background-color: var(--bg-element); /* Adjusted for theme */
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
          border-bottom: 1px solid var(--card-border); /* Adjusted for theme */
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

        /* Empty State */
        .empty-state {
          text-align: center;
          font-size: 1em;
          color: var(--text-light);
          padding: 50px 20px;
          background-color: var(--bg-element); /* Adjusted for theme */
          border-radius: var(--border-radius-lg);
          box-shadow: 0 4px 12px var(--shadow-subtle);
          margin-top: 40px;
        }

        /* Filter Modal */
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
          background-color: var(--bg-element); /* Adjusted for theme */
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
          background-color: var(--bg-main); /* Adjusted for theme */
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
          background-color: #f44336; /* Red */
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

        /* Mobile Navigation Menu (Overlay) */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: flex-start; /* Align to left for sidebar effect */
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
          background-color: var(--bg-element); /* Adjusted for theme */
          padding: 30px;
          border-radius: var(--border-radius-lg); /* Maintain rounded corners */
          width: 80%;
          max-width: 300px; /* Max width for mobile sidebar */
          height: 100%; /* Full height */
          box-shadow: 0 10px 30px var(--shadow-medium);
          transform: translateX(-100%); /* Start off-screen */
          opacity: 0;
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .mobile-menu-overlay.show .mobile-menu-content {
          transform: translateX(0); /* Slide in */
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
          background-color: var(--bg-main); /* Adjusted for theme */
        }
        .mobile-nav-user-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: var(--primary-dark);
          background-color: var(--bg-main); /* Adjusted for theme */
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


        /* Responsive adjustments */
        @media (min-width: 769px) {
          .app-container {
            grid-template-columns: 250px 1fr; /* Sidebar width + main content */
            transition: grid-template-columns 0.3s ease; /* Smooth transition for grid */
          }
          .app-container.sidebar-collapsed-mode { /* New class for collapsed state */
            grid-template-columns: 60px 1fr; /* Desktop collapsed */
          }

          .responsive-header {
            grid-column: 2 / -1; /* Header spans main content area */
            justify-content: flex-end; /* Push title/user status to right */
          }
          .responsive-header .mobile-only {
            display: none; /* Hide mobile elements on desktop */
          }
          .responsive-header .desktop-header-content {
            display: flex; /* Show desktop header content */
            flex-grow: 1; /* Allow title to take space */
            justify-content: center; /* Center title */
          }
          .responsive-header .app-header-title {
            text-align: center; /* Center title in desktop header */
            margin-left: 0; /* Reset margin */
          }
          .responsive-header .nav-user-status {
            margin-left: auto; /* Push to the right */
          }

          .app-sidebar {
            display: flex; /* Show sidebar on desktop */
          }
          .app-container.sidebar-collapsed-mode .app-sidebar {
            width: 60px;
            padding: 20px 10px; /* Adjust padding for collapsed state */
          }
          .app-container.sidebar-collapsed-mode .app-sidebar .navbar-brand {
            justify-content: center; /* Ensure centered when collapsed */
            width: 40px; /* Limit width */
            margin: 0 auto 20px auto; /* Center and keep margin */
          }
          .app-container.sidebar-collapsed-mode .app-sidebar .navbar-brand span:not(.logo-icon) {
            opacity: 0; /* Fade out text */
            width: 0; /* Collapse width to hide text */
            overflow: hidden; /* Ensure text doesn't wrap */
            transition: opacity 0.3s ease, width 0.3s ease;
          }
          .app-container.sidebar-collapsed-mode .app-sidebar .nav-link {
            justify-content: center; /* Center icon when collapsed */
            padding: 10px 0; /* Adjust padding */
          }
          .app-container.sidebar-collapsed-mode .app-sidebar .nav-link .link-text {
            opacity: 0;
            width: 0; /* Collapse width to hide text */
            overflow: hidden; /* Ensure text doesn't wrap */
            transition: opacity 0.3s ease, width 0.3s ease;
          }
          .app-container.sidebar-collapsed-mode .sidebar-toggle-button .icon {
            transform: rotate(180deg); /* Rotate arrow when collapsed */
          }


          .main-content {
            grid-column: 2; /* Main content is in the second column */
            grid-row: 2; /* Below the header */
          }

          .filter-toggle-button {
            display: none; /* Hide filter button on desktop */
          }
          .desktop-filters-container {
            display: flex; /* Show desktop filters */
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
              {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
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
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            {isTablet && (
              <button
                className="filter-toggle-button"
                onClick={() => setShowFiltersModal(true)}
              >
                <svg className="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor"/>
                </svg>
              </button>
            )}
            {!isTablet && (
              <div className="desktop-filters-container">
                <div className="filter-group">
                  <label htmlFor="location" className="filter-label">Location:</label>
                  <select
                    id="location"
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

                <div className="filter-group">
                  <label htmlFor="bedrooms" className="filter-label">Beds:</label>
                  <select
                    id="bedrooms"
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

                <div className="filter-group">
                  <label htmlFor="bathrooms" className="filter-label">Baths:</label>
                  <select
                    id="bathrooms"
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

                <div className="filter-group">
                  <label htmlFor="sortBy" className="filter-label">Sort By:</label>
                  <select
                    id="sortBy"
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
              <a key={apartment.id} href={`/discover/${apartment.id}`} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
                  {apartment.isNewListing && <div className="new-listing-badge">✨ New Listing</div>}
                  <img
                    src={apartment.imageUrl}
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
                </a>
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <div className={`filter-modal-overlay ${showFiltersModal ? 'show' : ''}`} onClick={() => setShowFiltersModal(false)}>
        <div className={`filter-modal-content ${showFiltersModal ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="filter-modal-header">
            <h3>Filter Options</h3>
            <button className="filter-modal-close-button" onClick={() => setShowFiltersModal(false)}>
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
                  ></div>
                  <div
                    className="price-slider-thumb"
                    style={{ left: `${getPercentage(maxPriceSlider)}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'max')}
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
            <div className="filter-group-checkbox">
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
  );
}
