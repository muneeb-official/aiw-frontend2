// context/SearchContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { profilesData } from "../data/profilesData";
import api from "../services/api";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  // Credits state
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  const [credits, setCredits] = useState(5);

  // Active filters state
  const [activeFilters, setActiveFilters] = useState([]);

  // Search results state
  const [profiles, setProfiles] = useState(profilesData);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [expandedProfile, setExpandedProfile] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // UI state
  const [hasSearched, setHasSearched] = useState(false);
  const [excludeInProject, setExcludeInProject] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs to track latest values and avoid stale closures
  const isSearchingRef = useRef(false);
  const excludeInProjectRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    excludeInProjectRef.current = excludeInProject;
  }, [excludeInProject]);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Transform activeFilters to API query format
  const transformFiltersToAPIQuery = useCallback(() => {
    const query = {
      name: [],
      current_employer: [],
      current_title: [],
      location: [],
      description: [],
      department: [],
      skills: [],
      years_experience: [],
      current_or_previous_title: [],
      company_name: [],
      degree: [],
      exclude_current_title: [],
      exclude_current_employer: [],
      exclude_location: [],
    };

    // Find radius filter if exists
    const radiusFilter = activeFilters.find(
      (f) => f.type === "location_radius",
    );
    const radius = radiusFilter?.radius || 0;

    activeFilters.forEach((filter) => {
      const isExcluded = filter.modifier === "exclude";

      // Handle name filters
      if (filter.type === "name") {
        query.name.push(filter.value);
      }

      // Handle location filters with radius
      else if (filter.type === "location") {
        let locationValue = filter.value;

        // Append radius if it exists
        if (radius > 0) {
          locationValue = `${filter.value}::~${radius}mi`;
        }

        if (isExcluded) {
          query.exclude_location.push(locationValue);
        } else {
          query.location.push(locationValue);
        }
      }

      // Skip location_radius filter as it's already handled above
      else if (filter.type === "location_radius") {
        // Do nothing, already processed with location
      }

      // Handle occupation and role_jobTitle -> current_title
      else if (
        filter.type === "occupation" ||
        filter.type === "role_jobTitle"
      ) {
        if (isExcluded) {
          query.exclude_current_title.push(filter.value);
        } else {
          query.current_title.push(filter.value);
        }
      }

      // Handle company -> current_employer
      else if (filter.type === "company") {
        if (isExcluded) {
          query.exclude_current_employer.push(filter.value);
        } else {
          query.current_employer.push(filter.value);
        }
      }

      // Handle description
      else if (filter.type === "description") {
        query.description.push(filter.value);
      }

      // Handle department
      else if (filter.type === "department") {
        query.department.push(filter.value);
      }

      // Handle skills
      else if (filter.type === "skills") {
        query.skills.push(filter.value);
      }

      // Handle years_experience
      else if (filter.type === "years_experience") {
        query.years_experience.push(filter.value);
      }

      // Handle current_or_previous_title
      else if (filter.type === "current_or_previous_title") {
        query.current_or_previous_title.push(filter.value);
      }

      // Handle company_name
      else if (filter.type === "company_name") {
        query.company_name.push(filter.value);
      }

      // Handle degree
      else if (filter.type === "degree") {
        query.degree.push(filter.value);
      }
    });

    return query;
  }, [activeFilters]);

  // Search API function
  const searchPeople = useCallback(async () => {
    console.log("🎬 searchPeople called - isSearching:", isSearchingRef.current);

    if (isSearchingRef.current) {
      console.log("⏸️ Already searching, skipping...");
      return;
    }

    console.log("⚡ Starting search...");
    isSearchingRef.current = true;
    setIsSearching(true);

    try {
      const query = transformFiltersToAPIQuery();
      const requestBody = {
        query,
        order_by: "popularity",
        contact_method: "email",
        start: (currentPage - 1) * itemsPerPage + 1,
        size: itemsPerPage,
      };

      // Use ref to get latest excludeInProject value
      const shouldExclude = excludeInProjectRef.current;
      console.log("🔍 API Request Body:", JSON.stringify(requestBody, null, 2));
      console.log("🔍 Exclude existing:", shouldExclude);

      const config = shouldExclude
        ? { params: { exclude_existing: true } }
        : {};
      const response = await api.post(
        "/b2b/v1/b2c/search-people",
        requestBody,
        config,
      );

      console.log("✅ API Response:", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.profiles) {
        // Update total results from API response
        if (response.data.total !== undefined) {
          setTotalResults(response.data.total);
        } else {
          // Fallback to profiles length if total is not provided
          setTotalResults(response.data.profiles.length);
        }

        // Transform API response to match our profile format
        const transformedProfiles = response.data.profiles.map(
          (profile, index) => ({
            id: profile.id || Date.now() + index,
            name: profile.name || "N/A",
            title: profile.current_title || "N/A",
            company: profile.current_employer || "N/A",
            location: profile.location || "N/A",
            industry: "N/A",
            current:
              profile.current_title && profile.current_employer
                ? `${profile.current_title} @ ${profile.current_employer}`
                : "N/A",
            past: [],
            education: [],
            contactInfo: {
              website:
                profile.current_employer?.toLowerCase().replace(/\s+/g, "") +
                  ".com" || "N/A",
              phones: [],
              emails: [],
            },
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=random&size=100`,
            website:
              profile.current_employer?.toLowerCase().replace(/\s+/g, "") +
                ".com" || "N/A",
            isEnriched: false,
            inProject: false,
          }),
        );

        console.log(
          "🎯 Transformed Profiles:",
          transformedProfiles.length,
          "profiles",
        );
        setProfiles(transformedProfiles);

        // Reset pagination if needed
        if (transformedProfiles.length === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error("❌ Error searching people:", error);
      console.error("Error details:", error.response?.data || error.message);
      // Keep existing profiles on error
    } finally {
      isSearchingRef.current = false;
      setIsSearching(false);
    }
  }, [currentPage, itemsPerPage, transformFiltersToAPIQuery]);

  // Save current search to API
  const saveCurrentSearch = useCallback(
    async (searchName) => {
      try {
        // Transform activeFilters to request body format
        const requestBody = {
          search_type: "basic", // or "advanced" based on your logic
          name: searchName,
          location: "",
          description: "",
          preferred_contact_method: "",
          occupation: "",
          role_department: "",
          skills: [],
          years_of_experience: "",
          company_name_or_domain: "",
          education: "",
          exclude_profiles_in_project: excludeInProject ? 1 : 0,
          search_query: "",
          filters_applied: {},
          results_count: totalResults,
        };

        // Find radius filter if exists
        const radiusFilter = activeFilters.find(
          (f) => f.type === "location_radius",
        );
        const radius = radiusFilter?.radius || 0;

        // Map activeFilters to request body fields
        activeFilters.forEach((filter) => {
          if (filter.type === "location") {
            let locationValue = filter.value;

            // Append radius if it exists
            if (radius > 0) {
              locationValue = `${filter.value}::~${radius}mi`;
            }

            requestBody.location = locationValue;
          } else if (filter.type === "description") {
            requestBody.description = filter.value;
          } else if (
            filter.type === "occupation" ||
            filter.type === "role_jobTitle"
          ) {
            requestBody.occupation = filter.value;
          } else if (filter.type === "department") {
            requestBody.role_department = filter.value;
          } else if (filter.type === "skills") {
            requestBody.skills.push(filter.value);
          } else if (filter.type === "years_experience") {
            requestBody.years_of_experience = filter.value;
          } else if (
            filter.type === "company" ||
            filter.type === "company_name"
          ) {
            requestBody.company_name_or_domain = filter.value;
          } else if (filter.type === "degree") {
            requestBody.education = filter.value;
          }
        });

        // Store all filters in filters_applied
        requestBody.filters_applied = transformFiltersToAPIQuery();

        console.log("💾 Saving search:", requestBody);

        const response = await api.post("/b2b/searches", requestBody);

        console.log("✅ Search saved successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Error saving search:", error);
        throw error;
      }
    },
    [activeFilters, excludeInProject, totalResults, transformFiltersToAPIQuery],
  );

  // Fetch saved searches from API
  const fetchSavedSearches = useCallback(async () => {
    try {
      const response = await api.get("/b2b/searches");
      console.log("📥 Fetched saved searches:", response.data);

      if (response.data && response.data.data && response.data.data.searches) {
        return response.data.data.searches;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching saved searches:", error);
      return [];
    }
  }, []);

  // Trigger search when filters are added or pagination changes
  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - activeFilters:",
      activeFilters.length,
      "hasSearched:",
      hasSearched,
      "excludeInProject:",
      excludeInProject,
    );

    // Auto-trigger search when filters are present
    if (activeFilters.length > 0) {
      console.log("📋 Active filters:", activeFilters);
      if (!hasSearched) {
        console.log("✨ Setting hasSearched to true");
        setHasSearched(true);
      }
      console.log(
        "🚀 Calling searchPeople with excludeInProject:",
        excludeInProject,
      );
      searchPeople();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, currentPage, itemsPerPage, excludeInProject]);

  // Add filter
  const addFilter = useCallback((filter) => {
    setActiveFilters((prev) => {
      const exists = prev.some(
        (f) => f.type === filter.type && f.value === filter.value,
      );
      if (exists) return prev;
      return [...prev, { ...filter, id: Date.now() }];
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
    setSelectedProfiles([]);
    setProfiles([]);
    setTotalResults(0);
  }, []);

  // Update filter modifier
  const updateFilterModifier = useCallback((filterId, modifier) => {
    setActiveFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, modifier } : f)),
    );
  }, []);

  // Load saved search
  const loadSavedSearch = useCallback((savedSearch) => {
    const filters = [];
    let idCounter = Date.now();

    // Handle both old format (savedSearch.filters) and new API format (savedSearch.filters_applied)
    const filtersData =
      savedSearch.filters_applied || savedSearch.filters || {};

    // Map API response fields to filters
    if (savedSearch.location) {
      // Check if location has radius format: "Location::~75mi"
      const locationMatch = savedSearch.location.match(
        /^(.+?)::~(\d+)(mi|km)$/,
      );

      if (locationMatch) {
        // Location has radius
        const [, location, radiusValue, unit] = locationMatch;

        filters.push({
          id: idCounter++,
          type: "location",
          value: location,
          icon: "location",
        });

        // Add radius filter
        filters.push({
          id: idCounter++,
          type: "location_radius",
          value: `${radiusValue} ${unit}`,
          icon: "location",
          radius: parseInt(radiusValue),
        });
      } else {
        // Location without radius
        filters.push({
          id: idCounter++,
          type: "location",
          value: savedSearch.location,
          icon: "location",
        });
      }
    }

    if (savedSearch.occupation) {
      filters.push({
        id: idCounter++,
        type: "occupation",
        value: savedSearch.occupation,
        icon: "briefcase",
      });
    }

    if (savedSearch.role_department) {
      filters.push({
        id: idCounter++,
        type: "department",
        value: savedSearch.role_department,
        icon: "building",
      });
    }

    if (savedSearch.skills && Array.isArray(savedSearch.skills)) {
      savedSearch.skills.forEach((skill) => {
        filters.push({
          id: idCounter++,
          type: "skills",
          value: skill,
          icon: "code",
        });
      });
    }

    if (savedSearch.years_of_experience) {
      filters.push({
        id: idCounter++,
        type: "years_experience",
        value: savedSearch.years_of_experience,
        icon: "calendar",
      });
    }

    if (savedSearch.company_name_or_domain) {
      filters.push({
        id: idCounter++,
        type: "company",
        value: savedSearch.company_name_or_domain,
        icon: "building",
      });
    }

    if (savedSearch.education) {
      filters.push({
        id: idCounter++,
        type: "degree",
        value: savedSearch.education,
        icon: "graduation-cap",
      });
    }

    if (savedSearch.description) {
      filters.push({
        id: idCounter++,
        type: "description",
        value: savedSearch.description,
        icon: "file-text",
      });
    }

    // Handle filters_applied object if present
    if (filtersData) {
      // Handle arrays in filters_applied
      Object.entries(filtersData).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((item) => {
            // Map API field names to filter types
            let filterType = key;
            let icon = "filter";

            if (
              key === "current_employer" ||
              key === "exclude_current_employer"
            ) {
              filterType = "company";
              icon = "building";
            } else if (
              key === "current_title" ||
              key === "exclude_current_title"
            ) {
              filterType = "occupation";
              icon = "briefcase";
            } else if (key === "location" || key === "exclude_location") {
              filterType = "location";
              icon = "location";

              // Check if location has radius format: "Location::~75mi"
              const locationMatch = item.match(/^(.+?)::~(\d+)(mi|km)$/);

              if (locationMatch) {
                const [, location, radiusValue, unit] = locationMatch;

                // Add modifier if it's an exclude filter
                const modifier = key.startsWith("exclude_")
                  ? "exclude"
                  : undefined;

                // Check if this location filter already exists
                const isDuplicate = filters.some(
                  (f) =>
                    f.type === filterType &&
                    f.value === location &&
                    f.modifier === modifier,
                );

                if (!isDuplicate) {
                  // Add location filter
                  filters.push({
                    id: idCounter++,
                    type: filterType,
                    value: location,
                    icon: icon,
                    modifier: modifier,
                  });

                  // Add radius filter (only once, not for each location)
                  if (!filters.some((f) => f.type === "location_radius")) {
                    filters.push({
                      id: idCounter++,
                      type: "location_radius",
                      value: `${radiusValue} ${unit}`,
                      icon: "location",
                      radius: parseInt(radiusValue),
                    });
                  }
                }

                return; // Skip adding the location again below
              }
            } else if (key === "skills") {
              filterType = "skills";
              icon = "code";
            } else if (key === "degree") {
              filterType = "degree";
              icon = "graduation-cap";
            }

            // Add modifier if it's an exclude filter
            const modifier = key.startsWith("exclude_") ? "exclude" : undefined;

            // Check if this filter already exists (prevent duplicates)
            const isDuplicate = filters.some(
              (f) =>
                f.type === filterType &&
                f.value === item &&
                f.modifier === modifier,
            );

            if (!isDuplicate) {
              filters.push({
                id: idCounter++,
                type: filterType,
                value: item,
                icon: icon,
                modifier: modifier,
              });
            }
          });
        }
      });
    }

    // Set exclude in project if specified
    if (savedSearch.exclude_profiles_in_project) {
      setExcludeInProject(savedSearch.exclude_profiles_in_project === 1);
    }

    console.log("🔄 Loading saved search with filters:", filters);
    setActiveFilters(filters);
    setHasSearched(true);
  }, []);

  // Toggle profile selection
  const toggleProfileSelection = useCallback((profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId],
    );
  }, []);

  // Select all profiles
  const selectAllProfiles = useCallback(() => {
    const currentProfiles = profiles.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    const allSelected = currentProfiles.every((p) =>
      selectedProfiles.includes(p.id),
    );
    if (allSelected) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(currentProfiles.map((p) => p.id));
    }
  }, [profiles, currentPage, itemsPerPage, selectedProfiles]);

  // // Enrich profile
  // const enrichProfile = useCallback((profileId) => {
  //   if (credits < 1) return false;
  //   setCredits((prev) => prev - 1);
  //   setProfiles((prev) =>
  //     prev.map((p) => (p.id === profileId ? { ...p, isEnriched: true } : p))
  //   );
  //   return true;
  // }, [credits]);

  // // Enrich multiple profiles
  // const enrichMultipleProfiles = useCallback((profileIds) => {
  //   const cost = profileIds.length;
  //   if (credits < cost) return false;
  //   setCredits((prev) => prev - cost);
  //   setProfiles((prev) =>
  //     prev.map((p) =>
  //       profileIds.includes(p.id) ? { ...p, isEnriched: true } : p
  //     )
  //   );
  //   return true;
  // }, [credits]);

  // 2. Update your enrichProfile function to check credits and call API
  const enrichProfile = useCallback(
    async (profileId) => {
      // Check if user has enough credits
      if (credits <= 0) {
        setShowOutOfCreditsModal(true);
        return { success: false, error: "No credits available" };
      }

      try {
        // Call the lookup-person-raw API endpoint
        const response = await api.get(
          `/b2b/v1/b2c/lookup-person-raw/${profileId}`,
        );
        console.log("✅ Enrich Profile API Response:", response.data);

        if (response.data) {
          const enrichedData = response.data;

          // Transform job_history to pastPositions format
          const pastPositions = (enrichedData.job_history || [])
            .filter((job) => !job.is_current)
            .map((job) => ({
              title: job.title || "N/A",
              company: job.company_name || job.company || "N/A",
              years: `${job.start_date ? new Date(job.start_date).getFullYear() : "N/A"} - ${job.end_date === "Present" ? "Present" : job.end_date ? new Date(job.end_date).getFullYear() : "N/A"}`,
            }));

          // Transform education array
          const education = (enrichedData.education || []).map((edu) => ({
            school: edu.school || "N/A",
            degree: edu.degree || "",
            major: edu.major || "",
            years: `${edu.start || "N/A"}-${edu.end || "N/A"}`,
          }));

          // Extract phone numbers
          const phones = (enrichedData.phones || []).map(
            (phone) => phone.number,
          );

          // Extract emails
          const emails = (enrichedData.emails || []).map(
            (email) => email.email,
          );

          // Update the profile with enriched data
          setProfiles((prev) =>
            prev.map((profile) =>
              profile.id === profileId
                ? {
                    ...profile,
                    isEnriched: true,
                    name: enrichedData.name || profile.name,
                    title: enrichedData.current_title || profile.title,
                    company: enrichedData.current_employer || profile.company,
                    location:
                      enrichedData.location ||
                      enrichedData.country ||
                      profile.location,
                    industry:
                      enrichedData.current_employer_industry ||
                      profile.industry,
                    avatar: enrichedData.profile_pic || profile.avatar,
                    linkedin:
                      enrichedData.linkedin_url ||
                      enrichedData.links?.linkedin ||
                      profile.linkedin,
                    website:
                      enrichedData.current_employer_domain || profile.website,
                    currentPosition:
                      enrichedData.current_title || profile.title,
                    pastPositions:
                      pastPositions.length > 0
                        ? pastPositions
                        : profile.pastPositions,
                    education:
                      education.length > 0 ? education : profile.education,
                    skills: enrichedData.skills || profile.skills,
                    phones: phones.length > 0 ? phones : profile.phones,
                    emails: emails.length > 0 ? emails : profile.emails,
                    contactInfo: {
                      ...profile.contactInfo,
                      website:
                        enrichedData.current_employer_domain ||
                        profile.contactInfo?.website,
                      phones:
                        phones.length > 0
                          ? phones
                          : profile.contactInfo?.phones,
                      emails:
                        emails.length > 0
                          ? emails
                          : profile.contactInfo?.emails,
                    },
                    // Store raw enriched data for additional fields if needed
                    enrichedRawData: enrichedData,
                  }
                : profile,
            ),
          );

          // Deduct credits
          setCredits((prev) => {
            const newCredits = prev - 1;
            if (newCredits <= 0) {
              setShowOutOfCreditsModal(true);
            }
            return Math.max(0, newCredits);
          });

          return { success: true, data: enrichedData };
        }
      } catch (error) {
        console.error("❌ Error enriching profile:", error);
        console.error("Error details:", error.response?.data || error.message);
        return { success: false, error: error.message };
      }
    },
    [credits],
  );

  // 3. Update enrichMultipleProfiles to check credits
  const enrichMultipleProfiles = (profileIds) => {
    const unenrichedCount = profileIds.filter(
      (id) => !profiles.find((p) => p.id === id)?.isEnriched,
    ).length;

    // Check if user has enough credits
    if (credits <= 0) {
      setShowOutOfCreditsModal(true);
      return;
    }

    // Calculate how many we can actually enrich
    const canEnrich = Math.min(unenrichedCount, credits);

    if (canEnrich === 0) {
      setShowOutOfCreditsModal(true);
      return;
    }

    let enrichedCount = 0;
    setProfiles((prev) =>
      prev.map((profile) => {
        if (
          profileIds.includes(profile.id) &&
          !profile.isEnriched &&
          enrichedCount < canEnrich
        ) {
          enrichedCount++;
          return {
            ...profile,
            isEnriched: true,
            contactInfo: {
              ...profile.contactInfo,
              phones: [
                "+44 - 123 34 123",
                "+44 - 123 34 123",
                "+44 - 123 34 123",
              ],
              emails: ["contact@example.com", "info@example.com"],
            },
            phones: [
              "+44 - 123 34 123",
              "+44 - 123 34 123",
              "+44 - 123 34 123",
            ],
            emails: ["contact@example.com", "info@example.com"],
          };
        }
        return profile;
      }),
    );

    // Deduct credits
    setCredits((prev) => {
      const newCredits = prev - canEnrich;
      if (newCredits <= 0) {
        setShowOutOfCreditsModal(true);
      }
      return Math.max(0, newCredits);
    });
  };

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const response = await api.get("/b2b/projects/");
      console.log("📥 Fetched projects:", response.data);

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
            profileCount: project.profileCount || project.profile_count || 0,
          }),
        );
        setProjects(transformedProjects);
        return transformedProjects;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
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
      console.log("✅ Project created:", response.data);

      if (response.data && response.data.success) {
        const newProject = {
          id: response.data.data?.id || Date.now(),
          name,
          description,
          profileCount: 0,
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
      }
      return null;
    } catch (error) {
      console.error("❌ Error creating project:", error);
      return null;
    }
  }, []);

  // Add profile to project via API
  const addToProject = useCallback(async (projectId, profilesData) => {
    try {
      // Format the request body according to the API specification
      const peopleData = profilesData.map((profile) => {
        // Build the base people_data object
        const personData = {
          id: profile.id, // RocketReach ID (required)
          name: profile.name || "N/A", // Name (required)
          current_title: profile.title || profile.current_title || "", // → stored in description
          current_employer: profile.company || profile.current_employer || "", // → stored in company_type
          linkedin_url:
            profile.linkedin || profile.enrichedRawData?.linkedin_url || "", // → stored in website
          location: profile.location || "", // → stored in location
          emails: [], // Will be populated below
          phones: [], // Will be populated below
        };

        // Extract emails - handle both enriched and non-enriched formats
        if (profile.emails && Array.isArray(profile.emails)) {
          personData.emails = profile.emails.map((email) =>
            typeof email === "string" ? { email: email, type: "work" } : email,
          );
        } else if (
          profile.contactInfo?.emails &&
          Array.isArray(profile.contactInfo.emails)
        ) {
          personData.emails = profile.contactInfo.emails.map((email) =>
            typeof email === "string" ? { email: email, type: "work" } : email,
          );
        } else if (profile.enrichedRawData?.emails) {
          personData.emails = profile.enrichedRawData.emails;
        }

        // Extract phones - handle both enriched and non-enriched formats
        if (profile.phones && Array.isArray(profile.phones)) {
          personData.phones = profile.phones.map((phone) =>
            typeof phone === "string" ? { number: phone, type: "work" } : phone,
          );
        } else if (
          profile.contactInfo?.phones &&
          Array.isArray(profile.contactInfo.phones)
        ) {
          personData.phones = profile.contactInfo.phones.map((phone) =>
            typeof phone === "string" ? { number: phone, type: "work" } : phone,
          );
        } else if (profile.enrichedRawData?.phones) {
          personData.phones = profile.enrichedRawData.phones;
        }

        // Add rocketreach_data if we have enriched raw data
        if (profile.enrichedRawData) {
          personData.rocketreach_data = profile.enrichedRawData;
        }

        // Build meta_data for any additional fields not in the main schema
        const metaData = {};

        if (profile.industry) metaData.industry = profile.industry;
        if (profile.avatar) metaData.avatar = profile.avatar;
        if (profile.website) metaData.website = profile.website;
        if (profile.skills) metaData.skills = profile.skills;
        if (profile.education) metaData.education = profile.education;
        if (profile.pastPositions)
          metaData.pastPositions = profile.pastPositions;
        if (profile.current) metaData.current = profile.current;
        if (profile.past) metaData.past = profile.past;

        // Add any other fields that aren't part of the main schema
        if (Object.keys(metaData).length > 0) {
          personData.meta_data = metaData;
        }

        return personData;
      });

      const requestBody = {
        project_id: projectId,
        people_data: peopleData,
      };

      console.log(
        "📤 Adding to project - Request Body:",
        JSON.stringify(requestBody, null, 2),
      );

      const response = await api.post(
        "/b2b/v1/b2c/add-to-project",
        requestBody,
      );

      console.log("✅ Add to project response:", response.data);

      // Update local state on success
      if (response.data) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  profileCount: project.profileCount + profilesData.length,
                }
              : project,
          ),
        );

        // Mark profiles as in project
        const profileIds = profilesData.map((p) => p.id);
        setProfiles((prev) =>
          prev.map((profile) =>
            profileIds.includes(profile.id)
              ? { ...profile, inProject: true }
              : profile,
          ),
        );

        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("❌ Error adding to project:", error);
      console.error("Error details:", error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }, []);

  // Toggle expanded profile
  const toggleExpandedProfile = useCallback((profileId) => {
    setExpandedProfile((prev) => (prev === profileId ? null : profileId));
  }, []);

  // Get paginated profiles - API already returns paginated data, so just return profiles
  const getPaginatedProfiles = useCallback(() => {
    return profiles;
  }, [profiles]);

  // Handler for changing items per page - resets to page 1 and clears selection
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setSelectedProfiles([]); // Clear selection when changing items per page
    setCurrentPage(1); // Reset to first page when changing items per page
    setItemsPerPage(newItemsPerPage);
  }, []);

  // Handler for changing page - clears selection for the new page
  const handlePageChange = useCallback((newPage) => {
    setSelectedProfiles([]); // Clear selection when changing page
    setCurrentPage(newPage);
  }, []);

  // Calculate total pages based on API totalResults
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const value = {
    // Credits
    credits,
    setCredits,
    showOutOfCreditsModal,
    setShowOutOfCreditsModal,

    // Filters
    activeFilters,
    addFilter,
    removeFilter,
    updateFilterModifier,
    clearFilters,
    loadSavedSearch,
    saveCurrentSearch,
    fetchSavedSearches,

    // Profiles
    profiles,
    selectedProfiles,
    toggleProfileSelection,
    selectAllProfiles,
    expandedProfile,
    toggleExpandedProfile,
    enrichProfile,
    enrichMultipleProfiles,
    getPaginatedProfiles,

    // Pagination
    currentPage,
    setCurrentPage: handlePageChange,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    totalPages,
    totalResults,
    setTotalResults,

    // UI State
    hasSearched,
    setHasSearched,
    excludeInProject,
    setExcludeInProject,
    isSearching,

    // Projects
    projects,
    setProjects,
    addProject,
    addToProject,
    fetchProjects,
    isLoadingProjects,

    // Search
    searchPeople,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchContext;
