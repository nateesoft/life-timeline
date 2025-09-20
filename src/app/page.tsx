'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, Download, Upload } from 'lucide-react';
import GlobalStyles from '../components/GlobalStyles';
import SunMoonComponent from '../components/SunMoonComponent';
import TodoModal from '../components/TodoModal';
import EmotionModal from '../components/EmotionModal';
import FloatingActionButton from '../components/FloatingActionButton';
import AddActivityModal from '../components/AddActivityModal';
import ActivityPostIts from '../components/ActivityPostIts';
import FriendMessagePostIts from '../components/FriendMessagePostIts';
import AddAchievementModal from '../components/AddAchievementModal';
import AddGoalModal from '../components/AddGoalModal';
import FileImportModal from '../components/FileImportModal';
import FileExportModal from '../components/FileExportModal';
import MainContent from '../components/MainContent';
import TimeLifeVisualization from '../components/TimeLifeVisualization';
import { DataManager } from '../utils/dataManager';
import { AppData } from '../types';
import { 
  calculateAge, 
  calculateDetailedAge, 
  getTimelineYears
} from '../utils/ageCalculations';

interface Activity {
  id: number;
  name: string;
  description: string;
  displayType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color: string;
  backgroundColor: string;
  position: { x: number; y: number };
  createdAt: string;
}

interface FriendMessage {
  id: number;
  message: string;
  fromName: string;
  fromAvatar: string;
  position: { x: number; y: number };
  createdAt: string;
}

