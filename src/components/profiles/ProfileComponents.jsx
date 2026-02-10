// components/profiles/ProfileComponents.jsx
import { useState } from "react";
import { Checkbox } from "../common/CommonComponents";
import LinkedInIcon from "../../assets/icons/LinkedIn.png";
import VerifiedIcon from "../../assets/icons/Verified.svg";
import companyicon from "../../assets/icons/company.png";
import emailicon from "../../assets/icons/email.png";
import phonenumbericon from "../../assets/icons/phone-number.png";

// Replace the entire ProfileCard component with this:

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

export const ProfileCard = ({
  profile,
  isSelected,
  onSelect,
  onEnrich,
  onAddToProject,
  onRemoveFromCampaign,
  context = "default", // "default" or "campaign"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleEnrich = async () => {
    if (isEnriching || profile.isEnriched) return;

    setIsEnriching(true);

    try {
      // Ensure minimum loading time of 1.5 seconds for better UX
      const minLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 1500),
      );

      // Call the actual API through context
      const apiCall = onEnrich(profile.id);

      // Wait for both the API call and minimum loading time
      await Promise.all([apiCall, minLoadingTime]);
    } catch (error) {
      console.error("Error enriching profile:", error);
    } finally {
      setIsEnriching(false);
    }
  };
  const handleRowClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest('input[type="checkbox"]')
    ) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`rounded-md transition-all duration-200 ${
        isSelected
          ? "bg-white "
          : isExpanded
            ? "bg-white border border-blue-600"
            : "bg-white hover:bg-[#F2F2FF] hover:shadow-md"
      }`}
    >
      {/* Main Row - Clickable */}
      <div className="p-2 cursor-pointer z-[100]" onClick={handleRowClick}>
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(profile.id)}
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
            onClick={(e) => e.stopPropagation()}
          />

          {/* Avatar */}
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-[70px] h-[70px] rounded-full object-cover border-2 border-gray-100"
          />

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-[#000000] text-lg">{profile.name}</h3>
            <p className="text-[#000000] font-semibold text-sm">
              {profile.title}
            </p>
            <p className="text-[#000000] text-sm">
              {profile.location} • {profile.industry}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {/* Website */}
            <div className="flex items-center gap-2">
              <img src={companyicon} alt="linkedin" className="w-4 h-4" />
              <span className="text-gray-800 text-sm">
                @ {profile.website || "chchelicopter.com"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <img src={phonenumbericon} alt="linkedin" className="w-4 h-4" />
              {profile.isEnriched ? (
                <span className="text-gray-800 text-sm flex items-center gap-1">
                  {(profile.phones || []).slice(0, 2).join(" , ")}
                  {(profile.phones?.length || 0) > 2 && (
                    <span className="text-[#000000] bg-[#F2F2FF] rounded px-1 py-0.5 text-xs">
                      + {profile.phones.length - 2} more
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-gray-800 text-sm flex items-center gap-1">
                  +44 -{" "}
                  <span className="bg-[#F2F2FF] text-[#F2F2FF] rounded px-4 py-0.5">
                    hidden
                  </span>
                  <span className="text-[#000000] bg-[#F2F2FF] rounded px-1 py-0.5 text-xs">
                    + 2 more
                  </span>
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              <img src={emailicon} alt="linkedin" className="w-4 h-4" />
              {profile.isEnriched ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {(profile.emails || []).slice(0, 2).map((email, idx, arr) => (
                    <a
                      key={idx}
                      href={`mailto:${email}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {email}
                      {idx < arr.length - 1 ? "," : ""}
                    </a>
                  ))}
                  {(profile.emails?.length || 0) > 2 && (
                    <span className="text-[#000000] bg-[#F2F2FF] rounded px-1 py-0.5 text-xs">
                      + {profile.emails.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-800 text-sm flex items-center gap-1">
                  xxx@
                  <span className="bg-[#F2F2FF] text-[#F2F2FF] rounded px-6 py-0.5">
                    hidden
                  </span>
                  <span className="text-[#000000] bg-[#F2F2FF] rounded px-1 py-0.5 text-xs">
                    + 1 more
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* LinkedIn Icon */}
            <a
              href={profile.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 text-white rounded flex items-center justify-center transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={LinkedInIcon} alt="linkedin" className="w-5 h-5" />
            </a>
            {/* Enrich Button */}
            {!profile.isEnriched ? (
              <button
                onClick={handleEnrich}
                disabled={isEnriching}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[120px] ${
                  isEnriching
                    ? "bg-[#3C49F7] text-white cursor-wait"
                    : "bg-[#3C49F7] text-white hover:bg-blue-700"
                }`}
              >
                {isEnriching ? <LoadingDots /> : "Enrich Profile"}
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F2F2FF] rounded text-[#0028B6]">
                <img src={VerifiedIcon} alt="linkedin" className="w-7 h-7" />
                <span className="text-[12px] font-semibold">
                  Enriched Contact
                </span>
              </div>
            )}

            {/* {profile.isEnriched ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#F2F2FF] text-[#0028B6]">
                <img src={VerifiedIcon} alt="linkedin" className="w-7 h-7" />
                <span className="text-[12px] font-semibold">Enriched Contact</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnrich(profile.id);
                }}
                className="px-4 py-1.5 bg-[#3C49F7] text-white text-sm font-medium rounded-full"
              >
                Enrich Profile
              </button>
            )} */}

            {/* Add to Project OR 3-dot menu based on context */}
            {context === "campaign" ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[180px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onRemoveFromCampaign && onRemoveFromCampaign(profile);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove from campaign
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToProject(profile);
                }}
                className="px-4 py-1.5 border-2 border-[#3C49F7] text-[#3C49F7] text-[14px] font-medium rounded-full"
              >
                Add to Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-2 ml-4 space-y-2">
            {/* Current Position */}
            <div className="flex border-b border-gray-200 pb-3 pl-2 -mb-3">
              <span className="w-24 text-gray-900 text-sm font-bold">
                Current
              </span>
              <div className="flex-1 ml-0">
                <p className="text-gray-900 text-sm">
                  • {profile.currentPosition || profile.title} @{" "}
                  {profile.company}
                  {/* <span className="text-gray-900 ml-2 italic">
                    2022 - Current
                  </span> */}
                </p>
              </div>
            </div>

            {/* Past Positions */}
            <div className="flex border-b border-gray-200 p-3">
              <span className="w-24 text-gray-900 text-sm font-bold ml-4">
                Past
              </span>
              <div className="flex-1 -ml-5">
                {(profile.pastPositions || []).map((pos, idx) => (
                  <p key={idx} className="text-gray-800 text-sm">
                    • {pos.title} @ {pos.company}
                    <span className="text-gray-500 ml-2 italic">
                      {pos.years}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="flex border-b border-gray-200 pb-5">
              <span className="w-24 text-gray-900 text-sm font-bold -ml-1.5">
                Education
              </span>
              <div className="flex-1 ml-4 ">
                {(
                  profile.education || [
                    { school: "University of Oxford", years: "2010-2013" },
                    { school: "University of Cambridge", years: "2007-2010" },
                    { school: "Lauriston Boys' School", years: "2003-2007" },
                  ]
                ).map((edu, idx) => (
                  <p key={idx} className="text-gray-900 text-sm">
                    • {edu.school}
                    {edu.degree ? ` - ${edu.degree}` : ""}
                    {edu.major ? ` (${edu.major})` : ""}
                    <span className="text-gray-500 ml-2 italic">
                      {edu.years}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex ml-2">
              <span className="w-24 text-gray-900 text-sm font-bold">
                Contact<br></br> Info
              </span>
              <div className="flex-1 ml-1">
                {profile.isEnriched ? (
                  <>
                    {/* Website */}
                    <div className="flex items-center gap-2">
                      <img
                        src={companyicon}
                        alt="company"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-800 text-sm">
                        @ {profile.website || "N/A"}
                      </span>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-2">
                      <img
                        src={phonenumbericon}
                        alt="phone"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-800 text-sm">
                        {(profile.phones || []).length > 0
                          ? profile.phones.join(" , ")
                          : "No phone numbers available"}
                      </span>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <img src={emailicon} alt="email" className="w-4 h-4" />
                      <div className="flex items-center gap-2 flex-wrap">
                        {(profile.emails || []).length > 0 ? (
                          profile.emails.map((email, idx) => (
                            <a
                              key={idx}
                              href={`mailto:${email}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {email}
                              {idx < profile.emails.length - 1 ? " ," : ""}
                            </a>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No emails available
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Hidden Website */}
                    <div className="flex items-center gap-2">
                      <img
                        src={companyicon}
                        alt="company"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-800 text-sm">
                        @ xxxxxxx.com
                      </span>
                    </div>
                    {/* Hidden Phone */}
                    <div className="flex items-center gap-2">
                      <img
                        src={phonenumbericon}
                        alt="phone"
                        className="w-4 h-4"
                      />
                      <span className="text-gray-800 text-sm">
                        +44 - 123{" "}
                        <span className="text-gray-400 italic">XX XXX</span>
                        <span className="text-gray-500 ml-2 text-xs">
                          + x more
                        </span>
                      </span>
                    </div>
                    {/* Hidden Email */}
                    <div className="flex items-center gap-2">
                      <img src={emailicon} alt="email" className="w-4 h-4" />
                      <span className="text-gray-800 text-sm">
                        xxxxx
                        <span className="text-gray-800">@xxxxx.com</span>
                        <span className="text-gray-500 ml-2 text-xs">
                          + x personal emails
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* View Less & Credit Info */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Less
              </button>
              <span
                className={`py-0.5 px-2 text-sm italic bg-[#E8EAFF] font-medium ${profile.isEnriched ? "text-[#000000]" : "text-[#000000]"}`}
              >
                {profile.isEnriched ? "1 Credit Used" : "1 Credit"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Details Component (Expanded View)
export const ProfileDetails = ({ profile, onCollapse }) => {
  return (
    <div className="space-y-4">
      {/* Current Position */}
      <div className="flex gap-4">
        <span className="text-sm text-gray-500 w-20 flex-shrink-0">
          Current
        </span>
        <p className="text-sm text-gray-800">• {profile.current}</p>
      </div>

      {/* Past Positions */}
      <div className="flex gap-4">
        <span className="text-sm text-gray-500 w-20 flex-shrink-0">Past</span>
        <div className="space-y-1">
          {profile.past.map((position, idx) => (
            <p key={idx} className="text-sm text-gray-800">
              • {position}
            </p>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="flex gap-4">
        <span className="text-sm text-gray-500 w-20 flex-shrink-0">
          Education
        </span>
        <div className="space-y-1">
          {profile.education.map((edu, idx) => (
            <p key={idx} className="text-sm text-gray-800">
              • {edu}
            </p>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex gap-4">
        <span className="text-sm text-gray-500 w-20 flex-shrink-0">
          Contact Info
        </span>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 6L2 7" />
            </svg>
            <span className="text-sm text-gray-800">
              @ {profile.contact.website}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="text-sm text-gray-800">
              {profile.contact.phones.join(" , ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 6L2 7" />
            </svg>
            <span className="text-sm text-blue-600">
              {profile.contact.emails.map((email, idx) => (
                <span key={idx}>
                  <a href={`mailto:${email}`} className="hover:underline">
                    {email}
                  </a>
                  {idx < profile.contact.emails.length - 1 && " , "}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Credit Used */}
      <div className="flex justify-end">
        <span className="text-sm text-blue-600 font-medium">1 Credit Used</span>
      </div>
    </div>
  );
};

// Profile List Header
export const ProfileListHeader = ({
  totalResults,
  currentPage,
  itemsPerPage,
  selectedCount,
  isAllSelected,
  onSelectAll,
  excludeInProject,
  onExcludeChange,
  onEnrichAll,
  onAddAllToProject,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <span className="text-[14px] text-[#000000]">
          {startIndex} - {endIndex} of about {totalResults.toLocaleString()}{" "}
          results.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={excludeInProject}
          onChange={(e) => onExcludeChange(e.target.checked)}
          label="Exclude profiles already in project."
        />
      </div>
    </div>
  );
};

// Select All Row
export const SelectAllRow = ({
  isAllSelected,
  selectedCount,
  onSelectAll,
  onEnrichAll,
  onAddAllToProject,
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-0 rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <Checkbox checked={isAllSelected} onChange={onSelectAll} />
        <span className="text-sm text-gray-700">
          Select All
          {selectedCount > 0 && (
            <span className="text-gray-500 ml-2">
              {selectedCount} Selected from this list
            </span>
          )}
        </span>
        <button className="text-[#3C49F7] px-4 py-1.5 rounded-full text-sm font-medium hover:border-2 hover:border-[#3C49F7] transition-colors">
          Export Leads
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3">
          {!profile.isEnriched ? (
            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all min-w-[120px] ${
                isEnriching
                  ? "bg-[#3C49F7] text-white cursor-wait"
                  : "bg-[#3C49F7] text-white hover:bg-blue-700"
              }`}
            >
              {isEnriching ? <LoadingDots /> : "Enrich Profile"}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#F2F2FF] rounded text-[#0028B6]">
              <img src={VerifiedIcon} alt="linkedin" className="w-7 h-7" />
              <span className="text-[12px] font-semibold">
                Enriched Contact
              </span>
            </div>
          )}
          <button
            onClick={onAddAllToProject}
            className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium hover:border-[#3C49F7] hover:text-[#3C49F7] transition-colors"
          >
            Add to Project
          </button>
          <button className="text-[#3C49F7] px-4 py-1.5 rounded-full text-sm font-medium hover:border-2 hover:border-[#3C49F7] transition-colors">
            Export Leads
          </button>
        </div>
      )}
    </div>
  );
};
