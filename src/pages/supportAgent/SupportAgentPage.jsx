import React, { useState } from "react";
import { ChevronLeft, X, Check, ChevronDown, Info, MoreVertical, Play } from "lucide-react";
import MeetingNotetakerPage from "./MeetingNotetaker";

// Variable options for Add Variables dropdown
const variableOptions = ["First Name", "Last Name", "Full Name", "Job Title", "Current Company"];
const timezoneOptions = ["Eastern Time Zone (EST)", "Indian Standard Time (IST)", "Pacific Time (PST)"];
const timeOptions = ["01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
const voiceOptions = ["Eric (American English)", "Sarah (British English)", "James (Australian English)"];
const languageOptions = ["English", "Spanish", "French", "German"];
const backgroundAudioOptions = ["Office", "Cafe", "Silent", "Nature"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Sample data
const sampleEmails = [
  { id: 1, name: "Jhon Doe", count: 2, tag: "IMPORTANT", tagColor: "bg-red-500", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
  { id: 2, name: "Dana Osbor", count: 2, tag: "WARM LEADS", tagColor: "bg-blue-500", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
  { id: 3, name: "Agnes Pratt", count: 2, tag: "IMPORTANT", tagColor: "bg-red-500", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
  { id: 4, name: "Clint Estrad", count: 2, tag: "TODO", tagColor: "bg-yellow-400", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
  { id: 5, name: "Marcelo Dix", count: 2, tag: "WARM LEADS", tagColor: "bg-blue-500", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
  { id: 6, name: "Cameron Ai", count: 2, tag: "TODO", tagColor: "bg-yellow-400", preview: "Hi There!, We are really interested in getting the subscription for AI Workforce.", time: "12:20 PM" },
];

const upcomingCalls = [
  { id: 1, time: "12:00 PM", name: "Nikolaj Jørgensen", location: "London", phone: "+44-54123541623", scheduledTime: "At 5:30 PM - 6:00 PM", hasNotify: false },
  { id: 2, time: "12:30 PM", name: null },
  { id: 3, time: "01:00 PM", name: null },
  { id: 4, time: "01:30 PM", name: "Nikolaj Jørgensen", location: "London", phone: "+44-54123541623", scheduledTime: "At 5:30 PM - 6:00 PM", hasNotify: true },
  { id: 5, time: "02:00 PM", name: null },
  { id: 6, time: "02:00 PM", name: null },
  { id: 7, time: "02:00 PM", name: null },
  { id: 8, time: "02:00 PM", name: "Nikolaj Jørgensen", location: "London", phone: "+44-54123541623", scheduledTime: "At 5:30 PM - 6:00 PM", hasNotify: true },
];

// Modals
const RemoveNumberModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Are you sure?</h3>
        <p className="text-gray-600 mb-8">Your settings will be removed permanently if you proceed.<br />Are you sure</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onConfirm} className="px-6 py-2.5 border-2 border-[#3C49F7] text-[#3C49F7] rounded-full font-medium hover:bg-blue-50">Yes, Remove Number</button>
          <button onClick={onClose} className="px-8 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#3C49F7]/90">Close</button>
        </div>
      </div>
    </div>
  );
};

const AddNumberModal = ({ isOpen, onClose, onSubmit }) => {
  const [activeProvider, setActiveProvider] = useState("twilio");
  const [formData, setFormData] = useState({ name: "", number: "", accountSid: "", authToken: "" });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add your Number</h2>
            <p className="text-sm text-gray-600">Please fill your details.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveProvider("twilio")} className={`px-4 py-2 rounded-full text-sm font-medium ${activeProvider === "twilio" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Twilio</button>
          <button onClick={() => setActiveProvider("vonage")} className={`px-4 py-2 rounded-full text-sm font-medium ${activeProvider === "vonage" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Vonage</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Number <span className="text-red-500">*</span></label>
            <div className="relative mt-1">
              <button className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-left text-gray-500 flex items-center justify-between">{formData.number || "Enter your Number"}<ChevronDown size={16} /></button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Account SID <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter your Account SID" value={formData.accountSid} onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })} className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Auth Token <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Auth Token *" value={formData.authToken} onChange={(e) => setFormData({ ...formData, authToken: e.target.value })} className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button onClick={() => onSubmit(formData)} className="mt-6 w-full bg-[#3C49F7] text-white py-3 rounded-full font-medium hover:bg-[#3C49F7]/90">Import</button>
      </div>
    </div>
  );
};

const ConnectingModal = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Connecting and importing...</h2>
          <button className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-600 mb-6">We are importing your contact. Please wait and do not close this window.</p>
        <div className="flex justify-center gap-1">
          {[0, 150, 300, 450].map((delay) => (
            <div key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, provider = "Twilio" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Successfully Imported!</h3>
        <p className="text-gray-600 mb-6">We have successfully imported all of your contacts from your {provider} account.</p>
        <button onClick={onClose} className="px-8 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#3C49F7]/90">Cancel</button>
      </div>
    </div>
  );
};

// Add Variables Dropdown
const AddVariablesDropdown = ({ isOpen, onSelect, onClose }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
        {variableOptions.map((option) => (
          <button key={option} onClick={() => { onSelect(option); onClose(); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50">{option}</button>
        ))}
      </div>
    </>
  );
};

// Setup Assistant Screen
const SetupAssistantScreen = ({ onBack, phoneNumber = "+44 65124 64612" }) => {
  const [activeTab, setActiveTab] = useState("callFlow");
  const [assistantActive, setAssistantActive] = useState(true);
  const [agentName, setAgentName] = useState("");
  const [openingLine, setOpeningLine] = useState("Hello,\n\nMyself Jhon, I am Sales Executive at and launched a new product at the company.");
  const [callPrompt, setCallPrompt] = useState("Hello first_name,\n\nWe're excited to share that current_company officially launches tomorrow.");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(null);
  const [voice, setVoice] = useState("Eric (American English)");
  const [language, setLanguage] = useState("English");
  const [backgroundAudio, setBackgroundAudio] = useState("Office");
  const [advanceSettingsEnabled, setAdvanceSettingsEnabled] = useState(true);
  const [fromTime, setFromTime] = useState("12:00 PM");
  const [toTime, setToTime] = useState("6:00 PM");
  const [timezone, setTimezone] = useState("Eastern Time Zone (EST)");
  const [maxMinutes, setMaxMinutes] = useState("");
  const [activeDays, setActiveDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

  const toggleDay = (day) => setActiveDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  const handleAddVariable = (variable, field) => {
    const tag = `{{${variable.toLowerCase().replace(/ /g, "_")}}}`;
    if (field === "opening") setOpeningLine(prev => prev + ` ${tag}`);
    else if (field === "prompt") setCallPrompt(prev => prev + ` ${tag}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1 text-gray-700 hover:text-gray-900"><ChevronLeft size={20} /><span className="font-medium">Back</span></button>
            <h1 className="text-3xl font-normal text-gray-900">Setup Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#3C49F7] font-medium">Assistant Active</span>
            <button onClick={() => setAssistantActive(!assistantActive)} className={`w-12 h-7 rounded-full transition-colors ${assistantActive ? 'bg-[#3C49F7]' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${assistantActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Phone Number Connected</span>
            <a href="#" className="text-[#3C49F7] font-medium">{phoneNumber}</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">Inbound Call Logs</button>
            <button onClick={() => setShowRemoveModal(true)} className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">Remove Number</button>
            <button className="px-4 py-2 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#3C49F7]/90">Switch Phone Number</button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button onClick={() => setActiveTab("callFlow")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "callFlow" ? "bg-gray-900 text-white" : "text-gray-600"}`}>Call Flow</button>
            <button onClick={() => setActiveTab("configurations")} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "configurations" ? "bg-gray-900 text-white" : "text-gray-600"}`}>Configurations</button>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500">Test Call</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500">Save Prompt</button>
            <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
          </div>
        </div>

        {activeTab === "callFlow" ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Name Your Agent</label>
              <input type="text" placeholder="Name your Agent" value={agentName} onChange={(e) => setAgentName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C49F7]/20" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-700">Opening Line</label>
                <Info size={16} className="text-gray-400" />
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <textarea value={openingLine} onChange={(e) => setOpeningLine(e.target.value)} className="w-full bg-transparent text-sm text-gray-700 focus:outline-none min-h-[80px] resize-none" />
                <div className="relative mt-2">
                  <button onClick={() => setShowVariablesDropdown(showVariablesDropdown === "opening" ? null : "opening")} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white">+ Add Variables</button>
                  <AddVariablesDropdown isOpen={showVariablesDropdown === "opening"} onSelect={(v) => handleAddVariable(v, "opening")} onClose={() => setShowVariablesDropdown(null)} />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-700">Call Prompt</label>
                <Info size={16} className="text-gray-400" />
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <textarea value={callPrompt} onChange={(e) => setCallPrompt(e.target.value)} className="w-full bg-transparent text-sm text-gray-700 focus:outline-none min-h-[200px] resize-none" />
                <div className="relative mt-2">
                  <button onClick={() => setShowVariablesDropdown(showVariablesDropdown === "prompt" ? null : "prompt")} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white">+ Add Variables</button>
                  <AddVariablesDropdown isOpen={showVariablesDropdown === "prompt"} onSelect={(v) => handleAddVariable(v, "prompt")} onClose={() => setShowVariablesDropdown(null)} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Caller Configuration</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Voice</label>
                  <div className="flex gap-2">
                    <select value={voice} onChange={(e) => setVoice(e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                      {voiceOptions.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50"><Play size={18} className="text-gray-600" /></button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                    {languageOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Background audio</label>
                  <select value={backgroundAudio} onChange={(e) => setBackgroundAudio(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                    {backgroundAudioOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Advance Assistant Settings</h3>
                <button onClick={() => setAdvanceSettingsEnabled(!advanceSettingsEnabled)} className={`w-12 h-7 rounded-full transition-colors ${advanceSettingsEnabled ? 'bg-[#3C49F7]' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${advanceSettingsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {advanceSettingsEnabled && (
                <>
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">AI Assistant Active Hours</label>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">From</label>
                        <select value={fromTime} onChange={(e) => setFromTime(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                          {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">To</label>
                        <select value={toTime} onChange={(e) => setToTime(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                          {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Select Timezone</label>
                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                          {timezoneOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Limit Max Minutes</label>
                        <select value={maxMinutes} onChange={(e) => setMaxMinutes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none appearance-none bg-white">
                          <option value="">-- Select --</option>
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Active Days</label>
                    <div className="flex gap-2">
                      {daysOfWeek.map(day => (
                        <button key={day} onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${activeDays.includes(day) ? "bg-white border-gray-300 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-400"}`}>{day}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <RemoveNumberModal isOpen={showRemoveModal} onClose={() => setShowRemoveModal(false)} onConfirm={() => { setShowRemoveModal(false); onBack(); }} />
    </div>
  );
};

// Email Review Screen
const EmailReviewScreen = ({ onBack }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-700 hover:text-gray-900"><ChevronLeft size={20} /><span className="font-medium">Back</span></button>
      </div>
      <div className="px-6">
        {sampleEmails.map((email) => (
          <div key={email.id} onClick={() => setSelectedEmail(email)} className={`flex items-center py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedEmail?.id === email.id ? "bg-gray-50" : ""}`}>
            <span className="font-semibold text-gray-900 w-32">{email.name}</span>
            <span className="text-gray-500 text-sm w-6">{email.count}</span>
            <span className={`${email.tagColor} text-white text-xs px-2 py-1 rounded font-medium mr-4`}>{email.tag}</span>
            <span className="flex-1 text-sm text-gray-600 truncate">{email.preview}</span>
            <span className="text-sm text-gray-500 ml-4">{email.time}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 mx-6 mt-4 mb-6 border border-gray-200 rounded-xl">
        {selectedEmail ? (
          <div className="p-6 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEmail.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">Meeting Scheduled</span>
                <span className={`${selectedEmail.tagColor} text-white text-xs px-2 py-1 rounded font-medium`}>{selectedEmail.tag}</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-[#E8EAFF]/30 p-4 rounded-lg border-l-4 border-[#3C49F7]">
                <p className="text-gray-700">Hi There!,</p>
                <p className="text-gray-700 mt-2">We are really interested in getting the subscription for AI Workforce. We wanted to know more bout the platform.</p>
              </div>
              <div className="bg-[#E8EAFF]/30 p-4 rounded-lg border-l-4 border-[#3C49F7]">
                <p className="text-gray-700">Hi,</p>
                <p className="text-gray-700 mt-2">I'd like to schedule a quick discussion to take things forward. Please share your availability and a suitable time.</p>
                <p className="text-gray-700 mt-4">Best,<br />Raymond</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-4">
                <button className="text-[#3C49F7] font-medium hover:text-[#3C49F7]/80">Re Draft</button>
                <button className="text-[#3C49F7] font-medium hover:text-[#3C49F7]/80">Fix Grammar</button>
              </div>
              <button className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#3C49F7]/90">Send Email</button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center"><p className="text-gray-500">No Email Selected</p></div>
        )}
      </div>
    </div>
  );
};

// Personal Assistant Dashboard
const PersonalAssistantDashboard = ({ onConnectAccount, onReviewEmails, onSettings, isConnected }) => (
  <div className="h-full overflow-y-auto">
    <div className="p-8">
      <h1 className="text-3xl font-normal text-gray-900 mb-8">Personal Assistant Agent</h1>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl text-gray-900 mb-1">Your AI executive assistant for Inbound calls</h2>
          <p className="text-lg text-gray-700">Setup the AI assistant.</p>
        </div>
        <button onClick={isConnected ? onSettings : onConnectAccount} className="text-[#3C49F7] font-medium hover:text-[#3C49F7]/80">{isConnected ? "Settings" : "Connect Your Account"}</button>
      </div>
      <div className="flex items-center justify-between mb-8 py-4 border-t border-gray-100">
        <div>
          <h2 className="text-2xl text-gray-900 mb-1">E-mails pending approval</h2>
          <p className="text-lg text-gray-700">List of emails you have received from end customers.</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-5xl font-bold text-[#3C49F7]">{isConnected ? "12" : "32"}</span>
          <button onClick={onReviewEmails} className="text-[#3C49F7] font-medium hover:text-[#3C49F7]/80">Review Emails</button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[{ label: "Inbound Calls Answered", value: "32" }, { label: "Meeting Scheduled From Inbound Calls", value: "12" }, { label: "Average Call Duration", value: "3:20 min" }, { label: "Calling Credits Left", value: "324" }, { label: "Minutes Spend On Inbound Calls", value: "115" }].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#3C49F7]/20 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-[#3C49F7]">{stat.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-normal text-gray-900 mb-6">Upcoming Inbound Calls</h2>
      <div className="space-y-0">
        {upcomingCalls.map((call, index) => (
          <div key={call.id} className="flex items-center">
            <div className="w-24 pr-4"><span className="text-sm font-medium text-gray-600">{call.time}</span></div>
            <div className="relative flex flex-col items-center">
              <div className={`w-0.5 h-8 ${call.name ? 'bg-[#3C49F7]' : 'bg-gray-200'}`} />
              {index < upcomingCalls.length - 1 && <div className="w-0.5 h-8 bg-gray-200" />}
            </div>
            <div className="flex-1 ml-4 py-2">
              {call.name ? (
                <div className="bg-[#E8EAFF]/50 rounded-xl px-6 py-4 flex items-center justify-between">
                  <div><span className="font-semibold text-gray-900">{call.name}</span><span className="text-gray-600 ml-1">from {call.location}</span></div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">{call.phone}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700">{call.scheduledTime}</span>
                    {call.hasNotify && <button className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">Notify Me</button>}
                  </div>
                </div>
              ) : (
                <div className="h-8 border-b border-dashed border-gray-200" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main Support Agent Page
const SupportAgentPage = ({ activeSupportTab = "personal" }) => {
  const [showAddNumberModal, setShowAddNumberModal] = useState(false);
  const [showConnectingModal, setShowConnectingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailReview, setShowEmailReview] = useState(false);
  const [showSetupAssistant, setShowSetupAssistant] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleImport = (formData) => {
    setShowAddNumberModal(false);
    setShowConnectingModal(true);
    setTimeout(() => { setShowConnectingModal(false); setShowSuccessModal(true); }, 2000);
  };

  const handleSuccessClose = () => { setShowSuccessModal(false); setIsConnected(true); setShowSetupAssistant(true); };

  if (showSetupAssistant && activeSupportTab === "personal") {
    return <div className="h-full bg-white/50"><SetupAssistantScreen onBack={() => setShowSetupAssistant(false)} phoneNumber="+44 65124 64612" /></div>;
  }

  if (showEmailReview) {
    return (
      <div className="h-full bg-white/50">
        <EmailReviewScreen onBack={() => setShowEmailReview(false)} />
        <AddNumberModal isOpen={showAddNumberModal} onClose={() => setShowAddNumberModal(false)} onSubmit={handleImport} />
        <ConnectingModal isOpen={showConnectingModal} />
        <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} />
      </div>
    );
  }

  return (
    <div className="h-full bg-white/50">
      {activeSupportTab === "personal" ? (
        <PersonalAssistantDashboard onConnectAccount={() => setShowAddNumberModal(true)} onReviewEmails={() => setShowEmailReview(true)} onSettings={() => setShowSetupAssistant(true)} isConnected={isConnected} />
      ) : activeSupportTab === "meeting" ? (
        <MeetingNotetakerPage />
      ) : (
        <div className="flex items-center justify-center h-full"><div className="text-center"><h2 className="text-2xl font-semibold text-gray-700">Coming Soon</h2></div></div>
      )}
      <AddNumberModal isOpen={showAddNumberModal} onClose={() => setShowAddNumberModal(false)} onSubmit={handleImport} />
      <ConnectingModal isOpen={showConnectingModal} />
      <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} />
    </div>
  );
};

export default SupportAgentPage;