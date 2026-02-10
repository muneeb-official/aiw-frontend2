// context/B2BSearchContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  b2bCompaniesData,
  b2bProjects as initialProjects,
} from "../data/b2bData";
import api from "../services/api";

const B2BSearchContext = createContext();

export const useB2BSearch = () => {
  const context = useContext(B2BSearchContext);
  if (!context) {
    throw new Error("useB2BSearch must be used within B2BSearchProvider");
  }
  return context;
};

export const B2BSearchProvider = ({ children }) => {
  // Credits state
  const [credits, setCredits] = useState(3000);
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);

  // Search type state (basic or advance)
  const [searchType, setSearchType] = useState("basic");

  // Active filters state
  const [activeFilters, setActiveFilters] = useState([]);

  // Company results state
  const [companies, setCompanies] = useState(b2bCompaniesData);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // UI state
  const [hasSearched, setHasSearched] = useState(false);
  const [excludeInProject, setExcludeInProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState(initialProjects);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Directors state - stores directors per company
  const [companyDirectors, setCompanyDirectors] = useState({});

  // Transform filters to API query format (for basic search)
  const transformFiltersToQuery = useCallback((filters) => {
    const query = {};

    filters.forEach((filter) => {
      switch (filter.type) {
        case "businessType":
          // Industry should be an array
          if (!query.industry) query.industry = [];
          if (Array.isArray(filter.value)) {
            query.industry.push(...filter.value);
          } else {
            query.industry.push(filter.value);
          }
          break;
        case "location":
          // Location should be an array
          if (!query.location) query.location = [];
          if (Array.isArray(filter.value)) {
            query.location.push(...filter.value);
          } else {
            query.location.push(filter.value);
          }
          break;
        case "companyName":
          // Name should be an array
          if (!query.name) query.name = [];
          if (Array.isArray(filter.value)) {
            query.name.push(...filter.value);
          } else {
            query.name.push(filter.value);
          }
          break;
        case "domain":
          // Domain should be an array
          if (!query.domain) query.domain = [];
          if (Array.isArray(filter.value)) {
            query.domain.push(...filter.value);
          } else {
            query.domain.push(filter.value);
          }
          break;
        case "linkedinUrl":
          // LinkedIn URL should be an array
          if (!query.linkedin_url) query.linkedin_url = [];
          if (Array.isArray(filter.value)) {
            query.linkedin_url.push(...filter.value);
          } else {
            query.linkedin_url.push(filter.value);
          }
          break;
        case "numEmployeesMin":
          query.num_employees_min = parseInt(filter.value, 10);
          break;
        case "numEmployeesMax":
          query.num_employees_max = parseInt(filter.value, 10);
          break;
        case "revenueMin":
          query.revenue_min = parseInt(filter.value, 10);
          break;
        case "revenueMax":
          query.revenue_max = parseInt(filter.value, 10);
          break;
        default:
          break;
      }
    });

    return query;
  }, []);

  // Transform filters to advanced search query format
  const transformAdvancedFiltersToQuery = useCallback((filters) => {
    const body = {};

    // Temporary arrays to collect filter values
    const tempArrays = {
      company_status: [],
      company_type: [],
      sic_codes: [],
      company_name_includes: [],
    };

    filters.forEach((filter) => {
      switch (filter.type) {
        case "companyName":
          // Collect all company name values
          if (filter.value && filter.value.trim() !== "") {
            tempArrays.company_name_includes.push(filter.value);
          }
          break;
        case "companyStatus":
          if (Array.isArray(filter.value)) {
            tempArrays.company_status.push(...filter.value);
          } else {
            tempArrays.company_status.push(filter.value);
          }
          break;
        case "companyType":
          if (Array.isArray(filter.value)) {
            tempArrays.company_type.push(...filter.value);
          } else {
            tempArrays.company_type.push(filter.value);
          }
          break;
        case "sicCode":
          if (Array.isArray(filter.value)) {
            tempArrays.sic_codes.push(...filter.value);
          } else {
            tempArrays.sic_codes.push(filter.value);
          }
          break;
        case "location":
          body.location = filter.value;
          break;
        case "incorporatedDateFrom":
          body.incorporated_from = filter.value;
          break;
        case "incorporatedDateTo":
          body.incorporated_to = filter.value;
          break;
        case "dissolvedDateFrom":
          body.dissolved_from = filter.value;
          break;
        case "dissolvedDateTo":
          body.dissolved_to = filter.value;
          break;
        case "size":
          body.size = filter.value;
          break;
        default:
          break;
      }
    });

    // Only add arrays to body if they have values
    if (tempArrays.company_status.length > 0) {
      body.company_status = tempArrays.company_status;
    }
    if (tempArrays.company_type.length > 0) {
      body.company_type = tempArrays.company_type;
    }
    if (tempArrays.sic_codes.length > 0) {
      body.sic_codes = tempArrays.sic_codes;
    }
    if (tempArrays.company_name_includes.length > 0) {
      // If multiple company names, join them or send as array based on API requirements
      // For now, using the first value as the API might expect a single string
      body.company_name_includes = tempArrays.company_name_includes[0];
    }

    return body;
  }, []);

  // Search companies using the API
  const searchCompanies = useCallback(async () => {
    if (activeFilters.length === 0) {
      setCompanies([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (searchType === "advance") {
        // Use advanced search endpoint (POST request)
        const body = transformAdvancedFiltersToQuery(activeFilters);
        body.start_index = "1"; // Pagination start index

        console.log(
          "Advanced search request body:",
          JSON.stringify(body, null, 2),
        );

        response = await api.post(
          "/b2b/v1/companies-house/advanced-search",
          body,
        );

        // Transform Companies House API response
        const transformedCompanies = (response.data.items || []).map(
          (company) => ({
            id: company.company_number,
            name: company.company_name,
            email_domain: "", // Not provided by Companies House API
            ticker_symbol: "", // Not provided by Companies House API
            industry_str: company.sic_codes?.[0] || "",
            city: company.registered_office_address?.locality || "",
            region: company.registered_office_address?.region || "",
            country_code: company.registered_office_address?.country || "",
            location: company.registered_office_address
              ? [
                  company.registered_office_address.premises,
                  company.registered_office_address.address_line_1,
                  company.registered_office_address.address_line_2,
                  company.registered_office_address.locality,
                  company.registered_office_address.region,
                  company.registered_office_address.postal_code,
                  company.registered_office_address.country,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "N/A",
            status: company.company_status || "Unknown",
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(company.company_name)}&background=3C49F7&color=fff`,
            hasWebsite: false,
            hasInstagram: false,
            hasLinkedin: false,
            incorporatedDate: company.date_of_creation || "N/A",
            sicCodes: company.sic_codes || [],
            companyType: company.company_type || "N/A",
            directors: [], // Will be populated when expanded
          }),
        );

        setCompanies(transformedCompanies);
        // Update total results from API response
        setTotalResults(
          response.data.total_results ||
            response.data.items_per_page ||
            transformedCompanies.length,
        );
      } else {
        // Use basic search endpoint (RocketReach)
        const query = transformFiltersToQuery(activeFilters);

        response = await api.post("/b2b/v1/rocketreach/company-search", {
          query,
          order_by: "popularity",
          start: 1,
          size: itemsPerPage,
        });

        const transformedCompanies = response.data.companies.map((company) => ({
          id: company.id,
          name: company.name,
          email_domain: company.email_domain,
          ticker_symbol: company.ticker_symbol,
          industry_str: company.industry_str,
          city: company.city,
          region: company.region,
          country_code: company.country_code,
          // Additional UI fields
          location: `${company.city}, ${company.region}, ${company.country_code}`,
          status: "Active", // Default status
          logo: `https://logo.clearbit.com/${company.email_domain}`,
          hasWebsite: true,
          hasInstagram: false,
          hasLinkedin: true,
          incorporatedDate: "N/A",
          sicCodes: [],
          directors: [], // Will be populated when expanded
        }));

        setCompanies(transformedCompanies);
        // Update total results from API response
        setTotalResults(response.data.total || transformedCompanies.length);
      }

      setHasSearched(true);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching companies:", error);
      console.error("Error details:", error.response?.data || error.message);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    activeFilters,
    itemsPerPage,
    searchType,
    transformFiltersToQuery,
    transformAdvancedFiltersToQuery,
  ]);

  // Fetch directors for a company
  const fetchDirectors = useCallback(
    async (companyId) => {
      // Return cached directors if already fetched
      if (companyDirectors[companyId]) {
        return companyDirectors[companyId];
      }

      try {
        const response = await api.get(
          `/b2b/v1/companies-house/company/${companyId}/directors`,
        );

        const transformedDirectors = (response.data.directors || []).map(
          (director, index) => {
            // Format address for display
            const address = director.address
              ? [
                  director.address.premises,
                  director.address.address_line_1,
                  director.address.address_line_2,
                  director.address.locality,
                  director.address.region,
                  director.address.postal_code,
                  director.address.country,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "N/A";

            return {
              id: `${companyId}-director-${index}`,
              name: director.formatted_name || director.original_name,
              title: director.officer_role || "Director",
              email: "***@company.com",
              secondaryEmail: null,
              phones: ["***-***-****"],
              maskedName: director.formatted_name || director.original_name,
              maskedEmail: "***@company.com",
              maskedSecondaryEmail: null,
              maskedPhones: ["***-***-****"],
              isEnriched: false,
              appointed_on: director.appointed_on,
              address: address,
              officer_role: director.officer_role,
            };
          },
        );

        // Cache the directors
        setCompanyDirectors((prev) => ({
          ...prev,
          [companyId]: transformedDirectors,
        }));

        // Update the company with directors
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === companyId ? { ...c, directors: transformedDirectors } : c,
          ),
        );

        return transformedDirectors;
      } catch (error) {
        console.error("Error fetching directors:", error);
        console.error("Error details:", error.response?.data || error.message);
        return [];
      }
    },
    [companyDirectors, companies],
  );

  // Add filter
  const addFilter = useCallback((filter) => {
    setActiveFilters((prev) => {
      const exists = prev.some(
        (f) => f.type === filter.type && f.value === filter.value,
      );
      if (exists) return prev;
      return [...prev, { ...filter, id: Date.now() + Math.random() }];
    });
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterId) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    setHasSearched(false);
    setSelectedCompanies([]);
    setExpandedCompany(null);
    setCompanies([]);
    setTotalResults(0);
  }, []);

  // Update filter modifier
  const updateFilterModifier = useCallback((filterId, modifier) => {
    setActiveFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, modifier } : f)),
    );
  }, []);

  // Save current search to API
  const saveCurrentSearch = useCallback(
    async (searchName) => {
      try {
        // Build request body based on search type
        const requestBody = {
          search_type: searchType, // "basic" or "advance"
          name: searchName,
          sic_code: "",
          location: "",
          company_name_includes: "",
          company_status: "",
          company_type: "",
          incorporated_date_from: "",
          incorporated_date_to: "",
          business_type: "",
          exclude_companies_in_project: excludeInProject ? 1 : 0,
          search_query: "",
          filters_applied: {},
          results_count: totalResults,
        };

        // Map activeFilters to request body fields
        activeFilters.forEach((filter) => {
          if (filter.type === "sicCode") {
            requestBody.sic_code = filter.value;
          } else if (filter.type === "location") {
            requestBody.location = filter.value;
          } else if (filter.type === "companyName") {
            requestBody.company_name_includes = filter.value;
          } else if (filter.type === "companyStatus") {
            requestBody.company_status = filter.value;
          } else if (filter.type === "companyType") {
            requestBody.company_type = filter.value;
          } else if (filter.type === "incorporatedDateFrom") {
            requestBody.incorporated_date_from = filter.value;
          } else if (filter.type === "incorporatedDateTo") {
            requestBody.incorporated_date_to = filter.value;
          } else if (filter.type === "businessType") {
            requestBody.business_type = filter.value;
          }
        });

        // Store all filters in filters_applied
        requestBody.filters_applied =
          searchType === "advance"
            ? transformAdvancedFiltersToQuery(activeFilters)
            : transformFiltersToQuery(activeFilters);

        console.log("💾 Saving B2B search:", requestBody);

        const response = await api.post("/b2b/searches", requestBody);

        console.log("✅ B2B search saved successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Error saving B2B search:", error);
        throw error;
      }
    },
    [
      activeFilters,
      excludeInProject,
      totalResults,
      searchType,
      transformAdvancedFiltersToQuery,
      transformFiltersToQuery,
    ],
  );

  // Fetch saved searches from API
  const fetchSavedSearches = useCallback(async () => {
    try {
      const response = await api.get("/b2b/searches");
      console.log("📥 Fetched saved B2B searches:", response.data);

      if (response.data && response.data.data && response.data.data.searches) {
        return response.data.data.searches;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching saved B2B searches:", error);
      return [];
    }
  }, []);

  // Load saved search
  const loadSavedSearch = useCallback((savedSearch) => {
    const filters = [];
    let idCounter = Date.now();

    // Handle both old format (savedSearch.filters) and new API format (savedSearch.filters_applied)
    const filtersData =
      savedSearch.filters_applied || savedSearch.filters || {};

    // Map API response fields to filters
    if (savedSearch.sic_code) {
      filters.push({
        id: idCounter++,
        type: "sicCode",
        value: savedSearch.sic_code,
        icon: "code",
      });
    }

    if (savedSearch.location) {
      filters.push({
        id: idCounter++,
        type: "location",
        value: savedSearch.location,
        icon: "location",
      });
    }

    if (savedSearch.company_name_includes) {
      filters.push({
        id: idCounter++,
        type: "companyName",
        value: savedSearch.company_name_includes,
        icon: "company",
      });
    }

    if (savedSearch.company_status) {
      filters.push({
        id: idCounter++,
        type: "companyStatus",
        value: savedSearch.company_status,
        icon: "status",
      });
    }

    if (savedSearch.company_type) {
      filters.push({
        id: idCounter++,
        type: "companyType",
        value: savedSearch.company_type,
        icon: "type",
      });
    }

    if (savedSearch.incorporated_date_from) {
      filters.push({
        id: idCounter++,
        type: "incorporatedDateFrom",
        value: savedSearch.incorporated_date_from,
        displayValue: savedSearch.incorporated_date_from,
        icon: "calendar",
      });
    }

    if (savedSearch.incorporated_date_to) {
      filters.push({
        id: idCounter++,
        type: "incorporatedDateTo",
        value: savedSearch.incorporated_date_to,
        displayValue: savedSearch.incorporated_date_to,
        icon: "calendar",
      });
    }

    if (savedSearch.business_type) {
      filters.push({
        id: idCounter++,
        type: "businessType",
        value: savedSearch.business_type,
        icon: "building",
      });
    }

    // Handle filters_applied object if present (for arrays)
    if (filtersData) {
      Object.entries(filtersData).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item) => {
            let filterType = key;
            let icon = "filter";

            if (key === "sic_codes") {
              filterType = "sicCode";
              icon = "code";
            } else if (key === "company_status") {
              filterType = "companyStatus";
              icon = "status";
            } else if (key === "company_type") {
              filterType = "companyType";
              icon = "type";
            } else if (key === "location") {
              filterType = "location";
              icon = "location";
            } else if (key === "industry") {
              filterType = "businessType";
              icon = "building";
            }

            // Check if this filter already exists (prevent duplicates)
            const isDuplicate = filters.some(
              (f) => f.type === filterType && f.value === item,
            );

            if (!isDuplicate) {
              filters.push({
                id: idCounter++,
                type: filterType,
                value: item,
                icon: icon,
              });
            }
          });
        }
      });
    }

    // Set exclude in project if specified
    if (savedSearch.exclude_companies_in_project) {
      setExcludeInProject(savedSearch.exclude_companies_in_project === 1);
    }

    // Set the search type from saved search
    if (savedSearch.search_type) {
      setSearchType(savedSearch.search_type);
    }

    console.log("🔄 Loading saved B2B search with filters:", filters);
    setActiveFilters(filters);
    setHasSearched(true);
  }, []);

  // Toggle company selection
  const toggleCompanySelection = useCallback((companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId],
    );
  }, []);

  // Select all companies
  const selectAllCompanies = useCallback(() => {
    const currentCompanies = companies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    const allSelected = currentCompanies.every((c) =>
      selectedCompanies.includes(c.id),
    );
    if (allSelected) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(currentCompanies.map((c) => c.id));
    }
  }, [companies, currentPage, itemsPerPage, selectedCompanies]);

  // Enrich director (costs 1 credit per director)
  const enrichDirector = useCallback(
    async (companyId, directorId) => {
      if (credits <= 0) {
        setShowOutOfCreditsModal(true);
        return false;
      }

      try {
        // Find the company and director
        const company = companies.find((c) => c.id === companyId);
        const director = company?.directors?.find((d) => d.id === directorId);

        if (!company || !director) {
          console.error("Company or director not found");
          return false;
        }

        console.log(
          "🔍 Enriching director:",
          director.name,
          "at",
          company.name,
        );

        // Step 1: Try RocketReach person-lookup first
        let enrichedData = null;
        let dataSource = null;

        try {
          const rocketReachBody = {
            query: {
              name: [director.name],
              current_employer: [company.name],
            },
          };

          console.log("📡 Calling RocketReach API with:", rocketReachBody);

          const rocketReachResponse = await api.post(
            "/b2b/v1/rocketreach/person-lookup",
            rocketReachBody,
          );

          console.log("✅ RocketReach API Response:", rocketReachResponse.data);

          // Check if profile data exists and is not empty
          if (
            rocketReachResponse.data?.profile &&
            Object.keys(rocketReachResponse.data.profile).length > 0 &&
            rocketReachResponse.data.profile.id
          ) {
            enrichedData = rocketReachResponse.data.profile;
            dataSource = "rocketreach";
            console.log("✅ Using RocketReach data");
          } else {
            console.log(
              "⚠️ RocketReach returned empty profile, trying ContactOut...",
            );
          }
        } catch (rocketReachError) {
          console.log(
            "⚠️ RocketReach failed, trying ContactOut...",
            rocketReachError.message,
          );
        }

        // Step 2: If RocketReach failed or returned empty, try ContactOut
        if (!enrichedData) {
          try {
            const contactOutBody = {
              full_name: director.name,
              company: [company.name],
            };

            console.log("📡 Calling ContactOut API with:", contactOutBody);

            const contactOutResponse = await api.post(
              "/b2b/v1/contactout/enrich",
              contactOutBody,
            );

            console.log("✅ ContactOut API Response:", contactOutResponse.data);

            // Check if profile data exists
            if (
              contactOutResponse.data?.profile &&
              Object.keys(contactOutResponse.data.profile).length > 0
            ) {
              enrichedData = contactOutResponse.data.profile;
              dataSource = "contactout";
              console.log("✅ Using ContactOut data");
            } else {
              console.error("❌ Both APIs returned empty data");
              return false;
            }
          } catch (contactOutError) {
            console.error(
              "❌ Both enrichment APIs failed:",
              contactOutError.message,
            );
            return false;
          }
        }

        // Step 3: Transform and update director with enriched data
        let phones = [];
        let emails = [];
        let title = director.title;
        let linkedin_url = director.linkedin_url;
        let location = director.location;
        let current_employer = director.current_employer;

        if (dataSource === "rocketreach") {
          // RocketReach format
          phones = (enrichedData.phones || []).map((phone) => phone.number);
          emails = (enrichedData.emails || []).map((email) => email.email);
          title = enrichedData.current_title || director.title;
          linkedin_url = enrichedData.linkedin_url || director.linkedin_url;
          location = enrichedData.location || director.location;
          current_employer =
            enrichedData.current_employer || director.current_employer;
        } else if (dataSource === "contactout") {
          // ContactOut format
          // Combine all email arrays
          const allEmails = [
            ...(enrichedData.email || []),
            ...(enrichedData.work_email || []),
            ...(enrichedData.personal_email || []),
          ];
          emails = allEmails.filter(Boolean);

          phones = (enrichedData.phone || []).filter(Boolean);
          title = enrichedData.headline || director.title;
          linkedin_url = enrichedData.url || director.linkedin_url;
          location = enrichedData.location || director.location;
          current_employer =
            enrichedData.company?.name || director.current_employer;
        }

        // Update the director with enriched data
        setCompanies((prev) =>
          prev.map((c) => {
            if (c.id === companyId) {
              return {
                ...c,
                directors: c.directors.map((d) =>
                  d.id === directorId
                    ? {
                        ...d,
                        isEnriched: true,
                        name:
                          enrichedData.name || enrichedData.full_name || d.name,
                        title: title,
                        email: emails[0] || d.email,
                        secondaryEmail: emails[1] || null,
                        phones: phones.length > 0 ? phones : d.phones,
                        linkedin_url: linkedin_url,
                        location: location,
                        current_employer: current_employer,
                        enrichmentSource: dataSource, // Track which API was used
                      }
                    : d,
                ),
              };
            }
            return c;
          }),
        );

        // Deduct credit
        setCredits((prev) => {
          const newCredits = prev - 1;
          if (newCredits <= 0) {
            setShowOutOfCreditsModal(true);
          }
          return Math.max(0, newCredits);
        });

        console.log(`✅ Successfully enriched director using ${dataSource}`);
        return true;
      } catch (error) {
        console.error("❌ Error enriching director:", error);
        console.error("Error details:", error.response?.data || error.message);
        return false;
      }
    },
    [credits, companies],
  );

  // Enrich all directors in a company
  const enrichAllDirectors = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      if (!company) return false;

      const unenrichedDirectors = company.directors.filter(
        (d) => !d.isEnriched,
      );
      const cost = unenrichedDirectors.length;

      if (credits <= 0) {
        setShowOutOfCreditsModal(true);
        return false;
      }

      const canEnrich = Math.min(cost, credits);
      if (canEnrich === 0) {
        setShowOutOfCreditsModal(true);
        return false;
      }

      let enrichedCount = 0;
      setCompanies((prev) =>
        prev.map((c) => {
          if (c.id === companyId) {
            return {
              ...c,
              directors: c.directors.map((director) => {
                if (!director.isEnriched && enrichedCount < canEnrich) {
                  enrichedCount++;
                  return { ...director, isEnriched: true };
                }
                return director;
              }),
            };
          }
          return c;
        }),
      );

      setCredits((prev) => {
        const newCredits = prev - canEnrich;
        if (newCredits <= 0) {
          setShowOutOfCreditsModal(true);
        }
        return Math.max(0, newCredits);
      });

      return true;
    },
    [companies, credits],
  );

  // Check if company has any enriched directors
  const hasEnrichedDirectors = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      return company?.directors?.some((d) => d.isEnriched) || false;
    },
    [companies],
  );

  // Get enriched directors count for a company
  const getEnrichedDirectorsCount = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      return company?.directors?.filter((d) => d.isEnriched).length || 0;
    },
    [companies],
  );

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const response = await api.get("/b2b/projects/");
      console.log("📥 Fetched B2B projects:", response.data);

      if (
        response.data &&
        response.data.success &&
        response.data.data?.projects
      ) {
        const transformedProjects = response.data.data.projects.map(
          (project) => ({
            id: project.id,
            name: project.name,
            description: project.description || "",
            companyCount: project.companyCount || project.company_count || 0,
          }),
        );
        setProjects(transformedProjects);
        return transformedProjects;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching B2B projects:", error);
      return [];
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // Add new project via API
  const addProject = useCallback(async (name, description) => {
    try {
      const response = await api.post("/b2b/projects/", {
        name,
        description,
      });
      console.log("✅ B2B Project created:", response.data);

      if (response.data && response.data.success) {
        const newProject = {
          id: response.data.data?.id || Date.now(),
          name,
          description,
          companyCount: 0,
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
      }
      return null;
    } catch (error) {
      console.error("❌ Error creating B2B project:", error);
      return null;
    }
  }, []);

  // Add companies to project via API
  const addToProject = useCallback(async (projectId, companiesData, searchMetadata = {}) => {
    try {
      // Format the request body for B2B companies using the new /b2b/projects/add-results format
      const resultsData = companiesData.map((company) => {
        // Determine source based on search type or company data
        const source = searchMetadata.source || (searchType === "advance" ? "companies_house" : "rocketreach");

        // Build the results_data object
        const resultData = {
          source: source,
          company_number: company.id || "",
          // Use company_name for Companies House, name for others
          ...(source === "companies_house"
            ? { company_name: company.name || "N/A" }
            : { name: company.name || "N/A" }
          ),
          description: company.industry_str || company.description || "",
          company_status: company.status || "",
          company_type: company.companyType || "",
          sic_codes: Array.isArray(company.sicCodes) ? company.sicCodes : [],
          website: company.hasWebsite ? `https://${company.email_domain || ""}` : "",
          email: company.email_domain ? `info@${company.email_domain}` : "",
          phone: "", // Not available in company data
          address: company.location || "",
          location: company.location || `${company.city}, ${company.region}, ${company.country_code}`.replace(/, ,/g, ',').replace(/^, |, $/g, ''),
        };

        return resultData;
      });

      const requestBody = {
        project_id: projectId,
        results_data: resultsData,
        search_metadata: {
          source: searchMetadata.source || (searchType === "advance" ? "companies_house" : "rocketreach"),
          query: searchMetadata.query || activeFilters.map(f => `${f.type}:${f.value}`).join(", "),
        },
        include_people: true,
        people_limit: 10,
      };

      console.log(
        "📤 Adding companies to B2B project - Request Body:",
        JSON.stringify(requestBody, null, 2),
      );

      const response = await api.post(
        "/b2b/projects/add-results",
        requestBody,
      );

      console.log("✅ Add to B2B project response:", response.data);

      // Update local state on success
      if (response.data) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  companyCount: project.companyCount + companiesData.length,
                }
              : project,
          ),
        );

        // Mark companies as in project
        const companyIds = companiesData.map((c) => c.id);
        setCompanies((prev) =>
          prev.map((company) =>
            companyIds.includes(company.id)
              ? { ...company, inProject: true }
              : company,
          ),
        );

        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("❌ Error adding to B2B project:", error);
      console.error("Error details:", error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }, [activeFilters, searchType]);

  // Toggle expanded company
  const toggleExpandedCompany = useCallback((companyId) => {
    setExpandedCompany((prev) => (prev === companyId ? null : companyId));
  }, []);

  // Get paginated companies
  const getPaginatedCompanies = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return companies.slice(start, end);
  }, [companies, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  // Auto-trigger search when filters change
  useEffect(() => {
    if (activeFilters.length > 0) {
      searchCompanies();
    }
  }, [activeFilters, searchCompanies]);

  const value = {
    // Credits
    credits,
    setCredits,
    showOutOfCreditsModal,
    setShowOutOfCreditsModal,

    // Search Type
    searchType,
    setSearchType,

    // Filters
    activeFilters,
    addFilter,
    removeFilter,
    updateFilterModifier,
    clearFilters,
    loadSavedSearch,
    saveCurrentSearch,
    fetchSavedSearches,

    // Companies
    companies,
    selectedCompanies,
    toggleCompanySelection,
    selectAllCompanies,
    expandedCompany,
    toggleExpandedCompany,
    searchCompanies,
    fetchDirectors,

    // Director Enrichment
    enrichDirector,
    enrichAllDirectors,
    hasEnrichedDirectors,
    getEnrichedDirectorsCount,

    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalResults,
    setTotalResults,
    getPaginatedCompanies,

    // UI State
    hasSearched,
    setHasSearched,
    excludeInProject,
    setExcludeInProject,
    isLoading,

    // Projects
    projects,
    setProjects,
    addProject,
    addToProject,
    fetchProjects,
    isLoadingProjects,
  };

  return (
    <B2BSearchContext.Provider value={value}>
      {children}
    </B2BSearchContext.Provider>
  );
};

export default B2BSearchContext;
