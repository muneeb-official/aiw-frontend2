// components/sales/SearchFiltersPanel.jsx
import { useState, useRef } from "react";
import { FilterTag } from "../common/CommonComponents";
import {
  FilterSection,
  TextFilter,
  TextWithCheckboxFilter,
  SelectWithCheckboxFilter,
  SearchableSelectFilter,
  DateRangeSplitFilter,
  LocationFilter,
  CheckboxItem,
  ExpandableCheckboxItem,
  SelectedFilterItem,
  ChevronRight,
  CheckIcon,
  ChevronDown,
} from "./FilterComponents";
import FilterIcon from "../../assets/icons/FilterIcon.svg";

// Education Filter
export const EducationFilter = ({
  filterKey,
  sections,
  hasModifier,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onUpdateModifier,
}) => {
  const [values, setValues] = useState({});

  const handleTextKeyDown = (e, sectionKey) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const type = `${filterKey}_${sectionKey}`;
      const exists = activeFilters.some(
        (f) =>
          f.type === type &&
          f.value.toLowerCase() === e.target.value.trim().toLowerCase(),
      );
      if (!exists) {
        onAddFilter({ type, value: e.target.value.trim(), icon: filterKey });
      }
      setValues((p) => ({ ...p, [sectionKey]: "" }));
    }
  };

  const handleCheckboxSelect = (sectionKey, option) => {
    const type = `${filterKey}_${sectionKey}`;
    const exists = activeFilters.some(
      (f) => f.type === type && f.value === option.label,
    );
    if (exists) {
      const filter = activeFilters.find(
        (f) => f.type === type && f.value === option.label,
      );
      onRemoveFilter(filter.id);
    } else {
      onAddFilter({ type, value: option.label, icon: filterKey });
    }
  };

  const handleModifierClick = (sectionKey, option, modifier) => {
    const type = `${filterKey}_${sectionKey}`;
    const isSelected = activeFilters.some(
      (f) => f.type === type && f.value === option.label,
    );
    if (!isSelected) {
      onAddFilter({ type, value: option.label, icon: filterKey });
    }
    setTimeout(() => {
      const filter = activeFilters.find(
        (f) => f.type === type && f.value === option.label,
      );
      if (filter) onUpdateModifier(filter.id, modifier);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([key, section]) => (
        <div key={key}>
          <label className="text-sm font-semibold text-gray-800 block mb-2">
            {section.label}
          </label>

          {(section.type === "text" ||
            section.type === "text-with-checkboxes") && (
            <input
              type="text"
              placeholder={section.placeholder}
              value={values[key] || ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, [key]: e.target.value }))
              }
              onKeyDown={(e) => handleTextKeyDown(e, key)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 mb-2"
            />
          )}

          {section.options && (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {section.options.map((opt) => {
                const isSelected = activeFilters.some(
                  (f) =>
                    f.type === `${filterKey}_${key}` && f.value === opt.label,
                );
                const currentFilter = activeFilters.find(
                  (f) =>
                    f.type === `${filterKey}_${key}` && f.value === opt.label,
                );

                return (
                  <CheckboxItem
                    key={opt.id}
                    label={opt.label}
                    isSelected={isSelected}
                    hasModifier={section.hasModifier}
                    currentFilter={currentFilter}
                    onSelect={() => handleCheckboxSelect(key, opt)}
                    onModifierClick={(mod) =>
                      handleModifierClick(key, opt, mod)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Role & Department Filter
export const RoleDepartmentFilter = ({
  filterKey,
  sections,
  hasModifier,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onUpdateModifier,
}) => {
  const [values, setValues] = useState({});
  const [expandedDepts, setExpandedDepts] = useState({});

  const handleTextKeyDown = (e, sectionKey) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const type = `${filterKey}_${sectionKey}`;
      const exists = activeFilters.some(
        (f) =>
          f.type === type &&
          f.value.toLowerCase() === e.target.value.trim().toLowerCase(),
      );
      if (!exists) {
        onAddFilter({ type, value: e.target.value.trim(), icon: filterKey });
      }
      setValues((p) => ({ ...p, [sectionKey]: "" }));
    }
  };

  const handleCheckboxSelect = (sectionKey, option) => {
    const type = `${filterKey}_${sectionKey}`;
    const exists = activeFilters.some(
      (f) => f.type === type && f.value === option.label,
    );
    if (exists) {
      const filter = activeFilters.find(
        (f) => f.type === type && f.value === option.label,
      );
      onRemoveFilter(filter.id);
    } else {
      onAddFilter({ type, value: option.label, icon: filterKey });
    }
  };

  const handleSelectChange = (sectionKey, value, options) => {
    const type = `${filterKey}_${sectionKey}`;
    const selectedOpt = options.find((o) => (o.value || o.label) === value);
    if (selectedOpt && selectedOpt.value !== "") {
      const exists = activeFilters.some(
        (f) => f.type === type && f.value === selectedOpt.label,
      );
      if (!exists) {
        onAddFilter({ type, value: selectedOpt.label, icon: filterKey });
      }
    }
  };

  const handleModifierClick = (sectionKey, option, modifier) => {
    const type = `${filterKey}_${sectionKey}`;
    const isSelected = activeFilters.some(
      (f) => f.type === type && f.value === option.label,
    );
    if (!isSelected) {
      onAddFilter({ type, value: option.label, icon: filterKey });
    }
    setTimeout(() => {
      const filter = activeFilters.find(
        (f) => f.type === type && f.value === option.label,
      );
      if (filter) onUpdateModifier(filter.id, modifier);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([key, section]) => {
        const sectionFilters = activeFilters.filter(
          (f) => f.type === `${filterKey}_${key}`,
        );

        return (
          <div key={key}>
            <label className="text-sm font-semibold text-gray-800 block mb-2">
              {section.label}
            </label>

            {(section.type === "text" ||
              section.type === "text-with-checkbox") && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={section.placeholder}
                  value={values[key] || ""}
                  onChange={(e) =>
                    setValues((p) => ({ ...p, [key]: e.target.value }))
                  }
                  onKeyDown={(e) => handleTextKeyDown(e, key)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                {sectionFilters.length > 0 && (
                  <div className="space-y-1">
                    {sectionFilters.map((filter) => (
                      <SelectedFilterItem
                        key={filter.id}
                        filter={filter}
                        hasModifier={section.hasModifier}
                        onRemove={() => onRemoveFilter(filter.id)}
                        onUpdateModifier={onUpdateModifier}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {section.type === "text-with-expandable" && (
              <>
                <input
                  type="text"
                  placeholder={section.placeholder}
                  value={values[key] || ""}
                  onChange={(e) =>
                    setValues((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 mb-2"
                />
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {section.options?.map((opt) => {
                    const isSelected = activeFilters.some(
                      (f) =>
                        f.type === `${filterKey}_${key}` &&
                        f.value === opt.label,
                    );
                    const currentFilter = activeFilters.find(
                      (f) =>
                        f.type === `${filterKey}_${key}` &&
                        f.value === opt.label,
                    );

                    return (
                      <ExpandableCheckboxItem
                        key={opt.id}
                        option={opt}
                        isSelected={isSelected}
                        isExpanded={expandedDepts[opt.id]}
                        hasModifier={section.hasModifier}
                        currentFilter={currentFilter}
                        onToggleExpand={() =>
                          setExpandedDepts((p) => ({
                            ...p,
                            [opt.id]: !p[opt.id],
                          }))
                        }
                        onSelect={() => handleCheckboxSelect(key, opt)}
                        onModifierClick={(mod) =>
                          handleModifierClick(key, opt, mod)
                        }
                      />
                    );
                  })}
                </div>
              </>
            )}

            {section.type === "checkbox-list" && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {section.options?.map((opt) => {
                  const isSelected = activeFilters.some(
                    (f) =>
                      f.type === `${filterKey}_${key}` && f.value === opt.label,
                  );
                  const currentFilter = activeFilters.find(
                    (f) =>
                      f.type === `${filterKey}_${key}` && f.value === opt.label,
                  );

                  return (
                    <CheckboxItem
                      key={opt.id}
                      label={opt.label}
                      isSelected={isSelected}
                      hasModifier={section.hasModifier}
                      currentFilter={currentFilter}
                      onSelect={() => handleCheckboxSelect(key, opt)}
                      onModifierClick={(mod) =>
                        handleModifierClick(key, opt, mod)
                      }
                    />
                  );
                })}
              </div>
            )}

            {section.type === "select" && (
              <div className="relative">
                <select
                  value=""
                  onChange={(e) =>
                    handleSelectChange(key, e.target.value, section.options)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
                >
                  {section.options?.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.value !== undefined ? opt.value : opt.label}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Main Component
export default function SearchFiltersPanel({
  mode = "b2c",
  config,
  searchType,
  activeFilters = [],
  onAddFilter,
  onRemoveFilter,
  excludeInProject: excludeInProjectProp,
  setExcludeInProject: setExcludeInProjectProp,
  onClearFilters,
  onSaveSearch,
  onLoadSearch,
  context,
}) {
  // Use internal state if no prop is provided
  const [internalExcludeInProject, setInternalExcludeInProject] =
    useState(false);

  // Use prop if provided, otherwise use internal state
  const excludeInProject =
    excludeInProjectProp !== undefined
      ? excludeInProjectProp
      : internalExcludeInProject;
  const setExcludeInProject =
    setExcludeInProjectProp || setInternalExcludeInProject;

  const hasSearched = context?.hasSearched || false;
  const updateFilterModifier = context?.updateFilterModifier || (() => {});

  const currentFilters = config.filters[searchType] || [];

  const getFilterCount = (type) => {
    return activeFilters.filter(
      (f) =>
        f.type === type ||
        f.type.startsWith(`${type}From`) ||
        f.type.startsWith(`${type}To`) ||
        f.type.startsWith(`${type}_`),
    ).length;
  };

  const handleExcludeToggle = () => {
    setExcludeInProject(!excludeInProject);
  };

  return (
    <div className="w-96 bg-white flex flex-col gap-1 rounded-b-2xl">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Search Filters</h3>
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Filter
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <FilterTag
                key={filter.id}
                filter={filter}
                onRemove={onRemoveFilter}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100">
        <div
          onClick={handleExcludeToggle}
          className={`w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors
      ${
        excludeInProject
          ? "bg-blue-600 border-blue-600"
          : "border-gray-300 bg-white hover:border-blue-600"
      }`}
        >
          {excludeInProject && (
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
        <span
          onClick={handleExcludeToggle}
          className="text-[14px] text-gray-600 cursor-pointer select-none"
        >
          Exclude profiles already in project.
        </span>
      </div>
      {/* Scrollable Filters */}
      <div className="flex-1 flex-col overflow-auto px-4 space-y-1">
        {currentFilters.map((filterConfig) => (
          <FilterSection
            key={filterConfig.key}
            title={filterConfig.title}
            count={getFilterCount(filterConfig.key)}
          >
            {filterConfig.type === "text" && (
              <TextFilter
                filterKey={filterConfig.key}
                placeholder={filterConfig.placeholder}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "text-with-checkbox" && (
              <TextWithCheckboxFilter
                filterKey={filterConfig.key}
                placeholder={filterConfig.placeholder}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "select-with-checkbox" && (
              <SelectWithCheckboxFilter
                filterKey={filterConfig.key}
                placeholder={filterConfig.placeholder}
                inputPlaceholder={filterConfig.inputPlaceholder}
                options={filterConfig.options}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "searchable-select" && (
              <SearchableSelectFilter
                filterKey={filterConfig.key}
                placeholder={filterConfig.placeholder}
                options={filterConfig.options}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "location" && (
              <LocationFilter
                filterKey={filterConfig.key}
                placeholder={filterConfig.placeholder}
                options={filterConfig.options}
                hasRadius={filterConfig.hasRadius}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "date-range-split" && (
              <DateRangeSplitFilter
                filterKey={filterConfig.key}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
              />
            )}

            {filterConfig.type === "education" && (
              <EducationFilter
                filterKey={filterConfig.key}
                sections={filterConfig.sections}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}

            {filterConfig.type === "role-department" && (
              <RoleDepartmentFilter
                filterKey={filterConfig.key}
                sections={filterConfig.sections}
                hasModifier={filterConfig.hasModifier}
                activeFilters={activeFilters}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onUpdateModifier={updateFilterModifier}
              />
            )}
          </FilterSection>
        ))}
      </div>

      {/* Fixed Buttons */}
      <div className="sticky bottom-0 bg-white p-4 space-y-3">
        <button
          onClick={onSaveSearch}
          disabled={activeFilters.length === 0}
          className={`w-full py-2 rounded-full font-medium ${
            activeFilters.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save This Search
        </button>
        <button
          onClick={onLoadSearch}
          className="w-full bg-white text-blue-700 py-1.5 rounded-full font-medium border-2 border-blue-700 hover:border-blue-800"
        >
          Load Past Search
        </button>
      </div>
    </div>
  );
}
