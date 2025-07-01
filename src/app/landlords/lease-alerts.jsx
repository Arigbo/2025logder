// pages/landlords/lease-alerts.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

// --- Utility Function to Simulate Fetching All Apartments for Landlord ---
// This is a simplified version for demonstration. In a real app, you'd fetch relevant data.
async function fetchAllLandlordApartments() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Dummy data for landlord's managed apartments
  const allManagedApartments = [
    {
      id: 'L1',
      name: 'Luxury Apartment, Uni Estate',
      location: 'University Road, Block 10, Port Harcourt',
      price: '300000',
      bedrooms: 3,
      bathrooms: 2,
      status: 'Occupied',
      tenantName: 'John Doe',
      tenantContact: 'john.doe@example.com',
      leaseEndDate: '2025-08-15', // Updated to ensure it's in the future
      lastRentPaidDate: '2025-06-01',
    },
    {
      id: 'L2',
      name: 'Student Hostel Room B',
      location: 'Campus Gate Avenue, Hostel Block C, Port Harcourt',
      price: '90000',
      bedrooms: 1,
      bathrooms: 0,
      status: 'Available', // No lease alert needed
      tenantName: null,
      tenantContact: null,
      leaseEndDate: null,
      lastRentPaidDate: null,
    },
    {
      id: 'L3',
      name: 'Spacious Family Flat',
      location: 'Garden City, Palm Estate, Port Harcourt',
      price: '450000',
      bedrooms: 4,
      bathrooms: 3,
      status: 'Occupied',
      tenantName: 'Jane Smith',
      tenantContact: 'jane.smith@example.com',
      leaseEndDate: '2025-09-20', // Updated to ensure it's in the future
      lastRentPaidDate: '2025-05-28',
    },
    {
      id: 'L4',
      name: 'Cozy Studio Downtown',
      location: 'City Center, Main Street, Port Harcourt',
      price: '180000',
      bedrooms: 1,
      bathrooms: 1,
      status: 'Occupied',
      tenantName: 'Peter Obi',
      tenantContact: 'peter.obi@example.com',
      leaseEndDate: '2025-11-10', // Updated to ensure it's in the future
      lastRentPaidDate: '2025-06-10',
    },
    {
        id: 'L5',
        name: 'Family Home (Maintenance)',
        location: 'Victoria Island, Lagos',
        price: '700000',
        bedrooms: 5,
        bathrooms: 4,
        status: 'Maintenance', // No lease alert needed for maintenance
        tenantName: null,
        tenantContact: null,
        leaseEndDate: null,
        lastRentPaidDate: null,
    },
    {
        id: 'L6',
        name: 'Penthouse Apartment',
        location: 'Ikoyi, Lagos',
        price: '1200000',
        bedrooms: 4,
        bathrooms: 4,
        status: 'Occupied',
        tenantName: 'Alice Brown',
        tenantContact: 'alice.brown@example.com',
        leaseEndDate: '2026-01-31', // Lease not ending soon (relative to default 90 days)
        lastRentPaidDate: '2025-06-10',
    },
    {
      id: 'L7',
      name: 'Riverside Retreat',
      location: 'Old Port Road, Choba, Port Harcourt',
      price: '250000',
      bedrooms: 2,
      bathrooms: 2,
      status: 'Occupied',
      tenantName: 'David Nwachukwu',
      tenantContact: 'david.n@example.com',
      leaseEndDate: '2025-07-10', // Updated to ensure it's in the future and within 30 days
      lastRentPaidDate: '2025-06-05',
    },
    {
      id: 'L8',
      name: 'Garden View Studio',
      location: 'GRA Phase 2, Port Harcourt',
      price: '200000',
      bedrooms: 1,
      bathrooms: 1,
      status: 'Occupied',
      tenantName: 'Grace Emmanuel',
      tenantContact: 'grace.e@example.com',
      leaseEndDate: '2025-10-01', // Updated to ensure it's in the future
      lastRentPaidDate: '2025-06-15',
    },
    {
      id: 'L9',
      name: 'Urban Loft',
      location: 'Trans Amadi, Port Harcourt',
      price: '350000',
      bedrooms: 2,
      bathrooms: 2,
      status: 'Occupied',
      tenantName: 'Samuel Okoro',
      tenantContact: 'samuel.o@example.com',
      leaseEndDate: '2026-03-10', // Not ending soon (relative to default 90 days)
      lastRentPaidDate: '2025-06-20',
    },
  ];
  return allManagedApartments;
}

// --- Generic Modal Component (reused from other pages for consistency) ---
const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modalContainer}>
        <div style={modalStyles.modalHeader}>
          <h3 style={modalStyles.modalTitle}>{title}</h3>
          {showCloseButton && (
            <button style={modalStyles.closeButton} onClick={onClose}>
              &#x2715; {/* X icon */}
            </button>
          )}
        </div>
        <div style={modalStyles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};


