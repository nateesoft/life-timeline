import React, { useState, useEffect } from 'react';
import { Sport } from '../types';

interface AddSportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSport: (sportData: Omit<Sport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: Sport;
}

const AddSportModal: React.FC<AddSportModalProps> = ({
  isOpen,
  onClose,
  onAddSport,
  editData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'individual' as Sport['type'],
    category: 'recreational' as Sport['category'],
    skillLevel: 'beginner' as Sport['skillLevel'],
    frequency: 'weekly' as Sport['frequency'],
    startDate: '',
    endDate: '',
    notes: '',
    achievements: [] as string[],
    equipment: [] as string[],
    location: '',
    teammates: [] as string[]
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newTeammate, setNewTeammate] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        type: editData.type,
        category: editData.category,
        skillLevel: editData.skillLevel,
        frequency: editData.frequency,
        startDate: editData.startDate,
        endDate: editData.endDate || '',
        notes: editData.notes || '',
        achievements: editData.achievements || [],
        equipment: editData.equipment || [],
        location: editData.location || '',
        teammates: editData.teammates || []
      });
    } else {
      setFormData({
        name: '',
        type: 'individual',
        category: 'recreational',
        skillLevel: 'beginner',
        frequency: 'weekly',
        startDate: '',
        endDate: '',
        notes: '',
        achievements: [],
        equipment: [],
        location: '',
        teammates: []
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.startDate) {
      onAddSport({
        ...formData,
        endDate: formData.endDate || undefined,
        notes: formData.notes || undefined,
        achievements: formData.achievements.length > 0 ? formData.achievements : undefined,
        equipment: formData.equipment.length > 0 ? formData.equipment : undefined,
        location: formData.location || undefined,
        teammates: formData.teammates.length > 0 ? formData.teammates : undefined
      });
      onClose();
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const addTeammate = () => {
    if (newTeammate.trim()) {
      setFormData(prev => ({
        ...prev,
        teammates: [...prev.teammates, newTeammate.trim()]
      }));
      setNewTeammate('');
    }
  };

  const removeTeammate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teammates: prev.teammates.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {editData ? 'แก้ไขกีฬา' : 'เพิ่มกีฬาใหม่'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อกีฬา *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="เช่น ฟุตบอล, วิ่ง, เทนนิส"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภท
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Sport['type'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="individual">กีฬาเดี่ยว</option>
                  <option value="team">กีฬาทีม</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  หมวดหมู่
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Sport['category'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="fitness">ออกกำลังกาย</option>
                  <option value="competitive">แข่งขัน</option>
                  <option value="recreational">นันทนาการ</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ระดับความสามารถ
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, skillLevel: e.target.value as Sport['skillLevel'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="beginner">เริ่มต้น</option>
                  <option value="intermediate">ปานกลาง</option>
                  <option value="advanced">ขั้นสูง</option>
                  <option value="expert">เชี่ยวชาญ</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ความถี่
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as Sport['frequency'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="daily">ทุกวัน</option>
                  <option value="weekly">ทุกสัปดาห์</option>
                  <option value="monthly">ทุกเดือน</option>
                  <option value="occasional">เป็นครั้งคราว</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่เริ่มเล่น *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่หยุดเล่น (ถ้ามี)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  สถานที่เล่น
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="เช่น สนามฟุตบอลหมู่บ้าน, ฟิตเนส, สวนลุมพินี"
                />
              </div>

              {/* Achievements */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  รางวัล/ความสำเร็จ
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="เช่น เหรียญทอง, ถ้วยรางวัล"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full"
                      >
                        {achievement}
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  อุปกรณ์ที่จำเป็น
                </label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="เช่น ลูกบอล, รองเท้า, แร็กเกต"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                    />
                    <button
                      type="button"
                      onClick={addEquipment}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeEquipment(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teammates - only show for team sports */}
              {formData.type === 'team' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    เพื่อนร่วมทีม
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTeammate}
                        onChange={(e) => setNewTeammate(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="ชื่อเพื่อนร่วมทีม"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeammate())}
                      />
                      <button
                        type="button"
                        onClick={addTeammate}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        เพิ่ม
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.teammates.map((teammate, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full"
                        >
                          {teammate}
                          <button
                            type="button"
                            onClick={() => removeTeammate(index)}
                            className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  หมายเหตุ
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                  placeholder="บันทึกข้อมูลเพิ่มเติม เช่น เหตุผลที่หยุดเล่น หรือความทรงจำดีๆ"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                {editData ? 'บันทึก' : 'เพิ่มกีฬา'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSportModal;