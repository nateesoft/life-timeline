import { User, Download, Upload, Calendar, Plus, Trash2 } from 'lucide-react';
import { calculateAge, toBuddhistYear, isPersonAliveInYear, getCurrentYear, formatCurrency } from '../utils/ageCalculations';
import WaterTankVisualization from './WaterTankVisualization';

interface Income {
  id: number;
  title: string;
  amount: number;
  type: string;
  icon: string;
}

interface Achievement {
  id: number;
  title: string;
  year: number;
  category: string;
  icon: string;
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  type: string;
  icon: string;
}

interface Friend {
  id: number;
  name: string;
  birthDate: string;
  color: string;
}

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  category: string;
  icon: string;
}

interface NewFriend {
  name: string;
  birthDate: string;
  color: number;
}

interface HeaderMainProps {
  incomes: Income[];
  expenses: Expense[];
  goals: Goal[];
  showIncomeDrawer: boolean;
  showExpenseDrawer: boolean;
  showAchievementDrawer: boolean;
  showGoalDrawer: boolean;
  showSaveSuccess: boolean;
  showAddFriend: boolean;
  setShowImportModal: (show: boolean) => void;
  setShowExportModal: (show: boolean) => void;
  setShowIncomeDrawer: (show: boolean) => void;
  setShowExpenseDrawer: (show: boolean) => void;
  setShowAchievementDrawer: (show: boolean) => void;
  setShowGoalDrawer: (show: boolean) => void;
  setShowAddGoalModal: (show: boolean) => void;
  saveUserData: () => void;
  birthDate: string;
  maxAge: number;
  currentAge: number;
  detailedAge: any;
  newFriend: NewFriend;
  setBirthDate: (bd: string) => void;
  setMaxAge: (maxAge: number) => void;
  achievements: Achievement[];
  friends: Friend[];
  timelineYears: number[];
  currentYear: number;
  lifePercentage: number;
}

export default function HeaderMain({ 
  incomes, 
  expenses,
  goals,
  showIncomeDrawer, 
  showExpenseDrawer,
  showAchievementDrawer,
  showGoalDrawer,
  showSaveSuccess,
  showAddFriend,
  setShowImportModal,
  setShowExportModal,
  setShowIncomeDrawer,
  setShowExpenseDrawer,
  setShowAchievementDrawer,
  setShowGoalDrawer,
  setShowAddGoalModal,
  saveUserData,
  birthDate,
  maxAge,
  currentAge,
  detailedAge,
  newFriend,
  setBirthDate,
  setMaxAge,
  achievements,
  friends,
  timelineYears,
  currentYear,
  lifePercentage
 }: HeaderMainProps) {
  return (
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
              
              {/* Water Tank Visualization */}
              <div className="mt-6">
                <WaterTankVisualization
                  income={incomes.reduce((sum, income) => sum + income.amount, 0)}
                  expenses={expenses.map(expense => ({ name: expense.title, amount: expense.amount }))}
                  remainingBalance={incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)}
                />
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
                
                {/* Water Tank Visualization */}
                <div className="mt-6">
                  <WaterTankVisualization
                    income={incomes.reduce((sum, income) => sum + income.amount, 0)}
                    expenses={expenses.map(expense => ({ name: expense.title, amount: expense.amount }))}
                    remainingBalance={incomes.reduce((sum, income) => sum + income.amount, 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0)}
                  />
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
  );
}