// components/settings/CallAgentSettings.jsx
import { useState, useRef } from 'react';
import {
  TestCallModal,
  TestCallSuccessModal,
  SavePromptModal,
  PromptSavedModal,
  LoadPromptModal,
  FetchingPromptModal,
  AddVariablesDropdown
} from './SettingsModals';

// Variable Tag Component
const VariableTag = ({ variable }) => (
  <span className="inline-flex items-center px-2 py-0.5 mx-1 bg-purple-100 text-purple-800 text-sm rounded font-mono">
    {variable}
  </span>
);

// Text Editor with Variables
const VariableTextEditor = ({ 
  value, 
  onChange, 
  placeholder,
  showAddVariables = true,
  minHeight = "120px"
}) => {
  const textareaRef = useRef(null);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleAddVariableClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left
    });
    setShowVariablesDropdown(true);
  };

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + `{{${variable}}}` + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4;
        textarea.focus();
      }, 0);
    } else {
      onChange(value + `{{${variable}}}`);
    }
  };

  return (
    <div className="relative">
      <div 
        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#F8F9FC] focus-within:border-[#3C49F7] transition-colors"
        style={{ minHeight }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none focus:outline-none text-sm text-gray-700"
          style={{ minHeight: `calc(${minHeight} - 24px)` }}
        />
      </div>
      
      {showAddVariables && (
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleAddVariableClick}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            + Add Variables
          </button>
        </div>
      )}

      <AddVariablesDropdown
        isOpen={showVariablesDropdown}
        onClose={() => setShowVariablesDropdown(false)}
        onSelect={insertVariable}
        anchorPosition={{ position: 'fixed', ...dropdownPosition }}
      />
    </div>
  );
};

// Info Tooltip Component
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-[#3C49F7] ml-1"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 z-50">
          {text}
        </div>
      )}
    </div>
  );
};

