'use client';

import React from 'react';

interface NewActivity {
  name: string;
  description: string;
  displayType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color: string;
  backgroundColor: string;
}

interface AddActivityModalProps {
  showAddActivityModal: boolean;
  setShowAddActivityModal: (show: boolean) => void;
  newActivity: NewActivity;
  setNewActivity: (activity: NewActivity) => void;
  addActivity: () => void;
}

export default function AddActivityModal({ 
  showAddActivityModal, 
  setShowAddActivityModal, 
  newActivity, 
  setNewActivity, 
  addActivity 
}: AddActivityModalProps) {
  if (!showAddActivityModal) return null;

  return (
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
  );
}