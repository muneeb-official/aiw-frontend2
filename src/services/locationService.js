import api from "./api";

/**
 * Fetches countries and their states/provinces from the RocketReach API
 * @returns {Promise<Array>} Array of location objects formatted for LocationFilter component
 */
export const fetchCountries = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await api.get(
      `${API_BASE_URL}/b2b/v1/rocketreach/countries`,
    );

    // Transform API response to LocationFilter format
    // API format: { "CAN": ["Alberta", "British Columbia", ...], "Africa": [...], ... }
    // Expected format: [{ name: "CAN", count: null, children: [...] }, ...]

    const transformedData = Object.entries(response.data).map(
      ([countryKey, states]) => ({
        name: countryKey,
        count: states.length,
        children: states,
      }),
    );

    return transformedData;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

/**
 * Fetches countries with error handling and fallback to empty array
 * @returns {Promise<Array>} Array of location objects or empty array on error
 */
export const fetchCountriesWithFallback = async () => {
  try {
    return await fetchCountries();
  } catch (error) {
    console.error("Failed to fetch countries, returning empty array:", error);
    return [];
  }
};
