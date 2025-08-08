import { useState } from "react";
export default function LoginSignupModal({
  isOpen,
  onClose,
  onLoginSuccess,
  user,
}) {
  const [isLogin, setIsLogin] = useState(true); // Toggles between login and signup forms
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Message for login/signup feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    {
      user.map((item) => {
        if (isLogin) {
          if (
            email === item.email &&
            password === item.password
          ) {  
              alert(`Welcome back ${item.name}`);

            onLoginSuccess({ email, uid: "simulated-user-id" }); // Call parent success handler
            onClose(); // Close the modal
          } else {
            setMessage("Invalid email or password.");
          }
        } else {
          // Simulated signup logic
          if (name && email && password) {
            onLoginSuccess({ email, uid: `simulated-user-${Date.now()}` }); // Create a unique ID for simulated user
            onClose(); // Close the modal
          } else {
            setMessage("Please enter a valid email and password.");
          }
        }
      });
    }
  };
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content-inner">
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
          {isLogin ? (
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form-spacing">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div>
                    <input
                      type="password"
                      id="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {message && <p className="form-error-message">{message}</p>}
                <button
                  type="submit"
                  className="button-primary button-full-width"
                >
                  Login
                </button>
              </form>
              <div className="form-footer-text">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-button"
                >
                  Need an account? Sign Up
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form-spacing">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <div>
                    <input
                      type="name"
                      id="name"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div>
                    <input
                      type="password"
                      id="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {message && <p className="form-error-message">{message}</p>}
                <button
                  type="submit"
                  className="button-primary button-full-width"
                >
                  Sign Up
                </button>
              </form>
              <div className="form-footer-text">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-button"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
