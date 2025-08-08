// src/components/TenantCard.js
// This component displays individual tenant information and provides action buttons.

import React, { useState } from "react"; // Import useState hook

// TenantCard component receives tenant data and handlers for actions.
const TenantCard = ({
  tenant,
  propertyName,
  onViewDetails,
  onContactTenant,
  onEndLease,
  onRemoveTenant,
}) => {
  // State to manage the visibility of additional action buttons
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Determine styling based on paymentStatus
  let rentDueColorClass = "text-green"; // Default for 'paid' or 'due'
  let statusBadge = null;
  let rentDueText = `Rent Due: ₦${tenant.rentDue.toLocaleString()}`;

  if (tenant.paymentStatus === "overdue") {
    rentDueColorClass = "text-red";
    statusBadge = <span className="tenant-status-badge overdue">Overdue</span>;
  } else if (tenant.paymentStatus === "part_payment") {
    rentDueColorClass = "text-orange"; // Use orange for part payment
    statusBadge = (
      <span className="tenant-status-badge part-payment">Part Payment</span>
    );
    rentDueText = `Balance: ₦${tenant.rentDue.toLocaleString()}`; // Show balance for part payment
  } else if (tenant.paymentStatus === "paid") {
    statusBadge = <span className="tenant-status-badge paid">Paid</span>;
  } else if (tenant.paymentStatus === "due") {
    statusBadge = (
      <span className="tenant-status-badge due-soon">Due Soon</span>
    );
  }

  // Function to toggle the visibility of more actions
  const toggleMoreActions = () => {
    setShowMoreActions(!showMoreActions);
  };

  return (
    <>
      <style></style>
      <div className="tenant-card">
        {/* Tenant Info Section */}
        <div className="tenant-info">
          <div className="tenant-top">
            <h3 className="tenant-name">{tenant.name}</h3>
            {/* Conditional rendering for more actions menu */}
            {showMoreActions && (
              <div className="more-actions-menu">
                <div className="more-actions-menu-inner">
                  <button
                    className="action-button"
                    onClick={() => {
                      onEndLease(tenant);
                      setShowMoreActions(false); // Close menu after action
                    }}
                    aria-label={`End lease for ${tenant.name}`}
                  >
                    End Lease
                  </button>
                  {tenant.overdue && ( // Only show remove button if overdue
                    <button
                      className="action-button button-danger-menu"
                      onClick={() => {
                        onRemoveTenant(tenant);
                        setShowMoreActions(false); // Close menu after action
                      }}
                      aria-label={`Remove ${tenant.name}`}
                    >
                      Remove Tenant
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Ellipsis button to toggle more actions */}
            <button
              className="ellipsis-button"
              onClick={toggleMoreActions}
              aria-label="More actions"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
          <p className="tenant-property">Property: {propertyName}</p>
          <p className={`tenant-rent-due ${rentDueColorClass}`}>
            {rentDueText} on {tenant.rentDueDate}
          </p>
          {statusBadge && <div className="mt-2">{statusBadge}</div>}{" "}
          {/* Render the appropriate status badge */}
        </div>

        {/* Tenant Actions Section */}
        <div className="tenant-actions">
          {/* Always visible buttons */}
          <button
            className="action-button button-secondary"
            onClick={() => onViewDetails(tenant)}
            aria-label={`View details for ${tenant.name}`}
          >
            View Details
          </button>
          <button
            className="action-button button-primary"
            onClick={() => onContactTenant(tenant)}
            aria-label={`Contact ${tenant.name}`}
          >
            Contact
          </button>
        </div>
      </div>
    </>
  );
};

export default TenantCard;
