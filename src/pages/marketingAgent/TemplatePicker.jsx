import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";

const templates = [
  { id: "general", title: "General", description: "General purpose layouts for common presentation elements", preview: "Product Overview" },
  { id: "modern", title: "Modern", description: "Modern white and blue business pitch deck layouts with clean, professional design", preview: "Pitch Deck" },
  { id: "standard", title: "Standard", description: "Standard layouts for presentations", preview: "Insights At A Glance" },
  { id: "swift", title: "Swift", description: "Swift layouts for presentations", preview: "Our Infographic" },
];

const TemplatePicker = ({ onBack, onGenerate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Pick your template</h1>
        </div>
        <button
          onClick={() => selectedTemplate && onGenerate(selectedTemplate)}
          disabled={!selectedTemplate}
          className={`px-6 py-2.5 rounded-full font-medium transition-colors ${
            selectedTemplate ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Generate presentation
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 ${
              selectedTemplate === template.id ? "border-indigo-500 shadow-lg" : "border-transparent hover:shadow-md"
            }`}
          >
            {/* Radio Button */}
            <div className="mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTemplate === template.id ? "border-indigo-600" : "border-gray-300"
              }`}>
                {selectedTemplate === template.id && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4 aspect-[4/3] flex items-center justify-center">
              <div className="bg-white rounded shadow-sm p-3 w-full">
                <p className="text-xs font-semibold text-gray-900">{template.preview}</p>
                {template.id === "modern" && <div className="text-indigo-600 font-semibold text-lg mt-2">Pitch Deck</div>}
                {template.id === "swift" && (
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="w-6 h-6 bg-indigo-100 rounded-full" />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatePicker;