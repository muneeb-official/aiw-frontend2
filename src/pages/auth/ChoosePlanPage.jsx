// src/pages/auth/ChoosePlanPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useSubscription } from '../../services/SubscriptionContext';
import backgroundImage from '../../assets/Background.png';

// Check Icon (Blue)
const CheckIcon = ({ color = "#4F46E5" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Arrow Icon
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// Cart Icon
const CartIcon = ({ count = 0 }) => (
  <div className="flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    <span className="bg-[#1E293B] text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
      {count}
    </span>
  </div>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
  </div>
);

// Error Message
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <p className="text-red-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA]"
    >
      Try Again
    </button>
  </div>
);

// Agent Toggle Component
const AgentToggle = ({ selected, onChange }) => (
  <div className="flex gap-0 mt-2">
    <button
      onClick={() => onChange('B2C')}
      className={`px-4 py-2 text-sm transition-all ${
        selected === 'B2C'
          ? 'bg-[#1E293B] text-white rounded-l-full'
          : 'bg-white text-gray-700 border border-gray-300 rounded-l-full'
      }`}
    >
      B2C Lead Builder Agent
    </button>
    <button
      onClick={() => onChange('B2B')}
      className={`px-4 py-2 text-sm transition-all ${
        selected === 'B2B'
          ? 'bg-[#1E293B] text-white rounded-r-full'
          : 'bg-white text-gray-700 border border-l-0 border-gray-300 rounded-r-full'
      }`}
    >
      B2B Lead Builder Agent
    </button>
  </div>
);

// Plan Card Component
const PlanCard = ({ plan, selectedAgent, onAgentChange, selectedPlanId, onSelectPlan }) => {
  const isSelected = selectedPlanId === plan.id;
  const hasSelectedPlan = selectedPlanId !== null;

  const getButtonContent = () => {
    if (isSelected) {
      return (
        <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-500 text-sm font-medium">
          Plan Added in Cart
        </span>
      );
    }
    return (
      <button
        onClick={() => onSelectPlan(plan)}
        className="flex items-center gap-2 text-[#4F46E5] font-semibold hover:text-[#4338CA] transition-colors"
      >
        {hasSelectedPlan ? 'Get this Plan' : 'Get This Plan'} <ArrowIcon />
      </button>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 flex flex-col bg-white h-full">
      <div className="flex justify-between items-start mb-1">
        <span className="text-gray-600 text-base">{plan.name}</span>
        {plan.isBestseller && (
          <span className="px-3 py-1 bg-[#1E293B] text-white text-xs font-medium rounded">
            BESTSELLER
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-[#1E293B] text-5xl font-bold">£{plan.price}</span>
        <span className="text-gray-500 text-base">/ month per seat</span>
      </div>

      {plan.hasAgentToggle && (
        <div className="mb-6">
          <span className="text-gray-900 text-sm font-medium">Choose any one</span>
          <AgentToggle selected={selectedAgent} onChange={onAgentChange} />
        </div>
      )}

      {plan.bothAgents && (
        <div className="bg-[#EEF2FF] rounded-lg p-3 mb-6 text-sm">
          <span className="text-gray-700">Both </span>
          <span className="text-gray-900 font-medium">B2C Lead Builder Agent</span>
          <span className="text-gray-700"> & </span>
          <span className="text-gray-900 font-medium">B2B Lead Builder Agent</span>
          <span className="text-gray-700 italic"> will be included in this plan</span>
        </div>
      )}

      <div className="flex-1">
        <p className="text-gray-900 font-medium mb-3">You will get</p>
        <ul className="space-y-2.5">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0"><CheckIcon /></span>
              <span className="text-gray-600 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">{getButtonContent()}</div>
    </div>
  );
};

// SEO Addon Card Component
const SEOAddonCard = ({ addon, selectedPlanId, selectedSEOId, onSelectSEO, isPremiumSelected }) => {
  const isDisabled = isPremiumSelected;
  const isSelected = selectedSEOId === addon.id;
  const hasSelectedSEO = selectedSEOId !== null;

  const getButtonContent = () => {
    if (isSelected) {
      return (
        <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-500 text-sm font-medium">
          Plan Added in Cart
        </span>
      );
    }
    if (isDisabled) {
      return (
        <button disabled className="flex items-center gap-1 text-gray-400 font-semibold text-sm cursor-not-allowed">
          Buy This Plan <ArrowIcon />
        </button>
      );
    }
    return (
      <button
        onClick={() => onSelectSEO(addon)}
        className="flex items-center gap-1 text-[#4F46E5] font-semibold text-sm hover:text-[#4338CA] transition-colors"
      >
        {hasSelectedSEO ? 'Buy This Plan' : 'Switch Plan'} <ArrowIcon />
      </button>
    );
  };

  return (
    <div className={`border border-gray-200 rounded-xl p-5 bg-white min-w-[350px] flex flex-col ${isDisabled ? 'opacity-50' : ''}`}>
      <p className={`text-sm mb-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>{addon.name}</p>
      <div className="mb-3">
        <span className={`text-4xl font-bold ${isDisabled ? 'text-gray-400' : 'text-[#1E293B]'}`}>
          £{addon.price}
        </span>
        {addon.price > 0 && <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>/ month</span>}
      </div>
      <p className={`flex items-center gap-2 text-sm mb-4 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
        <CheckIcon color={isDisabled ? "#9CA3AF" : "#4F46E5"} /> {addon.words}
      </p>
      <div className="mt-auto">{getButtonContent()}</div>
    </div>
  );
};

// Main Page Component
const ChoosePlanPage = () => {
  const navigate = useNavigate();
  const {
    mainPlans,
    seoAddons,
    loading,
    error,
    selectedPlan,
    selectedSEO,
    selectedAgent,
    selectPlan,
    selectSEO,
    setSelectedAgent,
    getCartCount,
    fetchServices,
  } = useSubscription();

  const [agentSelections, setAgentSelections] = useState({});
  const cartCount = getCartCount();
  const isPremiumSelected = selectedPlan?.bothAgents || selectedPlan?.name?.toLowerCase().includes('tier 3');

  const handleAgentChange = (planId, agent) => {
    setAgentSelections(prev => ({ ...prev, [planId]: agent }));
    if (selectedPlan?.id === planId) {
      setSelectedAgent(agent);
    }
  };

  const handleSelectPlan = (plan) => {
    selectPlan(plan);
    const agent = agentSelections[plan.id] || 'B2C';
    setSelectedAgent(agent);
  };

  const handleProceedToCheckout = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Header variant="simple" />
        <main className="max-w-8xl mx-auto px-6 py-8 mt-6 bg-white">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Header variant="simple" />
        <main className="max-w-8xl mx-auto px-6 py-8 mt-6 bg-white">
          <ErrorMessage message={error} onRetry={fetchServices} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header variant="simple" />

      <main className="max-w-8xl mx-auto px-6 py-8 mt-6 bg-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-medium text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Choose a Plan
          </h1>
          <div className="flex items-center gap-4">
            <CartIcon count={cartCount} />
            {cartCount > 0 && (
              <button
                onClick={handleProceedToCheckout}
                className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {mainPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selectedAgent={agentSelections[plan.id] || 'B2C'}
              onAgentChange={(agent) => handleAgentChange(plan.id, agent)}
              selectedPlanId={selectedPlan?.id}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1">Add-ons</p>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="md:min-w-[180px]">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                SEO Blog &<br />Content Engine<br />Agent
              </h2>
            </div>

            <div className="flex gap-4 overflow-hidden pb-5 ml-24">
              {seoAddons.map((addon) => (
                <SEOAddonCard
                  key={addon.id}
                  addon={addon}
                  selectedPlanId={selectedPlan?.id}
                  selectedSEOId={selectedSEO?.id}
                  onSelectSEO={selectSEO}
                  isPremiumSelected={isPremiumSelected}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChoosePlanPage;