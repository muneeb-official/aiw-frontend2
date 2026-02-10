import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Export data to CSV
 * @param {Object|Array} data - JSON data to convert to CSV (object or array of objects)
 * @param {string} filename - Optional filename without extension (default: "export")
 * @param {boolean} flattenNested - Whether to flatten nested objects (default: true)
 * @returns {Promise<Blob>} - CSV file as blob
 */
export const exportToCSV = async (data, filename = "export", flattenNested = true) => {
  try {
    const response = await api.post(
      "/b2b/v1/utils/json-to-csv",
      {
        data,
        filename,
        flatten_nested: flattenNested,
      },
      {
        responseType: "blob",
      }
    );

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers["content-disposition"];
    let downloadFilename = `${filename}.csv`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        downloadFilename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", downloadFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return blob;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw error;
  }
};

export default api;
