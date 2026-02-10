// context/CalendarContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const CalendarContext = createContext(null);

// Sample events data - Replace with API calls for backend integration
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2026-01-26",
    startTime: "12:00 PM",
    endTime: "6:00 PM",
    isAllDay: false,
    guests: ["user@xyz.com", "trial@xyz.com"],
    description: "Will share the who we are and how it is beneficial for business growth.",
    attachment: null,
    recurrence: null,
    notification: "30 min before",
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 2,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2026-01-26",
    startTime: "01:30 PM",
    endTime: "6:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: "30 min before",
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 3,
    title: "Sales Pitch to Jacob Founding member",
    location: "",
    phone: "+44-54123541623",
    date: "2026-01-26",
    startTime: "02:00 PM",
    endTime: "6:00 PM",
    isAllDay: false,
    guests: ["user@xyz.com", "trial@xyz.com"],
    description: "Will share the who we are and how it is beneficial for business growth.",
    attachment: { name: "Pitch Deck.pdf", url: "#" },
    recurrence: { type: "weekly", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], until: "2026-03-17" },
    notification: "30 min before",
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 4,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2026-01-26",
    startTime: "02:00 PM",
    endTime: "6:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  // Events for calendar month view
  {
    id: 5,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-28",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 6,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-28",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 7,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-29",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 8,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-30",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 9,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-30",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 10,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2025-12-31",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 11,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2026-01-01",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
  {
    id: 12,
    title: "Nikolaj Jørgensen",
    location: "London",
    phone: "+44-54123541623",
    date: "2026-01-13",
    startTime: "03:00 PM",
    endTime: "04:00 PM",
    isAllDay: false,
    guests: [],
    description: "",
    attachment: null,
    recurrence: null,
    notification: null,
    timezone: "(GMT +05:00) - Indian Standard Time - Kolkata",
  },
];

// Timezone options
export const TIMEZONE_OPTIONS = [
  "(GMT +05:00) - Indian Standard Time - Kolkata",
  "(GMT -11:00) - America Samoa Standard Time",
  "(GMT -11:00) - Niue Time",
  "(GMT -11:00) - Cook Island Standard Time",
  "(GMT -11:00) - Hawaii Standard Time",
  "(GMT +00:00) - Greenwich Mean Time - London",
  "(GMT +01:00) - Central European Time - Paris",
  "(GMT -05:00) - Eastern Standard Time - New York",
  "(GMT -08:00) - Pacific Standard Time - Los Angeles",
];

// Recurrence options
export const RECURRENCE_OPTIONS = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly_monday", label: "Weekly on Monday" },
  { value: "monthly_forth", label: "Monthly on the forth Monday" },
  { value: "monthly_last", label: "Monthly on the last Monday" },
  { value: "annually", label: "Anually on January, 26" },
  { value: "weekend", label: "Every weekend (Monday - Friday)" },
  { value: "custom", label: "Custom" },
];

// Notification preset options
export const NOTIFICATION_PRESETS = [
  { value: "start", label: "When Event Starts" },
  { value: "5min", label: "5 minutes before" },
  { value: "10min", label: "10 minutes before" },
  { value: "15min", label: "15 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1hour", label: "1 hour before" },
  { value: "1day", label: "1 day before" },
  { value: "custom", label: "Custom" },
];

// Notification types
export const NOTIFICATION_TYPES = [
  { value: "notification", label: "Notification" },
  { value: "email", label: "Email" },
];

// Time units for custom notification
export const TIME_UNITS = [
  { value: "minutes", label: "minutes" },
  { value: "hours", label: "hours" },
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
];

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 26)); // Jan 26, 2026
  const [viewMode, setViewMode] = useState("month"); // "month" or "today"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get events for a specific date
  const getEventsForDate = useCallback((date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateStr);
  }, [events]);

  // Get events for a date range (for month view)
  const getEventsForDateRange = useCallback((startDate, endDate) => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    return events.filter((event) => event.date >= start && event.date <= end);
  }, [events]);

  // Create a new event
  // TODO: Replace with API call - POST /api/events
  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newEvent = {
        ...eventData,
        id: Date.now(),
      };
      
      setEvents((prev) => [...prev, newEvent]);
      setLoading(false);
      return newEvent;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update an existing event
  // TODO: Replace with API call - PUT /api/events/:id
  const updateEvent = useCallback(async (eventId, eventData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, ...eventData } : event
        )
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete an event
  // TODO: Replace with API call - DELETE /api/events/:id
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Fetch events from API
  // TODO: Implement actual API call - GET /api/events
  const fetchEvents = useCallback(async (startDate, endDate) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In real implementation, fetch from API and setEvents
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const value = {
    events,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    loading,
    error,
    getEventsForDate,
    getEventsForDateRange,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}

export default CalendarContext;