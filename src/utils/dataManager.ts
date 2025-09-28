import { AppData, UserProfile, Activity, Achievement, Goal, Friend, FriendMessage, TodoCollection, EmotionData } from '../types';

export class DataManager {
  // Get all current localStorage data
  static getCurrentAppData(): AppData {
    try {
      // Get user profile
      const userProfile: UserProfile = {
        birthDate: localStorage.getItem('userBirthDate') || '',
        maxAge: parseInt(localStorage.getItem('userMaxAge') || '80')
      };

      // Get activities
      const activitiesData = localStorage.getItem('lifeTimelineActivities');
      const activities: Activity[] = activitiesData ? JSON.parse(activitiesData) : [];

      // Get achievements
      const achievementsData = localStorage.getItem('userAchievements');
      const achievements: Achievement[] = achievementsData ? JSON.parse(achievementsData) : [];

      // Get goals
      const goalsData = localStorage.getItem('userGoals');
      const goals: Goal[] = goalsData ? JSON.parse(goalsData) : [];

      // Get friends
      const friendsData = localStorage.getItem('userFriends');
      const friends: Friend[] = friendsData ? JSON.parse(friendsData) : [];

      // Get friend messages
      const friendMessagesData = localStorage.getItem('friendMessages');
      const friendMessages: FriendMessage[] = friendMessagesData ? JSON.parse(friendMessagesData) : [];

      // Get todos
      const todosData = localStorage.getItem('userTodos');
      const todos: TodoCollection = todosData ? JSON.parse(todosData) : {
        today: [],
        tomorrow: [],
        upcoming: [],
        monthly: []
      };

      // Get today emotion
      const emotionData = localStorage.getItem('todayEmotion');
      const todayEmotion: EmotionData | null = emotionData ? JSON.parse(emotionData) : null;

      return {
        userProfile,
        activities,
        achievements,
        goals,
        friends,
        friendMessages,
        todos,
        todayEmotion,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error getting current app data:', error);
      throw new Error('ไม่สามารถอ่านข้อมูลปัจจุบันได้');
    }
  }

  // Import data and update localStorage
  static importAppData(data: AppData): void {
    try {
      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error('ข้อมูลไม่ถูกต้อง');
      }

      // Import user profile
      if (data.userProfile) {
        if (data.userProfile.birthDate) {
          localStorage.setItem('userBirthDate', data.userProfile.birthDate);
        }
        if (data.userProfile.maxAge) {
          localStorage.setItem('userMaxAge', data.userProfile.maxAge.toString());
        }
      }

      // Import activities
      if (data.activities && Array.isArray(data.activities)) {
        localStorage.setItem('lifeTimelineActivities', JSON.stringify(data.activities));
      }

      // Import achievements
      if (data.achievements && Array.isArray(data.achievements)) {
        localStorage.setItem('userAchievements', JSON.stringify(data.achievements));
      }

      // Import goals
      if (data.goals && Array.isArray(data.goals)) {
        localStorage.setItem('userGoals', JSON.stringify(data.goals));
      }

      // Import friends
      if (data.friends && Array.isArray(data.friends)) {
        localStorage.setItem('userFriends', JSON.stringify(data.friends));
      }

      // Import friend messages
      if (data.friendMessages && Array.isArray(data.friendMessages)) {
        localStorage.setItem('friendMessages', JSON.stringify(data.friendMessages));
      }

      // Import todos
      if (data.todos && typeof data.todos === 'object') {
        localStorage.setItem('userTodos', JSON.stringify(data.todos));
      }

      // Import today emotion
      if (data.todayEmotion) {
        localStorage.setItem('todayEmotion', JSON.stringify(data.todayEmotion));
      }

    } catch (error) {
      console.error('Error importing app data:', error);
      throw new Error('ไม่สามารถนำเข้าข้อมูลได้');
    }
  }

  // Create backup of current data
  static createBackup(): string {
    try {
      const currentData = this.getCurrentAppData();
      return JSON.stringify(currentData, null, 2);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('ไม่สามารถสร้างไฟล์สำรองข้อมูลได้');
    }
  }

  // Restore from backup
  static restoreFromBackup(backupData: string): void {
    try {
      const data = JSON.parse(backupData);
      this.importAppData(data);
    } catch (error) {
      console.error('Error restoring from backup:', error);
      throw new Error('ไม่สามารถกู้คืนข้อมูลจากไฟล์สำรองได้');
    }
  }

