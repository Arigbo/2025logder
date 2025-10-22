export default function saveBookmark(apartmentId) {
  const bookmardked = [];
  bookmardked.push(apartmentId);
  return localStorage.setItem("lodgerBookmarks", JSON.stringify(bookmardked));
}
