// src/pages/auth/OnboardingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import { X, Upload, Trash2, Send, Check, Loader2 } from 'lucide-react';
import step1Image from '../../assets/step-1.png';
import step2Image from '../../assets/step-2.png';
import step3Image from '../../assets/step-3.png';
import thankYouImage from '../../assets/step-4.png';
import { knowledgeBaseService } from '../../services/KnowledgeBaseService';

const API_BASE_URL = 'http://localhost:8001';

// Step configuration - maps question_keys to steps
// Step configuration - maps question_keys to steps
const STEP_CONFIG = [
  { 
    id: 'pond-fish-catch', 
    title: 'Pond, Fish, Catch', 
    keys: ['pond', 'fish', 'catch'] 
  },
  { 
    id: 'elevator-pitch', 
    title: 'Elevator Pitch WWWBHR', 
    keys: ['who_are_you', 'what_you_specialize', 'who_you_work_with', 'backstory', 'how_different', 'results'] 
  },
  { 
    id: 'objections', 
    title: 'Objections', 
    keys: ['objections', 'objection_handling']
  },
  { 
    id: 'knowledge-files', 
    title: 'Knowledge Files', 
    isKnowledge: true 
  },
];

const stepImages = { 0: step1Image, 1: step2Image, 2: step3Image, 3: null };
const stepBgColors = { 0: 'bg-[#E8E4F3]', 1: 'bg-[#FDF4E7]', 2: 'bg-[#FBC847]', 3: 'bg-[#F8F9FC]' };

// Get questions for objections step
const getStepQuestionsForObjections = () => {
  const stepConfig = STEP_CONFIG[2]; // Objections step
  return questions
    .filter(q => stepConfig.keys.includes(q.question_key))
    .sort((a, b) => a.display_order - b.display_order);
};

