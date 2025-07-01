// pages/landlords/apartments/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// --- Utility Function to Simulate Fetching a Single Apartment for Landlord ---
async function fetchLandlordApartmentById(id) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // Dummy data for landlord's managed apartments with multiple images and new features
  const managedApartments = [
    {
      id: 'L1',
      name: 'Luxury Apartment, Uni Estate',
      location: 'University Road, Block 10, Port Harcourt',
      price: '300000', // Store as number for easier manipulation
      bedrooms: 3,
      bathrooms: 2,
      description: 'A luxurious and spacious apartment perfect for discerning students or faculty. Features modern fittings, 24/7 power, and high-speed internet. Located within a secure estate close to the university.',
      status: 'Occupied',
      tenantName: 'John Doe',
      tenantContact: 'john.doe@example.com',
      leaseEndDate: '2025-07-31',
      maintenanceStartDate: null, // This field is now mostly for display/legacy in dummy data
      lastRentPaidDate: '2025-06-01',
      maintenanceLog: [
        { id: 'M1', date: '2025-06-10', description: 'Leaky faucet in kitchen', status: 'Completed', completedDate: '2025-06-12' },
        { id: 'M2', date: '2025-06-20', description: 'AC not cooling properly', status: 'Pending', completedDate: null },
      ],
      reminders: [
        { id: 'R1', date: '2025-07-01', description: 'Send lease renewal notice' },
      ],
      images: [
        'https://placehold.co/800x500/AEC6CF/333333?text=Apt+1+Pic+1',
        'https://placehold.co/800x500/98B2C4/333333?text=Apt+1+Pic+2',
        'https://placehold.co/800x500/879CAE/333333?text=Apt+1+Pic+3',
      ],
      amenities: ['24/7 Power', 'High-Speed Internet', 'Swimming Pool', 'Gym', 'Gated Community'],
      pendingRequests: [], // No pending requests for occupied
      isTerminationRequested: false, // New field for termination request
      terminationRequestDate: null,
    },
    {
      id: 'L2',
      name: 'Student Hostel Room B',
      location: 'Campus Gate Avenue, Hostel Block C, Port Harcourt',
      price: '90000',
      bedrooms: 1, // Represents a room
      bathrooms: 0, // Shared bathroom
      description: 'An affordable and convenient room in a male-only student hostel. Shared facilities include kitchen, lounge, and bathrooms. Located directly opposite the main campus entrance.',
      status: 'Available',
      tenantName: null,
      tenantContact: null,
      leaseEndDate: null,
      maintenanceStartDate: null,
      lastRentPaidDate: null,
      maintenanceLog: [],
      reminders: [
        { id: 'R2', date: '2025-07-15', description: 'Inspect room for damages' },
      ],
      images: [
        'https://placehold.co/800x500/FFDDC1/333333?text=Apt+2+Pic+1',
        'https://placehold.co/800x500/EADCB2/333333?text=Apt+2+Pic+2',
      ],
      amenities: ['Shared Kitchen', 'Shared Lounge', 'Study Area', 'Regular Cleaning', 'Water Supply'],
      pendingRequests: [
        { id: 'APP1', tenantName: 'Alice Johnson', tenantContact: 'alice@example.com', requestDate: '2025-06-20', status: 'Applied' },
        { id: 'APP2', tenantName: 'Bob Williams', tenantContact: 'bob@example.com', requestDate: '2025-06-22', status: 'Applied' },
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
      reminders: [],
      images: [
        'https://placehold.co/800x500/C8A2C8/333333?text=Apt+3+Pic+1',
        'https://placehold.co/800x500/B296B2/333333?text=Apt+3+Pic+2',
        'https://placehold.co/800x500/A088A0/333333?text=Apt+3+Pic+3',
        'https://placehold.co/800x500/8F788F/333333?text=Apt+3+Pic+4',
      ],
      amenities: ['Private Balcony', 'Secure Parking', 'Kid-Friendly Area', 'Quiet Neighborhood', 'Backup Power'],
      pendingRequests: [],
      isTerminationRequested: false,
      terminationRequestDate: null,
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
      reminders: [],
      images: [
        'https://placehold.co/800x500/E0BBE4/333333?text=Apt+4+Pic+1',
      ],
      amenities: ['Furnished (basic)', 'Central Location', 'Good Security', 'Elevator Access'],
      pendingRequests: [],
      isTerminationRequested: false,
      terminationRequestDate: null,
    },
    {
        id: 'L5',
        name: 'Family Home',
        location: 'Victoria Island, Lagos',
        price: '700000',
        bedrooms: 5,
        bathrooms: 4,
        description: 'Large family home currently undergoing renovations to upgrade facilities. Will be available soon.',
        status: 'Maintenance',
        tenantName: null, // No current tenant
        tenantContact: null,
        leaseEndDate: null,
        maintenanceStartDate: '2025-06-25', // Example: maintenance started recently
        lastRentPaidDate: null,
        maintenanceLog: [
          { id: 'M3', date: '2025-06-25', description: 'Roof repair needed', status: 'Pending', completedDate: null },
        ],
        reminders: [],
        images: [
            'https://placehold.co/800x500/D4AF37/FFFFFF?text=Maint+Home+1',
            'https://placehold.co/800x500/C5A42D/FFFFFF?text=Maint+Home+2',
        ],
        amenities: ['Garden', 'Swimming Pool', 'Garage', 'Generator', 'Security Patrols'],
        pendingRequests: [],
        isTerminationRequested: false,
        terminationRequestDate: null,
    },
    {
        id: 'L6',
        name: 'Penthouse Apartment',
        location: 'Ikoyi, Lagos',
        price: '1200000',
        bedrooms: 4,
        bathrooms: 4,
        description: 'Exclusive penthouse with stunning city views. Tenant reported a minor plumbing issue, scheduled for maintenance.',
        status: 'Occupied',
        tenantName: 'Alice Brown',
        tenantContact: 'alice.brown@example.com',
        leaseEndDate: '2026-01-31',
        maintenanceStartDate: null, // Maintenance might be scheduled via status change
        lastRentPaidDate: '2025-06-10',
        maintenanceLog: [
          { id: 'M4', date: '2025-06-26', description: 'Plumbing leak in guest bathroom', status: 'Pending', completedDate: null },
        ],
        reminders: [
          { id: 'R3', date: '2025-12-01', description: 'Annual fire alarm inspection' },
        ],
        images: [
            'https://placehold.co/800x500/6A5ACD/FFFFFF?text=Penthouse+1',
            'https://placehold.co/800x500/7B68EE/FFFFFF?text=Penthouse+2',
            'https://placehold.co/800x500/8A2BE2/FFFFFF?text=Penthouse+3',
        ],
        amenities: ['Panoramic Views', 'Smart Home System', 'Concierge Service', 'Private Elevator'],
        pendingRequests: [
          { id: 'APP3', tenantName: 'Charlie Green', tenantContact: 'charlie@example.com', requestDate: '2025-06-25', status: 'Applied' },
        ], // Example: Already occupied, but new request came in
        isTerminationRequested: false, // Set one to true for testing
        terminationRequestDate: null,
    },
    {
      id: 'L7',
      name: 'Riverside Retreat (Tenant Leaving)',
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
      isTerminationRequested: true, // Example: Termination already requested
      terminationRequestDate: '2025-06-27',
    },
  ];
  return managedApartments.find(apt => apt.id === id);
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


// --- SingleApartmentManagePage Component ---
export default function SingleApartmentManagePage() {
  const router = useRouter();
  const { id } = router.query; // Get the apartment ID from the URL

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [formData, setFormData] = useState({}); // State for form data (editable fields)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For image gallery

  // States for new features
  const [showExtendLeaseForm, setShowExtendLeaseForm] = useState(false);
  const [newLeaseEndDate, setNewLeaseEndDate] = useState('');
  const [showAddMaintenanceForm, setShowAddMaintenanceForm] = useState(false);
  const [newMaintenanceDescription, setNewMaintenanceDescription] = useState('');
  const [newMaintenanceDate, setNewMaintenanceDate] = useState('');
  const [showAddReminderForm, setShowAddReminderForm] = useState(false);
  const [newReminderDescription, setNewReminderDescription] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');

  // States for Modals
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // Function to execute on confirm


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
    if (id) {
      const getApartment = async () => {
        try {
          const data = await fetchLandlordApartmentById(id);
          if (data) {
            setApartment(data);
            setFormData({
              ...data,
              // These fields are managed by specific actions, not direct editing anymore
              maintenanceStartDate: data.maintenanceStartDate || '',
              lastRentPaidDate: data.lastRentPaidDate || '',
              maintenanceLog: data.maintenanceLog || [],
              reminders: data.reminders || [],
              pendingRequests: data.pendingRequests || [], // Initialize pending requests
              isTerminationRequested: data.isTerminationRequested || false, // Initialize new field
              terminationRequestDate: data.terminationRequestDate || null, // Initialize new field
            });
            setCurrentImageIndex(0); // Reset image index when a new apartment is loaded
          } else {
            setError('Apartment not found or you do not have access.');
          }
        } catch (err) {
          setError('Failed to load apartment details.');
          console.error('Error fetching apartment for landlord:', err);
        } finally {
          setLoading(false);
        }
      };
      getApartment();
    }
  }, [id]); // Re-fetch if ID changes

  // Helper to get today's and tomorrow's dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const todayDateFormatted = today.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Normalize to start of day

  // --- Function to calculate effective status based on maintenance dates and log ---
  const getCalculatedStatus = (data) => {
      // Check for an explicit maintenance start date on the apartment object (if still used)
      if (data.maintenanceStartDate) {
          const maintStart = new Date(data.maintenanceStartDate);
          maintStart.setHours(0, 0, 0, 0); // Normalize
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
                  return entryDate <= today || (entryDate.toDateString() === tomorrow.toDateString());
              }
              return false;
          });
          if (hasImminentOrOngoingMaintenance) {
              return 'Maintenance';
          }
      }

      // If no active or imminent maintenance, return the original status from the apartment data
      return data.status;
  };


  // Handle form input changes for main apartment details (excluding status and maintenanceStartDate, tenant details)
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === 'number') {
      // Ensure number inputs are not negative
      newValue = Math.max(0, parseInt(value, 10) || 0);
    }

    setFormData(prev => {
      let updatedData = { ...prev, [name]: newValue };

      if (name === 'images') {
        // Convert comma-separated string to array for images
        updatedData[name] = newValue.split(',').map(s => s.trim()).filter(s => s);
      }

      return updatedData;
    });
  };

  // --- Modal-Triggering Functions for main actions ---
  const handleSaveChanges = () => {
    setConfirmMessage('Are you sure you want to save these changes?');
    setConfirmAction(() => handleSaveChangesConfirmed);
    setShowConfirmModal(true);
  };

  const handleDeleteApartment = () => {
    setConfirmMessage('Are you sure you want to delete this apartment listing? This action cannot be undone.');
    setConfirmAction(() => handleDeleteApartmentConfirmed);
    setShowConfirmModal(true);
  };

  const handleTerminateLease = () => {
    setConfirmMessage('Are you sure you want to terminate the current lease? This action requires admin confirmation.');
    setConfirmAction(() => handleTerminateLeaseConfirmed);
    setShowConfirmModal(true);
  };

  // --- Confirmed Action Handlers (called by Confirm Modal) ---
  const handleSaveChangesConfirmed = async () => {
    setShowConfirmModal(false); // Close modal first
    console.log("Saving changes:", formData);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setApartment(formData); // Update displayed apartment with new data
    setIsEditing(false); // Exit edit mode
    setAlertMessage('Apartment details updated successfully!');
    setShowAlertModal(true);
  };

  const handleDeleteApartmentConfirmed = async () => {
    setShowConfirmModal(false); // Close modal first
    console.log(`Deleting apartment: ${apartment.id}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setAlertMessage('Apartment deleted successfully!');
    setShowAlertModal(true);
    router.push('/landlords/'); // Redirect to dashboard after deletion
  };

  const handleExtendLease = async () => {
    if (!newLeaseEndDate) {
      setAlertMessage('Please select a new lease end date.');
      setShowAlertModal(true);
      return;
    }
    // No need for confirm modal here, as it's a direct action with prior date validation.
    console.log(`Extending lease for ${apartment.name} to ${newLeaseEndDate}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    setApartment(prev => ({ ...prev, leaseEndDate: newLeaseEndDate }));
    setFormData(prev => ({ ...prev, leaseEndDate: newLeaseEndDate }));
    setShowExtendLeaseForm(false);
    setNewLeaseEndDate('');
    setAlertMessage('Lease extended successfully!');
    setShowAlertModal(true);
  };

  const handleTerminateLeaseConfirmed = async () => {
    setShowConfirmModal(false); // Close modal first
    console.log(`Submitting termination request for ${apartment.name}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update state to reflect pending termination
    const updatedApartment = {
      ...apartment,
      isTerminationRequested: true,
      terminationRequestDate: todayDateFormatted,
      // Do NOT change status to 'Available' or clear tenant info yet
    };

    setApartment(updatedApartment);
    setFormData(updatedApartment); // Keep formData in sync
    setAlertMessage(`Lease termination request submitted for ${apartment.tenantName}. It will remain occupied until confirmed by admin.`);
    setShowAlertModal(true);
  };

  // Maintenance Log Functions
  const handleAddMaintenanceEntry = async () => {
    if (!newMaintenanceDescription) {
      setAlertMessage('Please provide a description for the maintenance entry.');
      setShowAlertModal(true);
      return;
    }
    const newEntry = {
      id: `M${Date.now()}`, // Simple unique ID
      date: newMaintenanceDate || todayDateFormatted,
      description: newMaintenanceDescription,
      status: 'Pending',
      completedDate: null,
    };
    // In a real app, send update to backend
    console.log("Adding maintenance entry:", newEntry);
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedLog = [...formData.maintenanceLog, newEntry];
    setApartment(prev => ({ ...prev, maintenanceLog: updatedLog }));
    setFormData(prev => ({ ...prev, maintenanceLog: updatedLog }));
    setShowAddMaintenanceForm(false);
    setNewMaintenanceDescription('');
    setNewMaintenanceDate('');
    setAlertMessage('Maintenance entry added.');
    setShowAlertModal(true);
  };

  const handleMarkMaintenanceComplete = async (entryId) => {
    // In a real app, send update to backend
    console.log(`Marking maintenance entry ${entryId} as complete.`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedLog = formData.maintenanceLog.map(entry =>
      entry.id === entryId ? { ...entry, status: 'Completed', completedDate: todayDateFormatted } : entry
    );
    setApartment(prev => ({ ...prev, maintenanceLog: updatedLog }));
    setFormData(prev => ({ ...prev, maintenanceLog: updatedLog }));
    setAlertMessage('Maintenance entry marked as completed.');
    setShowAlertModal(true);
  };

  // Rent Payment Functions
  const handleRecordRentPayment = async () => {
    setConfirmMessage('Are you sure you want to record today as the last rent payment date?');
    setConfirmAction(() => handleRecordRentPaymentConfirmed);
    setShowConfirmModal(true);
  };

  const handleRecordRentPaymentConfirmed = async () => {
    setShowConfirmModal(false); // Close modal first
    console.log(`Recording rent payment for today: ${todayDateFormatted}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    setApartment(prev => ({ ...prev, lastRentPaidDate: todayDateFormatted }));
    setFormData(prev => ({ ...prev, lastRentPaidDate: todayDateFormatted }));
    setAlertMessage('Rent payment recorded for today.');
    setShowAlertModal(true);
  };

  // Reminders Functions
  const handleAddReminder = async () => {
    if (!newReminderDescription || !newReminderDate) {
      setAlertMessage('Please provide both a description and a date for the reminder.');
      setShowAlertModal(true);
      return;
    }
    const newEntry = {
      id: `R${Date.now()}`, // Simple unique ID
      date: newReminderDate,
      description: newReminderDescription,
    };
    // In a real app, send update to backend
    console.log("Adding reminder:", newEntry);
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedReminders = [...formData.reminders, newEntry];
    setApartment(prev => ({ ...prev, reminders: updatedReminders }));
    setFormData(prev => ({ ...prev, reminders: updatedReminders }));
    setShowAddReminderForm(false);
    setNewReminderDescription('');
    setNewReminderDate('');
    setAlertMessage('Reminder added.');
    setShowAlertModal(true);
  };

  const handleDeleteReminder = (reminderId) => {
    setConfirmMessage('Are you sure you want to delete this reminder?');
    setConfirmAction(() => () => handleDeleteReminderConfirmed(reminderId)); // Pass reminderId
    setShowConfirmModal(true);
  };

  const handleDeleteReminderConfirmed = async (reminderId) => {
    setShowConfirmModal(false); // Close modal first
    console.log(`Deleting reminder ${reminderId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedReminders = formData.reminders.filter(r => r.id !== reminderId);
    setApartment(prev => ({ ...prev, reminders: updatedReminders }));
    setFormData(prev => ({ ...prev, reminders: updatedReminders }));
    setAlertMessage('Reminder deleted.');
    setShowAlertModal(true);
  };

  // Tenant Application Functions
  const handleAcceptApplication = (applicationId) => {
    setConfirmMessage('Are you sure you want to accept this application? This will mark the apartment as Occupied and assign this tenant.');
    setConfirmAction(() => () => handleAcceptApplicationConfirmed(applicationId));
    setShowConfirmModal(true);
  };

  const handleAcceptApplicationConfirmed = async (applicationId) => {
    setShowConfirmModal(false);

    if (apartment.status === 'Occupied') {
      setAlertMessage('This apartment is currently occupied. You must terminate the current lease before accepting a new application.');
      setShowAlertModal(true);
      return;
    }

    if (apartment.isTerminationRequested) {
      setAlertMessage('Lease termination is pending admin review. Cannot accept new applications until resolved.');
      setShowAlertModal(true);
      return;
    }


    const application = formData.pendingRequests.find(req => req.id === applicationId);
    if (!application) return;

    // Simulate backend update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update apartment status and tenant details
    const updatedApartment = {
      ...apartment,
      status: 'Occupied',
      tenantName: application.tenantName,
      tenantContact: application.tenantContact,
      leaseEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year lease
      pendingRequests: formData.pendingRequests.filter(req => req.id !== applicationId), // Remove accepted application
    };

    setApartment(updatedApartment);
    setFormData(updatedApartment);
    setAlertMessage(`Application from ${application.tenantName} accepted! Apartment is now Occupied.`);
    setShowAlertModal(true);
  };

  const handleDeclineApplication = (applicationId) => {
    setConfirmMessage('Are you sure you want to decline this application? It will be marked for Admin review.');
    setConfirmAction(() => () => handleDeclineApplicationConfirmed(applicationId));
    setShowConfirmModal(true);
  };

  const handleDeclineApplicationConfirmed = async (applicationId) => {
    setShowConfirmModal(false);
    const updatedRequests = formData.pendingRequests.map(req =>
      req.id === applicationId ? { ...req, status: 'DeclinedByLandlord' } : req
    );

    // Simulate backend update
    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedApartment = { ...apartment, pendingRequests: updatedRequests };
    setApartment(updatedApartment);
    setFormData(updatedApartment);
    setAlertMessage('Application declined and marked for Admin review.');
    setShowAlertModal(true);
  };


  // Image Gallery Navigation Handlers
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? apartment.images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === apartment.images.length - 1 ? 0 : prevIndex + 1
    );
  };


  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading apartment management details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error: {error}</p>
        <Link href="/landlords/" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Back to Dashboard</a>
        </Link>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div style={styles.container}>
        <p style={styles.notFoundText}>Apartment not found. Please check the ID or your permissions.</p>
        <Link href="/landlords/" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Back to Dashboard</a>
        </Link>
      </div>
    );
  }

  const hasMultipleImages = apartment.images && apartment.images.length > 1;

  // Calculate the status to display
  let effectiveStatus = getCalculatedStatus(apartment);
  // If termination is requested, show it prominently
  if (apartment.isTerminationRequested) {
    effectiveStatus = 'Termination Requested';
  }


  // Filter pending requests to show only 'Applied' or 'DeclinedByLandlord'
  const pendingApplications = (formData.pendingRequests || []).filter(req =>
    req.status === 'Applied' || req.status === 'DeclinedByLandlord'
  );

  return (
    <div style={styles.container}>
      <Link href="/landlords/" passHref legacyBehavior>
        <a style={styles.backLink}>&larr; Back to Dashboard</a>
      </Link>

      <h1 style={styles.heading(isTablet, isMobile)}>Manage Apartment: {apartment.name}</h1>

      <div style={styles.mainContent(isTablet)}>
        {/* Image Section */}
        <div style={styles.imageGalleryContainer(isTablet)}>
          {isEditing ? (
            <div style={styles.imageEditSection}>
              <label htmlFor="images" style={styles.inputLabel}>Image URLs (comma-separated):</label>
              <textarea
                id="images"
                name="images"
                value={formData.images.join(', ')}
                onChange={handleChange}
                style={styles.textareaField(isMobile)}
                rows="4"
                placeholder="e.g., url1.jpg, url2.png, url3.jpeg"
              />
              <p style={styles.inputHint}>Separate URLs with commas. First image will be primary.</p>
            </div>
          ) : (
            <div style={styles.galleryWrapper}>
              <div style={styles.galleryMainImageContainer(isMobile)}>
                <img
                  src={apartment.images[currentImageIndex] || 'https://placehold.co/800x500/E0E0E0/666666?text=No+Image'}
                  alt={`${apartment.name} image ${currentImageIndex + 1}`}
                  style={styles.galleryMainImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x500/E0E0E0/666666?text=No+Image'; }}
                />
                {hasMultipleImages && (
                  <>
                    <button style={{...styles.galleryNavButton, ...styles.galleryNavButtonLeft}} onClick={goToPreviousImage}>&#10094;</button>
                    <button style={{...styles.galleryNavButton, ...styles.galleryNavButtonRight}} onClick={goToNextImage}>&#10095;</button>
                    <div style={styles.imageCounter}>
                      {currentImageIndex + 1} / {apartment.images.length}
                    </div>
                  </>
                )}
              </div>
              {hasMultipleImages && (
                <div style={styles.thumbnailGallery}>
                  {apartment.images.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`${apartment.name} thumbnail ${index + 1}`}
                      style={{
                        ...styles.thumbnailImage,
                        ...(index === currentImageIndex ? styles.thumbnailImageActive : {}),
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E0E0E0/666666?text=X'; }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.detailsSection(isTablet)}>
          <div style={styles.detailsGrid(isMobile)}>
            <div style={styles.detailItem(isMobile)}><strong>Location:</strong> {isEditing ? <input type="text" name="location" value={formData.location} onChange={handleChange} style={styles.inputField(isMobile)} /> : apartment.location}</div>
            <div style={styles.detailItem(isMobile)}><strong>Price:</strong> {isEditing ? <input type="number" name="price" value={formData.price} min="0" onChange={handleChange} style={styles.inputField(isMobile)} /> : `₦${apartment.price}/month`}</div>
            <div style={styles.detailItem(isMobile)}><strong>Bedrooms:</strong> {isEditing ? <input type="number" name="bedrooms" value={formData.bedrooms} min="0" onChange={handleChange} style={styles.inputField(isMobile)} /> : apartment.bedrooms}</div>
            <div style={styles.detailItem(isMobile)}><strong>Bathrooms:</strong> {isEditing ? <input type="number" name="bathrooms" value={formData.bathrooms} min="0" onChange={handleChange} style={styles.inputField(isMobile)} /> : apartment.bathrooms}</div>
            <div style={styles.detailItem(isMobile)}>
              <strong>Status:</strong>
              <span style={effectiveStatus === 'Available' ? styles.statusAvailable : effectiveStatus === 'Termination Requested' ? styles.statusTerminationRequested : styles.statusOccupied}>{effectiveStatus}</span>
            </div>
            {/* Removed the manual status dropdown and maintenanceStartDate input */}
          </div>

          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Description</h2>
          {isEditing ? (
            <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textareaField(isMobile)} rows="6" />
          ) : (
            <p style={styles.description(isMobile)}>{apartment.description}</p>
          )}

          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Current Tenant & Lease</h2>
          {(apartment.status === 'Occupied' || (effectiveStatus === 'Maintenance' && apartment.tenantName) || effectiveStatus === 'Termination Requested') ? (
            <div style={styles.tenantInfo(isMobile)}>
              <p><strong>Name:</strong> {isEditing ? <input type="text" name="tenantName" value={formData.tenantName || ''} style={styles.readOnlyInputField(isMobile)} readOnly /> : apartment.tenantName}</p>
              <p><strong>Contact:</strong> {isEditing ? <input type="email" name="tenantContact" value={formData.tenantContact || ''} style={styles.readOnlyInputField(isMobile)} readOnly /> : <a href={`mailto:${apartment.tenantContact}`} style={styles.contactLink}>{apartment.tenantContact}</a>}</p>
              <p><strong>Lease End:</strong> {isEditing ? <input type="date" name="leaseEndDate" value={formData.leaseEndDate || ''} style={styles.readOnlyInputField(isMobile)} readOnly /> : (apartment.leaseEndDate || 'N/A')}</p>
              {apartment.isTerminationRequested && (
                <p style={styles.inputHint}>* Lease termination requested on {apartment.terminationRequestDate}</p>
              )}
            </div>
          ) : (
            <p style={styles.emptyState}>This apartment is currently available and has no active tenant.</p>
          )}

          {/* Lease Management Actions */}
          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Lease Actions</h2>
          <div style={styles.actionGroup}>
            {apartment.status === 'Occupied' && !apartment.isTerminationRequested && (
              <>
                <button
                  style={{ ...styles.baseButton, ...styles.secondaryButton, flexGrow: 0, width: isMobile ? '100%' : 'auto' }}
                  onClick={() => { setShowExtendLeaseForm(!showExtendLeaseForm); setNewLeaseEndDate(''); }}
                >
                  {showExtendLeaseForm ? 'Cancel Extend Lease' : 'Extend Lease'}
                </button>
                <button
                  style={{ ...styles.baseButton, ...styles.deleteButton, flexGrow: 0, width: isMobile ? '100%' : 'auto' }}
                  onClick={handleTerminateLease}
                >
                  Terminate Lease
                </button>
              </>
            )}
            {apartment.isTerminationRequested && (
                <button
                    style={{ ...styles.baseButton, ...styles.secondaryButton, flexGrow: 0, width: isMobile ? '100%' : 'auto', cursor: 'not-allowed' }}
                    disabled // Disable button
                >
                    Termination Requested ({apartment.terminationRequestDate})
                </button>
            )}
            {showExtendLeaseForm && (
              <div style={styles.inlineForm(isMobile)}>
                <label style={styles.inputLabel}>New Lease End Date:</label>
                <input
                  type="date"
                  value={newLeaseEndDate}
                  onChange={(e) => setNewLeaseEndDate(e.target.value)}
                  min={todayDateFormatted}
                  style={styles.inputField(isMobile)}
                />
                <button style={{ ...styles.baseButton, ...styles.primaryButton, flexGrow: 0, marginTop: '10px' }} onClick={handleExtendLease}>Confirm Extend</button>
              </div>
            )}
            {apartment.status !== 'Occupied' && !showExtendLeaseForm && !apartment.isTerminationRequested && (
              <p style={styles.emptyState}>No active lease to manage.</p>
            )}
          </div>

          {/* Tenant Applications Section */}
          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Tenant Applications</h2>
          <div style={styles.actionGroup}>
            {pendingApplications.length > 0 ? (
              <ul style={styles.maintenanceList}> {/* Reusing maintenanceList for similar styling */}
                {pendingApplications.map(app => (
                  <li key={app.id} style={styles.maintenanceItem}>
                    <p><strong>Tenant:</strong> {app.tenantName}</p>
                    <p><strong>Contact:</strong> {app.tenantContact}</p>
                    <p><strong>Applied On:</strong> {app.requestDate}</p>
                    <p><strong>Status:</strong> <span style={app.status === 'Applied' ? styles.statusAvailable : styles.statusOccupied}>
                      {app.status === 'DeclinedByLandlord' ? 'Declined (Admin Review)' : app.status}
                    </span></p>
                    {app.status === 'Applied' && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                        <button
                          style={{ ...styles.baseButton, ...styles.markCompleteButton, width: 'auto' }}
                          onClick={() => handleAcceptApplication(app.id)}
                        >
                          Accept
                        </button>
                        <button
                          style={{ ...styles.baseButton, ...styles.miniDeleteButton, width: 'auto', position: 'relative', top: 'unset', right: 'unset' }}
                          onClick={() => handleDeclineApplication(app.id)}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.emptyState}>No pending tenant applications.</p>
            )}
          </div>


          {/* Rent Payment Tracking */}
          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Rent Payment</h2>
          <div style={styles.actionGroup}>
            <p><strong>Last Paid:</strong> {apartment.lastRentPaidDate || 'Never'}</p>
            {apartment.status === 'Occupied' && (
              <button
                style={{ ...styles.baseButton, ...styles.primaryButton, flexGrow: 0, width: isMobile ? '100%' : 'auto' }}
                onClick={handleRecordRentPayment}
              >
                Record Rent Payment (Today)
              </button>
            )}
             {apartment.status !== 'Occupied' && (
              <p style={styles.inputHint}>Rent payment can only be recorded for occupied apartments.</p>
            )}
          </div>


          {/* Maintenance Log */}
          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Maintenance Log</h2>
          <div style={styles.actionGroup}>
            <button
              style={{ ...styles.baseButton, ...styles.secondaryButton, flexGrow: 0, width: isMobile ? '100%' : 'auto' }}
              onClick={() => { setShowAddMaintenanceForm(!showAddMaintenanceForm); setNewMaintenanceDescription(''); setNewMaintenanceDate(''); }}
            >
              {showAddMaintenanceForm ? 'Cancel Add Entry' : 'Add New Maintenance Entry'}
            </button>
            {showAddMaintenanceForm && (
              <div style={styles.inlineForm(isMobile)}>
                <label style={styles.inputLabel}>Description:</label>
                <input
                  type="text"
                  value={newMaintenanceDescription}
                  onChange={(e) => setNewMaintenanceDescription(e.target.value)}
                  style={styles.inputField(isMobile)}
                  placeholder="e.g., Leaky faucet, AC repair"
                />
                <label style={styles.inputLabel}>Date (Optional):</label>
                <input
                  type="date"
                  value={newMaintenanceDate}
                  onChange={(e) => setNewMaintenanceDate(e.target.value)}
                  max={todayDateFormatted} // Cannot log maintenance for future
                  style={styles.inputField(isMobile)}
                />
                <button style={{ ...styles.baseButton, ...styles.primaryButton, flexGrow: 0, marginTop: '10px' }} onClick={handleAddMaintenanceEntry}>Add Entry</button>
              </div>
            )}
            {formData.maintenanceLog.length > 0 ? (
              <ul style={styles.maintenanceList}>
                {formData.maintenanceLog.map(entry => (
                  <li key={entry.id} style={styles.maintenanceItem}>
                    <p><strong>Date:</strong> {entry.date}</p>
                    <p><strong>Description:</strong> {entry.description}</p>
                    <p><strong>Status:</strong> <span style={entry.status === 'Completed' ? styles.statusAvailable : styles.statusOccupied}>{entry.status}</span></p>
                    {entry.status === 'Completed' && <p><strong>Completed:</strong> {entry.completedDate}</p>}
                    {entry.status === 'Pending' && (
                      <button
                        style={{ ...styles.baseButton, ...styles.markCompleteButton }}
                        onClick={() => handleMarkMaintenanceComplete(entry.id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.emptyState}>No maintenance records.</p>
            )}
          </div>

          {/* Reminders */}
          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Reminders</h2>
          <div style={styles.actionGroup}>
            <button
              style={{ ...styles.baseButton, ...styles.secondaryButton, flexGrow: 0, width: isMobile ? '100%' : 'auto' }}
              onClick={() => { setShowAddReminderForm(!showAddReminderForm); setNewReminderDescription(''); setNewReminderDate(''); }}
            >
              {showAddReminderForm ? 'Cancel Add Reminder' : 'Add New Reminder'}
            </button>
            {showAddReminderForm && (
              <div style={styles.inlineForm(isMobile)}>
                <label style={styles.inputLabel}>Reminder Description:</label>
                <input
                  type="text"
                  value={newReminderDescription}
                  onChange={(e) => setNewReminderDescription(e.target.value)}
                  style={styles.inputField(isMobile)}
                  placeholder="e.g., Follow up on plumbing"
                />
                <label style={styles.inputLabel}>Date:</label>
                <input
                  type="date"
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  min={todayDateFormatted}
                  style={styles.inputField(isMobile)}
                  required
                />
                <button style={{ ...styles.baseButton, ...styles.primaryButton, flexGrow: 0, marginTop: '10px' }} onClick={handleAddReminder}>Add Reminder</button>
              </div>
            )}
            {formData.reminders.length > 0 ? (
              <ul style={styles.reminderList}>
                {formData.reminders.map(reminder => (
                  <li key={reminder.id} style={styles.reminderItem}>
                    <p><strong>Date:</strong> {reminder.date}</p>
                    <p><strong>Description:</strong> {reminder.description}</p>
                    <button
                      style={{ ...styles.baseButton, ...styles.miniDeleteButton }}
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      &#x2715; {/* Unicode 'X' mark */}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.emptyState}>No reminders set.</p>
            )}
          </div>


          <h2 style={styles.sectionHeading(isTablet, isMobile)}>Amenities</h2>
          {isEditing ? (
            <input type="text" name="amenities" value={formData.amenities.join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))} style={styles.inputField(isMobile)} placeholder="Comma-separated list" />
          ) : (
            <ul style={styles.amenitiesList(isMobile)}>
              {apartment.amenities.map((amenity, index) => (
                <li key={index} style={styles.amenityItem(isMobile)}>{amenity}</li>
              ))}
            </ul>
          )}

          <div style={styles.buttonGroup(isMobile)}>
            {isEditing ? (
              <>
                <button style={{ ...styles.baseButton, ...styles.primaryButton }} onClick={handleSaveChanges}>Save Changes</button>
                <button style={{ ...styles.baseButton, ...styles.secondaryButton }} onClick={() => { setIsEditing(false); setFormData(apartment); }}>Cancel</button>
              </>
            ) : (
              <button style={{ ...styles.baseButton, ...styles.primaryButton }} onClick={() => setIsEditing(true)}>Edit Apartment Details</button>
            )}
            <button style={{ ...styles.baseButton, ...styles.deleteButton }} onClick={handleDeleteApartment}>Delete Apartment</button>
          </div>
        </div>
      </div>

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

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {setShowConfirmModal(false); setConfirmAction(null);}} // Allow closing without action
        title="Confirm Action"
        showCloseButton={false} // Force user to choose an action
      >
        <p>{confirmMessage}</p>
        <div style={modalStyles.modalButtonGroup}>
          <button
            style={{ ...modalStyles.modalButton, ...modalStyles.modalSecondaryButton }}
            onClick={() => {
              setShowConfirmModal(false);
              setConfirmAction(null); // Clear action
            }}
          >
            Cancel
          </button>
          <button
            style={{ ...modalStyles.modalButton, ...modalStyles.modalDangerButton }}
            onClick={() => {
              if (confirmAction) {
                confirmAction();
              }
              // Action will handle closing the modal or setting new alert
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

// --- Inline Styles (Modernized, Responsive, and Color-Adjusted) ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '40px 20px',
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    backgroundColor: '#f8f8f8', // Very light grey background for subtlety
    minHeight: '100vh',
    color: '#333d47', // Dark text for readability
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)', // Softer shadow
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '30px',
    color: '#607d8b',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'color 0.2s ease',
    gap: '5px',
    '&:hover': {
      color: '#4a6572',
    },
  },
  heading: (isTablet, isMobile) => ({
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333d47',
    fontSize: isMobile ? '1.8em' : (isTablet ? '2.2em' : '2.5em'),
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
    color: '#dc3545', // Standard red for errors
    paddingTop: '80px',
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#7f8c8d',
    paddingTop: '50px',
  },
  mainContent: (isTablet) => ({
    display: 'flex',
    gap: '30px',
    flexDirection: isTablet ? 'column' : 'row',
    alignItems: 'flex-start', // Align items to the start to prevent stretching
  }),
  imageGalleryContainer: (isTablet) => ({
    flex: '1',
    minWidth: isTablet ? 'unset' : '300px',
    width: isTablet ? '100%' : 'auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '0',
    height: isTablet ? '250px' : '400px', // Fixed height for image container
  }),
  galleryWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '15px',
    height: '100%', // Ensure wrapper takes full height of container
  },
  galleryMainImageContainer: (isMobile) => ({ // Renamed to add isMobile param
    position: 'relative',
    width: '100%',
    height: isMobile ? '180px' : '300px', // Adjusted height within container for main image
    overflow: 'hidden',
    display: 'flex', // Changed to flex for centering
    alignItems: 'center', // Center image vertically
    justifyContent: 'center', // Center image horizontally
    borderBottom: '1px solid #f0f0f0',
    borderRadius: '12px 12px 0 0',
  }),
  galleryMainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Cover to fill container, cropping if necessary
    display: 'block',
    transition: 'opacity 0.3s ease-in-out',
  },
  galleryNavButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(96, 125, 139, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(96, 125, 139, 0.9)',
      transform: 'translateY(-50%) scale(1.05)',
    },
    '@media (max-width: 480px)': {
      width: '30px',
      height: '30px',
      fontSize: '1.2em',
    },
  },
  galleryNavButtonLeft: {
    left: '10px',
  },
  galleryNavButtonRight: {
    right: '10px',
  },
  thumbnailGallery: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    padding: '15px 0',
    width: '100%',
    boxSizing: 'border-box',
  },
  thumbnailImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, transform 0.1s ease',
    '&:hover': {
      borderColor: '#D5DB89',
      transform: 'scale(1.03)',
    },
    '@media (max-width: 480px)': {
      width: '50px',
      height: '50px',
    },
  },
  thumbnailImageActive: {
    borderColor: '#ABB237',
    boxShadow: '0 0 0 2px rgba(171,178,55,0.5)',
  },
  imageEditSection: {
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  inputLabel: {
    display: 'block',
    fontSize: '1em',
    fontWeight: '600',
    color: '#333d47',
    marginBottom: '8px',
  },
  inputHint: {
    fontSize: '0.85em',
    color: '#7f8c8d',
    marginTop: '5px',
    fontStyle: 'italic',
  },
  imageCounter: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '0.8em',
    zIndex: 10,
  },
  detailsSection: (isTablet) => ({
    flex: '2',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: isTablet ? '15px' : '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
    border: '1px solid #e9e9e9',
  }),
  detailsGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: isMobile ? '10px' : '15px',
    marginBottom: '30px',
  }),
  detailItem: (isMobile) => ({
    backgroundColor: '#fdfdfd',
    padding: isMobile ? '12px' : '15px',
    borderRadius: '10px',
    border: '1px solid #e9e9e9',
    fontWeight: '500',
    color: '#4a5568',
    fontSize: isMobile ? '0.9em' : '0.95em',
  }),
  sectionHeading: (isTablet, isMobile) => ({
    fontSize: isMobile ? '1.2em' : (isTablet ? '1.4em' : '1.6em'),
    fontWeight: '700',
    color: '#333d47',
    marginBottom: '15px',
    marginTop: isTablet ? '20px' : '30px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px',
  }),
  description: (isMobile) => ({
    lineHeight: '1.6',
    color: '#4a5568',
    marginBottom: isMobile ? '20px' : '30px',
    fontSize: isMobile ? '0.9em' : '1em',
  }),
  tenantInfo: (isMobile) => ({
    backgroundColor: '#f5f7f2',
    border: '1px solid #e6ebcc',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '30px',
    fontSize: isMobile ? '0.9em' : '1em',
  }),
  contactLink: {
    color: '#607d8b',
    textDecoration: 'none',
    fontWeight: 'normal',
    transition: 'color 0.2s ease',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  readOnlyInputField: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f2f2f2', // Light grey background for read-only
    color: '#666',
    fontSize: isMobile ? '0.9em' : '0.95em',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
    cursor: 'not-allowed', // Indicate it's not editable
  }),
  emptyState: {
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
    padding: '10px 0',
    backgroundColor: '#fdfdfd', // Light background for empty states
    borderRadius: '8px',
    border: '1px solid #e9e9e9',
    marginTop: '15px',
  },
  amenitiesList: (isMobile) => ({
    listStyleType: 'none',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: isMobile ? '8px' : '10px',
    marginBottom: '30px',
  }),
  amenityItem: (isMobile) => ({
    backgroundColor: '#eef0e3',
    padding: isMobile ? '8px 12px' : '10px 15px',
    borderRadius: '8px',
    border: '1px solid #d5db89',
    color: '#5b611e',
    fontWeight: '600',
    fontSize: isMobile ? '0.85em' : '0.9em',
  }),
  buttonGroup: (isMobile) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginTop: '30px',
    justifyContent: 'flex-end',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'flex-end',
  }),
  baseButton: {
    padding: '12px 22px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    flexGrow: 1,
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
  deleteButton: {
    backgroundColor: '#a74747',
    color: 'white',
    boxShadow: '0 2px 6px rgba(167,71,71,0.2)',
    '&:hover': {
      backgroundColor: '#913f3f',
      transform: 'translateY(-1px)',
    },
    '@media (max-width: 480px)': {
      marginTop: '10px',
    },
  },
  inputField: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: isMobile ? '0.9em' : '0.95em',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.2)',
      outline: 'none',
    },
  }),
  textareaField: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: isMobile ? '0.9em' : '0.95em',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
    minHeight: isMobile ? '80px' : '100px',
    resize: 'vertical',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.2)',
      outline: 'none',
    },
  }),
  selectField: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '8px' : '10px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: isMobile ? '0.9em' : '0.95em',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    '&:focus': {
      borderColor: '#D5DB89',
      boxShadow: '0 0 0 3px rgba(213, 219, 137, 0.2)',
      outline: 'none',
    },
  }),
  statusAvailable: {
    backgroundColor: '#e6ebcc',
    color: '#5b611e',
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '0.9em',
  },
  statusOccupied: {
    backgroundColor: '#fbe9e7',
    color: '#c0392b',
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '0.9em',
  },
  statusTerminationRequested: { // New style for termination requested status
    backgroundColor: '#ffecb3', // Light orange/yellow
    color: '#e65100', // Darker orange
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '0.9em',
    fontWeight: '600',
  },
  // New Styles for Added Features
  actionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    border: '1px solid #e9e9e9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  inlineForm: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px dashed #e0e0e0',
    width: '100%', // Take full width of parent actionGroup
  }),
  maintenanceList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '15px',
  },
  maintenanceItem: {
    backgroundColor: '#f9f9f9',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ebebeb',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    position: 'relative', // For mark complete button positioning
  },
  markCompleteButton: {
    backgroundColor: '#4CAF50', // Green for complete
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.85em',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-end', // Align to the right
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  reminderList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '15px',
  },
  reminderItem: {
    backgroundColor: '#fffbe6', // Light yellow for reminders
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ffe0b2',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    position: 'relative',
  },
  miniDeleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.8)',
    },
  },
};

// --- Styles for the Modals ---
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
