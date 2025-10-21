"use client";
import { useState } from "react";
import DiscoverHeader from "../component/discover/header";
import DiscoverSidebar from "../component/discover/side";

export default function DiscoverLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userStatus, setUserStatus] = useState("Guest");
  const [userAvatar, setUserAvatar] = useState(
    "https://placehold.co/40x40/cccccc/ffffff?text=U"
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <div
      className={`app-container ${
        isSidebarCollapsed ? "sidebar-collapsed-mode" : ""
      }`}
    >
      <DiscoverHeader
        isLoggedIn={isLoggedIn}
        showMobileMenu={showMobileMenu}
        userAvatar={userAvatar}
        userStatus={userStatus}
        showUserDropdown={showUserDropdown}
        setShowLoginModal={setShowLoginModal}
        setShowMobileMenu={setShowMobileMenu}
        setShowUserDropdown={setShowUserDropdown}
        setIsLoggedIn={setIsLoggedIn}
        setUserAvatar={setUserAvatar}
        setUserStatus={setUserStatus}
      />
      <DiscoverSidebar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}/>
      {children}
    </div>
  );
}
