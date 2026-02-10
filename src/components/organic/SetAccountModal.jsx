// components/organic/SetAccountModal.jsx
import { useState, useEffect } from "react";

const ACCOUNT_TYPES = [
    { value: "", label: "- Select -" },
    { value: "free", label: "Free" },
    { value: "premium_career", label: "Premium Career" },
    { value: "premium_business", label: "Premium Business" },
    { value: "sales_navigator_core", label: "Sales Navigator Core" },
    { value: "sales_navigator_advance", label: "Sales Navigator Advance" },
    { value: "recruiter_lite", label: "Recruiter Lite" },
    { value: "recruiter", label: "Recruiter" },
    { value: "recruiter_professional", label: "Recruiter Professional Services" },
];

const SetAccountModal = ({ isOpen, onClose, onSave, isEditMode, existingData }) => {
    const [accountType, setAccountType] = useState("");
    const [connections, setConnections] = useState(0);

    useEffect(() => {
        if (isEditMode && existingData) {
            setAccountType(existingData.accountType || "");
            setConnections(existingData.connections || 0);
        } else {
            setAccountType("");
            setConnections(0);
        }
    }, [isEditMode, existingData, isOpen]);

    const handleSave = () => {
        if (!accountType) return;
        onSave({
            accountType,
            connections,
            name: "Thomas Burke", // Would come from OAuth
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            connectionsSent: 123,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl w-full max-w-[500px] p-8 mx-4 shadow-xl">
                <h2 className="text-[28px] font-semibold text-[#1a1a1a] mb-2 font-['DM_Sans']">
                    Set your account
                </h2>
                <p className="text-sm text-[#6B7280] mb-8 font-['DM_Sans']">
                    We need you to set some parameters to have a seamless experience.
                </p>

                {/* Account Type Dropdown */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2 font-['DM_Sans']">
                        What type is Linked-in Account <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white text-sm font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"
                        >
                            {ACCOUNT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Connections Slider */}
                <div className="mb-10">
                    <label className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-4 font-['DM_Sans']">
                        How many connections would like to reserve? <span className="text-red-500">*</span>
                        <svg className="w-4 h-4 text-[#6C63FF] cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </label>
                    
                    <div className="relative pt-2">
                        <input
                            type="range"
                            min="0"
                            max="15"
                            value={connections}
                            onChange={(e) => setConnections(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none 
                                [&::-webkit-slider-thumb]:w-5 
                                [&::-webkit-slider-thumb]:h-5 
                                [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:bg-[#6C63FF] 
                                [&::-webkit-slider-thumb]:border-3 
                                [&::-webkit-slider-thumb]:border-white 
                                [&::-webkit-slider-thumb]:shadow-md
                                [&::-webkit-slider-thumb]:cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #6C63FF 0%, #6C63FF ${(connections / 15) * 100}%, #E5E7EB ${(connections / 15) * 100}%, #E5E7EB 100%)`
                            }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-[#6B7280] font-['DM_Sans']">
                            <span>0</span>
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!accountType}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-colors font-['DM_Sans'] ${
                            accountType
                                ? "bg-[#6C63FF] text-white hover:bg-[#5a52e0]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Save & Close
                    </button>
                    
                    {!accountType && (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors font-['DM_Sans']"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetAccountModal;