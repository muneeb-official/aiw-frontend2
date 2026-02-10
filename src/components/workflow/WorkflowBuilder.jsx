// components/workflow/WorkflowBuilder.jsx
import { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2, RotateCcw, Check, Grid3X3, Scissors, TrendingUp } from "lucide-react";
import WorkflowEditor from "./WorkflowEditor";
import api from "../../services/api";

// Import your illustration images from assets
import pencilIllustration from "../../assets/WF1.png";
import fishingIllustration from "../../assets/WF2.png";
import workflowIllustration from "../../assets/WF3.png"; // Add this illustration for empty state

// Data will be fetched from API - no hardcoded samples

// Template data
const TEMPLATES = {
    scratch: {
        id: "scratch",
        title: "Start from scratch",
        description: "Build your own workflow",
        icon: "grid",
        initialSteps: [],
    },
    directAction: {
        id: "directAction",
        title: "Direct Action Campaign",
        subtitle: "For time sensitive prospects",
        icon: "scissors",
        initialSteps: [
            { id: 1, type: "email", label: "Send Email Message", delay: 3 },
            { id: 2, type: "email", label: "Send Email Message", delay: 3 },
            { id: 3, type: "email", label: "Send Email Message", delay: 3 },
            { id: 4, type: "email", label: "Send Email Message", delay: 3 },
        ],
        details: {
            title: "Direct Action Campaign",
            description: "This is an email-only sequence, which leads quick engagement by combining bold, attention-grabbing statements with actionable insights. Each email builds on the previous one, providing value while maintaining a sense of urgency to encourage timely responses.",
            steps: 4,
            stepsLabel: "4 Steps Email Involved",
            stepIcons: ["email", "email", "email", "email"],
            bullets: [
                "Begin with a professional tone that establishes credibility quickly.",
                "Use concise compelling value propositions that address specific pain points.",
                "Build increasing urgency throughout the sequence.",
                "Incorporate clear action-oriented calls to action in every message.",
                "Become more direct and persuasive with each subsequent touch-point.",
                "Leverage time-sensitivity to drive prompt responses.",
            ],
        },
    },
    eventDriven: {
        id: "eventDriven",
        title: "Event Driven Outreach",
        subtitle: "AI Workforce",
        icon: "trending",
        initialSteps: [
            { id: 1, type: "email", label: "Send Email Message", delay: 3 },
            { id: 2, type: "linkedin", subAction: "likePost", label: "Like a Post", delay: 3 },
            { id: 3, type: "email", label: "Send Email Message", delay: 3 },
            { id: 4, type: "condition", label: "Condition", delay: 0 },
        ],
        details: {
            title: "Event-Driven Outreach",
            description: "A sophisticated multi-touch sequence that adapts based on prospect behavior. Uses LinkedIn connection status, content engagement, and email to maximize coverage while keeping the event conversation relevant.",
            steps: 13,
            stepsLabel: "13 Steps Involved",
            stepIcons: ["linkedin", "linkedin", "like", "email", "linkedin", "email", "email", "email", "email", "linkedin", "linkedin", "like", "linkedin"],
            bullets: [
                "Always mention the specific event or conference the prospect engaged with in the opening line",
                "Connect the event topic to a business challenge your solution addresses",
                "Use timely language like 'I noticed you're following the conversation around...'",
                "Consider the keyword as the event that the user is following or engaging with.",
            ],
        },
    },
};