const LifeTimelineApp = () => {
  const [birthDate, setBirthDate] = useState('');
  const [currentAge, setCurrentAge] = useState(0);
  const [detailedAge, setDetailedAge] = useState<{ years: number; months: number; days: number; hours: number; minutes: number; seconds: number } | null>(null);
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
  
  // Emotion modal state
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  
  // Todo modal state
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todos, setTodos] = useState({
    today: [],
    tomorrow: [],
    upcoming: [],
    monthly: []
  });

  // States for activity features
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    displayType: 'daily' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    color: '#3B82F6',
    backgroundColor: '#FEF3C7',
    position: { x: 100, y: 100 }
  });
  const [draggedActivity, setDraggedActivity] = useState<number | null>(null);
  const [draggedMessage, setDraggedMessage] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Friend messages state
  const [friendMessages, setFriendMessages] = useState<FriendMessage[]>([]);

  // Modal states for achievements and goals
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  
  // Import/Export modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: 'education',
    icon: '🎓'
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    current: 0,
    category: 'asset',
    icon: '💰'
  });


  // Calculate age and life percentage
  useEffect(() => {
    if (birthDate) {
      const age = calculateAge(birthDate);
      setCurrentAge(age);
      setLifePercentage((age / maxAge) * 100);
      
      const detailed = calculateDetailedAge(birthDate);
      setDetailedAge(detailed);
    }
  }, [birthDate, maxAge]);

  // Real-time detailed age update every second
  useEffect(() => {
    if (!birthDate) return;

    const updateDetailedAge = () => {
      const detailed = calculateDetailedAge(birthDate);
      setDetailedAge(detailed);
    };

    const interval = setInterval(updateDetailedAge, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('lifeTimelineActivities');
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    }

    // Load user data from localStorage
    const savedBirthDate = localStorage.getItem('userBirthDate');
    const savedMaxAge = localStorage.getItem('userMaxAge');
    if (savedBirthDate) {
      setBirthDate(savedBirthDate);
    }
    if (savedMaxAge) {
      setMaxAge(parseInt(savedMaxAge) || 80);
    }

    // Load achievements from localStorage
    const savedAchievements = localStorage.getItem('userAchievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (error) {
        console.error('Error loading achievements:', error);
      }
    }

    // Load goals from localStorage
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }

    // Load friend messages from localStorage
    const savedMessages = localStorage.getItem('friendMessages');
    if (savedMessages) {
      try {
        setFriendMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading friend messages:', error);
      }
    }

    // Load friends from localStorage
    const savedFriends = localStorage.getItem('userFriends');
    if (savedFriends) {
      try {
        setFriends(JSON.parse(savedFriends));
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    }

    // Load todos from localStorage
    const savedTodos = localStorage.getItem('userTodos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    } else {
      // Set sample todos
      const sampleTodos = {
        today: [
          { id: 1, text: 'อ่านหนังสือ 30 นาที', completed: false },
          { id: 2, text: 'ออกกำลังกาย', completed: false }
        ],
        tomorrow: [
          { id: 3, text: 'ประชุมกับทีม', completed: false },
          { id: 4, text: 'จ่ายค่าไฟฟ้า', completed: false }
        ],
        upcoming: [
          { id: 5, text: 'ตรวจสุขภาพประจำปี', completed: false },
          { id: 6, text: 'วางแผนการลาพักร้อน', completed: false }
        ],
        monthly: [
          { id: 7, text: 'ทบทวนงบประมาณ', completed: false },
          { id: 8, text: 'เรียนภาษาอังกฤษ', completed: false }
        ]
      };
      setTodos(sampleTodos);
      localStorage.setItem('userTodos', JSON.stringify(sampleTodos));
    }

    if (!savedFriends) {
      // Check if emotion modal should be shown
      if (shouldShowEmotionModal()) {
        setTimeout(() => setShowEmotionModal(true), 1000); // Delay 1 second for better UX
      }
      
      // Create sample friend messages
      const sampleMessages: FriendMessage[] = [
        {
          id: 1,
          message: "สวัสดีครับ! ไว้เจอกันนะ 😊",
          fromName: "แก้ว",
          fromAvatar: "👩🏻",
          position: { x: 150, y: 200 },
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          message: "Happy Birthday! 🎂🎉",
          fromName: "มิกี้",
          fromAvatar: "🐭",
          position: { x: 400, y: 150 },
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          message: "จำได้มั้ยที่เราเล่นด้วยกันตอนเด็ก 😄",
          fromName: "โอ๋",
          fromAvatar: "👦🏻",
          position: { x: 300, y: 350 },
          createdAt: new Date().toISOString()
        }
      ];
      setFriendMessages(sampleMessages);
      localStorage.setItem('friendMessages', JSON.stringify(sampleMessages));
    }
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

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (showCalendarModal || showTodoModal || showEmotionModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [showCalendarModal, showTodoModal, showEmotionModal]);

  // Emotion data
  const emotions = [
    { id: 1, name: 'มีความสุข', icon: '😊', color: '#FFD93D' },
    { id: 2, name: 'หัวเราะ', icon: '😂', color: '#FF6B35' },
    { id: 3, name: 'เศร้า', icon: '😢', color: '#6C63FF' },
    { id: 4, name: 'เสียใจ', icon: '😞', color: '#8B8B8B' },
    { id: 5, name: 'หงุดหงิด', icon: '😤', color: '#FF4757' },
    { id: 6, name: 'ผิดหวัง', icon: '😔', color: '#A8A8A8' },
    { id: 7, name: 'ตื่นเต้น', icon: '🤩', color: '#FF9F40' },
    { id: 8, name: 'กังวล', icon: '😰', color: '#70A1FF' },
    { id: 9, name: 'โกรธ', icon: '😠', color: '#FF3838' },
    { id: 10, name: 'เหนื่อย', icon: '😴', color: '#95A5A6' }
  ];

  // Handle emotion selection
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    // Save to localStorage with today's date
    const today = new Date().toDateString();
    const emotionData = {
      date: today,
      emotion: emotion,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('todayEmotion', JSON.stringify(emotionData));
    setShowEmotionModal(false);
  };

  // Check if user should see emotion modal (first visit of the day)
  const shouldShowEmotionModal = () => {
    const today = new Date().toDateString();
    const savedEmotion = localStorage.getItem('todayEmotion');
    
    if (!savedEmotion) return true;
    
    try {
      const emotionData = JSON.parse(savedEmotion);
      return emotionData.date !== today;
    } catch (error) {
      return true;
    }
  };

  // Friend management
  const saveFriendsToStorage = (friendsToSave) => {
    try {
      localStorage.setItem('userFriends', JSON.stringify(friendsToSave));
    } catch (error) {
      console.error('Error saving friends:', error);
    }
  };

  const addFriend = () => {
    if (newFriend.name && newFriend.birthDate) {
      const updatedFriends = [...friends, { ...newFriend, id: Date.now() }];
      setFriends(updatedFriends);
      saveFriendsToStorage(updatedFriends);
      setNewFriend({ name: '', birthDate: '', color: '#8B5CF6' });
      setShowAddFriend(false);
    }
  };

  const removeFriend = (id) => {
    const updatedFriends = friends.filter(friend => friend.id !== id);
    setFriends(updatedFriends);
    saveFriendsToStorage(updatedFriends);
  };

  // Activity management functions
  const saveActivitiesToStorage = (activitiesToSave: Activity[]) => {
    try {
      localStorage.setItem('lifeTimelineActivities', JSON.stringify(activitiesToSave));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  };

  // User data management functions
  const saveUserData = () => {
    try {
      localStorage.setItem('userBirthDate', birthDate);
      localStorage.setItem('userMaxAge', maxAge.toString());
      
      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Import/Export functions
  const handleImportData = (importedData: AppData) => {
    try {
      // Update all state with imported data
      if (importedData.userProfile) {
        setBirthDate(importedData.userProfile.birthDate);
        setMaxAge(importedData.userProfile.maxAge);
      }
      
      if (importedData.activities) {
        setActivities(importedData.activities);
      }
      
      if (importedData.achievements) {
        setAchievements(importedData.achievements);
      }
      
      if (importedData.goals) {
        setGoals(importedData.goals);
      }
      
      if (importedData.friends) {
        setFriends(importedData.friends);
      }
      
      if (importedData.friendMessages) {
        setFriendMessages(importedData.friendMessages);
      }
      
      if (importedData.todos) {
        setTodos(importedData.todos);
      }

      // Import data to localStorage using DataManager
      DataManager.importAppData(importedData);
      
      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }
  };

  const getCurrentAppData = (): AppData => {
    return {
      userProfile: {
        birthDate,
        maxAge
      },
      activities,
      achievements,
      goals,
      friends,
      friendMessages,
      todos,
      todayEmotion: null, // Will be set from localStorage in DataManager
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  };

  const addAchievement = () => {
    if (newAchievement.title.trim()) {
      const achievement = {
        ...newAchievement,
        id: Date.now()
      };
      const updatedAchievements = [...achievements, achievement];
      setAchievements(updatedAchievements);
      localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
      setNewAchievement({
        title: '',
        year: new Date().getFullYear(),
        category: 'education',
        icon: '🎓'
      });
      setShowAddAchievementModal(false);
    }
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        ...newGoal,
        id: Date.now()
      };
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      setNewGoal({
        title: '',
        target: 0,
        current: 0,
        category: 'asset',
        icon: '💰'
      });
      setShowAddGoalModal(false);
    }
  };

  const removeAchievement = (id: number) => {
    const updatedAchievements = achievements.filter(achievement => achievement.id !== id);
    setAchievements(updatedAchievements);
    localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
  };

  const removeGoal = (id: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  // Friend messages management functions
  const saveFriendMessagesToStorage = (messages: FriendMessage[]) => {
    try {
      localStorage.setItem('friendMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving friend messages:', error);
    }
  };

  const removeFriendMessage = (id: number) => {
    const updatedMessages = friendMessages.filter(message => message.id !== id);
    setFriendMessages(updatedMessages);
    saveFriendMessagesToStorage(updatedMessages);
  };

  const updateMessagePosition = (id: number, newPosition: { x: number; y: number }) => {
    const updatedMessages = friendMessages.map(message => 
      message.id === id ? { ...message, position: newPosition } : message
    );
    setFriendMessages(updatedMessages);
    saveFriendMessagesToStorage(updatedMessages);
  };

  const addActivity = () => {
    if (newActivity.name.trim()) {
      const activity: Activity = {
        ...newActivity,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        position: {
          x: Math.random() * (window.innerWidth - 250) + 50,
          y: Math.random() * (window.innerHeight - 200) + 100
        }
      };
      const updatedActivities = [...activities, activity];
      setActivities(updatedActivities);
      saveActivitiesToStorage(updatedActivities);
      setNewActivity({
        name: '',
        description: '',
        displayType: 'daily' as const,
        color: '#3B82F6',
        backgroundColor: '#FEF3C7',
        position: { x: 100, y: 100 }
      });
      setShowAddActivityModal(false);
    }
  };

  const removeActivity = (id: number) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    saveActivitiesToStorage(updatedActivities);
  };

  const updateActivityPosition = (id: number, newPosition: { x: number; y: number }) => {
    const updatedActivities = activities.map(activity => 
      activity.id === id ? { ...activity, position: newPosition } : activity
    );
    setActivities(updatedActivities);
    saveActivitiesToStorage(updatedActivities);
  };

  // Drag and drop handlers
  const handleActivityMouseDown = (e: React.MouseEvent, activity: Activity) => {
    e.preventDefault();
    setDraggedActivity(activity.id);
    // คำนวณ offset จากตำแหน่งปัจจุบันของ post-it
    setDragOffset({
      x: e.clientX - activity.position.x,
      y: e.clientY - activity.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedActivity) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      updateActivityPosition(draggedActivity, newPosition);
    }
    if (draggedMessage) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      updateMessagePosition(draggedMessage, newPosition);
    }
  };

  const handleMouseUp = () => {
    setDraggedActivity(null);
    setDraggedMessage(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle message mouse down
  const handleMessageMouseDown = (e: React.MouseEvent, message: FriendMessage) => {
    e.preventDefault();
    setDraggedMessage(message.id);
    // คำนวณ offset จากตำแหน่งปัจจุบันของ message post-it
    setDragOffset({
      x: e.clientX - message.position.x,
      y: e.clientY - message.position.y
    });
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (draggedActivity || draggedMessage) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedActivity, draggedMessage, dragOffset]);

  // Get activities for specific month and year
  const getActivitiesForMonth = (year: number, monthIndex: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    return activities.filter(activity => {
      switch (activity.displayType) {
        case 'yearly':
          // แสดงทุกเดือนในปีนั้น
          return year === currentYear || year >= currentYear;
        
        case 'monthly':
          // แสดงเฉพาะเดือนปัจจุบันในปีปัจจุบัน หรือทุกเดือนในปีอื่น
          if (year === currentYear) {
            return monthIndex >= currentMonth;
          }
          return year > currentYear;
        
        case 'weekly':
          // แสดงทุกสัปดาห์ในเดือนปัจจุบันและหลังจากนั้น
          if (year === currentYear) {
            return monthIndex >= currentMonth;
          }
          return year > currentYear;
        
        case 'daily':
          // แสดงทุกวันในเดือนปัจจุบันและหลังจากนั้น
          if (year === currentYear) {
            return monthIndex >= currentMonth;
          }
          return year > currentYear;
        
        default:
          return false;
      }
    });
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
  const timelineYears = useMemo(() => getTimelineYears(birthDate, friends, maxAge), [birthDate, friends, maxAge]);
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

      <GlobalStyles />
      <SunMoonComponent isClient={isClient} currentTime={currentTime} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Life Timeline</h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto relative">
            {/* Success message */}
            {showSaveSuccess && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">บันทึกแล้ว!</span>
              </div>
            )}

            {/* Action buttons row */}
            <div className="flex justify-center space-x-3 mb-6">
              {/* Import button */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
                title="นำเข้า"
              >
                <Upload className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-y-0.5" />
                <span className="text-sm font-medium">นำเข้า</span>
              </button>
              
              {/* Export button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
                title="ส่งออก"
              >
                <Download className="w-4 h-4 mr-2 transform transition-transform group-hover:translate-y-0.5" />
                <span className="text-sm font-medium">ส่งออก</span>
              </button>
              
              {/* Save button */}
              <button
                onClick={saveUserData}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
                title="บันทึกข้อมูล"
              >
                <svg className="w-4 h-4 mr-2 transform transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium">บันทึก</span>
              </button>
            </div>

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ต้องการอยู่ให้ถึง (ปี)</label>
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
            {currentAge > 0 && detailedAge && (
              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">อายุแบบละเอียด</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                      <div className="font-bold text-blue-700 dark:text-blue-300">{detailedAge.years}</div>
                      <div className="text-blue-600 dark:text-blue-400">ปี</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                      <div className="font-bold text-green-700 dark:text-green-300">{detailedAge.months}</div>
                      <div className="text-green-600 dark:text-green-400">เดือน</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-lg">
                      <div className="font-bold text-yellow-700 dark:text-yellow-300">{detailedAge.days}</div>
                      <div className="text-yellow-600 dark:text-yellow-400">วัน</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                      <div className="font-bold text-purple-700 dark:text-purple-300">{detailedAge.hours}</div>
                      <div className="text-purple-600 dark:text-purple-400">ชั่วโมง</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-lg">
                      <div className="font-bold text-pink-700 dark:text-pink-300">{detailedAge.minutes}</div>
                      <div className="text-pink-600 dark:text-pink-400">นาที</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">
                      <div className="font-bold text-red-700 dark:text-red-300">{detailedAge.seconds}</div>
                      <div className="text-red-600 dark:text-red-400">วินาที</div>
                    </div>
                  </div>
                </div>
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
        <TimeLifeVisualization
          birthDate={birthDate}
          currentAge={currentAge}
          secondsLeft={secondsLeft}
          currentTime={currentTime}
          isClient={isClient}
          focusCurrentAge={focusCurrentAge}
          setFocusCurrentAge={setFocusCurrentAge}
          setShowTodoModal={setShowTodoModal}
        />

        {/* Calendar Modal */}
        {showCalendarModal && selectedYear && selectedPersonData && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
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
                      const monthActivities = getActivitiesForMonth(selectedYear, monthIndex);

                      return (
                        <div
                          key={monthIndex}
                          onClick={() => handleMonthClick(monthIndex)}
                          className={`relative p-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
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
                          
                          {/* Activity dots */}
                          {monthActivities.length > 0 && (
                            <div className="absolute -top-1 -right-1 flex flex-wrap gap-1 max-w-8">
                              {monthActivities.slice(0, 3).map((activity, index) => (
                                <div
                                  key={activity.id}
                                  className="w-2 h-2 rounded-full shadow-sm border border-white"
                                  style={{ backgroundColor: activity.backgroundColor }}
                                  title={`${activity.name} (${activity.displayType})`}
                                ></div>
                              ))}
                              {monthActivities.length > 3 && (
                                <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center text-white font-bold shadow-sm border border-white">
                                  +
                                </div>
                              )}
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
        <MainContent
          timelineYears={timelineYears}
          currentYear={currentYear}
          birthDate={birthDate}
          friends={friends}
          achievements={achievements}
          goals={goals}
          showAddFriend={showAddFriend}
          newFriend={newFriend}
          setShowAddFriend={setShowAddFriend}
          setNewFriend={setNewFriend}
          addFriend={addFriend}
          removeFriend={removeFriend}
          handleTimelineDotClick={handleTimelineDotClick}
          setShowAddAchievementModal={setShowAddAchievementModal}
          removeAchievement={removeAchievement}
          setShowAddGoalModal={setShowAddGoalModal}
          removeGoal={removeGoal}
        />

        <TodoModal 
          showTodoModal={showTodoModal}
          setShowTodoModal={setShowTodoModal}
          todos={todos}
        />

        <EmotionModal 
          showEmotionModal={showEmotionModal}
          emotions={emotions}
          handleEmotionSelect={handleEmotionSelect}
        />

        <FloatingActionButton 
          setShowAddActivityModal={setShowAddActivityModal}
        />

        <AddActivityModal 
          showAddActivityModal={showAddActivityModal}
          setShowAddActivityModal={setShowAddActivityModal}
          newActivity={newActivity}
          setNewActivity={setNewActivity}
          addActivity={addActivity}
        />

        <ActivityPostIts 
          activities={activities}
          draggedActivity={draggedActivity}
          handleActivityMouseDown={handleActivityMouseDown}
          removeActivity={removeActivity}
        />

        <FriendMessagePostIts 
          friendMessages={friendMessages}
          draggedMessage={draggedMessage}
          handleMessageMouseDown={handleMessageMouseDown}
          removeFriendMessage={removeFriendMessage}
        />

        <AddAchievementModal 
          showAddAchievementModal={showAddAchievementModal}
          setShowAddAchievementModal={setShowAddAchievementModal}
          newAchievement={newAchievement}
          setNewAchievement={setNewAchievement}
          addAchievement={addAchievement}
        />

        <AddGoalModal 
          showAddGoalModal={showAddGoalModal}
          setShowAddGoalModal={setShowAddGoalModal}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          addGoal={addGoal}
        />

        <FileImportModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportData}
        />

        <FileExportModal 
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          appData={getCurrentAppData()}
        />

      </div>
    </div>
  );
};

export default LifeTimelineApp;