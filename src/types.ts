// ===== MEDTECH MANAGER - Type Definitions =====

export interface Department {
  id: string;
  code: string;
  name: string;
  manager: string;
  phone: string;
  location: string;
  createdAt: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  groupId: string;
  manufacturer: string;
  model: string;
  serial: string;
  country: string;
  yearManufactured: string;
  purchaseDate: string;
  usageDate: string;
  price: number;
  fundSource: string;
  supplier: string;
  contractNo: string;
  warrantyExpiry: string;
  departmentId: string;
  location: string;
  responsiblePerson: string;
  status: 'active' | 'maintenance' | 'repair' | 'inactive' | 'pending_liquidation' | 'liquidated';
  notes: string;
  createdAt: string;
}

export interface EquipmentGroup {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  equipmentCategories: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  code: string;
  name: string;
  supplierId: string;
  bidPackageId: string;
  value: number;
  signDate: string;
  duration: string;
  warrantyPeriod: string;
  deliveryProgress: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  fileUrl: string;
  createdAt: string;
}

export interface ProcurementRequest {
  id: string;
  departmentId: string;
  equipmentName: string;
  quantity: number;
  reason: string;
  technicalRequirements: string;
  estimatedBudget: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  createdAt: string;
}

export interface ProcurementPlan {
  id: string;
  code: string;
  name: string;
  year: number;
  fundSource: string;
  estimatedBudget: number;
  equipmentList: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface BidPackage {
  id: string;
  code: string;
  name: string;
  planId: string;
  packageValue: number;
  capitalSource: string;
  startDate: string;
  endDate: string;
  selectionMethod: string;
  selectionMode: string;
  status: 'preparing' | 'bidding' | 'evaluating' | 'awarded' | 'completed' | 'cancelled';
  attachments: string;
  createdAt: string;
}

export interface BidEvaluation {
  id: string;
  bidPackageId: string;
  bidderId: string;
  technicalScore: number;
  financialScore: number;
  configCompliance: string;
  warranty: string;
  training: string;
  technicalService: string;
  bidPrice: number;
  expertComments: string;
  result: 'pass' | 'fail' | 'pending';
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  type: 'preventive' | 'corrective' | 'calibration';
  scheduledDate: string;
  technician: string;
  workContent: string;
  result: string;
  cost: number;
  replacedParts: string;
  completedDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  createdAt: string;
}

export interface RepairRecord {
  id: string;
  equipmentId: string;
  departmentId: string;
  reporter: string;
  incidentDate: string;
  errorDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  imageUrl: string;
  technician: string;
  cause: string;
  solution: string;
  cost: number;
  testResult: string;
  completedDate: string;
  status: 'reported' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  createdAt: string;
}

export interface ReceivingRecord {
  id: string;
  contractId: string;
  equipmentId: string;
  quantity: number;
  model: string;
  serial: string;
  accessoriesChecked: boolean;
  configChecked: boolean;
  deliveryDate: string;
  installer: string;
  testResult: string;
  acceptanceNote: string;
  receivingDept: string;
  deliverer: string;
  receiver: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TrainingRecord {
  id: string;
  equipmentId: string;
  courseName: string;
  trainer: string;
  trainingOrg: string;
  participants: string;
  trainingDate: string;
  content: string;
  result: string;
  documents: string;
  retrainDate: string;
  createdAt: string;
}

export interface TransferRecord {
  id: string;
  equipmentId: string;
  fromDeptId: string;
  toDeptId: string;
  transferDate: string;
  reason: string;
  deliverer: string;
  receiver: string;
  handoverNote: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface LiquidationRecord {
  id: string;
  equipmentId: string;
  reason: string;
  condition: string;
  proposedDate: string;
  proposer: string;
  inspectionDoc: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  disposalMethod: string;
  completedDate: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'director' | 'supply_dept' | 'finance' | 'department' | 'technician' | 'expert';
  departmentId: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface AppState {
  departments: Department[];
  equipmentGroups: EquipmentGroup[];
  equipment: Equipment[];
  suppliers: Supplier[];
  contracts: Contract[];
  procurementRequests: ProcurementRequest[];
  procurementPlans: ProcurementPlan[];
  bidPackages: BidPackage[];
  bidEvaluations: BidEvaluation[];
  maintenanceRecords: MaintenanceRecord[];
  repairRecords: RepairRecord[];
  receivingRecords: ReceivingRecord[];
  trainingRecords: TrainingRecord[];
  transferRecords: TransferRecord[];
  liquidationRecords: LiquidationRecord[];
  users: User[];
  activityLogs: ActivityLog[];
}
