'use client';

import React, { useState } from 'react';
import { toBuddhistYear } from '../utils/ageCalculations';

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

interface PersonData {
  name: string;
  birthDate: string;
  color: string;
}

interface CalendarModalProps {
  showCalendarModal: boolean;
  selectedYear: number | null;
  selectedPersonData: PersonData | null;
  currentYear: number;
  setShowCalendarModal: (show: boolean) => void;
  getActivitiesForMonth: (year: number, monthIndex: number) => Activity[];
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  showCalendarModal,
  selectedYear,
  selectedPersonData,
  currentYear,
  setShowCalendarModal,
  getActivitiesForMonth
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showDailyView, setShowDailyView] = useState(false);

  // Handle month click
  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setShowDailyView(true);
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      // setSelectedYear(selectedYear! - 1); // Can't change year from within modal
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth! - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      // setSelectedYear(selectedYear! + 1); // Can't change year from within modal
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth! + 1);
    }
  };

  // Generate days for selected month
  const getDaysInMonth = (year: number, month: number) => {
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

  // Reset state when modal closes
  const handleCloseModal = () => {
    setShowCalendarModal(false);
    setShowDailyView(false);
    setSelectedMonth(null);
  };

  if (!showCalendarModal || !selectedYear || !selectedPersonData) {
    return null;
  }

  return (
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
                ปี พ.ศ. {toBuddhistYear(selectedYear)}
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
              onClick={handleCloseModal}
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
                        {monthActivities.slice(0, 3).map((activity) => (
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
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][selectedMonth!]} พ.ศ. {toBuddhistYear(selectedYear)}
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
                {getDaysInMonth(selectedYear, selectedMonth!).map((day, index) => {
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
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">ข้อมูลปี พ.ศ. {toBuddhistYear(selectedYear)}</h4>
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
            onClick={handleCloseModal}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;