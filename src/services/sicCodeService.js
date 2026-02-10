import api from "./api";

/**
 * Fetches SIC codes from the API
 * @returns {Promise<Array>} Array of SIC code objects formatted for filter component
 */
export const fetchSicCodes = async () => {
  try {
    const response = await api.get("/b2b/sic-codes");

    // API Response format:
    // {
    //   "success": true,
    //   "total_codes": 731,
    //   "sic_codes": {
    //     "01110": "Growing of cereals...",
    //     "01120": "Growing of rice",
    //     ...
    //   }
    // }

    const sicCodesObject = response.data.sic_codes || {};

    // Transform object to array format
    // Convert { "01110": "Description" } to [{ id: 1, label: "01110 - Description", code: "01110" }]
    const transformedData = Object.entries(sicCodesObject).map(([code, description], index) => ({
      id: index + 1,
      label: `${code} - ${description}`,
      code: code,
      count: 0, // Not provided by API
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching SIC codes:", error);
    throw error;
  }
};

/**
 * Fetches SIC codes with error handling and fallback to empty array
 * @returns {Promise<Array>} Array of SIC code objects or empty array on error
 */
export const fetchSicCodesWithFallback = async () => {
  try {
    return await fetchSicCodes();
  } catch (error) {
    console.error("Failed to fetch SIC codes, returning empty array:", error);
    return [];
  }
};
