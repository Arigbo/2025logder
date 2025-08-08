import { usePathname } from "next/navigation";
import Link from "next/link";
export default function LandlordSidebar({
  closeSideBar,
  isSidebarOpen,
  isSidebarCollapsed,
  toggleSidebarCollapse,
  user,
  isLoggedIn,
  handleUSerModal,
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
          <img src="..//favicon.ico" alt="" />
          {!isSidebarCollapsed && <span className="logo-text">Lodger</span>}
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href} // Use href for actual routing
            className={`nav-item ${item.href === pathname ? "active" : ""}`} // Determine active state based on current path
            onClick={closeSideBar}
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
        <div className="user-profile" onClick={handleUSerModal}>
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
        {!isSidebarCollapsed && (
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
            <button
              className="action-button"
              onClick={handleViewRemindersClick}
            >
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
        )}
      </div>
    </aside>
  );
}