  // Clear all localStorage data
  static clearAllData(): void {
    const keys = [
      'userBirthDate',
      'userMaxAge',
      'lifeTimelineActivities',
      'userAchievements',
      'userGoals',
      'userFriends',
      'friendMessages',
      'userTodos',
      'todayEmotion'
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Validate imported data structure
  static validateAppData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('ข้อมูลไม่ถูกต้อง');
      return { isValid: false, errors };
    }

    const dataObj = data as Record<string, any>;

    // Check user profile
    if (!dataObj.userProfile || typeof dataObj.userProfile !== 'object') {
      errors.push('ไม่พบข้อมูลผู้ใช้');
    } else {
      if (!dataObj.userProfile.birthDate || typeof dataObj.userProfile.birthDate !== 'string') {
        errors.push('ไม่พบวันเกิดของผู้ใช้');
      }
      if (!dataObj.userProfile.maxAge || typeof dataObj.userProfile.maxAge !== 'number') {
        errors.push('ไม่พบอายุสูงสุดของผู้ใช้');
      }
    }

    // Check arrays
    const arrayFields = ['activities', 'achievements', 'goals', 'friends', 'friendMessages'];
    arrayFields.forEach(field => {
      if (dataObj[field] && !Array.isArray(dataObj[field])) {
        errors.push(`ข้อมูล ${field} ไม่ถูกต้อง`);
      }
    });

    // Check todos structure
    if (dataObj.todos && typeof dataObj.todos === 'object') {
      const todoCategories = ['today', 'tomorrow', 'upcoming', 'monthly'];
      todoCategories.forEach(category => {
        if (dataObj.todos[category] && !Array.isArray(dataObj.todos[category])) {
          errors.push(`ข้อมูล todos.${category} ไม่ถูกต้อง`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  // Merge imported data with existing data
  static mergeAppData(importedData: AppData, mergeOptions: {
    replaceExisting: boolean;
    preserveIds: boolean;
  } = { replaceExisting: false, preserveIds: true }): AppData {
    try {
      const currentData = this.getCurrentAppData();
      
      if (mergeOptions.replaceExisting) {
        return importedData;
      }

      // Merge activities
      const mergedActivities = [...currentData.activities];
      if (importedData.activities) {
        importedData.activities.forEach(importedActivity => {
          const existingIndex = mergedActivities.findIndex(a => a.id === importedActivity.id);
          if (existingIndex === -1) {
            // Add new activity with new ID if preserveIds is false
            const newActivity = mergeOptions.preserveIds 
              ? importedActivity 
              : { ...importedActivity, id: Date.now() + Math.random() };
            mergedActivities.push(newActivity);
          }
        });
      }

      // Similar merging logic for other data types
      const mergedAchievements = [...currentData.achievements];
      if (importedData.achievements) {
        importedData.achievements.forEach(item => {
          const existingIndex = mergedAchievements.findIndex(a => a.id === item.id);
          if (existingIndex === -1) {
            const newItem = mergeOptions.preserveIds 
              ? item 
              : { ...item, id: Date.now() + Math.random() };
            mergedAchievements.push(newItem);
          }
        });
      }

      const mergedGoals = [...currentData.goals];
      if (importedData.goals) {
        importedData.goals.forEach(item => {
          const existingIndex = mergedGoals.findIndex(g => g.id === item.id);
          if (existingIndex === -1) {
            const newItem = mergeOptions.preserveIds 
              ? item 
              : { ...item, id: Date.now() + Math.random() };
            mergedGoals.push(newItem);
          }
        });
      }

      const mergedFriends = [...currentData.friends];
      if (importedData.friends) {
        importedData.friends.forEach(item => {
          const existingIndex = mergedFriends.findIndex(f => f.id === item.id);
          if (existingIndex === -1) {
            const newItem = mergeOptions.preserveIds 
              ? item 
              : { ...item, id: Date.now() + Math.random() };
            mergedFriends.push(newItem);
          }
        });
      }

      const mergedFriendMessages = [...currentData.friendMessages];
      if (importedData.friendMessages) {
        importedData.friendMessages.forEach(item => {
          const existingIndex = mergedFriendMessages.findIndex(m => m.id === item.id);
          if (existingIndex === -1) {
            const newItem = mergeOptions.preserveIds 
              ? item 
              : { ...item, id: Date.now() + Math.random() };
            mergedFriendMessages.push(newItem);
          }
        });
      }

      return {
        userProfile: importedData.userProfile || currentData.userProfile,
        activities: mergedActivities,
        achievements: mergedAchievements,
        goals: mergedGoals,
        friends: mergedFriends,
        friendMessages: mergedFriendMessages,
        todos: importedData.todos || currentData.todos,
        todayEmotion: importedData.todayEmotion || currentData.todayEmotion,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error merging app data:', error);
      throw new Error('ไม่สามารถรวมข้อมูลได้');
    }
  }
}