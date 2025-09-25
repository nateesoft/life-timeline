import React, { useState } from 'react';
import { X, DollarSign, Calendar, Clock } from 'lucide-react';
import { Expense } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const expenseIcons = [
  '🏠', '🍕', '🚗', '💡', '🎮', '💳', '🏥', '📱', '🛒', '⛽', 
  '🎬', '📚', '👕', '✈️', '🍔', '☕', '🚌', '🏃', '💊', '🧾'
];

const expenseTypes = [
  { value: 'housing', label: 'ที่อยู่อาศัย' },
  { value: 'food', label: 'อาหาร' },
  { value: 'transportation', label: 'ค่าเดินทาง' },
  { value: 'utilities', label: 'สาธารณูปโภค' },
  { value: 'entertainment', label: 'บันเทิง' },
  { value: 'loan', label: 'เงินกู้/ผ่อนชำระ' },
  { value: 'insurance', label: 'ประกันภัย' },
  { value: 'other', label: 'อื่นๆ' }
];

export default function AddExpenseModal({ isOpen, onClose, onAddExpense }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<Expense['type']>('other');
  const [frequency, setFrequency] = useState<Expense['frequency']>('monthly');
  const [duration, setDuration] = useState<Expense['duration']>('ongoing');
  const [icon, setIcon] = useState('💸');
  
  // Scheduling options
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [specificMonths, setSpecificMonths] = useState<number[]>([]);
  const [dailyTime, setDailyTime] = useState('09:00');
  const [yearlyMonth, setYearlyMonth] = useState<number>(1);
  const [yearlyDay, setYearlyDay] = useState<number>(1);
  
  // Fixed term options
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPayments, setTotalPayments] = useState<number>(12);
  const [currentPayment, setCurrentPayment] = useState<number>(0);
  const [hasReward, setHasReward] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardIcon, setRewardIcon] = useState('🎁');
  const [completionDate, setCompletionDate] = useState('');

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const schedulingOptions: Expense['schedulingOptions'] = {};
    
    if (frequency === 'monthly') {
      schedulingOptions.monthlyDay = monthlyDay;
      if (specificMonths.length > 0) {
        schedulingOptions.specificMonths = specificMonths;
      }
    } else if (frequency === 'daily') {
      schedulingOptions.dailyTime = dailyTime;
    } else if (frequency === 'yearly') {
      schedulingOptions.yearlyMonth = yearlyMonth;
      schedulingOptions.yearlyDay = yearlyDay;
    }

    const newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      amount,
      type,
      frequency,
      duration,
      schedulingOptions,
      icon,
      ...(duration === 'fixed_term' && {
        fixedTermOptions: {
          startDate,
          endDate,
          totalPayments,
          currentPayment,
          ...(hasReward && {
            reward: {
              title: rewardTitle,
              description: rewardDescription,
              icon: rewardIcon,
              completionDate
            }
          })
        }
      })
    };

    onAddExpense(newExpense);
    
    // Reset form
    setTitle('');
    setAmount(0);
    setType('other');
    setFrequency('monthly');
    setDuration('ongoing');
    setIcon('💸');
    setMonthlyDay(1);
    setSpecificMonths([]);
    setDailyTime('09:00');
    setYearlyMonth(1);
    setYearlyDay(1);
    setStartDate('');
    setEndDate('');
    setTotalPayments(12);
    setCurrentPayment(0);
    setHasReward(false);
    setRewardTitle('');
    setRewardDescription('');
    setRewardIcon('🎁');
    setCompletionDate('');
    
    onClose();
  };

  const toggleMonth = (monthIndex: number) => {
    setSpecificMonths(prev => 
      prev.includes(monthIndex) 
        ? prev.filter(m => m !== monthIndex)
        : [...prev, monthIndex].sort()
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-red-500" />
            สร้างรายจ่าย
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ข้อมูลพื้นฐาน</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ชื่อรายจ่าย *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="เช่น ค่าเช่าบ้าน, ค่าน้ำ, ค่าไฟ"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  จำนวนเงิน (บาท) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภทรายจ่าย
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Expense['type'])}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {expenseTypes.map(expenseType => (
                    <option key={expenseType.value} value={expenseType.value}>
                      {expenseType.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Frequency and Duration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ความถี่และระยะเวลา</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ความถี่การจ่าย
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Expense['frequency'])}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="daily">รายวัน</option>
                  <option value="monthly">รายเดือน</option>
                  <option value="yearly">รายปี</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภทระยะเวลา
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as Expense['duration'])}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="ongoing">ต่อเนื่อง (เช่น ค่าน้ำ ค่าไฟ)</option>
                  <option value="fixed_term">มีกำหนด (เช่น ค่าผ่อนรถ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scheduling Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              กำหนดการจ่าย
            </h3>

            {frequency === 'monthly' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    วันที่ในเดือน
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={monthlyDay}
                    onChange={(e) => setMonthlyDay(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    เดือนที่เจาะจง (ถ้ามี)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {monthNames.map((month, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleMonth(index + 1)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          specificMonths.includes(index + 1)
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {frequency === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  เวลา
                </label>
                <input
                  type="time"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            )}

            {frequency === 'yearly' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    เดือน
                  </label>
                  <select
                    value={yearlyMonth}
                    onChange={(e) => setYearlyMonth(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    วันที่
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={yearlyDay}
                    onChange={(e) => setYearlyDay(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fixed Term Options */}
          {duration === 'fixed_term' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">รายละเอียดการจ่ายที่มีกำหนด</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    วันที่เริ่มต้น
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    วันที่สิ้นสุด
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    จำนวนงวดทั้งหมด
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalPayments}
                    onChange={(e) => setTotalPayments(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    งวดที่จ่ายไปแล้ว
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalPayments}
                    value={currentPayment}
                    onChange={(e) => setCurrentPayment(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Reward Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="hasReward"
                    checked={hasReward}
                    onChange={(e) => setHasReward(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasReward" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    มีรางวัลเมื่อจ่ายครบ (เช่น ได้รับรถเมื่อผ่อนครบ)
                  </label>
                </div>

                {hasReward && (
                  <div className="space-y-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ชื่อรางวัล
                      </label>
                      <input
                        type="text"
                        value={rewardTitle}
                        onChange={(e) => setRewardTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="เช่น รถยนต์ Honda Civic"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        รายละเอียดรางวัล
                      </label>
                      <textarea
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="รายละเอียดของรางวัลที่จะได้รับ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          วันที่คาดว่าจะได้รับ
                        </label>
                        <input
                          type="date"
                          value={completionDate}
                          onChange={(e) => setCompletionDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ไอคอนรางวัล
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          {['🎁', '🚗', '🏠', '💎', '🏆', '⭐', '🎉', '🎊', '🌟', '💝'].map((rewardIconOption) => (
                            <button
                              key={rewardIconOption}
                              type="button"
                              onClick={() => setRewardIcon(rewardIconOption)}
                              className={`p-2 text-lg border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                rewardIcon === rewardIconOption ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {rewardIconOption}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ไอคอน
            </label>
            <div className="grid grid-cols-10 gap-2">
              {expenseIcons.map((iconOption) => (
                <button
                  key={iconOption}
                  type="button"
                  onClick={() => setIcon(iconOption)}
                  className={`p-2 text-xl border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    icon === iconOption ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {iconOption}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              สร้างรายจ่าย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}