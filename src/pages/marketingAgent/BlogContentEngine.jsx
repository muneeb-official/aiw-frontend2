import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import bgImage from "../../assets/Background.png";
import {
  searchLocations,
  searchLanguages,
} from "../../data/blogMockData";
import CompetitorArticles from "./CompetitorArticles";
import ContentEditor from "./Contenteditor";
import api from "../../services/api";

export default function BlogContentEngine() {
  const [activeTab, setActiveTab] = useState("research");
  const [showCompetitorArticles, setShowCompetitorArticles] = useState(false);
  const [pastKeywords, setPastKeywords] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedBlogsLoading, setSavedBlogsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "",
    language: "",
  });
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [selectedBlogData, setSelectedBlogData] = useState(null);

  useEffect(() => {
    fetchPastKeywords();
  }, []);

  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedBlogs();
    }
  }, [activeTab]);

  const fetchPastKeywords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/seo/posts");
      const formattedData = response.data.map((item) => ({
        id: item.id,
        keyword: item.title || item.search_query?.q || "Unknown",
        searchedOn: item.search_result?.search_metadata?.created_at
          ? new Date(item.search_result.search_metadata.created_at).toISOString().split("T")[0]
          : "N/A",
        volume: item.search_result?.search_information?.total_results || 0,
        rawData: item,
      }));
      setPastKeywords(formattedData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch past keywords");
      console.error("Error fetching past keywords:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchParams.keyword && searchParams.location && searchParams.language) {
      setShowCompetitorArticles(true);
    }
  };

  const handleBackFromCompetitor = () => {
    setShowCompetitorArticles(false);
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/seo/posts/${postId}`);
      // Remove the deleted item from state
      setPastKeywords((prev) => prev.filter((item) => item.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const fetchSavedBlogs = async () => {
    try {
      setSavedBlogsLoading(true);
      const response = await api.get("/seo/blogs");
      console.log("Saved blogs response:", response.data);
      const formattedBlogs = (response.data || []).map((blog) => ({
        id: blog.id,
        title: blog.title || "Untitled",
        content: blog.content || "",
        postId: blog.post_id,
        keywords: blog.keywords || [],
        status: blog.status || "draft",
        createdAt: blog.created_at
          ? new Date(blog.created_at).toISOString().split("T")[0]
          : "N/A",
        rawData: blog,
      }));
      setSavedBlogs(formattedBlogs);
    } catch (err) {
      console.error("Error fetching saved blogs:", err);
    } finally {
      setSavedBlogsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await api.delete(`/seo/blogs/${blogId}`);
      setSavedBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleOpenBlogInEditor = async (blog) => {
    try {
      // Fetch optimization data for this post
      const [optimizeResponse, scoresResponse] = await Promise.all([
        api.get(`/seo/optimize/${blog.postId}`),
        api.get(`/seo/competitor-scores/${blog.postId}`),
      ]);

      setSelectedBlogData({
        blogId: blog.id, // Include blog ID for updating
        postId: blog.postId,
        content: blog.content,
        targetKeyword: blog.title,
        optimizationGuide: optimizeResponse.data?.optimization_guide || null,
        competitorScores: scoresResponse.data?.scores || null,
      });
      setShowContentEditor(true);
    } catch (err) {
      console.error("Error fetching blog data:", err);
      // Still open editor with available data even if API fails
      setSelectedBlogData({
        blogId: blog.id, // Include blog ID for updating
        postId: blog.postId,
        content: blog.content,
        targetKeyword: blog.title,
        optimizationGuide: null,
        competitorScores: null,
      });
      setShowContentEditor(true);
    }
  };

  const handleEditPostInEditor = async (post) => {
    try {
      // Fetch optimization data for this post
      const [optimizeResponse, scoresResponse] = await Promise.all([
        api.get(`/seo/optimize/${post.id}`),
        api.get(`/seo/competitor-scores/${post.id}`),
      ]);

      setSelectedBlogData({
        postId: post.id,
        content: "", // No content yet for past keywords
        targetKeyword: post.keyword,
        optimizationGuide: optimizeResponse.data?.optimization_guide || null,
        competitorScores: scoresResponse.data?.scores || null,
      });
      setShowContentEditor(true);
    } catch (err) {
      console.error("Error fetching post data:", err);
      // Still open editor with available data even if API fails
      setSelectedBlogData({
        postId: post.id,
        content: "",
        targetKeyword: post.keyword,
        optimizationGuide: null,
        competitorScores: null,
      });
      setShowContentEditor(true);
    }
  };

  if (showCompetitorArticles) {
    return (
      <CompetitorArticles
        onBack={handleBackFromCompetitor}
        searchParams={searchParams}
      />
    );
  }

  if (showContentEditor && selectedBlogData) {
    return (
      <ContentEditor
        onBack={() => {
          setShowContentEditor(false);
          setSelectedBlogData(null);
          fetchSavedBlogs(); // Refresh saved blogs after editing
        }}
        selectedArticles={[]}
        optimizationGuide={selectedBlogData.optimizationGuide}
        competitorScores={selectedBlogData.competitorScores}
        targetKeyword={selectedBlogData.targetKeyword}
        postId={selectedBlogData.postId}
        initialContent={selectedBlogData.content}
        blogId={selectedBlogData.blogId}
      />
    );
  }

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className=" px-8 pt-8">
        {/* Header */}
        <div className="mb-8 bg-white p-5 rounded-[2rem]">
          <h1 className="text-4xl font-normal text-gray-900">
            Blog & Content Engine
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setActiveTab("research")}
            className={`rounded-full px-5 py-1.5 text-sm shadow-sm ${
              activeTab === "research"
                ? "bg-gray-900 text-white"
                : "border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            Content Research Tool
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`rounded-full px-5 py-1 text-sm shadow-sm ${
              activeTab === "saved"
                ? "bg-gray-900 text-white"
                : "border-2 border-gray-800 bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            Saved Blogs
          </button>
        </div>

        {/* Main Grid - Content Research Tool */}
        {activeTab === "research" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left Column - Past Keywords */}
            <div className="bg-[#FBFBFF] px-3 py-2 h-[calc(100vh-32vh)] overflow-y-auto scrollbar-hide">
              <h2 className="mb-2 text-[1.3rem] font-semibold text-gray-900">
                Past Keywords Searched
              </h2>

              <div className="space-y-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading past keywords...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                      onClick={fetchPastKeywords}
                      className="text-blue-600 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : pastKeywords.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">No past keywords found</p>
                  </div>
                ) : (
                  pastKeywords.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 hover:bg-[#efeffc] px-5"
                    >
                      <div className="flex-1">
                        <p className="text-[1.3rem] font-semibold text-gray-900">
                          {item.keyword}
                        </p>
                        <p className="text-md text-gray-900">
                          Searched on {item.searchedOn}
                        </p>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-center">
                          <p className="text-sm text-gray-900 font-semibold">
                            Volume
                          </p>
                          <p className="text-md text-gray-900">{item.volume}</p>
                        </div>

                        <button
                          onClick={() => handleEditPostInEditor(item)}
                          className="flex items-center gap-1.5 text-md duration-200 hover:bg-black hover:text-white py-2 px-3 rounded-full"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit in editor
                        </button>

                        <button
                          onClick={() => handleDeletePost(item.id)}
                          className="text-gray-800 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white px-4 py-2">
              <h2 className="mb-4 text-[1.3rem] font-semibold text-gray-900">
                Get results for any keywords
              </h2>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-md text-gray-900">
                    I would like to rank/create content for{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Keyword"
                    value={searchParams.keyword}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, keyword: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-md text-gray-900">
                    Search Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={searchParams.location}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-white"
                  >
                    <option value="">-- Select Location --</option>
                    {searchLocations.map((locations) => (
                      <option key={locations.id} value={locations.value}>
                        {locations.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-md text-gray-900">
                    Search Lang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={searchParams.language}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, language: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-white"
                  >
                    <option value="">-- Select Language --</option>
                    {searchLanguages.map((language) => (
                      <option key={language.id} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-full bg-blue-600 py-3 text-md text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Saved Blogs View */}
        {activeTab === "saved" && (
          <div className="bg-[#FBFBFF] px-3 py-2 h-[calc(100vh-32vh)] overflow-y-auto scrollbar-hide">
            <h2 className="mb-2 text-[1.3rem] font-semibold text-gray-900">
              Saved Blogs
            </h2>

            <div className="space-y-0">
              {savedBlogsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Loading saved blogs...</p>
                </div>
              ) : savedBlogs.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">No saved blogs found</p>
                </div>
              ) : (
                savedBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between py-3 hover:bg-[#efeffc] px-5"
                  >
                    <div className="flex-1">
                      <p className="text-[1.3rem] font-semibold text-gray-900">
                        {blog.title}
                      </p>
                      <p className="text-md text-gray-900">
                        Saved on {blog.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-sm text-gray-900 font-semibold">
                          Status
                        </p>
                        <p className="text-md text-gray-900 capitalize">{blog.status}</p>
                      </div>

                      <button
                        onClick={() => handleOpenBlogInEditor(blog)}
                        className="flex items-center gap-1.5 text-md duration-200 hover:bg-black hover:text-white py-2 px-3 rounded-full"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Open in editor
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-gray-800 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
