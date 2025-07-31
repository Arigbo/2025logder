"use client"; // This directive marks the component as a Client Component
import React, { useState, useEffect, useRef, useContext } from "react";
import Chart from "chart.js/auto"; // Import Chart.js
import { DashboardContext } from "@/app/landlords/layout"; // Import the context from the layout file
import Modal from "@/app/component/modal";
// --- Load external scripts for PDF generation ---
// This ensures jspdf and jspdf-autotable are available globally when needed.
// This block should ideally be placed outside the component or managed with a custom hook
// to prevent re-appending scripts on every re-render.
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

// --- Modal Component (moved here for data-dependent modals) ---


// --- Notification Details Modal Component (moved here) ---
// Displays detailed information about a selected notification.
function NotificationDetailsModal({ isOpen, onClose, notification }) {
  if (!isOpen || !notification) return null; // Only render if open and a notification is provided

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

// --- DashboardOverviewContent Component (Named Export) ---
// This component now contains the actual content for the Dashboard Overview page.
// It manages its own data and related modals.
export default function DashboardOverviewContent() {
  const { isLoggedIn, showMessage, setIsLoginModalOpen } = useContext(DashboardContext);
  const chartInstances = useRef({}); // Ref to store Chart.js instances for cleanup
  const [chartPeriod, setChartPeriod] = useState("monthly"); // State for chart data period (e.g., monthly, yearly)

  // --- Mock Data (now defined within this component) ---
  const initialMockNotifications = [
    { id: "notif1", message: "Rent payment received from John Doe for Apt 1A.", date: "2025-07-25", read: false },
    { id: "notif2", message: "New maintenance request for Leaky Faucet in Grand House.", date: "2025-07-24", read: false },
    { id: "notif3", message: "Lease for Student Annex expires in 30 days.", date: "2025-07-20", read: false },
    { id: "notif4", message: "Tenant Emily White has paid rent.", date: "2025-07-18", read: true },
    { id: "notif5", message: "Annual property inspection due for City Lodge.", date: "2025-07-15", read: true },
  ];
  const allMockProperties = [
    { id: "p1", name: "Grand House", totalRooms: 5, occupiedRooms: 3, rentPerRoom: 50000, address: "123 Main St" },
    { id: "p2", name: "City Lodge", totalRooms: 3, occupiedRooms: 3, rentPerRoom: 65000, address: "456 Oak Ave" },
    { id: "p3", name: "Student Annex", totalRooms: 8, occupiedRooms: 6, rentPerRoom: 30000, address: "789 University Rd" },
  ];
  const allMockTenants = [
    { id: "t1", name: "Alice Smith", propertyId: "p1", rentDue: 50000, rentDueDate: "2025-08-01", overdue: false, contact: "alice@example.com" },
    { id: "t2", name: "Bob Johnson", propertyId: "p1", rentDue: 50000, rentDueDate: "2025-08-01", overdue: false, contact: "bob@example.com" },
    { id: "t3", name: "Charlie Brown", propertyId: "p2", rentDue: 65000, rentDueDate: "2025-07-01", overdue: true, contact: "charlie@example.com" },
    { id: "t4", name: "Diana Prince", propertyId: "p3", rentDue: 30000, rentDueDate: "2025-08-05", overdue: false, contact: "diana@example.com" },
  ];
  const allMockMaintenanceRequests = [
    { id: "m1", title: "Leaky Faucet", propertyId: "p1", status: "Pending", urgency: "High", dateReported: "2025-07-23" },
    { id: "m2", title: "Broken AC", propertyId: "p2", status: "In Progress", urgency: "Medium", dateReported: "2025-07-20" },
    { id: "m3", title: "Common Area Cleaning", propertyId: "p3", status: "Completed", urgency: "Low", dateReported: "2025-07-15" },
  ];
  const allMockFinancialTransactions = [
    { id: "ft1", type: "Rent Payment", propertyId: "p1", tenantName: "Alice Smith", amount: 50000, date: "2025-07-25" },
    { id: "ft2", type: "Maintenance Expense", propertyId: "p1", description: "Plumbing repair", amount: -15000, date: "2025-07-24" },
    { id: "ft3", type: "Rent Payment", propertyId: "p2", tenantName: "Emily White", amount: 65000, date: "2025-07-18" },
    { id: "ft4", type: "Utility Bill", propertyId: "p3", description: "Electricity", amount: -25000, date: "2025-07-10" },
  ];
  const allMockRecentActivities = [
    { id: "ra1", type: "Rent Payment Received", description: "Received ₦50,000 from Alice Smith for Grand House.", date: "2025-07-25" },
    { id: "ra2", type: "New Maintenance Request", description: "Leaky Faucet reported for Grand House.", date: "2025-07-24" },
    { id: "ra3", type: "Lease Renewal Reminder", description: "Lease for Student Annex tenant due in 30 days.", date: "2025-07-20" },
    { id: "ra4", type: "Expense Recorded", description: "Paid ₦15,000 for plumbing repair at Grand House.", date: "2025-07-24" },
  ];
  const allMockCommunicationLog = [
    { id: "c1", tenant: "Alice Smith", subject: "Rent Confirmation", date: "2025-07-25", message: "Confirmed rent payment for July." },
    { id: "c2", tenant: "Charlie Brown", subject: "Overdue Rent Notice", date: "2025-07-05", message: "Sent reminder for overdue July rent." },
  ];

  // State for notifications and reminder modals (now local to this component)
  const [notifications, setNotifications] = useState(initialMockNotifications);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // --- Metric Calculations ---
  // Derived state calculations for key performance indicators
  const totalProperties = allMockProperties.length;
  const totalRoomsAvailable = allMockProperties.reduce((sum, p) => sum + p.totalRooms, 0);
  const occupiedRooms = allMockProperties.reduce((sum, p) => sum + p.occupiedRooms, 0);
  const vacantRooms = totalRoomsAvailable - occupiedRooms;
  const occupancyRate = totalRoomsAvailable > 0 ? ((occupiedRooms / totalRoomsAvailable) * 100).toFixed(1) : "0.0";
  const overdueRentTenantsCount = allMockTenants.filter(t => t.overdue).length;
  const pendingMaintenanceRequests = allMockMaintenanceRequests.filter(req => req.status === "Pending" || req.status === "In Progress").length;
  const projectedMonthlyIncome = allMockTenants.reduce((sum, t) => sum + t.rentDue, 0); // Sum of all tenant's rent due
  const totalIncome = allMockFinancialTransactions.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
  const totalExpenses = allMockFinancialTransactions.reduce((s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
  const netOperatingIncome = totalIncome - totalExpenses;

  // Generate upcoming reminders based on overdue rent, pending maintenance, and lease expirations
  const upcomingReminders = [
    ...allMockTenants.filter(t => t.overdue).map(t => ({ id: `rent-${t.id}`, description: `Rent overdue for ${t.name} (₦${t.rentDue.toLocaleString()})` })),
    ...allMockMaintenanceRequests.filter(r => r.status === 'Pending' || r.status === 'In Progress').map(r => ({ id: `maint-${r.id}`, description: `Maintenance: ${r.title} at ${allMockProperties.find(p => p.id === r.propertyId)?.name}` })),
    // Example for lease reminders: filter notifications related to lease expiry that are unread
    ...notifications.filter(n => n.message.includes("lease") && !n.read).map(n => ({ id: `lease-notif-${n.id}`, description: n.message })),
  ];
  const hasUpcomingReminders = upcomingReminders.length > 0; // Check if there are any reminders

  // Handles notification bell click, opens modal and marks notifications as read
  const handleNotificationBellClick = () => {
    setIsNotificationsModalOpen(true);
    // Mark all notifications as read when the bell is clicked
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Handles "View Reminders" button click
  const handleViewRemindersClick = () => setIsRemindersModalOpen(true);

  // Handles deleting a notification from the list
  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    showMessage("Notification deleted.", "info");
  };

  // Handles viewing detailed information for a specific notification
  const handleViewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationDetailsModalOpen(true);
    // Mark the specific notification as read when its details are viewed
    if (!notification.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    }
  };

  // --- Chart Logic ---
  // Function to create or update a Chart.js instance
  const createChart = (chartId, type, data, options) => {
    // Destroy existing chart instance if it exists to prevent memory leaks
    if (chartInstances.current[chartId]) {
      chartInstances.current[chartId].destroy();
    }
    const ctx = document.getElementById(chartId); // Get the canvas element
    if (ctx) {
      // Create a new Chart.js instance and store it in the ref
      chartInstances.current[chartId] = new Chart(ctx, { type, data, options });
    }
  };

  // Effect hook to initialize and manage charts when data changes
  useEffect(() => {
    // Only attempt to create charts if the user is logged in
    if (isLoggedIn) {
      // Data for Revenue vs. Expenses Chart
      const revenueData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // Example months
        datasets: [
          {
            label: "Revenue",
            data: [200000, 220000, 250000, 230000, 260000, 240000, 270000], // Mock revenue data
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.3, // Smooth curve
            fill: true, // Fill area under the line
          },
          {
            label: "Expenses",
            data: [80000, 75000, 90000, 85000, 95000, 88000, 100000], // Mock expenses data
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            tension: 0.3, // Smooth curve
            fill: true, // Fill area under the line
          },
        ],
      };
      createChart("revenueExpensesChart", "line", revenueData, {
        responsive: true,
        maintainAspectRatio: false, // Allow canvas to resize freely based on container
        plugins: {
          title: {
            display: true,
            text: "Monthly Revenue vs. Expenses",
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Amount (₦)",
            },
            ticks: {
              callback: function(value) {
                return '₦' + value.toLocaleString(); // Format Y-axis labels as currency
              }
            }
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          }
        },
      });

      // Data for Property Occupancy Rate Chart
      const occupancyData = {
        labels: allMockProperties.map(p => p.name), // Property names as labels
        datasets: [
          {
            label: "Occupancy Rate (%)",
            data: allMockProperties.map(p => (p.totalRooms > 0 ? (p.occupiedRooms / p.totalRooms * 100).toFixed(1) : 0)), // Calculate occupancy percentage
            backgroundColor: [
              "rgba(75, 192, 192, 0.8)", // Color for Grand House
              "rgba(153, 102, 255, 0.8)", // Color for City Lodge
              "rgba(255, 159, 64, 0.8)", // Color for Student Annex
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      createChart("occupancyRateChart", "bar", occupancyData, {
        responsive: true,
        maintainAspectRatio: false, // Allow canvas to resize freely based on container
        plugins: {
          title: {
            display: true,
            text: "Property Occupancy Rates",
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false, // Hide legend as there's only one dataset
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100, // Max percentage is 100
            title: {
              display: true,
              text: "Occupancy (%)",
            },
            ticks: {
              callback: function(value) {
                return value + '%'; // Format Y-axis labels as percentage
              }
            }
          },
          x: {
            title: {
              display: true,
              text: "Property",
            },
          }
        },
      });
    }

    // Cleanup function for charts: destroy all chart instances when component unmounts or data changes
    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
      chartInstances.current = {}; // Reset the ref to clear old instances
    };
  }, [allMockProperties, chartPeriod, isLoggedIn]); // Re-run effect if properties data, chartPeriod, or isLoggedIn changes
  return (
    <div className="content-area-inner">
      {/* Conditional rendering based on login status */}
      {!isLoggedIn ? (
        <div className="not-login">
          <h1 className="text-size-3xl font-bold text-gray-800">Welcome to Lodger!</h1>
          <p className="text-size-lg text-gray-600 ">Please log in to access your landlord dashboard and manage your properties.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="button-primary button-large"
          >
            Login / Sign Up
          </button>
          <p className="text-size-sm text-gray-500 ">Use demo@example.com and 'password' to try it out!</p>
        </div>
      ) : (
        <div className="overview-section">
          <h1 className="section-title text-gray-800">Dashboard Overview</h1>
<div className="overview-section-inner">
         <div className="card-flex">
    <div className="card-flex-inner">
            {/* Total Properties Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Total Properties</h3>
                <p className="card-value">{totalProperties}</p>
              </div>
              {/* Icon for Total Properties */}
              <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            {/* Occupancy Rate Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Occupancy Rate</h3>
                <p className="card-value">{occupancyRate}%</p>
              </div>
              {/* Icon for Occupancy Rate */}
              <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            {/* Rent Overdue Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Rent Overdue</h3>
                <p className="card-value red">{overdueRentTenantsCount}</p>
              </div>
              {/* Icon for Rent Overdue */}
              <svg xmlns="http://www.w3.org/2000/svg" className="card-icon red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V3m0 5V1m0 16c-1.11 0-2.08-.402-2.599-1M12 16v5m0-13v.01M12 16v.01" /></svg>
            </div>
            {/* Pending Maintenance Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Pending Maintenance</h3>
                <p className="card-value yellow">{pendingMaintenanceRequests}</p>
              </div>
              {/* Icon for Pending Maintenance */}
              <svg xmlns="http://www.w3.org/2000/svg" className="card-icon yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
    </div>
          </div>
          {/* --- Financial Summary --- */}
          <div className="card-grid lg-cols-2">
            <div className="financial-summary">
              <h2 className="financial-summary-title">Financial Overview</h2>
              <div className="financial-item-list">
                <div className="financial-item">
                  <span className="financial-item-label">Projected Monthly Income:</span>
                  <span className="financial-item-value green">₦{projectedMonthlyIncome.toLocaleString()}</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item-label">Total Income (YTD):</span>
                  <span className="financial-item-value green">₦{totalIncome.toLocaleString()}</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item-label">Total Expenses (YTD):</span>
                  <span className="financial-item-value red">₦{totalExpenses.toLocaleString()}</span>
                </div>
                <div className="financial-total-item">
                  <span className="financial-total-label">Net Operating Income (YTD):</span>
                  <span className={`financial-total-value ${netOperatingIncome >= 0 ? 'green' : 'red'}`}>
                    ₦{netOperatingIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* --- Property Performance Overview (Chart) --- */}
            <div className="chart-card">
              <h2 className="chart-card-title">Property Occupancy</h2>
              <div className="chart-container">
                <canvas id="occupancyRateChart"></canvas>
              </div>
            </div>
          </div>

          {/* --- Charts Section --- */}
          <div className="card-grid">
            <div className="chart-card">
              <h2 className="chart-card-title">Revenue vs. Expenses</h2>
              <div className="chart-controls">
                <button
                  className={`chart-control-button ${chartPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setChartPeriod('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`chart-control-button ${chartPeriod === 'yearly' ? 'active' : ''}`}
                  onClick={() => setChartPeriod('yearly')}
                >
                  Yearly
                </button>
              </div>
              <div className="chart-container">
                <canvas id="revenueExpensesChart"></canvas>
              </div>
            </div>
          </div>

          {/* --- Quick Actions --- */}
          {/* <div className="quick-actions">
            <h2 className="quick-actions-title">Quick Actions</h2>
            <div className="quick-actions-grid sm-cols-2 md-cols-3 lg-cols-4">
              <button className="action-card" onClick={() => showMessage("Add New Property clicked!")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="action-card-text">Add Property</span>
              </button>
              <button className="action-card green" onClick={() => showMessage("Record Payment clicked!")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="action-card-text">Record Payment</span>
              </button>
              <button className="action-card orange" onClick={() => showMessage("New Maintenance Request clicked!")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="action-card-text">New Maintenance</span>
              </button>
              <button className="action-card blue" onClick={() => showMessage("Contact Tenant clicked!")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="action-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span className="action-card-text">Contact Tenant</span>
              </button>
            </div>
          </div> */}

          {/* --- Recent Activity Feed --- */}
          <div className="activity-feed">
            <h2 className="activity-feed-title">Recent Activity</h2>
            <ul className="activity-list">
              {allMockRecentActivities.length > 0 ? (
                allMockRecentActivities.map(activity => (
                  <li key={activity.id}>
                    <div>
                      <p className="activity-type">{activity.type}</p>
                      <p className="activity-description">{activity.description}</p>
                    </div>
                    <span className="activity-date">{activity.date}</span>
                  </li>
                ))
              ) : (
                <p className="no-data-message">No recent activity to display.</p>
              )}
            </ul>
            <div className="view-all-button-container">
              <button
                className="view-all-button"
                onClick={() => showMessage("Navigating to Communications section (not implemented).", "info")}
              >
                View All Activity &rarr;
              </button>
            </div>
          </div>

          {/* --- Upcoming Lease Expirations --- */}
          <div className="lease-expirations">
            <h2 className="lease-expirations-title">Upcoming Lease Expirations</h2>
            <ul className="lease-list">
              {/* Filter and sort tenants by upcoming rent due dates */}
              {allMockTenants.filter(t => new Date(t.rentDueDate) > new Date()).sort((a, b) => new Date(a.rentDueDate) - new Date(b.rentDueDate)).map(tenant => (
                <li key={tenant.id}>
                  <div>
                    <p className="lease-tenant-info">{tenant.name} - <span className="lease-property-name">{allMockProperties.find(p => p.id === tenant.propertyId)?.name}</span></p>
                    <p className="lease-due-date">Rent Due: {tenant.rentDueDate}</p>
                  </div>
                  <button className="lease-contact-button" onClick={() => showMessage(`Contacted ${tenant.name} about lease.`)}>
                   <i className="fas fa-phone"></i> Contact
                  </button>
                </li>
              ))}
              {/* Message if no upcoming lease expirations */}
              {allMockTenants.filter(t => new Date(t.rentDueDate) > new Date()).length === 0 && (
                <p className="no-data-message">No upcoming lease expirations.</p>
              )}
            </ul>
          </div>

</div>
          {/* Notification and Reminder Modals (now local to this component) */}
          <Modal
            isOpen={isNotificationsModalOpen}
            onClose={() => setIsNotificationsModalOpen(false)}
            title="Notifications"
          >
            <div className="modal-content-spacing">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${
                      n.read ? "notification-read" : "notification-unread"
                    }`}
                    onClick={() => handleViewNotificationDetails(n)}
                  >
                    <div>
                      <p>{n.message}</p>
                      <p className="notification-date">
                        {n.date} {n.read ? "" : "(New)"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal from closing when clicking delete button
                        handleDeleteNotification(n.id);
                      }}
                      className="delete-notification-button"
                      aria-label={`Delete notification: ${n.message}`}
                    >
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
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No new notifications.</p>
              )}
            </div>
          </Modal>
          <NotificationDetailsModal
            isOpen={isNotificationDetailsModalOpen}
            onClose={() => setIsNotificationDetailsModalOpen(false)}
            notification={selectedNotification}
          />
          <Modal
            isOpen={isRemindersModalOpen}
            onClose={() => setIsRemindersModalOpen(false)}
            title="Upcoming Reminders"
          >
            <div className="modal-content-spacing">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map((r) => (
                  <div key={r.id} className="reminder-item">
                    <p>{r.description}</p>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No upcoming reminders.</p>
              )}
            </div>
          </Modal>
          {/* Notification and Reminder Action Buttons (now local to this component) */}
          <div className="sidebar-actions-local"> {/* Added a class for local styling if needed */}
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
              {/* Notification badge if there are unread notifications */}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
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
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
              {/* Reminder dot if there are upcoming reminders */}
              {hasUpcomingReminders && <span className="reminder-dot"></span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
