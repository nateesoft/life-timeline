import React, { useState, useEffect } from 'react';
import { Movie } from '../types';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (movieData: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: Movie;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  isOpen,
  onClose,
  onAddMovie,
  editData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: '',
    year: new Date().getFullYear(),
    duration: 0,
    rating: 5,
    status: 'want_to_watch' as Movie['status'],
    watchDate: '',
    notes: '',
    poster: '',
    imdbId: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        director: editData.director,
        genre: editData.genre,
        year: editData.year,
        duration: editData.duration,
        rating: editData.rating,
        status: editData.status,
        watchDate: editData.watchDate || '',
        notes: editData.notes || '',
        poster: editData.poster || '',
        imdbId: editData.imdbId || ''
      });
    } else {
      setFormData({
        title: '',
        director: '',
        genre: '',
        year: new Date().getFullYear(),
        duration: 0,
        rating: 5,
        status: 'want_to_watch',
        watchDate: '',
        notes: '',
        poster: '',
        imdbId: ''
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.director.trim()) {
      onAddMovie({
        ...formData,
        year: Math.max(1900, Math.min(new Date().getFullYear() + 5, formData.year)),
        duration: Math.max(0, formData.duration),
        rating: Math.max(1, Math.min(5, formData.rating)),
        watchDate: formData.watchDate || undefined,
        notes: formData.notes || undefined,
        poster: formData.poster || undefined,
        imdbId: formData.imdbId || undefined
      });
      onClose();
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {editData ? 'แก้ไขหนัง' : 'เพิ่มหนังใหม่'}
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
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อหนัง *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="ใส่ชื่อหนัง"
                  required
                />
              </div>

              {/* Director */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ผู้กำกับ *
                </label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="ใส่ชื่อผู้กำกับ"
                  required
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภท
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="แอคชั่น">แอคชั่น</option>
                  <option value="ผจญภัย">ผจญภัย</option>
                  <option value="แอนิเมชั่น">แอนิเมชั่น</option>
                  <option value="ชีวประวัติ">ชีวประวัติ</option>
                  <option value="คอมเมดี้">คอมเมดี้</option>
                  <option value="อาชญากรรม">อาชญากรรม</option>
                  <option value="สารคดี">สารคดี</option>
                  <option value="ดราม่า">ดราม่า</option>
                  <option value="ครอบครัว">ครอบครัว</option>
                  <option value="แฟนตาซี">แฟนตาซี</option>
                  <option value="ฟิล์มนัวร์">ฟิล์มนัวร์</option>
                  <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
                  <option value="สยองขวัญ">สยองขวัญ</option>
                  <option value="ดนตรี">ดนตรี</option>
                  <option value="ลึกลับ">ลึกลับ</option>
                  <option value="โรแมนติก">โรแมนติก</option>
                  <option value="วิทยาศาสตร์เรื่องสั้น">วิทยาศาสตร์เรื่องสั้น</option>
                  <option value="กีฬา">กีฬา</option>
                  <option value="ระทึกขวัญ">ระทึกขวัญ</option>
                  <option value="สงคราม">สงคราม</option>
                  <option value="เวสเทิร์น">เวสเทิร์น</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ปีที่ออกฉาย
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ความยาว (นาที)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="120"
                  min="0"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  สถานะ
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Movie['status'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="want_to_watch">อยากดู</option>
                  <option value="watching">กำลังดู</option>
                  <option value="completed">ดูเสร็จแล้ว</option>
                  <option value="dropped">หยุดดู</option>
                </select>
              </div>

              {/* Rating */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  คะแนน (1-5 ดาว)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl ${
                        star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({formData.rating}/5)
                  </span>
                </div>
              </div>

              {/* Watch Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่ดู
                </label>
                <input
                  type="date"
                  value={formData.watchDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, watchDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              {/* IMDB ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IMDB ID
                </label>
                <input
                  type="text"
                  value={formData.imdbId}
                  onChange={(e) => setFormData(prev => ({ ...prev, imdbId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="tt0000000"
                />
              </div>

              {/* Poster URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL โปสเตอร์
                </label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData(prev => ({ ...prev, poster: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="https://example.com/movie-poster.jpg"
                />
              </div>

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
                  placeholder="บันทึกความคิดเห็นหรือข้อมูลเพิ่มเติม..."
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
                {editData ? 'บันทึก' : 'เพิ่มหนัง'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;