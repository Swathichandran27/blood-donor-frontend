import AuthService from './AuthService';

class ApiService {
  constructor() {
    this.API_BASE_URL = 'http://localhost:8080/api';
  }

  // Helper method to make authenticated API calls
  async authenticatedRequest(endpoint, options = {}) {
    const url = `${this.API_BASE_URL}${endpoint}`;
    
    const headers = {
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, logout user
    if (response.status === 401) {
      AuthService.removeToken();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    return response;
  }

  // Dashboard APIs
  async getBloodStock() {
    const response = await this.authenticatedRequest('/bloodStock');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch blood stock data');
  }

  async getUrgentRequests() {
    const response = await this.authenticatedRequest('/urgentRequests');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch urgent requests');
  }

  async getUpcomingCampaigns() {
    const response = await this.authenticatedRequest('/upcomingCampaigns');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch upcoming campaigns');
  }

  async getHealthStats(userId) {
    const response = await this.authenticatedRequest(`/healthStats/${userId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch health stats');
  }

  async getBadgeData(userId) {
    const response = await this.authenticatedRequest(`/badgeData/${userId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch badge data');
  }

  // Appointment APIs
  async getAppointments(userId) {
    const response = await this.authenticatedRequest(`/appointments/user/${userId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch appointments');
  }

  async createAppointment(appointmentData) {
    const response = await this.authenticatedRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to create appointment');
  }

  async updateAppointment(appointmentId, appointmentData) {
    const response = await this.authenticatedRequest(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update appointment');
  }

  async deleteAppointment(appointmentId) {
    const response = await this.authenticatedRequest(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      return true;
    }
    throw new Error('Failed to delete appointment');
  }

  // Donation Center APIs (public)
  async getDonationCenters() {
    const response = await fetch(`${this.API_BASE_URL}/donationCenters`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch donation centers');
  }

  
  async searchDonationCenters(query) {
    let url = `${this.API_BASE_URL}/donationCenters`;
    
    if (query) {
      if (/^\d+$/.test(query)) {
        url += `/search/pincode?pincode=${query}`;
      } else {
        url += `/search/city?city=${query}`;
      }
    }

    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to search donation centers');
  }

  // User Profile APIs
  async updateUserProfile(userId, userData) {
    const response = await this.authenticatedRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update user profile');
  }

  async getUserProfile(userId) {
    const response = await this.authenticatedRequest(`/users/${userId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch user profile');
  }

  // Chat APIs
  async getChatMessages(userId) {
    const response = await this.authenticatedRequest(`/chat/messages/${userId}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch chat messages');
  }

  async sendChatMessage(messageData) {
    const response = await this.authenticatedRequest('/chat/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to send message');
  }

  // Admin APIs
  async getAllUsers() {
    const response = await this.authenticatedRequest('/admin/users');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch users');
  }

  async getAllAppointments() {
    const response = await this.authenticatedRequest('/admin/appointments');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch all appointments');
  }

  async updateAppointmentStatus(appointmentId, status) {
    const response = await this.authenticatedRequest(`/admin/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update appointment status');
  }
  // Resource APIs
async getResources() {
  const response = await this.authenticatedRequest('/resources');
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to fetch resources');
}

}

export default new ApiService();
