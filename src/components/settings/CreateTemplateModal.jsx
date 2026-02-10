import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateTemplateModal = ({ isOpen, onClose, onContinue, templateType }) => {
    const [templateName, setTemplateName] = useState('');

    if (!isOpen) return null;

    const getTitle = () => {
        switch (templateType) {
            case 'email': return 'Create a E-mail template';
            case 'call': return 'Create a Call template';
            case 'linkedin': return 'Create a LinkedIn template';
            case 'social': return 'Create a Social Media template';
            default: return 'Create a template';
        }
    };

    const handleContinue = () => {
        if (templateName.trim()) {
            onContinue(templateName);
            setTemplateName('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{getTitle()}</h3>
                        <p className="text-sm text-gray-600 mt-1">Fill details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name
                    </label>
                    <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter name here"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!templateName.trim()}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                        templateName.trim()
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Continuous Editing the Template
                </button>
            </div>
        </div>
    );
};

export default CreateTemplateModal;