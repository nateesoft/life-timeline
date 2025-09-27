import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editData?: Book;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  editData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    pages: 0,
    rating: 5,
    status: 'want_to_read' as Book['status'],
    startDate: '',
    finishDate: '',
    notes: '',
    cover: '',
    isbn: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        author: editData.author,
        genre: editData.genre,
        pages: editData.pages,
        rating: editData.rating,
        status: editData.status,
        startDate: editData.startDate || '',
        finishDate: editData.finishDate || '',
        notes: editData.notes || '',
        cover: editData.cover || '',
        isbn: editData.isbn || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        pages: 0,
        rating: 5,
        status: 'want_to_read',
        startDate: '',
        finishDate: '',
        notes: '',
        cover: '',
        isbn: ''
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.author.trim()) {
      onAddBook({
        ...formData,
        pages: Math.max(0, formData.pages),
        rating: Math.max(1, Math.min(5, formData.rating)),
        startDate: formData.startDate || undefined,
        finishDate: formData.finishDate || undefined,
        notes: formData.notes || undefined,
        cover: formData.cover || undefined,
        isbn: formData.isbn || undefined
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
              {editData ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}
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
                  ชื่อหนังสือ *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="ใส่ชื่อหนังสือ"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ผู้แต่ง *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="ใส่ชื่อผู้แต่ง"
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
                  <option value="นิยาย">นิยาย</option>
                  <option value="สารคดี">สารคดี</option>
                  <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
                  <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                  <option value="เทคโนโลยี">เทคโนโลยี</option>
                  <option value="ธุรกิจ">ธุรกิจ</option>
                  <option value="จิตวิทยา">จิตวิทยา</option>
                  <option value="ปรัชญา">ปรัชญา</option>
                  <option value="ศาสนา">ศาสนา</option>
                  <option value="ศิลปะ">ศิลปะ</option>
                  <option value="การเมือง">การเมือง</option>
                  <option value="ผจญภัย">ผจญภัย</option>
                  <option value="ลึกลับ">ลึกลับ</option>
                  <option value="โรแมนติก">โรแมนติก</option>
                  <option value="แฟนตาซี">แฟนตาซี</option>
                  <option value="วิทยาศาสตร์เรื่องสั้น">วิทยาศาสตร์เรื่องสั้น</option>
                  <option value="ชีวประวัติ">ชีวประวัติ</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {/* Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  จำนวนหน้า
                </label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="0"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="want_to_read">อยากอ่าน</option>
                  <option value="reading">กำลังอ่าน</option>
                  <option value="completed">อ่านเสร็จแล้ว</option>
                  <option value="dropped">หยุดอ่าน</option>
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

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่เริ่มอ่าน
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              {/* Finish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่อ่านเสร็จ
                </label>
                <input
                  type="date"
                  value={formData.finishDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, finishDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="978-0000000000"
                />
              </div>

              {/* Cover URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL ปกหนังสือ
                </label>
                <input
                  type="url"
                  value={formData.cover}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="https://example.com/book-cover.jpg"
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
                {editData ? 'บันทึก' : 'เพิ่มหนังสือ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;