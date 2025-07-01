// pages/landlords/inquiries.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- Utility Function to Simulate Fetching Inquiries ---
// In a real application, this would fetch inquiry data from your backend API
async function fetchInquiries() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return dummy inquiry data
  return [
    { id: 'I1', apartmentId: 'L2', apartmentName: 'Student Hostel Room B', studentName: 'Chike Obi', studentEmail: 'chike.o@example.com', message: 'Is this room still available for the next academic year? I am looking for something affordable near the campus.', date: '2025-06-25', status: 'New' },
    { id: 'I2', apartmentId: 'L1', apartmentName: 'Luxury Apartment, Uni Estate', studentName: 'Fatimah Musa', studentEmail: 'fatimah.m@example.com', message: 'I am interested in viewing the Luxury Apartment next week. What are your available slots?', date: '2025-06-24', status: 'Responded' },
    { id: 'I3', apartmentId: 'L2', apartmentName: 'Student Hostel Room B', studentName: 'Emeka Nnamdi', studentEmail: 'emeka.n@example.com', message: 'Do you offer a discount for early bird applications for the hostel room?', date: '2025-06-23', status: 'New' },
    { id: 'I4', apartmentId: 'L3', apartmentName: 'Spacious Family Flat', studentName: 'Sarah Kalu', studentEmail: 'sarah.k@example.com', message: 'I saw your listing for the family flat. Is it suitable for a family with two small children?', date: '2025-06-22', status: 'Archived' },
  ];
}

// --- InquiryReplyModal Component ---
// This component displays the selected inquiry and allows the landlord to type a reply.
const InquiryReplyModal = ({ inquiry, onClose, onSendReply }) => {
  const [replyMessage, setReplyMessage] = useState('');

  if (!inquiry) return null; // Don't render if no inquiry is selected

  const handleReplySubmit = () => {
    if (replyMessage.trim()) {
      onSendReply(inquiry.id, replyMessage);
      setReplyMessage(''); // Clear reply message after sending
    } else {
      // IMPORTANT: In a real application, use a custom modal for this message
      alert('Please type a reply before sending.');
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent click from closing modal */}
        <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
        <h2 style={modalStyles.modalTitle}>Reply to Inquiry</h2>

        <div style={modalStyles.inquiryDetails}>
          <p><strong>Apartment:</strong> {inquiry.apartmentName}</p>
          <p><strong>From:</strong> {inquiry.studentName} (<a href={`mailto:${inquiry.studentEmail}`} style={styles.studentEmailLink}>{inquiry.studentEmail}</a>)</p>
          <p><strong>Message:</strong></p>
          <div style={modalStyles.inquiryMessageBlock}>
            "{inquiry.message}"
          </div>
          <p style={modalStyles.inquiryDate}>Received: {inquiry.date}</p>
        </div>

        <div style={modalStyles.replySection}>
          <label htmlFor="replyMessage" style={modalStyles.replyLabel}>Your Reply:</label>
          <textarea
            id="replyMessage"
            style={modalStyles.replyTextarea}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
            rows="6"
          ></textarea>
          <button style={modalStyles.sendButton} onClick={handleReplySubmit}>Send Reply</button>
        </div>
      </div>
    </div>
  );
};


