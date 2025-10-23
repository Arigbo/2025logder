// --- BookmarksPage Component ---
export const BookmarksPage = ({
  bookmarkedApartmentIds,
  allApartments,
  onBackToListings,
  onApartmentClick,
  onToggleBookmark,
  bookmarkedApartments,
}) => {
  const bookmarkedApartmentsData = allApartments.filter((apt) =>
    bookmarkedApartmentIds.includes(apt.id)
  );

  return (
    <div className="bookmarks-page-container">
      <button className="bookmarks-back-button" onClick={onBackToListings}>
        &larr; Back to Discover
      </button>
      <h2 className="bookmarks-page-title">Your Bookmarked Apartments</h2>
      {bookmarkedApartmentsData.length === 0 ? (
        <div className="empty-state">
          <p>You haven't bookmarked any apartments yet.</p>
          <p>Start exploring and save your favorites!</p>
        </div>
      ) : (
        <div className="grid">
          {bookmarkedApartmentsData.map((apartment, index) => (
            <div
              key={apartment.id}
              className="card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onApartmentClick(apartment)}
            >
              {apartment.isNewListing && (
                <div className="new-listing-badge">✨ New Listing</div>
              )}
              <img
                src={
                  apartment.images[0] ||
                  "https://placehold.co/400x280/CCCCCC/666666?text=Image+Not+Found"
                }
                alt={apartment.name}
                className="image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x280/FF0000/FFFFFF?text=IMAGE+LOAD+FAILED";
                }}
              />
              <div className="card-content">
                <h2 className="card-title">{apartment.name}</h2>
                <p className="card-location">{apartment.location}</p>
                <div className="card-info-grid">
                  <span className="card-info-item">
                    <span className="icon">🛏️</span> {apartment.bedrooms} Bed
                  </span>
                  <span className="card-info-item">
                    <span className="icon">🛁</span> {apartment.bathrooms} Bath
                  </span>
                </div>
                <p className="card-price">
                  ₦{apartment.price.toLocaleString()}/month
                </p>
                <button className="view-details-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
