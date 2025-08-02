"use client"; // This directive marks the component as a Client Component

import { usePathname } from "next/navigation";
import React, { useState, createContext, useEffect } from "react";
import Link from "next/link";

// Export context for use in other files
export const DashboardContext = createContext({
  isLoggedIn: false,
  user: null,
  showMessage: () => {}, // Add showMessage to default context value
  tenants: [], // Add tenants to context
  setTenants: () => {}, // Add setTenants to context
  properties: [], // Add properties to context
  setProperties: () => {}, // Add setProperties to context
  notifications: [], // Add notifications to context
  setNotifications: () => {}, // Add setNotifications to context
  addNotification: () => {}, // Add new addNotification function
  handleApprovePaymentNotification: () => {}, // Add payment approval handler
  handleDeclinePaymentNotification: () => {}, // Add payment decline handler
  // Add other shared states/functions if they will be provided by the context
});

function MessageBox({ message, type }) {
  if (!message) return null;
  return (
    <div className={`message-box show ${type}`}>
      {message}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const sizeClass = size === 'lg' ? 'modal-content-lg' : '';

  return (
    <div
      className={isOpen ? "modal-overlay show" : "modal-overlay"}
      onClick={onClose}
    >
      <div className={`modal-content ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function NotificationDetailsModal({ isOpen, onClose, notification, tenants, properties }) { // Pass tenants and properties
  if (!isOpen || !notification) return null;
  // Determine text style based on read status
  const textStyle = {
    color: notification.read ? '#6b7280' : '#1f2937', // Gray for read, dark for unread
    fontWeight: notification.read ? 'normal' : 'bold', // Normal for read, bold for unread
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.name : "N/A";
  };

  const getTenantName = (tenantId) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant ? tenant.name : "N/A";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Details">
      <div className="notification-detail-content">
        <p style={textStyle}><strong>Date:</strong> {notification.date}</p>
        <p style={textStyle}><strong>Message:</strong> {notification.message}</p>
        <p style={textStyle}><strong>Status:</strong> {notification.read ? "Read" : "Unread"}</p>
        {notification.type === 'payment_received' && notification.paymentDetails && (
          <>
            <p style={textStyle}><strong>Payment Amount:</strong> ₦{notification.paymentDetails.amount.toLocaleString()}</p>
            <p style={textStyle}><strong>Tenant:</strong> {notification.paymentDetails.tenantName}</p>
            <p style={textStyle}><strong>Property:</strong> {getPropertyName(notification.paymentDetails.propertyId)}</p>
            {notification.paymentDetails.expectedCompletionDate && (
              <p style={textStyle}><strong>Expected Completion:</strong> {notification.paymentDetails.expectedCompletionDate}</p>
            )}
          </>
        )}
        {notification.type === 'rent_overdue' && notification.details && (
          <>
            <p style={textStyle}><strong>Tenant:</strong> {notification.details.tenantName}</p>
            <p style={textStyle}><strong>Property:</strong> {getPropertyName(notification.details.propertyId)}</p> {/* Use getPropertyName */}
            <p style={textStyle}><strong>Amount Due:</strong> ₦{notification.details.amountDue.toLocaleString()}</p>
          </>
        )}
        {notification.type === 'apartment_approved' && notification.details && (
          <>
            <p style={textStyle}><strong>New Tenant:</strong> {notification.details.tenantName}</p>
            <p style={textStyle}><strong>Property:</strong> {getPropertyName(notification.details.propertyId)}</p> {/* Use getPropertyName */}
          </>
        )}
        {notification.type === 'tenant_removed' && notification.details && (
          <>
            <p style={textStyle}><strong>Tenant Removed:</strong> {notification.details.tenantName}</p>
            <p style={textStyle}><strong>Property:</strong> {getPropertyName(notification.details.propertyId)}</p> {/* Use getPropertyName */}
          </>
        )}
        {(notification.type === 'payment_approved' || notification.type === 'payment_declined') && notification.details && (
          <>
            <p style={textStyle}><strong>Tenant:</strong> {notification.details.tenantName}</p>
            <p style={textStyle}><strong>Amount:</strong> ₦{notification.details.amount.toLocaleString()}</p>
            <p style={textStyle}><strong>Action:</strong> {notification.type === 'payment_approved' ? 'Approved' : 'Declined'}</p>
            {notification.details.expectedCompletionDate && notification.type === 'payment_approved' && (
              <p style={textStyle}><strong>New Due Date:</strong> {notification.details.expectedCompletionDate}</p>
            )}
          </>
        )}
        {notification.type === 'property_deletion_request' && notification.details && (
          <>
            <p style={textStyle}><strong>Property:</strong> {notification.details.propertyName}</p>
            <p style={textStyle}><strong>Tenants:</strong> {notification.details.tenantCount} active tenant(s)</p>
            <p style={textStyle}><strong>Status:</strong> Pending Admin Review</p>
          </>
        )}
        {notification.type === 'maintenance_request' && notification.details && (
          <>
            <p style={textStyle}><strong>Property:</strong> {notification.details.propertyName}</p>
            <p style={textStyle}><strong>Description:</strong> {notification.details.description}</p>
            <p style={textStyle}><strong>Urgency:</strong> {notification.details.urgency}</p>
            <p style={textStyle}><strong>Preferred Date:</strong> {notification.details.preferredDate}</p>
            <p style={textStyle}><strong>Preferred Time:</strong> {notification.details.preferredTime || 'N/A'}</p>
            <p style={textStyle}><strong>Status:</strong> {notification.details.status}</p>
            <p style={textStyle}><strong>Requested On:</strong> {notification.details.dateRequested}</p>
          </>
        )}
        {notification.type === 'property_update' && notification.details && (
          <>
            <p style={textStyle}><strong>Property:</strong> {notification.details.propertyName}</p>
            <p style={textStyle}><strong>Tenant:</strong> {getTenantName(notification.details.tenantId)}</p>
            {notification.details.oldRentPerRoom !== undefined && (
              <p style={textStyle}><strong>Rent Change:</strong> From ₦{notification.details.oldRentPerRoom.toLocaleString()} to ₦{notification.details.newRentPerRoom.toLocaleString()}</p>
            )}
            <p style={textStyle}><strong>Message:</strong> {notification.message}</p>
          </>
        )}
      </div>
    </Modal>
  );
}

// New Payment Approval Modal
function PaymentApprovalModal({ isOpen, onClose, notification, onApprove, onDecline }) {
  if (!isOpen || !notification || notification.type !== 'payment_received') return null;
  const { tenantId, amount, propertyId, currentRentDue, tenantName, expectedCompletionDate } = notification.paymentDetails; // Added expectedCompletionDate

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Payment">
      <div className="payment-approval-content text-center p-4">
        <p className="mb-4 text-lg font-semibold">
          A payment of <strong>₦{amount.toLocaleString()}</strong> has been received from <strong>{tenantName}</strong>.
        </p>
        <p className="mb-4 text-gray-700">
          Current rent due before this payment: ₦{currentRentDue.toLocaleString()}.
        </p>
        {expectedCompletionDate && (
          <p className="mb-4 text-gray-700">
            Tenant expects to complete payment by: <strong>{expectedCompletionDate}</strong>.
          </p>
        )}
        <p className="mb-6 text-gray-700">
          Do you want to accept this payment?
        </p>
        <div className="flex justify-center space-x-4">
          <button className="button-secondary" onClick={() => onDecline(notification.id, tenantName, amount, expectedCompletionDate)}>Decline</button>
          <button className="button-primary" onClick={() => onApprove(notification.id, { tenantId, amount, propertyId, tenantName, expectedCompletionDate })}>Accept Payment</button>
        </div>
      </div>
    </Modal>
  );
}

// --- Login/Signup Modal Component (Simulated) ---
// Provides a mock login/signup interface for demonstration purposes.
function LoginSignupModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggles between login and signup forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Message for login/signup feedback

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (isLogin) {
      // Simulated login logic
      if (email === "demo@example.com" && password === "password") {
        onLoginSuccess({ email, uid: "simulated-user-id" }); // Call parent success handler
        onClose(); // Close the modal
      } else {
        setMessage(
          "Invalid email or password. Try demo@example.com / password"
        );
      }
    } else {
      // Simulated signup logic
      if (email && password) {
        onLoginSuccess({ email, uid: `simulated-user-${Date.now()}` }); // Create a unique ID for simulated user
        onClose(); // Close the modal
      } else {
        setMessage("Please enter a valid email and password.");
      }
    }
  };

  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isLogin ? "Login" : "Sign Up"}</h3>
          <button className="modal-close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="form-spacing">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {message && <p className="form-error-message">{message}</p>}
            <button type="submit" className="button-primary button-full-width">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="form-footer-text">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-button"
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Sidebar({
  isSidebarOpen,
  isSidebarCollapsed,
  handleNavigation,
  activeSection,
  toggleSidebarCollapse,
  user,
  isLoggedIn,
  handleUserAvatarClick,
  handleNotificationBellClick,
  notificationsCount,
  handleViewRemindersClick,
  hasUpcomingReminders,
}) {
  const navItems = [
    {
      id: "overview",
      label: "Overview",
      href: "/landlords",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "properties",
      label: "Properties",
      href: "/landlords/properties",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "tenants",
      label: "Tenants",
      href: "/landlords/tenants",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      href: "/landlords/maintenance",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      id: "financials",
      label: "Financials",
      href: "/landlords/financials",
      icon: "M9 8h6m-5 4h4m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      id: "communications",
      label: "Communications",
      href: "/landlords/communications",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    },
    {
      id: "reports",
      label: "Reports",
      href: "/landlords/reports",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];
  const pathname = usePathname();
  return (
    <aside
      className={`sidebar ${isSidebarOpen ? "open" : ""} ${
        isSidebarCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="logo">
          <svg
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          {!isSidebarCollapsed && <span className="logo-text">Lodger</span>}
        </div>

      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href} // Use href for actual routing
            className={`nav-item ${item.href === pathname ? "active" : ""}`} // Determine active state based on current path
            onClick={() => {}}
          >
            <div className="nav-item-inner">
              {/* SVG icon for each navigation item */}
              <svg
                className="nav-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={item.icon}
                ></path>
              </svg>
              {!isSidebarCollapsed && (
                <span className="nav-label">{item.label}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>
            <button
          className="toggle-sidebar-button"
          onClick={toggleSidebarCollapse}
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      <div className="sidebar-footer">
        <div className="user-profile" onClick={handleUserAvatarClick}>
          <div className="user-avatar">
            {isLoggedIn && user ? (
              user.email.charAt(0).toUpperCase()
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          {!isSidebarCollapsed && (
            <div className="user-info">
              <span className="user-name">
                {isLoggedIn && user ? user.email.split("@")[0] : "Guest"}
              </span>
              <span className="user-status">
                {isLoggedIn ? "Landlord" : "Not Logged In"}
              </span>
            </div>
          )}
        </div>
        <div className="sidebar-actions">
          <button
            className="action-button"
            onClick={handleNotificationBellClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationsCount > 0 && (
              <span className="notification-badge">{notificationsCount}</span>
            )}
          </button>
          <button className="action-button" onClick={handleViewRemindersClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {hasUpcomingReminders && <span className="reminder-dot"></span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
function Header({ toggleSidebarOpen, getGreeting, user }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button md:hidden" onClick={toggleSidebarOpen} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        </button>
        <h2 className="header-title">{getGreeting()}, {user ? user.email.split("@")[0] : "Guest"}!</h2>
      </div>
    </header>
  );
}

// --- DashboardLayout Component (Default Export) ---
// This component acts as the main layout, containing the Sidebar and Header,
// and manages their shared state.
export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isPaymentApprovalModalOpen, setIsPaymentApprovalModalOpen] = useState(false); // New state for payment modal
  const [selectedPaymentNotification, setSelectedPaymentNotification] = useState(null); // New state for selected payment notification

  // Properties data (moved here to be central)
  const [properties, setProperties] = useState([
    {
      id: "p1",
      name: "Grand House",
      totalRooms: 5,
      occupiedRooms: 3,
      rentPerRoom: 50000,
      address: "123 Main St",
      imageUrl: "https://placehold.co/400x200/ADD8E6/000000?text=Grand+House",
      leasePeriod: 12, // Added lease period
    },
    {
      id: "p2",
      name: "City Lodge",
      totalRooms: 3,
      occupiedRooms: 3,
      rentPerRoom: 65000,
      address: "456 Oak Ave",
      imageUrl: "https://placehold.co/400x200/C0C0C0/000000?text=City+Lodge",
      leasePeriod: 6, // Added lease period
    },
    {
      id: "p3",
      name: "Student Annex",
      totalRooms: 8,
      occupiedRooms: 6,
      rentPerRoom: 30000,
      address: "789 University Rd",
      imageUrl: "https://placehold.co/400x200/D3D3D3/000000?text=Student+Annex",
      leasePeriod: 24, // Added lease period
    },
  ]);

  // Tenants state, now managed centrally
  const [tenants, setTenants] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate date comparison

    const initialTenantsData = [
      {
        id: "t1",
        name: "Alice Smith",
        propertyId: "p1",
        rentDue: 0, 
        rentDueDate: "2025-08-01", 
        contact: "alice@example.com",
        phone: "111-222-3333",
        leaseStart: "2024-08-01",
        leaseEnd: "2026-07-31", 
        imageUrl: "https://placehold.co/100x100/ADD8E6/000000?text=AS",
        paymentStatus: 'paid' // Initial status
      },
      {
        id: "t2",
        name: "Bob Johnson",
        propertyId: "p1",
        rentDue: -10000, 
        rentDueDate: "2025-08-01", 
        contact: "bob@example.com",
        phone: "444-555-6666",
        leaseStart: "2024-08-01",
        leaseEnd: "2026-07-31", 
        paymentStatus: 'paid' // Initial status (overpaid)
      },
      {
        id: "t3",
        name: "Charlie Brown",
        propertyId: "p2",
        rentDue: 65000, 
        rentDueDate: "2025-07-01", 
        contact: "charlie@example.com",
        phone: "777-888-9999",
        leaseStart: "2024-07-01",
        leaseEnd: "2025-06-30", 
        paymentStatus: 'overdue' // Initial status
      },
      {
        id: "t4",
        name: "Diana Prince",
        propertyId: "p3",
        rentDue: 30000, 
        rentDueDate: "2025-08-05", 
        contact: "diana@example.com",
        phone: "000-111-2222",
        leaseStart: "2024-08-05",
        leaseEnd: "2026-08-04", 
        paymentStatus: 'due' // Initial status (due in future)
      },
      {
        id: "t5",
        name: "Grace Hopper",
        propertyId: "p1",
        rentDue: 50000, 
        rentDueDate: "2025-07-15", 
        contact: "grace@example.com",
        phone: "555-111-2222",
        leaseStart: "2025-07-15",
        leaseEnd: "2026-07-14",
        imageUrl: "https://placehold.co/100x100/C0C0C0/000000?text=GH",
        paymentStatus: 'overdue' // Initial status
      },
    ];

    return initialTenantsData.map(tenant => {
      const rentDueDateObj = new Date(tenant.rentDueDate);
      rentDueDateObj.setHours(0, 0, 0, 0);

      let currentRentDue = tenant.rentDue;
      let nextRentDueDate = tenant.rentDueDate;
      let isOverdue = false;
      let paymentStatus = tenant.paymentStatus; // Keep initial status unless logic changes it

      // If the rent due date has passed AND the lease is still active
      if (rentDueDateObj < today && new Date(tenant.leaseEnd) > today) {
        const property = properties.find(p => p.id === tenant.propertyId);
        // If rent was 0 (paid for previous period), then new rent is due for the next period
        if (currentRentDue <= 0 && property) { // Use <= 0 to include overpayments
          currentRentDue = property.rentPerRoom; // Reset rent due to full amount for new period
          // Advance rentDueDate to the next month from the *original* rentDueDate
          const nextMonthDate = new Date(rentDueDateObj);
          nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
          nextRentDueDate = nextMonthDate.toISOString().split('T')[0];
          paymentStatus = 'due'; // New period, rent is due
        }
      }
      
      // Determine overdue status based on the *final* currentRentDue and rentDueDate
      const finalRentDueDateObj = new Date(nextRentDueDate);
      finalRentDueDateObj.setHours(0, 0, 0, 0);
      isOverdue = currentRentDue > 0 && finalRentDueDateObj < today;

      if (isOverdue) {
        paymentStatus = 'overdue';
      } else if (currentRentDue <= 0) {
        paymentStatus = 'paid';
      } else if (currentRentDue > 0 && finalRentDueDateObj >= today) {
        paymentStatus = 'due'; // Rent is due but not yet overdue
      }


      return {
        ...tenant,
        rentDue: currentRentDue,
        rentDueDate: nextRentDueDate,
        overdue: isOverdue, // This flag is still useful for quick checks
        paymentStatus: paymentStatus, // The granular status
      };
    });
  });

  const [notifications, setNotifications] = useState(() => {
    const initialNotifications = [
      { id: "notif1", message: "General update: System maintenance tonight.", date: "2025-07-20", read: false, type: 'general' },
      { id: "notif2", message: "New maintenance request submitted for Apartment 2B.", date: "2025-07-20", read: false, type: 'general' },
      {
        id: "payment_notif_1",
        message: "Partial payment of ₦25,000 received from Grace Hopper for Property Grand House. Requires approval.",
        date: "2025-08-02",
        read: false,
        type: 'payment_received',
        paymentDetails: {
          tenantId: "t5",
          amount: 25000,
          propertyId: "p1",
          tenantName: "Grace Hopper",
          currentRentDue: 50000, // This would be the full amount due before this payment
          expectedCompletionDate: "2025-08-15" // Tenant specified this date
        },
        status: "pending_approval"
      }
    ];

    // Add overdue rent notifications based on initial tenant data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    tenants.forEach(tenant => {
      if (tenant.paymentStatus === 'overdue') {
        const propertyName = properties.find(p => p.id === tenant.propertyId)?.name || 'N/A';
        const notificationId = `rent_overdue_${tenant.id}_${tenant.rentDueDate}`; // Unique ID for overdue notification
        // Check if this specific overdue notification already exists
        const exists = initialNotifications.some(n => n.id === notificationId && n.type === 'rent_overdue');
        if (!exists) {
          initialNotifications.push({
            id: notificationId,
            message: `Rent for ${tenant.name} (${propertyName}) is overdue! Amount: ₦${tenant.rentDue.toLocaleString()}`,
            date: today.toISOString().split('T')[0],
            read: false,
            type: 'rent_overdue',
            details: {
              tenantId: tenant.id,
              tenantName: tenant.name,
              propertyId: tenant.propertyId, // Store propertyId for lookup
              amountDue: tenant.rentDue,
            }
          });
        }
      }
    });
    return initialNotifications;
  });

  const notificationsCount = notifications.filter(n => !n.read && n.status === 'pending_approval' || (!n.read && (n.type !== 'payment_received' && n.status === 'new'))).length;

  const [reminders, setReminders] = useState([
      { id: 'rem1', description: 'Rent overdue for Charlie Brown' },
      { id: 'rem2', description: 'Follow up on maintenance request for Apartment 1A' },
      { id: 'rem3', description: 'Schedule annual fire alarm inspection for Grand House' }
  ]);
  const hasUpcomingReminders = reminders.length > 0;

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [isLoggedIn]);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    showMessage("Logged in successfully!", "success");
  };

  const handleUserAvatarClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      showMessage("You have been logged out.", "info");
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // New function to add notifications
  const addNotification = (message, type, details = {}) => {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type,
      details,
      status: type === 'payment_received' ? 'pending_approval' : 'new' // Set status for payment notifications
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  };

  const handleApprovePaymentNotification = (notificationId, paymentInfo) => {
    const { tenantId, amount, expectedCompletionDate } = paymentInfo;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTenants(prevTenants => prevTenants.map(t => {
      if (t.id === tenantId) {
        const newRentDue = t.rentDue - amount;
        let newRentDueDate = t.rentDueDate;
        let newOverdue = false;
        let newPaymentStatus = t.paymentStatus;

        if (newRentDue > 0) { // Partial payment, still money owed
          newPaymentStatus = 'part_payment';
          // Use the expected completion date as the new due date
          if (expectedCompletionDate) {
            newRentDueDate = expectedCompletionDate;
            newOverdue = new Date(expectedCompletionDate) < today;
          } else {
            // If no completion date specified, it remains overdue on original date
            newOverdue = new Date(t.rentDueDate) < today;
          }
        } else { // Full payment or overpayment
          newPaymentStatus = 'paid';
          newOverdue = false;
          // Advance rentDueDate to the next month from the *original* rentDueDate if it was due
          const currentRentDueDateObj = new Date(t.rentDueDate);
          currentRentDueDateObj.setHours(0, 0, 0, 0);
          if (currentRentDueDateObj <= today) { // Only advance if the current period was due or overdue
            const nextMonthDate = new Date(currentRentDueDateObj);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            newRentDueDate = nextMonthDate.toISOString().split('T')[0];
          }
        }

        return {
          ...t,
          rentDue: newRentDue,
          rentDueDate: newRentDueDate,
          overdue: newOverdue,
          paymentStatus: newPaymentStatus,
        };
      }
      return t;
    }));

    setNotifications(prevNotifications => prevNotifications.map(n =>
      n.id === notificationId ? { ...n, read: true, status: 'approved' } : n
    ));
    showMessage(`Payment of ₦${amount.toLocaleString()} from ${paymentInfo.tenantName} approved!`, 'success');
    setIsPaymentApprovalModalOpen(false); // Close specific payment modal

    // Add new notification for approved payment
    const approvedMessage = paymentInfo.expectedCompletionDate && paymentInfo.amount < paymentInfo.currentRentDue
      ? `Partial payment of ₦${amount.toLocaleString()} from ${paymentInfo.tenantName} approved. Balance ₦${(paymentInfo.currentRentDue - amount).toLocaleString()} due by ${paymentInfo.expectedCompletionDate}.`
      : `Payment of ₦${amount.toLocaleString()} from ${paymentInfo.tenantName} has been approved.`;

    addNotification(
      approvedMessage,
      'payment_approved',
      { tenantName: paymentInfo.tenantName, amount: amount, expectedCompletionDate: expectedCompletionDate }
    );

    // Check if tenant is still overdue after payment and add notification if so
    const updatedTenant = tenants.find(t => t.id === tenantId);
    if (updatedTenant && updatedTenant.paymentStatus === 'overdue') { // Only add if status is truly overdue
      const propertyName = properties.find(p => p.id === updatedTenant.propertyId)?.name || 'N/A';
      const notificationMessage = `Rent for ${updatedTenant.name} (${propertyName}) is still overdue! Remaining: ₦${updatedTenant.rentDue.toLocaleString()}`;
      // Prevent duplicate notifications for the same overdue event
      const existingOverdueNotif = notifications.find(n => 
        n.type === 'rent_overdue' && 
        n.details?.tenantId === updatedTenant.id && 
        n.details?.amountDue === updatedTenant.rentDue &&
        !n.read // Only add if existing one is not yet read
      );
      if (!existingOverdueNotif) {
        addNotification(notificationMessage, 'rent_overdue', {
          tenantId: updatedTenant.id,
          tenantName: updatedTenant.name,
          propertyId: updatedTenant.propertyId, // Store propertyId for lookup
          amountDue: updatedTenant.rentDue,
        });
      }
    }
  };

  const handleDeclinePaymentNotification = (notificationId, tenantName, amount, expectedCompletionDate) => {
    setNotifications(prevNotifications => prevNotifications.map(n =>
      n.id === notificationId ? { ...n, read: true, status: 'declined' } : n
    ));
    showMessage(`Payment from ${tenantName} declined. The amount will be returned to the tenant.`, 'info');
    setIsPaymentApprovalModalOpen(false); // Close specific payment modal

    // Add new notification for declined payment
    addNotification(
      `Payment of ₦${amount.toLocaleString()} from ${tenantName} was declined. The amount will be returned to the tenant.`,
      'payment_declined',
      { tenantName: tenantName, amount: amount, expectedCompletionDate: expectedCompletionDate }
    );
  };

  const handleNotificationBellClick = () => {
    // Find the first pending payment notification
    const pendingPayment = notifications.find(n => n.type === 'payment_received' && n.status === 'pending_approval');
    if (pendingPayment) {
      setSelectedPaymentNotification(pendingPayment);
      setIsPaymentApprovalModalOpen(true);
    } else {
      // If no pending payment, open general notifications modal
      setIsNotificationsModalOpen(true);
    }
  };


  // The `value` prop for DashboardContext.Provider
  const dashboardContextValue = {
    isLoggedIn,
    user,
    showMessage,
    tenants, // Provide tenants state
    setTenants, // Provide setTenants function
    properties, // Provide properties state
    setProperties, // Provide setProperties function
    notifications, // Provide notifications state
    setNotifications, // Provide setNotifications function
    addNotification, // Provide new addNotification function
    handleApprovePaymentNotification, // Provide payment approval handler
    handleDeclinePaymentNotification, // Provide payment decline handler
    setIsLoginModalOpen, // Example: if a child needs to open the login modal
    setIsNotificationsModalOpen,
    notificationsCount,
    setIsRemindersModalOpen,
    reminders,
    hasUpcomingReminders,
    selectedNotification,
    setSelectedNotification,
    setIsNotificationDetailsModalOpen,
  };

  // FIX: Check if children exists before trying to access its props or cloning it.
  const pageProps = children && children.props ? children.props : {};

  return (
    // Wrap the entire layout content with the DashboardContext.Provider
    <DashboardContext.Provider value={dashboardContextValue}>
      <div className="dashboard-layout">
        <MessageBox message={message} type={messageType} />
        
        {!isLoggedIn ? (
          <LoginSignupModal isOpen={true} onClose={() => {}} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <Sidebar 
              isSidebarOpen={isSidebarOpen}
              isSidebarCollapsed={isSidebarCollapsed}
              // Pass handleNavigation and activeSection from the page component
              handleNavigation={pageProps.handleNavigation}
              activeSection={pageProps.activeSection}
              toggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              user={user}
              isLoggedIn={isLoggedIn}
              handleUserAvatarClick={handleUserAvatarClick}
              handleNotificationBellClick={handleNotificationBellClick} // Updated to new handler
              notificationsCount={notificationsCount}
              handleViewRemindersClick={() => setIsRemindersModalOpen(true)}
              hasUpcomingReminders={hasUpcomingReminders}
            />
            
            <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
              <Header 
                toggleSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
                getGreeting={getGreeting}
                user={user}
              />
              <main className="content-area">
                {children}
              </main>
            </div>
          </>
        )}

        {isLoggedIn && (
          <>
            {/* Pass tenants and properties to NotificationDetailsModal */}
            <NotificationDetailsModal 
              isOpen={isNotificationDetailsModalOpen} 
              onClose={() => setIsNotificationDetailsModalOpen(false)} 
              notification={selectedNotification} 
              tenants={tenants} 
              properties={properties} 
            />
            <Modal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)} title="Notifications">
              {notifications.map(n => (
                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`} onClick={() => {
                  setSelectedNotification(n);
                  setIsNotificationDetailsModalOpen(true);
                  // Mark as read when clicked, unless it's a pending payment approval
                  if (!n.read && n.type !== 'payment_received' && n.status !== 'pending_approval') {
                    setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                  }
                }}>
                  <p style={{ color: n.read ? '#6b7280' : '#1f2937', fontWeight: n.read ? 'normal' : 'bold' }}>{n.message} - {n.date}</p>
                  {!n.read && n.type === 'general' && ( // Only show mark as read for general unread notifications
                    <button className="button-link" onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                    }}>Mark as Read</button>
                  )}
                  {n.type === 'payment_received' && n.status === 'pending_approval' && (
                    <button className="button-link" onClick={(e) => {
                      e.stopPropagation(); // Prevent notification details modal from opening
                      setSelectedPaymentNotification(n);
                      setIsPaymentApprovalModalOpen(true);
                      setIsNotificationsModalOpen(false); // Close general notifications modal
                    }}>Review Payment</button>
                  )}
                </div>
              ))}
              {notifications.length === 0 && <p>No new notifications.</p>}
            </Modal>
            <Modal isOpen={isRemindersModalOpen} onClose={() => setIsRemindersModalOpen(false)} title="Upcoming Reminders">
              {reminders.map(r => <div key={r.id}>{r.description}</div>)}
              {reminders.length === 0 && <p>No upcoming reminders.</p>}
            </Modal>
            {/* Render the new PaymentApprovalModal */}
            <PaymentApprovalModal
              isOpen={isPaymentApprovalModalOpen}
              onClose={() => setIsPaymentApprovalModalOpen(false)}
              notification={selectedPaymentNotification}
              onApprove={handleApprovePaymentNotification}
              onDecline={handleDeclinePaymentNotification}
            />
          </>
        )}
      </div>
    </DashboardContext.Provider>
  );
}