// --- LandlordInquiriesPage Component ---
export default function LandlordInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const getInquiries = async () => {
      try {
        const data = await fetchInquiries(); // Call the simulated API function
        setInquiries(data);
      } catch (err) {
        setError('Failed to load inquiries. Please try again later.');
        console.error('Error fetching inquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    getInquiries();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading inquiries...</p>
      </div>
    );
  }

  // Display error state
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

  // Function to handle viewing an inquiry (now opens modal)
  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleSendReply = (inquiryId, replyText) => {
    // Simulate sending reply (e.g., to an API)
    console.log(`Sending reply to inquiry ${inquiryId}: "${replyText}"`);
    // In a real app, you'd send an API request to record the reply
    // and potentially update the inquiry status to 'Responded'.

    setInquiries(prev => prev.map(inq =>
      inq.id === inquiryId ? { ...inq, status: 'Responded' } : inq
    ));

    // IMPORTANT: Use a custom modal/notification for user feedback
    alert(`Reply sent to inquiry ${inquiryId}. Status updated to Responded.`);
    setIsModalOpen(false); // Close the modal after sending
    setSelectedInquiry(null); // Clear selected inquiry
  };

  const handleMarkAsResponded = (inquiryId) => {
    setInquiries(prev => prev.map(inq =>
      inq.id === inquiryId ? { ...inq, status: 'Responded' } : inq
    ));
    // IMPORTANT: Use a custom modal/notification for user feedback
    alert(`Inquiry ${inquiryId} marked as Responded.`);
    // In a real app, you'd send an API request to update the status in the backend
  };

  const handleArchiveInquiry = (inquiryId) => {
    setInquiries(prev => prev.filter(inq => inq.id !== inquiryId)); // Simply remove from list for simulation
    // IMPORTANT: Use a custom modal/notification for user feedback
    alert(`Inquiry ${inquiryId} archived.`);
    // In a real app, you'd send an API request to archive the inquiry in the backend
  };

  return (
    <div style={styles.container}>
      <Link href="/landlords/" passHref legacyBehavior>
        <a style={styles.backLink}>&larr; Back to Dashboard</a>
      </Link>

      <h1 style={styles.heading}>Tenant Inquiries</h1>
      <p style={styles.subheading}>Manage communications from prospective students.</p>

      {inquiries.length === 0 ? (
        <p style={styles.emptyState}>No inquiries found at the moment. Keep an eye out for new interest!</p>
      ) : (
        <div style={styles.inquiriesGrid}>
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} style={styles.inquiryCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.apartmentName}>{inquiry.apartmentName}</h2>
                <span style={{
                  ...styles.statusBadge,
                  ...(inquiry.status === 'New' && styles.statusNew),
                  ...(inquiry.status === 'Responded' && styles.statusResponded),
                  ...(inquiry.status === 'Archived' && styles.statusArchived),
                }}>
                  {inquiry.status}
                </span>
              </div>
              <p style={styles.studentInfo}>From: <strong>{inquiry.studentName}</strong> (<a href={`mailto:${inquiry.studentEmail}`} style={styles.studentEmailLink}>{inquiry.studentEmail}</a>)</p>
              <p style={styles.inquiryMessage}>"{inquiry.message}"</p>
              <p style={styles.inquiryDate}>Received: {inquiry.date}</p>
              <div style={styles.cardActions}>
                <button
                  style={styles.actionButton}
                  onClick={() => handleViewInquiry(inquiry)} // This button now opens the modal
                >
                  View & Reply
                </button>
                {inquiry.status === 'New' && (
                  <button
                    style={{ ...styles.actionButton, ...styles.markRespondedButton }}
                    onClick={() => handleMarkAsResponded(inquiry.id)}
                  >
                    Mark as Responded
                  </button>
                )}
                <button
                  style={{ ...styles.actionButton, ...styles.archiveButton }}
                  onClick={() => handleArchiveInquiry(inquiry.id)}
                >
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The Modal Component */}
      {isModalOpen && ( // Only render the modal if isModalOpen is true
        <InquiryReplyModal
          inquiry={selectedInquiry}
          onClose={() => setIsModalOpen(false)}
          onSendReply={handleSendReply}
        />
      )}
    </div>
  );
}

