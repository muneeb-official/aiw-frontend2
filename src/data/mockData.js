// Mock data for the dashboard

export const appInfo = {
  name: "AI workforce",
  tagline: "Create an AI employee",
};

export const userData = {
  name: "Max",
  credits: 300,
  creditsUsedPercentage: 50,
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

// data/mockData.js

export const navItems = [
  { key: "analytics", name: "Analytics" },
  { key: "sales", name: "Sales Agent" },
  { key: "marketing", name: "Marketing Agent" },
  { key: "support", name: "Support Agent" },
  { key: "calander", name: "Calander" },
  { key: "inbox", name: "Inbox" },
  { key: "callLogs", name: "Call Logs" },
  { key: "train", name: "Train" },
  { key: "integration", name: "Integration" },
  { key: "settings", name: "Settings" },  // Now after integration, not at bottom
];

export const statsCards = [
  { value: "32", label: "Total Emails Sent", iconType: "envelope" },
  { value: "12", label: "Total Replies From Inbox", iconType: "inbox" },
  { value: "45%", label: "Conversion From Replies", iconType: "percent" },
  { value: "324", label: "Calls Made With A.I.", iconType: "phone" },
  { value: "3:20 min", label: "Average Call Duration", iconType: "duration" },
];

export const creditCards = [
  { title: "Enrichment Credits Used", used: "320", total: "1000" },
  { title: "Emails Sent", used: "76", total: "1000" },
  { title: "Connection Requests Sent", used: "182", total: "1000" },
];

export const todayMeetings = [
  {
    id: 1,
    company: "Innovative private limited",
    title: "founder meeting",
    time: "Today, at 12:30 PM - 1:15 PM",
    actionType: "join",
  },
  {
    id: 2,
    company: "Pepsi-co private limited",
    title: "Marketing Lead",
    description: "Making a marketing Deal",
    time: "Today, at 2:30 PM - 3:30 PM",
    actionType: "join",
  },
  {
    id: 3,
    company: "Pitching MVP to Google Private Limited",
    description: "Pitching MVP to improve funnel management",
    time: "Today at 5:00 PM - 6:00 PM",
    actionType: "join",
  },
];

export const weekMeetings = [
  {
    id: 4,
    company: "Innovative private limited",
    title: "founder meeting",
    time: "Today, at 3:30 PM - 4:15 PM",
    actionType: "notify",
  },
  {
    id: 5,
    company: "Pepsi-co private limited",
    title: "Marketing Lead",
    description: "Making a marketing Deal",
    time: "Tomorrow, at 3:30 PM - 4:15 PM",
    actionType: "notify",
  },
  {
    id: 6,
    company: "Pitching MVP to Google Private Limited",
    description: "Pitching MVP to improve funnel management",
    time: "9 December, 2025, at 1:15 PM - 1:30 PM",
    actionType: "notify",
  },
];