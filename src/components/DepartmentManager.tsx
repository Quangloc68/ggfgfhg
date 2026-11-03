import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { Department } from '../types';
import { Modal, ConfirmDialog, DataTable, FormField, inputClass, usePagination } from './UI';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const emptyDept: Department = { id: '', code: '', name: '', manager: '', phone: '', location: '', createdAt: '' };

export const DepartmentManager: React.FC = () => {
  const { data, setData, showToast, addLog } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Department>(emptyDept);
  const [viewDept, setViewDept] = useState<(Department & { equipCount: number }) | null>(null);

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Vui lòng nhập mã và tên khoa/phòng', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, departments: prev.departments.map(d => d.id === editing.id ? editing : d) }));
      addLog('Sửa khoa/phòng', 'Khoa/Phòng', editing.code);
      showToast('Cập nhật thành công', 'success');
    } else {
      const newItem = { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
      setData(prev => ({ ...prev, departments: [...prev.departments, newItem] }));
      addLog('Thêm khoa/phòng', 'Khoa/Phòng', editing.code);
      showToast('Thêm khoa/phòng thành công', 'success');
    }
    setModalOpen(false);
    setEditing(emptyDept);
  };

  const handleDelete = (id: string) => {
    const hasEquipment = data.equipment.some(e => e.departmentId === id);
    if (hasEquipment) { showToast('Không thể xóa: Khoa/phòng đang có thiết bị', 'error'); return; }
    setData(prev => ({ ...prev, departments: prev.departments.filter(d => d.id !== id) }));
    addLog('Xóa khoa/phòng', 'Khoa/Phòng', id);
    showToast('Đã xóa khoa/phòng', 'success');
  };

  const columns = [
    { key: 'code', label: 'Mã', width: '80px' },
    { key: 'name', label: 'Tên Khoa/Phòng' },
    { key: 'manager', label: 'Phụ trách' },
    { key: 'phone', label: 'Điện thoại' },
    { key: 'location', label: 'Địa điểm' },
    { key: 'equipCount', label: 'Số TB', render: (r: any) => <span className="font-semibold text-blue-600">{r.equipCount}</span> },
  ];

  const enrichedData = data.departments.map(d => ({
    ...d,
    equipCount: data.equipment.filter(e => e.departmentId === d.id).length
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khoa/Phòng</h1>
          <p className="text-gray-500 text-sm">Tổng số: {data.departments.length} khoa/phòng</p>
        </div>
        <button onClick={() => { setEditing(emptyDept); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Thêm khoa/phòng
        </button>
      </div>

      <DataTable
        columns={columns}
        data={enrichedData}
        page={page} pageSize={pageSize} onPageChange={setPage}
        searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: Department & { equipCount: number }) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setViewDept(row); setDetailOpen(true); }} className="p-1.5 rounded hover:bg-blue-100 text-blue-600"><Eye size={16} /></button>
            <button onClick={() => { setEditing({...row} as Department); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa Khoa/Phòng' : 'Thêm Khoa/Phòng'}>
        <div className="space-y-4">
          <FormField label="Mã khoa/phòng" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
          <FormField label="Tên khoa/phòng" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField>
          <FormField label="Người phụ trách"><input className={inputClass} value={editing.manager} onChange={e => setEditing({ ...editing, manager: e.target.value })} /></FormField>
          <FormField label="Số điện thoại"><input className={inputClass} value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></FormField>
          <FormField label="Địa điểm"><input className={inputClass} value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} /></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Chi tiết Khoa/Phòng" size="lg">
        {viewDept && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium text-gray-600">Mã:</span> {viewDept.code}</div>
              <div><span className="font-medium text-gray-600">Tên:</span> {viewDept.name}</div>
              <div><span className="font-medium text-gray-600">Phụ trách:</span> {viewDept.manager}</div>
              <div><span className="font-medium text-gray-600">Điện thoại:</span> {viewDept.phone}</div>
              <div className="col-span-2"><span className="font-medium text-gray-600">Địa điểm:</span> {viewDept.location}</div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Danh sách thiết bị ({viewDept.equipCount})</h3>
              {viewDept.equipCount === 0 ? (
                <p className="text-gray-400 text-sm">Chưa có thiết bị nào</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                      <th className="px-3 py-2 text-left">Mã</th>
                      <th className="px-3 py-2 text-left">Tên thiết bị</th>
                      <th className="px-3 py-2 text-left">Hãng</th>
                      <th className="px-3 py-2 text-left">Trạng thái</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {data.equipment.filter(e => e.departmentId === viewDept.id).map(e => (
                        <tr key={e.id}><td className="px-3 py-2">{e.code}</td><td className="px-3 py-2">{e.name}</td><td className="px-3 py-2">{e.manufacturer}</td><td className="px-3 py-2">{e.status}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} message="Bạn có chắc muốn xóa khoa/phòng này?" />
    </div>
  );
};
