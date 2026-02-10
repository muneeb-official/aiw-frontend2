// pages/SettingsPage.jsx
import { useState, useEffect } from "react";
import KnowledgeTab from "../../components/settings/KnowledgeTab";
import PromptsTab from "../../components/settings/PromptsTab";
import TemplateLibrary from "../../components/settings/TemplateLibrary";
import TemplateContentEditor from "../../components/settings/TemplateContentEditor";
import {
    ConnectingModal,
    IntegrationSuccessModal,
    IntegrationErrorModal,
    TwilioNumberModal,
    VonageNumberModal,
    TelegramLoginModal,      // ADD THIS
    WhatsAppConnectModal,    
} from '../../components/modals/Modals';
import { integrationService } from '../../services/IntegrationService';
import CallAgentSettings from "../../components/settings/CallAgentSettings";

// Import integration icons
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
const SalesforceIcon = () => <img src={Sales} alt="" className="w-8 h-8" />;
const PipedriveIcon = () => <img src={pipe} alt="" className="w-8 h-8" />;
const HubspotIcon = () => <img src={hub} alt="" className="w-8 h-8" />;
const ZohoIcon = () => <img src={zoho} alt="" className="w-8 h-8" />;
const OdooIcon = () => <img src={odoo} alt="" className="w-8 h-8" />;
const OutlookIcon = () => <img src={outlook} alt="" className="w-8 h-8" />;
const GoogleIcon = () => <img src={google} alt="" className="w-8 h-8" />;
const CalendlyIcon = () => <img src={calendly} alt="" className="w-8 h-8" />;
const LinkedInIcon = () => <img src={LinkedIn} alt="" className="w-8 h-8" />;
const WhatsAppIcon = () => <img src={whatsapp} alt="" className="w-8 h-8" />;
const TelegramIcon = () => <img src={telegram} alt="" className="w-8 h-8" />;
const TwilioIcon = () => <img src={twilio} alt="" className="w-8 h-8" />;
const VonageIcon = () => <img src={vonage} alt="" className="w-8 h-8" />;

// Icons for settings navigation
const TrainIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
);

const IntegrationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
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
                            className="text-[#3C49F7] font-medium text-sm hover:text-[#2a35d4] transition-colors"
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
                        className={`font-medium text-sm transition-colors ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#3C49F7] hover:text-[#2a35d4]'}`}
                    >
                        Connect
                    </button>
                );
        }
    };

    return (
        <div className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                {icon}
                <span className={`font-medium text-sm ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{name}</span>
            </div>
            {getStatusDisplay()}
        </div>
    );
};

const CallAgentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const TemplateIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-10 h-10 text-[#3C49F7]" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

// Modal Components
const AddWebsiteModal = ({ isOpen, onClose, onAdd }) => {
    const [url, setUrl] = useState("");

    if (!isOpen) return null;

    const handleAdd = () => {
        if (url.trim()) {
            onAdd(`https://${url}`);
            setUrl("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-[450px] p-6 mx-4 shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Add a Website</h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <div className="flex items-center">
                        <span className="text-gray-500 text-sm mr-2">https://</span>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="www.example.com"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3C49F7]"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!url.trim()}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${url.trim() ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                    Add Website
                </button>
            </div>
        </div>
    );
};

const WebsiteAddedModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-8 mx-4 shadow-xl text-center">
                <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckIcon />
                </div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Website added successfully.</h2>
                <p className="text-gray-500 mb-6">We have added your website link.</p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#3C49F7] text-white py-3 rounded-full text-base font-medium hover:bg-[#2a35d4]"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Form Field Component
const FormField = ({ label, required, description, value, onChange, placeholder, isTextarea = true }) => (
    <div className="mb-6">
        <label className="block text-base font-medium text-[#1a1a1a] mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
        {isTextarea ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#3C49F7] resize-none bg-[#F8F9FC]"
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#3C49F7] bg-[#F8F9FC]"
            />
        )}
    </div>
);

