import React from 'react';
import { Loader2 } from 'lucide-react';

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { label: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-700', dotColor: 'bg-green-500' },
    failed: { label: 'Failed', bgColor: 'bg-red-100', textColor: 'text-red-700', dotColor: 'bg-red-500' },
    in_progress: { label: 'In Progress', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', dotColor: 'bg-yellow-500' },
    pending: { label: 'Pending', bgColor: 'bg-gray-100', textColor: 'text-gray-700', dotColor: 'bg-gray-500' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {status === 'in_progress' ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      )}
      {config.label}
    </span>
  );
};

// Tab Button Component
export const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// Section Card Component
export const SectionCard = ({ title, description, children, action }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    {Icon && (
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    )}
    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
    {action}
  </div>
);

// Action Button Component
export const ActionButton = ({ onClick, icon: Icon, variant = 'default', disabled = false, children }) => {
  const variants = {
    default: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    danger: 'text-red-500 hover:text-red-700 hover:bg-red-50',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
      title={children}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// Input Field Component
export const InputField = ({ label, type = 'text', value, onChange, placeholder, icon: Icon, helper, error, disabled }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
    </div>
    {helper && !error && <p className="mt-1.5 text-xs text-gray-500">{helper}</p>}
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

// Toggle Switch Component
export const ToggleSwitch = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Integration Card Component
export const IntegrationCard = ({ name, description, icon, connected, onConnect, onDisconnect }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    {connected ? (
      <button
        onClick={onDisconnect}
        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        Disconnect
      </button>
    ) : (
      <button
        onClick={onConnect}
        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        Connect
      </button>
    )}
  </div>
);

// Stats Card Component
export const StatsCard = ({ label, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500">{label}</span>
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
    </div>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
    {trend && (
      <p className={`text-xs mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </p>
    )}
  </div>
);