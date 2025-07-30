"use client"; // This directive marks the component as a Client Component

import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState, useEffect, createContext } from "react";

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
          <a
            key={item.id}
            href={item.href} // Use href for actual routing
            className={`nav-item ${item.href === pathname ? "active" : ""}`} // Determine active state based on current path
            onClick={() => {}}
          >
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
          </a>
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

// --- Component to Inject Styles ---
// This component injects global CSS styles into the document head.
// It uses useEffect to ensure styles are added and cleaned up properly.
const DashboardStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --sidebar-width: 260px;
        --sidebar-width-collapsed: 80px;
        --header-height: 70px;
        --primary-color: #4f46e5; /* indigo-600 */
        --primary-color-dark: #4338ca; /* indigo-700 */
        --text-primary: #1f2937; /* gray-800 */
        --text-secondary: #6b7280; /* gray-500 */
        --bg-light: #f8fafc; /* slate-50 */
        --bg-white: #ffffff;
        --border-color: #e5e7eb; /* gray-200 */
        --red-color: #ef4444;
        --red-color-dark: #dc2626;
        --red-color-darker: #b91c1c;
        --green-color: #22c55e;
        --green-color-dark: #16a34a;
        --green-color-darker: #15803d;
        --yellow-color: #f59e0b;
        --orange-color: #f97316;
        --orange-color-dark: #ea580c;
        --blue-color: #3b82f6;
        --blue-color-light: #eff6ff;
        --blue-color-dark: #2563eb;
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
        --yellow-100: #fefce8;
        --yellow-800: #92400e;
        --blue-800: #1e40af;
        --green-100: #dcfce7;
        --green-800: #14532d;
      }
      .dashboard-layout {
        display: flex;
        width: 100%;
      }
      .sidebar {
        width: var(--sidebar-width);
        height: 100vh;
        position: sticky;
        top: 0;
        background-color: var(--bg-white);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        align-item: center;
        transition: width 0.3s ease, transform 0.3s ease;
        z-index: 100;
        gap: 1rem;
      }
      .sidebar.collapsed {
        width: var(--sidebar-width-collapsed);
      }
      /* Responsive adjustment for sidebar on small screens */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%); /* Hide sidebar by default */
          position: fixed;
          left: 0;
          bottom: 0;
        }
        .sidebar.open {
          transform: translateX(0); /* Show sidebar when 'open' class is applied */
        }

        .menu-button-mobile-only { /* Show menu button on small screens */
          display: block;
          background: none;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--header-height);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
        width: 100%;
      }
      .logo { display: flex; align-items: center; gap: 12px; font-size: 1.25rem; font-weight: 700; color: var(--primary-color); }
      .logo-icon { width: 28px; height: 28px; }
      .toggle-sidebar-button { background: none; border: none; cursor: pointer; color: var(--text-secondary);}
      .sidebar-nav { flex-grow: 1; overflow-y: auto; padding: 16px 0; }
      .nav-item { display: flex; align-items: center; padding: 12px 24px; color: var(--text-secondary); text-decoration: none; font-weight: 500; transition: background-color 0.2s, color 0.2s; }
      .nav-item:hover { background-color: var(--bg-light); color: var(--primary-color); }
      .nav-item.active { background-color: var(--primary-color); color: white; border-radius: 0 24px 24px 0; margin-right: 16px; }
      .nav-item.active .nav-icon { color: white; }
      .nav-icon { width: 24px; height: 24px; margin-right: 16px; }
      .sidebar.collapsed .nav-label, .sidebar.collapsed .logo-text { display: none; }
      .sidebar.collapsed .nav-item { justify-content: center; }
      .sidebar.collapsed .nav-icon { margin-right: 0; }
      .sidebar-footer {
       border-top: 1px solid var(--border-color);
        display: flex;
       align-items: center; 
      justify-content: center;
       height: 4rem;
        }
      .user-profile { display: flex; align-items: center; gap: 12px; border-radius: 8px; cursor: pointer; transition: background-color 0.2s; }
      .user-profile:hover { background-color: var(--bg-light); }
      .user-avatar { width: 2rem; height: 2rem; border-radius: 50%; background-color: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
      .user-info { line-height: 1.2; }
      .user-name { font-weight: 600; }
      .user-status { font-size: 0.8rem; color: var(--text-secondary); }
      .sidebar.collapsed .user-info { display: none; }
      .sidebar-actions { display: flex; justify-content: space-around; margin-top: 16px; }
      .action-button { background: none; border: none; cursor: pointer; color: var(--text-secondary); position: relative; padding: 8px; }
      .notification-badge, .reminder-dot { position: absolute; top: 4px; right: 4px; background-color: var(--red-color); color: white; border-radius: 50%; font-size: 0.7rem; text-align: center; }
      .notification-badge { width: 18px; height: 18px; line-height: 18px; }
      .reminder-dot { width: 8px; height: 8px; }
      .main-content {
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
        transition:  0.3s ease;
      }

      .header {
        height: var(--header-height);
        background-color: var(--bg-white);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
      }
      .header-title { 
      font-size: 1.25rem;
       font-weight: 600;
        display: flex; 
        align-items: center;
        } 
.header-inner{
width: 95%;
display: flex;
align-items: center;
}
.header-left{
display: flex;
align-items: center;
justify-content: space-between;
gap: 1rem;
width: 100%;
}
      .content-area {
      width: 100%;
padding-block-start: 1rem;
display: flex;
flex-direction: column;
align-items: center;
      }
      .content-area-inner {
      width: 100%;
display: flex;
flex-direction: column;
align-items: center;
      }
.overview-section{

}
      /* Modals & Messages */
      .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; transition: opacity 0.3s; }
      .modal-overlay.show { opacity: 1; }
      .modal-content { 
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: white; 
      border-radius: 8px; 
      padding: 24px; width: 80%; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
      .modal-body{
      width: 100%;
      }
      .modal-header {width: 100%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px; }
      .modal-title { width: 100%; font-size: 1.25rem; font-weight: 600; }
      .modal-close-button { background: none; border: none; cursor: pointer; color: var(--text-secondary); }
      .lucide-x-icon { width: 24px; height: 24px; }

      .message-box { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 8px; color: white; z-index: 2000; opacity: 0; transform: translateY(-20px); transition: opacity 0.3s, transform 0.3s; }
      .message-box.show { opacity: 1; transform: translateY(0); }
      .message-box.success { background-color: var(--green-color); }
      .message-box.error { background-color: var(--red-color); }
      .message-box.info { background-color: var(--blue-color); }

      /* Form Elements */
      form{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      }
      form div{
          display: flex;
      flex-direction: column;
      align-items: center;
       width: 100%;
      }
        form div div{
                  display: flex;
      flex-direction: column;
      align-items: center;
             width: 100%;
        }
      .form-spacing { margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;  width: 100%;}
      .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--gray-700); width: 100%;}
      input { margin-top: 0.25rem; display: flex; align-items: center; justify-content: center; width: 100%; padding: 0.5rem 0.2rem; border: 1px solid var(--gray-300); border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); outline: none; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
      .form-input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25); }
      .form-error-message { color: var(--red-color); font-size: 0.875rem; text-align: center; }
      .button-primary { width: 100%; display: flex; justify-content: center; padding: 0.5rem 1rem; border: 1px solid transparent; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; font-weight: 500; color: white; background-color: var(--primary-color); cursor: pointer; transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
      .button-primary:hover { background-color: var(--primary-color-dark); }
      .button-full-width { width: 100%; }
      .form-footer-text { margin-top: 1rem; text-align: center; }
      .text-button { font-size: 0.875rem; color: var(--primary-color); background: none; border: none; cursor: pointer; padding: 0; }
      .text-button:hover { color: var(--primary-color-dark); }
      @media (min-width: 769px) {
        .menu-button-mobile-only { /* Hide menu button on larger screens */
          display: none;
        }
          .modal-content{
          width: 40%;
          }
      }
      /* General Layout & Component Styling */
      .section-title { 
      width: 100%;
      font-size: 1.875rem; 
      font-weight: 700; 
      margin-bottom: 1.5rem; 
      color: var(--gray-800);
       }
      .card-flex{
      display: flex;
      align-items: center;
      overflow: auto;
      width: 100%;
      }
      .card-flex-inner{
          display: flex;
      align-items: center;
      width: fit-content;
      gap: 1rem;
      }
      .card-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
      @media (min-width: 768px) { /* md */
        .card-grid.md-cols-2 { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 1024px) { /* lg */
        .card-grid.lg-cols-4 { grid-template-columns: repeat(4, 1fr); }
        .card-grid.lg-cols-2 { grid-template-columns: repeat(2, 1fr); }
      }
      .card { 
      background-color: var(--bg-white); 
      padding: 1.5rem; 
      border-radius: 0.5rem; 
      border: 1px solid rgba(0, 0, 0, 0.1); 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      gap: 1rem; 
      width: 16rem; 
      height: 5rem;
      }
      .card-title { 
      font-size: 1.125rem; 
      font-weight: 600; 
      color: var(--gray-600); 
      }
      .card-value { 
      font-size: 2.25rem; 
      font-weight: 700; 
      color: var(--primary-color); 
      margin-top: 0.25rem; 
      }
      .card-icon { 
      height: 2.5rem; 
      width: 2.5rem; 
      color: var(--primary-color-dark); 
      opacity: 0.2; 
      }
      .card-value.red { 
      color: var(--red-color); 
      }
      .card-value.yellow { 
      color: var(--yellow-color); 
      }

      .financial-summary { width: 100%; background-color: var(--bg-white); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0, 0, 0, 0.1); }
      .financial-summary-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--gray-700); }
      .financial-item-list { display: flex; flex-direction: column; gap: 0.75rem; }
      .financial-item { display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--gray-100); }
      .financial-item-label { color: var(--gray-600); }
      .financial-item-value { font-weight: 700; }
      .financial-item-value.green { color: var(--green-color-dark); }
      .financial-item-value.red { color: var(--red-color-dark); }
      .financial-total-item { display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; }
      .financial-total-label { color: var(--gray-700); font-weight: 600; }
      .financial-total-value { font-size: 1.25rem; font-weight: 700; }
      .financial-total-value.green { color: var(--green-color-darker); }
      .financial-total-value.red { color: var(--red-color-darker); }

      .chart-card { width: 100%; background-color: var(--bg-white); padding: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(0, 0, 0, 0.1); }
      .chart-card-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--gray-700); }
      .chart-controls { display: flex; justify-content: flex-end; gap: 0.5rem; margin-bottom: 1rem; }
      .chart-control-button { padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; background-color: var(--gray-100); color: var(--gray-700); cursor: pointer; transition: background-color 0.15s ease-in-out; }
      .chart-control-button:hover { background-color: var(--gray-200); }
      .chart-control-button.active { background-color: var(--primary-color); color: white; }
      .chart-container { position: relative; height: 300px; width: 100%; }

      .quick-actions { background-color: var(--bg-white); padding: 1.5rem; border-radius: 0.5rem; box-shadow: 1px solid rgba(0, 0, 0, 0.1); margin-bottom: 2rem; }
      .quick-actions-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--gray-700); }
      .quick-actions-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
      @media (min-width: 640px) { /* sm */
        .quick-actions-grid.sm-cols-2 { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 768px) { /* md */
        .quick-actions-grid.md-cols-3 { grid-template-columns: repeat(3, 1fr); }
      }
      @media (min-width: 1024px) { /* lg */
        .quick-actions-grid.lg-cols-4 { grid-template-columns: repeat(4, 1fr); }
      }
      .action-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; background-color: var(--primary-color); color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); cursor: pointer; transition: background-color 0.15s ease-in-out; }
      .action-card:hover { background-color: var(--primary-color-dark); }
      .action-card-icon { height: 2rem; width: 2rem; margin-bottom: 0.5rem; }
      .action-card-text { font-size: 0.875rem; font-weight: 500; }
      .action-card.green { background-color: var(--green-color); }
      .action-card.green:hover { background-color: var(--green-color-dark); }
      .action-card.orange { background-color: var(--orange-color); }
      .action-card.orange:hover { background-color: var(--orange-color-dark); }
      .action-card.blue { background-color: var(--blue-color); }
      .action-card.blue:hover { background-color: var(--blue-color-dark); }

      .activity-feed { background-color: var(--bg-white); padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 2rem; }
      .activity-feed-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--gray-700); }
      .activity-list { border-top: 1px solid var(--gray-200); } /* Replaces divide-y */
      .activity-list li { padding-top: 0.75rem; padding-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
      .activity-list li + li { border-top: 1px solid var(--gray-200); } /* Add border between items */
      .activity-type { font-weight: 500; color: var(--gray-800); }
      .activity-description { font-size: 0.875rem; color: var(--gray-600); }
      .activity-date { font-size: 0.75rem; color: var(--gray-500); }
      .view-all-button-container { text-align: right; margin-top: 1rem; }
      .view-all-button { color: var(--primary-color); transition: color 0.15s ease-in-out; font-size: 0.875rem; font-weight: 500; background: none; border: none; cursor: pointer; }
      .view-all-button:hover { color: var(--primary-color-dark); }

      .lease-expirations { background-color: var(--bg-white); padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .lease-expirations-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--gray-700); }
      .lease-list { border-top: 1px solid var(--gray-200); } /* Replaces divide-y */
      .lease-list li { padding-top: 0.75rem; padding-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
      .lease-list li + li { border-top: 1px solid var(--gray-200); } /* Add border between items */
      .lease-tenant-info { font-weight: 500; color: var(--gray-800); }
      .lease-property-name { font-size: 0.875rem; color: var(--gray-600); }
      .lease-due-date { font-size: 0.875rem; color: var(--gray-600); }
      .lease-contact-button { color: var(--primary-color); transition: color 0.15s ease-in-out; font-size: 0.875rem; font-weight: 500; background: none; border: none; cursor: pointer; }
      .lease-contact-button:hover { color: var(--primary-color-dark); }
      .no-data-message { color: var(--gray-500); }

      /* Section Specific Styles */
      .section-container { padding: 1.5rem; }
      .section-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
      .section-description { color: var(--gray-700); margin-bottom: 1.5rem; }
      .section-grid { margin-top: 1rem; display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
      @media (min-width: 768px) { /* md */
        .section-grid.md-cols-2 { grid-template-columns: repeat(2, 1fr); }
      }



      /* Utility classes for spacing and text */
      .padding-6 { padding: 1.5rem; }
      .margin-bottom-6 { margin-bottom: 1.5rem; }
      .margin-bottom-8 { margin-bottom: 2rem; }
      .margin-top-1 { margin-top: 0.25rem; }
      .margin-top-4 { margin-top: 1rem; }
      .text-size-2xl { font-size: 1.5rem; }
      .text-size-3xl { font-size: 1.875rem; }
      .text-size-4xl { font-size: 2.25rem; }
      .font-bold { font-weight: 700; }
      .font-extrabold { font-weight: 800; }
      .font-semibold { font-weight: 600; }
      .text-gray-800 { color: var(--gray-800); }
      .text-gray-700 { color: var(--gray-700); }
      .text-gray-600 { color: var(--gray-600); }
      .text-gray-500 { color: var(--gray-500); }
      .text-red-500 { color: var(--red-color); }
      .text-red-600 { color: var(--red-color-dark); }
      .text-red-700 { color: var(--red-color-darker); }
      .text-green-500 { color: var(--green-color); }
      .text-green-600 { color: var(--green-color-dark); }
      .text-green-700 { color: var(--green-color-darker); }
      .text-yellow-500 { color: var(--yellow-color); }
      .background-white { background-color: var(--bg-white); }
      .background-gray-50 { background-color: var(--gray-50); }
      .background-blue-50 { background-color: var(--blue-color-light); }
      .rounded-lg { border-radius: 0.5rem; }
      .rounded-md { border-radius: 0.375rem; }
      .rounded-full { border-radius: 9999px; }
      .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
      .flex-display { display: flex; }
      .align-items-center { align-items: center; }
      .justify-content-between { justify-content: space-between; }
      .justify-content-center { justify-content: center; }
      .justify-content-end { justify-content: flex-end; }
      .flex-direction-column { flex-direction: column; }
      .border-style { border-width: 1px; border-style: solid; }
      .border-bottom { border-bottom-width: 1px; border-bottom-style: solid; }
      .border-color-gray-100 { border-color: var(--gray-100); }
      .border-color-gray-300 { border-color: var(--gray-300); }
      .cursor-pointer { cursor: pointer; }
      .transition-colors { transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; transition-duration: 150ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
      .margin-left-2 { margin-left: 0.5rem; }
      .margin-top-1 { margin-top: 0.25rem; }
      .text-size-sm { font-size: 0.875rem; }
      .text-size-xs { font-size: 0.75rem; }
      .capitalize-text { text-transform: capitalize; }
      .display-block { display: block; }
      .display-none { display: none; }
      .position-relative { position: relative; }
      .position-absolute { position: absolute; }
      .top-4 { top: 1rem; }
      .right-4 { right: 1rem; }
      .list-disc-style { list-style-type: disc; }
      .list-inside-position { list-style-position: inside; }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style tag when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return null; // This component doesn't render any visible JSX
};

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
        <DashboardStyles />
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
