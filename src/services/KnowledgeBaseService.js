// src/services/KnowledgeBaseService.js

import api from './api'; // Import your existing axios instance

class KnowledgeBaseService {
  // Get company name from user data
  getCompanyName() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.company_name || parsed.organization?.name || null;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  }

  // ==================== FILE ENDPOINTS ====================

  // Upload a file (PDF, CSV, PNG, JPEG, TXT)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/platform/knowledge-base/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to upload file');
    }
  }

  // List all files
  async listFiles() {
    try {
      const response = await api.get('/platform/knowledge-base/files');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch files');
    }
  }

  // Delete a file by ID
  async deleteFile(fileId) {
    try {
      const response = await api.delete(`/platform/knowledge-base/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to delete file');
    }
  }

  // Get combined context from all files (for AI usage)
  async getFileContext() {
    try {
      const response = await api.get('/platform/knowledge-base/context');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to get context');
    }
  }

  // ==================== SCRAPER/URL ENDPOINTS ====================

  // Start scraping a URL
  async scrapeUrl(url, options = {}) {
    const companyName = this.getCompanyName();
    if (!companyName) {
      throw new Error('Company name not found. Please ensure you are logged in.');
    }

    const payload = {
      url: url,
      company_name: companyName,
      max_depth: options.max_depth || 1,
      follow_links: options.follow_links || false,
      max_pages: options.max_pages || 10
    };

    try {
      const response = await api.post('/scraper/scrape', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to start scraping');
    }
  }

  // Get scraped content
  async getScrapedContent(limit = 50) {
    const companyName = this.getCompanyName();
    if (!companyName) {
      throw new Error('Company name not found. Please ensure you are logged in.');
    }

    try {
      const response = await api.get('/scraper/content', {
        params: {
          company_name: companyName,
          limit: limit
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch scraped content');
    }
  }

  // Delete scraped content
  async deleteScrapedContent() {
    const companyName = this.getCompanyName();
    if (!companyName) {
      throw new Error('Company name not found. Please ensure you are logged in.');
    }

    try {
      const response = await api.delete('/scraper/content', {
        params: {
          company_name: companyName
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to delete scraped content');
    }
  }

  // Get scraper context (combined text from all scraped pages)
  async getScraperContext() {
    const companyName = this.getCompanyName();
    if (!companyName) {
      throw new Error('Company name not found. Please ensure you are logged in.');
    }

    try {
      const response = await api.get('/scraper/context', {
        params: {
          company_name: companyName
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to get scraper context');
    }
  }

  // ==================== HELPER METHODS ====================

  // Format file size
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Map API status to display status
  mapStatus(status) {
    const statusMap = {
      'ready': 'Completed',
      'completed': 'Completed',
      'processing': 'In Progress',
      'pending': 'In Progress',
      'scraping': 'In Progress',
      'failed': 'Failed',
      'error': 'Failed'
    };
    return statusMap[status?.toLowerCase()] || status || 'Unknown';
  }

  // Transform API file to UI format
  transformFile(apiFile) {
    return {
      id: apiFile.file_id,
      name: apiFile.filename,
      size: this.formatFileSize(apiFile.file_size),
      status: this.mapStatus(apiFile.status),
      pageCount: apiFile.page_count,
      errorMessage: apiFile.error_message,
      createdAt: apiFile.created_at,
      updatedAt: apiFile.updated_at,
      type: 'file'
    };
  }

  // Transform list of files
  transformFiles(apiResponse) {
    if (!apiResponse?.files) return [];
    return apiResponse.files.map(file => this.transformFile(file));
  }

  // Transform scraped content item to UI format
  transformScrapedContent(item) {
    return {
      id: item.id,
      name: item.title || item.page_url || 'Untitled Page',
      url: item.page_url || item.source_url,
      sourceUrl: item.source_url,
      companyName: item.company_name,
      content: item.content,
      status: 'Completed',
      crawlDepth: item.crawl_depth,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      type: 'url'
    };
  }

  // Transform list of scraped content
  transformScrapedContents(apiResponse) {
    if (!apiResponse?.content) return [];
    return apiResponse.content.map(item => this.transformScrapedContent(item));
  }

  // Transform scrape job response
  transformScrapeJob(job) {
    return {
      jobId: job.job_id,
      status: this.mapStatus(job.status),
      message: job.message,
      companyName: job.company_name,
      sourceUrl: job.source_url,
      pagesScraped: job.pages_scraped,
      createdAt: job.created_at
    };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;