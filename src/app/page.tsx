'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Trophy, Target, Plus, Trash2, User } from 'lucide-react';
import GlobalStyles from '../components/GlobalStyles';

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

  const calculateDetailedAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    try {
      const birth = new Date(birthDateStr);
      const now = new Date();
      
      if (birth > now) return null;
      
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      let hours = now.getHours() - birth.getHours();
      let minutes = now.getMinutes() - birth.getMinutes();
      let seconds = now.getSeconds() - birth.getSeconds();
      
      // Adjust negative values
      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }
      
      return { years, months, days, hours, minutes, seconds };
    } catch (error) {
      return null;
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

      <GlobalStyles />

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto relative">
            {/* Save button */}
            <button
              onClick={saveUserData}
              className="absolute top-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
              title="บันทึกข้อมูล"
            >
              <svg className="w-4 h-4 transform transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>

            {/* Success message */}
            {showSaveSuccess && (
              <div className="absolute top-4 right-16 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">บันทึกแล้ว!</span>
              </div>
            )}

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
        )}

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

        {/* Todo Modal */}
        {showTodoModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-up"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">📝</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">สิ่งที่ต้องทำ</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">จัดการงานและภารกิจในชีวิต</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTodoModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Todo Sections */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today Section */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center">
                      <span className="text-xl mr-2">🔥</span>
                      วันนี้
                    </h4>
                    <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-800/50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todos.today.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีงานที่ต้องทำวันนี้</p>
                    ) : (
                      todos.today.map((todo) => (
                        <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                          <input type="checkbox" className="mr-2" />
                          <span className="flex-1 text-sm">{todo.text}</span>
                          <button className="p-1 text-red-500 hover:text-red-700">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tomorrow Section */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300 flex items-center">
                      <span className="text-xl mr-2">⏰</span>
                      พรุ่งนี้
                    </h4>
                    <button className="p-1 text-orange-500 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-800/50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todos.tomorrow.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีแผนสำหรับพรุ่งนี้</p>
                    ) : (
                      todos.tomorrow.map((todo) => (
                        <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                          <input type="checkbox" className="mr-2" />
                          <span className="flex-1 text-sm">{todo.text}</span>
                          <button className="p-1 text-orange-500 hover:text-orange-700">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2-3 Days Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                      <span className="text-xl mr-2">📅</span>
                      2-3 วัน
                    </h4>
                    <button className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todos.upcoming.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีแผนระยะสั้น</p>
                    ) : (
                      todos.upcoming.map((todo) => (
                        <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                          <input type="checkbox" className="mr-2" />
                          <span className="flex-1 text-sm">{todo.text}</span>
                          <button className="p-1 text-blue-500 hover:text-blue-700">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Monthly Section */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                      <span className="text-xl mr-2">🗓️</span>
                      รายเดือน
                    </h4>
                    <button className="p-1 text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {todos.monthly.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีเป้าหมายประจำเดือน</p>
                    ) : (
                      todos.monthly.map((todo) => (
                        <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                          <input type="checkbox" className="mr-2" />
                          <span className="flex-1 text-sm">{todo.text}</span>
                          <button className="p-1 text-purple-500 hover:text-purple-700">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    จัดการงานให้เป็นระบบ ชีวิตจะมีทิศทางชัดเจน
                  </p>
                  <button
                    onClick={() => setShowTodoModal(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emotion Modal */}
        {showEmotionModal && (
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
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
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
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            เพิ่มกิจกรรม
            <div className="absolute top-full right-3 border-t-4 border-t-black/80 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
          </div>
        </div>

        {/* Add Activity Modal */}
        {showAddActivityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-[modal_0.3s_ease-out_forwards]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">เพิ่มกิจกรรมใหม่</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">สร้าง post-it สำหรับติดตามกิจกรรมของคุณ</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อกิจกรรม</label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                    placeholder="เช่น ออกกำลังกาย, อ่านหนังสือ"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รายละเอียด</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    placeholder="รายละเอียดเพิ่มเติม..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">การแสดงผล</label>
                  <select
                    value={newActivity.displayType}
                    onChange={(e) => setNewActivity({...newActivity, displayType: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly'})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">ทุกวัน</option>
                    <option value="weekly">ทุกสัปดาห์</option>
                    <option value="monthly">ทุกเดือน</option>
                    <option value="yearly">ทุกปี</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สีขอบ</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewActivity({...newActivity, color})}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${newActivity.color === color ? 'border-gray-400 dark:border-gray-300 scale-110' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สีพื้นหลัง post-it</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { color: '#FEF3C7', name: 'เหลืองคลาสสิค' },
                      { color: '#FED7E2', name: 'ชมพูอ่อน' },
                      { color: '#E0F2FE', name: 'ฟ้าอ่อน' },
                      { color: '#DCFCE7', name: 'เขียวอ่อน' },
                      { color: '#F3E8FF', name: 'ม่วงอ่อน' },
                      { color: '#FFF7ED', name: 'ส้มอ่อน' },
                      { color: '#F1F5F9', name: 'เทาอ่อน' },
                      { color: '#FEFCE8', name: 'เหลืองอ่อน' }
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        onClick={() => setNewActivity({...newActivity, backgroundColor: color})}
                        className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all ${newActivity.backgroundColor === color ? 'border-gray-400 dark:border-gray-300 scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}
                        style={{ backgroundColor: color }}
                      >
                        <div className="w-8 h-6 rounded border border-gray-300/30 mb-1" style={{ backgroundColor: color }}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex gap-3">
                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addActivity}
                  disabled={!newActivity.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Post-its */}
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="absolute z-40 select-none post-it-container"
            style={{
              left: `${activity.position.x}px`,
              top: `${activity.position.y}px`,
              cursor: draggedActivity === activity.id ? 'grabbing' : 'grab'
            }}
          >
            <div 
              className="group p-4 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-200 hover:shadow-xl min-w-[200px] max-w-[250px] border-l-4 relative"
              style={{ 
                backgroundColor: activity.backgroundColor || '#FEF3C7',
                borderLeftColor: activity.color 
              }}
              onMouseDown={(e) => handleActivityMouseDown(e, activity)}
            >
              {/* Tape pieces */}
              {/* Top left tape */}
              <div className="absolute -top-2 left-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform -rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJ0YXBlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN0YXBlKSIvPgo8L3N2Zz4=')] opacity-30 rounded-sm"></div>
              </div>
              
              {/* Top right tape */}
              <div className="absolute -top-2 right-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJ0YXBlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN0YXBlKSIvPgo8L3N2Zz4=')] opacity-30 rounded-sm"></div>
              </div>

              {/* Bottom corner tape (randomly appears on some notes) */}
              {activity.id % 3 === 0 && (
                <div className="absolute -bottom-1 right-2 w-7 h-4 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-45 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-0.5 bg-white/40 rounded-full"></div>
                </div>
              )}

              {/* Left side tape (for some notes) */}
              {activity.id % 4 === 1 && (
                <div className="absolute -left-1 top-8 w-4 h-7 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-90 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                  <div className="absolute top-1 left-0.5 w-5 h-0.5 bg-white/40 rounded-full"></div>
                </div>
              )}
              {/* Post-it header */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800 text-sm leading-tight pr-2">{activity.name}</h4>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Post-it description */}
              {activity.description && (
                <p className="text-gray-700 text-xs mb-2 leading-relaxed">{activity.description}</p>
              )}

              {/* Post-it frequency */}
              <div className="flex items-center justify-between text-xs">
                <span 
                  className="px-2 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.displayType === 'daily' ? 'ทุกวัน' :
                   activity.displayType === 'weekly' ? 'ทุกสัปดาห์' :
                   activity.displayType === 'monthly' ? 'ทุกเดือน' : 'ทุกปี'}
                </span>
              </div>

              {/* Post-it shadow effect - moved behind tapes */}
              <div className="absolute inset-0 bg-black/10 rounded-lg transform translate-x-0.5 translate-y-0.5 -z-20"></div>
              
              {/* Tape shadows on the post-it surface */}
              <div className="absolute -top-1 left-5 w-6 h-2 bg-black/5 rounded-sm transform -rotate-12 blur-sm"></div>
              <div className="absolute -top-1 right-5 w-6 h-2 bg-black/5 rounded-sm transform rotate-12 blur-sm"></div>
            </div>
          </div>
        ))}

        {/* Friend Message Post-its */}
        {friendMessages.map((message) => (
          <div
            key={message.id}
            className="absolute z-40 select-none message-post-it-container"
            style={{
              left: `${message.position.x}px`,
              top: `${message.position.y}px`,
              cursor: draggedMessage === message.id ? 'grabbing' : 'grab'
            }}
          >
            <div 
              className="group p-4 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 transition-all duration-200 hover:shadow-xl min-w-[220px] max-w-[280px] relative"
              style={{ backgroundColor: '#DBEAFE' }} // น้ำเงินอ่อน
              onMouseDown={(e) => handleMessageMouseDown(e, message)}
            >
              {/* Tape pieces for friend messages */}
              <div className="absolute -top-2 left-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform -rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
              </div>
              
              <div className="absolute -top-2 right-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
              </div>

              {/* Message header with avatar and name */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl bg-white rounded-full p-1 shadow-sm">
                    {message.fromAvatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 text-sm">{message.fromName}</h4>
                    <div className="text-xs text-blue-600">แปะข้อความมา</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFriendMessage(message.id)}
                  className="text-blue-500 hover:text-red-500 transition-colors flex-shrink-0 opacity-70 hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Message content */}
              <div className="bg-white/50 rounded-lg p-3 mb-2">
                <p className="text-blue-900 text-sm leading-relaxed">{message.message}</p>
              </div>

              {/* Message timestamp */}
              <div className="flex justify-end text-xs text-blue-600 opacity-75">
                {new Date(message.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short'
                })}
              </div>

              {/* Post-it shadow effect */}
              <div className="absolute inset-0 bg-black/10 rounded-lg transform translate-x-0.5 translate-y-0.5 -z-20"></div>
              
              {/* Tape shadows on the post-it surface */}
              <div className="absolute -top-1 left-5 w-6 h-2 bg-black/5 rounded-sm transform -rotate-12 blur-sm"></div>
              <div className="absolute -top-1 right-5 w-6 h-2 bg-black/5 rounded-sm transform rotate-12 blur-sm"></div>
            </div>
          </div>
        ))}

        {/* Add Achievement Modal */}
        {showAddAchievementModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-[modal_0.3s_ease-out_forwards]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">เพิ่มความสำเร็จใหม่</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">บันทึกความสำเร็จที่ผ่านมา</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อความสำเร็จ</label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                    placeholder="เช่น จบการศึกษา, ได้งานแรก"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ปี</label>
                  <input
                    type="number"
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement({...newAchievement, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    min="1900"
                    max={new Date().getFullYear() + 10}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">หมวดหมู่</label>
                  <select
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="education">การศึกษา</option>
                    <option value="career">อาชีพ</option>
                    <option value="travel">การเดินทาง</option>
                    <option value="personal">ส่วนตัว</option>
                    <option value="health">สุขภาพ</option>
                    <option value="family">ครอบครัว</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ไอคอน</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['🎓', '💼', '✈️', '🏆', '💪', '❤️', '🎉', '⭐', '🚀', '🌟', '🎯', '💎'].map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewAchievement({...newAchievement, icon})}
                        className={`p-3 rounded-lg border-2 text-2xl transition-all hover:scale-110 ${newAchievement.icon === icon ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex gap-3">
                <button
                  onClick={() => setShowAddAchievementModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addAchievement}
                  disabled={!newAchievement.title.trim()}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  เพิ่มความสำเร็จ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-[modal_0.3s_ease-out_forwards]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">เพิ่มเป้าหมายใหม่</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ตั้งเป้าหมายในอนาคต</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อเป้าหมาย</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="เช่น ซื้อบ้าน, ออม 1 ล้าน"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">เป้าหมาย (บาท)</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                      min="0"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">มีอยู่แล้ว (บาท)</label>
                    <input
                      type="number"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({...newGoal, current: parseInt(e.target.value) || 0})}
                      min="0"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">หมวดหมู่</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="asset">ทรัพย์สิน</option>
                    <option value="savings">เงินออม</option>
                    <option value="investment">การลงทุน</option>
                    <option value="business">ธุรกิจ</option>
                    <option value="education">การศึกษา</option>
                    <option value="health">สุขภาพ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ไอคอน</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['💰', '🏠', '🚗', '💎', '📈', '🎓', '💼', '🏆', '🎯', '⭐', '🚀', '💪'].map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewGoal({...newGoal, icon})}
                        className={`p-3 rounded-lg border-2 text-2xl transition-all hover:scale-110 ${newGoal.icon === icon ? 'border-red-400 bg-red-50 dark:bg-red-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-red-300'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex gap-3">
                <button
                  onClick={() => setShowAddGoalModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  เพิ่มเป้าหมาย
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LifeTimelineApp;