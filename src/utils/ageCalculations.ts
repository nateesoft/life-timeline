export const calculateAge = (birthDateStr: string): number => {
  if (!birthDateStr) return 0;
  try {
    const birth = new Date(birthDateStr);
    const today = new Date();
    const ageInMs = today.getTime() - birth.getTime();
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  } catch (error) {
    return 0;
  }
};

export const calculateDetailedAge = (birthDateStr: string) => {
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

export const toBuddhistYear = (gregorianYear: number): number => {
  return gregorianYear + 543;
};

export const isPersonAliveInYear = (personBirthDate: string, year: number, personMaxAge: number = 90): boolean => {
  if (!personBirthDate) return false;
  try {
    const birthYear = new Date(personBirthDate).getFullYear();
    const deathYear = birthYear + personMaxAge;
    return year >= birthYear && year <= deathYear;
  } catch (error) {
    return false;
  }
};

export const getCurrentYear = (personBirthDate: string): number => {
  if (!personBirthDate) return new Date().getFullYear();
  try {
    const birthYear = new Date(personBirthDate).getFullYear();
    const age = calculateAge(personBirthDate);
    return birthYear + age;
  } catch (error) {
    return new Date().getFullYear();
  }
};

export const getTimelineYears = (birthDate: string, friends: Array<{birthDate?: string}> = [], maxAge: number = 90): number[] => {
  if (!birthDate) return [];
  
  try {
    const allPeople = [
      { birthDate },
      ...friends.filter(f => f.birthDate).map(f => ({ birthDate: f.birthDate! }))
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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH').format(amount);
};