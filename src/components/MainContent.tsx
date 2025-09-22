import React from 'react';
import { Calendar, Trophy, Target, Plus, Trash2, User } from 'lucide-react';
import { calculateAge, toBuddhistYear, isPersonAliveInYear, getCurrentYear, formatCurrency } from '../utils/ageCalculations';

interface Friend {
  id: number;
  name: string;
  birthDate: string;
  color: string;
}

interface Achievement {
  id: number;
  title: string;
  year: number;
  category: string;
  icon: string;
}

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  category: string;
  icon: string;
}

interface NewFriend {
  name: string;
  birthDate: string;
}

interface MainContentProps {
  timelineYears: number[];
  currentYear: number;
  birthDate: string;
  friends: Friend[];
  achievements: Achievement[];
  goals: Goal[];
  showAddFriend: boolean;
  newFriend: NewFriend;
  setShowAddFriend: (show: boolean) => void;
  setNewFriend: (friend: NewFriend) => void;
  addFriend: () => void;
  removeFriend: (id: number) => void;
  handleTimelineDotClick: (year: number, personData: any, personType: string) => void;
  setShowAddAchievementModal: (show: boolean) => void;
  removeAchievement: (id: number) => void;
  setShowAddGoalModal: (show: boolean) => void;
  removeGoal: (id: number) => void;
  timelineDotSize: number;
  increaseTimelineDotSize: () => void;
  decreaseTimelineDotSize: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  timelineYears,
  currentYear,
  birthDate,
  friends,
  achievements,
  goals,
  showAddFriend,
  newFriend,
  setShowAddFriend,
  setNewFriend,
  addFriend,
  removeFriend,
  handleTimelineDotClick,
  setShowAddAchievementModal,
  removeAchievement,
  setShowAddGoalModal,
  removeGoal,
  timelineDotSize,
  increaseTimelineDotSize,
  decreaseTimelineDotSize
}) => {
  
  // Calculate sizes based on timelineDotSize
  const getSizeClasses = () => {
    switch(timelineDotSize) {
      case 1: // Small
        return {
          userSize: 'w-8 h-8',
          friendSize: 'w-6 h-6',
          userIcon: 'w-4 h-4',
          friendIcon: 'w-3 h-3',
          spacing: '60px',
          lineOffset: 'top-8 left-8 w-11',
          fontSize: 'text-xs'
        };
      case 2: // Medium (current)
        return {
          userSize: 'w-12 h-12',
          friendSize: 'w-10 h-10',
          userIcon: 'w-6 h-6',
          friendIcon: 'w-4 h-4',
          spacing: '80px',
          lineOffset: 'top-10 left-10 w-16',
          fontSize: 'text-sm'
        };
      case 3: // Large
        return {
          userSize: 'w-20 h-20',
          friendSize: 'w-16 h-16',
          userIcon: 'w-8 h-8',
          friendIcon: 'w-6 h-6',
          spacing: '100px',
          lineOffset: 'top-12 left-12 w-20',
          fontSize: 'text-base'
        };
      case 4: // Extra Large
        return {
          userSize: 'w-28 h-28',
          friendSize: 'w-24 h-24',
          userIcon: 'w-12 h-12',
          friendIcon: 'w-8 h-8',
          spacing: '140px',
          lineOffset: 'top-16 left-16 w-28',
          fontSize: 'text-lg'
        };
      default:
        return {
          userSize: 'w-24 h-24',
          friendSize: 'w-20 h-20',
          userIcon: 'w-10 h-10',
          friendIcon: 'w-8 h-8',
          spacing: '120px',
          lineOffset: 'top-12 left-12 w-24',
          fontSize: 'text-lg'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  return (
    <div className="space-y-6">
      {/* Timeline - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Calendar className="mr-2 text-blue-500" />
            Timeline ชีวิต
          </h2>
          
          {/* Timeline Size Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">ขนาดจุด:</span>
            <button
              onClick={decreaseTimelineDotSize}
              disabled={timelineDotSize === 1}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-200 ${
                timelineDotSize === 1 
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-95 shadow-md'
              }`}
              title="ลดขนาดจุด timeline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4].map((size) => (
                <div
                  key={size}
                  className={`rounded-full transition-all duration-200 ${
                    timelineDotSize === size
                      ? 'bg-blue-500 shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{
                    width: `${4 + size * 2}px`,
                    height: `${4 + size * 2}px`
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={increaseTimelineDotSize}
              disabled={timelineDotSize === 4}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-200 ${
                timelineDotSize === 4 
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-green-500 hover:bg-green-600 hover:scale-110 active:scale-95 shadow-md'
              }`}
              title="เพิ่มขนาดจุด timeline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Friends Timeline */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">เพื่อนในชีวิต</h3>
            <button
              onClick={() => setShowAddFriend(true)}
              className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              เพิ่มเพื่อน
            </button>
          </div>
          
          {showAddFriend && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="ชื่อเพื่อน"
                  value={newFriend.name}
                  onChange={(e) => setNewFriend({...newFriend, name: e.target.value})}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  value={newFriend.birthDate}
                  onChange={(e) => setNewFriend({...newFriend, birthDate: e.target.value})}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={addFriend} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                  เพิ่ม
                </button>
                <button onClick={() => setShowAddFriend(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors">
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-white shadow-sm hover:shadow-md transition-all duration-200 group"
                style={{ backgroundColor: friend.color }}
              >
                <span className="mr-2">{friend.name}</span>
                <span className="text-xs opacity-75">
                  {calculateAge(friend.birthDate)}ปี
                </span>
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                  title="ลบเพื่อน"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div id="age-timeline" className="relative">
          {timelineYears.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              กรุณากรอกวันเกิดเพื่อแสดง Timeline
            </div>
          ) : (
            <>
              {/* Horizontal Timeline */}
              <div className="relative overflow-x-auto pb-4">
                <div className="flex" style={{ minWidth: `${timelineYears.length * parseInt(sizeClasses.spacing)}px` }}>
                  {timelineYears.map((year, index) => {
                    const buddhistYear = toBuddhistYear(year);
                    const isCurrentYearForUser = year === currentYear;
                    const userAge = birthDate ? year - new Date(birthDate).getFullYear() : 0;
                    
                    return (
                      <div key={year} id={`year-${year}`} className="flex flex-col items-center relative" style={{ minWidth: sizeClasses.spacing }}>
                        {/* Background line */}
                        {index < timelineYears.length - 1 && (
                          <div className={`absolute ${sizeClasses.lineOffset} h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full shadow-sm`}></div>
                        )}
                        
                        {/* Main user dot */}
                        <div className="mb-4">
                          <div 
                            className={`${sizeClasses.userSize} rounded-xl flex items-center justify-center text-white font-bold ${sizeClasses.fontSize} transition-all duration-300 transform-gpu perspective-1000 ${
                              isPersonAliveInYear(birthDate, year) && year <= currentYear
                                ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 shadow-2xl hover:scale-110 cursor-pointer shadow-blue-500/30' 
                                : isPersonAliveInYear(birthDate, year) && year === currentYear + 1
                                  ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 shadow-xl cursor-pointer shadow-blue-400/20' 
                                  : 'bg-gradient-to-br from-gray-300 to-gray-400 opacity-50 shadow-md'
                            } ${isCurrentYearForUser ? 'ring-4 ring-white shadow-2xl shadow-blue-600/40 animate-pulse' : ''}`}
                            style={{
                              boxShadow: isPersonAliveInYear(birthDate, year) && year <= currentYear
                                ? '0 12px 30px rgba(59, 130, 246, 0.4), inset 0 4px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.2)'
                                : isPersonAliveInYear(birthDate, year) && year === currentYear + 1
                                  ? '0 8px 20px rgba(59, 130, 246, 0.2), inset 0 4px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.2)'
                                  : '0 4px 12px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.2)'
                            }}
                            onClick={() => {
                              const isClickable = isPersonAliveInYear(birthDate, year) && year <= currentYear + 1;
                              if (isClickable) {
                                handleTimelineDotClick(year, { name: 'คุณ', birthDate, color: '#3B82F6' }, 'user');
                              }
                            }}>
                            {isCurrentYearForUser ? (
                              <User className={sizeClasses.userIcon} />
                            ) : (
                              userAge >= 0 && userAge <= 99 ? userAge : ''
                            )}
                          </div>
                        </div>

                        {/* Friends dots */}
                        {friends.map((friend) => {
                          const friendCurrentYear = getCurrentYear(friend.birthDate);
                          const isAlive = isPersonAliveInYear(friend.birthDate, year);
                          const isLived = isAlive && year <= friendCurrentYear;
                          const isCurrent = year === friendCurrentYear;
                          const friendAge = friend.birthDate ? year - new Date(friend.birthDate).getFullYear() : 0;
                          
                          return (
                            <div key={friend.id} className="mb-3">
                              <div 
                                className={`${sizeClasses.friendSize} rounded-xl flex items-center justify-center text-white font-bold ${sizeClasses.fontSize} transition-all duration-300 transform-gpu perspective-1000 ${
                                  isLived 
                                    ? 'shadow-xl hover:scale-110 cursor-pointer shadow-black/20' 
                                    : 'opacity-50 shadow-sm'
                                } ${isCurrent ? 'ring-3 ring-white shadow-2xl animate-pulse' : ''}`}
                                style={{ 
                                  background: isLived 
                                    ? `linear-gradient(135deg, ${friend.color}, ${friend.color}dd, ${friend.color}bb)` 
                                    : 'linear-gradient(135deg, #e5e7eb, #d1d5db, #9ca3af)',
                                  boxShadow: isLived 
                                    ? `0 8px 20px ${friend.color}30, inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
                                    : '0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
                                }}
                                onClick={() => {
                                  if (isLived) {
                                    handleTimelineDotClick(year, friend, 'friend');
                                  }
                                }}>
                                {isCurrent ? (
                                  <User className={sizeClasses.friendIcon} />
                                ) : (
                                  friendAge >= 0 && friendAge <= 99 ? friendAge : ''
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Year label at bottom */}
                        {year % 5 === 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                            <div>พ.ศ. {buddhistYear}</div>
                            <div>ค.ศ. {year}</div>
                          </div>
                        )}
                        
                        {/* Current year indicator */}
                        {isCurrentYearForUser && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">
                            ปัจจุบัน
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Bottom panels - Achievements and Goals side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <Trophy className="mr-2 text-yellow-500" />
              ความสำเร็จที่ผ่านมา
            </h2>
            
            {/* Add button for achievements */}
            <button
              onClick={() => setShowAddAchievementModal(true)}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
              title="เพิ่มความสำเร็จ"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <span className="text-2xl mr-3">{achievement.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ปี {achievement.year}</p>
                </div>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="ลบความสำเร็จ"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right - Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <Target className="mr-2 text-red-500" />
              เป้าหมายในอนาคต
            </h2>
            
            <div className="flex items-center space-x-2">
              {/* Add button for goals */}
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
                title="เพิ่มเป้าหมาย"
              >
                <Plus className="w-4 h-4" />
              </button>

            </div>
          </div>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{goal.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)} บาท
                    </p>
                  </div>
                </div>
                {/* Glass Water Visualization */}
                <div className="relative w-full h-32 mb-4">
                  <div className="relative mx-auto w-20 h-24 flex flex-col items-center">
                    {/* Glass Container */}
                    <div className="relative w-16 h-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-b-lg border-2 border-gray-300 dark:border-gray-500 overflow-hidden shadow-lg">
                      {/* Water Level */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t transition-all duration-1000 ease-out rounded-b-lg"
                        style={{ 
                          height: `${Math.min(progress, 100)}%`,
                          background: progress >= 100 
                            ? 'linear-gradient(to top, #10b981, #34d399, #6ee7b7)' // Green when complete
                            : progress >= 75 
                            ? 'linear-gradient(to top, #3b82f6, #60a5fa, #93c5fd)' // Blue when almost there
                            : progress >= 50
                            ? 'linear-gradient(to top, #0ea5e9, #38bdf8, #7dd3fc)' // Light blue at halfway
                            : progress >= 25
                            ? 'linear-gradient(to top, #06b6d4, #22d3ee, #67e8f9)' // Cyan when started
                            : 'linear-gradient(to top, #a855f7, #c084fc, #d8b4fe)' // Purple when just starting
                        }}
                      >
                        {/* Water surface animation */}
                        <div 
                          className="absolute top-0 left-0 right-0 h-1 opacity-50"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                            animation: 'waterShimmer 2s ease-in-out infinite'
                          }}
                        ></div>
                        
                        {/* Bubbles effect */}
                        {progress > 0 && (
                          <>
                            <div 
                              className="absolute w-1 h-1 bg-white/60 rounded-full animate-bounce"
                              style={{ 
                                left: '20%', 
                                bottom: '30%',
                                animationDelay: '0s',
                                animationDuration: '1.5s'
                              }}
                            ></div>
                            <div 
                              className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-bounce"
                              style={{ 
                                left: '70%', 
                                bottom: '60%',
                                animationDelay: '0.5s',
                                animationDuration: '2s'
                              }}
                            ></div>
                            <div 
                              className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-bounce"
                              style={{ 
                                left: '50%', 
                                bottom: '10%',
                                animationDelay: '1s',
                                animationDuration: '1.8s'
                              }}
                            ></div>
                          </>
                        )}
                      </div>
                      
                      {/* Glass measurement lines */}
                      {[25, 50, 75].map((milestone) => (
                        <div
                          key={milestone}
                          className={`absolute left-0 right-0 h-px transition-colors duration-300 ${
                            progress >= milestone 
                              ? 'bg-white/40' 
                              : 'bg-gray-400/30 dark:bg-gray-500/40'
                          }`}
                          style={{ bottom: `${milestone}%` }}
                        >
                          {/* Measurement label */}
                          <div className={`absolute -right-8 -top-2 text-xs font-medium transition-colors duration-300 ${
                            progress >= milestone 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {milestone}%
                          </div>
                        </div>
                      ))}
                      
                      {/* Glass shine effect */}
                      <div className="absolute top-2 left-1 w-1 h-8 bg-white/20 rounded-full"></div>
                      <div className="absolute top-1 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
                    </div>
                    
                    {/* Glass base */}
                    <div className="w-18 h-1 bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700 rounded-full -mt-1"></div>
                    
                    {/* Achievement effects */}
                    {progress >= 100 && (
                      <>
                        {/* Success sparkles around the glass */}
                        <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce">✨</div>
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" style={{animationDelay: '0.3s'}}>✨</div>
                        <div className="absolute top-1/2 -left-4 text-yellow-400 animate-bounce" style={{animationDelay: '0.6s'}}>🌟</div>
                        <div className="absolute top-1/2 -right-4 text-yellow-400 animate-bounce" style={{animationDelay: '0.9s'}}>🌟</div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce" style={{animationDelay: '1.2s'}}>🎉</div>
                      </>
                    )}
                  </div>
                  
                  {/* Progress percentage below */}
                  <div className="text-center mt-2">
                    <div className={`text-lg font-bold transition-colors duration-300 ${
                      progress >= 100 
                        ? 'text-green-600 dark:text-green-400' 
                        : progress >= 75 
                        ? 'text-blue-600 dark:text-blue-400'
                        : progress >= 50
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : progress >= 25
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {progress.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {progress >= 100 ? '💧 เต็มแก้วแล้ว!' : 
                       progress >= 75 ? '🚰 ใกล้เต็มแล้ว!' :
                       progress >= 50 ? '💧 ครึ่งแก้วแล้ว!' :
                       progress >= 25 ? '💦 เริ่มมีน้ำแล้ว!' :
                       '🥛 เริ่มเทน้ำ!'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{progress.toFixed(1)}% สำเร็จ</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${progress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {progress >= 100 ? '🎉 สำเร็จแล้ว!' : `เหลืออีก ${formatCurrency(goal.target - goal.current)} บาท`}
                    </span>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="ลบเป้าหมาย"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MainContent;