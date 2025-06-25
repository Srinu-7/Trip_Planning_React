import { API_BASE_URL } from './constants';

export function setupGoogleLoginHandlers({ onLoginSuccess, switchToLogin }) {
  window.handleGoogleCredentialResponse = async function (response) {
    try {
      const credential = response.credential;
      const payload = parseJwt(credential);

      const wrapper = document.querySelector('.wrapper');
      const action = wrapper?.classList.contains('active') ? 'signup' : 'signin';

      const res = await fetch(`${API_BASE_URL}/auth/google-${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        },
        body: credential
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          switchToLogin();
          throw new Error("Google account already registered. Please sign in.");
        } else if (res.status === 404) {
          throw new Error("Account not found. Please sign up first.");
        } else {
          throw new Error(data.message || "Google authentication failed");
        }
      }

      if (data.status && data.jwt) {
        localStorage.setItem('userData', JSON.stringify({
          jwt: data.jwt,
          email: payload.email,
        }));

        if (action === 'signin') {
          showSuccessMessage("Sign in successful! Redirecting...");
          setTimeout(onLoginSuccess, 1000);
        } else {
          showSuccessMessage("Sign up successful! Please sign in.");
          setTimeout(switchToLogin, 1500);
        }
      }
    } catch (error) {
      showErrorMessage(error.message);
    }
  };
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
}

function showErrorMessage(message) {
  const div = document.getElementById('errorMessage');
  if (!div) return;
  div.textContent = 'Error: ' + message;
  div.className = 'error-message';
  div.style.display = 'block';
  setTimeout(() => div.style.display = 'none', 5000);
}

function showSuccessMessage(message) {
  const div = document.getElementById('errorMessage');
  if (!div) return;
  div.textContent = message;
  div.className = 'success-message';
  div.style.display = 'block';
  setTimeout(() => div.style.display = 'none', 5000);
}
