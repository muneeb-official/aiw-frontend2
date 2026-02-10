// src/services/subscriptionService.js
const API_BASE = 'aiworkforce-prod-alb-240576262.us-east-1.elb.amazonaws.com/apihost:8000/api/platform';

export const subscriptionService = {
  // Get all available services/plans
  getServices: async () => {
    try {
      const response = await fetch(`${API_BASE}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

// Create Stripe checkout session
subscribe: async (serviceIds) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Get token from localStorage (matches your authService pattern)
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/solo/subscribe`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ service_ids: serviceIds }),
    });
        
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        throw new Error('Please login to continue with checkout');
      }
      
      throw new Error(errorData.detail || errorData.message || `Failed to create checkout: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
},
  // Sync services with Stripe (admin only)
  syncWithStripe: async (force = false) => {
    try {
      const response = await fetch(`${API_BASE}/stripe/sync/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync with Stripe: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      throw error;
    }
  },
};

// Helper to categorize services from API response
export const categorizeServices = (services) => {
  const mainPlans = [];
  const seoAddons = [];

  services.forEach(service => {
    const name = service.name.toLowerCase();
    
    // SEO plans start with "seo tier"
    if (name.startsWith('seo tier') || name.startsWith('seo ')) {
      seoAddons.push({
        id: service.id,
        name: service.name.replace('SEO ', '').replace(' - Free', '').replace(' - Starter', '').replace(' - Growth', '').replace(' - Professional', ''),
        price: service.price_per_seat ? parseFloat(service.price_per_seat) : 0,
        description: service.description,
        words: extractWords(service.description),
        isActive: service.is_active,
        stripeId: service.stripe_price_id,
      });
    } else {
      // Main subscription plans (Lead Builder tiers)
      const isTier3 = name.includes('tier 3') || name.includes('premium') || name.includes('b2c and b2b');
      mainPlans.push({
        id: service.id,
        name: service.name,
        price: service.price_per_seat ? parseFloat(service.price_per_seat) : 0,
        description: service.description,
        features: extractFeatures(service.description),
        isActive: service.is_active,
        stripeId: service.stripe_price_id,
        isBestseller: isTier3,
        hasAgentToggle: !isTier3,
        bothAgents: isTier3,
      });
    }
  });

  // Sort by price
  mainPlans.sort((a, b) => a.price - b.price);
  seoAddons.sort((a, b) => a.price - b.price);

  return { mainPlans, seoAddons };
};

// Extract word count from description
const extractWords = (description) => {
  const match = description.match(/([\d,]+)\s*words/i);
  if (match) {
    return `${match[1]} Words.`;
  }
  return 'Unlimited';
};

// Extract features from description
const extractFeatures = (description) => {
  // Split by comma and clean up
  const parts = description.split(',').map(p => p.trim());
  return parts.filter(p => p.length > 0);
};

export default subscriptionService;