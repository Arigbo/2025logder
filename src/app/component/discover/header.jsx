export default function DiscoverHeader({
  isLoggedIn,
  userStatus,
  userAvatar,
  showUserDropdown,
  setShowUserDropdown,
  toggleTheme,
  theme,
  showMobileMenu,
  setShowMobileMenu,
  setIsLoggedIn,
  setLoggedInUser,
  setShowLoginModal,
  setUserAvatar,
  setUserStatus,
}) {
  return (
    <header className="responsive-header">
      {/* Mobile-only elements (visible on mobile and tablet) */}
      <div
        className="hamburger-menu mobile-only"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <h1 className="app-header-title mobile-only">Discover Apartments</h1>

      {/* Desktop-only header content (e.g., centered title) */}
      <div className="desktop-header-content">
        <h1 className="app-header-title">Discover Apartments</h1>
      </div>

      {/* User status (always present, but its container's flex behavior changes) */}
      <div
        className="nav-user-status"
        onClick={() => setShowUserDropdown(!showUserDropdown)}
 
      >
        <img src={userAvatar} alt="User Avatar" />
        <span>{userStatus}</span>
        <div className={`user-dropdown ${showUserDropdown ? "show" : ""}`}>
          {isLoggedIn ? (
            <>
              <a
                href="#"
                className="user-dropdown-item"
                onClick={() => {
                  setShowUserDropdown(false);
                }}
              >
                Profile
              </a>
              <a
                href="#"
                className="user-dropdown-item"
                onClick={() => {
                  setShowUserDropdown(false);
                }}
              >
                Dashboard
              </a>
              <a
                href="#"
                className="user-dropdown-item"
                onClick={() => {
                  setShowUserDropdown(false);
                }}
              >
                Saved Searches
              </a>{" "}
              {/* New Link */}
              <button
                className="user-dropdown-item theme-toggle-button"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <>
                    <svg
                      className="theme-icon light-mode"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM20 12H22V10H20V12ZM2 12H4V10H2V12ZM11 2V4H13V2H11ZM11 20V22H13V20H11ZM18.364 5.63604L19.7782 4.22183L21.1924 5.63604L19.7782 7.05025L18.364 5.63604ZM4.22183 19.7782L5.63604 21.1924L7.05025 19.7782L5.63604 18.364L4.22183 19.7782ZM18.364 18.364L19.7782 19.7782L21.1924 18.364L19.7782 16.9497L18.364 18.364ZM4.22183 4.22183L5.63604 5.63604L7.05025 4.22183L5.63604 2.80762L4.22183 4.22183Z" />
                    </svg>
                    <span>Switch to Dark Mode</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="theme-icon dark-mode"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 15C15.866 15 19 18.134 19 22H5C5 18.134 8.13401 15 12 15ZM12 17C9.23858 17 7 19.2386 7 22H17C17 19.2386 14.7614 17 12 17Z" />
                    </svg>
                    <span>Switch to Light Mode</span>
                  </>
                )}
              </button>
              <button
                className="user-dropdown-item"
                onClick={() => {
                  setIsLoggedIn(false);
                  setLoggedInUser(null);
                  setUserStatus("Guest");
                  setUserAvatar(
                    "https://placehold.co/40x40/cccccc/ffffff?text=U"
                  );
                  localStorage.removeItem("lodgerLoggedInUser");
                  setShowUserDropdown(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="user-dropdown-item"
              onClick={() => {
                setShowLoginModal(true);
                setShowUserDropdown(false);
              }}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
