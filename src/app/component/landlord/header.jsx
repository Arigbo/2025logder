
export default function Header({  setIsSideBarOpen,getGreeting, user }) {
  const toggleSidebarOpen=()=>{
    setIsSideBarOpen(true)
  }
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <button
            className="menu-button md"
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
          <h2 className="header-title">
            {getGreeting()}, {user ? user.name: "Guest"}!
          </h2>
        </div>
      </div>
    </header>
  );
}