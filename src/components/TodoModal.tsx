'use client';

import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoModalProps {
  showTodoModal: boolean;
  setShowTodoModal: (show: boolean) => void;
  todos: {
    today: Todo[];
    tomorrow: Todo[];
    upcoming: Todo[];
    monthly: Todo[];
  };
}

export default function TodoModal({ showTodoModal, setShowTodoModal, todos }: TodoModalProps) {
  if (!showTodoModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-up"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-3">📝</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">สิ่งที่ต้องทำ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">จัดการงานและภารกิจในชีวิต</p>
            </div>
          </div>
          <button
            onClick={() => setShowTodoModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Todo Sections */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today Section */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center">
                <span className="text-xl mr-2">🔥</span>
                วันนี้
              </h4>
              <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-800/50 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.today.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีงานที่ต้องทำวันนี้</p>
              ) : (
                todos.today.map((todo) => (
                  <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <input type="checkbox" className="mr-2" />
                    <span className="flex-1 text-sm">{todo.text}</span>
                    <button className="p-1 text-red-500 hover:text-red-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tomorrow Section */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-orange-700 dark:text-orange-300 flex items-center">
                <span className="text-xl mr-2">⏰</span>
                พรุ่งนี้
              </h4>
              <button className="p-1 text-orange-500 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-800/50 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.tomorrow.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีแผนสำหรับพรุ่งนี้</p>
              ) : (
                todos.tomorrow.map((todo) => (
                  <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <input type="checkbox" className="mr-2" />
                    <span className="flex-1 text-sm">{todo.text}</span>
                    <button className="p-1 text-orange-500 hover:text-orange-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2-3 Days Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                <span className="text-xl mr-2">📅</span>
                2-3 วัน
              </h4>
              <button className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.upcoming.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีแผนระยะสั้น</p>
              ) : (
                todos.upcoming.map((todo) => (
                  <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <input type="checkbox" className="mr-2" />
                    <span className="flex-1 text-sm">{todo.text}</span>
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monthly Section */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                <span className="text-xl mr-2">🗓️</span>
                รายเดือน
              </h4>
              <button className="p-1 text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.monthly.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">ยังไม่มีเป้าหมายประจำเดือน</p>
              ) : (
                todos.monthly.map((todo) => (
                  <div key={todo.id} className="flex items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <input type="checkbox" className="mr-2" />
                    <span className="flex-1 text-sm">{todo.text}</span>
                    <button className="p-1 text-purple-500 hover:text-purple-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              จัดการงานให้เป็นระบบ ชีวิตจะมีทิศทางชัดเจน
            </p>
            <button
              onClick={() => setShowTodoModal(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}