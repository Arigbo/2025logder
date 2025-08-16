"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/component/landlord/landlordsidebar";
import Header from "@/app/component/landlord/header";
import LoginSignupModal from "@/app/component/landlord/login";
import { DashboardContext } from "@/app/component/landlord/context";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function LandlordLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const safeFetch = async (url, defaultValue = {}) => {
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
        }
        return defaultValue;
      } catch (err) {
        console.error(`Failed to fetch from ${url}`, err);
        return defaultValue;
      }
    };

    const fetchAll = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        const API_BASE_URL = process.env. NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        try {
          const [allTenants, allProperties, allNotifications, allApplications] = await Promise.all([
            safeFetch(`${API_BASE_URL}/users`, []),
            safeFetch(`${API_BASE_URL}/properties`, []),
            safeFetch(`${API_BASE_URL}/notifications`, []),
            safeFetch(`${API_BASE_URL}/applications`, []),
          ]);

          if (isMounted) {
            setTenants(allTenants.filter((t) => t.landlordId === user.id) || []);
            setProperties(allProperties.filter((p) => p.landlordId === user.id) || []);
            setNotifications(allNotifications.filter((n) => n.landlordId === user.id) || []);
            setIsLoggedIn(true);
          }
        } catch (err) {
          console.warn("API fetch failed, attempting fallback to db.json", err);
          const fallbackData = await safeFetch(`${API_BASE_URL}/db.json`, { users: [], properties: [], notifications: [], applications: [] });
          
          if (isMounted) {
            if (fallbackData.users || fallbackData.properties || fallbackData.notifications) {
              setTenants(fallbackData.users?.filter((t) => t.landlordId === user.id) || []);
              setProperties(fallbackData.properties?.filter((p) => p.landlordId === user.id) || []);
              setNotifications(fallbackData.notifications?.filter((n) => n.landlordId === user.id) || []);
              setIsLoggedIn(true);
            } else {
              setError("Failed to load data from API and fallback. Please try again.");
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLoginSuccess = (foundUser) => {
    setUser(foundUser);
    setIsModalOpen(false);
    setIsLoggedIn(true);
  };

  const closeSideBar = () => {
    setIsSideBarOpen(false);
  };

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
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
          {isLoading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {user && Object.keys(user).length > 0 && (
            <section className="dashboard-children" onClick={closeSideBar}>
              {children}
            </section>
          )}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
