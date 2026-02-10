// components/workflow/WorkflowEditor.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { TreeView } from "./WorkflowTreeView";
import { ListView } from "./WorkflowListView";
import { EmailPanel, LinkedInPanel, WhatsAppPanel, TelegramPanel, ConditionPanel, CallPanel, EmptyPanel } from "./WorkflowPanels";
import WorkflowSettings from "./WorkflowSettings";
import {
    EmailSignatureModal,
    CreateSignatureModal,
    SignatureSuccessModal,
    DeleteStepModal,
} from "./WorkflowBuilderModals";

// Import illustration
import workflowIllustration from "../../assets/WF3.png";

const WorkflowEditor = ({
    onBack,
    workflowName,
    workflowDate,
    onSave,
    onSaveAndContinue,
    initialSteps = [],
    projectId,
    showSettingsExternal = false,
    onSettingsClose,
}) => {
    // View state
    const [view, setView] = useState("list");
    const [showSettings, setShowSettings] = useState(false);

    // Handle external settings trigger
    useEffect(() => {
        if (showSettingsExternal) {
            setShowSettings(true);
        }
    }, [showSettingsExternal]);

    // Notify parent when settings closes
    useEffect(() => {
        if (!showSettings && onSettingsClose) {
            onSettingsClose();
        }
    }, [showSettings, onSettingsClose]);

    // Steps state
    const [steps, setSteps] = useState(initialSteps);
    const [selectedStepId, setSelectedStepId] = useState(null);

    // Step configurations (email content, etc.)
    const [stepConfigs, setStepConfigs] = useState({});

    // Modal states
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showCreateSignatureModal, setShowCreateSignatureModal] = useState(false);
    const [showSignatureSuccess, setShowSignatureSuccess] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stepToDelete, setStepToDelete] = useState(null);
    const [signatureName, setSignatureName] = useState("");

    // Existing signatures
    const [existingSignatures, setExistingSignatures] = useState([]);

    // Get selected step
    const selectedStep = steps.find(s => s.id === selectedStepId);
    const selectedConfig = selectedStepId ? (stepConfigs[selectedStepId] || {}) : {};

    // Get step label
    const getStepLabel = (type, subAction) => {
        switch (type) {
            case "email": return "Send Email Message";
            case "linkedin":
                switch (subAction) {
                    case "message": return "LinkedIn Message";
                    case "likePost": return "Like a Post";
                    case "repost": return "Repost";
                    case "comment": return "Comment on a Post";
                    default: return "LinkedIn";
                }
            case "whatsapp": return "Send Whatsapp Message";
            case "telegram": return "Send Telegram Message";
            case "call": return "Call";
            case "condition": return "Condition";
            default: return type;
        }
    };

    // Get default config
    const getDefaultConfig = (type) => {
        switch (type) {
            case "email":
                return {
                    to: `${workflowName} - ${workflowDate}`,
                    cc: "",
                    bcc: "",
                    subject: "",
                    body: "",
                };
            case "linkedin":
                return { message: "" };
            case "whatsapp":
                return {
                    to: `${workflowName} - ${workflowDate}`,
                    message: "",
                };
            case "telegram":
                return {
                    to: `${workflowName} - ${workflowDate}`,
                    message: "",
                };
            case "condition":
                return {
                    conditionType: null,
                };
            case "call":
                return {
                    openingLine: "",
                    websiteUrl: "https://www.example.com",
                    callPrompt: "",
                };
            default:
                return {};
        }
    };

    // Add new step
    const handleAddStep = (type, subAction = null, position = "end", referenceId = null, branch = null) => {
        const newStep = {
            id: Date.now(),
            type,
            subAction,
            label: getStepLabel(type, subAction),
            delay: 3,
            branch: branch || null,
            parentId: branch ? referenceId : null,
        };

        let newSteps = [...steps];

        if (position === "above" && referenceId) {
            const index = newSteps.findIndex(s => s.id === referenceId);
            if (index !== -1) {
                newSteps.splice(index, 0, newStep);
            } else {
                newSteps.push(newStep);
            }
        } else if (position === "below" && referenceId) {
            const index = newSteps.findIndex(s => s.id === referenceId);
            if (index !== -1) {
                newSteps.splice(index + 1, 0, newStep);
            } else {
                newSteps.push(newStep);
            }
        } else {
            // "end" position - add to end of main flow or branch
            if (branch && referenceId) {
                // Adding to a branch - find the last step in this branch
                const branchSteps = newSteps.filter(s => s.branch === branch && s.parentId === referenceId);
                if (branchSteps.length > 0) {
                    const lastBranchStep = branchSteps[branchSteps.length - 1];
                    const lastIndex = newSteps.findIndex(s => s.id === lastBranchStep.id);
                    newSteps.splice(lastIndex + 1, 0, newStep);
                } else {
                    newSteps.push(newStep);
                }
            } else {
                newSteps.push(newStep);
            }
        }

        setSteps(newSteps);
        setSelectedStepId(newStep.id);
        setStepConfigs({
            ...stepConfigs,
            [newStep.id]: getDefaultConfig(type),
        });
    };

    // Delete step
    const handleDeleteStep = (stepId) => {
        const step = steps.find(s => s.id === stepId);
        setStepToDelete(step);
        setShowDeleteModal(true);
    };

    const confirmDeleteStep = () => {
        if (stepToDelete) {
            // Also delete any child steps in branches
            const stepsToDelete = [stepToDelete.id];
            if (stepToDelete.type === "condition") {
                // Find all steps that have this condition as parent
                steps.forEach(s => {
                    if (s.parentId === stepToDelete.id) {
                        stepsToDelete.push(s.id);
                    }
                });
            }

            setSteps(steps.filter(s => !stepsToDelete.includes(s.id)));

            if (selectedStepId && stepsToDelete.includes(selectedStepId)) {
                setSelectedStepId(null);
            }

            const newConfigs = { ...stepConfigs };
            stepsToDelete.forEach(id => delete newConfigs[id]);
            setStepConfigs(newConfigs);
            setStepToDelete(null);
        }
        setShowDeleteModal(false);
    };

    // Update step delay
    const handleUpdateDelay = (stepId, delay) => {
        setSteps(steps.map(s => s.id === stepId ? { ...s, delay } : s));
    };

    // Update step config
    const handleConfigChange = (field, value) => {
        if (selectedStepId) {
            setStepConfigs({
                ...stepConfigs,
                [selectedStepId]: {
                    ...selectedConfig,
                    [field]: value,
                },
            });

            // Update condition label when conditionType changes
            if (field === "conditionType" && selectedStep?.type === "condition") {
                const conditionLabels = {
                    email: "Email Responded",
                    whatsapp: "WhatsApp Responded",
                    telegram: "Telegram Responded",
                    call: "Call Responded",
                };
                setSteps(steps.map(s =>
                    s.id === selectedStepId
                        ? { ...s, label: conditionLabels[value] || "Condition" }
                        : s
                ));
            }
        }
    };

    // Handle signature creation flow
    const handleOpenSignatureModal = () => {
        setShowSignatureModal(true);
    };

    const handleCreateNewSignature = (name) => {
        setSignatureName(name);
        setShowSignatureModal(false);
        setShowCreateSignatureModal(true);
    };

    const handleSaveSignature = (signatureData) => {
        setExistingSignatures([...existingSignatures, { id: Date.now(), ...signatureData }]);
        setShowCreateSignatureModal(false);
        setShowSignatureSuccess(true);
        setTimeout(() => setShowSignatureSuccess(false), 2000);
    };

    const handleSelectSignature = (signature) => {
        setShowSignatureModal(false);
    };

    // Render right panel based on selected step
    const renderRightPanel = () => {
        if (!selectedStep) {
            return <EmptyPanel illustration={workflowIllustration} />;
        }

        switch (selectedStep.type) {
            case "email":
                return (
                    <EmailPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                        workflowName={workflowName}
                        workflowDate={workflowDate}
                        onOpenSignature={handleOpenSignatureModal}
                    />
                );
            case "linkedin":
                return (
                    <LinkedInPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                        subAction={selectedStep.subAction}
                    />
                );
            case "whatsapp":
                return (
                    <WhatsAppPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                        workflowName={workflowName}
                        workflowDate={workflowDate}
                    />
                );
            case "telegram":
                return (
                    <TelegramPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                        workflowName={workflowName}
                        workflowDate={workflowDate}
                    />
                );
            case "condition":
                return (
                    <ConditionPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                    />
                );
            case "call":
                return (
                    <CallPanel
                        config={selectedConfig}
                        onChange={handleConfigChange}
                        workflowName={workflowName}
                        workflowDate={workflowDate}
                    />
                );
            default:
                return <EmptyPanel illustration={workflowIllustration} />;
        }
    };

    // Check if we have any steps to show the right panel
    const hasSteps = steps.length > 0;

    // Show Settings Screen if showSettings is true
    if (showSettings) {
        return (
            <WorkflowSettings
                onBack={() => setShowSettings(false)}
                workflowName={workflowName}
                steps={steps}
                stepConfigs={stepConfigs}
                projectId={projectId}
                onSave={() => {
                    console.log("Saving settings");
                    onSave?.();
                }}
                onLaunch={() => {
                    console.log("Launching campaign");
                    onSaveAndContinue?.();
                }}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F8F9FC]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${view === "list" ? "bg-[#1a1a1a] text-white" : "text-gray-600"
                                }`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setView("tree")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${view === "tree" ? "bg-[#1a1a1a] text-white" : "text-gray-600"
                                }`}
                        >
                            Tree
                        </button>
                    </div>

                    {/* Save & Continue Button */}
                    {/* <button
                        onClick={() => setShowSettings(true)}
                        className="px-5 py-2 bg-[#3C49F7] text-white rounded-lg text-sm font-medium hover:bg-[#2a35d4]"
                    >
                        Save & Continue
                    </button> */}

                    {/* More Options */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side - Workflow Canvas */}
                <div className={`overflow-y-auto p-6 ${hasSteps ? 'flex-1' : 'w-full'}`}>
                    {view === "list" ? (
                        <ListView
                            steps={steps}
                            selectedStepId={selectedStepId}
                            onSelectStep={setSelectedStepId}
                            onAddStep={handleAddStep}
                            onDeleteStep={handleDeleteStep}
                            onUpdateDelay={handleUpdateDelay}
                            onSwitchToTree={() => setView("tree")}
                        />
                    ) : (
                        <TreeView
                            steps={steps}
                            selectedStepId={selectedStepId}
                            onSelectStep={setSelectedStepId}
                            onAddStep={handleAddStep}
                            onDeleteStep={handleDeleteStep}
                            onUpdateDelay={handleUpdateDelay}
                        />
                    )}
                </div>

                {/* Right Side - Configuration Panel - Only show when there are steps */}
                {hasSteps && (
                    <div className="w-[45%] flex-shrink-0 p-5 overflow-y-auto">
                        {renderRightPanel()}
                    </div>
                )}
            </div>

            {/* Modals */}
            <EmailSignatureModal
                isOpen={showSignatureModal}
                onClose={() => setShowSignatureModal(false)}
                onCreateNew={handleCreateNewSignature}
                onSelectSignature={handleSelectSignature}
                existingSignatures={existingSignatures}
            />

            <CreateSignatureModal
                isOpen={showCreateSignatureModal}
                onClose={() => setShowCreateSignatureModal(false)}
                onSave={handleSaveSignature}
                signatureName={signatureName}
            />

            <SignatureSuccessModal
                isOpen={showSignatureSuccess}
                onClose={() => setShowSignatureSuccess(false)}
            />

            <DeleteStepModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setStepToDelete(null);
                }}
                onConfirm={confirmDeleteStep}
                stepName={stepToDelete?.label || "this step"}
            />
        </div>
    );
};

export default WorkflowEditor;