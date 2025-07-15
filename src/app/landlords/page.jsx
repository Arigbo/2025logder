// pages/landlords/dashboard.js
"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

// --- Utility Function to Simulate Fetching All Apartments for Landlord ---
async function fetchAllLandlordApartments() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Dummy data for landlord's managed apartments with new fields for termination request
  const allManagedApartments = [
    {
      id: 'L1',
      name: 'Luxury Apartment, Uni Estate',
      location: 'University Road, Block 10, Port Harcourt',
      price: '300000',
      bedrooms: 3,
      bathrooms: 2,
      description: 'A luxurious and spacious apartment perfect for discerning students or faculty. Features modern fittings, 24/7 power, and high-speed internet. Located within a secure estate close to the university.',
      status: 'Occupied',
      tenantName: 'John Doe',
      tenantContact: 'john.doe@example.com',
      leaseEndDate: '2025-07-31',
      maintenanceStartDate: null,
      lastRentPaidDate: '2025-06-01',
      maintenanceLog: [
        { id: 'M1', date: '2025-06-10', description: 'Leaky faucet in kitchen', status: 'Completed', completedDate: '2025-06-12' },
      ],
      images: [
        'https://placehold.co/800x500/AEC6CF/333333?text=Apt+1+Pic+1',
        'https://placehold.co/800x500/98B2C4/333333?text=Apt+1+Pic+2',
      ],
      amenities: ['24/7 Power', 'High-Speed Internet', 'Swimming Pool', 'Gym'],
      pendingRequests: [],
      isTerminationRequested: false,
      terminationRequestDate: null,
    },
    {
      id: 'L2',
      name: 'Student Hostel Room B',
      location: 'Campus Gate Avenue, Hostel Block C, Port Harcourt',
      price: '90000',
      bedrooms: 1,
      bathrooms: 0,
      description: 'An affordable and convenient room in a male-only student hostel. Shared facilities include kitchen, lounge, and bathrooms. Located directly opposite the main campus entrance.',
      status: 'Available',
      tenantName: null,
      tenantContact: null,
      leaseEndDate: null,
      maintenanceStartDate: null,
      lastRentPaidDate: null,
      maintenanceLog: [],
      images: [
        'https://placehold.co/800x500/FFDDC1/333333?text=Apt+2+Pic+1',
      ],
      amenities: ['Shared Kitchen', 'Shared Lounge', 'Study Area'],
      pendingRequests: [
        { id: 'APP1', tenantName: 'Alice Johnson', tenantContact: 'alice@example.com', requestDate: '2025-06-20', status: 'Applied' },
      ],
      isTerminationRequested: false,
      terminationRequestDate: null,
    },
    {
      id: 'L3',
      name: 'Spacious Family Flat',
      location: 'Garden City, Palm Estate, Port Harcourt',
      price: '450000',
      bedrooms: 4,
      bathrooms: 3,
      description: 'Large family-friendly flat with ample space, private balcony, and secure parking. Ideal for faculty families or groups of students. Located in a serene environment, a short drive from schools.',
      status: 'Occupied',
      tenantName: 'Jane Smith',
      tenantContact: 'jane.smith@example.com',
      leaseEndDate: '2025-08-15',
      maintenanceStartDate: null,
      lastRentPaidDate: '2025-05-28',
      maintenanceLog: [],
      images: [
        'https://placehold.co/800x500/C8A2C8/333333?text=Apt+3+Pic+1',
      ],
      amenities: ['Private Balcony', 'Secure Parking', 'Kid-Friendly Area'],
      pendingRequests: [],
      isTerminationRequested: false,
      terminationRequestDate: null,
    },
    {
      id: 'L7',
      name: 'Riverside Retreat (Termination Pending)',
      location: 'Old Port Road, Choba, Port Harcourt',
      price: '250000',
      bedrooms: 2,
      bathrooms: 2,
      description: 'Charming riverside apartment, tenant moving out soon. Lease termination pending admin approval.',
      status: 'Occupied',
      tenantName: 'David Nwachukwu',
      tenantContact: 'david.n@example.com',
      leaseEndDate: '2025-07-10',
      maintenanceStartDate: null,
      lastRentPaidDate: '2025-06-05',
      maintenanceLog: [],
      reminders: [],
      images: [
        'https://placehold.co/800x500/ADD8E6/000000?text=River+Apt+1',
      ],
      amenities: ['River View', 'Quiet Area', 'Good Security'],
      pendingRequests: [],
      isTerminationRequested: true, // This apartment has a pending termination
      terminationRequestDate: '2025-06-27',
    },
     {
      id: 'L4',
      name: 'Cozy Studio Downtown',
      location: 'City Center, Main Street, Port Harcourt',
      price: '180000',
      bedrooms: 1,
      bathrooms: 1,
      description: 'A compact and modern studio apartment in the heart of the city. Ideal for a single student or professional. Close to amenities, public transport, and entertainment.',
      status: 'Available',
      tenantName: null,
      tenantContact: null,
      leaseEndDate: null,
      maintenanceStartDate: null,
      lastRentPaidDate: null,
      maintenanceLog: [],
      images: [
        'https://placehold.co/800x500/E0BBE4/333333?text=Apt+4+Pic+1',
      ],
      amenities: ['Furnished (basic)', 'Central Location', 'Good Security', 'Elevator Access'],
      pendingRequests: [],
      isTerminationRequested: false,
      terminationRequestDate: null,
    },
  ];
  return allManagedApartments;
}

// --- Generic Modal Component ---
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


// --- LandlordDashboard Component ---
export default function LandlordDashboard() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Available', 'Occupied', 'Maintenance', 'Termination Requested'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'status'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const getApartments = async () => {
      try {
        const data = await fetchAllLandlordApartments();
        setApartments(data);
      } catch (err) {
        setError('Failed to load apartment data.');
        console.error('Error fetching landlord apartments:', err);
      } finally {
        setLoading(false);
      }
    };
    getApartments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Function to calculate effective status based on maintenance dates and log
  const getCalculatedStatus = (data) => {
      // Prioritize termination request status
      if (data.isTerminationRequested) {
          return 'Termination Requested';
      }

      // Check for an explicit maintenance start date on the apartment object (if still used)
      if (data.maintenanceStartDate) {
          const maintStart = new Date(data.maintenanceStartDate);
          maintStart.setHours(0, 0, 0, 0); // Normalize
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          // If maintenance is ongoing (today or in the past) or starting tomorrow
          if (maintStart <= today || (maintStart.toDateString() === tomorrow.toDateString())) {
              return 'Maintenance';
          }
      }

      // Check for pending maintenance log entries that are ongoing or imminent
      if (data.maintenanceLog && data.maintenanceLog.length > 0) {
          const hasImminentOrOngoingMaintenance = data.maintenanceLog.some(entry => {
              if (entry.status === 'Pending' && entry.date) {
                  const entryDate = new Date(entry.date);
                  entryDate.setHours(0, 0, 0, 0); // Normalize
                  const tomorrow = new Date(today);
                  tomorrow.setDate(today.getDate() + 1);
                  tomorrow.setHours(0, 0, 0, 0);
                  return entryDate <= today || (entryDate.toDateString() === tomorrow.toDateString());
              }
              return false;
          });
          if (hasImminentOrOngoingMaintenance) {
              return 'Maintenance';
          }
      }

      // If no active or imminent maintenance or termination, return the original status
      return data.status;
  };


  const filteredApartments = apartments.filter(apt => {
    const matchesSearch = apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.location.toLowerCase().includes(searchTerm.toLowerCase());

    const effectiveStatus = getCalculatedStatus(apt);

    const matchesStatus = filterStatus === 'All' || effectiveStatus === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let valA, valB;

    if (sortBy === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (sortBy === 'price') {
      valA = parseInt(a.price, 10);
      valB = parseInt(b.price, 10);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    } else if (sortBy === 'status') {
      // Custom sort order for status to prioritize urgent items
      const statusOrder = { 'Termination Requested': 0, 'Maintenance': 1, 'Occupied': 2, 'Available': 3 };
      valA = statusOrder[getCalculatedStatus(a)];
      valB = statusOrder[getCalculatedStatus(b)];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return 0; // Default no sort
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error: {error}</p>
        <Link href="/" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Go to Home</a>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Managed Apartments</h1>
      <p style={styles.subheading}>Overview of all your properties and their current status.</p>

      <div style={styles.topControls}>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterSortGroup}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.selectControl}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Termination Requested">Termination Requested</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.selectControl}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={styles.sortButton}
          >
            {sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
        </div>
        <div style={styles.actionButtons}>
            <Link href="/landlords/lease-alerts" passHref legacyBehavior>
                <a style={{...styles.baseButton, ...styles.secondaryButton}}>View Lease Alerts</a>
            </Link>
            {/* You might add an "Add New Apartment" button here */}
        </div>
      </div>


      {filteredApartments.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No apartments match your criteria.</p>
          <p>Try adjusting your filters or adding new properties.</p>
        </div>
      ) : (
        <div style={styles.apartmentsGrid}>
          {filteredApartments.map(apt => {
            const effectiveStatus = getCalculatedStatus(apt);
            let statusStyle = styles.statusBadgeNormal;
            if (effectiveStatus === 'Available') {
                statusStyle = styles.statusBadgeAvailable;
            } else if (effectiveStatus === 'Occupied') {
                statusStyle = styles.statusBadgeOccupied;
            } else if (effectiveStatus === 'Maintenance') {
                statusStyle = styles.statusBadgeMaintenance;
            } else if (effectiveStatus === 'Termination Requested') {
                statusStyle = styles.statusBadgeTerminationRequested;
            }


            return (
              <div key={apt.id} style={styles.apartmentCard}>
                <img
                  src={apt.images && apt.images.length > 0 ? apt.images[0] : 'https://placehold.co/400x250/E0E0E0/666666?text=No+Image'}
                  alt={apt.name}
                  style={styles.apartmentImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/E0E0E0/666666?text=No+Image'; }}
                />
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{apt.name}</h2>
                  <p style={styles.cardLocation}>{apt.location}</p>
                  <div style={styles.cardDetails}>
                    <span>₦{apt.price}/month</span>
                    <span>{apt.bedrooms} Bed</span>
                    <span>{apt.bathrooms} Bath</span>
                  </div>
                  <div style={statusStyle}>{effectiveStatus}</div>

                  <Link href={`./${apt.id}`} passHref legacyBehavior>
                    <a style={styles.viewDetailsButton}>View & Manage</a>
                  </Link>
                </div>
              </div>
            );
          })}
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

// --- Inline Styles ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    color: '#333d47',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333d47',
    fontSize: '2.8em',
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  subheading: {
    textAlign: 'center',
    color: '#607d8b',
    fontSize: '1.2em',
    marginBottom: '40px',
    maxWidth: '800px',
    margin: '0 auto 40px auto',
    lineHeight: '1.5',
  },
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
  topControls: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  searchInput: {
    flexGrow: 1,
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    fontFamily: '"Inter", sans-serif',
    maxWidth: '350px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.2)',
      outline: 'none',
    },
  },
  filterSortGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  selectControl: {
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.2)',
      outline: 'none',
    },
  },
  sortButton: {
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    backgroundColor: '#e0e0e0',
    color: '#333d47',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    '&:hover': {
      backgroundColor: '#cccccc',
      transform: 'translateY(-1px)',
    },
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flexGrow: 1, // Allow it to take up available space
  },
  baseButton: {
    padding: '12px 22px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    textDecoration: 'none', // For Link components
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#607d8b',
    color: 'white',
    boxShadow: '0 4px 10px rgba(96,125,139,0.3)',
    '&:hover': {
      backgroundColor: '#4a6572',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(96,125,139,0.4)',
    },
  },
  secondaryButton: {
    backgroundColor: '#cbd5e0',
    color: '#333d47',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#a0aec0',
      transform: 'translateY(-1px)',
    },
  },
  apartmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    padding: '20px 0',
  },
  apartmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    border: '1px solid #e9e9e9',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    },
  },
  apartmentImage: {
    width: '100%',
    height: '200px', // Fixed height for consistent image size
    objectFit: 'cover',
    borderBottom: '1px solid #f0f0f0',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: '1.6em',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#333d47',
    lineHeight: '1.2',
  },
  cardLocation: {
    fontSize: '0.95em',
    color: '#607d8b',
    marginBottom: '15px',
  },
  cardDetails: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.9em',
    color: '#4a5568',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  statusBadgeNormal: {
    backgroundColor: '#f0f4f7',
    color: '#607d8b',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: '15px',
  },
  statusBadgeAvailable: {
    backgroundColor: '#e6ebcc',
    color: '#5b611e',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: '15px',
  },
  statusBadgeOccupied: {
    backgroundColor: '#fbe9e7',
    color: '#c0392b',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: '15px',
  },
  statusBadgeMaintenance: {
    backgroundColor: '#fff3e0', // Light orange
    color: '#ef6c00', // Darker orange
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: '15px',
  },
  statusBadgeTerminationRequested: { // New style
    backgroundColor: '#ffebee', // Light red for alert
    color: '#d32f2f', // Red text
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: '15px',
    border: '1px solid #d32f2f',
  },
  viewDetailsButton: {
    display: 'block',
    width: '100%',
    padding: '12px 0',
    backgroundColor: '#607d8b',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    marginTop: 'auto', // Push to bottom of card
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    '&:hover': {
      backgroundColor: '#4a6572',
      transform: 'translateY(-2px)',
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
