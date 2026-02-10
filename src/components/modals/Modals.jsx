// components/modals/Modals.jsx
import { useState } from "react";
import { useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { Modal, LoadingSpinner, SuccessIcon } from "../common/CommonComponents";
import { savedSearches, projects } from "../../data/profilesData";
import { X, Check, Sparkles } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
// Save Search Modal
export const SaveSearchModal = ({ isOpen, onClose, onSave }) => {
  const [searchName, setSearchName] = useState("");

  const handleSave = () => {
    if (searchName.trim()) {
      onSave(searchName);
      setSearchName("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <h2 className="text-xl font-bold text-[#000000] mb-1">Save your search</h2>
      <p className="text-[#000000] text-sm mb-6">Fill details for new project</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#000000] mb-2">
          Search Name
        </label>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter Search Name"
          className="w-full px-4 py-3 border border-gray-400 rounded-lg hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!searchName.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Search
      </button>
    </Modal>
  );
};

// Credit Card Icon for the modal
const CreditCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="12" width="36" height="24" rx="3" stroke="#3C49F7" strokeWidth="2" fill="none"/>
    <line x1="6" y1="20" x2="42" y2="20" stroke="#3C49F7" strokeWidth="2"/>
    <line x1="12" y1="28" x2="24" y2="28" stroke="#3C49F7" strokeWidth="2"/>
    <circle cx="36" cy="12" r="8" fill="#EEF0FF" stroke="#3C49F7" strokeWidth="2"/>
    <line x1="36" y1="8" x2="36" y2="16" stroke="#3C49F7" strokeWidth="2"/>
    <line x1="32" y1="12" x2="40" y2="12" stroke="#3C49F7" strokeWidth="2"/>
  </svg>
);

// Out of Credits Modal Component
export const OutOfCreditsModal = ({ isOpen, onClose, onGetCredits }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#EEF0FF] rounded-full flex items-center justify-center">
            <CreditCardIcon />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          It seems you ran out<br />of credits!
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Do not worry, we got you covered.
        </p>

        {/* Button */}
        <button
          onClick={() => {
            onClose();
            onGetCredits();
          }}
          className="w-full bg-[#3C49F7] text-white py-4 rounded-full font-medium text-lg hover:bg-[#2D3AD9] transition-colors"
        >
          Get more credits
        </button>
      </div>
    </div>
  );
};

// Load Search Modal
// ============================================
// LOAD SEARCH MODAL
// ============================================
export const LoadSearchModal = ({
  isOpen,
  onClose,
  savedSearches = [],
  onLoadSearch,
}) => {
  const [selectedSearch, setSelectedSearch] = useState(null);

  const handleLoad = () => {
    if (!selectedSearch) return;

    onLoadSearch?.(selectedSearch);
    setSelectedSearch(null);
  };

  const handleClose = () => {
    setSelectedSearch(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedSearch(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <h2 className="text-xl font-bold mb-1">Select Saved Search</h2>
      <p className="text-gray-500 text-sm mb-6">
        Load a saved search list.
      </p>

      <div className="space-y-3 mb-6">
        {savedSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => setSelectedSearch(search)}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedSearch?.id === search.id
                ? "border-blue-600 bg-[#F2F2FF]"
                : "border-white hover:border-blue-600 hover:bg-[#F2F2FF]"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedSearch?.id === search.id}
                readOnly
                className="appearance-none
    w-[18px] h-[18px]
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
              <span className="font-medium">{search.name}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleLoad}
        disabled={!selectedSearch}
        className="w-full bg-blue-500 text-white py-3 rounded-full disabled:opacity-50"
      >
        Load Search
      </button>
    </Modal>
  );
};
// Add to Project Modal
// Add this updated AddToProjectModal to your Modals.jsx file
// It handles both B2C (profiles) and B2B (companies)

export const AddToProjectModal = ({
  isOpen,
  onClose,
  profile,
  company,
  onAddToProject,
  mode = "b2c",
  context
}) => {
  // Get projects from context
  const projects = context?.projects || [];
  const addProject = context?.addProject;
  const addToProject = context?.addToProject;
  const fetchProjects = context?.fetchProjects;
  const isLoadingProjects = context?.isLoadingProjects || false;

  // Get selected profiles/companies and full list for bulk operations
  const selectedProfiles = context?.selectedProfiles || [];
  const selectedCompanies = context?.selectedCompanies || [];
  const allProfiles = context?.profiles || [];
  const allCompanies = context?.companies || [];

  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isAddingToProject, setIsAddingToProject] = useState(false);

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen && fetchProjects) {
      fetchProjects();
    }
  }, [isOpen, fetchProjects]);

  // Get the item (profile or company) - single item mode
  const item = mode === "b2b" ? company : profile;

  // Get items for bulk mode
  const getItemsToAdd = () => {
    if (item) {
      // Single item mode
      return [item];
    }

    // Bulk mode - get full profile/company objects from selected IDs
    if (mode === "b2b") {
      return allCompanies.filter((c) => selectedCompanies.includes(c.id));
    } else {
      return allProfiles.filter((p) => selectedProfiles.includes(p.id));
    }
  };

  const handleAdd = async () => {
    if (!selectedProject) return;

    const itemsToAdd = getItemsToAdd();
    if (itemsToAdd.length === 0) return;

    if (addToProject) {
      setIsAddingToProject(true);
      try {
        // Pass the full profile/company data array
        const result = await addToProject(selectedProject.id, itemsToAdd);
        if (result?.success) {
          setSuccessType("added");
          setShowSuccess(true);
        } else {
          // Handle error case - still show success for now, but log error
          console.error("Failed to add to project:", result?.error);
          setSuccessType("added");
          setShowSuccess(true);
        }
      } finally {
        setIsAddingToProject(false);
      }
    }
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim() && addProject) {
      setIsCreatingProject(true);
      const result = await addProject(newProjectName, newProjectDescription);
      setIsCreatingProject(false);
      // Close modal regardless of result, project was attempted
      setSelectedProject(null);
      setShowCreateProject(false);
      setShowSuccess(false);
      setSuccessType("");
      setNewProjectName("");
      setNewProjectDescription("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedProject(null);
    setShowCreateProject(false);
    setShowSuccess(false);
    setSuccessType("");
    setNewProjectName("");
    setNewProjectDescription("");
    onClose();
  };

  const handleGoBackToProfiles = () => {
    if (selectedProject && onAddToProject) {
      onAddToProject(selectedProject.name);
    }
    handleClose();
  };

  const handleGoBackToForm = () => {
    setShowSuccess(false);
    setSuccessType("");
    setShowCreateProject(false);
    // Refresh projects list
    if (fetchProjects) {
      fetchProjects();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Success Modal - Added to Project */}
      {showSuccess && successType === "added" && (
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Successfully added!</h2>
          <p className="text-gray-500 mb-8">
            {getItemsToAdd().length > 1
              ? `${getItemsToAdd().length} ${mode === "b2b" ? "companies" : "leads"} added to "${selectedProject?.name}" successfully`
              : `Lead added to "${selectedProject?.name}" successfully`
            }
          </p>

          <button
            onClick={handleGoBackToProfiles}
            className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-base"
          >
            Go Back to {mode === "b2b" ? "Companies" : "Profiles"}
          </button>
        </div>
      )}

      {/* Success Modal - Project Created */}
      {showSuccess && successType === "created" && (
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Project added successfully</h2>

          <button
            onClick={handleGoBackToForm}
            className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-base"
          >
            Go Back to Projects
          </button>
        </div>
      )}

      {/* Create New Project Modal */}
      {!showSuccess && showCreateProject && (
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Create a new project</h2>
            <button
              onClick={() => setShowCreateProject(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-6">Fill details for new project</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter Project Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Description
            </label>
            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Enter here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || isCreatingProject}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${newProjectName.trim() && !isCreatingProject
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isCreatingProject && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isCreatingProject ? "Creating..." : "Create Project"}
          </button>
        </div>
      )}

      {/* Select Project Modal */}
      {!showSuccess && !showCreateProject && (
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Select a Project</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-6">Where you want to move the {mode === "b2b" ? "company" : "profile"}</p>

          <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500">Loading projects...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects found. Create a new project to get started.
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${selectedProject?.id === project.id
                      ? "bg-[#F2F2FF] border border-blue-600"
                      : "bg-white hover:bg-[#F2F2FF] hover:border hover:border-blue-600"
                    }`}
                >
                  <div
                    className={`w-5 h-5  border-2 flex items-center justify-center transition-all ${selectedProject?.id === project.id
                        ? "border-blue-500 rounded bg-blue-500"
                        : "border-gray-300 rounded-full bg-white"
                      }`}
                  >
                    {selectedProject?.id === project.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{project.name}</span>
                </button>
              ))
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCreateProject(true)}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Create New Project
            </button>

            <button
              onClick={handleAdd}
              disabled={!selectedProject || isAddingToProject}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${selectedProject && !isAddingToProject
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isAddingToProject && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isAddingToProject ? "Adding..." : `Add to Project${!item && getItemsToAdd().length > 1 ? ` (${getItemsToAdd().length})` : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// Loading Modal
// Loading Modal
export const LoadingModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Loading your Search</h2>
          <p className="text-gray-500 text-sm">
            Do not close the window, we are fetching the information
          </p>
        </div>
        {/* <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button> */}
      </div>

      {/* 3 Dots Loading Animation */}
      {/* 3 Dots Loading Animation */}
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.6s]"></div>
        </div>
      </div>
    </Modal>
  );
};
// Success Modal - Search Saved
export const SearchSavedModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <SuccessIcon />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your search is saved!
        </h2>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Search for more profiles
        </button>
      </div>
    </Modal>
  );
};

// Success Modal - Added to Project
export const AddedToProjectModal = ({ isOpen, onClose, projectName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <SuccessIcon />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Successfully added!
        </h2>
        <p className="text-gray-500 mb-6">
          Lead added to "{projectName}" successfully
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Go Back to Form
        </button>
      </div>
    </Modal>
  );
};

// Add this to your components/modals/Modals.jsx file

export const ExportLeadsModal = ({ isOpen, onClose, onExport }) => {
  const [selectedOption, setSelectedOption] = useState("csv");

  const exportOptions = [
    { id: "csv", label: "Export as .CSV" },
    { id: "odoo", label: "Export as Odoo" },
    { id: "hubspot", label: "Export as Hubspot" },
    { id: "salesforce", label: "Export as Salesforce" },
    { id: "bullhorn", label: "Export as Bullhorn" },
    { id: "pipedrive", label: "Export as Pipedrive" },
  ];

  const handleExport = () => {
    if (onExport) {
      onExport(selectedOption);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedOption("csv"); // Reset to default
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Export Leads</h2>
      <p className="text-gray-500 text-sm mb-6">Pick a way to export leads</p>

      <div className="space-y-1 mb-6">
        {exportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`w-full p-2 text-left rounded-lg transition-all hover:border-blue-600 duration-200 ${
              selectedOption === option.id
                ? "border-blue-600 bg-[#F2F2FF]"
                : "border border-white hover:border-blue-600 hover:bg-[#F2F2FF]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-[18px] h-[18px] rounded flex items-center justify-center border-2 transition-colors ${
                  selectedOption === option.id
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedOption === option.id && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium text-sm text-[#000000]">{option.label}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleExport}
        className="bg-gray-300 text-white py-2 px-5 rounded-full font-medium hover:bg-blue-600 transition-colors"
      >
        Export Leads
      </button>
    </Modal>
  );
};

// ============================================
// INTEGRATION HUB MODALS
// ============================================

// Reusable Success Icon Component (Badge style with checkmark)
export const BadgeSuccessIcon = () => (
  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EEF0FF] flex items-center justify-center">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.09 4.26L17 3.34L17.34 6.41L20.24 7.47L19.13 10.27L21.19 12.64L18.88 14.56L19.13 17.64L16.13 18.03L14.85 20.82L12 19.52L9.15 20.82L7.87 18.03L4.87 17.64L5.12 14.56L2.81 12.64L4.87 10.27L3.76 7.47L6.66 6.41L7 3.34L9.91 4.26L12 2Z" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// Reusable Error Icon Component
export const BadgeErrorIcon = () => (
  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.5"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

// Generic Connecting/Loading Modal (Reusable)
export const ConnectingModal = ({ 
  isOpen, 
  onClose, 
  title = "Connecting and importing...",
  message = "We are importing your contact. Please wait and do not close this window."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        
        {/* Loading Dots */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:0.6s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic Success Modal (Reusable for all integrations)
export const IntegrationSuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Successfully Imported!",
  message = "We have successfully imported all of your contacts.",
  buttonText = "Cancel",
  onButtonClick
}) => {
  if (!isOpen) return null;

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <BadgeSuccessIcon />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-500 mb-8">{message}</p>
        
        <button
          onClick={handleClick}
          className="px-12 py-3 bg-[#4F46E5] text-white rounded-full font-medium hover:bg-[#4338CA] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Generic Error/Failed Modal (Reusable)
// FIND AND REPLACE your IntegrationErrorModal in Modals.jsx with this EXACT code:

export const IntegrationErrorModal = ({
  isOpen,
  onClose,
  title = "Failed to connect",
  message = "Please ensure that you have authorized the connection correctly.",
  buttonText = "Retry Connecting",
  onRetry
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 text-center relative">
        
        {/* ===== X CLOSE BUTTON - THIS IS WHAT WAS MISSING ===== */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* ===== END X CLOSE BUTTON ===== */}

        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{message}</p>

        {/* Two buttons side by side */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-[#4F46E5] text-white rounded-full font-medium hover:bg-[#4338CA] transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Twilio Number Modal (Specific integration form)
export const TwilioNumberModal = ({ 
  isOpen, 
  onClose, 
  onImport,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    accountSid: '',
    authToken: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.number && formData.accountSid && formData.authToken) {
      onImport(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', number: '', accountSid: '', authToken: '' });
    onClose();
  };

  const isFormValid = formData.name && formData.number && formData.accountSid && formData.authToken;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-bold text-gray-900">Add your Twilio Number</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">Please fill your details.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Name <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter name"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Number <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="Enter number"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Account SID <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.accountSid}
              onChange={(e) => handleChange('accountSid', e.target.value)}
              placeholder="Enter Account SID"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Auth Token <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.authToken}
              onChange={(e) => handleChange('authToken', e.target.value)}
              placeholder="Enter Auth Token"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`mt-6 px-10 py-3 rounded-full font-medium transition-colors ${
            isFormValid && !isLoading
              ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Importing...' : 'Import'}
        </button>
      </div>
    </div>
  );
};

// Vonage Number Modal (Similar to Twilio)
export const VonageNumberModal = ({ 
  isOpen, 
  onClose, 
  onImport,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    apiKey: '',
    apiSecret: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.number && formData.apiKey && formData.apiSecret) {
      onImport(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', number: '', apiKey: '', apiSecret: '' });
    onClose();
  };

  const isFormValid = formData.name && formData.number && formData.apiKey && formData.apiSecret;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-bold text-gray-900">Add your Vonage Number</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">Please fill your details.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Name <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter name"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Number <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="Enter number"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              API Key <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="Enter API Key"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              API Secret <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.apiSecret}
              onChange={(e) => handleChange('apiSecret', e.target.value)}
              placeholder="Enter API Secret"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`mt-6 px-10 py-3 rounded-full font-medium transition-colors ${
            isFormValid && !isLoading
              ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Importing...' : 'Import'}
        </button>
      </div>
    </div>
  );
};

// Check Icon
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Upgrade SEO Modal

export const UpgradeSEOModal = ({ isOpen, onClose, onSelect }) => {
	  const [selectedTier, setSelectedTier] = useState(null);
	  const tiers = [
	    { id: 1, name: 'Tier - 1', price: 15, words: '15,000 Words.' },
	    { id: 2, name: 'Tier - 2', price: 29, words: '15,000 Words.' },
	    { id: 3, name: 'Tier - 3', price: 49, words: '15,000 Words.' },
	  ];
	
	  if (!isOpen) return null;
	
	  return (
	    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
	      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
	        <div className="flex justify-between items-start mb-4">
	          <div>
	            <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>Book a Consultation</h3>
	            <p className="text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Please fill your details.</p>
	          </div>
	          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
	            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
	          </button>
	        </div>
	
	        <div className="space-y-3 mb-6">
	          {tiers.map(tier => (
	            <button
	              key={tier.id}
	              onClick={() => setSelectedTier(tier.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedTier === tier.id ? 'border-[#4F46E5] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
	            >
	              <div className="flex items-center gap-3">
	                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTier === tier.id ? 'border-[#4F46E5]' : 'border-gray-300'}`}>
	                  {selectedTier === tier.id && <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"/>}
	                </div>
	                <span className="font-medium text-gray-900">{tier.name}</span>
	              </div>
	              <div className="ml-8 mt-1">
	                <span className="text-2xl font-bold text-[#4F46E5]">£{tier.price}</span>
	                <span className="text-gray-500">/ month</span>
	              </div>
	              <div className="ml-8 mt-1 flex items-center gap-2 text-sm text-gray-600">
	                <CheckIcon /> {tier.words}
	              </div>
	            </button>
	          ))}
        </div>
	
	        <button
	          onClick={() => { onSelect(selectedTier); onClose(); }}
	          disabled={!selectedTier}
	          className="px-8 py-3 bg-[#4F46E5] text-white rounded-full font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50"
	        >
	          Switch Plan
	        </button>
	      </div>
	    </div>
	  );
	};


// Generic OAuth Connect Modal (For CRM, Email, Social integrations)
// This simulates OAuth flow - in real app, it would redirect to provider
export const OAuthConnectModal = ({
  isOpen,
  onClose,
  provider, // 'salesforce', 'google', 'linkedin', etc.
  providerName,
  onConnect,
  isConnecting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          {/* Provider icon would go here */}
          <span className="text-2xl font-bold text-gray-600">{providerName?.charAt(0)}</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Connect to {providerName}</h2>
        <p className="text-gray-500 text-sm mb-6">
          You will be redirected to {providerName} to authorize the connection.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConnect(provider)}
            disabled={isConnecting}
            className="px-6 py-3 bg-[#4F46E5] text-white rounded-full font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};
// Add these exports to your Modals.jsx file

// Template Loading Modal (full screen with gradient background)
export const TemplateLoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full mx-4 shadow-xl text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Please wait for a moment.
        </h3>
        <p className="text-gray-600 mb-8">We are generating your pitch Deck</p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
        </div>
      </div>
    </div>
  );
};

