'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Target, MapPin, Heart, Home, Car, DollarSign, Plus, Users, Edit2, Trash2, User } from 'lucide-react';

const LifeTimelineApp = () => {
  const [birthDate, setBirthDate] = useState('');
  const [currentAge, setCurrentAge] = useState(0);
  const [lifePercentage, setLifePercentage] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  
  // State for achievements
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'จบการศึกษาระดับปริญญาตรี', year: 2020, category: 'education', icon: '🎓' },
    { id: 2, title: 'ได้งานแรก', year: 2021, category: 'career', icon: '💼' },
    { id: 3, title: 'เที่ยวญี่ปุ่น', year: 2022, category: 'travel', icon: '✈️' }
  ]);

  // State for goals
  const [goals, setGoals] = useState([
    { id: 1, title: 'ซื้อรถคันแรก', target: 1000000, current: 650000, category: 'asset', icon: '🚗' },
    { id: 2, title: 'ซื้อบ้าน', target: 5000000, current: 1200000, category: 'asset', icon: '🏠' },
    { id: 3, title: 'เงินเก็บ 100 ล้าน', target: 100000000, current: 2500000, category: 'savings', icon: '💰' }
  ]);

  // State for friends
  const [friends, setFriends] = useState([
    { id: 1, name: 'สมชาย', birthDate: '1995-03-15', color: '#FF6B6B' },
    { id: 2, name: 'สมหญิง', birthDate: '1998-07-22', color: '#4ECDC4' }
  ]);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', birthDate: '', color: '#8B5CF6' });

  // Utility functions
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return 0;
    try {
      const birth = new Date(birthDateStr);
      const today = new Date();
      const ageInMs = today - birth;
      return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    } catch (error) {
      return 0;
    }
  };

  const toBuddhistYear = (gregorianYear) => {
    return gregorianYear + 543;
  };

  const isPersonAliveInYear = (personBirthDate, year) => {
    if (!personBirthDate) return false;
    try {
      const birthYear = new Date(personBirthDate).getFullYear();
      const deathYear = birthYear + maxAge;
      return year >= birthYear && year <= deathYear;
    } catch (error) {
      return false;
    }
  };

  const getCurrentYear = (personBirthDate) => {
    if (!personBirthDate) return new Date().getFullYear();
    try {
      const birthYear = new Date(personBirthDate).getFullYear();
      const age = calculateAge(personBirthDate);
      return birthYear + age;
    } catch (error) {
      return new Date().getFullYear();
    }
  };

  const getTimelineYears = () => {
    if (!birthDate) return [];
    
    try {
      const allPeople = [
        { birthDate },
        ...friends.filter(f => f.birthDate).map(f => ({ birthDate: f.birthDate }))
      ];
      
      if (allPeople.length === 0) return [];
      
      const birthYears = allPeople.map(p => new Date(p.birthDate).getFullYear());
      const oldestBirthYear = Math.min(...birthYears);
      const youngestBirthYear = Math.max(...birthYears);
      
      const startYear = oldestBirthYear;
      const endYear = youngestBirthYear + 100;
      
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    } catch (error) {
      return [];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH').format(amount);
  };

  // Calculate age and life percentage
  useEffect(() => {
    if (birthDate) {
      const age = calculateAge(birthDate);
      setCurrentAge(age);
      setLifePercentage((age / maxAge) * 100);
    }
  }, [birthDate, maxAge]);

  // Friend management
  const addFriend = () => {
    if (newFriend.name && newFriend.birthDate) {
      setFriends([...friends, { ...newFriend, id: Date.now() }]);
      setNewFriend({ name: '', birthDate: '', color: '#8B5CF6' });
      setShowAddFriend(false);
    }
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  // Get timeline data
  const timelineYears = getTimelineYears();
  const currentYear = new Date().getFullYear();

  // Auto scroll to current year
  useEffect(() => {
    if (birthDate && timelineYears.length > 0) {
      setTimeout(() => {
        const timelineElement = document.getElementById('age-timeline');
        const currentYearElement = document.getElementById(`year-${currentYear}`);
        if (timelineElement && currentYearElement) {
          const elementTop = currentYearElement.offsetTop;
          const containerHeight = timelineElement.clientHeight;
          const scrollPosition = elementTop - containerHeight / 2;
          timelineElement.scrollTo({ top: Math.max(0, scrollPosition), behavior: 'smooth' });
        }
      }, 100);
    }
  }, [birthDate, currentYear, timelineYears.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Life Timeline</h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">วันเกิดของคุณ</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">อายุสูงสุด (ปี)</label>
                <input
                  type="number"
                  min="80"
                  max="120"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Math.min(120, Math.max(80, parseInt(e.target.value) || 100)))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {currentAge > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">อายุ {currentAge} ปี</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(lifePercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ใช้ชีวิตไปแล้ว {lifePercentage.toFixed(1)}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Timeline - Full Width */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Calendar className="mr-2 text-blue-500" />
              Timeline ชีวิต
            </h2>
            
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
                    <div className="flex" style={{ minWidth: `${timelineYears.length * 60}px` }}>
                      {timelineYears.map((year, index) => {
                        const buddhistYear = toBuddhistYear(year);
                        const isCurrentYearForUser = year === currentYear;
                        const userAge = birthDate ? year - new Date(birthDate).getFullYear() : 0;
                        
                        return (
                          <div key={year} id={`year-${year}`} className="flex flex-col items-center relative" style={{ minWidth: '60px' }}>
                            {/* Background line */}
                            {index < timelineYears.length - 1 && (
                              <div className="absolute top-8 left-8 w-11 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            )}
                            
                            {/* Main user dot */}
                            <div className="mb-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
                                isPersonAliveInYear(birthDate, year) && year <= currentYear
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-110' 
                                  : isPersonAliveInYear(birthDate, year) && year === currentYear + 1
                                    ? 'bg-gradient-to-br from-blue-300 to-blue-400 shadow-md' 
                                    : 'bg-gray-300 opacity-50'
                              } ${isCurrentYearForUser ? 'ring-2 ring-white shadow-xl' : ''}`}>
                                {isCurrentYearForUser ? (
                                  <User className="w-4 h-4" />
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
                                <div key={friend.id} className="mb-2">
                                  <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
                                      isLived 
                                        ? 'shadow-md transform hover:scale-110' 
                                        : 'opacity-50'
                                    } ${isCurrent ? 'ring-2 ring-white shadow-lg' : ''}`}
                                    style={{ 
                                      background: isLived 
                                        ? `linear-gradient(135deg, ${friend.color}, ${friend.color}dd)` 
                                        : '#e5e7eb'
                                    }}>
                                    {isCurrent ? (
                                      <User className="w-3 h-3" />
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <Trophy className="mr-2 text-yellow-500" />
                ความสำเร็จที่ผ่านมา
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ปี {achievement.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Target className="mr-2 text-red-500" />
              เป้าหมายในอนาคต
            </h2>
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
                    {/* Piggy Bank Visualization */}
                    <div className="relative w-full h-24 mb-4">
                      {/* Piggy Bank Container */}
                      <div className="relative mx-auto w-20 h-16 bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-200/20 dark:to-pink-300/20 border-2 border-pink-300 dark:border-pink-400/50 rounded-full overflow-hidden">
                        {/* Piggy Bank Body */}
                        <div className="absolute inset-0 rounded-full">
                          {/* Water/Money fill */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400 to-yellow-300 transition-all duration-1000 ease-out"
                            style={{ 
                              height: `${Math.min(progress, 100)}%`,
                              borderRadius: progress >= 100 ? '50%' : '0 0 50% 50%'
                            }}
                          >
                            {/* Money coins animation */}
                            {progress > 20 && (
                              <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-600 rounded-full opacity-60"></div>
                            )}
                            {progress > 40 && (
                              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-yellow-600 rounded-full opacity-60"></div>
                            )}
                            {progress > 60 && (
                              <div className="absolute bottom-3 left-3 w-2 h-2 bg-yellow-600 rounded-full opacity-60"></div>
                            )}
                            {progress > 80 && (
                              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-yellow-600 rounded-full opacity-60"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Piggy Bank Features */}
                        {/* Snout */}
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-3 bg-pink-200 dark:bg-pink-300/30 border border-pink-300 dark:border-pink-400/50 rounded-full">
                          <div className="absolute top-1 left-1 w-1 h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
                          <div className="absolute bottom-1 left-1 w-1 h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
                        </div>
                        
                        {/* Eyes */}
                        <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-pink-600 dark:bg-pink-400 rounded-full"></div>
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-pink-600 dark:bg-pink-400 rounded-full"></div>
                        
                        {/* Coin slot */}
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-pink-400 dark:bg-pink-500/50 rounded-full"></div>
                        
                        {/* Success sparkles when 100% */}
                        {progress >= 100 && (
                          <>
                            <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce">✨</div>
                            <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" style={{animationDelay: '0.2s'}}>✨</div>
                            <div className="absolute -bottom-1 -left-1 text-yellow-400 animate-bounce" style={{animationDelay: '0.4s'}}>✨</div>
                            <div className="absolute -bottom-1 -right-1 text-yellow-400 animate-bounce" style={{animationDelay: '0.6s'}}>✨</div>
                          </>
                        )}
                      </div>
                      
                      {/* Progress percentage below */}
                      <div className="text-center mt-2">
                        <div className={`text-lg font-bold ${
                          progress >= 100 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-pink-600 dark:text-pink-400'
                        }`}>
                          {progress.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{progress.toFixed(1)}% สำเร็จ</span>
                      <span className={`font-semibold ${progress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {progress >= 100 ? '🎉 สำเร็จแล้ว!' : `เหลืออีก ${formatCurrency(goal.target - goal.current)} บาท`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeTimelineApp;