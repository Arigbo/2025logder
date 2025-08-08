"use client"; // This directive marks the component as a Client Component
import React, { useState, useEffect, useRef, useContext } from "react";
import Chart from "chart.js/auto"; // Import Chart.js
import { DashboardContext } from "@/app/landlords/layout"; // Import the context from the layout file
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

// --- DashboardOverviewContent Component (Named Export) ---
// This component now contains the actual content for the Dashboard Overview page.
// It manages its own data and related modals.
export default function DashboardOverviewContent() {
  // Consume properties and tenants from DashboardContext
  const { showMessage, properties, tenants } = useContext(DashboardContext);
  const chartInstances = useRef({}); // Ref to store Chart.js instances for cleanup
  const [chartPeriod, setChartPeriod] = useState("monthly"); // State for chart data period (e.g., monthly, yearly)

  // Mock data for maintenance requests, financial transactions, and recent activities
  // These are not managed by the context in the current setup, so they remain local.
  const allMockMaintenanceRequests = [
    {
      id: "m1",
      title: "Leaky Faucet",
      propertyId: "p1",
      status: "Pending",
      urgency: "High",
      dateReported: "2025-07-23",
    },
    {
      id: "m2",
      title: "Broken AC",
      propertyId: "p2",
      status: "In Progress",
      urgency: "Medium",
      dateReported: "2025-07-20",
    },
    {
      id: "m3",
      title: "Common Area Cleaning",
      propertyId: "p3",
      status: "Completed",
      urgency: "Low",
      dateReported: "2025-07-15",
    },
  ];
  const allMockFinancialTransactions = [
    {
      id: "ft1",
      type: "Rent Payment",
      propertyId: "p1",
      tenantName: "Alice Smith",
      amount: 50000,
      date: "2025-07-25",
    },
    {
      id: "ft2",
      type: "Maintenance Expense",
      propertyId: "p1",
      description: "Plumbing repair",
      amount: -15000,
      date: "2025-07-24",
    },
    {
      id: "ft3",
      type: "Rent Payment",
      propertyId: "p2",
      tenantName: "Emily White",
      amount: 65000,
      date: "2025-07-18",
    },
    {
      id: "ft4",
      type: "Utility Bill",
      propertyId: "p3",
      description: "Electricity",
      amount: -25000,
      date: "2025-07-10",
    },
  ];
  const allMockRecentActivities = [
    {
      id: "ra1",
      type: "Rent Payment Received",
      description: "Received ₦50,000 from Alice Smith for Grand House.",
      date: "2025-07-25",
    },
    {
      id: "ra2",
      type: "New Maintenance Request",
      description: "Leaky Faucet reported for Grand House.",
      date: "2025-07-24",
    },
    {
      id: "ra3",
      type: "Lease Renewal Reminder",
      description: "Lease for Student Annex tenant due in 30 days.",
      date: "2025-07-20",
    },
    {
      id: "ra4",
      type: "Expense Recorded",
      description: "Paid ₦15,000 for plumbing repair at Grand House.",
      date: "2025-07-24",
    },
  ];

  // --- Metric Calculations ---
  // Derived state calculations for key performance indicators using context data
  const totalProperties = properties.length;
  const totalRoomsAvailable = properties.reduce(
    (sum, p) => sum + p.totalRooms,
    0
  );
  const occupiedRooms = properties.reduce(
    (sum, p) => sum + p.occupiedRooms,
    0
  );
  const occupancyRate =
    totalRoomsAvailable > 0
      ? ((occupiedRooms / totalRoomsAvailable) * 100).toFixed(1)
      : "0.0";
  const overdueRentTenantsCount = tenants.filter(
    (t) => t.paymentStatus === 'overdue'
  ).length;
  const pendingMaintenanceRequests = allMockMaintenanceRequests.filter(
    (req) => req.status === "Pending" || req.status === "In Progress"
  ).length;
  const projectedMonthlyIncome = tenants.reduce(
    (sum, t) => sum + (t.paymentStatus === 'due' || t.paymentStatus === 'overdue' ? t.rentDue : 0),
    0
  ); // Sum of all tenant's rent due (only if currently due or overdue)
  const totalIncome = allMockFinancialTransactions.reduce(
    (s, t) => s + (t.amount > 0 ? t.amount : 0),
    0
  );
  const totalExpenses = allMockFinancialTransactions.reduce(
    (s, t) => s + (t.amount < 0 ? Math.abs(t.amount) : 0),
    0
  );
  const netOperatingIncome = totalIncome - totalExpenses;

  // Helper to get property name from ID
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : "N/A";
  };

  // Helper to get lease status
  const getLeaseStatus = (leaseEnd) => {
    const today = new Date();
    const endDate = new Date(leaseEnd);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'Expired', days: Math.abs(diffDays) };
    } else if (diffDays <= 30) {
      return { status: 'Expiring Soon', days: diffDays };
    } else {
      return { status: 'Active', days: diffDays };
    }
  };

  const upcomingLeaseExpirations = tenants
    .map(tenant => ({ ...tenant, leaseStatus: getLeaseStatus(tenant.leaseEnd) }))
    .filter(tenant => tenant.leaseStatus.status !== 'Expired') // Only show active or expiring soon
    .sort((a, b) => new Date(a.leaseEnd) - new Date(b.leaseEnd));


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
          font: { size: 16, weight: "bold" },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount (₦)",
          },
          ticks: {
            callback: function (value) {
              return "₦" + value.toLocaleString(); // Format Y-axis labels as currency
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
      },
    });

    // Data for Property Occupancy Rate Chart
    const occupancyData = {
      labels: properties.map((p) => p.name), // Property names as labels from context
      datasets: [
        {
          label: "Occupancy Rate (%)",
          data: properties.map((p) =>
            p.totalRooms > 0
              ? ((p.occupiedRooms / p.totalRooms) * 100).toFixed(1)
              : 0
          ), // Calculate occupancy percentage using context data
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
          font: { size: 16, weight: "bold" },
        },
        legend: {
          display: false, // Hide legend as there's only one dataset
        },
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
            callback: function (value) {
              return value + "%"; // Format Y-axis labels as percentage
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Property",
          },
        },
      },
    });

    // Cleanup function for charts: destroy all chart instances when component unmounts or data changes
    return () => {
      Object.values(chartInstances.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
      chartInstances.current = {}; // Reset the ref to clear old instances
    };
  }, [properties, chartPeriod]); // Re-run effect if properties data or chartPeriod changes

  return (
    <div className="overview-section">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>
      <div className="overview-section-inner">
        {/* --- Key Metrics Cards --- */}
        <div className="card-flex">
          <div className="card-flex-inner">
            {/* Total Properties Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Total Properties</h3>
                <p className="card-value">{totalProperties}</p>
              </div>
              {/* Icon for Total Properties */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            {/* Occupancy Rate Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Occupancy Rate</h3>
                <p className="card-value">{occupancyRate}%</p>
              </div>
              {/* Icon for Occupancy Rate */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            {/* Rent Overdue Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Rent Overdue</h3>
                <p className="card-value red">{overdueRentTenantsCount}</p>
              </div>
              {/* Icon for Rent Overdue */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="card-icon red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V3m0 5V1m0 16c-1.11 0-2.08-.402-2.599-1M12 16v5m0-13v.01M12 16v.01"
                />
              </svg>
            </div>
            {/* Pending Maintenance Card */}
            <div className="card">
              <div>
                <h3 className="card-title">Pending Maintenance</h3>
                <p className="card-value yellow">
                  {pendingMaintenanceRequests}
                </p>
              </div>
              {/* Icon for Pending Maintenance */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="card-icon yellow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* --- Financial Summary --- */}
        <div className="card-grid lg-cols-2">
          <div className="financial-summary">
            <h2 className="financial-summary-title">Financial Overview</h2>
            <div className="financial-item-list">
              <div className="financial-item">
                <span className="financial-item-label">
                  Projected Monthly Income:
                </span>
                <span className="financial-item-value green">
                  ₦{projectedMonthlyIncome.toLocaleString()}
                </span>
              </div>
              <div className="financial-item">
                <span className="financial-item-label">
                  Total Income (YTD):
                </span>
                <span className="financial-item-value green">
                  ₦{totalIncome.toLocaleString()}
                </span>
              </div>
              <div className="financial-item">
                <span className="financial-item-label">
                  Total Expenses (YTD):
                </span>
                <span className="financial-item-value red">
                  ₦{totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="financial-total-item">
                <span className="financial-total-label">
                  Net Operating Income (YTD):
                </span>
                <span
                  className={`financial-total-value ${
                    netOperatingIncome >= 0 ? "green" : "red"
                  }`}
                >
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
                className={`chart-control-button ${
                  chartPeriod === "monthly" ? "active" : ""
                }`}
                onClick={() => setChartPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                className={`chart-control-button ${
                  chartPeriod === "yearly" ? "active" : ""
                }`}
                onClick={() => setChartPeriod("yearly")}
              >
                Yearly
              </button>
            </div>
            <div className="chart-container">
              <canvas id="revenueExpensesChart"></canvas>
            </div>
          </div>
        </div>

        {/* --- Recent Activity Feed --- */}
        <div className="activity-feed">
          <h2 className="activity-feed-title">Recent Activity</h2>
          <ul className="activity-list">
            {allMockRecentActivities.length > 0 ? (
              allMockRecentActivities.map((activity) => (
                <li key={activity.id}>
                  <div>
                    <p className="activity-type">{activity.type}</p>
                    <p className="activity-description">
                      {activity.description}
                    </p>
                  </div>
                  <span className="activity-date">{activity.date}</span>
                </li>
              ))
            ) : (
              <p className="no-data-message">
                No recent activity to display.
              </p>
            )}
          </ul>
          <div className="view-all-button-container">
            <button
              className="view-all-button"
              onClick={() =>
                showMessage(
                  "Navigating to Communications section (not implemented).",
                  "info"
                )
              }
            >
              View All Activity &rarr;
            </button>
          </div>
        </div>

        {/* --- Upcoming Lease Expirations --- */}
        <div className="lease-expirations">
          <h2 className="lease-expirations-title">
            Upcoming Lease Expirations
          </h2>
          <ul className="lease-list">
            {upcomingLeaseExpirations.length > 0 ? (
              upcomingLeaseExpirations.map((tenant) => (
                <li key={tenant.id} className={`lease-item ${tenant.leaseStatus.status === 'Expiring Soon' ? 'expiring-soon' : ''}`}>
                  <div>
                    <p className="lease-tenant-info">
                      {tenant.name} -{" "}
                      <span className="lease-property-name">
                        {getPropertyName(tenant.propertyId)}
                      </span>
                    </p>
                    <p className="lease-due-date">
                      Lease Ends: {tenant.leaseEnd} ({tenant.leaseStatus.status === 'Expiring Soon' ? `${tenant.leaseStatus.days} days left` : 'Active'})
                    </p>
                  </div>
                  <div className="lease-actions">
                    <button
                      className="lease-action-button button-secondary"
                      onClick={() => showMessage(`Renewing lease for ${tenant.name} (Not implemented yet)`, "info")}
                    >
                      Renew Lease
                    </button>
                    <button
                      className="lease-action-button button-danger"
                      onClick={() => showMessage(`Requesting to end lease for ${tenant.name} (Not implemented yet)`, "info")}
                    >
                      End Lease
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-data-message">
                No upcoming lease expirations.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
