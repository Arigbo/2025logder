'use client'
// pages/discover.js
import { useEffect, useState, useCallback, useRef } from 'react';
// Removed Swiper imports to resolve compilation errors
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';

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
      ],
      agentName: 'Alice Johnson', agentPhone: '+2348011122233', agentImage: 'https://placehold.co/60x60/66BB6A/ffffff?text=AJ',
      propertyType: 'Studio', amenities: ['WiFi', 'Parking'], datePosted: new Date('2025-07-14T10:00:00Z'),
      description: "A charming studio apartment perfect for students or young professionals. Located just steps away from University A, it features a compact yet functional layout with ample natural light. Includes a modern kitchenette, a cozy sleeping area, and a private bathroom. Excellent transport links and local cafes are within easy reach."
    },
    { id: '2', name: 'Spacious 2-Bedroom near Tech Campus', location: 'Innovation Hub', price: 280000, bedrooms: 2, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+1',
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+2',
        'https://placehold.co/600x400/E8EEF2/333333?text=Apartment+2+-+Pic+3',
      ],
      agentName: 'Bob Williams', agentPhone: '+2348044455566', agentImage: 'https://placehold.co/60x60/42A5F5/ffffff?text=BW',
      propertyType: 'Apartment', amenities: ['Gym', 'Pool', 'WiFi'], datePosted: new Date('2025-07-10T14:30:00Z'),
      description: "Discover this spacious two-bedroom apartment, ideally situated near the bustling Innovation Hub and Tech Campus. It boasts two generous bathrooms, a large open-plan living area, and a fully equipped kitchen. Residents enjoy access to premium building amenities including a state-of-the-art gym and a refreshing swimming pool. Perfect for tech professionals seeking convenience and comfort."
    },
    { id: '3', name: 'Modern Loft in Downtown', location: 'City Center', price: 200000, bedrooms: 1, bathrooms: 1, isNewListing: true,
      images: [
        'https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+1',
        'https://placehold.co/600x400/E0E7EB/333333?text=Apartment+3+-+Pic+2',
      ],
      agentName: 'Charlie Davis', agentPhone: '+2348077788899', agentImage: 'https://placehold.co/60x60/FF7043/ffffff?text=CD',
      propertyType: 'Condo', amenities: ['Parking', 'Security'], datePosted: new Date('2025-07-15T08:00:00Z'),
      description: "Experience urban living at its finest in this modern loft located in the heart of the City Center. This one-bedroom, one-bathroom condo features high ceilings, exposed brick accents, and large windows offering stunning city views. Comes with secure parking and 24/7 security, providing peace of mind. Enjoy vibrant nightlife, dining, and cultural attractions just outside your door."
    },
    { id: '4', name: 'Affordable Room in Shared House', location: 'Student District', price: 80000, bedrooms: 1, bathrooms: 0, isNewListing: false,
      images: [
        'https://placehold.co/600x400/D8E0E4/333333?text=Apartment+4+-+Pic+1',
      ],
      agentName: 'Diana Miller', agentPhone: '+2348012398765', agentImage: 'https://placehold.co/60x60/9E9E9E/ffffff?text=DM',
      propertyType: 'Shared Room', amenities: ['WiFi'], datePosted: new Date('2025-07-01T18:00:00Z'),
      description: "An excellent opportunity for students seeking affordable accommodation in a lively student district. This private room in a shared house offers a comfortable living space with access to communal kitchen and bathroom facilities. High-speed WiFi is included, making it ideal for studies and entertainment. Close to campus and public transport."
    },
    { id: '5', name: 'Bright 3-Bedroom Family Home', location: 'Quiet Suburb', price: 350000, bedrooms: 3, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+1',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+2',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+3',
        'https://placehold.co/600x400/D0D8DC/333333?text=Apartment+5+-+Pic+4',
      ],
      agentName: 'Eve Brown', agentPhone: '+2348045678901', agentImage: 'https://placehold.co/60x60/616161/ffffff?text=EB',
      propertyType: 'House', amenities: ['Garden', 'Parking'], datePosted: new Date('2025-06-25T09:00:00Z'),
      description: "This bright and spacious three-bedroom family home is nestled in a quiet, family-friendly suburb. Featuring two modern bathrooms, a generous garden perfect for outdoor activities, and ample parking space. The interior boasts large living areas and a contemporary kitchen. Enjoy peaceful living with easy access to schools and parks."
    },
    { id: '6', name: 'Compact Studio near Arts College', location: 'Bohemian Quarter', price: 120000, bedrooms: 1, bathrooms: 1, isNewListing: true,
      images: [
        'https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+1',
        'https://placehold.co/600x400/C8D0D4/333333?text=Apartment+6+-+Pic+2',
      ],
      agentName: 'Frank White', agentPhone: '+2348078901234', agentImage: 'https://placehold.co/60x60/212121/ffffff?text=FW',
      propertyType: 'Studio', amenities: ['WiFi'], datePosted: new Date('2025-07-13T16:00:00Z'),
      description: "A compact and stylish studio apartment situated in the vibrant Bohemian Quarter, perfect for art students or creative individuals. This unit offers a smart use of space with integrated living and sleeping areas, a sleek kitchenette, and a private shower room. Enjoy the artistic atmosphere and numerous galleries and cafes nearby. WiFi included for convenience."
    },
    { id: '7', name: 'Large 4-Bedroom House with Garden', location: 'Greenwich Estate', price: 550000, bedrooms: 4, bathrooms: 3, isNewListing: false,
      images: [
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+1',
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+2',
        'https://placehold.co/600x400/C0C8CC/333333?text=Apartment+7+-+Pic+3',
      ],
      agentName: 'Grace Green', agentPhone: '+2348090123456', agentImage: 'https://placehold.co/60x60/66BB6A/ffffff?text=GG',
      propertyType: 'House', amenities: ['Garden', 'Parking', 'Pet-Friendly'], datePosted: new Date('2025-06-10T11:00:00Z'),
      description: "An expansive four-bedroom house located in the prestigious Greenwich Estate, offering luxurious family living. This home features three full bathrooms, a sprawling private garden, and ample parking. It's a pet-friendly property, ensuring your furry friends are welcome. Ideal for large families seeking space, comfort, and tranquility in a prime location."
    },
    { id: '8', name: 'Executive 2-Bedroom Apartment', location: 'Business District', price: 400000, bedrooms: 2, bathrooms: 2, isNewListing: false,
      images: [
        'https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+1',
        'https://placehold.co/600x400/B8C0C4/333333?text=Apartment+8+-+Pic+2',
      ],
      agentName: 'Henry King', agentPhone: '+2348023456789', agentImage: 'https://placehold.co/60x60/42A5F5/ffffff?text=HK',
      propertyType: 'Apartment', amenities: ['Gym', 'Security'], datePosted: new Date('2025-07-05T09:00:00Z'),
      description: "A premium two-bedroom, two-bathroom executive apartment in the heart of the Business District. This unit offers sophisticated living with high-end finishes, a modern kitchen, and spacious bedrooms. Building amenities include a fully equipped gym and round-the-clock security, providing a safe and convenient lifestyle for busy professionals."
    },
    { id: '9', name: 'Quaint 1-Bedroom Cottage', location: 'Riverside Village', price: 100000, bedrooms: 1, bathrooms: 1, isNewListing: false,
      images: [
        'https://placehold.co/600x400/B0B8BC/333333?text=Apartment+9+-+Pic+1',
      ],
      agentName: 'Ivy Lee', agentPhone: '+2348056789012', agentImage: 'https://placehold.co/60x60/FF7043/ffffff?text=IL',
      propertyType: 'House', amenities: ['Garden'], datePosted: new Date('2025-07-12T13:00:00Z'),
      description: "Escape to this quaint one-bedroom cottage nestled in the picturesque Riverside Village. This charming home features a cozy living area, a compact kitchen, and a private garden, perfect for relaxation. Enjoy the tranquility of village life with scenic river views and easy access to nature trails. Ideal for singles or couples seeking a peaceful retreat."
    },
    { id: '10', name: 'Modern 3-Bedroom Townhouse', location: 'City Center', price: 450000, bedrooms: 3, bathrooms: 2, isNewListing: true,
      images: [
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+1',
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+2',
        'https://placehold.co/600x400/A8B0B4/333333?text=Apartment+10+-+Pic+3',
      ],
      agentName: 'Jack Chan', agentPhone: '+2348089012345', agentImage: 'https://placehold.co/60x60/9E9E9E/ffffff?text=JC',
      propertyType: 'Townhouse', amenities: ['Parking', 'WiFi'], datePosted: new Date('2025-07-15T18:00:00Z'),
      description: "A newly listed modern three-bedroom townhouse located conveniently in the City Center. This multi-level home offers two full bathrooms, spacious living areas, and a contemporary kitchen. Includes private parking and high-speed WiFi. Enjoy the benefits of urban living with ample space and modern comforts, perfect for families or roommates."
    },
    { id: '11', name: 'Spacious 5-Bedroom Villa', location: 'Quiet Suburb', price: 800000, bedrooms: 5, bathrooms: 4, isNewListing: false,
      images: [
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+1',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+2',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+3',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+4',
        'https://placehold.co/600x400/A0A8AC/333333?text=Apartment+11+-+Pic+5',
      ],
      agentName: 'Karen Chen', agentPhone: '+2348012345670', agentImage: 'https://placehold.co/60x60/616161/ffffff?text=KC',
      propertyType: 'House', amenities: ['Pool', 'Garden', 'Security'], datePosted: new Date('2025-06-01T10:00:00Z'),
      description: "An exquisite five-bedroom villa offering unparalleled luxury in a serene, quiet suburb. This expansive property features four lavish bathrooms, a private swimming pool, a beautifully landscaped garden, and robust security systems. Ideal for large families or those who love to entertain, providing ample space and privacy. A true oasis of comfort and elegance."
    },
    { id: '12', name: 'Compact 1-Bedroom Flat', location: 'Student District', price: 95000, bedrooms: 1, bathrooms: 1, isNewListing: false,
      images: [
        'https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+1',
        'https://placehold.co/600x400/98A0A4/333333?text=Apartment+12+-+Pic+2',
      ],
      agentName: 'Leo Wong', agentPhone: '+2348098765432', agentImage: 'https://placehold.co/60x60/212121/ffffff?text=LW',
      propertyType: 'Apartment', amenities: ['WiFi'], datePosted: new Date('2025-07-08T15:00:00Z'),
      description: "A practical and compact one-bedroom flat, perfectly suited for students or single occupants in the bustling Student District. This unit offers a comfortable living space with a separate bedroom, a small kitchen, and a private bathroom. WiFi is available, ensuring connectivity for studies and leisure. Conveniently located near university facilities and local amenities."
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
      <h3 className="map-view-title">Map View (Coming Soon!)</h3>
      <p className="map-view-description">
        This section will feature an interactive map showing apartment locations.
        For now, here's a placeholder map image:
      </p>
      <img
        src="https://placehold.co/800x600/E0E7EB/333333?text=Interactive+Map+Placeholder"
        alt="Placeholder Map"
        className="map-placeholder-image"
      />
      <p className="map-view-note">Stay tuned for this exciting feature!</p>
    </div>
  );
};

