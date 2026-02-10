import React, { useState } from 'react';
import { Search, MoreVertical, ChevronDown, FileText, Download } from 'lucide-react';

// Sample data with new columns
const sampleCallLogs = [
  { id: 1, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
  { id: 2, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
  { id: 3, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
  { id: 4, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
  { id: 5, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
  { id: 6, phoneNumber: '+44- 651234123125', calledAt: '12:00 PM', day: 'Sunday', date: '12/01/26', callDuration: '5:20 min', summary: 'Caller wanted to book an appointment.', transcript: 'Assistant: Hello how may I help...' },
];

const sortOptions = [
  { id: 'today', label: 'Today' },
  { id: 'lastWeek', label: 'Last Week' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'thisQuarter', label: 'This Quarter' },
  { id: 'custom', label: 'Custom' },
];

const CallActionMenu = ({ onClose, onViewTranscript, onDownloadRecording }) => {
  return (
    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[180px]">
      <button
        onClick={() => {
          onViewTranscript();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
      >
        <FileText size={16} className="text-gray-500" />
        View transcript
      </button>
      <button
        onClick={() => {
          onDownloadRecording();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
      >
        <Download size={16} className="text-gray-500" />
        Download recording
      </button>
    </div>
  );
};

const SortByDropdown = ({ selectedSort, onSelect, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Sort By
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onToggle();
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                selectedSort === option.id ? 'text-[#3C49F7] font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CallLogsPage = () => {
  const [activeTab, setActiveTab] = useState('inbound');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('today');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedCalls, setSelectedCalls] = useState([]);

  const tabs = [
    { id: 'inbound', label: 'Inbound Calls' },
    { id: 'outbound', label: 'Outbound Calls' },
  ];

  const toggleSelectAll = () => {
    if (selectedCalls.length === sampleCallLogs.length) {
      setSelectedCalls([]);
    } else {
      setSelectedCalls(sampleCallLogs.map(call => call.id));
    }
  };

  const toggleSelectCall = (callId) => {
    setSelectedCalls(prev => 
      prev.includes(callId) 
        ? prev.filter(id => id !== callId)
        : [...prev, callId]
    );
  };

  const filteredCalls = sampleCallLogs.filter(call => 
    call.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTranscript = (callId) => {
    console.log('View transcript for call:', callId);
  };

  const handleDownloadRecording = (callId) => {
    console.log('Download recording for call:', callId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <h1 className="text-3xl font-normal text-gray-900">Call logs</h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search the phone number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C49F7]/20 focus:border-[#3C49F7]"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-[#3C49F7] text-sm font-medium hover:text-[#3C49F7]/80">
                Export List
              </button>
              <SortByDropdown 
                selectedSort={selectedSort}
                onSelect={setSelectedSort}
                isOpen={sortDropdownOpen}
                onToggle={() => setSortDropdownOpen(!sortDropdownOpen)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_minmax(150px,1fr)_100px_90px_90px_100px_minmax(150px,1.2fr)_minmax(140px,1fr)_40px] gap-2 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCalls.length === sampleCallLogs.length && sampleCallLogs.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-[#3C49F7] focus:ring-[#3C49F7]"
                />
              </div>
              <div className="text-sm font-medium text-gray-500">Phone Number</div>
              <div className="text-sm font-medium text-gray-500">Called At</div>
              <div className="text-sm font-medium text-gray-500">Day</div>
              <div className="text-sm font-medium text-gray-500">Date</div>
              <div className="text-sm font-medium text-gray-500">Call Duration</div>
              <div className="text-sm font-medium text-gray-500">Summary</div>
              <div className="text-sm font-medium text-gray-500">Transcript</div>
              <div></div>
            </div>

            {/* Table Body */}
            <div>
              {filteredCalls.map((call, index) => (
                <div
                  key={call.id}
                  className={`grid grid-cols-[40px_minmax(150px,1fr)_100px_90px_90px_100px_minmax(150px,1.2fr)_minmax(140px,1fr)_40px] gap-2 px-4 py-4 items-center relative ${
                    index % 2 === 0 ? 'bg-[#F8F9FF]' : 'bg-white'
                  } hover:bg-[#E8EAFF]/40 transition-colors`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCalls.includes(call.id)}
                      onChange={() => toggleSelectCall(call.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#3C49F7] focus:ring-[#3C49F7]"
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{call.phoneNumber}</div>
                  <div className="text-sm text-gray-600">{call.calledAt}</div>
                  <div className="text-sm text-gray-600">{call.day}</div>
                  <div className="text-sm text-gray-600">{call.date}</div>
                  <div className="text-sm text-gray-600">{call.callDuration}</div>
                  <div className="text-sm text-gray-600">{call.summary}</div>
                  <div className="text-sm text-gray-600 truncate">{call.transcript}</div>
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === call.id ? null : call.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === call.id && (
                      <CallActionMenu 
                        onClose={() => setOpenMenuId(null)}
                        onViewTranscript={() => handleViewTranscript(call.id)}
                        onDownloadRecording={() => handleDownloadRecording(call.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(sortDropdownOpen || openMenuId) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setSortDropdownOpen(false);
            setOpenMenuId(null);
          }}
        />
      )}
    </div>
  );
};

export default CallLogsPage;