// components/workflow/WorkflowBuilderModals.jsx
import { useState } from "react";
import { Check, X, AlertTriangle, Bold, Italic, Underline, Link2, Paperclip, ChevronDown } from "lucide-react";

// Loading Modal - "Give us few seconds for setup the workflow"
export const WorkflowLoadingModal = ({ isOpen, message = "Give us few seconds for setup the workflow" }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">{message}</h3>
        <div className="flex justify-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ 
              backgroundColor: "#1a1a1a",
              animationDelay: "0ms",
              animationDuration: "1s"
            }} 
          />
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ 
              backgroundColor: "#9ca3af",
              animationDelay: "200ms",
              animationDuration: "1s"
            }} 
          />
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ 
              backgroundColor: "#9ca3af",
              animationDelay: "400ms",
              animationDuration: "1s"
            }} 
          />
        </div>
      </div>
    </div>
  );
};

// Success Modal - "We have Successfully pulled all the leads!"
export const WorkflowSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#3C49F7]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
          We have Successfully pulled all the leads!
        </h3>
        <p className="text-gray-600">
          Now you can create the workflow for these leads.
        </p>
      </div>
    </div>
  );
};

// Exit Confirmation Modal
export const ExitConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#3C49F7]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-6">
          Your data will get lost if you proceed. Are you sure
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
          >
            Yes, Proceed
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Workflow Saved Successfully Modal
export const WorkflowSavedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
          Workflow Saved Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Your workflow has been saved and is ready to use.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// No Leads Available Modal
export const NoLeadsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
          No Leads Available
        </h3>
        <p className="text-gray-600 mb-6">
          Please select a campaign with leads or upload a CSV file.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Invalid File Format Modal
export const InvalidFileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
          Invalid File Format
        </h3>
        <p className="text-gray-600 mb-6">
          Please upload a valid CSV file to continue.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#2a35d4]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// ============================================
// EMAIL SIGNATURE MODAL
// ============================================
export const EmailSignatureModal = ({ 
  isOpen, 
  onClose, 
  onCreateNew, 
  onSelectSignature,
  existingSignatures = []
}) => {
  const [signatureName, setSignatureName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (signatureName.trim()) {
      onCreateNew(signatureName);
      setSignatureName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[#1a1a1a]">Email Signature</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Create New Email Signature</label>
          <input
            type="text"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Enter Signature Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3C49F7]"
          />
        </div>

        {/* Existing Signatures */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Existing Signatures</label>
          {existingSignatures.length > 0 ? (
            <div className="space-y-2">
              {existingSignatures.map((sig) => (
                <button
                  key={sig.id}
                  onClick={() => onSelectSignature?.(sig)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left hover:border-[#3C49F7] hover:bg-[#F8F9FC]"
                >
                  {sig.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">None</p>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={!signatureName.trim()}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            signatureName.trim()
              ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Create Signature
        </button>
      </div>
    </div>
  );
};

// ============================================
// CREATE SIGNATURE MODAL (Rich Text Editor)
// ============================================
export const CreateSignatureModal = ({ isOpen, onClose, onSave, signatureName = "" }) => {
  const [content, setContent] = useState("");
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });

  if (!isOpen) return null;

  const toggleFormat = (format) => {
    setActiveFormats({ ...activeFormats, [format]: !activeFormats[format] });
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave({ name: signatureName, content });
      setContent("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[#1a1a1a]">Create a new Email Signature</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your signature here..."
            className="w-full h-[200px] p-4 text-sm text-gray-700 resize-none outline-none"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-t border-gray-100 bg-gray-50">
            <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded">
              <span className="font-serif">T</span>
              <span className="font-serif text-xs">T</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <button
              onClick={() => toggleFormat("bold")}
              className={`p-1.5 rounded ${activeFormats.bold ? "bg-gray-200" : "hover:bg-gray-200"}`}
            >
              <Bold className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => toggleFormat("italic")}
              className={`p-1.5 rounded ${activeFormats.italic ? "bg-gray-200" : "hover:bg-gray-200"}`}
            >
              <Italic className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => toggleFormat("underline")}
              className={`p-1.5 rounded ${activeFormats.underline ? "bg-gray-200" : "hover:bg-gray-200"}`}
            >
              <Underline className="w-4 h-4 text-gray-600" />
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded">
              <span className="underline decoration-2 decoration-black">A</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <Link2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <Paperclip className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            content.trim()
              ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Create Signature
        </button>
      </div>
    </div>
  );
};

// ============================================
// SIGNATURE SUCCESS MODAL
// ============================================
export const SignatureSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#3C49F7]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
          Your new email signature is created successfully!
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          We will add your newly created signature on the email template.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#3C49F7] text-white rounded-lg text-sm font-medium hover:bg-[#2a35d4]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ============================================
// DELETE STEP CONFIRMATION MODAL
// ============================================
export const DeleteStepModal = ({ isOpen, onClose, onConfirm, stepName = "this step" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Delete Step?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{stepName}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  WorkflowLoadingModal,
  WorkflowSuccessModal,
  ExitConfirmationModal,
  WorkflowSavedModal,
  NoLeadsModal,
  InvalidFileModal,
  EmailSignatureModal,
  CreateSignatureModal,
  SignatureSuccessModal,
  DeleteStepModal,
};