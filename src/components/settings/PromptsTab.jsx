// components/settings/PromptsTab.jsx
import { useState, useRef } from 'react';
import { CreatePromptModal, DeletePromptModal, AddPromptDropdownMenu } from './SettingsModals';

// Icons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Mock data for prompts
const initialPrompts = {
  email: [
    { id: 1, name: 'introduction', time: '13 mins ago' },
    { id: 2, name: 'Situation Task 1', time: '3 hours ago' },
    { id: 3, name: 'Situation Task 2', time: 'Yesterday' },
    { id: 4, name: 'Situation Task 3', time: '4 days ago' },
    { id: 5, name: 'Situation Task 4', time: '1 Week ago' },
  ],
  call: [
    { id: 1, name: 'Cold Call Script', time: '2 days ago' },
    { id: 2, name: 'Follow Up Call', time: '1 week ago' },
  ],
  linkedin: [
    { id: 1, name: 'Connection Request', time: '5 hours ago' },
    { id: 2, name: 'InMail Template', time: '3 days ago' },
  ],
  social: [
    { id: 1, name: 'Twitter Engagement', time: '1 day ago' },
    { id: 2, name: 'Facebook Post', time: '4 days ago' },
  ],
};

const PromptsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('email');
  const [prompts, setPrompts] = useState(initialPrompts);
  
  // Modal states
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPromptType, setSelectedPromptType] = useState(null);
  const [promptToDelete, setPromptToDelete] = useState(null);
  
  const addButtonRef = useRef(null);

  const subTabs = [
    { key: 'email', label: 'Email Prompts' },
    { key: 'call', label: 'Call Prompts' },
    { key: 'linkedin', label: 'LinkedIn Prompts' },
    { key: 'social', label: 'General Social Media Prompts' },
  ];

  const handleSelectPromptType = (type) => {
    setSelectedPromptType(type);
    setShowCreateModal(true);
  };

  const handleCreatePrompt = (name) => {
    const newPrompt = {
      id: Date.now(),
      name: name,
      time: 'Just now',
    };
    
    // Add to the appropriate category based on selectedPromptType
    const category = selectedPromptType;
    setPrompts(prev => ({
      ...prev,
      [category]: [newPrompt, ...prev[category]],
    }));
    
    setShowCreateModal(false);
    setSelectedPromptType(null);
    
    // Switch to the tab where the prompt was added
    setActiveSubTab(category);
  };

  const handleDeleteClick = (prompt) => {
    setPromptToDelete(prompt);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (promptToDelete) {
      setPrompts(prev => ({
        ...prev,
        [activeSubTab]: prev[activeSubTab].filter(p => p.id !== promptToDelete.id),
      }));
    }
    setShowDeleteModal(false);
    setPromptToDelete(null);
  };

  const handleEditPrompt = (prompt) => {
    // Navigate to editor or open editor modal
    console.log('Edit prompt:', prompt);
  };

  const currentPrompts = prompts[activeSubTab] || [];

  return (
    <div>
      {/* Sub Tabs */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          {subTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeSubTab === tab.key
                  ? 'text-[#3C49F7]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeSubTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3C49F7]" />
              )}
            </button>
          ))}
        </div>
        
        {/* Add Button */}
        <div className="relative" ref={addButtonRef}>
          <button
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <PlusIcon />
            Add
          </button>
          <AddPromptDropdownMenu
            isOpen={showAddDropdown}
            onClose={() => setShowAddDropdown(false)}
            onSelectType={handleSelectPromptType}
          />
        </div>
      </div>

      {/* Prompts List */}
      <div className="space-y-0">
        {currentPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <h3 className="text-base font-semibold text-[#1a1a1a]">{prompt.name}</h3>
              <p className="text-sm text-gray-500">{prompt.time}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleEditPrompt(prompt)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#3C49F7] transition-colors"
              >
                <EditIcon />
                <span className="text-sm">Edit in editor</span>
              </button>
              <button
                onClick={() => handleDeleteClick(prompt)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {currentPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No prompts added yet</p>
            <button
              onClick={() => setShowAddDropdown(true)}
              className="px-4 py-2 bg-[#3C49F7] text-white rounded-lg text-sm font-medium hover:bg-[#2a35d4] transition-colors"
            >
              Add your first prompt
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePromptModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setSelectedPromptType(null); }}
        onContinue={handleCreatePrompt}
        promptType={selectedPromptType}
      />
      <DeletePromptModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setPromptToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PromptsTab;