// --- LoginModal Component (Simulated) ---
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      if (email === 'user@example.com' && password === 'password123') {
        setSuccess('Login successful!');
        onLoginSuccess({ name: 'John Doe', email: 'user@example.com' });
        setTimeout(onClose, 1500);
      } else {
        setError('Invalid email or password.');
      }
    } else { // Signup
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
      } else if (!name || !email || !password) {
        setError('Please fill in all fields.');
      } else {
        setSuccess('Signup successful! Please log in.');
        setIsLogin(true); // Switch to login tab after successful signup
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-modal-overlay show" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h3 id="login-modal-title">{isLogin ? 'Login' : 'Sign Up'}</h3>
          <button className="login-modal-close-button" onClick={onClose} aria-label="Close login/signup form">
            &#x2715;
          </button>
        </div>
        <div className="login-tabs">
          <button
            className={`login-tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`login-tab-button ${!isLogin ? 'active' : ''}`}
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
            <label htmlFor="loginEmail">{isLogin ? 'Email:' : 'Email:'}</label>
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
          <button type="submit" className="login-submit-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};


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
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('any'); // New state for property type
  const [amenitiesFilter, setAmenitiesFilter] = useState([]); // New state for amenities
  const [datePostedFilter, setDatePostedFilter] = useState('any'); // New state for date posted
  const [sortBy, setSortBy] = useState('name_asc');
  const [showFiltersModal, setShowFiltersModal] = useState(false); // State for filter modal visibility
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile navigation menu
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State for user dropdown
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse
  const [theme, setTheme] = useState('light'); // State for theme

  // New states for Apartment Details Modal/Page
  const [selectedApartment, setSelectedApartment] = useState(null); // Stores the apartment object for details view
  const [currentPage, setCurrentPage] = useState('list'); // 'list', 'details', 'map'
  const [showContactModal, setShowContactModal] = useState(false); // State for contact modal visibility
  const [showShareModal, setShowShareModal] = useState(false); // State for share modal visibility
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // New state for favorites filter
  const [bookmarkedApartments, setBookmarkedApartments] = useState([]); // Stores IDs of bookmarked apartments

  // User Status State (simulated)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [loggedInUser, setLoggedInUser] = useState(null); // Stores simulated user data
  const [userStatus, setUserStatus] = useState('Guest'); // Default to Guest
  const [userAvatar, setUserAvatar] = useState('https://placehold.co/40x40/cccccc/ffffff?text=U'); // Placeholder avatar
  const [userName, setUserName] = useState('John Doe'); // Simulated user name
  const [userEmail, setUserEmail] = useState('john.doe@example.com'); // Simulated user email
  const [userPhone, setuserPhone] = useState('+2348012345678'); // Simulated user phone
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal

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

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBookmarks = localStorage.getItem('lodgerBookmarks');
      if (storedBookmarks) {
        setBookmarkedApartments(JSON.parse(storedBookmarks));
      }
      const storedUser = localStorage.getItem('lodgerLoggedInUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);
        setIsLoggedIn(true);
        setUserStatus(user.name);
        setUserAvatar(`https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${user.name.charAt(0).toUpperCase()}`);
        setUserName(user.name);
        setUserEmail(user.email);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lodgerBookmarks', JSON.stringify(bookmarkedApartments));
    }
  }, [bookmarkedApartments]);

  // Toggle bookmark for an apartment
  const toggleBookmark = useCallback((apartmentId) => {
    setBookmarkedApartments(prevBookmarks => {
      if (prevBookmarks.includes(apartmentId)) {
        return prevBookmarks.filter(id => id !== apartmentId);
      } else {
        return [...prevBookmarks, apartmentId];
      }
    });
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

  // Updated responsive breakpoints
  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth > 640 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;


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

    // 0. Apply Favorites Filter (if enabled)
    if (showFavoritesOnly) {
      updatedApartments = updatedApartments.filter(apt => bookmarkedApartments.includes(apt.id));
    }

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

    // 7. Apply Property Type Filter
    if (propertyTypeFilter !== 'any') {
        updatedApartments = updatedApartments.filter(apt => apt.propertyType === propertyTypeFilter);
    }

    // 8. Apply Amenities Filter
    if (amenitiesFilter.length > 0) {
        updatedApartments = updatedApartments.filter(apt =>
            amenitiesFilter.every(amenity => apt.amenities && apt.amenities.includes(amenity))
        );
    }

    // 9. Apply Date Posted Filter
    if (datePostedFilter !== 'any') {
        const now = new Date();
        updatedApartments = updatedApartments.filter(apt => {
            const postedDate = new Date(apt.datePosted);
            const diffTime = Math.abs(now.getTime() - postedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

            if (datePostedFilter === '24h') {
                return diffDays <= 1;
            } else if (datePostedFilter === '7d') {
                return diffDays <= 7;
            } else if (datePostedFilter === '30d') {
                return diffDays <= 30;
            }
            return true;
        });
    }

    // 10. Apply Sorting
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
      } else if (sortBy === 'date_desc') { // New sort by date posted (newest first)
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      } else if (sortBy === 'date_asc') { // New sort by date posted (oldest first)
        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      }
      return 0; // No specific sort
    });

    setFilteredApartments(updatedApartments);
  }, [allApartments, searchTerm, minPrice, maxPrice, bedroomsFilter, bathroomsFilter, isNewListingFilter, locationFilter, propertyTypeFilter, amenitiesFilter, datePostedFilter, sortBy, showFavoritesOnly, bookmarkedApartments]);


  // Effect to re-apply filters and sort when filter/sort states change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort, searchTerm, minPrice, maxPrice, bedroomsFilter, bathroomsFilter, isNewListingFilter, locationFilter, propertyTypeFilter, amenitiesFilter, datePostedFilter, sortBy, showFavoritesOnly, bookmarkedApartments]);


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
    setPropertyTypeFilter('any'); // Reset new filter
    setAmenitiesFilter([]); // Reset new filter
    setDatePostedFilter('any'); // Reset new filter
    setSortBy('name_asc');
    setShowFavoritesOnly(false); // Clear favorites filter
  };

  const uniqueLocations = Array.from(new Set(allApartments.map(apt => apt.location)));
  const uniquePropertyTypes = Array.from(new Set(allApartments.map(apt => apt.propertyType)));
  const availableAmenities = ['WiFi', 'Parking', 'Gym', 'Pool', 'Garden', 'Security', 'Pet-Friendly']; // Define all possible amenities

  const handleAmenityChange = (amenity) => {
    setAmenitiesFilter(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Price slider logic (reverted to custom implementation)
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

  // Share Modal Component
  const ShareModal = ({ apartmentUrl, apartmentName, onClose }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopyLink = () => {
      const el = document.createElement('textarea');
      el.value = apartmentUrl;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        setCopySuccess('Link copied!');
      } catch (err) {
        setCopySuccess('Failed to copy link.');
        console.error('Failed to copy: ', err);
      }
      document.body.removeChild(el);
      setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    };

    const shareOptions = [
      {
        name: 'Copy Link',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
          </svg>
        ),
        onClick: handleCopyLink,
      },
      {
        name: 'WhatsApp',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.04 2C6.51 2 2 6.51 2 12.04C2 14.11 2.69 16.03 3.85 17.58L2.01 22L6.64 20.59C8.07 21.43 9.9 22 12.04 22C17.57 22 22.08 17.49 22.08 12.04C22.08 6.51 17.57 2 12.04 2ZM17.28 16.48C17.04 16.92 16.14 17.42 15.65 17.5C15.16 17.58 14.49 17.62 11.72 16.48C8.95 15.34 7.21 12.98 7.04 12.72C6.87 12.46 6.19 11.56 6.19 10.74C6.19 9.92 6.77 9.68 7.04 9.42C7.31 9.16 7.6 9.07 7.78 8.89C7.96 8.71 8.04 8.62 8.13 8.44C8.21 8.26 8.13 8.17 8.04 7.99C7.96 7.81 7.31 6.26 7.04 5.61C6.77 4.96 6.51 5.04 6.24 5.04C5.97 5.04 5.61 5.04 5.34 5.04C5.07 5.04 4.62 5.13 4.26 5.5C3.9 5.86 2.99 6.76 2.99 8.5C2.99 10.24 4.26 11.98 4.44 12.25C4.62 12.52 6.87 15.86 10.04 17.21C12.55 18.3 12.91 18.17 13.59 18.17C14.27 18.17 14.73 18.08 15.18 17.81C15.63 17.54 16.62 16.92 16.98 16.48C17.34 16.04 17.42 15.86 17.5 15.77C17.58 15.69 17.58 15.51 17.28 16.48Z"/>
          </svg>
        ),
        href: `whatsapp://send?text=Check out this apartment: ${apartmentName} - ${encodeURIComponent(apartmentUrl)}`,
      },
      {
        name: 'Email',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/>
          </svg>
        ),
        href: `mailto:?subject=Check out this apartment!&body=I found this apartment on Lodger and thought you might like it: ${apartmentName} - ${encodeURIComponent(apartmentUrl)}`,
      },
      {
        name: 'Twitter',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.51 7.6 3.68 5.14c-.36.62-.56 1.35-.56 2.13 0 1.49.75 2.81 1.91 3.56-.7-.02-1.36-.21-1.93-.53v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.71 2.14 2.95 4.03 2.98-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C3.17 20.37 5.56 21 8 21c8.49 0 13.13-7.01 13.13-13.13 0-.2-.01-.4-.02-.6.9-.65 1.68-1.47 2.3-2.4z"/>
          </svg>
        ),
        href: `https://twitter.com/intent/tweet?text=Check out this apartment: ${apartmentName}&url=${encodeURIComponent(apartmentUrl)}`,
      },
    ];

    return (
      <div className="share-modal-overlay show" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
        <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="share-modal-header">
            <h3 id="share-modal-title">Share Apartment</h3>
            <button className="share-modal-close-button" onClick={onClose} aria-label="Close share options">
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
  const ApartmentDetailsView = ({ apartment, onClose, onBackToListings, isMobileView, onContactAgentClick, onToggleBookmark, isBookmarked }) => {
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

          {/* Custom Image Slider */}
          <div className="apartment-image-slider">
            <img
              src={apartment.images[currentImageIndex]}
              alt={`${apartment.name} - Image ${currentImageIndex + 1}`}
              className="apartment-details-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/FF0000/FFFFFF?text=IMAGE+LOAD+FAILED'; // More distinct fallback
              }}
            />
            {apartment.images.length > 1 && (
              <>
                <button className="slider-arrow left-arrow" onClick={handlePrevImage} aria-label="Previous image">
                  &lt;
                </button>
                <button className="slider-arrow right-arrow" onClick={handleNextImage} aria-label="Next image">
                  &gt;
                </button>
                <div className="slider-dots">
                  {apartment.images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
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
                    className={`icon-button ${isBookmarked ? 'bookmarked' : ''}`}
                    aria-label="Bookmark apartment"
                    onClick={() => onToggleBookmark(apartment.id)}
                >
                    <svg viewBox="0 0 24 24" fill={isBookmarked ? "var(--primary-color)" : "currentColor"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.89543 3 5 3.89543 5 5V21L12 18L19 21V5C19 3.89543 18.1046 3 17 3Z"/>
                    </svg>
                </button>
                <button className="icon-button" aria-label="Share apartment" onClick={() => setShowShareModal(true)}>
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
              {apartment.description}
            </p>

            {/* Amenities List */}
            {apartment.amenities && apartment.amenities.length > 0 && (
                <div className="apartment-amenities">
                    <h4>Amenities:</h4>
                    <ul>
                        {apartment.amenities.map((amenity, index) => (
                            <li key={index}>
                                <svg className="amenity-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {amenity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Floor Plans/Virtual Tours Placeholders */}
            <div className="tour-buttons">
                <button className="tour-button">View Floor Plan</button>
                <button className="tour-button">Take Virtual Tour</button>
            </div>

            <button className="apartment-details-contact-button" onClick={onContactAgentClick}>Contact Agent</button>
          </div>
        </div>
      </div>
    );
  };

  // New Contact Agent Modal Component
  const ContactAgentModal = ({ apartmentName, onClose, userName, userEmail, userPhone, agentName, agentPhone, agentImage }) => {
    const [name, setName] = useState(userName || '');
    const [email, setEmail] = useState(userEmail || '');
    const [phone, setPhone] = useState(userPhone || ''); // New phone state
    const [message, setMessage] = useState('');
    const [preferredDate, setPreferredDate] = useState(''); // New state for preferred date
    const [preferredTime, setPreferredTime] = useState(''); // New state for preferred time
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
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        if (name && email && phone && message && preferredDate && preferredTime) { // Basic validation including phone, date, and time
          setSendSuccess(true);
          // In a real app, you'd send this data to a backend
          console.log('Message Sent:', { name, email, phone, message, apartmentName, agentName, agentPhone, preferredDate, preferredTime });
          // Optionally clear form fields after success
          setName(userName || ''); // Reset to initial user data
          setEmail(userEmail || '');
          setPhone(userPhone || '');
          setMessage('');
          setPreferredDate('');
          setPreferredTime('');
        } else {
          throw new Error('Please fill in all required fields (Name, Email, Phone, Message, Preferred Date, Preferred Time).');
        }
      } catch (err) {
        setSendError(err.message || 'Failed to send message.');
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div className="contact-modal-overlay show" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="contact-modal-header">
            <h3 id="contact-modal-title">Contact Agent for {apartmentName}</h3>
            <button className="contact-modal-close-button" onClick={onClose} aria-label="Close contact form">
              &#x2715;
            </button>
          </div>

          {/* Agent Information */}
          <div className="agent-info-section">
            <img src={agentImage} alt={agentName} className="agent-avatar" onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/60x60/cccccc/ffffff?text=AG';
            }}/>
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
              <p className="phone-instruction">Please provide an active WhatsApp number.</p>
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
            {sendSuccess && <p className="send-success-message">Message sent successfully!</p>}
            {sendError && <p className="send-error-message">Error: {sendError}</p>}
            <button type="submit" className="send-message-button" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
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
      {/* Render the main app container if not on a mobile details page or map view */}
      {!(currentPage === 'details' && isMobile) && currentPage !== 'map' && (
        <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed-mode' : ''}`}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

            /* Removed Swiper CSS imports */
            /* @import 'swiper/swiper-bundle.min.css'; */
            /* @import 'swiper/css'; */
            /* @import 'swiper/css/pagination'; */
            /* @import 'swiper/css/navigation'; */

            /* Swiper related styles are now for custom slider */
            .swiper {
              width: 100%;
              height: 100%;
            }

            .swiper-slide {
              text-align: center;
              font-size: 18px;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .swiper-slide img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .swiper-button-next,
            .swiper-button-prev {
              color: white; /* Make arrows visible on dark images */
              background-color: rgba(0, 0, 0, 0.5);
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.3s ease;
            }

            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              background-color: rgba(0, 0, 0, 0.7);
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 1.2em; /* Adjust arrow size */
            }

            .swiper-pagination-bullet {
              background-color: rgba(255, 255, 255, 0.6);
              opacity: 1;
            }

            .swiper-pagination-bullet-active {
              background-color: var(--primary-color);
            }

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
              --shadow-strong: rgba(0, 0, 0, 0.2);
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
              --shadow-strong: rgba(0, 0, 0, 0.6);
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
            .app-sidebar .nav-link.active {
                color: var(--primary-color);
                font-weight: 600;
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
            .app-sidebar .nav-link:hover::after,
            .app-sidebar .nav-link.active::after {
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
            .filter-toggle-button, .map-view-button {
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
            .filter-toggle-button .filter-icon, .map-view-button .map-icon {
              width: 20px;
              height: 20px;
              fill: currentColor;
            }
            .filter-toggle-button:hover, .map-view-button:hover {
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
              background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23495057'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3csvg%3e");
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
            .amenities-checkbox-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 10px;
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
            .mobile-nav-link.active {
                color: var(--primary-color);
                font-weight: 700;
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
                width: 100vw; /* Ensure full viewport width */
                height: 100vh; /* Ensure full viewport height */
                background-color: var(--bg-main);
                z-index: 1999;
                overflow-y: auto;
                overflow-x: hidden; /* Prevent horizontal scroll */
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }
            .apartment-details-page-content {
                background-color: var(--bg-element);
                width: 100%;
                max-width: 100%; /* Ensure it takes full width */
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
              /* Use aspect-ratio for responsive height */
              aspect-ratio: 16 / 9; /* Common aspect ratio for images */
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
            .icon-button.bookmarked svg {
                fill: var(--primary-color); /* Filled when bookmarked */
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
            .apartment-amenities {
                margin-top: 15px;
                margin-bottom: 25px;
            }
            .apartment-amenities h4 {
                font-size: 1.1em;
                color: var(--text-dark);
                margin-bottom: 10px;
            }
            .apartment-amenities ul {
                list-style: none;
                padding: 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
            }
            .apartment-amenities li {
                display: flex;
                align-items: center;
                font-size: 0.95em;
                color: var(--text-medium);
            }
            .amenity-check-icon {
                width: 18px;
                height: 18px;
                color: var(--primary-color);
                margin-right: 8px;
            }
            .tour-buttons {
                display: flex;
                gap: 15px;
                margin-bottom: 25px;
                flex-wrap: wrap;
            }
            .tour-button {
                background-color: var(--secondary-color);
                color: white;
                padding: 10px 20px;
                border-radius: var(--border-radius-md);
                border: none;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: all 0.2s ease;
                box-shadow: 0 2px 5px var(--shadow-subtle);
            }
            .tour-button:hover {
                background-color: #1976D2;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px var(--shadow-medium);
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

            /* --- Contact Modal Specific Styles --- */
            .contact-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2001; /* Higher z-index than apartment details modal */
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .contact-modal-overlay.show {
              opacity: 1;
              visibility: visible;
            }
            .contact-modal-content {
              background-color: var(--bg-element);
              border-radius: var(--border-radius-lg);
              padding: 30px;
              width: 90%;
              max-width: 500px;
              box-shadow: 0 15px 40px var(--shadow-strong);
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
            .contact-modal-overlay.show .contact-modal-content {
              transform: translateY(0);
              opacity: 1;
            }
            .contact-modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid var(--border-light);
            }
            .contact-modal-header h3 {
              margin: 0;
              font-size: 1.4em;
              color: var(--text-dark);
            }
            .contact-modal-close-button {
              background: none;
              border: none;
              font-size: 1.8em;
              color: var(--text-light);
              cursor: pointer;
              padding: 5px;
              border-radius: 50%;
              transition: all 0.2s ease;
            }
            .contact-modal-close-button:hover {
              color: var(--text-dark);
              transform: rotate(90deg);
            }
            .agent-info-section {
                display: flex;
                align-items: center;
                gap: 15px;
                background-color: var(--bg-main);
                padding: 15px;
                border-radius: var(--border-radius-md);
                border: 1px solid var(--border-light);
                margin-bottom: 15px;
            }
            .agent-avatar {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--primary-color);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .agent-details {
                display: flex;
                flex-direction: column;
            }
            .agent-name {
                font-size: 1.2em;
                font-weight: 700;
                color: var(--primary-dark);
                margin-bottom: 5px;
            }
            .agent-phone {
                font-size: 1em;
                color: var(--text-medium);
            }
            .contact-modal-form {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .form-group {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .form-group label {
              font-weight: 600;
              color: var(--text-medium);
              font-size: 0.95em;
            }
            .form-input, .form-textarea {
              padding: 10px 12px;
              border-radius: var(--border-radius-md);
              border: 1px solid var(--input-border);
              font-size: 1em;
              font-family: 'Inter', sans-serif;
              background-color: var(--input-bg);
              color: var(--text-dark);
              transition: all 0.2s ease;
            }
            .form-input:focus, .form-textarea:focus {
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
              outline: none;
            }
            .form-textarea {
              resize: vertical;
              min-height: 80px;
            }
            .send-message-button {
              background-color: var(--primary-color);
              color: white;
              padding: 12px 20px;
              border-radius: var(--border-radius-md);
              border: none;
              cursor: pointer;
              font-size: 1.1em;
              font-weight: 600;
              transition: all 0.2s ease;
              box-shadow: 0 2px 8px var(--shadow-subtle);
              margin-top: 10px;
            }
            .send-message-button:hover:not(:disabled) {
              background-color: var(--primary-dark);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px var(--shadow-medium);
            }
            .send-message-button:disabled {
              background-color: #B0B0B0;
              cursor: not-allowed;
            }
            .send-success-message {
              color: var(--primary-dark);
              font-weight: 600;
              text-align: center;
              margin-top: 10px;
            }
            .send-error-message {
              color: #D32F2F;
              font-weight: 600;
              text-align: center;
              margin-top: 10px;
            }
            .phone-instruction {
                font-size: 0.85em;
                color: var(--text-light);
                margin-top: 5px;
            }

            /* --- Share Modal Specific Styles --- */
            .share-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2002; /* Higher than contact modal */
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .share-modal-overlay.show {
              opacity: 1;
              visibility: visible;
            }
            .share-modal-content {
              background-color: var(--bg-element);
              border-radius: var(--border-radius-lg);
              padding: 30px;
              width: 90%;
              max-width: 450px;
              box-shadow: 0 15px 40px var(--shadow-strong);
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
            .share-modal-overlay.show .share-modal-content {
              transform: translateY(0);
              opacity: 1;
            }
            .share-modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid var(--border-light);
            }
            .share-modal-header h3 {
              margin: 0;
              font-size: 1.4em;
              color: var(--text-dark);
            }
            .share-modal-close-button {
              background: none;
              border: none;
              font-size: 1.8em;
              color: var(--text-light);
              cursor: pointer;
              padding: 5px;
              border-radius: 50%;
              transition: all 0.2s ease;
            }
            .share-modal-close-button:hover {
              color: var(--text-dark);
              transform: rotate(90deg);
            }
            .share-options-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 20px;
              justify-items: center;
            }
            .share-option-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-decoration: none;
              color: var(--text-medium);
              font-size: 0.9em;
              font-weight: 500;
              padding: 15px 10px;
              border-radius: var(--border-radius-md);
              transition: background-color 0.2s ease, transform 0.2s ease, color 0.2s ease;
              width: 100%;
              text-align: center;
            }
            .share-option-item:hover {
              background-color: var(--bg-main);
              color: var(--primary-color);
              transform: translateY(-3px);
            }
            .share-option-icon {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background-color: var(--border-light);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 10px;
              box-shadow: 0 2px 5px var(--shadow-subtle);
            }
            .share-option-item:hover .share-option-icon {
              background-color: var(--primary-color);
              color: white;
            }
            .share-option-icon svg {
              width: 28px;
              height: 28px;
              fill: currentColor;
            }
            .copy-success-message {
              color: var(--primary-dark);
              font-weight: 600;
              text-align: center;
              margin-top: 15px;
            }

            /* --- Map View Specific Styles --- */
            .map-view-container {
                background-color: var(--bg-element);
                padding: 30px;
                border-radius: var(--border-radius-lg);
                box-shadow: 0 4px 15px var(--shadow-medium);
                margin: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                text-align: center;
            }
            .map-view-back-button {
                background-color: transparent;
                border: none;
                color: var(--primary-color);
                font-size: 1.1em;
                font-weight: 600;
                padding: 10px 0;
                cursor: pointer;
                align-self: flex-start;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: color 0.2s ease, transform 0.2s ease;
            }
            .map-view-back-button:hover {
                color: var(--primary-dark);
                transform: translateX(-5px);
            }
            .map-view-title {
                font-size: 2em;
                color: var(--text-dark);
                margin-bottom: 10px;
            }
            .map-view-description {
                font-size: 1.1em;
                color: var(--text-medium);
                margin-bottom: 20px;
            }
            .map-placeholder-image {
                max-width: 100%;
                height: auto;
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-medium);
            }
            .map-view-note {
                font-style: italic;
                color: var(--text-light);
                margin-top: 10px;
            }

            /* --- Login Modal Specific Styles --- */
            .login-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2003; /* Highest z-index */
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .login-modal-overlay.show {
                opacity: 1;
                visibility: visible;
            }
            .login-modal-content {
                background-color: var(--bg-element);
                border-radius: var(--border-radius-lg);
                padding: 30px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 15px 40px var(--shadow-strong);
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
            .login-modal-overlay.show .login-modal-content {
                transform: translateY(0);
                opacity: 1;
            }
            .login-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--border-light);
            }
            .login-modal-header h3 {
                margin: 0;
                font-size: 1.4em;
                color: var(--text-dark);
            }
            .login-modal-close-button {
                background: none;
                border: none;
                font-size: 1.8em;
                color: var(--text-light);
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            .login-modal-close-button:hover {
                color: var(--text-dark);
                transform: rotate(90deg);
            }
            .login-tabs {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-light);
            }
            .login-tab-button {
                background: none;
                border: none;
                padding: 10px 20px;
                font-size: 1.1em;
                font-weight: 600;
                color: var(--text-medium);
                cursor: pointer;
                transition: color 0.2s ease, border-bottom 0.2s ease;
                border-bottom: 3px solid transparent;
            }
            .login-tab-button.active {
                color: var(--primary-color);
                border-bottom: 3px solid var(--primary-color);
            }
            .login-tab-button:hover {
                color: var(--primary-dark);
            }
            .login-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .login-error-message {
                color: #D32F2F;
                font-weight: 600;
                text-align: center;
                margin-top: 10px;
            }
            .login-success-message {
                color: var(--primary-dark);
                font-weight: 600;
                text-align: center;
                margin-top: 10px;
            }
            .login-submit-button {
                background-color: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: var(--border-radius-md);
                border: none;
                cursor: pointer;
                font-size: 1.1em;
                font-weight: 600;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px var(--shadow-subtle);
                margin-top: 10px;
            }
            .login-submit-button:hover:not(:disabled) {
                background-color: var(--primary-dark);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px var(--shadow-medium);
            }
            .login-submit-button:disabled {
                background-color: #B0B0B0;
                cursor: not-allowed;
            }


            /* --- Responsive Media Queries --- */

            /* Mobile (Default styles, up to 640px) */
            @media (max-width: 640px) {
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
                .search-bar-container {
                    flex-direction: column;
                    align-items: stretch;
                }
                .search-input {
                    padding: 8px 12px;
                    font-size: 0.9em;
                }
                .filter-toggle-button, .map-view-button {
                    padding: 8px 12px;
                    font-size: 0.85em;
                    width: 100%; /* Full width on mobile */
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
                .amenities-checkbox-grid {
                    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                }

                /* Apartment details full page on mobile */
                .apartment-details-page-overlay {
                    width: 100vw;
                    height: 100vh;
                    overflow-x: hidden; /* Prevent horizontal scroll */
                }
                .apartment-details-page-content {
                    width: 100%; /* Ensure it takes full width */
                    max-width: 100%; /* Prevent it from exceeding viewport width */
                    padding: 15px;
                    gap: 10px;
                    display: flex;
                    flex-direction: column;
                }
                .apartment-image-slider {
                    width: 100%; /* Ensure slider takes full width */
                    aspect-ratio: 16 / 9; /* Ensure aspect ratio is maintained */
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
                .apartment-amenities h4 {
                    font-size: 1em;
                }
                .apartment-amenities ul {
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                }
                .apartment-amenities li {
                    font-size: 0.85em;
                }
                .tour-buttons {
                    flex-direction: column;
                    gap: 10px;
                }
                .tour-button {
                    width: 100%;
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

                /* Contact Modal on Mobile */
                .contact-modal-content {
                    padding: 20px;
                    gap: 15px;
                }
                .contact-modal-header h3 {
                    font-size: 1.2em;
                }
                .contact-modal-close-button {
                    font-size: 1.4em;
                }
                .agent-info-section {
                    padding: 10px;
                    gap: 10px;
                }
                .agent-avatar {
                    width: 50px;
                    height: 50px;
                }
                .agent-name {
                    font-size: 1.1em;
                }
                .agent-phone {
                    font-size: 0.9em;
                }
                .form-group label {
                    font-size: 0.9em;
                }
                .form-input, .form-textarea {
                    padding: 8px 10px;
                    font-size: 0.9em;
                }
                .send-message-button {
                    padding: 10px 15px;
                    font-size: 1em;
                }

                /* Share Modal on Mobile */
                .share-modal-content {
                    padding: 20px;
                    gap: 15px;
                }
                .share-modal-header h3 {
                    font-size: 1.2em;
                }
                .share-modal-close-button {
                    font-size: 1.4em;
                }
                .share-options-grid {
                    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                    gap: 15px;
                }
                .share-option-item {
                    padding: 10px 5px;
                    font-size: 0.8em;
                }
                .share-option-icon {
                    width: 40px;
                    height: 40px;
                    margin-bottom: 8px;
                }
                .share-option-icon svg {
                    width: 24px;
                    height: 24px;
                }
                .copy-success-message {
                    font-size: 0.9em;
                }

                /* Login Modal on Mobile */
                .login-modal-content {
                    padding: 20px;
                    gap: 15px;
                }
                .login-modal-header h3 {
                    font-size: 1.2em;
                }
                .login-modal-close-button {
                    font-size: 1.4em;
                }
                .login-tab-button {
                    padding: 8px 15px;
                    font-size: 1em;
                }
                .login-submit-button {
                    padding: 10px 15px;
                    font-size: 1em;
                }
            }

            /* Tablet (641px to 1024px) */
            @media (min-width: 641px) and (max-width: 1024px) {
              .app-container {
                grid-template-columns: 1fr; /* Still single column layout */
              }
              .responsive-header .mobile-only {
                display: none;
              }
              .responsive-header .desktop-header-content {
                display: flex; /* Show desktop header elements */
                flex-grow: 1;
                justify-content: center;
              }
              .app-sidebar {
                display: none; /* Sidebar still hidden on tablet by default */
              }
              .main-content {
                grid-column: 1;
                grid-row: 2;
                padding: 25px;
              }
              .grid {
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Larger cards for tablet */
                gap: 20px;
              }
              .filter-toggle-button, .map-view-button {
                display: flex; /* Always show filter button on tablet */
              }
              .apartment-details-modal-content {
                max-width: 600px; /* Tablet modal size */
                padding: 25px;
              }
              .apartment-image-slider {
                min-height: 250px; /* Ensure image is visible on tablet */
              }
              .apartment-details-title {
                font-size: 1.6em;
              }
              .apartment-details-location {
                font-size: 1.05em;
              }
              .apartment-details-price {
                font-size: 1.3em;
              }
            }

            /* Desktop (1025px and up) */
            @media (min-width: 1025px) {
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

              .filter-toggle-button, .map-view-button {
                display: flex;
              }
              .desktop-filters-container {
                display: none;
              }
              .search-bar-container {
                flex-direction: row;
                justify-content: space-between;
              }
              /* Desktop specific modal image height fix */
              .apartment-details-modal-content .apartment-image-slider {
                min-height: 350px; /* Ensure image is visible on desktop */
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
                {isLoggedIn ? (
                  <>
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
                    <button className="user-dropdown-item" onClick={() => {
                      setIsLoggedIn(false);
                      setLoggedInUser(null);
                      setUserStatus('Guest');
                      setUserAvatar('https://placehold.co/40x40/cccccc/ffffff?text=U');
                      localStorage.removeItem('lodgerLoggedInUser');
                      setShowUserDropdown(false);
                    }}>Logout</button>
                  </>
                ) : (
                  <button className="user-dropdown-item" onClick={() => {
                    setShowLoginModal(true);
                    setShowUserDropdown(false);
                  }}>Login / Sign Up</button>
                )}
              </div>
            </div>
          </header>

          {/* Sidebar Navigation */}
          <aside className="app-sidebar">
            <a href="#" className="navbar-brand">
              <span className="logo-icon">🏠</span> <span className="link-text">Lodger</span>
            </a>
            <div className="nav-links">
              <a href="#" className={`nav-link ${currentPage === 'list' && !showFavoritesOnly ? 'active' : ''}`} onClick={() => {
                setCurrentPage('list');
                setShowFavoritesOnly(false);
              }}>
                <span className="icon">🔍</span> <span className="link-text">Discover</span>
              </a>
              <a href="#" className={`nav-link ${showFavoritesOnly ? 'active' : ''}`} onClick={() => {
                setCurrentPage('list'); // Stay on list view but filter
                setShowFavoritesOnly(prev => !prev); // Toggle favorites filter
              }}>
                <span className="icon">⭐</span> <span className="link-text">Bookmarks</span>
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
                <button
                  className="map-view-button"
                  onClick={() => setCurrentPage('map')}
                >
                  <svg className="map-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
                  </svg>
                  Map View
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
                          e.target.src = 'https://placehold.co/400x280/FF0000/FFFFFF?text=IMAGE+LOAD+FAILED'; // More distinct fallback
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

                {/* Property Type Filter */}
                <div className="filter-group">
                    <label htmlFor="modalPropertyType" className="filter-label">Property Type:</label>
                    <select
                        id="modalPropertyType"
                        value={propertyTypeFilter}
                        onChange={(e) => setPropertyTypeFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="any">Any</option>
                        {uniquePropertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Amenities Filter */}
                <div className="filter-group">
                    <label className="filter-label">Amenities:</label>
                    <div className="amenities-checkbox-grid">
                        {availableAmenities.map(amenity => (
                            <div key={amenity} className="filter-checkbox-group">
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity}`}
                                    checked={amenitiesFilter.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                    className="filter-checkbox"
                                />
                                <label htmlFor={`amenity-${amenity}`} className="filter-label">{amenity}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date Posted Filter */}
                <div className="filter-group">
                    <label htmlFor="modalDatePosted" className="filter-label">Date Posted:</label>
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
                <a href="#" className={`mobile-nav-link ${currentPage === 'list' && !showFavoritesOnly ? 'active' : ''}`} onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage('list');
                  setShowFavoritesOnly(false);
                }}>Discover</a>
                <a href="#" className={`mobile-nav-link ${showFavoritesOnly ? 'active' : ''}`} onClick={() => {
                  setShowMobileMenu(false);
                  setCurrentPage('list');
                  setShowFavoritesOnly(prev => !prev);
                }}>Bookmarks</a>
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>About Us</a>
                <a href="#" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>Contact</a>
                <div className="mobile-nav-user-status">
                  <img src={userAvatar} alt="User Avatar" />
                  <span>{userStatus}</span>
                </div>
                {!isLoggedIn && (
                  <button className="mobile-nav-link" onClick={() => {
                    setShowMobileMenu(false);
                    setShowLoginModal(true);
                  }}>Login / Sign Up</button>
                )}
                {isLoggedIn && (
                  <button className="mobile-nav-link" onClick={() => {
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                    setUserStatus('Guest');
                    setUserAvatar('https://placehold.co/40x40/cccccc/ffffff?text=U');
                    localStorage.removeItem('lodgerLoggedInUser');
                    setShowMobileMenu(false);
                  }}>Logout</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map View */}
      {currentPage === 'map' && (
        <MapView onBackToListings={() => setCurrentPage('list')} />
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
          onContactAgentClick={() => setShowContactModal(true)} // Pass handler to open contact modal
          onToggleBookmark={toggleBookmark} // Pass toggle bookmark function
          isBookmarked={bookmarkedApartments.includes(selectedApartment.id)} // Pass bookmark status
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
            setUserAvatar(`https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${user.name.charAt(0).toUpperCase()}`);
            localStorage.setItem('lodgerLoggedInUser', JSON.stringify(user));
          }}
        />
      )}
    </>
  );
}