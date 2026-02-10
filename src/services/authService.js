// src/services/authService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, user?: object, token?: string, error?: string}>}
   */

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/platform/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            data.message ||
            data.detail ||
            "Login failed. Please check your credentials.",
        };
      }

      // Check subscription status from response
      const hasSubscription = !!(
        data.service_ids && data.service_ids.length > 0
      );

      return {
        success: true,
        user: data.user,
        token: data.access_token,
        organization: data.organization,
        seatId: data.seat_id,
        serviceIds: data.service_ids,
        serviceDetails: data.service_details,
        hasSubscription: hasSubscription,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  },

  /**
   * Register new user
   * @param {object} userData - { firstName, lastName, email, password, organisation, location, phone, countryCode }
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  signUp: async (userData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/platform/auth/owner/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName,
            organization_name: userData.organisation,
            organization_type: "solo", // Default value
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            data.message ||
            data.detail ||
            "Registration failed. Please try again.",
        };
      }

      return {
        success: true,
        message: data.message || "Account created successfully.",
        user: data.user || data,
      };
    } catch (error) {
      console.error("SignUp error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  },

  /**
   * Logout user
   * @returns {Promise<{success: boolean}>}
   */
  logout: async () => {
    try {
      // If your backend has a logout endpoint, uncomment below:
      // const token = localStorage.getItem('token');
      // await fetch(`${API_BASE_URL}/logout`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: true }; // Still return success to clear local state
    }
  },

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.detail || "Failed to send reset email.",
        };
      }

      return {
        success: true,
        message: data.message || "Password reset link sent to your email.",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  },

  /**
   * Verify token validity
   * @returns {Promise<{valid: boolean, user?: object}>}
   */
  verifyToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { valid: false };

      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      return {
        valid: true,
        user: data.user || data,
      };
    } catch (error) {
      console.error("Token verification error:", error);
      return { valid: false };
    }
  },
};

export default authService;
