// src/app/landlords/tenants/page.js
// This component displays a list of tenants and allows adding/editing/deleting them.

"use client"; // This directive marks the component as a Client Component

import React, { useState, useContext, useEffect } from "react";
import { DashboardContext } from "@/app/landlords/layout"; // Import the context
import Modal from "@/app/component/landlord/modal"; // Import your generic Modal component
import TenantCard from "@/app/component/landlord/tenantCard"; // Import the new TenantCard component

// New Contact Options Modal Component
function ContactOptionsModal({ isOpen, onClose, tenant, showMessage }) { // Pass showMessage
  if (!isOpen || !tenant) return null;

  const handleContactMethod = (method) => {
    switch (method) {
      case 'cell':
        if (tenant.phone) window.location.href = `tel:${tenant.phone}`;
        else showMessage("Phone number not available for call.", "error");
        break;
      case 'whatsapp':
        // WhatsApp links typically need the number without any formatting, just digits.
        if (tenant.phone) window.open(`https://wa.me/${tenant.phone.replace(/\D/g, '')}`, '_blank');
        else showMessage("Phone number not available for WhatsApp.", "error");
        break;
      case 'email':
        if (tenant.contact) window.location.href = `mailto:${tenant.contact}`;
        else showMessage("Email address not available.", "error");
        break;
      case 'text':
        if (tenant.phone) window.location.href = `sms:${tenant.phone}`;
        else showMessage("Phone number not available for text message.", "error");
        break;
      default:
        showMessage("No specific contact method selected.", "info");
        break;
    }
    onClose(); // Close modal after attempting contact
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Contact ${tenant.name}`}>
      <div className="contact-options-content">
        <p className="mb-4 text-center text-gray-700">How would you like to contact {tenant.name}?</p>
        <div className="contact-buttons-grid">
          <button className="button-contact" onClick={() => handleContactMethod('email')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email
          </button>
          <button className="button-contact" onClick={() => handleContactMethod('cell')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.7 2.16 12.67 12.67 0 0 0 6.7 6.7 2 2 0 0 1 2.16-1.7c1.11.23 2.2.53 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call
          </button>
          <button className="button-contact" onClick={() => handleContactMethod('whatsapp')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 7.5c-2.4 0-4.5 1.44-5.5 3.5-1.1-2.1-3.2-3.5-5.5-3.5C3.3 7.5 1 9.8 1 12.5S3.3 17.5 5.5 17.5c2.4 0 4.5-1.44 5.5-3.5 1.1 2.1 3.2 3.5 5.5 3.5 2.2 0 4.5-2.3 4.5-5S18.7 7.5 16.5 7.5z"/></svg>
            WhatsApp
          </button>
          <button className="button-contact" onClick={() => handleContactMethod('text')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a2.5 2.5 0 0 0-5 0v2.5a2.5 2.5 0 0 0 5 0z"/><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h.5a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5H15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5H9a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5H12a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z"/></svg>
            Text Message
          </button>
        </div>
      </div>
    </Modal>
  );
}


export default function TenantsPage() {
  // Use context to access shared state and functions from DashboardLayout
  const { showMessage, tenants, setTenants, properties, setProperties, addNotification } = useContext(DashboardContext); // Consume properties and setProperties from context

  // New state for pending applications
  const [pendingApplications, setPendingApplications] = useState([
    {
      id: "app1",
      name: "Eve Adams",
      desiredPropertyId: "p1",
      applicationDate: "2025-07-28",
      contact: "eve@example.com",
      phone: "999-888-7777",
      notes: "Interested in a 2-bedroom unit.",
    },
    {
      id: "app2",
      name: "Frank White",
      desiredPropertyId: "p3",
      applicationDate: "2025-07-29",
      contact: "frank@example.com",
      phone: "123-456-7890",
      notes: "Looking for a quiet place near university.",
    },
  ]);

  // New state for pending lease end requests
  const [pendingLeaseEndRequests, setPendingLeaseEndRequests] = useState([
    // Example: { tenantId: "t1", name: "Alice Smith", propertyId: "p1", requestDate: "2025-07-31", reason: "Lease Expired", isEarlyTermination: false }
  ]);


  // --- State for Modals and Filters ---
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all"); // Filter by property ID

  // States for Request Lease End Modal (new)
  const [isRequestLeaseEndModalOpen, setIsRequestLeaseEndModalOpen] = useState(false);
  const [tenantToRequestLeaseEnd, setTenantToRequestLeaseEnd] = useState(null);
  const [leaseEndReason, setLeaseEndReason] = useState("");

  // New states for Remove Tenant Warning Modal
  const [isRemoveTenantWarningModalOpen, setIsRemoveTenantWarningModalOpen] = useState(false);
  const [tenantToRemove, setTenantToRemove] = useState(null);


  // State for application approval modal
  const [isApproveApplicationModalOpen, setIsApproveApplicationModalOpen] = useState(false);
  const [applicationToApprove, setApplicationToApprove] = useState(null);
  const [selectedPropertyForApproval, setSelectedPropertyForApproval] = useState("");

  // State for viewing all pending lease end requests modal
  const [isAllPendingLeaseEndsModalOpen, setIsAllPendingLeaseEndsModalOpen] = useState(false);

  // States for Contact Options Modal
  const [isContactOptionsModalOpen, setIsContactOptionsModalOpen] = useState(false);
  const [tenantForContactOptions, setTenantForContactOptions] = useState(null);


  // --- Helper Functions ---
  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId); // Use properties from context
    return property ? property.name : "N/A";
  };

  // --- Tenant Action Handlers ---
  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setIsViewDetailsModalOpen(true);
  };

  // Updated handleContactTenant to open the new ContactOptionsModal
  const handleContactTenant = (tenant) => {
    setTenantForContactOptions(tenant);
    setIsContactOptionsModalOpen(true);
    console.log("Opening contact options modal for:", tenant.name); // Debugging log
  };

  // Function for direct lease termination (no admin request) - only called by confirmRemoveTenant
  const directEndLease = (tenantId, tenantName, propertyId) => {
    setTenants((prevTenants) => prevTenants.filter((t) => t.id !== tenantId));
    setProperties((prevProperties) => // Update central properties state
      prevProperties.map((p) =>
        p.id === propertyId ? { ...p, occupiedRooms: p.occupiedRooms - 1 } : p
      )
    );
    showMessage(`Lease for "${tenantName}" has been directly ended. Tenant will receive a termination notification.`, "success");
    addNotification(`Tenant "${tenantName}" has been removed from ${getPropertyName(propertyId)}.`, 'tenant_removed', { tenantName, propertyName: getPropertyName(propertyId) });
  };

  // This handler now ALWAYS opens the Request Lease End modal (if "End Lease" button is clicked)
  const handleEndLease = (tenant) => {
    setTenantToRequestLeaseEnd(tenant);
    setLeaseEndReason(""); // Reset reason
    setIsRequestLeaseEndModalOpen(true);
  };

  // New function to handle the "Remove Tenant" action from TenantCard
  const handleRemoveTenant = (tenant) => {
    setTenantToRemove(tenant);
    setIsRemoveTenantWarningModalOpen(true);
  };

  // Function to confirm removal after warning
  const confirmRemoveTenant = () => {
    if (tenantToRemove) {
      showMessage(`Tenant "${tenantToRemove.name}" is being removed. Based on local law, the tenant is given 2 days to vacate or pay up.`, "warning");
      // After the warning, proceed with actual removal
      directEndLease(tenantToRemove.id, tenantToRemove.name, tenantToRemove.propertyId);
      setIsRemoveTenantWarningModalOpen(false);
      setTenantToRemove(null);
    }
  };


  // New function to submit the lease end request to admin
  const submitLeaseEndRequest = (e) => {
    e.preventDefault();
    if (!leaseEndReason) {
      showMessage("Please select a reason for ending the lease.", "error");
      return;
    }

    const isEarlyTermination = new Date(tenantToRequestLeaseEnd.leaseEnd) > new Date();

    const request = {
      tenantId: tenantToRequestLeaseEnd.id,
      name: tenantToRequestLeaseEnd.name,
      propertyId: tenantToRequestLeaseEnd.propertyId,
      requestDate: new Date().toISOString().split('T')[0],
      reason: leaseEndReason,
      isEarlyTermination: isEarlyTermination,
      status: "Pending" // Status of the request
    };

    setPendingLeaseEndRequests((prevRequests) => [...prevRequests, request]);
    showMessage(`Request to end lease for "${tenantToRequestLeaseEnd.name}" sent to admin for approval.`, "info");
    setIsRequestLeaseEndModalOpen(false);
    setTenantToRequestLeaseEnd(null);
    setLeaseEndReason("");
  };


  // Admin action: Approve pending lease end request
  const handleApprovePendingLeaseEnd = (requestId) => {
    const request = pendingLeaseEndRequests.find(req => req.tenantId === requestId);
    if (request) {
      // Decrement occupiedRooms for the property
      setProperties((prevProperties) => // Update central properties state
        prevProperties.map((p) =>
          p.id === request.propertyId ? { ...p, occupiedRooms: p.occupiedRooms - 1 } : p
        )
      );
      setTenants((prevTenants) => prevTenants.filter((t) => t.id !== request.tenantId));
      setPendingLeaseEndRequests((prevRequests) => prevRequests.filter(req => req.tenantId !== requestId));
      showMessage(`Lease for "${request.name}" has been approved and ended.`, "success");
      addNotification(`Lease for "${request.name}" at ${getPropertyName(request.propertyId)} has been formally ended.`, 'general', { tenantName: request.name, propertyName: getPropertyName(request.propertyId) });
    }
  };

  // Admin action: Cancel pending lease end request
  const handleCancelPendingLeaseEndRequest = (requestId) => {
    const request = pendingLeaseEndRequests.find(req => req.tenantId === requestId);
    if (request) {
      setPendingLeaseEndRequests((prevRequests) => prevRequests.filter(req => req.tenantId !== requestId));
      showMessage(`Lease end request for "${request.name}" has been cancelled.`, "info");
      addNotification(`Lease end request for "${request.name}" at ${getPropertyName(request.propertyId)} has been cancelled.`, 'general', { tenantName: request.name, propertyName: getPropertyName(request.propertyId) });
    }
  };


  // --- Application Management Handlers ---
  const handleApproveApplication = (application) => {
    setApplicationToApprove(application);
    setIsApproveApplicationModalOpen(true);
    setSelectedPropertyForApproval(application.desiredPropertyId || ""); // Pre-select if desired property exists
  };

  const handleRejectApplication = (applicationId) => {
    setPendingApplications((prevApps) => prevApps.filter((app) => app.id !== applicationId));
    showMessage("Application rejected.", "info");
    addNotification(`Application from ${pendingApplications.find(app => app.id === applicationId)?.name || 'an applicant'} has been rejected.`, 'general');
  };

  const confirmApproveApplication = (e) => {
    e.preventDefault();
    const selectedProp = properties.find(p => p.id === selectedPropertyForApproval); // Use properties from context

    if (!selectedPropertyForApproval) {
      showMessage("Please select a property for the new tenant.", "error");
      return;
    }
    if (!selectedProp || (selectedProp.totalRooms - selectedProp.occupiedRooms) <= 0) {
      showMessage("Selected property has no available rooms. Please choose another.", "error");
      return;
    }

    const newTenant = {
      id: `t${Date.now()}`, // Unique ID for new tenant
      name: applicationToApprove.name,
      propertyId: selectedPropertyForApproval,
      rentDue: selectedProp.rentPerRoom || 0, // Set rent based on property
      rentDueDate: new Date().toISOString().split('T')[0], // Set current date as rent due date
      overdue: false, // Not overdue on approval
      paymentStatus: 'due', // New tenant, rent is due
      contact: applicationToApprove.contact,
      phone: applicationToApprove.phone,
      leaseStart: new Date().toISOString().split('T')[0], // Lease starts today
      leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Lease ends 1 year from now
      imageUrl: applicationToApprove.imageUrl || "", // Carry over image URL if exists
    };

    setTenants((prevTenants) => [...prevTenants, newTenant]);
    setPendingApplications((prevApps) => prevApps.filter((app) => app.id !== applicationToApprove.id));
    
    // Increment occupied rooms for the selected property
    setProperties((prevProperties) => // Update central properties state
      prevProperties.map((p) =>
        p.id === selectedPropertyForApproval ? { ...p, occupiedRooms: p.occupiedRooms + 1 } : p
      )
    );

    showMessage(`Application from ${applicationToApprove.name} approved! Tenant added to ${getPropertyName(selectedPropertyForApproval)}.`, "success");
    addNotification(`Apartment request for ${applicationToApprove.name} at ${getPropertyName(selectedPropertyForApproval)} has been approved!`, 'apartment_approved', { tenantName: applicationToApprove.name, propertyName: getPropertyName(selectedPropertyForApproval) });

    setIsApproveApplicationModalOpen(false);
    setApplicationToApprove(null);
    setSelectedPropertyForApproval("");
  };


  // --- Filtered Tenants Logic ---
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = searchTerm.toLowerCase() === '' || 
                          tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getPropertyName(tenant.propertyId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPropertyFilter = filterProperty === "all" || tenant.propertyId === filterProperty;
    return matchesSearch && matchesPropertyFilter;
  });

  return (
    <div className="tenants-page-container">
      <div className="page-header">
        <h1 className="page-title">Tenant Management</h1>
        {/* No direct "Add New Tenant" button here */}
      </div>

      {/* --- Filters Section --- */}
      <div className="filters-section">
     <div>
   <input
          type="text"
          placeholder="Search tenants by name or property..."
          className="form-input search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
     </div>
        <select
          className="form-select property-filter"
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
        >
          <option value="all">All Properties</option>
          {properties.map((property) => ( // Use properties from context
            <option key={property.id} value={property.id}>
              {property.name} (Available Rooms: {property.totalRooms - property.occupiedRooms})
            </option>
          ))}
        </select>
      </div>

      {/* --- Tenant Cards Grid --- */}
      <div className="tenant-cards-grid">
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              propertyName={getPropertyName(tenant.propertyId)}
              onViewDetails={handleViewDetails}
              onContactTenant={handleContactTenant} // Pass the updated handler
              onEndLease={handleEndLease} // Pass end lease handler (now opens new modal)
              onRemoveTenant={handleRemoveTenant} // Pass new remove tenant handler
              onDeleteTenant={() => showMessage("Permanent delete initiated (not implemented yet)", "info")} // Placeholder for permanent delete
            />
          ))
        ) : (
          <p className="no-data-message">No tenants found matching your criteria.</p>
        )}
      </div>

      {/* --- Pending Applications Section --- */}
      <div className="pending-applications-section">
        <h2 className="section-title">Pending Applications ({pendingApplications.length})</h2>
        {pendingApplications.length > 0 ? (
          <div className="application-cards-grid">
            {pendingApplications.map((application) => (
              <div key={application.id} className="application-card">
                <h3 className="application-name">{application.name}</h3>
                <p className="application-detail">Desired Property: {getPropertyName(application.desiredPropertyId)}</p>
                <p className="application-detail">Applied On: {application.applicationDate}</p>
                <div className="application-actions">
                  <button className="button-primary" onClick={() => handleApproveApplication(application)}>Approve</button>
                  <button className="button-secondary" onClick={() => handleRejectApplication(application.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">No pending tenant applications.</p>
        )}
      </div>

      {/* --- Pending Lease End Requests Section --- */}
      <div className="pending-lease-ends-section">
        <h2 className="section-title">Pending Lease End Requests ({pendingLeaseEndRequests.length})</h2>
        {pendingLeaseEndRequests.length > 0 ? (
          <>
            <p className="section-description">These requests are awaiting administrator approval.</p>
            <button className="button-secondary view-all-button" onClick={() => setIsAllPendingLeaseEndsModalOpen(true)}>
              View All Pending Lease Ends
            </button>
          </>
        ) : (
          <p className="no-data-message">No pending lease end requests.</p>
        )}
      </div>


      {/* View Tenant Details Modal */}
      <Modal isOpen={isViewDetailsModalOpen} onClose={() => setIsViewDetailsModalOpen(false)} title="Tenant Details">
        {selectedTenant ? (
          <div className="tenant-detail-content">
            <div className="tenant-detail-avatar">
              {selectedTenant.imageUrl ? (
                <img src={selectedTenant.imageUrl} alt={selectedTenant.name} onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/ADD8E6/000000?text=IMG"}} />
              ) : (
                // Fallback to initials or a generic user icon
                selectedTenant.name ? (
                  selectedTenant.name.charAt(0).toUpperCase()
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )
              )}
            </div>
            <p><strong>Name:</strong> {selectedTenant.name}</p>
            <p><strong>Property:</strong> {getPropertyName(selectedTenant.propertyId)}</p>
            <p>
              <strong>Rent Due:</strong><span className={`price ${selectedTenant.paymentStatus === 'part_payment' ? 'orange' : (selectedTenant.overdue ? "red" : "green")}`}>₦{selectedTenant.rentDue.toLocaleString()}
              {selectedTenant.paymentStatus === 'part_payment' && ` (Balance: ₦${selectedTenant.rentDue.toLocaleString()})`}</span>
            </p>
            <p><strong>Due Date:</strong> {selectedTenant.rentDueDate}</p>
            <p><strong>Status:</strong><span className={`status ${selectedTenant.paymentStatus === 'part_payment' ? 'orange' : (selectedTenant.overdue ? "red" : "green")}`}> {selectedTenant.paymentStatus === 'part_payment' ? 'Part Payment' : (selectedTenant.overdue ? "Overdue" : "Current")}</span></p>
            <p><strong>Email:</strong> {selectedTenant.contact}</p>
            <p><strong>Phone:</strong> {selectedTenant.phone || 'N/A'}</p>
            <p><strong>Lease Start:</strong> {selectedTenant.leaseStart || 'N/A'}</p>
            <p><strong>Lease End:</strong> {selectedTenant.leaseEnd || 'N/A'}</p>
            {/* Removed direct payment recording buttons from here */}
          </div>
        ) : (
          <p>No tenant selected.</p>
        )}
      </Modal>

      {/* Request Lease End Modal */}
      <Modal isOpen={isRequestLeaseEndModalOpen} onClose={() => setIsRequestLeaseEndModalOpen(false)} title="Request Lease End">
        {tenantToRequestLeaseEnd ? (
          <form onSubmit={submitLeaseEndRequest} className="form-spacing">
            <p className="mb-4">Requesting to end lease for <strong>{tenantToRequestLeaseEnd.name}</strong> at {getPropertyName(tenantToRequestLeaseEnd.propertyId)}.</p>
            
            <div className="form-group">
              <label htmlFor="lease-end-reason" className="form-label">Reason for Lease End:</label>
              <select
                id="lease-end-reason"
                name="reason"
                className="form-select"
                value={leaseEndReason}
                onChange={(e) => setLeaseEndReason(e.target.value)}
                required
              >
                <option value="">-- Select a Reason --</option>
                <option
                  value="Lease Expired"
                  disabled={new Date(tenantToRequestLeaseEnd.leaseEnd) > new Date()} // Disable if lease is not expired
                >
                  Lease Expired (On or After {tenantToRequestLeaseEnd.leaseEnd})
                </option>
                <option value="Tenant Disturbance">Tenant Disturbance</option>
                <option value="Mutual Agreement">Mutual Agreement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {(new Date(tenantToRequestLeaseEnd.leaseEnd) > new Date() || tenantToRequestLeaseEnd.rentDue < 0) && (
              <div className="warning-message">
                <p>⚠️ **Warning:** This is an early lease termination request or involves a tenant overpayment. If approved by the admin, a part payment of any remaining rent already paid by the tenant for the period beyond the termination date might be required, depending on the terms of the lease agreement and platform policy.</p>
              </div>
            )}

            <div className="bottom">
              <button type="button" className="button-secondary" onClick={() => setIsRequestLeaseEndModalOpen(false)}>Cancel</button>
              <button type="submit" className="button-danger">Submit Request</button>
            </div>
          </form>
        ) : (
          <p>No tenant selected for lease end request.</p>
        )}
      </Modal>

      {/* Approve Application Modal */}
      <Modal isOpen={isApproveApplicationModalOpen} onClose={() => setIsApproveApplicationModalOpen(false)} title="Approve Application">
        {applicationToApprove ? (
          <form onSubmit={confirmApproveApplication} className="form-spacing">
            <p className="mb-4">Approve <strong>{applicationToApprove.name}</strong> for which property?</p>
            <div className="form-group">
              <label htmlFor="property-for-approval" className="form-label">Select Property:</label>
              <select
                id="property-for-approval"
                name="propertyId"
                className="form-select"
                value={selectedPropertyForApproval}
                onChange={(e) => setSelectedPropertyForApproval(e.target.value)}
                required
              >
                <option value="">-- Select a Property --</option>
                {properties.map((property) => ( // Use properties from context
                  <option
                    key={property.id}
                    value={property.id}
                    disabled={(property.totalRooms - property.occupiedRooms) <= 0} // Disable if no rooms available
                  >
                    {property.name} (Available Rooms: {property.totalRooms - property.occupiedRooms})
                    {(property.totalRooms - property.occupiedRooms) <= 0 && " (Full)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="bottom">
              <button type="button" className="button-secondary" onClick={() => setIsApproveApplicationModalOpen(false)}>Cancel</button>
              <button type="submit" className="button-primary">Approve</button>
            </div>
          </form>
        ) : (
          <p>No application selected for approval.</p>
        )}
      </Modal>

      {/* All Pending Lease End Requests Modal */}
      <Modal
        isOpen={isAllPendingLeaseEndsModalOpen}
        onClose={() => setIsAllPendingLeaseEndsModalOpen(false)}
        title="All Pending Lease End Requests"
        className="slide-from-left" // Added the class for the new transition
      >
        {pendingLeaseEndRequests.length > 0 ? (
          <div className="pending-requests-list">
            {pendingLeaseEndRequests.map((request) => (
              <div key={request.tenantId} className="pending-request-item">
                <p><strong>Tenant:</strong> {request.name}</p>
                <p><strong>Property:</strong> {getPropertyName(request.propertyId)}</p>
                <p><strong>Requested On:</strong> {request.requestDate}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p><strong>Type:</strong> {request.isEarlyTermination ? "Early Termination Request" : "Standard Lease End Request"}</p>
                <div className="bottom">
                  <button className="button-primary" onClick={() => handleApprovePendingLeaseEnd(request.tenantId)}>Approve</button>
                  <button className="button-secondary" onClick={() => handleCancelPendingLeaseEndRequest(request.tenantId)}>Cancel Request</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">No pending lease end requests.</p>
        )}
      </Modal>

      {/* Remove Tenant Warning Modal (New) */}
      <Modal isOpen={isRemoveTenantWarningModalOpen} onClose={() => setIsRemoveTenantWarningModalOpen(false)} title="Remove Tenant Warning">
        {tenantToRemove ? (
          <div className="remove-tenant-warning-content">
            <p className="warning-message">
              ⚠️ Warning: Removing {tenantToRemove.name} due to overdue rent and expired lease.
              Based on local law, the tenant is typically given a notice period (e.g., 2 days) to vacate the property or settle outstanding payments. Please ensure all legal requirements are met before proceeding.
            </p>
            <div className="bottom">
              <button type="button" className="button-secondary" onClick={() => setIsRemoveTenantWarningModalOpen(false)}>Cancel</button>
              <button type="button" className="button-danger" onClick={confirmRemoveTenant}>Proceed with Removal</button>
            </div>
          </div>
        ) : (
          <p>No tenant selected for removal.</p>
        )}
      </Modal>

      {/* Contact Options Modal */}
      <ContactOptionsModal
        isOpen={isContactOptionsModalOpen}
        onClose={() => setIsContactOptionsModalOpen(false)}
        tenant={tenantForContactOptions}
        showMessage={showMessage}
      />
    </div>
  );
}
