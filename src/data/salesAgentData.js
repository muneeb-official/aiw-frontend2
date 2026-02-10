// Sales Agent Filter Data

export const salesAgentNavItems = [
  { key: "b2c", name: "B2C Lead Builder Agent", shortName: "B2C" },
  { key: "b2b", name: "B2B Lead Builder Agent", shortName: "B2B" },
  { key: "organic", name: "Organic Lead Builder Agent", icon: "organic" },
  { key: "campaign", name: "Campaign Manager", icon: "campaign" },
  { key: "calendar", name: "Calander", icon: "calendar" },
  { key: "inbox", name: "Inbox", icon: "inbox" },
  { key: "callLogs", name: "Call Logs", icon: "callLogs" },
];

/**
 * Location data - FALLBACK ONLY
 * This data is used as fallback when the API call fails.
 * The actual location data is now fetched from: BASE_URL/b2b/v1/rocketreach/countries
 * See: src/services/locationService.js and src/hooks/useCountries.js
 */
export const locationData = [
  {
    name: "US > States",
    count: 23,
    children: ["California", "Texas", "New York", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "Michigan", "North Carolina"]
  },
  {
    name: "US > Metro Areas",
    count: 23,
    children: ["New York Metro", "Los Angeles Metro", "Chicago Metro", "Dallas Metro", "Houston Metro", "Miami Metro", "Atlanta Metro", "Boston Metro", "Phoenix Metro", "Seattle Metro"]
  },
  {
    name: "CAN > Provinces",
    count: 23,
    children: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland", "Prince Edward Island"]
  },
  {
    name: "CAN > Metro Areas",
    count: 23,
    children: ["Toronto Metro", "Montreal Metro", "Vancouver Metro", "Calgary Metro", "Edmonton Metro", "Ottawa Metro", "Winnipeg Metro", "Quebec City Metro"]
  },
  {
    name: "Africa",
    count: 23,
    children: ["South Africa", "Nigeria", "Egypt", "Kenya", "Morocco", "Ghana", "Ethiopia", "Tanzania", "Uganda", "Algeria"]
  },
  {
    name: "Europe",
    count: 23,
    children: ["United Kingdom", "Germany", "France", "Spain", "Italy", "Netherlands", "Sweden", "Switzerland", "Poland", "Belgium"]
  },
  {
    name: "North America",
    count: 23,
    children: ["United States", "Canada", "Mexico"]
  },
  {
    name: "Oceania",
    count: 23,
    children: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"]
  },
  {
    name: "South America",
    count: 23,
    children: ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Uruguay"]
  },
];

export const departmentData = [
  { name: "C-Suite", count: 23, children: ["CEO", "CFO", "CTO", "COO", "CMO", "CHRO"] },
  { name: "Product & Engineering", count: 23, children: ["Software Engineer", "Product Manager", "DevOps", "QA Engineer", "Data Engineer"] },
  { name: "Finance", count: 23, children: ["Financial Analyst", "Accountant", "Controller", "Treasury", "Audit"] },
  { name: "HR", count: 23, children: ["HR Manager", "Recruiter", "HR Business Partner", "Compensation", "Training"] },
  { name: "Legal", count: 23, children: ["General Counsel", "Corporate Lawyer", "Compliance", "Paralegal"] },
  { name: "Marketing", count: 23, children: ["Marketing Manager", "Content Marketing", "Digital Marketing", "Brand Manager", "SEO Specialist"] },
  { name: "Health", count: 23, children: ["Healthcare Admin", "Medical Director", "Nurse", "Physician", "Therapist"] },
  { name: "Operations", count: 23, children: ["Operations Manager", "Supply Chain", "Logistics", "Facilities", "Procurement"] },
  { name: "Sales", count: 23, children: ["Sales Manager", "Account Executive", "Business Development", "Sales Rep", "Inside Sales"] },
  { name: "Education", count: 23, children: ["Teacher", "Professor", "Administrator", "Curriculum Developer", "Counselor"] },
];

export const managementLevels = [
  { name: "Founder/Owner", count: null },
  { name: "C-Level", count: null },
  { name: "Vice President", count: null },
  { name: "Director", count: null },
  { name: "Manager", count: null },
  { name: "Senior", count: null },
  { name: "Entry Level", count: null },
];

export const educationMajors = [
  { name: "Computer Science", count: null },
  { name: "Business Administration", count: null },
  { name: "Management", count: null },
  { name: "Marketing", count: null },
  { name: "Accounting", count: null },
  { name: "Finance", count: null },
  { name: "Engineering", count: null },
  { name: "Economics", count: null },
  { name: "Communications", count: null },
  { name: "Psychology", count: null },
];

export const degreeTypes = [
  { name: "Bachelors", count: null },
  { name: "Masters", count: null },
  { name: "Associates", count: null },
  { name: "Doctorates", count: null },
  { name: "High school", count: null },
  { name: "MBA", count: null },
  { name: "PhD", count: null },
];

export const preferredContactMethods = [
  "- Preferred Contact -",
  "Email",
  "Phone",
  "LinkedIn",
  "Any",
];

export const footerLinks = [
  { name: "Search", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Browser Extension", href: "#" },
  { name: "User Agreement", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Help", href: "#" },
];