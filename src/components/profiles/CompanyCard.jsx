// components/profiles/CompanyCard.jsx
import { useState } from "react";
import VerifiedIcon from "../../assets/icons/Verified.svg";
// Icons
const WebsiteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const QRIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const LoadingDots = () => (
  <div className="flex items-center justify-center py-1.5 gap-2">
    <span
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: "400ms" }}
    ></span>
    <span
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: "600ms" }}
    ></span>
    <span
      className="w-2 h-2 bg-white rounded-full animate-bounce"
      style={{ animationDelay: "400ms" }}
    ></span>
  </div>
);

// Director Card Component
const DirectorCard = ({ director, onEnrich, isLoading }) => {
  const isEnriched = director.isEnriched;

  // Display values based on enrichment status
  const displayName = isEnriched ? director.name : director.maskedName;
  const displayPhones = isEnriched ? director.phones : director.maskedPhones;
  const displayEmail = isEnriched ? director.email : director.maskedEmail;
  const displaySecondaryEmail = isEnriched
    ? director.secondaryEmail
    : director.maskedSecondaryEmail;
  const domain = director.email?.split("@")[1] || "company.com";

  return (
    <div className="border-l border-gray-300 p-4 min-w-[280px] max-w-[280px] flex-shrink-0">
      {/* Name */}
      <div className="flex items-center gap-2 mb-3">
        <EmailIcon />
        <span
          className={`text-gray-700 text-sm font-medium ${!isEnriched ? "italic" : ""}`}
        >
          {displayName}
        </span>
      </div>

      {/* Domain */}
      <div className="flex items-center gap-2 mb-3">
        <QRIcon />
        <span className="text-gray-600">@ {domain}</span>
      </div>

      {/* Phone Numbers */}
      <div className="flex items-start gap-2 mb-3">
        <PhoneIcon className="mt-1" />
        <div className="flex flex-col text-gray-600">
          {displayPhones?.map((phone, idx) => (
            <span key={idx} className={!isEnriched ? "italic" : ""}>
              {phone}
            </span>
          ))}
        </div>
      </div>

      {/* Emails */}
      <div className="flex items-start gap-2 mb-4">
        <EmailIcon className="mt-1" />
        <div className="flex flex-col">
          <a
            href={isEnriched ? `mailto:${displayEmail}` : "#"}
            className={`text-[#3C49F7] ${!isEnriched ? "italic pointer-events-none" : "hover:underline"}`}
          >
            {displayEmail}
          </a>
          <a
            href={isEnriched ? `mailto:${displaySecondaryEmail}` : "#"}
            className={`text-[#3C49F7] ${!isEnriched ? "italic pointer-events-none" : "hover:underline"}`}
          >
            {displaySecondaryEmail}
          </a>
        </div>
      </div>

      {/* Enrich Button or Enriched Badge */}
      {!isEnriched ? (
        <button
          onClick={onEnrich}
          disabled={isLoading}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[120px] ${
            isLoading
              ? "bg-[#3C49F7] text-white cursor-wait"
              : "bg-[#3C49F7] text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? <LoadingDots /> : "Enrich Profile"}
        </button>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F2F2FF] rounded text-[#0028B6]">
          <img src={VerifiedIcon} alt="verified" className="w-7 h-7" />
          <span className="text-[12px] font-semibold">Enriched Contact</span>
        </div>
      )}
    </div>
  );
};

// Main Company Card Component
export const CompanyCard = ({
  company,
  isSelected,
  onSelect,
  onAddToProject,
  searchType = "basic",
  context,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enrichingDirectorId, setEnrichingDirectorId] = useState(null);
  const [isLoadingDirectors, setIsLoadingDirectors] = useState(false);

  const isAdvanceMode = searchType === "advance";

  // Get functions from context
  const { enrichDirector, fetchDirectors } = context || {};

  // Calculate enriched directors count
  const enrichedCount =
    company.directors?.filter((d) => d.isEnriched).length || 0;
  const hasEnriched = enrichedCount > 0;

  // Handle expand/collapse with director fetching
  const handleToggleExpanded = async () => {
    if (!isExpanded && fetchDirectors) {
      // If expanding and directors not loaded, fetch them
      if (!company.directors || company.directors.length === 0) {
        setIsLoadingDirectors(true);
        await fetchDirectors(company.id);
        setIsLoadingDirectors(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  // Handle director enrichment
  const handleEnrichDirector = async (directorId) => {
    if (!enrichDirector) return;

    setEnrichingDirectorId(directorId);

    // Call the enrichment API
    const success = await enrichDirector(company.id, directorId);

    if (!success) {
      // Handle enrichment failure (e.g., show error message)
      console.error("Failed to enrich director");
    }

    setEnrichingDirectorId(null);
  };

  return (
    <div className="bg-[#FBFBFF] rounded-lg overflow-hidden hover:bg-[#F4F5FB]">
      {/* Main Card Row */}
      <div className="flex items-center p-4 gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(company.id)}
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
    checked:after:translate-x-[5px] checked:after:translate-y-[1px]"
        />

        {/* Company Logo */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={company.logo}
            alt={company.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-xl">
                  ${company.name.charAt(0).toUpperCase()}
                </div>
              `;
            }}
          />
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg">
            {company.name}
          </h3>
          <p className="text-sm text-gray-600">{company.location}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Company:</span>
            <span className="text-sm font-medium text-[#3C49F7] italic">
              {company.status}
            </span>
            {/* Social Icons */}
            <div className="flex items-center gap-1 ml-2 text-gray-400">
              {company.hasWebsite && <WebsiteIcon />}
              {company.hasInstagram && <InstagramIcon />}
              {company.hasLinkedin && <LinkedinIcon />}
            </div>
          </div>
        </div>

        {/* Basic Mode: Phone & Email */}
        {!isAdvanceMode && (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneIcon />
              <span className="text-sm">{company.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon />
              <a
                href={`mailto:${company.email}`}
                className="text-sm text-[#3C49F7]"
              >
                {company.email}
              </a>
            </div>
          </>
        )}

        {/* Advance Mode: Active Since & View Directors */}
        {isAdvanceMode && (
          <>
            <div className="text-gray-600 text-sm">
              <span>Active Since</span>
              <span className="font-medium ml-2">
                {company.incorporatedDate}
              </span>
            </div>

            <button
              onClick={handleToggleExpanded}
              disabled={isLoadingDirectors}
              className="text-[#3C49F7] text-sm font-medium hover:underline whitespace-nowrap disabled:opacity-50"
            >
              {isLoadingDirectors
                ? "Loading..."
                : isExpanded
                  ? "View Less"
                  : "View Active Directors"}
            </button>
          </>
        )}

        {/* Enriched Contact Badge (only in Advance mode when enriched) */}
        {isAdvanceMode && hasEnriched && (
          <div className="flex items-center gap-2 text-[#3C49F7]">
            <div className="w-5 h-5 bg-[#3C49F7] rounded flex items-center justify-center">
              <CheckIcon />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              Enriched Contact
            </span>
          </div>
        )}

        {/* Add to Project Button */}
        <button
          onClick={() => onAddToProject(company)}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-[#3C49F7] hover:text-[#3C49F7] transition-colors whitespace-nowrap"
        >
          Add to Project
        </button>
      </div>

      {/* Expanded Section (Advance Mode Only) */}
      {isAdvanceMode && isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-white overflow-x-scroll">
          {/* SIC Codes */}
          <div className="flex gap-8 mb-6 border-b border-gray-300">
            <div className="w-28 flex-shrink-0">
              <h4 className="font-semibold text-gray-900">SIC Codes</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm mb-3">
              {company.sicCodes?.map((code, idx) => (
                <li key={idx}>{code}</li>
              ))}
            </ul>
          </div>

          {/* Active Directors */}
          <div className="flex gap-4">
            <div className="w-28 flex-shrink-0">
              <h4 className="font-semibold text-gray-900">Active</h4>
              <h4 className="font-semibold text-gray-900">Director &</h4>
              <h4 className="font-semibold text-gray-900">Contact Info</h4>
            </div>
            <div
              className="flex gap-4 overflow-x-auto pb-4 flex-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E0 #F7FAFC",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {isLoadingDirectors ? (
                <div className="flex items-center justify-center p-8 min-w-full">
                  <span className="text-gray-500">Loading directors...</span>
                </div>
              ) : company.directors && company.directors.length > 0 ? (
                company.directors.map((director) => (
                  <DirectorCard
                    key={director.id}
                    director={director}
                    onEnrich={() => handleEnrichDirector(director.id)}
                    isLoading={enrichingDirectorId === director.id}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center p-8 min-w-full">
                  <span className="text-gray-500">No directors found</span>
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f7fafc;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e0;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #a0aec0;
            }
          `}</style>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleToggleExpanded}
              className="text-[#3C49F7] text-sm font-medium hover:underline"
            >
              View Less
            </button>
            {enrichedCount > 0 && (
              <span className="text-[#3C49F7] text-sm font-medium italic">
                {enrichedCount} Credit{enrichedCount > 1 ? "s" : ""} Used
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
