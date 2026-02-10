// components/settings/SettingsModals.jsx
import { useState, useRef } from 'react';

// Check Icon for success modals
const CheckBadgeIcon = () => (
  <svg className="w-12 h-12 text-[#3C49F7]" viewBox="0 0 48 48" fill="none">
    <path d="M24 4L28.09 8.26L34 6.27L35.18 12.14L41 14.14L38.82 20L42 25.02L36.82 28.02L36.18 34.02L30 34.27L26.09 40L24 34.77L17.91 40L14 34.27L8.82 34.02L8.18 28.02L3 25.02L6.18 20L4 14.14L9.82 12.14L11 6.27L16.91 8.26L24 4Z" fill="#E8EAFF" stroke="#3C49F7" strokeWidth="2"/>
    <path d="M17 24L22 29L31 20" stroke="#3C49F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Upload Icon
const UploadIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

// Base Modal Wrapper
export const ModalWrapper = ({ isOpen, onClose, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl w-full ${maxWidth} mx-4 shadow-xl`}>
        {children}
      </div>
    </div>
  );
};

// Add URL Modal
export const AddURLModal = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({ name: title || url, type: 'url' });
      setUrl('');
      setTitle('');
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setIsLoading(false);
    onClose();
  };

  const isDisabled = !url.trim() || isLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Add URL to knowledge</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Help Katie to learn about your company and improve AI drafts.</p>
        
        {/* Gradient Divider */}
        <div className="h-0.5 bg-gradient-to-r from-[#3C49F7] to-[#7C3AED] mb-6" />

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URI Here"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-2">Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title Name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              isDisabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add File'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add File Modal
export const AddFileModal = ({ isOpen, onClose, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) setFileName(file.name.split('.')[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) setFileName(file.name.split('.')[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !fileName.trim()) return;
    
    setIsLoading(true);
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

    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setUploadProgress(0);
      onSuccess({ name: fileName, type: 'file', size: formatFileSize(selectedFile.size) });
      setSelectedFile(null);
      setFileName('');
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName('');
    setIsLoading(false);
    setUploadProgress(0);
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const getFileExtension = (file) => file?.name?.split('.').pop()?.toLowerCase();

  const isDisabled = !selectedFile || !fileName.trim() || isLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Add file to knowledge</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Help Katie to learn about your company and improve AI drafts.</p>
        
        {/* Gradient Divider */}
        <div className="h-0.5 bg-gradient-to-r from-[#3C49F7] to-[#7C3AED] mb-6" />

        {/* Form Fields */}
        <div className="space-y-5">
          {/* File Name Input */}
          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-2">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter File Name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? 'border-[#3C49F7] bg-blue-50' : 'border-[#3C49F7]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".csv,.pdf,.txt,.png,.jpeg,.jpg"
            />
            
            {/* Upload Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-[#3C49F7] rounded-xl flex items-center justify-center">
                <UploadIcon />
              </div>
            </div>
            
            <p className="text-gray-700 font-medium mb-2">Drag your file(s) to start uploading</p>
            
            {/* OR Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            
            {/* Browse Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 border-2 border-[#3C49F7] text-[#3C49F7] rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse File
            </button>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 relative flex items-center justify-center">
                <div className="w-10 h-12 bg-green-100 rounded flex items-end justify-start p-1">
                  <span className="text-[8px] font-bold text-green-600 bg-green-200 px-1 rounded uppercase">
                    {getFileExtension(selectedFile)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                {isLoading && uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-[#3C49F7] h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Supported Formats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Supported formats: csv, pdf, plain, png, jpeg</span>
            <span>Maximum size: 5MB</span>
          </div>

          {/* Add File Button */}
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              isDisabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
            }`}
          >
            {isLoading ? 'Uploading...' : 'Add File'}
          </button>
        </div>
      </div>
    </div>
  );
};

// URL Success Modal
export const URLSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#F2F2FF] rounded-full flex items-center justify-center">
            <CheckBadgeIcon />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">URL is added successfully.</h2>
        <p className="text-gray-500 mb-8">We have added your url.</p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#3C49F7] text-white rounded-full text-base font-semibold hover:bg-[#2a35d4] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// File Success Modal
