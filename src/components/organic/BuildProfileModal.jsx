// components/organic/BuildProfileModal.jsx
import { useState } from "react";

// Import ALL filter components from FilterComponents.jsx
import {
  FilterSection,
  TextFilter,
  TextWithCheckboxFilter,
  SelectWithCheckboxFilter,
  LocationFilter,
  ChevronRight,
  ChevronDown,
} from "../sales/FilterComponents";

// Import complex filters from SearchFiltersPanel.jsx
import {
  EducationFilter,
  RoleDepartmentFilter,
} from "../sales/SearchFiltersPanel";

// Import FilterTag from CommonComponents.jsx
import { FilterTag } from "../common/CommonComponents";

// Filter Configuration for Organic Lead Builder (same structure as B2C/B2B config)
const ORGANIC_FILTER_CONFIG = {
  location: {
    key: "location",
    title: "Location",
    type: "location",
    placeholder: "Enter Location...",
    hasRadius: true,
    hasModifier: true,
    options: [
      {
        name: "US > States",
        count: 23,
        children: ["Alabama, US", "Alaska, US", "Arizona, US", "California, US", "Colorado, US"],
      },
      {
        name: "US > Metro Areas",
        count: 23,
        children: ["New York Metro", "Los Angeles Metro", "Chicago Metro"],
      },
      {
        name: "CAN > Provinces",
        count: 23,
        children: ["Ontario", "Quebec", "British Columbia"],
      },
      {
        name: "CAN > Metro Areas",
        count: 23,
        children: ["Toronto Metro", "Vancouver Metro", "Montreal Metro"],
      },
      {
        name: "Africa",
        count: 23,
        children: ["South Africa", "Nigeria", "Egypt", "Kenya"],
      },
      {
        name: "Europe",
        count: 23,
        children: ["Albania", "Andorra", "United Kingdom", "France", "Germany"],
      },
      {
        name: "North America",
        count: 23,
        children: ["United States", "Canada", "Mexico"],
      },
      {
        name: "Oceania",
        count: 23,
        children: ["Australia", "New Zealand"],
      },
      {
        name: "South America",
        count: 23,
        children: ["Brazil", "Argentina", "Chile", "Colombia"],
      },
    ],
  },
  occupation: {
    key: "occupation",
    title: "Occupation",
    type: "role-department",
    sections: {
      industry: {
        label: "Industry",
        type: "text-with-expandable",
        placeholder: "Enter Industry...",
        hasModifier: true,
        options: [
          { id: "finance", label: "Finance" },
          { id: "hr", label: "HR" },
          { id: "technology", label: "Technology" },
          { id: "healthcare", label: "Healthcare" },
          { id: "marketing", label: "Marketing" },
        ],
      },
      function: {
        label: "Job Function",
        type: "text-with-expandable",
        placeholder: "Enter Job Function...",
        hasModifier: true,
        options: [
          { id: "analysis", label: "Analysis" },
          { id: "management", label: "Management" },
          { id: "development", label: "Development" },
          { id: "operations", label: "Operations" },
        ],
      },
      experience: {
        label: "Years of Experience",
        type: "checkbox-list",
        hasModifier: true,
        options: [
          { id: "0-3", label: "0 - 3" },
          { id: "3-5", label: "3 - 5" },
          { id: "5-10", label: "5 - 10" },
          { id: "10+", label: "10+" },
        ],
      },
    },
  },
//   company: {
//     key: "company",
//     title: "Company Name or Domain",
//     type: "text-with-checkbox",
//     placeholder: "Enter Company Name or Domain...",
//     hasModifier: true,
//   },
  education: {
    key: "education",
    title: "Education",
    type: "education",
    sections: {
      major: {
        label: "Major",
        type: "text-with-checkboxes",
        placeholder: "Enter Major...",
        hasModifier: true,
        options: [
          { id: "cs", label: "Computer Science" },
          { id: "ba", label: "Business Administration" },
          { id: "mgmt", label: "Management" },
          { id: "mkt", label: "Marketing" },
          { id: "acc", label: "Accounting" },
        ],
      },
      school: {
        label: "School",
        type: "text",
        placeholder: "Enter School...",
        hasModifier: true,
      },
      degree: {
        label: "Degree",
        type: "text-with-checkboxes",
        placeholder: "Enter Degree...",
        hasModifier: true,
        options: [
          { id: "bachelors", label: "Bachelor's" },
          { id: "masters", label: "Master's" },
          { id: "mba", label: "MBA" },
          { id: "phd", label: "PhD" },
        ],
      },
    },
  },
//   description: {
//     key: "description",
//     title: "Description",
//     type: "text",
//     placeholder: "Enter LinkedIn Url or Keyword here..",
//     hasModifier: false,
//   },
};

