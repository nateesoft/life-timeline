import { Activity, Achievement, Goal, Friend, FriendMessage, AppData } from '../types';

export class CsvManager {
  // Parse CSV string to array of objects
  static parseCsv(csvString: string): string[][] {
    const lines = csvString.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Simple CSV parsing - handles quoted strings
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      if (current) {
        values.push(current.trim());
      }
      
      return values;
    });
  }

  // Convert activities to CSV
  static activitiesToCsv(activities: Activity[]): string {
    if (!activities || activities.length === 0) return '';
    
    let csv = 'Name,Description,Display Type,Color,Background Color,Created At\n';
    
    activities.forEach(activity => {
      csv += `"${activity.name}","${activity.description}","${activity.displayType}","${activity.color}","${activity.backgroundColor}","${activity.createdAt}"\n`;
    });
    
    return csv;
  }

  // Convert CSV to activities
  static csvToActivities(csvString: string): Activity[] {
    const rows = this.parseCsv(csvString);
    if (rows.length < 2) return []; // No data rows
    
    const activities: Activity[] = [];
    const headers = rows[0];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      if (values.length >= 3) { // At least name, description, displayType
        const activity: Activity = {
          id: Date.now() + i,
          name: values[0] || '',
          description: values[1] || '',
          displayType: (values[2] as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'daily',
          color: values[3] || '#3B82F6',
          backgroundColor: values[4] || '#FEF3C7',
          position: { x: 100 + (i * 20), y: 100 + (i * 20) },
          createdAt: values[5] || new Date().toISOString()
        };
        activities.push(activity);
      }
    }
    
    return activities;
  }

  // Convert achievements to CSV
  static achievementsToCsv(achievements: Achievement[]): string {
    if (!achievements || achievements.length === 0) return '';
    
    let csv = 'Title,Year,Category,Icon\n';
    
    achievements.forEach(achievement => {
      csv += `"${achievement.title}","${achievement.year}","${achievement.category}","${achievement.icon}"\n`;
    });
    
    return csv;
  }

  // Convert CSV to achievements
  static csvToAchievements(csvString: string): Achievement[] {
    const rows = this.parseCsv(csvString);
    if (rows.length < 2) return [];
    
    const achievements: Achievement[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      if (values.length >= 4) {
        const achievement: Achievement = {
          id: Date.now() + i,
          title: values[0] || '',
          year: parseInt(values[1]) || new Date().getFullYear(),
          category: values[2] || 'general',
          icon: values[3] || '🏆'
        };
        achievements.push(achievement);
      }
    }
    
    return achievements;
  }

  // Convert goals to CSV
  static goalsToCsv(goals: Goal[]): string {
    if (!goals || goals.length === 0) return '';
    
    let csv = 'Title,Target,Current,Category,Icon\n';
    
    goals.forEach(goal => {
      csv += `"${goal.title}","${goal.target}","${goal.current}","${goal.category}","${goal.icon}"\n`;
    });
    
    return csv;
  }

  // Convert CSV to goals
  static csvToGoals(csvString: string): Goal[] {
    const rows = this.parseCsv(csvString);
    if (rows.length < 2) return [];
    
    const goals: Goal[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      if (values.length >= 5) {
        const goal: Goal = {
          id: Date.now() + i,
          title: values[0] || '',
          target: parseFloat(values[1]) || 0,
          current: parseFloat(values[2]) || 0,
          category: values[3] || 'general',
          icon: values[4] || '🎯'
        };
        goals.push(goal);
      }
    }
    
    return goals;
  }

  // Convert friends to CSV
  static friendsToCsv(friends: Friend[]): string {
    if (!friends || friends.length === 0) return '';
    
    let csv = 'Name,Birth Date,Color\n';
    
    friends.forEach(friend => {
      csv += `"${friend.name}","${friend.birthDate}","${friend.color}"\n`;
    });
    
    return csv;
  }

  // Convert CSV to friends
  static csvToFriends(csvString: string): Friend[] {
    const rows = this.parseCsv(csvString);
    if (rows.length < 2) return [];
    
    const friends: Friend[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      if (values.length >= 3) {
        const friend: Friend = {
          id: Date.now() + i,
          name: values[0] || '',
          birthDate: values[1] || '',
          color: values[2] || '#8B5CF6'
        };
        friends.push(friend);
      }
    }
    
    return friends;
  }

  // Convert friend messages to CSV
  static friendMessagesToCsv(messages: FriendMessage[]): string {
    if (!messages || messages.length === 0) return '';
    
    let csv = 'Message,From Name,From Avatar,Position X,Position Y,Created At\n';
    
    messages.forEach(message => {
      csv += `"${message.message}","${message.fromName}","${message.fromAvatar}","${message.position.x}","${message.position.y}","${message.createdAt}"\n`;
    });
    
    return csv;
  }

  // Convert CSV to friend messages
  static csvToFriendMessages(csvString: string): FriendMessage[] {
    const rows = this.parseCsv(csvString);
    if (rows.length < 2) return [];
    
    const messages: FriendMessage[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      if (values.length >= 6) {
        const message: FriendMessage = {
          id: Date.now() + i,
          message: values[0] || '',
          fromName: values[1] || '',
          fromAvatar: values[2] || '👤',
          position: {
            x: parseFloat(values[3]) || 100,
            y: parseFloat(values[4]) || 100
          },
          createdAt: values[5] || new Date().toISOString()
        };
        messages.push(message);
      }
    }
    
    return messages;
  }

  // Export multiple data types to CSV
  static exportToCsv(data: AppData): string {
    let csvContent = '';

    // Export Activities
    if (data.activities && data.activities.length > 0) {
      csvContent += '=== ACTIVITIES ===\n';
      csvContent += this.activitiesToCsv(data.activities);
      csvContent += '\n';
    }

    // Export Achievements
    if (data.achievements && data.achievements.length > 0) {
      csvContent += '=== ACHIEVEMENTS ===\n';
      csvContent += this.achievementsToCsv(data.achievements);
      csvContent += '\n';
    }

    // Export Goals
    if (data.goals && data.goals.length > 0) {
      csvContent += '=== GOALS ===\n';
      csvContent += this.goalsToCsv(data.goals);
      csvContent += '\n';
    }

    // Export Friends
    if (data.friends && data.friends.length > 0) {
      csvContent += '=== FRIENDS ===\n';
      csvContent += this.friendsToCsv(data.friends);
      csvContent += '\n';
    }

    // Export Friend Messages
    if (data.friendMessages && data.friendMessages.length > 0) {
      csvContent += '=== FRIEND MESSAGES ===\n';
      csvContent += this.friendMessagesToCsv(data.friendMessages);
      csvContent += '\n';
    }

    return csvContent;
  }

  // Import from CSV (auto-detect data type based on headers)
  static importFromCsv(csvString: string): Partial<AppData> {
    const sections = csvString.split('===').filter(section => section.trim());
    const result: Partial<AppData> = {};

    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length < 3) return; // Need at least section name, header, and one data row

      const sectionName = lines[0].trim();
      const dataContent = lines.slice(1).join('\n');

      switch (sectionName) {
        case 'ACTIVITIES':
          result.activities = this.csvToActivities(dataContent);
          break;
        case 'ACHIEVEMENTS':
          result.achievements = this.csvToAchievements(dataContent);
          break;
        case 'GOALS':
          result.goals = this.csvToGoals(dataContent);
          break;
        case 'FRIENDS':
          result.friends = this.csvToFriends(dataContent);
          break;
        case 'FRIEND MESSAGES':
          result.friendMessages = this.csvToFriendMessages(dataContent);
          break;
      }
    });

    // If no sections found, try to detect by headers
    if (Object.keys(result).length === 0) {
      const lines = csvString.split('\n');
      if (lines.length > 1) {
        const header = lines[0].toLowerCase();
        
        if (header.includes('name') && header.includes('description')) {
          result.activities = this.csvToActivities(csvString);
        } else if (header.includes('title') && header.includes('year')) {
          result.achievements = this.csvToAchievements(csvString);
        } else if (header.includes('target') && header.includes('current')) {
          result.goals = this.csvToGoals(csvString);
        } else if (header.includes('birth date')) {
          result.friends = this.csvToFriends(csvString);
        } else if (header.includes('message') && header.includes('from name')) {
          result.friendMessages = this.csvToFriendMessages(csvString);
        }
      }
    }

    return result;
  }

  // Validate CSV format
  static validateCsvFormat(csvString: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!csvString || csvString.trim().length === 0) {
      errors.push('ไฟล์ CSV ว่างเปล่า');
      return { isValid: false, errors };
    }

    const lines = csvString.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      errors.push('ไฟล์ CSV ต้องมีอย่างน้อย 2 บรรทัด (header และ data)');
      return { isValid: false, errors };
    }

    // Check if first line looks like a header
    const firstLine = lines[0];
    if (!firstLine.includes(',')) {
      errors.push('ไฟล์ CSV ต้องมี comma (,) เป็นตัวคั่น');
    }

    return { isValid: errors.length === 0, errors };
  }
}