import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react';

const B2BAdvancedSearchCard = ({ company, onEnrich, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLogoUrl = (website) => {
    if (!website) return null;
    const domain = website.replace(/^https?:\/\//, '').split('/')[0];
    return `https://logo.clearbit.com/${domain}`;
  };

  const handleEnrichDirector = (director, index) => {
    if (onEnrich) {
      onEnrich(company, director, index);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
      {/* Clickable Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(company.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />

          {/* Company Logo */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={getLogoUrl(company.website)}
              alt={company.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                    ${company.name.charAt(0).toUpperCase()}
                  </div>
                `;
              }}
            />
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{company.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">Company:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status}
                  </span>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      🌐
                    </a>
                  )}
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      in
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Active Since</p>
                  <p className="text-sm font-medium text-gray-900">{company.activeSince}</p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle Add to Project
                  }}
                >
                  Add to Project
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          {/* SIC Codes */}
          {company.sicCodes && company.sicCodes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">SIC Codes</h4>
              <ul className="list-disc list-inside space-y-1">
                {company.sicCodes.map((code, index) => (
                  <li key={index} className="text-sm text-gray-600">{code}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Active Directors */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Director & Contact Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.directors?.map((director, index) => (
                <DirectorCard
                  key={index}
                  director={director}
                  onEnrich={() => handleEnrichDirector(director, index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DirectorCard = ({ director, onEnrich }) => {
  const isEnriched = director.enriched;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-900">{director.name}</p>
          </div>
        </div>
        {isEnriched && (
          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">{director.email}</p>
        </div>

        {isEnriched ? (
          <>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                {director.phones?.map((phone, idx) => (
                  <div key={idx}>{phone}</div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                {director.alternateEmails?.map((email, idx) => (
                  <div key={idx} className="text-blue-600">{email}</div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Enriched Contact</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-400">+44 - 13 xx xxx</p>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-400">xxxxx@amazon.com</p>
            </div>
            <button
              onClick={onEnrich}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enrich profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default B2BAdvancedSearchCard;