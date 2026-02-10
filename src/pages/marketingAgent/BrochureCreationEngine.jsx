import React, { useState, useRef } from "react";
import {
  ChevronDown,
  Settings,
  ArrowUpRight,
  X,
  Upload,
  ChevronLeft,
  Trash2,
  GripVertical,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Link,
  Image,
  Quote,
  Minus,
  Sparkles,
  Check,
} from "lucide-react";
import TemplatePicker from "./TemplatePicker";
import PresentationEditor from "./PresentationEditor";
import { TemplateLoadingModal } from "../../components/modals/Modals";

// Sample template data
const sampleTemplates = [
  { id: 1, title: "Company pitch deck", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" },
  { id: 2, title: "Marketing Strategy", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
  { id: 3, title: "Business Proposal", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" },
  { id: 4, title: "Annual Report", image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop" },
  { id: 5, title: "Product Launch", image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=300&fit=crop" },
  { id: 6, title: "Sales Presentation", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" },
  { id: 7, title: "Team Overview", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" },
  { id: 8, title: "Financial Report", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
];

// Dropdown options
const slideOptions = [5, 6, 7, 8, 9, 10];
const languageOptions = ["English", "Spanish", "French", "German", "Portuguese", "Italian"];
const toneOptions = ["Default", "Casual", "Professional", "Funny", "Educational", "Sales Pitch"];
const verbosityOptions = ["Concise", "Standard", "Text Heavy"];
const sortOptions = ["Most Recent Edited", "Alphabetic A-Z", "Last Seen"];



// Advanced Settings Modal
const AdvancedSettingsModal = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Advanced settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Tone */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tone</h3>
          <p className="text-sm text-gray-600 mb-3">Controls the writing style (e.g., casual, professional, funny).</p>
          <div className="relative">
            <select
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">- Select -</option>
              {toneOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Include table of contents */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Include table of contents</h3>
            <p className="text-sm text-gray-600">Controls the writing style (e.g., casual, professional, funny).</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, includeTableOfContents: !settings.includeTableOfContents })}
            className={`w-12 h-7 rounded-full transition-colors ${settings.includeTableOfContents ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.includeTableOfContents ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Web search */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Web search</h3>
            <p className="text-sm text-gray-600">Allow the model to consult the web for fresher facts.</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, webSearch: !settings.webSearch })}
            className={`w-12 h-7 rounded-full transition-colors ${settings.webSearch ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.webSearch ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Verbosity */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Verbosity</h3>
          <p className="text-sm text-gray-600 mb-3">Controls how detailed slide descriptions are: concise, standard, or text-heavy.</p>
          <div className="relative">
            <select
              value={settings.verbosity}
              onChange={(e) => setSettings({ ...settings, verbosity: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">- Select -</option>
              {verbosityOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Title slide */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Title slide</h3>
            <p className="text-sm text-gray-600">Include a title slide as the first slide.</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, titleSlide: !settings.titleSlide })}
            className={`w-12 h-7 rounded-full transition-colors ${settings.titleSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.titleSlide ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Instructions</h3>
          <p className="text-sm text-gray-600 mb-3">Optional guidance for the AI. These override defaults except format constraints.</p>
          <textarea
            value={settings.instructions}
            onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
            placeholder="Example: Focus on enterprise buyers, emphasize ROI and security compliance. Keep slides data-driven, avoid jargon, and include a short call-to-action on the final slide."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-6">Your data will get lost if you proceed. Are you sure</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50"
          >
            Yes, Proceed
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Generating Modal
const GeneratingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Please wait for a moment.</h3>
        <p className="text-gray-600 mb-6">We are generating your pitch Deck</p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};



// Slide Editor Component
const SlideEditor = ({ onBack, slides, setSlides }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const handleBackClick = () => {
    setShowConfirmation(true);
  };

  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showTemplateLoading, setShowTemplateLoading] = useState(false);
  const [showPresentationEditor, setShowPresentationEditor] = useState(false);

  // Add at the start of your BrochureCreationEngine component return
if (showPresentationEditor) {
  return <PresentationEditor onBack={() => setShowPresentationEditor(false)} />;
}

if (showTemplatePicker) {
  return (
    <>
      <TemplatePicker 
        onBack={() => setShowTemplatePicker(false)}
        onGenerate={(templateId) => {
          setShowTemplatePicker(false);
          setShowTemplateLoading(true);
          setTimeout(() => {
            setShowTemplateLoading(false);
            setShowPresentationEditor(true);
          }, 2500);
        }}
      />
      <TemplateLoadingModal isOpen={showTemplateLoading} />
    </>
  );
}

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <h1 className="text-xl text-gray-700">You can edit the content here.</h1>
          </div>
          <button 
  onClick={() => setShowTemplatePicker(true)}
  className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800"
>
  Continue Choosing a Template
</button>
        </div>
      </div>

      {/* Slides */}
      <div className="px-8 pb-8 space-y-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Slide Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400 cursor-grab" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Slide {index + 1}/{slides.length}</h3>
              </div>
              <button
                onClick={() => handleDeleteSlide(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Slide Title */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Slide Title</label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slide Content */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Slide Content</label>

              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 border border-gray-200 border-b-0 rounded-t-lg bg-gray-50">
                <button className="p-2 hover:bg-gray-200 rounded"><Undo size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Redo size={16} /></button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <select className="px-2 py-1 text-sm border-0 bg-transparent">
                  <option>Normal text</option>
                </select>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button className="p-2 hover:bg-gray-200 rounded"><Bold size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Italic size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Underline size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Strikethrough size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Code size={16} /></button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button className="p-2 hover:bg-gray-200 rounded"><List size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><ListOrdered size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Link size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Image size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Quote size={16} /></button>
                <button className="p-2 hover:bg-gray-200 rounded"><Minus size={16} /></button>
              </div>

              {/* Content Area */}
              <textarea
                value={slide.content}
                onChange={(e) => handleSlideChange(index, 'content', e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-b-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-none"
              />

              {/* Generate Button */}
              <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-900 text-white rounded-lg text-sm font-medium hover:bg-purple-800">
                <Sparkles size={16} className="text-yellow-400" />
                Generate Article with AI
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false);
          onBack();
        }}
      />
    </div>
  );
};

// Main Component
const BrochureCreationEngine = () => {
  const [activeTab, setActiveTab] = useState("presentation");
  const [selectedSlides, setSelectedSlides] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [contentText, setContentText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showSlidesDropdown, setShowSlidesDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Most Recent Edited");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [slides, setSlides] = useState([]);
  const [advancedSettings, setAdvancedSettings] = useState({
    tone: "",
    includeTableOfContents: true,
    webSearch: true,
    verbosity: "",
    titleSlide: true,
    instructions: "",
  });

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + "MB",
      progress: 0,
      type: file.name.split('.').pop().toUpperCase(),
    }));

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(progress, 100) } : f))
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Create sample slides
      const numSlides = parseInt(selectedSlides) || 5;
      const newSlides = Array.from({ length: numSlides }, (_, i) => ({
        id: i + 1,
        title: "How to Write an Engaging Book: A Guide for Aspiring Authors",
        content: "Britain's workforce is facing its biggest shake-up since the Industrial Revolution. AI technology and digital workers are no longer futuristic concepts—they're actively transforming how businesses operate from Edinburgh to London. Research shows AI can already replace millions of jobs worldwide, and experts warn that AI could reshape the UK employment landscape dramatically by 2025. Whether you're starting your career, changing jobs, or running a business, understanding the AI workforce revolution and developing crucial AI skills isn't optional anymore—it's essential for surviving and thriving in tomorrow's economy.",
      }));
      setSlides(newSlides);
      setShowSlideEditor(true);
    }, 2000);
  };

  // Show Slide Editor
  if (showSlideEditor) {
    return (
      <SlideEditor
        onBack={() => setShowSlideEditor(false)}
        slides={slides}
        setSlides={setSlides}
      />
    );
  }

  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat overflow-y-auto"

    >
      <div className="px-8 pt-8 pb-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <h1 className="text-3xl font-normal text-gray-900">Brochure Creation Engine</h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6">
          {/* Tabs and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("presentation")}
                className={`pb-2 font-medium transition-colors relative ${activeTab === "presentation" ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                Create Presentation
                {activeTab === "presentation" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("template")}
                className={`pb-2 font-medium transition-colors relative ${activeTab === "template" ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                Create Custom Template
                {activeTab === "template" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            </div>

            {activeTab === "presentation" && (
              <div className="flex items-center gap-3">
                {/* Select Slides Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSlidesDropdown(!showSlidesDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
                  >
                    {selectedSlides ? `${selectedSlides} Slides` : "- Select Slides -"}
                    <ChevronDown size={16} />
                  </button>
                  {showSlidesDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {slideOptions.map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setSelectedSlides(num.toString());
                            setShowSlidesDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Select Language Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
                  >
                    {selectedLanguage || "- Select Language -"}
                    <ChevronDown size={16} />
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setShowLanguageDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings Button */}
                <button
                  onClick={() => setShowAdvancedSettings(true)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Settings size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "presentation" ? (
            <>
              {/* Text Input Area */}
              <div className="relative mb-4">
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Start writing your content here..."
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none pr-12"
                />
                <button
                  onClick={handleGenerate}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-[#E8EAFF] rounded-full flex items-center justify-center hover:bg-[#d8dbff]"
                >
                  <ArrowUpRight size={20} className="text-blue-600" />
                </button>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
                        {file.type}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                      {file.progress < 100 && (
                        <div className="flex-1 max-w-[200px]">
                          <div className="h-1.5 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700"
                >
                  Upload Documents
                </button>
                <span className="text-sm text-gray-600">Upload document .pdf, .pptx, document and up to 5 MB.</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.pptx,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
              </div>
            </>
          ) : (
            /* Create Custom Template Tab */
            <>
              <p className="text-gray-700 font-medium mb-2">
                Upload your PDF or PPTX file to extract slides and convert them to a template which you can use to generate AI presentations.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Select a PDF or PowerPoint file (.pdf or .pptx) to process. Maximum file size: 100MB
              </p>

              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-blue-600" size={24} />
                </div>
                <p className="text-gray-700 mb-2">Drag your file(s) to start uploading</p>
                <p className="text-gray-500 text-sm mb-4">OR</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                >
                  Browse File
                </button>
              </div>

              {/* Uploaded Files for Template Tab */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
                        {file.type}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                      {file.progress < 100 && (
                        <div className="flex-1 max-w-[200px]">
                          <div className="h-1.5 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Most Recent Files Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Most Recents files</h3>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
                >
                  Sort By
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedSort(opt);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${selectedSort === opt ? "text-blue-600 font-medium" : ""
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-4 gap-4">
              {sampleTemplates.map((template) => (
                <div
                  key={template.id}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-purple-500">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-medium text-sm">{template.title}</p>
                  </div>
                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdvancedSettingsModal
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
        settings={advancedSettings}
        setSettings={setAdvancedSettings}
      />

      <GeneratingModal isOpen={isGenerating} />

      {/* Click outside to close dropdowns */}
      {(showSlidesDropdown || showLanguageDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowSlidesDropdown(false);
            setShowLanguageDropdown(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default BrochureCreationEngine;