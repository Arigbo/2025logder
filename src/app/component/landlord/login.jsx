"use client";
import { useState, useContext, useEffect } from "react";
import { DashboardContext } from "@/app/landlords/layout";

export default function LoginSignupModal({
  isOpen,
  onClose,
  onLoginSuccess,
}) {
  const { user=[], setUser } = useContext(DashboardContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // On mount, check localStorage for user id and auto-login if found
  useEffect(() => {
    const storedUserId = localStorage.getItem("lodger_user_id");
    if (storedUserId && Array.isArray(user)) {
      const foundUser = user.find((u) => String(u.id) === String(storedUserId));
      if (foundUser) {
        // Only set the logged in user (not the whole array)
        setUser([foundUser]);
        if (onLoginSuccess) {
          onLoginSuccess(foundUser);
        }
        if (onClose) {
          onClose();
        }
      }
    }
    // eslint-disable-next-line
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
 setLoading(true);
    if (isLogin) {
      if (!Array.isArray(user)) {
        setMessage("No users found. Please sign up first.");
        return;
      }
      const foundUser = user.find(
        (item) =>
          email === item.email &&
          password === item.password
      );
      if (foundUser) {
        alert(`Welcome back ${foundUser.name}`);
        localStorage.setItem("lodger_user_id", foundUser.id);
        setUser([foundUser]);
        if (onLoginSuccess) onLoginSuccess({ id: foundUser.id });
        if (onClose) onClose();
        setLoading(true);
      } else {
        setMessage("Invalid email or password.");
      }
    } else {
      setLoading(true);
      try {
        // Fetch all users from backend to check for duplicates
        const usersRes = await fetch("http://localhost:3000/landlords");
        const allUsers = await usersRes.json();

        const exists = Array.isArray(allUsers) && allUsers.some(
          (item) => item.email === email || item.name === name
        );

        if (exists) {
          setMessage("A user with this email or name already exists.");
          setLoading(false);
          return;
        }

        if (name && email && password && phone) {
          // Find the next id
          let nextId = 1;
          if (Array.isArray(allUsers) && allUsers.length > 0) {
            const maxId = Math.max(...allUsers.map((u) => Number(u.id) || 0));
            nextId = maxId + 1;
          }
          const newUser = { id: nextId, name, email, password, phone };
          // Save to backend
          const res = await fetch("http://localhost:3000/landlords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });
          if (!res.ok) {
            throw new Error("Failed to create user");
          }
          // Assume backend returns the created user (with id)
          const createdUser = await res.json();
          setUser((prev) => [createdUser]);
          localStorage.setItem("lodger_user_id", createdUser.id);
          if (onLoginSuccess) onLoginSuccess({ id: createdUser.id });
          if (onClose) onClose();
        } else {
          setMessage("Please enter a valid email, password, and phone.");
        }
      } catch (err) {
        setMessage("Error creating user. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

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
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
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
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
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
