'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  setShowAddActivityModal: (show: boolean) => void;
}

export default function FloatingActionButton({ setShowAddActivityModal }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={() => setShowAddActivityModal(true)}
        className="group relative w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden border-2 border-white/20"
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 scale-0 group-hover:scale-100 transition-transform duration-500 animate-pulse"></div>
        
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-active:scale-110 transition-transform duration-150"></div>
        
        {/* Plus icon with animation */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <Plus className="w-10 h-10 font-bold stroke-[3] transform transition-transform duration-300 group-hover:rotate-90 drop-shadow-lg" />
        </div>
        
        {/* Multi-layer glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-500/40 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        เพิ่มกิจกรรม
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-black/80 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
      </div>
    </div>
  );
}