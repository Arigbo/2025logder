"use client"
import { usePathname } from "next/navigation";

export default function DiscoverSidebar({isSidebarCollapsed, setIsSidebarCollapsed}) {
  const navLink = [
    {
      name: "Home",
      link: "/discover",
      icon: "🔍",
    },
    {},
  ];
  const path = usePathname();
  return (
    <aside className="app-sidebar">
      <a href="#" className="navbar-brand">
     <img src="/favicon.ico" alt="" />
        <span className="link-text">Lodger</span>
      </a>
      <div className="nav-links">
        {navLink.map((link) => {
          return (
            <a
              href={link.link}
              className={`nav-link ${path === link.link ? "active" : ""}`}
            >
              <span className="icon">{link.icon}</span>{" "}
              <span className="link-text">{link.name}</span>
            </a>
          );
        })}
      </div>
      <button
        className="sidebar-toggle-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <svg
          className="icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5L16 12L9 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  );
}
//   <a
//   href="#"
//   className={`nav-link ${currentPage === "bookmarks" ? "active" : ""}`}
//   onClick={() => {
//     setCurrentPage("bookmarks");
//   }}
// >
//   <span className="icon">⭐</span>{" "}
//   <span className="link-text">Bookmarks</span>
// </a>
// <a
//   href="#"
//   className={`nav-link ${
//     currentPage === "saved-searches" ? "active" : ""
//   }`}
//   onClick={() => {
//     setCurrentPage("saved-searches");
//   }}
// >
//   <span className="icon">💾</span>{" "}
//   <span className="link-text">Saved Searches</span>
// </a>
// <a
//   href="#"
//   className={`nav-link ${currentPage === "profile" ? "active" : ""}`}
//   onClick={() => {
//     setCurrentPage("profile");
//   }}
// >
//   <span className="icon">👤</span>{" "}
//   <span className="link-text">Profile</span>
// </a>
// <a
//   href="#"
//   className={`nav-link ${currentPage === "dashboard" ? "active" : ""}`}
//   onClick={() => {
//     setCurrentPage("dashboard");
//   }}
// >
//   <span className="icon">📊</span>{" "}
//   <span className="link-text">Dashboard</span>
// </a>
// <a href="#" className="nav-link">
//   <span className="icon">ℹ️</span>{" "}
//   <span className="link-text">About Us</span>
// </a>
// <a href="#" className="nav-link">
//   <span className="icon">📞</span>{" "}
//   <span className="link-text">Contact</span>
// </a>
