// pages/OrganicLeadBuilder.jsx
import { useState } from "react";
import SetAccountModal from "../../components/organic/SetAccountModal";
import RemoveAccountModal from "../../components/organic/RemoveAccountModal";
import BuildProfileModal from "../../components/organic/BuildProfileModal";
import CampaignModals from "../../components/organic/CampaignModals";
import { ProfileCard } from "../../components/profiles/ProfileComponents";
import WorkflowBuilder from "../../components/workflow/WorkflowBuilder";
import linkedin from "../../assets/icons/LinkedIn.png";

// Sample leads data for completed campaigns
const SAMPLE_LEADS = [
  { id: 1, name: "Beatriz Strickland", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "beatriz@helicopter.com"], isEnriched: true },
  { id: 2, name: "Sylvester Matthews", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "sylvester@helicopter.com"], isEnriched: true },
  { id: 3, name: "Louella Mullins", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "louella@helicopter.com"], isEnriched: true },
  { id: 4, name: "Michael Burke", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "michael@helicopter.com"], isEnriched: true },
  { id: 5, name: "Donna Prince", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "donna@helicopter.com"], isEnriched: true },
  { id: 6, name: "Thomas Burke", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "thomas@helicopter.com"], isEnriched: true },
  { id: 7, name: "Hank Terrell", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "hank@helicopter.com"], isEnriched: true },
  { id: 8, name: "Shirley Burke", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "shirley@helicopter.com"], isEnriched: true },
  { id: 9, name: "Maribel Poole", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "maribel@helicopter.com"], isEnriched: true },
  { id: 10, name: "Will Black", title: "Accountant", company: "CHC Helicopter", location: "Greater New York City Area", industry: "Marketing & Advertising", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face", website: "chchelicopter.com", phones: ["+44 - 123 34 123", "+44 - 456 78 901", "+44 - 789 01 234"], emails: ["radio@helicopter.com", "will@helicopter.com"], isEnriched: true },
];

// Sample data for testing with existing campaigns
// const SAMPLE_CAMPAIGNS = {
//   inProgress: [
//     {
//       id: 1,
//       name: "New Campaign",
//       date: "20 December, 2025",
//       progress: 2,
//       status: "running",
//       prospectsFound: 5,
//       prospectsTotal: 498,
//     },
//   ],
//   completed: [
//     {
//       id: 2,
//       name: "New Campaign",
//       date: "20 Oct 2025, 12:37 PM",
//       progress: 100,
//       status: "done",
//       prospectsFound: 498,
//       prospectsTotal: 498,
//     },
//     {
//       id: 3,
//       name: "New Campaign",
//       date: "20 Sep 2025, 12:37 PM",
//       progress: 100,
//       status: "done",
//       prospectsFound: 498,
//       prospectsTotal: 498,
//     },
//     {
//       id: 4,
//       name: "New Campaign",
//       date: "20 Aug 2025, 12:37 PM",
//       progress: 100,
//       status: "done",
//       prospectsFound: 498,
//       prospectsTotal: 498,
//     },
//     {
//       id: 5,
//       name: "New Campaign",
//       date: "20 Jul 2025, 12:37 PM",
//       progress: 100,
//       status: "done",
//       prospectsFound: 498,
//       prospectsTotal: 498,
//     },
//     {
//       id: 6,
//       name: "New Campaign",
//       date: "20 Jun 2025, 12:37 PM",
//       progress: 100,
//       status: "done",
//       prospectsFound: 498,
//       prospectsTotal: 498,
//     },
//   ],
// };
const SAMPLE_CAMPAIGNS = {
  inProgress: [],
  completed: [
    {
      id: 2,
      name: "New Campaign",
      date: "20 Oct 2025, 12:37 PM",
      progress: 100,
      status: "done",
      prospectsFound: 498,
      prospectsTotal: 498,
    },
  ],
};


