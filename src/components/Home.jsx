import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import LoginForm from "./Authentication/LoginForm";
import SignupForm from "./Authentication/SignupForm";
import { setupGoogleLoginHandlers } from "../utils/GoogleAuthHandler";
import "../styles/Authentication/auth.css";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.jwt) {
          try {
            const res = await fetch('http://localhost:8080/auth/verify-token', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${parsed.jwt}`,
                'Content-Type': 'application/json',
              },
            });

            const data = await res.json();
            if (res.ok && data.valid) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem('userData');
              setIsAuthenticated(false);
            }
          } catch (err) {
            console.error('Token verification failed:', err);
            localStorage.removeItem('userData');
            setIsAuthenticated(false);
          }
        }
      }
    };

    verifyToken();

    // Inject Google One Tap script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setupGoogleLoginHandlers({
          onLoginSuccess: () => setIsAuthenticated(true),
          switchToLogin: () => setIsSignup(false)
        });

        window.google.accounts.id.initialize({
          client_id: '753342194804-dq979uo88caihvhnivsk3pbdgcfike1h.apps.googleusercontent.com',
          callback: window.handleGoogleCredentialResponse,
          auto_select: false,
        });

        if (document.getElementById('g_id_signin_login')) {
          window.google.accounts.id.renderButton(
            document.getElementById('g_id_signin_login'),
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: '100%',
            }
          );
        }

        if (document.getElementById('g_id_signin_signup')) {
          window.google.accounts.id.renderButton(
            document.getElementById('g_id_signin_signup'),
            {
              theme: 'outline',
              size: 'large',
              text: 'signup_with',
              shape: 'rectangular',
              width: '100%',
            }
          );
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  if (isAuthenticated) return <HomePage />;

  return (
    <div className={`wrapper ${isSignup ? 'active' : ''}`}>
      <LoginForm
        switchToSignup={() => setIsSignup(true)}
        onLoginSuccess={() => setIsAuthenticated(true)}
      />
      <SignupForm switchToLogin={() => setIsSignup(false)} />
      <div id="errorMessage" className="error-message"></div>
    </div>
  );
}

export default Home;
