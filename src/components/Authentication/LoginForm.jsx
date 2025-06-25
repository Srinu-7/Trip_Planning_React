import React, { useRef } from 'react';
import { API_BASE_URL } from '../../utils/constants';

function LoginForm({ switchToSignup, onLoginSuccess }) {
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.jwt) {
        localStorage.setItem(
          'userData',
          JSON.stringify({ email, jwt: data.jwt })
        );
        onLoginSuccess();
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      const errorDiv = document.getElementById('errorMessage');
      if (errorDiv) {
        errorDiv.textContent = 'Error: ' + error.message;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message';
        setTimeout(() => {
          errorDiv.style.display = 'none';
        }, 5000);
      }
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="form-wrapper sign-in">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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
            <input type="checkbox" /> Remember me
          </label>
        </div>
        <button type="submit">Login</button>
        <div className="signUp-link">
          <p>
            Don't have an account?{' '}
            <a href="#" onClick={switchToSignup}>
              Sign Up
            </a>
          </p>
        </div>
        <div className="google-signin">
          <div
            id="g_id_signin_login"
            className="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
          ></div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