const DAYS_OPTIONS = [
  { value: "", label: "- Select Days -" },
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
];

const BuildProfileModal = ({ isOpen, onClose, onStart }) => {
  const [activeTab, setActiveTab] = useState("location");
  const [excludeProfiles, setExcludeProfiles] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // More Settings
  const [autoRemoveDays, setAutoRemoveDays] = useState("");
  const [keepConnectionDays, setKeepConnectionDays] = useState("");
  const [viewLeadsFrequency, setViewLeadsFrequency] = useState("");

  // Filter handlers - same pattern as SearchFiltersPanel
  const addFilter = (filter) => {
    const exists = activeFilters.some(
      (f) => f.type === filter.type && f.value === filter.value
    );
    if (!exists) {
      setActiveFilters((prev) => [
        ...prev,
        { ...filter, id: Date.now() + Math.random() },
      ]);
    }
  };

  const removeFilter = (filterId) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const updateFilterModifier = (filterId, modifier) => {
    setActiveFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, modifier } : f))
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  // Same getFilterCount logic as SearchFiltersPanel
  const getFilterCount = (key) => {
    return activeFilters.filter(
      (f) =>
        f.type === key ||
        f.type.startsWith(`${key}From`) ||
        f.type.startsWith(`${key}To`) ||
        f.type.startsWith(`${key}_`)
    ).length;
  };

  const handleStart = () => {
    onStart({
      excludeProfiles,
      filters: activeFilters,
      settings: { autoRemoveDays, keepConnectionDays, viewLeadsFrequency },
    });
  };

  // Render filter content - using EXACT same components as SearchFiltersPanel
  const renderFilterContent = () => {
    const config = ORGANIC_FILTER_CONFIG[activeTab];
    if (!config) return null;

    const commonProps = {
      filterKey: config.key,
      activeFilters,
      onAddFilter: addFilter,
      onRemoveFilter: removeFilter,
      onUpdateModifier: updateFilterModifier,
    };

    switch (config.type) {
      case "location":
        return (
          <LocationFilter
            {...commonProps}
            placeholder={config.placeholder}
            options={config.options || []}
            hasRadius={config.hasRadius}
            hasModifier={config.hasModifier}
          />
        );

      case "role-department":
        return (
          <RoleDepartmentFilter
            {...commonProps}
            sections={config.sections}
            hasModifier={config.hasModifier}
          />
        );

      case "text-with-checkbox":
        return (
          <TextWithCheckboxFilter
            {...commonProps}
            placeholder={config.placeholder}
            hasModifier={config.hasModifier}
          />
        );

      case "education":
        return (
          <EducationFilter
            {...commonProps}
            sections={config.sections}
            hasModifier={config.hasModifier}
          />
        );

      case "text":
        return (
          <TextFilter
            {...commonProps}
            placeholder={config.placeholder}
            hasModifier={config.hasModifier}
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const filterTabs = Object.values(ORGANIC_FILTER_CONFIG);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] mx-4 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-[28px] font-normal text-gray-900 font-['DM_Sans']">
            Build your ideal profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Exclude Checkbox - EXACT same style as SearchFiltersPanel */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              checked={excludeProfiles}
              onChange={(e) => setExcludeProfiles(e.target.checked)}
              className="
                appearance-none
                w-[16px] h-[16px]
                rounded-[6px]
                border border-gray-300
                bg-white
                hover:border-blue-600
                focus:outline-none focus:ring-2 focus:ring-blue-500/30
                cursor-pointer
                checked:bg-blue-600 checked:border-blue-600
                checked:after:content-['']
                checked:after:block
                checked:after:w-[6px] checked:after:h-[10px]
                checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white
                checked:after:rotate-45
                checked:after:translate-x-[5px] checked:after:translate-y-[1px]
              "
            />
            <span className="text-[14px] text-gray-600">
              Exclude profiles already in project.
            </span>
          </div>

          {/* Two Column Layout - Filter Tabs & Content */}
          <div className="flex gap-6">
            {/* Left Side - Filter Tabs (using FilterSection styling pattern) */}
            <div className="w-[260px] flex-shrink-0 space-y-2">
              {filterTabs.map((filter) => {
                const count = getFilterCount(filter.key);
                const isActive = activeTab === filter.key;

                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveTab(filter.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm transition-colors duration-150 border ${
                      isActive
                        ? "bg-[#F4F5FB] border-[#6C63FF] border-l-4"
                        : "bg-white border-[#E2E4F0] hover:bg-[#F4F5FB]"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium text-[#333333]">
                      {filter.title}
                      {count > 0 && (
                        <span className="text-[#6C63FF] text-xs font-semibold">
                          {count}
                        </span>
                      )}
                    </span>
                    <span
                      className={`transition-transform duration-200 text-[#6C63FF] ${
                        isActive ? "" : "rotate-180"
                      }`}
                    >
                      <ChevronRight />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Side - Filter Content Panel */}
            <div className="flex-1 bg-[#F8F9FC] rounded-xl p-5 border border-[#E2E4F0] min-h-[350px]">
              {renderFilterContent()}
            </div>
          </div>

          {/* Selected Filters Tags - using FilterTag from CommonComponents */}
          {activeFilters.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Search Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear Filter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <FilterTag
                    key={filter.id}
                    filter={filter}
                    onRemove={removeFilter}
                  />
                ))}
              </div>
            </div>
          )}

          {/* More Settings Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              More Settings
            </h3>

            <div className="space-y-5">
              {/* Auto remove unaccepted request */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Auto remove unaccepted request after
                  <span className="text-red-500">*</span>
                  <div className="relative group">
                    <span className="w-4 h-4 rounded-full bg-[#6C63FF] text-white text-[10px] flex items-center justify-center cursor-help">
                      i
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-64 pointer-events-none z-10">
                      Some users on LinkedIn don't always accept your connection
                      request. This option allows you to remove those unaccepted
                      requests within a timeframe.
                    </div>
                  </div>
                </label>
                <div className="relative w-[200px]">
                  <select
                    value={autoRemoveDays}
                    onChange={(e) => setAutoRemoveDays(e.target.value)}
                    className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white"
                  >
                    {DAYS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Keep connection duration */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  For how long do you want to keep the connection once connected
                  <span className="text-red-500">*</span>
                  <div className="relative group">
                    <span className="w-4 h-4 rounded-full bg-[#6C63FF] text-white text-[10px] flex items-center justify-center cursor-help">
                      i
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-64 pointer-events-none z-10">
                      You can choose to keep the connections you have made or
                      have them removed after a certain period of time. Remember
                      you can only have up to 30k connections.
                    </div>
                  </div>
                </label>
                <div className="relative w-[200px]">
                  <select
                    value={keepConnectionDays}
                    onChange={(e) => setKeepConnectionDays(e.target.value)}
                    className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white"
                  >
                    {DAYS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* View successful leads */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  View successful leads
                  <span className="text-red-500">*</span>
                  <div className="relative group">
                    <span className="w-4 h-4 rounded-full bg-[#6C63FF] text-white text-[10px] flex items-center justify-center cursor-help">
                      i
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none z-10">
                      This will allow you to see the successful leads enriched,
                      either weekly or monthly.
                    </div>
                  </div>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="viewLeads"
                      value="weekly"
                      checked={viewLeadsFrequency === "weekly"}
                      onChange={(e) => setViewLeadsFrequency(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Weekly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="viewLeads"
                      value="monthly"
                      checked={viewLeadsFrequency === "monthly"}
                      onChange={(e) => setViewLeadsFrequency(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Monthly</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Start Button */}
        <div className="px-8 py-5 border-t border-gray-100">
          <button
            onClick={handleStart}
            disabled={
              !autoRemoveDays || !keepConnectionDays || !viewLeadsFrequency
            }
            className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
              autoRemoveDays && keepConnectionDays && viewLeadsFrequency
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildProfileModal;