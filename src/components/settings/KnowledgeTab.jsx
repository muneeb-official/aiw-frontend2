// src/components/settings/KnowledgeTab.jsx

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, X, Check, Loader2, FileText, RefreshCw, Link, Globe, File } from 'lucide-react';
import { knowledgeBaseService } from '../../services/KnowledgeBaseService';

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
            {!isUploading && <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500 flex-shrink-0"><X className="w-4 h-4" /></button>}
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
      const transformedJob = knowledgeBaseService.transformScrapeJob(result);
      onUrlAdded(transformedJob);
      setUrl('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to scrape URL.');
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
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5] focus-within:border-transparent">
            <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">https://</span>
            <input type="text" value={url.replace(/^https?:\/\//, '')} onChange={(e) => setUrl(e.target.value)} placeholder="www.example.com" className="flex-1 px-3 py-3 text-sm text-gray-700 outline-none" disabled={isSubmitting} />
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button onClick={handleClose} disabled={isSubmitting} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!url.trim() || isSubmitting} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${url.trim() && !isSubmitting ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{isSubmitting ? 'Adding...' : 'Add URL'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-[#4F46E5]" /></div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{message || 'Success!'}</h3>
        <button onClick={onClose} className="w-full py-3 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] mt-4">Close</button>
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
        <p className="text-gray-600 mb-6">Are you sure you want to delete "<span className="font-medium">{itemName}</span>"? This action cannot be undone.</p>
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

// Main Knowledge Tab Component
const KnowledgeTab = () => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('files'); // 'files' or 'urls'

  // Modal states
  const [showFileModal, setShowFileModal] = useState(false);
  const [showURLModal, setShowURLModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');

    try {
      const [filesResponse, urlsResponse] = await Promise.allSettled([
        knowledgeBaseService.listFiles(),
        knowledgeBaseService.getScrapedContent()
      ]);

      if (filesResponse.status === 'fulfilled') {
        setFiles(knowledgeBaseService.transformFiles(filesResponse.value));
      }
      if (urlsResponse.status === 'fulfilled') {
        setUrls(knowledgeBaseService.transformScrapedContents(urlsResponse.value));
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFileUploaded = (newFile) => {
    setFiles(prev => [newFile, ...prev]);
    setSuccessMessage('File uploaded successfully!');
    setShowSuccessModal(true);
  };

  const handleUrlAdded = (job) => {
    // Refresh to get the new content
    fetchData(true);
    setSuccessMessage('URL added successfully! Scraping in progress...');
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
      setSelectedItems(prev => prev.filter(id => id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage('Item deleted successfully!');
      setShowSuccessModal(true);
    } catch (err) {
      setError('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectItem = (itemId, selected) => {
    setSelectedItems(prev => selected ? [...prev, itemId] : prev.filter(id => id !== itemId));
  };

  const handleSelectAll = (checked) => {
    const currentItems = activeTab === 'files' ? files : urls;
    setSelectedItems(checked ? currentItems.map(i => i.id) : []);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full';
      case 'Failed': return 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full';
      case 'In Progress': return 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full';
      default: return 'text-gray-500';
    }
  };

  const getFileTypeIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const colors = { csv: 'bg-green-100 text-green-600', pdf: 'bg-red-100 text-red-600', png: 'bg-blue-100 text-blue-600', jpg: 'bg-blue-100 text-blue-600', jpeg: 'bg-blue-100 text-blue-600', txt: 'bg-gray-100 text-gray-600' };
    return colors[ext] || 'bg-gray-100 text-gray-600';
  };

  const currentItems = activeTab === 'files' ? files : urls;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Knowledge Base</h2>
          <p className="text-gray-600 text-sm">Manage files and URLs that help AI understand your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchData(true)} disabled={isRefreshing} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" title="Refresh">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <button onClick={() => activeTab === 'files' ? setShowFileModal(true) : setShowURLModal(true)} className="flex items-center gap-1 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]">
              + Add {activeTab === 'files' ? 'File' : 'URL'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setActiveTab('files'); setSelectedItems([]); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'files' ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          <File className="w-4 h-4" /> Files ({files.length})
        </button>
        <button onClick={() => { setActiveTab('urls'); setSelectedItems([]); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'urls' ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          <Globe className="w-4 h-4" /> URLs ({urls.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="col-span-5 flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4F46E5]" checked={currentItems.length > 0 && selectedItems.length === currentItems.length} onChange={(e) => handleSelectAll(e.target.checked)} disabled={currentItems.length === 0} />
            <span className="text-sm font-medium text-gray-600">Name</span>
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-600">Status</div>
          <div className="col-span-2 text-sm font-medium text-gray-600">{activeTab === 'files' ? 'Size' : 'Source'}</div>
          <div className="col-span-2 text-sm font-medium text-gray-600 text-right">Actions</div>
        </div>

        {isLoading && (
          <div className="px-4 py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5] mx-auto mb-2" />
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {!isLoading && currentItems.length === 0 && (
          <div className="px-4 py-12 text-center">
            {activeTab === 'files' ? <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /> : <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />}
            <p className="font-medium text-gray-700">No {activeTab} added yet</p>
            <p className="text-sm text-gray-500 mb-4">{activeTab === 'files' ? 'Upload files to help AI understand your business.' : 'Add URLs to scrape content from your website.'}</p>
            <button onClick={() => activeTab === 'files' ? setShowFileModal(true) : setShowURLModal(true)} className="inline-flex items-center gap-1 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]">
              + Add {activeTab === 'files' ? 'File' : 'URL'}
            </button>
          </div>
        )}

        {!isLoading && currentItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
            <div className="col-span-5 flex items-center gap-3">
              <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={(e) => handleSelectItem(item.id, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#4F46E5]" />
              {activeTab === 'files' ? (
                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${getFileTypeIcon(item.name)}`}>{item.name?.split('.').pop()?.toUpperCase()?.slice(0, 3)}</div>
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-100 text-blue-600 flex-shrink-0"><Link className="w-4 h-4" /></div>
              )}
              <span className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</span>
            </div>
            <div className="col-span-3 flex items-center"><span className={`text-xs font-medium ${getStatusStyle(item.status)}`}>{item.status}</span></div>
            <div className="col-span-2 text-sm text-gray-600 flex items-center truncate">{activeTab === 'files' ? item.size : (item.url || '-')}</div>
            <div className="col-span-2 flex items-center justify-end">
              <button onClick={() => handleDeleteClick(item, activeTab === 'files' ? 'file' : 'url')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && currentItems.length > 0 && (
        <p className="text-sm text-gray-500 mt-3">{currentItems.length} {activeTab === 'files' ? 'file' : 'URL'}{currentItems.length !== 1 ? 's' : ''} • {selectedItems.length} selected</p>
      )}

      {/* Modals */}
      <AddFileModal isOpen={showFileModal} onClose={() => setShowFileModal(false)} onFileUploaded={handleFileUploaded} />
      <AddURLModal isOpen={showURLModal} onClose={() => setShowURLModal(false)} onUrlAdded={handleUrlAdded} />
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={successMessage} />
      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setItemToDelete(null); }} onConfirm={handleDeleteConfirm} itemName={itemToDelete?.name} isDeleting={isDeleting} />
    </div>
  );
};

export default KnowledgeTab;