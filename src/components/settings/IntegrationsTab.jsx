import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { SectionCard } from './SettingsComponents';
import { integrationService } from '../../services/IntegrationService';
import {
  ConnectingModal,
  IntegrationSuccessModal,
  IntegrationErrorModal,
  OdooIntegrationModal,
  TelegramLoginModal,
  WhatsAppConnectModal,
  TwilioNumberModal,
  VonageNumberModal
} from '../modals/Modals';

// Import icons
import salesforceIcon from '../../assets/IntegrationIcons/salesforce.png';
import pipedriveIcon from '../../assets/IntegrationIcons/Pipedrive.png';
import hubspotIcon from '../../assets/IntegrationIcons/hubspot.png';
import zohoIcon from '../../assets/IntegrationIcons/zoho.png';
import odooIcon from '../../assets/IntegrationIcons/odoo.png';
import outlookIcon from '../../assets/IntegrationIcons/outlook.png';
import googleIcon from '../../assets/IntegrationIcons/google.png';
import linkedinIcon from '../../assets/IntegrationIcons/linkedin.png';
import whatsappIcon from '../../assets/IntegrationIcons/whatsapp.png';
import telegramIcon from '../../assets/IntegrationIcons/telegram.png';
import twilioIcon from '../../assets/IntegrationIcons/twilio.png';
import vonageIcon from '../../assets/IntegrationIcons/vonage.png';

// Facebook placeholder icon
const FacebookIcon = () => (
  <div className="w-5 h-5 bg-[#1877F2] rounded flex items-center justify-center">
    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </div>
);

// Integration configuration
const INTEGRATION_CONFIG = {
  // CRM Integrations
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync CRM data',
    icon: salesforceIcon,
    category: 'CRM',
    type: 'oauth'
  },
  pipedrive: {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'Sales pipeline management',
    icon: pipedriveIcon,
    category: 'CRM',
    type: 'oauth'
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing automation',
    icon: hubspotIcon,
    category: 'CRM',
    type: 'oauth'
  },
  zoho: {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Customer relationship management',
    icon: zohoIcon,
    category: 'CRM',
    type: 'oauth'
  },
  odoo: {
    id: 'odoo',
    name: 'Odoo',
    description: 'All-in-one business software',
    icon: odooIcon,
    category: 'CRM',
    type: 'credentials'
  },
  // Email Integrations
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sync email campaigns',
    icon: googleIcon,
    category: 'Email',
    type: 'oauth'
  },
  outlook: {
    id: 'outlook',
    name: 'Outlook',
    description: 'Microsoft email integration',
    icon: outlookIcon,
    category: 'Email',
    type: 'oauth'
  },
  // Social Integrations
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking',
    icon: linkedinIcon,
    category: 'Social',
    type: 'oauth'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social media integration',
    icon: null, // Using SVG component
    category: 'Social',
    type: 'oauth'
  },
  // Messaging Integrations
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Business messaging',
    icon: whatsappIcon,
    category: 'Messaging',
    type: 'qrcode'
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    description: 'Secure messaging',
    icon: telegramIcon,
    category: 'Messaging',
    type: 'phone'
  },
  // Phone Integrations
  twilio: {
    id: 'twilio',
    name: 'Twilio',
    description: 'Voice and SMS',
    icon: twilioIcon,
    category: 'Phone',
    type: 'credentials'
  },
  vonage: {
    id: 'vonage',
    name: 'Vonage',
    description: 'Communications platform',
    icon: vonageIcon,
    category: 'Phone',
    type: 'credentials'
  }
};

const IntegrationsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState({});
  const [integrationDetails, setIntegrationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showConnecting, setShowConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showOdooModal, setShowOdooModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTwilioModal, setShowTwilioModal] = useState(false);
  const [showVonageModal, setShowVonageModal] = useState(false);

  const [currentIntegration, setCurrentIntegration] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchIntegrationStatuses();
  }, []);

  const fetchIntegrationStatuses = async () => {
    setIsLoading(true);

    const statuses = {};
    const details = {};

    try {
      // Fetch Gmail status
      try {
        const gmail = await integrationService.getGmailStatus();
        statuses.gmail = gmail?.connected ? 'connected' : 'not_connected';
        if (gmail?.connected) {
          details.gmail = { email: gmail.email, connectedAt: gmail.connected_at };
        }
      } catch (e) {
        statuses.gmail = 'not_connected';
      }

      // Fetch Outlook status
      try {
        const outlook = await integrationService.getOutlookStatus();
        statuses.outlook = outlook?.connected ? 'connected' : 'not_connected';
        if (outlook?.connected) {
          details.outlook = { email: outlook.email, connectedAt: outlook.connected_at };
        }
      } catch (e) {
        statuses.outlook = 'not_connected';
      }

      // Fetch CRM statuses
      try {
        const hubspot = await integrationService.getHubSpotIntegration();
        statuses.hubspot = hubspot ? 'connected' : 'not_connected';
        if (hubspot) details.hubspot = hubspot;
      } catch (e) {
        statuses.hubspot = 'not_connected';
      }

      try {
        const pipedrive = await integrationService.getPipedriveIntegration();
        statuses.pipedrive = pipedrive ? 'connected' : 'not_connected';
        if (pipedrive) details.pipedrive = pipedrive;
      } catch (e) {
        statuses.pipedrive = 'not_connected';
      }

      try {
        const salesforce = await integrationService.getSalesforceIntegration();
        statuses.salesforce = salesforce ? 'connected' : 'not_connected';
        if (salesforce) details.salesforce = salesforce;
      } catch (e) {
        statuses.salesforce = 'not_connected';
      }

      try {
        const zoho = await integrationService.getZohoIntegration();
        statuses.zoho = zoho ? 'connected' : 'not_connected';
        if (zoho) details.zoho = zoho;
      } catch (e) {
        statuses.zoho = 'not_connected';
      }

      try {
        const odoo = await integrationService.getOdooIntegration();
        statuses.odoo = odoo ? 'connected' : 'not_connected';
        if (odoo) details.odoo = odoo;
      } catch (e) {
        statuses.odoo = 'not_connected';
      }

      // Fetch Social statuses
      try {
        const linkedin = await integrationService.getLinkedInIntegrations();
        statuses.linkedin = linkedin?.length > 0 ? 'connected' : 'not_connected';
        if (linkedin?.length > 0) details.linkedin = linkedin[0];
      } catch (e) {
        statuses.linkedin = 'not_connected';
      }

      try {
        const facebook = await integrationService.getFacebookIntegrations();
        statuses.facebook = facebook?.length > 0 ? 'connected' : 'not_connected';
        if (facebook?.length > 0) details.facebook = facebook[0];
      } catch (e) {
        statuses.facebook = 'not_connected';
      }

      // Fetch Messaging statuses
      try {
        const telegram = await integrationService.getTelegramSessions();
        statuses.telegram = telegram?.length > 0 ? 'connected' : 'not_connected';
        if (telegram?.length > 0) details.telegram = telegram[0];
      } catch (e) {
        statuses.telegram = 'not_connected';
      }

      try {
        const whatsapp = await integrationService.getWhatsAppSessions();
        statuses.whatsapp = whatsapp?.sessions?.length > 0 ? 'connected' : 'not_connected';
        if (whatsapp?.sessions?.length > 0) details.whatsapp = whatsapp.sessions[0];
      } catch (e) {
        statuses.whatsapp = 'not_connected';
      }

      // Set default statuses for phone integrations
      statuses.twilio = statuses.twilio || 'not_connected';
      statuses.vonage = statuses.vonage || 'not_connected';

    } catch (error) {
      console.error('Error fetching integration statuses:', error);
    }

    setIntegrations(statuses);
    setIntegrationDetails(details);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchIntegrationStatuses();
    setIsRefreshing(false);
  };

  const handleConnect = async (integrationId) => {
    const config = INTEGRATION_CONFIG[integrationId];
    if (!config) return;

    setCurrentIntegration(config);

    // Handle special integration types
    if (config.type === 'credentials') {
      if (integrationId === 'odoo') {
        setShowOdooModal(true);
      } else if (integrationId === 'twilio') {
        setShowTwilioModal(true);
      } else if (integrationId === 'vonage') {
        setShowVonageModal(true);
      }
      return;
    }

    if (config.type === 'phone') {
      setShowTelegramModal(true);
      return;
    }

    if (config.type === 'qrcode') {
      setShowWhatsAppModal(true);
      return;
    }

    // OAuth flow
    setShowConnecting(true);

    try {
      let result;

      switch (integrationId) {
        case 'gmail':
          result = await integrationService.connectGmail();
          break;
        case 'outlook':
          result = await integrationService.connectOutlook();
          break;
        case 'hubspot':
          result = await integrationService.connectHubSpot();
          break;
        case 'pipedrive':
          result = await integrationService.connectPipedrive();
          break;
        case 'salesforce':
          result = await integrationService.connectSalesforce();
          break;
        case 'zoho':
          result = await integrationService.connectZoho();
          break;
        case 'linkedin':
          result = await integrationService.connectLinkedIn();
          break;
        case 'facebook':
          result = await integrationService.connectFacebook();
          break;
        default:
          throw new Error('Unknown integration');
      }

      setShowConnecting(false);

      if (result?.success) {
        setIntegrations(prev => ({ ...prev, [integrationId]: 'connected' }));
        setSuccessMessage(`Successfully connected to ${config.name}.`);
        setShowSuccess(true);
        fetchIntegrationStatuses();
      } else {
        setErrorMessage(result?.error || 'Connection was not completed.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setErrorMessage(error.message || 'Failed to connect. Please try again.');
      setShowError(true);
    }
  };

  const handleDisconnect = async (integrationId) => {
    const config = INTEGRATION_CONFIG[integrationId];
    if (!config) return;

    setCurrentIntegration(config);
    setShowConnecting(true);

    try {
      switch (integrationId) {
        case 'gmail':
          await integrationService.disconnectGmail();
          break;
        case 'outlook':
          await integrationService.disconnectOutlook();
          break;
        case 'hubspot':
          await integrationService.deleteHubSpotIntegration();
          break;
        case 'pipedrive':
          await integrationService.deletePipedriveIntegration();
          break;
        case 'salesforce':
          await integrationService.deleteSalesforceIntegration();
          break;
        case 'zoho':
          await integrationService.deleteZohoIntegration();
          break;
        case 'odoo':
          await integrationService.deleteOdooIntegration();
          break;
        case 'linkedin':
          if (integrationDetails.linkedin?.id) {
            await integrationService.deleteLinkedInIntegration(integrationDetails.linkedin.id);
          }
          break;
        case 'facebook':
          if (integrationDetails.facebook?.id) {
            await integrationService.deleteFacebookIntegration(integrationDetails.facebook.id);
          }
          break;
        case 'telegram':
          if (integrationDetails.telegram?.telegram_user_id) {
            await integrationService.disconnectTelegramSession(integrationDetails.telegram.telegram_user_id);
          }
          break;
        case 'whatsapp':
          if (integrationDetails.whatsapp?.id) {
            await integrationService.deleteWhatsAppSession(integrationDetails.whatsapp.id);
          }
          break;
        default:
          await integrationService.disconnect(integrationId);
      }

      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, [integrationId]: 'not_connected' }));
      setIntegrationDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[integrationId];
        return newDetails;
      });
      setSuccessMessage(`Successfully disconnected from ${config.name}.`);
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setErrorMessage(error.message || 'Failed to disconnect. Please try again.');
      setShowError(true);
    }
  };

  // Handle Odoo connection
  const handleOdooConnect = async (formData, isTest = false) => {
    if (isTest) {
      return await integrationService.testOdooConnection();
    }

    setShowOdooModal(false);
    setShowConnecting(true);

    try {
      if (integrationDetails.odoo) {
        await integrationService.updateOdooIntegration(formData);
      } else {
        await integrationService.createOdooIntegration(formData);
      }

      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, odoo: 'connected' }));
      setSuccessMessage('Successfully connected to Odoo.');
      setShowSuccess(true);
      fetchIntegrationStatuses();
    } catch (error) {
      setShowConnecting(false);
      setErrorMessage(error.message || 'Failed to connect Odoo.');
      setShowError(true);
    }
  };

  // Handle Telegram connection
  const handleTelegramConnect = async (action, data) => {
    if (action === 'request') {
      return await integrationService.requestTelegramLogin(data.phone_number);
    } else if (action === 'verify') {
      const result = await integrationService.verifyTelegramLogin(data);
      if (result.success && !result.requires_2fa) {
        setShowTelegramModal(false);
        setIntegrations(prev => ({ ...prev, telegram: 'connected' }));
        setSuccessMessage('Successfully connected to Telegram.');
        setShowSuccess(true);
        fetchIntegrationStatuses();
      }
      return result;
    }
  };

  // Handle WhatsApp connection
  const handleWhatsAppConnect = async (action, data) => {
    if (action === 'create') {
      return await integrationService.createWhatsAppSession(data);
    } else if (action === 'qrcode') {
      return await integrationService.getWhatsAppQRCode();
    } else if (action === 'status') {
      const result = await integrationService.getWhatsAppSessionStatus(data.session_id);
      if (result.status === 'connected' || result.status === 'ready') {
        setIntegrations(prev => ({ ...prev, whatsapp: 'connected' }));
        fetchIntegrationStatuses();
      }
      return result;
    }
  };

  // Handle Twilio import
  const handleTwilioImport = async (formData) => {
    setShowTwilioModal(false);
    setShowConnecting(true);

    try {
      await integrationService.connectTwilio(formData);
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, twilio: 'connected' }));
      setSuccessMessage('Successfully connected to Twilio.');
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setErrorMessage(error.message || 'Failed to connect Twilio.');
      setShowError(true);
    }
  };

  // Handle Vonage import
  const handleVonageImport = async (formData) => {
    setShowVonageModal(false);
    setShowConnecting(true);

    try {
      await integrationService.connectVonage(formData);
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, vonage: 'connected' }));
      setSuccessMessage('Successfully connected to Vonage.');
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setErrorMessage(error.message || 'Failed to connect Vonage.');
      setShowError(true);
    }
  };

  // Filter integrations based on search
  const getFilteredIntegrations = () => {
    const allIntegrations = Object.values(INTEGRATION_CONFIG).map(config => ({
      ...config,
      connected: integrations[config.id] === 'connected',
      details: integrationDetails[config.id]
    }));

    if (!searchQuery) return allIntegrations;

    return allIntegrations.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredIntegrations = getFilteredIntegrations();
  const connectedIntegrations = filteredIntegrations.filter(i => i.connected);
  const availableIntegrations = filteredIntegrations.filter(i => !i.connected);

  // Render integration icon
  const renderIcon = (integration) => {
    if (integration.id === 'facebook') {
      return <FacebookIcon />;
    }
    return (
      <img
        src={integration.icon}
        alt={integration.name}
        className="w-5 h-5 object-contain"
      />
    );
  };

  // Get detail text for connected integration
  const getDetailText = (integration) => {
    const detail = integration.details;
    if (!detail) return null;

    if (detail.email) return detail.email;
    if (detail.name) return detail.name;
    if (detail.page_name) return detail.page_name;
    if (detail.username) return `@${detail.username}`;
    if (detail.phone_number) return detail.phone_number;
    if (detail.odoo_url) return detail.odoo_url;

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Connected Integrations */}
      <SectionCard
        title="Connected"
        description={`${connectedIntegrations.length} integration${connectedIntegrations.length !== 1 ? 's' : ''} active`}
      >
        {connectedIntegrations.length > 0 ? (
          <div className="space-y-3">
            {connectedIntegrations.map(integration => (
              <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-green-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    {renderIcon(integration)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500">
                      {getDetailText(integration) || integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                    {integration.category}
                  </span>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No connected integrations</p>
            <p className="text-xs text-gray-400 mt-1">Connect integrations below to get started</p>
          </div>
        )}
      </SectionCard>

      {/* Available Integrations */}
      <SectionCard
        title="Available Integrations"
        description="Connect more tools to enhance your workflow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableIntegrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {renderIcon(integration)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                  <p className="text-xs text-gray-500">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded hidden sm:block">
                  {integration.category}
                </span>
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* API Access */}
      <SectionCard
        title="API Access"
        description="Manage your API keys for custom integrations"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">API Key</p>
              <p className="text-xs text-gray-500 font-mono mt-1">sk-************************</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                Copy
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Regenerate
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Use this API key to integrate AI Workforce with your custom applications.
            <a href="#" className="text-blue-600 hover:underline ml-1">View documentation</a>
          </p>
        </div>
      </SectionCard>

      {/* Modals */}
      <ConnectingModal
        isOpen={showConnecting}
        onClose={() => {
          setShowConnecting(false);
          integrationService.closePopup();
        }}
        title="Processing..."
        message="Please wait while we process your request."
      />

      <IntegrationSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        message={successMessage}
        buttonText="Done"
      />

      <IntegrationErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Error"
        message={errorMessage}
        buttonText="Close"
        onRetry={() => setShowError(false)}
      />

      <OdooIntegrationModal
        isOpen={showOdooModal}
        onClose={() => setShowOdooModal(false)}
        onConnect={handleOdooConnect}
        existingData={integrationDetails.odoo}
      />

      <TelegramLoginModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onConnect={handleTelegramConnect}
      />

      <WhatsAppConnectModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onConnect={handleWhatsAppConnect}
      />

      <TwilioNumberModal
        isOpen={showTwilioModal}
        onClose={() => setShowTwilioModal(false)}
        onImport={handleTwilioImport}
      />

      <VonageNumberModal
        isOpen={showVonageModal}
        onClose={() => setShowVonageModal(false)}
        onImport={handleVonageImport}
      />
    </div>
  );
};

export default IntegrationsTab;
