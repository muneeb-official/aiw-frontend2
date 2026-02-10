// pages/CampaignManager.jsx
import { useState, useEffect } from "react";
import { ProfileCard } from "../../components/profiles/ProfileComponents";
import { CompanyCard } from "../../components/profiles/CompanyCard";
import CampaignManagerModals from "../../components/campaigns/CampaignManagerModals";
import WorkflowBuilder from "../../components/workflow/WorkflowBuilder";
import api from "../../services/api";


// Sample campaigns data
const SAMPLE_CAMPAIGNS = {
  active: [
    {
      id: 1,
      name: "New Campaign",
      prospects: "12/73,98,12,123",
      progress: 2,
      engaged: 0,
      replied: 0,
      status: "running",
      source: "B2C",
      createdAt: "23 December, 2025",
    },
    {
      id: 2,
      name: "New Campaign",
      prospects: "12/73,98,12,123",
      progress: 2,
      engaged: 0,
      replied: 0,
      status: "paused",
      source: "B2B",
      createdAt: "23 December, 2025",
    },
    {
      id: 3,
      name: "Project Manager in UK",
      prospects: null,
      progress: null,
      engaged: null,
      replied: null,
      status: "draft",
      source: "B2C",
      createdAt: "23 December, 2025",
    },
    {
      id: 4,
      name: "Potential candidates",
      prospects: null,
      progress: null,
      engaged: null,
      replied: null,
      status: "draft",
      source: "organic",
      createdAt: "23 December, 2025",
    },
  ],
  completed: [
    {
      id: 5,
      name: "New Campaign",
      prospects: "498/498",
      progress: 100,
      engaged: 15,
      replied: 8,
      status: "done",
      source: "B2C",
      createdAt: "20 October, 2025",
      leadsGenerated: 498,
    },
    {
      id: 6,
      name: "New Campaign",
      prospects: "498/498",
      progress: 100,
      engaged: 12,
      replied: 5,
      status: "done",
      source: "B2B",
      createdAt: "20 September, 2025",
      leadsGenerated: 498,
    },
    {
      id: 7,
      name: "New Campaign",
      prospects: "498/498",
      progress: 100,
      engaged: 20,
      replied: 10,
      status: "done",
      source: "organic",
      createdAt: "20 August, 2025",
      leadsGenerated: 498,
    },
    {
      id: 8,
      name: "New Campaign",
      prospects: "498/498",
      progress: 100,
      engaged: 18,
      replied: 7,
      status: "done",
      source: "B2C",
      createdAt: "20 July, 2025",
      leadsGenerated: 498,
    },
    {
      id: 9,
      name: "New Campaign",
      prospects: "498/498",
      progress: 100,
      engaged: 22,
      replied: 12,
      status: "done",
      source: "B2B",
      createdAt: "20 June, 2025",
      leadsGenerated: 498,
    },
  ],
};

// Sample leads for campaign details
const SAMPLE_LEADS = [
  {
    id: 1,
    name: "Beatriz Strickland",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123", "+44 - 456 78 901"],
    emails: ["radio@helicopter.com"],
    isEnriched: true,
  },
  {
    id: 2,
    name: "Sylvester Matthews",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: true,
  },
  {
    id: 3,
    name: "Louella Mullins",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: false,
  },
  {
    id: 4,
    name: "Michael Burke",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: true,
  },
  {
    id: 5,
    name: "Donna Prince",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: true,
  },
  {
    id: 6,
    name: "Thomas Burke",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: false,
  },
  {
    id: 7,
    name: "Hank Terrell",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: false,
  },
  {
    id: 8,
    name: "Shirley Burke",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: true,
  },
  {
    id: 9,
    name: "Maribel Poole",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: false,
  },
  {
    id: 10,
    name: "Will Black",
    title: "Accountant",
    company: "CHC Helicopter",
    location: "Greater New York City Area",
    industry: "Marketing & Advertising",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    website: "chchelicopter.com",
    phones: ["+44 - 123 34 123"],
    emails: ["radio@helicopter.com"],
    isEnriched: false,
  },
];

