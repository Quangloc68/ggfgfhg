import React, { useState, useRef } from 'react';
import { useData } from '../store/DataContext';
import { User } from '../types';
import { Modal, ConfirmDialog, DataTable, StatusBadge, FormField, inputClass, selectClass, usePagination, formatDate } from './UI';
import { Plus, Edit2, Trash2, Database, Upload, Download, RefreshCw, Shield, Activity } from 'lucide-react';

const roleLabels: Record<string, string> = {
  admin: 'Quản trị viên', director: 'Ban giám đốc', supply_dept: 'Phòng Vật tư - TTB YT',
  finance: 'Phòng Tài chính - Kế toán', department: 'Khoa/Phòng sử dụng', technician: 'Kỹ thuật viên', expert: 'Tổ chuyên gia đấu thầu'
};

// ===== ACCOUNTS =====
export const AccountManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<User>({ id: '', username: '', fullName: '', role: 'department', departmentId: '', email: '', active: true, createdAt: '' });

  const handleSave = () => {
    if (!editing.username || !editing.fullName) { showToast('Nhập đầy đủ thông tin', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, users: prev.users.map(u => u.id === editing.id ? editing : u) }));
      showToast('Cập nhật tài khoản thành công', 'success');
    } else {
      setData(prev => ({ ...prev, users: [...prev.users, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm tài khoản thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'username', label: 'Tên đăng nhập' },
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'role', label: 'Vai trò', render: (r: User) => <StatusBadge status={r.role} label={roleLabels[r.role]} /> },
    { key: 'departmentId', label: 'Khoa/Phòng', render: (r: User) => data.departments.find(d => d.id === r.departmentId)?.name || '-' },
    { key: 'email', label: 'Email' },
    { key: 'active', label: 'Trạng thái', render: (r: User) => <StatusBadge status={r.active ? 'active' : 'inactive'} label={r.active ? 'Kích hoạt' : 'Khóa'} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield size={24} /> Quản lý Tài khoản & Phân quyền</h1>
          <p className="text-sm text-gray-500 mt-1">⚠️ Phân quyền chỉ mang tính mô phỏng trên trình duyệt</p>
        </div>
        <button onClick={() => { setEditing({ id: '', username: '', fullName: '', role: 'department', departmentId: '', email: '', active: true, createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm tài khoản</button>
      </div>

      {/* Role permissions info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Quyền hạn theo vai trò:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div><strong>Quản trị viên:</strong> Toàn quyền hệ thống</div>
          <div><strong>Ban giám đốc:</strong> Xem tất cả, phê duyệt</div>
          <div><strong>Phòng VT-TTB:</strong> Quản lý thiết bị, mua sắm, bảo trì</div>
          <div><strong>Phòng TC-KT:</strong> Xem hợp đồng, báo cáo tài chính</div>
          <div><strong>Khoa/Phòng:</strong> Báo hỏng, đề xuất mua sắm</div>
          <div><strong>KTV:</strong> Bảo trì, sửa chữa</div>
          <div><strong>Tổ chuyên gia:</strong> Đánh giá hồ sơ thầu</div>
        </div>
      </div>

      <DataTable columns={columns} data={data.users} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: User) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}>
        <div className="space-y-4">
          <FormField label="Tên đăng nhập" required><input className={inputClass} value={editing.username} onChange={e => setEditing({ ...editing, username: e.target.value })} /></FormField>
          <FormField label="Họ và tên" required><input className={inputClass} value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} /></FormField>
          <FormField label="Email"><input type="email" className={inputClass} value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></FormField>
          <FormField label="Vai trò"><select className={selectClass} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as User['role'] })}>
            {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <FormField label="Khoa/Phòng"><select className={selectClass} value={editing.departmentId} onChange={e => setEditing({ ...editing, departmentId: e.target.value })}>
            <option value="">-- Không --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></FormField>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Tài khoản đang kích hoạt</label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== confirmDelete) })); showToast('Đã xóa', 'success'); } }} message="Xóa tài khoản này?" />
    </div>
  );
};

// ===== SETTINGS / BACKUP =====
export const Settings: React.FC = () => {
  const { data, setData, exportData, importData, resetData, addLog } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medtech_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Sao lưu dữ liệu', 'Hệ thống', 'Xuất file JSON');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importData(text);
      addLog('Khôi phục dữ liệu', 'Hệ thống', 'Nhập file JSON');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const newEquipment = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const obj: any = { id: Date.now().toString() + Math.random(), createdAt: new Date().toISOString().split('T')[0], status: 'active' as const, price: 0 };
          headers.forEach((h, i) => { obj[h] = values[i] || ''; });
          return obj;
        });
        setData(prev => ({ ...prev, equipment: [...prev.equipment, ...newEquipment] }));
        addLog('Nhập CSV', 'Hệ thống', `${newEquipment.length} thiết bị`);
        alert(`Đã nhập ${newEquipment.length} thiết bị từ CSV.`);
      } catch (err) {
        alert('Lỗi đọc file CSV');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn khôi phục dữ liệu mẫu? Dữ liệu hiện tại sẽ bị mất!')) {
      resetData();
    }
  };

  const stats = {
    equipment: data.equipment.length,
    departments: data.departments.length,
    suppliers: data.suppliers.length,
    contracts: data.contracts.length,
    maintenance: data.maintenanceRecords.length,
    repairs: data.repairRecords.length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Database size={24} /> Cài đặt & Sao lưu dữ liệu</h1>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Thống kê dữ liệu hiện tại</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{val}</p>
              <p className="text-xs text-gray-500 capitalize">{key === 'equipment' ? 'Thiết bị' : key === 'departments' ? 'Khoa/Phòng' : key === 'suppliers' ? 'Nhà CC' : key === 'contracts' ? 'Hợp đồng' : key === 'maintenance' ? 'Bảo trì' : 'Sửa chữa'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Backup/Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Download size={18} /> Sao lưu dữ liệu</h3>
          <p className="text-sm text-gray-600 mb-4">Xuất toàn bộ dữ liệu ra file JSON để sao lưu hoặc chuyển sang máy khác.</p>
          <button onClick={handleExport} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
            <Download size={18} /> Tải bản sao lưu (JSON)
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Upload size={18} /> Khôi phục dữ liệu</h3>
          <p className="text-sm text-gray-600 mb-4">Nhập dữ liệu từ file JSON đã sao lưu trước đó. Dữ liệu hiện tại sẽ bị ghi đè.</p>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
            <Upload size={18} /> Chọn file JSON để khôi phục
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Upload size={18} /> Nhập danh mục từ CSV</h3>
          <p className="text-sm text-gray-600 mb-4">Nhập danh sách thiết bị từ file CSV. Cột đầu tiên là tiêu đề.</p>
          <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          <button onClick={() => csvInputRef.current?.click()} className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2">
            <Upload size={18} /> Chọn file CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><RefreshCw size={18} /> Khôi phục dữ liệu mẫu</h3>
          <p className="text-sm text-gray-600 mb-4">Xóa toàn bộ dữ liệu hiện tại và khôi phục dữ liệu mẫu ban đầu.</p>
          <button onClick={handleReset} className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Xóa & Khôi phục mẫu
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
          <Activity size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Nhật ký hoạt động</h3>
        </div>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Thời gian</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Hành động</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Phân hệ</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.activityLogs.slice(0, 50).map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-2 text-gray-700">{log.action}</td>
                  <td className="px-4 py-2 text-gray-600">{log.module}</td>
                  <td className="px-4 py-2 text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
