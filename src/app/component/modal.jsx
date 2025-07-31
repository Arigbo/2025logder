// A generic modal component for displaying content on top of the main page.
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    // Overlay to dim the background and close modal on click outside content
    <div
      className={isOpen ? "modal-overlay show" : "modal-overlay"}
      onClick={onClose}
    >
      {/* Modal content area, prevents closing when clicking inside */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {/* Close button with an SVG icon */}
          <button className="modal-close-button" onClick={onClose}>
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
              className="lucide-x-icon"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}