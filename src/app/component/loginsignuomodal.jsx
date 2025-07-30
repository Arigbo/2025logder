
export default function LoginSignupModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggles between login and signup forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Message for login/signup feedback

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (isLogin) {
      // Simulated login logic
      if (email === "demo@example.com" && password === "password") {
        onLoginSuccess({ email, uid: "simulated-user-id" }); // Call parent success handler
        onClose(); // Close the modal
      } else {
        setMessage(
          "Invalid email or password. Try demo@example.com / password"
        );
      }
    } else {
      // Simulated signup logic
      if (email && password) {
        onLoginSuccess({ email, uid: `simulated-user-${Date.now()}` }); // Create a unique ID for simulated user
        onClose(); // Close the modal
      } else {
        setMessage("Please enter a valid email and password.");
      }
    }
  };

  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isLogin ? "Login" : "Sign Up"}</h3>
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
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="form-spacing">
            <div>
              <label
                htmlFor="email"
                className="form-label"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="form-label"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className="form-error-message">{message}</p>
            )}
            <button
              type="submit"
              className="button-primary button-full-width"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="form-footer-text">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-button"
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
