import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

const TemplateContentEditor = ({ onBack, templateType, templateName, isNew, templateData }) => {
    const [content, setContent] = useState(templateData?.content || '');
    const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);

    const variables = [
        { id: 'first_name', label: 'First Name' },
        { id: 'last_name', label: 'Last Name' },
        { id: 'full_name', label: 'Full Name' },
        { id: 'job_title', label: 'Job Title' },
        { id: 'current_company', label: 'Current Company' },
    ];

    const handleInsertVariable = (variable) => {
        const textarea = document.getElementById('content-editor');
        const cursorPos = textarea.selectionStart;
        const textBefore = content.substring(0, cursorPos);
        const textAfter = content.substring(cursorPos);
        const newContent = textBefore + `{{${variable.id}}}` + textAfter;
        setContent(newContent);
        setShowVariablesDropdown(false);
    };

    const handleSave = () => {
        console.log('Saving template:', { templateType, templateName, content });
        // Show success message and go back
        alert('Template saved successfully!');
        onBack();
    };

    // Render content with variable tags highlighted
    const renderContentWithTags = (text) => {
        if (!text) return null;
        const parts = text.split(/(\{\{[^}]+\}\})/g);
        return parts.map((part, index) => {
            const match = part.match(/\{\{([^}]+)\}\}/);
            if (match) {
                return (
                    <span
                        key={index}
                        className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm font-medium mx-0.5"
                    >
                        {match[1]}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 mb-4"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Content Editor</h1>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Title:</span> {templateName}
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Save Template
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
                    {/* Editor */}
                    <div className="p-6">
                        <textarea
                            id="content-editor"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing your prompt here..."
                            className="w-full h-[500px] text-sm text-gray-700 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />

                        {/* Preview */}
                        {content && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-2 font-medium">Preview:</p>
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {renderContentWithTags(content)}
                                </div>
                            </div>
                        )}

                        {/* Add Variables Button */}
                        <div className="mt-6 relative">
                            <button
                                onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add Variables
                            </button>

                            {showVariablesDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowVariablesDropdown(false)}
                                    />
                                    <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px] py-1">
                                        {variables.map((variable) => (
                                            <button
                                                key={variable.id}
                                                onClick={() => handleInsertVariable(variable)}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                                            >
                                                {variable.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateContentEditor;