import React, { useState } from "react";
import {
  ChevronLeft, Undo, Redo, Play, Sparkles, GripVertical, LayoutGrid,
  List, Trash2, Copy, X, Check, HelpCircle,
} from "lucide-react";
import { TemplateSuccessModal, AIPromptModal } from "../../components/modals/Modals";
import SlideEditorToolbar from "./SlideEditorToolbar";

const sampleSlides = [
  { id: 1, title: "Product Overview" },
  { id: 2, title: "Solutions" },
  { id: 3, title: "Problem" },
  { id: 4, title: "Market Size" },
  { id: 5, title: "Call to Action" },
];

const PresentationEditor = ({ onBack }) => {
  const [slides] = useState(sampleSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(2);
  const [viewMode, setViewMode] = useState("list");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [presentationName, setPresentationName] = useState("Pitch Deck");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
              <ChevronLeft size={20} /><span>Back</span>
            </button>
            <input
              type="text"
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Undo size={20} /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Redo size={20} /></button>
            <button className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800">
              <Play size={16} /> Present
            </button>
            <div className="relative">
              <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50">
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button onClick={() => setShowExportDropdown(false)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export as .ppxt</button>
                  <button onClick={() => setShowExportDropdown(false)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export as .pdf</button>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-5 py-2 bg-purple-900 text-white rounded-full font-medium hover:bg-purple-800">
              <Sparkles size={16} className="text-yellow-400" /> Regenerate
            </button>
            <button onClick={() => setShowSuccessModal(true)} className="px-5 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-52 bg-white border-r border-gray-200 p-4 min-h-[calc(100vh-64px)]">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}>
              <List size={18} />
            </button>
            <button className="ml-auto text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                onClick={() => setActiveSlideIndex(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${index === activeSlideIndex ? "bg-indigo-50" : "hover:bg-gray-50"}`}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{slide.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm min-h-[600px] relative p-8">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Copy size={18} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Trash2 size={18} /></button>
            </div>

            <button onClick={() => setShowAIPrompt(true)} className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center hover:bg-indigo-200 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </button>

            <h1 className="text-5xl font-bold text-gray-900 mb-8">{slides[activeSlideIndex].title}</h1>

            <div className="flex gap-8">
              <div className="w-1/2 relative">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                  {Array.from({ length: 48 }).map((_, i) => <div key={i} className="border border-gray-200" />)}
                </div>
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" alt="Slide" className="relative z-10 rounded-lg shadow-lg w-full" />
              </div>
              <div className="w-1/2">
                <p className="text-gray-700 mb-6">Pain hits the ICP: [role] in [industry] at [company size] orgs across [region]. Lost output and quality issues compound into real $ impact.</p>
                <div className="space-y-4">
                  {[
                    { icon: <Check className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-100", title: "Who Hurts", desc: "ICP: [role], [industry], [company size], [region]." },
                    { icon: <X className="w-5 h-5 text-purple-600" />, bg: "bg-purple-100", title: "Productivity & Costs", desc: "~[X-Y] h/emp/wk → ~$[A-B]/emp/yr; tools/consultants ~$[C]/yr." },
                    { icon: <div className="w-3 h-3 bg-purple-500 rotate-45" />, bg: "bg-purple-100", title: "Quality Impact", desc: "Error/defect rate: [E%]." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} flex-shrink-0`}>{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <div className="w-12 h-0.5 bg-yellow-500 my-1" />
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <SlideEditorToolbar />
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700">
        <HelpCircle size={24} />
      </button>

      <AIPromptModal isOpen={showAIPrompt} onClose={() => setShowAIPrompt(false)} onSubmit={(p) => console.log(p)} />
      <TemplateSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      {showExportDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowExportDropdown(false)} />}
    </div>
  );
};

export default PresentationEditor;