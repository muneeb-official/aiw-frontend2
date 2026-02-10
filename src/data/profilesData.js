// data/profilesData.js

export const profilesData = [];

// Add these to your data/profilesData.js if not already present

export const savedSearches = [
  {
    id: 1,
    name: "Tech Executives NYC",
    date: "2024-01-15",
    filters: {
      name: "John",
      location: "New York",
      industry: "Technology",
    },
    resultCount: 1250,
  },
  {
    id: 2,
    name: "Marketing Directors",
    date: "2024-01-10",
    filters: {
      title: "Marketing Director",
      location: "United States",
    },
    resultCount: 890,
  },
  {
    id: 3,
    name: "Sales Managers UK",
    date: "2024-01-08",
    filters: {
      title: "Sales Manager",
      location: "United Kingdom",
    },
    resultCount: 456,
  },
];

export const projects = [
  {
    id: 1,
    name: "Tech Leaders Q1",
    description: "Q1 tech leadership prospects",
    profileCount: 45,
  },
  {
    id: 2,
    name: "Sales Prospects",
    description: "Sales team targets",
    profileCount: 128,
  },
  {
    id: 3,
    name: "Marketing Contacts",
    description: "Marketing outreach list",
    profileCount: 67,
  },
];

export default profilesData;
