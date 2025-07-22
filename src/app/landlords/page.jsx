// src/app/page.jsx
// This is the main application component, now focused solely on the Dashboard Overview.
// It uses in-memory state for mock data, with no Firebase integration.
// All components and styling are defined within this single file, using pure CSS.
"use client"; // This directive marks the component as a Client Component

import React, { useState, useEffect } from 'react';
// Note: In a full Next.js application, you would import useRouter like this:
// import { useRouter } from 'next/navigation';
// For this single-file Canvas environment, we'll simulate navigation using window.location.href.

// Load jsPDF and jspdf-autotable for PDF generation
// These scripts are loaded globally. In a real Next.js app, you'd use npm packages.
// For Canvas, this is a common way to include external JS libraries.
if (typeof window !== 'undefined' && !window.jspdf) {
    const scriptPdf = document.createElement('script');
    scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    scriptPdf.onload = () => {
        const scriptAutoTable = document.createElement('script');
        scriptAutoTable.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
        document.head.appendChild(scriptAutoTable);
    };
    document.head.appendChild(scriptPdf);
}


// --- Message Box Component (for notifications) ---
function MessageBox({ message, type }) {
    if (!message) return null;
    return (
        <div className={`message-box show ${type}`}>
            {message}
        </div>
    );
}

// --- Modal Component ---
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className={isOpen ? "modal-overlay show" : "modal-overlay"} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// --- Notification Details Modal Component ---
function NotificationDetailsModal({ isOpen, onClose, notification }) {
    if (!isOpen || !notification) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notification Details">
            <div className="notification-detail-content">
                <p><strong>Date:</strong> {notification.date}</p>
                <p><strong>Message:</strong> {notification.message}</p>
                <p><strong>Status:</strong> {notification.read ? 'Read' : 'Unread'}</p>
            </div>
        </Modal>
    );
}

