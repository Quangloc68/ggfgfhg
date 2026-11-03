import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { formatDate, formatCurrency, StatusBadge } from './UI';
import { FileText, Download, Printer, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const statusLabels: Record<string, string> = {
  active: 'Đang hoạt động', maintenance: 'Đang bảo trì', repair: 'Đang sửa chữa',
  inactive: 'Tạm ngừng', pending_liquidation: 'Chờ thanh lý', liquidated: 'Đã thanh lý'
};

type ReportType = 'all' | 'by_dept' | 'by_group' | 'broken' | 'warranty' | 'maintenance_due' | 'maintenance_cost' | 'procurement' | 'bids' | 'suppliers' | 'contracts' | 'liquidation';

const reportOptions: { value: ReportType; label: string }[] = [
  { value: 'all', label: 'Tổng hợp thiết bị toàn bệnh viện' },
  { value: 'by_dept', label: 'Thiết bị theo Khoa/Phòng' },
  { value: 'by_group', label: 'Thiết bị theo nhóm' },
  { value: 'broken', label: 'Thiết bị hỏng và ngừng hoạt động' },
  { value: 'warranty', label: 'Thiết bị sắp hết hạn bảo hành' },
  { value: 'maintenance_due', label: 'Thiết bị đến hạn bảo trì' },
  { value: 'maintenance_cost', label: 'Chi phí bảo trì, sửa chữa' },
  { value: 'procurement', label: 'Báo cáo mua sắm' },
  { value: 'bids', label: 'Báo cáo gói thầu' },
  { value: 'suppliers', label: 'Báo cáo nhà cung cấp' },
  { value: 'contracts', label: 'Báo cáo hợp đồng' },
  { value: 'liquidation', label: 'Báo cáo thanh lý' },
];

export const Reports: React.FC = () => {
  const { data } = useData();
  const [reportType, setReportType] = useState<ReportType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const getReportData = () => {
    const now = new Date();
    switch (reportType) {
      case 'all':
        return data.equipment.map(e => ({
          'Mã TB': e.code, 'Tên thiết bị': e.name, 'Hãng SX': e.manufacturer, 'Model': e.model,
          'Serial': e.serial, 'Khoa/Phòng': data.departments.find(d => d.id === e.departmentId)?.name || '-',
          'Trạng thái': statusLabels[e.status], 'Giá mua': formatCurrency(e.price),
          'Hạn bảo hành': formatDate(e.warrantyExpiry)
        }));
      case 'by_dept':
        return data.departments.map(d => ({
          'Khoa/Phòng': d.name, 'Phụ trách': d.manager,
          'Số thiết bị': data.equipment.filter(e => e.departmentId === d.id).length,
          'Đang hoạt động': data.equipment.filter(e => e.departmentId === d.id && e.status === 'active').length,
          'Cần bảo trì': data.equipment.filter(e => e.departmentId === d.id && (e.status === 'maintenance' || e.status === 'repair')).length,
        }));
      case 'by_group':
        return data.equipmentGroups.map(g => ({
          'Nhóm thiết bị': g.name,
          'Số lượng': data.equipment.filter(e => e.groupId === g.id).length,
          'Tổng giá trị': formatCurrency(data.equipment.filter(e => e.groupId === g.id).reduce((s, e) => s + e.price, 0)),
        }));
      case 'broken':
        return data.equipment.filter(e => ['repair', 'inactive', 'pending_liquidation'].includes(e.status)).map(e => ({
          'Mã TB': e.code, 'Tên thiết bị': e.name, 'Khoa/Phòng': data.departments.find(d => d.id === e.departmentId)?.name || '-',
          'Trạng thái': statusLabels[e.status], 'Ghi chú': e.notes
        }));
      case 'warranty':
        return data.equipment.filter(e => {
          if (!e.warrantyExpiry) return false;
          const exp = new Date(e.warrantyExpiry);
          const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return diff > 0 && diff <= 90;
        }).map(e => ({
          'Mã TB': e.code, 'Tên thiết bị': e.name, 'Hạn bảo hành': formatDate(e.warrantyExpiry),
          'Khoa/Phòng': data.departments.find(d => d.id === e.departmentId)?.name || '-'
        }));
      case 'maintenance_due':
        return data.maintenanceRecords.filter(m => m.status !== 'completed').map(m => ({
          'Thiết bị': data.equipment.find(e => e.id === m.equipmentId)?.name || 'Chưa gán',
          'Loại': m.type === 'preventive' ? 'Phòng ngừa' : m.type === 'calibration' ? 'Hiệu chuẩn' : 'Sửa chữa',
          'Ngày dự kiến': formatDate(m.scheduledDate), 'KTV': m.technician, 'Trạng thái': m.status
        }));
      case 'maintenance_cost':
        return [...data.maintenanceRecords, ...data.repairRecords].map((r: any) => ({
          'Ngày': formatDate(r.completedDate || r.scheduledDate || r.createdAt),
          'Thiết bị': data.equipment.find(e => e.id === r.equipmentId)?.name || '-',
          'Loại': 'maintenance' in r ? 'Bảo trì' : 'Sửa chữa',
          'Chi phí': formatCurrency(r.cost || 0)
        }));
      case 'procurement':
        return data.procurementRequests.map(r => ({
          'Thiết bị': r.equipmentName, 'Khoa': data.departments.find(d => d.id === r.departmentId)?.name || '-',
          'SL': r.quantity, 'Kinh phí': formatCurrency(r.estimatedBudget),
          'Ưu tiên': r.priority, 'Trạng thái': r.status
        }));
      case 'bids':
        return data.bidPackages.map(b => ({
          'Mã GT': b.code, 'Tên gói thầu': b.name, 'Giá trị': formatCurrency(b.packageValue),
          'Bắt đầu': formatDate(b.startDate), 'Kết thúc': formatDate(b.endDate), 'Trạng thái': b.status
        }));
      case 'suppliers':
        return data.suppliers.map(s => ({
          'Mã NCC': s.code, 'Tên': s.name, 'MST': s.taxCode,
          'Điện thoại': s.phone, 'Email': s.email, 'Liên hệ': s.contactPerson
        }));
      case 'contracts':
        return data.contracts.map(c => ({
          'Mã HĐ': c.code, 'Tên HĐ': c.name,
          'Nhà CC': data.suppliers.find(s => s.id === c.supplierId)?.name || '-',
          'Giá trị': formatCurrency(c.value), 'Ngày ký': formatDate(c.signDate), 'Trạng thái': c.status
        }));
      case 'liquidation':
        return data.liquidationRecords.map(l => ({
          'Thiết bị': data.equipment.find(e => e.id === l.equipmentId)?.name || '-',
          'Lý do': l.reason, 'Ngày đề xuất': formatDate(l.proposedDate),
          'Người đề xuất': l.proposer, 'Phê duyệt': l.approvalStatus
        }));
      default:
        return [];
    }
  };

  const reportData = getReportData();

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `bao_cao_${reportType}_${Date.now()}.xlsx`);
  };

  const exportCSV = () => {
    if (reportData.length === 0) return;
    const headers = Object.keys(reportData[0]);
    const csv = [headers.join(','), ...reportData.map(row => headers.map(h => `"${(row as any)[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `bao_cao_${reportType}_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BarChart3 size={24} /> Báo cáo & Thống kê</h1></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" value={reportType} onChange={e => setReportType(e.target.value as ReportType)}>
              {reportOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Download size={16} /> Xuất Excel</button>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"><FileText size={16} /> Xuất CSV</button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Printer size={16} /> In báo cáo</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-800">{reportOptions.find(r => r.value === reportType)?.label}</h3>
          <p className="text-sm text-gray-500">{reportData.length} bản ghi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">STT</th>
                {reportData.length > 0 && Object.keys(reportData[0]).map(k => (
                  <th key={k} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {reportData.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-400">Không có dữ liệu</td></tr>
              ) : reportData.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  {Object.values(row).map((v, j) => <td key={j} className="px-4 py-3 text-gray-700">{String(v)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
