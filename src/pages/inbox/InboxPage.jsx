import React, { useState } from 'react';
import { Search, MoreVertical, ChevronLeft, ChevronRight, Paperclip, PenLine, Link2, X, Check } from 'lucide-react';

// Tag configurations with exact colors from design
const tagConfig = {
  'Out of Office': { bg: 'bg-[#FFF4E5]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]' },
  'Fresh Grass': { bg: 'bg-transparent', text: 'text-[#22C55E]', border: '' },
  'Cold Lead': { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]', border: '' },
  'Client': { bg: 'bg-transparent', text: 'text-[#F97316]', border: '' },
  'Touch Point': { bg: 'bg-[#E0F2FE]', text: 'text-[#0EA5E9]', border: '' },
  'Not a Fit': { bg: 'bg-[#1F2937]', text: 'text-white', border: '' },
  'Misc': { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', border: '' },
  'Warm Lead': { bg: 'bg-transparent', text: 'text-[#F97316]', border: '' },
  'Potential': { bg: 'bg-[#3C49F7]', text: 'text-white', border: '' },
};

// Sample messages data
const sampleMessages = [
  { id: 1, name: 'Jhon Doe', count: 2, tag: 'Fresh Grass', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 2, name: 'Dana Osborn', count: 2, tag: 'Touch Point', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 3, name: 'Agnes Pratt', count: 2, tag: 'Client', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 4, name: 'Clint Estrada', count: 2, tag: 'Not a Fit', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 5, name: 'Marcelo Dix', count: 2, tag: 'Touch Point', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 6, name: 'Cameron Alvarez', count: 2, tag: 'Out of Office', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
  { id: 7, name: 'Mary Spears', count: 2, tag: 'Fresh Grass', preview: 'Hi There!, We are really interested in getting th...', time: '12:20 PM', subject: 'Meeting Scheduled', fullPreview: 'Hi There!, We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.' },
];

const allTags = ['Out of Office', 'Fresh Grass', 'Cold Lead', 'Client', 'Touch Point', 'Not a Fit', 'Misc', 'Warm Lead'];

// Tag Badge Component
const TagBadge = ({ tag, size = 'normal' }) => {
  const config = tagConfig[tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  return (
    <span className={`${config.bg} ${config.text} ${sizeClasses} rounded-full font-medium whitespace-nowrap`}>
      {tag}
    </span>
  );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-8 mx-4 text-center">
        <div className="w-16 h-16 bg-[#F0F1FF] rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 bg-[#F0F1FF] rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-[#3C49F7]" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Successfully added.</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <button onClick={onClose} className="px-8 py-2.5 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]">
          Close
        </button>
      </div>
    </div>
  );
};

// Add Tags Modal
const AddTagsModal = ({ isOpen, onClose, onAddTag }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  if (!isOpen) return null;

  const handleAddTag = () => {
    if (selectedTag) {
      onAddTag(selectedTag);
      setSelectedTag(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-6 mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">Add Tags</h2>
        <p className="text-sm text-gray-500 mb-4">Pick a Tag</p>
        <div className="border-t border-gray-100 pt-4">
          <div className="space-y-1">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 ${selectedTag === tag ? 'bg-gray-50' : ''}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTag === tag ? 'border-[#3C49F7]' : 'border-gray-300'}`}>
                  {selectedTag === tag && <div className="w-2.5 h-2.5 rounded-full bg-[#3C49F7]" />}
                </div>
                <span className="text-sm text-gray-700">{tag}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button className="text-[#3C49F7] text-sm font-medium hover:underline">Create Tag</button>
            <button
              onClick={handleAddTag}
              disabled={!selectedTag}
              className={`px-6 py-2 rounded-full text-sm font-medium ${selectedTag ? 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Modal
const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-8 mx-4 text-center">
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Please wait for a moment.</h2>
        <p className="text-gray-500 mb-6">We are writing your response.</p>
        <div className="flex justify-center gap-2">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-gray-800' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Action Menu
const ActionMenu = ({ onClose, onAddTags, onDelete, onMarkUnread }) => (
  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[160px]">
    <button onClick={() => { onAddTags(); onClose(); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Add Tags</button>
    <button onClick={() => { onDelete(); onClose(); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Delete Emails</button>
    <button onClick={() => { onMarkUnread(); onClose(); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Mark As Unread</button>
  </div>
);

// Message List Item (Compact - for main list)
const MessageListItem = ({ message, isSelected, onClick, showFullWidth = false }) => {
  const config = tagConfig[message.tag] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  
  if (showFullWidth) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center py-3 px-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${isSelected ? 'bg-[#FFF9E5]' : ''}`}
      >
        <span className="font-medium text-gray-900 w-32 truncate">{message.name}</span>
        <span className="text-gray-500 text-sm mx-2">{message.count}</span>
        <TagBadge tag={message.tag} size="small" />
        <span className="text-gray-500 text-sm ml-4 flex-1 truncate">{message.fullPreview}</span>
        <span className="text-gray-500 text-sm ml-4 whitespace-nowrap">{message.time}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-l-4 ${isSelected ? 'border-[#F59E0B] bg-white' : 'border-transparent hover:bg-gray-50'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-gray-900">{message.name}</span>
        <span className="text-gray-400 text-sm">{message.count}</span>
        <TagBadge tag={message.tag} size="small" />
      </div>
      <p className="text-gray-500 text-sm truncate">{message.preview}</p>
      <span className="text-gray-400 text-xs">{message.time}</span>
    </div>
  );
};

// Email Detail View
const EmailDetailView = ({ message, onBack }) => {
  const [response, setResponse] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
            <TagBadge tag="Potential" />
          </div>
          <p className="text-gray-500 text-sm mt-1">From: test@email.com</p>
          <p className="text-gray-400 text-xs">1 hour ago</p>
        </div>
        <div className="flex items-center gap-2 relative">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Forward
          </button>
          <button onClick={() => setShowActionMenu(!showActionMenu)} className="p-2 text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
          {showActionMenu && <ActionMenu onClose={() => setShowActionMenu(false)} onAddTags={() => {}} onDelete={() => {}} onMarkUnread={() => {}} />}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">Hi,</p>
          <p className="text-gray-700 mb-4">
            I'd like to schedule a quick discussion to take things forward. Please share your availability and a suitable time.
          </p>
          <p className="text-gray-700 mb-4">Looking forward to connecting.</p>
          <p className="text-gray-700">Best,<br />Raymond</p>
        </div>

        {/* Reply Thread */}
        <div className="bg-[#FAFBFC] rounded-xl p-4 mb-4">
          <div className="text-sm text-gray-500 mb-2">
            <p>From: test@email.com</p>
            <p>cc: partner@email.com</p>
            <p>Bcc: admin@email.com</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 mb-4">Hi,</p>
            <p className="text-gray-700 mb-4">
              I'd like to schedule a quick discussion to take things forward. Please share your availability and a suitable time.
            </p>
            <p className="text-gray-700 mb-4">Looking forward to connecting.</p>
            <p className="text-gray-700">Best,<br />Raymond</p>
          </div>
        </div>
      </div>

      {/* Response Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="border border-gray-200 rounded-xl p-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response here."
            className="w-full resize-none text-sm text-gray-700 focus:outline-none min-h-[60px]"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-600"><Paperclip size={18} /></button>
              <button className="text-gray-400 hover:text-gray-600"><PenLine size={18} /></button>
              <button className="text-gray-400 hover:text-gray-600"><Link2 size={18} /></button>
            </div>
            <button className="px-6 py-2 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preview Drafted Emails View
const PreviewDraftedEmails = ({ onBack, messages }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < messages.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const currentMessage = selectedEmail || null;

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Header with Back */}
      <div className="p-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="bg-white border-b border-gray-100">
        {messages.slice(0, 6).map((msg) => (
          <div
            key={msg.id}
            onClick={() => setSelectedEmail(msg)}
            className={`flex items-center py-3 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${selectedEmail?.id === msg.id ? 'bg-[#FFF9E5]' : ''}`}
          >
            <span className="font-medium text-gray-900 w-28 truncate">{msg.name}</span>
            <span className="text-gray-400 text-sm mx-2">{msg.count}</span>
            <TagBadge tag={msg.tag} size="small" />
            <span className="text-gray-500 text-sm ml-4 flex-1 truncate">{msg.fullPreview}</span>
            <span className="text-gray-400 text-sm ml-4">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Email Preview */}
      <div className="flex-1 p-6">
        {selectedEmail ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 relative">
            {/* Navigation Arrows */}
            <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={18} className="text-gray-600" />
            </button>

            {/* Email Content */}
            <div className="mb-4">
              <p className="text-gray-900 font-medium">{selectedEmail.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedEmail.subject}</h3>
                <TagBadge tag="Cold Lead" size="small" />
              </div>
            </div>

            {/* Original Email */}
            <div className="bg-[#FFF9E5] rounded-xl p-4 mb-4">
              <p className="text-gray-700 mb-2">Hi There!,</p>
              <p className="text-gray-700">
                We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.
              </p>
            </div>

            {/* Draft Response */}
            <div className="bg-[#F0F7FF] rounded-xl p-4">
              <p className="text-gray-700 mb-2">Hi,</p>
              <p className="text-gray-700 mb-2">
                I'd like to schedule a quick discussion to take things forward. Please share your availability and a suitable time.
              </p>
              <p className="text-gray-700 mb-2">Looking forward to connecting.</p>
              <p className="text-gray-700">Best,<br />Raymond</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <button className="text-[#3C49F7] font-medium text-sm hover:underline">Re Draft</button>
                <button className="text-gray-600 font-medium text-sm hover:underline">Fix Grammar</button>
              </div>
              <button className="px-6 py-2 bg-[#F97316] text-white rounded-full text-sm font-medium hover:bg-[#EA580C]">
                Send Email
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 h-full flex items-center justify-center">
            <p className="text-gray-500">No Email Selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Initial List View (Image 11 - No email selected)
const InitialListView = ({ messages, onSelectEmail, onPreviewDrafts, filters, activeFilter, setActiveFilter, selectedTags, toggleTag, searchQuery, setSearchQuery, tagCounts }) => {
  return (
    <div className="h-full bg-[#FAFBFC] flex">
      {/* Left Sidebar */}
      <div className="w-[280px] p-6 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Inbox</h1>

        {/* Filters */}
        <div className="space-y-1 mb-6">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeFilter === filter.id ? 'bg-[#E8EAFF] text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{filter.label}</span>
              {filter.count && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFilter === filter.id ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
          <div className="space-y-1">
            {allTags.map(tag => {
              const config = tagConfig[tag];
              const isSelected = selectedTags.includes(tag);
              const barColor = tag === 'Not a Fit' ? 'bg-gray-800' : 
                             tag === 'Out of Office' ? 'bg-[#F59E0B]' : 
                             tag === 'Fresh Grass' ? 'bg-[#22C55E]' :
                             tag === 'Cold Lead' ? 'bg-[#6B7280]' :
                             tag === 'Client' ? 'bg-[#F97316]' :
                             tag === 'Touch Point' ? 'bg-[#0EA5E9]' :
                             tag === 'Misc' ? 'bg-[#9CA3AF]' :
                             tag === 'Warm Lead' ? 'bg-[#F97316]' : 'bg-gray-300';
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm hover:bg-gray-50 ${isSelected ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-5 rounded-full ${barColor}`} />
                    <span className={`${config.text} font-medium text-sm`}>{tag}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{tagCounts[tag]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right - Full Width Message List */}
      <div className="flex-1 bg-white rounded-l-2xl flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">All {messages.length} Messages</span>
            <button
              onClick={onPreviewDrafts}
              className="px-5 py-2.5 bg-[#3C49F7] text-white rounded-lg text-sm font-medium hover:bg-[#2a35d4]"
            >
              Preview Drafted Emails
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search the message"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C49F7]/20 focus:border-[#3C49F7]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => onSelectEmail(msg)}
              className="flex items-center py-3.5 px-5 cursor-pointer hover:bg-gray-50 border-b border-gray-50"
            >
              <span className="font-medium text-gray-900 w-36 truncate">{msg.name}</span>
              <span className="text-gray-400 text-sm mx-3">{msg.count}</span>
              <TagBadge tag={msg.tag} size="small" />
              <span className="text-gray-500 text-sm ml-4 flex-1 truncate">{msg.fullPreview}</span>
              <span className="text-gray-400 text-sm ml-4 whitespace-nowrap">{msg.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Inbox Page
const InboxPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showAddTagsModal, setShowAddTagsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviewDrafts, setShowPreviewDrafts] = useState(false);
  const [messages, setMessages] = useState(sampleMessages);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Calculate tag counts
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = messages.filter(m => m.tag === tag).length;
    return acc;
  }, {});

  const filters = [
    { id: 'all', label: 'All', count: 12 },
    { id: 'replied', label: 'Replied', count: null },
    { id: 'analytics', label: 'Analytics', count: null },
  ];

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.includes(msg.tag);
    return matchesSearch && matchesTags;
  });

  const handleAddTag = (tag) => {
    setShowAddTagsModal(false);
    setShowSuccessModal(true);
  };

  const handleSelectEmail = (msg) => {
    setSelectedMessage(msg);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setViewMode('list');
  };

  // Preview Drafted Emails View
  if (showPreviewDrafts) {
    return <PreviewDraftedEmails onBack={() => setShowPreviewDrafts(false)} messages={messages} />;
  }

  // Initial List View (Image 11)
  if (viewMode === 'list') {
    return (
      <>
        <InitialListView
          messages={filteredMessages}
          onSelectEmail={handleSelectEmail}
          onPreviewDrafts={() => setShowPreviewDrafts(true)}
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tagCounts={tagCounts}
        />
        <AddTagsModal isOpen={showAddTagsModal} onClose={() => setShowAddTagsModal(false)} onAddTag={handleAddTag} />
        <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} message="We have successfully add the tag to the email" />
      </>
    );
  }

  // Detail View (Three Column Layout - when email selected)
  return (
    <div className="h-full bg-[#FAFBFC] overflow-hidden">
      <div className="h-full flex">
        {/* Left Sidebar */}
        <div className="w-[220px] p-6 flex-shrink-0">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Inbox</h1>

          {/* Filters */}
          <div className="space-y-1 mb-6">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  activeFilter === filter.id ? 'bg-[#E8EAFF] text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{filter.label}</span>
                {filter.count && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === filter.id ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
            <div className="space-y-1">
              {allTags.map(tag => {
                const config = tagConfig[tag];
                const isSelected = selectedTags.includes(tag);
                const barColor = tag === 'Not a Fit' ? 'bg-gray-800' : 
                               tag === 'Out of Office' ? 'bg-[#F59E0B]' : 
                               tag === 'Fresh Grass' ? 'bg-[#22C55E]' :
                               tag === 'Cold Lead' ? 'bg-[#6B7280]' :
                               tag === 'Client' ? 'bg-[#F97316]' :
                               tag === 'Touch Point' ? 'bg-[#0EA5E9]' :
                               tag === 'Misc' ? 'bg-[#9CA3AF]' :
                               tag === 'Warm Lead' ? 'bg-[#F97316]' : 'bg-gray-300';
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm hover:bg-gray-50 ${isSelected ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-5 rounded-full ${barColor}`} />
                      <span className={`${config.text} font-medium text-sm`}>{tag}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{tagCounts[tag]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle - Message List */}
        <div className="w-[280px] bg-white flex flex-col border-x border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">All {filteredMessages.length} Messages</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search the message"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C49F7]/20 focus:border-[#3C49F7]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map(msg => (
              <MessageListItem
                key={msg.id}
                message={msg}
                isSelected={selectedMessage?.id === msg.id}
                onClick={() => setSelectedMessage(msg)}
              />
            ))}
          </div>
        </div>

        {/* Right - Email Detail */}
        <div className="flex-1 p-4">
          <EmailDetailView message={selectedMessage} onBack={handleBackToList} />
        </div>
      </div>

      {/* Modals */}
      <AddTagsModal
        isOpen={showAddTagsModal}
        onClose={() => setShowAddTagsModal(false)}
        onAddTag={handleAddTag}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="We have successfully add the tag to the email"
      />
    </div>
  );
};

export default InboxPage;