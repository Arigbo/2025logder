// src/components/TenantCard.js
// This component displays a single tenant's information in a card format
// with actions accessible via an ellipsis menu.

import React, { useState, useRef, useEffect } from "react";

export default function TenantCard({ tenant, propertyName, onViewDetails, onEditTenant, onDeleteTenant, onContactTenant, onEndLease, onRemoveTenant }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Helper to get payment status display text
  const getPaymentStatusText = (status) => {
    if (!status) return 'N/A'; // Handle cases where status might be undefined
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  // Close the menu if a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (actionFn, ...args) => {
    setIsMenuOpen(false); // Close menu after action
    if (actionFn) {
      actionFn(...args);
    }
  };

  return (
    <div className="tenant-card">
      <div className="tenant-image-container">
        <img
          src={tenant.imageUrl || "https://placehold.co/100x100/E0E0E0/000000?text=TN"}
          alt={`${tenant.name}`}
          className="tenant-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/E0E0E0/000000?text=TN" }}
        />
      </div>
      <div className="tenant-info">
        <h3 className="tenant-name">{tenant.name}</h3>
        <p className="tenant-detail">Property: {propertyName}</p>
        <p className="tenant-detail">Rent Due: ₦{tenant.rentDue.toLocaleString()}</p>
        <p className="tenant-detail">Due Date: {tenant.rentDueDate}</p>
        <p className={`tenant-detail status-${tenant.paymentStatus}`}>
          Status: {getPaymentStatusText(tenant.paymentStatus)}
        </p>
      </div>
      <div className="tenant-actions-container">
        <button
          ref={buttonRef}
          className="ellipsis-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="More actions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
          </svg>
        </button>
        {isMenuOpen && (
          <div ref={menuRef} className="tenant-actions-menu">
            {onViewDetails && (
              <button className="menu-item" onClick={() => handleActionClick(onViewDetails, tenant)}>
                View Details
              </button>
            )}
            {onEditTenant && (
              <button className="menu-item" onClick={() => handleActionClick(onEditTenant, tenant)}>
                Edit
              </button>
            )}
            {onContactTenant && (
              <button className="menu-item" onClick={() => handleActionClick(onContactTenant, tenant)}>
                Contact
              </button>
            )}
            {onEndLease && (
              <button className="menu-item" onClick={() => handleActionClick(onEndLease, tenant)}>
                End Lease
              </button>
            )}
            {onRemoveTenant && (
              <button className="menu-item menu-item-danger" onClick={() => handleActionClick(onRemoveTenant, tenant)}>
                Remove Tenant
              </button>
            )}
            {onDeleteTenant && ( // This is likely for permanent delete with confirmation modal
              <button className="menu-item menu-item-danger" onClick={() => handleActionClick(onDeleteTenant, tenant)}>
                Delete Permanently
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