// Objection Item Component
const ObjectionItem = ({ index, objection, onUpdate }) => (
    <div className="mb-6 pl-4">
        <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-1">
                {index}
            </span>
            <div className="flex-1">
                <label className="block text-base font-medium text-[#1a1a1a] mb-1">
                    What objections do you frequently hear? <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">(cost, timing, switching vendors, etc.)</p>
                <textarea
                    value={objection.question}
                    onChange={(e) => onUpdate({ ...objection, question: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#3C49F7] resize-none bg-[#F8F9FC] mb-4"
                />
                <label className="block text-base font-medium text-[#1a1a1a] mb-1">
                    How do you usually handle these objections? <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">Give examples of how you overcome doubts.</p>
                <textarea
                    value={objection.answer}
                    onChange={(e) => onUpdate({ ...objection, answer: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#3C49F7] resize-none bg-[#F8F9FC]"
                />
            </div>
        </div>
    </div>
);

// Integration Hub Content Component
const IntegrationHubContent = () => {
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
    const [showTelegramModal, setShowTelegramModal] = useState(false);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [currentIntegration, setCurrentIntegration] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleConnect = async (integrationKey, integrationName) => {
        // Handle Telegram
        if (integrationKey === 'telegram') {
            setShowTelegramModal(true);
            return;
        }

        // Handle WhatsApp
        if (integrationKey === 'whatsapp') {
            setShowWhatsAppModal(true);
            return;
        }

        setCurrentIntegration({ key: integrationKey, name: integrationName });
        setShowConnecting(true);

        try {
            let result;

            if (integrationKey === 'gmail') {
                result = await integrationService.connectGmail();
            } else if (integrationKey === 'outlook') {
                result = await integrationService.connectOutlook();
            } else if (integrationKey === 'salesforce') {
                result = await integrationService.connectSalesforce();
            } else if (integrationKey === 'hubspot') {
                result = await integrationService.connectHubSpot();
            } else if (integrationKey === 'pipedrive') {
                result = await integrationService.connectPipedrive();
            } else if (integrationKey === 'zoho') {
                result = await integrationService.connectZoho();
            } else if (integrationKey === 'linkedin') {
                result = await integrationService.connectLinkedIn();
            } else if (integrationKey === 'facebook') {
                result = await integrationService.connectFacebook();
            } else {
                result = await integrationService.connectOAuth(integrationKey, integrationName);
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
            return result;
        } else if (action === 'qrcode') {
            const result = await integrationService.getWhatsAppQRCode();
            return result;
        } else if (action === 'status') {
            const result = await integrationService.getWhatsAppSessionStatus(data.session_id);
            if (result.status === 'connected' || result.status === 'ready') {
                setIntegrations(prev => ({ ...prev, whatsapp: 'connected' }));
            }
            return result;
        }
    };

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
        } else if (integrationKey === 'telegram') {
            setShowTelegramModal(true);
        } else if (integrationKey === 'whatsapp') {
            setShowWhatsAppModal(true);
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
        <div className="flex-1 overflow-y-auto">
            <div className="p-8">
                <h1 className="text-[32px] font-normal text-[#1a1a1a] mb-2 font-['DM_Sans']">Integration Hub</h1>
                <p className="text-gray-600 mb-8">Connect your accounts to enhance your AI workforce capabilities.</p>

                {/* Connect your CRM */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect your CRM</h2>
                    <div className="space-y-2">
                        <IntegrationItem icon={<SalesforceIcon />} name="Connect your Salesforce account" status={integrations.salesforce} onConnect={() => handleConnect('salesforce', 'Salesforce')} onRetry={() => handleRetry('salesforce', 'Salesforce')} disabled={connectedCRM && connectedCRM[0] !== 'salesforce'} />
                        <IntegrationItem icon={<PipedriveIcon />} name="Connect your Pipedrive account" status={integrations.pipedrive} onConnect={() => handleConnect('pipedrive', 'Pipedrive')} onRetry={() => handleRetry('pipedrive', 'Pipedrive')} disabled={connectedCRM && connectedCRM[0] !== 'pipedrive'} />
                        <IntegrationItem icon={<HubspotIcon />} name="Connect your Hubspot account" status={integrations.hubspot} onConnect={() => handleConnect('hubspot', 'Hubspot')} onRetry={() => handleRetry('hubspot', 'Hubspot')} disabled={connectedCRM && connectedCRM[0] !== 'hubspot'} />
                        <IntegrationItem icon={<ZohoIcon />} name="Connect your Zoho account" status={integrations.zoho} onConnect={() => handleConnect('zoho', 'Zoho')} onRetry={() => handleRetry('zoho', 'Zoho')} disabled={connectedCRM && connectedCRM[0] !== 'zoho'} />
                        <IntegrationItem icon={<OdooIcon />} name="Connect your Odoo account" status={integrations.odoo} onConnect={() => handleConnect('odoo', 'Odoo')} onRetry={() => handleRetry('odoo', 'Odoo')} disabled={connectedCRM && connectedCRM[0] !== 'odoo'} />
                    </div>
                </section>

                {/* Connect your Email & Calendar */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect your Email & Calendar</h2>
                    <div className="space-y-2">
                        <IntegrationItem icon={<OutlookIcon />} name="Connect your Outlook account" status={integrations.outlook} onConnect={() => handleConnect('outlook', 'Outlook')} onRetry={() => handleRetry('outlook', 'Outlook')} />
                        <IntegrationItem icon={<GoogleIcon />} name="Connect your Google account" status={integrations.gmail} onConnect={() => handleConnect('gmail', 'Gmail')} onRetry={() => handleRetry('gmail', 'Gmail')} />
                        <IntegrationItem icon={<CalendlyIcon />} name="Connect your Calendly" status={integrations.calendly} onConnect={() => handleConnect('calendly', 'Calendly')} onRetry={() => handleRetry('calendly', 'Calendly')} />
                    </div>
                </section>

                {/* Connect your Social Media Account */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect your Social Media Account</h2>
                    <div className="space-y-2">
                        <IntegrationItem icon={<LinkedInIcon />} name="Connect your LinkedIn account" status={integrations.linkedin} onConnect={() => handleConnect('linkedin', 'LinkedIn')} onRetry={() => handleRetry('linkedin', 'LinkedIn')} />
                        <IntegrationItem icon={<WhatsAppIcon />} name="Connect your WhatsApp account" status={integrations.whatsapp} onConnect={() => handleConnect('whatsapp', 'WhatsApp')} onRetry={() => handleRetry('whatsapp', 'WhatsApp')} />
                        <IntegrationItem icon={<TelegramIcon />} name="Connect your Telegram account" status={integrations.telegram} onConnect={() => handleConnect('telegram', 'Telegram')} onRetry={() => handleRetry('telegram', 'Telegram')} />
                    </div>
                </section>

                {/* Add your Phone number */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add your Phone number</h2>
                    <div className="space-y-2">
                        <IntegrationItem icon={<TwilioIcon />} name="Add your Twilio Number" status={integrations.twilio} onConnect={() => setShowTwilioModal(true)} onRetry={() => handleRetry('twilio', 'Twilio')} />
                        <IntegrationItem icon={<VonageIcon />} name="Add your Vonage Number" status={integrations.vonage} onConnect={() => setShowVonageModal(true)} onRetry={() => handleRetry('vonage', 'Vonage')} />
                    </div>
                </section>
            </div>

            {/* Modals */}
            <ConnectingModal isOpen={showConnecting} onClose={() => { setShowConnecting(false); integrationService.closePopup(); }} title="Connecting and importing..." message="We are connecting your account. Please complete the authorization in the popup window." />
            <IntegrationSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} title="Successfully Connected!" message={successMessage} buttonText="Done" />
            <IntegrationErrorModal isOpen={showError} onClose={handleErrorClose} title="Failed to connect" message={errorMessage} buttonText="Retry Connecting" onRetry={handleErrorRetry} />
            <TwilioNumberModal isOpen={showTwilioModal} onClose={() => setShowTwilioModal(false)} onImport={handleTwilioImport} />
            <VonageNumberModal isOpen={showVonageModal} onClose={() => setShowVonageModal(false)} onImport={handleVonageImport} />
            <TelegramLoginModal isOpen={showTelegramModal} onClose={() => setShowTelegramModal(false)} onConnect={handleTelegramConnect} />
            <WhatsAppConnectModal isOpen={showWhatsAppModal} onClose={() => setShowWhatsAppModal(false)} onConnect={handleWhatsAppConnect} />
        </div>
    );
};

// Train Your AI Content Component
const TrainYourAI = () => {
    const [activeTab, setActiveTab] = useState("pitch");
    const [connectedWebsite, setConnectedWebsite] = useState(null);
    const [showAddWebsite, setShowAddWebsite] = useState(false);
    const [showWebsiteAdded, setShowWebsiteAdded] = useState(false);

    // Pitch form state
    const [pitchData, setPitchData] = useState({
        pond: "We operate in the specialty coffee and café industry...",
        fish: "Our ideal customers are urban millennials and Gen Z consumers...",
        catch: "We primarily target decision-makers and influencers...",
        whoAreYou: "Jhon Doe, Founder, USA",
        specialise: "We operate in the specialty coffee and café sector...",
        workWith: "Our typical clients include individual consumers...",
        backstory: "",
        different: "",
    });

    const [objections, setObjections] = useState([
        { question: "Common objections include pricing sensitivity...", answer: "We handle objections by educating customers..." }
    ]);

    const handleAddWebsite = (url) => {
        setConnectedWebsite(url);
        setShowAddWebsite(false);
        setShowWebsiteAdded(true);
    };

    const handleAddObjection = () => {
        setObjections([...objections, { question: "", answer: "" }]);
    };

    const handleUpdateObjection = (index, updated) => {
        const newObjections = [...objections];
        newObjections[index] = updated;
        setObjections(newObjections);
    };

    const tabs = [
        { key: "pitch", label: "Pitch" },
        { key: "knowledge", label: "Knowledge" },
        { key: "prompts", label: "Prompts" },
    ];

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8">
                <h1 className="text-[32px] font-normal text-[#1a1a1a] mb-2 font-['DM_Sans']">Train Your AI</h1>
                <p className="text-gray-600 mb-6">Katei will craft your value proposition and ideal customer profile (ICP) based on your unique selling point.</p>

                {/* Connected Website Section */}
                <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-100">
                    {connectedWebsite ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Connected to</span>
                                <a href={connectedWebsite} className="text-[#3C49F7] hover:underline">{connectedWebsite}</a>
                            </div>
                            <button onClick={() => setShowAddWebsite(true)} className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#3C49F7]">
                                <PlusIcon />
                                <span>Switch to Another Website</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-600">Connected your Website</span>
                            <button onClick={() => setShowAddWebsite(true)} className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#3C49F7]">
                                <PlusIcon />
                                <span>Add Website</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "pitch" && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Pond Fish Catch</h2>
                        <FormField label="What's your Pond?" required description="Describe the market or industry you operate in." value={pitchData.pond} onChange={(v) => setPitchData({ ...pitchData, pond: v })} />
                        <FormField label="What's your Fish?" required description="Who are your ideal companies or customer types?" value={pitchData.fish} onChange={(v) => setPitchData({ ...pitchData, fish: v })} />
                        <FormField label="What's your Catch?" required description="What seniority or roles are you targeting?" value={pitchData.catch} onChange={(v) => setPitchData({ ...pitchData, catch: v })} />
                        <hr className="my-8 border-gray-200" />
                        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Elevator Pitch / WWWBHR</h2>
                        <FormField label="Who are you?" required description="Include your name, company, and location." value={pitchData.whoAreYou} onChange={(v) => setPitchData({ ...pitchData, whoAreYou: v })} isTextarea={false} />
                        <FormField label="What do you specialise in?" required description="What sector are you in, and what problem do you solve?" value={pitchData.specialise} onChange={(v) => setPitchData({ ...pitchData, specialise: v })} />
                        <FormField label="Who do you work with?" required description="Describe your typical clients" value={pitchData.workWith} onChange={(v) => setPitchData({ ...pitchData, workWith: v })} />
                        <FormField label="What's your backstory?" required description="Share how or why you started your company." value={pitchData.backstory} onChange={(v) => setPitchData({ ...pitchData, backstory: v })} />
                        <FormField label="What makes you different?" required description="Explain your unique approach, process, or features." value={pitchData.different} onChange={(v) => setPitchData({ ...pitchData, different: v })} />
                        <hr className="my-8 border-gray-200" />
                        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Objection Handling</h2>
                        {objections.map((objection, index) => (
                            <ObjectionItem key={index} index={index + 1} objection={objection} onUpdate={(updated) => handleUpdateObjection(index, updated)} />
                        ))}
                        <button onClick={handleAddObjection} className="text-[#3C49F7] text-sm font-medium hover:underline">Add Another Objection</button>
                    </div>
                )}

                {activeTab === "knowledge" && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <KnowledgeTab />
                    </div>
                )}

                {activeTab === "prompts" && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <PromptsTab />
                    </div>
                )}
            </div>

            <AddWebsiteModal isOpen={showAddWebsite} onClose={() => setShowAddWebsite(false)} onAdd={handleAddWebsite} />
            <WebsiteAddedModal isOpen={showWebsiteAdded} onClose={() => setShowWebsiteAdded(false)} />
        </div>
    );
};

// Main Settings Page Component
const SettingsPage = ({ activeSettingsTab = "train" }) => {
    const [activeSection, setActiveSection] = useState(activeSettingsTab);
    const [showContentEditor, setShowContentEditor] = useState(false);
    const [editorData, setEditorData] = useState(null);

    // Sync with prop when it changes
    useEffect(() => {
        setActiveSection(activeSettingsTab);
        // Reset editor state when tab changes
        if (activeSettingsTab !== 'template') {
            setShowContentEditor(false);
            setEditorData(null);
        }
    }, [activeSettingsTab]);

    // Handle edit template from TemplateLibrary
    const handleEditTemplate = (templateType, templateName, isNew, templateData) => {
        setEditorData({ templateType, templateName, isNew, templateData });
        setShowContentEditor(true);
    };

    // Handle back from editor
    const handleBackFromEditor = () => {
        setShowContentEditor(false);
        setEditorData(null);
    };

    // If showing content editor for template
    if (activeSection === "template" && showContentEditor && editorData) {
        return (
            <TemplateContentEditor
                onBack={handleBackFromEditor}
                templateType={editorData.templateType}
                templateName={editorData.templateName}
                isNew={editorData.isNew}
                templateData={editorData.templateData}
            />
        );
    }

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex-1 h-full overflow-auto">
                {activeSection === "train" && <TrainYourAI />}
                {activeSection === "integration" && <IntegrationHubContent />}
                {activeSection === "callAgent" && <CallAgentSettings />}
                {activeSection === "template" && (
                    <TemplateLibrary onEditTemplate={handleEditTemplate} />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;