export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const sizeClass = size === "lg" ? "modal-content-lg" : "";

  return (
    <div
      className={isOpen ? "modal-overlay show" : "modal-overlay"}
      onClick={onClose}
    >
      <div
        className={`modal-content ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content-inner">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
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
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}