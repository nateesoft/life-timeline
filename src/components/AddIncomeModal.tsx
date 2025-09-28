'use client';

import React, { useState, useEffect } from 'react';
import { Income } from '../types';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: Income;
}

const incomeTypeOptions = [
  { value: 'salary', label: 'เงินเดือน', icon: '💼' },
  { value: 'bonus', label: 'โบนัส', icon: '🎁' },
  { value: 'side_job', label: 'งานพิเศษ', icon: '💻' },
  { value: 'interest', label: 'ดอกเบี้ยเงินฝาก', icon: '🏦' },
  { value: 'investment', label: 'กำไรจากการลงทุน', icon: '📈' },
  { value: 'other', label: 'อื่นๆ', icon: '💰' }
];

const frequencyOptions = [
  { value: 'daily', label: 'ทุกวัน' },
  { value: 'weekly', label: 'ทุกสัปดาห์' },
  { value: 'monthly', label: 'ทุกเดือน' }
];

const weekDayOptions = [
  { value: 0, label: 'อาทิตย์' },
  { value: 1, label: 'จันทร์' },
  { value: 2, label: 'อังคาร' },
  { value: 3, label: 'พุธ' },
  { value: 4, label: 'พฤหัสบดี' },
  { value: 5, label: 'ศุกร์' },
  { value: 6, label: 'เสาร์' }
];

const monthOptions = [
  { value: 1, label: 'มกราคม' },
  { value: 2, label: 'กุมภาพันธ์' },
  { value: 3, label: 'มีนาคม' },
  { value: 4, label: 'เมษายน' },
  { value: 5, label: 'พฤษภาคม' },
  { value: 6, label: 'มิถุนายน' },
  { value: 7, label: 'กรกฎาคม' },
  { value: 8, label: 'สิงหาคม' },
  { value: 9, label: 'กันยายน' },
  { value: 10, label: 'ตุลาคม' },
  { value: 11, label: 'พฤศจิกายน' },
  { value: 12, label: 'ธันวาคม' }
];

export default function AddIncomeModal({ isOpen, onClose, onAddIncome, editData }: AddIncomeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    type: 'salary' as Income['type'],
    frequency: 'monthly' as Income['frequency'],
    isExpected: false,
    icon: '💼',
    schedulingOptions: {
      monthlyDay: 1,
      specificMonths: [] as number[],
      weeklyDay: 1,
      specificWeeks: [] as number[],
      dailyTime: '09:00'
    }
  });

  // Populate form data when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        amount: editData.amount,
        type: editData.type,
        frequency: editData.frequency,
        isExpected: editData.isExpected,
        icon: editData.icon,
        schedulingOptions: editData.schedulingOptions
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        amount: 0,
        type: 'salary' as Income['type'],
        frequency: 'monthly' as Income['frequency'],
        isExpected: false,
        icon: '💼',
        schedulingOptions: {
          monthlyDay: 1,
          specificMonths: [] as number[],
          weeklyDay: 1,
          specificWeeks: [] as number[],
          dailyTime: '09:00'
        }
      });
    }
  }, [editData, isOpen]);

  const handleTypeChange = (type: Income['type']) => {
    const selectedType = incomeTypeOptions.find(option => option.value === type);
    setFormData({
      ...formData,
      type,
      icon: selectedType?.icon || '💰'
    });
  };

  const handleSpecificMonthToggle = (month: number) => {
    const specificMonths = formData.schedulingOptions.specificMonths.includes(month)
      ? formData.schedulingOptions.specificMonths.filter(m => m !== month)
      : [...formData.schedulingOptions.specificMonths, month];
    
    setFormData({
      ...formData,
      schedulingOptions: {
        ...formData.schedulingOptions,
        specificMonths
      }
    });
  };

  const handleSpecificWeekToggle = (week: number) => {
    const specificWeeks = formData.schedulingOptions.specificWeeks.includes(week)
      ? formData.schedulingOptions.specificWeeks.filter(w => w !== week)
      : [...formData.schedulingOptions.specificWeeks, week];
    
    setFormData({
      ...formData,
      schedulingOptions: {
        ...formData.schedulingOptions,
        specificWeeks
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.amount > 0) {
      onAddIncome(formData);
      setFormData({
        title: '',
        amount: 0,
        type: 'salary',
        frequency: 'monthly',
        isExpected: false,
        icon: '💼',
        schedulingOptions: {
          monthlyDay: 1,
          specificMonths: [],
          weeklyDay: 1,
          specificWeeks: [],
          dailyTime: '09:00'
        }
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="mr-3">💰</span>
{editData ? 'แก้ไขรายรับ' : 'สร้างรายรับใหม่'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อรายรับ
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="เช่น เงินเดือนประจำ"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  จำนวนเงิน (บาท)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="50000"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Income Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ประเภทรายรับ
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {incomeTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTypeChange(option.value as Income['type'])}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.type === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300'
                    }`}
                  >
                    <span className="text-lg mr-2">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Income Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isExpected"
                checked={formData.isExpected}
                onChange={(e) => setFormData({ ...formData, isExpected: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isExpected" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                รายรับที่คาดว่าจะได้รับ (ไม่ใช่รายรับแน่นอน)
              </label>
            </div>

            {/* Frequency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ความถี่ในการรับ
              </label>
              <div className="grid grid-cols-3 gap-3">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: option.value as Income['frequency'] })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.frequency === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduling Options */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                ตั้งค่าการรับเงิน
              </h3>

              {formData.frequency === 'monthly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      รับทุกวันที่ (ของเดือน)
                    </label>
                    <select
                      value={formData.schedulingOptions.monthlyDay}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedulingOptions: {
                          ...formData.schedulingOptions,
                          monthlyDay: Number(e.target.value)
                        }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          วันที่ {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      เดือนที่ต้องการรับ (ไม่เลือก = ทุกเดือน)
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {monthOptions.map((month) => (
                        <button
                          key={month.value}
                          type="button"
                          onClick={() => handleSpecificMonthToggle(month.value)}
                          className={`p-2 rounded text-xs font-medium transition-all ${
                            formData.schedulingOptions.specificMonths.includes(month.value)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formData.frequency === 'weekly' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      รับทุกวัน
                    </label>
                    <select
                      value={formData.schedulingOptions.weeklyDay}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedulingOptions: {
                          ...formData.schedulingOptions,
                          weeklyDay: Number(e.target.value)
                        }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {weekDayOptions.map((day) => (
                        <option key={day.value} value={day.value}>
                          วัน{day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      สัปดาห์ที่ต้องการรับ (ไม่เลือก = ทุกสัปดาห์)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((week) => (
                        <button
                          key={week}
                          type="button"
                          onClick={() => handleSpecificWeekToggle(week)}
                          className={`p-2 rounded text-sm font-medium transition-all ${
                            formData.schedulingOptions.specificWeeks.includes(week)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                        >
                          สัปดาห์ที่ {week}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formData.frequency === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    เวลาที่รับ
                  </label>
                  <input
                    type="time"
                    value={formData.schedulingOptions.dailyTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedulingOptions: {
                        ...formData.schedulingOptions,
                        dailyTime: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
{editData ? 'อัปเดตรายรับ' : 'สร้างรายรับ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}