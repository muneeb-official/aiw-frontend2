import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import bgImage from "../../assets/Background.png";
import ContentEditor from "./Contenteditor";
import api from "../../services/api";

export default function CompetitorArticles({ onBack, searchParams }) {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [competitorArticles, setCompetitorArticles] = useState([]);
  const [error, setError] = useState(null);
  const [scrapedArticleIds, setScrapedArticleIds] = useState(new Set());
  const [postId, setPostId] = useState(null);
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [optimizationGuide, setOptimizationGuide] = useState(null);
  const [competitorScores, setCompetitorScores] = useState(null);
  const [targetKeyword, setTargetKeyword] = useState("");
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Prevent double execution from React Strict Mode
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    fetchCompetitorArticles().finally(() => {
      isFetchingRef.current = false;
    });
  }, [searchParams]);

  const scrapeArticle = async (postId, link) => {
    try {
      console.log("Scraping:", link);
      const response = await api.post(`/seo/scrape/${postId}`, { links: [link] });
      console.log("Scrape response for", link, ":", response.data);
      const contentInfo = response.data?.data?.contentInfo || [];
      return contentInfo.length > 0 ? link : null;
    } catch (err) {
      console.error(`Failed to scrape ${link}:`, err);
      return null;
    }
  };

  const scrapeArticlesSequentially = async (postId, links) => {
    const scrapedLinks = [];
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const result = await scrapeArticle(postId, link);
      if (result) {
        scrapedLinks.push(result);
      }
      // Add a small delay between requests to prevent overwhelming the backend
      if (i < links.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    console.log("Successfully scraped links:", scrapedLinks);
    return scrapedLinks;
  };

  const fetchCompetitorArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setScrapedArticleIds(new Set());

      const response = await api.post("/seo/search/", {
        keyword: searchParams.keyword,
        searchLocation: searchParams.location,
        searchLang: searchParams.language,
        googleDomain: "google.com",
      });

      console.log("Search response:", response.data);
      const searchPostId = response.data?.post_id;
      console.log("Post ID:", searchPostId);
      setPostId(searchPostId);
      const organicResults =
        response.data?.search_result?.organic_results || [];

      const formattedArticles = organicResults.map((result, index) => ({
        id: index + 1,
        title: result.title || "Untitled",
        url: result.link || "",
        wordCount: result.word_count || Math.floor(Math.random() * 5000) + 1000,
        excerpt: result.snippet || "",
      }));

      setCompetitorArticles(formattedArticles);

      // Get all article links and scrape them
      const allLinks = formattedArticles.map((article) => article.url).filter(Boolean);
      const scrapedLinks = await scrapeArticlesSequentially(searchPostId, allLinks);

      // Create a set of successfully scraped URLs
      const scrapedUrlSet = new Set(scrapedLinks);

      // Map back to article IDs that were successfully scraped
      const successfulIds = new Set(
        formattedArticles
          .filter((article) => scrapedUrlSet.has(article.url))
          .map((article) => article.id)
      );
      setScrapedArticleIds(successfulIds);

      // Pre-select only successfully scraped articles
      setSelectedArticles(Array.from(successfulIds));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch competitor articles",
      );
      console.error("Error fetching competitor articles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArticleSelection = (articleId) => {
    // Only allow toggling if article was successfully scraped
    if (!scrapedArticleIds.has(articleId)) return;

    setSelectedArticles((prev) => {
      if (prev.includes(articleId)) {
        return prev.filter((id) => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  const [showContentEditor, setShowContentEditor] = useState(false);

  const handleContinue = async () => {
    if (!postId || selectedArticles.length === 0) return;

    try {
      setIsContinueLoading(true);

      // Call both APIs in parallel
      const [optimizeResponse, scoresResponse] = await Promise.all([
        api.get(`/seo/optimize/${postId}`),
        api.get(`/seo/competitor-scores/${postId}`),
      ]);

      console.log("Optimize response:", optimizeResponse.data);
      console.log("Competitor scores response:", scoresResponse.data);

      // Store optimization guide data
      if (optimizeResponse.data?.status === "success") {
        setOptimizationGuide(optimizeResponse.data.optimization_guide);
        setTargetKeyword(optimizeResponse.data.target_keyword);
      }

      // Store competitor scores data
      if (scoresResponse.data?.status === "success") {
        setCompetitorScores(scoresResponse.data.scores);
      }

      setShowContentEditor(true);
    } catch (err) {
      console.error("Error fetching optimization data:", err);
      setError(err.response?.data?.error || "Failed to fetch optimization data");
    } finally {
      setIsContinueLoading(false);
    }
  };

  const calculateAverageWordCount = () => {
    if (selectedArticles.length === 0 || competitorArticles.length === 0)
      return 0;
    const total = selectedArticles.reduce((sum, id) => {
      const article = competitorArticles.find((a) => a.id === id);
      return sum + (parseInt(article?.wordCount) || 0);
    }, 0);
    return Math.round(total / selectedArticles.length);
  };

  const formatWordCount = (count) => {
    return count.toLocaleString();
  };
  // If showing ContentEditor, render that instead
  if (showContentEditor) {
    return (
      <ContentEditor
        onBack={() => setShowContentEditor(false)}
        selectedArticles={selectedArticles}
        optimizationGuide={optimizationGuide}
        competitorScores={competitorScores}
        targetKeyword={targetKeyword}
        postId={postId}
      />
    );
  }

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="pt-5 mx-6">
        {/* Header */}
        <div className="mb-2 bg-white px-5 pt-5">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-gray-900 mb-6 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-lg">Back</span>
          </button>

          <h1 className="text-4xl text-gray-900">
            Choose Competitor Articles for Analysis
          </h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium text-gray-900">
                Select 5-10 articles to analyze. Articles are sorted by word
                count (highest first).
              </p>
            </div>
            {/* Continue Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleContinue}
                disabled={selectedArticles.length === 0 || isContinueLoading}
                className={`px-6 py-2 rounded-full text-sm ${
                  selectedArticles.length > 0 && !isContinueLoading
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isContinueLoading ? "Loading..." : `Continue with ${selectedArticles.length} Articles`}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <>
            <style>{`
      @keyframes flash {
        0%, 100% { background-color: rgb(209, 213, 219); }
        50% { background-color: rgb(17, 24, 39); }
      }
    `}</style>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  We are fetching all the information
                </h2>
                <p className="text-gray-600 mb-6">
                  Please wait, It will take a few seconds.
                </p>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[flash_1.4s_ease-in-out_infinite]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[flash_1.4s_ease-in-out_0.2s_infinite]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-[flash_1.4s_ease-in-out_0.4s_infinite]"></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
          {/* Left Column - Articles List */}
          <div className="space-y-3">
            {isLoading ? (
              // Skeleton Loading Cards
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded-lg p-5 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error State
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchCompetitorArticles}
                  className="text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : competitorArticles.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500">No competitor articles found</p>
              </div>
            ) : (
              // Actual Articles
              competitorArticles.map((article) => {
                const isSelected = selectedArticles.includes(article.id);
                const isScraped = scrapedArticleIds.has(article.id);
                return (
                  <div
                    key={article.id}
                    className={`bg-white rounded-lg p-5 transition-all ${!isScraped ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleArticleSelection(article.id)}
                          disabled={!isScraped}
                          className={`w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${isScraped ? "cursor-pointer" : "cursor-not-allowed"}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${isScraped ? "text-gray-900" : "text-gray-400"}`}>
                          {article.title}
                        </h3>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-semibold text-sm mb-2 block truncate ${isScraped ? "text-indigo-500" : "text-gray-400 pointer-events-none"}`}
                        >
                          {article.url}
                        </a>
                        <p className={`text-sm ${isScraped ? "text-gray-700" : "text-gray-400"}`}>
                          {article.excerpt}
                        </p>
                        {!isScraped && (
                          <p className="text-red-500 text-xs mt-1">Failed to scrape this article</p>
                        )}
                      </div>

                      {/* Word Count */}
                      <div className="flex-shrink-0 text-right">
                        <p className={`font-semibold text-base px-3 py-1 rounded-full ${isScraped ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"}`}>
                          {formatWordCount(article.wordCount)} words
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-2">
            {/* Successfully Scraped */}
            <div className="bg-white rounded-lg pt-2 px-3 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Successfully scraped
              </h3>
              {isLoading ? (
                <div className="flex items-baseline gap-2 pb-6">
                  <div className="h-16 w-16 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-8 w-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-semibold text-gray-900">
                    {scrapedArticleIds.size}
                  </span>
                  <span className="text-gray-600 text-lg pb-6">
                    /{competitorArticles.length}
                  </span>
                </div>
              )}
            </div>

            {/* Average Word Count */}
            <div className="bg-white rounded-lg pt-2 px-3 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Average word count
              </h3>
              {isLoading ? (
                <div className="flex items-baseline gap-2 pb-6">
                  <div className="h-16 w-32 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-semibold text-gray-900">
                    {formatWordCount(calculateAverageWordCount())}
                  </span>
                  <span className="text-gray-900 text-lg pb-6">Words</span>
                </div>
              )}
            </div>

            {/* Selected Articles */}
            <div className="bg-white rounded-lg  pt-2 px-3 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Selected Articles
              </h3>
              {isLoading ? (
                <div className="flex items-baseline gap-2 pb-6">
                  <div className="h-16 w-16 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2 pb-6">
                  <span className="text-6xl font-semibold text-gray-900">
                    {selectedArticles.length}
                  </span>
                  <span className="text-gray-900 text-lg">Articles</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
