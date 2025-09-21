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
import CalendarModal from '../components/CalendarModal';
import ParallaxStarBackground from '../components/ParallaxStarBackground';
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

  // State for income and expenses
  const [incomes, setIncomes] = useState([
    { id: 1, title: 'เงินเดือน', amount: 45000, type: 'monthly', icon: '💼' },
    { id: 2, title: 'รายได้เสริม', amount: 15000, type: 'monthly', icon: '💻' },
    { id: 3, title: 'ดอกเบียย์เงินฝาก', amount: 2500, type: 'monthly', icon: '🏦' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, title: 'ค่าเช่าบ้าน', amount: 12000, type: 'monthly', icon: '🏠' },
    { id: 2, title: 'ค่าอาหาร', amount: 8000, type: 'monthly', icon: '🍽️' },
    { id: 3, title: 'ค่าน้ำมันรถ', amount: 3000, type: 'monthly', icon: '⛽' },
    { id: 4, title: 'ค่าโทรศัพท์', amount: 599, type: 'monthly', icon: '📱' },
    { id: 5, title: 'ค่าไฟฟ้า', amount: 1500, type: 'monthly', icon: '⚡' }
  ]);

  // State for friends
  const [friends, setFriends] = useState([
    { id: 1, name: 'สมชาย', birthDate: '1995-03-15', color: '#E74C3C' },
    { id: 2, name: 'สมหญิง', birthDate: '1998-07-22', color: '#1ABC9C' },
    { id: 3, name: 'วิทยา', birthDate: '1997-11-08', color: '#3498DB' },
    { id: 4, name: 'ปราณี', birthDate: '1996-05-20', color: '#2ECC71' },
    { id: 5, name: 'สุรชัย', birthDate: '1999-02-14', color: '#F39C12' }
  ]);

  // Color palette for friends - distinctive colors
  const friendColorPalette = [
    '#E74C3C', // Vibrant Red
    '#1ABC9C', // Emerald
    '#3498DB', // Bright Blue
    '#2ECC71', // Green
    '#F39C12', // Orange
    '#9B59B6', // Purple
    '#E67E22', // Carrot
    '#16A085', // Dark Turquoise
    '#2980B9', // Belize Blue
    '#8E44AD', // Wisteria
    '#D35400', // Pumpkin
    '#27AE60', // Nephritis
    '#C0392B', // Pomegranate
    '#8F4068', // Plum
    '#17A2B8'  // Info Blue
  ];

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', birthDate: '', color: '#8B5CF6' });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Modal state
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedPersonData, setSelectedPersonData] = useState(null);
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
  
  // Drawer states for mobile
  const [showIncomeDrawer, setShowIncomeDrawer] = useState(false);
  const [showExpenseDrawer, setShowExpenseDrawer] = useState(false);
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

  // Function to get next available color
  const getNextFriendColor = () => {
    const usedColors = friends.map(friend => friend.color);
    const availableColors = friendColorPalette.filter(color => !usedColors.includes(color));
    return availableColors.length > 0 ? availableColors[0] : friendColorPalette[friends.length % friendColorPalette.length];
  };

  const addFriend = () => {
    if (newFriend.name && newFriend.birthDate) {
      const friendColor = getNextFriendColor();
      const updatedFriends = [...friends, { ...newFriend, id: Date.now(), color: friendColor }];
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
    setShowCalendarModal(true);
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
      <ParallaxStarBackground />

      <GlobalStyles />
      <SunMoonComponent isClient={isClient} currentTime={currentTime} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Life Timeline</h1>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Income Section - Left */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                <span className="mr-2">💰</span>
                รายรับ (ต่อเดือน)
              </h2>
              <div className="space-y-3">
                {incomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-3 bg-white dark:bg-green-800/30 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{income.icon}</span>
                      <span className="text-gray-700 dark:text-green-100 text-sm">{income.title}</span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-300">
                      +{income.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-green-300 dark:border-green-700 pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold text-green-700 dark:text-green-300">
                    <span>รวม:</span>
                    <span className="text-lg">+{incomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Date Form - Center */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative">
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

            {/* Expenses Section - Right */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4 flex items-center">
                <span className="mr-2">💸</span>
                รายจ่าย (ต่อเดือน)
              </h2>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-white dark:bg-red-800/30 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{expense.icon}</span>
                      <span className="text-gray-700 dark:text-red-100 text-sm">{expense.title}</span>
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-300">
                      -{expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-red-300 dark:border-red-700 pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold text-red-700 dark:text-red-300">
                    <span>รวม:</span>
                    <span className="text-lg">-{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Income Summary - Desktop */}
            <div className="mt-6 max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-700 dark:text-blue-300">คงเหลือต่อเดือน:</span>
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                  {(incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)).toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden relative">
            {/* Income Tab - Left */}
            <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
              <button
                onClick={() => setShowIncomeDrawer(!showIncomeDrawer)}
                onMouseEnter={() => {}}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-r-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed'
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-lg">💰</span>
                  <span className="text-sm font-bold tracking-wider">รายรับ</span>
                  <span className="text-xs opacity-75">
                    +{incomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}
                  </span>
                </div>
              </button>
            </div>

            {/* Expense Tab - Right */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
              <button
                onClick={() => setShowExpenseDrawer(!showExpenseDrawer)}
                onMouseEnter={() => {}}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-l-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed'
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-lg">💸</span>
                  <span className="text-sm font-bold tracking-wider">รายจ่าย</span>
                  <span className="text-xs opacity-75">
                    -{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </span>
                </div>
              </button>
            </div>

            {/* Main Form */}
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
              
              {/* Mobile Net Income Summary */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-700 dark:text-blue-300">คงเหลือต่อเดือน:</span>
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {(incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Income Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-green-50 dark:bg-green-900/90 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showIncomeDrawer ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-green-700 dark:text-green-300 flex items-center">
                    <span className="mr-2">💰</span>
                    รายรับ (ต่อเดือน)
                  </h2>
                  <button
                    onClick={() => setShowIncomeDrawer(false)}
                    className="text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 p-2 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {incomes.map((income) => (
                    <div key={income.id} className="flex items-center justify-between p-3 bg-white dark:bg-green-800/30 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{income.icon}</span>
                        <span className="text-gray-700 dark:text-green-100">{income.title}</span>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-300">
                        +{income.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-green-300 dark:border-green-700 pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold text-green-700 dark:text-green-300 p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
                      <span>รวม:</span>
                      <span className="text-lg">+{incomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-red-50 dark:bg-red-900/90 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showExpenseDrawer ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-red-700 dark:text-red-300 flex items-center">
                    <span className="mr-2">💸</span>
                    รายจ่าย (ต่อเดือน)
                  </h2>
                  <button
                    onClick={() => setShowExpenseDrawer(false)}
                    className="text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 p-2 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-white dark:bg-red-800/30 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{expense.icon}</span>
                        <span className="text-gray-700 dark:text-red-100">{expense.title}</span>
                      </div>
                      <span className="font-bold text-red-600 dark:text-red-300">
                        -{expense.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-red-300 dark:border-red-700 pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold text-red-700 dark:text-red-300 p-3 bg-red-100 dark:bg-red-800/50 rounded-lg">
                      <span>รวม:</span>
                      <span className="text-lg">-{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} บาท</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay for drawer */}
            {(showIncomeDrawer || showExpenseDrawer) && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => {
                  setShowIncomeDrawer(false);
                  setShowExpenseDrawer(false);
                }}
              ></div>
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
        <CalendarModal
          showCalendarModal={showCalendarModal}
          selectedYear={selectedYear}
          selectedPersonData={selectedPersonData}
          currentYear={currentYear}
          setShowCalendarModal={setShowCalendarModal}
          getActivitiesForMonth={getActivitiesForMonth}
        />

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