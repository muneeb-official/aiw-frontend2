import { useState, useEffect } from "react";
import { fetchSicCodesWithFallback } from "../services/sicCodeService";

// Fallback SIC codes data (from b2bData.js)
const fallbackSicCodes = [
  { id: 1, label: "01 - Agriculture", count: 320 },
  { id: 2, label: "10 - Mining", count: 180 },
  { id: 3, label: "15 - Construction", count: 890 },
  { id: 4, label: "20 - Manufacturing", count: 1240 },
  { id: 5, label: "40 - Transportation", count: 560 },
  { id: 6, label: "50 - Wholesale Trade", count: 720 },
  { id: 7, label: "52 - Retail Trade", count: 1580 },
  { id: 8, label: "60 - Finance", count: 2100 },
  { id: 9, label: "70 - Services", count: 3400 },
  { id: 10, label: "80 - Health Services", count: 1890 },
  { id: 11, label: "01120 - Growing of rice", count: 245 },
  { id: 12, label: "42090 - Construction", count: 567 },
];

/**
 * Custom hook to fetch and manage SIC codes data
 * @returns {Object} { sicCodes, loading, error }
 */
export const useSicCodes = () => {
  const [sicCodes, setSicCodes] = useState(fallbackSicCodes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSicCodes = async () => {
      try {
        setLoading(true);
        const data = await fetchSicCodesWithFallback();

        // Only update if we got data, otherwise keep the fallback
        if (data && data.length > 0) {
          setSicCodes(data);
        }
      } catch (err) {
        setError(err);
        console.error("Error loading SIC codes:", err);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    loadSicCodes();
  }, []);

  return { sicCodes, loading, error };
};
