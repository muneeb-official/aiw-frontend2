import React from "react";
import { X } from "lucide-react";

// Meeting Cheatsheet Modal
export const MeetingCheatsheetModal = ({ isOpen, onClose, meeting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F8F9FC] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Meeting Cheatsheet</h2>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Meeting</span> <span className="italic">Introduction Call</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time</span> <span className="italic">12:30 PM, Sunday 12/01/26</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Attendees</span>
                  <span className="text-gray-700">2</span>
                  <span className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</span>
                  <span className="text-gray-700">Jhon Doe,</span>
                  <span className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</span>
                  <span className="text-gray-700">David Cook</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendees Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Conversation Starters & Topics of Intrest</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>But also the leap into electronic typesetting, remaining essentially unchanged.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>It was popularised in the 1960s with the release of Letraset sheets containing.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></li>
            </ul>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notable Connections</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>But also the leap into electronic typesetting, remaining essentially unchanged.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>It was popularised in the 1960s with the release of Letraset sheets containing.</span></li>
              <li className="flex items-start gap-2 text-gray-700"><span className="mt-1.5">•</span><span>Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></li>
            </ul>
          </div>

          <div className="bg-[#ECEEF5] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Preparation Points for Organisers</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingCheatsheetModal;