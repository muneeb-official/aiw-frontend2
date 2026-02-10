// src/pages/auth/IntegrationHubPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConnectingModal,
  IntegrationSuccessModal,
  IntegrationErrorModal,
  TwilioNumberModal,
  VonageNumberModal,
  OdooIntegrationModal,
  TelegramLoginModal,
  WhatsAppConnectModal
} from '../../components/modals/Modals';
import Header from '../../components/layout/Header';
import { integrationService } from '../../services/IntegrationService';
import backgroundImage from '../../assets/Background.png';
import Sales from '../../assets/IntegrationIcons/salesforce.png';
import pipe from '../../assets/IntegrationIcons/Pipedrive.png';
import hub from '../../assets/IntegrationIcons/hubspot.png';
import zoho from '../../assets/IntegrationIcons/zoho.png';
import odoo from '../../assets/IntegrationIcons/odoo.png';
import outlook from '../../assets/IntegrationIcons/outlook.png';
import google from '../../assets/IntegrationIcons/google.png';
import calendly from '../../assets/IntegrationIcons/calendly.png';
import LinkedIn from '../../assets/IntegrationIcons/linkedin.png';
import whatsapp from '../../assets/IntegrationIcons/whatsapp.png';
import telegram from '../../assets/IntegrationIcons/telegram.png';
import twilio from '../../assets/IntegrationIcons/twilio.png';
import vonage from '../../assets/IntegrationIcons/vonage.png';

// Integration Icons
const SalesforceIcon = () => <img src={Sales} alt="" />;
const PipedriveIcon = () => <img src={pipe} alt="" />;
const HubspotIcon = () => <img src={hub} alt="" />;
const ZohoIcon = () => <img src={zoho} alt="" />;
const OdooIcon = () => <img src={odoo} alt="" />;
const OutlookIcon = () => <img src={outlook} alt="" />;
const GoogleIcon = () => <img src={google} alt="" />;
const CalendlyIcon = () => <img src={calendly} alt="" />;
const LinkedInIcon = () => <img src={LinkedIn} alt="" />;
const WhatsAppIcon = () => <img src={whatsapp} alt="" />;
const TelegramIcon = () => <img src={telegram} alt="" />;
const TwilioIcon = () => <img src={twilio} alt="" />;
const VonageIcon = () => <img src={vonage} alt="" />;

// Facebook placeholder icon (SVG)
const FacebookIcon = () => (
  <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center">
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </div>
);

// Integration Item Component
const IntegrationItem = ({ icon, name, status, onConnect, onRetry, disabled = false }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return <span className="text-[#10B981] font-medium text-sm">Connected</span>;
      case 'failed':
        return (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              Failed to connect
            </span>
            <button
              onClick={onRetry}
              className="text-[#4F46E5] font-medium text-sm hover:text-[#4338CA] transition-colors"
            >
              Retry Connecting
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={onConnect}
            disabled={disabled}
            className={`font-medium text-[16px] transition-colors ${
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#4F46E5] hover:text-[#4338CA]'
            }`}
          >
            Connect
          </button>
        );
    }
  };

  return (
    <div className={`flex items-center justify-between p-8 bg-white border border-gray-100 rounded-xl ${
      disabled ? 'opacity-50' : ''
    }`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{name}</span>
      </div>
      {getStatusDisplay()}
    </div>
  );
};

