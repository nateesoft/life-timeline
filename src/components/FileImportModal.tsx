'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { ImportResult, ImportFileType, AppData } from '../types';

interface FileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: AppData) => void;
}

const FileImportModal: React.FC<FileImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportFileType>('json');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setResult(null);
    }
  };

  const validateJsonData = (data: unknown): ImportResult => {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'ไฟล์ JSON ไม่ถูกต้อง' };
      }

      const dataObj = data as Record<string, any>;

      // Check for required fields
      if (!dataObj.userProfile || !dataObj.userProfile.birthDate) {
        return { success: false, message: 'ไม่พบข้อมูลวันเกิดผู้ใช้' };
      }

      // Validate data structure
      const requiredFields = ['activities', 'achievements', 'goals', 'friends', 'friendMessages', 'todos'];
      const missingFields = requiredFields.filter(field => !Array.isArray(dataObj[field]) && field !== 'todos');
      
      if (missingFields.length > 0) {
        return { 
          success: false, 
          message: `ไม่พบข้อมูลที่จำเป็น: ${missingFields.join(', ')}` 
        };
      }

      return { success: true, message: 'ข้อมูลถูกต้อง', data: dataObj as AppData };
    } catch (error) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' };
    }
  };

  const parseJsonFile = async (file: File): Promise<ImportResult> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      return validateJsonData(data);
    } catch (error) {
      return { success: false, message: 'ไม่สามารถอ่านไฟล์ JSON ได้' };
    }
  };

  const parseCsvFile = async (file: File): Promise<ImportResult> => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return { success: false, message: 'ไฟล์ CSV ไม่มีข้อมูล' };
      }

      // Simple CSV parsing for activities (can be extended for other data types)
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const activities = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length >= headers.length) {
          const activity = {
            id: Date.now() + i,
            name: values[0] || '',
            description: values[1] || '',
            displayType: (values[2] as any) || 'daily',
            color: values[3] || '#3B82F6',
            backgroundColor: values[4] || '#FEF3C7',
            position: { x: 100 + (i * 20), y: 100 + (i * 20) },
            createdAt: new Date().toISOString()
          };
          activities.push(activity);
        }
      }

      const csvData: AppData = {
        userProfile: { birthDate: '', maxAge: 80 },
        activities,
        achievements: [],
        goals: [],
        friends: [],
        friendMessages: [],
        todos: { today: [], tomorrow: [], upcoming: [], monthly: [] },
        todayEmotion: null,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      return { success: true, message: `นำเข้าข้อมูล ${activities.length} รายการสำเร็จ`, data: csvData };
    } catch (error) {
      return { success: false, message: 'ไม่สามารถอ่านไฟล์ CSV ได้' };
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    try {
      let importResult: ImportResult;

      if (importType === 'json') {
        importResult = await parseJsonFile(selectedFile);
      } else {
        importResult = await parseCsvFile(selectedFile);
      }

      setResult(importResult);

      if (importResult.success && importResult.data) {
        // Wait a moment to show success message
        setTimeout(() => {
          onImport(importResult.data!);
          onClose();
        }, 1500);
      }
    } catch (error) {
      setResult({ success: false, message: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">นำเข้าข้อมูล</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทไฟล์
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={importType === 'json'}
                  onChange={(e) => setImportType(e.target.value as ImportFileType)}
                  className="mr-2"
                />
                JSON (แนะนำ)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={importType === 'csv'}
                  onChange={(e) => setImportType(e.target.value as ImportFileType)}
                  className="mr-2"
                />
                CSV (เฉพาะกิจกรรม)
              </label>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={importType === 'json' ? '.json' : '.csv'}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-gray-500">
                  ขนาด: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-1">คลิกหรือลากไฟล์มาที่นี่</p>
                <p className="text-xs text-gray-500">
                  รองรับไฟล์ {importType.toUpperCase()} เท่านั้น
                </p>
              </div>
            )}
          </div>

          {/* Import Result */}
          {result && (
            <div className={`p-3 rounded-lg flex items-start space-x-2 ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">{result.message}</p>
                {result.errors && result.errors.length > 0 && (
                  <ul className="text-xs mt-1 list-disc list-inside">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
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
              onClick={handleImport}
              disabled={!selectedFile || isLoading || (result && result.success)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูล'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileImportModal;