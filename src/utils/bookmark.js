export function loadBookmarks() {
  return useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookmarks = localStorage.getItem("lodgerBookmarks");
      if (storedBookmarks) {
        setBookmarkedApartments(JSON.parse(storedBookmarks));
      }
      const storedUser = localStorage.getItem("lodgerLoggedInUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);
        setIsLoggedIn(true);
        setUserStatus(user.name);
        setUserAvatar(
          `https://placehold.co/40x40/${Math.floor(
            Math.random() * 16777215
          ).toString(16)}/ffffff?text=${user.name.charAt(0).toUpperCase()}`
        );
        setUserName(user.name);
        setUserEmail(user.email);
      }
    }
  }, []);
}
export default function saveBookmark({apartmentId}) {
  //   return useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem(
  //         "lodgerBookmarks",
  //         JSON.stringify(bookmarkedApartments)
  //       );
  //     }
  //   }, [bookmarkedApartments]);
  console.log(bookmarkedId)
  localStorage.setItem("bookmarked", apartmentId);
}

// Toggle bookmark for an apartment
export const toggleBookmark = useCallback((apartmentId) => {
  setBookmarkedApartments((prevBookmarks) => {
    if (prevBookmarks.includes(apartmentId)) {
      return prevBookmarks.filter((id) => id !== apartmentId);
    } else {
      return [...prevBookmarks, apartmentId];
    }
  });
}, []);
