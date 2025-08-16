"use client"
import { createContext } from 'react';

export const DashboardContext = createContext({
  tenants: [],
  setTenants: () => {},
  properties: [],
  setProperties: () => {},
  notifications: [],
  setNotifications: () => {},
  user: null,
  setUser: () => {},
});
