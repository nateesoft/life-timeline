'use client';

import React from 'react';

interface Emotion {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface EmotionModalProps {
  showEmotionModal: boolean;
  emotions: Emotion[];
  handleEmotionSelect: (emotion: Emotion) => void;
}

export default function EmotionModal({ showEmotionModal, emotions, handleEmotionSelect }: EmotionModalProps) {
  if (!showEmotionModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-scale-up"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 text-center">
          <div className="text-4xl mb-3">💭</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">วันนี้คุณรู้สึกอย่างไร?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">เลือกอารมณ์ที่ตรงกับความรู้สึกของคุณในวันนี้</p>
        </div>

        {/* Emotion Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion)}
                className="group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  '--hover-color': emotion.color,
                } as React.CSSProperties}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:animate-bounce">{emotion.icon}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:font-semibold transition-all duration-200">
                    {emotion.name}
                  </div>
                </div>
                
                {/* Hover effect */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: emotion.color }}
                ></div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            การแชร์อารมณ์จะช่วยให้คุณติดตามสุขภาพจิตของคุณได้ดีขึ้น
          </p>
        </div>
      </div>
    </div>
  );
}