// --- Inline Styles (Modernized and Color-Adjusted for Professionalism) ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f8f8', // Very light grey background for subtlety
    minHeight: '100vh',
    color: '#333d47', // Dark text for readability
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.05)', // Softer shadow
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '30px',
    color: '#607d8b', // Muted professional blue-grey
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'color 0.2s ease',
    gap: '5px',
  },
  backLinkHover: {
    color: '#4a6572',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333d47',
    fontSize: '3em',
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)', // Even softer shadow
  },
  subheading: {
    textAlign: 'center',
    fontSize: '1.25em',
    color: '#7f8c8d', // Softer grey for subheading
    marginBottom: '50px',
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
    color: '#dc3545', // Standard red for errors
    paddingTop: '80px',
  },
  emptyState: {
    color: '#7f8c8d',
    fontStyle: 'italic',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.03)', // Very subtle shadow
    border: '1px solid #e0e0e0',
  },

  inquiriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
  },
  inquiryCard: {
    backgroundColor: '#ffffff', // Primary White
    border: '1px solid #e9e9e9', // Very subtle border
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)', // Refined shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  inquiryCardHover: {
    transform: 'translateY(-3px)', // More subtle lift
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  apartmentName: {
    fontSize: '1.5em',
    fontWeight: '700',
    color: '#333d47',
    margin: 0,
    lineHeight: '1.3',
    flexGrow: 1,
    paddingRight: '10px',
  },
  statusBadge: {
    padding: '8px 15px',
    borderRadius: '25px',
    fontSize: '0.9em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', // Soft badge shadow
  },
  statusNew: {
    backgroundColor: '#fef3c7', // Very light, desaturated yellow/orange
    color: '#92400e', // Darker, earthy text for contrast
  },
  statusResponded: {
    backgroundColor: '#e6ebcc', // Lighter, desaturated version of secondary
    color: '#5b611e', // Darker text for secondary color
  },
  statusArchived: {
    backgroundColor: '#e0e0e0', // Neutral grey
    color: '#616161', // Dark grey text
  },
  studentInfo: {
    fontSize: '1em',
    color: '#7f8c8d',
    marginBottom: '10px',
  },
  studentEmailLink: {
    color: '#607d8b',
    textDecoration: 'none',
    fontWeight: 'normal',
    transition: 'color 0.2s ease',
  },
  studentEmailLinkHover: {
    textDecoration: 'underline',
  },
  inquiryMessage: {
    fontSize: '1em',
    color: '#4a5568',
    fontStyle: 'italic',
    marginBottom: '20px',
    lineHeight: '1.6',
    flexGrow: 1,
    borderLeft: '3px solid #e9e9e9', // Consistent light border
    paddingLeft: '15px',
    marginLeft: '-15px',
  },
  inquiryDate: {
    fontSize: '0.85em',
    color: '#aab7c0',
    textAlign: 'right',
    marginTop: 'auto',
    marginBottom: '15px',
  },
  cardActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: 'auto',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#abb237', // Secondary color
    color: 'white',
    padding: '12px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.95em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 8px rgba(171,178,55,0.2)', // Softer shadow for buttons
  },
  actionButtonHover: {
    backgroundColor: '#99a02f', // Darker shade of secondary for hover
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 10px rgba(171,178,55,0.3)',
  },
  markRespondedButton: {
    backgroundColor: '#7aa67a', // More subdued green
  },
  markRespondedButtonHover: {
    backgroundColor: '#6b926b',
  },
  archiveButton: {
    backgroundColor: '#a74747', // Muted red/burgundy
  },
  archiveButtonHover: {
    backgroundColor: '#913f3f',
  },
};

// --- Modal Specific Styles (Adhering to professional tones) ---
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly lighter overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)', // Subtle blur
  },
  modalContent: {
    backgroundColor: '#ffffff', // Primary White
    padding: '35px',
    borderRadius: '15px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)', // Refined shadow
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.8em', // Slightly smaller
    color: '#a0a0a0', // Lighter, subtle grey
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  closeButtonHover: {
    color: '#666',
  },
  modalTitle: {
    fontSize: '2em',
    color: '#333d47',
    marginBottom: '25px',
    textAlign: 'center',
    fontWeight: '700',
  },
  inquiryDetails: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#fdfdfd', // Very light grey, almost white
    borderRadius: '10px',
    border: '1px solid #e9e9e9',
  },
  inquiryMessageBlock: {
    backgroundColor: '#f5f7f2', // Very light green tint, subtle
    padding: '15px',
    borderRadius: '8px',
    marginTop: '10px',
    fontStyle: 'italic',
    lineHeight: '1.6',
    color: '#4a5568',
    borderLeft: '4px solid #abb237', // Highlight with secondary color
  },
  inquiryDate: {
    fontSize: '0.9em',
    color: '#aab7c0',
    textAlign: 'right',
    marginTop: '10px',
  },
  replySection: {
    marginTop: '20px',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '20px',
  },
  replyLabel: {
    display: 'block',
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#333d47',
    marginBottom: '10px',
  },
  replyTextarea: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: '"Inter", sans-serif',
    marginBottom: '20px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  replyTextareaFocus: {
    borderColor: '#abb237', // Focus border with secondary color
    boxShadow: '0 0 0 3px rgba(171, 178, 55, 0.2)', // Softer shadow with secondary color
  },
  sendButton: {
    backgroundColor: '#abb237', // Secondary color for send button
    color: 'white',
    padding: '14px 25px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 10px rgba(171,178,55,0.3)', // Shadow matching secondary color
  },
  sendButtonHover: {
    backgroundColor: '#99a02f', // Darker shade of secondary for hover
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(171,178,55,0.4)',
  },
};
