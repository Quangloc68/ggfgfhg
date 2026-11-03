import React from 'react';
import { useData } from '../store/DataContext';
import { StatCard, formatCurrency } from './UI';
import { Activity, Package, Wrench, AlertTriangle, Clock, FileText, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { data } = useData();
  const { equipment, departments, bidPackages, maintenanceRecords, contracts } = data;

  const totalEquip = equipment.length;
  const activeEquip = equipment.filter(e => e.status === 'active').length;
  const maintenanceEquip = equipment.filter(e => e.status === 'maintenance').length;
  const repairEquip = equipment.filter(e => e.status === 'repair').length;
  const inactiveEquip = equipment.filter(e => e.status === 'inactive').length;

  const now = new Date();
  const warrantyExpiring = equipment.filter(e => {
    if (!e.warrantyExpiry) return false;
    const exp = new Date(e.warrantyExpiry);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  }).length;

  const maintenanceDue = maintenanceRecords.filter(m => {
    if (!m.scheduledDate || m.status === 'completed') return false;
    const sched = new Date(m.scheduledDate);
    return sched <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }).length;

  const totalBids = bidPackages.length;
  const activeBids = bidPackages.filter(b => b.status === 'bidding' || b.status === 'evaluating').length;
  const totalPurchaseValue = contracts.reduce((sum, c) => sum + c.value, 0);

  // Chart data
  const deptChartData = departments.map(d => ({
    name: d.name.replace('Khoa ', '').replace('Phòng ', ''),
    value: equipment.filter(e => e.departmentId === d.id).length
  })).filter(d => d.value > 0);

  const statusChartData = [
    { name: 'Hoạt động', value: activeEquip, color: '#10b981' },
    { name: 'Bảo trì', value: maintenanceEquip, color: '#f59e0b' },
    { name: 'Sửa chữa', value: repairEquip, color: '#f97316' },
    { name: 'Ngừng HĐ', value: inactiveEquip, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const groupChartData = data.equipmentGroups.map(g => ({
    name: g.name.replace('Thiết bị ', ''),
    value: equipment.filter(e => e.groupId === g.id).length
  })).filter(g => g.value > 0);

  const monthlyCostData = [
    { month: 'T1', cost: 15000000 },
    { month: 'T2', cost: 22000000 },
    { month: 'T3', cost: 18000000 },
    { month: 'T4', cost: 35000000 },
    { month: 'T5', cost: 28000000 },
    { month: 'T6', cost: 42000000 },
    { month: 'T7', cost: 25000000 },
  ];

  const procurementData = [
    { name: 'Đã hoàn thành', value: contracts.filter(c => c.status === 'completed').length },
    { name: 'Đang thực hiện', value: contracts.filter(c => c.status === 'active').length },
    { name: 'Gói thầu', value: totalBids },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard - Tổng quan</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng quan tình hình trang thiết bị y tế</p>
        </div>
        <div className="text-sm text-gray-500">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng thiết bị" value={totalEquip} icon={<Package className="text-blue-600" size={24} />} color="bg-blue-100" subtitle={`${data.equipmentGroups.length} nhóm thiết bị`} />
        <StatCard title="Đang hoạt động" value={activeEquip} icon={<CheckCircle className="text-green-600" size={24} />} color="bg-green-100" subtitle={`${Math.round(activeEquip / totalEquip * 100)}% tổng số`} />
        <StatCard title="Đang bảo trì" value={maintenanceEquip} icon={<Wrench className="text-yellow-600" size={24} />} color="bg-yellow-100" />
        <StatCard title="Đang sửa chữa" value={repairEquip} icon={<AlertTriangle className="text-orange-600" size={24} />} color="bg-orange-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ngừng hoạt động" value={inactiveEquip} icon={<XCircle className="text-gray-600" size={24} />} color="bg-gray-100" />
        <StatCard title="Sắp hết bảo hành" value={warrantyExpiring} icon={<Clock className="text-purple-600" size={24} />} color="bg-purple-100" subtitle="Trong 90 ngày tới" />
        <StatCard title="Đến hạn bảo trì" value={maintenanceDue} icon={<Activity className="text-indigo-600" size={24} />} color="bg-indigo-100" subtitle="Trong 7 ngày tới" />
        <StatCard title="Tổng gói thầu" value={totalBids} icon={<FileText className="text-teal-600" size={24} />} color="bg-teal-100" subtitle={`${activeBids} đang thực hiện`} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-800">Tổng giá trị mua sắm</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPurchaseValue)}</p>
        <p className="text-sm text-gray-500 mt-1">{contracts.length} hợp đồng đã ký</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} /> Thiết bị theo Khoa/Phòng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Tình trạng hoạt động</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Thiết bị theo nhóm chuyên môn</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={groupChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" fontSize={11} width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Chi phí bảo trì theo tháng (VNĐ)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} name="Chi phí" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Tình hình mua sắm và đấu thầu</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={procurementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
