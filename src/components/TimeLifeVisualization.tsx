'use client';

import React from 'react';
import { User } from 'lucide-react';

interface TimeLifeVisualizationProps {
  birthDate: string;
  currentAge: number;
  secondsLeft: number;
  currentTime: Date | null;
  isClient: boolean;
  focusCurrentAge: boolean;
  setFocusCurrentAge: (focus: boolean) => void;
  setShowTodoModal: (show: boolean) => void;
}

const TimeLifeVisualization: React.FC<TimeLifeVisualizationProps> = ({
  birthDate,
  currentAge,
  secondsLeft,
  currentTime,
  isClient,
  focusCurrentAge,
  setFocusCurrentAge,
  setShowTodoModal
}) => {
  if (!birthDate) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      {/* Clock Dialog */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center space-x-8">
          {/* Countdown Timer */}
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-600/50 rounded-lg p-4 mb-2">
              <div className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">
                {isClient ? secondsLeft.toLocaleString() : '0'}
              </div>
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                วินาทีเหลือ
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <div>⏳ วันนี้</div>
              <div className="text-xs opacity-75">/86,400 วิ</div>
            </div>
            
            {/* Progress bar for day */}
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                style={{ 
                  width: isClient ? `${((86400 - secondsLeft) / 86400) * 100}%` : '0%'
                }}
              ></div>
            </div>
          </div>

          {/* Central Clock with Ripples */}
          <div className="relative inline-block">
            {/* Animated Clock */}
            <div className="relative w-20 h-20 mx-auto mb-4">
            {/* Clock Face */}
            <div className="w-20 h-20 border-4 border-gray-400 rounded-full bg-white relative shadow-inner">
              {/* Roman numerals */}
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">
                XII
              </div>
              <div className="absolute top-1/2 right-0.5 transform -translate-y-1/2 text-xs font-bold text-gray-800">
                III
              </div>
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">
                VI
              </div>
              <div className="absolute top-1/2 left-0.5 transform -translate-y-1/2 text-xs font-bold text-gray-800">
                IX
              </div>
              
              {/* Hour markers for other positions */}
              <div className="absolute top-1.5 right-3 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute top-3 right-1.5 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-3 right-1.5 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1.5 right-3 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1.5 left-3 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-3 left-1.5 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute top-3 left-1.5 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute top-1.5 left-3 w-1 h-1 bg-gray-400 rounded-full"></div>
              
              {/* Clock hands - showing actual current time */}
              {isClient && currentTime && (() => {
                const hours = currentTime.getHours() % 12;
                const minutes = currentTime.getMinutes();
                const seconds = currentTime.getSeconds();
                
                // Calculate angles (0 degrees = 12 o'clock)
                const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute adjustment
                const minuteAngle = minutes * 6; // 6 degrees per minute
                const secondAngle = seconds * 6; // 6 degrees per second
                
                return (
                  <>
                    {/* Hour hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 origin-bottom w-0.5 h-4 bg-black transform -translate-x-1/2 transition-transform duration-300 ease-in-out"
                      style={{ 
                        transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
                        transformOrigin: 'bottom center'
                      }}
                    ></div>
                    {/* Minute hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 origin-bottom w-0.5 h-6 bg-gray-800 transform -translate-x-1/2 transition-transform duration-300 ease-in-out"
                      style={{ 
                        transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
                        transformOrigin: 'bottom center'
                      }}
                    ></div>
                    {/* Second hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 origin-bottom w-0.5 h-7 bg-red-500 transform -translate-x-1/2 transition-transform duration-75 ease-linear"
                      style={{ 
                        transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
                        transformOrigin: 'bottom center'
                      }}
                    ></div>
                  </>
                );
              })()}
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-white rounded-full shadow-sm"></div>
            </div>
            
            {/* Time ripples */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border border-blue-400 opacity-30 animate-pulse"></div>
          </div>

          {/* Speech bubble */}
          <div className="relative">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg inline-block relative shadow-lg">
              <div className="text-sm font-medium">
                "เวลาเดินไปเรื่อยๆ..."
              </div>
              <div className="text-xs mt-1 opacity-80">
                🕐 ชีวิตก็เปลี่ยนไปทุกวัน
              </div>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-100 dark:border-t-blue-900/50"></div>
              </div>
            </div>
          </div>

          </div>

          {/* Todo List Icon */}
          <div className="relative">
            <button
              onClick={() => setShowTodoModal(true)}
              className="group relative p-2 hover:scale-110 transform transition-all duration-300 active:scale-95"
              title="Todo List - สิ่งที่ต้องทำ"
            >
              {/* Stacked Paper Effect */}
              <div className="relative">
                {/* Bottom paper (shadow) */}
                <div className="absolute -bottom-1 -right-1 w-12 h-14 bg-gray-300 dark:bg-gray-600 rounded-lg transform rotate-2 opacity-50"></div>
                {/* Middle paper */}
                <div className="absolute -bottom-0.5 -right-0.5 w-12 h-14 bg-gray-200 dark:bg-gray-500 rounded-lg transform rotate-1 opacity-75"></div>
                {/* Top paper (main) */}
                <div className="relative w-12 h-14 bg-white dark:bg-gray-100 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-300 group-hover:shadow-xl transition-shadow duration-300">
                  {/* Paper lines */}
                  <div className="absolute top-3 left-2 right-2 space-y-1">
                    <div className="h-0.5 bg-blue-200 dark:bg-blue-300 rounded"></div>
                    <div className="h-0.5 bg-blue-200 dark:bg-blue-300 rounded"></div>
                    <div className="h-0.5 bg-blue-200 dark:bg-blue-300 rounded"></div>
                    <div className="h-0.5 bg-blue-200 dark:bg-blue-300 rounded"></div>
                  </div>
                  {/* Checkbox symbols */}
                  <div className="absolute top-3 left-1 space-y-1">
                    <div className="w-1.5 h-1.5 border border-green-500 rounded-sm bg-green-100"></div>
                    <div className="w-1.5 h-1.5 border border-gray-400 rounded-sm"></div>
                    <div className="w-1.5 h-1.5 border border-gray-400 rounded-sm"></div>
                    <div className="w-1.5 h-1.5 border border-red-400 rounded-sm"></div>
                  </div>
                  {/* Checkmark */}
                  <div className="absolute top-3.5 left-1.5 text-green-600 text-xs font-bold">✓</div>
                </div>
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </div>
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              📝 Todo
            </div>
          </div>
        </div>

        {/* Age progression message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            เวลาผ่านไป <span className="font-semibold text-blue-600 dark:text-blue-400">{currentAge} ปี</span> แล้ว<br/>
            <span className="text-xs opacity-75">
              ⏳ วันเวลาล่วงไป เราทำอะไรกันอยู่
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">ช่วงชีวิตของมนุษย์</h2>
      
      {/* Mac-like Dock for Life Stages */}
      <div className="flex justify-center items-end px-4 sm:px-8 py-8">
        <div 
          className="dock-container flex items-end justify-center gap-3 sm:gap-6 lg:gap-8 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl px-4 sm:px-6 lg:px-8 py-6 border border-white/30 dark:border-gray-600/30 shadow-lg overflow-visible"
          onMouseLeave={() => {
            // Reset all dock items when mouse leaves the dock, but keep current stage focused if focusCurrentAge is true
            document.querySelectorAll('.dock-item').forEach(item => {
              const isCurrentItem = item.querySelector('.current-stage-marker');
              if (isCurrentItem && focusCurrentAge) {
                item.style.transform = 'scale(1.4) translateY(-8px)';
              } else {
                item.style.transform = '';
              }
            });
          }}
        >
          {[
            { emoji: '👶', label: 'ทารก', ageRange: '0-2 ปี', minAge: 0, maxAge: 2, 
              bgClass: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-200/30 dark:to-pink-300/30', 
              borderClass: 'border-pink-300 dark:border-pink-400/50', 
              ringClass: 'ring-pink-400 dark:ring-pink-400/70',
              glowClass: 'bg-pink-400/30' },
            { emoji: '🧒', label: 'เด็ก', ageRange: '3-12 ปี', minAge: 3, maxAge: 12, 
              bgClass: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-200/30 dark:to-yellow-300/30', 
              borderClass: 'border-yellow-300 dark:border-yellow-400/50', 
              ringClass: 'ring-yellow-400 dark:ring-yellow-400/70',
              glowClass: 'bg-yellow-400/30' },
            { emoji: '🧑‍🎓', label: 'วัยรุ่น', ageRange: '13-19 ปี', minAge: 13, maxAge: 19, 
              bgClass: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-200/30 dark:to-purple-300/30', 
              borderClass: 'border-purple-300 dark:border-purple-400/50', 
              ringClass: 'ring-purple-400 dark:ring-purple-400/70',
              glowClass: 'bg-purple-400/30' },
            { emoji: '🧑‍💼', label: 'วัยหนุ่มสาว', ageRange: '20-35 ปี', minAge: 20, maxAge: 35, 
              bgClass: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200/30 dark:to-blue-300/30', 
              borderClass: 'border-blue-300 dark:border-blue-400/50', 
              ringClass: 'ring-blue-400 dark:ring-blue-400/70',
              glowClass: 'bg-blue-400/30' },
            { emoji: '🧑‍🏫', label: 'วัยกลางคน', ageRange: '36-55 ปี', minAge: 36, maxAge: 55, 
              bgClass: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-200/30 dark:to-green-300/30', 
              borderClass: 'border-green-300 dark:border-green-400/50', 
              ringClass: 'ring-green-400 dark:ring-green-400/70',
              glowClass: 'bg-green-400/30' },
            { emoji: '🧑‍💻', label: 'วัยก่อนเกษียณ', ageRange: '56-65 ปี', minAge: 56, maxAge: 65, 
              bgClass: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-200/30 dark:to-indigo-300/30', 
              borderClass: 'border-indigo-300 dark:border-indigo-400/50', 
              ringClass: 'ring-indigo-400 dark:ring-indigo-400/70',
              glowClass: 'bg-indigo-400/30' },
            { emoji: '🧓', label: 'วัยเกษียณ', ageRange: '66-80 ปี', minAge: 66, maxAge: 80, 
              bgClass: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-200/30 dark:to-orange-300/30', 
              borderClass: 'border-orange-300 dark:border-orange-400/50', 
              ringClass: 'ring-orange-400 dark:ring-orange-400/70',
              glowClass: 'bg-orange-400/30' },
            { emoji: '👴', label: 'สูงอายุ', ageRange: '81+ ปี', minAge: 81, maxAge: 999, 
              bgClass: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-200/30 dark:to-gray-300/30', 
              borderClass: 'border-gray-300 dark:border-gray-400/50', 
              ringClass: 'ring-gray-400 dark:ring-gray-400/70',
              glowClass: 'bg-gray-400/30' }
          ].map((stage, index) => {
            const isCurrentStage = currentAge >= stage.minAge && currentAge <= stage.maxAge;
            return (
              <div 
                key={index}
                className="relative group cursor-pointer dock-item"
                style={{ 
                  transformOrigin: 'bottom center',
                  transform: (isCurrentStage && focusCurrentAge) ? 'scale(1.4) translateY(-8px)' : '',
                  minWidth: '56px',
                  minHeight: '56px',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                onClick={() => {
                  // Toggle focus on current age
                  if (isCurrentStage) {
                    // If clicking current stage, toggle focus
                    setFocusCurrentAge(!focusCurrentAge);
                  } else {
                    // If clicking other stage, disable focus on current age
                    setFocusCurrentAge(false);
                  }
                  
                  // Reset all manual transforms immediately
                  document.querySelectorAll('.dock-item').forEach(item => {
                    item.style.transform = '';
                  });
                }}
                onMouseEnter={(e) => {
                  // Mac dock magnification effect - but current stage always stays largest
                  const allItems = document.querySelectorAll('.dock-item');
                  const currentIndex = Array.from(allItems).indexOf(e.currentTarget);
                  
                  allItems.forEach((item, i) => {
                    const distance = Math.abs(i - currentIndex);
                    const isCurrentItem = item.querySelector('.current-stage-marker');
                    let scale = 1;
                    let translateY = 0;
                    
                    if (isCurrentItem && focusCurrentAge) {
                      // Current stage stays largest only if focusCurrentAge is true
                      scale = Math.max(1.8, 1.4);
                      translateY = -20;
                    } else if (distance === 0) {
                      scale = 1.6;
                      translateY = -16;
                    } else if (distance === 1) {
                      scale = 1.3;
                      translateY = -8;
                    } else if (distance === 2) {
                      scale = 1.15;
                      translateY = -4;
                    }
                    
                    item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                    item.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  });
                }}
              >
                {/* Hidden marker for current stage identification */}
                {isCurrentStage && <div className="current-stage-marker hidden"></div>}
                
                {/* Icon with Mac dock effect and colors */}
                <div className={`
                  relative transition-all duration-200 ease-out
                  text-4xl flex items-center justify-center
                  w-12 h-12 rounded-xl
                  ${stage.bgClass}
                  ${isCurrentStage 
                    ? `shadow-xl ring-4 ${stage.ringClass} border-2 ${stage.borderClass}` 
                    : `opacity-70 hover:opacity-100 border ${stage.borderClass} hover:shadow-lg hover:ring-2 hover:${stage.ringClass}`
                  }
                `}>
                  <span className="relative z-10 filter drop-shadow-sm">
                    {stage.emoji}
                  </span>
                  
                  {/* Glow effect for current stage */}
                  {isCurrentStage && (
                    <div className={`absolute inset-0 rounded-xl blur-md animate-pulse ${stage.glowClass}`}></div>
                  )}
                  
                  {/* Reflection effect like Mac dock */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1/2 
                    rounded-b-xl opacity-20 
                    bg-gradient-to-t from-white/50 to-transparent
                    group-hover:opacity-40 transition-opacity duration-200
                  `}></div>
                </div>
                
                {/* Tooltip that appears on hover */}
                <div className={`
                  absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                  bg-black/80 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none z-20
                `}>
                  <div className="text-center">
                    <div className="font-medium">{stage.label}</div>
                    <div className="text-xs opacity-80">{stage.ageRange}</div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-black/80 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current age indicator */}
      {currentAge > 0 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              คุณอายุ {currentAge} ปี - 
              {currentAge <= 2 ? ' ช่วงทารก' :
               currentAge <= 12 ? ' ช่วงเด็ก' :
               currentAge <= 19 ? ' ช่วงวัยรุ่น' :
               currentAge <= 35 ? ' ช่วงวัยหนุ่มสาว' :
               currentAge <= 55 ? ' ช่วงวัยกลางคน' :
               currentAge <= 65 ? ' ช่วงวัยก่อนเกษียณ' :
               currentAge <= 80 ? ' ช่วงวัยเกษียณ' :
               ' ช่วงสูงอายุ'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeLifeVisualization;