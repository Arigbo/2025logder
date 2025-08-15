"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// --- (1) FIREBASE CONFIGURATION ---
// In a real Next.js app, these would be in environment variables (.env.local)
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'landlord-maintenance-app-nextjs';

// --- (2) HELPER COMPONENTS ---

// -- Maintenance Card Component --
const MaintenanceCard = ({ request, onEdit, onDelete }) => {
    const getUrgencyClass = (urgency) => {
        switch (urgency) {
            case 'Emergency': return 'border-red-500';
            case 'High': return 'border-yellow-500';
            case 'Medium': return 'border-blue-500';
            case 'Low': return 'border-green-500';
            default: return 'border-gray-500';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-500';
            case 'In Progress':
            case 'Assigned to Artisan':
                return 'bg-blue-100 text-blue-800';
            case 'Awaiting Parts': return 'bg-purple-100 text-purple-800';
            default: return 'bg-yellow-100 text-yellow-800'; // New
        }
    };

    const submittedDate = request.submittedAt 
        ? new Date(request.submittedAt.toMillis()).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) 
        : 'N/A';

    return (
        <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col justify-between border-l-4 ${getUrgencyClass(request.urgency)}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800">{request.category}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(request.status)}`}>{request.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{request.propertyUnit} - {request.tenantName}</p>
                <p className="text-gray-700 mt-4 text-sm">{request.description}</p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-xs text-gray-500">Submitted: {submittedDate}</p>
                <div>
                    <button onClick={() => onEdit(request)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Edit</button>
                    <button onClick={() => onDelete(request.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold ml-3">Delete</button>
                </div>
            </div>
        </div>
    );
};

// -- Request Modal Component --
const RequestModal = ({ isOpen, onClose, onSave, request }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // When the modal opens for a new or existing request, set the form data
        if (isOpen) {
            setFormData(request || {
                tenantName: '',
                propertyUnit: '',
                category: 'Plumbing',
                urgency: 'Low',
                status: 'New',
                description: ''
            });
        }
    }, [isOpen, request]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isEditing = !!request?.id;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">Tenant Name</label>
                            <input type="text" id="tenantName" value={formData.tenantName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="propertyUnit" className="block text-sm font-medium text-gray-700">Property / Unit</label>
                            <input type="text" id="propertyUnit" value={formData.propertyUnit} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>Painting</option><option>Appliances</option><option>AC/Ventilation</option><option>General</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency</label>
                        <select id="urgency" value={formData.urgency} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    {isEditing && (
                        <div className="mt-4">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>New</option><option>In Progress</option><option>Assigned to Artisan</option><option>Awaiting Parts</option><option>Completed</option><option>Cancelled</option>
                            </select>
                        </div>
                    )}
                    <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description of Issue</label>
                        <textarea id="description" rows="4" value={formData.description} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">Save Request</button>
                    </div>
                </form>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <i className="fas fa-times fa-lg"></i>
                </button>
            </div>
        </div>
    );
};

// --- (3) MAIN APP COMPONENT ---
// This would typically be a "page" in Next.js (e.g., pages/index.js)
export default function App() {
    // --- State Management ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [currentTime, setCurrentTime] = useState('Loading time...');

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);
            setDb(firestore);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    try {
                        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                        if (token) {
                            await signInWithCustomToken(authInstance, token);
                        } else {
                            await signInAnonymously(authInstance);
                        }
                    } catch (error) {
                        console.error("Authentication failed:", error);
                    }
                }
            });
            return () => unsubscribe(); // Cleanup auth listener on unmount
        } catch (e) {
            console.error("Firebase initialization failed:", e);
        }
    }, []);

    // --- Data Fetching (Real-time) ---
    useEffect(() => {
        if (!db || !userId) return;

        setIsLoading(true);
        const requestsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/maintenanceRequests`);
        
        const unsubscribe = onSnapshot(requestsCollectionRef, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by timestamp, newest first
            fetchedRequests.sort((a, b) => (b.submittedAt?.toMillis() || 0) - (a.submittedAt?.toMillis() || 0));
            setRequests(fetchedRequests);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching requests:", error);
            setIsLoading(false);
        });

        return () => unsubscribe(); // Cleanup Firestore listener on unmount
    }, [db, userId]);
    
    // --- Time Update Effect ---
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos', hour12: true 
            };
            setCurrentTime(now.toLocaleString('en-NG', options));
        };
        updateTime();
        const timerId = setInterval(updateTime, 60000);
        return () => clearInterval(timerId);
    }, []);

    // --- CRUD Handlers (Callbacks) ---
    const handleOpenModal = (request = null) => {
        setEditingRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRequest(null);
    };

    const handleSaveRequest = async (formData) => {
        if (!userId) return;
        const { id, ...data } = formData;
        
        try {
            if (id) { // Editing existing request
                const docRef = doc(db, `artifacts/${appId}/users/${userId}/maintenanceRequests`, id);
                await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
            } else { // Creating new request
                const collectionRef = collection(db, `artifacts/${appId}/users/${userId}/maintenanceRequests`);
                await addDoc(collectionRef, { ...data, status: 'New', submittedAt: serverTimestamp() });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving request:", error);
        }
    };

    const handleDeleteRequest = async (id) => {
        // In a real app, you'd use a more robust confirmation modal component
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                const docRef = doc(db, `artifacts/${appId}/users/${userId}/maintenanceRequests`, id);
                await deleteDoc(docRef);
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
    };

    // --- Render Logic ---
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Maintenance Hub</h1>
                                <p className="text-sm text-gray-500 mt-1">{currentTime}</p>
                            </div>
                            <div className="text-sm text-gray-600 mt-4 sm:mt-0 text-left sm:text-right">
                                <p className="font-semibold">Landlord ID:</p>
                                <p className="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1 inline-block">{userId || 'Loading...'}</p>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main>
                        {isLoading ? (
                            <div className="text-center py-16">
                                <i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i>
                                <p className="mt-4 text-gray-600">Loading Maintenance Requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-lg shadow">
                                <i className="fas fa-inbox fa-3x text-gray-400"></i>
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">No Maintenance Requests</h3>
                                <p className="mt-2 text-gray-500">Click the '+' button to add your first request.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {requests.map(req => (
                                    <MaintenanceCard key={req.id} request={req} onEdit={handleOpenModal} onDelete={handleDeleteRequest} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Floating Action Button */}
            <button onClick={() => handleOpenModal()} className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110">
                <i className="fas fa-plus fa-2x"></i>
            </button>

            {/* Modal */}
            <RequestModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRequest}
                request={editingRequest}
            />
        </div>
    );
}

