// Define a reusable TestimonialCard component
export const TestimonialCard = ({ quote, name, role, avatarUrl }) => (
  <div className="testimonial-card">
    <p className="testimonial-quote">"{quote}"</p>
    <div className="testimonial-author-info">
      <img
        src={avatarUrl}
        alt={`${name}'s Avatar`}
        className="testimonial-avatar"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/48x48/e2e8f0/333333?text=AV";
        }}
      />
      <div>
        <p className="testimonial-author-name">{name}</p>
        <p className="testimonial-author-role">{role}</p>
      </div>
    </div>
  </div>
);