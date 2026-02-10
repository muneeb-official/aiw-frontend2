import React from "react";
import {
  Undo, Redo, Bold, Italic, Underline, Strikethrough, Code,
  List, ListOrdered, Link, Image, Quote, Minus, Sparkles, ChevronDown,
} from "lucide-react";

const SlideEditorToolbar = () => {
  return (
    <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-lg bg-white shadow-sm">
      <button className="p-1.5 hover:bg-gray-100 rounded"><Undo size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Redo size={14} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <div className="relative">
        <button className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded">
          Normal text <ChevronDown size={12} />
        </button>
      </div>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button className="p-1.5 hover:bg-gray-100 rounded">
        <div className="w-4 h-4 bg-gray-900 rounded" />
      </button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Underline size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Strikethrough size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Code size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Sparkles size={14} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      
      <button className="p-1.5 hover:bg-gray-100 rounded"><List size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><ListOrdered size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Link size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Image size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Code size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Quote size={14} /></button>
      <button className="p-1.5 hover:bg-gray-100 rounded"><Minus size={14} /></button>
    </div>
  );
};

export default SlideEditorToolbar;