export const FileSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#F2F2FF] rounded-full flex items-center justify-center">
            <CheckBadgeIcon />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Your file is added successfully.</h2>
        <p className="text-gray-500 mb-8">We have added your file.</p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#3C49F7] text-white rounded-full text-base font-semibold hover:bg-[#2a35d4] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Add Dropdown Menu
export const AddDropdownMenu = ({ isOpen, onClose, onAddFile, onAddURL }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[140px]">
        <button
          onClick={() => { onAddFile(); onClose(); }}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Add File
        </button>
        <button
          onClick={() => { onAddURL(); onClose(); }}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Add URL
        </button>
      </div>
    </>
  );
};

// Delete Confirmation Modal (for prompts)
export const DeletePromptModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-8 text-center">
        {/* Badge Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#F2F2FF] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#3C49F7]" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L28.09 8.26L34 6.27L35.18 12.14L41 14.14L38.82 20L42 25.02L36.82 28.02L36.18 34.02L30 34.27L26.09 40L24 34.77L17.91 40L14 34.27L8.82 34.02L8.18 28.02L3 25.02L6.18 20L4 14.14L9.82 12.14L11 6.27L16.91 8.26L24 4Z" fill="#E8EAFF" stroke="#3C49F7" strokeWidth="2"/>
              <path d="M17 24L22 29L31 20" stroke="#3C49F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Are you sure?</h2>
        <p className="text-gray-500 mb-8">Your prompt will get deleted permanently if you proceed.<br/>Are you sure</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-8 py-3 border-2 border-[#3C49F7] text-[#3C49F7] rounded-full text-base font-semibold hover:bg-blue-50 transition-colors"
          >
            Yes, Delete Prompt
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#3C49F7] text-white rounded-full text-base font-semibold hover:bg-[#2a35d4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Prompt Modal (reusable for all prompt types)
export const CreatePromptModal = ({ isOpen, onClose, onContinue, promptType }) => {
  const [fileName, setFileName] = useState('');

  const getTitle = () => {
    switch (promptType) {
      case 'email': return 'Create a e-mail prompt';
      case 'call': return 'Create a call prompt';
      case 'linkedin': return 'Create a LinkedIn prompt';
      case 'social': return 'Create a Social Media prompt';
      default: return 'Create a prompt';
    }
  };

  const handleClose = () => {
    setFileName('');
    onClose();
  };

  const handleContinue = () => {
    if (fileName.trim()) {
      onContinue(fileName);
      setFileName('');
    }
  };

  const isDisabled = !fileName.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-[#1a1a1a]">{getTitle()}</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Fill details for new project</p>
        
        {/* Gradient Divider */}
        <div className="h-0.5 bg-gradient-to-r from-[#3C49F7] to-[#7C3AED] mb-6" />

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-2">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter name here"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={isDisabled}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              isDisabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
            }`}
          >
            Conitnue writing the prompt
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Prompt Dropdown Menu
export const AddPromptDropdownMenu = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const promptTypes = [
    { key: 'email', label: 'Add Email Prompt' },
    { key: 'call', label: 'Add Call Prompt' },
    { key: 'linkedin', label: 'Add LinkedIn Prompt' },
    { key: 'social', label: 'Add Social Media Prompts' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[220px]">
        {promptTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => { onSelectType(type.key); onClose(); }}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {type.label}
          </button>
        ))}
      </div>
    </>
  );
};

// Add these modals to your existing SettingsModals.jsx file

// Test Call Modal
export const TestCallModal = ({ isOpen, onClose, onStartCall, phoneNumbers = [] }) => {
  const [callFrom, setCallFrom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showCallFromTooltip, setShowCallFromTooltip] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);

  const handleClose = () => {
    setCallFrom('');
    setPhoneNumber('');
    setEmail('');
    onClose();
  };

  const handleStartCall = () => {
    if (callFrom && phoneNumber) {
      onStartCall({ callFrom, phoneNumber, email });
    }
  };

  const isDisabled = !callFrom || !phoneNumber;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Test Call</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">Set dynamic values to test the call accurately</p>

        <div className="space-y-4">
          {/* Call From */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] mb-2">
              Call From
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCallFromTooltip(true)}
                  onMouseLeave={() => setShowCallFromTooltip(false)}
                  className="text-[#3C49F7]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                {showCallFromTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                    You must select a phone number to call from.
                  </div>
                )}
              </div>
            </label>
            <select
              value={callFrom}
              onChange={(e) => setCallFrom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3C49F7] transition-colors bg-white"
            >
              <option value="">-- Select a phone number --</option>
              {phoneNumbers.map((num, idx) => (
                <option key={idx} value={num}>{num}</option>
              ))}
              <option value="+44-12312-1231-123">+44-12312-1231-123</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] mb-2">
              Email
              <div className="relative">
                <button
                  onMouseEnter={() => setShowEmailTooltip(true)}
                  onMouseLeave={() => setShowEmailTooltip(false)}
                  className="text-[#3C49F7]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                {showEmailTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-48 z-10">
                    Email is optional. If provided, we will try to enrich the prospect with the email address.
                  </div>
                )}
              </div>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
            />
          </div>

          <button
            onClick={handleStartCall}
            disabled={isDisabled}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              isDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
            }`}
          >
            Start Phone Call
          </button>
        </div>
      </div>
    </div>
  );
};

