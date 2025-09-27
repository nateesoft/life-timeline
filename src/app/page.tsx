'use client';

import React, { useState, useEffect, useMemo } from 'react';
import GlobalStyles from '@/components/GlobalStyles';
import SunMoonComponent from '@/components/SunMoonComponent';
import TodoModal from '@/components/TodoModal';
import EmotionModal from '@/components/EmotionModal';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddActivityModal from '@/components/AddActivityModal';
import ActivityPostIts from '@/components/ActivityPostIts';
import FriendMessagePostIts from '@/components/FriendMessagePostIts';
import AddAchievementModal from '@/components/AddAchievementModal';
import AddGoalModal from '@/components/AddGoalModal';
import AddIncomeModal from '@/components/AddIncomeModal';
import AddExpenseModal from '@/components/AddExpenseModal';
import FileImportModal from '@/components/FileImportModal';
import FileExportModal from '@/components/FileExportModal';

import AddTravelLocationModal from '@/components/AddTravelLocationModal';
import MainContent from '@/components/MainContent';
import TimeLifeVisualization from '@/components/TimeLifeVisualization';
import CalendarModal from '@/components/CalendarModal';
import ParallaxStarBackground from '@/components/ParallaxStarBackground';
import { DataManager } from '../utils/dataManager';
import { AppData, Income, Expense } from '../types';
import { 
  calculateAge, 
  calculateDetailedAge, 
  getTimelineYears} from '../utils/ageCalculations';

// Import initial data
import initialAchievements from '../data/achievements.json';
import initialGoals from '../data/goals.json';
import initialFriends from '../data/friends.json';
import initialTodos from '../data/todos.json';
import initialFriendMessages from '../data/friendMessages.json';
import initialEmotions from '../data/emotions.json';
import initialIncomes from '../data/incomes.json';
import initialExpenses from '../data/expenses.json';