// --- LandlordLeaseAlertPage Component ---
export default function LandlordLeaseAlertPage() {
  // Initialize state from localStorage or use defaults
  const [filterDays, setFilterDays] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFilterDays = localStorage.getItem('leaseAlertFilterDays');
      return savedFilterDays ? parseInt(savedFilterDays, 10) : 90;
    }
    return 90;
  });

  const [sortOrder, setSortOrder] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSortOrder = localStorage.getItem('leaseAlertSortOrder');
      return savedSortOrder || 'asc';
    }
    return 'asc';
  });

  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);


  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Save filterDays to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('leaseAlertFilterDays', filterDays.toString());
    }
  }, [filterDays]);

  useEffect(() => {
    // Save sortOrder to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('leaseAlertSortOrder', sortOrder);
    }
  }, [sortOrder]);


  useEffect(() => {
    // Function to update window width state
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial width setting
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }

    // Cleanup: remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Breakpoint checks
  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 768;


  useEffect(() => {
    const getApartments = async () => {
      try {
        const data = await fetchAllLandlordApartments();
        setApartments(data);
      } catch (err) {
        setError('Failed to load apartment data for lease alerts.');
        console.error('Error fetching all apartments:', err);
      } finally {
        setLoading(false);
      }
    };
    getApartments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter and sort apartments based on lease end date
  const filteredAndSortedApartments = apartments
    .filter(apt => {
      // Only consider occupied apartments with a lease end date
      if (apt.status !== 'Occupied' || !apt.leaseEndDate) {
        return false;
      }
      const leaseEndDate = new Date(apt.leaseEndDate);
      leaseEndDate.setHours(0, 0, 0, 0); // Normalize to start of day

      const timeDiff = leaseEndDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Days remaining

      return daysDiff <= filterDays && daysDiff >= 0; // Lease ending today or in the future within filterDays
    })
    .sort((a, b) => {
      const dateA = new Date(a.leaseEndDate);
      const dateB = new Date(b.leaseEndDate);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading lease alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error: {error}</p>
        <Link href="/landlords/dashboard" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Back to Dashboard</a>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link href="/landlords/dashboard" passHref legacyBehavior>
        <a style={styles.backLink}>&larr; Back to Dashboard</a>
      </Link>

      <h1 style={styles.heading(isTablet, isMobile)}>Lease Alerts & Upcoming Renewals</h1>
      <p style={styles.subheading(isMobile)}>Keep track of leases ending soon and plan for renewals or new tenants.</p>

      {/* Filter and Sort Controls */}
      <div style={styles.controlsContainer}> {/* Removed isMobile arg to simplify for grid */}
        <div style={styles.controlGroup}>
          <label htmlFor="filterDays" style={styles.controlLabel}>Show leases ending within:</label>
          <select
            id="filterDays"
            value={filterDays}
            onChange={(e) => setFilterDays(parseInt(e.target.value, 10))}
            style={styles.selectControl(isMobile)}
          >
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
            <option value={180}>180 Days (6 Months)</option>
            <option value={365}>365 Days (1 Year)</option>
          </select>
        </div>
        <div style={styles.controlGroup}>
          <label htmlFor="sortOrder" style={styles.controlLabel}>Sort by End Date:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.selectControl(isMobile)}
          >
            <option value="asc">Soonest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>

      {filteredAndSortedApartments.length > 0 ? (
        <div style={styles.alertsGrid}>
          {filteredAndSortedApartments.map((apt, index) => {
            const leaseEndDate = new Date(apt.leaseEndDate);
            leaseEndDate.setHours(0, 0, 0, 0);
            const timeDiff = leaseEndDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            let alertLevelStyle = styles.alertItemNormal;
            let alertIcon = '🗓️'; // Default icon
            if (daysRemaining <= 30) {
              alertLevelStyle = styles.alertItemHigh;
              alertIcon = '🚨'; // High urgency icon
            } else if (daysRemaining <= 90) {
              alertLevelStyle = styles.alertItemMedium;
              alertIcon = '⚠️'; // Medium urgency icon
            }

            return (
              <div key={apt.id} style={{ ...styles.alertItem, ...alertLevelStyle, animationDelay: `${index * 0.1}s` }}>
                <div style={styles.alertHeader}>
                  <span style={styles.alertIcon}>{alertIcon}</span>
                  <h3 style={styles.apartmentName(isMobile)}>{apt.name}</h3>
                </div>
                <p style={styles.alertDetail(isMobile)}><strong>Location:</strong> {apt.location}</p>
                <p style={styles.alertDetail(isMobile)}><strong>Current Tenant:</strong> {apt.tenantName}</p>
                <p style={styles.alertDetail(isMobile)}><strong>Lease Ends:</strong> {apt.leaseEndDate} <span style={styles.daysRemaining}>({daysRemaining} days remaining)</span></p>
                <Link href={`/landlords/apartments/${apt.id}`} passHref legacyBehavior>
                  <a style={styles.manageButton}>Manage Apartment &rarr;</a>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>No lease agreements are ending within the selected period.</p>
          <p>This is a great sign! All your apartments are securely leased.</p>
        </div>
      )}

      {/* Alert Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Notification"
      >
        <p>{alertMessage}</p>
        <div style={modalStyles.modalButtonGroup}>
          <button
            style={{ ...modalStyles.modalButton, ...modalStyles.modalPrimaryButton }}
            onClick={() => setShowAlertModal(false)}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}

// --- Inline Styles for the Lease Alert Page ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '40px 20px',
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    color: '#333d47',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '30px',
    color: '#607d8b',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'color 0.2s ease, transform 0.1s ease',
    gap: '5px',
    '&:hover': {
      color: '#4a6572',
      transform: 'translateX(-5px)',
    },
  },
  heading: (isTablet, isMobile) => ({
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333d47',
    fontSize: isMobile ? '2em' : (isTablet ? '2.2em' : '2.5em'),
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
  }),
  subheading: (isMobile) => ({
    textAlign: 'center',
    color: '#607d8b',
    fontSize: isMobile ? '0.95em' : '1.1em',
    marginBottom: '40px',
    maxWidth: '700px',
    margin: '0 auto 40px auto',
    lineHeight: '1.5',
  }),
  loadingText: {
    textAlign: 'center',
    fontSize: '1.4em',
    color: '#90a4ae',
    paddingTop: '80px',
  },
  errorText: {
    textAlign: 'center',
    fontSize: '1.4em',
    color: '#dc3545',
    paddingTop: '80px',
  },
  controlsContainer: { // Changed to use Grid properties
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive grid columns
    gap: '20px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    justifyItems: 'center', // Center items within their grid cells
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap', // Still allow inner wrapping if labels/selects are long
    justifyContent: 'center',
  },
  controlLabel: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '0.95em',
  },
  selectControl: (isMobile) => ({
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: isMobile ? '0.9em' : '0.95em',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
    flexGrow: isMobile ? 1 : 0,
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.3)',
      outline: 'none',
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
  }),
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    padding: '20px 0',
  },
  alertItem: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e9e9e9',
    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    animation: 'fadeInUp 0.6s ease-out forwards',
    opacity: 0,
    '@keyframes fadeInUp': {
        'from': {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        'to': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    },
  },
  alertItemHigh: {
    borderLeft: '6px solid #e74c3c',
    background: 'linear-gradient(135deg, #fffafa, #ffecec)',
    boxShadow: '0 6px 20px rgba(231,76,60,0.15)',
  },
  alertItemMedium: {
    borderLeft: '6px solid #f1c40f',
    background: 'linear-gradient(135deg, #fffef9, #fff6dd)',
    boxShadow: '0 6px 20px rgba(241,196,15,0.12)',
  },
  alertItemNormal: {
    borderLeft: '6px solid #3498db',
    background: 'linear-gradient(135deg, #f7faff, #eaf2f8)',
    boxShadow: '0 6px 20px rgba(52,152,219,0.08)',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '12px',
    borderBottom: '1px dashed #e0e0e0',
    paddingBottom: '10px',
  },
  alertIcon: {
    fontSize: '2.2em',
    lineHeight: '1',
  },
  apartmentName: (isMobile) => ({
    fontSize: isMobile ? '1.3em' : '1.5em',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
    flexGrow: 1,
  }),
  alertDetail: (isMobile) => ({
    fontSize: isMobile ? '0.95em' : '1em',
    color: '#4a5568',
    marginBottom: '6px',
    lineHeight: '1.5',
  }),
  daysRemaining: {
    fontWeight: '800',
    color: '#34495e',
  },
  manageButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '25px',
    padding: '12px 20px',
    backgroundColor: '#607d8b',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    alignSelf: 'flex-end',
    boxShadow: '0 4px 10px rgba(96,125,139,0.3)',
    '&:hover': {
      backgroundColor: '#4a6572',
      transform: 'translateY(-2px) translateX(2px)',
      boxShadow: '0 6px 15px rgba(96,125,139,0.4)',
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
};

// --- Styles for the Modals (reused for consistency) ---
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    fontFamily: '"Inter", sans-serif',
    color: '#333d47',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  modalTitle: {
    fontSize: '1.5em',
    fontWeight: '700',
    margin: 0,
    color: '#333d47',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    color: '#90a4ae',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#607d8b',
    },
  },
  modalContent: {
    fontSize: '1em',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  modalButtonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  modalButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.95em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  },
  modalPrimaryButton: {
    backgroundColor: '#607d8b',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4a6572',
      transform: 'translateY(-1px)',
    },
  },
  modalSecondaryButton: {
    backgroundColor: '#e0e0e0',
    color: '#333d47',
    '&:hover': {
      backgroundColor: '#cccccc',
      transform: 'translateY(-1px)',
    },
  },
  modalDangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c82333',
      transform: 'translateY(-1px)',
    },
  },
};
// --- Keyframes for Fade In Animation ---
const fadeInUp = {
  from: {
    opacity: 0,
    transform: 'translateY(20px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
};
// This is a global style, you can add it to your global CSS file or use a CSS-in-JS solution
const globalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// You can inject this global style into your app's head or include it in your main CSS file
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}