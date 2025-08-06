// src/app/landlords/properties/page.js
// This component displays a list of properties and allows adding/editing them.

"use client"; // This directive marks the component as a Client Component

import React, { useState, useContext } from "react";
import { DashboardContext } from "@/app/landlords/layout"; // Import the context
import Modal from "@/app/component/modal"; // Import your generic Modal component

export default function PropertiesPage() {
  // Use context to access shared state and functions from DashboardLayout
  const { showMessage, properties, setProperties, tenants, setTenants, addNotification } = useContext(DashboardContext);

  // State for Add/Edit Property Modal
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null); // Null for add, object for edit

  // State for View Property Details Modal
  const [isViewPropertyDetailsModalOpen, setIsViewPropertyDetailsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // New states for Delete Property Modal
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showDirectDeleteConfirmation, setShowDirectDeleteConfirmation] = useState(false); // True for direct delete, false for admin request

  // New states for Maintenance Request Modal
  const [isMaintenanceRequestModalOpen, setIsMaintenanceRequestModalOpen] = useState(false);
  const [propertyForMaintenance, setPropertyForMaintenance] = useState(null);
  const [maintenanceDescription, setMaintenanceDescription] = useState("");
  const [maintenanceUrgency, setMaintenanceUrgency] = useState("Medium"); // Default urgency
  const [maintenancePreferredDate, setMaintenancePreferredDate] = useState("");
  const [maintenancePreferredTime, setMaintenancePreferredTime] = useState("");


  // Form states for adding/editing property
  const [propertyName, setPropertyName] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [rentPerRoom, setRentPerRoom] = useState("");
  const [address, setAddress] = useState("");
  const [propertyImageUrl, setPropertyImageUrl] = useState("");
  const [leasePeriod, setLeasePeriod] = useState("12"); // New state for lease period, default to 12 months

  // Helper to get occupied rooms count for a property
  const getOccupiedRooms = (propertyId) => {
    return tenants.filter(tenant => tenant.propertyId === propertyId).length;
  };

  // --- Handlers for Property Actions ---

  const handleAddPropertyClick = () => {
    setCurrentProperty(null); // Clear for new property
    setPropertyName("");
    setTotalRooms("");
    setRentPerRoom("");
    setAddress("");
    setPropertyImageUrl("");
    setLeasePeriod("12"); // Reset to default for new property
    setIsPropertyModalOpen(true);
  };

  const handleEditPropertyClick = (property) => {
    setCurrentProperty(property); // Set for editing
    setPropertyName(property.name);
    setTotalRooms(property.totalRooms);
    setRentPerRoom(property.rentPerRoom);
    setAddress(property.address);
    setPropertyImageUrl(property.imageUrl || "");
    setLeasePeriod(property.leasePeriod ? String(property.leasePeriod) : "12"); // Set existing lease period, default to 12
    setIsPropertyModalOpen(true);
  };

  const handleViewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setIsViewPropertyDetailsModalOpen(true);
  };

  const handleSubmitProperty = (e) => {
    e.preventDefault();

    if (!propertyName || !totalRooms || !rentPerRoom || !address || !leasePeriod) {
      showMessage("Please fill in all property details.", "error");
      return;
    }

    const newPropertyData = {
      name: propertyName,
      totalRooms: parseInt(totalRooms, 10),
      rentPerRoom: parseInt(rentPerRoom, 10),
      address: address,
      imageUrl: propertyImageUrl,
      leasePeriod: parseInt(leasePeriod, 10),
    };

    if (currentProperty) {
      // Editing existing property
      const oldProperty = properties.find(p => p.id === currentProperty.id);
      const updatedProperties = properties.map((p) =>
        p.id === currentProperty.id ? { ...p, ...newPropertyData } : p
      );
      setProperties(updatedProperties);

      // Check for changes and notify/update tenants
      const changedFields = [];
      if (oldProperty.name !== newPropertyData.name) {
          changedFields.push(`name from "${oldProperty.name}" to "${newPropertyData.name}"`);
      }
      if (oldProperty.address !== newPropertyData.address) {
          changedFields.push(`address from "${oldProperty.address}" to "${newPropertyData.address}"`);
      }

      let tenantsToUpdate = [...tenants]; // Create a mutable copy for updates
      let rentChanged = false;

      if (oldProperty.rentPerRoom !== newPropertyData.rentPerRoom) {
          rentChanged = true;
          changedFields.push(`rent per room from ₦${oldProperty.rentPerRoom.toLocaleString()} to ₦${newPropertyData.rentPerRoom.toLocaleString()}`);

          tenantsToUpdate = tenantsToUpdate.map(tenant => {
              if (tenant.propertyId === currentProperty.id) {
                  let newRentDue = tenant.rentDue;
                  let newPaymentStatus = tenant.paymentStatus;
                  let newOverdue = tenant.overdue;

                  // If rent per room changes, and tenant is currently due, overdue, or part_payment,
                  // update their current rent due amount to the new rate.
                  // If they were paid or overpaid, the new rate applies to their next cycle.
                  if (tenant.paymentStatus === 'due' || tenant.paymentStatus === 'overdue' || tenant.paymentStatus === 'part_payment') {
                       newRentDue = newPropertyData.rentPerRoom;
                  }

                  // Re-evaluate payment status based on new rentDue and existing rentDueDate
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const rentDueDateObj = new Date(tenant.rentDueDate);
                  rentDueDateObj.setHours(0,0,0,0);

                  if (newRentDue <= 0) {
                      newPaymentStatus = 'paid';
                      newOverdue = false;
                  } else if (rentDueDateObj < today) {
                      newPaymentStatus = 'overdue';
                      newOverdue = true;
                  } else if (newRentDue > 0 && rentDueDateObj >= today) {
                      newPaymentStatus = 'due';
                      newOverdue = false;
                  }

                  return {
                      ...tenant,
                      rentDue: newRentDue,
                      overdue: newOverdue,
                      paymentStatus: newPaymentStatus,
                  };
              }
              return tenant;
          });
      }

      // Update tenants state if any changes occurred
      if (rentChanged || changedFields.length > 0) {
          setTenants(tenantsToUpdate); // Update the global tenants state

          // Add notifications for tenants in this property
          tenants.forEach(tenant => {
              if (tenant.propertyId === currentProperty.id) {
                  let notificationMessage = `Update for your property "${newPropertyData.name}" (${newPropertyData.address}): `;
                  if (rentChanged) {
                      notificationMessage += `Rent per room has changed to ₦${newPropertyData.rentPerRoom.toLocaleString()}. `;
                  }
                  if (oldProperty.name !== newPropertyData.name) {
                      notificationMessage += `Property name updated from "${oldProperty.name}" to "${newPropertyData.name}". `;
                  }
                  if (oldProperty.address !== newPropertyData.address) {
                      notificationMessage += `Property address updated from "${oldProperty.address}" to "${newPropertyData.address}". `;
                  }
                  addNotification(notificationMessage.trim(), 'property_update', {
                      propertyId: currentProperty.id,
                      propertyName: newPropertyData.name,
                      tenantId: tenant.id,
                      oldRentPerRoom: oldProperty.rentPerRoom, // For detailed notification
                      newRentPerRoom: newPropertyData.rentPerRoom, // For detailed notification
                  });
              }
          });
      }

      showMessage(`Property "${propertyName}" updated successfully!`, "success");
    } else {
      // Adding new property
      const newId = `p${Date.now()}`; // Simple unique ID
      setProperties((prevProperties) => [
        ...prevProperties,
        { ...newPropertyData, id: newId, occupiedRooms: 0 }, // New properties start with 0 occupied rooms
      ]);
      showMessage(`Property "${propertyName}" added successfully!`, "success");
    }

    setIsPropertyModalOpen(false); // Close modal
  };

  // --- Delete Property Handlers ---
  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    const occupiedCount = getOccupiedRooms(property.id);
    if (occupiedCount === 0) {
      setShowDirectDeleteConfirmation(true);
    } else {
      setShowDirectDeleteConfirmation(false);
    }
    setIsDeletePropertyModalOpen(true);
  };

  const confirmDirectDelete = () => {
    if (propertyToDelete) {
      setProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== propertyToDelete.id)
      );
      showMessage(`Property "${propertyToDelete.name}" has been permanently deleted.`, "success");
      setPropertyToDelete(null);
      setIsDeletePropertyModalOpen(false);
    }
  };

  const requestAdminDeletion = () => {
    if (propertyToDelete) {
      const occupiedCount = getOccupiedRooms(propertyToDelete.id);
      addNotification(
        `Property deletion request for "${propertyToDelete.name}". It has ${occupiedCount} active tenant(s).`,
        'property_deletion_request',
        {
          propertyId: propertyToDelete.id,
          propertyName: propertyToDelete.name,
          tenantCount: occupiedCount,
        }
      );
      showMessage(`Deletion request for "${propertyToDelete.name}" sent to admin for review.`, "info");
      setPropertyToDelete(null);
      setIsDeletePropertyModalOpen(false);
    }
  };

  // --- Maintenance Request Handlers ---
  const handleRequestMaintenance = (property) => {
    setPropertyForMaintenance(property);
    setMaintenanceDescription("");
    setMaintenanceUrgency("Medium");
    setMaintenancePreferredDate("");
    setMaintenancePreferredTime("");
    setIsMaintenanceRequestModalOpen(true);
  };

  const handleSubmitMaintenanceRequest = (e) => {
    e.preventDefault();

    if (!maintenanceDescription || !maintenanceUrgency || !maintenancePreferredDate) {
      showMessage("Please fill in all required maintenance details.", "error");
      return;
    }

    const requestDetails = {
      propertyId: propertyForMaintenance.id,
      propertyName: propertyForMaintenance.name,
      description: maintenanceDescription,
      urgency: maintenanceUrgency,
      preferredDate: maintenancePreferredDate,
      preferredTime: maintenancePreferredTime,
      status: "Pending",
      dateRequested: new Date().toISOString().split('T')[0],
    };

    // Send notification to admin
    addNotification(
      `New maintenance request for "${propertyForMaintenance.name}" (Urgency: ${maintenanceUrgency}).`,
      'maintenance_request',
      requestDetails
    );

    // Simulate informing tenants
    const tenantsInProperty = tenants.filter(t => t.propertyId === propertyForMaintenance.id);
    if (tenantsInProperty.length > 0) {
      showMessage(
        `Maintenance request submitted for "${propertyForMaintenance.name}". Tenants will be informed about scheduling.`,
        "info"
      );
      // In a real app, you might send a specific notification to each tenant
      tenantsInProperty.forEach(tenant => {
        // This is a simplified notification. You might want a dedicated 'tenant_info_maintenance' type.
        addNotification(
          `Maintenance scheduled for your property (${propertyForMaintenance.name}) on ${maintenancePreferredDate} around ${maintenancePreferredTime}. Details will follow.`,
          'general', // Using 'general' for now, could be a new type
          { tenantId: tenant.id, propertyName: propertyForMaintenance.name, date: maintenancePreferredDate, time: maintenancePreferredTime }
        );
      });
    } else {
      showMessage(`Maintenance request submitted for "${propertyForMaintenance.name}".`, "info");
    }

    setIsMaintenanceRequestModalOpen(false);
    setPropertyForMaintenance(null);
  };


  return (
    <div className="properties-page-container">
      <div className="page-header">
        <h1 className="page-title">Property Management</h1>
        <button className="button-primary" onClick={handleAddPropertyClick}>
          Add New Property
        </button>
      </div>

      <div className="property-cards-grid">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="property-card">
              {property.imageUrl && (
                <div className="property-image-container">
                  <img
                    src={property.imageUrl}
                    alt={`${property.name}`}
                    className="property-image"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/E0E0E0/000000?text=No+Image" }}
                  />
                </div>
              )}
              <h3 className="property-name">{property.name}</h3>
              <p className="property-detail">Address: {property.address}</p>
              <p className="property-detail">Total Rooms: {property.totalRooms}</p>
              <p className="property-detail">Occupied Rooms: {getOccupiedRooms(property.id)}</p>
              <p className="property-detail">Rent per Room: ₦{property.rentPerRoom.toLocaleString()}</p>
              <p className="property-detail">Lease Period: {property.leasePeriod || 'N/A'} months</p> {/* Display lease period */}
              <div className="bottom">
                <button className="button-secondary" onClick={() => handleViewPropertyDetails(property)}>
                  View Details
                </button>
                <button className="button-secondary" onClick={() => handleEditPropertyClick(property)}>
                  Edit
                </button>
                <button className="button-secondary" onClick={() => handleRequestMaintenance(property)}>
                  Request Maintenance
                </button>
                <button className="button-danger" onClick={() => handleDeleteProperty(property)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-message">No properties added yet. Click "Add New Property" to get started!</p>
        )}
      </div>

      {/* Add/Edit Property Modal */}
      <Modal isOpen={isPropertyModalOpen} onClose={() => setIsPropertyModalOpen(false)} title={currentProperty ? "Edit Property" : "Add New Property"}>
        <form onSubmit={handleSubmitProperty} className="form-spacing">
          <div className="form-group">
            <label htmlFor="propertyName" className="form-label">Property Name</label>
            <input
              type="text"
              id="propertyName"
              className="form-input"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalRooms" className="form-label">Total Rooms</label>
            <input
              type="number"
              id="totalRooms"
              className="form-input"
              value={totalRooms}
              onChange={(e) => setTotalRooms(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rentPerRoom" className="form-label">Rent per Room (₦)</label>
            <input
              type="number"
              id="rentPerRoom"
              className="form-input"
              value={rentPerRoom}
              onChange={(e) => setRentPerRoom(e.target.value)}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="propertyImageUrl" className="form-label">Property Image URL (Optional)</label>
            <input
              type="url" // Use type="url" for better validation
              id="propertyImageUrl"
              className="form-input"
              value={propertyImageUrl}
              onChange={(e) => setPropertyImageUrl(e.target.value)}
              placeholder="e.g., https://example.com/property.jpg"
            />
          </div>
          <div className="form-group">
            <label htmlFor="leasePeriod" className="form-label">Default Lease Period</label>
            <select
              id="leasePeriod"
              className="form-select"
              value={leasePeriod}
              onChange={(e) => setLeasePeriod(e.target.value)}
              required
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
              <option value="18">18 Months</option>
              <option value="24">24 Months (2 Years)</option>
            </select>
          </div>
          <div className="bottom">
            <button type="button" className="button-secondary" onClick={() => setIsPropertyModalOpen(false)}>Cancel</button>
            <button type="submit" className="button-primary">{currentProperty ? "Update Property" : "Add Property"}</button>
          </div>
        </form>
      </Modal>

      {/* View Property Details Modal */}
      <Modal isOpen={isViewPropertyDetailsModalOpen} onClose={() => setIsViewPropertyDetailsModalOpen(false)} title="Property Details">
        {selectedProperty ? (
          <div className="property-detail-content">
            {selectedProperty.imageUrl && (
              <div className="property-image-container-modal">
                <img
                  src={selectedProperty.imageUrl}
                  alt={`${selectedProperty.name}`}
                  className="property-image-modal"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/E0E0E0/000000?text=No+Image" }}
                />
              </div>
            )}
            <p><strong>Name:</strong> {selectedProperty.name}</p>
            <p><strong>Address:</strong> {selectedProperty.address}</p>
            <p><strong>Total Rooms:</strong> {selectedProperty.totalRooms}</p>
            <p><strong>Occupied Rooms:</strong> {getOccupiedRooms(selectedProperty.id)}</p>
            <p><strong>Available Rooms:</strong> {selectedProperty.totalRooms - getOccupiedRooms(selectedProperty.id)}</p>
            <p><strong>Rent per Room:</strong> ₦{selectedProperty.rentPerRoom.toLocaleString()}</p>
            <p><strong>Default Lease Period:</strong> {selectedProperty.leasePeriod || 'N/A'} months</p>
            <h4 className="modal-subtitle">Tenants in this Property:</h4>
            {tenants.filter(t => t.propertyId === selectedProperty.id).length > 0 ? (
              <ul className="tenant-list-in-property">
                {tenants.filter(t => t.propertyId === selectedProperty.id).map(tenant => (
                  <li key={tenant.id}>{tenant.name} (Rent Due: ₦{tenant.rentDue.toLocaleString()})</li>
                ))}
              </ul>
            ) : (
              <p>No tenants currently assigned to this property.</p>
            )}
          </div>
        ) : (
          <p>No property selected.</p>
        )}
      </Modal>

      {/* Delete Property Confirmation/Request Modal */}
      <Modal isOpen={isDeletePropertyModalOpen} onClose={() => setIsDeletePropertyModalOpen(false)} title={showDirectDeleteConfirmation ? "Confirm Property Deletion" : "Property Deletion Request"}>
        {propertyToDelete && (
          <div className="text-center p-4">
            {showDirectDeleteConfirmation ? (
              <>
                <p className="mb-4 text-lg font-semibold text-red-600">
                  Are you sure you want to delete "{propertyToDelete.name}"?
                </p>
                <p className="mb-6 text-gray-700">
                  This property has no tenants and will be permanently removed. This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button type="button" className="button-secondary" onClick={() => setIsDeletePropertyModalOpen(false)}>Cancel</button>
                  <button type="button" className="button-danger" onClick={confirmDirectDelete}>Delete Permanently</button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-lg font-semibold text-orange-500">
                  This property ("{propertyToDelete.name}") has active tenants.
                </p>
                <p className="mb-6 text-gray-700">
                  A request will be sent to the administrator for review. Deletion will not occur until approved by the admin.
                </p>
                <div className="bottom">
                  <button type="button" className="button-secondary" onClick={() => setIsDeletePropertyModalOpen(false)}>Cancel</button>
                  <button type="button" className="button-primary" onClick={requestAdminDeletion}>Send Request to Admin</button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Maintenance Request Modal */}
      <Modal isOpen={isMaintenanceRequestModalOpen} onClose={() => setIsMaintenanceRequestModalOpen(false)} title={`Request Maintenance for ${propertyForMaintenance?.name || ''}`}>
        {propertyForMaintenance && (
          <form onSubmit={handleSubmitMaintenanceRequest} className="form-spacing">
            <div className="form-group">
              <label htmlFor="maintenanceDescription" className="form-label">Description of Issue</label>
              <textarea
                id="maintenanceDescription"
                className="form-input"
                value={maintenanceDescription}
                onChange={(e) => setMaintenanceDescription(e.target.value)}
                rows="4"
                placeholder="e.g., Leaky faucet in kitchen, AC not cooling, broken window..."
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="maintenanceUrgency" className="form-label">Urgency</label>
              <select
                id="maintenanceUrgency"
                className="form-select"
                value={maintenanceUrgency}
                onChange={(e) => setMaintenanceUrgency(e.target.value)}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="maintenancePreferredDate" className="form-label">Preferred Date</label>
              <input
                type="date"
                id="maintenancePreferredDate"
                className="form-input"
                value={maintenancePreferredDate}
                onChange={(e) => setMaintenancePreferredDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="maintenancePreferredTime" className="form-label">Preferred Time (Optional)</label>
              <input
                type="time"
                id="maintenancePreferredTime"
                className="form-input"
                value={maintenancePreferredTime}
                onChange={(e) => setMaintenancePreferredTime(e.target.value)}
              />
            </div>
            <div className="bottom">
              <button type="button" className="button-secondary" onClick={() => setIsMaintenanceRequestModalOpen(false)}>Cancel</button>
              <button type="submit" className="button-primary">Submit Request</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
