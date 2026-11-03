import React, { useState } from 'react';
import { DataProvider } from './store/DataContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EquipmentManager } from './components/EquipmentManager';
import { DepartmentManager } from './components/DepartmentManager';
import { ProcurementRequests, ProcurementPlans, BidPackages } from './components/ProcurementModule';
import { SupplierManager, ContractManager } from './components/SupplierContract';
import { MaintenanceManager, RepairManager, ReceivingManager, TrainingManager, TransferLiquidation } from './components/OperationsModule';
import { Reports } from './components/Reports';
import { AccountManager, Settings } from './components/Settings';
import { Toast } from './components/UI';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'equipment': return <EquipmentManager />;
      case 'departments': return <DepartmentManager />;
      case 'procurement-requests': return <ProcurementRequests />;
      case 'procurement-plans': return <ProcurementPlans />;
      case 'bid-packages': return <BidPackages />;
      case 'suppliers': return <SupplierManager />;
      case 'contracts': return <ContractManager />;
      case 'receiving': return <ReceivingManager />;
      case 'maintenance': return <MaintenanceManager />;
      case 'repairs': return <RepairManager />;
      case 'training': return <TrainingManager />;
      case 'transfer': return <TransferLiquidation />;
      case 'reports': return <Reports />;
      case 'accounts': return <AccountManager />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
      <Toast />
    </DataProvider>
  );
}

export default App;
