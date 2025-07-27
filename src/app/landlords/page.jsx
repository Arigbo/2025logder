// src/app/page.jsx
// This is the main application component, now focused solely on the Dashboard Overview.
// It uses in-memory state for mock data, with no Firebase integration.
// All components and styling are defined within this single file, using pure CSS.
"use client"; // This directive marks the component as a Client Component

import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

// Note: In a full Next.js application, you would import useRouter like this:
// import { useRouter } from 'next/navigation';
// For this single-file Canvas environment, we'll simulate navigation using window.location.href.

// Load jsPDF and jspdf-autotable for PDF generation
// These scripts are loaded globally. In a real Next.js app, you'd use npm packages.
// For Canvas, this is a common way to include external JS libraries.
if (typeof window !== "undefined" && !window.jspdf) {
  const scriptPdf = document.createElement("script");
  scriptPdf.src =
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  scriptPdf.onload = () => {
    const scriptAutoTable = document.createElement("script");
    scriptAutoTable.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js";
    document.head.appendChild(scriptAutoTable);
  };
  document.head.appendChild(scriptPdf);
}

// --- Message Box Component (for notifications) ---
function MessageBox({ message, type }) {
  if (!message) return null;
  return <div className={`message-box show ${type}`}>{message}</div>;
}

// --- Modal Component ---
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className={isOpen ? "modal-overlay show" : "modal-overlay"}
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
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
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// --- Notification Details Modal Component ---
function NotificationDetailsModal({ isOpen, onClose, notification }) {
  if (!isOpen || !notification) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Details">
      <div className="notification-detail-content">
        <p>
          <strong>Date:</strong> {notification.date}
        </p>
        <p>
          <strong>Message:</strong> {notification.message}
        </p>
        <p>
          <strong>Status:</strong> {notification.read ? "Read" : "Unread"}
        </p>
      </div>
    </Modal>
  );
}

// --- Login/Signup Modal Component (Simulated) ---
function LoginSignupModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (isLogin) {
      // Simulated login logic
      if (email === "demo@example.com" && password === "password") {
        onLoginSuccess({ email, uid: "simulated-user-id" });
        onClose();
      } else {
        setMessage(
          "Invalid email or password. Try demo@example.com / password"
        );
      }
    } else {
      // Simulated signup logic
      if (email && password) {
        // In a real app, you'd create a new user here.
        // For simulation, we'll just "sign up" and then "log in"
        onLoginSuccess({ email, uid: `simulated-user-${Date.now()}` });
        onClose();
      } else {
        setMessage("Please enter a valid email and password.");
      }
    }
  };

  if (!isOpen) return null;

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
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className="text-red-500 text-sm text-center">{message}</p>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
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

export default function App() {
  // In a real Next.js app: const router = useRouter();
  // For Canvas, we'll simulate navigation using window.location.href.

  // User and authentication are simulated as there's no Firebase Auth
  const [user, setUser] = useState(null); // Initially null, meaning not logged in
  const [userId, setUserId] = useState("not-logged-in");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  // The dashboard will now support multiple sections, but all within 'overview'
  const [activeSection, setActiveSection] = useState("overview"); // Still 'overview' as the only main section
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State for desktop sidebar collapse/expand
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification and Reminders Modal states
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // New state for login modal
  const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] =
    useState(false); // New state for notification details modal
  const [selectedNotification, setSelectedNotification] = useState(null); // State to hold selected notification

  const [hasNewNotifications, setHasNewNotifications] = useState(true); // Simulate new notifications
  const [notificationsCount, setNotificationsCount] = useState(3); // Simulate 3 unread notifications

  const chartInstances = useRef({}); // Ref to store Chart.js instances
  const [chartPeriod, setChartPeriod] = useState("monthly"); // 'monthly', 'daily', 'yearly'

  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: "notif1",
      message: "Rent payment received from Alice Smith for Grand House.",
      date: "2025-07-20",
      read: false,
    },
    {
      id: "notif2",
      message: "New maintenance request: Leaky Faucet in City Lodge.",
      date: "2025-07-20",
      read: false,
    },
    {
      id: "notif3",
      message: "Lease for Student Annex expires in 5 days.",
      date: "2025-07-20",
      read: false,
    },
    {
      id: "notif4",
      message: "Property inspection scheduled for Garden Villa on 2025-07-25.",
      date: "2025-07-19",
      read: true,
    },
    {
      id: "notif5",
      message: "Tenant Bob Johnson updated contact info.",
      date: "2025-07-18",
      read: true,
    },
    {
      id: "notif6",
      message:
        "Rent of ₦65,000 is overdue for Charlie Brown (City Lodge, Room 1).",
      date: "2025-07-01",
      read: false,
    }, // Overdue rent notification
    {
      id: "notif7",
      message:
        "Rent of ₦75,000 is overdue for Frank White (Garden Villa, Room 3).",
      date: "2025-07-01",
      read: false,
    }, // Overdue rent notification
  ]);

  // In-memory data storage for mock metrics and lists
  const [properties, setProperties] = useState([
    {
      id: "p1",
      name: "Grand House",
      location: "Lagos, Nigeria",
      totalRooms: 5,
      rentPerRoom: 50000,
      leaseEndDate: "2025-09-30",
    },
    {
      id: "p2",
      name: "City Lodge",
      location: "Abuja, Nigeria",
      totalRooms: 3,
      rentPerRoom: 65000,
      leaseEndDate: "2025-08-15",
    },
    {
      id: "p3",
      name: "Student Annex",
      location: "Port Harcourt, Nigeria",
      totalRooms: 8,
      rentPerRoom: 35000,
      leaseEndDate: "2025-07-25",
    },
    {
      id: "p4",
      name: "Riverside Duplex",
      location: "Port Harcourt, Nigeria",
      totalRooms: 2,
      rentPerRoom: 100000,
      leaseEndDate: "",
    }, // Vacant
    {
      id: "p5",
      name: "Garden Villa",
      location: "Enugu, Nigeria",
      totalRooms: 4,
      rentPerRoom: 75000,
      leaseEndDate: "2026-01-10",
    },
  ]);

  const [tenants, setTenants] = useState([
    {
      id: "t1",
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "123-456-7890",
      propertyId: "p1",
      roomNumber: "Room 101",
      rentDue: 50000,
      overdue: false,
      nextRentDueDate: "2025-08-01",
    },
    {
      id: "t2",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "098-765-4321",
      propertyId: "p1",
      roomNumber: "Room 102",
      rentDue: 50000,
      overdue: false,
      nextRentDueDate: "2025-08-01",
    },
    {
      id: "t3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "555-123-4567",
      propertyId: "p2",
      roomNumber: "Room 1",
      rentDue: 65000,
      overdue: true,
      nextRentDueDate: "2025-07-01",
    }, // Overdue rent
    {
      id: "t4",
      name: "Diana Prince",
      email: "diana@example.com",
      phone: "111-222-0000",
      propertyId: "p3",
      roomNumber: "Room 5",
      rentDue: 35000,
      overdue: false,
      nextRentDueDate: "2025-08-01",
    },
    {
      id: "t5",
      name: "Eve Adams",
      email: "eve@example.com",
      phone: "999-888-7777",
      propertyId: "p5",
      roomNumber: "Room 2",
      rentDue: 75000,
      overdue: false,
      nextRentDueDate: "2025-09-01",
    },
    {
      id: "t6",
      name: "Frank White",
      email: "frank@example.com",
      phone: "111-333-5555",
      propertyId: "p5",
      roomNumber: "Room 3",
      rentDue: 75000,
      overdue: true,
      nextRentDueDate: "2025-07-01",
    }, // Overdue rent
  ]);

  const [maintenanceRequests, setMaintenanceRequests] = useState([
    {
      id: "m1",
      title: "Leaky Faucet",
      description: "Faucet in kitchen is constantly dripping.",
      propertyId: "p1",
      roomNumber: "Kitchen",
      reportedBy: "Alice Smith",
      status: "New",
      date: "2025-07-18",
    },
    {
      id: "m2",
      title: "AC Not Cooling",
      description: "Air conditioning unit not blowing cold air.",
      propertyId: "p2",
      roomNumber: "Room 1",
      reportedBy: "Charlie Brown",
      status: "In Progress",
      date: "2025-07-10",
    },
    {
      id: "m3",
      title: "Broken Window",
      description: "Small crack in the window pane.",
      propertyId: "p3",
      roomNumber: "Room 5",
      reportedBy: "Diana Prince",
      status: "New",
      date: "2025-07-20",
    },
    {
      id: "m4",
      title: "Light Fixture Fault",
      description: "Bathroom light not working.",
      propertyId: "p5",
      roomNumber: "Bathroom",
      reportedBy: "Eve Adams",
      status: "Completed",
      date: "2025-07-05",
    },
  ]);

  // Mock financial data (can be expanded with more detailed transactions)
  const [financials, setFinancials] = useState({
    monthlyIncome: 0, // Will be calculated
    monthlyExpenses: 450000, // Mock fixed expenses
  });

  // Mock Financial Transactions (payments, transfers, income, expenses)
  const [financialTransactions, setFinancialTransactions] = useState([
    {
      id: "ft1",
      type: "rent_paid",
      description: "Alice Smith paid rent for Grand House (Room 101).",
      date: "2025-07-20",
      amount: 50000,
      property: "Grand House",
      tenant: "Alice Smith",
    },
    {
      id: "ft2",
      type: "maintenance_expense",
      description: "Paid for AC repair in City Lodge.",
      date: "2025-07-20",
      amount: -15000,
      property: "City Lodge",
      tenant: "N/A",
    },
    {
      id: "ft3",
      type: "lease_renewal_fee",
      description: "Lease renewal fee received for Student Annex.",
      date: "2025-07-19",
      amount: 5000,
      property: "Student Annex",
      tenant: "Diana Prince",
    },
    {
      id: "ft4",
      type: "rent_paid",
      description: "Bob Johnson paid rent for Grand House (Room 102).",
      date: "2025-07-14",
      amount: 50000,
      property: "Grand House",
      tenant: "Bob Johnson",
    },
    {
      id: "ft5",
      type: "utility_bill",
      description: "Electricity bill paid for common areas.",
      date: "2025-07-12",
      amount: -10000,
      property: "N/A",
      tenant: "N/A",
    },
  ]);

  // Mock Recent Activities (User & System Actions - non-financial completed activities)
  const [recentActivities, setRecentActivities] = useState([
    {
      id: "ca1",
      type: "maintenance_completed",
      description: "Maintenance completed for Garden Villa (Light fixture).",
      date: "2025-07-15",
      property: "Garden Villa",
      tenant: "Eve Adams",
    },
    {
      id: "ca2",
      type: "tenant_contact_updated",
      description: "Tenant Bob Johnson updated contact info.",
      date: "2025-07-18",
      property: "Grand House",
      tenant: "Bob Johnson",
    },
    {
      id: "ca3",
      type: "property_inspection",
      description: "Property inspection completed for Grand House.",
      date: "2025-07-10",
      property: "Grand House",
      tenant: "N/A",
    },
  ]);

  // Mock communication log
  const [communicationLog, setCommunicationLog] = useState([
    {
      id: "c1",
      tenant: "Alice Smith",
      subject: "Rent Confirmation",
      date: "2025-07-20",
      snippet: "Confirmed receipt of July rent payment.",
    },
    {
      id: "c2",
      tenant: "Charlie Brown",
      subject: "Overdue Rent Reminder",
      date: "2025-07-18",
      snippet: "Sent automated reminder for overdue rent.",
    },
    {
      id: "c3",
      tenant: "Diana Prince",
      subject: "Maintenance Update",
      date: "2025-07-20",
      snippet: "Acknowledged broken window request.",
    },
    {
      id: "c4",
      tenant: "Eve Adams",
      subject: "Lease Renewal Inquiry",
      date: "2025-07-10",
      snippet: "Received inquiry about lease renewal terms.",
    },
  ]);

  // Function to display messages (like a toast)
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Navigation handler - simplified to only 'overview' for this dashboard
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
    setIsSidebarOpen(false); // Close sidebar on navigation for mobile
  };

  // Handle initial load hash and browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || "overview";
      setActiveSection(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Call once on mount for initial hash
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Dashboard metrics calculations based on mock data
  const totalProperties = properties.length;
  const totalRoomsAvailable = properties.reduce(
    (sum, p) => sum + p.totalRooms,
    0
  );
  const occupiedRooms = tenants.length; // Each tenant occupies one room
  const vacantRooms = totalRoomsAvailable - occupiedRooms;
  const averageRentPerRoom =
    totalRoomsAvailable > 0
      ? (
          properties.reduce((sum, p) => sum + p.rentPerRoom * p.totalRooms, 0) /
          totalRoomsAvailable
        ).toLocaleString(undefined, { maximumFractionDigits: 0 })
      : "N/A";

  const totalTenants = tenants.length; // Same as occupiedRooms
  const occupancyRate =
    totalRoomsAvailable > 0
      ? ((occupiedRooms / totalRoomsAvailable) * 100).toFixed(1)
      : "0.0";

  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const upcomingLeaseRenewalsCount = properties.filter((prop) => {
    if (!prop.leaseEndDate) return false;
    const leaseDate = new Date(prop.leaseEndDate);
    return leaseDate >= today && leaseDate <= threeMonthsFromNow;
  }).length;

  const overdueRentAmount = tenants
    .reduce((sum, tenant) => {
      return sum + (tenant.overdue ? tenant.rentDue : 0);
    }, 0)
    .toLocaleString(undefined, { maximumFractionDigits: 0 });
  const overdueRentTenantsCount = tenants.filter(
    (tenant) => tenant.overdue
  ).length;

  const pendingMaintenanceRequests = maintenanceRequests.filter(
    (req) => req.status !== "Completed"
  ).length;

  const projectedMonthlyIncome = tenants.reduce(
    (sum, tenant) => sum + tenant.rentDue,
    0
  );
  const netOperatingIncome =
    projectedMonthlyIncome - financials.monthlyExpenses;

  // --- New Metrics for Transaction Overview ---
  const totalIncome = financialTransactions.reduce(
    (sum, activity) => sum + (activity.amount > 0 ? activity.amount : 0),
    0
  );
  const totalExpenses = financialTransactions.reduce(
    (sum, activity) =>
      sum + (activity.amount < 0 ? Math.abs(activity.amount) : 0),
    0
  );
  const totalRentedProperties = tenants.length; // Proxy for "Total Sold" properties
  const totalViews = 1250; // Mock data for "Total Views"

  // Mock previous month's income for percentage calculation
  const previousMonthIncome = totalIncome * 0.9; // Simulate a 10% increase from previous month
  const incomePercentageChange =
    totalIncome && previousMonthIncome
      ? (
          ((totalIncome - previousMonthIncome) / previousMonthIncome) *
          100
        ).toFixed(1)
      : "0.0";
  const isIncomeIncreasing = parseFloat(incomePercentageChange) >= 0;

  // Key Metrics for the Property Statistics section
  const propertyStatisticsMetrics = [
    // Renamed from salesOverviewMetrics
    {
      id: "totalProperties",
      title: "Total Properties",
      value: totalProperties,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      ),
    },
    {
      id: "totalUnits",
      title: "Total Units",
      value: totalRoomsAvailable,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v6"
          ></path>
        </svg>
      ),
    },
    {
      id: "unitsRented",
      title: "Units Rented",
      value: occupiedRooms,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8L11 2m9 10a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: "unitsVacant",
      title: "Units Vacant",
      value: vacantRooms,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v6"
          ></path>
        </svg>
      ),
    },
  ];

  // Filter for upcoming reminders/tasks (undone activities)
  const upcomingReminders = [
    ...properties
      .filter((prop) => {
        if (!prop.leaseEndDate) return false;
        const leaseDate = new Date(prop.leaseEndDate);
        // Check if lease ends within the next 3 months (or is already past due within a reasonable window, e.g., last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return (
          (leaseDate >= today && leaseDate <= threeMonthsFromNow) ||
          (leaseDate < today && leaseDate >= thirtyDaysAgo)
        );
      })
      .map((prop) => ({
        id: `lease-${prop.id}`,
        type: "lease_renewal",
        description: `Lease for ${prop.name} expiring on ${prop.leaseEndDate}.`,
        date: prop.leaseEndDate,
        status: new Date(prop.leaseEndDate) < today ? "Overdue" : "Upcoming",
      })),
    ...tenants
      .filter((tenant) => tenant.overdue)
      .map((tenant) => ({
        // Only include *overdue* rent here
        id: `rent-${tenant.id}`,
        type: "rent_overdue", // Changed type to specifically indicate overdue
        description: `Rent of ₦${tenant.rentDue.toLocaleString()} is overdue for ${
          tenant.name
        } (${properties.find((p) => p.id === tenant.propertyId)?.name}, ${
          tenant.roomNumber
        }).`,
        date: tenant.nextRentDueDate,
        status: "Overdue",
      })),
    ...maintenanceRequests
      .filter((req) => req.status !== "Completed")
      .map((req) => ({
        id: `maint-${req.id}`,
        type: "maintenance_pending",
        description: `Maintenance request: "${req.title}" for ${
          properties.find((p) => p.id === req.propertyId)?.name
        } (${req.roomNumber || "N/A"}) is ${req.status}.`,
        date: req.date, // Use reported date, or a 'due by' date if available
        status: req.status === "New" ? "New" : "In-Progress", // Map to simpler statuses
      })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

  // Determine if there are any upcoming reminders to show a badge on the calendar icon
  const hasUpcomingReminders = upcomingReminders.length > 0;

  // Handle notification bell click
  const handleNotificationBellClick = () => {
    setIsNotificationsModalOpen(true);
    // Optionally, mark all notifications as read when opening the modal
    setHasNewNotifications(false);
    setNotificationsCount(0);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Handle "See More Activity" click (for both financial and non-financial)
  const handleSeeMoreActivity = (activityType) => {
    // Simulate navigation to a dedicated Recent Activity page
    // In a full Next.js application, you would create a new file like
    // src/app/recent-activity/page.jsx and navigate to it using useRouter:
    // router.push('/recent-activity');
    window.location.href = `/recent-activity?type=${activityType}`; // Simulate navigation for Canvas environment
    showMessage(
      `Navigating to ${activityType.replace("-", " ")} page...`,
      "info"
    );
  };

  // Handle "View All Properties" button click
  const handleViewAllProperties = () => {
    // Simulate navigation to a dedicated properties page
    window.location.href = `/properties`; // Example URL
    showMessage(`Navigating to Properties page...`, "info");
  };

  // Handle "View Reminders" icon click
  const handleViewRemindersClick = () => {
    setIsRemindersModalOpen(true);
  };

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Handle user avatar click
  const handleUserAvatarClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      // If logged in, maybe show a small menu or just a message
      showMessage(`Logged in as: ${user.email}`, "info");
      // Or a simple logout option:
      // setIsLoggedIn(false);
      // setUser(null);
      // setUserId('not-logged-in');
      // showMessage('Logged out successfully.', 'success');
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setUserId(loggedInUser.uid);
    setIsLoggedIn(true);
    showMessage("Logged in successfully!", "success");
  };

  // --- PDF and CSV Download Functions (kept for potential future use, though not used by current UI) ---
  const generatePdf = (data, title, headers) => {
    if (
      typeof window.jspdf === "undefined" ||
      typeof window.jspdf.autoTable === "undefined"
    ) {
      showMessage(
        "PDF generation library not loaded. Please try again or refresh.",
        "error"
      );
      console.error("jsPDF or autoTable not available.");
      return;
    }
    const doc = new window.jspdf.jsPDF();
    doc.text(title, 14, 20);
    doc.autoTable({
      startY: 25,
      head: [headers],
      body: data,
      theme: "striped",
      styles: {
        font: "Inter", // Assuming Inter font is available or fallback
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo-600
        textColor: 255, // White
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // bg-light
      },
      columnStyles: {
        0: { cellWidth: "auto" }, // Auto width for first column
      },
    });
    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    showMessage(`${title} PDF downloaded!`, "success");
  };

  const generateCsv = (data, title, headers) => {
    let csvContent = headers.join(",") + "\n";
    data.forEach((row) => {
      csvContent +=
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",") +
        "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${title.replace(/\s+/g, "_").toLowerCase()}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showMessage(`${title} CSV downloaded!`, "success");
    } else {
      showMessage(
        "Your browser does not support downloading CSV files directly.",
        "error"
      );
    }
  };

  // --- Notification Specific Handlers ---
  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setNotificationsCount((prev) => Math.max(0, prev - 1));
    showMessage("Notification deleted.", "info");
  };

  const handleViewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationDetailsModalOpen(true);
    // Mark as read when viewed
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    if (!notification.read) {
      // Only decrement if it was unread
      setNotificationsCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Mock data for chart visualization
  const mockMonthlyChartData = [
    { month: "Jan", income: 120000, expenses: 40000 },
    { month: "Feb", income: 135000, expenses: 45000 },
    { month: "Mar", income: 110000, expenses: 38000 },
    { month: "Apr", income: 140000, expenses: 50000 },
    { month: "May", income: 125000, expenses: 42000 },
    { month: "Jun", income: 150000, expenses: 55000 },
    {
      month: "Jul",
      income: projectedMonthlyIncome,
      expenses: financials.monthlyExpenses,
    }, // Current month
  ];

  // Simplified mock daily data for a week
  const mockDailyChartData = [
    { day: "Mon", income: 5000, expenses: 1000 },
    { day: "Tue", income: 7000, expenses: 1500 },
    { day: "Wed", income: 6000, expenses: 1200 },
    { day: "Thu", income: 8000, expenses: 2000 },
    { day: "Fri", income: 9000, expenses: 1800 },
    { day: "Sat", income: 4000, expenses: 800 },
    { day: "Sun", income: 3000, expenses: 700 },
  ];

  // Simplified mock yearly data for a few years
  const mockYearlyChartData = [
    { year: "2022", income: 1200000, expenses: 450000 },
    { year: "2023", income: 1500000, expenses: 500000 },
    { year: "2024", income: 1800000, expenses: 600000 },
    { year: "2025", income: totalIncome * 12, expenses: totalExpenses * 12 }, // Project current year
  ];

  // Chart Initialization and Updates
  useEffect(() => {
    // Load Chart.js CDN dynamically if not already loaded
    if (typeof window !== "undefined" && !window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => {
        // Once Chart.js is loaded, initialize charts
        initCharts();
      };
      document.head.appendChild(script);
    } else {
      // If Chart.js is already loaded, just initialize charts
      initCharts();
    }

    // Cleanup function for charts
    return () => {
      Object.values(chartInstances.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
      chartInstances.current = {};
    };
  }, [
    chartPeriod,
    activeSection,
    projectedMonthlyIncome,
    financials.monthlyExpenses,
    totalIncome,
    totalExpenses,
  ]); // Re-run when chartPeriod or activeSection or financial data changes

  const initCharts = () => {
    if (typeof window === "undefined" || !window.Chart) return;

    // Destroy existing charts to prevent duplicates
    Object.values(chartInstances.current).forEach((chart) => {
      if (chart) chart.destroy();
    });
    chartInstances.current = {};

    let currentChartData;
    let labelKey;
    let tooltipTitle;

    switch (chartPeriod) {
      case "daily":
        currentChartData = mockDailyChartData;
        labelKey = "day";
        tooltipTitle = "Day";
        break;
      case "yearly":
        currentChartData = mockYearlyChartData;
        labelKey = "year";
        tooltipTitle = "Year";
        break;
      case "monthly":
      default:
        currentChartData = mockMonthlyChartData;
        labelKey = "month";
        tooltipTitle = "Month";
        break;
    }

    // Financials Chart (for Property Statistics)
    const financialsCtx = document
      .getElementById("propertyStatisticsChart")
      ?.getContext("2d"); // Changed ID
    if (financialsCtx) {
      const chartLabels = currentChartData.map((d) => d[labelKey]);
      const incomeData = currentChartData.map((d) => d.income);
      const expensesData = currentChartData.map((d) => d.expenses);

      // Create a gradient for income lines
      const incomeGradient = financialsCtx.createLinearGradient(0, 0, 0, 400);
      incomeGradient.addColorStop(0, "rgba(16, 185, 129, 0.4)"); // Tailwind green-500 with transparency
      incomeGradient.addColorStop(1, "rgba(16, 185, 129, 0)");

      // Create a gradient for expenses lines
      const expensesGradient = financialsCtx.createLinearGradient(0, 0, 0, 400);
      expensesGradient.addColorStop(0, "rgba(239, 68, 68, 0.4)"); // Tailwind red-500 with transparency
      expensesGradient.addColorStop(1, "rgba(239, 68, 68, 0)");

      chartInstances.current.propertyStatisticsChart = new window.Chart(
        financialsCtx,
        {
          type: "line", // Changed to line chart
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: "Income (₦)",
                data: incomeData,
                borderColor: "#10b981", // Solid line color for income
                backgroundColor: incomeGradient, // Fill area under the line
                fill: true, // Enable area fill
                tension: 0.4, // Smooth curves
                pointRadius: 4, // Smaller points
                pointBackgroundColor: "#10b981",
                pointBorderColor: "#fff",
                pointHoverRadius: 6,
                pointHoverBackgroundColor: "#10b981",
                pointHoverBorderColor: "#fff",
                borderWidth: 2,
              },
              {
                label: "Expenses (₦)",
                data: expensesData,
                borderColor: "#ef4444", // Solid line color for expenses
                backgroundColor: expensesGradient, // Fill area under the line
                fill: true, // Enable area fill
                tension: 0.4, // Smooth curves
                pointRadius: 4, // Smaller points
                pointBackgroundColor: "#ef4444",
                pointBorderColor: "#fff",
                pointHoverRadius: 6,
                pointHoverBackgroundColor: "#ef4444",
                pointHoverBorderColor: "#fff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    family: "Inter",
                    size: 13, // Smaller font
                    weight: "600",
                  },
                  color: "#4A5568", // medium-text
                },
              },
              title: { display: false },
              tooltip: {
                backgroundColor: "rgba(42, 57, 141, 0.9)", // primary-blue with opacity
                titleFont: { family: "Inter", size: 15, weight: "700" }, // Smaller font
                bodyFont: { family: "Inter", size: 13 }, // Smaller font
                padding: 10, // Smaller padding
                cornerRadius: 6, // Smaller radius
                displayColors: true,
                callbacks: {
                  title: function (context) {
                    return `${tooltipTitle}: ${context[0].label}`;
                  },
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += `₦${context.parsed.y.toLocaleString()}`;
                    }
                    return label;
                  },
                },
              },
            },
          },
        }
      );
    }
  };

  return (
    <>
      <style>{`
        /* Ensure html and body take full viewport height for proper scrolling */
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        :root {
          /* Dribbble inspired colors */
          --primary-blue: #2a398d; /* Main blue from Dribbble */
          --light-blue: #e8ecf8; /* Lighter blue for backgrounds/accents */
          --dark-text: #1a202c; /* Darker text for headings */
          --medium-text: #4a5568; /* Medium text for body */
          --light-text: #718096; /* Light text for subtle info */
          --background-light: #f7fafc; /* Overall light background */
          --white: #ffffff;
          --border-color: #e2e8f0; /* Light border */

          /* Original colors for functional use if needed */
          --indigo-600: #4f46e5; /* Kept for compatibility if needed, but primary-blue is preferred */
          --indigo-700: #4338ca;
          --indigo-50: #eef2ff;
          --green-600: #16a34a;
          --red-600: #dc2626;
          --amber-500: #f59e0b;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.02); /* Very subtle shadow */
          --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.03); /* Very subtle shadow */
          --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.04); /* Very subtle shadow */
          --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.05); /* Very subtle shadow */
        }

        body {
          font-family: "Inter", sans-serif;
          background-color: var(--background-light);
          color: var(--medium-text);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          font-size: 15px; /* Slightly reduced base font size */
        }

        .app-container {
          display: flex;
          width: 100%; /* Removed max-width */
          background-color: var(--background-light);
          color: var(--dark-text);
          min-height: 100vh;
          box-shadow: var(--shadow-xl); /* Overall app shadow */
          border-radius: 1.2rem; /* Slightly reduced rounded app container */
        }

        .sidebar {
          width: 250px; /* Reduced default expanded width */
          flex-shrink: 0;
          background-color: var(--white);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          position: fixed; /* Fixed for mobile overlay */
          top: 0;
          left: -250px; /* Hidden by default on mobile */
          height: 100vh;
          overflow-y: auto;
          z-index: 200;
          transition: width 0.3s ease-in-out, left 0.3s ease-in-out; /* Add width to transition */
        }

        .sidebar.sidebar-open {
          left: 0; /* Show sidebar on mobile */
        }

        @media (min-width: 768px) {
          .sidebar {
            position: sticky; /* Sticky for desktop */
            left: 0;
            display: flex;
            width: 250px; /* Default desktop width */
          }
          .sidebar.collapsed {
            width: 70px; /* Reduced collapsed width on desktop */
          }
        }

        .sidebar-header {
          height: 70px; /* Reduced header height */
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding: 0 1.5rem; /* Reduced padding */
        }

        .sidebar.collapsed .sidebar-header {
          justify-content: center; /* Center items when collapsed */
          padding: 0 0.8rem; /* Adjust padding */
        }

        .sidebar-title {
          font-size: 1.6rem; /* Reduced title size */
          font-weight: 800;
          color: var(--primary-blue);
          letter-spacing: -0.025em;
          transition: opacity 0.3s ease-in-out;
        }

        .sidebar.collapsed .sidebar-title {
          opacity: 0; /* Hide full title */
          pointer-events: none; /* Make it unclickable */
          width: 0; /* Collapse width */
          overflow: hidden; /* Hide overflow */
        }

        .sidebar-close-button {
          display: block; /* Always show on mobile */
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem; /* Reduced padding */
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .sidebar-close-button:hover {
          background-color: var(--light-blue);
        }

        .sidebar-close-button svg {
          width: 1.4rem; /* Reduced icon size */
          height: 1.4rem;
          color: var(--medium-text);
        }

        @media (min-width: 768px) {
          .sidebar-close-button {
            display: none; /* Hide on desktop */
          }
        }

        .sidebar-toggle-button {
          display: none; /* Hidden by default, only for desktop */
          background-color: var(--light-blue);
          border: none;
          cursor: pointer;
          border-radius: 50%;
          transition: 0.2s ease, transform 0.3s ease-in-out;
          position: fixed;
          bottom: 2rem;
          height: 2.5rem;
          width: 2.5rem;
          left: 17rem;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle-button:hover {
          background-color: var(--light-blue);
        }

        .sidebar-toggle-button svg {
          width: 70%; /* Reduced icon size */
          height: 70%;
          color: var(--medium-text);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .sidebar-toggle-button {
            display: flex;
          }
          .sidebar.collapsed .sidebar-toggle-button {
            transform: rotate(180deg); /* Rotate icon when collapsed */
            left: 5.5rem;
          }
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem; /* Reduced padding */
          display: flex;
          flex-direction: column;
          gap: 0.6rem; /* Reduced space between links */
        }

        .sidebar.collapsed .sidebar-nav {
          padding: 0.8rem 0; /* Adjust padding for collapsed state */
          align-items: center; /* Center icons */
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.7rem 1rem; /* Reduced padding */
          border-radius: 0.6rem; /* Reduced roundedness */
          color: var(--medium-text);
          text-decoration: none;
          transition: all 0.2s ease-in-out;
          font-weight: 500;
          font-size: 0.95rem; /* Reduced font size */
        }

        .sidebar.collapsed .sidebar-link {
          padding: 0.7rem; /* Square for icon only */
          justify-content: center; /* Center icon */
        }

        .sidebar-link:hover {
          background-color: var(--light-blue);
          color: var(--primary-blue);
          transform: translateY(-1px); /* Less pronounced lift */
          box-shadow: var(--shadow-sm);
        }

        .sidebar-link.active {
          background-color: var(--primary-blue);
          color: var(--white);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .sidebar-link svg {
          width: 1.2rem; /* Reduced icon size */
          height: 1.2rem;
          margin-right: 0.8rem; /* Reduced margin */
        }

        .sidebar.collapsed .sidebar-link svg {
          margin-right: 0; /* Remove margin when collapsed */
        }

        .sidebar-link span {
          transition: opacity 0.3s ease-in-out;
        }

        .sidebar.collapsed .sidebar-link span {
          opacity: 0; /* Hide text when collapsed */
          pointer-events: none; /* Make it unclickable */
          width: 0; /* Collapse width */
          overflow: hidden; /* Hide overflow */
        }

        .sidebar-footer {
          padding: 1.2rem; /* Reduced padding */
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem; /* Reduced font size */
          color: var(--light-text);
          transition: opacity 0.3s ease-in-out;
        }

        .sidebar.collapsed .sidebar-footer {
          opacity: 0; /* Hide footer when collapsed */
          pointer-events: none;
          height: 0;
          overflow: hidden;
          padding: 0;
          border-top: none;
        }

        .sidebar-footer span {
          font-family: "Inter", sans-serif;
          word-break: break-all;
          font-weight: 400;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          background-color: var(--background-light);
          transition: margin-left 0.3s ease-in-out;
        }

        .main-content.sidebar-collapsed {
          margin-left: 0; /* Removed margin for collapsed sidebar */
        }

        @media (max-width: 767px) {
          .main-content {
            margin-left: 0; /* No margin on mobile */
          }
          .main-content.sidebar-collapsed {
            /* This class won't apply on mobile */
            margin-left: 0;
          }
        }

        .header {
          height: 70px; /* Reduced header height */
          background-color: var(--white);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md); /* Subtle shadow */
          position: sticky;
          top: 0;
          right: 0;
          left: 0;
          z-index: 100;
          width: 100%;
        }
        .header_inner {
          width: 95%;
          display: flex;
          justify-content: space-between;
          align-item: center;
        }
        .header-left-group {
          display: flex;
          align-items: center;
          gap: 0.3rem; /* Reduced gap */
        }
        .header-right-group {
          display: flex;
          align-items: center;
          gap: 1.5rem; /* Reduced gap */
        }

        .header-icon-button {
          position: relative;
          cursor: pointer;
          padding: 0.6rem; /* Reduced padding */
          border-radius: 50%;
          transition: background-color 0.2s ease, transform 0.2s ease;
          background-color: var(--light-blue); /* Light blue background */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-icon-button:hover {
          background-color: var(--primary-blue);
          color: var(--white);
          transform: scale(1.05); /* Less pronounced scale */
        }
        .header-icon-button:hover svg {
          color: var(--white);
        }

        .header-icon-button svg {
          width: 1.2rem; /* Reduced icon size */
          height: 1.2rem;
          color: var(--primary-blue); /* Primary blue color */
          transition: color 0.2s ease;
        }

        /* Red dot badge for new notifications/reminders */
        .notification-badge {
          position: absolute;
          top: 1px; /* Adjusted position */
          right: 1px; /* Adjusted position */
          background-color: var(--red-600);
          border-radius: 50%;
          width: 10px; /* Smaller dot */
          height: 10px; /* Smaller dot */
        }

        .user-avatar {
          width: 2rem; /* Reduced avatar size */
          height: 2rem;
          background-color: var(--primary-blue); /* Primary blue background */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-weight: 600;
          font-size: 1.1rem; /* Reduced font size */
          border: 2px solid var(--light-blue); /* Lighter border */
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease,
            border-color 0.2s ease;
          display: none;
        }
        .user-avatar:hover {
          transform: scale(1.02); /* Less pronounced scale */
          background-color: var(--indigo-700); /* Darker blue on hover */
          border-color: var(--primary-blue);
        }

        .content-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
          padding-block: 1rem;
          transition: none;
        }

        /* --- General Sub-Section Styling --- */
        .dashboard-sub-section {
          background-color: var(--white);
          padding: 1rem;
          width: 85%;
          border-radius: 1rem; /* Reduced roundedness */
          box-shadow: var(--shadow-md); /* Subtle shadow */
          border: 1px solid var(--border-color);
        }
        @media (min-width: 768px) {
          .dashboard-sub-section {
            width: 92%;
          }
        }
        .dashboard-sub-section:first-child {
          margin-top: 0; /* No top margin for the very first section */
        }

        .dashboard-sub-section-title {
          font-size: 1.6rem; /* Reduced title size */
          font-weight: 700;
          color: var(--dark-text);
          margin-bottom: 1.2rem; /* Reduced space */
          border-bottom: 1px solid var(--border-color); /* Thinner border */
          padding-bottom: 0.7rem; /* Reduced padding */
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; /* Allow wrapping for title and buttons */
          gap: 0.6rem; /* Reduced gap between title and buttons/dropdown */
        }

        .dashboard-sub-section-description {
          color: var(--medium-text);
          margin-bottom: 1.2rem; /* Reduced space */
          font-size: 0.95rem; /* Reduced font size */
          line-height: 1.5;
        }

        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .activity-item,
        .list-item {
          display: flex;
          align-items: center;
          padding: 0.7rem 0; /* Reduced padding */
          border-bottom: 1px dashed var(--border-color);
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .activity-item:hover,
        .list-item:hover {
          background-color: var(--light-blue);
          transform: translateX(3px); /* Less pronounced slide */
        }
        .activity-item:last-child,
        .list-item:last-child {
          border-bottom: none;
        }

        .activity-icon-container {
          flex-shrink: 0;
          width: 40px; /* Reduced icon container size */
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem; /* Reduced space */
          font-size: 1.2rem; /* Reduced icon size */
          color: var(--white);
          box-shadow: var(--shadow-sm); /* Subtle shadow */
        }

        .activity-icon-rent {
          background-color: var(--green-600);
        }
        .activity-icon-maintenance {
          background-color: var(--amber-500);
        }
        .activity-icon-lease {
          background-color: var(--primary-blue);
        } /* Primary blue for lease */
        .activity-icon-overdue {
          background-color: var(--red-600);
        }
        .activity-icon-completed {
          background-color: var(--green-600);
        }
        .activity-icon-rent_due {
          background-color: var(--amber-500);
        }
        .activity-icon-maintenance_pending {
          background-color: var(--red-600);
        }
        .activity-icon-maintenance_expense {
          background-color: var(--red-600);
        } /* Added for expenses */
        .activity-icon-lease_renewal_fee {
          background-color: var(--green-600);
        } /* Added for income */
        .activity-icon-utility_bill {
          background-color: var(--red-600);
        } /* Added for expenses */
        .activity-icon-tenant_contact_updated {
          background-color: #60a5fa;
        } /* Blue-400 */
        .activity-icon-property_inspection {
          background-color: #34d399;
        } /* Green-400 */

        .activity-content {
          flex-grow: 1;
          font-size: 0.95rem; /* Reduced font size */
          color: var(--dark-text); /* Darker text */
        }

        .activity-date {
          flex-shrink: 0;
          font-size: 0.85rem; /* Reduced date font size */
          color: var(--light-text); /* Lighter text for date */
          margin-left: 1.2rem; /* Reduced margin */
          white-space: nowrap;
        }
        .activity-status {
          flex-shrink: 0;
          font-size: 0.8rem; /* Reduced font size */
          font-weight: 600;
          margin-left: 0.7rem; /* Reduced margin */
          padding: 0.25rem 0.5rem; /* Reduced padding */
          border-radius: 0.3rem; /* Reduced roundedness */
          white-space: nowrap;
        }
        .activity-status.Upcoming {
          background-color: #e0f2fe; /* Light blue */
          color: #0288d1; /* Darker blue */
        }
        .activity-status.Overdue {
          background-color: #fee2e2; /* Light red */
          color: #dc2626; /* Darker red */
        }
        .activity-status.New,
        .activity-status.In-Progress {
          background-color: #fffbe6; /* Light amber */
          color: #d97706; /* Darker amber */
        }

        /* See More/Less Button Styles */
        .toggle-metrics-button {
          display: block;
          width: fit-content;
          margin: 0 auto 1.5rem auto; /* Reduced margin */
          padding: 0.7rem 1.8rem; /* Reduced padding */
          background-color: var(--primary-blue);
          color: var(--white);
          border: none;
          border-radius: 0.6rem; /* Reduced roundedness */
          font-size: 0.95rem; /* Reduced font size */
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-md); /* Subtle shadow */
        }
        .toggle-metrics-button:hover {
          background-color: var(--indigo-700);
          transform: translateY(-2px); /* Less pronounced lift */
          box-shadow: var(--shadow-lg); /* Slightly more shadow on hover */
        }

        /* --- Transaction Overview Section (New) --- */
        .transaction-overview-metrics-grid {
          width: 100%;
          overflow-x: scroll; /* Enable horizontal scrolling */
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
          gap: 1rem; /* Space between cards */
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .transaction-overview-metrics-grid::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .transaction-overview-metrics-grid {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .transaction-overview-metrics-grid-inner {
          display: flex;
          width: fit-content;
          gap: 1rem;
        }

        .chart-canvas-container {
          height: 250px; /* Reduced height for charts */
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        @media (min-width: 767px) {
          .chart-card {
            padding: 0.5rem;
            width: 60%;
            background-color: var(--white);
            border-radius: 1rem; /* Reduced roundedness */
            box-shadow: var(--shadow-md); /* Subtle shadow */
            border: 1px solid var(--border-color);
          }
                    .chart-canvas-container {
          height: 100%; /* Reduced height for charts */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        }
        .chart-card-header {
          /* New flex container for chart title and dropdown */
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem; /* Reduced gap */
        }

        .chart-card-title {
          font-size: 1.4rem; /* Reduced title size */
          font-weight: 700;
          color: var(--dark-text);
        }

        .chart-period-selector {
          /* Styles for the new dropdown */
          padding: 0.4rem 0.7rem; /* Reduced padding */
          border: 1px solid var(--border-color);
          border-radius: 0.5rem; /* Reduced roundedness */
          background-color: var(--light-blue);
          font-family: "Inter", sans-serif;
          font-size: 0.9rem; /* Reduced font size */
          font-weight: 500;
          color: var(--primary-blue);
          cursor: pointer;
          transition: all 0.2s ease;
          -webkit-appearance: none; /* Remove default arrow */
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232A398D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
          background-size: 1.1rem;
          padding-right: 2rem; /* Make space for custom arrow */
        }

        .chart-period-selector:hover {
          border-color: var(--primary-blue);
          box-shadow: var(--shadow-sm);
        }
        .chart-period-selector:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(42, 57, 141, 0.2);
        }

        .stat-card {
          background-color: var(--white);
          padding: 1rem; /* Increased padding for better look */
          border-radius: 0.7rem; /* Reduced roundedness */
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          transition: all 0.2s ease;
          width: 14.1rem; /* Minimum width for scrollable cards */
          gap: 0.6rem;
          box-shadow: var(--shadow-sm); /* Added subtle shadow */
        }
        @media (min-width: 768px) {
          .stat-card {
            width: 17rem;
          }
        }

        .stat-card-icon-wrapper {
          /* New wrapper for the icon */
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(
            --light-blue
          ); /* Light blue background for icon */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card-icon {
          width: 20px; /* Adjusted icon size */
          height: 20px;
          color: var(--primary-blue);
        }
        .stat-card-title {
          font-size: 0.9rem; /* Slightly increased font size */
          font-weight: 500;
          color: var(--medium-text);
          margin: 0;
          padding: 0;
          height: fit-content;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
          margin: 0;
          padding: 0;
        }
        .stat-card-value {
          font-size: 1.6rem; /* Slightly increased font size */
          font-weight: 700;
          color: var(--dark-text);
        }

        .stat-card-percentage {
          display: flex;
          align-items: center;
          font-size: 0.85rem; /* Slightly increased font size */
          font-weight: 600;
        }
        .stat-card-percentage.increase {
          color: var(--green-600);
        }
        .stat-card-percentage.decrease {
          color: var(--red-600);
        }
        .stat-card-percentage svg {
          width: 0.9rem; /* Slightly increased icon size */
          height: 0.9rem;
          margin-right: 0.2rem; /* Adjusted margin */
        }

        /* --- Property Statistics Section (Renamed from Sales Overview / Stats Summary) --- */
        .property-stats-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }

    
        .property-stats-section .stat-card {
          width: 100%;
          align-items: center;
          padding-block: 1rem;
          padding-inline: 0;
          gap: 0.6rem;
          box-shadow: var(--shadow-sm); /* Added subtle shadow */
        }
        .property-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
              @media (min-width: 767px) {
          .property-stats-section {
            flex-direction: row;
            justify-content: space-between;
            gap: 0.7rem;
          }
                    .property-stats-grid {
          width: 40%;
          gap: 1rem;
          
        }
        }
        .view-all-properties-button {
          /* New button style */
          padding: 0.6rem 1rem; /* Reduced padding */
          background-color: var(--primary-blue);
          color: var(--white);
          border: none;
          border-radius: 0.6rem; /* Reduced roundedness */
          font-size: 0.9rem; /* Reduced font size */
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm); /* Subtle shadow */
          display: flex;
          align-items: center;
          gap: 0.3rem; /* Reduced gap */
          white-space: nowrap; /* Prevent text wrapping */
        }
        .view-all-properties-button:hover {
          background-color: var(--indigo-700);
          transform: translateY(-1px); /* Less pronounced lift */
          box-shadow: var(--shadow-md); /* Slightly more shadow on hover */
        }
        .view-all-properties-button svg {
          width: 1rem; /* Reduced icon size */
          height: 1rem;
        }

        /* --- Transactions History Section (Renamed from Transactions Overview) --- */
        .transactions-table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 550px; /* Reduced min-width */
        }

        .transactions-table th,
        .transactions-table td {
          padding: 0.7rem 1rem; /* Reduced padding */
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .transactions-table th {
          background-color: var(--light-blue);
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 0.8rem; /* Reduced font size */
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .transactions-table tbody tr {
          transition: background-color 0.2s ease;
        }
        .transactions-table tbody tr:hover {
          background-color: var(--light-blue);
        }

        .transactions-table td {
          font-size: 0.85rem; /* Reduced font size */
          color: var(--dark-text);
        }

        .transaction-amount.income {
          color: var(--green-600);
          font-weight: 600;
        }
        .transaction-amount.expense {
          color: var(--red-600);
          font-weight: 600;
        }

        /* --- Modal Specific Styles --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background-color: var(--white);
          padding: 1rem; /* Reduced padding */
          border-radius: 0.9rem; /* Reduced roundedness */
          box-shadow: var(--shadow-lg); /* Subtle shadow */
          max-width: 550px; /* Reduced max width */
          width: 86%;
          transform: translateY(-15px); /* Less pronounced lift */
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          max-height: 90vh; /* Reduced max height */
          gap: 0.5rem;
        }

        .modal-overlay.show .modal-content {
          transform: translateY(0);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.8rem; /* Reduced padding */
        }

        .modal-title {
          font-size: 1.3rem; /* Reduced title size */
          font-weight: 700;
          color: var(--dark-text);
        }

        .modal-close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem; /* Reduced padding */
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .modal-close-button:hover {
          background-color: var(--light-blue);
        }

        .modal-close-button svg {
          width: 1.3rem; /* Reduced icon size */
          height: 1.3rem;
          color: var(--medium-text);
        }

        .modal-body {
          overflow-y: auto;
          width: auto;
        }

        .modal-body .item-list .activity-item {
          padding: 0.2rem 0; /* Reduced padding */
          width: 35rem;
          height: 3.4rem;
        }

        .modal-body .item-list .activity-icon-container {
          width: 36px; /* Reduced icon container size */
          height: 36px;
          font-size: 1rem; /* Reduced icon size */
        }
        .modal-body .item-list .activity-content {
          font-size: 0.9rem; /* Reduced font size */
        }
        .modal-body .item-list .activity-date {
          font-size: 0.75rem; /* Further reduced date font size */
        }
        .modal-body .text-slate-500 {
          text-align: center;
          padding: 0.8rem; /* Reduced padding */
          font-size: 0.95rem;
        }

        .notification-item {
          display: flex;
          align-items: center;
          padding: 0.7rem 0; /* Reduced padding */
          border-bottom: 1px dashed var(--border-color);
          color: var(--dark-text);
          font-size: 0.9rem; /* Reduced font size */
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .notification-item:hover {
          background-color: var(--light-blue);
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-item.read {
          color: var(--light-text);
        }
        .notification-item .icon {
          flex-shrink: 0;
          margin-right: 0.8rem; /* Reduced space */
          color: var(--primary-blue); /* Primary blue for icons */
        }
        .notification-item .content {
          flex-grow: 1;
        }
        .notification-item .date {
          flex-shrink: 0;
          margin-left: 0.8rem; /* Reduced space */
          font-size: 0.75rem; /* Further reduced font size */
          color: var(--light-text);
        }
        .notification-item .delete-icon {
          flex-shrink: 0;
          margin-left: 0.7rem; /* Reduced space */
          cursor: pointer;
          color: var(--red-600);
          padding: 0.25rem; /* Reduced padding */
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        .notification-item .delete-icon:hover {
          background-color: #fee2e2; /* Light red hover */
        }

        .notification-detail-content {
          padding: 1.2rem; /* Reduced padding */
          line-height: 1.6;
          background-color: var(--light-blue); /* Light blue background */
          border-radius: 0.7rem; /* Reduced roundedness */
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* Subtle inner shadow */
          border: 1px solid var(--primary-blue); /* Primary blue border */
          margin-top: 0.8rem; /* Reduced space */
          color: var(--dark-text);
        }
        .notification-detail-content p {
          margin-bottom: 0.7rem; /* Reduced margin */
          font-size: 0.95rem; /* Reduced font size */
        }
        .notification-detail-content p:last-child {
          margin-bottom: 0;
        }
        .notification-detail-content strong {
          color: var(--primary-blue);
          font-weight: 700;
          margin-right: 0.2rem; /* Reduced space */
        }

        /* Mobile Hamburger Menu Button */
        .hamburger-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .hamburger-menu-button:hover {
          background-color: var(--light-blue);
        }

        .hamburger-menu-button svg {
          width: 1.6rem; /* Reduced icon size */
          height: 1.6rem;
          color: var(--medium-text);
        }

        @media (max-width: 767px) {
          .hamburger-menu-button {
            display: block;
          }
        }

        /* Overlay for mobile sidebar */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
          z-index: 150;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar-overlay.show {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
      <div className="app-container">
        {/* Google Fonts link for global application */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Pure CSS styles embedded directly */}
        {/* Sidebar Overlay for Mobile */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        {/* Sidebar Navigation */}
        <aside
          className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""} ${
            isSidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <div className="sidebar-header">
            <img src="/favicon.ico" alt="" />
            {/* Mobile close button */}
            <button
              className="sidebar-close-button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation menu"
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
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            {/* Desktop toggle button */}
            <button
              className="sidebar-toggle-button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label="Toggle sidebar size"
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
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>
          <nav className="sidebar-nav">
            <a
              href="#overview"
              onClick={() => handleNavigation("overview")}
              className={`sidebar-link ${
                activeSection === "overview" ? "active" : ""
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              <span>Dashboard</span>
            </a>
          </nav>
          <div className="sidebar-footer">
            User ID: <span className="font-mono break-all">{userId}</span>
          </div>
        </aside>
        {/* Main Content Area - All sections integrated into Dashboard Overview */}
        <main
          className={`main-content ${
            isSidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <header className="header">
            <div className="header_inner">
              <div className="header-left-group">
                {/* Hamburger menu button for mobile */}
                <button
                  className="hamburger-menu-button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle navigation menu"
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
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </button>
                {/* User Avatar moved to be before greeting
              <div
                className="user-avatar"
                onClick={handleUserAvatarClick}
                title={
                  isLoggedIn ? `Logged in as ${user.email}` : "Login / Sign Up"
                }
              >
                {isLoggedIn && user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <span className="header-greeting">
                {getGreeting()},{" "}
                {isLoggedIn && user?.email ? user.email.split("@")[0] : "Guest"}
                !
              </span> */}
              </div>
              <div className="header-right-group">
                {/* Upcoming Reminders Icon (for undone activities) */}
                <div
                  className={`header-icon-button ${
                    hasUpcomingReminders ? "has-new" : ""
                  }`}
                  onClick={handleViewRemindersClick}
                  title="View Upcoming Reminders & Tasks (Undone)"
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
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                    <path d="M12 11h.01" />
                    <path d="M12 16h.01" />
                    <path d="M16 11h.01" />
                    <path d="M16 16h.01" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                  {hasUpcomingReminders && (
                    <span className="notification-badge"></span>
                  )}
                </div>
                {/* Notification Bell */}
                <div
                  className={`header-icon-button ${
                    notificationsCount > 0 ? "has-new" : ""
                  }`}
                  onClick={handleNotificationBellClick}
                  title="View Notifications"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.004 2.004 0 0118 14.59V10a6 6 0 00-12 0v4.59c0 .538-.214 1.055-.595 1.405L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                  {notificationsCount > 0 && (
                    <span className="notification-badge"></span>
                  )}
                </div>
              </div>
            </div>
          </header>
          <section id="overview" className="content-section active">
            {/* Transaction Overview Section (First) */}
            <div className="dashboard-sub-section">
              <h4 className="dashboard-sub-section-title">
                Transaction Overview
              </h4>
              <p className="dashboard-sub-section-description">
                A comprehensive look at your financial movements and key sales
                metrics.
              </p>
              <div className="transaction-overview-metrics-grid">
                <div className="transaction-overview-metrics-grid-inner">
                  {" "}
                  {/* New grid for the 4 cards */}
                  <div className="stat-card">
                    <div className="stat-card-icon-wrapper">
                      <span className="stat-card-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="stat-card-title">Total Income</h3>
                    <p className="stat-card-value">
                      ₦{totalIncome.toLocaleString()}
                    </p>
                    <div
                      className={`stat-card-percentage ${
                        isIncomeIncreasing ? "increase" : "decrease"
                      }`}
                    >
                      {isIncomeIncreasing ? (
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
                          className="lucide lucide-arrow-up"
                        >
                          <path d="M12 19V5" />
                          <path d="m5 12 7-7 7 7" />
                        </svg>
                      ) : (
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
                          className="lucide lucide-arrow-down"
                        >
                          <path d="M12 5v14" />
                          <path d="m19 12-7 7-7-7" />
                        </svg>
                      )}
                      {incomePercentageChange}% vs last month
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon-wrapper">
                      <span className="stat-card-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="stat-card-title">Total Expenses</h3>
                    <p className="stat-card-value">
                      ₦{totalExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon-wrapper">
                      <span className="stat-card-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8L11 2m9 10a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="stat-card-title">Total Rented Units</h3>{" "}
                    {/* Renamed from Total Sold */}
                    <p className="stat-card-value">{totalRentedProperties}</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-icon-wrapper">
                      <span className="stat-card-icon">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="stat-card-title">Total Views</h3>
                    <p className="stat-card-value">
                      {totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Property Statistics (Renamed from Sales Overview / Stats Summary) */}
            <div className="dashboard-sub-section">
              <div className="dashboard-sub-section-title">
                {" "}
                {/* Flex container for title and button */}
                <h4>Property Statistics</h4>
                <button
                  onClick={handleViewAllProperties}
                  className="view-all-properties-button"
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
                    className="lucide lucide-home"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  View All Properties
                </button>
              </div>
              <p className="dashboard-sub-section-description">
                Key statistics about your property portfolio and a visual
                summary of your monthly income and expenses, reflecting funds
                movement.
              </p>
              <div className="property-stats-section">
                {" "}
                {/* New grid for property stats and chart */}
                <div className="chart-card">
                  {" "}
                  {/* Chart goes here */}
                  <div className="chart-card-header">
                    {" "}
                    {/* New header for chart title and dropdown */}
                    <h5 className="chart-card-title">Income & Expenses</h5>
                    <select
                      className="chart-period-selector"
                      value={chartPeriod}
                      onChange={(e) => setChartPeriod(e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="daily">Daily</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="chart-canvas-container">
                    {" "}
                    {/* New container for Chart.js */}
                    <canvas id="propertyStatisticsChart"></canvas>{" "}
                    {/* Changed ID */}
                  </div>
                </div>
                <div className="property-stats-grid">
                  {propertyStatisticsMetrics.map((metric) => (
                    <div key={metric.id} className="stat-card">
                      <div className="stat-card-icon-wrapper">
                        <span className="stat-card-icon">{metric.icon}</span>
                      </div>
                      <h3 className="stat-card-title">{metric.title}</h3>
                      <p className="stat-card-value">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Financial Transactions History Section */}
            <div className="dashboard-sub-section">
              <h4 className="dashboard-sub-section-title">
                Financial Transactions History
              </h4>
              <p className="dashboard-sub-section-description">
                A detailed record of all financial transactions (payments,
                transfers, income, expenses) across your properties.
              </p>
              <div className="transactions-table-container">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Property</th>
                      <th>Tenant</th>
                      <th>Amount (₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialTransactions.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.date}</td>
                        <td>
                          {activity.type
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </td>
                        <td>{activity.description}</td>
                        <td>{activity.property}</td>
                        <td>{activity.tenant}</td>
                        <td
                          className={`transaction-amount ${
                            activity.amount >= 0 ? "income" : "expense"
                          }`}
                        >
                          {activity.amount >= 0 ? "+" : ""}₦
                          {activity.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {financialTransactions.length > 5 && ( // Assuming more than 5 activities would warrant a "View All"
                <button
                  onClick={() =>
                    handleSeeMoreActivity("financial-transactions")
                  }
                  className="toggle-metrics-button"
                  style={{ marginTop: "1.5rem" }}
                >
                  View All Financial Transactions
                </button>
              )}
            </div>
            {/* Recent Activities (User & System Actions) Section - NEW */}
            <div className="dashboard-sub-section">
              <h4 className="dashboard-sub-section-title">
                Recent Activities (User & System Actions)
              </h4>
              <p className="dashboard-sub-section-description">
                A record of other important completed activities, such as
                maintenance resolutions or tenant updates.
              </p>
              <ul className="item-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <li key={activity.id} className="activity-item">
                      <div
                        className={`activity-icon-container activity-icon-${
                          activity.type.split("_")[0]
                        }`}
                      >
                        {activity.type === "maintenance_completed" && (
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
                            <path d="M14 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2m8-4H8m0 0l3-3m-3 3l3 3m6-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                          </svg>
                        )}
                        {activity.type === "tenant_contact_updated" && (
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
                            <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                            <circle cx="12" cy="7" r="4" />
                            <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                          </svg>
                        )}
                        {activity.type === "property_inspection" && (
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
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        )}
                      </div>
                      <div className="activity-content">
                        {activity.description}
                      </div>
                      <div className="activity-date">{activity.date}</div>
                    </li>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    No recent activities.
                  </p>
                )}
              </ul>
              {recentActivities.length > 5 && ( // Example: show button if more than 5 activities
                <button
                  onClick={() => handleSeeMoreActivity("recent-activities")} // This would navigate to a full activity log
                  className="toggle-metrics-button"
                  style={{ marginTop: "1.5rem" }}
                >
                  View All Activities
                </button>
              )}
            </div>
          </section>
        </main>
        <MessageBox message={message} type={messageType} />
        {/* Notifications Modal */}
        <Modal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          title="Your Notifications"
        >
          {notifications.length > 0 ? (
            <>
              <ul className="item-list">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`notification-item ${notif.read ? "read" : ""}`}
                  >
                    <span className="icon">
                      {notif.read ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="m9 11 3 3L22 4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-bell"
                        >
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                      )}
                    </span>
                    <span
                      className="content"
                      onClick={() => handleViewNotificationDetails(notif)}
                    >
                      {notif.message}
                    </span>
                    <span className="date">{notif.date}</span>
                    <span
                      className="delete-icon"
                      onClick={() => handleDeleteNotification(notif.id)}
                      title="Delete Notification"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucude-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-slate-500">No new notifications.</p>
          )}
        </Modal>
        {/* Upcoming Reminders Modal (for undone activities) */}
        <Modal
          isOpen={isRemindersModalOpen}
          onClose={() => setIsRemindersModalOpen(false)}
          title="Upcoming Reminders & Tasks (Undone Activities)"
        >
          {upcomingReminders.length > 0 ? (
            <>
              <ul className="item-list">
                {upcomingReminders.map((reminder) => (
                  <li key={reminder.id} className="activity-item">
                    <div
                      className={`activity-icon-container activity-icon-${
                        reminder.type.split("_")[0]
                      }`}
                      style={{
                        width: "34px",
                        height: "34px",
                        fontSize: "1rem",
                        marginRight: "0.8rem",
                      }}
                    >
                      {reminder.type === "lease_renewal" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      )}
                      {reminder.type === "rent_overdue" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      )}
                      {reminder.type === "maintenance_pending" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      )}
                    </div>
                    <div className="activity-content">
                      {reminder.description}
                    </div>
                    <div className="activity-date">{reminder.date}</div>
                    <span
                      className={`activity-status ${reminder.status.replace(
                        /\s+/g,
                        "-"
                      )}`}
                    >
                      {reminder.status}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-slate-500">No upcoming reminders or tasks.</p>
          )}
        </Modal>
        {/* Notification Details Modal */}
        <NotificationDetailsModal
          isOpen={isNotificationDetailsModalOpen}
          onClose={() => setIsNotificationDetailsModalOpen(false)}
          notification={selectedNotification}
        />
        {/* Login/Signup Modal */}
        <LoginSignupModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </>
  );
}
