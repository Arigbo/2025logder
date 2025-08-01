// --- NEW: Properties Page Component ---
"use client"
import Modal from "../../component/modal";
import { useState } from "react";
export default function PropertiesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
  const properties = [
    { id: "p1", name: "Grand House", totalRooms: 5, occupiedRooms: 3, rentPerRoom: 50000, address: "123 Main St" },
    { id: "p2", name: "City Lodge", totalRooms: 3, occupiedRooms: 3, rentPerRoom: 65000, address: "456 Oak Ave" },
    { id: "p3", name: "Student Annex", totalRooms: 8, occupiedRooms: 6, rentPerRoom: 30000, address: "789 University Rd" },
  ];
    const tenants = [
    { id: "t1", name: "Alice Smith", propertyId: "p1", rentDue: 50000, rentDueDate: "2025-08-01", overdue: false, contact: "alice@example.com" },
    { id: "t2", name: "Bob Johnson", propertyId: "p1", rentDue: 50000, rentDueDate: "2025-08-01", overdue: false, contact: "bob@example.com" },
    { id: "t3", name: "Charlie Brown", propertyId: "p2", rentDue: 65000, rentDueDate: "2025-07-01", overdue: true, contact: "charlie@example.com" },
    { id: "t4", name: "Diana Prince", propertyId: "p3", rentDue: 30000, rentDueDate: "2025-08-05", overdue: false, contact: "diana@example.com" },
  ];
   // Helper function to display temporary messages
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };
    const handleAddProperty = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to the server
        showMessage("Property added successfully!", "success");
        setIsAddModalOpen(false);
    };

    const handleEditProperty = (e) => {
        e.preventDefault();
        showMessage(`Property "${selectedProperty.name}" updated!`, "success");
        setIsEditModalOpen(false);
    };

    const handleDeleteProperty = () => {
        showMessage(`Property "${selectedProperty.name}" deleted.`, "info");
        setIsDeleteModalOpen(false);
    };

    const openEditModal = (property) => {
        setSelectedProperty(property);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (property) => {
        setSelectedProperty(property);
        setIsDeleteModalOpen(true);
    };

    const getOccupancy = (propertyId) => {
        return tenants.filter(t => t.propertyId === propertyId).length;
    };

    const filteredProperties = properties.filter(p => {
        const occupancy = getOccupancy(p.id);
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = 
            statusFilter === 'all' ||
            (statusFilter === 'occupied' && occupancy > 0) ||
            (statusFilter === 'vacant' && occupancy === 0);
        return matchesSearch && matchesStatus;
    });

    const PropertyForm = ({ property, onSubmit }) => (
        <form onSubmit={onSubmit}>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Property Name</label>
                    <input className="form-input" id="name" type="text" defaultValue={property?.name} required />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="location">Location</label>
                    <input className="form-input" id="location" type="text" defaultValue={property?.location} required />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="totalRooms">Total Units/Rooms</label>
                    <input className="form-input" id="totalRooms" type="number" defaultValue={property?.totalRooms} required />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="rentPerRoom">Rent per Unit (₦)</label>
                    <input className="form-input" id="rentPerRoom" type="number" defaultValue={property?.rentPerRoom} required />
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Property</button>
            </div>
        </form>
    );

    return (
        <div className="content-area-inner">
            <div className="page-header">
                <h1 className="page-title">Properties</h1>
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add New Property
                </button>
            </div>
            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Search by property name..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="occupied">Occupied</option>
                    <option value="vacant">Vacant</option>
                </select>
            </div>
            <div className="property-grid">
                {filteredProperties.map(p => {
                    const occupancy = getOccupancy(p.id);
                    return (
                        <div key={p.id} className="property-card">
                            <img className="property-card-image" src={`https://placehold.co/400x300/6366F1/FFFFFF?text=${p.name.split(' ').join('+')}`} alt={p.name} />
                            <div className="property-card-content">
                                <h3 className="property-card-title">{p.name}</h3>
                                <p className="property-card-location">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    {p.location}
                                </p>
                                <div className="property-card-stats">
                                    <div className="stat-item">
                                        <div className="stat-value">{p.totalRooms}</div>
                                        <div className="stat-label">Total Units</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{occupancy} / {p.totalRooms}</div>
                                        <div className="stat-label">Occupied</div>
                                    </div>
                                </div>
                                <div className="property-card-footer">
                                    <button className="btn btn-secondary">View</button>
                                    <button className="btn btn-secondary" onClick={() => openEditModal(p)}>Edit</button>
                                    <button className="btn btn-secondary" onClick={() => openDeleteModal(p)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Add Property Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Property" size="lg">
                <PropertyForm onSubmit={handleAddProperty} />
            </Modal>

            {/* Edit Property Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${selectedProperty?.name}`} size="lg">
                <PropertyForm property={selectedProperty} onSubmit={handleEditProperty} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <p>Are you sure you want to delete the property "{selectedProperty?.name}"? This action cannot be undone.</p>
                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleDeleteProperty}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}