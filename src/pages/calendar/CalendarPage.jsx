// pages/calendar/CalendarPage.jsx
import { useState, useEffect, useRef } from "react";
import { 
  CreateMeetingModal, 
  EventDetailPopup,
  MeetingCheatsheetModal 
} from "../../components/calendar/CalendarModals";
import { 
  useCalendar, 
  CalendarProvider 
} from "../../context/CalendarContext";

// Helper functions
const DAYS = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = (date) => {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
};

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days = [];
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }
  
  return days;
};

// Calendar Content Component
const CalendarContent = () => {
  const { 
    events, 
    selectedDate, 
    setSelectedDate, 
    viewMode, 
    setViewMode,
    getEventsForDate,
    createEvent 
  } = useCalendar();
  
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [cheatsheetEvent, setCheatsheetEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [showNewEventTooltip, setShowNewEventTooltip] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  
  const viewDropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target)) {
        setShowViewDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCreateMeeting = async (eventData) => {
    await createEvent({
      ...eventData,
      date: selectedDate.toISOString().split("T")[0],
    });
    setShowCreateModal(false);
    
    // Switch to Today view after creating meeting
    setViewMode("today");
    
    // Show tooltip if title is empty or "No Title"
    if (!eventData.title || eventData.title === "No Title") {
      setNewEventTitle("Enter Title");
      setShowNewEventTooltip(true);
      setTimeout(() => setShowNewEventTooltip(false), 3000);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleViewCheatsheet = () => {
    setCheatsheetEvent(selectedEvent);
    setSelectedEvent(null);
    setShowCheatsheet(true);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setShowViewDropdown(false);
  };

  const monthDays = getMonthDays(currentYear, currentMonth);
  const todayEvents = getEventsForDate(selectedDate);

  // Check if an event is happening now/soon (for Join Meeting only vs Notify Me + Join Meeting)
  const isEventSoon = (event) => {
    const eventIndex = todayEvents.findIndex(e => e.id === event.id);
    return eventIndex === 0;
  };

  return (
    <div className="flex-1 min-h-full p-8 overflow-y-auto bg-[#F8F9FC]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-normal text-[#1a1a1a] font-['DM_Sans']">
            Calander
          </h1>
          <span className="text-lg text-gray-600">
            {formatDate(new Date(currentYear, currentMonth, selectedDate.getDate()))}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Dropdown */}
          <div className="relative" ref={viewDropdownRef}>
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white"
            >
              {viewMode === "month" ? "Month" : "Today"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showViewDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => handleViewModeChange("month")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${viewMode === "month" ? "text-[#3C49F7]" : "text-gray-700"}`}
                >
                  Month
                </button>
                <button
                  onClick={() => handleViewModeChange("today")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${viewMode === "today" ? "text-[#3C49F7]" : "text-gray-700"}`}
                >
                  Today
                </button>
              </div>
            )}
          </div>

          {/* Create Meeting Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4] transition-colors"
          >
            Create Meeting
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === "month" ? (
        // Month View
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map((day, idx) => (
              <div key={idx} className="py-3 text-center border-r border-gray-100 last:border-r-0">
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((dayInfo, idx) => {
              const dayEvents = events.filter(
                (e) => e.date === dayInfo.date.toISOString().split("T")[0]
              );
              const isToday = dayInfo.date.toDateString() === new Date().toDateString();
              const showMonthLabel = dayInfo.date.getDate() === 1 || idx < 7;
              
              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !dayInfo.isCurrentMonth ? "bg-gray-50/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(dayInfo.date);
                    if (dayEvents.length > 0) {
                      setViewMode("today");
                    }
                  }}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-medium mb-1 ${
                        !dayInfo.isCurrentMonth
                          ? "text-gray-400"
                          : isToday
                          ? "text-[#3C49F7]"
                          : "text-gray-700"
                      }`}
                    >
                      {showMonthLabel && dayInfo.date.getDate() === 1
                        ? `${MONTHS[dayInfo.date.getMonth()].slice(0, 3)} ${dayInfo.date.getDate()}`
                        : dayInfo.date.getDate()}
                    </span>
                    
                    {/* Event Pills */}
                    <div className="flex flex-col gap-1 flex-1">
                      {dayEvents.slice(0, 2).map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className="bg-[#E8E4F7] text-[#1a1a1a] text-xs px-2 py-1 rounded truncate cursor-pointer hover:bg-[#DCD6F0] transition-colors"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Today/Day View
        <div className="bg-white rounded-2xl overflow-hidden">
          {todayEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No meetings scheduled for today
            </div>
          ) : (
            <div>
              {/* Time slots with events */}
              {todayEvents.map((event, idx) => (
                <div key={event.id} className="flex items-center border-b border-gray-100 last:border-b-0">
                  {/* Time Column */}
                  <div className="w-28 flex-shrink-0 py-4 pl-6 relative">
                    <span className="text-sm text-gray-500">{event.startTime}</span>
                    {/* Purple indicator line for first event */}
                    {idx === 0 && (
                      <div className="absolute right-0 top-4 bottom-4 w-1 bg-[#B4A7F5] rounded-full" />
                    )}
                  </div>
                  
                  {/* Event Card */}
                  <div 
                    className="flex-1 flex items-center justify-between py-4 pr-6 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {event.title === "No Title" ? (
                          <span className="text-gray-400">No Title</span>
                        ) : (
                          <>
                            {event.title}
                            {event.location && (
                              <span className="font-normal text-gray-500"> from {event.location}</span>
                            )}
                          </>
                        )}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Phone */}
                      {event.phone && (
                        <span className="text-sm text-gray-600">{event.phone}</span>
                      )}
                      
                      {/* Separator */}
                      {event.phone && <span className="text-gray-300">|</span>}
                      
                      {/* Time Range */}
                      <span className="text-sm text-gray-600">
                        At {event.startTime} - {event.endTime}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!isEventSoon(event) && (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 border border-[#3C49F7] text-[#3C49F7] rounded-full text-sm font-medium hover:bg-[#F7F7FF]"
                          >
                            Notify Me
                          </button>
                        )}
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-[#3C49F7] text-white rounded-full text-sm font-medium hover:bg-[#2a35d4]"
                        >
                          Join Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty time slots */}
              {[...Array(Math.max(0, 8 - todayEvents.length))].map((_, idx) => (
                <div key={`empty-${idx}`} className="flex items-center border-b border-gray-100 last:border-b-0">
                  <div className="w-28 flex-shrink-0 py-4 pl-6">
                    <span className="text-sm text-gray-500">02:00 PM</span>
                  </div>
                  <div className="flex-1 py-4 pr-6">
                    <div className="border-b border-dashed border-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tooltip for new event without title */}
      {showNewEventTooltip && (
        <div className="fixed left-20 top-64 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-50">
          {newEventTitle}
        </div>
      )}

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateMeeting}
      />

      {/* Event Detail Popup */}
      {selectedEvent && (
        <EventDetailPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoinMeeting={() => {
            console.log("Join meeting:", selectedEvent.id);
            setSelectedEvent(null);
          }}
          onViewCheatsheet={handleViewCheatsheet}
        />
      )}

      {/* Meeting Cheatsheet Modal */}
      <MeetingCheatsheetModal
        isOpen={showCheatsheet}
        onClose={() => {
          setShowCheatsheet(false);
          setCheatsheetEvent(null);
        }}
        event={cheatsheetEvent}
      />
    </div>
  );
};

// Main CalendarPage with Provider
const CalendarPage = () => {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
};

export default CalendarPage;