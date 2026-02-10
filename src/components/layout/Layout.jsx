// components/Layout.jsx
import { useState, useEffect, useRef } from "react";
import { navItems, userData, appInfo } from "../../data/mockData";
import { salesAgentNavItems } from "../../data/salesAgentData";
import backgroundImage from "../../assets/Background.png";
import Header from "./Header";

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import AnalyticsIcon from "../../assets/icons/analytics.svg?react";
import SalesIcon from "../../assets/icons/salesAgent.svg?react";
import MarketingIcon from "../../assets/icons/marketing.svg?react";
import SupportIcon from "../../assets/icons/support.svg?react";
import TrainIcon from "../../assets/icons/train.svg?react";
import IntegrationIcon from "../../assets/icons/integration.svg?react";
import SettingsIcon from "../../assets/icons/settings.svg?react";
import BellIcon from "../../assets/icons/bell.svg?react";
import OrganicIcon from "../../assets/icons/organic.svg?react";
import CampaignIcon from "../../assets/icons/campaign.svg?react";
import CalendarIcon from "../../assets/icons/calender.svg?react";
import InboxIcon from "../../assets/icons/inbox1.svg?react";
import CallLogsIcon from "../../assets/icons/calll-logs.svg?react";

import CreditsPage from "../../pages/CreditsPage";
import OrganicLeadBuilder from "../../pages/salesAgent/OrganicLeadBuilder";
import CampaignManager from "../../pages/salesAgent/CampaignManager";
import BlogContentEngine from "../../pages/marketingAgent/BlogContentEngine";
import SettingsPage from "../../pages/settings/SettingsPage";
import InboxPage from "../../pages/inbox/InboxPage";
import CallLogsPage from "../../pages/call-logs/CallLogsPage";
import CalendarPage from "../../pages/calendar/CalendarPage";
import BrochureCreationEngine from "../../pages/marketingAgent/BrochureCreationEngine";
import SupportAgentPage from "../../pages/supportAgent/SupportAgentPage";

// Updated nav icons mapping
const navIcons = {
    analytics: AnalyticsIcon,
    sales: SalesIcon,
    marketing: MarketingIcon,
    support: SupportIcon,
    calendar: CalendarIcon,
    inbox: InboxIcon,
    callLogs: CallLogsIcon,
    train: TrainIcon,
    integration: IntegrationIcon,
    settings: SettingsIcon,
    bell: BellIcon,
};

const salesIconMap = {
    organic: <OrganicIcon />,
    campaign: <CampaignIcon />,
};

const settingsIconMap = {
    train: <TrainIcon />,
    integration: <IntegrationIcon />,
};

const supportIconMap = {
    personal: null, // Will use SVG icon
    meeting: null,  // Will use SVG icon
};

const marketingIconMap = {};

const Icon = ({ name, className = "", isActive = false }) => {
    const IconComponent = navIcons[name];
    const activeFilter = isActive ? "brightness-0 invert" : "";

    return IconComponent ? (
        <span className={`${className} ${activeFilter}`}>
            <IconComponent />
        </span>
    ) : null;
};

// Main Navigation Item - With circular background
const NavItem = ({ item, isActive, onClick, isExpanded }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
    >
        <span
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-200"
                }`}
        >
            <Icon name={item.key} isActive={isActive} />
        </span>
        {isExpanded && (
            <span
                className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${isActive
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-200"
                    }`}
            >
                {item.name}
            </span>
        )}
    </button>
);

// Sales Agent Navigation Item
const SalesNavItem = ({ item, isActive, onClick, isExpanded }) => {
    const hasShortName = item.shortName;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
        >
            {hasShortName ? (
                <span
                    className={`flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {item.shortName}
                </span>
            ) : (
                <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {salesIconMap[item.icon]}
                </span>
            )}
            {isExpanded && (
                <span
                    className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {item.name}
                </span>
            )}
        </button>
    );
};

// Marketing Agent Navigation Item
const MarketingNavItem = ({ item, isActive, onClick, isExpanded }) => {
    const hasShortName = item.shortName;
    const hasIcon = item.icon && marketingIconMap[item.icon];

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
        >
            {hasShortName ? (
                <span
                    className={`flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                        }`}
                >
                    {item.shortName}
                </span>
            ) : hasIcon ? (
                <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                        }`}
                >
                    {marketingIconMap[item.icon]}
                </span>
            ) : (
                <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    </svg>
                </span>
            )}
            {isExpanded && (
                <span
                    className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                        }`}
                >
                    {item.name}
                </span>
            )}
        </button>
    );
};

// Settings Navigation Item
const SettingsNavItem = ({ item, isActive, onClick, isExpanded }) => {
    const hasShortName = item.shortName;
    const hasIcon = item.icon && settingsIconMap[item.icon];

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
        >
            {hasShortName ? (
                <span
                    className={`flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {item.shortName}
                </span>
            ) : hasIcon ? (
                <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {settingsIconMap[item.icon]}
                </span>
            ) : (
                <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </span>
            )}
            {isExpanded && (
                <span
                    className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100 border-none"
                        }`}
                >
                    {item.name}
                </span>
            )}
        </button>
    );
};

// Support Agent Navigation Item
const SupportNavItem = ({ item, isActive, onClick, isExpanded }) => {
    const hasShortName = item.shortName;

    // Icon SVGs for support items
    const getIcon = (iconKey) => {
        if (iconKey === "personal") {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        }
        if (iconKey === "meeting") {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        }
        return null;
    };

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
        >
            <span
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isActive
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                    }`}
            >
                {getIcon(item.icon)}
            </span>
            {isExpanded && (
                <span
                    className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"
                        }`}
                >
                    {item.name}
                </span>
            )}
        </button>
    );
};

// Main navigation items in correct order matching screenshot
const mainNavItems = [
    { key: "analytics", name: "Analytics" },
    { key: "sales", name: "Sales Agent" },
    { key: "marketing", name: "Marketing Agent" },
    { key: "support", name: "Support Agent" },
    { key: "calendar", name: "Calander" },
    { key: "inbox", name: "Inbox" },
    { key: "callLogs", name: "Call Logs" },
    { key: "settings", name: "Settings" },
];

export default function Layout({ children, activePage, setActivePage, credits }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [previousPage, setPreviousPage] = useState(null);

    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayCredits = credits ?? 0;

    // Check if we're in a sales agent view
    const isInSalesAgent = activePage === "b2c" || activePage === "b2b" || activePage === "organic" || activePage === "campaign";

    // Check if we're in settings view
    const isInSettings = activePage === "settings" || activePage === "settings-train" || activePage === "settings-integration" || activePage === "settings-callAgent" || activePage === "settings-template";

    // Check if we're in marketing agent view
    const isInMarketingAgent = activePage === "seo" || activePage === "template";

    // Add this check for Support Agent view
    const isInSupportAgent = activePage === "support" || activePage === "support-personal" || activePage === "support-meeting";


    // Check if we're on specific pages
    const isOnCreditsPage = activePage === "credits";
    const isOnOrganicPage = activePage === "organic";
    const isOnSEOPage = activePage === "seo";
    const isOnCampaignPage = activePage === "campaign";
    const isOnCalendarPage = activePage === "calendar";
    const isOnInboxPage = activePage === "inbox";
    const isOnCallLogsPage = activePage === "callLogs";
    const isOnSettingsPage = activePage === "settings" || activePage === "settings-train" || activePage === "settings-integration" || activePage === "settings-callAgent" || activePage === "settings-template";
    // Update isOnSupportPage check
    const isOnSupportPage = activePage === "support" || activePage === "support-personal" || activePage === "support-meeting";


    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleBuyCreditsClick = () => {
        setPreviousPage(activePage);
        setActivePage("credits");
    };

    const handleBackFromCredits = () => {
        setActivePage(previousPage || "b2c");
    };

    const getSidebarTitle = () => {
        if (isOnCreditsPage) return "Credits";
        if (isInSettings) return "Settings";
        if (isInMarketingAgent) return "Marketing Agent";
        if (isInSupportAgent) return "Support Agent";
        if (isInSalesAgent) return "Sales Agent";
        return "Sales Agent";
    };

    const handleBackClick = () => {
        if (isOnCreditsPage) {
            handleBackFromCredits();
        } else {
            setActivePage("analytics");
        }
    };

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await logout();
        navigate('/login');
    };

    const handleNavItemClick = (key) => {
        if (key === "sales") {
            setActivePage("b2c");
        } else if (key === "marketing") {
            setActivePage("seo");
        } else if (key === "settings") {
            setActivePage("settings-train");
        } else if (key === "support") {
            setActivePage("support-personal");
        } else {
            setActivePage(key);
        }
    };

    return (
        <div
            className="h-screen w-screen flex flex-col overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Fixed Full-Width Header */}
            <Header
                variant="full"
                credits={displayCredits}
                onBuyCredits={handleBuyCreditsClick}
                onLogoClick={() => setActivePage(previousPage || "b2c")}
                showGetCredits={isOnCreditsPage || displayCredits <= 0}
                userData={userData}
            />

            {/* Content Area Below Navbar */}
            <div className="flex flex-1 overflow-hidden">
                {/* Fixed Sidebar */}
                <div
                    className="bg-gradient-to-b from-[#DFE3F5] to-[#DFE3F5] flex flex-col py-4 px-3 border-r border-gray-100 flex-shrink-0 transition-all duration-300 ease-in-out"
                    onMouseEnter={() => setSidebarExpanded(true)}
                    onMouseLeave={() => setSidebarExpanded(false)}
                    style={{ width: sidebarExpanded ? "280px" : "72px" }}
                >
                    {/* Back Button - Show when in sales agent, marketing agent, or credits page */}
                    {(isInSalesAgent || isInMarketingAgent || isOnCreditsPage || isInSettings || isInSupportAgent) && (

                        <button
                            onClick={handleBackClick}
                            className="flex items-center px-2 py-1.5 transition-all duration-200 ease-in-out w-full group"
                        >
                            <span className="flex-shrink-0 w-[24px] h-[24px] rounded-full flex items-center justify-center text-gray-400 group-hover:transition-all duration-200">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </span>
                            {sidebarExpanded && (
                                <span className="text-[18px] font-bold text-gray-900 whitespace-nowrap px-2 py-1.5 rounded-full group-hover:border-gray-300 transition-all duration-200">
                                    {getSidebarTitle()}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Navigation */}
                    <nav className="flex flex-col flex-1">
                        {isOnCreditsPage ? (
                            // Credits Page Navigation
                            <>
                                <div className="my-1.5 mx-2">
                                    <div className="h-px bg-gray-300"></div>
                                </div>
                                <button
                                    onClick={() => setActivePage("b2c")}
                                    className="flex items-center gap-3 px-2 py-1 text-left transition-all duration-200 ease-in-out w-full group"
                                >
                                    <span className="flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100">
                                        B2C
                                    </span>
                                    {sidebarExpanded && (
                                        <span className="text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100">
                                            B2C Lead Builder Agent
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActivePage("b2b")}
                                    className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
                                >
                                    <span className="flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100">
                                        B2B
                                    </span>
                                    {sidebarExpanded && (
                                        <span className="text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100">
                                            B2B Lead Builder Agent
                                        </span>
                                    )}
                                </button>
                                <SalesNavItem
                                    item={{ key: "organic", name: "Organic Lead Builder Agent", icon: "organic" }}
                                    isActive={false}
                                    onClick={() => setActivePage("organic")}
                                    isExpanded={sidebarExpanded}
                                />
                            </>
                        ) : isInMarketingAgent ? (
                            // Marketing Agent Navigation
                            <>
                                <div className="my-1.5 mx-2">
                                    <div className="h-px bg-gray-300"></div>
                                </div>
                                <MarketingNavItem
                                    item={{ key: "seo", name: "Blog & Content Engine", shortName: "SEO" }}
                                    isActive={activePage === "seo"}
                                    onClick={() => setActivePage("seo")}
                                    isExpanded={sidebarExpanded}
                                />
                                <MarketingNavItem
                                    item={{ key: "template", name: "Template/ Brochure Agent", icon: "template" }}
                                    isActive={activePage === "template"}
                                    onClick={() => setActivePage("template")}
                                    isExpanded={sidebarExpanded}
                                />
                            </>

                        ) : isInSettings ? (
                            // Settings Navigation
                            <>
                                <div className="my-1.5 mx-2">
                                    <div className="h-px bg-gray-300"></div>
                                </div>
                                <SettingsNavItem
                                    item={{ key: "settings-train", name: "Train Your AI", icon: "train" }}
                                    isActive={activePage === "settings-train" || activePage === "settings"}
                                    onClick={() => setActivePage("settings-train")}
                                    isExpanded={sidebarExpanded}
                                />
                                <SettingsNavItem
                                    item={{ key: "settings-integration", name: "Integration Hub", icon: "integration" }}
                                    isActive={activePage === "settings-integration"}
                                    onClick={() => setActivePage("settings-integration")}
                                    isExpanded={sidebarExpanded}
                                />
                                <SettingsNavItem
                                    item={{ key: "settings-callAgent", name: "Call Agent Settings", shortName: "CA" }}
                                    isActive={activePage === "settings-callAgent"}
                                    onClick={() => setActivePage("settings-callAgent")}
                                    isExpanded={sidebarExpanded}
                                />
                                <SettingsNavItem
                                    item={{ key: "settings-template", name: "Template Library", shortName: "TL" }}
                                    isActive={activePage === "settings-template"}
                                    onClick={() => setActivePage("settings-template")}
                                    isExpanded={sidebarExpanded}
                                />
                            </>

                        ) : isInSupportAgent ? (
                            // Support Agent Navigation
                            <>
                                <div className="my-1.5 mx-2">
                                    <div className="h-px bg-gray-300"></div>
                                </div>
                                <SupportNavItem
                                    item={{ key: "support-personal", name: "Personal Assistant Agent", icon: "personal" }}
                                    isActive={activePage === "support-personal" || activePage === "support"}
                                    onClick={() => setActivePage("support-personal")}
                                    isExpanded={sidebarExpanded}
                                />
                                <SupportNavItem
                                    item={{ key: "support-meeting", name: "Meeting Notetaker Agent", icon: "meeting" }}
                                    isActive={activePage === "support-meeting"}
                                    onClick={() => setActivePage("support-meeting")}
                                    isExpanded={sidebarExpanded}
                                />
                            </>

                        ) : isInSalesAgent ? (
                            // Sales Agent Navigation (B2C/B2B/Organic/Campaign)
                            <>
                                <div className="my-1.5 mx-2">
                                    <div className="h-px bg-gray-300"></div>
                                </div>
                                <button
                                    onClick={() => setActivePage("b2c")}
                                    className="flex items-center gap-3 px-2 py-1 text-left transition-all duration-200 ease-in-out w-full group"
                                >
                                    <span className={`flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${activePage === "b2c" ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"}`}>
                                        B2C
                                    </span>
                                    {sidebarExpanded && (
                                        <span className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${activePage === "b2c" ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"}`}>
                                            B2C Lead Builder Agent
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActivePage("b2b")}
                                    className="flex items-center gap-3 px-2 py-1.5 text-left transition-all duration-200 ease-in-out w-full group"
                                >
                                    <span className={`flex-shrink-0 text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${activePage === "b2b" ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"}`}>
                                        B2B
                                    </span>
                                    {sidebarExpanded && (
                                        <span className={`text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out ${activePage === "b2b" ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-100"}`}>
                                            B2B Lead Builder Agent
                                        </span>
                                    )}
                                </button>
                                <SalesNavItem
                                    item={{ key: "organic", name: "Organic Lead Builder Agent", icon: "organic" }}
                                    isActive={activePage === "organic"}
                                    onClick={() => setActivePage("organic")}
                                    isExpanded={sidebarExpanded}
                                />
                                <SalesNavItem
                                    item={{ key: "campaign", name: "Campaign Manager", icon: "campaign" }}
                                    isActive={activePage === "campaign"}
                                    onClick={() => setActivePage("campaign")}
                                    isExpanded={sidebarExpanded}
                                />
                            </>
                        ) : (
                            // Main Navigation - Updated order matching screenshot
                            <>
                                {mainNavItems.map((item) => (
                                    <NavItem
                                        key={item.key}
                                        item={item}
                                        isActive={activePage === item.key}
                                        onClick={() => handleNavItemClick(item.key)}
                                        isExpanded={sidebarExpanded}
                                    />
                                ))}
                            </>
                        )}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 transition-all duration-300 ease-in-out py-0">
                    <div className="rounded-3xl h-full shadow-sm">
                        {isOnCreditsPage ? (
                            <CreditsPage userName={userData.name || "Max"} />
                        ) : isOnOrganicPage ? (
                            <OrganicLeadBuilder />
                        ) : isOnCampaignPage ? (
                            <CampaignManager />
                        ) : isOnSEOPage ? (
                            <BlogContentEngine />
                        ) : isOnCalendarPage ? (
                            <CalendarPage />
                        ) : isOnInboxPage ? (
                            <InboxPage />
                        ) : isOnCallLogsPage ? (
                            <CallLogsPage />
                        ) : isOnSettingsPage ? (
                            <SettingsPage activeSettingsTab={
                                activePage === "settings-integration" ? "integration" :
                                    activePage === "settings-callAgent" ? "callAgent" :
                                        activePage === "settings-template" ? "template" :
                                            "train"
                            } />
                        ) : isOnSupportPage ? (
                            <SupportAgentPage activeSupportTab={
                                activePage === "support-meeting" ? "meeting" : "personal"
                            } />
                        ) : activePage === "template" ? (
                            <BrochureCreationEngine />
                        ) : (
                            children
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}