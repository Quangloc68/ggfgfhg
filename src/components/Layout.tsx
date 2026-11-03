import React, { useState } from 'react';
import { LayoutDashboard, Package, Building2, ShoppingCart, Users, FileCheck, Wrench, AlertTriangle, GraduationCap, ArrowRightLeft, BarChart3, Shield, Settings, Menu, X, ChevronDown, Bell, LogOut, Stethoscope } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'equipment', label: 'Trang thiết bị Y tế', icon: Package },
  { id: 'departments', label: 'Khoa / Phòng', icon: Building2 },
  { id: 'procurement', label: 'Mua sắm & Đấu thầu', icon: ShoppingCart, children: [
    { id: 'procurement-requests', label: 'Đề xuất mua sắm' },
    { id: 'procurement-plans', label: 'Kế hoạch mua sắm' },
    { id: 'bid-packages', label: 'Gói thầu' },
  ]},
  { id: 'suppliers', label: 'Nhà cung cấp', icon: Users },
  { id: 'contracts', label: 'Hợp đồng', icon: FileCheck },
  { id: 'receiving', label: 'Tiếp nhận & Nghiệm thu', icon: FileCheck },
  { id: 'maintenance', label: 'Bảo trì & Bảo dưỡng', icon: Wrench },
  { id: 'repairs', label: 'Sửa chữa & Sự cố', icon: AlertTriangle },
  { id: 'training', label: 'Đào tạo', icon: GraduationCap },
  { id: 'transfer', label: 'Điều chuyển & Thanh lý', icon: ArrowRightLeft },
  { id: 'reports', label: 'Báo cáo & Thống kê', icon: BarChart3 },
  { id: 'accounts', label: 'Tài khoản & Phân quyền', icon: Shield },
  { id: 'settings', label: 'Cài đặt & Sao lưu', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['procurement']);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setMobileOpen(false);
  };

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id || item.children?.some(c => c.id === currentPage);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => hasChildren ? toggleExpand(item.id) : handlePageChange(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <Icon size={18} className="shrink-0" />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {hasChildren && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
            </>
          )}
        </button>
        {hasChildren && isExpanded && sidebarOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map(child => (
              <button key={child.id} onClick={() => handlePageChange(child.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  currentPage === child.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 flex flex-col transition-all duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Stethoscope className="text-white" size={22} />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">MEDTECH</h1>
              <p className="text-blue-200 text-xs">MANAGER</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* Collapse button */}
        <div className="p-3 border-t hidden lg:block">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm">
            {sidebarOpen ? <><X size={16} /> Thu gọn</> : <Menu size={16} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                {menuItems.find(m => m.id === currentPage)?.label || menuItems.find(m => m.children?.some(c => c.id === currentPage))?.children?.find(c => c.id === currentPage)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-500">Hệ thống Quản lý Trang thiết bị Y tế & Đấu thầu Bệnh viện</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