// Main Integration Hub Page
const IntegrationHubPage = () => {
  const navigate = useNavigate();

  const [integrations, setIntegrations] = useState({
    salesforce: 'not_connected',
    pipedrive: 'not_connected',
    hubspot: 'not_connected',
    zoho: 'not_connected',
    odoo: 'not_connected',
    outlook: 'not_connected',
    gmail: 'not_connected',
    calendly: 'not_connected',
    linkedin: 'not_connected',
    facebook: 'not_connected',
    whatsapp: 'not_connected',
    telegram: 'not_connected',
    twilio: 'not_connected',
    vonage: 'not_connected',
  });

  const [showConnecting, setShowConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showTwilioModal, setShowTwilioModal] = useState(false);
  const [showVonageModal, setShowVonageModal] = useState(false);
  const [showOdooModal, setShowOdooModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [odooExistingData, setOdooExistingData] = useState(null);

  // Fetch integration statuses on mount
  useEffect(() => {
    fetchIntegrationStatuses();
  }, []);

  const fetchIntegrationStatuses = async () => {
    try {
      const statuses = await integrationService.getIntegrations();
      if (statuses && typeof statuses === 'object') {
        setIntegrations(prev => ({ ...prev, ...statuses }));
      }
    } catch (error) {
      console.log('Could not fetch integration statuses:', error);
    }

    // Also check specific integration statuses
    try {
      const [gmailStatus, outlookStatus] = await Promise.allSettled([
        integrationService.getGmailStatus(),
        integrationService.getOutlookStatus()
      ]);

      if (gmailStatus.status === 'fulfilled' && gmailStatus.value?.connected) {
        setIntegrations(prev => ({ ...prev, gmail: 'connected' }));
      }
      if (outlookStatus.status === 'fulfilled' && outlookStatus.value?.connected) {
        setIntegrations(prev => ({ ...prev, outlook: 'connected' }));
      }
    } catch (error) {
      console.log('Could not fetch email statuses:', error);
    }

    // Check CRM integrations
    try {
      const [hubspot, pipedrive, salesforce, zohoData, odooData] = await Promise.allSettled([
        integrationService.getHubSpotIntegration(),
        integrationService.getPipedriveIntegration(),
        integrationService.getSalesforceIntegration(),
        integrationService.getZohoIntegration(),
        integrationService.getOdooIntegration()
      ]);

      if (hubspot.status === 'fulfilled' && hubspot.value) {
        setIntegrations(prev => ({ ...prev, hubspot: 'connected' }));
      }
      if (pipedrive.status === 'fulfilled' && pipedrive.value) {
        setIntegrations(prev => ({ ...prev, pipedrive: 'connected' }));
      }
      if (salesforce.status === 'fulfilled' && salesforce.value) {
        setIntegrations(prev => ({ ...prev, salesforce: 'connected' }));
      }
      if (zohoData.status === 'fulfilled' && zohoData.value) {
        setIntegrations(prev => ({ ...prev, zoho: 'connected' }));
      }
      if (odooData.status === 'fulfilled' && odooData.value) {
        setIntegrations(prev => ({ ...prev, odoo: 'connected' }));
        setOdooExistingData(odooData.value);
      }
    } catch (error) {
      console.log('Could not fetch CRM statuses:', error);
    }

    // Check social integrations
    try {
      const [linkedinData, facebookData] = await Promise.allSettled([
        integrationService.getLinkedInIntegrations(),
        integrationService.getFacebookIntegrations()
      ]);

      if (linkedinData.status === 'fulfilled' && linkedinData.value?.length > 0) {
        setIntegrations(prev => ({ ...prev, linkedin: 'connected' }));
      }
      if (facebookData.status === 'fulfilled' && facebookData.value?.length > 0) {
        setIntegrations(prev => ({ ...prev, facebook: 'connected' }));
      }
    } catch (error) {
      console.log('Could not fetch social statuses:', error);
    }

    // Check messaging integrations
    try {
      const [telegramSessions, whatsappSessions] = await Promise.allSettled([
        integrationService.getTelegramSessions(),
        integrationService.getWhatsAppSessions()
      ]);

      if (telegramSessions.status === 'fulfilled' && telegramSessions.value?.length > 0) {
        setIntegrations(prev => ({ ...prev, telegram: 'connected' }));
      }
      if (whatsappSessions.status === 'fulfilled' && whatsappSessions.value?.sessions?.length > 0) {
        setIntegrations(prev => ({ ...prev, whatsapp: 'connected' }));
      }
    } catch (error) {
      console.log('Could not fetch messaging statuses:', error);
    }
  };

  const connectedCRM = Object.entries(integrations).find(
    ([key, value]) =>
      ['salesforce', 'pipedrive', 'hubspot', 'zoho', 'odoo'].includes(key) && value === 'connected'
  );

  const hasAnyConnection = Object.values(integrations).some(status => status === 'connected');

  // Handle OAuth connection for CRM integrations (using V1 endpoints)
  const handleCRMConnect = async (integrationKey, integrationName) => {
    setCurrentIntegration({ key: integrationKey, name: integrationName });
    setShowConnecting(true);

    try {
      let result;
      switch (integrationKey) {
        case 'salesforce':
          result = await integrationService.connectSalesforce();
          break;
        case 'pipedrive':
          result = await integrationService.connectPipedrive();
          break;
        case 'hubspot':
          result = await integrationService.connectHubSpot();
          break;
        case 'zoho':
          result = await integrationService.connectZoho();
          break;
        default:
          throw new Error('Unknown CRM integration');
      }

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, [integrationKey]: 'connected' }));
        setSuccessMessage(`We have successfully connected your ${integrationName} account.`);
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, [integrationKey]: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, [integrationKey]: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect. Please try again.');
      setShowError(true);
    }
  };

  // Handle Gmail connection
  const handleGmailConnect = async () => {
    setCurrentIntegration({ key: 'gmail', name: 'Gmail' });
    setShowConnecting(true);

    try {
      const result = await integrationService.connectGmail();

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, gmail: 'connected' }));
        setSuccessMessage('We have successfully connected your Gmail account.');
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, gmail: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, gmail: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Gmail. Please try again.');
      setShowError(true);
    }
  };

  // Handle Outlook connection
  const handleOutlookConnect = async () => {
    setCurrentIntegration({ key: 'outlook', name: 'Outlook' });
    setShowConnecting(true);

    try {
      const result = await integrationService.connectOutlook();

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, outlook: 'connected' }));
        setSuccessMessage('We have successfully connected your Outlook account.');
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, outlook: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, outlook: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Outlook. Please try again.');
      setShowError(true);
    }
  };

  // Handle LinkedIn connection
  const handleLinkedInConnect = async () => {
    setCurrentIntegration({ key: 'linkedin', name: 'LinkedIn' });
    setShowConnecting(true);

    try {
      const result = await integrationService.connectLinkedIn();

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, linkedin: 'connected' }));
        setSuccessMessage('We have successfully connected your LinkedIn account.');
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, linkedin: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, linkedin: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect LinkedIn. Please try again.');
      setShowError(true);
    }
  };

  // Handle Facebook connection
  const handleFacebookConnect = async () => {
    setCurrentIntegration({ key: 'facebook', name: 'Facebook' });
    setShowConnecting(true);

    try {
      const result = await integrationService.connectFacebook();

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, facebook: 'connected' }));
        setSuccessMessage('We have successfully connected your Facebook account.');
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, facebook: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, facebook: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Facebook. Please try again.');
      setShowError(true);
    }
  };

  // Handle legacy OAuth connection (for Calendly)
  const handleConnect = async (integrationKey, integrationName) => {
    setCurrentIntegration({ key: integrationKey, name: integrationName });
    setShowConnecting(true);

    try {
      const result = await integrationService.connectOAuth(integrationKey, integrationName);

      setShowConnecting(false);

      if (result.success) {
        setIntegrations(prev => ({ ...prev, [integrationKey]: 'connected' }));
        setSuccessMessage(`We have successfully connected your ${integrationName} account.`);
        setShowSuccess(true);
      } else {
        setIntegrations(prev => ({ ...prev, [integrationKey]: 'failed' }));
        setErrorMessage(result.error || 'Please ensure that you have authorized the connection correctly.');
        setShowError(true);
      }
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, [integrationKey]: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect. Please try again.');
      setShowError(true);
    }
  };

  // Handle Odoo connection
  const handleOdooConnect = async (formData, isTest = false) => {
    if (isTest) {
      // Just test the connection
      const result = await integrationService.testOdooConnection();
      return result;
    }

    setShowOdooModal(false);
    setCurrentIntegration({ key: 'odoo', name: 'Odoo' });
    setShowConnecting(true);

    try {
      if (odooExistingData) {
        await integrationService.updateOdooIntegration(formData);
      } else {
        await integrationService.createOdooIntegration(formData);
      }

      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, odoo: 'connected' }));
      setSuccessMessage('We have successfully connected your Odoo CRM account.');
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, odoo: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Odoo.');
      setShowError(true);
    }
  };

  // Handle Telegram connection
  const handleTelegramConnect = async (action, data) => {
    if (action === 'request') {
      const result = await integrationService.requestTelegramLogin(data.phone_number);
      return result;
    } else if (action === 'verify') {
      const result = await integrationService.verifyTelegramLogin(data);
      if (result.success && !result.requires_2fa) {
        setShowTelegramModal(false);
        setIntegrations(prev => ({ ...prev, telegram: 'connected' }));
        setSuccessMessage('We have successfully connected your Telegram account.');
        setShowSuccess(true);
      }
      return result;
    }
  };

  // Handle WhatsApp connection
  const handleWhatsAppConnect = async (action, data) => {
  if (action === 'create') {
    const result = await integrationService.createWhatsAppSession(data);
    return result; // Should return { success, session_id, qr_code, qr_code_image, status, message }
  } else if (action === 'qrcode') {
    const result = await integrationService.getWhatsAppQRCode(data.session_id);
    return result;
  }
};

  // Handle Twilio import
  const handleTwilioImport = async (formData) => {
    setShowTwilioModal(false);
    setCurrentIntegration({ key: 'twilio', name: 'Twilio' });
    setShowConnecting(true);

    try {
      await integrationService.connectTwilio(formData);
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, twilio: 'connected' }));
      setSuccessMessage('We have successfully connected your Twilio account.');
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, twilio: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Twilio.');
      setShowError(true);
    }
  };

  // Handle Vonage import
  const handleVonageImport = async (formData) => {
    setShowVonageModal(false);
    setCurrentIntegration({ key: 'vonage', name: 'Vonage' });
    setShowConnecting(true);

    try {
      await integrationService.connectVonage(formData);
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, vonage: 'connected' }));
      setSuccessMessage('We have successfully connected your Vonage account.');
      setShowSuccess(true);
    } catch (error) {
      setShowConnecting(false);
      setIntegrations(prev => ({ ...prev, vonage: 'failed' }));
      setErrorMessage(error.message || 'Failed to connect Vonage.');
      setShowError(true);
    }
  };

  const handleRetry = (integrationKey, integrationName) => {
    setIntegrations(prev => ({ ...prev, [integrationKey]: 'not_connected' }));
    if (integrationKey === 'twilio') {
      setShowTwilioModal(true);
    } else if (integrationKey === 'vonage') {
      setShowVonageModal(true);
    } else if (integrationKey === 'odoo') {
      setShowOdooModal(true);
    } else if (integrationKey === 'telegram') {
      setShowTelegramModal(true);
    } else if (integrationKey === 'whatsapp') {
      setShowWhatsAppModal(true);
    } else if (integrationKey === 'gmail') {
      handleGmailConnect();
    } else if (integrationKey === 'outlook') {
      handleOutlookConnect();
    } else if (integrationKey === 'linkedin') {
      handleLinkedInConnect();
    } else if (integrationKey === 'facebook') {
      handleFacebookConnect();
    } else if (['salesforce', 'pipedrive', 'hubspot', 'zoho'].includes(integrationKey)) {
      handleCRMConnect(integrationKey, integrationName);
    } else {
      handleConnect(integrationKey, integrationName);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setCurrentIntegration(null);
    setSuccessMessage('');
  };

  const handleErrorRetry = () => {
    setShowError(false);
    if (currentIntegration) {
      handleRetry(currentIntegration.key, currentIntegration.name);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return (
    <div
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header variant="simple" />

      <main className="max-w-full bg-white mx-auto px-16 py-8 mt-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[32px] font-semibold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Integration Hub
          </h1>
          {hasAnyConnection ? (
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg font-medium hover:bg-[#4338CA] transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => navigate('/onboarding')}
              className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
            >
              Skip For Now
            </button>
          )}
        </div>

        {/* Connect your CRM */}
        <section className="mb-8">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-2">Connect your CRM</h2>
          <div className="space-y-2">
            <IntegrationItem
              icon={<SalesforceIcon />}
              name="Connect your Salesforce account"
              status={integrations.salesforce}
              onConnect={() => handleCRMConnect('salesforce', 'Salesforce')}
              onRetry={() => handleRetry('salesforce', 'Salesforce')}
              disabled={connectedCRM && connectedCRM[0] !== 'salesforce'}
            />
            <IntegrationItem
              icon={<PipedriveIcon />}
              name="Connect your Pipedrive account"
              status={integrations.pipedrive}
              onConnect={() => handleCRMConnect('pipedrive', 'Pipedrive')}
              onRetry={() => handleRetry('pipedrive', 'Pipedrive')}
              disabled={connectedCRM && connectedCRM[0] !== 'pipedrive'}
            />
            <IntegrationItem
              icon={<HubspotIcon />}
              name="Connect your Hubspot account"
              status={integrations.hubspot}
              onConnect={() => handleCRMConnect('hubspot', 'Hubspot')}
              onRetry={() => handleRetry('hubspot', 'Hubspot')}
              disabled={connectedCRM && connectedCRM[0] !== 'hubspot'}
            />
            <IntegrationItem
              icon={<ZohoIcon />}
              name="Connect your Zoho account"
              status={integrations.zoho}
              onConnect={() => handleCRMConnect('zoho', 'Zoho')}
              onRetry={() => handleRetry('zoho', 'Zoho')}
              disabled={connectedCRM && connectedCRM[0] !== 'zoho'}
            />
            <IntegrationItem
              icon={<OdooIcon />}
              name="Connect your Odoo account"
              status={integrations.odoo}
              onConnect={() => setShowOdooModal(true)}
              onRetry={() => handleRetry('odoo', 'Odoo')}
              disabled={connectedCRM && connectedCRM[0] !== 'odoo'}
            />
          </div>
        </section>

        {/* Connect your Email & Calendar */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Connect your Email & Calendar</h2>
          <div className="space-y-3">
            <IntegrationItem
              icon={<OutlookIcon />}
              name="Connect your Outlook account"
              status={integrations.outlook}
              onConnect={handleOutlookConnect}
              onRetry={() => handleRetry('outlook', 'Outlook')}
            />
            <IntegrationItem
              icon={<GoogleIcon />}
              name="Connect your Google account"
              status={integrations.gmail}
              onConnect={handleGmailConnect}
              onRetry={() => handleRetry('gmail', 'Gmail')}
            />
            <IntegrationItem
              icon={<CalendlyIcon />}
              name="Connect your Calendly"
              status={integrations.calendly}
              onConnect={() => handleConnect('calendly', 'Calendly')}
              onRetry={() => handleRetry('calendly', 'Calendly')}
            />
          </div>
        </section>

        {/* Connect your Social Media Account */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Connect your Social Media Account</h2>
          <div className="space-y-3">
            <IntegrationItem
              icon={<LinkedInIcon />}
              name="Connect your LinkedIn account"
              status={integrations.linkedin}
              onConnect={handleLinkedInConnect}
              onRetry={() => handleRetry('linkedin', 'LinkedIn')}
            />
            <IntegrationItem
              icon={<FacebookIcon />}
              name="Connect your Facebook account"
              status={integrations.facebook}
              onConnect={handleFacebookConnect}
              onRetry={() => handleRetry('facebook', 'Facebook')}
            />
            <IntegrationItem
              icon={<WhatsAppIcon />}
              name="Connect your WhatsApp account"
              status={integrations.whatsapp}
              onConnect={() => setShowWhatsAppModal(true)}
              onRetry={() => handleRetry('whatsapp', 'WhatsApp')}
            />
            <IntegrationItem
              icon={<TelegramIcon />}
              name="Connect your Telegram account"
              status={integrations.telegram}
              onConnect={() => setShowTelegramModal(true)}
              onRetry={() => handleRetry('telegram', 'Telegram')}
            />
          </div>
        </section>

        {/* Add your Phone number */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add your Phone number</h2>
          <div className="space-y-3">
            <IntegrationItem
              icon={<TwilioIcon />}
              name="Add your Twilio Number"
              status={integrations.twilio}
              onConnect={() => setShowTwilioModal(true)}
              onRetry={() => handleRetry('twilio', 'Twilio')}
            />
            <IntegrationItem
              icon={<VonageIcon />}
              name="Add your Vonage Number"
              status={integrations.vonage}
              onConnect={() => setShowVonageModal(true)}
              onRetry={() => handleRetry('vonage', 'Vonage')}
            />
          </div>
        </section>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors"
          >
            Continue to Onboarding
          </button>
        </div>
      </main>

      {/* Modals */}
      <ConnectingModal
        isOpen={showConnecting}
        onClose={() => {
          setShowConnecting(false);
          integrationService.closePopup();
        }}
        title="Connecting and importing..."
        message="We are connecting your account. Please complete the authorization in the popup window."
      />

      <IntegrationSuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Successfully Connected!"
        message={successMessage}
        buttonText="Done"
      />

      <IntegrationErrorModal
        isOpen={showError}
        onClose={handleErrorClose}
        title="Failed to connect"
        message={errorMessage}
        buttonText="Retry Connecting"
        onRetry={handleErrorRetry}
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

      <OdooIntegrationModal
        isOpen={showOdooModal}
        onClose={() => setShowOdooModal(false)}
        onConnect={handleOdooConnect}
        existingData={odooExistingData}
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
    </div>
  );
};

export default IntegrationHubPage;
