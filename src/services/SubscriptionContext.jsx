// src/context/SubscriptionContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { subscriptionService, categorizeServices } from '../services/subscriptionService';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  // Services from API
  const [services, setServices] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [seoAddons, setSeoAddons] = useState([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cart state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSEO, setSelectedSEO] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('B2C'); // 'B2C' or 'B2B'
  
  // Checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Fetch services on mount
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await subscriptionService.getServices();
      setServices(data);
      
      // Categorize into main plans and SEO addons
      const { mainPlans: plans, seoAddons: seo } = categorizeServices(data);
      setMainPlans(plans);
      setSeoAddons(seo);
    } catch (err) {
      setError(err.message || 'Failed to load plans');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Select a main plan
  const selectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
    // If selecting Tier 3 (premium), SEO is included - clear any SEO selection
    if (plan?.bothAgents || plan?.name?.toLowerCase().includes('tier 3')) {
      setSelectedSEO(null);
    }
  }, []);

  // Select an SEO addon
  const selectSEO = useCallback((seo) => {
    // Don't allow SEO selection if Tier 3 is selected (it's included)
    if (selectedPlan?.bothAgents || selectedPlan?.name?.toLowerCase().includes('tier 3')) {
      return;
    }
    setSelectedSEO(seo);
  }, [selectedPlan]);

  // Clear cart
  const clearCart = useCallback(() => {
    setSelectedPlan(null);
    setSelectedSEO(null);
    setSelectedAgent('B2C');
  }, []);

  // Get cart count
  const getCartCount = useCallback(() => {
    let count = 0;
    if (selectedPlan) {
      count += 1;
      // Tier 3 includes SEO
      if (selectedPlan.bothAgents) {
        count += 1;
      }
    }
    if (selectedSEO && !selectedPlan?.bothAgents) {
      count += 1;
    }
    return count;
  }, [selectedPlan, selectedSEO]);

  // Get selected service IDs for checkout
  const getSelectedServiceIds = useCallback(() => {
    const ids = [];
    if (selectedPlan?.id) {
      ids.push(selectedPlan.id);
    }
    if (selectedSEO?.id && !selectedPlan?.bothAgents) {
      ids.push(selectedSEO.id);
    }
    return ids;
  }, [selectedPlan, selectedSEO]);

  // Calculate total price
  const calculateTotal = useCallback((billingCycle = 'monthly') => {
    let total = 0;
    
    if (selectedPlan) {
      total += selectedPlan.price;
    }
    
    if (selectedSEO && !selectedPlan?.bothAgents) {
      total += selectedSEO.price;
    }
    
    // Apply yearly discount (20% off)
    if (billingCycle === 'yearly') {
      total = total * 0.8;
    }
    
    return Math.round(total * 100) / 100;
  }, [selectedPlan, selectedSEO]);

// Proceed to Stripe checkout
const proceedToCheckout = useCallback(async () => {
  const serviceIds = getSelectedServiceIds();
  
  if (serviceIds.length === 0) {
    setCheckoutError('Please select at least one plan');
    return null;
  }

  setCheckoutLoading(true);
  setCheckoutError(null);

  try {
    // Get token from localStorage or your auth context
    const token = localStorage.getItem('access_token'); // Adjust based on your auth setup
    
    const result = await subscriptionService.subscribe(serviceIds, token);
    
    // Redirect to Stripe checkout
    if (result.checkout_url) {
      window.location.href = result.checkout_url;
    }
    
    return result;
  } catch (err) {
    setCheckoutError(err.message || 'Failed to create checkout session');
    console.error('Checkout error:', err);
    return null;
  } finally {
    setCheckoutLoading(false);
  }
}, [getSelectedServiceIds]);
  const value = {
    // Data
    services,
    mainPlans,
    seoAddons,
    
    // Loading states
    loading,
    error,
    checkoutLoading,
    checkoutError,
    
    // Cart state
    selectedPlan,
    selectedSEO,
    selectedAgent,
    
    // Actions
    fetchServices,
    selectPlan,
    selectSEO,
    setSelectedAgent,
    clearCart,
    
    // Computed values
    getCartCount,
    getSelectedServiceIds,
    calculateTotal,
    
    // Checkout
    proceedToCheckout,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;