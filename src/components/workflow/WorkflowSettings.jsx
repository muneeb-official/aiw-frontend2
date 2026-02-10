import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import api from "../../services/api";

// Import the illustration
import settingsIllustration from "../../assets/WF4.png"; // Update path as needed

// Confirmation Modal
const LaunchConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-[#E8EAFF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-2 border-[#3C49F7] rounded-full flex items-center justify-center">
                        <span className="text-[#3C49F7] text-xl font-bold">i</span>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Are you sure?</h3>
                <p className="text-gray-600 mb-6">
                    You want to launch the campaign. Once you launch, the campaign, it will be locked and you cannot edit anything until the campaigns ends.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
                    >
                        Close
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Confirm & Launch
                    </button>
                </div>
            </div>
        </div>
    );
};

// Success Modal
const CampaignLiveModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-[#E8EAFF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">The Campaign is now live!</h3>
                <p className="text-gray-600 mb-4">
                    Just wait now to see the qualified leads. You will be automatically be redirected to the campaign Manager.
                </p>
                <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 bg-[#1a1a1a] rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

const WorkflowSettings = ({ onBack, workflowName, steps = [], stepConfigs = {}, projectId, onSave, onLaunch }) => {
    // General Settings
    const [showGeneralSettings, setShowGeneralSettings] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");

    // Schedule Settings
    const [showScheduleSettings, setShowScheduleSettings] = useState(false);
    const [prospectTimezone, setProspectTimezone] = useState(false);
    const [defaultTimezone, setDefaultTimezone] = useState("");
    const [activeDays, setActiveDays] = useState({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
        Sunday: false
    });
    const [startsFrom, setStartsFrom] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [endCampaignEnabled, setEndCampaignEnabled] = useState(false);
    const [endCampaignDate, setEndCampaignDate] = useState("");

    // Prospect Limitations
    const [showProspectLimitations, setShowProspectLimitations] = useState(false);
    const [skipProspectsInCampaigns, setSkipProspectsInCampaigns] = useState(false);
    const [limitProspectsPerCompany, setLimitProspectsPerCompany] = useState(false);

    // Calculated Usage
    const [showCalculatedUsage, setShowCalculatedUsage] = useState(true);

    // Modals
    const [showLaunchConfirmation, setShowLaunchConfirmation] = useState(false);
    const [showCampaignLive, setShowCampaignLive] = useState(false);

    // Tooltips
    const [showTooltip, setShowTooltip] = useState({
        prospectTimezone: false,
        endCampaign: false,
        skipProspects: false,
        limitProspects: false
    });

    const timezones = [
        "Africa/Abidjan",
        "Africa/Accra",
        "Africa/Algiers",
        "Africa/Bissau",
        "Africa/Cairo",
        "Africa/Casablanca",
        "Africa/Ceuta"
    ];

    const timeSlots = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ];

    const handleDayToggle = (day) => {
        setActiveDays({ ...activeDays, [day]: !activeDays[day] });
    };

    const handleLaunchClick = () => {
        setShowLaunchConfirmation(true);
    };

    const handleConfirmLaunch = async () => {
        setShowLaunchConfirmation(false);

        try {
            // Transform steps to API format
            const transformedSteps = steps.map((step, index) => {
                const config = stepConfigs[step.id] || {};

                // Determine channel based on step type (use correct channel names)
                let channel = step.type;
                let action = "send";

                if (step.type === "email") {
                    channel = "email_gmail";
                    action = "send_email";
                } else if (step.type === "telegram") {
                    channel = "telegram";
                    action = "send_message";
                } else if (step.type === "whatsapp") {
                    channel = "whatsapp";
                    action = "send_message";
                } else if (step.type === "linkedin") {
                    channel = "linkedin";
                    action = step.subAction || "send_message";
                } else if (step.type === "call") {
                    channel = "call";
                    action = "make_call";
                }

                // Build step config based on type
                let stepConfig = {};
                if (step.type === "email") {
                    stepConfig = {
                        subject: config.subject || "",
                        body: config.body || "",
                    };
                } else if (step.type === "telegram") {
                    stepConfig = {
                        message: config.message || "",
                    };
                } else if (step.type === "whatsapp") {
                    stepConfig = {
                        message: config.message || "",
                    };
                } else if (step.type === "linkedin") {
                    stepConfig = {
                        message: config.message || "",
                    };
                } else if (step.type === "call") {
                    stepConfig = {
                        opening_line: config.openingLine || "",
                        website_url: config.websiteUrl || "",
                        call_prompt: config.callPrompt || "",
                    };
                }

                // Create descriptive step ID
                const stepId = `step_${index + 1}_${step.type}`;

                return {
                    step_id: stepId,
                    name: step.label || `Step ${index + 1}`,
                    channel: channel,
                    action: action,
                    delay: {
                        days: Math.floor(step.delay / (24 * 60)),
                        hours: Math.floor((step.delay % (24 * 60)) / 60),
                        minutes: step.delay % 60,
                    },
                    config: stepConfig,
                    conditions: {
                        run_if: "always",
                    },
                    reply_branch: null, // Set to null instead of object with enabled: false
                };
            });

            // Get active days as array of numbers (1=Monday, 7=Sunday)
            const daysOfWeek = [];
            const dayMapping = {
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6,
                'Sunday': 7,
            };
            Object.entries(activeDays).forEach(([day, isActive]) => {
                if (isActive) {
                    daysOfWeek.push(dayMapping[day]);
                }
            });

            // Step 1: Create workflow
            console.log("📤 Creating workflow...");
            const workflowPayload = {
                name: workflowName,
                description: `Workflow for ${workflowName}`,
                definition: {
                    name: workflowName,
                    settings: {
                        timezone: defaultTimezone || "UTC",
                        stop_on_response: false,
                    },
                    steps: transformedSteps,
                },
                is_template: false,
            };

            const workflowResponse = await api.post("/scheduler/v1/workflows", workflowPayload);
            console.log("✅ Workflow created:", workflowResponse.data);

            const workflowId = workflowResponse.data.id;

            // Step 2: Create campaign
            console.log("📤 Creating campaign...");
            const campaignPayload = {
                name: workflowName,
                description: `Campaign for ${workflowName}`,
                workflow_id: workflowId,
                b2b_b2c_project_id: projectId,
                start_date: new Date().toISOString(),
                timezone: defaultTimezone || "UTC",
                execution_windows: {
                    start_time: startsFrom || "09:00",
                    end_time: endsAt || "17:00",
                    days_of_week: daysOfWeek.length > 0 ? daysOfWeek : [1, 2, 3, 4, 5],
                },
            };

            const campaignResponse = await api.post("/scheduler/v1/campaigns", campaignPayload);
            console.log("✅ Campaign created:", campaignResponse.data);

            const campaignId = campaignResponse.data.id;

            // Step 3: Start the campaign
            console.log("📤 Starting campaign...");
            const startCampaignPayload = {
                import_leads: true
            };

            const startResponse = await api.post(
                `/scheduler/v1/campaigns/${campaignId}/start`,
                startCampaignPayload
            );
            console.log("✅ Campaign started:", startResponse.data);

            // Show success modal
            setShowCampaignLive(true);
            setTimeout(() => {
                setShowCampaignLive(false);
                onLaunch?.();
            }, 3000);

        } catch (error) {
            console.error("❌ Error creating workflow/campaign:", error);
            console.error("Error details:", error.response?.data || error.message);
            alert("Failed to create campaign. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FC]">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button className="text-gray-600 hover:text-gray-900">Exit</button>
                    <input
                        type="text"
                        value={workflowName}
                        readOnly
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white"
                    />
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3C49F7] rounded-full"></div>
                        <span className="text-sm text-[#3C49F7] font-medium">Pick Source</span>
                    </div>
                    <div className="w-12 h-px bg-[#3C49F7]"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3C49F7] rounded-full"></div>
                        <span className="text-sm text-[#3C49F7] font-medium">Pick Template</span>
                    </div>
                    <div className="w-12 h-px bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-500">Create Workflow</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onSave}
                        className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleLaunchClick}
                        className="px-6 py-2 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
                    >
                        Launch
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side - Settings */}
                <div className="w-1/2 p-6 overflow-y-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 mb-6"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Settings</h2>

                    <div className="space-y-4">
                        {/* General Settings */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => setShowGeneralSettings(!showGeneralSettings)}
                                className="w-full flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-semibold text-[#1a1a1a]">General Settings</h3>
                                        <p className="text-sm text-gray-600">Configure email account to run the campaign</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showGeneralSettings ? 'rotate-90' : ''}`} />
                            </button>

                            {showGeneralSettings && (
                                <div className="px-4 pb-4">
                                    <div className="relative">
                                        <select
                                            value={selectedEmail}
                                            onChange={(e) => setSelectedEmail(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                                        >
                                            <option value="">- Select a connected Email -</option>
                                            <option value="email1@example.com">email1@example.com</option>
                                            <option value="email2@example.com">email2@example.com</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Schedule Settings */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => setShowScheduleSettings(!showScheduleSettings)}
                                className="w-full flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-semibold text-[#1a1a1a]">Schedule Settings</h3>
                                        <p className="text-sm text-gray-600">Configure when and how often to contact prospects</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showScheduleSettings ? 'rotate-90' : ''}`} />
                            </button>

                            {showScheduleSettings && (
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Prospect Timezone Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700">Prospect timezone</span>
                                            <div
                                                className="relative"
                                                onMouseEnter={() => setShowTooltip({ ...showTooltip, prospectTimezone: true })}
                                                onMouseLeave={() => setShowTooltip({ ...showTooltip, prospectTimezone: false })}
                                            >
                                                <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                                                    <span className="text-white text-[10px] font-medium">i</span>
                                                </div>
                                                {showTooltip.prospectTimezone && (
                                                    <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                                                        Use the prospect's timezone for scheduling. Default timezone used if prospect's timezone is unavailable.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setProspectTimezone(!prospectTimezone)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prospectTimezone ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prospectTimezone ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Default Timezone */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-900 mb-2 block">Default Timezone</label>
                                        <div className="relative">
                                            <select
                                                value={defaultTimezone}
                                                onChange={(e) => setDefaultTimezone(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                                            >
                                                <option value="">Select timezone...</option>
                                                {timezones.map(tz => (
                                                    <option key={tz} value={tz}>{tz}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Active Days */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-900 mb-2 block">Active Days</label>
                                        <div className="grid grid-cols-7 gap-2">
                                            {Object.entries(activeDays).map(([day, isActive]) => (
                                                <button
                                                    key={day}
                                                    onClick={() => handleDayToggle(day)}
                                                    className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                        ? 'bg-[#3C49F7] text-white'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {day.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Range */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900 mb-2 block">Starts From:</label>
                                            <div className="relative">
                                                <select
                                                    value={startsFrom}
                                                    onChange={(e) => setStartsFrom(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select timezone...</option>
                                                    {timeSlots.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-900 mb-2 block">Ends at:</label>
                                            <div className="relative">
                                                <select
                                                    value={endsAt}
                                                    onChange={(e) => setEndsAt(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select timezone...</option>
                                                    {timeSlots.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* End Campaign Date */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700">End campaign date</span>
                                            <div
                                                className="relative"
                                                onMouseEnter={() => setShowTooltip({ ...showTooltip, endCampaign: true })}
                                                onMouseLeave={() => setShowTooltip({ ...showTooltip, endCampaign: false })}
                                            >
                                                <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                                                    <span className="text-white text-[10px] font-medium">i</span>
                                                </div>
                                                {showTooltip.endCampaign && (
                                                    <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                                                        Turn on to set a date when the campaign will automatically pause. After this date, the campaign stops running.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEndCampaignEnabled(!endCampaignEnabled)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${endCampaignEnabled ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${endCampaignEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {endCampaignEnabled && (
                                        <div>
                                            <input
                                                type="text"
                                                value={endCampaignDate}
                                                onChange={(e) => setEndCampaignDate(e.target.value)}
                                                placeholder="DD/MM/YYYY"
                                                className="w-32 px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Prospect Limitations */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => setShowProspectLimitations(!showProspectLimitations)}
                                className="w-full flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-semibold text-[#1a1a1a]">Prospect Limitations</h3>
                                        <p className="text-sm text-gray-600">Set limits on prospect targeting and company contacts</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showProspectLimitations ? 'rotate-90' : ''}`} />
                            </button>

                            {showProspectLimitations && (
                                <div className="px-4 pb-4 space-y-3">
                                    {/* Skip prospects already in campaigns */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700">Skip prospects already in campaigns</span>
                                            <div
                                                className="relative"
                                                onMouseEnter={() => setShowTooltip({ ...showTooltip, skipProspects: true })}
                                                onMouseLeave={() => setShowTooltip({ ...showTooltip, skipProspects: false })}
                                            >
                                                <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                                                    <span className="text-white text-[10px] font-medium">i</span>
                                                </div>
                                                {showTooltip.skipProspects && (
                                                    <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                                                        Don't add prospects that are already targeted in your other campaigns.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSkipProspectsInCampaigns(!skipProspectsInCampaigns)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${skipProspectsInCampaigns ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${skipProspectsInCampaigns ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Limit prospects per company */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700">Limit prospects per company</span>
                                            <div
                                                className="relative"
                                                onMouseEnter={() => setShowTooltip({ ...showTooltip, limitProspects: true })}
                                                onMouseLeave={() => setShowTooltip({ ...showTooltip, limitProspects: false })}
                                            >
                                                <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                                                    <span className="text-white text-[10px] font-medium">i</span>
                                                </div>
                                                {showTooltip.limitProspects && (
                                                    <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                                                        Control how many prospects from the same company can be added to this campaign. This prevents over-contacting a single organization.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setLimitProspectsPerCompany(!limitProspectsPerCompany)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${limitProspectsPerCompany ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${limitProspectsPerCompany ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Calculated Usage */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => setShowCalculatedUsage(!showCalculatedUsage)}
                                className="w-full flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-semibold text-[#1a1a1a]">Calculated Usage</h3>
                                        <p className="text-sm text-gray-600">We have calculated your usage based on the workflow you have created.</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCalculatedUsage ? 'rotate-180' : ''}`} />
                            </button>

                            {showCalculatedUsage && (
                                <div className="px-4 pb-4 space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-900">Email Sends</span>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-[#1a1a1a]">50 </span>
                                            <span className="text-sm text-gray-500">/per day</span>
                                        </div>
                                    </div>

                                    <div className="py-3 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">LinkedIn Messages</span>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-[#1a1a1a]">100 </span>
                                                <span className="text-sm text-gray-500">/per day</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600">You have a LinkedIn free account connected.</p>
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-sm font-medium text-gray-900">WhatsApp Messages</span>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-[#1a1a1a]">Unlimited </span>
                                            <span className="text-sm text-gray-500">/per day</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="w-1/2 bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] flex items-center justify-center p-8">
                    <img
                        src={settingsIllustration}
                        alt="Settings"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </div>

            {/* Modals */}
            <LaunchConfirmationModal
                isOpen={showLaunchConfirmation}
                onClose={() => setShowLaunchConfirmation(false)}
                onConfirm={handleConfirmLaunch}
            />

            <CampaignLiveModal
                isOpen={showCampaignLive}
                onClose={() => setShowCampaignLive(false)}
            />
        </div>
    );
};

export default WorkflowSettings;