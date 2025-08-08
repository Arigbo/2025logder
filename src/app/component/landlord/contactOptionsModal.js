import modal from "@/app/component/landlord/modal"; // Import your generic Modal component
export default function ContactOptionsModal({ isOpen, onClose, tenant, showMessage }) { // Pass showMessage
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