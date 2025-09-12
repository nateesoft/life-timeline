'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Trophy, Target, MapPin, Heart, Home, Car, DollarSign, Plus, Users, Edit2, Trash2, User } from 'lucide-react';

const LifeTimelineApp = () => {
  const [birthDate, setBirthDate] = useState('');
  const [currentAge, setCurrentAge] = useState(0);
  const [lifePercentage, setLifePercentage] = useState(0);
  const [maxAge, setMaxAge] = useState(80);
  
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
    { id: 3, title: 'เงินเก็บ 100 ล้าน', target: 10000000, current: 5500000, category: 'savings', icon: '💰' }
  ]);

  // State for friends
  const [friends, setFriends] = useState([
    { id: 1, name: 'สมชาย', birthDate: '1995-03-15', color: '#FF6B6B' },
    { id: 2, name: 'สมหญิง', birthDate: '1998-07-22', color: '#4ECDC4' }
  ]);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', birthDate: '', color: '#8B5CF6' });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Modal state
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedPersonData, setSelectedPersonData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showDailyView, setShowDailyView] = useState(false);
  const [focusCurrentAge, setFocusCurrentAge] = useState(true);

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

  const isPersonAliveInYear = (personBirthDate, year, personMaxAge = maxAge) => {
    if (!personBirthDate) return false;
    try {
      const birthYear = new Date(personBirthDate).getFullYear();
      const deathYear = birthYear + personMaxAge;
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
      const endYear = youngestBirthYear + maxAge;
      
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

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Countdown timer and current time update
  useEffect(() => {
    if (!isClient) return;
    
    const updateTimeAndCountdown = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Next midnight
      const millisecondsLeft = midnight - now;
      const secondsLeft = Math.floor(millisecondsLeft / 1000);
      setSecondsLeft(secondsLeft);
    };

    // Update immediately
    updateTimeAndCountdown();

    // Update every second
    const interval = setInterval(updateTimeAndCountdown, 1000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showCalendarModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCalendarModal]);

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

  // Handle timeline dot click
  const handleTimelineDotClick = (year, personData, personType) => {
    setSelectedYear(year);
    setSelectedPersonData({ ...personData, type: personType });
    setSelectedMonth(null);
    setShowDailyView(false);
    setShowCalendarModal(true);
  };

  // Handle month click
  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setShowDailyView(true);
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Generate days for selected month
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get timeline data with memoization
  const timelineYears = useMemo(() => getTimelineYears(), [birthDate, friends, maxAge]);
  const currentYear = new Date().getFullYear();

  // Auto scroll to current year
  useEffect(() => {
    if (birthDate && timelineYears.length > 0 && isClient) {
      setTimeout(() => {
        const timelineContainer = document.querySelector('#age-timeline .overflow-x-auto');
        const currentYearElement = document.getElementById(`year-${currentYear}`);
        if (timelineContainer && currentYearElement) {
          const elementLeft = currentYearElement.offsetLeft;
          const containerWidth = timelineContainer.clientWidth;
          const scrollPosition = elementLeft - containerWidth / 2 + currentYearElement.offsetWidth / 2;
          timelineContainer.scrollTo({ 
            left: Math.max(0, scrollPosition), 
            behavior: 'smooth' 
          });
        }
      }, 500); // เพิ่มเวลาให้มากขึ้นเพื่อให้ DOM โหลดเสร็จก่อน
    }
  }, [birthDate, currentYear, timelineYears.length, maxAge, friends, isClient]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 relative overflow-hidden">
      {/* Parallax Star Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Star Layer 1 - Slow moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar1 120s linear infinite' }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={`star1-${i}`}
              className="absolute text-white opacity-20 dark:opacity-40"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 100}%`,
                fontSize: `${((i * 13) % 20 + 10) / 10}px`,
                animation: `starTwinkle ${((i * 17) % 40 + 30) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 11) % 60) / 10}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>
        
        {/* Star Layer 2 - Medium moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar2 80s linear infinite' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`star2-${i}`}
              className="absolute text-blue-200 opacity-30 dark:opacity-50"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 29) % 100}%`,
                fontSize: `${((i * 19) % 30 + 15) / 10}px`,
                animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 7) % 40) / 10}s`
              }}
            >
              ⋆
            </div>
          ))}
        </div>
        
        {/* Star Layer 3 - Fast moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar3 40s linear infinite' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`star3-${i}`}
              className="absolute text-yellow-200 opacity-40 dark:opacity-60"
              style={{
                left: `${(i * 43) % 100}%`,
                top: `${(i * 31) % 100}%`,
                fontSize: `${((i * 21) % 20 + 20) / 10}px`,
                animation: `starTwinkle ${((i * 11) % 20 + 10) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 5) % 30) / 10}s`
              }}
            >
              ✧
            </div>
          ))}
        </div>
        
        {/* Distant nebula clouds */}
        <div className="absolute inset-0" style={{ animation: 'parallaxNebula 200s linear infinite' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full opacity-5 dark:opacity-10"
              style={{
                width: `${((i * 37) % 300 + 200)}px`,
                height: `${((i * 23) % 150 + 100)}px`,
                left: `${(i * 47) % 100}%`,
                top: `${(i * 29) % 100}%`,
                background: `radial-gradient(ellipse, rgba(${(i % 2 === 0) ? '147, 197, 253' : '196, 165, 255'}, 0.3) 0%, transparent 70%)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Milky Way Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Milky Way Galaxy */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 800px 200px at 30% 20%, 
                rgba(147, 197, 253, 0.3) 0%, 
                rgba(191, 219, 254, 0.2) 20%, 
                transparent 70%),
              radial-gradient(ellipse 600px 150px at 70% 80%, 
                rgba(196, 165, 255, 0.2) 0%, 
                rgba(221, 214, 254, 0.15) 30%, 
                transparent 70%),
              radial-gradient(ellipse 1000px 100px at 50% 50%, 
                rgba(253, 230, 138, 0.1) 0%, 
                rgba(254, 240, 138, 0.08) 40%, 
                transparent 80%)
            `,
            animation: 'milkyWayFlow 60s ease-in-out infinite'
          }}
        />
        
        {/* Floating Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-60"
              style={{
                left: `${(i * 39) % 100}%`,
                top: `${(i * 31) % 100}%`,
                fontSize: `${((i * 17) % 30 + 10) / 10}px`,
                animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 11) % 50) / 10}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* Moving Dust Clouds */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-5 dark:opacity-10"
              style={{
                width: `${((i * 29) % 200 + 100)}px`,
                height: `${((i * 19) % 100 + 50)}px`,
                left: `${(i * 41) % 100}%`,
                top: `${(i * 33) % 100}%`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                animation: `cloudDrift ${((i * 23) % 40 + 20)}s linear infinite`,
                animationDelay: `${((i * 7) % 100) / 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Add CSS for Milky Way animations */}
      <style jsx>{`
        @keyframes milkyWayFlow {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 0.1;
          }
          50% { 
            transform: rotate(2deg) scale(1.05);
            opacity: 0.15;
          }
        }
        @media (prefers-color-scheme: dark) {
          @keyframes milkyWayFlow {
            0%, 100% { 
              transform: rotate(0deg) scale(1);
              opacity: 0.2;
            }
            50% { 
              transform: rotate(2deg) scale(1.05);
              opacity: 0.25;
            }
          }
        }
        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes cloudDrift {
          0% { 
            transform: translateX(-100px) translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateX(calc(100vw + 100px)) translateY(-20px) rotate(90deg);
          }
          50% { 
            transform: translateX(calc(100vw + 200px)) translateY(20px) rotate(180deg);
          }
          75% { 
            transform: translateX(calc(100vw + 100px)) translateY(-10px) rotate(270deg);
          }
          100% { 
            transform: translateX(-100px) translateY(0px) rotate(360deg);
          }
        }
        @keyframes parallaxStar1 {
          0% { 
            transform: translateX(-100%) translateY(0%);
          }
          100% { 
            transform: translateX(calc(100vw + 100%)) translateY(-20%);
          }
        }
        @keyframes parallaxStar2 {
          0% { 
            transform: translateX(-100%) translateY(10%);
          }
          100% { 
            transform: translateX(calc(100vw + 100%)) translateY(-10%);
          }
        }
        @keyframes parallaxStar3 {
          0% { 
            transform: translateX(-100%) translateY(-5%);
          }
          100% { 
            transform: translateX(calc(100vw + 100%)) translateY(15%);
          }
        }
        @keyframes parallaxNebula {
          0% { 
            transform: translateX(-50%) translateY(0%) rotate(0deg);
          }
          100% { 
            transform: translateX(calc(100vw + 50%)) translateY(-5%) rotate(360deg);
          }
        }
        @keyframes rippleExpand {
          0% { 
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        @keyframes ripplePulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.3;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.1;
          }
        }
        @keyframes centralGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
        @keyframes particleFloat {
          0%, 100% { 
            opacity: 0.7;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-20px) scale(1);
          }
          50% { 
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-30px) scale(1.2);
          }
        }
        @keyframes moonRayExpand {
          0% { 
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.4;
          }
          50% {
            opacity: 0.2;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        @keyframes moonRayPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.25;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.15;
          }
        }
        @keyframes moonHaloGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.6;
          }
        }
        @keyframes moonbeamFloat {
          0%, 100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-25px) scale(1);
          }
          50% { 
            opacity: 0.9;
            transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-35px) scale(1.3);
          }
        }
        @keyframes waterShimmer {
          0%, 100% { 
            transform: translateX(-100%);
            opacity: 0;
          }
          50% { 
            transform: translateX(100%);
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Enhanced Sun/Moon with Large Circular Rays - Top Right */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="relative w-40 h-40">
          
          {/* Large circular rays - outermost */}
          {isClient && currentTime && Array.from({ length: 5 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`ray-large-${i}`}
                className="absolute rounded-full border opacity-20"
                style={{
                  width: `${(i + 3) * 50}px`,
                  height: `${(i + 3) * 50}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: isDaytime 
                    ? 'rgba(251, 191, 36, 0.4)' 
                    : 'rgba(191, 219, 254, 0.4)',
                  borderWidth: '1px',
                  animation: `moonRayExpand ${5 + i * 1}s ease-out infinite`,
                  animationDelay: `${i * 0.8}s`
                }}
              />
            );
          })}
          
          {/* Medium circular rays with gradient */}
          {isClient && currentTime && Array.from({ length: 4 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`ray-medium-${i}`}
                className="absolute rounded-full opacity-25"
                style={{
                  width: `${(i + 2) * 40}px`,
                  height: `${(i + 2) * 40}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isDaytime
                    ? `radial-gradient(circle, rgba(255, 237, 117, ${0.2 - i * 0.02}) 0%, rgba(251, 191, 36, ${0.15 - i * 0.02}) 40%, transparent 80%)`
                    : `radial-gradient(circle, rgba(219, 234, 254, ${0.15 - i * 0.02}) 0%, rgba(147, 197, 253, ${0.1 - i * 0.02}) 40%, transparent 80%)`,
                  animation: `moonRayPulse ${4 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            );
          })}
          
          {/* Inner sunlight/moonlight halos */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div 
                className="absolute rounded-full opacity-40"
                style={{
                  width: '80px',
                  height: '80px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isDaytime
                    ? 'radial-gradient(circle, rgba(255, 237, 117, 0.4) 0%, rgba(251, 191, 36, 0.3) 30%, rgba(245, 158, 11, 0.2) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(191, 219, 254, 0.3) 0%, rgba(219, 234, 254, 0.2) 30%, rgba(147, 197, 253, 0.1) 60%, transparent 100%)',
                  animation: 'moonHaloGlow 6s ease-in-out infinite'
                }}
              />
            );
          })()}
          
          {/* Sun/Moon body - enhanced size */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return isDaytime ? (
              /* Sun */
              <div 
                className="absolute w-12 h-12 bg-gradient-to-bl from-yellow-300 to-orange-400 rounded-full shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 25px rgba(251, 191, 36, 0.6), inset -1px -1px 2px rgba(180, 83, 9, 0.2)'
                }}
              >
                {/* Sun rays inside */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-100/60 rounded-full"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-yellow-100/40 rounded-full"></div>
                <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-yellow-100/50 rounded-full"></div>
                <div className="w-full h-full bg-gradient-to-tr from-yellow-100/50 via-transparent to-transparent rounded-full opacity-80"></div>
              </div>
            ) : (
              /* Moon */
              <div 
                className="absolute w-12 h-12 bg-gradient-to-bl from-blue-100 to-blue-200 rounded-full shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 20px rgba(191, 219, 254, 0.5), inset -2px -2px 4px rgba(100, 116, 139, 0.3)'
                }}
              >
                {/* Moon crescent shadow */}
                <div className="absolute top-1 right-1 w-8 h-8 bg-gray-300/40 rounded-full"></div>
                <div className="w-full h-full bg-gradient-to-tr from-blue-50 via-transparent to-transparent rounded-full opacity-80"></div>
              </div>
            );
          })()}
          
          {/* Floating sunbeam/moonbeam particles */}
          {isClient && currentTime && Array.from({ length: 12 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`beam-${i}`}
                className="absolute w-1 h-1 rounded-full opacity-60"
                style={{
                  background: isDaytime 
                    ? (i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#fed75b' : '#f59e0b')
                    : (i % 3 === 0 ? '#bfdbfe' : i % 3 === 1 ? '#dbeafe' : '#93c5fd'),
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${25 + i * 3}px)`,
                  animation: `moonbeamFloat ${3 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            );
          })}
          
          {/* Distant twinkling stars - only visible at night */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            // Only show stars at night
            if (isDaytime) return null;
            
            return Array.from({ length: 8 }, (_, i) => (
              <div 
                key={`twinkle-${i}`}
                className="absolute text-blue-200 opacity-70"
                style={{
                  fontSize: `${((i * 17) % 80 + 60) / 10}px`,
                  top: `${((i * 23) % 80 + 10)}%`,
                  left: `${((i * 29) % 80 + 10)}%`,
                  animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                  animationDelay: `${((i * 11) % 40) / 10}s`
                }}
              >
                {i % 4 === 0 ? '✦' : i % 4 === 1 ? '✧' : i % 4 === 2 ? '⋆' : '✩'}
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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

        {/* Time & Life Visualization */}
        {birthDate && (
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
        )}

        {/* Calendar Modal */}
        {showCalendarModal && selectedYear && selectedPersonData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      ปี {selectedYear} ({toBuddhistYear(selectedYear)})
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: selectedPersonData.color }}
                      ></span>
                      {selectedPersonData.name} - อายุ {selectedYear - new Date(selectedPersonData.birthDate).getFullYear()} ปี
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCalendarModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Calendar View */}
              <div className="p-6">
                {!showDailyView ? (
                  <div className="grid grid-cols-4 gap-4">
                    {/* Generate 12 months */}
                    {Array.from({ length: 12 }, (_, monthIndex) => {
                      const monthNames = [
                        'มค.', 'กพ.', 'มีค.', 'เมย.', 'พค.', 'มิย.',
                        'กค.', 'สค.', 'กย.', 'ตค.', 'พย.', 'ธค.'
                      ];
                      const currentMonth = new Date().getMonth();
                      const currentYearCheck = new Date().getFullYear();
                      const isCurrentMonth = selectedYear === currentYearCheck && monthIndex === currentMonth;

                      return (
                        <div
                          key={monthIndex}
                          onClick={() => handleMonthClick(monthIndex)}
                          className={`p-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                            isCurrentMonth 
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
                              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {monthNames[monthIndex]}
                          </div>
                          <div className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                            {monthIndex + 1}
                          </div>
                          {isCurrentMonth && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              ปัจจุบัน
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Daily View */
                  <div>
                    {/* Month header with navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowDailyView(false)}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 rounded"
                      >
                        ← กลับ
                      </button>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePreviousMonth}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                          title="เดือนก่อนหน้า"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white text-center min-w-[200px]">
                          {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][selectedMonth]} {selectedYear}
                        </h4>
                        
                        <button
                          onClick={handleNextMonth}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                          title="เดือนถัดไป"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="w-16"></div> {/* Spacer for balance */}
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 p-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(selectedYear, selectedMonth).map((day, index) => {
                        const currentDay = new Date().getDate();
                        const currentMonth = new Date().getMonth();
                        const currentYearCheck = new Date().getFullYear();
                        const isToday = selectedYear === currentYearCheck && 
                                       selectedMonth === currentMonth && 
                                       day === currentDay;
                        
                        return (
                          <div
                            key={index}
                            className={`p-2 text-center text-sm transition-all duration-200 ${
                              day 
                                ? isToday
                                  ? 'bg-blue-500 text-white rounded-full font-bold'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer text-gray-800 dark:text-gray-200'
                                : ''
                            }`}
                          >
                            {day || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Year Info */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">ข้อมูลปี {selectedYear}</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>📅 ปี พ.ศ. {toBuddhistYear(selectedYear)}</div>
                    <div>🎂 อายุ: {selectedYear - new Date(selectedPersonData.birthDate).getFullYear()} ปี</div>
                    <div>👤 {selectedPersonData.name}</div>
                    {selectedYear === currentYear && (
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        🏃‍♂️ ปีปัจจุบัน
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

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
                              <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
                                  isPersonAliveInYear(birthDate, year) && year <= currentYear
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transform hover:scale-110 cursor-pointer' 
                                    : isPersonAliveInYear(birthDate, year) && year === currentYear + 1
                                      ? 'bg-gradient-to-br from-blue-300 to-blue-400 shadow-md cursor-pointer' 
                                      : 'bg-gray-300 opacity-50'
                                } ${isCurrentYearForUser ? 'ring-2 ring-white shadow-xl' : ''}`}
                                onClick={() => {
                                  const isClickable = isPersonAliveInYear(birthDate, year) && year <= currentYear + 1;
                                  if (isClickable) {
                                    handleTimelineDotClick(year, { name: 'คุณ', birthDate, color: '#3B82F6' }, 'user');
                                  }
                                }}>
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
                                        ? 'shadow-md transform hover:scale-110 cursor-pointer' 
                                        : 'opacity-50'
                                    } ${isCurrent ? 'ring-2 ring-white shadow-lg' : ''}`}
                                    style={{ 
                                      background: isLived 
                                        ? `linear-gradient(135deg, ${friend.color}, ${friend.color}dd)` 
                                        : '#e5e7eb'
                                    }}
                                    onClick={() => {
                                      if (isLived) {
                                        handleTimelineDotClick(year, friend, 'friend');
                                      }
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