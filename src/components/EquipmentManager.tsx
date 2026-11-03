import React, { useState, useRef } from 'react';
import { useData } from '../store/DataContext';
import { Equipment } from '../types';
import { Modal, ConfirmDialog, DataTable, StatusBadge, FormField, inputClass, selectClass, usePagination, formatCurrency, formatDate } from './UI';
import { Plus, Edit2, Trash2, Eye, Printer, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

const emptyEquip: Equipment = {
  id: '', code: '', name: '', groupId: '', manufacturer: '', model: '', serial: '',
  country: '', yearManufactured: '', purchaseDate: '', usageDate: '', price: 0,
  fundSource: '', supplier: '', contractNo: '', warrantyExpiry: '', departmentId: '',
  location: '', responsiblePerson: '', status: 'active', notes: '', createdAt: ''
};

const statusLabels: Record<string, string> = {
  active: 'Đang hoạt động', maintenance: 'Đang bảo trì', repair: 'Đang sửa chữa',
  inactive: 'Tạm ngừng', pending_liquidation: 'Chờ thanh lý', liquidated: 'Đã thanh lý'
};

export const EquipmentManager: React.FC = () => {
  const { data, setData, showToast, addLog } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Equipment>(emptyEquip);
  const [viewItem, setViewItem] = useState<Equipment | null>(null);
  const [qrItem, setQrItem] = useState<Equipment | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMfr, setFilterMfr] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const getFilteredData = () => {
    let result = data.equipment;
    if (filterDept) result = result.filter(e => e.departmentId === filterDept);
    if (filterGroup) result = result.filter(e => e.groupId === filterGroup);
    if (filterStatus) result = result.filter(e => e.status === filterStatus);
    if (filterMfr) result = result.filter(e => e.manufacturer === filterMfr);
    return result;
  };

  const manufacturers = [...new Set(data.equipment.map(e => e.manufacturer).filter(Boolean))];

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Vui lòng nhập mã và tên thiết bị', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, equipment: prev.equipment.map(e => e.id === editing.id ? editing : e) }));
      addLog('Sửa thiết bị', 'Thiết bị', editing.code);
      showToast('Cập nhật thiết bị thành công', 'success');
    } else {
      const newItem = { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
      setData(prev => ({ ...prev, equipment: [...prev.equipment, newItem] }));
      addLog('Thêm thiết bị', 'Thiết bị', editing.code);
      showToast('Thêm thiết bị thành công', 'success');
    }
    setModalOpen(false);
    setEditing(emptyEquip);
  };

  const handleDelete = (id: string) => {
    setData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }));
    addLog('Xóa thiết bị', 'Thiết bị', id);
    showToast('Đã xóa thiết bị', 'success');
  };

  const openQR = (item: Equipment) => {
    setQrItem(item);
    QRCode.toDataURL(`MEDTECH|${item.code}|${item.name}|${item.serial}|${item.manufacturer}`, { width: 250, margin: 2 })
      .then(url => setQrDataUrl(url));
    setQrOpen(true);
  };

  const handlePrint = (item: Equipment) => {
    setViewItem(item);
    setDetailOpen(true);
    setTimeout(() => window.print(), 300);
  };

  const columns = [
    { key: 'code', label: 'Mã TB', width: '100px' },
    { key: 'name', label: 'Tên thiết bị' },
    { key: 'manufacturer', label: 'Hãng SX', render: (r: Equipment) => r.manufacturer || '-' },
    { key: 'model', label: 'Model', render: (r: Equipment) => r.model || '-' },
    { key: 'departmentId', label: 'Khoa/Phòng', render: (r: Equipment) => data.departments.find(d => d.id === r.departmentId)?.name || '-' },
    { key: 'status', label: 'Trạng thái', render: (r: Equipment) => <StatusBadge status={r.status} label={statusLabels[r.status]} /> },
    { key: 'price', label: 'Giá mua', render: (r: Equipment) => formatCurrency(r.price) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý trang thiết bị y tế</h1>
          <p className="text-gray-500 text-sm">Tổng số: {data.equipment.length} thiết bị</p>
        </div>
        <button onClick={() => { setEditing(emptyEquip); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
          <Plus size={18} /> Thêm thiết bị
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">Tất cả Khoa/Phòng</option>
          {data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={filterGroup} onChange={e => { setFilterGroup(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">Tất cả nhóm</option>
          {data.equipmentGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterMfr} onChange={e => { setFilterMfr(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">Tất cả hãng</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredData()}
        page={page} pageSize={pageSize} onPageChange={setPage}
        searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: Equipment) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setViewItem(row); setDetailOpen(true); }} className="p-1.5 rounded hover:bg-blue-100 text-blue-600" title="Xem chi tiết"><Eye size={16} /></button>
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600" title="Sửa"><Edit2 size={16} /></button>
            <button onClick={() => openQR(row)} className="p-1.5 rounded hover:bg-purple-100 text-purple-600" title="QR Code"><QrCode size={16} /></button>
            <button onClick={() => handlePrint(row)} className="p-1.5 rounded hover:bg-green-100 text-green-600" title="In"><Printer size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600" title="Xóa"><Trash2 size={16} /></button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa thông tin thiết bị' : 'Thêm thiết bị mới'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Mã thiết bị" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
          <FormField label="Tên thiết bị" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField>
          <FormField label="Nhóm thiết bị"><select className={selectClass} value={editing.groupId} onChange={e => setEditing({ ...editing, groupId: e.target.value })}>
            <option value="">-- Chọn nhóm --</option>
            {data.equipmentGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select></FormField>
          <FormField label="Hãng sản xuất"><input className={inputClass} value={editing.manufacturer} onChange={e => setEditing({ ...editing, manufacturer: e.target.value })} /></FormField>
          <FormField label="Model"><input className={inputClass} value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} /></FormField>
          <FormField label="Số Serial"><input className={inputClass} value={editing.serial} onChange={e => setEditing({ ...editing, serial: e.target.value })} /></FormField>
          <FormField label="Nước sản xuất"><input className={inputClass} value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} /></FormField>
          <FormField label="Năm sản xuất"><input type="number" className={inputClass} value={editing.yearManufactured} onChange={e => setEditing({ ...editing, yearManufactured: e.target.value })} /></FormField>
          <FormField label="Ngày mua"><input type="date" className={inputClass} value={editing.purchaseDate} onChange={e => setEditing({ ...editing, purchaseDate: e.target.value })} /></FormField>
          <FormField label="Ngày sử dụng"><input type="date" className={inputClass} value={editing.usageDate} onChange={e => setEditing({ ...editing, usageDate: e.target.value })} /></FormField>
          <FormField label="Giá mua (VNĐ)"><input type="number" className={inputClass} value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></FormField>
          <FormField label="Nguồn kinh phí"><input className={inputClass} value={editing.fundSource} onChange={e => setEditing({ ...editing, fundSource: e.target.value })} /></FormField>
          <FormField label="Nhà cung cấp"><input className={inputClass} value={editing.supplier} onChange={e => setEditing({ ...editing, supplier: e.target.value })} /></FormField>
          <FormField label="Số hợp đồng"><input className={inputClass} value={editing.contractNo} onChange={e => setEditing({ ...editing, contractNo: e.target.value })} /></FormField>
          <FormField label="Hạn bảo hành"><input type="date" className={inputClass} value={editing.warrantyExpiry} onChange={e => setEditing({ ...editing, warrantyExpiry: e.target.value })} /></FormField>
          <FormField label="Khoa/Phòng"><select className={selectClass} value={editing.departmentId} onChange={e => setEditing({ ...editing, departmentId: e.target.value })}>
            <option value="">-- Chọn khoa/phòng --</option>
            {data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></FormField>
          <FormField label="Vị trí lắp đặt"><input className={inputClass} value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} /></FormField>
          <FormField label="Người phụ trách"><input className={inputClass} value={editing.responsiblePerson} onChange={e => setEditing({ ...editing, responsiblePerson: e.target.value })} /></FormField>
          <FormField label="Tình trạng"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Equipment['status'] })}>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <div className="md:col-span-2">
            <FormField label="Ghi chú"><textarea className={inputClass} rows={2} value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })} /></FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Chi tiết thiết bị" size="lg">
        {viewItem && (
          <div ref={printRef} className="space-y-4">
            <div className="text-center border-b pb-3">
              <h2 className="text-xl font-bold text-blue-700">HỒ SƠ TRANG THIẾT BỊ Y TẾ</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Mã thiết bị', viewItem.code], ['Tên thiết bị', viewItem.name],
                ['Nhóm', data.equipmentGroups.find(g => g.id === viewItem.groupId)?.name || '-'],
                ['Hãng SX', viewItem.manufacturer], ['Model', viewItem.model], ['Serial', viewItem.serial],
                ['Nước SX', viewItem.country], ['Năm SX', viewItem.yearManufactured],
                ['Ngày mua', formatDate(viewItem.purchaseDate)], ['Ngày SD', formatDate(viewItem.usageDate)],
                ['Giá mua', formatCurrency(viewItem.price)], ['Nguồn KP', viewItem.fundSource],
                ['Nhà CC', viewItem.supplier], ['Số HĐ', viewItem.contractNo],
                ['Hạn BH', formatDate(viewItem.warrantyExpiry)],
                ['Khoa/Phòng', data.departments.find(d => d.id === viewItem.departmentId)?.name || '-'],
                ['Vị trí', viewItem.location], ['Người PT', viewItem.responsiblePerson],
                ['Trạng thái', statusLabels[viewItem.status]], ['Ghi chú', viewItem.notes],
              ].map(([label, val], i) => (
                <div key={i} className="flex"><span className="font-medium text-gray-600 w-28 shrink-0">{label}:</span><span className="text-gray-800">{val}</span></div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* QR Modal */}
      <Modal isOpen={qrOpen} onClose={() => setQrOpen(false)} title="Mã QR thiết bị" size="sm">
        {qrItem && (
          <div className="text-center">
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="mx-auto mb-4" />}
            <p className="font-bold text-lg">{qrItem.name}</p>
            <p className="text-gray-500">{qrItem.code}</p>
            <p className="text-gray-500 text-sm">Serial: {qrItem.serial}</p>
            <button onClick={() => {
              const a = document.createElement('a');
              a.href = qrDataUrl;
              a.download = `QR_${qrItem.code}.png`;
              a.click();
            }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tải xuống</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} message="Bạn có chắc muốn xóa thiết bị này? Hành động không thể hoàn tác." />
    </div>
  );
};
