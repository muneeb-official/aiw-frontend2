import React, { useState } from "react";
import { ChevronLeft, Send, Search } from "lucide-react";
import { MeetingCheatsheetModal } from "../../components/modals/Modals";

// Mock Data
const upcomingMeetings = [
  { id: 1, time: "12:00 PM", title: "Onboarding the Platform", name: "Nikolaj Jørgensen", email: "nikolaj123@email.com", callTime: "Call At 12:30 PM, Sunday 12/01/26" },
  { id: 2, time: "12:30 PM", title: null },
  { id: 3, time: "01:00 PM", title: null },
  { id: 4, time: "01:30 PM", title: "Onboarding the Platform", name: "Nikolaj Jørgensen", email: "nikolaj123@email.com", callTime: "Call At 12:30 PM, Sunday 12/01/26" },
  { id: 5, time: "02:00 PM", title: null },
  { id: 6, time: "02:30 PM", title: null },
];

const meetingLogsData = [
  { id: 1, title: "Onboarding the Platform", summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", callTime: "12:30 PM, Sunday", date: "12/01/26" },
  { id: 2, title: "Onboarding the Platform", summary: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled", callTime: "12:30 PM, Sunday", date: "12/01/26" },
  { id: 3, title: "Onboarding the Platform", summary: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled", callTime: "12:30 PM, Sunday", date: "12/01/26" },
  { id: 4, title: "Onboarding the Platform", summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", callTime: "12:30 PM, Sunday", date: "12/01/26" },
  { id: 5, title: "Onboarding the Platform", summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", callTime: "12:30 PM, Sunday", date: "12/01/26" },
  { id: 6, title: "Onboarding the Platform", summary: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled", callTime: "12:30 PM, Sunday", date: "12/01/26" },
];

// Meeting Logs Screen
const MeetingLogsScreen = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = meetingLogsData.filter(log =>
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-normal text-gray-900">Meetings Logs</h1>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Enter here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-lg border border-gray-100 p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
            <div className="flex-1 pr-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{log.title}</h3>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Summary</span> {log.summary}
              </p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <p className="text-gray-600">Call At {log.callTime} <span className="font-semibold">{log.date}</span></p>
              <button className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">Listen to Recording</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Meeting Notetaker Page
const MeetingNotetakerPage = () => {
  const [showMeetingLogs, setShowMeetingLogs] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  if (showMeetingLogs) {
    return <MeetingLogsScreen onBack={() => setShowMeetingLogs(false)} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <h1 className="text-3xl font-normal text-gray-900 mb-6">Meeting Notetaker</h1>

        {/* Calendar Connected */}
        <div className="mb-2">
          <p className="text-gray-600 text-sm">Calendar Connected</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-gray-900">Google Calendar</h2>
            <button className="text-[#3C49F7] font-medium hover:text-[#3C49F7]/80">Calendar Settings</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-700 font-medium mb-2">Meetings Recorded</p>
            <p className="text-4xl font-semibold text-[#3C49F7]">32</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-700 font-medium mb-2">Average Meeting Duration</p>
            <p className="text-4xl font-semibold text-[#3C49F7]">3:20 min</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-700 font-medium mb-4">View All Meetings Logs</p>
            <button
              onClick={() => setShowMeetingLogs(true)}
              className="px-6 py-2.5 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#3C49F7]/90"
            >
              Meetings Logs
            </button>
          </div>
          <div className="bg-cyan-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <p className="text-xl font-semibold text-gray-900">In person Meeting</p>
            </div>
            <button className="px-5 py-2 bg-white text-[#3C49F7] rounded-full font-medium hover:bg-gray-50 border border-gray-200">
              Open Telegram
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <h2 className="text-2xl font-normal text-gray-900 mb-4">Upcoming Meetings</h2>

        <div className="space-y-0">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center">
              <div className="w-24 flex-shrink-0">
                <p className="text-gray-600 text-sm">{meeting.time}</p>
              </div>
              <div className="flex flex-col items-center mr-4">
                <div className={`w-0.5 h-8 ${meeting.title ? 'bg-orange-400' : 'bg-gray-200'}`} />
                <div className={`w-2 h-2 rounded-full ${meeting.title ? 'bg-orange-400' : 'bg-gray-300'}`} />
                <div className={`w-0.5 h-8 ${meeting.title ? 'bg-orange-400' : 'bg-gray-200'}`} />
              </div>
              {meeting.title ? (
                <div className="flex-1 bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-gray-600">
                      {meeting.name} <a href={`mailto:${meeting.email}`} className="text-[#3C49F7] hover:underline">{meeting.email}</a>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-gray-600">{meeting.callTime}</p>
                    <button className="px-5 py-2 border border-[#3C49F7] text-[#3C49F7] rounded-full font-medium hover:bg-blue-50">
                      Join Meeting
                    </button>
                    <button
                      onClick={() => { setSelectedMeeting(meeting); setShowCheatsheet(true); }}
                      className="px-5 py-2 bg-[#3C49F7] text-white rounded-full font-medium hover:bg-[#3C49F7]/90"
                    >
                      View Cheatsheet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-b border-dashed border-gray-200 h-16" />
              )}
            </div>
          ))}
        </div>
      </div>

      <MeetingCheatsheetModal
        isOpen={showCheatsheet}
        onClose={() => setShowCheatsheet(false)}
        meeting={selectedMeeting}
      />
    </div>
  );
};

export default MeetingNotetakerPage;