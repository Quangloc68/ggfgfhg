import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { Supplier, Contract } from '../types';
import { Modal, ConfirmDialog, DataTable, StatusBadge, FormField, inputClass, selectClass, usePagination, formatCurrency, formatDate } from './UI';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const contractStatusLabels: Record<string, string> = { draft: 'Nháp', active: 'Đang thực hiện', completed: 'Hoàn thành', terminated: 'Chấm dứt' };

// ===== SUPPLIERS =====
export const SupplierManager: React.FC = () => {
  const { data, setData, showToast, addLog } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Supplier>({ id: '', code: '', name: '', taxCode: '', address: '', phone: '', email: '', contactPerson: '', equipmentCategories: '', createdAt: '' });

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Nhập mã và tên NCC', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, suppliers: prev.suppliers.map(s => s.id === editing.id ? editing : s) }));
      showToast('Cập nhật nhà cung cấp thành công', 'success');
    } else {
      setData(prev => ({ ...prev, suppliers: [...prev.suppliers, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      addLog('Thêm NCC', 'Nhà cung cấp', editing.name);
      showToast('Thêm nhà cung cấp thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Mã NCC' },
    { key: 'name', label: 'Tên nhà cung cấp' },
    { key: 'taxCode', label: 'MST' },
    { key: 'phone', label: 'Điện thoại' },
    { key: 'email', label: 'Email' },
    { key: 'contactPerson', label: 'Liên hệ' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Nhà cung cấp</h1></div>
        <button onClick={() => { setEditing({ id: '', code: '', name: '', taxCode: '', address: '', phone: '', email: '', contactPerson: '', equipmentCategories: '', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm NCC</button>
      </div>
      <DataTable columns={columns} data={data.suppliers} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: Supplier) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa NCC' : 'Thêm nhà cung cấp'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Mã NCC" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
            <FormField label="Mã số thuế"><input className={inputClass} value={editing.taxCode} onChange={e => setEditing({ ...editing, taxCode: e.target.value })} /></FormField>
          </div>
          <FormField label="Tên đơn vị" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField>
          <FormField label="Địa chỉ"><input className={inputClass} value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Điện thoại"><input className={inputClass} value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></FormField>
            <FormField label="Email"><input className={inputClass} value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></FormField>
          </div>
          <FormField label="Người liên hệ"><input className={inputClass} value={editing.contactPerson} onChange={e => setEditing({ ...editing, contactPerson: e.target.value })} /></FormField>
          <FormField label="Danh mục thiết bị CC"><textarea className={inputClass} rows={2} value={editing.equipmentCategories} onChange={e => setEditing({ ...editing, equipmentCategories: e.target.value })} /></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { setData(prev => ({ ...prev, suppliers: prev.suppliers.filter(s => s.id !== confirmDelete) })); showToast('Đã xóa', 'success'); } }} message="Xóa nhà cung cấp này?" />
    </div>
  );
};

// ===== CONTRACTS =====
export const ContractManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Contract>({ id: '', code: '', name: '', supplierId: '', bidPackageId: '', value: 0, signDate: '', duration: '', warrantyPeriod: '', deliveryProgress: '', status: 'draft', fileUrl: '', createdAt: '' });

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Nhập mã và tên HĐ', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, contracts: prev.contracts.map(c => c.id === editing.id ? editing : c) }));
      showToast('Cập nhật hợp đồng thành công', 'success');
    } else {
      setData(prev => ({ ...prev, contracts: [...prev.contracts, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm hợp đồng thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Mã HĐ' },
    { key: 'name', label: 'Tên hợp đồng' },
    { key: 'supplierId', label: 'Nhà CC', render: (r: Contract) => data.suppliers.find(s => s.id === r.supplierId)?.name || '-' },
    { key: 'value', label: 'Giá trị', render: (r: Contract) => formatCurrency(r.value) },
    { key: 'signDate', label: 'Ngày ký', render: (r: Contract) => formatDate(r.signDate) },
    { key: 'status', label: 'Trạng thái', render: (r: Contract) => <StatusBadge status={r.status} label={contractStatusLabels[r.status]} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Hợp đồng</h1></div>
        <button onClick={() => { setEditing({ id: '', code: '', name: '', supplierId: '', bidPackageId: '', value: 0, signDate: '', duration: '', warrantyPeriod: '', deliveryProgress: '', status: 'draft', fileUrl: '', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm HĐ</button>
      </div>
      <DataTable columns={columns} data={data.contracts} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: Contract) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa hợp đồng' : 'Thêm hợp đồng'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Mã hợp đồng" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
          <FormField label="Nhà cung cấp"><select className={selectClass} value={editing.supplierId} onChange={e => setEditing({ ...editing, supplierId: e.target.value })}>
            <option value="">-- Chọn --</option>{data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select></FormField>
          <div className="md:col-span-2"><FormField label="Tên hợp đồng" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField></div>
          <FormField label="Giá trị HĐ"><input type="number" className={inputClass} value={editing.value} onChange={e => setEditing({ ...editing, value: Number(e.target.value) })} /></FormField>
          <FormField label="Ngày ký"><input type="date" className={inputClass} value={editing.signDate} onChange={e => setEditing({ ...editing, signDate: e.target.value })} /></FormField>
          <FormField label="Thời hạn HĐ"><input className={inputClass} value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} /></FormField>
          <FormField label="Thời hạn bảo hành"><input className={inputClass} value={editing.warrantyPeriod} onChange={e => setEditing({ ...editing, warrantyPeriod: e.target.value })} /></FormField>
          <FormField label="Tiến độ giao hàng"><input className={inputClass} value={editing.deliveryProgress} onChange={e => setEditing({ ...editing, deliveryProgress: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Contract['status'] })}>
            {Object.entries(contractStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { setData(prev => ({ ...prev, contracts: prev.contracts.filter(c => c.id !== confirmDelete) })); showToast('Đã xóa', 'success'); } }} message="Xóa hợp đồng này?" />
    </div>
  );
};