import HeaderMain from '@/components/HeaderMain';
import WaterTankVisualization from '@/components/WaterTankVisualization';
import TravelMapSection from '@/components/TravelMapSection';

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
  const [achievements, setAchievements] = useState(initialAchievements);
  // State for goals
  const [goals, setGoals] = useState(initialGoals);
  // Timeline dot size state
  const [timelineDotSize, setTimelineDotSize] = useState(2); // 1 = small, 2 = medium, 3 = large, 4 = extra large
  // State for income and expenses (imported from initial data)

  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  // State for friends
  const [friends, setFriends] = useState(initialFriends);
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
  const [todos, setTodos] = useState(initialTodos);

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
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditIncomeModal, setShowEditIncomeModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showEditAchievementModal, setShowEditAchievementModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  
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
      const apiToken = `AIzaSyDxVOc-l-80t8izEZDi_ifkx6_QdASdkXc`
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiToken}&libraries=places&callback=initMap`;
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
    const savedTimelineDotSize = localStorage.getItem('timelineDotSize');
    if (savedBirthDate) {
      setBirthDate(savedBirthDate);
    }
    if (savedMaxAge) {
      setMaxAge(parseInt(savedMaxAge) || 80);
    }
    if (savedTimelineDotSize) {
      setTimelineDotSize(parseInt(savedTimelineDotSize) || 2);
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

    // Load incomes from localStorage
    const savedIncomes = localStorage.getItem('userIncomes');
    if (savedIncomes) {
      try {
        setIncomes(JSON.parse(savedIncomes));
      } catch (error) {
        console.error('Error loading incomes:', error);
      }
    }

    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('userExpenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Error loading expenses:', error);
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
      const sampleTodos = initialTodos;
      setTodos(sampleTodos);
      localStorage.setItem('userTodos', JSON.stringify(sampleTodos));
    }

    // Check if emotion modal should be shown
    if (shouldShowEmotionModal()) {
      setTimeout(() => setShowEmotionModal(true), 1000); // Delay 1 second for better UX
    }

    if (!savedFriends) {
      // Create sample friend messages
      const sampleMessages: FriendMessage[] = initialFriendMessages;
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
    const hasAnyModalOpen = showCalendarModal || showTodoModal || showEmotionModal || showAddActivityModal || showAddAchievementModal || showAddGoalModal || showAddIncomeModal || showAddExpenseModal || showEditIncomeModal || showEditExpenseModal || showEditAchievementModal || showEditGoalModal || showImportModal || showExportModal || showAddTravelModal;
    
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
  }, [showCalendarModal, showTodoModal, showEmotionModal, showAddActivityModal, showAddAchievementModal, showAddGoalModal, showAddIncomeModal, showAddExpenseModal, showEditIncomeModal, showEditExpenseModal, showEditAchievementModal, showEditGoalModal, showImportModal, showExportModal, showAddTravelModal]);

  // Emotion data
  const emotions = initialEmotions;

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

  // Timeline dot size functions
  const increaseTimelineDotSize = () => {
    setTimelineDotSize(prev => Math.min(prev + 1, 4));
  };

  const decreaseTimelineDotSize = () => {
    setTimelineDotSize(prev => Math.max(prev - 1, 1));
  };

  // User data management functions
  const saveUserData = () => {
    try {
      localStorage.setItem('userBirthDate', birthDate);
      localStorage.setItem('userMaxAge', maxAge.toString());
      localStorage.setItem('timelineDotSize', timelineDotSize.toString());
      
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

  const addIncome = (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIncome = {
      ...incomeData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedIncomes = [...incomes, newIncome];
    setIncomes(updatedIncomes);
    localStorage.setItem('userIncomes', JSON.stringify(updatedIncomes));
    setShowAddIncomeModal(false);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense = {
      ...expenseData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('userExpenses', JSON.stringify(updatedExpenses));
    setShowAddExpenseModal(false);
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

  const removeIncome = (id: number) => {
    const updatedIncomes = incomes.filter(income => income.id !== id);
    setIncomes(updatedIncomes);
    localStorage.setItem('userIncomes', JSON.stringify(updatedIncomes));
  };

  const removeExpense = (id: number) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('userExpenses', JSON.stringify(updatedExpenses));
  };

  const editIncome = (income: Income) => {
    setEditingIncome(income);
    setShowEditIncomeModal(true);
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowEditExpenseModal(true);
  };

  const updateIncome = (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIncome) {
      const updatedIncome = {
        ...incomeData,
        id: editingIncome.id,
        createdAt: editingIncome.createdAt,
        updatedAt: new Date().toISOString()
      };
      const updatedIncomes = incomes.map(income => 
        income.id === editingIncome.id ? updatedIncome : income
      );
      setIncomes(updatedIncomes);
      localStorage.setItem('userIncomes', JSON.stringify(updatedIncomes));
      setShowEditIncomeModal(false);
      setEditingIncome(null);
    }
  };

  const updateExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      const updatedExpense = {
        ...expenseData,
        id: editingExpense.id,
        createdAt: editingExpense.createdAt,
        updatedAt: new Date().toISOString()
      };
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingExpense.id ? updatedExpense : expense
      );
      setExpenses(updatedExpenses);
      localStorage.setItem('userExpenses', JSON.stringify(updatedExpenses));
      setShowEditExpenseModal(false);
      setEditingExpense(null);
    }
  };

  const editAchievement = (achievement: any) => {
    setEditingAchievement(achievement);
    setShowEditAchievementModal(true);
  };

  const editGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowEditGoalModal(true);
  };

  const updateAchievement = (achievementData: any) => {
    if (editingAchievement) {
      const updatedAchievement = {
        ...achievementData,
        id: editingAchievement.id
      };
      const updatedAchievements = achievements.map(achievement => 
        achievement.id === editingAchievement.id ? updatedAchievement : achievement
      );
      setAchievements(updatedAchievements);
      localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
      setShowEditAchievementModal(false);
      setEditingAchievement(null);
    }
  };

  const updateGoal = (goalData: any) => {
    if (editingGoal) {
      const updatedGoal = {
        ...goalData,
        id: editingGoal.id
      };
      const updatedGoals = goals.map(goal => 
        goal.id === editingGoal.id ? updatedGoal : goal
      );
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      setShowEditGoalModal(false);
      setEditingGoal(null);
    }
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
        <HeaderMain
          incomes={incomes}
          expenses={expenses}
          goals={goals}
          showIncomeDrawer={showIncomeDrawer}
          showExpenseDrawer={showExpenseDrawer}
          showAchievementDrawer={showAchievementDrawer}
          showGoalDrawer={showGoalDrawer}
          showSaveSuccess={showSaveSuccess}
          showAddFriend={showAddFriend}
          setShowImportModal={setShowImportModal}
          setShowExportModal={setShowExportModal}
          setShowIncomeDrawer={setShowIncomeDrawer}
          setShowExpenseDrawer={setShowExpenseDrawer}
          setShowAchievementDrawer={setShowAchievementDrawer}
          setShowGoalDrawer={setShowGoalDrawer}
          setShowAddGoalModal={setShowAddGoalModal}
          setShowAddIncomeModal={setShowAddIncomeModal}
          setShowAddExpenseModal={setShowAddExpenseModal}
          removeIncome={removeIncome}
          removeExpense={removeExpense}
          editIncome={editIncome}
          editExpense={editExpense}
          editAchievement={editAchievement}
          editGoal={editGoal}
          removeAchievement={removeAchievement}
          removeGoal={removeGoal}
          saveUserData={saveUserData}
          birthDate={birthDate}
          maxAge={maxAge}
          currentAge={currentAge}
          detailedAge={detailedAge}
          newFriend={newFriend}
          setBirthDate={setBirthDate}
          setMaxAge={setMaxAge}
          achievements={achievements}
          friends={friends}
          timelineYears={timelineYears}
          currentYear={currentYear}
          lifePercentage={lifePercentage}
          addFriend={addFriend}
          removeFriend={removeFriend}
          setShowAddFriend={setShowAddFriend}
          setNewFriend={setNewFriend}
          timelineDotSize={timelineDotSize}
          increaseTimelineDotSize={increaseTimelineDotSize}
          decreaseTimelineDotSize={decreaseTimelineDotSize}
          handleTimelineDotClick={handleTimelineDotClick}
          setShowAddAchievementModal={setShowAddAchievementModal}
        />

        <WaterTankVisualization
          income={incomes.reduce((sum, income) => sum + income.amount, 0)}
          expenses={expenses.map(expense => ({ name: expense.title, amount: expense.amount }))}
          remainingBalance={incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)}
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

        {/* Main Content - Hidden on mobile */}
        <div className="hidden lg:block">
          <MainContent
            timelineYears={timelineYears}
            currentYear={currentYear}
            birthDate={birthDate}
            friends={friends}
            achievements={achievements}
            goals={goals}
            expenses={expenses}
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
            editAchievement={editAchievement}
            editGoal={editGoal}
            timelineDotSize={timelineDotSize}
            increaseTimelineDotSize={increaseTimelineDotSize}
            decreaseTimelineDotSize={decreaseTimelineDotSize}
          />
        </div>

        {/* Travel Map Section */}
        <TravelMapSection 
          travelLocations={travelLocations} 
          setShowAddTravelModal={setShowAddTravelModal} 
          isGoogleMapsLoaded={isGoogleMapsLoaded}
          removeTravelLocation={removeTravelLocation}
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
          hasModalOpen={showCalendarModal || showTodoModal || showEmotionModal || showAddActivityModal || showAddAchievementModal || showAddGoalModal || showAddIncomeModal || showAddExpenseModal || showEditIncomeModal || showEditExpenseModal || showEditAchievementModal || showEditGoalModal || showImportModal || showExportModal || showAddTravelModal}
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

        <AddIncomeModal 
          isOpen={showAddIncomeModal}
          onClose={() => setShowAddIncomeModal(false)}
          onAddIncome={addIncome}
        />

        <AddExpenseModal 
          isOpen={showAddExpenseModal}
          onClose={() => setShowAddExpenseModal(false)}
          onAddExpense={addExpense}
        />

        <AddIncomeModal 
          isOpen={showEditIncomeModal}
          onClose={() => {
            setShowEditIncomeModal(false);
            setEditingIncome(null);
          }}
          onAddIncome={updateIncome}
          editData={editingIncome || undefined}
        />

        <AddExpenseModal 
          isOpen={showEditExpenseModal}
          onClose={() => {
            setShowEditExpenseModal(false);
            setEditingExpense(null);
          }}
          onAddExpense={updateExpense}
          editData={editingExpense || undefined}
        />

        <AddAchievementModal 
          showAddAchievementModal={showEditAchievementModal}
          setShowAddAchievementModal={setShowEditAchievementModal}
          newAchievement={editingAchievement || {
            title: '',
            year: new Date().getFullYear(),
            category: 'education',
            icon: '🎓'
          }}
          setNewAchievement={(achievement: any) => {
            if (editingAchievement) {
              setEditingAchievement({ ...editingAchievement, ...achievement });
            }
          }}
          addAchievement={() => {
            if (editingAchievement) {
              updateAchievement(editingAchievement);
            }
          }}
          isEditMode={true}
        />

        <AddGoalModal 
          showAddGoalModal={showEditGoalModal}
          setShowAddGoalModal={setShowEditGoalModal}
          newGoal={editingGoal || {
            title: '',
            target: 0,
            current: 0,
            category: 'asset',
            icon: '💰'
          }}
          setNewGoal={(goal: any) => {
            if (editingGoal) {
              setEditingGoal({ ...editingGoal, ...goal });
            }
          }}
          addGoal={() => {
            if (editingGoal) {
              updateGoal(editingGoal);
            }
          }}
          isEditMode={true}
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
    </div>
  );
};

export default LifeTimelineApp;