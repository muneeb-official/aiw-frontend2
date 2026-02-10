// data/agentConfig.js
import { locationData } from "./salesAgentData";
import {
  basicSearchFilters,
  advancedSearchFilters,
  b2bCompaniesData,
  b2bSavedSearches,
  b2bProjects,
} from "./b2bData";
import { profilesData, savedSearches, projects } from "./profilesData";

// B2C Configuration
export const b2cConfig = {
  mode: "b2c",
  title: "Sales Agent",
  searchTypes: [
    { key: "individual", label: "Individual Search" },
    { key: "bulk", label: "Bulk Search" },
  ],
  filters: {
    individual: [
      {
        key: "name",
        title: "Name",
        type: "text",
        placeholder: "Enter Name...",
        icon: "user",
        hasModifier: true,
      },
      {
        key: "location",
        title: "Location",
        type: "location",
        placeholder: "Enter Location...",
        icon: "location",
        hasRadius: true,
        hasModifier: true,
        options: locationData,
      },
      // {
      //   key: "description",
      //   title: "Description",
      //   type: "text",
      //   placeholder: "Enter LinkedIn Url or Keyword here..",
      //   icon: "description",
      //   hasModifier: true,
      // },
    ],
    bulk: [
      {
        key: "contact",
        title: "Preffered Contact Method",
        type: "select-with-checkbox",
        placeholder: "- Preferred Contact -",
        inputPlaceholder: "Value",
        icon: "contact",
        hasModifier: true,
        options: [
          { id: 1, label: "- Preferred Contact -", value: "" },
          { id: 2, label: "Mobile", value: "mobile" },
          { id: 3, label: "Email", value: "email" },
          { id: 4, label: "LinkedIn", value: "linkedin" },
          { id: 5, label: "Twitter", value: "twitter" },
        ],
      },
      {
        key: "location",
        title: "Location",
        type: "location",
        placeholder: "Type Location",
        icon: "location",
        hasRadius: true,
        hasModifier: true,
        options: locationData,
      },
      {
        key: "occupation",
        title: "Occupation",
        type: "text-with-checkbox",
        placeholder: "Enter Job Title...",
        icon: "briefcase",
        hasModifier: true,
        suggestions: [
          "Software Engineer",
          "Product Manager",
          "Data Analyst",
          "Marketing Manager",
          "Sales Representative",
          "UX Designer",
          "Project Manager",
          "Business Analyst",
          "Accountant",
          "HR Manager",
        ],
      },
      {
        key: "role",
        title: "Role & Department",
        type: "role-department",
        icon: "building",
        hasModifier: true,
        sections: {
          jobTitle: {
            label: "Job Title",
            type: "text-with-checkbox",
            placeholder: "Enter Job Title...",
            hasModifier: true,
            suggestions: [
              "Abogada",
              "Abogado",
              "Able Seaman",
              "Data Abstractor",
              "NED Abrantix Ag",
              "Software Engineer",
              "Product Manager",
              "CEO",
              "CTO",
              "Director",
            ],
          },
          department: {
            label: "Department",
            type: "text-with-expandable",
            placeholder: "Enter Department...",
            hasModifier: true,
            options: [
              { id: 1, label: "C-Suite", count: 23, hasChildren: true },
              {
                id: 2,
                label: "Product & Engineering",
                count: 23,
                hasChildren: true,
              },
              { id: 3, label: "Finance", count: 23, hasChildren: true },
              { id: 4, label: "HR", count: 23, hasChildren: true },
              { id: 5, label: "Legal", count: 23, hasChildren: true },
              { id: 6, label: "Marketing", count: 23, hasChildren: true },
              { id: 7, label: "Health", count: 23, hasChildren: true },
              { id: 8, label: "Operations", count: 23, hasChildren: true },
              { id: 9, label: "Sales", count: 23, hasChildren: true },
              { id: 10, label: "Education", count: 23, hasChildren: true },
            ],
          },
          managementLevels: {
            label: "Management Levels",
            type: "checkbox-list",
            hasModifier: true,
            options: [
              { id: 1, label: "Founder/Owner" },
              { id: 2, label: "C-Level" },
              { id: 3, label: "Vice President" },
              { id: 4, label: "Head" },
              { id: 5, label: "Director" },
              { id: 6, label: "Manager" },
              { id: 7, label: "Senior" },
              { id: 8, label: "Individual Contributor" },
              { id: 9, label: "Entry" },
              { id: 10, label: "Intern" },
              { id: 11, label: "Volunteer" },
            ],
          },
          changedJobsWithin: {
            label: "Changed Jobs Within",
            type: "select",
            placeholder: "Select one...",
            options: [
              { id: 1, label: "Select One...", value: "" },
              { id: 2, label: "Last 3 Months", value: "90" },
              { id: 3, label: "Last 6 Months", value: "180" },
              { id: 4, label: "Last Year", value: "365" },
              { id: 5, label: "Last 2 Years", value: "730" },
              { id: 6, label: "Last 3 Years", value: "1095" },
            ],
          },
        },
      },
      {
        key: "skills",
        title: "Skills",
        type: "text-with-checkbox",
        placeholder: "Enter Skills...",
        icon: "skills",
        hasModifier: true,
        suggestions: [
          "JavaScript",
          "Python",
          "React",
          "Node.js",
          "SQL",
          "Project Management",
          "Data Analysis",
          "Machine Learning",
          "AWS",
          "Communication",
        ],
      },
      {
        key: "experience",
        title: "Years Of Experience",
        type: "select-with-checkbox",
        placeholder: "Select one...",
        icon: "experience",
        hasModifier: true,
        options: [
          { id: 1, label: "Select One...", value: "" },
          { id: 2, label: "0 - 3", value: "0-3" },
          { id: 3, label: "3 - 10", value: "3-10" },
          { id: 4, label: "10+", value: "10+" },
          { id: 5, label: "Custom", value: "custom" },
        ],
      },
      {
        key: "company",
        title: "Company Name or Domain",
        type: "text-with-checkbox",
        placeholder: "Enter Company Name and Domain...",
        icon: "building",
        hasModifier: true,
        suggestions: [
          "Google",
          "Microsoft",
          "Amazon",
          "Apple",
          "Meta",
          "Netflix",
          "Tesla",
          "IBM",
          "Oracle",
          "Salesforce",
        ],
      },
      {
        key: "education",
        title: "Education",
        type: "education",
        icon: "education",
        hasModifier: true,
        sections: {
          major: {
            label: "Major",
            type: "text-with-checkboxes",
            placeholder: "Enter Major...",
            hasModifier: true,
            suggestions: [
              "Computer Science",
              "Business Administration",
              "Management",
              "Marketing",
              "Accounting",
              "Engineering",
              "Economics",
            ],
            options: [
              { id: 1, label: "Computer Science" },
              { id: 2, label: "Business Administration" },
              { id: 3, label: "Management" },
              { id: 4, label: "Marketing" },
              { id: 5, label: "Accounting" },
            ],
          },
          school: {
            label: "School",
            type: "text-with-suggestions",
            placeholder: "Enter School...",
            hasModifier: true,
            suggestions: [
              "Australia University",
              "University of Alabama",
              "Maharashtra Amity University",
              "Athenes University",
              "Harvard University",
              "Stanford University",
              "MIT",
              "Oxford University",
            ],
          },
          degree: {
            label: "Degree",
            type: "text-with-checkboxes",
            placeholder: "Enter Degree...",
            hasModifier: true,
            suggestions: [
              "Master of Business Administration",
              "Competition of Business",
              "Associate in Computer Science",
              "Bachelor of Science",
              "Master of Science",
            ],
            options: [
              { id: 1, label: "Bachelors" },
              { id: 2, label: "Masters" },
              { id: 3, label: "Associates" },
              { id: 4, label: "Doctorates" },
              { id: 5, label: "High school" },
              { id: 6, label: "Master of Business Administration" },
            ],
          },
        },
      },
      {
        key: "description",
        title: "Description",
        type: "text-with-checkbox",
        placeholder: "Enter LinkedIn Url or Keyword here..",
        icon: "description",
        hasModifier: true,
        suggestions: [],
      },
    ],
  },
  resultCard: "profile",
  hasEnrichment: true,
  savedSearches: savedSearches,
  projects: projects,
  data: profilesData,
};

