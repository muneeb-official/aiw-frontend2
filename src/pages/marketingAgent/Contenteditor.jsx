import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import api from "../../services/api";

// Simple markdown to HTML converter
const markdownToHtml = (markdown) => {
  if (!markdown) return "";

  let html = markdown
    // Escape HTML entities first (but preserve markdown)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers (must be at start of line)
    .replace(/^######\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    // Unordered lists
    .replace(/^\s*[-*+]\s+(.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.+)$/gm, "<li>$1</li>")
    // Blockquotes
    .replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, "</p><p>")
    // Single line breaks
    .replace(/\n/g, "<br>");

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<li>)/g, "$1$2");
  html = html.replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>");

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<h") && !html.startsWith("<ul") && !html.startsWith("<blockquote")) {
    html = "<p>" + html + "</p>";
  }

  return html;
};

import {
  ChevronLeft,
  Bold,
  XIcon,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Info,
  Copy,
  Sparkles,
  ChevronDown,
  Plus,
} from "lucide-react";
// Mock data removed - using real API data only

const MenuBar = ({ editor }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="pt-5 bg-[#fcfcfc] pb-4">
      <div className="flex items-center justify-between">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              !editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Undo"
          >
            <Undo className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              !editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Redo"
          >
            <Redo className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors text-sm ${
              editor.isActive("paragraph") ? "bg-gray-200" : ""
            }`}
            title="Normal Text"
          >
            <Type className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("strike") ? "bg-gray-200" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("code") ? "bg-gray-200" : ""
            }`}
            title="Code"
          >
            <Code className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Quote & Code Block */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("codeBlock") ? "bg-gray-200" : ""
            }`}
            title="Code Block"
          >
            <Code className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Link*/}
        <div className="flex items-center gap-1">
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 ml-4">
          <button className="text-blue-600 hover:text-blue-700 border-2 py-1 px-2 rounded-full duration-100 transition-all hover:border-indigo-500 border-transparent font-medium text-sm whitespace-nowrap">
            Create FAQs
          </button>
          <button
            className="relative hover:bg-gray-100 rounded transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-3 h-3 text-indigo-500" />
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-sm p-3 rounded-lg shadow-lg z-10">
                Create an extended FAQ's with unused terms
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentEditor = ({
  onBack,
  selectedArticles,
  optimizationGuide,
  competitorScores,
  targetKeyword,
  postId,
  initialContent,
  blogId,
}) => {
  const [activeMainTab, setActiveMainTab] = useState("Terms");
  const [activeSubTab, setActiveSubTab] = useState("Keywords");
  const [activeOutlineTab, setActiveOutlineTab] = useState("Research");
  const [expandedCompetitors, setExpandedCompetitors] = useState({});
  const [expandedRelatedQuestions, setExpandedRelatedQuestions] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(!!initialContent);
  const [isCheckingScore, setIsCheckingScore] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [contentScore, setContentScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [, forceUpdate] = useState({});

  // Extract data from optimizationGuide
  const contentTarget = {
    wordCount: optimizationGuide?.target_word_count || 0,
    range: optimizationGuide?.word_count_range
      ? `${optimizationGuide.word_count_range.min} - ${optimizationGuide.word_count_range.max}`
      : "N/A",
    fleschReading: optimizationGuide?.target_readability?.flesch_reading_ease || "N/A",
    fleschReadingLabel: "Flesch Reading",
    gradeLevel1: optimizationGuide?.target_readability?.grade_level || "N/A",
    gradeLevel2: optimizationGuide?.target_readability?.smog_index || "N/A",
    contentScore: 0,
  };

  // Extract headings - can be objects {text, count} or strings
  const headings = (optimizationGuide?.recommended_headings || []).map((heading) =>
    typeof heading === "object" ? heading.text : heading
  );

  // Extract topics - objects {topic, total_frequency}
  const topics = (optimizationGuide?.important_topics || []).map((item) => ({
    word: typeof item === "object" ? item.topic : item,
    count: typeof item === "object" ? item.total_frequency : 1,
  }));

  // Extract key entities - objects {text, type, total_mentions} or strings
  const keyEntities = (optimizationGuide?.key_entities || []).map((entity) =>
    typeof entity === "object" ? entity.text : entity
  );

  // Questions to answer - can be strings directly
  const questionsToAnswer = optimizationGuide?.questions_to_answer || [];

  // TF-IDF keywords - can be objects or strings
  const tfIdfKeywords = (optimizationGuide?.tfidf_keywords || []).map((keyword) => ({
    word: typeof keyword === "object" ? keyword.word || keyword.keyword : keyword,
    score: typeof keyword === "object" ? keyword.score?.toFixed(2) : (Math.random() * 0.5 + 0.5).toFixed(2),
  }));

  // Build competitor articles from scores
  const competitorArticles = Object.entries(competitorScores || {}).map(([url, score], index) => ({
    title: url.split("/").pop() || `Competitor ${index + 1}`,
    url,
    score: score !== null ? Math.round(score) : "N/A",
    wordCount: "N/A",
    readability: "N/A",
    topics: [],
    keyEntities: [],
    headingsCount: 0,
  }));

  const handleCheckScore = async () => {
    if (!isGenerated || !editor) {
      // If content is not generated, show popup immediately
      setShowScorePopup(true);
      return;
    }

    if (!postId) {
      console.error("No post ID available");
      return;
    }

    // Get the content from the editor
    const editorContent = editor.getHTML();

    // Check if content is too short (minimum 100 characters required)
    if (editorContent.length < 100) {
      setShowScorePopup(true);
      return;
    }

    // If content is generated, call the score API
    setIsCheckingScore(true);

    try {
      const response = await api.post(`/seo/score/${postId}`, {
        content: editorContent,
      });
      console.log("Score response:", response.data);

      if (response.data?.status === "success") {
        setContentScore(response.data.score?.total_score || response.data.score);
      }
    } catch (err) {
      console.error("Error fetching score:", err);
    } finally {
      setIsCheckingScore(false);
    }
  };

  const toggleCompetitor = (index, section) => {
    setExpandedCompetitors((prev) => ({
      ...prev,
      [`${index}-${section}`]: !prev[`${index}-${section}`],
    }));
  };

  const toggleRelatedQuestion = (index) => {
    setExpandedRelatedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleGenerateArticle = async () => {
    if (!postId) {
      console.error("No post ID available");
      return;
    }

    setIsGenerating(true);

    try {
      // Build template from headings
      const headingsSections = headings.length > 0
        ? headings.map((h, i) => `${i + 1}) ${h}`).join(", ")
        : "";

      const template = `Write a comprehensive SEO-optimized article about ${targetKeyword || "the topic"}. ${headingsSections ? `Include sections: ${headingsSections}.` : ""} Target ${optimizationGuide?.target_word_count || 2000} words.`;

      // Build custom instructions from topics, entities, and questions
      const topicsList = topics.length > 0
        ? `Use the important topics: ${topics.map(t => t.word).join(", ")}.`
        : "";

      const entitiesList = keyEntities.length > 0
        ? `Mention key entities: ${keyEntities.join(", ")}.`
        : "";

      const questionsList = questionsToAnswer.length > 0
        ? `Answer these questions: ${questionsToAnswer.join(" ")}`
        : "";

      const builtCustomInstructions = [topicsList, entitiesList, questionsList, customInstructions]
        .filter(Boolean)
        .join(" ");

      const response = await api.post(`/seo/generate-article/${postId}`, {
        template: template,
        custom_instructions: builtCustomInstructions,
        target_word_count: optimizationGuide?.target_word_count || 2000,
        model: "gpt-4-turbo-preview",
        temperature: 0.7,
      });

      console.log("Generate article response:", response.data);

      if (response.data?.status === "success" && editor) {
        // Convert markdown to HTML and set in editor
        const htmlContent = markdownToHtml(response.data.article || "");
        editor.commands.setContent(htmlContent);
      }

      setIsGenerated(true);
      // Switch to Terms tab and Keywords subtab
      setActiveMainTab("Terms");
      setActiveSubTab("Keywords");
    } catch (err) {
      console.error("Error generating article:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!editor || !postId) {
      console.error("Editor or post ID not available");
      return;
    }

    const editorContent = editor.getHTML();
    if (!editorContent || editorContent === "<p></p>") {
      alert("Please add some content before saving");
      return;
    }

    setIsSaving(true);

    try {
      // Extract keywords from topics
      const keywordsList = topics.map((t) => t.word);

      let response;
      if (blogId) {
        // Update existing blog with PUT
        response = await api.put(`/seo/blogs/${blogId}`, {
          title: targetKeyword || "Untitled Blog",
          content: editorContent,
          meta_description: "",
          keywords: keywordsList,
          status: "draft",
        });
        console.log("Update blog response:", response.data);
        alert("Blog updated successfully!");
      } else {
        // Create new blog with POST
        response = await api.post("/seo/blogs", {
          title: targetKeyword || "Untitled Blog",
          content: editorContent,
          post_id: postId,
          meta_description: "",
          keywords: keywordsList,
          status: "draft",
        });
        console.log("Save blog response:", response.data);
        alert("Blog saved successfully!");
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
          newGroupDelay: 500,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent || "<p>Start writing your content here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-6",
      },
    },
    onUpdate: () => {
      forceUpdate({});
    },
  });

  // Helper function to determine text color based on percentage
  const getTextColorByPercentage = (current, total) => {
    if (current === 0) {
      return "text-gray-500";
    }

    const percentage = (current / total) * 100;

    if (percentage >= 80) {
      return "text-green-600";
    } else if (percentage >= 60) {
      return "text-blue-600";
    } else if (percentage >= 30) {
      return "text-yellow-600";
    } else {
      return "text-red-500";
    }
  };

  // Helper function to determine background color based on percentage
  const getBgColorByPercentage = (current, total) => {
    if (current === 0) {
      return "bg-gray-50";
    }

    const percentage = (current / total) * 100;

    if (percentage >= 80) {
      return "bg-green-50";
    } else if (percentage >= 60) {
      return "bg-blue-50";
    } else if (percentage >= 30) {
      return "bg-yellow-50";
    } else {
      return "bg-red-50";
    }
  };

  // Use topics as top keywords with usage tracking (current starts at 0, total from API)
  const displayTopKeywords = topics.map((topic) => ({
    word: topic.word,
    current: 0, // Will be updated when content is analyzed
    total: topic.count,
  }));

  // Use TF-IDF keywords for the usage section
  const displayUsedTfIdfKeywords = tfIdfKeywords.map((kw) => ({
    word: kw.word,
    usage: "Used 0x", // Will be updated when content is analyzed
  }));

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
    >
      <div className="flex gap-3 px-6 pt-6 pb-3">
        {/* Editor Header */}
        <div className="flex bg-white rounded-3xl px-4 py-5 items-end justify-between w-[60%]">
          <div>
            <button
              onClick={onBack}
              className="mb-10 flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-4xl text-gray-900 mb-2">Content Editor</h1>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">
                Keyword: {targetKeyword || "N/A"}
              </span>
            </p>
          </div>
          <button
            onClick={handleSaveBlog}
            disabled={isSaving}
            className="px-5 py-1.5 bg-indigo-600 text-white rounded-full transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSaving ? "Saving..." : blogId ? "Update Blog" : "Save Blog"}
          </button>
        </div>
        {/* Content Target + Content Score (Single Row) */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex items-stretch gap-6 w-[40%]">
          {/* Content Target */}
          <div className="flex-1">
            <h3 className="text-md font-bold text-gray-900 mb-4">
              Content target
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {contentTarget.wordCount}
                </div>
                <div className="text-xs text-gray-600">
                  {contentTarget.range}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {contentTarget.gradeLevel1}
                </div>
                <div className="text-xs text-gray-600">Grade Level:</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {contentTarget.fleschReading}
                </div>
                <div className="text-xs text-gray-600">
                  {contentTarget.fleschReadingLabel}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {contentTarget.gradeLevel2}
                </div>
                <div className="text-xs text-gray-600">Grade Level:</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-200" />

          {/* Content Score */}
          <div className="w-[200px] flex flex-col justify-end">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md text-gray-900">Your Content Score</h3>
            </div>

            {isCheckingScore ? (
              // Loading state - Show three dots animation
              <div className="flex items-center gap-1 py-2">
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            ) : contentScore !== null ? (
              // Score fetched - Show score
              <div className="text-3xl font-bold text-indigo-500 leading-none">
                {contentScore}
                <span className="text-lg font-normal ml-1">scores</span>
              </div>
            ) : (
              // No score yet - Show Check Score button
              <button
                onClick={handleCheckScore}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm border-2 border-white w-28 rounded-full hover:border-indigo-400 px-2 py-1"
              >
                Check Score
              </button>
            )}
          </div>
        </div>

        {/* Popup Modal for "No Content Generated" */}
        {showScorePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-red-500">
                  <XIcon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  We cannot score the content.
                </h3>
                <p className="text-gray-600 mb-6">
                  You cannot check score without any content
                </p>
                <button
                  onClick={() => {
                    setShowScorePopup(false);
                    setActiveMainTab("AI Writing");
                  }}
                  className="flex-1 px-10 py-2 bg-indigo-600 text-white rounded-full font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1800px] px-6">
        <div className="flex gap-1">
          {/* Left Side - Editor */}
          <div className="flex-[0.65] rounded-lg shadow-sm pl-8 pr-2">
            <div className="bg-white p-3 rounded-lg">
              {/* Editor Toolbar */}
              <MenuBar editor={editor} />

              {/* Editor Content */}
              <div className="min-h-[600px] max-h-[45vh] overflow-y-scroll bg-[#fcfcfc] relative">
                <EditorContent editor={editor} />

                {/* Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-900">
                        Generating your article...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Statistics and Tools */}
          <div className="w-[720px] space-y-3">
            {/* Main Tabs Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-y-scroll h-[92vh]">
              {/* Main Tab Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveMainTab("Terms")}
                  className={`px-4 py-1.5 rounded-full transition-colors font-medium ${
                    activeMainTab === "Terms"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border-2 border-gray-900"
                  }`}
                >
                  Terms
                </button>
                <button
                  onClick={() => setActiveMainTab("Outline")}
                  className={`px-4 py-1.5 rounded-full transition-colors font-medium ${
                    activeMainTab === "Outline"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border-2 border-gray-900"
                  }`}
                >
                  Outline
                </button>
                <button
                  onClick={() => setActiveMainTab("AI Writing")}
                  className={`px-4 py-1.5 rounded-full transition-colors font-medium ${
                    activeMainTab === "AI Writing"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border-2 border-gray-900"
                  }`}
                >
                  AI Writing
                </button>
              </div>

              {/* Terms Content */}
              {activeMainTab === "Terms" && (
                <>
                  {/* Sub Tabs */}
                  <div className="flex gap-6 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setActiveSubTab("Keywords")}
                      className={`pb-3 font-bold transition-colors relative ${
                        activeSubTab === "Keywords"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Keywords
                      {activeSubTab === "Keywords" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveSubTab("Topics")}
                      className={`pb-3 font-bold transition-colors relative ${
                        activeSubTab === "Topics"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Topics
                      {activeSubTab === "Topics" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveSubTab("Headings")}
                      className={`pb-3 font-bold transition-colors relative ${
                        activeSubTab === "Headings"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Headings
                      {activeSubTab === "Headings" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                  </div>

                  {/* Keywords Tab Content */}
                  {activeSubTab === "Keywords" && (
                    <div className="space-y-6">
                      {/* Terms (Top Keywords) Section */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Terms (Top Keywords)
                        </h3>

                        <div className="grid grid-cols-3 gap-2">
                          {(displayTopKeywords || []).map((item, index) => (
                            <div
                              key={index}
                              className={`${getBgColorByPercentage(item?.current || 0, item?.total || 1)} px-2 py-1.5 rounded-full flex items-center justify-between`}
                            >
                              <div
                                className={`text-sm font-semibold ${getTextColorByPercentage(item?.current || 0, item?.total || 1)}`}
                              >
                                {item?.word || ""}
                              </div>
                              <div
                                className={`text-xs font-medium bg-white p-0.5 rounded-full ${getTextColorByPercentage(item?.current || 0, item?.total || 1)}`}
                              >
                                {item?.current || 0} / {item?.total || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TF-IDF Keywords with Usage */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          TF-IDF Keywords
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          These are statistically important terms across
                          top-ranking content
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {(displayUsedTfIdfKeywords || []).map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-4 py-1.5 rounded-full"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {item?.word || ""}
                                </span>
                                <span className="text-xs text-blue-600 font-semibold bg-white py-0.5 px-1 rounded-full">
                                  {item?.usage || ""}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TF-IDF Keywords with Scores */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          TF-IDF Keywords
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Statistically important terms across competitors
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          {(tfIdfKeywords || []).map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-4 py-1.5 rounded-full"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium text-sm">
                                  {item?.word || ""}
                                </span>
                                <span className="text-xs text-gray-600 font-medium bg-white p-0.5 rounded-full">
                                  Score: {item?.score || 0}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Topics Tab Content */}
                  {activeSubTab === "Topics" && (
                    <div className="space-y-6">
                      {/* Important Topics to Cover */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Important Topics to Cover
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          {(topics || []).map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-4 py-1.5 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900 font-medium text-sm">
                                  {item?.word || ""}
                                </span>
                                <span className="text-sm text-gray-900 font-semibold bg-white p-1 rounded-full">
                                  {item?.count || 0}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {topics.length === 0 && (
                          <p className="text-gray-500 text-sm">No topics available</p>
                        )}
                      </div>

                      {/* Key Entities to Mention */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Key Entities to Mention
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          {(keyEntities || []).map((entity, index) => (
                            <div
                              key={index}
                              className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              {entity}
                            </div>
                          ))}
                        </div>
                        {keyEntities.length === 0 && (
                          <p className="text-gray-500 text-sm">No key entities available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Headings Tab Content */}
                  {activeSubTab === "Headings" && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Headings from Competitors
                      </h3>

                      <div className="space-y-2.5">
                        {(headings || []).map((heading, index) => (
                          <div
                            key={index}
                            className="px-3.5 py-2.5 bg-gray-100 rounded-sm text-gray-900 text-sm font-medium"
                          >
                            {heading}
                          </div>
                        ))}
                      </div>
                      {headings.length === 0 && (
                        <p className="text-gray-500 text-sm">No headings available</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Outline Content - Keep existing code */}
              {activeMainTab === "Outline" && (
                <>
                  {/* Outline Sub Tabs */}
                  <div className="flex gap-6 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setActiveOutlineTab("Research")}
                      className={`pb-3 font-semibold transition-colors relative ${
                        activeOutlineTab === "Research"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Research
                      {activeOutlineTab === "Research" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOutlineTab("Questions")}
                      className={`pb-3 font-semibold transition-colors relative ${
                        activeOutlineTab === "Questions"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Questions
                      {activeOutlineTab === "Questions" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveOutlineTab("Competitors")}
                      className={`pb-3 font-semibold transition-colors relative ${
                        activeOutlineTab === "Competitors"
                          ? "text-indigo-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Competitors
                      {activeOutlineTab === "Competitors" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                      )}
                    </button>
                  </div>

                  {/* Research Tab Content */}
                  {activeOutlineTab === "Research" && (
                    <div className="space-y-6">
                      {/* Important Topics as Suggestions */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Important Topics
                        </h3>
                        <div className="space-y-2">
                          {topics.length > 0 ? (
                            topics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                              >
                                <span className="text-gray-900 text-sm font-medium">
                                  {topic.word}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Frequency: {topic.count}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No topics available</p>
                          )}
                        </div>
                      </div>

                      {/* Key Entities */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Key Entities to Mention
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {keyEntities.length > 0 ? (
                            keyEntities.map((entity, index) => (
                              <div
                                key={index}
                                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-indigo-100"
                              >
                                {entity}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No entities available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions Tab Content */}
                  {activeOutlineTab === "Questions" && (
                    <div className="space-y-6">
                      {/* Questions to Answer */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Questions to Answer
                        </h3>
                        <div className="space-y-3">
                          {(questionsToAnswer || []).map((question, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between py-3 px-4 bg-gray-50 rounded-lg"
                            >
                              <span className="text-gray-900 font-medium text-sm flex-1 pr-4">
                                {question}
                              </span>
                              <button className="flex items-center gap-1.5 text-gray-900 text-sm font-medium whitespace-nowrap hover:text-gray-700 transition-colors">
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                        {questionsToAnswer.length === 0 && (
                          <p className="text-gray-500 text-sm">No questions available</p>
                        )}
                      </div>

                      {/* Recommended Headings */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Recommended Headings
                        </h3>
                        <div className="space-y-2">
                          {headings.length > 0 ? (
                            headings.map((heading, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                              >
                                <span className="text-gray-900 text-sm font-medium capitalize">
                                  {heading}
                                </span>
                                <button className="flex items-center gap-1.5 text-gray-900 text-sm font-medium whitespace-nowrap hover:text-gray-700 transition-colors">
                                  <Plus className="w-4 h-4" />
                                  Add
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No headings available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Competitors Tab Content */}
                  {activeOutlineTab === "Competitors" && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          Competitor Reference
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Average words:{" "}
                          <span className="font-semibold">
                            {optimizationGuide?.target_word_count || "N/A"}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-4">
                        {(competitorArticles || []).map((article, index) => (
                          <div key={index} className="overflow-hidden">
                            {/* Article Header */}
                            <div className="p-4 bg-white">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-bold text-gray-900 flex-1 pr-4">
                                  {article?.title || "Untitled"}
                                </h4>
                                <span className="text-sm font-semibold bg-purple-100 py-[0.1rem] px-3 rounded-full text-purple-600 whitespace-nowrap">
                                  Score{" "}
                                  <span className="text-lg font-bold">
                                    {article?.score || "N/A"}
                                  </span>
                                </span>
                              </div>
                              <a
                                href={article?.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-md text-indigo-400 font-semibold underline block mb-3"
                              >
                                {article?.url || "N/A"}
                              </a>
                              <hr className="py-2" />
                              <div className="flex items-center gap-6 text-xs text-gray-900 mb-3">
                                <div>
                                  <span className="font-semibold">Words</span>
                                  <div className="font-bold text-base">
                                    {article?.wordCount || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Readability
                                  </span>
                                  <div className="font-bold text-base">
                                    {article?.readability || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <hr className="py-2" />

                              {/* Topics */}
                              <div className="mb-3">
                                <div className="text-xs font-semibold text-gray-700 mb-2">
                                  Topics
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(article?.topics || []).map((topic, topicIndex) => (
                                    <span
                                      key={topicIndex}
                                      className="bg-indigo-50 text-indigo-400 px-2 py-1 rounded-full text-xs font-medium"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Key Entities */}
                              <div>
                                <div className="text-xs font-semibold text-gray-700 mb-2">
                                  Key Entities:
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(article?.keyEntities || []).map(
                                    (entity, entityIndex) => (
                                      <span
                                        key={entityIndex}
                                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                                      >
                                        {entity}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expandable Sections */}
                            <div className="space-y-2">
                              {/* 17 Headings */}
                              <button
                                onClick={() =>
                                  toggleCompetitor(index, "headings")
                                }
                                className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                              >
                                <span className="text-sm font-semibold text-gray-900">
                                  {article.headingsCount} Headings
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-600 transition-transform ${
                                    expandedCompetitors[`${index}-headings`]
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                              {expandedCompetitors[`${index}-headings`] && (
                                <div className="p-3 bg-white text-sm text-gray-600">
                                  Headings content would go here...
                                </div>
                              )}

                              {/* Top Keywords */}
                              <button
                                onClick={() =>
                                  toggleCompetitor(index, "keywords")
                                }
                                className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                              >
                                <span className="text-sm font-semibold text-gray-900">
                                  Top Keywords
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-600 transition-transform ${
                                    expandedCompetitors[`${index}-keywords`]
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                              {expandedCompetitors[`${index}-keywords`] && (
                                <div className="p-3 text-sm text-gray-600">
                                  Keywords content would go here...
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {competitorArticles.length === 0 && (
                          <p className="text-gray-500 text-sm">No competitor data available</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* AI Writing Content */}
              {activeMainTab === "AI Writing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Generate content to our A.I.
                    </h3>
                    <p className="text-md text-gray-600 mb-6">
                      Our AI will create a blog ensure generating best content
                      with best SEO Practices.
                    </p>

                    <button
                      onClick={handleGenerateArticle}
                      disabled={isGenerating}
                      className="w-60 bg-purple-950 hover:bg-purple-900 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles
                        className={`w-5 h-5 ${isGenerating ? "animate-pulse" : ""}`}
                      />
                      {isGenerating
                        ? "Generating..."
                        : "Generate Article with AI"}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-md text-gray-900 mb-3">
                      You can add more things you want in your content
                    </h3>

                    <textarea
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent resize-none"
                      placeholder="You can paste text here..."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                    />
                  </div>

                  <button className="px-6 py-2.5 bg-white text-blue-600 border-2 hover:border-blue-600 border-white rounded-full font-semibold transition-colors text-sm">
                    Generate Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Tiptap */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 600px;
          padding: 1.5rem;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.875rem;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ContentEditor;
