"use client";

import React, { useState, useContext } from "react";
import { DashboardContext } from "@/app/landlords/layout";
import Modal from "@/app/component/landlord/modal";
import TenantCard from "@/app/component/landlord/tenantCard";
import ContactOptionsModal from "@/app/component/landlord/contactOptionsModal";

// Main Tenant Management Page Component
export default function TenantsPage() {
  const {
    showMessage,
    tenants,
    setTenants,
    properties,
    setProperties,
    addNotification,
  } = useContext(DashboardContext);

  // Consolidated state for all modals, including new negotiation details
  const [modalState, setModalState] = useState({
    type: null, // e.g., 'details', 'contact', 'endLeaseReason', 'removeWarning', 'approveApplication', 'reportToAuthorities'
    data: null, // The tenant or application object associated with the modal
    negotiation: {
      reason: "",
      landlordOffer: 0,
      status: "pending", // 'pending', 'landlord_offer', 'tenant_offer', 'agreed', 'tenant_non-responsive'
      tenantCounterOffer: null,
      lastOfferDate: null, // Tracks when the last offer was sent
    },
  });

  const closeModal = () => {
    setModalState({
      type: null,
      data: null,
      negotiation: {
        reason: "",
        landlordOffer: 0,
        status: "pending",
        tenantCounterOffer: null,
        lastOfferDate: null,
      },
    });
  };

  // State for pending applications (kept separate as it's not a modal state)
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

  // --- Helper Functions ---
  const getPropertyName = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.name : "N/A";
  };

  const isRentOverdue = (rentDueDate) => {
    if (!rentDueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(rentDueDate);
    return dueDate < today;
  };

  // New helper function to check if the lease has expired
  const isLeaseDue = (leaseEndDate) => {
    if (!leaseEndDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(leaseEndDate);
    return endDate < today;
  };

  // --- Tenant Action Handlers ---
  const handleViewDetails = (tenant) => {
    setModalState({ ...modalState, type: "details", data: tenant });
  };

  const handleContactTenant = (tenant) => {
    setModalState({ ...modalState, type: "contact", data: tenant });
  };

  const handleEndLease = (tenant) => {
    setModalState({ ...modalState, type: "endLeaseReason", data: tenant });
  };

  // This function calculates the buyout offer using the percentage-based scale.
  const handleReasonSubmit = (reason) => {
    let initialOffer = 0;
    let daysStayed = 0;

    // Dynamically calculate the number of days the tenant has stayed
    if (modalState.data && modalState.data.leaseStart) {
      const leaseStartDate = new Date(modalState.data.leaseStart);
      const today = new Date();
      const timeDifference = today.getTime() - leaseStartDate.getTime();
      daysStayed = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }

    // Apply a penalty based on the number of days stayed
    let penaltyMessage = "";
    let penaltyRate = 0;

    // This is the percentage-based scale logic:
    if (daysStayed < 10) {
      // 10% penalty for staying less than 10 days
      penaltyRate = 0.90;
      penaltyMessage = `Since the tenant has been in the property for less than 10 days, a 10% fee has been deducted from the initial buyout offer.`;
    } else if (daysStayed >= 10 && daysStayed < 30) {
      // 5% penalty for staying between 10 and 30 days
      penaltyRate = 0.95;
      penaltyMessage = `Since the tenant has been in the property for between 10 and 30 days, a 5% fee has been deducted from the initial buyout offer.`;
    } else {
      // 3% penalty for staying 30 days or more
      penaltyRate = 0.97;
      penaltyMessage = `Since the tenant has been in the property for 30 days or more, a 3% fee has been deducted from the initial buyout offer.`;
    }

    initialOffer = modalState.data.rentDue * penaltyRate;

    setModalState({
      ...modalState,
      type: "endLeaseOffer",
      negotiation: {
        ...modalState.negotiation,
        reason: reason,
        landlordOffer: initialOffer,
        penaltyMessage: penaltyMessage, // Add the message to the state
        daysStayed: daysStayed, // Add days stayed to state for display
      },
    });
  };

  const handleOfferSubmit = (offer) => {
    setModalState({
      ...modalState,
      type: "endLeaseNegotiation",
      negotiation: {
        ...modalState.negotiation,
        landlordOffer: offer,
        status: "landlord_offer",
        lastOfferDate: new Date().toISOString(), // Record the time the offer was sent
      },
    });
    showMessage(
      `Your buyout offer of ₦${offer.toLocaleString()} has been sent to ${
        modalState.data.name
      }.`,
      "info"
    );
  };

  const simulateTenantAccept = () => {
    setModalState({
      ...modalState,
      negotiation: { ...modalState.negotiation, status: "agreed" },
    });
    showMessage(
      `Agreement reached! The lease with ${modalState.data.name} is now terminated. The tenant has a 1-week period to vacate the property.`,
      "success"
    );
    directEndLease(
      modalState.data.id,
      modalState.data.name,
      modalState.data.propertyId
    );
  };

  const simulateTenantCounterOffer = () => {
    const counterOffer = Math.ceil(modalState.negotiation.landlordOffer * 1.1);
    setModalState({
      ...modalState,
      negotiation: {
        ...modalState.negotiation,
        tenantCounterOffer: counterOffer,
        status: "tenant_offer",
      },
    });
    showMessage(
      `Tenant ${
        modalState.data.name
      } has sent a counter-offer of ₦${counterOffer.toLocaleString()}.`,
      "warning"
    );
  };

  const handleLandlordAcceptCounter = () => {
    setModalState({
      ...modalState,
      negotiation: { ...modalState.negotiation, status: "agreed" },
    });
    showMessage(
      `Agreement reached! The lease with ${modalState.data.name} is now terminated. The tenant has a 1-week period to vacate the property.`,
      "success"
    );
    directEndLease(
      modalState.data.id,
      modalState.data.name,
      modalState.data.propertyId
    );
  };

  const handleLandlordNewOffer = () => {
    setModalState({
      ...modalState,
      type: "endLeaseOffer",
      negotiation: {
        ...modalState.negotiation,
        landlordOffer: 0,
        status: "landlord_offer",
      },
    });
  };

  const handleTenantDeclinesNegotiation = () => {
    setModalState({
      ...modalState,
      type: "reportToAuthorities",
      negotiation: { ...modalState.negotiation, status: "tenant_declined" },
    });
  };

  const handleCheckForTenantResponse = () => {
    const offerDate = new Date(modalState.negotiation.lastOfferDate);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    if (offerDate < twoDaysAgo) {
      setModalState({
        ...modalState,
        type: "reportToAuthorities",
        negotiation: {
          ...modalState.negotiation,
          status: "tenant_non_responsive",
        },
      });
    } else {
      showMessage(
        "The tenant still has time to respond to your offer.",
        "info"
      );
    }
  };

  const directEndLease = (tenantId, tenantName, propertyId) => {
    setTenants((prevTenants) => prevTenants.filter((t) => t.id !== tenantId));
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === propertyId ? { ...p, occupiedRooms: p.occupiedRooms - 1 } : p
      )
    );
    addNotification(
      `Tenant "${tenantName}" has been removed from ${getPropertyName(
        propertyId
      )}.`,
      "tenant_removed",
      { tenantName, propertyName: getPropertyName(propertyId) }
    );
    closeModal();
  };

  const handleRemoveTenant = (tenant) => {
    setModalState({ type: "removeWarning", data: tenant });
  };

  const confirmRemoveTenant = () => {
    if (modalState.data) {
      showMessage(
        `Tenant "${modalState.data.name}" is being removed. Based on local law, the tenant is given 2 days to vacate or pay up.`,
        "warning"
      );
      directEndLease(
        modalState.data.id,
        modalState.data.name,
        modalState.data.propertyId
      );
    }
  };

  const handleApproveApplication = (application) => {
    setModalState({
      ...modalState,
      type: "approveApplication",
      data: application,
    });
  };

  const handleRejectApplication = (applicationId) => {
    setPendingApplications((prevApps) =>
      prevApps.filter((app) => app.id !== applicationId)
    );
    showMessage("Application rejected.", "info");
    addNotification(
      `Application from ${
        pendingApplications.find((app) => app.id === applicationId)?.name ||
        "an applicant"
      } has been rejected.`,
      "general"
    );
  };

  const confirmApproveApplication = (e) => {
    e.preventDefault();
    const selectedPropertyId = e.target.propertyId.value;
    const selectedProp = properties.find((p) => p.id === selectedPropertyId);

    if (
      !selectedPropertyId ||
      !selectedProp ||
      selectedProp.totalRooms - selectedProp.occupiedRooms <= 0
    ) {
      showMessage(
        "Selected property has no available rooms or is invalid.",
        "error"
      );
      return;
    }

    const applicationToApprove = modalState.data;
    const newTenant = {
      id: `t${Date.now()}`,
      name: applicationToApprove.name,
      propertyId: selectedPropertyId,
      rentDue: selectedProp.rentPerRoom || 0,
      rentDueDate: new Date().toISOString().split("T")[0],
      overdue: false,
      paymentStatus: "due",
      contact: applicationToApprove.contact,
      phone: applicationToApprove.phone,
      leaseStart: new Date().toISOString().split("T")[0],
      leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      imageUrl: applicationToApprove.imageUrl || "",
    };

    setTenants((prevTenants) => [...prevTenants, newTenant]);
    setPendingApplications((prevApps) =>
      prevApps.filter((app) => app.id !== applicationToApprove.id)
    );
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === selectedPropertyId
          ? { ...p, occupiedRooms: p.occupiedRooms + 1 }
          : p
      )
    );

    showMessage(
      `Application from ${
        applicationToApprove.name
      } approved! Tenant added to ${getPropertyName(selectedPropertyId)}.`,
      "success"
    );
    addNotification(
      `Apartment request for ${applicationToApprove.name} at ${getPropertyName(
        selectedPropertyId
      )} has been approved!`,
      "apartment_approved",
      {
        tenantName: applicationToApprove.name,
        propertyName: getPropertyName(selectedPropertyId),
      }
    );
    closeModal();
  };

  // --- Filtered Tenants Logic ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      searchTerm.toLowerCase() === "" ||
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPropertyName(tenant.propertyId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesPropertyFilter =
      filterProperty === "all" || tenant.propertyId === filterProperty;
    return matchesSearch && matchesPropertyFilter;
  });

  return (
    <div className="tenants-page-container">
      <div className="page-header">
        <h1 className="page-title">Tenant Management</h1>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search tenants by name or property..."
          className="form-input search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select property-filter"
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
        >
          <option value="all">All Properties</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name} (Available Rooms:{" "}
              {property.totalRooms - property.occupiedRooms})
            </option>
          ))}
        </select>
      </div>

      <div className="tenant-cards-grid">
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              propertyName={getPropertyName(tenant.propertyId)}
              isLeaseDue={isLeaseDue(tenant.leaseEnd)} // Pass the new prop
              onViewDetails={handleViewDetails}
              onContactTenant={handleContactTenant}
              onEndLease={handleEndLease}
              onRemoveTenant={handleRemoveTenant}
              onDeleteTenant={() =>
                showMessage(
                  "Permanent delete initiated (not implemented yet)",
                  "info"
                )
              }
            />
          ))
        ) : (
          <p className="no-data-message">
            No tenants found matching your criteria.
          </p>
        )}
      </div>

      <div className="pending-applications-section">
        <h2 className="section-title">
          Pending Applications ({pendingApplications.length})
        </h2>
        {pendingApplications.length > 0 ? (
          <div className="application-cards-grid">
            {pendingApplications.map((application) => (
              <div key={application.id} className="application-card">
                <h3 className="application-name">{application.name}</h3>
                <p className="application-detail">
                  Desired Property:{" "}
                  {getPropertyName(application.desiredPropertyId)}
                </p>
                <p className="application-detail">
                  Applied On: {application.applicationDate}
                </p>
                <div className="application-actions">
                  <button
                    className="button-primary"
                    onClick={() => handleApproveApplication(application)}
                  >
                    Approve
                  </button>
                  <button
                    className="button-secondary"
                    onClick={() => handleRejectApplication(application.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">No pending tenant applications.</p>
        )}
      </div>

      {/* --- Modals Section --- */}

      {modalState.type === "details" && (
        <Modal isOpen={true} onClose={closeModal} title="Tenant Details">
          <div className="tenant-detail-content">
            <div className="tenant-detail-avatar">
              {modalState.data.imageUrl ? (
                <img
                  src={modalState.data.imageUrl}
                  alt={modalState.data.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100/ADD8E6/000000?text=IMG";
                  }}
                />
              ) : modalState.data.name ? (
                modalState.data.name.charAt(0).toUpperCase()
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <p>
              <strong>Name:</strong> {modalState.data.name}
            </p>
            <p>
              <strong>Property:</strong>{" "}
              {getPropertyName(modalState.data.propertyId)}
            </p>
            <p>
              <strong>Rent Due:</strong>
              <span
                className={`price ${
                  modalState.data.paymentStatus === "part_payment"
                    ? "orange"
                    : isRentOverdue(modalState.data.rentDueDate)
                    ? "red"
                    : "green"
                }`}
              >
                ₦{modalState.data.rentDue.toLocaleString()}
                {modalState.data.paymentStatus === "part_payment" &&
                  ` (Balance: ₦${modalState.data.rentDue.toLocaleString()})`}
              </span>
            </p>
            <p>
              <strong>Due Date:</strong> {modalState.data.rentDueDate}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`status ${
                  modalState.data.paymentStatus === "part_payment"
                    ? "orange"
                    : isRentOverdue(modalState.data.rentDueDate)
                    ? "red"
                    : "green"
                }`}
              >
                {" "}
                {modalState.data.paymentStatus === "part_payment"
                  ? "Part Payment"
                  : isRentOverdue(modalState.data.rentDueDate)
                  ? "Overdue"
                  : "Current"}
              </span>
            </p>
            <p>
              <strong>Email:</strong> {modalState.data.contact}
            </p>
            <p>
              <strong>Phone:</strong> {modalState.data.phone || "N/A"}
            </p>
            <p>
              <strong>Lease Start:</strong>{" "}
              {modalState.data.leaseStart || "N/A"}
            </p>
            <p>
              <strong>Lease End:</strong> {modalState.data.leaseEnd || "N/A"}
            </p>
          </div>
        </Modal>
      )}

      {modalState.type === "contact" && (
        <ContactOptionsModal
          isOpen={true}
          onClose={closeModal}
          tenant={modalState.data}
          showMessage={showMessage}
        />
      )}

      {modalState.type === "endLeaseReason" && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="End Lease: Provide a Reason"
        >
          <form className="form-spacing">
            <p className="modal-text">
              Please provide a reason for ending the lease with{" "}
              <strong>{modalState.data.name}</strong>. The tenant is in good
              standing, so this will initiate a negotiation for a mutual
              termination.
            </p>
            <textarea
              className="modal-textarea"
              rows="4"
              placeholder="e.g., 'I am selling the property...'"
              value={modalState.negotiation.reason}
              onChange={(e) =>
                setModalState({
                  ...modalState,
                  negotiation: {
                    ...modalState.negotiation,
                    reason: e.target.value,
                  },
                })
              }
            ></textarea>
            <div className="bottom">
              <button onClick={closeModal} className="button-secondary">
                Cancel
              </button>
              <button
                onClick={() =>
                  handleReasonSubmit(modalState.negotiation.reason)
                }
                disabled={!modalState.negotiation.reason}
                className="button-primary"
              >
                Continue
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalState.type === "endLeaseOffer" && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="End Lease: Submit Buyout Offer"
        >
          <>
            <p className="modal-text">
              Based on the tenant's stay of **{modalState.negotiation.daysStayed} days**, a penalty has been applied.
              {modalState.negotiation.penaltyMessage}
              The calculated offer is based on the original rent paid to compensate for the mutual termination.
            </p>
            <label className="modal-label" htmlFor="refundAmount">
              Buyout Amount (₦)
            </label>
            <input
              id="refundAmount"
              type="number"
              min="0"
              className="modal-input"
              value={modalState.negotiation.landlordOffer}
              onChange={(e) =>
                setModalState({
                  ...modalState,
                  negotiation: {
                    ...modalState.negotiation,
                    landlordOffer: e.target.value,
                  },
                })
              }
            />
            <div className="bottom">
              <button onClick={closeModal} className="button-secondary">
                Cancel
              </button>
              <button
                onClick={() =>
                  handleOfferSubmit(modalState.negotiation.landlordOffer)
                }
                className="button-primary"
              >
                Submit Offer
              </button>
            </div>
          </>
        </Modal>
      )}

      {modalState.type === "endLeaseNegotiation" && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Lease Termination Initiated"
        >
          <>
            {modalState.negotiation.status === "landlord_offer" && (
              <>
                <p className="modal-text-large text-center font-bold">
                  Your buyout offer of{" "}
                  <span className="text-green-600">
                    ₦{modalState.negotiation.landlordOffer.toLocaleString()}
                  </span>{" "}
                  has been sent.
                </p>
                <p className="modal-text text-center">
                  The tenant will receive this offer and can either accept it or
                  make a counter-offer.
                </p>
                <div className="bottom">
                  <button
                    onClick={simulateTenantAccept}
                    className="button-success"
                  >
                    Simulate Tenant Accept
                  </button>
                  <button
                    onClick={simulateTenantCounterOffer}
                    className="button-warning"
                  >
                    Simulate Tenant Counter-Offer
                  </button>
                  <button
                    onClick={handleCheckForTenantResponse}
                    className="button-secondary"
                  >
                    Check for Response
                  </button>
                </div>
              </>
            )}
            {modalState.negotiation.status === "tenant_offer" && (
              <>
                <p className="modal-text-large text-center font-bold">
                  The tenant has sent a counter-offer of{" "}
                  <span className="text-yellow-600">
                    ₦
                    {modalState.negotiation.tenantCounterOffer.toLocaleString()}
                  </span>
                  .
                </p>
                <p className="modal-text text-center">
                  You can now accept their offer or submit a new one.
                </p>
                <div className="modal-buttons-center">
                  <button
                    onClick={handleLandlordAcceptCounter}
                    className="button-success"
                  >
                    Accept Counter-Offer
                  </button>
                  <button
                    onClick={handleLandlordNewOffer}
                    className="button-secondary"
                  >
                    Make New Offer
                  </button>
                  <button
                    onClick={handleTenantDeclinesNegotiation}
                    className="button-danger"
                  >
                    Tenant Declines
                  </button>
                </div>
              </>
            )}
            {modalState.negotiation.status === "agreed" && (
              <>
                <p className="modal-text-large text-center font-bold">
                  Agreement Reached!
                </p>
                <p className="modal-text text-center">
                  The lease has been terminated with a final buyout amount of{" "}
                  <span className="text-green-600">
                    ₦
                    {modalState.negotiation.tenantCounterOffer
                      ? modalState.negotiation.tenantCounterOffer.toLocaleString()
                      : modalState.negotiation.landlordOffer.toLocaleString()}
                  </span>
                  . The tenant has a **1-week period** to vacate the property.
                </p>
                <button onClick={closeModal} className="button-primary">
                  Close
                </button>
              </>
            )}
          </>
        </Modal>
      )}

      {modalState.type === "approveApplication" && (
        <Modal isOpen={true} onClose={closeModal} title="Approve Application">
          <form onSubmit={confirmApproveApplication} className="form-spacing">
            <p className="modal-text">
              Approve <strong>{modalState.data.name}</strong> for which
              property?
            </p>
            <div className="form-group">
              <label htmlFor="property-for-approval" className="form-label">
                Select Property:
              </label>
              <select
                id="property-for-approval"
                name="propertyId"
                className="form-select"
                defaultValue={modalState.data.desiredPropertyId || ""}
                required
              >
                <option value="">-- Select a Property --</option>
                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                    disabled={property.totalRooms - property.occupiedRooms <= 0}
                  >
                    {property.name} (Available Rooms:{" "}
                    {property.totalRooms - property.occupiedRooms})
                    {property.totalRooms - property.occupiedRooms <= 0 &&
                      " (Full)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="bottom">
              <button
                type="button"
                className="button-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="button-primary">
                Approve
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalState.type === "removeWarning" && (
        <Modal isOpen={true} onClose={closeModal} title="Remove Tenant Warning">
          <p className="warning-message">
            ⚠️ Warning: Removing {modalState.data.name} due to overdue rent and
            expired lease. Based on local law, the tenant is typically given a
            notice period (e.g., 2 days) to vacate the property or settle
            outstanding payments. Please ensure all legal requirements are met
            before proceeding.
          </p>
          <div className="bottom">
            <button
              type="button"
              className="button-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-danger"
              onClick={confirmRemoveTenant}
            >
              Proceed with Removal
            </button>
          </div>
        </Modal>
      )}

      {modalState.type === "reportToAuthorities" && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Next Steps for Non-Responsive Tenant"
        >
          <p className="modal-text-large">
            The tenant has not responded to your negotiation request.
          </p>
          <p className="modal-text">
            You are required to **report the situation to local authorities
            within 48 hours**. This action formalizes the lease termination
            process.
          </p>
          <button onClick={closeModal} className="button-primary">
            Acknowledge and Close
          </button>
        </Modal>
      )}
    </div>
  );
}
