// --- File: src/utils/bookmarkHelpers.js (or similar) ---

/**
 * Retrieves the current list of bookmarks from localStorage.
 * @returns {string[]} An array of bookmarked apartment IDs.
 */
export function getBookmarks() {
  const bookmarksString = localStorage.getItem("lodgerBookmarks");
  try {
    const parsed = bookmarksString ? JSON.parse(bookmarksString) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing bookmarks:", error);
    return [];
  }
}

/**
 * Checks if a specific apartment is bookmarked.
 * @param {string} apartmentId The ID to check.
 * @returns {boolean} True if bookmarked, false otherwise.
 */
export function isBookmarked(apartmentId) {
  return getBookmarks().includes(apartmentId);
}
/**
 * Toggles an apartment ID in the list of bookmarked items stored in localStorage.
 * If the ID exists, it's removed; otherwise, it's added.
 *
 * @param {string} apartmentId The unique ID of the apartment to bookmark.
 * @returns {boolean} True if the operation was successful.
 */
export default function saveBookmark(apartmentId) {
  // 1. Retrieve the existing bookmarks string from localStorage
  const bookmarksString = localStorage.getItem("lodgerBookmarks");

  // 2. Parse the string into an array, or start with an empty array if null/invalid
  // JSON.parse safely converts the string back to a JavaScript array.
  let bookmarked = [];
  try {
    // Only parse if the string exists. If not, it's null, and we keep bookmarked as [].
    if (bookmarksString) {
      const parsed = JSON.parse(bookmarksString);
      // Ensure the parsed result is actually an array
      if (Array.isArray(parsed)) {
        bookmarked = parsed;
      }
    }
  } catch (error) {
    // Log error for debugging if parsing fails (e.g., malformed JSON)
    console.error("Error parsing lodgerBookmarks from localStorage:", error);
    // Continue with an empty array to prevent failure
  }

  // 3. Check if the apartmentId is already in the array
  const index = bookmarked.indexOf(apartmentId);

  // 4. Update the array
  if (index > -1) {
    // If it exists, remove it (toggle feature: unbookmark)
    bookmarked.splice(index, 1);
  } else {
    // If it doesn't exist, add it (bookmark)
    bookmarked.push(apartmentId);
  }

  // 5. Serialize the updated array back into a string and save it
  // JSON.stringify converts the JavaScript array into a string for storage.
  try {
    localStorage.setItem("lodgerBookmarks", JSON.stringify(bookmarked));
    return true; // Indicate success
  } catch (error) {
    console.error("Error saving lodgerBookmarks to localStorage:", error);
    return false; // Indicate failure
  }
}
