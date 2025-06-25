import React, { useRef } from 'react';
import { API_BASE_URL } from '../../utils/constants';

function SignupForm({ switchToLogin }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    const phoneNumber = phoneRef.current.value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      if (data.jwt) {
        showSuccessMessage("Account created successfully! Please sign in.");
        setTimeout(() => switchToLogin(), 1500);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      showErrorMessage(error.message || 'Something went wrong');
      console.error('Signup Error:', error);
    }
  };

  const showSuccessMessage = (message) => {
    const div = document.getElementById('errorMessage');
    if (!div) return;
    div.textContent = message;
    div.className = 'success-message';
    div.style.display = 'block';
    setTimeout(() => (div.style.display = 'none'), 5000);
  };

  const showErrorMessage = (message) => {
    const div = document.getElementById('errorMessage');
    if (!div) return;
    div.textContent = 'Error: ' + message;
    div.className = 'error-message';
    div.style.display = 'block';
    setTimeout(() => (div.style.display = 'none'), 5000);
  };

  return (
    <div className="form-wrapper sign-up">
      <form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <div className="input-group">
          <input
            type="tel"
            name="phonenumber"
            required
            pattern="[0-9]{10}"
            ref={phoneRef}
          />
          <label>Phone Number</label>
        </div>
        <div className="input-group">
          <input type="email" name="email" required ref={emailRef} />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input type="password" name="password" required ref={passwordRef} />
          <label>Password</label>
        </div>
        <div className="remember">
          <label>
            <input type="checkbox" /> I agree to the terms & conditions
          </label>
        </div>
        <button type="submit">Sign Up</button>
        <div className="signUp-link">
          <p>
            Already have an account?{' '}
            <a href="#" onClick={switchToLogin}>
              Sign In
            </a>
          </p>
        </div>
        <div className="google-signup">
          <div
            id="g_id_signin_signup"
            className="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signup_with"
            data-size="large"
            data-logo_alignment="left"
          ></div>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
