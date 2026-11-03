import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { MaintenanceRecord, RepairRecord, ReceivingRecord, TrainingRecord, TransferRecord, LiquidationRecord } from '../types';
import { Modal, ConfirmDialog, DataTable, StatusBadge, FormField, inputClass, selectClass, usePagination, formatCurrency, formatDate } from './UI';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const maintTypeLabels: Record<string, string> = { preventive: 'Bảo trì phòng ngừa', corrective: 'Sửa chữa bảo dưỡng', calibration: 'Hiệu chuẩn' };
const maintStatusLabels: Record<string, string> = { scheduled: 'Đã lên lịch', in_progress: 'Đang thực hiện', completed: 'Hoàn thành', overdue: 'Quá hạn' };
const severityLabels: Record<string, string> = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', critical: 'Nghiêm trọng' };
const repairStatusLabels: Record<string, string> = { reported: 'Đã báo cáo', assigned: 'Đã phân công', in_progress: 'Đang xử lý', completed: 'Hoàn thành', closed: 'Đóng' };

// ===== MAINTENANCE =====
export const MaintenanceManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<MaintenanceRecord>({ id: '', equipmentId: '', type: 'preventive', scheduledDate: '', technician: '', workContent: '', result: '', cost: 0, replacedParts: '', completedDate: '', status: 'scheduled', createdAt: '' });

  const now = new Date();
  const overdueItems = data.maintenanceRecords.filter(m => m.status === 'scheduled' && new Date(m.scheduledDate) < now);
  const upcomingItems = data.maintenanceRecords.filter(m => {
    if (m.status === 'completed') return false;
    const d = new Date(m.scheduledDate);
    return d >= now && d <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  const handleSave = () => {
    if (!editing.technician || !editing.scheduledDate) { showToast('Nhập đầy đủ thông tin', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, maintenanceRecords: prev.maintenanceRecords.map(m => m.id === editing.id ? editing : m) }));
      showToast('Cập nhật phiếu bảo trì thành công', 'success');
    } else {
      setData(prev => ({ ...prev, maintenanceRecords: [...prev.maintenanceRecords, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm phiếu bảo trì thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'equipmentId', label: 'Thiết bị', render: (r: MaintenanceRecord) => data.equipment.find(e => e.id === r.equipmentId)?.name || 'Chưa gán' },
    { key: 'type', label: 'Loại', render: (r: MaintenanceRecord) => maintTypeLabels[r.type] },
    { key: 'scheduledDate', label: 'Ngày dự kiến', render: (r: MaintenanceRecord) => formatDate(r.scheduledDate) },
    { key: 'technician', label: 'KTV' },
    { key: 'cost', label: 'Chi phí', render: (r: MaintenanceRecord) => formatCurrency(r.cost) },
    { key: 'status', label: 'Trạng thái', render: (r: MaintenanceRecord) => <StatusBadge status={r.status} label={maintStatusLabels[r.status]} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Bảo trì & Bảo dưỡng</h1></div>
        <button onClick={() => { setEditing({ id: '', equipmentId: '', type: 'preventive', scheduledDate: '', technician: '', workContent: '', result: '', cost: 0, replacedParts: '', completedDate: '', status: 'scheduled', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Tạo phiếu bảo trì</button>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {overdueItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div><p className="font-semibold text-red-700">{overdueItems.length} công việc quá hạn</p><p className="text-sm text-red-600">{overdueItems.map(m => data.equipment.find(e => e.id === m.equipmentId)?.name || 'TB').join(', ')}</p></div>
          </div>
        )}
        {upcomingItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
            <div><p className="font-semibold text-yellow-700">{upcomingItems.length} công việc trong 7 ngày tới</p><p className="text-sm text-yellow-600">{upcomingItems.map(m => `${formatDate(m.scheduledDate)}`).join(', ')}</p></div>
          </div>
        )}
      </div>

      <DataTable columns={columns} data={data.maintenanceRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: MaintenanceRecord) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa phiếu bảo trì' : 'Tạo phiếu bảo trì'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Thiết bị"><select className={selectClass} value={editing.equipmentId} onChange={e => setEditing({ ...editing, equipmentId: e.target.value })}>
            <option value="">-- Chọn thiết bị --</option>{data.equipment.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
          </select></FormField>
          <FormField label="Loại bảo trì"><select className={selectClass} value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as MaintenanceRecord['type'] })}>
            {Object.entries(maintTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <FormField label="Ngày dự kiến"><input type="date" className={inputClass} value={editing.scheduledDate} onChange={e => setEditing({ ...editing, scheduledDate: e.target.value })} /></FormField>
          <FormField label="Kỹ thuật viên"><input className={inputClass} value={editing.technician} onChange={e => setEditing({ ...editing, technician: e.target.value })} /></FormField>
          <div className="md:col-span-2"><FormField label="Nội dung công việc"><textarea className={inputClass} rows={2} value={editing.workContent} onChange={e => setEditing({ ...editing, workContent: e.target.value })} /></FormField></div>
          <FormField label="Chi phí"><input type="number" className={inputClass} value={editing.cost} onChange={e => setEditing({ ...editing, cost: Number(e.target.value) })} /></FormField>
          <FormField label="Linh kiện thay thế"><input className={inputClass} value={editing.replacedParts} onChange={e => setEditing({ ...editing, replacedParts: e.target.value })} /></FormField>
          <FormField label="Ngày hoàn thành"><input type="date" className={inputClass} value={editing.completedDate} onChange={e => setEditing({ ...editing, completedDate: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as MaintenanceRecord['status'] })}>
            {Object.entries(maintStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <div className="md:col-span-2"><FormField label="Kết quả"><textarea className={inputClass} rows={2} value={editing.result} onChange={e => setEditing({ ...editing, result: e.target.value })} /></FormField></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { setData(prev => ({ ...prev, maintenanceRecords: prev.maintenanceRecords.filter(m => m.id !== confirmDelete) })); showToast('Đã xóa', 'success'); } }} message="Xóa phiếu bảo trì?" />
    </div>
  );
};

// ===== REPAIRS =====
export const RepairManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<RepairRecord>({ id: '', equipmentId: '', departmentId: '', reporter: '', incidentDate: '', errorDescription: '', severity: 'medium', imageUrl: '', technician: '', cause: '', solution: '', cost: 0, testResult: '', completedDate: '', status: 'reported', createdAt: '' });

  const handleSave = () => {
    if (!editing.errorDescription) { showToast('Nhập mô tả lỗi', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, repairRecords: prev.repairRecords.map(r => r.id === editing.id ? editing : r) }));
      showToast('Cập nhật phiếu sửa chữa thành công', 'success');
    } else {
      setData(prev => ({ ...prev, repairRecords: [...prev.repairRecords, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Tạo phiếu báo hỏng thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'equipmentId', label: 'Thiết bị', render: (r: RepairRecord) => data.equipment.find(e => e.id === r.equipmentId)?.name || 'Chưa gán' },
    { key: 'departmentId', label: 'Khoa báo hỏng', render: (r: RepairRecord) => data.departments.find(d => d.id === r.departmentId)?.name || '-' },
    { key: 'reporter', label: 'Người báo' },
    { key: 'severity', label: 'Mức độ', render: (r: RepairRecord) => <StatusBadge status={r.severity} label={severityLabels[r.severity]} /> },
    { key: 'incidentDate', label: 'Ngày sự cố', render: (r: RepairRecord) => formatDate(r.incidentDate) },
    { key: 'cost', label: 'Chi phí', render: (r: RepairRecord) => formatCurrency(r.cost) },
    { key: 'status', label: 'Trạng thái', render: (r: RepairRecord) => <StatusBadge status={r.status} label={repairStatusLabels[r.status]} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Sửa chữa & Sự cố</h1></div>
        <button onClick={() => { setEditing({ id: '', equipmentId: '', departmentId: '', reporter: '', incidentDate: '', errorDescription: '', severity: 'medium', imageUrl: '', technician: '', cause: '', solution: '', cost: 0, testResult: '', completedDate: '', status: 'reported', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Plus size={18} /> Báo hỏng</button>
      </div>
      <DataTable columns={columns} data={data.repairRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: RepairRecord) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa phiếu sửa chữa' : 'Báo hỏng thiết bị'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Thiết bị"><select className={selectClass} value={editing.equipmentId} onChange={e => setEditing({ ...editing, equipmentId: e.target.value })}>
            <option value="">-- Chọn --</option>{data.equipment.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
          </select></FormField>
          <FormField label="Khoa báo hỏng"><select className={selectClass} value={editing.departmentId} onChange={e => setEditing({ ...editing, departmentId: e.target.value })}>
            <option value="">-- Chọn --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></FormField>
          <FormField label="Người báo hỏng"><input className={inputClass} value={editing.reporter} onChange={e => setEditing({ ...editing, reporter: e.target.value })} /></FormField>
          <FormField label="Ngày sự cố"><input type="date" className={inputClass} value={editing.incidentDate} onChange={e => setEditing({ ...editing, incidentDate: e.target.value })} /></FormField>
          <div className="md:col-span-2"><FormField label="Mô tả lỗi" required><textarea className={inputClass} rows={2} value={editing.errorDescription} onChange={e => setEditing({ ...editing, errorDescription: e.target.value })} /></FormField></div>
          <FormField label="Mức độ nghiêm trọng"><select className={selectClass} value={editing.severity} onChange={e => setEditing({ ...editing, severity: e.target.value as RepairRecord['severity'] })}>
            {Object.entries(severityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <FormField label="KTV tiếp nhận"><input className={inputClass} value={editing.technician} onChange={e => setEditing({ ...editing, technician: e.target.value })} /></FormField>
          <FormField label="Nguyên nhân"><input className={inputClass} value={editing.cause} onChange={e => setEditing({ ...editing, cause: e.target.value })} /></FormField>
          <FormField label="Chi phí sửa chữa"><input type="number" className={inputClass} value={editing.cost} onChange={e => setEditing({ ...editing, cost: Number(e.target.value) })} /></FormField>
          <div className="md:col-span-2"><FormField label="Biện pháp xử lý"><textarea className={inputClass} rows={2} value={editing.solution} onChange={e => setEditing({ ...editing, solution: e.target.value })} /></FormField></div>
          <FormField label="Ngày hoàn thành"><input type="date" className={inputClass} value={editing.completedDate} onChange={e => setEditing({ ...editing, completedDate: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as RepairRecord['status'] })}>
            {Object.entries(repairStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) { setData(prev => ({ ...prev, repairRecords: prev.repairRecords.filter(r => r.id !== confirmDelete) })); showToast('Đã xóa', 'success'); } }} message="Xóa phiếu sửa chữa?" />
    </div>
  );
};

// ===== RECEIVING =====
export const ReceivingManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReceivingRecord>({ id: '', contractId: '', equipmentId: '', quantity: 1, model: '', serial: '', accessoriesChecked: false, configChecked: false, deliveryDate: '', installer: '', testResult: '', acceptanceNote: '', receivingDept: '', deliverer: '', receiver: '', status: 'pending', createdAt: '' });

  const handleSave = () => {
    if (editing.id) {
      setData(prev => ({ ...prev, receivingRecords: prev.receivingRecords.map(r => r.id === editing.id ? editing : r) }));
      showToast('Cập nhật phiếu tiếp nhận thành công', 'success');
    } else {
      setData(prev => ({ ...prev, receivingRecords: [...prev.receivingRecords, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Tạo phiếu tiếp nhận thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'contractId', label: 'Hợp đồng', render: (r: ReceivingRecord) => data.contracts.find(c => c.id === r.contractId)?.code || '-' },
    { key: 'model', label: 'Model' },
    { key: 'serial', label: 'Serial' },
    { key: 'quantity', label: 'SL' },
    { key: 'deliveryDate', label: 'Ngày giao', render: (r: ReceivingRecord) => formatDate(r.deliveryDate) },
    { key: 'status', label: 'Trạng thái', render: (r: ReceivingRecord) => <StatusBadge status={r.status} label={r.status === 'accepted' ? 'Đã nghiệm thu' : r.status === 'rejected' ? 'Từ chối' : 'Chờ'} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Tiếp nhận & Nghiệm thu</h1></div>
        <button onClick={() => { setEditing({ id: '', contractId: '', equipmentId: '', quantity: 1, model: '', serial: '', accessoriesChecked: false, configChecked: false, deliveryDate: '', installer: '', testResult: '', acceptanceNote: '', receivingDept: '', deliverer: '', receiver: '', status: 'pending', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Tạo phiếu tiếp nhận</button>
      </div>
      <DataTable columns={columns} data={data.receivingRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: ReceivingRecord) => (
          <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa phiếu tiếp nhận' : 'Phiếu tiếp nhận thiết bị'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Hợp đồng"><select className={selectClass} value={editing.contractId} onChange={e => setEditing({ ...editing, contractId: e.target.value })}>
            <option value="">-- Chọn HĐ --</option>{data.contracts.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
          </select></FormField>
          <FormField label="Khoa nhận bàn giao"><select className={selectClass} value={editing.receivingDept} onChange={e => setEditing({ ...editing, receivingDept: e.target.value })}>
            <option value="">-- Chọn --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></FormField>
          <FormField label="Model"><input className={inputClass} value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} /></FormField>
          <FormField label="Serial"><input className={inputClass} value={editing.serial} onChange={e => setEditing({ ...editing, serial: e.target.value })} /></FormField>
          <FormField label="Số lượng"><input type="number" className={inputClass} value={editing.quantity} onChange={e => setEditing({ ...editing, quantity: Number(e.target.value) })} /></FormField>
          <FormField label="Ngày giao hàng"><input type="date" className={inputClass} value={editing.deliveryDate} onChange={e => setEditing({ ...editing, deliveryDate: e.target.value })} /></FormField>
          <FormField label="Đơn vị lắp đặt"><input className={inputClass} value={editing.installer} onChange={e => setEditing({ ...editing, installer: e.target.value })} /></FormField>
          <FormField label="Người bàn giao"><input className={inputClass} value={editing.deliverer} onChange={e => setEditing({ ...editing, deliverer: e.target.value })} /></FormField>
          <FormField label="Người nhận"><input className={inputClass} value={editing.receiver} onChange={e => setEditing({ ...editing, receiver: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as ReceivingRecord['status'] })}>
            <option value="pending">Chờ nghiệm thu</option><option value="accepted">Đã nghiệm thu</option><option value="rejected">Từ chối</option>
          </select></FormField>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.accessoriesChecked} onChange={e => setEditing({ ...editing, accessoriesChecked: e.target.checked })} /> Kiểm tra phụ kiện</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.configChecked} onChange={e => setEditing({ ...editing, configChecked: e.target.checked })} /> Kiểm tra cấu hình</label>
          </div>
          <div className="md:col-span-2"><FormField label="Kết quả chạy thử"><textarea className={inputClass} rows={2} value={editing.testResult} onChange={e => setEditing({ ...editing, testResult: e.target.value })} /></FormField></div>
          <div className="md:col-span-2"><FormField label="Biên bản nghiệm thu"><textarea className={inputClass} rows={2} value={editing.acceptanceNote} onChange={e => setEditing({ ...editing, acceptanceNote: e.target.value })} /></FormField></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
    </div>
  );
};

// ===== TRAINING =====
export const TrainingManager: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingRecord>({ id: '', equipmentId: '', courseName: '', trainer: '', trainingOrg: '', participants: '', trainingDate: '', content: '', result: '', documents: '', retrainDate: '', createdAt: '' });

  const handleSave = () => {
    if (editing.id) {
      setData(prev => ({ ...prev, trainingRecords: prev.trainingRecords.map(t => t.id === editing.id ? editing : t) }));
      showToast('Cập nhật thành công', 'success');
    } else {
      setData(prev => ({ ...prev, trainingRecords: [...prev.trainingRecords, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm khóa đào tạo thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'courseName', label: 'Tên khóa đào tạo' },
    { key: 'equipmentId', label: 'Thiết bị', render: (r: TrainingRecord) => data.equipment.find(e => e.id === r.equipmentId)?.name || '-' },
    { key: 'trainer', label: 'Người đào tạo' },
    { key: 'trainingDate', label: 'Ngày đào tạo', render: (r: TrainingRecord) => formatDate(r.trainingDate) },
    { key: 'result', label: 'Kết quả' },
    { key: 'retrainDate', label: 'Đào tạo lại', render: (r: TrainingRecord) => formatDate(r.retrainDate) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Đào tạo</h1></div>
        <button onClick={() => { setEditing({ id: '', equipmentId: '', courseName: '', trainer: '', trainingOrg: '', participants: '', trainingDate: '', content: '', result: '', documents: '', retrainDate: '', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm khóa đào tạo</button>
      </div>
      <DataTable columns={columns} data={data.trainingRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: TrainingRecord) => (
          <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa khóa đào tạo' : 'Thêm khóa đào tạo'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><FormField label="Tên khóa đào tạo" required><input className={inputClass} value={editing.courseName} onChange={e => setEditing({ ...editing, courseName: e.target.value })} /></FormField></div>
          <FormField label="Thiết bị"><select className={selectClass} value={editing.equipmentId} onChange={e => setEditing({ ...editing, equipmentId: e.target.value })}>
            <option value="">-- Chọn --</option>{data.equipment.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
          </select></FormField>
          <FormField label="Đơn vị đào tạo"><input className={inputClass} value={editing.trainingOrg} onChange={e => setEditing({ ...editing, trainingOrg: e.target.value })} /></FormField>
          <FormField label="Người đào tạo"><input className={inputClass} value={editing.trainer} onChange={e => setEditing({ ...editing, trainer: e.target.value })} /></FormField>
          <FormField label="Ngày đào tạo"><input type="date" className={inputClass} value={editing.trainingDate} onChange={e => setEditing({ ...editing, trainingDate: e.target.value })} /></FormField>
          <div className="md:col-span-2"><FormField label="Nhân viên tham gia"><input className={inputClass} value={editing.participants} onChange={e => setEditing({ ...editing, participants: e.target.value })} /></FormField></div>
          <div className="md:col-span-2"><FormField label="Nội dung đào tạo"><textarea className={inputClass} rows={2} value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} /></FormField></div>
          <FormField label="Kết quả"><input className={inputClass} value={editing.result} onChange={e => setEditing({ ...editing, result: e.target.value })} /></FormField>
          <FormField label="Lịch đào tạo lại"><input type="date" className={inputClass} value={editing.retrainDate} onChange={e => setEditing({ ...editing, retrainDate: e.target.value })} /></FormField>
          <div className="md:col-span-2"><FormField label="Tài liệu hướng dẫn"><input className={inputClass} value={editing.documents} onChange={e => setEditing({ ...editing, documents: e.target.value })} /></FormField></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
    </div>
  );
};

// ===== TRANSFER & LIQUIDATION =====
export const TransferLiquidation: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [tab, setTab] = useState<'transfer' | 'liquidation'>('transfer');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<TransferRecord>({ id: '', equipmentId: '', fromDeptId: '', toDeptId: '', transferDate: '', reason: '', deliverer: '', receiver: '', handoverNote: '', status: 'pending', createdAt: '' });
  const [editingLiq, setEditingLiq] = useState<LiquidationRecord>({ id: '', equipmentId: '', reason: '', condition: '', proposedDate: '', proposer: '', inspectionDoc: '', approvalStatus: 'pending', disposalMethod: '', completedDate: '', createdAt: '' });

  const handleSaveTransfer = () => {
    if (!editingTransfer.equipmentId || !editingTransfer.toDeptId) { showToast('Chọn thiết bị và khoa nhận', 'error'); return; }
    const item = { ...editingTransfer, id: editingTransfer.id || Date.now().toString(), createdAt: editingTransfer.createdAt || new Date().toISOString().split('T')[0] };
    if (editingTransfer.id) {
      setData(prev => ({ ...prev, transferRecords: prev.transferRecords.map(t => t.id === item.id ? item : t) }));
    } else {
      setData(prev => ({ ...prev, transferRecords: [...prev.transferRecords, item] }));
      // Update equipment department
      setData(prev => ({ ...prev, equipment: prev.equipment.map(e => e.id === item.equipmentId ? { ...e, departmentId: item.toDeptId } : e) }));
    }
    showToast('Lưu điều chuyển thành công', 'success');
    setModalOpen(false);
  };

  const handleSaveLiq = () => {
    if (!editingLiq.equipmentId) { showToast('Chọn thiết bị', 'error'); return; }
    const item = { ...editingLiq, id: editingLiq.id || Date.now().toString(), createdAt: editingLiq.createdAt || new Date().toISOString().split('T')[0] };
    if (editingLiq.id) {
      setData(prev => ({ ...prev, liquidationRecords: prev.liquidationRecords.map(l => l.id === item.id ? item : l) }));
    } else {
      setData(prev => ({ ...prev, liquidationRecords: [...prev.liquidationRecords, item] }));
    }
    if (editingLiq.approvalStatus === 'approved') {
      setData(prev => ({ ...prev, equipment: prev.equipment.map(e => e.id === editingLiq.equipmentId ? { ...e, status: 'liquidated' as const } : e) }));
    }
    showToast('Lưu thanh lý thành công', 'success');
    setModalOpen(false);
  };

  const transferColumns = [
    { key: 'equipmentId', label: 'Thiết bị', render: (r: TransferRecord) => data.equipment.find(e => e.id === r.equipmentId)?.name || '-' },
    { key: 'fromDeptId', label: 'Từ', render: (r: TransferRecord) => data.departments.find(d => d.id === r.fromDeptId)?.name || '-' },
    { key: 'toDeptId', label: 'Đến', render: (r: TransferRecord) => data.departments.find(d => d.id === r.toDeptId)?.name || '-' },
    { key: 'transferDate', label: 'Ngày', render: (r: TransferRecord) => formatDate(r.transferDate) },
    { key: 'reason', label: 'Lý do' },
    { key: 'status', label: 'Trạng thái', render: (r: TransferRecord) => <StatusBadge status={r.status} label={r.status === 'completed' ? 'Hoàn thành' : 'Chờ'} /> },
  ];

  const liqColumns = [
    { key: 'equipmentId', label: 'Thiết bị', render: (r: LiquidationRecord) => data.equipment.find(e => e.id === r.equipmentId)?.name || '-' },
    { key: 'reason', label: 'Lý do' },
    { key: 'proposedDate', label: 'Ngày đề xuất', render: (r: LiquidationRecord) => formatDate(r.proposedDate) },
    { key: 'proposer', label: 'Người đề xuất' },
    { key: 'approvalStatus', label: 'Phê duyệt', render: (r: LiquidationRecord) => <StatusBadge status={r.approvalStatus} label={r.approvalStatus === 'approved' ? 'Đã duyệt' : r.approvalStatus === 'rejected' ? 'Từ chối' : 'Chờ'} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Điều chuyển & Thanh lý</h1></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setTab('transfer')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'transfer' ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>Điều chuyển</button>
        <button onClick={() => setTab('liquidation')} className={`px-4 py-2 rounded-lg font-medium ${tab === 'liquidation' ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}>Thanh lý</button>
      </div>

      {tab === 'transfer' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setEditingTransfer({ id: '', equipmentId: '', fromDeptId: '', toDeptId: '', transferDate: '', reason: '', deliverer: '', receiver: '', handoverNote: '', status: 'pending', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Lập phiếu điều chuyển</button>
          </div>
          <DataTable columns={transferColumns} data={data.transferRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
            actions={(row: TransferRecord) => <button onClick={() => { setEditingTransfer(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>}
          />
        </>
      )}

      {tab === 'liquidation' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setEditingLiq({ id: '', equipmentId: '', reason: '', condition: '', proposedDate: '', proposer: '', inspectionDoc: '', approvalStatus: 'pending', disposalMethod: '', completedDate: '', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Plus size={18} /> Đề xuất thanh lý</button>
          </div>
          <DataTable columns={liqColumns} data={data.liquidationRecords} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
            actions={(row: LiquidationRecord) => <button onClick={() => { setEditingLiq(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>}
          />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={tab === 'transfer' ? 'Phiếu điều chuyển' : 'Đề xuất thanh lý'} size="lg">
        {tab === 'transfer' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Thiết bị" required><select className={selectClass} value={editingTransfer.equipmentId} onChange={e => setEditingTransfer({ ...editingTransfer, equipmentId: e.target.value })}>
              <option value="">-- Chọn --</option>{data.equipment.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
            </select></FormField>
            <FormField label="Ngày điều chuyển"><input type="date" className={inputClass} value={editingTransfer.transferDate} onChange={e => setEditingTransfer({ ...editingTransfer, transferDate: e.target.value })} /></FormField>
            <FormField label="Khoa/Phòng cũ"><select className={selectClass} value={editingTransfer.fromDeptId} onChange={e => setEditingTransfer({ ...editingTransfer, fromDeptId: e.target.value })}>
              <option value="">-- Chọn --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select></FormField>
            <FormField label="Khoa/Phòng mới" required><select className={selectClass} value={editingTransfer.toDeptId} onChange={e => setEditingTransfer({ ...editingTransfer, toDeptId: e.target.value })}>
              <option value="">-- Chọn --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select></FormField>
            <FormField label="Người bàn giao"><input className={inputClass} value={editingTransfer.deliverer} onChange={e => setEditingTransfer({ ...editingTransfer, deliverer: e.target.value })} /></FormField>
            <FormField label="Người nhận"><input className={inputClass} value={editingTransfer.receiver} onChange={e => setEditingTransfer({ ...editingTransfer, receiver: e.target.value })} /></FormField>
            <div className="md:col-span-2"><FormField label="Lý do"><textarea className={inputClass} rows={2} value={editingTransfer.reason} onChange={e => setEditingTransfer({ ...editingTransfer, reason: e.target.value })} /></FormField></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Thiết bị" required><select className={selectClass} value={editingLiq.equipmentId} onChange={e => setEditingLiq({ ...editingLiq, equipmentId: e.target.value })}>
              <option value="">-- Chọn --</option>{data.equipment.map(e => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
            </select></FormField>
            <FormField label="Ngày đề xuất"><input type="date" className={inputClass} value={editingLiq.proposedDate} onChange={e => setEditingLiq({ ...editingLiq, proposedDate: e.target.value })} /></FormField>
            <div className="md:col-span-2"><FormField label="Lý do thanh lý"><textarea className={inputClass} rows={2} value={editingLiq.reason} onChange={e => setEditingLiq({ ...editingLiq, reason: e.target.value })} /></FormField></div>
            <FormField label="Tình trạng thiết bị"><input className={inputClass} value={editingLiq.condition} onChange={e => setEditingLiq({ ...editingLiq, condition: e.target.value })} /></FormField>
            <FormField label="Người đề xuất"><input className={inputClass} value={editingLiq.proposer} onChange={e => setEditingLiq({ ...editingLiq, proposer: e.target.value })} /></FormField>
            <FormField label="Phương án xử lý"><input className={inputClass} value={editingLiq.disposalMethod} onChange={e => setEditingLiq({ ...editingLiq, disposalMethod: e.target.value })} /></FormField>
            <FormField label="Phê duyệt"><select className={selectClass} value={editingLiq.approvalStatus} onChange={e => setEditingLiq({ ...editingLiq, approvalStatus: e.target.value as LiquidationRecord['approvalStatus'] })}>
              <option value="pending">Chờ phê duyệt</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option>
            </select></FormField>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={tab === 'transfer' ? handleSaveTransfer : handleSaveLiq} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
    </div>
  );
};