// API Service
const api = {
  getQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/platform/questionnaire/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  getAnswers: async (organizationId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/platform/questionnaire/organizations/${organizationId}/answers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch answers');
    return response.json();
  },

  submitAnswers: async (organizationId, answers) => {
  const token = localStorage.getItem('token');
  
  console.log('Submitting answers:', {
    organizationId,
    answers,
    url: `${API_BASE_URL}/platform/questionnaire/organizations/${organizationId}/answers`
  });
  
  const response = await fetch(`${API_BASE_URL}/platform/questionnaire/organizations/${organizationId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ answers })
  });
  
  const data = await response.json();
  console.log('API Response:', response.status, data);
  
  if (!response.ok) {
    console.error('Submit failed:', data);
    throw new Error(data.detail || data.message || 'Failed to submit answers');
  }
  
  return data;
}
};

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <button className={`text-sm font-medium transition-colors ${index === currentStep ? 'text-[#4F46E5]' : index < currentStep ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
          {step.title}
        </button>
        {index < steps.length - 1 && (
          <div className="flex items-center gap-1">
            <div className={`w-12 lg:w-20 h-0.5 ${index < currentStep ? 'bg-[#4F46E5]' : 'bg-gray-200'}`} />
            <div className={`w-2 h-2 rounded-full ${index < currentStep ? 'bg-[#4F46E5]' : 'bg-gray-200'}`} />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// Form Field Component
const FormField = ({ question, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-base font-medium text-gray-900 mb-1">
      {question.question_text} {question.is_required && <span className="text-red-500">*</span>}
    </label>
    {question.helper_text && <p className="text-sm text-gray-500 mb-2">{question.helper_text}</p>}
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(question.id, e.target.value)}
      placeholder={question.placeholder || 'Enter here...'}
      className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
    />
  </div>
);

// Objection Card Component
const ObjectionCard = ({ index, questions, data, onChange, onRemove, canRemove }) => {
  // Try to find questions by question_key
  const objectionQ = questions.find(q => 
    q.question_key === 'objection' || 
    q.question_key === 'objections' ||
    q.question_key?.toLowerCase()?.includes('objection')
  );
  const handleQ = questions.find(q => 
    q.question_key === 'handle' || 
    q.question_key === 'handle_objection' ||
    q.question_key?.toLowerCase()?.includes('handle')
  );

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-sm font-medium">{index + 1}</div>
        {canRemove && (
          <button onClick={() => onRemove(index)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Objection Field - Always show with fallback */}
      <div className="mb-4">
        <label className="block text-base font-medium text-gray-900 mb-1">
          {objectionQ?.question_text || "What objections do you frequently hear?"} <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          {objectionQ?.helper_text || "(cost, timing, switching vendors, etc.)"}
        </p>
        <input 
          type="text" 
          value={data.objection || ''} 
          onChange={(e) => onChange(index, 'objection', e.target.value, objectionQ?.id)} 
          placeholder={objectionQ?.placeholder || "Enter here..."} 
          className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all" 
        />
      </div>

      {/* Handle Field - Always show with fallback */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-1">
          {handleQ?.question_text || "How do you usually handle these objections?"} <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          {handleQ?.helper_text || "Give examples of how you overcome doubts."}
        </p>
        <input 
          type="text" 
          value={data.handle || ''} 
          onChange={(e) => onChange(index, 'handle', e.target.value, handleQ?.id)} 
          placeholder={handleQ?.placeholder || "Enter here..."} 
          className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all" 
        />
      </div>
    </div>
  );
};

// Add File Modal
const AddFileModal = ({ isOpen, onClose, onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError('');

    try {
      const result = await knowledgeBaseService.uploadFile(selectedFile);
      const transformedFile = knowledgeBaseService.transformFile(result);
      onFileUploaded(transformedFile);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      setUploadError(error.message || 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setUploadError('');
      onClose();
    }
  };

  const getFileIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const colors = { csv: 'bg-green-100 text-green-600', pdf: 'bg-red-100 text-red-600', png: 'bg-blue-100 text-blue-600', jpg: 'bg-blue-100 text-blue-600', jpeg: 'bg-blue-100 text-blue-600', txt: 'bg-gray-100 text-gray-600' };
    return colors[ext] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-[#1a1a1a]">Add file to knowledge</h3>
          <button onClick={handleClose} disabled={isUploading} className="text-gray-400 hover:text-gray-600 disabled:opacity-50"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-5">Help AI learn about your company and improve drafts.</p>

        <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${dragOver ? 'border-[#4F46E5] bg-[#F8F9FC]' : 'border-gray-300'}`}>
          <div className="w-12 h-12 bg-[#E8EAFF] rounded-lg flex items-center justify-center mx-auto mb-3"><Upload className="w-6 h-6 text-[#4F46E5]" /></div>
          <p className="text-gray-700 mb-1">Drag your file(s) to start uploading</p>
          <p className="text-gray-400 text-sm mb-3">OR</p>
          <label className="px-4 py-2 border border-[#4F46E5] text-[#4F46E5] rounded-lg text-sm font-medium cursor-pointer hover:bg-[#F8F9FC] inline-block">
            Browse File<input type="file" accept=".csv,.pdf,.png,.jpg,.jpeg,.txt" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
          </label>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${getFileIcon(selectedFile)}`}>{selectedFile.name.split('.').pop().toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p><p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p></div>
            {!isUploading && <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
          </div>
        )}

        {uploadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{uploadError}</div>}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4"><span>Supported: csv, pdf, txt, png, jpeg</span><span>Max: 5MB</span></div>
        <button onClick={handleUpload} disabled={!selectedFile || isUploading} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedFile && !isUploading ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}{isUploading ? 'Uploading...' : 'Add File'}
        </button>
      </div>
    </div>
  );
};

// Add URL Modal
const AddURLModal = ({ isOpen, onClose, onUrlAdded }) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateUrl = (urlString) => {
    try {
      new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
      return true;
    } catch { return false; }
  };

  const handleSubmit = async () => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    if (!validateUrl(fullUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await knowledgeBaseService.scrapeUrl(fullUrl, { max_depth: 1, follow_links: false, max_pages: 10 });
      onUrlAdded(result);
      setUrl('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) { setUrl(''); setError(''); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-[#1a1a1a]">Add URL to knowledge</h3>
          <button onClick={handleClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:opacity-50"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-5">Add a website URL to help AI learn about your company.</p>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Website URL</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5]">
            <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">https://</span>
            <input type="text" value={url.replace(/^https?:\/\//, '')} onChange={(e) => setUrl(e.target.value)} placeholder="www.example.com" className="flex-1 px-3 py-3 text-sm text-gray-700 outline-none" disabled={isSubmitting} />
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button onClick={handleClose} disabled={isSubmitting} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!url.trim() || isSubmitting} className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 ${url.trim() && !isSubmitting ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{isSubmitting ? 'Adding...' : 'Add URL'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-[#4F46E5]" /></div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{type === 'file' ? 'File added successfully!' : 'URL added successfully!'}</h3>
        <p className="text-gray-600 mb-6">{type === 'file' ? 'Your file has been uploaded.' : 'Your URL is being scraped.'}</p>
        <button onClick={onClose} className="w-full py-3 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]">Close</button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Delete Item</h3>
          <button onClick={onClose} disabled={isDeleting} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to delete "<span className="font-medium">{itemName}</span>"?</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}{isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Knowledge Files Step Component - Main Component
const KnowledgeFilesStep = () => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showURLModal, setShowURLModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState('file');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [filesRes, urlsRes] = await Promise.allSettled([
        knowledgeBaseService.listFiles(),
        knowledgeBaseService.getScrapedContent()
      ]);

      if (filesRes.status === 'fulfilled') {
        setFiles(knowledgeBaseService.transformFiles(filesRes.value));
      }
      if (urlsRes.status === 'fulfilled') {
        setUrls(knowledgeBaseService.transformScrapedContents(urlsRes.value));
      }
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploaded = (newFile) => {
    setFiles(prev => [newFile, ...prev]);
    setSuccessType('file');
    setShowSuccessModal(true);
  };

  const handleUrlAdded = () => {
    fetchData();
    setSuccessType('url');
    setShowSuccessModal(true);
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete({ ...item, itemType: type });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      if (itemToDelete.itemType === 'file') {
        await knowledgeBaseService.deleteFile(itemToDelete.id);
        setFiles(prev => prev.filter(f => f.id !== itemToDelete.id));
      } else {
        await knowledgeBaseService.deleteScrapedContent();
        setUrls([]);
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError('Failed to delete.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectItem = (itemId, selected) => {
    setSelectedItems(prev => selected ? [...prev, itemId] : prev.filter(id => id !== itemId));
  };

  const allItems = [...files.map(f => ({ ...f, itemType: 'file' })), ...urls.map(u => ({ ...u, itemType: 'url' }))];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-500';
      case 'Failed': return 'bg-red-50 text-red-500 px-3 py-1 rounded-full';
      case 'In Progress': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div><h2 className="text-xl font-semibold text-[#1a1a1a]">Knowledge Files</h2><p className="text-gray-600">Add files and URLs to train your AI.</p></div>
        <div className="relative">
          <button onClick={() => setShowAddDropdown(!showAddDropdown)} className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">+ Add</button>
          {showAddDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAddDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                <button onClick={() => { setShowFileModal(true); setShowAddDropdown(false); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">Add File</button>
                <button onClick={() => { setShowURLModal(true); setShowAddDropdown(false); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">Add URL</button>
              </div>
            </>
          )}
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <div className="bg-[#F8F9FC] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200">
          <div className="col-span-5 flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" onChange={(e) => e.target.checked ? setSelectedItems(allItems.map(i => i.id)) : setSelectedItems([])} />
            <span className="text-sm font-medium text-gray-600">Name</span>
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600">Type</div>
          <div className="col-span-2 text-sm font-medium text-gray-600">Status</div>
          <div className="col-span-1 text-sm font-medium text-gray-600">Size</div>
          <div className="col-span-2 text-sm font-medium text-gray-600 text-right">Actions</div>
        </div>

        {isLoading && (
          <div className="px-4 py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5] mx-auto mb-2" />
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {!isLoading && allItems.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-500">
            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No files or URLs added yet. Click "+ Add" to get started.</p>
          </div>
        )}

        {!isLoading && allItems.map((item) => (
          <div key={`${item.itemType}-${item.id}`} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
            <div className="col-span-5 flex items-center gap-3">
              <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={(e) => handleSelectItem(item.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#4F46E5]" />
              <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
            </div>
            <div className="col-span-2 text-sm text-gray-600 flex items-center">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.itemType === 'file' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {item.itemType === 'file' ? 'File' : 'URL'}
              </span>
            </div>
            <div className="col-span-2"><span className={`text-sm ${getStatusStyle(item.status)}`}>{item.status}</span></div>
            <div className="col-span-1 text-sm text-gray-600">{item.size || '-'}</div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button onClick={() => handleDeleteClick(item, item.itemType)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && allItems.length > 0 && (
        <p className="text-sm text-gray-500 mt-3">{files.length} file(s) • {urls.length} URL(s)</p>
      )}

      <AddFileModal isOpen={showFileModal} onClose={() => setShowFileModal(false)} onFileUploaded={handleFileUploaded} />
      <AddURLModal isOpen={showURLModal} onClose={() => setShowURLModal(false)} onUrlAdded={handleUrlAdded} />
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} type={successType} />
      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setItemToDelete(null); }} onConfirm={handleDeleteConfirm} itemName={itemToDelete?.name} isDeleting={isDeleting} />
    </div>
  );
};

// Thank You Screen Component
const ThankYouScreen = ({ onStart }) => (
  <div className="flex min-h-[calc(100vh-73px)]">
    <div className="w-full lg:w-1/2 px-8 lg:px-16 py-12 flex flex-col justify-center">
      <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">Your dedicated Account Manager will be in touch shortly.</h1>
      <p className="text-gray-600 mb-6">We're currently warming up 2 email inboxes for your outbound agents to protect deliverability. This takes up to <span className="text-[#4F46E5] font-medium">14 days</span> and ensures emails land in inboxes — <strong>not spam.</strong></p>
      <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-6"><p className="font-medium text-gray-900 mb-2">Once complete:</p><ul className="text-gray-600 space-y-1"><li>• You can send upto 120 emails/day (combined)</li><li>• Full outbound capacity unlocked</li></ul></div>
      <p className="text-gray-900 font-medium mb-2">You may use your primary email in the meantime, limited to 10 emails/day to keep your account healthy.</p>
      <p className="text-gray-600 mb-8">We'll notify you as soon as everything is ready.</p>
      <button onClick={onStart} className="w-fit px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-full hover:bg-[#4338CA] transition-colors">Start</button>
    </div>
    <div className="hidden lg:flex w-1/2 items-center justify-center p-0">
      {/* <div className="text-center"> */}
        {/* <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Thank you for choosing AI Workforce</h2> */}
        <div className="bg-white rounded-2xl p-0 w-full mx-auto"><img src={thankYouImage} alt="Thank you" className="w-full h-auto" onError={(e) => { e.target.style.display = 'none'; }} /></div>
      </div>
    {/* </div> */}
  </div>
);

// Main Onboarding Page
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Questions from API
  const [questions, setQuestions] = useState([]);

  // Form answers - keyed by question_id
  const [answers, setAnswers] = useState({});

  // For dynamic objections step
  const [objections, setObjections] = useState([{ objection: '', handle: '', objectionId: null, handleId: null }]);

  // Knowledge files (frontend only for now)
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

// Get organization_id from user context
const getOrganizationId = () => {
  // Try from user context first (this is the proper way)
  if (user?.organization_id) return user.organization_id;
  if (user?.organization?.id) return user.organization.id;
  
  // Fallback: Try from localStorage user data
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.organization_id) return parsed.organization_id;
      if (parsed.organization?.id) return parsed.organization.id;
    } catch (e) { 
      console.error('Error parsing user data:', e); 
    }
  }
  
  return null;
};
  // Fetch questions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch questions
        const questionsData = await api.getQuestions();
        setQuestions(questionsData);

        // Try to fetch existing answers
        const orgId = getOrganizationId();
        if (orgId) {
          try {
            const answersData = await api.getAnswers(orgId);
            if (answersData && answersData.length > 0) {
              // Map answers to our state
              const answersMap = {};
              answersData.forEach(a => { answersMap[a.question_id] = a.answer_value; });
              setAnswers(answersMap);

              // Handle objections if they exist
              const objectionAnswers = answersData.filter(a => a.question_key === 'objection' || a.question_key === 'handle');
              if (objectionAnswers.length > 0) {
                // Group objections (this is simplified - may need adjustment based on actual data structure)
                const objQ = questionsData.find(q => q.question_key === 'objection');
                const handleQ = questionsData.find(q => q.question_key === 'handle');
                if (objQ && handleQ) {
                  setObjections([{
                    objection: answersMap[objQ.id] || '',
                    handle: answersMap[handleQ.id] || '',
                    objectionId: objQ.id,
                    handleId: handleQ.id
                  }]);
                }
              }
            }
          } catch (e) {
            console.log('No existing answers found, starting fresh');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

// Get questions for current step
const getStepQuestions = (stepIndex) => {
  const stepConfig = STEP_CONFIG[stepIndex];
  if (!stepConfig || stepConfig.isKnowledge) return [];
  
  return questions
    .filter(q => stepConfig.keys.includes(q.question_key))
    .sort((a, b) => a.display_order - b.display_order);
};
  // Handle field change
  const handleFieldChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Handle objection change
  const handleObjectionChange = (index, field, value, questionId) => {
    setObjections(prev => {
      const newObjections = [...prev];
      newObjections[index] = { ...newObjections[index], [field]: value, [`${field}Id`]: questionId };
      return newObjections;
    });
    // Also update answers state
    if (questionId) {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleAddObjection = () => {
    const objQ = questions.find(q => q.question_key === 'objection');
    const handleQ = questions.find(q => q.question_key === 'handle');
    setObjections(prev => [...prev, { objection: '', handle: '', objectionId: objQ?.id, handleId: handleQ?.id }]);
  };

  const handleRemoveObjection = (index) => {
    setObjections(prev => prev.filter((_, i) => i !== index));
  };

 // Validate current step
// Validate current step
const isStepValid = () => {
  const stepConfig = STEP_CONFIG[currentStep];
  if (stepConfig.isKnowledge) return true;

  const stepQuestions = getStepQuestions(currentStep);
  return stepQuestions.every(q => !q.is_required || answers[q.id]?.trim());
};

  // Handle next step
  const handleNext = () => {
    if (currentStep < STEP_CONFIG.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

// Handle submit
const handleSubmit = async () => {
  const orgId = getOrganizationId();
  if (!orgId) {
    setError('Organization ID not found. Please log in again.');
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    // Prepare answers array from all answers
    const answersArray = Object.entries(answers)
      .filter(([_, value]) => value && value.trim())
      .map(([questionId, value]) => ({
        question_id: questionId,
        answer_value: value.trim()
      }));

    console.log('Submitting answers:', answersArray);

    // Check if we have answers for all required questions
    const requiredQuestions = questions.filter(q => q.is_required);
    const missingRequired = requiredQuestions.filter(q => !answers[q.id]?.trim());
    
    if (missingRequired.length > 0) {
      setError(`Please answer all required questions.`);
      setSubmitting(false);
      return;
    }

    // Submit to API
    await api.submitAnswers(orgId, answersArray);

    // Mark onboarding as complete
    const userId = user?.id || localStorage.getItem('user_id');
    if (userId) {
      localStorage.setItem(`onboarding_${userId}`, 'true');
    }

    // Show thank you screen
    setShowThankYou(true);
  } catch (err) {
    console.error('Error submitting answers:', err);
    setError(err.message || 'Failed to submit answers. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleStart = () => navigate('/dashboard');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5] mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Thank you screen
  if (showThankYou) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="simple" />
        <ThankYouScreen onStart={handleStart} />
      </div>
    );
  }

  const currentStepConfig = STEP_CONFIG[currentStep];
  const isKnowledgeStep = currentStepConfig.isKnowledge;
  const stepQuestions = getStepQuestions(currentStep);

 return (
    <div className="min-h-screen bg-white">
      <Header variant="simple" />
      <main className={`flex min-h-[calc(100vh-73px)] ${isKnowledgeStep ? '' : 'p-5'}`}>
        <div className={`${isKnowledgeStep ? 'w-full px-8 lg:px-16 py-8' : 'w-full lg:w-[50%] px-6 lg:px-12 py-8'} overflow-auto`}>
          {!isKnowledgeStep && <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Onboarding to AI-Workforce</h1>}
          {!isKnowledgeStep && <ProgressIndicator currentStep={currentStep} steps={STEP_CONFIG} />}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className={isKnowledgeStep ? '' : 'max-w-xl'}>
            {/* Regular form fields for all non-knowledge steps */}
            {!isKnowledgeStep && (
              <div>
                {getStepQuestions(currentStep).map((question) => (
                  <FormField 
                    key={question.id} 
                    question={question} 
                    value={answers[question.id]} 
                    onChange={handleFieldChange} 
                  />
                ))}
              </div>
            )}

            {/* Knowledge Files */}
            {isKnowledgeStep && (
              <KnowledgeFilesStep
                files={knowledgeFiles}
                onAddFile={(f) => setKnowledgeFiles(prev => [...prev, { id: Date.now(), ...f }])}
                onAddURL={(u) => setKnowledgeFiles(prev => [...prev, { id: Date.now(), ...u }])}
                onDeleteFile={(id) => setKnowledgeFiles(prev => prev.filter(f => f.id !== id))}
                onSelectFile={(id, selected) => setSelectedFiles(prev => selected ? [...prev, id] : prev.filter(fid => fid !== id))}
                selectedFiles={selectedFiles}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 mt-8">
            {currentStep > 0 && (
              <button onClick={handleBack} disabled={submitting} className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50">Back</button>
            )}
            {isKnowledgeStep ? (
              <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-full hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button onClick={handleNext} disabled={!isStepValid()} className={`px-8 py-3 font-medium rounded-full transition-colors ${isStepValid() ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Next</button>
            )}
          </div>
        </div>

        {/* Right Side - Illustration */}
        {!isKnowledgeStep && (
          <div className={`hidden lg:flex w-[50%] ${stepBgColors[currentStep]} items-center justify-center`}>
            <img src={stepImages[currentStep]} alt={currentStepConfig.title} className="w-full h-auto object-contain" onError={(e) => { e.target.onerror = null; e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23E5E7EB" width="400" height="400" rx="20"/><text x="200" y="200" text-anchor="middle" fill="%236B7280" font-size="14">Step ${currentStep + 1}</text></svg>`; }} />
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingPage;