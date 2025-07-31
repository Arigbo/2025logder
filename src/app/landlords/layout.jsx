"use client"; // This directive marks the component as a Client Component

import { usePathname } from "next/navigation";
import React, { useState, createContext } from "react";
import Link from "next/link";
// --- Context for Dashboard Layout State ---
// This context will provide common state and functions to Header and Sidebar,
// avoiding prop drilling from the main Layout component.
export const DashboardContext = createContext(null); // Export context for use in other files

// --- Reusable Components ---

// --- Message Box Component (for notifications) ---
// Displays temporary success, error, or info messages to the user.
function MessageBox({ message, type }) {
  if (!message) return null; // Don't render if there's no message
  return <div className={`message-box show ${type}`}>{message}</div>;
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

// --- Header Component ---
// Displays the dashboard header with greeting, user info, and sidebar toggle.
function Header() {
  const { toggleSidebarOpen, getGreeting, user } =
    React.useContext(DashboardContext);

  // Determine the current section title based on the URL pathname
  const getSectionTitle = () => {
    if (typeof window === "undefined") return ""; // Handle SSR
    const path = window.location.pathname;
    // Example: /landlords/dashboard -> Dashboard
    // /landlords/properties -> Properties
    const parts = path.split("/").filter(Boolean); // Filter out empty strings
    if (parts.length > 1 && parts[0] === "landlords") {
      const section = parts[1];
      return section
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return ""; // Default if no specific section is found
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {/* Button to toggle sidebar visibility on small screens */}
          <button
            className="menu-button menu-button-mobile-only"
            onClick={toggleSidebarOpen}
            aria-label="Open menu"
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
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          {/* Dynamic greeting and user name */}
          <h2 className="header-title">
            {getGreeting()}, {user ? user.email.split("@")[0] : "Guest"}!
          </h2>
        </div>
        <div className="header-right">
          {/* Search bar can be added here if needed */}
        </div>
      </div>
    </header>
  );
}

// --- Sidebar Component ---
// Navigation sidebar with links to different dashboard sections.
function Sidebar() {
  const {
    isSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    user,
    isLoggedIn,
    handleUserAvatarClick,
  } = React.useContext(DashboardContext);

  // Helper to determine if a nav item is active based on current pathname

  // Navigation items with their IDs, labels, and SVG icons
  // Updated `href` to simulate actual routes
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
      className={`sidebar ${
        React.useContext(DashboardContext).isSidebarOpen ? "open" : ""
      } ${isSidebarCollapsed ? "collapsed" : ""}`}
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
        {/* Button to toggle sidebar collapse state */}
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
        {/* User profile section, clickable to trigger login/user info modal */}
        <div className="user-profile" onClick={handleUserAvatarClick}>
          <div className="user-avatar">
            {isLoggedIn && user ? (
              user.email.charAt(0).toUpperCase() // Display first letter of email if logged in
            ) : (
              // Default user icon if not logged in
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
                {isLoggedIn && user ? user.email.split("@")[0] : ""}
              </span>
              <span className="user-status">
                {isLoggedIn ? "Landlord" : "Not Logged In"}
              </span>
            </div>
          )}
        </div>
        {/* Removed notification and reminder action buttons as their data is no longer managed by layout */}
      </div>
    </aside>
  );
}

// --- DashboardLayout Component (Default Export) ---
// This component acts as the main layout, containing the Sidebar and Header,
// and manages their shared state.
export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("not-logged-in");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for sidebar collapse

  // Helper function to display temporary messages
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  // Determines the appropriate greeting based on the current time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Handles user avatar click, either opens login modal or shows user info
  const handleUserAvatarClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      showMessage(`Logged in as: ${user.email}`, "info");
    }
  };

  // Callback function for successful login
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setUserId(loggedInUser.uid);
    setIsLoggedIn(true);
    showMessage("Logged in successfully!", "success");
  };

  // Context value to be provided to children components
  const dashboardContextValue = {
    user,
    userId,
    isLoggedIn,
    message,
    messageType,
    isSidebarOpen,
    isSidebarCollapsed, // Provide collapse state
    isLoginModalOpen,
    getGreeting,
    showMessage,
    setIsLoginModalOpen,
    handleLoginSuccess,
    toggleSidebarOpen: () => setIsSidebarOpen(!isSidebarOpen),
    toggleSidebarCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed), // Provide toggle function
    handleUserAvatarClick,
  };

  return (
    <DashboardContext.Provider value={dashboardContextValue}>
      <div className="dashboard-layout">
        <MessageBox message={message} type={messageType} />

        <Sidebar />

        <div
          className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
          <Header />
          <main className="content-area">
            {children} {/* Render the content passed as children */}
          </main>
        </div>

        {/* Modals rendered outside the main content flow, using context values */}
        <LoginSignupModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        {/* Removed Notification and Reminder Modals - these should be handled by specific pages */}
      </div>
    </DashboardContext.Provider>
  );
}
