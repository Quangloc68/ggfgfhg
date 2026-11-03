import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from '../types';
import { generateSampleData } from '../data/sampleData';

const STORAGE_KEY = 'medtech_manager_data';

interface DataContextType {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
  resetData: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  addLog: (action: string, module: string, details: string) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error(e); }
    return generateSampleData();
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { console.error('Save error:', e); }
  }, [data]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetData = useCallback(() => {
    const fresh = generateSampleData();
    setData(fresh);
    showToast('Đã khôi phục dữ liệu mẫu', 'success');
  }, [showToast]);

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setData(parsed);
      showToast('Nhập dữ liệu thành công', 'success');
      return true;
    } catch {
      showToast('File JSON không hợp lệ', 'error');
      return false;
    }
  }, [showToast]);

  const addLog = useCallback((action: string, module: string, details: string) => {
    setData(prev => ({
      ...prev,
      activityLogs: [
        { id: Date.now().toString(), userId: '', action, module, details, timestamp: new Date().toISOString() },
        ...prev.activityLogs
      ].slice(0, 500)
    }));
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, resetData, exportData, importData, addLog, toast, showToast }}>
      {children}
    </DataContext.Provider>
  );
};
