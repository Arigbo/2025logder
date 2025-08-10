"use client"; // This directive marks the component as a Client Component

import React, { useState, createContext, useEffect } from "react";
import LandlordSidebar from "@/app/component/landlord/landlordsidebar";
import Modal from "@/app/component/landlord/modal";
import Header from "@/app/component/landlord/header";
import MessageBox from "@/app/component/landlord/message";
import LoginSignupModal from "@/app/component/landlord/login";
// Export context for use in other files
export const DashboardContext = createContext({
  isLoggedIn: false,
  user: [],
  setUser: () => {},
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

function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
  tenants,
  properties,
}) {
  // Pass tenants and properties
  if (!isOpen || !notification) return null;
  // Determine text style based on read status
  const textStyle = {
    color: notification.read ? "#6b7280" : "#1f2937", // Gray for read, dark for unread
    fontWeight: notification.read ? "normal" : "bold", // Normal for read, bold for unread
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
        <p style={textStyle}>
          <strong>Date:</strong> {notification.date}
        </p>
        <p style={textStyle}>
          <strong>Message:</strong> {notification.message}
        </p>
        <p style={textStyle}>
          <strong>Status:</strong> {notification.read ? "Read" : "Unread"}
        </p>
        {notification.type === "payment_received" &&
          notification.paymentDetails && (
            <>
              <p style={textStyle}>
                <strong>Payment Amount:</strong> ₦
                {notification.paymentDetails.amount.toLocaleString()}
              </p>
              <p style={textStyle}>
                <strong>Tenant:</strong>{" "}
                {notification.paymentDetails.tenantName}
              </p>
              <p style={textStyle}>
                <strong>Property:</strong>{" "}
                {getPropertyName(notification.paymentDetails.propertyId)}
              </p>
              {notification.paymentDetails.expectedCompletionDate && (
                <p style={textStyle}>
                  <strong>Expected Completion:</strong>{" "}
                  {notification.paymentDetails.expectedCompletionDate}
                </p>
              )}
            </>
          )}
        {notification.type === "rent_overdue" && notification.details && (
          <>
            <p style={textStyle}>
              <strong>Tenant:</strong> {notification.details.tenantName}
            </p>
            <p style={textStyle}>
              <strong>Property:</strong>{" "}
              {getPropertyName(notification.details.propertyId)}
            </p>{" "}
            {/* Use getPropertyName */}
            <p style={textStyle}>
              <strong>Amount Due:</strong> ₦
              {notification.details.amountDue.toLocaleString()}
            </p>
          </>
        )}
        {notification.type === "apartment_approved" && notification.details && (
          <>
            <p style={textStyle}>
              <strong>New Tenant:</strong> {notification.details.tenantName}
            </p>
            <p style={textStyle}>
              <strong>Property:</strong>{" "}
              {getPropertyName(notification.details.propertyId)}
            </p>{" "}
            {/* Use getPropertyName */}
          </>
        )}
        {notification.type === "tenant_removed" && notification.details && (
          <>
            <p style={textStyle}>
              <strong>Tenant Removed:</strong> {notification.details.tenantName}
            </p>
            <p style={textStyle}>
              <strong>Property:</strong>{" "}
              {getPropertyName(notification.details.propertyId)}
            </p>{" "}
            {/* Use getPropertyName */}
          </>
        )}
        {(notification.type === "payment_approved" ||
          notification.type === "payment_declined") &&
          notification.details && (
            <>
              <p style={textStyle}>
                <strong>Tenant:</strong> {notification.details.tenantName}
              </p>
              <p style={textStyle}>
                <strong>Amount:</strong> ₦
                {notification.details.amount.toLocaleString()}
              </p>
              <p style={textStyle}>
                <strong>Action:</strong>{" "}
                {notification.type === "payment_approved"
                  ? "Approved"
                  : "Declined"}
              </p>
              {notification.details.expectedCompletionDate &&
                notification.type === "payment_approved" && (
                  <p style={textStyle}>
                    <strong>New Due Date:</strong>{" "}
                    {notification.details.expectedCompletionDate}
                  </p>
                )}
            </>
          )}
        {notification.type === "property_deletion_request" &&
          notification.details && (
            <>
              <p style={textStyle}>
                <strong>Property:</strong> {notification.details.propertyName}
              </p>
              <p style={textStyle}>
                <strong>Tenants:</strong> {notification.details.tenantCount}{" "}
                active tenant(s)
              </p>
              <p style={textStyle}>
                <strong>Status:</strong> Pending Admin Review
              </p>
            </>
          )}
        {notification.type === "maintenance_request" &&
          notification.details && (
            <>
              <p style={textStyle}>
                <strong>Property:</strong> {notification.details.propertyName}
              </p>
              <p style={textStyle}>
                <strong>Description:</strong> {notification.details.description}
              </p>
              <p style={textStyle}>
                <strong>Urgency:</strong> {notification.details.urgency}
              </p>
              <p style={textStyle}>
                <strong>Preferred Date:</strong>{" "}
                {notification.details.preferredDate}
              </p>
              <p style={textStyle}>
                <strong>Preferred Time:</strong>{" "}
                {notification.details.preferredTime || "N/A"}
              </p>
              <p style={textStyle}>
                <strong>Status:</strong> {notification.details.status}
              </p>
              <p style={textStyle}>
                <strong>Requested On:</strong>{" "}
                {notification.details.dateRequested}
              </p>
            </>
          )}
        {notification.type === "property_update" && notification.details && (
          <>
            <p style={textStyle}>
              <strong>Property:</strong> {notification.details.propertyName}
            </p>
            <p style={textStyle}>
              <strong>Tenant:</strong>{" "}
              {getTenantName(notification.details.tenantId)}
            </p>
            {notification.details.oldRentPerRoom !== undefined && (
              <p style={textStyle}>
                <strong>Rent Change:</strong> From ₦
                {notification.details.oldRentPerRoom.toLocaleString()} to ₦
                {notification.details.newRentPerRoom.toLocaleString()}
              </p>
            )}
            <p style={textStyle}>
              <strong>Message:</strong> {notification.message}
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
// New Payment Approval Modal
function PaymentApprovalModal({
  isOpen,
  onClose,
  notification,
  onApprove,
  onDecline,
}) {
  if (!isOpen || !notification || notification.type !== "payment_received")
    return null;
  const {
    tenantId,
    amount,
    propertyId,
    currentRentDue,
    tenantName,
    expectedCompletionDate,
  } = notification.paymentDetails; // Added expectedCompletionDate

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Payment">
      <div className="payment-approval-content">
        <div className="payment-approval-content-body">
          <p className="">
            A payment of <strong>₦{amount.toLocaleString()}</strong> has been
            received from <strong>{tenantName}</strong>.
          </p>
          <p className="">
            Current rent due before this payment: ₦
            {currentRentDue.toLocaleString()}.
          </p>
          {expectedCompletionDate && (
            <p className="">
              Tenant expects to complete payment by:{" "}
              <strong>{expectedCompletionDate}</strong>.
            </p>
          )}
          <p className="">Do you want to accept this payment?</p>
        </div>
        <div className="bottom">
          <button
            className="button-secondary"
            onClick={() =>
              onDecline(
                notification.id,
                tenantName,
                amount,
                expectedCompletionDate
              )
            }
          >
            Decline
          </button>
          <button
            className="button-primary"
            onClick={() =>
              onApprove(notification.id, {
                tenantId,
                amount,
                propertyId,
                tenantName,
                expectedCompletionDate,
              })
            }
          >
            Accept Payment
          </button>
        </div>
      </div>
    </Modal>
  );
}
export default function DashboardLayout({ children }) {
  const [user, setUser] = useState([
    {
      id: 1,
      name: "Jesse",
      email: "jesse@example.com",
      phone: "09102333333",
      password: "password",
    },
    {
      id: 2,
      name: "Jay",
      email: "jay@example.com",
      phone: "09102333333",
      password: "password",
    },
    {
      id: 3,
      name: "Fred",
      email: "fred@example.com",
      phone: "09102333333",
      password: "password",
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isPaymentApprovalModalOpen, setIsPaymentApprovalModalOpen] =
    useState(false); // New state for payment modal
  const [selectedPaymentNotification, setSelectedPaymentNotification] =
    useState(null); // New state for selected payment notification
  const [isUserModal, setIsUserModal] = useState(false);
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
        paymentStatus: "paid", // Initial status
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
        paymentStatus: "paid", // Initial status (overpaid)
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
        paymentStatus: "overdue", // Initial status
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
        paymentStatus: "due", // Initial status (due in future)
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
        paymentStatus: "overdue", // Initial status
      },
    ];

    return initialTenantsData.map((tenant) => {
      const rentDueDateObj = new Date(tenant.rentDueDate);
      rentDueDateObj.setHours(0, 0, 0, 0);

      let currentRentDue = tenant.rentDue;
      let nextRentDueDate = tenant.rentDueDate;
      let isOverdue = false;
      let paymentStatus = tenant.paymentStatus; // Keep initial status unless logic changes it

      // If the rent due date has passed AND the lease is still active
      if (rentDueDateObj < today && new Date(tenant.leaseEnd) > today) {
        const property = properties.find((p) => p.id === tenant.propertyId);
        // If rent was 0 (paid for previous period), then new rent is due for the next period
        if (currentRentDue <= 0 && property) {
          // Use <= 0 to include overpayments
          currentRentDue = property.rentPerRoom; // Reset rent due to full amount for new period
          // Advance rentDueDate to the next month from the *original* rentDueDate
          const nextMonthDate = new Date(rentDueDateObj);
          nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
          nextRentDueDate = nextMonthDate.toISOString().split("T")[0];
          paymentStatus = "due"; // New period, rent is due
        }
      }

      // Determine overdue status based on the *final* currentRentDue and rentDueDate
      const finalRentDueDateObj = new Date(nextRentDueDate);
      finalRentDueDateObj.setHours(0, 0, 0, 0);
      isOverdue = currentRentDue > 0 && finalRentDueDateObj < today;

      if (isOverdue) {
        paymentStatus = "overdue";
      } else if (currentRentDue <= 0) {
        paymentStatus = "paid";
      } else if (currentRentDue > 0 && finalRentDueDateObj >= today) {
        paymentStatus = "due"; // Rent is due but not yet overdue
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
      {
        id: "notif1",
        message: "General update: System maintenance tonight.",
        date: "2025-07-20",
        read: false,
        type: "general",
      },
      {
        id: "notif2",
        message: "New maintenance request submitted for Apartment 2B.",
        date: "2025-07-20",
        read: false,
        type: "general",
      },
      {
        id: "payment_notif_1",
        message:
          "Partial payment of ₦25,000 received from Grace Hopper for Property Grand House. Requires approval.",
        date: "2025-08-02",
        read: false,
        type: "payment_received",
        paymentDetails: {
          tenantId: "t5",
          amount: 25000,
          propertyId: "p1",
          tenantName: "Grace Hopper",
          currentRentDue: 50000, // This would be the full amount due before this payment
          expectedCompletionDate: "2025-08-15", // Tenant specified this date
        },
        status: "pending_approval",
      },
    ];

    // Add overdue rent notifications based on initial tenant data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    tenants.forEach((tenant) => {
      if (tenant.paymentStatus === "overdue") {
        const propertyName =
          properties.find((p) => p.id === tenant.propertyId)?.name || "N/A";
        const notificationId = `rent_overdue_${tenant.id}_${tenant.rentDueDate}`; // Unique ID for overdue notification
        // Check if this specific overdue notification already exists
        const exists = initialNotifications.some(
          (n) => n.id === notificationId && n.type === "rent_overdue"
        );
        if (!exists) {
          initialNotifications.push({
            id: notificationId,
            message: `Rent for ${
              tenant.name
            } (${propertyName}) is overdue! Amount: ₦${tenant.rentDue.toLocaleString()}`,
            date: today.toISOString().split("T")[0],
            read: false,
            type: "rent_overdue",
            details: {
              tenantId: tenant.id,
              tenantName: tenant.name,
              propertyId: tenant.propertyId, // Store propertyId for lookup
              amountDue: tenant.rentDue,
            },
          });
        }
      }
    });
    return initialNotifications;
  });

  const notificationsCount = notifications.filter(
    (n) =>
      (!n.read && n.status === "pending_approval") ||
      (!n.read && n.type !== "payment_received" && n.status === "new")
  ).length;

  const [reminders, setReminders] = useState([
    { id: "rem1", description: "Rent overdue for Charlie Brown" },
    {
      id: "rem2",
      description: "Follow up on maintenance request for Apartment 1A",
    },
    {
      id: "rem3",
      description: "Schedule annual fire alarm inspection for Grand House",
    },
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

  const handleLoginSuccess = (user) => {
    setUser(user);
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
      date: new Date().toISOString().split("T")[0],
      read: false,
      type,
      details,
      status: type === "payment_received" ? "pending_approval" : "new", // Set status for payment notifications
    };
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  };

  const handleApprovePaymentNotification = (notificationId, paymentInfo) => {
    const { tenantId, amount, expectedCompletionDate } = paymentInfo;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTenants((prevTenants) =>
      prevTenants.map((t) => {
        if (t.id === tenantId) {
          const newRentDue = t.rentDue - amount;
          let newRentDueDate = t.rentDueDate;
          let newOverdue = false;
          let newPaymentStatus = t.paymentStatus;

          if (newRentDue > 0) {
            // Partial payment, still money owed
            newPaymentStatus = "part_payment";
            // Use the expected completion date as the new due date
            if (expectedCompletionDate) {
              newRentDueDate = expectedCompletionDate;
              newOverdue = new Date(expectedCompletionDate) < today;
            } else {
              // If no completion date specified, it remains overdue on original date
              newOverdue = new Date(t.rentDueDate) < today;
            }
          } else {
            // Full payment or overpayment
            newPaymentStatus = "paid";
            newOverdue = false;
            // Advance rentDueDate to the next month from the *original* rentDueDate if it was due
            const currentRentDueDateObj = new Date(t.rentDueDate);
            currentRentDueDateObj.setHours(0, 0, 0, 0);
            if (currentRentDueDateObj <= today) {
              // Only advance if the current period was due or overdue
              const nextMonthDate = new Date(currentRentDueDateObj);
              nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
              newRentDueDate = nextMonthDate.toISOString().split("T")[0];
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
      })
    );

    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true, status: "approved" } : n
      )
    );
    showMessage(
      `Payment of ₦${amount.toLocaleString()} from ${
        paymentInfo.tenantName
      } approved!`,
      "success"
    );
    setIsPaymentApprovalModalOpen(false); // Close specific payment modal

    // Add new notification for approved payment
    const approvedMessage =
      paymentInfo.expectedCompletionDate &&
      paymentInfo.amount < paymentInfo.currentRentDue
        ? `Partial payment of ₦${amount.toLocaleString()} from ${
            paymentInfo.tenantName
          } approved. Balance ₦${(
            paymentInfo.currentRentDue - amount
          ).toLocaleString()} due by ${paymentInfo.expectedCompletionDate}.`
        : `Payment of ₦${amount.toLocaleString()} from ${
            paymentInfo.tenantName
          } has been approved.`;

    addNotification(approvedMessage, "payment_approved", {
      tenantName: paymentInfo.tenantName,
      amount: amount,
      expectedCompletionDate: expectedCompletionDate,
    });

    // Check if tenant is still overdue after payment and add notification if so
    const updatedTenant = tenants.find((t) => t.id === tenantId);
    if (updatedTenant && updatedTenant.paymentStatus === "overdue") {
      // Only add if status is truly overdue
      const propertyName =
        properties.find((p) => p.id === updatedTenant.propertyId)?.name ||
        "N/A";
      const notificationMessage = `Rent for ${
        updatedTenant.name
      } (${propertyName}) is still overdue! Remaining: ₦${updatedTenant.rentDue.toLocaleString()}`;
      // Prevent duplicate notifications for the same overdue event
      const existingOverdueNotif = notifications.find(
        (n) =>
          n.type === "rent_overdue" &&
          n.details?.tenantId === updatedTenant.id &&
          n.details?.amountDue === updatedTenant.rentDue &&
          !n.read // Only add if existing one is not yet read
      );
      if (!existingOverdueNotif) {
        addNotification(notificationMessage, "rent_overdue", {
          tenantId: updatedTenant.id,
          tenantName: updatedTenant.name,
          propertyId: updatedTenant.propertyId, // Store propertyId for lookup
          amountDue: updatedTenant.rentDue,
        });
      }
    }
  };

  const handleDeclinePaymentNotification = (
    notificationId,
    tenantName,
    amount,
    expectedCompletionDate
  ) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true, status: "declined" } : n
      )
    );
    showMessage(
      `Payment from ${tenantName} declined. The amount will be returned to the tenant.`,
      "info"
    );
    setIsPaymentApprovalModalOpen(false); // Close specific payment modal

    // Add new notification for declined payment
    addNotification(
      `Payment of ₦${amount.toLocaleString()} from ${tenantName} was declined. The amount will be returned to the tenant.`,
      "payment_declined",
      {
        tenantName: tenantName,
        amount: amount,
        expectedCompletionDate: expectedCompletionDate,
      }
    );
  };
  const handleUSerModal = () => {
    setIsUserModal(true);
  };
  const handleNotificationBellClick = () => {
    // Find the first pending payment notification
    const pendingPayment = notifications.find(
      (n) => n.type === "payment_received" && n.status === "pending_approval"
    );
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
    setUser,
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
  const closeSideBar = () => {
    setIsSidebarOpen(false);
  };
  // FIX: Check if children exists before trying to access its props or cloning it.
  const pageProps = children && children.props ? children.props : {};

  return (
    // Wrap the entire layout content with the DashboardContext.Provider
    <DashboardContext.Provider value={dashboardContextValue}>
      <div className="dashboard-layout">
        <MessageBox message={message} type={messageType} />

        {!isLoggedIn ? (
          <LoginSignupModal
            isOpen={true}
            onClose={() => {}}
            onLoginSuccess={handleLoginSuccess}
            user={user}
          />
        ) : (
          <>
            <LandlordSidebar
              isSidebarOpen={isSidebarOpen}
              isSidebarCollapsed={isSidebarCollapsed}
              closeSideBar={closeSideBar}
              // Pass handleNavigation and activeSection from the page component
              handleNavigation={pageProps.handleNavigation}
              activeSection={pageProps.activeSection}
              toggleSidebarCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
              handleUSerModal={handleUSerModal}
              user={user}
              isLoggedIn={isLoggedIn}
              handleUserAvatarClick={handleUserAvatarClick}
              handleNotificationBellClick={handleNotificationBellClick} // Updated to new handler
              notificationsCount={notificationsCount}
              handleViewRemindersClick={() => setIsRemindersModalOpen(true)}
              hasUpcomingReminders={hasUpcomingReminders}
            />

            <div
              className={`main-content ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
            >
              <Header
                toggleSidebarOpen={() => setIsSidebarOpen(true)}
                getGreeting={getGreeting}
                user={user}
              />
              <main className="content-area" onClick={closeSideBar}>
                {children}
              </main>
            </div>
          </>
        )}
<Modal
isOpen={isUserModal}
onClose={()=>{setIsUserModal(false)}}
title={"Landlord"}
>
  <div className="usermodal">
    <h1>name</h1>
    <h1>email</h1>
    <h1>phone number</h1>
    <h1>address</h1>
    <i className="fas fa-bell"></i>
  </div>
</Modal>
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
            <Modal
              isOpen={isNotificationsModalOpen}
              onClose={() => setIsNotificationsModalOpen(false)}
              title="Notifications"
            >
              <div className="notification-content">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${
                      n.read ? "read" : "unread"
                    }`}
                    onClick={() => {
                      setSelectedNotification(n);
                      setIsNotificationDetailsModalOpen(true);
                      setIsNotificationsModalOpen(false);
                      if (
                        !n.read &&
                        n.type !== "payment_received" &&
                        n.status !== "pending_approval"
                      ) {
                        setNotifications((prev) =>
                          prev.map((notif) =>
                            notif.id === n.id ? { ...notif, read: true } : notif
                          )
                        );
                      }
                    }}
                  >
                    <p>
                      {n.message} - {n.date}
                    </p>
                    {!n.read &&
                      n.type === "general" && ( // Only show mark as read for general unread notifications
                        <button
                          className="button-link"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal from opening
                            setNotifications((prev) =>
                              prev.map((notif) =>
                                notif.id === n.id
                                  ? { ...notif, read: true }
                                  : notif
                              )
                            );
                          }}
                        >
                          Mark as Read
                        </button>
                      )}
                    {n.type === "payment_received" &&
                      n.status === "pending_approval" && (
                        <button
                          className="button-link"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent notification details modal from opening
                            setSelectedPaymentNotification(n);
                            setIsPaymentApprovalModalOpen(true);
                            setIsNotificationsModalOpen(false); // Close general notifications modal
                          }}
                        >
                          Review Payment
                        </button>
                      )}
                  </div>
                ))}
              </div>
              {notifications.length === 0 && <p>No new notifications.</p>}
            </Modal>
            <Modal
              isOpen={isRemindersModalOpen}
              onClose={() => setIsRemindersModalOpen(false)}
              title="Upcoming Reminders"
            >
              {reminders.map((r) => (
                <div key={r.id}>{r.description}</div>
              ))}
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
