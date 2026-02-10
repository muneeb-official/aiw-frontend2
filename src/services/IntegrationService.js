// src/services/integrationService.js
import api from "./api";

// Popup configuration
const POPUP_CONFIG = {
  width: 600,
  height: 700,
};

// Helper to get popup position (centered)
const getPopupPosition = () => {
  const left = window.screenX + (window.outerWidth - POPUP_CONFIG.width) / 2;
  const top = window.screenY + (window.outerHeight - POPUP_CONFIG.height) / 2;
  return { left, top };
};

// Store for active popup
let activePopup = null;
let popupCheckInterval = null;

export const integrationService = {
  // ============================================
  // GENERAL INTEGRATION METHODS
  // ============================================

  // Get all integration statuses
  // Note: No single endpoint exists for all integrations - use individual status methods
  getIntegrations: async () => {
    // Return empty object - each integration should be fetched individually
    // via getGmailStatus, getOutlookStatus, etc.
    return {};
  },

  // Check specific integration status
  getIntegrationStatus: async (integrationKey) => {
    try {
      const response = await api.get(
        `/platform/integrations/${integrationKey}/status`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error checking ${integrationKey} status:`, error);
      throw error;
    }
  },

  // Open OAuth popup for connection (legacy - for integrations using GET auth-url)
  connectOAuth: (integrationKey, integrationName) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Step 1: Get OAuth URL from backend (backend stores session)
        const response = await api.get(
          `/platform/integrations/${integrationKey}/auth-url`,
        );
        const { auth_url } = response.data;

        const { left, top } = getPopupPosition();

        // Close any existing popup
        if (activePopup && !activePopup.closed) {
          activePopup.close();
        }
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
        }

        // Step 2: Open popup with the auth URL (no token in URL)
        activePopup = window.open(
          auth_url,
          `${integrationName} Authorization`,
          `width=${POPUP_CONFIG.width},height=${POPUP_CONFIG.height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
        );

        if (!activePopup) {
          reject(
            new Error("Popup blocked. Please allow popups for this site."),
          );
          return;
        }

        activePopup.focus();

        // Poll for popup close
        popupCheckInterval = setInterval(async () => {
          if (activePopup && activePopup.closed) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
            activePopup = null;

            // Verify connection status with backend
            try {
              const status =
                await integrationService.getIntegrationStatus(integrationKey);
              if (status.connected) {
                resolve({ success: true, integration: integrationKey });
              } else {
                resolve({
                  success: false,
                  integration: integrationKey,
                  error: "Connection not completed",
                });
              }
            } catch {
              resolve({ success: true, integration: integrationKey });
            }
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Open OAuth popup for V1 integrations (using POST authorize endpoint)
  connectOAuthV1: (integrationKey, integrationName, authEndpoint) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Step 1: Get OAuth URL from backend via POST
        console.log(`🔗 Connecting ${integrationName} via POST /platform${authEndpoint}`);
        const response = await api.post(`/platform${authEndpoint}`);
        const authUrl =
          response.data.authorization_url || response.data.auth_url;

        if (!authUrl) {
          throw new Error("No authorization URL received");
        }

        const { left, top } = getPopupPosition();

        // Close any existing popup
        if (activePopup && !activePopup.closed) {
          activePopup.close();
        }
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
        }

        // Step 2: Open popup with the auth URL
        activePopup = window.open(
          authUrl,
          `${integrationName} Authorization`,
          `width=${POPUP_CONFIG.width},height=${POPUP_CONFIG.height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
        );

        if (!activePopup) {
          reject(
            new Error("Popup blocked. Please allow popups for this site."),
          );
          return;
        }

        activePopup.focus();

        // Poll for popup close
        popupCheckInterval = setInterval(async () => {
          if (activePopup && activePopup.closed) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
            activePopup = null;

            // Verify connection status with backend
            try {
              await new Promise((r) => setTimeout(r, 1000)); // Wait for callback to process
              resolve({ success: true, integration: integrationKey });
            } catch {
              resolve({ success: true, integration: integrationKey });
            }
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Close active popup
  closePopup: () => {
    if (activePopup && !activePopup.closed) {
      activePopup.close();
    }
    if (popupCheckInterval) {
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
    }
    activePopup = null;
  },

  // Disconnect an integration
  disconnect: async (integrationKey) => {
    try {
      const response = await api.post(
        `/platform/integrations/${integrationKey}/disconnect`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error disconnecting ${integrationKey}:`, error);
      throw error;
    }
  },

  // ============================================
  // GMAIL INTEGRATION
  // ============================================

  getGmailStatus: async () => {
    try {
      const response = await api.get("/platform/integrations/gmail/status");
      return response.data;
    } catch (error) {
      console.error("Error getting Gmail status:", error);
      throw error;
    }
  },

  connectGmail: () => {
    return new Promise((resolve, reject) => {
      try {
        const { left, top } = getPopupPosition();

        // Close any existing popup
        if (activePopup && !activePopup.closed) {
          activePopup.close();
        }
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
        }

        // Get token and open popup directly to backend OAuth endpoint
        // The backend will handle the redirect to Google OAuth
        const token = localStorage.getItem("token");
        const oauthUrl = `${api.defaults.baseURL}/platform/integrations/gmail/connect?token=${encodeURIComponent(token)}`;

        // Open popup with the backend OAuth URL
        activePopup = window.open(
          oauthUrl,
          "Gmail Authorization",
          `width=${POPUP_CONFIG.width},height=${POPUP_CONFIG.height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
        );

        if (!activePopup) {
          reject(
            new Error("Popup blocked. Please allow popups for this site."),
          );
          return;
        }

        activePopup.focus();

        // Poll for popup close
        popupCheckInterval = setInterval(async () => {
          if (activePopup && activePopup.closed) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
            activePopup = null;

            // Verify connection status after popup closes
            try {
              const status = await integrationService.getGmailStatus();
              if (status.connected) {
                resolve({ success: true, integration: "gmail", data: status });
              } else {
                resolve({
                  success: false,
                  integration: "gmail",
                  error: "Connection not completed",
                });
              }
            } catch {
              resolve({
                success: false,
                integration: "gmail",
                error: "Failed to verify connection",
              });
            }
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  },

  disconnectGmail: async () => {
    try {
      const response = await api.post(
        "/platform/integrations/gmail/disconnect",
      );
      return response.data;
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      throw error;
    }
  },

  refreshGmailToken: async () => {
    try {
      const response = await api.post(
        "/platform/integrations/gmail/refresh-token",
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing Gmail token:", error);
      throw error;
    }
  },

  // ============================================
  // OUTLOOK INTEGRATION
  // ============================================

  getOutlookStatus: async () => {
    try {
      const response = await api.get("/platform/integrations/outlook/status");
      return response.data;
    } catch (error) {
      console.error("Error getting Outlook status:", error);
      throw error;
    }
  },

  connectOutlook: () => {
    return new Promise((resolve, reject) => {
      try {
        const { left, top } = getPopupPosition();

        // Close any existing popup
        if (activePopup && !activePopup.closed) {
          activePopup.close();
        }
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
        }

        // Get token and open popup directly to backend OAuth endpoint
        // The backend will handle the redirect to Microsoft OAuth
        const token = localStorage.getItem("token");
        const oauthUrl = `${api.defaults.baseURL}/platform/integrations/outlook/connect?token=${encodeURIComponent(token)}`;

        // Open popup with the backend OAuth URL
        activePopup = window.open(
          oauthUrl,
          "Outlook Authorization",
          `width=${POPUP_CONFIG.width},height=${POPUP_CONFIG.height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
        );

        if (!activePopup) {
          reject(
            new Error("Popup blocked. Please allow popups for this site."),
          );
          return;
        }

        activePopup.focus();

        // Poll for popup close
        popupCheckInterval = setInterval(async () => {
          if (activePopup && activePopup.closed) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
            activePopup = null;

            // Verify connection status
            try {
              const status = await integrationService.getOutlookStatus();
              if (status.connected) {
                resolve({
                  success: true,
                  integration: "outlook",
                  data: status,
                });
              } else {
                resolve({
                  success: false,
                  integration: "outlook",
                  error: "Connection not completed",
                });
              }
            } catch {
              resolve({
                success: false,
                integration: "outlook",
                error: "Failed to verify connection",
              });
            }
          }
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  },

  disconnectOutlook: async () => {
    try {
      const response = await api.post(
        "/platform/integrations/outlook/disconnect",
      );
      return response.data;
    } catch (error) {
      console.error("Error disconnecting Outlook:", error);
      throw error;
    }
  },

  refreshOutlookToken: async () => {
    try {
      const response = await api.post(
        "/platform/integrations/outlook/refresh-token",
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing Outlook token:", error);
      throw error;
    }
  },

  // ============================================
  // HUBSPOT INTEGRATION
  // ============================================

  getHubSpotIntegration: async () => {
    try {
      const response = await api.get("/platform/v1/hubspot/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error getting HubSpot integration:", error);
      throw error;
    }
  },

  connectHubSpot: () => {
    console.log('📞 connectHubSpot called');
    return integrationService.connectOAuthV1(
      "hubspot",
      "HubSpot",
      "/v1/hubspot/oauth/authorize",
    );
  },

  deleteHubSpotIntegration: async () => {
    try {
      const response = await api.delete("/platform/v1/hubspot/integrations");
      return response.data;
    } catch (error) {
      console.error("Error deleting HubSpot integration:", error);
      throw error;
    }
  },

  testHubSpotConnection: async () => {
    try {
      const response = await api.post("/platform/v1/hubspot/integrations/test");
      return response.data;
    } catch (error) {
      console.error("Error testing HubSpot connection:", error);
      throw error;
    }
  },

  // ============================================
  // ODOO INTEGRATION
  // ============================================

  getOdooIntegration: async () => {
    try {
      const response = await api.get("/platform/v1/odoo/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error getting Odoo integration:", error);
      throw error;
    }
  },

  createOdooIntegration: async (data) => {
    try {
      const response = await api.post("/platform/v1/odoo/integrations", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Odoo integration:", error);
      throw error;
    }
  },

  updateOdooIntegration: async (data) => {
    try {
      const response = await api.put("/platform/v1/odoo/integrations", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Odoo integration:", error);
      throw error;
    }
  },

  deleteOdooIntegration: async () => {
    try {
      const response = await api.delete("/platform/v1/odoo/integrations");
      return response.data;
    } catch (error) {
      console.error("Error deleting Odoo integration:", error);
      throw error;
    }
  },

  testOdooConnection: async () => {
    try {
      const response = await api.post("/platform/v1/odoo/integrations/test");
      return response.data;
    } catch (error) {
      console.error("Error testing Odoo connection:", error);
      throw error;
    }
  },

  // ============================================
  // PIPEDRIVE INTEGRATION
  // ============================================

  getPipedriveIntegration: async () => {
    try {
      const response = await api.get("/platform/v1/pipedrive/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error getting Pipedrive integration:", error);
      throw error;
    }
  },

  connectPipedrive: () => {
    console.log('📞 connectPipedrive called');
    return integrationService.connectOAuthV1(
      "pipedrive",
      "Pipedrive",
      "/v1/pipedrive/oauth/authorize",
    );
  },

  deletePipedriveIntegration: async () => {
    try {
      const response = await api.delete("/platform/v1/pipedrive/integrations");
      return response.data;
    } catch (error) {
      console.error("Error deleting Pipedrive integration:", error);
      throw error;
    }
  },

  testPipedriveConnection: async () => {
    try {
      const response = await api.post(
        "/platform/v1/pipedrive/integrations/test",
      );
      return response.data;
    } catch (error) {
      console.error("Error testing Pipedrive connection:", error);
      throw error;
    }
  },

  // ============================================
  // SALESFORCE INTEGRATION
  // ============================================

  getSalesforceIntegration: async () => {
    try {
      const response = await api.get("/platform/v1/salesforce/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error getting Salesforce integration:", error);
      throw error;
    }
  },

  connectSalesforce: () => {
    console.log('📞 connectSalesforce called');
    return integrationService.connectOAuthV1(
      "salesforce",
      "Salesforce",
      "/v1/salesforce/oauth/authorize",
    );
  },

  deleteSalesforceIntegration: async () => {
    try {
      const response = await api.delete("/platform/v1/salesforce/integrations");
      return response.data;
    } catch (error) {
      console.error("Error deleting Salesforce integration:", error);
      throw error;
    }
  },

  testSalesforceConnection: async () => {
    try {
      const response = await api.post(
        "/platform/v1/salesforce/integrations/test",
      );
      return response.data;
    } catch (error) {
      console.error("Error testing Salesforce connection:", error);
      throw error;
    }
  },

  // ============================================
  // ZOHO INTEGRATION
  // ============================================

  getZohoIntegration: async () => {
    try {
      const response = await api.get("/platform/v1/zoho/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error getting Zoho integration:", error);
      throw error;
    }
  },

  connectZoho: () => {
    console.log('📞 connectZoho called');
    return integrationService.connectOAuthV1(
      "zoho",
      "Zoho",
      "/v1/zoho/oauth/authorize",
    );
  },

  deleteZohoIntegration: async () => {
    try {
      const response = await api.delete("/platform/v1/zoho/integrations");
      return response.data;
    } catch (error) {
      console.error("Error deleting Zoho integration:", error);
      throw error;
    }
  },

  testZohoConnection: async () => {
    try {
      const response = await api.post("/platform/v1/zoho/integrations/test");
      return response.data;
    } catch (error) {
      console.error("Error testing Zoho connection:", error);
      throw error;
    }
  },

  // ============================================
  // FACEBOOK INTEGRATION
  // ============================================

  getFacebookIntegrations: async () => {
    try {
      const response = await api.get("/platform/v1/facebook/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Error getting Facebook integrations:", error);
      throw error;
    }
  },

  getFacebookIntegration: async (integrationId) => {
    try {
      const response = await api.get(
        `/platform/v1/facebook/integrations/${integrationId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting Facebook integration:", error);
      throw error;
    }
  },

  connectFacebook: () => {
    return integrationService.connectOAuthV1(
      "facebook",
      "Facebook",
      "/v1/facebook/oauth/authorize",
    );
  },

  deleteFacebookIntegration: async (integrationId) => {
    try {
      const response = await api.delete(
        `/platform/v1/facebook/integrations/${integrationId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Facebook integration:", error);
      throw error;
    }
  },

  testFacebookConnection: async (integrationId) => {
    try {
      const response = await api.post(
        `/platform/v1/facebook/integrations/${integrationId}/test`,
      );
      return response.data;
    } catch (error) {
      console.error("Error testing Facebook connection:", error);
      throw error;
    }
  },

  // ============================================
  // LINKEDIN INTEGRATION
  // ============================================

  getLinkedInIntegrations: async () => {
    try {
      const response = await api.get("/platform/v1/linkedin/integrations");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Error getting LinkedIn integrations:", error);
      throw error;
    }
  },

  getLinkedInIntegration: async (integrationId) => {
    try {
      const response = await api.get(
        `/platform/v1/linkedin/integrations/${integrationId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting LinkedIn integration:", error);
      throw error;
    }
  },

  connectLinkedIn: () => {
    return integrationService.connectOAuthV1(
      "linkedin",
      "LinkedIn",
      "/v1/linkedin/oauth/authorize",
    );
  },

  deleteLinkedInIntegration: async (integrationId) => {
    try {
      const response = await api.delete(
        `/platform/v1/linkedin/integrations/${integrationId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting LinkedIn integration:", error);
      throw error;
    }
  },

  testLinkedInConnection: async (integrationId) => {
    try {
      const response = await api.post(
        `/platform/v1/linkedin/integrations/${integrationId}/test`,
      );
      return response.data;
    } catch (error) {
      console.error("Error testing LinkedIn connection:", error);
      throw error;
    }
  },

  // ============================================
  // TELEGRAM INTEGRATION
  // ============================================

  requestTelegramLogin: async (phoneNumber) => {
    try {
      const response = await api.post("/platform/telegram/oauth/request", {
        phone_number: phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.error("Error requesting Telegram login:", error);
      throw error;
    }
  },

  verifyTelegramLogin: async (data) => {
    try {
      const response = await api.post("/platform/telegram/oauth/verify", data);
      return response.data;
    } catch (error) {
      console.error("Error verifying Telegram login:", error);
      throw error;
    }
  },

  getTelegramSessions: async () => {
    try {
      const response = await api.get("/platform/telegram/sessions");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Error getting Telegram sessions:", error);
      throw error;
    }
  },

  getTelegramSession: async (telegramUserId) => {
    try {
      const response = await api.get(
        `/platform/telegram/sessions/${telegramUserId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting Telegram session:", error);
      throw error;
    }
  },

  disconnectTelegramSession: async (telegramUserId) => {
    try {
      const response = await api.delete(
        `/platform/telegram/sessions/${telegramUserId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error disconnecting Telegram session:", error);
      throw error;
    }
  },

  testTelegramConnection: async (telegramUserId) => {
    try {
      const response = await api.post(
        `/platform/telegram/sessions/${telegramUserId}/test`,
      );
      return response.data;
    } catch (error) {
      console.error("Error testing Telegram connection:", error);
      throw error;
    }
  },

  // ============================================
  // WHATSAPP INTEGRATION
  // ============================================

  getWhatsAppSessions: async () => {
    try {
      const response = await api.get("/platform/v1/whatsapp/sessions");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { sessions: [], total: 0 };
      }
      console.error("Error getting WhatsApp sessions:", error);
      throw error;
    }
  },

  createWhatsAppSession: async (data) => {
    try {
      // Add implicit parameters
      const requestBody = {
        name: data.phone_number,
        phone_number: data.phone_number,
        account_protection: true,
        log_messages: true,
        webhook_url: "string",
        webhook_enabled: false,
      };

      const response = await api.post(
        "/platform/v1/whatsapp/session",
        requestBody,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating WhatsApp session:", error);
      throw error;
    }
  },

  getWhatsAppQRCode: async () => {
    try {
      const response = await api.get("/platform/v1/whatsapp/session/qrcode");
      return response.data;
    } catch (error) {
      console.error("Error getting WhatsApp QR code:", error);
      throw error;
    }
  },

  getWhatsAppSessionStatus: async (sessionId) => {
    try {
      const response = await api.get(
        `/platform/v1/whatsapp/sessions/${sessionId}/status`,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting WhatsApp session status:", error);
      throw error;
    }
  },

  getWhatsAppSession: async (sessionId) => {
    try {
      const response = await api.get(
        `/platform/v1/whatsapp/sessions/${sessionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting WhatsApp session:", error);
      throw error;
    }
  },

  deleteWhatsAppSession: async (sessionId) => {
    try {
      const response = await api.delete(
        `/platform/v1/whatsapp/sessions/${sessionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting WhatsApp session:", error);
      throw error;
    }
  },

  testWhatsAppConnection: async (sessionId) => {
    try {
      const response = await api.post(
        `/platform/v1/whatsapp/sessions/${sessionId}/test`,
      );
      return response.data;
    } catch (error) {
      console.error("Error testing WhatsApp connection:", error);
      throw error;
    }
  },

  // ============================================
  // TWILIO INTEGRATION (existing)
  // ============================================

  connectTwilio: async (credentials) => {
    try {
      const response = await api.post(
        "/platform/integrations/twilio/connect",
        credentials,
      );
      return response.data;
    } catch (error) {
      console.error("Error connecting Twilio:", error);
      throw error;
    }
  },

  // ============================================
  // VONAGE INTEGRATION (existing)
  // ============================================

  connectVonage: async (credentials) => {
    try {
      const response = await api.post(
        "/platform/integrations/vonage/connect",
        credentials,
      );
      return response.data;
    } catch (error) {
      console.error("Error connecting Vonage:", error);
      throw error;
    }
  },
};

export default integrationService;