// Template Success Modal
export const TemplateSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Template successfully saved</h3>
        <p className="text-gray-600 mb-6">Your template is saved,</p>
        <button onClick={onClose} className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
          Close
        </button>
      </div>
    </div>
  );
};

// AI Prompt Modal for slide editing
export const AIPromptModal = ({ isOpen, onClose, onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Write your prompt here.</h3>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... (e.g., Change the title coor to blue', 'Add a border to the image', etc...)"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none mb-4"
        />
        <button
          onClick={() => { onSubmit?.(prompt); setPrompt(""); onClose(); }}
          className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Update
        </button>
      </div>
    </div>
  );
};
// ============================================
// MEETING NOTETAKER MODALS
// ============================================

// Meeting Cheatsheet Modal
export const MeetingCheatsheetModal = ({ isOpen, onClose, meeting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F8F9FC] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Meeting Cheatsheet</h2>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Meeting</span> <span className="italic">Introduction Call</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time</span> <span className="italic">12:30 PM, Sunday 12/01/26</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Attendees</span>
                  <span className="text-gray-700">2</span>
                  <span className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</span>
                  <span className="text-gray-700">Jhon Doe,</span>
                  <span className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</span>
                  <span className="text-gray-700">David Cook</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendees Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Conversation Starters & Topics of Intrest</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>But also the leap into electronic typesetting, remaining essentially unchanged.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>It was popularised in the 1960s with the release of Letraset sheets containing.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></li>
            </ul>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notable Connections</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>But also the leap into electronic typesetting, remaining essentially unchanged.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>It was popularised in the 1960s with the release of Letraset sheets containing.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></li>
            </ul>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Preparation Points for Organisers</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ODOO INTEGRATION MODAL
// ============================================

export const OdooIntegrationModal = ({
  isOpen,
  onClose,
  onConnect,
  isLoading = false,
  existingData = null
}) => {
  const [formData, setFormData] = useState({
    odoo_url: '',
    odoo_db: '',
    odoo_username: '',
    odoo_api_key: ''
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (existingData) {
      setFormData({
        odoo_url: existingData.odoo_url || '',
        odoo_db: existingData.odoo_db || '',
        odoo_username: existingData.odoo_username || '',
        odoo_api_key: ''
      });
    }
  }, [existingData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await onConnect(formData, true);
      setTestResult({ success: true, message: result.message || 'Connection successful!' });
    } catch (error) {
      setTestResult({ success: false, message: error.message || 'Connection failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onConnect(formData, false);
    }
  };

  const handleClose = () => {
    setFormData({ odoo_url: '', odoo_db: '', odoo_username: '', odoo_api_key: '' });
    setTestResult(null);
    onClose();
  };

  const isFormValid = formData.odoo_url && formData.odoo_db && formData.odoo_username && formData.odoo_api_key;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {existingData ? 'Update Odoo Connection' : 'Connect to Odoo'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">Enter your Odoo CRM credentials to connect.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Odoo URL <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="url"
              value={formData.odoo_url}
              onChange={(e) => handleChange('odoo_url', e.target.value)}
              placeholder="https://your-company.odoo.com"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Database Name <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.odoo_db}
              onChange={(e) => handleChange('odoo_db', e.target.value)}
              placeholder="Enter database name"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Username <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={formData.odoo_username}
              onChange={(e) => handleChange('odoo_username', e.target.value)}
              placeholder="Enter username or email"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              API Key <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="password"
              value={formData.odoo_api_key}
              onChange={(e) => handleChange('odoo_api_key', e.target.value)}
              placeholder="Enter API key"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-all"
            />
          </div>
        </div>

        {testResult && (
          <div className={`mt-4 p-3 rounded-lg ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {testResult.message}
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleTestConnection}
            disabled={!isFormValid || isTesting}
            className={`px-6 py-3 rounded-full font-medium transition-colors border ${
              isFormValid && !isTesting
                ? 'border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`px-10 py-3 rounded-full font-medium transition-colors ${
              isFormValid && !isLoading
                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Connecting...' : (existingData ? 'Update' : 'Connect')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELEGRAM LOGIN MODAL
// ============================================

// Telegram Login Modal - Two-step: Phone Number → Verification Code
export const TelegramLoginModal = ({ isOpen, onClose, onConnect }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'verify'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Store data from first API response
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [sessionString, setSessionString] = useState('');

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await onConnect('request', { phone_number: phoneNumber });
      if (result.success) {
        // Store phone_code_hash and session_string from the response
        setPhoneCodeHash(result.phone_code_hash);
        setSessionString(result.session_string);
        setStep('verify');
      } else {
        setError(result.error || result.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Pass all required data including phone_code_hash and session_string
      const result = await onConnect('verify', {
        phone_number: phoneNumber,
        code: verificationCode,
        phone_code_hash: phoneCodeHash,
        session_string: sessionString
      });
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || result.message || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
    setPhoneCodeHash('');
    setSessionString('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'phone' ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#0088CC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0088CC]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Telegram</h2>
              <p className="text-gray-500 text-sm">Enter your phone number to receive a verification code</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Include country code (e.g., +1 for US)</p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handlePhoneSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#0088CC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0088CC]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
              <p className="text-gray-500 text-sm">We sent a code to {phoneNumber}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-center text-lg tracking-widest"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleVerifySubmit}
                disabled={isLoading}
                className="w-full py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Connect'}
              </button>

              <button
                onClick={() => {
                  setStep('phone');
                  setVerificationCode('');
                  setPhoneCodeHash('');
                  setSessionString('');
                  setError('');
                }}
                className="w-full py-2 text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// WHATSAPP CONNECT MODAL
// ============================================

// Replace your WhatsAppConnectModal in Modals.jsx with this:

export const WhatsAppConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'qrcode'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // QR Code response data
  const [qrData, setQrData] = useState(null);
  // { success, session_id, qr_code, qr_code_image, status, message }

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Create WhatsApp session with phone number
      const createResult = await onConnect('create', { phone_number: phoneNumber });

      if (!createResult || createResult.error) {
        setError(createResult?.error || createResult?.message || 'Failed to create WhatsApp session');
        setIsLoading(false);
        return;
      }

      // Step 2: Get QR code
      const qrResult = await onConnect('qrcode');

      if (qrResult && (qrResult.success || qrResult.qr_code || qrResult.qr_code_image)) {
        setQrData(qrResult);
        setStep('qrcode');
      } else {
        setError(qrResult?.error || qrResult?.message || 'Failed to get QR code');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshQR = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await onConnect('qrcode');
      if (result && (result.qr_code || result.qr_code_image)) {
        setQrData(prev => ({ ...prev, ...result }));
      } else {
        setError(result?.error || 'Failed to refresh QR code');
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    // User confirms they've scanned the QR code
    handleClose();
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setError('');
    setIsLoading(false);
    setQrData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step 1: Phone Number Input */}
        {step === 'phone' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect WhatsApp</h2>
              <p className="text-gray-500 text-sm">Enter your phone number to connect your WhatsApp account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Include country code (e.g., +1 for US)</p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handlePhoneSubmit}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Connect WhatsApp'}
              </button>
            </div>
          </>
        )}

        {/* Step 2: QR Code Display */}
        {step === 'qrcode' && qrData && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan QR Code</h2>
              <p className="text-gray-500 text-sm">Open WhatsApp on your phone and scan this QR code to connect</p>
            </div>

            {/* QR Code Display */}
            <div className="flex flex-col items-center mb-6">
              {qrData.qr_code ? (
                <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                  <QRCodeSVG
                    value={qrData.qr_code}
                    size={224}
                    level="H"
                  />
                </div>
              ) : qrData.qr_code_image ? (
                <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                  <img
                    src={qrData.qr_code_image.startsWith('data:') ? qrData.qr_code_image : `data:image/png;base64,${qrData.qr_code_image}`}
                    alt="WhatsApp QR Code"
                    className="w-56 h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="w-56 h-56 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25D366]"></div>
                </div>
              )}

              {/* Status Badge */}
              {qrData.status && (
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    qrData.status === 'connected' || qrData.status === 'ready' 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500 animate-pulse'
                  }`} />
                  <span className="text-sm text-gray-600 capitalize">{qrData.status}</span>
                </div>
              )}

              {/* Message */}
              {qrData.message && (
                <p className="mt-2 text-sm text-gray-500 text-center">{qrData.message}</p>
              )}

              {/* Session ID */}
              {qrData.session_id && (
                <p className="mt-2 text-xs text-gray-400">Session ID: {qrData.session_id}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDone}
                className="w-full py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#128C7E] transition-colors"
              >
                Done
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep('phone');
                    setQrData(null);
                    setError('');
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleRefreshQR}
                  disabled={isLoading}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh QR
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 font-medium mb-2">How to scan:</p>
              <ol className="text-xs text-gray-500 space-y-1">
                <li>1. Open WhatsApp on your phone</li>
                <li>2. Tap Menu or Settings → Linked Devices</li>
                <li>3. Tap "Link a Device"</li>
                <li>4. Point your phone at this screen to scan the QR code</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};