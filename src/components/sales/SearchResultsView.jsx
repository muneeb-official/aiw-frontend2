// components/sales/SearchResultsView.jsx
import { useState, useEffect, useRef } from "react";
import { ProfileCard } from "../profiles/ProfileComponents";
import { CompanyCard } from "../profiles/CompanyCard";
import { Pagination } from "../common/CommonComponents";
import { AddToProjectModal, ExportLeadsModal } from "../modals/Modals";
import { exportToCSV } from "../../services/api";

export default function SearchResultsView({ mode = "b2c", config, context, searchType }) {
  // Default searchType based on mode
  const effectiveSearchType = searchType || (mode === "b2b" ? "basic" : "individual");
  // ↑ Added searchType as a prop with default value
  
  const {
    selectedProfiles,
    toggleProfileSelection,
    selectAllProfiles,
    enrichProfile,
    enrichMultipleProfiles,
    getPaginatedProfiles,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalResults,
    excludeInProject,
    setExcludeInProject,
    // B2B specific
    selectedCompanies,
    toggleCompanySelection,
    selectAllCompanies,
    getPaginatedCompanies,
  } = context;

  // Determine which data to use based on mode
  const isB2B = mode === "b2b";
  const selectedItems = isB2B ? (selectedCompanies || []) : (selectedProfiles || []);
  const toggleSelection = isB2B ? toggleCompanySelection : toggleProfileSelection;
  const selectAll = isB2B ? selectAllCompanies : selectAllProfiles;
  const getPaginatedItems = isB2B ? getPaginatedCompanies : getPaginatedProfiles;

  // Modal states
  const [addToProjectModal, setAddToProjectModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [targetItemId, setTargetItemId] = useState(null);
  const [targetItem, setTargetItem] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);

  const paginatedItems = getPaginatedItems ? getPaginatedItems() : [];
  const isAllSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedItems.includes(item.id));

  // Handler for enrich single profile
  const handleEnrich = (itemId) => {
    if (enrichProfile) {
      enrichProfile(itemId);
    }
  };

  // Handler for export
  const handleExportLeads = async (exportType) => {
    console.log("Exporting as:", exportType);

    // Only handle CSV export for now
    if (exportType === "csv") {
      try {
        // Get the data to export based on mode
        let dataToExport;
        let filename;

        if (isB2B) {
          // For B2B, export selected companies or all paginated companies
          const companiesToExport = selectedItems.length > 0
            ? paginatedItems.filter(item => selectedItems.includes(item.id))
            : paginatedItems;

          // Transform company data for CSV export
          dataToExport = companiesToExport.map(company => ({
            company_name: company.name,
            website: company.website,
            phone: company.phone,
            email: company.email,
            address: company.address,
            city: company.city,
            state: company.state,
            country: company.country,
            postcode: company.postcode,
            industry: company.industry,
            sic_code: company.sicCode,
            employee_count: company.employees,
            revenue: company.revenue,
            // Include directors if available
            directors: company.directors ? company.directors.map(d => d.name).join('; ') : '',
          }));

          filename = "b2b_companies_export";
        } else {
          // For B2C, export selected profiles or all paginated profiles
          const profilesToExport = selectedItems.length > 0
            ? paginatedItems.filter(item => selectedItems.includes(item.id))
            : paginatedItems;

          // Transform profile data for CSV export
          dataToExport = profilesToExport.map(profile => ({
            name: profile.name,
            title: profile.title,
            company: profile.company,
            location: profile.location,
            email: profile.email,
            phone: profile.phone,
            linkedin: profile.linkedin,
            website: profile.website,
            skills: Array.isArray(profile.skills) ? profile.skills.join('; ') : profile.skills,
            experience_years: profile.experienceYears,
            is_enriched: profile.isEnriched ? 'Yes' : 'No',
          }));

          filename = "b2c_profiles_export";
        }

        // Call the API to export
        await exportToCSV(dataToExport, filename, true);

        console.log("Export successful!");
      } catch (error) {
        console.error("Error exporting to CSV:", error);
        alert("Failed to export data. Please try again.");
      }
    } else {
      // For other export types (Odoo, Hubspot, etc.), show a message
      alert(`Export to ${exportType} is not yet implemented.`);
    }
  };

  const handleEnrichAll = () => {
    if (isEnrichingAll || !enrichMultipleProfiles || isB2B) return;

    const unenrichedSelected = selectedItems.filter(
      (id) => !paginatedItems.find((p) => p.id === id)?.isEnriched
    );

    if (unenrichedSelected.length === 0) return;

    setIsEnrichingAll(true);

    setTimeout(() => {
      enrichMultipleProfiles(unenrichedSelected);
      setIsEnrichingAll(false);
    }, 2000);
  };

  // Handler for add single item to project
  const handleAddToProject = (item) => {
    setTargetItem(item);
    setTargetItemId(item.id);
    setAddToProjectModal(true);
  };

  // Handler for add all selected to project
  const handleAddAllToProject = () => {
    setTargetItem(null);
    setTargetItemId(null);
    setAddToProjectModal(true);
  };

  // Handler for project selection
  const handleProjectSelected = (projectName) => {
    setSelectedProjectName(projectName);
    setAddToProjectModal(false);
    setSuccessModal(true);
  };

  // Calculate display range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults || paginatedItems.length);

  return (
    <div className="flex-1 flex flex-col h-full gap-1.5 overflow-y-scroll">
      {/* Header */}
      <div className="p-2 border overflow-hidden rounded bg-white border-gray-100">
        {/* Results Info Row */}
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-[#000000]">
              {startIndex} - {endIndex} of about {(totalResults || 234124).toLocaleString()} results.
            </span>
          </div>

          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={excludeInProject || false}
              onChange={(e) => setExcludeInProject && setExcludeInProject(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">Exclude profiles already in project.</span>
          </div> */}
        </div>

        {/* Select All Row */}
        <div className="flex items-center justify-between py-2 px-0 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={selectAll}
              className="
                appearance-none
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

            <span className="text-sm text-gray-700">
              Select All
              {selectedItems.length > 0 && (
                <span className="text-gray-500 ml-2">
                  {selectedItems.length} Selected from this list
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Conditional buttons - only show when items selected */}
            {selectedItems.length > 0 && (
              <>
                {/* Only show Enrich button for B2C */}
                {!isB2B && config.hasEnrichment && (
                  <button
                    onClick={handleEnrichAll}
                    disabled={isEnrichingAll}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all min-w-[120px] ${isEnrichingAll
                      ? "bg-[#3C49F7] text-white cursor-wait"
                      : "bg-[#3C49F7] text-white hover:bg-blue-700"
                      }`}
                  >
                    {isEnrichingAll ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      "Enrich Profile"
                    )}
                  </button>
                )}
                <button
                  onClick={handleAddAllToProject}
                  className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium hover:border-[#3C49F7] hover:text-[#3C49F7] transition-colors"
                >
                  Add to Project
                </button>
              </>
            )}

            {/* Export Leads - Always visible */}
            <button
              onClick={() => setShowExportModal(true)}
              className="text-[#3C49F7] px-4 py-1.5 rounded-full text-sm font-medium border border-transparent hover:border-[#3C49F7] transition-colors"
            >
              Export Leads
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 h-5 z-[0]">
        <div className="space-y-1">
          {paginatedItems.map((item) =>
            isB2B ? (
              <CompanyCard
                key={item.id}
                company={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={toggleSelection}
                onAddToProject={handleAddToProject}
                searchType={effectiveSearchType}
                context={context}
              />
            ) : (
              <ProfileCard
                key={item.id}
                profile={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={toggleSelection}
                onEnrich={handleEnrich}
                onAddToProject={handleAddToProject}
              />
            )
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Add to Project Modal */}
      <AddToProjectModal
        isOpen={addToProjectModal}
        onClose={() => setAddToProjectModal(false)}
        profile={targetItem}
        company={targetItem}
        onAddToProject={handleProjectSelected}
        mode={mode}
        context={context}
      />

      {/* Export Leads Modal */}
      <ExportLeadsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportLeads}
      />
    </div>
  );
}