// Step indicator component
const StepIndicator = ({ currentStep }) => {
    const steps = [
        { id: 1, label: "Pick Source" },
        { id: 2, label: "Pick Template" },
        { id: 3, label: "Create Workflow" },
    ];

    return (
        <div className="flex items-center gap-2 text-sm">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center
              ${currentStep >= step.id ? "border-[#3C49F7] bg-[#3C49F7]" : "border-gray-300"}`}>
                            {currentStep > step.id && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className={currentStep >= step.id ? "text-[#3C49F7] font-medium" : "text-gray-400"}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 h-px mx-2 ${currentStep > step.id ? "bg-[#3C49F7]" : "bg-gray-300"}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

// Loading Modal
const LoadingModal = ({ isOpen, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">{message}</h3>
                <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
            </div>
        </div>
    );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-[#3C49F7]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">We have Successfully pulled all the leads!</h3>
                <p className="text-gray-600">Now you can create the workflow for these leads.</p>
            </div>
        </div>
    );
};

// Template Icon Component
const TemplateIcon = ({ type, className = "w-6 h-6" }) => {
    switch (type) {
        case "grid":
            return <Grid3X3 className={`${className} text-[#3C49F7]`} />;
        case "scissors":
            return <Scissors className={`${className} text-[#3C49F7]`} />;
        case "trending":
            return <TrendingUp className={`${className} text-[#3C49F7]`} />;
        default:
            return <Grid3X3 className={`${className} text-[#3C49F7]`} />;
    }
};

// Step Icon for workflow visualization
const StepIcon = ({ type, size = "sm" }) => {
    const sizeClass = size === "sm" ? "w-6 h-6" : "w-7 h-7";
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    if (type === "email") {
        return (
            <div className={`${sizeClass} bg-white border border-gray-200 rounded flex items-center justify-center`}>
                <svg className={`${iconSize} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }
    if (type === "linkedin") {
        return (
            <div className={`${sizeClass} bg-[#0077B5] rounded flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">in</span>
            </div>
        );
    }
    if (type === "like") {
        return (
            <div className={`${sizeClass} bg-white border border-gray-200 rounded flex items-center justify-center`}>
                <svg className={`${iconSize} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
            </div>
        );
    }
    return null;
};

// Main WorkflowBuilder Component
const WorkflowBuilder = ({ isOpen, onClose, campaignName = "New Campaign", entrySource = "campaign" }) => {
    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // Source selection state
    const [selectedSource, setSelectedSource] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [leadsReady, setLeadsReady] = useState(false);

    // API data state
    const [projects, setProjects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

    // CSV upload state
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(false);
    const fileInputRef = useRef(null);

    // Template selection state
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [triggerSettings, setTriggerSettings] = useState(false);
    

    // Campaign name editing
    const [isEditingName, setIsEditingName] = useState(false);
    const [workflowName, setWorkflowName] = useState(campaignName);
    const [workflowDate] = useState(new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
    }));

    // Initial loading effect
    useEffect(() => {
        if (isOpen && entrySource === "organic") {
            setShowLoading(true);
            setLoadingMessage("Give us few seconds for setup the workflow");
            setTimeout(() => {
                setShowLoading(false);
            }, 2000);
        }
    }, [isOpen, entrySource]);

    // Fetch projects from API (same as Campaign Manager)
    useEffect(() => {
        if (!isOpen) return;

        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const response = await api.get("/b2b/projects/all");
                console.log("📥 Fetched all B2B projects for WorkflowBuilder:", response.data);

                if (
                    response.data &&
                    response.data.success &&
                    response.data.data?.projects
                ) {
                    // Transform projects to campaign format (same as Campaign Manager)
                    const transformedProjects = response.data.data.projects.map(
                        (project) => {
                            // Format the created_at date
                            const createdDate = new Date(project.created_at);
                            const formattedDate = createdDate.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            });

                            return {
                                id: project.id,
                                name: project.name,
                                createdAt: formattedDate,
                                source: project.source,
                            };
                        }
                    );

                    setProjects(transformedProjects);
                }
            } catch (error) {
                console.error("❌ Error fetching B2B projects:", error);
                console.error("Error details:", error.response?.data || error.message);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [isOpen]);

    // Fetch campaigns from scheduler API (same as Campaign Manager)
    useEffect(() => {
        if (!isOpen) return;

        const fetchCampaigns = async () => {
            setIsLoadingCampaigns(true);
            try {
                const response = await api.get("/scheduler/v1/campaigns");
                console.log("📥 Fetched campaigns for WorkflowBuilder:", response.data);

                if (response.data && response.data.campaigns) {
                    // Transform campaigns to match the format needed
                    const transformedCampaigns = response.data.campaigns.map((campaign) => {
                        // Format the created_at date
                        const createdDate = new Date(campaign.created_at);
                        const formattedDate = createdDate.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        });

                        return {
                            id: campaign.id,
                            name: campaign.name,
                            createdAt: formattedDate,
                            source: "campaign",
                        };
                    });

                    setCampaigns(transformedCampaigns);
                }
            } catch (error) {
                console.error("❌ Error fetching campaigns:", error);
                console.error("Error details:", error.response?.data || error.message);
            } finally {
                setIsLoadingCampaigns(false);
            }
        };

        fetchCampaigns();
    }, [isOpen]);

    if (!isOpen) return null;

    // Handlers
    const handleSourceSelect = (source) => {
        setSelectedSource(source);
        setSelectedCampaign(null);
        setLeadsReady(false);
        setUploadedFile(null);
        setUploadProgress(0);
        setUploadError(false);
    };

    const handleCampaignSelect = (campaign) => {
        setSelectedCampaign(campaign);
    };

    const handlePullLeads = () => {
        setShowLoading(true);
        setLoadingMessage("Give us few seconds for setup the workflow");
        setTimeout(() => {
            setShowLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setLeadsReady(true);
            }, 1500);
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + "MB" });
            setUploadProgress(0);
            setUploadError(false);

            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 300);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith(".csv")) {
            setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + "MB" });
            setUploadProgress(0);
            setUploadError(false);

            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 300);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setUploadProgress(0);
        setUploadError(false);
    };

    const handleRetryUpload = () => {
        setUploadError(false);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 20;
            });
        }, 300);
    };

    const handleContinueToTemplate = () => {
        if (currentStep === 1 && leadsReady) {
            setCurrentStep(2);
        } else if (currentStep === 2 && selectedTemplate) {
            setCurrentStep(3);
        }
    };

    const handleTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);
    };

    const handleBack = () => {
        if (currentStep === 3) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setCurrentStep(1);
            setSelectedTemplate(null);
        } else if (selectedSource) {
            setSelectedSource(null);
            setSelectedCampaign(null);
            setLeadsReady(false);
        }
    };

    const handleSave = () => {
        console.log("Saving workflow:", { workflowName, selectedTemplate, currentStep });
    };

    const handleSaveAndContinue = () => {
        if (currentStep === 2 && selectedTemplate) {
            setCurrentStep(3);
        } else if (currentStep === 3) {
            console.log("Final save and close");
            onClose();
        }
    };

    // Get current campaigns based on source (using API data)
    const getCurrentCampaigns = () => {
        if (selectedSource === "campaign") {
            // Return all projects and campaigns
            return [...projects, ...campaigns];
        }
        if (selectedSource === "organic") {
            // Return only organic projects
            return projects.filter(p => p.source === "organic");
        }
        return [];
    };

    // Get initial steps for selected template
    const getInitialSteps = () => {
        if (selectedTemplate && TEMPLATES[selectedTemplate]) {
            return TEMPLATES[selectedTemplate].initialSteps || [];
        }
        return [];
    };

    // Render source selection (Step 1 - initial)
    const renderSourceSelection = () => (
        <div>
            <h2 className="text-[32px] font-normal text-[#1a1a1a] mb-8">Choose your source</h2>

            <div className="space-y-4">
                <button
                    onClick={() => handleSourceSelect("campaign")}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#3C49F7] hover:bg-[#F8F9FC] transition-all text-left"
                >
                    <div className="w-12 h-12 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <span className="text-lg font-medium text-[#1a1a1a]">Pull leads from Campaign Manager</span>
                </button>

                <button
                    onClick={() => handleSourceSelect("organic")}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#3C49F7] hover:bg-[#F8F9FC] transition-all text-left"
                >
                    <div className="w-12 h-12 bg-[#F2F2FF] rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#3C49F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span className="text-lg font-medium text-[#1a1a1a]">Use leads from organic search</span>
                </button>

                <button
                    onClick={() => handleSourceSelect("csv")}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#3C49F7] hover:bg-[#F8F9FC] transition-all text-left"
                >
                    <div className="w-12 h-12 bg-[#3C49F7] rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CSV</span>
                    </div>
                    <div>
                        <span className="text-lg font-medium text-[#1a1a1a] block">CSV</span>
                        <span className="text-sm text-gray-500">Upload a list of leads to automatically follow up and qualify them.</span>
                    </div>
                </button>
            </div>
        </div>
    );

    // Render campaign selection
    const renderCampaignSelection = () => {
        const campaignsList = getCurrentCampaigns();
        const title = selectedSource === "campaign"
            ? "Pull leads from Campaign Manager"
            : "Use leads from organic search";

        const isLoading = isLoadingProjects || isLoadingCampaigns;

        return (
            <div>
                <h2 className="text-[32px] font-normal text-[#1a1a1a] mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">Pick a campaign</p>
                <hr className="mb-6" />

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C49F7]"></div>
                            <p className="text-sm text-gray-500">Loading projects and campaigns...</p>
                        </div>
                    </div>
                ) : campaignsList.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-sm text-gray-500">No campaigns or projects found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {campaignsList.map((campaign) => (
                            <button
                                key={campaign.id}
                                onClick={() => handleCampaignSelect(campaign)}
                                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left
                ${selectedCampaign?.id === campaign.id
                                        ? "border-[#3C49F7] bg-[#F8F9FC]"
                                        : "border-gray-200 hover:border-gray-300"}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedCampaign?.id === campaign.id
                                        ? "border-[#3C49F7] bg-[#3C49F7]"
                                        : "border-gray-300"}`}>
                                    {selectedCampaign?.id === campaign.id && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-[#1a1a1a] block">{campaign.name}</span>
                                    {campaign.createdAt && (
                                        <span className="text-sm text-gray-500">Created on: {campaign.createdAt}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {selectedCampaign && !isLoading && (
                    <button
                        onClick={handlePullLeads}
                        className="mt-6 bg-[#3C49F7] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
                    >
                        Pull Leads
                    </button>
                )}
            </div>
        );
    };

    // Render CSV upload
    const renderCSVUpload = () => (
        <div>
            <h2 className="text-[32px] font-normal text-[#1a1a1a] mb-6">Choose your source</h2>

            <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-[#3C49F7] rounded-xl p-12 text-center mb-4 cursor-pointer hover:bg-[#F8F9FC] transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-12 h-12 bg-[#3C49F7] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-700 mb-2">Drag your file(s) to start uploading</p>
                <p className="text-gray-400 text-sm mb-4">OR</p>
                <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                    Browse File
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>

            {uploadedFile && (
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">CSV</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-[#1a1a1a]">{uploadedFile.name}</p>
                            {uploadError ? (
                                <p className="text-sm text-red-500">Upload failed</p>
                            ) : (
                                <p className="text-sm text-gray-500">{uploadedFile.size}</p>
                            )}
                        </div>

                        {uploadError ? (
                            <div className="flex items-center gap-2">
                                <button onClick={handleRemoveFile} className="p-1 hover:bg-gray-100 rounded">
                                    <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                                <button onClick={handleRetryUpload} className="p-1 hover:bg-gray-100 rounded">
                                    <RotateCcw className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleRemoveFile} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {!uploadError && uploadProgress < 100 && (
                        <div className="mt-3">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#3C49F7] rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}%</p>
                        </div>
                    )}
                </div>
            )}

            {uploadedFile && uploadProgress === 100 && !uploadError && (
                <button
                    onClick={() => {
                        setLeadsReady(true);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 1500);
                    }}
                    className="mt-6 bg-[#3C49F7] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
                >
                    Continue Choose a template
                </button>
            )}
        </div>
    );

    // Render success state with continue button
    const renderLeadsReady = () => (
        <div>
            <h2 className="text-[32px] font-normal text-[#1a1a1a] mb-6">
                Great! We have Successfully pulled all the leads!
            </h2>

            <button
                onClick={handleContinueToTemplate}
                className="bg-[#3C49F7] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
            >
                Continue Choose a template
            </button>
        </div>
    );

    // Render template selection (Step 2)
    const renderTemplateSelection = () => {
        const selectedTemplateData = selectedTemplate ? TEMPLATES[selectedTemplate] : null;

        return (
            <div className="flex gap-16">
                {/* Left side - Template options */}
                <div className="flex-1">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <h2 className="text-[32px] font-normal text-[#1a1a1a] mb-6">Pick Template</h2>

                    {/* Design your own Workflow */}
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-3">Design you own Workflow</h3>
                    <button
                        onClick={() => handleTemplateSelect("scratch")}
                        className={`w-full max-w-sm p-4 border rounded-lg text-left transition-all mb-6
              ${selectedTemplate === "scratch"
                                ? "border-[#3C49F7] bg-[#F8F9FC]"
                                : "border-gray-200 hover:border-gray-300"}`}
                    >
                        <TemplateIcon type="grid" className="w-6 h-6 mb-3" />
                        <p className="font-semibold text-[#1a1a1a]">{TEMPLATES.scratch.title}</p>
                        <p className="text-sm text-gray-500">{TEMPLATES.scratch.description}</p>
                    </button>

                    {/* Template Library */}
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-3">Template Library</h3>
                    <div className="grid grid-cols-2 gap-4 max-w-lg">
                        {/* Direct Action - Coming Soon */}
                        <div className="relative group">
                            <button
                                disabled
                                className="p-4 border rounded-lg text-left transition-all w-full border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            >
                                <TemplateIcon type="scissors" className="w-6 h-6 mb-3 opacity-50" />
                                <p className="font-semibold text-gray-400">{TEMPLATES.directAction.title}</p>
                                <p className="text-sm text-gray-400">{TEMPLATES.directAction.subtitle}</p>
                            </button>
                            {/* Coming Soon Tooltip */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                                    Coming Soon
                                </span>
                            </div>
                        </div>

                        {/* Event Driven - Coming Soon */}
                        <div className="relative group">
                            <button
                                disabled
                                className="p-4 border rounded-lg text-left transition-all w-full border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            >
                                <TemplateIcon type="trending" className="w-6 h-6 mb-3 opacity-50" />
                                <p className="font-semibold text-gray-400">{TEMPLATES.eventDriven.title}</p>
                                <p className="text-sm text-gray-400">{TEMPLATES.eventDriven.subtitle}</p>
                            </button>
                            {/* Coming Soon Tooltip */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedTemplate && (
                        <button
                            onClick={handleContinueToTemplate}
                            className="mt-8 bg-[#3C49F7] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
                        >
                            Continue with this template
                        </button>
                    )}
                </div>

                {/* Right side - Template details or illustration */}
                <div className="w-[50%]">
                    {selectedTemplateData?.details ? (
                        <div className="bg-gradient-to-br from-[#F2F2FF] to-[#E8E8FF] rounded-2xl p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <TemplateIcon type={selectedTemplateData.icon} className="w-8 h-8" />
                                <h3 className="text-2xl font-semibold text-[#1a1a1a]">{selectedTemplateData.details.title}</h3>
                            </div>

                            <h4 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                                What is {selectedTemplateData.details.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{selectedTemplateData.details.description}</p>

                            <div className="mb-6">
                                <p className="text-sm text-[#1a1a1a] mb-3">{selectedTemplateData.details.stepsLabel}</p>
                                <div className="flex items-center flex-wrap gap-y-2">
                                    {selectedTemplateData.details.stepIcons.slice(0, 8).map((icon, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <StepIcon type={icon} />
                                            {idx < Math.min(selectedTemplateData.details.stepIcons.length, 8) - 1 && (
                                                <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {selectedTemplateData.details.stepIcons.length > 8 && (
                                    <div className="flex items-center mt-2 ml-8">
                                        <svg className="w-4 h-4 text-gray-400 mr-1 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {selectedTemplateData.details.stepIcons.slice(8).map((icon, idx) => (
                                            <div key={idx + 8} className="flex items-center">
                                                <StepIcon type={icon} />
                                                {idx < selectedTemplateData.details.stepIcons.length - 9 && (
                                                    <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl p-5">
                                <h4 className="text-lg font-semibold text-[#1a1a1a] mb-4">Breaking it down for you</h4>
                                <ul className="space-y-3">
                                    {selectedTemplateData.details.bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                            <span className="text-[#1a1a1a] mt-0.5">•</span>
                                            <span className="leading-relaxed">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl flex items-center justify-center">
                            <img src={fishingIllustration} alt="" className="w-full" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Step 1 content based on state
    const renderStep1Content = () => {
        if (leadsReady) return renderLeadsReady();
        if (selectedSource === "csv") return renderCSVUpload();
        if (selectedSource === "campaign" || selectedSource === "organic") return renderCampaignSelection();
        return renderSourceSelection();
    };

    // Render Step 3 - Workflow Editor
    const renderWorkflowEditor = () => (
        <WorkflowEditor
            onBack={() => setCurrentStep(2)}
            workflowName={workflowName}
            workflowDate={workflowDate}
            onSave={handleSave}
            onSaveAndContinue={() => {
                console.log("Workflow saved successfully");
                onClose();
            }}
            initialSteps={getInitialSteps()}
            projectId={selectedCampaign?.id}
        />
    );

    // If on Step 3, render full-screen workflow editor
 // If on Step 3, render full-screen workflow editor
if (currentStep === 3) {
    return (
        <div className="fixed inset-0 bg-[#F8F9FC] z-50 overflow-hidden flex flex-col">
            {/* Workflow Editor - it handles its own header via WorkflowSettings */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Header - Only show when NOT in settings */}
                {!triggerSettings && (
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Exit
                            </button>
                            <div className="flex items-center gap-2">
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={workflowName}
                                        onChange={(e) => setWorkflowName(e.target.value)}
                                        onBlur={() => setIsEditingName(false)}
                                        onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-[#1a1a1a] focus:outline-none focus:border-[#3C49F7]"
                                        autoFocus
                                    />
                                ) : (
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="flex items-center gap-2 text-[#1a1a1a]"
                                    >
                                        <span>{workflowName} - {workflowDate}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Save Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setTriggerSettings(true)}
                                className="px-5 py-2 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
                            >
                                Save & Continue
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-hidden">
                    <WorkflowEditor
                        onBack={() => setCurrentStep(2)}
                        workflowName={workflowName}
                        workflowDate={workflowDate}
                        onSave={handleSave}
                        onSaveAndContinue={() => {
                            console.log("Workflow saved successfully");
                            onClose();
                        }}
                        initialSteps={getInitialSteps()}
                        projectId={selectedCampaign?.id}
                        showSettingsExternal={triggerSettings}
                        onSettingsClose={() => setTriggerSettings(false)}
                    />
                </div>
            </div>
        </div>
    );
}
    return (
        <div className="fixed inset-0 bg-[#F8F9FC] z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Exit
                    </button>
                    <div className="flex items-center gap-2">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-[#1a1a1a] focus:outline-none focus:border-[#3C49F7]"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="flex items-center gap-2 text-[#1a1a1a]"
                            >
                                <span>{workflowName} - {workflowDate}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setTriggerSettings(true);
                        }}
                        className="px-5 py-2 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Step Indicator */}
                <div className="mb-8">
                    <StepIndicator currentStep={currentStep} />
                </div>

                {/* Content based on current step */}
                <div className="flex gap-8">
                    {/* Left Content */}
                    <div className={currentStep === 2 ? "flex-1" : "flex-1 max-w-3xl"}>
                        {currentStep === 1 && renderStep1Content()}
                        {currentStep === 2 && renderTemplateSelection()}
                    </div>

                    {/* Right Illustration (only for Step 1) */}
                    {currentStep === 1 && (
                        <div className="w-[50%]">
                            <div className="bg-[#3C3C7C] rounded-2xl flex items-center justify-center">
                                <img src={fishingIllustration} alt="" className="w-full" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <LoadingModal isOpen={showLoading} message={loadingMessage} />
            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </div>
    );
};

export default WorkflowBuilder;