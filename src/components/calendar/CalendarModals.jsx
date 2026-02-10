// components/calendar/CalendarModals.jsx
import { useState, useEffect, useRef } from "react";
import {
  TIMEZONE_OPTIONS,
  RECURRENCE_OPTIONS,
  NOTIFICATION_PRESETS,
  NOTIFICATION_TYPES,
  TIME_UNITS,
} from "../../context/CalendarContext";

// ============================================
// CREATE/EDIT MEETING MODAL (Image 1 style)
// ============================================
export const CreateMeetingModal = ({ isOpen, onClose, onSave, editEvent = null }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("Monday, January, 2026");
  const [startTime, setStartTime] = useState("4:00 PM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [isAllDay, setIsAllDay] = useState(false);
  const [guests, setGuests] = useState([]);
  const [guestInput, setGuestInput] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState("none");
  
  // Sub-modal states
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showCustomNotification, setShowCustomNotification] = useState(false);
  
  const fileInputRef = useRef(null);
  const notificationRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || "");
      setGuests(editEvent.guests || []);
      setDescription(editEvent.description || "");
      setAttachment(editEvent.attachment || null);
    } else {
      resetForm();
    }
  }, [editEvent, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setTitle("");
    setDate("Monday, January, 2026");
    setStartTime("4:00 PM");
    setEndTime("5:00 PM");
    setIsAllDay(false);
    setGuests([]);
    setGuestInput("");
    setDescription("");
    setAttachment(null);
    setNotification("none");
  };

  const handleAddGuest = (e) => {
    if (e.key === "Enter" && guestInput.trim()) {
      e.preventDefault();
      if (!guests.includes(guestInput.trim())) {
        setGuests([...guests, guestInput.trim()]);
      }
      setGuestInput("");
    }
  };

  const handleRemoveGuest = (email) => {
    setGuests(guests.filter((g) => g !== email));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({ name: file.name, url: URL.createObjectURL(file) });
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleNotificationSelect = (value) => {
    if (value === "custom") {
      setShowCustomNotification(true);
    } else {
      setNotification(value);
    }
    setShowNotificationDropdown(false);
  };

  const handleSave = () => {
    const eventData = {
      title: title || "No Title",
      date,
      startTime,
      endTime,
      isAllDay,
      guests,
      description,
      attachment,
      notification,
    };
    onSave(eventData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div 
          ref={modalRef}
          className="bg-white rounded-xl w-full max-w-[380px] shadow-xl"
        >
          <div className="p-5">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add Title"
              className="w-full text-lg font-medium text-[#1a1a1a] border-b border-gray-200 pb-3 mb-4 focus:outline-none focus:border-[#3C49F7] placeholder:text-gray-400"
            />

            {/* Date and Time */}
            <div className="mb-4">
              <p className="text-sm font-medium text-[#1a1a1a]">{date}</p>
              <p className="text-sm text-gray-500">{startTime} - {endTime}</p>
            </div>

            {/* Add Guests */}
            <div className="mb-4">
              <input
                type="email"
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyDown={handleAddGuest}
                placeholder="Add Guests"
                className="w-full text-sm text-gray-700 border-b border-gray-200 pb-2 focus:outline-none focus:border-[#3C49F7] placeholder:text-gray-400"
              />
              {guests.length > 0 && (
                <div className="mt-2 space-y-1">
                  {guests.map((email) => (
                    <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{email}</span>
                      <button onClick={() => handleRemoveGuest(email)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add Description"
                className="w-full text-sm text-gray-700 border-b border-gray-200 pb-2 focus:outline-none focus:border-[#3C49F7] placeholder:text-gray-400"
              />
            </div>

            {/* Google Drive Attachment */}
            <div className="mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-[#3C49F7] hover:underline"
              >
                Add a Google Drive Attachment
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              {attachment && (
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded mt-2">
                  <span className="text-sm text-gray-700">{attachment.name}</span>
                  <button onClick={handleRemoveAttachment} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div className="flex items-center justify-between mb-6" ref={notificationRef}>
              <span className="text-sm text-gray-600">Set Notification Settings</span>
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  {NOTIFICATION_PRESETS.find(o => o.value === notification)?.label || "Today"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showNotificationDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[180px]">
                    {NOTIFICATION_PRESETS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleNotificationSelect(option.value)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timezone Modal */}
      <TimezoneModal
        isOpen={showTimezoneModal}
        onClose={() => setShowTimezoneModal(false)}
        onSave={() => setShowTimezoneModal(false)}
      />

      {/* Custom Notification Modal */}
      <CustomNotificationModal
        isOpen={showCustomNotification}
        onClose={() => setShowCustomNotification(false)}
        onSave={(data) => {
          setNotification(`${data.notificationValue} ${data.notificationUnit} before`);
          setShowCustomNotification(false);
        }}
      />
    </>
  );
};

// ============================================
// EVENT DETAIL POPUP (Image 2 style)
// ============================================
export const EventDetailPopup = ({ event, onClose, onJoinMeeting, onViewCheatsheet }) => {
  if (!event) return null;

  const getRecurrenceText = () => {
    if (!event.recurrence) return null;
    if (event.recurrence.type === "weekly") {
      const untilDate = event.recurrence.until 
        ? new Date(event.recurrence.until).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "";
      return `Weekly on weekdays, until ${untilDate}`;
    }
    return null;
  };

  const formatEventDate = () => {
    // Format: Monday, January, 2026 4:00 PM - 5:00 PM
    return `Monday, January, 2026  ${event.startTime} – ${event.endTime}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl w-full max-w-[420px] shadow-xl p-6" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title with blue square */}
        <div className="flex items-start gap-3 mb-1">
          <div className="w-3 h-3 bg-[#3C49F7] rounded mt-1.5 flex-shrink-0" />
          <h3 className="text-xl font-semibold text-[#1a1a1a]">{event.title}</h3>
        </div>

        {/* Date, Time, Recurrence */}
        <div className="ml-6 mb-4">
          <p className="text-sm text-gray-600">{formatEventDate()}</p>
          {getRecurrenceText() && (
            <p className="text-sm text-gray-500">{getRecurrenceText()}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6 ml-6">
          <button
            onClick={onJoinMeeting}
            className="bg-[#3C49F7] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a35d4]"
          >
            Join Meeting
          </button>
          <button
            onClick={onViewCheatsheet}
            className="text-[#3C49F7] text-sm font-medium hover:underline"
          >
            View Cheatsheet
          </button>
        </div>

        {/* Guests */}
        {event.guests && event.guests.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-medium">{event.guests.length} Guests</span>
            </div>
            <div className="space-y-2 ml-7">
              {event.guests.map((guest, idx) => (
                <div key={idx} className="bg-[#F5F5F5] px-4 py-2.5 rounded-lg text-sm text-gray-700">
                  {guest}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="flex items-start gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Attachment */}
        {event.attachment && (
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="bg-[#F5F5F5] px-4 py-2.5 rounded-lg text-sm text-gray-700 flex-1">
              {event.attachment.name}
            </span>
          </div>
        )}

        {/* Notification */}
        {event.notification && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm text-gray-600">{event.notification}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MEETING CHEATSHEET MODAL (Image 3 style)
// ============================================
export const MeetingCheatsheetModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  // Sample cheatsheet data
  const cheatsheetData = {
    meeting: "Introduction Call",
    time: "12:30 PM, Sunday 12/01/26",
    attendees: [
      { name: "Jhon Doe", linkedin: true },
      { name: "David Cook", linkedin: true },
    ],
    sections: [
      {
        title: "Attendees Summary",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        title: "Conversation Starters & Topics of Intrest",
        bullets: [
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
          "But also the leap into electronic typesetting, remaining essentially unchanged.",
          "It was popularised in the 1960s with the release of Letraset sheets containing.",
          "Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        ],
      },
      {
        title: "Notable Connections",
        bullets: [
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
          "But also the leap into electronic typesetting, remaining essentially unchanged.",
          "It was popularised in the 1960s with the release of Letraset sheets containing.",
          "Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        ],
      },
      {
        title: "Key Preparation Points for Organisers",
        bullets: [],
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div 
        className="bg-white rounded-xl w-full max-w-[900px] shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-3">Meeting Cheatsheet</h2>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-600">Meeting</span>
                <span className="text-[#1a1a1a] ml-2 italic">{cheatsheetData.meeting}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Time</span>
                <span className="text-[#1a1a1a] ml-2">{cheatsheetData.time}</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Attendees</span>
                <span className="text-[#1a1a1a] ml-1">{cheatsheetData.attendees.length}</span>
                {cheatsheetData.attendees.map((attendee, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    {attendee.linkedin && (
                      <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    <span className="text-[#1a1a1a]">{attendee.name}</span>
                    {idx < cheatsheetData.attendees.length - 1 && <span>,</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-4">
          {cheatsheetData.sections.map((section, idx) => (
            <div key={idx} className="bg-[#F0F2FF] rounded-xl p-5">
              <h3 className="font-semibold text-[#1a1a1a] mb-3">{section.title}</h3>
              {section.content && (
                <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
              )}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2">
                  {section.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TIMEZONE MODAL
// ============================================
export const TimezoneModal = ({ isOpen, onClose, timezone, onSave }) => {
  const [useSeparateTimezones, setUseSeparateTimezones] = useState(false);
  const [startTimezone, setStartTimezone] = useState(timezone || "(GMT +05:00) - Indian Standard...");
  const [endTimezone, setEndTimezone] = useState("Today");
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-[340px] p-6">
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Event time zone</h3>
        
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={useSeparateTimezones}
            onChange={(e) => setUseSeparateTimezones(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#3C49F7] focus:ring-[#3C49F7]"
          />
          <span className="text-sm text-gray-600">Use separate start and end time zones</span>
        </label>

        {/* Start Timezone */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Event Start Time Zone</label>
          <div className="relative">
            <button
              onClick={() => setShowStartDropdown(!showStartDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="truncate">{startTimezone}</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showStartDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-full max-h-[200px] overflow-y-auto">
                {TIMEZONE_OPTIONS.map((tz) => (
                  <button
                    key={tz}
                    onClick={() => {
                      setStartTimezone(tz);
                      setShowStartDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {tz}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* End Timezone */}
        <div className={`mb-6 ${!useSeparateTimezones ? 'opacity-50' : ''}`}>
          <label className="block text-sm text-gray-600 mb-1">Event End Time Zone</label>
          <div className="relative">
            <button
              onClick={() => useSeparateTimezones && setShowEndDropdown(!showEndDropdown)}
              disabled={!useSeparateTimezones}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">{useSeparateTimezones ? endTimezone : "Today"}</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showEndDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-full max-h-[200px] overflow-y-auto">
                {TIMEZONE_OPTIONS.map((tz) => (
                  <button
                    key={tz}
                    onClick={() => {
                      setEndTimezone(tz);
                      setShowEndDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {tz}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(startTimezone);
              onClose();
            }}
            className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CUSTOM RECURRENCE MODAL
// ============================================
export const CustomRecurrenceModal = ({ isOpen, onClose, onSave }) => {
  const [repeatEvery, setRepeatEvery] = useState(3);
  const [repeatUnit, setRepeatUnit] = useState("week");
  const [repeatDays, setRepeatDays] = useState(["S", "M"]);
  const [endType, setEndType] = useState("never");
  const [endDate, setEndDate] = useState("Monday January, 26");
  const [endAfterOccurrences, setEndAfterOccurrences] = useState(3);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const toggleDay = (day, idx) => {
    const dayKey = `${day}-${idx}`;
    if (repeatDays.includes(dayKey)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayKey));
    } else {
      setRepeatDays([...repeatDays, dayKey]);
    }
  };

  const isDaySelected = (day, idx) => {
    return repeatDays.includes(`${day}-${idx}`) || repeatDays.includes(day);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-[300px] p-6">
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-6">Custom recurrence</h3>

        {/* Repeat Every */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-600">Repetition every</span>
          <input
            type="number"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(parseInt(e.target.value) || 1)}
            min={1}
            className="w-12 px-2 py-1 border border-gray-200 rounded text-sm text-center"
          />
          <div className="relative">
            <button
              onClick={() => setShowUnitDropdown(!showUnitDropdown)}
              className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded text-sm text-gray-700"
            >
              {repeatUnit}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUnitDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {["day", "week", "month", "year"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => {
                      setRepeatUnit(unit);
                      setShowUnitDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {unit}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Repeat On Days */}
        <div className="mb-6">
          <span className="text-sm text-gray-600 block mb-2">Repeat on</span>
          <div className="flex gap-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => toggleDay(day, idx)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  isDaySelected(day, idx)
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* End Options */}
        <div className="mb-6">
          <span className="text-sm text-gray-600 block mb-2">End</span>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === "never"}
                onChange={() => setEndType("never")}
                className="w-4 h-4 text-[#3C49F7]"
              />
              <span className="text-sm text-gray-700">Never</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === "on"}
                onChange={() => setEndType("on")}
                className="w-4 h-4 text-[#3C49F7]"
              />
              <span className="text-sm text-gray-700">On</span>
              <span className="text-sm text-gray-500">{endDate}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="endType"
                checked={endType === "after"}
                onChange={() => setEndType("after")}
                className="w-4 h-4 text-[#3C49F7]"
              />
              <span className="text-sm text-gray-700">After</span>
              <input
                type="number"
                value={endAfterOccurrences}
                onChange={(e) => setEndAfterOccurrences(parseInt(e.target.value) || 1)}
                min={1}
                className="w-10 px-2 py-0.5 border border-gray-200 rounded text-sm text-center"
              />
              <span className="text-sm text-gray-700">Occurrences</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={() => onSave({ repeatEvery, repeatUnit, repeatDays, endType, endDate, endAfterOccurrences })}
            className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CUSTOM NOTIFICATION MODAL
// ============================================
export const CustomNotificationModal = ({ isOpen, onClose, onSave }) => {
  const [notificationType, setNotificationType] = useState("notification");
  const [notificationValue, setNotificationValue] = useState(3);
  const [notificationUnit, setNotificationUnit] = useState("minutes");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-[320px] p-6">
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-6">Custom notification</h3>

        <div className="flex items-center gap-2 mb-6">
          {/* Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700"
            >
              {NOTIFICATION_TYPES.find(t => t.value === notificationType)?.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTypeDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {NOTIFICATION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setNotificationType(type.value);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Value Input */}
          <input
            type="number"
            value={notificationValue}
            onChange={(e) => setNotificationValue(parseInt(e.target.value) || 1)}
            min={1}
            className="w-12 px-2 py-2 border border-gray-200 rounded-lg text-sm text-center"
          />

          {/* Unit Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUnitDropdown(!showUnitDropdown)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700"
            >
              {TIME_UNITS.find(u => u.value === notificationUnit)?.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUnitDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {TIME_UNITS.map((unit) => (
                  <button
                    key={unit.value}
                    onClick={() => {
                      setNotificationUnit(unit.value);
                      setShowUnitDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {unit.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={() => onSave({ notificationType, notificationValue, notificationUnit })}
            className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  CreateMeetingModal,
  TimezoneModal,
  CustomRecurrenceModal,
  CustomNotificationModal,
  EventDetailPopup,
  MeetingCheatsheetModal,
};