// --- Login/Signup Modal Component (Simulated) ---
function LoginSignupModal({ isOpen, onClose, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        if (isLogin) {
            // Simulated login logic
            if (email === 'demo@example.com' && password === 'password') {
                onLoginSuccess({ email, uid: 'simulated-user-id' });
                onClose();
            } else {
                setMessage('Invalid email or password. Try demo@example.com / password');
            }
        } else {
            // Simulated signup logic
            if (email && password) {
                // In a real app, you'd create a new user here.
                // For simulation, we'll just "sign up" and then "log in"
                onLoginSuccess({ email, uid: `simulated-user-${Date.now()}` });
                onClose();
            } else {
                setMessage('Please enter a valid email and password.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay show" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isLogin ? 'Login' : 'Sign Up'}</h3>
                    <button className="modal-close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {message && <p className="text-red-500 text-sm text-center">{message}</p>}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function App() {
    // In a real Next.js app: const router = useRouter();
    // For Canvas, we'll simulate navigation using window.location.href.

    // User and authentication are simulated as there's no Firebase Auth
    const [user, setUser] = useState(null); // Initially null, meaning not logged in
    const [userId, setUserId] = useState('not-logged-in');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

    // The dashboard will now support multiple sections, but all within 'overview'
    const [activeSection, setActiveSection] = useState('overview'); // Still 'overview' as the only main section
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    // State for mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Notification and Reminders Modal states
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // New state for login modal
    const [isNotificationDetailsModalOpen, setIsNotificationDetailsModalOpen] = useState(false); // New state for notification details modal
    const [selectedNotification, setSelectedNotification] = useState(null); // State to hold selected notification

    const [hasNewNotifications, setHasNewNotifications] = useState(true); // Simulate new notifications
    const [notificationsCount, setNotificationsCount] = useState(3); // Simulate 3 unread notifications

    // Mock notification data
    const [notifications, setNotifications] = useState([
        { id: 'notif1', message: 'Rent payment received from Alice Smith for Grand House.', date: '2025-07-20', read: false },
        { id: 'notif2', message: 'New maintenance request: Leaky Faucet in City Lodge.', date: '2025-07-20', read: false },
        { id: 'notif3', message: 'Lease for Student Annex expires in 5 days.', date: '2025-07-20', read: false },
        { id: 'notif4', message: 'Property inspection scheduled for Garden Villa on 2025-07-25.', date: '2025-07-19', read: true },
        { id: 'notif5', message: 'Tenant Bob Johnson updated contact info.', date: '2025-07-18', read: true },
    ]);


    // In-memory data storage for mock metrics and lists
    const [properties, setProperties] = useState([
        { id: 'p1', name: 'Grand House', location: 'Lagos, Nigeria', totalRooms: 5, rentPerRoom: 50000, leaseEndDate: '2025-09-30' },
        { id: 'p2', name: 'City Lodge', location: 'Abuja, Nigeria', totalRooms: 3, rentPerRoom: 65000, leaseEndDate: '2025-08-15' },
        { id: 'p3', name: 'Student Annex', location: 'Port Harcourt, Nigeria', totalRooms: 8, rentPerRoom: 35000, leaseEndDate: '2025-07-25' },
        { id: 'p4', name: 'Riverside Duplex', location: 'Port Harcourt, Nigeria', totalRooms: 2, rentPerRoom: 100000, leaseEndDate: '' }, // Vacant
        { id: 'p5', name: 'Garden Villa', location: 'Enugu, Nigeria', totalRooms: 4, rentPerRoom: 75000, leaseEndDate: '2026-01-10' },
    ]);

    const [tenants, setTenants] = useState([
        { id: 't1', name: 'Alice Smith', email: 'alice@example.com', phone: '123-456-7890', propertyId: 'p1', roomNumber: 'Room 101', rentDue: 50000, overdue: false, nextRentDueDate: '2025-08-01' },
        { id: 't2', name: 'Bob Johnson', email: 'bob@example.com', phone: '098-765-4321', propertyId: 'p1', roomNumber: 'Room 102', rentDue: 50000, overdue: false, nextRentDueDate: '2025-08-01' },
        { id: 't3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-123-4567', propertyId: 'p2', roomNumber: 'Room 1', rentDue: 65000, overdue: true, nextRentDueDate: '2025-07-01' }, // Overdue rent
        { id: 't4', name: 'Diana Prince', email: 'diana@example.com', phone: '111-222-0000', propertyId: 'p3', roomNumber: 'Room 5', rentDue: 35000, overdue: false, nextRentDueDate: '2025-08-01' },
        { id: 't5', name: 'Eve Adams', email: 'eve@example.com', phone: '999-888-7777', propertyId: 'p5', roomNumber: 'Room 2', rentDue: 75000, overdue: false, nextRentDueDate: '2025-09-01' },
        { id: 't6', name: 'Frank White', email: 'frank@example.com', phone: '111-333-5555', propertyId: 'p5', roomNumber: 'Room 3', rentDue: 75000, overdue: true, nextRentDueDate: '2025-07-01' }, // Overdue rent
    ]);

    const [maintenanceRequests, setMaintenanceRequests] = useState([
        { id: 'm1', title: 'Leaky Faucet', description: 'Faucet in kitchen is constantly dripping.', propertyId: 'p1', roomNumber: 'Kitchen', reportedBy: 'Alice Smith', status: 'New', date: '2025-07-18' },
        { id: 'm2', title: 'AC Not Cooling', description: 'Air conditioning unit not blowing cold air.', propertyId: 'p2', roomNumber: 'Room 1', reportedBy: 'Charlie Brown', status: 'In Progress', date: '2025-07-10' },
        { id: 'm3', title: 'Broken Window', description: 'Small crack in the window pane.', propertyId: 'p3', roomNumber: 'Room 5', reportedBy: 'Diana Prince', status: 'New', date: '2025-07-20' },
        { id: 'm4', title: 'Light Fixture Fault', description: 'Bathroom light not working.', propertyId: 'p5', roomNumber: 'Bathroom', reportedBy: 'Eve Adams', status: 'Completed', date: '2025-07-05' },
    ]);

    // Mock financial data (can be expanded with more detailed transactions)
    const [financials, setFinancials] = useState({
        monthlyIncome: 0, // Will be calculated
        monthlyExpenses: 450000, // Mock fixed expenses
    });

    // Mock recent activity feed
    const [recentActivities, setRecentActivities] = useState([
        { id: 'a1', type: 'rent_paid', description: 'Alice Smith paid rent for Grand House (Room 101).', date: '2025-07-20' },
        { id: 'a2', type: 'maintenance', description: 'New maintenance request for Student Annex (Room 5 - Broken window).', date: '2025-07-20' },
        { id: 'a3', type: 'lease_renewal', description: 'Lease for Student Annex (Property p3) expiring soon.', date: '2025-07-19' },
        { id: 'a4', type: 'rent_overdue', description: 'Rent overdue for Charlie Brown (City Lodge, Room 1).', date: '2025-07-18' },
        { id: 'a5', type: 'maintenance_completed', description: 'Maintenance completed for Garden Villa (Bathroom - Light fixture).', date: '2025-07-15' },
        { id: 'a6', type: 'rent_paid', description: 'Bob Johnson paid rent for Grand House (Room 102).', date: '2025-07-14' },
        { id: 'a7', type: 'maintenance', description: 'AC not cooling in City Lodge (Room 1) is in progress.', date: '2025-07-12' },
        { id: 'a8', type: 'rent_overdue', description: 'Rent overdue for Frank White (Garden Villa, Room 3).', date: '2025-07-11' },
    ]);

    // Mock communication log
    const [communicationLog, setCommunicationLog] = useState([
        { id: 'c1', tenant: 'Alice Smith', subject: 'Rent Confirmation', date: '2025-07-20', snippet: 'Confirmed receipt of July rent payment.' },
        { id: 'c2', tenant: 'Charlie Brown', subject: 'Overdue Rent Reminder', date: '2025-07-18', snippet: 'Sent automated reminder for overdue rent.' },
        { id: 'c3', tenant: 'Diana Prince', subject: 'Maintenance Update', date: '2025-07-20', snippet: 'Acknowledged broken window request.' },
        { id: 'c4', tenant: 'Eve Adams', subject: 'Lease Renewal Inquiry', date: '2025-07-10', snippet: 'Received inquiry about lease renewal terms.' },
    ]);

    // Mock property performance data (simplified for demonstration)
    const [propertyPerformance, setPropertyPerformance] = useState([
        { id: 'pp1', propertyName: 'Grand House', occupancy: '100%', maintenanceCost: '₦5,000', rating: 4.8 },
        { id: 'pp2', propertyName: 'City Lodge', occupancy: '66%', maintenanceCost: '₦15,000', rating: 3.5 },
        { id: 'pp3', propertyName: 'Garden Villa', occupancy: '75%', maintenanceCost: '₦2,000', rating: 4.5 },
        { id: 'pp4', propertyName: 'Riverside Duplex', occupancy: '0%', maintenanceCost: '₦0', rating: 0 },
        { id: 'pp5', propertyName: 'Student Annex', occupancy: '87%', maintenanceCost: '₦8,000', rating: 4.0 },
    ]);

    // Function to display messages (like a toast)
    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => { setMessage(''); }, 3000);
    };

    // Navigation handler - simplified to only 'overview' for this dashboard
    const handleNavigation = (sectionId) => {
        setActiveSection(sectionId);
        window.history.pushState(null, '', `#${sectionId}`);
        setIsSidebarOpen(false); // Close sidebar on navigation for mobile
    };

    // Handle initial load hash and browser back/forward buttons
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1) || 'overview';
            setActiveSection(hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Call once on mount for initial hash
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Dashboard metrics calculations based on mock data
    const totalProperties = properties.length;
    const totalRoomsAvailable = properties.reduce((sum, p) => sum + p.totalRooms, 0);
    const occupiedRooms = tenants.length; // Each tenant occupies one room
    const vacantRooms = totalRoomsAvailable - occupiedRooms;
    const averageRentPerRoom = totalRoomsAvailable > 0
        ? (properties.reduce((sum, p) => sum + (p.rentPerRoom * p.totalRooms), 0) / totalRoomsAvailable).toLocaleString(undefined, { maximumFractionDigits: 0 })
        : 'N/A';

    const totalTenants = tenants.length; // Same as occupiedRooms
    const occupancyRate = totalRoomsAvailable > 0 ? ((occupiedRooms / totalRoomsAvailable) * 100).toFixed(1) : '0.0';

    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const upcomingLeaseRenewalsCount = properties.filter(prop => {
        if (!prop.leaseEndDate) return false;
        const leaseDate = new Date(prop.leaseEndDate);
        return leaseDate >= today && leaseDate <= threeMonthsFromNow;
    }).length;

    const overdueRentAmount = tenants.reduce((sum, tenant) => {
        return sum + (tenant.overdue ? tenant.rentDue : 0);
    }, 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
    const overdueRentTenantsCount = tenants.filter(tenant => tenant.overdue).length;


    const pendingMaintenanceRequests = maintenanceRequests.filter(req => req.status !== 'Completed').length;

    const projectedMonthlyIncome = tenants.reduce((sum, tenant) => sum + tenant.rentDue, 0);
    const netOperatingIncome = projectedMonthlyIncome - financials.monthlyExpenses;

    // Key Metrics for the new first section
    const keyMetrics = [
        { id: 'totalProperties', title: 'Total Properties', value: totalProperties, type: 'info', icon: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>) },
        { id: 'occupancyRate', title: 'Occupancy Rate', value: `${occupancyRate}%`, type: 'info', icon: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8L11 2m9 10a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>) },
        { id: 'projectedIncome', title: 'Projected Income', value: `₦${projectedMonthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, type: 'success', icon: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>) },
        { id: 'vacantRooms', title: 'Vacant Rooms', value: vacantRooms, type: 'warning', icon: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v6"></path></svg>) },
    ];


    // Recent activities are always displayed, but the "See More" button navigates
    const displayedActivities = recentActivities.slice(0, 5); // Always show top 5

    // Filter for upcoming reminders/tasks
    const upcomingReminders = [
        ...properties.filter(prop => {
            if (!prop.leaseEndDate) return false;
            const leaseDate = new Date(prop.leaseEndDate);
            return leaseDate >= today && leaseDate <= threeMonthsFromNow;
        }).map(prop => ({
            id: `lease-${prop.id}`,
            type: 'lease_renewal',
            description: `Lease for ${prop.name} expiring on ${prop.leaseEndDate}.`,
            date: prop.leaseEndDate
        })),
        ...tenants.filter(tenant => {
            if (!tenant.nextRentDueDate || tenant.overdue) return false; // Exclude overdue, focus on upcoming
            const dueDate = new Date(tenant.nextRentDueDate);
            // Consider rent due in the next 30 days as upcoming
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            return dueDate >= today && dueDate <= thirtyDaysFromNow;
        }).map(tenant => ({
            id: `rent-${tenant.id}`,
            type: 'rent_due',
            description: `Rent of ₦${tenant.rentDue.toLocaleString()} due for ${tenant.name} (${properties.find(p => p.id === tenant.propertyId)?.name}, ${tenant.roomNumber}) on ${tenant.nextRentDueDate}.`,
            date: tenant.nextRentDueDate
        })),
        ...maintenanceRequests.filter(req => req.status !== 'Completed').map(req => ({
            id: `maint-${req.id}`,
            type: 'maintenance_pending',
            description: `Maintenance request: "${req.title}" for ${properties.find(p => p.id === req.propertyId)?.name} (${req.roomNumber || 'N/A'}) is ${req.status}.`,
            date: req.date // Use reported date, or a 'due by' date if available
        }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Filter for vacant properties
    const vacantProperties = properties.filter(prop => {
        const occupiedRoomsInProperty = tenants.filter(t => t.propertyId === prop.id).length;
        return occupiedRoomsInProperty < prop.totalRooms;
    });

    // Handle notification bell click
    const handleNotificationBellClick = () => {
        setIsNotificationsModalOpen(true);
        // Optionally, mark all notifications as read when opening the modal
        setHasNewNotifications(false);
        setNotificationsCount(0);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    // Handle "See More Activity" click
    const handleSeeMoreActivity = () => {
        // Simulate navigation to a dedicated Recent Activity page
        // In a full Next.js application, you would create a new file like
        // src/app/recent-activity/page.jsx and navigate to it using useRouter:
        // router.push('/recent-activity');
        window.location.href = '/recent-activity'; // Simulate navigation for Canvas environment
        showMessage('Navigating to Recent Activity page...', 'info');
    };

    // Handle "View Reminders" icon click
    const handleViewRemindersClick = () => {
        setIsRemindersModalOpen(true);
    };

    // Function to get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Handle user avatar click
    const handleUserAvatarClick = () => {
        if (!isLoggedIn) {
            setIsLoginModalOpen(true);
        } else {
            // If logged in, maybe show a small menu or just a message
            showMessage(`Logged in as: ${user.email}`, 'info');
            // Or a simple logout option:
            // setIsLoggedIn(false);
            // setUser(null);
            // setUserId('not-logged-in');
            // showMessage('Logged out successfully.', 'success');
        }
    };

    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
        setUserId(loggedInUser.uid);
        setIsLoggedIn(true);
        showMessage('Logged in successfully!', 'success');
    };

    // Property Insights sections now show all items by default
    const allPerformance = propertyPerformance;
    const allVacant = vacantProperties.filter(p => p.totalRooms - tenants.filter(t => t.propertyId === p.id).length > 0);
    const allLease = properties.filter(prop => {
        if (!prop.leaseEndDate) return false;
        const leaseDate = new Date(prop.leaseEndDate);
        return leaseDate >= today && leaseDate <= threeMonthsFromNow;
    });

    // --- PDF and CSV Download Functions (kept for potential future use, though not used by current UI) ---
    const generatePdf = (data, title, headers) => {
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.autoTable === 'undefined') {
            showMessage('PDF generation library not loaded. Please try again or refresh.', 'error');
            console.error('jsPDF or autoTable not available.');
            return;
        }
        const doc = new window.jspdf.jsPDF();
        doc.text(title, 14, 20);
        doc.autoTable({
            startY: 25,
            head: [headers],
            body: data,
            theme: 'striped',
            styles: {
                font: 'Inter', // Assuming Inter font is available or fallback
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [79, 70, 229], // Indigo-600
                textColor: 255, // White
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252], // bg-light
            },
            columnStyles: {
                0: { cellWidth: 'auto' }, // Auto width for first column
            },
        });
        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        showMessage(`${title} PDF downloaded!`, 'success');
    };

    const generateCsv = (data, title, headers) => {
        let csvContent = headers.join(',') + '\n';
        data.forEach(row => {
            csvContent += row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage(`${title} CSV downloaded!`, 'success');
        } else {
            showMessage('Your browser does not support downloading CSV files directly.', 'error');
        }
    };


    // --- Notification Specific Handlers ---
    const handleDeleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        setNotificationsCount(prev => Math.max(0, prev - 1));
        showMessage('Notification deleted.', 'info');
    };

    const handleViewNotificationDetails = (notification) => {
        setSelectedNotification(notification);
        setIsNotificationDetailsModalOpen(true);
        // Mark as read when viewed
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        if (!notification.read) { // Only decrement if it was unread
            setNotificationsCount(prev => Math.max(0, prev - 1));
        }
    };


    return (
        <div className="app-container">
            {/* Google Fonts link for global application */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Pure CSS styles embedded directly */}
            <style jsx global>{`
                /* Ensure html and body take full viewport height for proper scrolling */
                html, body {
                    height: 100%;
                    margin: 0;
                }

                :root {
                    --bg-light: #f8fafc; /* Lighter background */
                    --text-dark: #1f2937;
                    --text-slate-800: #1e293b;
                    --text-slate-600: #4b5563;
                    --text-slate-500: #6b7280;
                    --text-slate-900: #0f172a; /* Darker for main titles */
                    --indigo-600: #4f46e5;
                    --indigo-700: #4338ca;
                    --indigo-50: #eef2ff;
                    --green-600: #16a34a;
                    --red-600: #dc2626;
                    --amber-500: #f59e0b;
                    --white: #ffffff;
                    --border-light: #e2e8f0; /* Softer border */
                    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
                    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
                    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
                    --shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04);
                }

                body {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg-light);
                    line-height: 1.6;
                    color: var(--text-dark);
                    display: flex; /* Keep flex for overall layout */
                    flex-direction: column; /* Allow direct children to stack vertically if needed */
                    align-items: center; /* Center app-container horizontally */
                    justify-content: flex-start; /* Align app-container to top */
                    font-size: 16px;
                }

                .app-container {
                    display: flex;
                    width: 100%;
                    max-width: 1400px; /* Max width for larger screens */
                    background-color: var(--bg-light); 
                    color: var(--text-slate-800);
                    min-height: 100vh; /* Ensure app-container takes full viewport height */
                }

                .sidebar {
                    width: 250px;
                    flex-shrink: 0;
                    background-color: var(--white);
                    border-right: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    box-shadow: var(--shadow-sm);
                    position: fixed; /* Changed to fixed for mobile slide-in */
                    top: 0;
                    left: -250px; /* Hidden by default on mobile */
                    height: 100vh;
                    overflow-y: auto;
                    z-index: 200; /* Higher than header for mobile overlay */
                    transition: left 0.3s ease-in-out; /* Smooth slide transition */
                }

                .sidebar.sidebar-open {
                    left: 0; /* Slide in */
                }

                @media (min-width: 768px) {
                    .sidebar {
                        position: sticky; /* Sticky on desktop */
                        left: 0; /* Always visible on desktop */
                        display: flex; /* Ensure it's displayed */
                    }
                }

                .sidebar-header {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between; /* Space between title and close button */
                    border-bottom: 1px solid var(--border-light);
                    padding: 0 1.5rem;
                }

                .sidebar-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--indigo-700);
                    letter-spacing: -0.025em;
                }

                .sidebar-close-button {
                    display: block; /* Always show on mobile */
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }

                .sidebar-close-button:hover {
                    background-color: var(--bg-light);
                }

                .sidebar-close-button svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    color: var(--text-slate-600);
                }

                @media (min-width: 768px) {
                    .sidebar-close-button {
                        display: none; /* Hide on desktop */
                    }
                }


                .sidebar-nav {
                    flex: 1;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 0.85rem 1.15rem;
                    border-radius: 0.75rem;
                    color: var(--text-slate-600);
                    text-decoration: none;
                    transition: all 0.2s ease-in-out;
                    font-weight: 500;
                    font-size: 0.95rem;
                }

                .sidebar-link:hover {
                    background-color: var(--indigo-50);
                    color: var(--indigo-700);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-sm);
                }

                .sidebar-link.active {
                    background-color: var(--indigo-600);
                    color: var(--white);
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                }

                .sidebar-link svg {
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-right: 0.85rem;
                }

                .sidebar-footer {
                    padding: 1.25rem;
                    border-top: 1px solid var(--border-light);
                    font-size: 0.85rem;
                    color: var(--text-slate-500);
                }

                .sidebar-footer span {
                    font-family: 'Inter', sans-serif;
                    word-break: break-all;
                    font-weight: 400;
                }

                .main-content {
                    flex: 1;
                    overflow-y: auto;
                    background-color: var(--bg-light);
                }

                .header {
                    height: 60px;
                    background-color: var(--white);
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    box-shadow: var(--shadow-md);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header-left-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .header-greeting {
                    font-size: 1.25rem; /* Smaller font size */
                    font-weight: 500; /* Less bold */
                    color: var(--text-slate-800);
                    white-space: nowrap; /* Prevent wrapping of greeting */
                }

                .header-right-group {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .header-icon-button {
                    position: relative;
                    cursor: pointer;
                    padding: 0.6rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    background-color: var(--bg-light);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .header-icon-button:hover {
                    background-color: var(--indigo-50);
                    transform: scale(1.1);
                }

                .header-icon-button svg {
                    width: 1.6rem;
                    height: 1.6rem;
                    color: var(--text-slate-600);
                    transition: color 0.2s ease;
                }

                .header-icon-button.has-new svg {
                    color: var(--indigo-600);
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: var(--red-600);
                    color: var(--white);
                    border-radius: 50%;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    min-width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: translate(0, 0);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background-color: var(--indigo-100);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--indigo-700);
                    font-weight: 600;
                    font-size: 1rem;
                    border: 2px solid var(--indigo-300);
                    flex-shrink: 0;
                    cursor: pointer; /* Make it clickable */
                    transition: transform 0.2s ease, background-color 0.2s ease;
                }
                .user-avatar:hover {
                    transform: scale(1.05);
                    background-color: var(--indigo-200);
                }


                .main-content-padding {
                    padding: 2rem;
                }

                @media (min-width: 768px) {
                    .main-content-padding {
                        padding: 2.5rem;
                    }
                }

                .content-section {
                    display: block;
                    opacity: 1;
                    transition: none;
                    margin-bottom: 2.5rem;
                }
                .content-section:last-child {
                    margin-bottom: 0;
                }
                
                .key-metrics-container {
                    overflow-x: auto; /* Always enable horizontal scrolling */
                    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
                    padding-bottom: 1rem; /* Add some padding for scrollbar */
                    margin-bottom: 2rem;
                    display: flex; /* Ensures flex context for children */
                    width: 100%; /* Ensure it takes full width */
                }

                .key-metrics-grid {
                    display: flex; /* Always use flexbox for horizontal layout */
                    gap: 1.5rem;
                    flex-wrap: nowrap; /* Always prevent wrapping */
                    padding-right: 1rem; /* Space for last card not to be cut off by scrollbar */
                }

                /* Remove grid-specific media queries for key-metrics-grid */
                @media (min-width: 640px) {
                    .key-metrics-grid {
                        /* No change, remains flex. Min-width on cards ensures layout */
                    }
                }

                @media (min-width: 768px) {
                    .key-metrics-grid {
                        /* No change, remains flex */
                    }
                }

                @media (min-width: 1024px) {
                    .key-metrics-grid {
                        /* No change, remains flex */
                    }
                }

                .metric-card {
                    background-color: var(--white);
                    padding: 2rem 1.5rem;
                    border-radius: 1.25rem;
                    box-shadow: var(--shadow-lg);
                    text-align: center;
                    transition: all 0.3s ease;
                    border: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 220px; /* Minimum width for scrollable cards */
                    flex-shrink: 0; /* Prevent shrinking in flex container */
                    min-height: 150px;
                    position: relative;
                    overflow: hidden;
                    transform-style: preserve-3d;
                }

                .metric-card:hover {
                    box-shadow: var(--shadow-xl);
                    transform: translateY(-10px) scale(1.03);
                }

                .metric-card h3 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: var(--text-slate-700);
                    margin-bottom: 0.85rem;
                    z-index: 1;
                }

                .metric-card p {
                    font-size: 2.8rem;
                    font-weight: 800;
                    color: var(--indigo-700);
                    z-index: 1;
                    line-height: 1;
                }

                .metric-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 10px;
                    background-color: transparent;
                    border-radius: 1.25rem 0 0 1.25rem;
                    transition: background-color 0.3s ease;
                }

                .metric-card.type-info::before { background-color: var(--indigo-600); }
                .metric-card.type-success::before { background-color: var(--green-600); }
                .metric-card.type-warning::before { background-color: var(--amber-500); }
                .metric-card.type-danger::before { background-color: var(--red-600); }

                .metric-card-icon {
                    width: 36px;
                    height: 36px;
                    margin-bottom: 1rem;
                    color: var(--indigo-600);
                    opacity: 0.8;
                    transition: color 0.3s ease, opacity 0.3s ease;
                }
                .metric-card.type-success .metric-card-icon { color: var(--green-600); }
                .metric-card.type-warning .metric-card-icon { color: var(--amber-500); }
                .metric-card.type-danger .metric-card-icon { color: var(--red-600); }

                /* --- Message Box Styles --- */
                .message-box {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    color: var(--white);
                    font-weight: 600;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                    z-index: 1000;
                    box-shadow: var(--shadow-lg);
                    font-size: 0.95rem;
                }

                .message-box.show {
                    opacity: 1;
                    visibility: visible;
                }

                .message-box.success {
                    background-color: var(--green-600);
                }

                .message-box.error {
                    background-color: #ef4444;
                }
                .message-box.info {
                    background-color: var(--indigo-600);
                }

                /* --- General Sub-Section Styling --- */
                .dashboard-sub-section {
                    background-color: var(--white);
                    padding: 2.5rem;
                    border-radius: 1.25rem;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-light);
                    margin-top: 2.5rem;
                }

                .dashboard-sub-section-title {
                    font-size: 1.85rem;
                    font-weight: 700;
                    color: var(--text-slate-800);
                    margin-bottom: 1.75rem;
                    border-bottom: 2px solid var(--border-light);
                    padding-bottom: 0.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .dashboard-sub-section-title .title-text {
                    flex-grow: 1;
                }

                .dashboard-sub-section-description {
                    color: var(--text-slate-600);
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .item-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .activity-item, .list-item {
                    display: flex;
                    align-items: center;
                    padding: 1.15rem 0;
                    border-bottom: 1px dashed var(--border-light);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                }
                .activity-item:hover, .list-item:hover {
                    background-color: var(--indigo-50);
                    transform: translateX(6px);
                }
                .activity-item:last-child, .list-item:last-child {
                    border-bottom: none;
                }

                .activity-icon-container {
                    flex-shrink: 0;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1.5rem;
                    font-size: 1.3rem;
                    color: var(--white);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .activity-icon-rent { background-color: var(--green-600); }
                .activity-icon-maintenance { background-color: var(--amber-500); }
                .activity-icon-lease { background-color: var(--indigo-600); }
                .activity-icon-overdue { background-color: var(--red-600); }
                .activity-icon-completed { background-color: var(--green-600); }
                .activity-icon-rent_due { background-color: var(--amber-500); }
                .activity-icon-maintenance_pending { background-color: var(--red-600); }


                .activity-content {
                    flex-grow: 1;
                    font-size: 1.05rem;
                    color: var(--text-slate-800);
                }

                .activity-date {
                    flex-shrink: 0;
                    font-size: 0.9rem;
                    color: var(--text-slate-500);
                    margin-left: 1.8rem;
                    white-space: nowrap;
                }

                /* See More/Less Button Styles (removed from insight cards) */
                .toggle-metrics-button {
                    display: block;
                    width: fit-content;
                    margin: 0 auto 2.5rem auto;
                    padding: 0.9rem 2rem;
                    background-color: var(--indigo-600);
                    color: var(--white);
                    border: none;
                    border-radius: 0.85rem;
                    font-size: 1.05rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 15px rgba(79, 70, 229, 0.2);
                }
                .toggle-metrics-button:hover {
                    background-color: var(--indigo-700);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
                }
                /* Specific styling for buttons within insight cards (now removed from JSX) */
                .insight-card .toggle-metrics-button {
                    margin-top: auto;
                    margin-bottom: 0;
                    font-size: 0.9rem;
                    padding: 0.6rem 1.2rem;
                }

                /* Download Buttons (removed from JSX) */
                .download-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 1rem;
                    justify-content: flex-end;
                }
                .download-buttons button {
                    padding: 0.6rem 1rem;
                    font-size: 0.9rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--border-light);
                    background-color: var(--white);
                    color: var(--text-slate-600);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .download-buttons button:hover {
                    background-color: var(--indigo-50);
                    color: var(--indigo-700);
                    box-shadow: var(--shadow-sm);
                }


                /* Financial Summary Grid */
                .financial-summary-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                @media (min-width: 640px) {
                    .financial-summary-grid {
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    }
                }
                @media (min-width: 1024px) {
                    .financial-summary-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 2rem;
                    }
                }

                .financial-card {
                    background-color: var(--white);
                    padding: 2.25rem;
                    border-radius: 1.25rem;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-light);
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .financial-card:hover {
                    box-shadow: var(--shadow-xl);
                    transform: translateY(-6px);
                }

                .financial-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 10px;
                    background-color: transparent;
                    border-radius: 1.25rem 0 0 1.25rem;
                    transition: background-color 0.3s ease;
                }
                .financial-card.type-success::before { background-color: var(--green-600); }
                .financial-card.type-danger::before { background-color: var(--red-600); }
                .financial-card.type-info::before { background-color: var(--indigo-600); }


                .financial-card h4 {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--text-slate-700);
                    margin-bottom: 0.85rem;
                }

                .financial-card p {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1;
                }
                .financial-card.type-success p { color: var(--green-600); }
                .financial-card.type-danger p { color: var(--red-600); }
                .financial-card.type-info p { color: var(--indigo-700); }

                /* Grid for combined sections (e.g., performance, vacant, lease alerts) */
                .combined-section-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .combined-section-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .combined-section-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                /* Specific styling for insight cards */
                .insight-card {
                    background-color: var(--white);
                    padding: 1.8rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border-light);
                    box-shadow: var(--shadow-md);
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start; /* Align content to top */
                    overflow: hidden; /* Ensure content doesn't spill out */
                    min-height: 280px; /* Reduced min-height as "Show More" is removed */
                }
                .insight-card:hover {
                    box-shadow: var(--shadow-lg);
                    transform: translateY(-3px);
                }

                .insight-card-title {
                    font-weight: 700;
                    font-size: 1.2rem; /* Slightly larger title */
                    color: var(--text-slate-800);
                    margin-bottom: 1rem; /* Increased margin */
                    padding-bottom: 0.6rem; /* Increased padding */
                    border-bottom: 2px solid var(--border-light); /* Thicker border */
                }
                .insight-card-detail {
                    font-size: 1rem; /* Slightly larger text */
                    color: var(--text-slate-700); /* Darker text for better contrast */
                    margin-bottom: 0.6rem; /* Increased margin */
                    line-height: 1.5;
                }
                .insight-card-detail strong {
                    color: var(--text-slate-900);
                    font-weight: 600;
                }
                .insight-card ul {
                    margin-top: 0.5rem; /* Space between title and first item */
                    padding-left: 0; /* Remove default ul padding */
                }
                .insight-card ul li {
                    margin-bottom: 1rem; /* Space between list items */
                }
                .insight-card ul li:last-child {
                    margin-bottom: 0;
                }

                /* Specific color variations for insight cards */
                .insight-card.type-performance {
                    background-color: var(--indigo-50);
                    border-color: var(--indigo-200);
                }
                .insight-card.type-performance .insight-card-title {
                    color: var(--indigo-700);
                }

                .insight-card.type-vacant {
                    background-color: var(--amber-50);
                    border-color: var(--amber-200);
                }
                .insight-card.type-vacant .insight-card-title {
                    color: var(--amber-700);
                }

                .insight-card.type-lease {
                    background-color: var(--red-50);
                    border-color: var(--red-200);
                }
                .insight-card.type-lease .insight-card-title {
                    color: var(--red-700);
                }

                .insight-card-message {
                    text-align: center;
                    color: var(--text-slate-500);
                    font-style: italic;
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem; /* Added padding */
                }
                .insight-card-message.success {
                    color: var(--green-600);
                    font-weight: 600;
                }

                /* --- Action Required Section --- */
                .action-required-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .action-required-item {
                    display: flex;
                    align-items: center;
                    padding: 1.25rem 0;
                    border-bottom: 1px dashed var(--border-light);
                    color: var(--text-slate-800);
                    font-size: 1.05rem;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                }
                .action-required-item:hover {
                    background-color: var(--indigo-50);
                    transform: translateX(6px);
                }
                .action-required-item:last-child {
                    border-bottom: none;
                }

                .action-item-icon {
                    flex-shrink: 0;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1.25rem;
                    font-size: 1.1rem;
                    color: var(--white);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .action-item-icon.danger { background-color: var(--red-600); }
                .action-item-icon.warning { background-color: var(--amber-500); }
                .action-item-icon.info { background-color: var(--indigo-600); }

                .action-item-content {
                    flex-grow: 1;
                    font-weight: 500;
                }
                .action-item-content strong {
                    font-weight: 700;
                }
                .action-item-content .sub-text {
                    font-size: 0.9rem;
                    color: var(--text-slate-600);
                    display: block;
                    margin-top: 0.2rem;
                }


                /* --- Modal Specific Styles --- */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .modal-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-content {
                    background-color: var(--white);
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: var(--shadow-xl);
                    max-width: 600px;
                    width: 90%;
                    transform: translateY(-20px);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                }

                .modal-overlay.show .modal-content {
                    transform: translateY(0);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border-light);
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                }

                .modal-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-slate-800);
                }

                .modal-close-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }

                .modal-close-button:hover {
                    background-color: var(--bg-light);
                }

                .modal-close-button svg {
                    width: 1.5rem;
                    height: 1.5rem;
                    color: var(--text-slate-600);
                }

                .modal-body {
                    overflow-y: auto;
                    flex-grow: 1;
                    padding-right: 0.5rem;
                }

                .modal-body .item-list .activity-item {
                    padding: 0.8rem 0;
                }

                .modal-body .item-list .activity-icon-container {
                    width: 38px;
                    height: 38px;
                    font-size: 1.1rem;
                }
                .modal-body .item-list .activity-content {
                    font-size: 0.95rem;
                }
                .modal-body .item-list .activity-date {
                    font-size: 0.8rem;
                }
                .modal-body .text-slate-500 {
                    text-align: center;
                    padding: 1rem;
                }

                .notification-item {
                    display: flex;
                    align-items: center; /* Align items vertically */
                    padding: 0.8rem 0;
                    border-bottom: 1px dashed var(--border-light);
                    color: var(--text-slate-800);
                    font-size: 0.95rem;
                    cursor: pointer; /* Indicate clickable */
                    transition: background-color 0.2s ease;
                }
                .notification-item:hover {
                    background-color: var(--indigo-50);
                }
                .notification-item:last-child {
                    border-bottom: none;
                }
                .notification-item.read {
                    color: var(--text-slate-500);
                }
                .notification-item .icon {
                    flex-shrink: 0;
                    margin-right: 1rem;
                    color: var(--indigo-600);
                }
                .notification-item .content {
                    flex-grow: 1;
                }
                .notification-item .date {
                    flex-shrink: 0;
                    margin-left: 1rem;
                    font-size: 0.8rem;
                    color: var(--text-slate-500);
                }
                .notification-item .delete-icon {
                    flex-shrink: 0;
                    margin-left: 0.8rem;
                    cursor: pointer;
                    color: var(--red-600);
                    padding: 0.3rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }
                .notification-item .delete-icon:hover {
                    background-color: var(--red-100);
                }

                .notification-detail-content {
                    padding: 1.5rem; /* Increased padding */
                    line-height: 1.8;
                    background-color: var(--indigo-50); /* Light background for contrast */
                    border-radius: 0.75rem; /* Rounded corners */
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.08); /* Inner shadow */
                    border: 1px solid var(--indigo-200); /* Border matching theme */
                    margin-top: 1rem; /* Space from title */
                    color: var(--text-slate-800); /* Darker text */
                }
                .notification-detail-content p {
                    margin-bottom: 0.8rem; /* Increased margin */
                    font-size: 1.05rem; /* Slightly larger font */
                }
                .notification-detail-content p:last-child {
                    margin-bottom: 0;
                }
                .notification-detail-content strong {
                    color: var(--indigo-700); /* Emphasize strong text with primary color */
                    font-weight: 700;
                    margin-right: 0.3rem; /* Space after strong text */
                }


                /* Mobile Hamburger Menu Button */
                .hamburger-menu-button {
                    display: none; /* Hidden by default on desktop */
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }

                .hamburger-menu-button:hover {
                    background-color: var(--bg-light);
                }

                .hamburger-menu-button svg {
                    width: 1.8rem; /* Larger icon for touch */
                    height: 1.8rem;
                    color: var(--text-slate-600);
                }

                @media (max-width: 767px) {
                    .hamburger-menu-button {
                        display: block; /* Show on mobile */
                    }
                }

                /* Overlay for mobile sidebar */
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 150; /* Between sidebar and main content */
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .sidebar-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
            `}</style>

            {/* Sidebar Overlay for Mobile */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar Navigation */}
            <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Landlord App</h1>
                    <button className="sidebar-close-button" onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <a href="#overview" onClick={() => handleNavigation('overview')} className={`sidebar-link ${activeSection === 'overview' ? 'active' : ''}`}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Dashboard
                    </a>
                </nav>
                <div className="sidebar-footer">
                    User ID: <span className="font-mono break-all">{userId}</span>
                </div>
            </aside>

            {/* Main Content Area - All sections integrated into Dashboard Overview */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left-group">
                        {/* Hamburger menu button for mobile */}
                        <button className="hamburger-menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle navigation menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                            </svg>
                        </button>
                        {/* User Avatar moved to be before greeting */}
                        <div className="user-avatar" onClick={handleUserAvatarClick} title={isLoggedIn ? `Logged in as ${user.email}` : 'Login / Sign Up'}>
                            {isLoggedIn && user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="header-greeting">{getGreeting()}, {isLoggedIn && user?.email ? user.email.split('@')[0] : 'Guest'}!</span>
                    </div>
                    <div className="header-right-group">
                        {/* Upcoming Reminders Icon */}
                        <div className="header-icon-button" onClick={handleViewRemindersClick} title="View Upcoming Reminders">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/>
                                <path d="M12 11h.01"/>
                                <path d="M12 16h.01"/>
                                <path d="M16 11h.01"/>
                                <path d="M16 16h.01"/>
                                <path d="M8 11h.01"/>
                                <path d="M8 16h.01"/>
                            </svg>
                        </div>

                        {/* Notification Bell */}
                        <div className={`header-icon-button ${hasNewNotifications ? 'has-new' : ''}`} onClick={handleNotificationBellClick} title="View Notifications">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.004 2.004 0 0118 14.59V10a6 6 0 00-12 0v4.59c0 .538-.214 1.055-.595 1.405L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"></path>
                            </svg>
                            {hasNewNotifications && notificationsCount > 0 && (
                                <span className="notification-badge">{notificationsCount}</span>
                            )}
                        </div>
                    </div>
                </header>
                
                <div className="main-content-padding">
                    <section id="overview" className="content-section active"> {/* Always active */}
                        {/* Key Metrics at a Glance */}
                        <div className="dashboard-sub-section">
                            <h4 className="dashboard-sub-section-title">Key Metrics at a Glance</h4>
                            <p className="dashboard-sub-section-description">A quick overview of your portfolio's essential statistics.</p>
                            <div className="key-metrics-container"> {/* Added container for horizontal scroll */}
                                <div className="key-metrics-grid">
                                    {keyMetrics.map(metric => (
                                        <div key={metric.id} className={`metric-card type-${metric.type}`}>
                                            {metric.icon && <span className="metric-card-icon">{metric.icon}</span>}
                                            <h3>{metric.title}</h3>
                                            <p>{metric.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Required Section */}
                        <div className="dashboard-sub-section">
                            <h4 className="dashboard-sub-section-title">Action Required</h4>
                            <p className="dashboard-sub-section-description">Important items that need your immediate attention.</p>
                            <ul className="action-required-list"> {/* Changed to ul for list format */}
                                <li className="action-required-item">
                                    <span className="action-item-icon danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </span>
                                    <div className="action-item-content">
                                        <strong>Overdue Rent:</strong> ₦{overdueRentAmount}
                                        {overdueRentTenantsCount > 0 && (
                                            <span className="sub-text">{overdueRentTenantsCount} tenant(s) with overdue rent.</span>
                                        )}
                                    </div>
                                </li>
                                <li className="action-required-item">
                                    <span className="action-item-icon warning">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </span>
                                    <div className="action-item-content">
                                        <strong>Pending Maintenance:</strong> {pendingMaintenanceRequests} request(s)
                                        <span className="sub-text">New or in-progress maintenance issues.</span>
                                    </div>
                                </li>
                                <li className="action-required-item">
                                    <span className="action-item-icon info">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </span>
                                    <div className="action-item-content">
                                        <strong>Upcoming Renewals:</strong> {upcomingLeaseRenewalsCount} lease(s)
                                        <span className="sub-text">Leases expiring in the next 3 months.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="dashboard-sub-section">
                            <h4 className="dashboard-sub-section-title">Recent Activity</h4>
                            <p className="dashboard-sub-section-description">A chronological list of recent events across your properties.</p>
                            <ul className="item-list">
                                {displayedActivities.map(activity => (
                                    <li key={activity.id} className="activity-item">
                                        <div className={`activity-icon-container activity-icon-${activity.type.split('_')[0]}`}>
                                            {activity.type === 'rent_paid' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            )}
                                            {activity.type === 'maintenance' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            )}
                                            {activity.type === 'lease_renewal' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            )}
                                            {activity.type === 'rent_overdue' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            )}
                                            {activity.type === 'maintenance_completed' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            )}
                                        </div>
                                        <div className="activity-content">{activity.description}</div>
                                        <div className="activity-date">{activity.date}</div>
                                    </li>
                                ))}
                            </ul>
                            {recentActivities.length > 5 && (
                                <button
                                    onClick={handleSeeMoreActivity}
                                    className="toggle-metrics-button"
                                    style={{ marginTop: '1.5rem' }}
                                >
                                    See More Activity
                                </button>
                            )}
                        </div>

                        {/* Property Insights Section (Performance, Vacant, Lease Alerts) */}
                        <div className="dashboard-sub-section">
                            <h4 className="dashboard-sub-section-title">Property Insights</h4>
                            <p className="dashboard-sub-section-description">Get a quick overview of property performance, vacant units, and upcoming lease expirations.</p>
                            <div className="combined-section-grid">
                                {/* Property Performance Highlights */}
                                <div className="insight-card type-performance">
                                    <h5 className="insight-card-title">Performance Highlights</h5>
                                    {allPerformance.length > 0 ? (
                                        <ul className="item-list"> {/* Used item-list for consistent styling */}
                                            {allPerformance.map(perf => (
                                                <li key={perf.id}>
                                                    <div className="insight-card-detail"><strong>{perf.propertyName}</strong></div>
                                                    <div className="insight-card-detail">Occupancy: <strong>{perf.occupancy}</strong></div>
                                                    <div className="insight-card-detail">Maintenance Cost: <strong>{perf.maintenanceCost}</strong></div>
                                                    <div className="insight-card-detail">Rating: <strong>{perf.rating} / 5</strong></div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="insight-card-message">No performance data available.</p>
                                    )}
                                </div>

                                {/* Vacant Properties Overview */}
                                <div className="insight-card type-vacant">
                                    <h5 className="insight-card-title">Vacant Properties</h5>
                                    {allVacant.length > 0 ? (
                                        <ul className="item-list">
                                            {allVacant.map(prop => (
                                                <li key={prop.id}>
                                                    <div className="insight-card-detail"><strong>{prop.name}</strong></div>
                                                    <div className="insight-card-detail">Location: <strong>{prop.location}</strong></div>
                                                    <div className="insight-card-detail">Available Rooms: <strong>{prop.totalRooms - tenants.filter(t => t.propertyId === prop.id).length}</strong></div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="insight-card-message success">All properties currently occupied!</p>
                                    )}
                                </div>

                                {/* Lease Expiry Alerts */}
                                <div className="insight-card type-lease">
                                    <h5 className="insight-card-title">Lease Expiry Alerts</h5>
                                    {allLease.length > 0 ? (
                                        <ul className="item-list">
                                            {allLease.map(prop => (
                                                <li key={prop.id}>
                                                    <div className="insight-card-detail"><strong>{prop.name}</strong></div>
                                                    <div className="insight-card-detail">Location: <strong>{prop.location}</strong></div>
                                                    <div className="insight-card-detail">Lease Ends: <strong className="text-amber-700">{prop.leaseEndDate}</strong></div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="insight-card-message success">No leases expiring soon.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <MessageBox message={message} type={messageType} />

            {/* Notifications Modal */}
            <Modal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)} title="Your Notifications">
                {notifications.length > 0 ? (
                    <>
                        <ul className="item-list">
                            {notifications.map(notif => (
                                <li key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                                    <span className="icon">
                                        {notif.read ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                                        )}
                                    </span>
                                    <span className="content" onClick={() => handleViewNotificationDetails(notif)}>{notif.message}</span>
                                    <span className="date">{notif.date}</span>
                                    <span className="delete-icon" onClick={() => handleDeleteNotification(notif.id)} title="Delete Notification">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-slate-500">No new notifications.</p>
                )}
            </Modal>

            {/* Upcoming Reminders Modal */}
            <Modal isOpen={isRemindersModalOpen} onClose={() => setIsRemindersModalOpen(false)} title="Upcoming Reminders & Tasks">
                {upcomingReminders.length > 0 ? (
                    <>
                        <ul className="item-list">
                            {upcomingReminders.map(reminder => (
                                <li key={reminder.id} className="activity-item">
                                    <div className={`activity-icon-container activity-icon-${reminder.type.split('_')[0]}`} style={{ width: '38px', height: '38px', fontSize: '1.1rem', marginRight: '1rem' }}>
                                        {reminder.type === 'lease_renewal' && (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>)}
                                        {reminder.type === 'rent_due' && (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>)}
                                        {reminder.type === 'maintenance_pending' && (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>)}
                                </div>
                                    <div className="activity-content">{reminder.description}</div>
                                    <div className="activity-date">{reminder.date}</div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-slate-500">No upcoming reminders or tasks.</p>
                )}
            </Modal>

            {/* Notification Details Modal */}
            <NotificationDetailsModal
                isOpen={isNotificationDetailsModalOpen}
                onClose={() => setIsNotificationDetailsModalOpen(false)}
                notification={selectedNotification}
            />

            {/* Login/Signup Modal */}
            <LoginSignupModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
}
