import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useData } from '../store/DataContext';

// ===== TOAST =====
export const Toast: React.FC = () => {
  const { toast } = useData();
  if (!toast) return null;
  const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
  const icons = { success: CheckCircle, error: AlertTriangle, info: Info };
  const Icon = icons[toast.type];
  return (
    <div className={`fixed top-4 right-4 z-[9999] ${colors[toast.type]} text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-in`}>
      <Icon size={20} />
      <span className="font-medium">{toast.message}</span>
    </div>
  );
};

// ===== MODAL =====
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-fade-in`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={22} /></button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">{children}</div>
      </div>
    </div>
  );
};

// ===== CONFIRM DIALOG =====
export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title = 'Xác nhận', message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-gray-600 text-sm mt-1">{message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Hủy</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== PAGINATION =====
export const Pagination: React.FC<{
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}> = ({ total, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
      <span className="text-sm text-gray-600">Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} / {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          if (p > totalPages) return null;
          return <button key={p} onClick={() => onPageChange(p)} className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>{p}</button>;
        })}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

// ===== SEARCH INPUT =====
export const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder = 'Tìm kiếm...' }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
  </div>
);

// ===== STAT CARD =====
export const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string }> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
  </div>
);

// ===== FORM INPUT =====
export const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";
export const selectClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

// ===== TABLE =====
export const DataTable: React.FC<{
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode; width?: string }[];
  data: any[];
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  actions?: (row: any) => React.ReactNode;
}> = ({ columns, data, page, pageSize, onPageChange, searchValue, onSearchChange, actions }) => {
  const filtered = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(searchValue.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b">
        <SearchInput value={searchValue} onChange={onSearchChange} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" style={{ width: col.width }}>{col.label}</th>
              ))}
              {actions && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="px-4 py-8 text-center text-gray-400">Không có dữ liệu</td></tr>
            ) : paged.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
                {actions && <td className="px-4 py-3 text-center">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={filtered.length} page={page} pageSize={pageSize} onPageChange={onPageChange} />
    </div>
  );
};

// ===== STATUS BADGE =====
export const StatusBadge: React.FC<{ status: string; label: string }> = ({ status, label }) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    repair: 'bg-orange-100 text-orange-700',
    inactive: 'bg-gray-100 text-gray-700',
    pending_liquidation: 'bg-purple-100 text-purple-700',
    liquidated: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    preparing: 'bg-gray-100 text-gray-700',
    bidding: 'bg-blue-100 text-blue-700',
    evaluating: 'bg-yellow-100 text-yellow-700',
    awarded: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    terminated: 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    reported: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    closed: 'bg-gray-100 text-gray-700',
    accepted: 'bg-green-100 text-green-700',
    pass: 'bg-green-100 text-green-700',
    fail: 'bg-red-100 text-red-700',
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
    urgent: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{label}</span>;
};

// ===== USE PAGINATION HOOK =====
export const usePagination = (initialPage = 1, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialSize);
  const [search, setSearch] = useState('');
  return { page, setPage, pageSize, search, setSearch };
};

// ===== FORMAT HELPERS =====
export const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
export const formatDate = (d: string) => { if (!d) return '-'; return new Date(d).toLocaleDateString('vi-VN'); };
