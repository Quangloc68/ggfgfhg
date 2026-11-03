import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { ProcurementRequest, ProcurementPlan, BidPackage, BidEvaluation } from '../types';
import { Modal, ConfirmDialog, DataTable, StatusBadge, FormField, inputClass, selectClass, usePagination, formatCurrency, formatDate } from './UI';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const priorityLabels: Record<string, string> = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' };
const reqStatusLabels: Record<string, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', in_progress: 'Đang xử lý' };
const planStatusLabels: Record<string, string> = { draft: 'Nháp', approved: 'Đã duyệt', in_progress: 'Đang thực hiện', completed: 'Hoàn thành' };
const bidStatusLabels: Record<string, string> = { preparing: 'Chuẩn bị', bidding: 'Đang mời thầu', evaluating: 'Đang đánh giá', awarded: 'Đã trao thầu', completed: 'Hoàn thành', cancelled: 'Hủy' };

// ===== PROCUREMENT REQUESTS =====
export const ProcurementRequests: React.FC = () => {
  const { data, setData, showToast, addLog } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProcurementRequest>({
    id: '', departmentId: '', equipmentName: '', quantity: 1, reason: '', technicalRequirements: '',
    estimatedBudget: 0, priority: 'medium', status: 'pending', createdAt: ''
  });

  const handleSave = () => {
    if (!editing.equipmentName || !editing.departmentId) { showToast('Vui lòng điền đầy đủ thông tin', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, procurementRequests: prev.procurementRequests.map(r => r.id === editing.id ? editing : r) }));
      showToast('Cập nhật đề xuất thành công', 'success');
    } else {
      const newItem = { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
      setData(prev => ({ ...prev, procurementRequests: [...prev.procurementRequests, newItem] }));
      addLog('Thêm đề xuất mua sắm', 'Mua sắm', editing.equipmentName);
      showToast('Thêm đề xuất thành công', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setData(prev => ({ ...prev, procurementRequests: prev.procurementRequests.filter(r => r.id !== id) }));
    showToast('Đã xóa đề xuất', 'success');
  };

  const columns = [
    { key: 'equipmentName', label: 'Tên thiết bị' },
    { key: 'departmentId', label: 'Khoa/Phòng', render: (r: ProcurementRequest) => data.departments.find(d => d.id === r.departmentId)?.name || '-' },
    { key: 'quantity', label: 'SL', width: '60px' },
    { key: 'estimatedBudget', label: 'Kinh phí', render: (r: ProcurementRequest) => formatCurrency(r.estimatedBudget) },
    { key: 'priority', label: 'Ưu tiên', render: (r: ProcurementRequest) => <StatusBadge status={r.priority} label={priorityLabels[r.priority]} /> },
    { key: 'status', label: 'Trạng thái', render: (r: ProcurementRequest) => <StatusBadge status={r.status} label={reqStatusLabels[r.status]} /> },
    { key: 'createdAt', label: 'Ngày tạo', render: (r: ProcurementRequest) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Đề xuất mua sắm</h1><p className="text-gray-500 text-sm">{data.procurementRequests.length} đề xuất</p></div>
        <button onClick={() => { setEditing({ id: '', departmentId: '', equipmentName: '', quantity: 1, reason: '', technicalRequirements: '', estimatedBudget: 0, priority: 'medium', status: 'pending', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm đề xuất</button>
      </div>
      <DataTable columns={columns} data={data.procurementRequests} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: ProcurementRequest) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa đề xuất' : 'Đề xuất mua sắm mới'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Khoa/Phòng đề xuất" required><select className={selectClass} value={editing.departmentId} onChange={e => setEditing({ ...editing, departmentId: e.target.value })}>
            <option value="">-- Chọn --</option>{data.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select></FormField>
          <FormField label="Tên thiết bị" required><input className={inputClass} value={editing.equipmentName} onChange={e => setEditing({ ...editing, equipmentName: e.target.value })} /></FormField>
          <FormField label="Số lượng"><input type="number" className={inputClass} value={editing.quantity} onChange={e => setEditing({ ...editing, quantity: Number(e.target.value) })} /></FormField>
          <FormField label="Kinh phí dự kiến"><input type="number" className={inputClass} value={editing.estimatedBudget} onChange={e => setEditing({ ...editing, estimatedBudget: Number(e.target.value) })} /></FormField>
          <FormField label="Mức độ ưu tiên"><select className={selectClass} value={editing.priority} onChange={e => setEditing({ ...editing, priority: e.target.value as ProcurementRequest['priority'] })}>
            {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as ProcurementRequest['status'] })}>
            {Object.entries(reqStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
          <div className="md:col-span-2"><FormField label="Lý do mua sắm"><textarea className={inputClass} rows={2} value={editing.reason} onChange={e => setEditing({ ...editing, reason: e.target.value })} /></FormField></div>
          <div className="md:col-span-2"><FormField label="Yêu cầu kỹ thuật"><textarea className={inputClass} rows={2} value={editing.technicalRequirements} onChange={e => setEditing({ ...editing, technicalRequirements: e.target.value })} /></FormField></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete)} message="Xóa đề xuất này?" />
    </div>
  );
};

// ===== PROCUREMENT PLANS =====
export const ProcurementPlans: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProcurementPlan>({ id: '', code: '', name: '', year: 2024, fundSource: '', estimatedBudget: 0, equipmentList: '', status: 'draft', createdAt: '' });

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Nhập mã và tên kế hoạch', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, procurementPlans: prev.procurementPlans.map(p => p.id === editing.id ? editing : p) }));
      showToast('Cập nhật kế hoạch thành công', 'success');
    } else {
      setData(prev => ({ ...prev, procurementPlans: [...prev.procurementPlans, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm kế hoạch thành công', 'success');
    }
    setModalOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Mã KH' },
    { key: 'name', label: 'Tên kế hoạch' },
    { key: 'year', label: 'Năm' },
    { key: 'fundSource', label: 'Nguồn KP' },
    { key: 'estimatedBudget', label: 'Kinh phí', render: (r: ProcurementPlan) => formatCurrency(r.estimatedBudget) },
    { key: 'status', label: 'Trạng thái', render: (r: ProcurementPlan) => <StatusBadge status={r.status} label={planStatusLabels[r.status]} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Kế hoạch mua sắm</h1></div>
        <button onClick={() => { setEditing({ id: '', code: '', name: '', year: 2024, fundSource: '', estimatedBudget: 0, equipmentList: '', status: 'draft', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm kế hoạch</button>
      </div>
      <DataTable columns={columns} data={data.procurementPlans} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: ProcurementPlan) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa kế hoạch' : 'Kế hoạch mua sắm mới'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Mã kế hoạch" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
            <FormField label="Năm"><input type="number" className={inputClass} value={editing.year} onChange={e => setEditing({ ...editing, year: Number(e.target.value) })} /></FormField>
          </div>
          <FormField label="Tên kế hoạch" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField>
          <FormField label="Nguồn kinh phí"><input className={inputClass} value={editing.fundSource} onChange={e => setEditing({ ...editing, fundSource: e.target.value })} /></FormField>
          <FormField label="Tổng kinh phí dự kiến"><input type="number" className={inputClass} value={editing.estimatedBudget} onChange={e => setEditing({ ...editing, estimatedBudget: Number(e.target.value) })} /></FormField>
          <FormField label="Danh mục thiết bị"><textarea className={inputClass} rows={3} value={editing.equipmentList} onChange={e => setEditing({ ...editing, equipmentList: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as ProcurementPlan['status'] })}>
            {Object.entries(planStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && setData(prev => ({ ...prev, procurementPlans: prev.procurementPlans.filter(p => p.id !== confirmDelete) }))} message="Xóa kế hoạch này?" />
    </div>
  );
};

// ===== BID PACKAGES =====
export const BidPackages: React.FC = () => {
  const { data, setData, showToast } = useData();
  const { page, setPage, pageSize, search, setSearch } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [evalOpen, setEvalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<BidPackage>({ id: '', code: '', name: '', planId: '', packageValue: 0, capitalSource: '', startDate: '', endDate: '', selectionMethod: '', selectionMode: '', status: 'preparing', attachments: '', createdAt: '' });
  const [evalItem, setEvalItem] = useState<BidEvaluation>({ id: '', bidPackageId: '', bidderId: '', technicalScore: 0, financialScore: 0, configCompliance: '', warranty: '', training: '', technicalService: '', bidPrice: 0, expertComments: '', result: 'pending', createdAt: '' });

  const handleSave = () => {
    if (!editing.code || !editing.name) { showToast('Nhập mã và tên gói thầu', 'error'); return; }
    if (editing.id) {
      setData(prev => ({ ...prev, bidPackages: prev.bidPackages.map(b => b.id === editing.id ? editing : b) }));
      showToast('Cập nhật gói thầu thành công', 'success');
    } else {
      setData(prev => ({ ...prev, bidPackages: [...prev.bidPackages, { ...editing, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] }));
      showToast('Thêm gói thầu thành công', 'success');
    }
    setModalOpen(false);
  };

  const handleSaveEval = () => {
    if (!evalItem.bidderId) { showToast('Chọn nhà thầu', 'error'); return; }
    const newEval = { ...evalItem, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
    setData(prev => ({ ...prev, bidEvaluations: [...prev.bidEvaluations, newEval] }));
    showToast('Thêm đánh giá thành công', 'success');
    setEvalOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Mã GT' },
    { key: 'name', label: 'Tên gói thầu' },
    { key: 'packageValue', label: 'Giá gói thầu', render: (r: BidPackage) => formatCurrency(r.packageValue) },
    { key: 'startDate', label: 'Bắt đầu', render: (r: BidPackage) => formatDate(r.startDate) },
    { key: 'endDate', label: 'Kết thúc', render: (r: BidPackage) => formatDate(r.endDate) },
    { key: 'status', label: 'Trạng thái', render: (r: BidPackage) => <StatusBadge status={r.status} label={bidStatusLabels[r.status]} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Quản lý Gói thầu</h1></div>
        <button onClick={() => { setEditing({ id: '', code: '', name: '', planId: '', packageValue: 0, capitalSource: '', startDate: '', endDate: '', selectionMethod: '', selectionMode: '', status: 'preparing', attachments: '', createdAt: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Thêm gói thầu</button>
      </div>
      <DataTable columns={columns} data={data.bidPackages} page={page} pageSize={pageSize} onPageChange={setPage} searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        actions={(row: BidPackage) => (
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => { setEvalItem({ ...evalItem, bidPackageId: row.id }); setEvalOpen(true); }} className="p-1.5 rounded hover:bg-green-100 text-green-600" title="Đánh giá"><Eye size={16} /></button>
            <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"><Edit2 size={16} /></button>
            <button onClick={() => setConfirmDelete(row.id)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 size={16} /></button>
          </div>
        )}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? 'Sửa gói thầu' : 'Thêm gói thầu mới'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Mã gói thầu" required><input className={inputClass} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></FormField>
          <FormField label="Kế hoạch liên quan"><select className={selectClass} value={editing.planId} onChange={e => setEditing({ ...editing, planId: e.target.value })}>
            <option value="">-- Không --</option>{data.procurementPlans.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
          </select></FormField>
          <div className="md:col-span-2"><FormField label="Tên gói thầu" required><input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></FormField></div>
          <FormField label="Giá gói thầu"><input type="number" className={inputClass} value={editing.packageValue} onChange={e => setEditing({ ...editing, packageValue: Number(e.target.value) })} /></FormField>
          <FormField label="Nguồn vốn"><input className={inputClass} value={editing.capitalSource} onChange={e => setEditing({ ...editing, capitalSource: e.target.value })} /></FormField>
          <FormField label="Ngày bắt đầu"><input type="date" className={inputClass} value={editing.startDate} onChange={e => setEditing({ ...editing, startDate: e.target.value })} /></FormField>
          <FormField label="Ngày kết thúc"><input type="date" className={inputClass} value={editing.endDate} onChange={e => setEditing({ ...editing, endDate: e.target.value })} /></FormField>
          <FormField label="Hình thức lựa chọn"><input className={inputClass} value={editing.selectionMethod} onChange={e => setEditing({ ...editing, selectionMethod: e.target.value })} /></FormField>
          <FormField label="Phương thức lựa chọn"><input className={inputClass} value={editing.selectionMode} onChange={e => setEditing({ ...editing, selectionMode: e.target.value })} /></FormField>
          <FormField label="Trạng thái"><select className={selectClass} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as BidPackage['status'] })}>
            {Object.entries(bidStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
        </div>
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={evalOpen} onClose={() => setEvalOpen(false)} title="Đánh giá hồ sơ dự thầu">
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            ⚠️ Kết quả đánh giá chỉ mang tính tham khảo. Việc phê duyệt nhà thầu trúng thầu phải được người có thẩm quyền quyết định.
          </div>
          <FormField label="Nhà thầu" required><select className={selectClass} value={evalItem.bidderId} onChange={e => setEvalItem({ ...evalItem, bidderId: e.target.value })}>
            <option value="">-- Chọn nhà thầu --</option>{data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Điểm kỹ thuật (0-100)"><input type="number" min="0" max="100" className={inputClass} value={evalItem.technicalScore} onChange={e => setEvalItem({ ...evalItem, technicalScore: Number(e.target.value) })} /></FormField>
            <FormField label="Điểm tài chính (0-100)"><input type="number" min="0" max="100" className={inputClass} value={evalItem.financialScore} onChange={e => setEvalItem({ ...evalItem, financialScore: Number(e.target.value) })} /></FormField>
          </div>
          <FormField label="Giá dự thầu"><input type="number" className={inputClass} value={evalItem.bidPrice} onChange={e => setEvalItem({ ...evalItem, bidPrice: Number(e.target.value) })} /></FormField>
          <FormField label="Khả năng đáp ứng cấu hình"><textarea className={inputClass} rows={2} value={evalItem.configCompliance} onChange={e => setEvalItem({ ...evalItem, configCompliance: e.target.value })} /></FormField>
          <FormField label="Bảo hành"><input className={inputClass} value={evalItem.warranty} onChange={e => setEvalItem({ ...evalItem, warranty: e.target.value })} /></FormField>
          <FormField label="Đào tạo"><input className={inputClass} value={evalItem.training} onChange={e => setEvalItem({ ...evalItem, training: e.target.value })} /></FormField>
          <FormField label="Dịch vụ kỹ thuật"><input className={inputClass} value={evalItem.technicalService} onChange={e => setEvalItem({ ...evalItem, technicalService: e.target.value })} /></FormField>
          <FormField label="Nhận xét tổ chuyên gia"><textarea className={inputClass} rows={3} value={evalItem.expertComments} onChange={e => setEvalItem({ ...evalItem, expertComments: e.target.value })} /></FormField>
          <FormField label="Kết quả"><select className={selectClass} value={evalItem.result} onChange={e => setEvalItem({ ...evalItem, result: e.target.value as BidEvaluation['result'] })}>
            <option value="pending">Chờ kết luận</option><option value="pass">Đạt</option><option value="fail">Không đạt</option>
          </select></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setEvalOpen(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
          <button onClick={handleSaveEval} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu đánh giá</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && setData(prev => ({ ...prev, bidPackages: prev.bidPackages.filter(b => b.id !== confirmDelete) }))} message="Xóa gói thầu này?" />
    </div>
  );
};
