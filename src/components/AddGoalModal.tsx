'use client';

import React from 'react';

interface NewGoal {
  title: string;
  target: number;
  current: number;
  category: string;
  icon: string;
}

interface AddGoalModalProps {
  showAddGoalModal: boolean;
  setShowAddGoalModal: (show: boolean) => void;
  newGoal: NewGoal;
  setNewGoal: (goal: NewGoal) => void;
  addGoal: () => void;
}

export default function AddGoalModal({ 
  showAddGoalModal, 
  setShowAddGoalModal, 
  newGoal, 
  setNewGoal, 
  addGoal 
}: AddGoalModalProps) {
  if (!showAddGoalModal) return null;

  return (
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
  );
}