// Source Badge Component
const SourceBadge = ({ source }) => {
  if (source === "organic") {
    return (
      <div className="w-8 h-8 bg-[#F2F2FF] rounded-full flex items-center justify-center">
        <svg
          className="w-4 h-4 text-[#3C49F7]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
    );
  }
  if (source === "campaign") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#3C49F7]">
        Campaign
      </span>
    );
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${source === "B2C" ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]"}`}
    >
      {source}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    running: "text-[#1a1a1a]",
    paused: "text-orange-500",
    draft: "bg-gray-100 text-gray-600 px-4 py-1 rounded-full",
    done: "text-green-600",
  };
  const labels = {
    running: "In Progress",
    paused: "Paused",
    draft: "Draft",
    done: "Completed",
  };
  return (
    <span className={`text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// User Avatar Component
const UserAvatar = ({ initials = "JS" }) => (
  <div className="w-8 h-8 bg-[#3C49F7] rounded-full flex items-center justify-center text-white text-xs font-semibold">
    {initials}
  </div>
);

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState(SAMPLE_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  // View states
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // B2B specific states - companies for CompanyCard display
  const [b2bCompanies, setB2bCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Modal states
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
  const [showEnrichConfirm, setShowEnrichConfirm] = useState(false);
  const [showEnrichingModal, setShowEnrichingModal] = useState(false);
  const [showCannotStartModal, setShowCannotStartModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Tooltip states
  const [showEngagedTooltip, setShowEngagedTooltip] = useState(false);
  const [showRepliedTooltip, setShowRepliedTooltip] = useState(false);

  // Workflow Builder states
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [workflowCampaign, setWorkflowCampaign] = useState(null);

  const currentCampaigns = campaigns[activeTab] || [];
  const unenrichedCount = leads.filter((l) => !l.isEnriched).length;

  // Store project IDs that have been converted to campaigns
  const [campaignProjectIds, setCampaignProjectIds] = useState(new Set());

  // const [openProfileMenuId, setOpenProfileMenuId] = useState(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await api.get("/b2b/projects/all");
        console.log("📥 Fetched all B2B projects:", response.data);

        if (
          response.data &&
          response.data.success &&
          response.data.data?.projects
        ) {
          // Transform projects to campaign format
          const transformedProjects = response.data.data.projects
            .filter((project) => {
              // Filter out projects that have been converted to campaigns
              return !campaignProjectIds.has(project.id);
            })
            .map((project) => {
              // Format the created_at date
              const createdDate = new Date(project.created_at);
              const formattedDate = createdDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return {
                id: project.id,
                name: project.name,
                prospects: null,
                progress: null,
                engaged: null,
                replied: null,
                status: "draft", // Default status for fetched projects
                source:
                  project.source === "b2b"
                    ? "B2B"
                    : project.source === "b2c"
                      ? "B2C"
                      : "organic",
                sourceType: project.source, // Keep original API source for enrichment logic
                createdAt: formattedDate,
              };
            });

          // Merge projects with existing campaigns in active list
          setCampaigns((prev) => {
            // Filter out old projects, keep campaigns
            const existingCampaigns = prev.active.filter(
              (item) => item.isCampaign,
            );
            return {
              ...prev,
              active: [...transformedProjects, ...existingCampaigns],
            };
          });
        }
      } catch (error) {
        console.error("❌ Error fetching B2B projects:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [campaignProjectIds]);

  // Fetch campaigns from scheduler API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoadingCampaigns(true);
      try {
        const response = await api.get("/scheduler/v1/campaigns");
        console.log("📥 Fetched campaigns:", response.data);

        if (response.data && response.data.campaigns) {
          // Extract project IDs that have been converted to campaigns
          const projectIds = new Set(
            response.data.campaigns
              .map((campaign) => campaign.b2b_b2c_project_id)
              .filter(Boolean), // Filter out null/undefined values
          );
          setCampaignProjectIds(projectIds);
          console.log(
            "📋 Project IDs converted to campaigns:",
            Array.from(projectIds),
          );

          // Transform campaigns to match the campaign card format
          const transformedCampaigns = response.data.campaigns.map(
            (campaign) => {
              // Format the created_at date
              const createdDate = new Date(campaign.created_at);
              const formattedDate = createdDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              // Determine status based on campaign status
              let displayStatus = "draft";
              if (
                campaign.status === "running" ||
                campaign.status === "active"
              ) {
                displayStatus = "running";
              } else if (campaign.status === "paused") {
                displayStatus = "paused";
              } else if (
                campaign.status === "completed" ||
                campaign.status === "done"
              ) {
                displayStatus = "done";
              }

              // Calculate progress percentage
              const progress =
                campaign.total_leads > 0
                  ? Math.round(
                    (campaign.leads_completed / campaign.total_leads) * 100,
                  )
                  : null;

              // Calculate engaged and replied percentages
              const engaged =
                campaign.total_leads > 0
                  ? Math.round(
                    (campaign.leads_in_progress / campaign.total_leads) * 100,
                  )
                  : null;
              const replied =
                campaign.total_leads > 0
                  ? Math.round(
                    (campaign.leads_responded / campaign.total_leads) * 100,
                  )
                  : null;

              return {
                id: campaign.id,
                name: campaign.name,
                description: campaign.description,
                prospects:
                  campaign.total_leads > 0
                    ? `${campaign.leads_completed}/${campaign.total_leads}`
                    : null,
                progress: progress,
                engaged: engaged,
                replied: replied,
                status: displayStatus,
                source: "campaign", // Mark as campaign type
                sourceType: "campaign",
                createdAt: formattedDate,
                isCampaign: true, // Flag to distinguish from projects
                // Additional campaign-specific data
                workflowId: campaign.workflow_id,
                b2bB2cProjectId: campaign.b2b_b2c_project_id,
                totalLeads: campaign.total_leads,
                leadsCompleted: campaign.leads_completed,
                leadsInProgress: campaign.leads_in_progress,
                leadsFailed: campaign.leads_failed,
                leadsResponded: campaign.leads_responded,
                startDate: campaign.start_date,
                timezone: campaign.timezone,
              };
            },
          );

          // Separate campaigns into active and completed
          const activeCampaigns = transformedCampaigns.filter(
            (c) => c.status !== "done",
          );
          const completedCampaigns = transformedCampaigns.filter(
            (c) => c.status === "done",
          );

          // Merge campaigns with existing projects
          setCampaigns((prev) => {
            // Filter out old campaigns, keep projects
            const existingProjects = prev.active.filter(
              (item) => !item.isCampaign,
            );
            const existingCompletedCampaigns = prev.completed.filter(
              (item) => item.isCampaign,
            );

            return {
              ...prev,
              active: [...existingProjects, ...activeCampaigns],
              completed: [...existingCompletedCampaigns, ...completedCampaigns],
            };
          });
        }
      } catch (error) {
        console.error("❌ Error fetching campaigns:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Fetch project results
  const fetchProjectResults = async (projectId, campaignSource) => {
    setIsLoadingResults(true);
    try {
      const response = await api.get(`/b2b/projects/${projectId}/results`);
      console.log("📥 Fetched project results:", response.data);

      if (
        response.data &&
        response.data.success &&
        response.data.data?.results
      ) {
        // Check if this is a B2B project (source = "b2b" or "B2B")
        const isB2B = (campaignSource || "").toLowerCase() === "b2b";

        if (isB2B) {
          // For B2B projects, transform to CompanyCard format (exactly like B2B advanced search)
          const transformedCompanies = response.data.data.results.map(
            (company) => {
              return {
                id: company.id,
                // Store company_number separately for directors API (external_id contains the Companies House number)
                companyNumber:
                  company.external_id || company.company_number || "",
                name: company.name || "Unknown",
                email_domain: company.website
                  ? company.website
                    .replace(/^https?:\/\//, "")
                    .replace(/^www\./, "")
                  : "",
                ticker_symbol: "",
                industry_str:
                  company.description || company.sic_codes?.[0] || "",
                city: "",
                region: "",
                country_code: "",
                location: company.location || company.address || "N/A",
                status: company.company_status || "Active",
                logo:
                  company.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || "Unknown")}&background=3C49F7&color=fff`,
                hasWebsite: !!company.website,
                hasInstagram: false,
                hasLinkedin: false,
                incorporatedDate: company.date_of_creation || "N/A",
                sicCodes: company.sic_codes || [],
                companyType: company.company_type || "N/A",
                directors: [],
                originalId: company.id,
                website: company.website || "",
                email: company.email || "",
                phone: company.phone || "",
              };
            },
          );

          setB2bCompanies(transformedCompanies);
          setLeads([]); // Clear leads for B2B
          setSelectedCompanies([]);
        } else {
          // For B2C/Organic projects, use existing transformation
          const transformedLeads = response.data.data.results.map((result) => ({
            id: result.id,
            externalId: result.external_id, // RocketReach person ID for B2C enrichment
            name: result.name || "Unknown",
            title: result.description || "",
            company: result.company_type || "",
            location: result.location || "",
            industry: "", // Not provided in API response
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name || "Unknown")}&background=3C49F7&color=fff&size=100`,
            website: result.website || "",
            phones: result.phone ? [result.phone] : [],
            emails: result.email ? [result.email] : [],
            isEnriched: result.is_enriched || false,
            past: [], // Past positions - will be populated on enrichment
            education: [], // Education - will be populated on enrichment
            linkedin: "", // LinkedIn URL - will be populated on enrichment
          }));

          setLeads(transformedLeads);
          setB2bCompanies([]); // Clear B2B companies for non-B2B
        }
      } else {
        // If no results, set empty arrays
        setLeads([]);
        setB2bCompanies([]);
      }
    } catch (error) {
      console.error("❌ Error fetching project results:", error);
      console.error("Error details:", error.response?.data || error.message);
      // On error, show empty
      setLeads([]);
      setB2bCompanies([]);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Handlers
  const handleCampaignClick = async (campaign) => {
    // For running or paused campaigns - do nothing
    if (campaign.status === "running" || campaign.status === "paused") {
      return;
    }

    // For completed and draft campaigns - open leads view
    setViewingCampaign(campaign);
    setSelectedLeads([]);

    // Fetch actual results for the campaign, passing source type
    const campaignSource = campaign.sourceType || campaign.source;
    await fetchProjectResults(campaign.id, campaignSource);
  };

  const handleBackFromCampaign = () => {
    setViewingCampaign(null);
    setSelectedLeads([]);
  };

  const handleMenuAction = (action, campaign) => {
    setOpenMenuId(null);
    switch (action) {
      case "duplicate": {
        const newCampaign = {
          ...campaign,
          id: Date.now(),
          name: `${campaign.name} (Copy)`,
        };
        setCampaigns((prev) => ({
          ...prev,
          active: [...prev.active, newCampaign],
        }));
        break;
      }
      case "pause":
        setCampaigns((prev) => ({
          ...prev,
          active: prev.active.map((c) =>
            c.id === campaign.id
              ? { ...c, status: c.status === "paused" ? "running" : "paused" }
              : c,
          ),
        }));
        break;
      case "delete":
        setCampaigns((prev) => ({
          ...prev,
          active: prev.active.filter((c) => c.id !== campaign.id),
          completed: prev.completed.filter((c) => c.id !== campaign.id),
        }));
        break;
      case "share":
        console.log("Share campaign:", campaign);
        break;
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRemoveLead = (lead) => {
    setSelectedLead(lead);
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    setLeads((prev) => prev.filter((l) => l.id !== selectedLead.id));
    setShowRemoveConfirm(false);
    setShowRemoveSuccess(true);
  };

  const handleEnrichAll = () => {
    setShowEnrichConfirm(true);
  };

  const handleConfirmEnrichAll = async () => {
    setShowEnrichConfirm(false);
    setShowEnrichingModal(true);

    const unenrichedLeads = leads.filter((l) => !l.isEnriched);

    // Enrich all unenriched leads sequentially
    for (const lead of unenrichedLeads) {
      await handleEnrichLead(lead.id);
    }

    setShowEnrichingModal(false);
  };

  // Enrich single lead (for B2C/non-B2B projects only - B2B uses CompanyCard's inline enrichment)
  const handleEnrichLead = async (id) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.isEnriched) return;

    try {
      let enrichedData = null;

      // B2C Enrichment
      console.log(
        "🔍 Enriching B2C lead:",
        lead.name,
        "with external ID:",
        lead.externalId,
      );

      if (!lead.externalId) {
        console.error("❌ No external ID found for B2C lead");
        return;
      }

      const response = await api.get(
        `/b2b/v1/b2c/lookup-person-raw/${lead.externalId}`,
      );
      console.log("✅ B2C Enrichment Response:", response.data);

      if (response.data) {
        // Transform job_history to pastPositions format
        const pastPositions = (response.data.job_history || [])
          .filter((job) => !job.is_current)
          .map((job) => ({
            title: job.title || "N/A",
            company: job.company_name || job.company || "N/A",
            years: `${job.start_date ? new Date(job.start_date).getFullYear() : "N/A"} - ${job.end_date === "Present" ? "Present" : job.end_date ? new Date(job.end_date).getFullYear() : "N/A"}`,
          }));

        // Transform education array
        const education = (response.data.education || []).map((edu) => ({
          school: edu.school || "N/A",
          degree: edu.degree || "",
          major: edu.major || "",
          years: `${edu.start || "N/A"}-${edu.end || "N/A"}`,
        }));

        enrichedData = {
          phones: (response.data.phones || []).map((phone) => phone.number),
          emails: (response.data.emails || []).map((email) => email.email),
          website: response.data.current_employer_domain || lead.website,
          pastPositions: pastPositions,
          education: education,
          avatar: response.data.profile_pic || lead.avatar,
          linkedin: response.data.linkedin_url || response.data.links?.linkedin,
        };
      }

      // Update the lead with enriched data
      if (enrichedData) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                ...l,
                isEnriched: true,
                phones:
                  enrichedData.phones?.length > 0
                    ? enrichedData.phones
                    : l.phones,
                emails:
                  enrichedData.emails?.length > 0
                    ? enrichedData.emails
                    : l.emails,
                website: enrichedData.website || l.website,
                past: enrichedData.pastPositions || l.past || [],
                education: enrichedData.education || l.education || [],
                avatar: enrichedData.avatar || l.avatar,
                linkedin: enrichedData.linkedin || l.linkedin,
              }
              : l,
          ),
        );
      }
    } catch (error) {
      console.error("❌ Error enriching lead:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  // Workflow Builder handler
  const handleStartWorkflow = (campaign = null) => {
    // Check if there are unenriched leads
    const hasUnenriched = leads.some((l) => !l.isEnriched);
    if (hasUnenriched) {
      setShowCannotStartModal(true);
      return;
    }

    setWorkflowCampaign(campaign || viewingCampaign);
    setShowWorkflowBuilder(true);
  };

  // Campaign Details View (for draft and completed campaigns)
  if (viewingCampaign) {
    const isB2BProject =
      (
        viewingCampaign.sourceType ||
        viewingCampaign.source ||
        ""
      ).toLowerCase() === "b2b";
    const totalLeads = isLoadingResults
      ? "..."
      : viewingCampaign.leadsGenerated ||
      (isB2BProject ? b2bCompanies.length : leads.length);

    return (
      <div className="flex-1 min-h-full p-8 overflow-y-auto bg-[#F8F9FC]">
        {/* Back Button */}
        <button
          onClick={handleBackFromCampaign}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-normal text-[#1a1a1a] font-['DM_Sans']">
              {viewingCampaign.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-sm">
                {viewingCampaign.createdAt}
              </span>
              {viewingCampaign.status === "done" && (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  Campaign Ended – 100% Done
                </span>
              )}
              {viewingCampaign.status === "draft" && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                  Draft
                </span>
              )}
              <SourceBadge source={viewingCampaign.source} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Leads generated</p>
            <p className="text-[48px] font-semibold text-[#1a1a1a] leading-none">
              {totalLeads}
            </p>
          </div>
        </div>

        {/* Results Count & Actions */}
        {!isLoadingResults && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {(() => {
                const isB2B =
                  (
                    viewingCampaign?.sourceType ||
                    viewingCampaign?.source ||
                    ""
                  ).toLowerCase() === "b2b";
                const count = isB2B ? b2bCompanies.length : leads.length;
                const label = isB2B ? "companies" : "results";
                return count > 0
                  ? `1 - ${Math.min(10, count)} of about ${count} ${label}.`
                  : `No ${label} found.`;
              })()}
            </p>
            <div className="flex items-center gap-3">
              {((
                viewingCampaign?.sourceType ||
                viewingCampaign?.source ||
                ""
              ).toLowerCase() === "b2b"
                ? b2bCompanies.length > 0
                : leads.length > 0) && (
                  <>
                    <button className="text-[#3C49F7] text-sm font-medium hover:underline">
                      Export{" "}
                      {(
                        viewingCampaign?.sourceType ||
                        viewingCampaign?.source ||
                        ""
                      ).toLowerCase() === "b2b"
                        ? "Companies"
                        : "Leads"}
                    </button>
                    {(
                      viewingCampaign?.sourceType ||
                      viewingCampaign?.source ||
                      ""
                    ).toLowerCase() !== "b2b" &&
                      unenrichedCount > 0 && (
                        <button
                          onClick={handleEnrichAll}
                          className="border border-[#3C49F7] text-[#3C49F7] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#F2F2FF]"
                        >
                          Enrich All {unenrichedCount} Leads
                        </button>
                      )}
                    <button
                      onClick={() => handleStartWorkflow()}
                      className="bg-[#3C49F7] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
                    >
                      Start Workflow Builder
                    </button>
                  </>
                )}
            </div>
          </div>
        )}

        {/* Select All - For B2B companies or regular leads */}
        {!isLoadingResults && (b2bCompanies.length > 0 || leads.length > 0) && (
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              className="appearance-none w-[18px] h-[18px] rounded-[6px] border border-gray-300 bg-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer checked:bg-blue-600 checked:border-blue-600 checked:after:content-[''] checked:after:block checked:after:w-[6px] checked:after:h-[10px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45 checked:after:translate-x-[5px] checked:after:translate-y-[1px]"
              onChange={(e) => {
                const isB2B =
                  (
                    viewingCampaign?.sourceType ||
                    viewingCampaign?.source ||
                    ""
                  ).toLowerCase() === "b2b";
                if (isB2B) {
                  setSelectedCompanies(
                    e.target.checked ? b2bCompanies.map((c) => c.id) : [],
                  );
                } else {
                  setSelectedLeads(
                    e.target.checked ? leads.map((l) => l.id) : [],
                  );
                }
              }}
              checked={
                (
                  viewingCampaign?.sourceType ||
                  viewingCampaign?.source ||
                  ""
                ).toLowerCase() === "b2b"
                  ? selectedCompanies.length === b2bCompanies.length &&
                  b2bCompanies.length > 0
                  : selectedLeads.length === leads.length && leads.length > 0
              }
            />
            <span className="text-sm text-gray-700">Select All</span>
          </div>
        )}

        {/* Results List - B2B Companies or Regular Leads */}
        <div className="space-y-2">
          {isLoadingResults ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C49F7]"></div>
                <p className="text-sm text-gray-500">Loading results...</p>
              </div>
            </div>
          ) : (
            viewingCampaign?.sourceType ||
            viewingCampaign?.source ||
            ""
          ).toLowerCase() === "b2b" ? (
            // B2B Projects - Show CompanyCard with View Active Directors (exactly like B2B advanced search)
            b2bCompanies.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500">No companies found</p>
              </div>
            ) : (
              b2bCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isSelected={selectedCompanies.includes(company.id)}
                  onSelect={(companyId) => {
                    setSelectedCompanies((prev) =>
                      prev.includes(companyId)
                        ? prev.filter((id) => id !== companyId)
                        : [...prev, companyId],
                    );
                  }}
                  onAddToProject={() => handleRemoveLead(company)}
                  searchType="advance"
                  context={{
                    fetchDirectors: async (companyId) => {
                      // Find the company to get the companyNumber (Companies House number)
                      const targetCompany = b2bCompanies.find(
                        (c) => c.id === companyId,
                      );
                      const companyNumber = targetCompany?.companyNumber;

                      if (!companyNumber) {
                        console.error(
                          "No company number found for company:",
                          companyId,
                        );
                        return [];
                      }

                      // Fetch directors using the same API as B2BSearchContext
                      try {
                        const response = await api.get(
                          `/b2b/v1/companies-house/company/${companyNumber}/directors`,
                        );

                        const transformedDirectors = (
                          response.data.directors || []
                        ).map((director, index) => {
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
                            id: `${companyNumber}-director-${index}`,
                            name:
                              director.formatted_name || director.original_name,
                            title: director.officer_role || "Director",
                            email: "***@company.com",
                            secondaryEmail: null,
                            phones: ["***-***-****"],
                            maskedName:
                              director.formatted_name || director.original_name,
                            maskedEmail: "***@company.com",
                            maskedSecondaryEmail: null,
                            maskedPhones: ["***-***-****"],
                            isEnriched: false,
                            appointed_on: director.appointed_on,
                            address: address,
                            officer_role: director.officer_role,
                          };
                        });

                        // Update the company with directors
                        setB2bCompanies((prev) =>
                          prev.map((c) =>
                            c.id === companyId
                              ? { ...c, directors: transformedDirectors }
                              : c,
                          ),
                        );

                        return transformedDirectors;
                      } catch (error) {
                        console.error("Error fetching directors:", error);
                        return [];
                      }
                    },
                    enrichDirector: async (companyId, directorId) => {
                      // Enrich director using the same API flow as B2BSearchContext
                      const company = b2bCompanies.find(
                        (c) => c.id === companyId,
                      );
                      const director = company?.directors?.find(
                        (d) => d.id === directorId,
                      );

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

                      let enrichedData = null;
                      let dataSource = null;

                      // Try RocketReach first
                      try {
                        const rocketReachBody = {
                          query: {
                            name: [director.name],
                            current_employer: [company.name],
                          },
                        };

                        console.log(
                          "📡 Calling RocketReach API with:",
                          rocketReachBody,
                        );
                        const rocketReachResponse = await api.post(
                          "/b2b/v1/rocketreach/person-lookup",
                          rocketReachBody,
                        );

                        console.log(
                          "✅ RocketReach API Response:",
                          rocketReachResponse.data,
                        );

                        if (
                          rocketReachResponse.data?.profile &&
                          Object.keys(rocketReachResponse.data.profile).length >
                          0 &&
                          rocketReachResponse.data.profile.id
                        ) {
                          enrichedData = rocketReachResponse.data.profile;
                          dataSource = "rocketreach";
                          console.log("✅ Using RocketReach data");
                        }
                      } catch (rocketReachError) {
                        console.log(
                          "⚠️ RocketReach failed, trying ContactOut...",
                          rocketReachError.message,
                        );
                      }

                      // Fallback to ContactOut
                      if (!enrichedData) {
                        try {
                          const contactOutBody = {
                            full_name: director.name,
                            company: [company.name],
                          };

                          console.log(
                            "📡 Calling ContactOut API with:",
                            contactOutBody,
                          );
                          const contactOutResponse = await api.post(
                            "/b2b/v1/contactout/enrich",
                            contactOutBody,
                          );

                          console.log(
                            "✅ ContactOut API Response:",
                            contactOutResponse.data,
                          );

                          if (
                            contactOutResponse.data?.profile &&
                            Object.keys(contactOutResponse.data.profile)
                              .length > 0
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

                      // Transform and update director with enriched data
                      let phones = [];
                      let emails = [];
                      let title = director.title;
                      let linkedin_url = director.linkedin_url;

                      if (dataSource === "rocketreach") {
                        phones = (enrichedData.phones || []).map(
                          (phone) => phone.number,
                        );
                        emails = (enrichedData.emails || []).map(
                          (email) => email.email,
                        );
                        title = enrichedData.current_title || director.title;
                        linkedin_url = enrichedData.linkedin_url;
                      } else if (dataSource === "contactout") {
                        const allEmails = [
                          ...(enrichedData.email || []),
                          ...(enrichedData.work_email || []),
                          ...(enrichedData.personal_email || []),
                        ];
                        emails = allEmails.filter(Boolean);
                        phones = (enrichedData.phone || []).filter(Boolean);
                        title = enrichedData.headline || director.title;
                        linkedin_url = enrichedData.url;
                      }

                      // Update the director with enriched data
                      setB2bCompanies((prev) =>
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
                                      enrichedData.name ||
                                      enrichedData.full_name ||
                                      d.name,
                                    title: title,
                                    email: emails[0] || d.email,
                                    secondaryEmail: emails[1] || null,
                                    phones:
                                      phones.length > 0 ? phones : d.phones,
                                    linkedin_url: linkedin_url,
                                    enrichmentSource: dataSource,
                                  }
                                  : d,
                              ),
                            };
                          }
                          return c;
                        }),
                      );

                      console.log(
                        `✅ Successfully enriched director using ${dataSource}`,
                      );
                      return true;
                    },
                  }}
                />
              ))
            )
          ) : // Non-B2B Projects - Show ProfileCard for leads
            leads.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500">No results found</p>
              </div>
            ) : (
              leads.map((lead) => (
                <ProfileCard
                  key={lead.id}
                  profile={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={handleSelectLead}
                  onEnrich={handleEnrichLead}
                  onRemoveFromCampaign={() => handleRemoveLead(lead)}
                  context="campaign"
                />
              ))
            )}
        </div>

        {/* Pagination */}
        {!isLoadingResults &&
          (isB2BProject ? b2bCompanies.length > 0 : leads.length > 0) && (
            <div className="flex items-center justify-between mt-6">
              <div className="relative">
                <select className="appearance-none border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm bg-white cursor-pointer focus:outline-none focus:border-[#3C49F7]">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded text-sm font-medium ${page === 1 ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

        {/* Modals */}
        <CampaignManagerModals
          showRemoveConfirm={showRemoveConfirm}
          setShowRemoveConfirm={setShowRemoveConfirm}
          showRemoveSuccess={showRemoveSuccess}
          setShowRemoveSuccess={setShowRemoveSuccess}
          showEnrichConfirm={showEnrichConfirm}
          setShowEnrichConfirm={setShowEnrichConfirm}
          showEnrichingModal={showEnrichingModal}
          showCannotStartModal={showCannotStartModal}
          setShowCannotStartModal={setShowCannotStartModal}
          onConfirmRemove={handleConfirmRemove}
          onConfirmEnrichAll={handleConfirmEnrichAll}
          leadCount={unenrichedCount}
        />

        {/* Workflow Builder */}
        {showWorkflowBuilder && (
          <WorkflowBuilder
            isOpen={showWorkflowBuilder}
            onClose={() => {
              setShowWorkflowBuilder(false);
              setWorkflowCampaign(null);
            }}
            campaignName={
              workflowCampaign?.name || viewingCampaign?.name || "New Campaign"
            }
            entrySource="campaign"
          />
        )}
      </div>
    );
  }

  // Main Campaign List View
  return (
    <div className="flex-1 min-h-full p-8 overflow-y-auto bg-[#F8F9FC]">
      <h1 className="text-[32px] font-normal text-[#1a1a1a] mb-6 font-['DM_Sans']">
        Campaigns
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "active"
            ? "bg-[#1a1a1a] text-white"
            : "bg-white text-[#1a1a1a] border border-gray-200"
            }`}
        >
          Active ({campaigns.active.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "completed"
            ? "bg-[#1a1a1a] text-white"
            : "bg-white text-[#1a1a1a] border border-gray-200"
            }`}
        >
          Completed ({campaigns.completed.length})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-[#3C49F7]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Main View
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button className="bg-[#3C49F7] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]">
            Create Campaign
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-white rounded-t-xl border-b border-gray-100">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-gray-500 font-medium">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              className="w-[18px] h-[18px] rounded border border-gray-300"
            />
          </div>
          <div className="col-span-3">Name</div>
          <div className="col-span-1 relative flex items-center gap-1">
            Engaged
            <button
              onMouseEnter={() => setShowEngagedTooltip(true)}
              onMouseLeave={() => setShowEngagedTooltip(false)}
              className="text-[#3C49F7]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showEngagedTooltip && (
              <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] text-white text-xs p-2 rounded-lg w-48 z-10">
                Contacted prospects who interacted with your outreach, such as
                opening emails, clicking links or accepting your connection
                request
              </div>
            )}
          </div>
          <div className="col-span-1 relative flex items-center gap-1">
            Replied
            <button
              onMouseEnter={() => setShowRepliedTooltip(true)}
              onMouseLeave={() => setShowRepliedTooltip(false)}
              className="text-[#3C49F7]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showRepliedTooltip && (
              <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] text-white text-xs p-2 rounded-lg w-48 z-10">
                Contacted prospects who replied to your outreach via email or
                LinkedIn
              </div>
            )}
          </div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-2">Created At</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-white rounded-b-xl">
        {isLoadingProjects || isLoadingCampaigns ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C49F7]"></div>
              <p className="text-sm text-gray-500">
                Loading projects and campaigns...
              </p>
            </div>
          </div>
        ) : currentCampaigns.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">No campaigns found</p>
          </div>
        ) : (
          currentCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={`grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-50 items-center ${campaign.status === "done" || campaign.status === "draft"
                ? "hover:bg-gray-50 cursor-pointer"
                : ""
                }`}
              onClick={() => handleCampaignClick(campaign)}
            >
              <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] rounded border border-gray-300"
                />
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  {campaign.status === "running" && (
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="font-medium text-[#1a1a1a] truncate">
                    {campaign.name}
                  </span>
                  {campaign.prospects && (
                    <span className="text-gray-500 text-sm">
                      Prospects: {campaign.prospects}
                    </span>
                  )}
                </div>
                {campaign.progress !== null && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full w-48 overflow-hidden">
                      <div
                        className="h-full bg-[#3C49F7] rounded-full"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {campaign.progress}% –{" "}
                      {campaign.status === "done" ? "Completed" : "In Progress"}
                    </p>
                  </div>
                )}
              </div>
              <div className="col-span-1 text-sm">
                {campaign.engaged !== null ? (
                  <span>
                    {campaign.engaged}%{" "}
                    <span className="text-orange-500">{campaign.engaged}</span>
                  </span>
                ) : null}
              </div>
              <div className="col-span-1 text-sm">
                {campaign.replied !== null ? (
                  <span>
                    {campaign.replied}%{" "}
                    <span className="text-orange-500">{campaign.replied}</span>
                  </span>
                ) : null}
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <StatusBadge status={campaign.status} />
                {(campaign.status === "done" ||
                  campaign.status === "draft") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingCampaign(campaign);
                        setSelectedLeads([]);
                      }}
                      className="text-[#3C49F7] text-xs font-medium hover:underline"
                    ></button>
                  )}
              </div>
              <div className="col-span-1">
                <SourceBadge source={campaign.source} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <UserAvatar />
                <span className="text-sm text-gray-600">
                  {campaign.createdAt}
                </span>
              </div>
              <div
                className="col-span-1 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === campaign.id ? null : campaign.id,
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {openMenuId === campaign.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                    <button
                      onClick={() => handleMenuAction("duplicate", campaign)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleMenuAction("share", campaign)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Share
                    </button>
                    {campaign.status !== "draft" &&
                      campaign.status !== "done" && (
                        <button
                          onClick={() => handleMenuAction("pause", campaign)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {campaign.status === "paused" ? "Resume" : "Pause"}
                        </button>
                      )}
                    <button
                      onClick={() => handleMenuAction("delete", campaign)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals for main view */}
      <CampaignManagerModals
        showRemoveConfirm={showRemoveConfirm}
        setShowRemoveConfirm={setShowRemoveConfirm}
        showRemoveSuccess={showRemoveSuccess}
        setShowRemoveSuccess={setShowRemoveSuccess}
        showEnrichConfirm={showEnrichConfirm}
        setShowEnrichConfirm={setShowEnrichConfirm}
        showEnrichingModal={showEnrichingModal}
        showCannotStartModal={showCannotStartModal}
        setShowCannotStartModal={setShowCannotStartModal}
        onConfirmRemove={handleConfirmRemove}
        onConfirmEnrichAll={handleConfirmEnrichAll}
        leadCount={unenrichedCount}
      />

      {/* Workflow Builder */}
      {showWorkflowBuilder && (
        <WorkflowBuilder
          isOpen={showWorkflowBuilder}
          onClose={() => {
            setShowWorkflowBuilder(false);
            setWorkflowCampaign(null);
          }}
          campaignName={workflowCampaign?.name || "New Campaign"}
          entrySource="campaign"
        />
      )}
    </div>
  );
};

export default CampaignManager;
