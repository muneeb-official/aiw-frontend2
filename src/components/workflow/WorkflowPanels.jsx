// components/workflow/WorkflowPanels.jsx
import { useState } from "react";
import { X, MoreVertical, Paperclip, PenTool, Link2, ChevronDown, Check, Plus, Trash2 } from "lucide-react";

// Variables data
const VARIABLES = [
  { id: "first_name", label: "First Name" },
  { id: "last_name", label: "Last Name" },
  { id: "full_name", label: "Full Name" },
  { id: "job_title", label: "Job Title" },
  { id: "current_company", label: "Current Company" },
];

// Variables Dropdown
const VariablesDropdown = ({ onSelect, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-1">
        {VARIABLES.map((variable) => (
          <button
            key={variable.id}
            onClick={() => { onSelect(variable); onClose(); }}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
          >
            {variable.label}
          </button>
        ))}
      </div>
    </>
  );
};

// Save Email Modal
const SaveEmailModal = ({ isOpen, onClose, onSave }) => {
  const [emailName, setEmailName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (emailName.trim()) {
      onSave(emailName);
      setEmailName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Save your Email</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-2 block">Email Name</label>
          <input
            type="text"
            value={emailName}
            onChange={(e) => setEmailName(e.target.value)}
            placeholder="Enter Email Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!emailName.trim()}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${emailName.trim()
            ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Save Email
        </button>
      </div>
    </div>
  );
};

// Email Saved Success Modal
const EmailSavedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        <div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#3C49F7]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Your Email is saved!</h3>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Fix Grammar Loading Modal
const FixGrammarLoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Wait for a few seconds,</h3>
        <p className="text-gray-600 mb-6">We are fixing your grammar and making it perfect.</p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

// Add Attachment Modal
const AddAttachmentModal = ({ isOpen, onClose, onAttach, attachments }) => {
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      onAttach({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.name.split('.').pop().toUpperCase()
      });
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      onAttach({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.name.split('.').pop().toUpperCase()
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Add Attachment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${dragOver ? "border-[#3C49F7] bg-[#F8F9FC]" : "border-gray-300"
            }`}
        >
          <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Drag & drop files here</p>
          <p className="text-gray-400 text-sm mb-3">or</p>
          <label className="px-4 py-2 bg-[#3C49F7] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-[#2a35d4]">
            Browse Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {attachments && attachments.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700">Attached Files:</p>
            {attachments.map(file => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                    {file.type}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// Add Link Modal
const AddLinkModal = ({ isOpen, onClose, onAddLink }) => {
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (linkText.trim() && linkUrl.trim()) {
      onAddLink({ text: linkText, url: linkUrl });
      setLinkText("");
      setLinkUrl("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Add Link</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-2 block">Link Text</label>
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Enter link text"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-2 block">URL</label>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!linkText.trim() || !linkUrl.trim()}
          className={`w-full py-2.5 rounded-full text-sm font-medium transition-colors ${linkText.trim() && linkUrl.trim()
            ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Add Link
        </button>
      </div>
    </div>
  );
};

// Email Panel Component
export const EmailPanel = ({ config, onChange, workflowName, workflowDate, onOpenSignature }) => {
  const [showVariables, setShowVariables] = useState(false);
  const [showSuggestEdits, setShowSuggestEdits] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showFixGrammarLoading, setShowFixGrammarLoading] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Suggest Edits sliders state
  const [formality, setFormality] = useState(70);
  const [persuasion, setPersuasion] = useState(70);
  const [urgency, setUrgency] = useState(70);
  const [personalization, setPersonalization] = useState(70);
  const [wordsCount, setWordsCount] = useState(100);
  const [showCTA, setShowCTA] = useState(false);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const handleVariableInsert = (variable) => {
    const currentBody = config.body || "";
    onChange("body", currentBody + `{{${variable.id}}}`);
  };

  const handleFixGrammar = () => {
    setShowFixGrammarLoading(true);
    setTimeout(() => {
      setShowFixGrammarLoading(false);
      // Simulate grammar fix by updating content
      if (!config.body) {
        onChange("subject", "We're Launching Tomorrow – Introducing AI Workforce");
        onChange("body", `Hello {{first_name}},

We're excited to share that {{current_company}} officially launches tomorrow.

AI Lead is built to help businesses find, qualify, and convert the right leads faster—using the power of AI. Our goal is simple: reduce manual effort, improve lead quality, and help teams focus on closing, not chasing.

Tomorrow marks the beginning of something we've worked hard to build, and we'd love for you to be part of this journey from day one.

Stay tuned for access details, product updates, and what's coming next. We will soon be on lookout for experienced {{job_title}} from {{current_company}}.

Thank you for your support—we can't wait to show you what AI Lead can do.

Warm regards,
Ayush Seth
Founder, AI Lead`);
      }
    }, 2000);
  };

  const handleSaveEmail = (emailName) => {
    console.log("Saving email:", emailName, config);
    setShowSaveModal(false);
    setShowSavedModal(true);
  };

  const handleAttachment = (file) => {
    setAttachments([...attachments, file]);
  };

  const handleAddLink = (link) => {
    const currentBody = config.body || "";
    onChange("body", currentBody + ` [${link.text}](${link.url})`);
  };

  const handleApplyEdits = () => {
    // Apply the edits based on slider values
    console.log("Applying edits:", { formality, persuasion, urgency, personalization, wordsCount, ctaText, ctaLink });
    setShowSuggestEdits(false);
  };

  // Render variable tags in content
  const renderContentWithTags = (content) => {
    if (!content) return null;
    const parts = content.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{\{([^}]+)\}\}/);
      if (match) {
        return (
          <span
            key={index}
            className="inline-block bg-[#E8E8FF] text-[#6B6B8D] px-2 py-0.5 rounded text-sm font-medium mx-0.5"
          >
            {match[1]}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Suggest Edits View
  if (showSuggestEdits) {
    return (
      <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Suggest Edits</h3>

        {/* Formality Slider */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Formality</p>
          <input
            type="range"
            min="0"
            max="100"
            value={formality}
            onChange={(e) => setFormality(Number(e.target.value))}
            className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Formal</span>
            <span>Neutral</span>
            <span>Friendly</span>
          </div>
        </div>

        {/* Persuasion Slider */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Persuation</p>
          <input
            type="range"
            min="0"
            max="100"
            value={persuasion}
            onChange={(e) => setPersuasion(Number(e.target.value))}
            className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Formal</span>
            <span>Neutral</span>
            <span>Friendly</span>
          </div>
        </div>

        {/* Urgency Slider */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Urgency</p>
          <input
            type="range"
            min="0"
            max="100"
            value={urgency}
            onChange={(e) => setUrgency(Number(e.target.value))}
            className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Urgent</span>
            <span>Neutral</span>
            <span>Nurture</span>
          </div>
        </div>

        {/* Personalization Slider */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Personalization</p>
          <input
            type="range"
            min="0"
            max="100"
            value={personalization}
            onChange={(e) => setPersonalization(Number(e.target.value))}
            className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Salesy</span>
            <span>Neutral</span>
            <span>Insightful</span>
          </div>
        </div>

        {/* Words Count Slider */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Words Count</p>
          <input
            type="range"
            min="50"
            max="450"
            step="50"
            value={wordsCount}
            onChange={(e) => setWordsCount(Number(e.target.value))}
            className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
            <span>250</span>
            <span>300</span>
            <span>350</span>
            <span>400</span>
            <span>450</span>
          </div>
        </div>

        {/* Add CTA Section */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Add CTA text & URL</p>
          {showCTA ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Enter CTA Text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">CTA Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="example.com/contact-us"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCTA(true)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white"
            >
              <Plus className="w-4 h-4" />
              Add CTA
            </button>
          )}
        </div>

        {/* Apply Edits Button */}
        <div className="flex justify-end">
          <button
            onClick={handleApplyEdits}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Apply Edits
          </button>
        </div>
      </div>
    );
  }

  // Default Email Composer View
  return (
    <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSuggestEdits(true)}  // CHANGED: trigger suggest edits
            className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
          >
            Rewrite Email
          </button>
          <button
            onClick={handleFixGrammar}
            className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
          >
            Fix Grammar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Save Email
          </button>
          <button className="p-1.5 hover:bg-white/50 rounded">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-white/80 rounded-xl overflow-hidden">
        {/* To Field */}
        <div className="flex items-center border-b border-gray-100 px-4 py-3">
          <span className="text-sm text-gray-500 w-16">To:</span>
          <input
            type="text"
            value={config.to || `${workflowName} - ${workflowDate}`}
            onChange={(e) => onChange("to", e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
          />
        </div>

        {/* Subject Field */}
        <div className="flex items-center border-b border-gray-100 px-4 py-3">
          <span className="text-sm text-gray-500 w-16">Subject:</span>
          <input
            type="text"
            value={config.subject || ""}
            onChange={(e) => onChange("subject", e.target.value)}
            placeholder="Type your subject Here"
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Body */}
<div className="p-4 min-h-[350px]">
  <textarea
    value={config.body || ""}
    onChange={(e) => onChange("body", e.target.value)}
    placeholder="Type your message content here."
    className="w-full h-[330px] text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400"
  />
</div>

        {/* Attachments Display */}
        {attachments.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {attachments.map(file => (
                <div key={file.id} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                  <span className="font-medium">{file.name}</span>
                  <button
                    onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
          <div className="relative">
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              + Add Variables
            </button>
            {showVariables && (
              <VariablesDropdown
                onSelect={handleVariableInsert}
                onClose={() => setShowVariables(false)}
              />
            )}
          </div>

          <button
            onClick={() => setShowAttachmentModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Add Attachment"
          >
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>

          <button
            onClick={onOpenSignature}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Add Signature"
          >
            <PenTool className="w-4 h-4 text-gray-500" />
          </button>

          <button
            onClick={() => setShowLinkModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Add Link"
          >
            <Link2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <SaveEmailModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveEmail}
      />

      <EmailSavedModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
      />

      <FixGrammarLoadingModal isOpen={showFixGrammarLoading} />

      <AddAttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onAttach={handleAttachment}
        attachments={attachments}
      />

      <AddLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onAddLink={handleAddLink}
      />
    </div>
  );
};

// LinkedIn Panel Component
// LinkedIn Panel Component
export const LinkedInPanel = ({ config, onChange, subAction }) => {
    const [showVariables, setShowVariables] = useState(false);
    const [showSuggestEdits, setShowSuggestEdits] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [showFixGrammarLoading, setShowFixGrammarLoading] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Slider states
    const [formality, setFormality] = useState(70);
    const [persuasion, setPersuasion] = useState(70);
    const [urgency, setUrgency] = useState(70);
    const [personalization, setPersonalization] = useState(70);
    const [wordsCount, setWordsCount] = useState(100);
    const [showCTA, setShowCTA] = useState(false);
    const [ctaText, setCtaText] = useState("");
    const [ctaLink, setCtaLink] = useState("");

    const handleVariableInsert = (variable) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + `{{${variable.id}}}`);
    };

    const handleFixGrammar = () => {
        setShowFixGrammarLoading(true);
        setTimeout(() => {
            setShowFixGrammarLoading(false);
        }, 2000);
    };

    const handleSaveMessage = (messageName) => {
        console.log("Saving message:", messageName, config);
        setShowSaveModal(false);
        setShowSavedModal(true);
    };

    const handleAttachment = (file) => {
        setAttachments([...attachments, file]);
    };

    const handleAddLink = (link) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + ` [${link.text}](${link.url})`);
    };

    const handleApplyEdits = () => {
        console.log("Applying edits:", { formality, persuasion, urgency, personalization, wordsCount, ctaText, ctaLink });
        setShowSuggestEdits(false);
    };

    const getTitle = () => {
        switch (subAction) {
            case "message": return "LinkedIn Message";
            case "likePost": return "Like a Post";
            case "repost": return "Repost";
            case "comment": return "Comment on a Post";
            default: return "LinkedIn Action";
        }
    };

    // Suggest Edits View
    if (showSuggestEdits && (subAction === "message" || subAction === "comment")) {
        return (
            <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-6 overflow-y-auto">
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Suggest Edits</h3>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Formality</p>
                    <input type="range" min="0" max="100" value={formality} onChange={(e) => setFormality(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Persuation</p>
                    <input type="range" min="0" max="100" value={persuasion} onChange={(e) => setPersuasion(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Urgency</p>
                    <input type="range" min="0" max="100" value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Urgent</span><span>Neutral</span><span>Nurture</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Personalization</p>
                    <input type="range" min="0" max="100" value={personalization} onChange={(e) => setPersonalization(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Salesy</span><span>Neutral</span><span>Insightful</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Words Count</p>
                    <input type="range" min="50" max="450" step="50" value={wordsCount} onChange={(e) => setWordsCount(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1"><span>50</span><span>100</span><span>150</span><span>200</span><span>250</span><span>300</span><span>350</span><span>400</span><span>450</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Add CTA text & URL</p>
                    {showCTA ? (
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Text</label>
                                    <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Enter CTA Text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Link</label>
                                    <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="example.com/contact-us" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowCTA(true)} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white">
                            <Plus className="w-4 h-4" />
                            Add CTA
                        </button>
                    )}
                </div>

                <div className="flex justify-end">
                    <button onClick={handleApplyEdits} className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Apply Edits</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-4">
            {/* Header for Message and Comment */}
            {(subAction === "message" || subAction === "comment") && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowSuggestEdits(true)}
                            className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                        >
                            Rewrite {subAction === "message" ? "Message" : "Comment"}
                        </button>
                        <button
                            onClick={handleFixGrammar}
                            className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                        >
                            Fix Grammar
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Save {subAction === "message" ? "Message" : "Comment"}
                        </button>
                        <button className="p-1.5 hover:bg-white/50 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            )}

            {/* Simple header for Like/Repost */}
            {(subAction === "likePost" || subAction === "repost") && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{getTitle()}</h3>
                    <button className="p-1.5 hover:bg-white/50 rounded">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="bg-white/80 rounded-xl overflow-hidden p-4">
                {subAction === "message" || subAction === "comment" ? (
                    <>
                        <textarea
                            value={config.message || ""}
                            onChange={(e) => onChange("message", e.target.value)}
                            placeholder={subAction === "message" ? "Type your message here..." : "Type your comment here..."}
                            className="w-full h-[300px] text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400"
                        />

                        {/* Attachments Display */}
                        {attachments.length > 0 && (
                            <div className="mt-2">
                                <div className="flex flex-wrap gap-2">
                                    {attachments.map(file => (
                                        <div key={file.id} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                            <span className="font-medium">{file.name}</span>
                                            <button
                                                onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowVariables(!showVariables)}
                                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    + Add Variables
                                </button>
                                {showVariables && (
                                    <VariablesDropdown
                                        onSelect={handleVariableInsert}
                                        onClose={() => setShowVariables(false)}
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => setShowAttachmentModal(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                                title="Add Attachment"
                            >
                                <Paperclip className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                                onClick={() => setShowLinkModal(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                                title="Add Link"
                            >
                                <Link2 className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>This action will automatically {subAction === "likePost" ? "like" : "repost"} the prospect's latest post.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <SaveEmailModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveMessage}
            />

            <EmailSavedModal
                isOpen={showSavedModal}
                onClose={() => setShowSavedModal(false)}
            />

            <FixGrammarLoadingModal isOpen={showFixGrammarLoading} />

            <AddAttachmentModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onAttach={handleAttachment}
                attachments={attachments}
            />

            <AddLinkModal
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onAddLink={handleAddLink}
            />
        </div>
    );
};

// WhatsApp Panel Component
export const WhatsAppPanel = ({ config, onChange, workflowName, workflowDate }) => {
    const [showVariables, setShowVariables] = useState(false);
    const [showSuggestEdits, setShowSuggestEdits] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [showFixGrammarLoading, setShowFixGrammarLoading] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Slider states
    const [formality, setFormality] = useState(50);
    const [persuasion, setPersuasion] = useState(50);
    const [urgency, setUrgency] = useState(50);
    const [personalization, setPersonalization] = useState(50);
    const [wordsCount, setWordsCount] = useState(100);
    const [showCTA, setShowCTA] = useState(false);
    const [ctaText, setCtaText] = useState("");
    const [ctaLink, setCtaLink] = useState("");

    const handleVariableInsert = (variable) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + `{{${variable.id}}}`);
    };

    const handleFixGrammar = () => {
        setShowFixGrammarLoading(true);
        setTimeout(() => {
            setShowFixGrammarLoading(false);
        }, 2000);
    };

    const handleSaveMessage = (messageName) => {
        console.log("Saving message:", messageName, config);
        setShowSaveModal(false);
        setShowSavedModal(true);
    };

    const handleAttachment = (file) => {
        setAttachments([...attachments, file]);
    };

    const handleAddLink = (link) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + ` [${link.text}](${link.url})`);
    };

    const handleApplyEdits = () => {
        console.log("Applying edits:", { formality, persuasion, urgency, personalization, wordsCount, ctaText, ctaLink });
        setShowSuggestEdits(false);
    };

    // Suggest Edits View
    if (showSuggestEdits) {
        return (
            <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-6 overflow-y-auto">
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Suggest Edits</h3>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Formality</p>
                    <input type="range" min="0" max="100" value={formality} onChange={(e) => setFormality(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Persuation</p>
                    <input type="range" min="0" max="100" value={persuasion} onChange={(e) => setPersuasion(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Urgency</p>
                    <input type="range" min="0" max="100" value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Urgent</span><span>Neutral</span><span>Nurture</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Personalization</p>
                    <input type="range" min="0" max="100" value={personalization} onChange={(e) => setPersonalization(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Salesy</span><span>Neutral</span><span>Insightful</span></div>
                </div>

                <div className="mb-8">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Words Count</p>
                    <input type="range" min="50" max="450" step="50" value={wordsCount} onChange={(e) => setWordsCount(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1"><span>50</span><span>100</span><span>150</span><span>200</span><span>250</span><span>300</span><span>350</span><span>400</span><span>450</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Add CTA text & URL</p>
                    {showCTA ? (
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Text</label>
                                    <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Enter CTA Text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Link</label>
                                    <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="example.com/contact-us" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowCTA(true)} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white">
                            <Plus className="w-4 h-4" />
                            Add CTA
                        </button>
                    )}
                </div>

                <div className="flex justify-end">
                    <button onClick={handleApplyEdits} className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Apply Edits</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowSuggestEdits(true)}
                        className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                    >
                        Rewrite Message
                    </button>
                    <button 
                        onClick={handleFixGrammar}
                        className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                    >
                        Fix Grammar
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowSaveModal(true)}
                        className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Save Message
                    </button>
                    <button className="p-1.5 hover:bg-white/50 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="bg-white/80 rounded-xl overflow-hidden">
                <div className="flex items-center border-b border-gray-100 px-4 py-3">
                    <span className="text-sm text-gray-500 w-12">To:</span>
                    <input type="text" value={config.to || `${workflowName} - ${workflowDate}`} onChange={(e) => onChange("to", e.target.value)} className="flex-1 text-sm text-gray-700 bg-transparent outline-none" />
                </div>
                <div className="p-4 min-h-[400px]">
                    <textarea value={config.message || ""} onChange={(e) => onChange("message", e.target.value)} placeholder="Type your message content here." className="w-full h-[380px] text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400" />
                </div>

                {/* Attachments Display */}
                {attachments.length > 0 && (
                    <div className="px-4 pb-2">
                        <div className="flex flex-wrap gap-2">
                            {attachments.map(file => (
                                <div key={file.id} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                    <span className="font-medium">{file.name}</span>
                                    <button
                                        onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                    <div className="relative">
                        <button onClick={() => setShowVariables(!showVariables)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50">+ Add Variables</button>
                        {showVariables && <VariablesDropdown onSelect={handleVariableInsert} onClose={() => setShowVariables(false)} />}
                    </div>
                    <button 
                        onClick={() => setShowAttachmentModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                        onClick={() => setShowLinkModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Link2 className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <SaveEmailModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveMessage}
            />

            <EmailSavedModal
                isOpen={showSavedModal}
                onClose={() => setShowSavedModal(false)}
            />

            <FixGrammarLoadingModal isOpen={showFixGrammarLoading} />

            <AddAttachmentModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onAttach={handleAttachment}
                attachments={attachments}
            />

            <AddLinkModal
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onAddLink={handleAddLink}
            />
        </div>
    );
};

// Telegram Panel Component
export const TelegramPanel = ({ config, onChange, workflowName, workflowDate }) => {
    const [showVariables, setShowVariables] = useState(false);
    const [showSuggestEdits, setShowSuggestEdits] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [showFixGrammarLoading, setShowFixGrammarLoading] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Slider states
    const [formality, setFormality] = useState(50);
    const [persuasion, setPersuasion] = useState(50);
    const [urgency, setUrgency] = useState(50);
    const [personalization, setPersonalization] = useState(50);
    const [wordsCount, setWordsCount] = useState(100);
    const [showCTA, setShowCTA] = useState(false);
    const [ctaText, setCtaText] = useState("");
    const [ctaLink, setCtaLink] = useState("");

    const handleVariableInsert = (variable) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + `{{${variable.id}}}`);
    };

    const handleFixGrammar = () => {
        setShowFixGrammarLoading(true);
        setTimeout(() => {
            setShowFixGrammarLoading(false);
        }, 2000);
    };

    const handleSaveMessage = (messageName) => {
    const templateData = {
        name: messageName,
        content: config.message || config.body || config.callPrompt,
        type: 'email', // or 'linkedin', 'whatsapp', etc.
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage or backend
    const existingTemplates = JSON.parse(localStorage.getItem('templates') || '{}');
    const templateType = 'email'; // determine based on panel type
    
    if (!existingTemplates[templateType]) {
        existingTemplates[templateType] = [];
    }
    
    existingTemplates[templateType].push(templateData);
    localStorage.setItem('templates', JSON.stringify(existingTemplates));
    
    console.log("Saving template:", messageName, config);
    setShowSaveModal(false);
    setShowSavedModal(true);
};

    const handleAttachment = (file) => {
        setAttachments([...attachments, file]);
    };

    const handleAddLink = (link) => {
        const currentMessage = config.message || "";
        onChange("message", currentMessage + ` [${link.text}](${link.url})`);
    };

    const handleApplyEdits = () => {
        console.log("Applying edits:", { formality, persuasion, urgency, personalization, wordsCount, ctaText, ctaLink });
        setShowSuggestEdits(false);
    };

    // Suggest Edits View
    if (showSuggestEdits) {
        return (
            <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-6 overflow-y-auto">
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">Suggest Edits</h3>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Formality</p>
                    <input type="range" min="0" max="100" value={formality} onChange={(e) => setFormality(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Persuation</p>
                    <input type="range" min="0" max="100" value={persuasion} onChange={(e) => setPersuasion(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Formal</span><span>Neutral</span><span>Friendly</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Urgency</p>
                    <input type="range" min="0" max="100" value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Urgent</span><span>Neutral</span><span>Nurture</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Personalization</p>
                    <input type="range" min="0" max="100" value={personalization} onChange={(e) => setPersonalization(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Salesy</span><span>Neutral</span><span>Insightful</span></div>
                </div>

                <div className="mb-8">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Words Count</p>
                    <input type="range" min="50" max="450" step="50" value={wordsCount} onChange={(e) => setWordsCount(Number(e.target.value))} className="w-full h-2 bg-[#3C49F7] rounded-lg appearance-none cursor-pointer accent-[#3C49F7]" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1"><span>50</span><span>100</span><span>150</span><span>200</span><span>250</span><span>300</span><span>350</span><span>400</span><span>450</span></div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Add CTA text & URL</p>
                    {showCTA ? (
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Text</label>
                                    <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Enter CTA Text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-600 mb-1 block">CTA Link</label>
                                    <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="example.com/contact-us" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#3C49F7]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowCTA(true)} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white">
                            <Plus className="w-4 h-4" />
                            Add CTA
                        </button>
                    )}
                </div>

                <div className="flex justify-end">
                    <button onClick={handleApplyEdits} className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Apply Edits</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowSuggestEdits(true)}
                        className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                    >
                        Rewrite Message
                    </button>
                    <button 
                        onClick={handleFixGrammar}
                        className="px-4 py-1.5 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
                    >
                        Fix Grammar
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowSaveModal(true)}
                        className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Save Message
                    </button>
                    <button className="p-1.5 hover:bg-white/50 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="bg-white/80 rounded-xl overflow-hidden">
                <div className="flex items-center border-b border-gray-100 px-4 py-3">
                    <span className="text-sm text-gray-500 w-12">To:</span>
                    <input type="text" value={config.to || `${workflowName} - ${workflowDate}`} onChange={(e) => onChange("to", e.target.value)} className="flex-1 text-sm text-gray-700 bg-transparent outline-none" />
                </div>
                <div className="p-4 min-h-[400px]">
                    <textarea value={config.message || ""} onChange={(e) => onChange("message", e.target.value)} placeholder="Type your message content here." className="w-full h-[380px] text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400" />
                </div>

                {/* Attachments Display */}
                {attachments.length > 0 && (
                    <div className="px-4 pb-2">
                        <div className="flex flex-wrap gap-2">
                            {attachments.map(file => (
                                <div key={file.id} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                    <span className="font-medium">{file.name}</span>
                                    <button
                                        onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                    <div className="relative">
                        <button onClick={() => setShowVariables(!showVariables)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50">+ Add Variables</button>
                        {showVariables && <VariablesDropdown onSelect={handleVariableInsert} onClose={() => setShowVariables(false)} />}
                    </div>
                    <button 
                        onClick={() => setShowAttachmentModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                        onClick={() => setShowLinkModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Link2 className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <SaveEmailModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveMessage}
            />

            <EmailSavedModal
                isOpen={showSavedModal}
                onClose={() => setShowSavedModal(false)}
            />

            <FixGrammarLoadingModal isOpen={showFixGrammarLoading} />

            <AddAttachmentModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onAttach={handleAttachment}
                attachments={attachments}
            />

            <AddLinkModal
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onAddLink={handleAddLink}
            />
        </div>
    );
};

// Condition Panel Component
export const ConditionPanel = ({ config, onChange }) => {
  const conditions = [
    { id: "email", title: "Email Responded", description: "This condition will check if the prospect has responded back to an email shared previously." },
    { id: "whatsapp", title: "WhatsApp Responded", description: "This condition will check if the prospect has responded back to a Whatsapp message shared previously." },
    { id: "telegram", title: "Telegram Responded", description: "This condition will check if the prospect has responded back to a Telegram message shared previously." },
    { id: "call", title: "Call Responded", description: "This condition will check if the prospect has responded back to a Call that was made with or calling AI Agent." },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-6">
      <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6">What is the conditions?</h3>
      <div className="space-y-3">
        {conditions.map((condition) => (
          <button key={condition.id} onClick={() => onChange("conditionType", condition.id)} className={`w-full text-left p-4 rounded-xl transition-all ${config.conditionType === condition.id ? "bg-white border-2 border-[#3C49F7]" : "bg-white/60 border-2 border-transparent hover:bg-white/80"}`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${config.conditionType === condition.id ? "border-[#3C49F7] bg-[#3C49F7]" : "border-gray-300"}`}>
                {config.conditionType === condition.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <p className="font-semibold text-[#1a1a1a]">{condition.title}</p>
                <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Call Panel Component
export const CallPanel = ({ config, onChange, workflowName, workflowDate }) => {
  const [activeTab, setActiveTab] = useState("callFlow");
  const [showVariables, setShowVariables] = useState(false);
  const [showTestCallModal, setShowTestCallModal] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [testCallData, setTestCallData] = useState({ callFrom: "", phoneNumber: "", email: "" });

  // Configuration states
  const [voiceModel, setVoiceModel] = useState("Eric (American English)");
  const [language, setLanguage] = useState("English");
  const [backgroundAudio, setBackgroundAudio] = useState("Office");
  const [waitForGreetings, setWaitForGreetings] = useState(true);
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  const [blockInterruption, setBlockInterruption] = useState(true);
  const [retryEnabled, setRetryEnabled] = useState(true);
  const [retryTimes, setRetryTimes] = useState(1);
  const [retryAfter, setRetryAfter] = useState(3);
  const [retryUnit, setRetryUnit] = useState("Hours");
  const [voicemailBehaviour, setVoicemailBehaviour] = useState("Hangup");
  const [showCallerConfig, setShowCallerConfig] = useState(true);
  const [showRetryConditions, setShowRetryConditions] = useState(true);
  const [showVoicemailBehaviour, setShowVoicemailBehaviour] = useState(true);

  // Tooltip states
  const [showTooltip, setShowTooltip] = useState({
    waitForGreetings: false,
    noiseCancellation: false,
    blockInterruption: false,
    retryAttempts: false
  });

  const phoneNumbers = ["+44-12312-1231-123", "+1-555-123-4567", "+91-98765-43210"];

  const voiceOptions = [
    "Eric (American English)",
    "Max (American English)",
    "Anna (American English)",
    "Steve (Australia)",
    "Kyilye (Australia)",
    "Lily (British English)"
  ];

  const languageOptions = ["English", "Spanish", "French", "Danish", "Arabic", "Dutch"];
  const backgroundAudioOptions = ["Off", "Office"];

  const handleVariableInsert = (variable) => {
    const currentPrompt = config.callPrompt || "";
    onChange("callPrompt", currentPrompt + `{{${variable.id}}}`);
  };

  const handleGeneratePrompt = () => {
    setShowGeneratingModal(true);
    setTimeout(() => {
      setShowGeneratingModal(false);
      onChange("openingLine", "Hello {{first_name}},\n\nMyself Jhon, I am Sales Executive at {{current_company}} and launched a new product at the company.");
      onChange("callPrompt", `Hello {{first_name}},\n\nWe're excited to share that {{current_company}} officially launches tomorrow.\n\nAI Lead is built to help businesses find, qualify, and convert the right leads faster—using the power of AI.`);
    }, 2000);
  };

  const handleStartCall = () => { setShowTestCallModal(false); setShowSuccessModal(true); };

  const renderContentWithTags = (content) => {
    if (!content) return null;
    const parts = content.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{\{([^}]+)\}\}/);
      if (match) return <span key={index} className="inline-block bg-[#E8E8FF] text-[#6B6B8D] px-2 py-0.5 rounded text-sm font-medium mx-0.5">{match[1]}</span>;
      return <span key={index}>{part}</span>;
    });
  };

  const hasContent = config.callPrompt || config.openingLine;

  return (
    <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-white rounded-lg p-1">
          <button onClick={() => setActiveTab("callFlow")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "callFlow" ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}>Call Flow</button>
          <button onClick={() => setActiveTab("configurations")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "configurations" ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}>Configurations</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTestCallModal(true)} disabled={!hasContent} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${hasContent ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}>Test Call</button>
          <button disabled={!hasContent} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${hasContent ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}>Save Prompt</button>
          <button className="p-1.5 hover:bg-white/50 rounded"><MoreVertical className="w-4 h-4 text-gray-500" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "callFlow" && (
          <div className="space-y-5">
            <p className="text-sm text-gray-700 leading-relaxed">Let's design the perfect call! Write a prompt to tell me how you want me to approach your prospect — what to say, what to ask, and what vibe you want.</p>
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-gray-900">Opening Line</span><div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-medium">i</span></div></div>
              <div className="bg-white/80 rounded-lg p-4 min-h-[80px]">{config.openingLine ? <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{renderContentWithTags(config.openingLine)}</div> : <textarea value={config.openingLine || ""} onChange={(e) => onChange("openingLine", e.target.value)} placeholder="Type your message content here." className="w-full text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400" rows={3} />}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-gray-900">Website URL</span><div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-medium">i</span></div></div>
              <div className="flex items-center gap-3">
                <input type="text" value={config.websiteUrl || ""} onChange={(e) => onChange("websiteUrl", e.target.value)} placeholder="https://www.example.com" className="flex-1 bg-white/80 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                <button onClick={handleGeneratePrompt} className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Generate Prompt</button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-gray-900">Call Prompt</span><div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-medium">i</span></div></div>
              <div className="bg-white/80 rounded-lg p-4 min-h-[200px]">{config.callPrompt ? <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{renderContentWithTags(config.callPrompt)}</div> : <textarea value={config.callPrompt || ""} onChange={(e) => onChange("callPrompt", e.target.value)} placeholder="Type your prompt here." className="w-full h-[180px] text-sm text-gray-700 bg-transparent outline-none resize-none placeholder:text-gray-400" />}</div>
              <div className="flex items-center gap-4 mt-3">
                <div className="relative"><button onClick={() => setShowVariables(!showVariables)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-white bg-white">+ Add Variables</button>{showVariables && <VariablesDropdown onSelect={handleVariableInsert} onClose={() => setShowVariables(false)} />}</div>
                <button className="text-sm text-gray-600 hover:text-gray-900">Rewrite Prompt</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "configurations" && (
          <div className="space-y-4 pb-6">
            {/* Caller Configuration */}
            <div className="bg-white rounded-xl p-4">
              <button
                onClick={() => setShowCallerConfig(!showCallerConfig)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-base font-semibold text-[#1a1a1a]">Caller Configuration</h3>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showCallerConfig ? 'rotate-180' : ''}`} />
              </button>

              {showCallerConfig && (
                <div className="space-y-4">
                  {/* Voice Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">Voice</label>
                      <div className="relative">
                        <select
                          value={voiceModel}
                          onChange={(e) => setVoiceModel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                        >
                          {voiceOptions.map(voice => (
                            <option key={voice} value={voice}>{voice}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button className="w-10 h-10 bg-[#3C49F7] rounded-lg flex items-center justify-center hover:bg-[#2a35d4]">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-2 block">Language</label>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                        >
                          {languageOptions.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Background Audio */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Background audio</label>
                    <div className="relative">
                      <select
                        value={backgroundAudio}
                        onChange={(e) => setBackgroundAudio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                      >
                        {backgroundAudioOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    {/* Wait for Greetings */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Wait for Greetings</span>
                        <div
                          className="relative"
                          onMouseEnter={() => setShowTooltip({ ...showTooltip, waitForGreetings: true })}
                          onMouseLeave={() => setShowTooltip({ ...showTooltip, waitForGreetings: false })}
                        >
                          <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                            <span className="text-white text-[10px] font-medium">i</span>
                          </div>
                          {showTooltip.waitForGreetings && (
                            <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                              If enabled, the agent will wait for the call recipient to speak first before responding. Note: This is processed separately from the AI's decision making, and overrides it.
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setWaitForGreetings(!waitForGreetings)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${waitForGreetings ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waitForGreetings ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Noise Cancellation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Noise Cancellation</span>
                        <div
                          className="relative"
                          onMouseEnter={() => setShowTooltip({ ...showTooltip, noiseCancellation: true })}
                          onMouseLeave={() => setShowTooltip({ ...showTooltip, noiseCancellation: false })}
                        >
                          <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                            <span className="text-white text-[10px] font-medium">i</span>
                          </div>
                          {showTooltip.noiseCancellation && (
                            <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                              Enable noise cancellation to reduce background noise during your call. This feature uses advanced algorithms to filter out unwanted sounds, ensuring clearer communication.
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setNoiseCancellation(!noiseCancellation)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${noiseCancellation ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${noiseCancellation ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {/* Block Interruption */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Block Interruption</span>
                        <div
                          className="relative"
                          onMouseEnter={() => setShowTooltip({ ...showTooltip, blockInterruption: true })}
                          onMouseLeave={() => setShowTooltip({ ...showTooltip, blockInterruption: false })}
                        >
                          <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                            <span className="text-white text-[10px] font-medium">i</span>
                          </div>
                          {showTooltip.blockInterruption && (
                            <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                              The agent will not respond or process interruptions from the user.
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setBlockInterruption(!blockInterruption)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${blockInterruption ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${blockInterruption ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Retry Conditions */}
            <div className="bg-white rounded-xl p-4">
              <button
                onClick={() => setShowRetryConditions(!showRetryConditions)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-base font-semibold text-[#1a1a1a]">Retry Conditions</h3>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showRetryConditions ? 'rotate-180' : ''}`} />
              </button>

              {showRetryConditions && (
                <div className="space-y-4">
                  {/* Unanswered calls toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Unanswered calls</span>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip({ ...showTooltip, retryAttempts: true })}
                        onMouseLeave={() => setShowTooltip({ ...showTooltip, retryAttempts: false })}
                      >
                        <div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center cursor-help">
                          <span className="text-white text-[10px] font-medium">i</span>
                        </div>
                        {showTooltip.retryAttempts && (
                          <div className="absolute left-6 top-0 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg w-64 z-50">
                            Retry attempts are distributed randomly within the scheduled time range
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setRetryEnabled(!retryEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${retryEnabled ? 'bg-[#3C49F7]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${retryEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {retryEnabled && (
                    <>
                      <p className="text-xs text-gray-600">Maximum retry attempts for unanswered call</p>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            value={retryTimes}
                            onChange={(e) => setRetryTimes(Number(e.target.value))}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <span className="text-sm text-gray-700">times, after</span>

                        <input
                          type="number"
                          value={retryAfter}
                          onChange={(e) => setRetryAfter(Number(e.target.value))}
                          className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] text-center"
                          min={1}
                        />

                        <div className="relative">
                          <select
                            value={retryUnit}
                            onChange={(e) => setRetryUnit(e.target.value)}
                            className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"
                          >
                            <option value="Hours">Hours</option>
                            <option value="Minutes">Minutes</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Voicemail Behaviour */}
            <div className="bg-white rounded-xl p-4">
              <button
                onClick={() => setShowVoicemailBehaviour(!showVoicemailBehaviour)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-base font-semibold text-[#1a1a1a]">Voicemail Behaviour</h3>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showVoicemailBehaviour ? 'rotate-180' : ''}`} />
              </button>

              {showVoicemailBehaviour && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="voicemail"
                      value="Hangup"
                      checked={voicemailBehaviour === "Hangup"}
                      onChange={(e) => setVoicemailBehaviour(e.target.value)}
                      className="w-4 h-4 text-[#3C49F7] border-gray-300 focus:ring-[#3C49F7]"
                    />
                    <span className="text-sm text-gray-700">Hangup</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="voicemail"
                      value="Leave Message"
                      checked={voicemailBehaviour === "Leave Message"}
                      onChange={(e) => setVoicemailBehaviour(e.target.value)}
                      className="w-4 h-4 text-[#3C49F7] border-gray-300 focus:ring-[#3C49F7]"
                    />
                    <span className="text-sm text-gray-700">Leave Message</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals remain the same */}
      {showTestCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-1"><h3 className="text-xl font-semibold text-[#1a1a1a]">Test Call</h3><button onClick={() => setShowTestCallModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
            <p className="text-sm text-gray-600 mb-6">Set dynamic values to test the call accurately</p>
            <div className="mb-4"><div className="flex items-center gap-2 mb-2"><label className="text-sm font-medium text-gray-900">Call From</label><div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-medium">i</span></div></div><div className="relative"><select value={testCallData.callFrom} onChange={(e) => setTestCallData({ ...testCallData, callFrom: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7] bg-white appearance-none cursor-pointer"><option value="">-- Select a phone number --</option>{phoneNumbers.map((num) => <option key={num} value={num}>{num}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /></div></div>
            <div className="mb-4"><label className="text-sm font-medium text-gray-900 mb-2 block">Phone Number <span className="text-red-500">*</span></label><input type="text" value={testCallData.phoneNumber} onChange={(e) => setTestCallData({ ...testCallData, phoneNumber: e.target.value })} placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]" /></div>
            <div className="mb-6"><div className="flex items-center gap-2 mb-2"><label className="text-sm font-medium text-gray-900">Email</label><div className="w-4 h-4 bg-[#3C49F7] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-medium">i</span></div></div><input type="email" value={testCallData.email} onChange={(e) => setTestCallData({ ...testCallData, email: e.target.value })} placeholder="Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3C49F7]" /></div>
            <button onClick={handleStartCall} disabled={!testCallData.callFrom || !testCallData.phoneNumber} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${testCallData.callFrom && testCallData.phoneNumber ? "bg-[#3C49F7] text-white hover:bg-[#2a35d4]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Start Phone Call</button>
          </div>
        </div>
      )}
      {showGeneratingModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl"><h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">Wait for a few seconds,</h3><p className="text-gray-600 mb-6">We are generating your prompt for the call agent</p><div className="flex justify-center gap-2"><div className="w-2 h-2 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div></div></div>}
      {showSuccessModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl"><div className="w-16 h-16 bg-[#F2F2FF] rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-[#3C49F7]" /></div><h3 className="text-xl font-semibold text-[#1a1a1a] mb-6">AI Agent has initiated the test call.</h3><button onClick={() => setShowSuccessModal(false)} className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]">Close</button></div></div>}
    </div>
  );
};

// Empty Panel with Illustration
export const EmptyPanel = ({ illustration }) => {
  return (
    <div className="h-full bg-gradient-to-b from-[#E8EAFF] to-[#D8DBFF] rounded-xl flex items-center justify-center p-6">
      {illustration ? (
        <img src={illustration} alt="Select a step" className="max-w-full max-h-full object-contain rounded-xl" />
      ) : (
        <div className="text-center text-gray-500 bg-white/50 rounded-xl p-8">
          <p className="text-lg font-medium mb-2">No step selected</p>
          <p className="text-sm">Add a step from the left panel to configure it here</p>
        </div>
      )}
    </div>
  );
};

export default { EmailPanel, LinkedInPanel, WhatsAppPanel, TelegramPanel, ConditionPanel, CallPanel, EmptyPanel };