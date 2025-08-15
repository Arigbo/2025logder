"use client";
import React, { useState, useEffect, createContext } from "react";
import Sidebar from "@/app/component/landlord/landlordsidebar";
import Header from "@/app/component/landlord/header";
import LoginSignupModal from "@/app/component/landlord/login";

export const DashboardContext = createContext({
  properties: [],
  tenants: [],
  notifications: [],
  user: [],
  setProperties: () => {},
  setTenants: () => {},
  setNotifications: () => {},
  setUser: () => {},
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState();

  useEffect(() => {
    const safeFetch = async (url, defaultValue = []) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) return defaultValue;
          throw new Error(
            `Failed to fetch from ${url}: ${res.status} ${res.statusText}`
          );
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        } else {
          return defaultValue;
        }
      } catch (err) {
        console.error(`Failed to fetch from ${url}`, err);
        return defaultValue;
      }
    };

    const fetchAll = async () => {
      const landlord = await safeFetch("http://localhost:3000/landlords", {});
      setUser(landlord);

      if (landlord && landlord.id) {
        const [allTenants, allProperties, allNotifications] = await Promise.all(
          [
            safeFetch("http://localhost:3000/users", []),
            safeFetch("http://localhost:3000/properties", []),
            safeFetch("http://localhost:3000/notifications", []),
          ]
        );
        setTenants(allTenants.filter((t) => t.landlordId === landlord.id));
        setProperties(
          allProperties.filter((p) => p.landlordId === landlord.id)
        );
        setNotifications(
          allNotifications.filter((n) => n.landlordId === landlord.id)
        );
      } else {
        setTenants([]);
        setProperties([]);
        setNotifications([]);
        setIsModalOpen(true); // Open modal if no user
      }
    };

    fetchAll();
  }, []);

  const handleLoginSuccess = (foundUser) => {
    setUser(foundUser);
    setIsModalOpen(false);
    setIsLoggedIn(true);
  };
  const   closeSideBar=()=>{
    setIsSideBarOpen(false)
  }
  return (
    <DashboardContext.Provider
      value={{
        tenants,
        setTenants,
        properties,
        setProperties,
        notifications,
        setNotifications,
        user,
        setUser,
      }}
    >
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          isLoggedIn={isLoggedIn}
          isSideBarOpen={isSideBarOpen}
      closeSideBar={closeSideBar}
        />
        <main className="main-content">
          <Header
            getGreeting={getGreeting}
            user={user}
            setIsSideBarOpen={setIsSideBarOpen}
          />
          <LoginSignupModal
            isOpen={isModalOpen}
            onClose={() => {
              isModalOpen;
            }}
            onLoginSuccess={handleLoginSuccess}
          />
          {user && Object.keys(user).length > 0 && (
            <section className="dashboard-children" onClick={closeSideBar}>
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child, { user })
                  : child
              )}
            </section>
          )}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
