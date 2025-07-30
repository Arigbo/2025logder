export default function Header() {
  const { toggleSidebarOpen, getGreeting, user, activeSection } = useContext(DashboardContext);

  return (
    <header className="header">
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
          {/* Display active section title */}
          {activeSection && <span className="header-active-section"> | {activeSection.replace(/-/g, ' ')}</span>}
        </h2>
      </div>
      <div className="header-right">
        {/* Search bar can be added here if needed */}
      </div>
    </header>
  );
}
