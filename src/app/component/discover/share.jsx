"use client";

import { useState } from "react";

export const ShareModal = ({ apartmentUrl, apartmentName, setCopy }) => {
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopyLink = () => {
    const el = document.createElement("textarea");
    el.value = apartmentUrl;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      setCopySuccess("Link copied!");
    } catch (err) {
      setCopySuccess("Failed to copy link.");
      console.error("Failed to copy: ", err);
    }
    document.body.removeChild(el);
    setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
        </svg>
      ),
      onClick: handleCopyLink,
    },
    {
      name: "WhatsApp",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.51 2 2 6.51 2 12.04C2 14.11 2.69 16.03 3.85 17.58L2.01 22L6.64 20.59C8.07 21.43 9.9 22 12.04 22C17.57 22 22.08 17.49 22.08 12.04C22.08 6.51 17.57 2 12.04 2ZM17.28 16.48C17.04 16.92 16.14 17.42 15.65 17.5C15.16 17.58 14.49 17.62 11.72 16.48C8.95 15.34 7.21 12.98 7.04 12.72C6.87 12.46 6.19 11.56 6.19 10.74C6.19 9.92 6.77 9.68 7.04 9.42C7.31 9.16 7.6 9.07 7.78 8.89C7.96 8.71 8.04 8.62 8.13 8.44C8.21 8.26 8.13 8.17 8.04 7.99C7.96 7.81 7.31 6.26 7.04 5.61C6.77 4.96 6.51 5.04 6.24 5.04C5.97 5.04 5.61 5.04 5.34 5.04C5.07 5.04 4.62 5.13 4.26 5.5C3.9 5.86 2.99 6.76 2.99 8.5C2.99 10.24 4.26 11.98 4.44 12.25C4.62 12.52 6.87 15.86 10.04 17.21C12.55 18.3 12.91 18.17 13.59 18.17C14.27 18.17 14.73 18.08 15.18 17.81C15.63 17.54 16.62 16.92 16.98 16.48C17.34 16.04 17.42 15.86 17.5 15.77C17.58 15.69 17.58 15.51 17.28 16.48Z" />
        </svg>
      ),
      href: `whatsapp://send?text=Check out this apartment: ${apartmentName} - ${encodeURIComponent(
        apartmentUrl
      )}`,
    },
    {
      name: "Email",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
        </svg>
      ),
      href: `mailto:?subject=Check out this apartment!&body=I found this apartment on Lodger and thought you might like it: ${apartmentName} - ${encodeURIComponent(
        apartmentUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.51 7.6 3.68 5.14c-.36.62-.56 1.35-.56 2.13 0 1.49.75 2.81 1.91 3.56-.7-.02-1.36-.21-1.93-.53v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.71 2.14 2.95 4.03 2.98-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C3.17 20.37 5.56 21 8 21c8.49 0 13.13-7.01 13.13-13.13 0-.2-.01-.4-.02-.6.9-.65 1.68-1.47 2.3-2.4z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=Check out this apartment: ${apartmentName}&url=${encodeURIComponent(
        apartmentUrl
      )}`,
    },
  ];

  return (
    <div
      className="share-modal-overlay show"
      onClick={() => setCopy(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3 id="share-modal-title">Share Apartment</h3>
          <button
            className="share-modal-close-button"
            onClick={() => setCopy(false)}
            aria-label="Close share options"
          >
            &#x2715;
          </button>
        </div>
        <div className="share-options-grid">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="share-option-item"
              onClick={option.onClick || (() => {})}
            >
              <div className="share-option-icon">{option.icon}</div>
              <span>{option.name}</span>
            </a>
          ))}
        </div>
        {copySuccess && <p className="copy-success-message">{copySuccess}</p>}
      </div>
    </div>
  );
};
