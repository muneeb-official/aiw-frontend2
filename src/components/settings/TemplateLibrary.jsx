import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MessageSquare, Share2 } from 'lucide-react';
import CreateTemplateModal from './CreateTemplateModal';

const TemplateLibrary = ({ onEditTemplate }) => {
    const [activeTab, setActiveTab] = useState('email');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalType, setCreateModalType] = useState('');
    const [templateName, setTemplateName] = useState('');

    // Mock templates data
    const [templates, setTemplates] = useState({
        email: [
            { id: 1, name: 'introduction', createdAt: '13 mins ago' },
            { id: 2, name: 'Situation Task 1', createdAt: '3 hours ago' },
            { id: 3, name: 'Situation Task 2', createdAt: 'Yesterday' },
            { id: 4, name: 'Situation Task 3', createdAt: '4 days ago' },
            { id: 5, name: 'Situation Task 4', createdAt: '1 week ago' }
        ],
        call: [
            { id: 1, name: 'Sales Call Script', createdAt: '2 days ago' },
            { id: 2, name: 'Follow-up Call', createdAt: '1 week ago' }
        ],
        linkedin: [
            { id: 1, name: 'Connection Request', createdAt: '5 days ago' },
            { id: 2, name: 'Introduction Message', createdAt: '2 weeks ago' }
        ],
        social: [
            { id: 1, name: 'Twitter Post', createdAt: '3 days ago' },
            { id: 2, name: 'Facebook Update', createdAt: '1 week ago' }
        ]
    });

    const tabs = [
        { id: 'email', label: 'Email Templates', icon: Mail },
        { id: 'call', label: 'Call Templates', icon: Phone },
        { id: 'linkedin', label: 'LinkedIn Message Templates', icon: MessageSquare },
        { id: 'social', label: 'General Social Media Templates', icon: Share2 }
    ];

    const handleAddTemplate = (type) => {
        setCreateModalType(type);
        setShowAddDropdown(false);
        setShowCreateModal(true);
    };

    const handleContinueEditing = (name) => {
        setTemplateName(name);
        setShowCreateModal(false);
        // Open content editor with template type and name
        onEditTemplate?.(createModalType, name, true);
    };

    const handleEditTemplate = (template) => {
        // Open content editor with existing template
        onEditTemplate?.(activeTab, template.name, false, template);
    };

    const handleDeleteTemplate = (templateId) => {
        setTemplates(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(t => t.id !== templateId)
        }));
    };

    const filteredTemplates = templates[activeTab]?.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="flex h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Template Library</h1>
                        <p className="text-gray-600">Here you can keep track of all your templates that you have created.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                                        activeTab === tab.id
                                            ? 'text-indigo-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search and Add */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter here..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowAddDropdown(!showAddDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>

                            {showAddDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowAddDropdown(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                        <button
                                            onClick={() => handleAddTemplate('email')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Add Email Template
                                        </button>
                                        <button
                                            onClick={() => handleAddTemplate('call')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Add Call Template
                                        </button>
                                        <button
                                            onClick={() => handleAddTemplate('linkedin')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Add LinkedIn Template
                                        </button>
                                        <button
                                            onClick={() => handleAddTemplate('social')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Add Social Media Template
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Templates List */}
                    <div className="space-y-3">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-500">{template.createdAt}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditTemplate(template)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit in editor
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>No templates found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Template Modal */}
            <CreateTemplateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onContinue={handleContinueEditing}
                templateType={createModalType}
            />
        </div>
    );
};

export default TemplateLibrary;