// Test Call Success Modal
export const TestCallSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#3C49F7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.2"/>
              <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">AI Agent has initiated the test call.</h2>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#3C49F7] text-white rounded-full text-sm font-semibold hover:bg-[#2a35d4] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Save Prompt Modal
export const SavePromptModal = ({ isOpen, onClose, onSave, promptType = "Prompt" }) => {
  const [title, setTitle] = useState('');

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave(title);
      setTitle('');
    }
  };

  const isDisabled = !title.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Save your {promptType}</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Give you prompt a title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Prompt title"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isDisabled}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
          }`}
        >
          Save Prompt
        </button>
      </div>
    </div>
  );
};

// Prompt Saved Success Modal
export const PromptSavedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#3C49F7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.2"/>
              <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Your Prompt is saved!</h2>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#3C49F7] text-white rounded-full text-sm font-semibold hover:bg-[#2a35d4] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Load Prompt Modal
export const LoadPromptModal = ({ isOpen, onClose, onLoad, prompts = [] }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const handleClose = () => {
    setSelectedPrompt(null);
    onClose();
  };

  const handleLoad = () => {
    if (selectedPrompt) {
      onLoad(selectedPrompt);
      setSelectedPrompt(null);
    }
  };

  const isDisabled = !selectedPrompt;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl p-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Load a Prompt</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">Pick a Prompt</p>

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => setSelectedPrompt(prompt)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                selectedPrompt?.id === prompt.id
                  ? 'bg-[#F2F2FF] border-2 border-[#3C49F7]'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPrompt?.id === prompt.id
                  ? 'border-[#3C49F7] bg-[#3C49F7]'
                  : 'border-gray-300'
              }`}>
                {selectedPrompt?.id === prompt.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-[#1a1a1a]">{prompt.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLoad}
          disabled={isDisabled}
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#3C49F7] text-white hover:bg-[#2a35d4]'
          }`}
        >
          Load Prompt
        </button>
      </div>
    </div>
  );
};

// Loading/Fetching Prompt Modal
export const FetchingPromptModal = ({ isOpen, message = "We are fetching your prompt." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl p-8">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Wait for a few seconds,</h2>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.6s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Variables Dropdown
export const AddVariablesDropdown = ({ isOpen, onClose, onSelect, anchorPosition }) => {
  if (!isOpen) return null;

  const variables = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'job_title', label: 'Job Title' },
    { key: 'current_company', label: 'Current Company' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="absolute bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]"
        style={anchorPosition}
      >
        {variables.map((variable) => (
          <button
            key={variable.key}
            onClick={() => { onSelect(variable.key); onClose(); }}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {variable.label}
          </button>
        ))}
      </div>
    </>
  );
};