// B2B Configuration
export const b2bConfig = {
  mode: "b2b",
  title: "B2B Agent",
  searchTypes: [
    { key: "basic", label: "Basic Search" },
    { key: "advance", label: "Advance Search" }, // Changed from "advanced" to "advance"
  ],
  filters: {
    basic: [
      {
        key: "businessType",
        title: "Business Type",
        type: "searchable-select",
        placeholder: "What business are you looking for?",
        icon: "building",
        hasModifier: true,
        options: basicSearchFilters.businessType.options,
      },
      {
        key: "location",
        title: "Location",
        type: "location",
        placeholder: "Type Location",
        icon: "location",
        hasRadius: false,
        hasModifier: true,
        options: [
          {
            name: "United Kingdom",
            count: 12500,
            children: ["London", "Manchester", "Birmingham"],
          },
          {
            name: "United States",
            count: 28000,
            children: ["New York", "Los Angeles", "Chicago"],
          },
        ],
      },
    ],
    advance: [
      // Changed from "advanced" to "advance"
      {
        key: "sicCode",
        title: "SIC Code",
        type: "searchable-select",
        placeholder: "Enter SIC Code...",
        icon: "code",
        hasModifier: true,
        options: advancedSearchFilters.sicCode.options,
      },
      {
        key: "location",
        title: "Location",
        type: "location",
        placeholder: "Type Location",
        icon: "location",
        hasRadius: false,
        hasModifier: true,
        options: [
          {
            name: "United Kingdom",
            count: 12500,
            children: ["London", "Manchester", "Birmingham"],
          },
          {
            name: "United States",
            count: 28000,
            children: ["New York", "Los Angeles", "Chicago"],
          },
        ],
      },
      {
        key: "companyName",
        title: "Company Name (*includes)",
        type: "text-with-checkbox",
        placeholder: "Enter Company Name and press Enter...",
        icon: "company",
        hasModifier: true,
      },
      {
        key: "companyStatus",
        title: "Company Status",
        type: "searchable-select",
        placeholder: "- Select Company Status -",
        icon: "status",
        hasModifier: true,
        options: advancedSearchFilters.companyStatus.options,
      },
      {
        key: "companyType",
        title: "Company Type",
        type: "searchable-select",
        placeholder: "- Select Company Type -",
        icon: "type",
        hasModifier: true,
        options: advancedSearchFilters.companyType.options,
      },
      {
        key: "incorporatedDate",
        title: "Incorporated Date",
        type: "date-range-split",
        placeholder: "Select Date Range",
        icon: "calendar",
        hasModifier: true,
      },
    ],
  },
  resultCard: "company",
  hasEnrichment: true,
  savedSearches: b2bSavedSearches,
  projects: b2bProjects,
  data: b2bCompaniesData,
};

export const getAgentConfig = (mode, countriesData = null, sicCodesData = null) => {
  const baseConfig = mode === "b2b" ? b2bConfig : b2cConfig;

  // If countriesData or sicCodesData is provided, update options dynamically
  if ((countriesData && countriesData.length > 0) || (sicCodesData && sicCodesData.length > 0)) {
    const updatedFilters = {};

    Object.keys(baseConfig.filters).forEach((searchType) => {
      updatedFilters[searchType] = baseConfig.filters[searchType].map(
        (filter) => {
          if (filter.key === "location" && countriesData && countriesData.length > 0) {
            return { ...filter, options: countriesData };
          }
          if (filter.key === "sicCode" && sicCodesData && sicCodesData.length > 0) {
            return { ...filter, options: sicCodesData };
          }
          return filter;
        },
      );
    });

    return { ...baseConfig, filters: updatedFilters };
  }

  return baseConfig;
};
