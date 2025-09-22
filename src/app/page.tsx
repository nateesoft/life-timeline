'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, Download, Upload, Calendar, Plus, Trash2 } from 'lucide-react';
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
import TravelMap from '../components/TravelMap';
import AddTravelLocationModal from '../components/AddTravelLocationModal';
import MainContent from '../components/MainContent';
import TimeLifeVisualization from '../components/TimeLifeVisualization';
import CalendarModal from '../components/CalendarModal';
import ParallaxStarBackground from '../components/ParallaxStarBackground';
import { DataManager } from '../utils/dataManager';
import { AppData } from '../types';
import { 
  calculateAge, 
  calculateDetailedAge, 
  getTimelineYears,
  toBuddhistYear,
  isPersonAliveInYear,
  getCurrentYear
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

interface TravelLocation {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  visitDate: string;
  photos?: string[];
  rating: number;
  category: 'domestic' | 'international';
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
  
  // Travel locations state
  const [travelLocations, setTravelLocations] = useState<TravelLocation[]>([]);
  const [showAddTravelModal, setShowAddTravelModal] = useState(false);
  const [newTravelLocation, setNewTravelLocation] = useState({
    name: '',
    description: '',
    lat: 13.7563, // Default to Bangkok
    lng: 100.5018,
    visitDate: '',
    rating: 5,
    category: 'domestic' as 'domestic' | 'international'
  });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Drawer states for mobile
  const [showIncomeDrawer, setShowIncomeDrawer] = useState(false);
  const [showExpenseDrawer, setShowExpenseDrawer] = useState(false);
  const [showAchievementDrawer, setShowAchievementDrawer] = useState(false);
  const [showGoalDrawer, setShowGoalDrawer] = useState(false);
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

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDxVOc-l-80t8izEZDi_ifkx6_QdASdkXc
&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

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

    // Load travel locations from localStorage
    const savedTravelLocations = localStorage.getItem('travelLocations');
    if (savedTravelLocations) {
      try {
        setTravelLocations(JSON.parse(savedTravelLocations));
      } catch (error) {
        console.error('Error loading travel locations:', error);
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

  // Prevent background scroll when any modal is open without layout shift
  useEffect(() => {
    const hasAnyModalOpen = showCalendarModal || showTodoModal || showEmotionModal || showAddActivityModal || showAddAchievementModal || showAddGoalModal || showImportModal || showExportModal || showAddTravelModal;
    
    if (hasAnyModalOpen) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply styles to prevent scroll without layout shift
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Restore scroll position and remove styles
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
    };
  }, [showCalendarModal, showTodoModal, showEmotionModal, showAddActivityModal, showAddAchievementModal, showAddGoalModal, showImportModal, showExportModal, showAddTravelModal]);

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

  // Travel locations management functions
  const saveTravelLocationsToStorage = (locations: TravelLocation[]) => {
    try {
      localStorage.setItem('travelLocations', JSON.stringify(locations));
    } catch (error) {
      console.error('Error saving travel locations:', error);
    }
  };

  const addTravelLocation = () => {
    if (newTravelLocation.name.trim() && newTravelLocation.visitDate) {
      const location: TravelLocation = {
        ...newTravelLocation,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      const updatedLocations = [...travelLocations, location];
      setTravelLocations(updatedLocations);
      saveTravelLocationsToStorage(updatedLocations);
      setNewTravelLocation({
        name: '',
        description: '',
        lat: 13.7563,
        lng: 100.5018,
        visitDate: '',
        rating: 5,
        category: 'domestic'
      });
      setShowAddTravelModal(false);
    }
  };

  const removeTravelLocation = (id: number) => {
    const updatedLocations = travelLocations.filter(location => location.id !== id);
    setTravelLocations(updatedLocations);
    saveTravelLocationsToStorage(updatedLocations);
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

          </div>

          {/* Net Income Summary - Desktop */}
          <div className="hidden lg:block mt-6">
            <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="text-center">
                <span className="block font-bold text-blue-700 dark:text-blue-300 mb-2">คงเหลือต่อเดือน</span>
                <span className="block font-bold text-xl text-blue-600 dark:text-blue-400">
                  {(incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)).toLocaleString()} บาท
                </span>
              </div>
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

            {/* Achievement Tab - Bottom Left */}
            <div className="fixed bottom-4 left-4 z-40">
              <button
                onClick={() => setShowAchievementDrawer(!showAchievementDrawer)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-t-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">ความสำเร็จ</span>
                    <span className="text-xs opacity-75">{achievements.length} รายการ</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Goal Tab - Bottom Right */}
            <div className="fixed bottom-4 right-4 z-40">
              <button
                onClick={() => setShowGoalDrawer(!showGoalDrawer)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-t-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎯</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">เป้าหมาย</span>
                    <span className="text-xs opacity-75">{goals.length} รายการ</span>
                  </div>
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
                <div className="text-center">
                  <span className="block font-bold text-blue-700 dark:text-blue-300 mb-2">คงเหลือต่อเดือน</span>
                  <span className="block font-bold text-xl text-blue-600 dark:text-blue-400">
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

            {/* Achievement Drawer */}
            <div className={`fixed inset-x-0 bottom-0 z-50 h-96 bg-yellow-50 dark:bg-yellow-900/90 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showAchievementDrawer ? 'translate-y-0' : 'translate-y-full'
            }`}>
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 flex items-center">
                    <span className="mr-2">🏆</span>
                    ความสำเร็จที่ผ่านมา
                  </h2>
                  <button
                    onClick={() => setShowAchievementDrawer(false)}
                    className="text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 p-2 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-4 bg-white dark:bg-yellow-800/30 rounded-lg shadow-sm border-l-4 border-yellow-500">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-yellow-100">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-yellow-200">ปี {achievement.year}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center py-4">
                    <button
                      onClick={() => setShowAddAchievementModal(true)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      + เพิ่มความสำเร็จ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Drawer */}
            <div className={`fixed inset-x-0 bottom-0 z-50 h-96 bg-blue-50 dark:bg-blue-900/90 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showGoalDrawer ? 'translate-y-0' : 'translate-y-full'
            }`}>
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 flex items-center">
                    <span className="mr-2">🎯</span>
                    เป้าหมายในอนาคต
                  </h2>
                  <button
                    onClick={() => setShowGoalDrawer(false)}
                    className="text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 p-2 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                      <div key={goal.id} className="p-4 bg-white dark:bg-blue-800/30 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">{goal.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-blue-100">{goal.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-blue-200">
                              {goal.current.toLocaleString()} / {goal.target.toLocaleString()} บาท
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                          {progress.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-center py-4">
                    <button
                      onClick={() => setShowAddGoalModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      + เพิ่มเป้าหมาย
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay for drawer */}
            {(showIncomeDrawer || showExpenseDrawer || showAchievementDrawer || showGoalDrawer) && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => {
                  setShowIncomeDrawer(false);
                  setShowExpenseDrawer(false);
                  setShowAchievementDrawer(false);
                  setShowGoalDrawer(false);
                }}
              ></div>
            )}
          </div>

          {/* Mobile Timeline Section */}
          <div className="lg:hidden mt-8">
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
              <div id="age-timeline-mobile" className="relative">
                {timelineYears.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    กรุณากรอกวันเกิดเพื่อแสดง Timeline
                  </div>
                ) : (
                  <div className="relative overflow-x-auto pb-4">
                    <div className="flex" style={{ minWidth: `${timelineYears.length * 60}px` }}>
                      {timelineYears.map((year, index) => {
                        const buddhistYear = toBuddhistYear(year);
                        const isCurrentYearForUser = year === currentYear;
                        const userAge = birthDate ? year - new Date(birthDate).getFullYear() : 0;
                        
                        return (
                          <div key={year} id={`year-mobile-${year}`} className="flex flex-col items-center relative" style={{ minWidth: '60px' }}>
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Modal */}
        <CalendarModal
          showCalendarModal={showCalendarModal}
          selectedYear={selectedYear}
          selectedPersonData={selectedPersonData}
          currentYear={currentYear}
          setShowCalendarModal={setShowCalendarModal}
          getActivitiesForMonth={getActivitiesForMonth}
        />

        {/* Main Content - Hidden on mobile */}
        <div className="hidden lg:block">
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
        </div>

        {/* Travel Map Section */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    แผนที่ท่องเที่ยว
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    สถานที่ที่คุณเคยไปเที่ยว
                  </p>
                </div>
              </div>
              
              {/* Travel Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {travelLocations.filter(loc => loc.category === 'domestic').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ในประเทศ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {travelLocations.filter(loc => loc.category === 'international').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ต่างประเทศ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {travelLocations.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">รวม</div>
                </div>
              </div>
            </div>

            {/* Travel Map */}
            <TravelMap
              locations={travelLocations}
              onAddLocation={() => setShowAddTravelModal(true)}
              isLoaded={isGoogleMapsLoaded}
            />

            {/* Mobile Stats */}
            <div className="md:hidden mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {travelLocations.filter(loc => loc.category === 'domestic').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ในประเทศ</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {travelLocations.filter(loc => loc.category === 'international').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ต่างประเทศ</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {travelLocations.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">รวม</div>
              </div>
            </div>

            {/* Recent Locations */}
            {travelLocations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  สถานที่ล่าสุด
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelLocations
                    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                    .slice(0, 6)
                    .map((location) => (
                      <div
                        key={location.id}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-white truncate">
                              {location.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {location.description || 'ไม่มีรายละเอียด'}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(location.visitDate).toLocaleDateString('th-TH')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < location.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  ))}
                                </div>
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    location.category === 'international'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  }`}
                                >
                                  {location.category === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTravelLocation(location.id)}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="ลบสถานที่"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

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

        <AddTravelLocationModal 
          isOpen={showAddTravelModal}
          onClose={() => setShowAddTravelModal(false)}
          onAdd={addTravelLocation}
          newLocation={newTravelLocation}
          setNewLocation={setNewTravelLocation}
        />

    </div>
  );
};

export default LifeTimelineApp;