const OrganicLeadBuilder = () => {
  // Account State
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);

  // Campaign State
  const [campaigns, setCampaigns] = useState(SAMPLE_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState("inProgress");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewingLeads, setViewingLeads] = useState(false);
  const [leadsViewCampaign, setLeadsViewCampaign] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);

  // Modal States
  const [showSetAccountModal, setShowSetAccountModal] = useState(false);
  const [showRemoveAccountModal, setShowRemoveAccountModal] = useState(false);
  const [showBuildProfileModal, setShowBuildProfileModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Campaign Modal States
  const [showLinkedInNotConnected, setShowLinkedInNotConnected] = useState(false);
  const [showCampaignInProgress, setShowCampaignInProgress] = useState(false);
  const [showCannotRunModal, setShowCannotRunModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeletingModal, setShowDeletingModal] = useState(false);
  const [showResumingModal, setShowResumingModal] = useState(false);

  // Workflow Builder States
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [workflowCampaign, setWorkflowCampaign] = useState(null);

  // Account Handlers
  const handleConnectAccount = () => {
    setIsEditMode(false);
    setShowSetAccountModal(true);
  };

  const handleSaveAccount = (accountData) => {
    setConnectedAccount(accountData);
    setIsConnected(true);
    setShowSetAccountModal(false);
  };

  const handleEditAccount = () => {
    setIsEditMode(true);
    setShowSetAccountModal(true);
  };

  const handleDeleteAccount = () => {
    setShowRemoveAccountModal(true);
  };

  const handleConfirmRemoveAccount = () => {
    setConnectedAccount(null);
    setIsConnected(false);
    setShowRemoveAccountModal(false);
  };

  // Campaign Handlers
  const handleAddNewCampaign = () => {
    if (!isConnected) {
      setShowLinkedInNotConnected(true);
      return;
    }

    const hasRunningCampaign = campaigns.inProgress.some(c => c.status === "running");
    if (hasRunningCampaign) {
      setShowCannotRunModal(true);
    } else {
      setShowBuildProfileModal(true);
    }
  };

  const handleStartCampaign = (campaignData) => {
    const newCampaign = {
      id: Date.now(),
      name: "New Campaign",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      progress: 0,
      status: "running",
      prospectsFound: 0,
      prospectsTotal: 498,
      filters: campaignData.filters,
      settings: campaignData.settings,
    };
    setCampaigns(prev => ({
      ...prev,
      inProgress: [...prev.inProgress, newCampaign],
    }));
    setShowBuildProfileModal(false);
    setActiveTab("inProgress");
  };

  const handleCampaignClick = (campaign) => {
    if (campaign.status === "running" || campaign.status === "paused") {
      setSelectedCampaign(campaign);
      setShowCampaignInProgress(true);
    }
  };

  const handlePauseCampaign = (campaignId) => {
    setCampaigns(prev => ({
      ...prev,
      inProgress: prev.inProgress.map(c =>
        c.id === campaignId ? { ...c, status: c.status === "paused" ? "running" : "paused" } : c
      ),
    }));
    setOpenMenuId(null);
  };

  const handleResumeCampaign = (campaignId) => {
    setSelectedCampaign(campaigns.inProgress.find(c => c.id === campaignId));
    setShowResumingModal(true);
    setOpenMenuId(null);

    setTimeout(() => {
      setCampaigns(prev => ({
        ...prev,
        inProgress: prev.inProgress.map(c =>
          c.id === campaignId ? { ...c, status: "running" } : c
        ),
      }));
      setShowResumingModal(false);
    }, 2000);
  };

  const handleDeleteCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeletingModal(true);

    setTimeout(() => {
      setCampaigns(prev => ({
        ...prev,
        inProgress: prev.inProgress.filter(c => c.id !== selectedCampaign.id),
        completed: prev.completed.filter(c => c.id !== selectedCampaign.id),
      }));
      setShowDeletingModal(false);
      setSelectedCampaign(null);
    }, 2000);
  };

  const handleViewLeads = (campaign) => {
    setLeadsViewCampaign(campaign);
    setViewingLeads(true);
  };

  const handleBackFromLeads = () => {
    setViewingLeads(false);
    setLeadsViewCampaign(null);
  };

  // Workflow Builder handler
  const handleStartWorkflow = (campaign = null) => {
    setWorkflowCampaign(campaign || leadsViewCampaign);
    setShowWorkflowBuilder(true);
  };

  // Render Campaign Card
  const renderCampaignCard = (campaign, isCompleted = false) => {
    const isPaused = campaign.status === "paused";

    return (
      <div
        key={campaign.id}
        className="bg-white rounded-xl p-5 mb-3 border border-gray-100 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`flex items-center gap-2 ${!isCompleted ? 'cursor-pointer' : ''}`}
              onClick={() => !isCompleted && handleCampaignClick(campaign)}
            >
              {!isCompleted && (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium text-[#1a1a1a]">
                {campaign.name} – {campaign.date}
              </span>
            </div>

            <div className="mt-3 w-full max-w-[500px]">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "bg-[#3C49F7]" : "bg-[#3C49F7]"
                    }`}
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.progress}% – {isPaused ? "Pause" : isCompleted ? "Done" : "In Progress"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-gray-500">Prospects: </span>
              <span className="font-semibold text-[#1a1a1a]">
                {campaign.prospectsFound}/{campaign.prospectsTotal}
              </span>
              <span className="text-sm text-gray-400 ml-1">found</span>
            </div>

            {isCompleted && (
              <button
                onClick={() => handleViewLeads(campaign)}
                className="text-[#3C49F7] bg-[#F7F7F7] px-2 py-2.5 rounded-full hover:border-2 hover:border-[#3C49F7] font-medium text-sm hover:underline"
              >
                View Leads
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {openMenuId === campaign.id && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                  {!isCompleted && (
                    <button
                      onClick={() => isPaused ? handleResumeCampaign(campaign.id) : handlePauseCampaign(campaign.id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {isPaused ? "Resume Campaign" : "Pause Campaign"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCampaign(campaign)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Delete Campaign
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If viewing leads, show the Campaign Leads View
  if (viewingLeads && leadsViewCampaign) {
    const totalResults = leadsViewCampaign.prospectsFound || 498;

    const handleSelectLead = (id) => {
      setSelectedLeads(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const handleEnrichLead = (id) => {
      console.log("Enrich lead:", id);
    };

    const handleAddToProject = (profile) => {
      console.log("Add to project:", profile);
    };

    return (
      <div className="flex-1 min-h-full p-8 overflow-y-auto bg-[#F8F9FC]">
        {/* Back Button */}
        <button
          onClick={handleBackFromLeads}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-normal text-[#1a1a1a] font-['DM_Sans']">
              {leadsViewCampaign.name || "New Campaign"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-sm">{leadsViewCampaign.date}</span>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                Campaign Ended – 100% Done
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-500 text-sm">Leads generated</p>
            <p className="text-[48px] font-semibold text-[#1a1a1a] leading-none">{totalResults}</p>
          </div>
        </div>

        {/* Results Count & Actions */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">1 - 10 of about {totalResults} results.</p>
          <div className="flex items-center gap-3">
            <button className="text-[#3C49F7] text-sm font-medium hover:underline">Export Leads</button>
            <button
              onClick={() => handleStartWorkflow()}
              className="bg-[#3C49F7] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4]"
            >
              Start Workflow Builder
            </button>
          </div>
        </div>

        {/* Select All */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            className="appearance-none w-[18px] h-[18px] rounded-[6px] border border-gray-300 bg-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer checked:bg-blue-600 checked:border-blue-600 checked:after:content-[''] checked:after:block checked:after:w-[6px] checked:after:h-[10px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45 checked:after:translate-x-[5px] checked:after:translate-y-[1px]"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedLeads(SAMPLE_LEADS.map(l => l.id));
              } else {
                setSelectedLeads([]);
              }
            }}
            checked={selectedLeads.length === SAMPLE_LEADS.length}
          />
          <span className="text-sm text-gray-700">Select All</span>
          {selectedLeads.length > 0 && (
            <span className="text-sm text-gray-500">({selectedLeads.length} selected)</span>
          )}
        </div>

        {/* Leads List - Using ProfileCard Component */}
        <div className="space-y-2 overflow-hidden">
          {SAMPLE_LEADS.map(lead => (
            <ProfileCard
              key={lead.id}
              profile={lead}
              isSelected={selectedLeads.includes(lead.id)}
              onSelect={handleSelectLead}
              onEnrich={handleEnrichLead}
              onAddToProject={handleAddToProject}
            />
          ))}
        </div>

        {/* Pagination */}
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(page => (
              <button key={page} className={`w-8 h-8 rounded text-sm font-medium ${page === 1 ? "bg-[#1a1a1a] text-white" : "text-gray-600 hover:bg-gray-100"}`}>{page}</button>
            ))}
            <button className="p-2 rounded hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Workflow Builder */}
        {showWorkflowBuilder && (
          <WorkflowBuilder
            isOpen={showWorkflowBuilder}
            onClose={() => {
              setShowWorkflowBuilder(false);
              setWorkflowCampaign(null);
            }}
            campaignName={workflowCampaign?.name || leadsViewCampaign?.name || "New Campaign"}
            entrySource="organic"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-full p-8 overflow-y-auto bg-[#F8F9FC]">
      {/* Account Section */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        {isConnected ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[28px] font-normal text-[#1a1a1a] font-['DM_Sans']">
                Great! We have connected your LinkedIn account
              </h1>
              <button className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={connectedAccount?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-lg font-medium text-[#1a1a1a]">
                  {connectedAccount?.name || "Thomas Burke"}
                </span>
                <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs px-3 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Connection Requests Sent{" "}
                  <span className="font-semibold text-[#1a1a1a]">{connectedAccount?.connectionsSent || 123}</span>
                </span>
                <span className="text-gray-300">|</span>
                <button onClick={handleEditAccount} className="flex items-center gap-1 text-sm text-[#1a1a1a] hover:text-[#3C49F7]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button onClick={handleDeleteAccount} className="flex items-center gap-1 text-sm text-[#1a1a1a] hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-[32px] font-light text-[#1a1a1a] font-['DM_Sans'] italic">
                To start generate leads,
              </h1>
              <p className="text-lg font-semibold text-[#1a1a1a]">We need you to:</p>
            </div>

            <div className="bg-[#F2F2FF] rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14rounded-lg flex items-center justify-center">
                  <img src={linkedin} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">Connect your Linkedin Profile</h3>
                  <p className="text-sm text-gray-500">Connect your Linkedin account to enhance your reach.</p>
                </div>
              </div>
              <button
                onClick={handleConnectAccount}
                className="bg-[#3C49F7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2a35d4] transition-colors"
              >
                Connect Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Campaigns Section - Always show */}
      <div className="bg-white rounded-2xl p-6">
        {campaigns.inProgress.length === 0 && campaigns.completed.length === 0 ? (
          <div>
            <h2 className="text-[28px] font-normal text-[#1a1a1a] mb-4">
              {isConnected ? "Start Organic Lead Search" : "Start a campaign"}
            </h2>
            <button
              onClick={handleAddNewCampaign}
              className="border border-[#3C49F7] text-[#3C49F7] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
            >
              Add New Campaign
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[28px] font-normal text-[#1a1a1a] mb-4">
                  Campaigns
                </h2>
                <button
                  onClick={handleAddNewCampaign}
                  className="border-2 border-[#1a1a1a] text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Add New Campaign
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Note: One campaign can run at a time
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("inProgress")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "inProgress"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                In Progress ({campaigns.inProgress.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "completed"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                Completed ({campaigns.completed.length})
              </button>
            </div>

            {/* Campaign List */}
            <div>
              {activeTab === "inProgress" && (
                campaigns.inProgress.length > 0 ? (
                  campaigns.inProgress.map(campaign => renderCampaignCard(campaign, false))
                ) : (
                  <p className="text-gray-500 text-center py-8">No campaigns in progress</p>
                )
              )}
              {activeTab === "completed" && (
                campaigns.completed.length > 0 ? (
                  campaigns.completed.map(campaign => renderCampaignCard(campaign, true))
                ) : (
                  <p className="text-gray-500 text-center py-8">No completed campaigns</p>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <SetAccountModal
        isOpen={showSetAccountModal}
        onClose={() => setShowSetAccountModal(false)}
        onSave={handleSaveAccount}
        isEditMode={isEditMode}
        existingData={isEditMode ? connectedAccount : null}
      />

      <RemoveAccountModal
        isOpen={showRemoveAccountModal}
        onClose={() => setShowRemoveAccountModal(false)}
        onConfirm={handleConfirmRemoveAccount}
      />

      <BuildProfileModal
        isOpen={showBuildProfileModal}
        onClose={() => setShowBuildProfileModal(false)}
        onStart={handleStartCampaign}
      />

      {/* Campaign Modals */}
      <CampaignModals
        showLinkedInNotConnected={showLinkedInNotConnected}
        setShowLinkedInNotConnected={setShowLinkedInNotConnected}
        showCampaignInProgress={showCampaignInProgress}
        setShowCampaignInProgress={setShowCampaignInProgress}
        showCannotRunModal={showCannotRunModal}
        setShowCannotRunModal={setShowCannotRunModal}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        showDeletingModal={showDeletingModal}
        showResumingModal={showResumingModal}
        onConfirmDelete={handleConfirmDelete}
        selectedCampaign={selectedCampaign}
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
          entrySource="organic"
        />
      )}
    </div>
  );
};

export default OrganicLeadBuilder; 