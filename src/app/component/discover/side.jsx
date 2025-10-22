"use client";
import { usePathname } from "next/navigation";


export default function DiscoverSidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setSidebar, sidebar
}) {
  const navLink = [
    {
      name: "Home",
      link: "/discover",
      icon: "fas fa-home",
    },
    {
      name: "Bookmark",
      link: "/bookmark",
      icon: "fas fa-bookmark",
    },
    {
      name: "Bookmark",
      link: "/bookmark",
      icon: "fas fa-bookmark",
    },
    {
      name: "Bookmark",
      link: "/bookmark",
      icon: "fas fa-bookmark",
    },
    {
      name: "Bookmark",
      link: "/bookmark",
      icon: "fas fa-bookmark",
    },
  ];
  const path = usePathname();
  return (
    <aside className={`app-sidebar ${sidebar ? "close" : ""}`}>
      <div className="navbar-brand">
        <div className="logo-icon">
          <img src="/favicon.ico" alt="" />
          <span className="link-text">Lodger</span>
        </div>
        <i className="fas fa-x" onClick={() => setSidebar(true)}></i>
      </div>
      <div className="nav-links">
        {navLink.map((link) => {
          return (
            <a
              key={link.name}
              href={link.link}
              className={`nav-link ${path === link.link ? "active" : ""}`}
            >
              <i className={link.icon}></i>
              <span className="link-text">{link.name}</span>
            </a>
          );
        })}
      </div>
      <div className="toogle-container">
        {isSidebarCollapsed ? (
          <i
            className="fas fa-chevron-right toogle"
            onClick={() => setIsSidebarCollapsed(false)}
          ></i>
        ) : (
          <i
            className="fas fa-chevron-left toogle"
            onClick={() => setIsSidebarCollapsed(true)}
          ></i>
        )}
      </div>
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
