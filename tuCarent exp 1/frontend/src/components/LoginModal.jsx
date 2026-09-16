import React from 'react';
// The LoginModal component is styled to look like the 'Welcome Back!' card.

const LoginModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for handling login submission
    console.log('Login attempted');
    // onClose(); // Uncomment to close the modal after login attempt
  };

  return (
    // Note: If this is truly a modal, you'd wrap it in a backdrop div
    // For now, we'll implement the visible card structure.

    <div className="login-section">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            required
            aria-label="Email"
          />
          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            required
            aria-label="Password"
          />
          {/* Login Button */}
          <button type="submit" className="login-form-btn">
            Login
          </button>
        </form>
        {/* Register Link */}
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;