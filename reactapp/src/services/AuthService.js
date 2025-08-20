// Authentication service for JWT token management
class AuthService {
  constructor() {
    this.API_BASE_URL = 'https://blood-donor-backend-cibk.onrender.com/api';
  }

  // Store token in localStorage
  setToken(token) {
    localStorage.setItem('jwt_token', token);
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('jwt_token');
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }

  // Store user data
  setUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  // Get user data
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Basic token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Get authorization headers
  getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  // Login API call
  async login(email, password) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setToken(data.token);
        this.setUserData(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Register API call
  async register(userData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        this.setToken(data.token);
        this.setUserData(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Validate token with server
  async validateToken() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        this.setUserData(data.user);
        return { success: true, data: data.user };
      } else {
        this.removeToken();
        return { success: false, error: 'Invalid token' };
      }
    } catch (error) {
      this.removeToken();
      return { success: false, error: 'Token validation failed' };
    }
  }

  // Logout
  async logout() {
    try {
      await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.log('Logout API call failed, but proceeding with local logout');
    }
    
    this.removeToken();
  }

  // Make authenticated API calls
  async authenticatedFetch(url, options = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, logout user
    if (response.status === 401) {
      this.removeToken();
      window.location.href = '/login';
    }

    return response;
  }
}

// Create and export an instance of AuthService
const authService = new AuthService();
export default authService;