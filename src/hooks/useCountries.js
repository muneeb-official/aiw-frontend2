import { useState, useEffect } from "react";
import { fetchCountriesWithFallback } from "../services/locationService";
import { locationData as fallbackLocationData } from "../data/salesAgentData";

/**
 * Custom hook to fetch and manage countries data
 * @returns {Object} { countries, loading, error }
 */
export const useCountries = () => {
  const [countries, setCountries] = useState(fallbackLocationData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountriesWithFallback();

        // Only update if we got data, otherwise keep the fallback
        if (data && data.length > 0) {
          setCountries(data);
        }
      } catch (err) {
        setError(err);
        console.error("Error loading countries:", err);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return { countries, loading, error };
};
