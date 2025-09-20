'use client';

import React from 'react';

interface NewAchievement {
  title: string;
  year: number;
  category: string;
  icon: string;
}

interface AddAchievementModalProps {
  showAddAchievementModal: boolean;
  setShowAddAchievementModal: (show: boolean) => void;
  newAchievement: NewAchievement;
  setNewAchievement: (achievement: NewAchievement) => void;
  addAchievement: () => void;
}

export default function AddAchievementModal({ 
  showAddAchievementModal, 
  setShowAddAchievementModal, 
  newAchievement, 
  setNewAchievement, 
  addAchievement 
}: AddAchievementModalProps) {
  if (!showAddAchievementModal) return null;

  return (
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
  );
}