// components/sales/FilterComponents.jsx
import { useState, useRef, useEffect } from "react";
import FilterIcon from "../../assets/icons/FilterIcon.svg";

// Reusable checkbox style class
export const checkboxClassName = `
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
  flex-shrink-0
`;

// Icons
export const ChevronLeft = ({ className = "" }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

export const ChevronDown = ({ className = "" }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export const ChevronRight = ({ className = "" }) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export const CheckIcon = () => (
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

// Modifier Dropdown Component
export const ModifierDropdown = ({ isOpen, onClose, onSelect, currentModifier, buttonRef }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                buttonRef?.current && !buttonRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                Apply Modifier
            </div>
            {["exact", "not"].map((mod) => (
                <button
                    key={mod}
                    onClick={() => { onSelect(mod); onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${currentModifier === mod ? "text-blue-600 font-medium" : "text-gray-700"}`}
                >
                    <span className="capitalize">{mod}</span>
                    {currentModifier === mod && <CheckIcon />}
                </button>
            ))}
        </div>
    );
};

// Modifier Button - Auto selects filter when clicked
export const ModifierButton = ({ filterId, filterKey, value, icon, isSelected, activeFilters, onAddFilter, onUpdateModifier }) => {
    const [showModifier, setShowModifier] = useState(false);
    const btnRef = useRef(null);

    const currentFilter = activeFilters?.find(f => f.id === filterId || (f.type === filterKey && f.value === value));

    const handleModifierSelect = (modifier) => {
        if (!isSelected) {
            // Auto-select the filter first
            onAddFilter({ type: filterKey, value, icon: icon || filterKey });
            // Then apply modifier after a brief delay
            setTimeout(() => {
                const newFilter = activeFilters.find(f => f.type === filterKey && f.value === value);
                if (newFilter) onUpdateModifier(newFilter.id, modifier);
            }, 50);
        } else if (currentFilter) {
            onUpdateModifier(currentFilter.id, modifier);
        }
        setShowModifier(false);
    };

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={() => setShowModifier(!showModifier)}
                className="p-1 hover:bg-gray-200 rounded opacity-100 group-hover:opacity-100 transition-opacity"
            >
                <img src={FilterIcon} alt="filter" className="w-6 h-6" />
            </button>
            <ModifierDropdown
                isOpen={showModifier}
                onClose={() => setShowModifier(false)}
                onSelect={handleModifierSelect}
                currentModifier={currentFilter?.modifier}
                buttonRef={btnRef}
            />
        </div>
    );
};

// Filter Section Component
export const FilterSection = ({ title, count, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const hasAutoOpened = useRef(false);

    useEffect(() => {
        if (count > 0 && !hasAutoOpened.current) {
            setIsOpen(true);
            hasAutoOpened.current = true;
        }
        if (count === 0) hasAutoOpened.current = false;
    }, [count]);

    return (
        <div className="bg-[#F4F5FB] text-[15px] border-2 rounded-md border-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 px-3 text-left hover:bg-gray-50 transition-all duration-200"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[#000000]">{title}</span>
                    {count > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{count}</span>
                    )}
                </div>
                <span className={`transition-transform duration-200 text-[#3C49F7] ${isOpen ? "-rotate-90" : ""}`}>
                    <ChevronLeft />
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-1 pb-4 pt-2">{children}</div>
            </div>
        </div>
    );
};

// Text Filter
export const TextFilter = ({ filterKey, placeholder, hasModifier, activeFilters, onAddFilter, onRemoveFilter, onUpdateModifier }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const exists = activeFilters.some(f => f.type === filterKey && f.value.toLowerCase() === inputValue.trim().toLowerCase());
            if (!exists) {
                onAddFilter({ type: filterKey, value: inputValue.trim(), icon: filterKey });
            }
            setInputValue("");
        }
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
    );
};

// Text with Checkbox Filter
export const TextWithCheckboxFilter = ({ filterKey, placeholder, hasModifier, activeFilters, onAddFilter, onRemoveFilter, onUpdateModifier }) => {
    const [inputValue, setInputValue] = useState("");
    const selectedFilters = activeFilters.filter(f => f.type === filterKey);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const exists = activeFilters.some(f => f.type === filterKey && f.value.toLowerCase() === inputValue.trim().toLowerCase());
            if (!exists) {
                onAddFilter({ type: filterKey, value: inputValue.trim(), icon: filterKey });
            }
            setInputValue("");
        }
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            {selectedFilters.length > 0 && (
                <div className="space-y-1">
                    {selectedFilters.map((filter) => (
                        <SelectedFilterItem
                            key={filter.id}
                            filter={filter}
                            hasModifier={hasModifier}
                            onRemove={() => onRemoveFilter(filter.id)}
                            onUpdateModifier={onUpdateModifier}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Selected Filter Item (checkbox style)
export const SelectedFilterItem = ({ filter, hasModifier, onRemove, onUpdateModifier }) => {
    const [showModifier, setShowModifier] = useState(false);
    const btnRef = useRef(null);

    return (
        <div className="flex items-center gap-0 px-2 hover:bg-gray-50 rounded-lg group flex-nowrap whitespace-nowrap [&>*]:shrink-0">
            <button onClick={onRemove} className="flex items-center gap-2 appearance-none
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
  flex-shrink-0">
                {/* <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                    <CheckIcon />
                </div> */}
                <span className="text-[14px] text-[#0C1112]">{filter.value}</span>
            </button>
            {hasModifier && (
                <div className="relative">
                    <button ref={btnRef} onClick={() => setShowModifier(!showModifier)} className="p-1 hover:bg-gray-200 rounded">
                        <img src={FilterIcon} alt="filter" className="w-4 h-4" />
                    </button>
                    <ModifierDropdown
                        isOpen={showModifier}
                        onClose={() => setShowModifier(false)}
                        onSelect={(mod) => { onUpdateModifier(filter.id, mod); setShowModifier(false); }}
                        currentModifier={filter.modifier}
                        buttonRef={btnRef}
                    />
                </div>
            )}
        </div>
    );
};

// Select with Checkbox Filter
export const SelectWithCheckboxFilter = ({ filterKey, placeholder, inputPlaceholder, options, hasModifier, activeFilters, onAddFilter, onRemoveFilter, onUpdateModifier }) => {
    const [inputValue, setInputValue] = useState("");
    const selectedFilters = activeFilters.filter(f => f.type === filterKey);

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const exists = activeFilters.some(f => f.type === filterKey && f.value.toLowerCase() === inputValue.trim().toLowerCase());
            if (!exists) {
                onAddFilter({ type: filterKey, value: inputValue.trim(), icon: filterKey });
            }
            setInputValue("");
        }
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                placeholder={inputPlaceholder || "Value"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            {selectedFilters.length > 0 && (
                <div className="space-y-1">
                    {selectedFilters.map((filter) => (
                        <SelectedFilterItem
                            key={filter.id}
                            filter={filter}
                            hasModifier={hasModifier}
                            onRemove={() => onRemoveFilter(filter.id)}
                            onUpdateModifier={onUpdateModifier}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Searchable Select Filter (for B2B)
export const SearchableSelectFilter = ({ filterKey, placeholder, options, hasModifier, activeFilters, onAddFilter, onRemoveFilter, onUpdateModifier }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        const exists = activeFilters.some(f => f.type === filterKey && f.value === option.label);
        if (exists) {
            const filter = activeFilters.find(f => f.type === filterKey && f.value === option.label);
            onRemoveFilter(filter.id);
        } else {
            onAddFilter({ type: filterKey, value: option.label, icon: filterKey });
        }
    };

    const handleModifierClick = (option, modifier) => {
        const isSelected = activeFilters.some(f => f.type === filterKey && f.value === option.label);
        if (!isSelected) {
            onAddFilter({ type: filterKey, value: option.label, icon: filterKey });
        }
        setTimeout(() => {
            const filter = activeFilters.find(f => f.type === filterKey && f.value === option.label);
            if (filter) onUpdateModifier(filter.id, modifier);
        }, 50);
    };

    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 mb-2"
            />
            <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredOptions.map((option) => {
                    const isSelected = activeFilters.some(f => f.type === filterKey && f.value === option.label);
                    const currentFilter = activeFilters.find(f => f.type === filterKey && f.value === option.label);

                    return (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            isSelected={isSelected}
                            hasModifier={hasModifier}
                            currentFilter={currentFilter}
                            onSelect={() => handleSelect(option)}
                            onModifierClick={(mod) => handleModifierClick(option, mod)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Expandable Checkbox Item (for Department with children)
export const ExpandableCheckboxItem = ({ option, isSelected, isExpanded, hasModifier, currentFilter, onToggleExpand, onSelect, onModifierClick }) => {
    const [showModifier, setShowModifier] = useState(false);
    const btnRef = useRef(null);

    return (
        <div className="flex items-center gap-0 px-2 hover:bg-gray-50 rounded-lg group flex-nowrap whitespace-nowrap [&>*]:shrink-0">
            {/* Left side: Chevron + Checkbox + Label */}
            <div className="flex items-center gap-0 flex-1">
                {/* Chevron for expandable items */}
                {option.hasChildren ? (
                    <button onClick={onToggleExpand} className="p-0.5">
                        <ChevronRight className={`text-blue-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                ) : (
                    <div className="w-5" />
                )}

                {/* Checkbox + Label */}
                <button onClick={onSelect} className="flex items-center gap-6 appearance-none
  w-[18px] h-[18px]
  rounded-[6px]
  border border-gray-300
  bg-white
  hover:border-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500/30
  cursor-pointer
 
  flex-shrink-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center  ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                        {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <span className={`text-[14px] ${isSelected ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                        {option.label} {option.count && <span className="text-gray-400">({option.count})</span>}
                    </span>
                </button>
            </div>

            {/* Right side: Filter icon at the END */}
            {hasModifier && (
                <div className="relative">
                    <button
                        ref={btnRef}
                        onClick={() => setShowModifier(!showModifier)}
                        className="p-1 hover:bg-gray-200 rounded opacity-100 group-hover:opacity-100 transition-opacity"
                    >
                        <img src={FilterIcon} alt="filter" className="w-6 h-6" />
                    </button>
                    <ModifierDropdown
                        isOpen={showModifier}
                        onClose={() => setShowModifier(false)}
                        onSelect={(mod) => { onModifierClick(mod); setShowModifier(false); }}
                        currentModifier={currentFilter?.modifier}
                        buttonRef={btnRef}
                    />
                </div>
            )}
        </div>
    );
};

// Checkbox Item Component
export const CheckboxItem = ({ label, count, isSelected, hasModifier, currentFilter, onSelect, onModifierClick }) => {
    const [showModifier, setShowModifier] = useState(false);
    const btnRef = useRef(null);

    return (
        <div className="flex items-center justify-between px-2 hover:bg-gray-50 rounded-lg group flex-nowrap whitespace-nowrap">
    <button onClick={onSelect} className="flex items-center gap-2">
        <div className={`w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white hover:border-blue-600"}`}>
            {isSelected && <CheckIcon />}
        </div>
        <span className={`text-[14px] ${isSelected ? "text-gray-900 font-medium" : "text-gray-700"}`}>
            {label} {count && <span className="text-gray-400">({count})</span>}
        </span>
    </button>
    {hasModifier && (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={() => setShowModifier(!showModifier)}
                className="p-1 hover:bg-gray-200 rounded opacity-100 group-hover:opacity-100 transition-opacity"
            >
                <img src={FilterIcon} alt="filter" className="w-6 h-6" />
            </button>
            <ModifierDropdown
                isOpen={showModifier}
                onClose={() => setShowModifier(false)}
                onSelect={(mod) => { onModifierClick(mod); setShowModifier(false); }}
                currentModifier={currentFilter?.modifier}
                buttonRef={btnRef}
            />
        </div>
    )}
</div>
    );
};

// Date Range Split Filter
export const DateRangeSplitFilter = ({ filterKey, activeFilters, onAddFilter, onRemoveFilter }) => {
    const [fromDate, setFromDate] = useState({ day: "", month: "", year: "" });
    const [toDate, setToDate] = useState({ day: "", month: "", year: "" });

    useEffect(() => {
        const fromFilter = activeFilters.find(f => f.type === `${filterKey}From`);
        const toFilter = activeFilters.find(f => f.type === `${filterKey}To`);

        if (fromFilter?.value) {
            const [y, m, d] = fromFilter.value.split("-");
            setFromDate({ day: d || "", month: m || "", year: y || "" });
        }
        if (toFilter?.value) {
            const [y, m, d] = toFilter.value.split("-");
            setToDate({ day: d || "", month: m || "", year: y || "" });
        }
    }, [activeFilters, filterKey]);

    const updateFilter = (type, dateObj) => {
        const { day, month, year } = dateObj;
        const filterType = `${filterKey}${type}`;
        const oldFilter = activeFilters.find(f => f.type === filterType);

        if (oldFilter) onRemoveFilter(oldFilter.id);

        if (day && month && year) {
            const value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const displayValue = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            onAddFilter({ type: filterType, value, displayValue, icon: "calendar" });
        }
    };

    const handleFromChange = (field, val) => {
        const newFrom = { ...fromDate, [field]: val };
        setFromDate(newFrom);
        if (newFrom.day && newFrom.month && newFrom.year) updateFilter("From", newFrom);
    };

    const handleToChange = (field, val) => {
        const newTo = { ...toDate, [field]: val };
        setToDate(newTo);
        if (newTo.day && newTo.month && newTo.year) updateFilter("To", newTo);
    };

    const DateInputGroup = ({ label, example, date, onChange }) => (
        <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">{label}</label>
            <p className="text-xs text-gray-500 italic mb-2">for example: {example}</p>
            <div className="flex gap-2">
                {[
                    { key: "day", label: "Date", placeholder: "DD", max: 2 },
                    { key: "month", label: "Month", placeholder: "MM", max: 2 },
                    { key: "year", label: "Year", placeholder: "YYYY", max: 4 },
                ].map(({ key, label, placeholder, max }) => (
                    <div key={key} className="flex-1">
                        <label className="text-xs text-gray-600 block mb-1">{label}</label>
                        <input
                            type="text"
                            placeholder={placeholder}
                            maxLength={max}
                            value={date[key]}
                            onChange={(e) => onChange(key, e.target.value.replace(/\D/g, ""))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <DateInputGroup label="From" example="21/ 01 / 2001" date={fromDate} onChange={handleFromChange} />
            <hr className="border-gray-200" />
            <DateInputGroup label="To" example="21/ 01 / 2001" date={toDate} onChange={handleToChange} />
        </div>
    );
};

// Location Filter - FIXED VERSION with working radius slider
// Replace your existing LocationFilter in FilterComponents.jsx with this

export const LocationFilter = ({ filterKey, placeholder, options, hasRadius, hasModifier, activeFilters, onAddFilter, onRemoveFilter, onUpdateModifier }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState({});
    const [radius, setRadius] = useState(0); // Add state for radius

    const handleParentSelect = (loc) => {
        const isSelected = activeFilters.some(f => f.type === filterKey && f.value === loc.name);
        if (isSelected) {
            const filter = activeFilters.find(f => f.type === filterKey && f.value === loc.name);
            onRemoveFilter(filter.id);
            loc.children?.forEach(child => {
                const childFilter = activeFilters.find(f => f.type === filterKey && f.value === child);
                if (childFilter) onRemoveFilter(childFilter.id);
            });
        } else {
            onAddFilter({ type: filterKey, value: loc.name, icon: "location" });
        }
    };

    const handleChildSelect = (child) => {
        const isSelected = activeFilters.some(f => f.type === filterKey && f.value === child);
        if (isSelected) {
            const filter = activeFilters.find(f => f.type === filterKey && f.value === child);
            onRemoveFilter(filter.id);
        } else {
            onAddFilter({ type: filterKey, value: child, icon: "location" });
        }
    };

    const handleModifierClick = (value, modifier) => {
        const isSelected = activeFilters.some(f => f.type === filterKey && f.value === value);
        if (!isSelected) {
            onAddFilter({ type: filterKey, value, icon: "location" });
        }
        setTimeout(() => {
            const filter = activeFilters.find(f => f.type === filterKey && f.value === value);
            if (filter) onUpdateModifier(filter.id, modifier);
        }, 50);
    };

    // Handle radius change
    const handleRadiusChange = (e) => {
        const newRadius = parseInt(e.target.value);
        setRadius(newRadius);
        
        // Update or add radius filter
        const radiusFilterType = `${filterKey}_radius`;
        const existingRadiusFilter = activeFilters.find(f => f.type === radiusFilterType);
        
        if (existingRadiusFilter) {
            onRemoveFilter(existingRadiusFilter.id);
        }
        
        if (newRadius > 0) {
            onAddFilter({ 
                type: radiusFilterType, 
                value: `${newRadius} mi`, 
                icon: "location",
                radius: newRadius 
            });
        }
    };

    const steps = [0, 25, 50, 75, 100];

    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 mb-2"
            />
            <div className="space-y-1 max-h-48 overflow-y-auto">
                {options.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase())).map((loc) => {
                    const isSelected = activeFilters.some(f => f.type === filterKey && f.value === loc.name);
                    const currentFilter = activeFilters.find(f => f.type === filterKey && f.value === loc.name);

                    return (
                        <div key={loc.name}>
                            <div className="flex items-center justify-between px-2 hover:bg-gray-50 rounded-lg group flex-nowrap whitespace-nowrap">
                                <div className="flex items-center gap-2 flex-1">
                                    {loc.children && (
                                        <button onClick={() => setExpandedItems(p => ({ ...p, [loc.name]: !p[loc.name] }))} className="p-0.5">
                                            <ChevronRight className={`text-blue-600 transition-transform ${expandedItems[loc.name] ? "rotate-90" : ""}`} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleParentSelect(loc)} 
                                        className="flex items-center gap-2"
                                    >
                                        <div className={`w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white hover:border-blue-600"}`}>
                                            {isSelected && <CheckIcon />}
                                        </div>
                                        <span className="text-[14px] text-[#0C1112]">
                                            {loc.name} {loc.count && <span className="text-gray-400">({loc.count})</span>}
                                        </span>
                                    </button>
                                </div>
                                {hasModifier && (
                                    <ModifierButtonInline
                                        currentFilter={currentFilter}
                                        onModifierClick={(mod) => handleModifierClick(loc.name, mod)}
                                    />
                                )}
                            </div>
                            {expandedItems[loc.name] && loc.children && (
                                <div className="ml-4 space-y-1">
                                    {loc.children.map((child) => {
                                        const isChildSelected = activeFilters.some(f => f.type === filterKey && f.value === child);
                                        const childFilter = activeFilters.find(f => f.type === filterKey && f.value === child);
                                        return (
                                            <div key={child} className="flex items-center gap-0 px-2 hover:bg-gray-50 rounded-lg group flex-nowrap whitespace-nowrap [&>*]:shrink-0">
                                                <button onClick={() => handleChildSelect(child)} className="flex items-center gap-2 appearance-none w-[18px] h-[18px] rounded-[6px] border border-gray-300 bg-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer flex-shrink-0">
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center ${isChildSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                                                        {isChildSelected && <CheckIcon />}
                                                    </div>
                                                    <span className="text-[14px] text-[#0C1112]">{child}</span>
                                                </button>
                                                {hasModifier && (
                                                    <ModifierButtonInline
                                                        currentFilter={childFilter}
                                                        onModifierClick={(mod) => handleModifierClick(child, mod)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* FIXED: Interactive Radius Slider */}
            {hasRadius && (
                <div className="py-2 max-w-lg">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[15px] font-semibold text-gray-800">Radius (mi)</span>
                        <span className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">?</span>
                    </div>

                    {/* Slider Container */}
                    <div className="relative h-6 flex items-center">
                        {/* Background track */}
                        <div className="absolute left-0 right-0 h-[2px] bg-gray-400 rounded-full" />
                        
                        {/* Active track (blue portion) */}
                        <div 
                            className="absolute left-0 h-[2px] bg-blue-600 rounded-full" 
                            style={{ width: `${radius}%` }}
                        />

                        {/* Step markers */}
                        {steps.map((step, index) => (
                            <div
                                key={step}
                                className={`absolute h-5 w-[3px] rounded-sm transition-colors ${
                                    step <= radius ? 'bg-blue-600' : 'bg-gray-400'
                                }`}
                                style={{
                                    left: `${step}%`,
                                    transform: step === 100 ? 'translateX(-100%)' : step === 0 ? 'none' : 'translateX(-50%)'
                                }}
                            />
                        ))}

                        {/* Actual range input (invisible but functional) */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={radius}
                            onChange={handleRadiusChange}
                            className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                        />

                        {/* Draggable thumb indicator - straight vertical line */}
                        <div 
                            className="absolute h-5 w-[3px] bg-blue-600 rounded-sm pointer-events-none"
                            style={{ 
                                left: `${radius}%`, 
                                transform: 'translateX(-50%)'
                            }}
                        />
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-base font-semibold text-gray-700 mt-2">
                        {steps.map((step) => (
                            <span
                                key={step}
                                className={step <= radius ? 'text-blue-600' : ''}
                            >
                                {step}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
// Inline Modifier Button
const ModifierButtonInline = ({ currentFilter, onModifierClick }) => {
    const [showModifier, setShowModifier] = useState(false);
    const btnRef = useRef(null);

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={() => setShowModifier(!showModifier)}
                className="p-1 hover:bg-gray-200 rounded opacity-100 group-hover:opacity-100 transition-opacity"
            >
                <img src={FilterIcon} alt="filter" className="w-6 h-6" />
            </button>
            <ModifierDropdown
                isOpen={showModifier}
                onClose={() => setShowModifier(false)}
                onSelect={(mod) => { onModifierClick(mod); setShowModifier(false); }}
                currentModifier={currentFilter?.modifier}
                buttonRef={btnRef}
            />
        </div>
    );
};

export default {
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
    ModifierDropdown,
    ChevronDown,
    ChevronRight,
};