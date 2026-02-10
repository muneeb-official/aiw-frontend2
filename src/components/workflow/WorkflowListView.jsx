// components/workflow/WorkflowListView.jsx
import { useState } from "react";
import { Plus, Mail, ThumbsUp, MessageSquare, Phone, Send, GitBranch, Trash2 } from "lucide-react";

// Step Icon Component
const StepIcon = ({ type, subAction }) => {
    const iconClass = "w-4 h-4";

    switch (type) {
        case "email":
            return <Mail className={`${iconClass} text-gray-600`} />;
        case "linkedin":
            if (subAction === "likePost") {
                return <ThumbsUp className={`${iconClass} text-gray-600`} />;
            }
            return (
                <div className="w-4 h-4 bg-[#0077B5] rounded flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">in</span>
                </div>
            );
        case "whatsapp":
            return <MessageSquare className={`${iconClass} text-[#25D366]`} />;
        case "telegram":
            return <Send className={`${iconClass} text-[#0088cc]`} />;
        case "call":
            return <Phone className={`${iconClass} text-gray-600`} />;
        case "condition":
            return <GitBranch className={`${iconClass} text-gray-600`} />;
        default:
            return <Mail className={`${iconClass} text-gray-600`} />;
    }
};

// Add New Dropdown - Shows all options, disables Call/Condition if they exist
const AddNewDropdown = ({ onSelect, onClose, hasCallOrCondition = false, onSwitchToTree }) => {
    const [showLinkedInSubmenu, setShowLinkedInSubmenu] = useState(false);

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-2">
                <p className="text-xs text-gray-500 px-4 py-1">Actions</p>

                <button
                    onClick={() => { onSelect("email"); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Mail className="w-4 h-4 text-gray-600" />
                    Email
                </button>

                <div
                    className="relative"
                    onMouseEnter={() => setShowLinkedInSubmenu(true)}
                    onMouseLeave={() => setShowLinkedInSubmenu(false)}
                >
                    <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-[#0077B5] rounded flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">in</span>
                            </div>
                            LinkedIn
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {showLinkedInSubmenu && (
                        <div className="absolute left-full top-0 ml-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-1">
                            <button
                                onClick={() => { onSelect("linkedin", "message"); onClose(); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <div className="w-4 h-4 bg-[#0077B5] rounded flex items-center justify-center">
                                    <span className="text-white text-[8px] font-bold">in</span>
                                </div>
                                Message
                            </button>
                            <button
                                onClick={() => { onSelect("linkedin", "likePost"); onClose(); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <ThumbsUp className="w-4 h-4 text-gray-600" />
                                Like a Post
                            </button>
                            <button
                                onClick={() => { onSelect("linkedin", "repost"); onClose(); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Repost
                            </button>
                            <button
                                onClick={() => { onSelect("linkedin", "comment"); onClose(); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <MessageSquare className="w-4 h-4 text-gray-600" />
                                Comment on a Post
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => { onSelect("whatsapp"); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    Whatsapp
                </button>

                <button
                    onClick={() => { onSelect("telegram"); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Send className="w-4 h-4 text-[#0088cc]" />
                    Telegram
                </button>

                {/* Call - Disabled with tooltip if hasCallOrCondition */}
                {hasCallOrCondition ? (
                    <div className="relative group">
                        <button
                            disabled
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                        >
                            <Phone className="w-4 h-4 text-gray-400" />
                            Call
                        </button>
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 w-[200px] leading-relaxed pointer-events-none">
                            Switch to tree view to add nested steps
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => { onSelect("call"); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Phone className="w-4 h-4 text-gray-600" />
                        Call
                    </button>
                )}

                <div className="border-t border-gray-100 mt-1 pt-1">
                    <p className="text-xs text-gray-500 px-4 py-1">Conditions</p>

                    {/* Condition - Disabled with tooltip if hasCallOrCondition */}
                    {hasCallOrCondition ? (
                        <div className="relative group">
                            <button
                                disabled
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                            >
                                <GitBranch className="w-4 h-4 text-gray-400" />
                                Condition
                            </button>
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 w-[200px] leading-relaxed pointer-events-none">
                                Switch to tree view to add nested steps
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => { onSelect("condition"); onClose(); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <GitBranch className="w-4 h-4 text-gray-600" />
                            Condition
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

// List Item Component
const ListItem = ({ step, index, isSelected, onSelect, onDelete, onUpdateDelay, onSwitchToTree }) => {
    const getStepLabel = (type, subAction) => {
        switch (type) {
            case "email": return "Send an Email";
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

    return (
        <div>
            {/* Main Step Card */}
            <div
                className={`flex items-center justify-between p-4 bg-white border rounded-lg cursor-pointer transition-all ${isSelected ? "border-[#3C49F7] shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                onClick={() => onSelect(step.id)}
            >
                {/* Left Side - Index, Icon, Label */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                    <div className="flex items-center gap-2">
                        <StepIcon type={step.type} subAction={step.subAction} />
                        <span className="text-sm text-gray-700">{step.label || getStepLabel(step.type, step.subAction)}</span>
                    </div>
                </div>

                {/* Right Side - Delay & Delete */}
                <div className="flex items-center gap-4">
                    {step.type !== "condition" && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Send after</span>
                            <input
                                type="number"
                                value={step.delay || 3}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onUpdateDelay(step.id, parseInt(e.target.value) || 1);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-12 px-2 py-1 border border-gray-200 rounded text-center text-gray-700"
                                min={1}
                            />
                            <span>days</span>
                        </div>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(step.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Condition/Call Branches */}
            {(step.type === "condition" || step.type === "call") && (
                <div className="ml-8 mt-2 space-y-2">
                    {/* Accepted/Yes Branch */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <div className="w-px h-4 border-l border-dashed border-gray-300" />
                            <div className="w-8 border-t border-dashed border-gray-300" />
                            <span className={`font-medium text-sm mr-2 ${step.type === "call" ? "text-green-500" : "text-green-500"}`}>
                                {step.type === "call" ? "Accepted" : "Yes"}
                            </span>
                            <div className="w-4 border-t border-dashed border-gray-300" />
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed">
                                <Plus className="w-4 h-4" />
                                Add New
                            </button>
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Use tree view to add steps to this branch
                            </div>
                        </div>
                    </div>

                    {/* Pending/No Branch */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <div className="w-px h-4 border-l border-dashed border-gray-300" />
                            <div className="w-8 border-t border-dashed border-gray-300" />
                            <span className={`font-medium text-sm mr-2 ${step.type === "call" ? "text-orange-400" : "text-red-400"}`}>
                                {step.type === "call" ? "Pending" : "No"}
                            </span>
                            <div className="w-4 border-t border-dashed border-gray-300" />
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-400 cursor-not-allowed">
                                <Plus className="w-4 h-4" />
                                Add New
                            </button>
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Use tree view to add steps to this branch
                            </div>
                        </div>
                        <button
                            onClick={() => onSwitchToTree?.()}
                            className="text-sm text-[#3C49F7] hover:underline"
                        >
                            Switch to tree view
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main List View Component
export const ListView = ({ steps, selectedStepId, onSelectStep, onAddStep, onDeleteStep, onUpdateDelay, onSwitchToTree }) => {
    const [showAddDropdown, setShowAddDropdown] = useState(false);

    // Check if any step is a call or condition (these require tree view for nesting)
    const hasCallOrCondition = steps.some(s => s.type === "condition" || s.type === "call");

    return (
        <div className="space-y-3">
            {/* Add New Button - Always show at top */}
            <div className="relative inline-block">
                <button
                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 bg-white"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>

                {showAddDropdown && (
                    <AddNewDropdown
                        onSelect={(type, subAction) => {
                            onAddStep(type, subAction, "end");
                            setShowAddDropdown(false);
                        }}
                        onClose={() => setShowAddDropdown(false)}
                        hasCallOrCondition={hasCallOrCondition}
                        onSwitchToTree={onSwitchToTree}
                    />
                )}
            </div>

            {/* Steps List */}
            {steps.filter(s => !s.branch).map((step, index) => (
                <ListItem
                    key={step.id}
                    step={step}
                    index={index}
                    isSelected={selectedStepId === step.id}
                    onSelect={onSelectStep}
                    onDelete={onDeleteStep}
                    onUpdateDelay={onUpdateDelay}
                    onSwitchToTree={onSwitchToTree}
                />
            ))}
        </div>
    );
};

export default ListView;