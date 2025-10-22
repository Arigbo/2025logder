"use client";
import { useState } from "react";

export const ContactAgentModal = ({
  apartmentName,
  setContact,
  userName,
  userEmail,
  userPhone,
  agentName,
  agentPhone,
  agentImage,
}) => {
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState(userPhone || ""); // New phone state
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState(""); // New state for preferred date
  const [preferredTime, setPreferredTime] = useState(""); // New state for preferred time
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(false);
    setSendError(null);

    // Simulate sending message
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      if (name && email && phone && message && preferredDate && preferredTime) {
        // Basic validation including phone, date, and time
        setSendSuccess(true);
        // In a real app, you'd send this data to a backend
        console.log("Message Sent:", {
          name,
          email,
          phone,
          message,
          apartmentName,
          agentName,
          agentPhone,
          preferredDate,
          preferredTime,
        });
        // Optionally clear form fields after success
        setName(userName || ""); // Reset to initial user data
        setEmail(userEmail || "");
        setPhone(userPhone || "");
        setMessage("");
        setPreferredDate("");
        setPreferredTime("");
      } else {
        throw new Error(
          "Please fill in all required fields (Name, Email, Phone, Message, Preferred Date, Preferred Time)."
        );
      }
    } catch (err) {
      setSendError(err.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="contact-modal-overlay show"
      onClick={()=>setContact(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="contact-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contact-modal-header">
          <h3 id="contact-modal-title">Contact Agent for {apartmentName}</h3>
          <button
            className="contact-modal-close-button"
            onClick={()=>setContact(false)}
            aria-label="Close contact form"
          >
            &#x2715;
          </button>
        </div>

        {/* Agent Information */}
        <div className="agent-info-section">
          <img
            src={agentImage}
            alt={agentName}
            className="agent-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/60x60/cccccc/ffffff?text=AG";
            }}
          />
          <div className="agent-details">
            <p className="agent-name">{agentName}</p>
            <p className="agent-phone">📞 {agentPhone}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-modal-form">
          <div className="form-group">
            <label htmlFor="contactName">Your Name:</label>
            <input
              type="text"
              id="contactName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Your Email:</label>
            <input
              type="email"
              id="contactEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Your Phone Number:</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="contactPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="form-input"
            />
            <p className="phone-instruction">
              Please provide an active WhatsApp number.
            </p>
          </div>
          {/* New fields for Preferred Date and Time */}
          <div className="form-group">
            <label htmlFor="preferredDate">Preferred Viewing Date:</label>
            <input
              type="date"
              id="preferredDate"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="preferredTime">Preferred Viewing Time:</label>
            <input
              type="time"
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactMessage">Message:</label>
            <textarea
              id="contactMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              required
              className="form-textarea"
            ></textarea>
          </div>
          {sendSuccess && (
            <p className="send-success-message">Message sent successfully!</p>
          )}
          {sendError && (
            <p className="send-error-message">Error: {sendError}</p>
          )}
          <button
            type="submit"
            className="send-message-button"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};
