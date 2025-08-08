import React, { useState, useEffect, useContext } from 'react';
import Modal from "@/app/component/landlord/modal";
import { DashboardContext } from "@/app/landlords/layout";

const OverstayNegotiationModal = ({ isOpen, onClose, tenant, rentPrice, overstayDays }) => {
  const { showMessage, directEndLease } = useContext(DashboardContext);
  const [negotiationStatus, setNegotiationStatus] = useState('initial');
  const [negotiatedPrice, setNegotiatedPrice] = useState(0);

  const MIN_DEDUCTION_PERCENTAGE = 3;
  const LANDLORD_REPLY_PERIOD = 2; // days
  const VACATE_PERIOD = 7; // days
  const REPORT_PERIOD = 48; // hours

  useEffect(() => {
    if (isOpen) {
      setNegotiationStatus('initial');
      if (rentPrice > 0) {
        const minPrice = rentPrice - (rentPrice * (MIN_DEDUCTION_PERCENTAGE / 100));
        setNegotiatedPrice(minPrice);
      }
    }
  }, [isOpen, rentPrice, overstayDays]);

  const renderInput = (label, type, value, onChange, placeholder) => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );

  const renderButton = (text, onClick, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-primary ${disabled ? 'button-disabled' : ''}`}
    >
      {text}
    </button>
  );

  const renderSecondaryButton = (text, onClick, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-secondary ${disabled ? 'button-disabled' : ''}`}
    >
      {text}
    </button>
  );

  const handleSendRequest = () => {
    if (rentPrice <= 0 || overstayDays < 2) {
      showMessage("Please enter a valid rent price and ensure the overstay is more than 2 days to start negotiation.", "error");
      return;
    }
    setNegotiationStatus('request_sent');
    showMessage(`Negotiation request sent to ${tenant.name}. They have ${LANDLORD_REPLY_PERIOD} days to reply.`, "info");
  };

  const handleAcceptPrice = () => {
    setNegotiationStatus('price_accepted');
    showMessage(`Negotiation successful. ${tenant.name} has ${VACATE_PERIOD} days to vacate.`, "success");
  };

  const handleDeclineNegotiation = () => {
    setNegotiationStatus('declined');
    showMessage(`Tenant declined negotiation. You now have ${REPORT_PERIOD} hours to report to authorities.`, "warning");
  };

  const handleCloseAndRemoveTenant = () => {
    directEndLease(tenant.id, tenant.name, tenant.propertyId);
    onClose();
  };

  if (!isOpen || !tenant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Overstay Negotiation for ${tenant.name}`}>
      <style>
        {`
          .modal-content {
            padding: 1rem;
          }
          .modal-text {
            color: #4b5563;
            margin-bottom: 1.5rem;
            text-align: center;
          }
          .tenant-details {
            background-color: #f9fafb;
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
          }
          .tenant-details-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          .status-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .status-box {
            padding: 1rem;
            border-left: 4px solid;
            border-radius: 0.5rem;
          }
          .status-box.blue {
            background-color: #eff6ff;
            border-color: #60a5fa;
            color: #1e40af;
          }
          .status-box.yellow {
            background-color: #fffbeb;
            border-color: #fcd34d;
            color: #92400e;
          }
          .status-box.green {
            background-color: #f0fdf4;
            border-color: #4ade80;
            color: #166534;
          }
          .status-box.red {
            background-color: #fef2f2;
            border-color: #f87171;
            color: #b91c1c;
          }
          .status-title {
            font-weight: 600;
          }
          .status-text {
            margin-top: 0.5rem;
          }
          .flex-center {
            display: flex;
            justify-content: center;
          }
          .button-group {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
          .button-primary, .button-secondary {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 700;
            transition-property: background-color, border-color, color;
            transition-duration: 200ms;
            border: 1px solid transparent;
            cursor: pointer;
          }
          .button-primary {
            color: white;
            background-color: #4f46e5;
          }
          .button-primary:hover {
            background-color: #4338ca;
          }
          .button-secondary {
            color: #4f46e5;
            background-color: transparent;
            border-color: #4f46e5;
          }
          .button-secondary:hover {
            background-color: #eef2ff;
          }
          .button-disabled {
            background-color: #d1d5db !important;
            border-color: #d1d5db !important;
            color: #6b7280 !important;
            cursor: not-allowed;
          }
          .button-confirm-vacate {
            color: white;
            background-color: #10b981;
          }
          .button-confirm-vacate:hover {
            background-color: #059669;
          }
          .reset-button-container {
            margin-top: 2rem;
            text-align: center;
          }
        `}
      </style>
      <div className="modal-content">
        <p className="modal-text">
          This simulation helps manage the negotiation process for a lease overstay.
        </p>
        
        <div className="tenant-details">
           <p className="tenant-details-title">Tenant Details</p>
           <p><strong>Official Rent:</strong> ₦{rentPrice.toLocaleString()}</p>
           <p><strong>Overstay Period:</strong> {overstayDays} Days</p>
        </div>

        {negotiationStatus === 'initial' && (
          <div className="status-info">
            <div className="status-box blue">
              <p className="status-title">Current Status:</p>
              <p>Overstay of {overstayDays} days detected. Negotiation can begin.</p>
              <p className="status-text">Negotiation price should be between **₦{rentPrice.toLocaleString()}** and **₦{negotiatedPrice.toFixed(2).toLocaleString()}**.</p>
            </div>
            <div className="button-group">
              {renderButton("Send Negotiation Request", handleSendRequest, overstayDays < 2 || rentPrice <= 0)}
              {renderSecondaryButton("Tenant Declines Negotiation", handleDeclineNegotiation, overstayDays < 2 || rentPrice <= 0)}
            </div>
          </div>
        )}

        {negotiationStatus === 'request_sent' && (
          <div className="status-box yellow">
            <p className="status-title">Status: Negotiation Request Sent</p>
            <p>The tenant has been notified. The landlord can reply within **{LANDLORD_REPLY_PERIOD} days**.</p>
            <p className="status-text">Simulate Landlord acceptance:</p>
            <div className="status-text flex-center">
              {renderButton("Landlord Accepts Price", handleAcceptPrice)}
            </div>
          </div>
        )}

        {negotiationStatus === 'price_accepted' && (
          <div className="status-box green">
            <p className="status-title">Status: Negotiation Successful!</p>
            <p>A price of **₦{negotiatedPrice.toFixed(2).toLocaleString()}** has been mutually agreed upon.</p>
            <p className="status-text">The tenant now has **one week ({VACATE_PERIOD} days)** to vacate the property.</p>
            <div className="status-text flex-center">
                <button
                    onClick={handleCloseAndRemoveTenant}
                    className="button-primary button-confirm-vacate"
                >
                    Confirm Vacate
                </button>
            </div>
          </div>
        )}

        {negotiationStatus === 'declined' && (
          <div className="status-box red">
            <p className="status-title">Status: Negotiation Declined</p>
            <p>The tenant has declined to negotiate. The landlord now has **{REPORT_PERIOD} hours** to report the matter to local authorities.</p>
          </div>
        )}

        <div className="reset-button-container">
          {renderSecondaryButton("Close", () => onClose())}
        </div>
      </div>
    </Modal>
  );
};

export default OverstayNegotiationModal;