// Three Dot Menu
const ThreeDotMenu = ({ onLoadPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]">
            <button
              onClick={() => { onLoadPrompt(); setIsOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Load Prompt
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-[#3C49F7]' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Custom Select Dropdown
const SelectDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-left bg-white hover:border-gray-300 transition-colors flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === option.value ? 'bg-gray-50 text-[#3C49F7]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Range Slider Component
const RangeSlider = ({ value, onChange, min, max, step = 1, labels = [], showValue = true }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative pt-6 pb-2">
        {/* Current Value Display */}
        {showValue && (
          <div 
            className="absolute -top-1 text-sm font-medium text-[#3C49F7]"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
          >
            {value}
          </div>
        )}
        
        {/* Slider Track */}
        <div className="relative h-1.5 bg-gray-200 rounded-full">
          <div 
            className="absolute h-full bg-[#3C49F7] rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {/* Slider Thumb */}
          <div 
            className="absolute w-4 h-4 bg-[#3C49F7] rounded-full -top-1.5 -ml-2 shadow-md"
            style={{ left: `${percentage}%` }}
          />
        </div>
        
        {/* Labels */}
        {labels.length > 0 && (
          <div className="flex justify-between mt-2">
            {labels.map((label, idx) => (
              <span key={idx} className="text-xs text-gray-500">{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Reset Button Component
const ResetButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 px-3 py-1.5 border border-[#3C49F7] text-[#3C49F7] rounded-full text-xs font-medium hover:bg-blue-50 transition-colors"
  >
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    -100
  </button>
);

// Disposition Option Component
const DispositionOption = ({ index, option, onChange, onRemove }) => (
  <div className="border border-gray-200 rounded-xl p-4 mb-4">
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Option Name {index}</label>
      <input
        type="text"
        value={option.name}
        onChange={(e) => onChange({ ...option, name: e.target.value })}
        placeholder="Enter option name (e.g. Intrested)"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Option Description {index}</label>
      <textarea
        value={option.description}
        onChange={(e) => onChange({ ...option, description: e.target.value })}
        placeholder="Explain this to Alex (e.g., The prospect has signs of intrest)"
        rows={3}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors resize-none"
      />
    </div>
  </div>
);

// Mock saved prompts
const mockPrompts = [
  { id: 1, name: 'Introducing Company', content: 'Hello {{first_name}}, I am calling from {{current_company}}...' },
  { id: 2, name: 'Abacus Corporate', content: 'Hi {{first_name}}, this is regarding...' },
];

// Voice options
const voiceOptions = [
  { value: 'eric', label: 'Eric (American English)' },
  { value: 'max', label: 'Max (American English)' },
  { value: 'anna', label: 'Anna (American English)' },
  { value: 'steve', label: 'Steve (Australia)' },
  { value: 'kyilye', label: 'Kyilye (Australia)' },
  { value: 'lily', label: 'Lily (British English)' },
];

// Language options
const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'danish', label: 'Danish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'dutch', label: 'Dutch' },
];

// Background audio options
const backgroundAudioOptions = [
  { value: 'off', label: 'Off' },
  { value: 'office', label: 'Office' },
];

// Model options
const modelOptions = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4i', label: 'GPT-4i' },
  { value: 'gpt-4i-mini', label: 'GPT-4i Mini' },
  { value: 'gpt-5', label: 'GPT-5' },
  { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
];

// Time unit options
const timeUnitOptions = [
  { value: 'hours', label: 'Hours' },
  { value: 'minutes', label: 'Minutes' },
];

// Number options (1-4)
const numberOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const CallAgentSettings = () => {
  // Tab states
  const [mainTab, setMainTab] = useState('callFlow');
  const [callTypeTab, setCallTypeTab] = useState('outbound');

  // Call Flow form states
  const [openingLine, setOpeningLine] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [callPrompt, setCallPrompt] = useState('');

  // Configuration states
  const [voice, setVoice] = useState('eric');
  const [language, setLanguage] = useState('english');
  const [backgroundAudio, setBackgroundAudio] = useState('office');
  const [interruptionThreshold, setInterruptionThreshold] = useState(200);
  const [voiceSpeed, setVoiceSpeed] = useState(0.9);
  const [creativeFreedom, setCreativeFreedom] = useState(0);
  const [waitForGreetings, setWaitForGreetings] = useState(true);
  const [noiseCancellation, setNoiseCancellation] = useState(true);
  const [blockInterruption, setBlockInterruption] = useState(true);

  // Disposition states
  const [dispositionDescription, setDispositionDescription] = useState('');
  const [dispositionOptions, setDispositionOptions] = useState([]);

  // Modal states
  const [showTestCallModal, setShowTestCallModal] = useState(false);
  const [showTestCallSuccess, setShowTestCallSuccess] = useState(false);
  const [showSavePromptModal, setShowSavePromptModal] = useState(false);
  const [showPromptSaved, setShowPromptSaved] = useState(false);
  const [showLoadPromptModal, setShowLoadPromptModal] = useState(false);
  const [showFetchingPrompt, setShowFetchingPrompt] = useState(false);
  const [fetchingMessage, setFetchingMessage] = useState('');

  // Handle Test Call
  const handleStartTestCall = (data) => {
    setShowTestCallModal(false);
    setTimeout(() => {
      setShowTestCallSuccess(true);
    }, 1000);
  };

  // Handle Save Prompt
  const handleSavePrompt = (title) => {
    setShowSavePromptModal(false);
    setTimeout(() => {
      setShowPromptSaved(true);
    }, 500);
  };

  // Handle Load Prompt
  const handleLoadPrompt = (prompt) => {
    setShowLoadPromptModal(false);
    setFetchingMessage('We are fetching your prompt.');
    setShowFetchingPrompt(true);
    
    setTimeout(() => {
      setShowFetchingPrompt(false);
      setCallPrompt(prompt.content);
    }, 2000);
  };

  // Handle Generate Prompt
  const handleGeneratePrompt = () => {
    if (!websiteUrl) return;
    
    setFetchingMessage('We are fixing your grammar and making it perfect.');
    setShowFetchingPrompt(true);
    
    setTimeout(() => {
      setShowFetchingPrompt(false);
      setCallPrompt(`Hello {{first_name}},

We're excited to share that {{current_company}} officially launches tomorrow.

AI Lead is built to help businesses find, qualify, and convert the right leads faster—using the power of AI. Our goal is simple: reduce manual effort, improve lead quality, and help teams focus on closing, not chasing.

Tomorrow marks the beginning of something we've worked hard to build, and we'd love for you to be part of this journey from day one.

Stay tuned for access details, product updates, and what's coming next. We will soon be on lookout for experienced {{job_title}} from {{current_company}}.

Thank you for your support—we can't wait to show you what AI Lead can do.`);
    }, 3000);
  };

  // Handle Rewrite Prompt
  const handleRewritePrompt = () => {
    if (!callPrompt) return;
    
    setFetchingMessage('We are fixing your grammar and making it perfect.');
    setShowFetchingPrompt(true);
    
    setTimeout(() => {
      setShowFetchingPrompt(false);
    }, 2000);
  };

  // Handle Add Disposition
  const handleAddDisposition = () => {
    setDispositionOptions([
      ...dispositionOptions,
      { id: Date.now(), name: '', description: '' }
    ]);
  };

  // Handle Update Disposition Option
  const handleUpdateDispositionOption = (index, updatedOption) => {
    const newOptions = [...dispositionOptions];
    newOptions[index] = updatedOption;
    setDispositionOptions(newOptions);
  };

  // Handle Save
  const handleSave = () => {
    console.log('Saving all settings...');
  };

  const mainTabs = [
    { key: 'callFlow', label: 'Call Flow' },
    { key: 'configurations', label: 'Configurations' },
    { key: 'disposition', label: 'Disposition' },
  ];

  const hasContent = openingLine || callPrompt;

  // Generate threshold labels
  const thresholdLabels = ['50', '100', '150', '200', '250', '300', '350', '400', '450', '500'];
  const speedLabels = ['0.7', '0.8', '0.9', '1', '1.1', '1.2'];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[32px] font-normal text-[#1a1a1a] font-['DM_Sans']">Call Agent Settings</h1>
            <p className="text-gray-600">Here you can keep track of all your integrations.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors"
          >
            Save
          </button>
        </div>

        {/* Main Tabs & Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {mainTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mainTab === tab.key
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTestCallModal(true)}
              disabled={!hasContent}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                hasContent
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Test Call
            </button>
            <button
              onClick={() => setShowSavePromptModal(true)}
              disabled={!hasContent}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                hasContent
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Prompt
            </button>
            <ThreeDotMenu onLoadPrompt={() => setShowLoadPromptModal(true)} />
          </div>
        </div>

        {/* ==================== CALL FLOW TAB ==================== */}
        {mainTab === 'callFlow' && (
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            {/* Outbound/Inbound Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setCallTypeTab('outbound')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  callTypeTab === 'outbound' ? 'text-[#1a1a1a]' : 'text-gray-500'
                }`}
              >
                Outbound Calls
                {callTypeTab === 'outbound' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]" />
                )}
              </button>
              <button
                onClick={() => setCallTypeTab('inbound')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  callTypeTab === 'inbound' ? 'text-[#1a1a1a]' : 'text-gray-500'
                }`}
              >
                Inbound Calls
                {callTypeTab === 'inbound' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]" />
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              Let's design the perfect call! Write a prompt to tell me how you want me to approach your prospect - what to say, what to ask, and what vibe you want. I'll handle the rest!
            </p>

            {/* Opening Line */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-[#1a1a1a] mb-2">
                Opening Line
                <InfoTooltip text="The first message that Alex will says" />
              </label>
              <VariableTextEditor
                value={openingLine}
                onChange={setOpeningLine}
                placeholder="Type your message content here."
                minHeight="100px"
              />
            </div>

            {/* Website URL */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-[#1a1a1a] mb-2">
                Website URL
                <InfoTooltip text="Enter the website URL to generate a prompt from" />
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://www.example.com"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
                />
                <button
                  onClick={handleGeneratePrompt}
                  disabled={!websiteUrl}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
                    websiteUrl
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Generate Prompt
                </button>
              </div>
            </div>

            {/* Call Prompt */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-[#1a1a1a] mb-2">
                Call Prompt
                <InfoTooltip text="The call prompt can be used to configure the context, role, personality, instructions and so on." />
              </label>
              <VariableTextEditor
                value={callPrompt}
                onChange={setCallPrompt}
                placeholder="Type your prompt here."
                minHeight="250px"
              />
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={handleRewritePrompt}
                  disabled={!callPrompt}
                  className={`text-sm font-medium transition-colors ${
                    callPrompt ? 'text-gray-700 hover:text-[#3C49F7]' : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Rewrite Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONFIGURATIONS TAB ==================== */}
        {mainTab === 'configurations' && (
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">Caller Configuration</h2>

            {/* Voice, Language, Background Audio Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                <SelectDropdown
                  value={voice}
                  onChange={setVoice}
                  options={voiceOptions}
                  placeholder="Select voice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <SelectDropdown
                  value={language}
                  onChange={setLanguage}
                  options={languageOptions}
                  placeholder="Select language"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background audio</label>
                <SelectDropdown
                  value={backgroundAudio}
                  onChange={setBackgroundAudio}
                  options={backgroundAudioOptions}
                  placeholder="Select audio"
                />
              </div>
            </div>

            {/* Interruption Threshold */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Interruption Threshold (ms)
                  <InfoTooltip text="Adjusts how patient the AI is when waiting for the user to finish speaking. Lower values mean the AI will respond more quickly, while higher values mean the AI will wait longer before responding." />
                </label>
                <ResetButton onClick={() => setInterruptionThreshold(100)} />
              </div>
              <RangeSlider
                value={interruptionThreshold}
                onChange={setInterruptionThreshold}
                min={50}
                max={500}
                step={10}
                labels={thresholdLabels}
              />
            </div>

            {/* Voice Speed */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Voice Speed
                  <InfoTooltip text="Adjusts the speaking speed of the AI agent." />
                </label>
                <ResetButton onClick={() => setVoiceSpeed(1.0)} />
              </div>
              <RangeSlider
                value={voiceSpeed}
                onChange={setVoiceSpeed}
                min={0.7}
                max={1.2}
                step={0.1}
                labels={speedLabels}
              />
            </div>

            {/* Creative Freedom */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Creative Freedom
                  <InfoTooltip text="A value that adjusts the calling agent's creativity – lower creativity follows rules strictly, while higher creativity allows more freedom and originality" />
                </label>
                <ResetButton onClick={() => setCreativeFreedom(50)} />
              </div>
              <div className="relative pt-6 pb-2">
                <div className="relative h-1.5 bg-gray-200 rounded-full">
                  <div 
                    className="absolute h-full bg-[#3C49F7] rounded-full"
                    style={{ width: `${creativeFreedom}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={creativeFreedom}
                    onChange={(e) => setCreativeFreedom(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="absolute w-4 h-4 bg-[#3C49F7] rounded-full -top-1.5 -ml-2 shadow-md"
                    style={{ left: `${creativeFreedom}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Not creative</span>
                  <span className="text-xs text-gray-500">Very Creative</span>
                </div>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Wait for Greetings
                  <InfoTooltip text="If enabled, the agent will wait for the call recipient to speak first before responding. Note: This is processed separately from the AI's decision making, and overrides it." />
                </label>
                <ToggleSwitch enabled={waitForGreetings} onChange={setWaitForGreetings} />
              </div>

              <div className="flex items-center justify-between py-3">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Noise Cancellation
                  <InfoTooltip text="Enable noise cancellation to reduce background noise during your call. This feature uses advanced algorithms to filter out unwanted sounds, ensuring clearer communication." />
                </label>
                <ToggleSwitch enabled={noiseCancellation} onChange={setNoiseCancellation} />
              </div>

              <div className="flex items-center justify-between py-3">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Block Interruption
                  <InfoTooltip text="The agent will not respond or process interruptions from the user." />
                </label>
                <ToggleSwitch enabled={blockInterruption} onChange={setBlockInterruption} />
              </div>
            </div>
          </div>
        )}

        {/* ==================== DISPOSITION TAB ==================== */}
        {mainTab === 'disposition' && (
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Define Call Disposition</h2>
            <p className="text-gray-600 text-sm mb-6">
              Help Alex define which optional call disposition options should be available on the Calls page
            </p>

            {dispositionOptions.length === 0 ? (
              <button
                onClick={handleAddDisposition}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                + Add call disposition
              </button>
            ) : (
              <>
                {/* Call Disposition Header */}
                <div className="border border-gray-200 rounded-xl p-4 mb-4">
                  <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">Call disposition</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disposition description</label>
                    <input
                      type="text"
                      value={dispositionDescription}
                      onChange={(e) => setDispositionDescription(e.target.value)}
                      placeholder="Help Alex intercept this disposition (e.g. is the prospect interested in the product?)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3C49F7] transition-colors"
                    />
                  </div>
                </div>

                {/* Disposition Options */}
                {dispositionOptions.map((option, index) => (
                  <DispositionOption
                    key={option.id}
                    index={index + 1}
                    option={option}
                    onChange={(updated) => handleUpdateDispositionOption(index, updated)}
                  />
                ))}

                <button
                  onClick={handleAddDisposition}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  + Add another option
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <TestCallModal
        isOpen={showTestCallModal}
        onClose={() => setShowTestCallModal(false)}
        onStartCall={handleStartTestCall}
      />
      <TestCallSuccessModal
        isOpen={showTestCallSuccess}
        onClose={() => setShowTestCallSuccess(false)}
      />
      <SavePromptModal
        isOpen={showSavePromptModal}
        onClose={() => setShowSavePromptModal(false)}
        onSave={handleSavePrompt}
        promptType="Prompt"
      />
      <PromptSavedModal
        isOpen={showPromptSaved}
        onClose={() => setShowPromptSaved(false)}
      />
      <LoadPromptModal
        isOpen={showLoadPromptModal}
        onClose={() => setShowLoadPromptModal(false)}
        onLoad={handleLoadPrompt}
        prompts={mockPrompts}
      />
      <FetchingPromptModal
        isOpen={showFetchingPrompt}
        message={fetchingMessage}
      />
    </div>
  );
};

export default CallAgentSettings;