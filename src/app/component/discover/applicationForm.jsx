"use client"
// --- RentalApplicationModal Component (Conceptual) ---
export const RentalApplicationModal = ({ apartmentName, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      // In a real app, you'd handle form data and document uploads here
      setSubmitSuccess(true);
      console.log(`Application submitted for ${apartmentName}`);
      setTimeout(onClose, 2500); // Close after success message
    } catch (error) {
      setSubmitError("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="application-modal-overlay show"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div
        className="application-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="application-modal-header">
          <h3 id="application-modal-title">Apply for {apartmentName}</h3>
          <button
            className="application-modal-close-button"
            onClick={onClose}
            aria-label="Close application form"
          >
            &#x2715;
          </button>
        </div>
        {submitSuccess ? (
          <div className="application-success-message">
            <p>🎉 Your application has been submitted successfully!</p>
            <p>We will review it and get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <p className="application-intro">
              Please fill out the form below to submit your rental application.
              You can also upload required documents.
            </p>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Email:</label>
              <input
                type="email"
                id="contactEmail"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number:</label>
              <input
                type="tel"
                id="contactPhone"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="incomeProof">
                Proof of Income (e.g., Pay Stubs, Bank Statement):
              </label>
              <input
                type="file"
                id="incomeProof"
                className="form-input-file"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p className="file-instruction">
                Max file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, PNG.
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="idProof">
                Government ID (e.g., Passport, Driver's License):
              </label>
              <input
                type="file"
                id="idProof"
                className="form-input-file"
                accept=".pdf,.jpg,.png"
              />
              <p className="file-instruction">
                Max file size: 5MB. Supported formats: PDF, JPG, PNG.
              </p>
            </div>
            <div className="form-group">
              <label htmlFor="references">References (Optional):</label>
              <textarea
                id="references"
                rows="3"
                className="form-textarea"
                placeholder="Provide names and contact info for references..."
              ></textarea>
            </div>
            {submitError && (
              <p className="application-error-message">{submitError}</p>
            )}
            <button
              type="submit"
              className="application-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <p className="application-note">
              Note: This is a conceptual application form. In a real
              application, data would be securely processed.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};