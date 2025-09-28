'use client';

import React, { useState } from 'react';
import { X, Download, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { ExportOptions, ExportFileType, AppData } from '../types';

interface FileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
}

const FileExportModal: React.FC<FileExportModalProps> = ({ isOpen, onClose, appData }) => {
  const [exportType, setExportType] = useState<ExportFileType>('json');
  const [isLoading, setIsLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeActivities: true,
    includeAchievements: true,
    includeGoals: true,
    includeFriends: true,
    includeFriendMessages: true,
    includeTodos: true,
    includeEmotions: true,
    includeUserProfile: true,
  });

  const handleOptionChange = (option: keyof ExportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const generateFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    return `life-timeline-backup-${date}.${exportType}`;
  };

  const filterDataByOptions = (data: AppData): Partial<AppData> => {
    const filteredData: Partial<AppData> = {
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    if (exportOptions.includeUserProfile) {
      filteredData.userProfile = data.userProfile;
    }

    if (exportOptions.includeActivities) {
      filteredData.activities = data.activities;
    }

    if (exportOptions.includeAchievements) {
      filteredData.achievements = data.achievements;
    }

    if (exportOptions.includeGoals) {
      filteredData.goals = data.goals;
    }

    if (exportOptions.includeFriends) {
      filteredData.friends = data.friends;
    }

    if (exportOptions.includeFriendMessages) {
      filteredData.friendMessages = data.friendMessages;
    }

    if (exportOptions.includeTodos) {
      filteredData.todos = data.todos;
    }

    if (exportOptions.includeEmotions) {
      filteredData.todayEmotion = data.todayEmotion;
    }

    return filteredData;
  };

  const exportAsJson = () => {
    const filteredData = filterDataByOptions(appData);
    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsCsv = () => {
    let csvContent = '';

    // Export Activities as CSV
    if (exportOptions.includeActivities && appData.activities.length > 0) {
      csvContent += 'Activities\n';
      csvContent += 'Name,Description,Display Type,Color,Background Color,Created At\n';
      appData.activities.forEach(activity => {
        csvContent += `"${activity.name}","${activity.description}","${activity.displayType}","${activity.color}","${activity.backgroundColor}","${activity.createdAt}"\n`;
      });
      csvContent += '\n';
    }

    // Export Achievements as CSV
    if (exportOptions.includeAchievements && appData.achievements.length > 0) {
      csvContent += 'Achievements\n';
      csvContent += 'Title,Year,Category,Icon\n';
      appData.achievements.forEach(achievement => {
        csvContent += `"${achievement.title}","${achievement.year}","${achievement.category}","${achievement.icon}"\n`;
      });
      csvContent += '\n';
    }

    // Export Goals as CSV
    if (exportOptions.includeGoals && appData.goals.length > 0) {
      csvContent += 'Goals\n';
      csvContent += 'Title,Target,Current,Category,Icon\n';
      appData.goals.forEach(goal => {
        csvContent += `"${goal.title}","${goal.target}","${goal.current}","${goal.category}","${goal.icon}"\n`;
      });
      csvContent += '\n';
    }

    // Export Friends as CSV
    if (exportOptions.includeFriends && appData.friends.length > 0) {
      csvContent += 'Friends\n';
      csvContent += 'Name,Birth Date,Color\n';
      appData.friends.forEach(friend => {
        csvContent += `"${friend.name}","${friend.birthDate}","${friend.color}"\n`;
      });
      csvContent += '\n';
    }

    if (!csvContent) {
      csvContent = 'No data selected for export\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsLoading(true);
    setExportSuccess(false);

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      if (exportType === 'json') {
        exportAsJson();
      } else {
        exportAsCsv();
      }

      setExportSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setExportSuccess(false);
    onClose();
  };

  const getSelectedCount = () => {
    return Object.values(exportOptions).filter(Boolean).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">ส่งออกข้อมูล</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปแบบไฟล์
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportType === 'json'}
                  onChange={(e) => setExportType(e.target.value as ExportFileType)}
                  className="mr-2"
                />
                JSON (แนะนำ)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportType === 'csv'}
                  onChange={(e) => setExportType(e.target.value as ExportFileType)}
                  className="mr-2"
                />
                CSV
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {exportType === 'json' 
                ? 'ส่งออกข้อมูลครบถ้วนและสามารถนำเข้าได้เต็มรูปแบบ' 
                : 'ส่งออกเฉพาะข้อมูลพื้นฐานสำหรับใช้งานภายนอก'}
            </p>
          </div>

          {/* Export Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                เลือกข้อมูลที่ต้องการส่งออก
              </label>
              <span className="text-xs text-gray-500">
                ({getSelectedCount()}/8 รายการ)
              </span>
            </div>
            
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
              {[
                { key: 'includeUserProfile', label: 'ข้อมูลส่วนตัว', count: appData.userProfile ? 1 : 0 },
                { key: 'includeActivities', label: 'กิจกรรม', count: appData.activities?.length || 0 },
                { key: 'includeAchievements', label: 'ความสำเร็จ', count: appData.achievements?.length || 0 },
                { key: 'includeGoals', label: 'เป้าหมาย', count: appData.goals?.length || 0 },
                { key: 'includeFriends', label: 'เพื่อน', count: appData.friends?.length || 0 },
                { key: 'includeFriendMessages', label: 'ข้อความจากเพื่อน', count: appData.friendMessages?.length || 0 },
                { key: 'includeTodos', label: 'รายการสิ่งที่ต้องทำ', count: Object.values(appData.todos || {}).flat().length },
                { key: 'includeEmotions', label: 'อารมณ์วันนี้', count: appData.todayEmotion ? 1 : 0 },
              ].map(({ key, label, count }) => (
                <label key={key} className="flex items-center justify-between p-2 hover:bg-white rounded transition-colors">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions[key as keyof ExportOptions]}
                      onChange={() => handleOptionChange(key as keyof ExportOptions)}
                      className="mr-3"
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {count} รายการ
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* File Preview */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">รายละเอียดการส่งออก</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <p>ชื่อไฟล์: {generateFileName()}</p>
              <p>รูปแบบ: {exportType.toUpperCase()}</p>
              <p>ข้อมูลที่เลือก: {getSelectedCount()} ประเภท</p>
            </div>
          </div>

          {/* Export Success Message */}
          {exportSuccess && (
            <div className="bg-green-50 p-3 rounded-lg flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">ส่งออกข้อมูลสำเร็จ!</p>
                <p className="text-xs text-green-700">ไฟล์ได้ถูกดาวน์โหลดแล้ว</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleExport}
              disabled={isLoading || exportSuccess || getSelectedCount() === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>กำลังส่งออก...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ส่งออกข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExportModal;