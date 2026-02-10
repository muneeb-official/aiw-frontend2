// components/workflow/WorkflowTreeView.jsx
import { useState } from "react";
import { Plus, MoreVertical, Clock, Mail, ThumbsUp, MessageSquare, Phone, Send, GitBranch, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

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

// Add New Dropdown for Tree View
const AddNewDropdown = ({ onSelect, onClose, position = "below" }) => {
    const [showLinkedInSubmenu, setShowLinkedInSubmenu] = useState(false);

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className={`absolute ${position === "above" ? "bottom-full mb-1" : "top-full mt-1"} left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-2`}>
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

                <button
                    onClick={() => { onSelect("call"); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Phone className="w-4 h-4 text-gray-600" />
                    Call
                </button>

                <div className="border-t border-gray-100 mt-1 pt-1">
                    <p className="text-xs text-gray-500 px-4 py-1">Conditions</p>
                    <button
                        onClick={() => { onSelect("condition"); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <GitBranch className="w-4 h-4 text-gray-600" />
                        Condition
                    </button>
                </div>
            </div>
        </>
    );
};

// Context Menu for Step
const StepContextMenu = ({ onEdit, onAddAbove, onAddBelow, onDelete, onClose }) => {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1">
                <button
                    onClick={() => { onEdit(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Pencil className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={() => { onAddAbove(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <ArrowUp className="w-4 h-4" />
                    Add Step Above
                </button>
                <button
                    onClick={() => { onAddBelow(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    <ArrowDown className="w-4 h-4" />
                    Add Step Below
                </button>
                <button
                    onClick={() => { onDelete(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>
        </>
    );
};

// Add New Button Component
const AddNewButton = ({ onSelect, branch = null }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSelect = (type, subAction) => {
        onSelect(type, subAction, branch);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white bg-white"
            >
                <Plus className="w-4 h-4" />
                Add New
            </button>

            {showDropdown && (
                <AddNewDropdown
                    onSelect={handleSelect}
                    onClose={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

// Tree Node Component - renders a single step
const TreeNode = ({
    step,
    isSelected,
    onSelect,
    onAddStep,
    onDeleteStep,
    onUpdateDelay,
    isLastInBranch,
    renderChildren,
    isInBranch = false
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showAddAboveDropdown, setShowAddAboveDropdown] = useState(false);
    const [showAddBelowDropdown, setShowAddBelowDropdown] = useState(false);

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

    return (
        <div className="flex flex-col items-center">
            {/* Add Above Dropdown */}
            {showAddAboveDropdown && (
                <div className="relative mb-2">
                    <AddNewDropdown
                        onSelect={(type, subAction) => {
                            onAddStep(type, subAction, "above", step.id, step.branch);
                            setShowAddAboveDropdown(false);
                        }}
                        onClose={() => setShowAddAboveDropdown(false)}
                        position="below"
                    />
                </div>
            )}

            {/* Step Card */}
            <div
                className={`relative flex items-center gap-2 px-4 py-2 bg-white border rounded-lg cursor-pointer transition-all ${isSelected ? "border-[#3C49F7] shadow-md" : "border-gray-200 hover:border-gray-300"
                    }`}
                onClick={() => onSelect(step.id)}
            >
                <StepIcon type={step.type} subAction={step.subAction} />
                <span className="text-sm text-gray-700">{step.label || getStepLabel(step.type, step.subAction)}</span>

                <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className="p-1 hover:bg-gray-100 rounded ml-1"
                >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>

                {showMenu && (
                    <StepContextMenu
                        onEdit={() => onSelect(step.id)}
                        onAddAbove={() => setShowAddAboveDropdown(true)}
                        onAddBelow={() => setShowAddBelowDropdown(true)}
                        onDelete={() => onDeleteStep(step.id)}
                        onClose={() => setShowMenu(false)}
                    />
                )}
            </div>

            {/* Add Below Dropdown (for non-condition steps) */}
            {showAddBelowDropdown && step.type !== "condition" && (
                <div className="relative mt-2">
                    <AddNewDropdown
                        onSelect={(type, subAction) => {
                            onAddStep(type, subAction, "below", step.id, step.branch);
                            setShowAddBelowDropdown(false);
                        }}
                        onClose={() => setShowAddBelowDropdown(false)}
                    />
                </div>
            )}

            {/* Delay connector - show for non-condition steps (both in main flow and branches) */}
            {step.type !== "condition" && (
                <>
                    <div className="w-px h-3 border-l border-dashed border-gray-300" />
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="number"
                            value={step.delay || 3}
                            onChange={(e) => onUpdateDelay(step.id, parseInt(e.target.value) || 1)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 text-center text-sm text-gray-700 border-none outline-none bg-transparent"
                            min={1}
                        />
                        <span className="text-sm text-gray-500">days</span>
                    </div>
                    <div className="w-px h-3 border-l border-dashed border-gray-300" />
                </>
            )}

            {/* Condition Branches */}
            {step.type === "condition" && (
                <div className="flex flex-col items-center mt-1">
                    {/* Vertical line down from condition */}
                    <div className="w-px h-6 border-l border-dashed border-gray-300" />

                    {/* Branch container */}
                    <div className="relative">
                        {/* Horizontal line connecting branches */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-px border-t border-dashed border-gray-300" />

                        {/* Branch lines going down */}
                        <div className="flex gap-[200px]">
                            {/* No Branch */}
                            <div className="flex flex-col items-center">
                                <div className="w-px h-8 border-l border-dashed border-gray-300" />
                                <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mb-2">
                                    <span className="text-red-500 text-sm font-medium">No</span>
                                </div>
                                <div className="w-px h-4 border-l border-dashed border-gray-300" />
                                {renderChildren && renderChildren("no", step.id)}
                                <AddNewButton
                                    onSelect={(type, subAction) => onAddStep(type, subAction, "end", step.id, "no")}
                                    branch="no"
                                />
                            </div>

                            {/* Yes Branch */}
                            <div className="flex flex-col items-center">
                                <div className="w-px h-8 border-l border-dashed border-gray-300" />
                                <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-2">
                                    <span className="text-green-500 text-sm font-medium">Yes</span>
                                </div>
                                <div className="w-px h-4 border-l border-dashed border-gray-300" />
                                {renderChildren && renderChildren("yes", step.id)}
                                <AddNewButton
                                    onSelect={(type, subAction) => onAddStep(type, subAction, "end", step.id, "yes")}
                                    branch="yes"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Show delay after condition's parent flow continues (if there are more steps after condition) */}
            {step.type === "condition" && !isLastInBranch && (
                <>
                    <div className="w-px h-3 border-l border-dashed border-gray-300 mt-4" />
                </>
            )}
        </div>
    );
};

// Main Tree View Component
export const TreeView = ({
    steps,
    selectedStepId,
    onSelectStep,
    onAddStep,
    onDeleteStep,
    onUpdateDelay
}) => {
    // Get main flow steps (not in any branch)
    const mainSteps = steps.filter(s => !s.branch && !s.parentId);

    // Get steps for a specific branch
    const getBranchSteps = (branch, parentId) => {
        return steps.filter(s => s.branch === branch && s.parentId === parentId);
    };

    // Render steps recursively
    const renderSteps = (stepsToRender, isInBranch = false) => {
        return stepsToRender.map((step, index) => {
            const isLast = index === stepsToRender.length - 1;

            return (
                <TreeNode
                    key={step.id}
                    step={step}
                    isSelected={selectedStepId === step.id}
                    onSelect={onSelectStep}
                    onAddStep={onAddStep}
                    onDeleteStep={onDeleteStep}
                    onUpdateDelay={onUpdateDelay}
                    isLastInBranch={isLast}
                    isInBranch={isInBranch}
                    renderChildren={(branch, parentId) => {
                        const branchSteps = getBranchSteps(branch, parentId);
                        if (branchSteps.length === 0) return null;
                        return (
                            <div className="flex flex-col items-center">
                                {renderSteps(branchSteps, true)}
                            </div>
                        );
                    }}
                />
            );
        });
    };

    // Empty state - show centered Add New button
    if (mainSteps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20">
                <AddNewButton
                    onSelect={(type, subAction) => onAddStep(type, subAction, "end", null, null)}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-8">
            {renderSteps(mainSteps)}

            {/* Add New button at the end of main flow (only if last step is not a condition) */}
            {mainSteps.length > 0 && mainSteps[mainSteps.length - 1].type !== "condition" && (
                <AddNewButton
                    onSelect={(type, subAction) => onAddStep(type, subAction, "end", null, null)}
                />
            )}
        </div>
    );
};

export default TreeView;