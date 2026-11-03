import { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateSampleData = (): AppState => {
  const dept1 = uuidv4(), dept2 = uuidv4(), dept3 = uuidv4(), dept4 = uuidv4(), dept5 = uuidv4(), dept6 = uuidv4(), dept7 = uuidv4(), dept8 = uuidv4();
  const grp1 = uuidv4(), grp2 = uuidv4(), grp3 = uuidv4(), grp4 = uuidv4(), grp5 = uuidv4();
  const sup1 = uuidv4(), sup2 = uuidv4(), sup3 = uuidv4();

  return {
    departments: [
      { id: dept1, code: 'HSCC', name: 'Khoa Hồi sức cấp cứu', manager: 'BS. Nguyễn Văn An', phone: '028-3800-1001', location: 'Tầng 1, Khu A', createdAt: '2024-01-15' },
      { id: dept2, code: 'CDHA', name: 'Khoa Chẩn đoán hình ảnh', manager: 'BS. Trần Thị Bình', phone: '028-3800-1002', location: 'Tầng 2, Khu B', createdAt: '2024-01-15' },
      { id: dept3, code: 'XN', name: 'Khoa Xét nghiệm', manager: 'BS. Lê Văn Cường', phone: '028-3800-1003', location: 'Tầng 1, Khu C', createdAt: '2024-01-15' },
      { id: dept4, code: 'NOI', name: 'Khoa Nội', manager: 'BS. Phạm Thị Dung', phone: '028-3800-1004', location: 'Tầng 3, Khu A', createdAt: '2024-01-15' },
      { id: dept5, code: 'NGO', name: 'Khoa Ngoại', manager: 'BS. Hoàng Văn Em', phone: '028-3800-1005', location: 'Tầng 2, Khu A', createdAt: '2024-01-15' },
      { id: dept6, code: 'SAN', name: 'Khoa Sản', manager: 'BS. Võ Thị Phương', phone: '028-3800-1006', location: 'Tầng 4, Khu A', createdAt: '2024-01-15' },
      { id: dept7, code: 'NHI', name: 'Khoa Nhi', manager: 'BS. Đỗ Văn Giang', phone: '028-3800-1007', location: 'Tầng 3, Khu B', createdAt: '2024-01-15' },
      { id: dept8, code: 'VTTB', name: 'Phòng Vật tư – Trang thiết bị y tế', manager: 'CN. Ngô Thị Hương', phone: '028-3800-1008', location: 'Tầng 1, Khu Hành chính', createdAt: '2024-01-15' },
    ],
    equipmentGroups: [
      { id: grp1, name: 'Thiết bị chẩn đoán hình ảnh', description: 'Máy siêu âm, X-quang, CT, MRI' },
      { id: grp2, name: 'Thiết bị xét nghiệm', description: 'Máy huyết học, sinh hóa, miễn dịch' },
      { id: grp3, name: 'Thiết bị theo dõi bệnh nhân', description: 'Monitor, máy điện tim, SpO2' },
      { id: grp4, name: 'Thiết bị hồi sức', description: 'Máy thở, máy sốc tim, bơm tiêm điện' },
      { id: grp5, name: 'Thiết bị phẫu thuật', description: 'Máy gây mê, dao mổ, đèn mổ' },
    ],
    equipment: [
      { id: uuidv4(), code: 'TB-CDHA-001', name: 'Máy siêu âm màu 4D', groupId: grp1, manufacturer: 'GE Healthcare', model: 'Voluson E10', serial: 'SN2023GE001', country: 'Hoa Kỳ', yearManufactured: '2023', purchaseDate: '2023-06-15', usageDate: '2023-07-01', price: 2500000000, fundSource: 'Đấu thầu tập trung', supplier: sup1, contractNo: 'HD-2023-001', warrantyExpiry: '2026-07-01', departmentId: dept2, location: 'Phòng Siêu âm 1', responsiblePerson: 'KTV. Nguyễn Văn A', status: 'active', notes: 'Máy chính khoa', createdAt: '2023-06-15' },
      { id: uuidv4(), code: 'TB-CDHA-002', name: 'Máy CT Scanner 128 lát cắt', groupId: grp1, manufacturer: 'Siemens Healthineers', model: 'SOMATOM go.Top', serial: 'SN2022SI002', country: 'Đức', yearManufactured: '2022', purchaseDate: '2022-03-10', usageDate: '2022-04-01', price: 15000000000, fundSource: 'Trái phiếu Chính phủ', supplier: sup2, contractNo: 'HD-2022-005', warrantyExpiry: '2025-04-01', departmentId: dept2, location: 'Phòng CT', responsiblePerson: 'KTV. Trần Văn B', status: 'active', notes: '', createdAt: '2022-03-10' },
      { id: uuidv4(), code: 'TB-XN-001', name: 'Máy xét nghiệm huyết học', groupId: grp2, manufacturer: 'Sysmex', model: 'XN-1000', serial: 'SN2023SY003', country: 'Nhật Bản', yearManufactured: '2023', purchaseDate: '2023-01-20', usageDate: '2023-02-01', price: 1800000000, fundSource: 'Ngân sách bệnh viện', supplier: sup3, contractNo: 'HD-2023-002', warrantyExpiry: '2026-02-01', departmentId: dept3, location: 'Phòng Huyết học', responsiblePerson: 'KTV. Lê Thị C', status: 'active', notes: '', createdAt: '2023-01-20' },
      { id: uuidv4(), code: 'TB-HSCC-001', name: 'Máy thở xâm nhập', groupId: grp4, manufacturer: 'Dräger', model: 'Evita V800', serial: 'SN2022DR004', country: 'Đức', yearManufactured: '2022', purchaseDate: '2022-08-15', usageDate: '2022-09-01', price: 1200000000, fundSource: 'Quỹ phát triển', supplier: sup1, contractNo: 'HD-2022-008', warrantyExpiry: '2025-09-01', departmentId: dept1, location: 'Giường số 1', responsiblePerson: 'ĐD. Phạm Thị D', status: 'active', notes: 'Máy chính', createdAt: '2022-08-15' },
      { id: uuidv4(), code: 'TB-HSCC-002', name: 'Monitor theo dõi bệnh nhân', groupId: grp3, manufacturer: 'Philips', model: 'IntelliVue MX800', serial: 'SN2023PH005', country: 'Hà Lan', yearManufactured: '2023', purchaseDate: '2023-04-10', usageDate: '2023-05-01', price: 450000000, fundSource: 'Đấu thầu tập trung', supplier: sup2, contractNo: 'HD-2023-003', warrantyExpiry: '2026-05-01', departmentId: dept1, location: 'Giường số 5', responsiblePerson: 'ĐD. Nguyễn Văn E', status: 'active', notes: '', createdAt: '2023-04-10' },
      { id: uuidv4(), code: 'TB-NOI-001', name: 'Máy điện tim 12 chuyển đạo', groupId: grp3, manufacturer: 'Nihon Kohden', model: 'ECG-2550', serial: 'SN2021NK006', country: 'Nhật Bản', yearManufactured: '2021', purchaseDate: '2021-11-05', usageDate: '2021-12-01', price: 180000000, fundSource: 'Ngân sách bệnh viện', supplier: sup3, contractNo: 'HD-2021-012', warrantyExpiry: '2024-12-01', departmentId: dept4, location: 'Phòng khám 3', responsiblePerson: 'BS. Phạm Thị D', status: 'maintenance', notes: 'Đang bảo trì định kỳ', createdAt: '2021-11-05' },
      { id: uuidv4(), code: 'TB-NGO-001', name: 'Máy gây mê kèm thở', groupId: grp5, manufacturer: 'GE Healthcare', model: 'Aisys CS2', serial: 'SN2022GE007', country: 'Hoa Kỳ', yearManufactured: '2022', purchaseDate: '2022-06-20', usageDate: '2022-07-15', price: 2200000000, fundSource: 'Trái phiếu Chính phủ', supplier: sup1, contractNo: 'HD-2022-010', warrantyExpiry: '2025-07-15', departmentId: dept5, location: 'Phòng mổ 1', responsiblePerson: 'BS. Hoàng Văn Em', status: 'active', notes: '', createdAt: '2022-06-20' },
      { id: uuidv4(), code: 'TB-NGO-002', name: 'Dao mổ điện cao tần', groupId: grp5, manufacturer: 'Erbe', model: 'VIO 300 D', serial: 'SN2023ER008', country: 'Đức', yearManufactured: '2023', purchaseDate: '2023-02-28', usageDate: '2023-03-15', price: 650000000, fundSource: 'Ngân sách bệnh viện', supplier: sup2, contractNo: 'HD-2023-004', warrantyExpiry: '2026-03-15', departmentId: dept5, location: 'Phòng mổ 2', responsiblePerson: 'BS. Hoàng Văn Em', status: 'repair', notes: 'Đang sửa chữa - lỗi board mạch', createdAt: '2023-02-28' },
      { id: uuidv4(), code: 'TB-SAN-001', name: 'Máy monitor sản khoa', groupId: grp3, manufacturer: 'Philips', model: 'Avalon FM20', serial: 'SN2022PH009', country: 'Hà Lan', yearManufactured: '2022', purchaseDate: '2022-09-10', usageDate: '2022-10-01', price: 380000000, fundSource: 'Đấu thầu tập trung', supplier: sup1, contractNo: 'HD-2022-015', warrantyExpiry: '2025-10-01', departmentId: dept6, location: 'Phòng sinh 1', responsiblePerson: 'BS. Võ Thị Phương', status: 'active', notes: '', createdAt: '2022-09-10' },
      { id: uuidv4(), code: 'TB-NHI-001', name: 'Lồng ấp trẻ sơ sinh', groupId: grp4, manufacturer: 'Draeger', model: 'Caleo', serial: 'SN2023DR010', country: 'Đức', yearManufactured: '2023', purchaseDate: '2023-05-20', usageDate: '2023-06-01', price: 520000000, fundSource: 'Quỹ từ thiện', supplier: sup3, contractNo: 'HD-2023-006', warrantyExpiry: '2026-06-01', departmentId: dept7, location: 'Khu chăm sóc đặc biệt', responsiblePerson: 'BS. Đỗ Văn Giang', status: 'active', notes: '', createdAt: '2023-05-20' },
      { id: uuidv4(), code: 'TB-XN-002', name: 'Máy xét nghiệm sinh hóa', groupId: grp2, manufacturer: 'Roche', model: 'cobas c 501', serial: 'SN2020RO011', country: 'Thụy Sĩ', yearManufactured: '2020', purchaseDate: '2020-07-15', usageDate: '2020-08-01', price: 3200000000, fundSource: 'ODA', supplier: sup2, contractNo: 'HD-2020-003', warrantyExpiry: '2025-08-01', departmentId: dept3, location: 'Phòng Sinh hóa', responsiblePerson: 'KTV. Lê Thị C', status: 'active', notes: 'Cần hiệu chuẩn lại', createdAt: '2020-07-15' },
      { id: uuidv4(), code: 'TB-CDHA-003', name: 'Máy X-quang kỹ thuật số', groupId: grp1, manufacturer: 'Shimadzu', model: 'FlexVision+', serial: 'SN2019SM012', country: 'Nhật Bản', yearManufactured: '2019', purchaseDate: '2019-04-10', usageDate: '2019-05-01', price: 4500000000, fundSource: 'Ngân sách nhà nước', supplier: sup1, contractNo: 'HD-2019-001', warrantyExpiry: '2024-05-01', departmentId: dept2, location: 'Phòng X-quang 1', responsiblePerson: 'KTV. Trần Văn B', status: 'inactive', notes: 'Hết hạn bảo hành, chờ nâng cấp', createdAt: '2019-04-10' },
    ],
    suppliers: [
      { id: sup1, code: 'NCC-001', name: 'Công ty TNHH Thiết bị Y tế Minh Anh', taxCode: '0301234567', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM', phone: '028-5411-0001', email: 'contact@minhanhmed.com', contactPerson: 'Ông Trương Văn Minh', equipmentCategories: 'Siêu âm, máy thở, monitor, máy gây mê', createdAt: '2020-01-10' },
      { id: sup2, code: 'NCC-002', name: 'Công ty CP Y khoa Đức Việt', taxCode: '0102345678', address: '456 Trần Duy Hưng, Cầu Giấy, Hà Nội', phone: '024-3789-0002', email: 'info@ducvietmed.vn', contactPerson: 'Bà Lý Thị Hoa', equipmentCategories: 'CT, MRI, máy sinh hóa, X-quang', createdAt: '2019-05-20' },
      { id: sup3, code: 'NCC-003', name: 'Công ty TNHH Khoa học Kỹ thuật Á Châu', taxCode: '0303456789', address: '789 Lê Hồng Phong, Q.10, TP.HCM', phone: '028-3832-0003', email: 'sales@achatech.com', contactPerson: 'Ông Vương Quốc Bảo', equipmentCategories: 'Máy huyết học, lồng ấp, máy điện tim', createdAt: '2021-03-15' },
    ],
    contracts: [
      { id: uuidv4(), code: 'HD-2023-001', name: 'Hợp đồng cung cấp máy siêu âm màu 4D', supplierId: sup1, bidPackageId: '', value: 2500000000, signDate: '2023-06-01', duration: '12 tháng', warrantyPeriod: '36 tháng', deliveryProgress: 'Đã giao hàng đầy đủ', status: 'completed', fileUrl: '', createdAt: '2023-06-01' },
      { id: uuidv4(), code: 'HD-2023-003', name: 'Hợp đồng cung cấp monitor theo dõi bệnh nhân', supplierId: sup2, bidPackageId: '', value: 2250000000, signDate: '2023-04-01', duration: '6 tháng', warrantyPeriod: '36 tháng', deliveryProgress: 'Đang giao đợt 2', status: 'active', fileUrl: '', createdAt: '2023-04-01' },
      { id: uuidv4(), code: 'HD-2023-006', name: 'Hợp đồng cung cấp lồng ấp trẻ sơ sinh', supplierId: sup3, bidPackageId: '', value: 520000000, signDate: '2023-05-10', duration: '3 tháng', warrantyPeriod: '36 tháng', deliveryProgress: 'Đã giao hàng', status: 'completed', fileUrl: '', createdAt: '2023-05-10' },
    ],
    procurementRequests: [
      { id: uuidv4(), departmentId: dept1, equipmentName: 'Máy thở chức năng cao', quantity: 3, reason: 'Thay thế máy cũ hết khấu hao', technicalRequirements: 'Chế độ thở xâm nhập và không xâm nhập, màn hình cảm ứng', estimatedBudget: 3600000000, priority: 'high', status: 'approved', createdAt: '2024-01-10' },
      { id: uuidv4(), departmentId: dept3, equipmentName: 'Máy xét nghiệm miễn dịch', quantity: 1, reason: 'Mở rộng danh mục xét nghiệm', technicalRequirements: 'Tối thiểu 50 xét nghiệm, tốc độ 120 mẫu/giờ', estimatedBudget: 4500000000, priority: 'medium', status: 'pending', createdAt: '2024-02-15' },
      { id: uuidv4(), departmentId: dept7, equipmentName: 'Máy chiếu vàng da', quantity: 2, reason: 'Nhu cầu điều trị tăng', technicalRequirements: 'Công nghệ LED, cường độ ánh sáng điều chỉnh được', estimatedBudget: 400000000, priority: 'medium', status: 'approved', createdAt: '2024-03-01' },
    ],
    procurementPlans: [
      { id: uuidv4(), code: 'KH-2024-001', name: 'Kế hoạch mua sắm trang thiết bị năm 2024', year: 2024, fundSource: 'Ngân sách bệnh viện', estimatedBudget: 25000000000, equipmentList: 'Máy thở, máy xét nghiệm, monitor, lồng ấp', status: 'approved', createdAt: '2024-01-01' },
      { id: uuidv4(), code: 'KH-2024-002', name: 'Kế hoạch thay thế thiết bị hết khấu hao', year: 2024, fundSource: 'Quỹ phát triển', estimatedBudget: 8000000000, equipmentList: 'Máy X-quang, máy điện tim, bơm tiêm điện', status: 'in_progress', createdAt: '2024-02-01' },
    ],
    bidPackages: [
      { id: uuidv4(), code: 'GT-2024-001', name: 'Gói thầu cung cấp máy thở chức năng cao', planId: '', packageValue: 3600000000, capitalSource: 'Ngân sách bệnh viện', startDate: '2024-03-01', endDate: '2024-06-30', selectionMethod: 'Đấu thầu rộng rãi', selectionMode: 'Một giai đoạn hai túi hồ sơ', status: 'bidding', attachments: '', createdAt: '2024-03-01' },
      { id: uuidv4(), code: 'GT-2024-002', name: 'Gói thầu cung cấp máy xét nghiệm miễn dịch', planId: '', packageValue: 4500000000, capitalSource: 'Ngân sách bệnh viện', startDate: '2024-04-01', endDate: '2024-08-31', selectionMethod: 'Đấu thầu rộng rãi', selectionMode: 'Một giai đoạn hai túi hồ sơ', status: 'preparing', attachments: '', createdAt: '2024-04-01' },
    ],
    bidEvaluations: [],
    maintenanceRecords: [
      { id: uuidv4(), equipmentId: '', type: 'preventive', scheduledDate: '2024-06-15', technician: 'KTV. Nguyễn Văn A', workContent: 'Bảo trì định kỳ máy siêu âm - vệ sinh đầu dò, kiểm tra phần mềm', result: 'Hoàn thành tốt', cost: 5000000, replacedParts: 'Không', completedDate: '2024-06-15', status: 'completed', createdAt: '2024-06-01' },
      { id: uuidv4(), equipmentId: '', type: 'calibration', scheduledDate: '2024-07-20', technician: 'KTV. Lê Thị C', workContent: 'Hiệu chuẩn máy xét nghiệm huyết học', result: '', cost: 8000000, replacedParts: '', completedDate: '', status: 'scheduled', createdAt: '2024-07-01' },
      { id: uuidv4(), equipmentId: '', type: 'preventive', scheduledDate: '2024-05-10', technician: 'KTV. Trần Văn B', workContent: 'Bảo trì máy CT - kiểm tra tube, calibrate hình ảnh', result: 'Cần thay tube trong 3 tháng tới', cost: 15000000, replacedParts: 'Không', completedDate: '2024-05-10', status: 'completed', createdAt: '2024-05-01' },
    ],
    repairRecords: [
      { id: uuidv4(), equipmentId: '', departmentId: dept5, reporter: 'BS. Hoàng Văn Em', incidentDate: '2024-06-20', errorDescription: 'Dao mổ không hoạt động, không có dòng điện cao tần', severity: 'high', imageUrl: '', technician: 'KTV. Nguyễn Văn A', cause: 'Hỏng board công suất', solution: 'Thay board mạch công suất', cost: 25000000, testResult: 'Hoạt động bình thường sau sửa chữa', completedDate: '2024-06-25', status: 'completed', createdAt: '2024-06-20' },
      { id: uuidv4(), equipmentId: '', departmentId: dept4, reporter: 'BS. Phạm Thị Dung', incidentDate: '2024-07-01', errorDescription: 'Máy điện tim in giấy bị kẹt, kết quả không rõ', severity: 'medium', imageUrl: '', technician: 'KTV. Trần Văn B', cause: 'Đang kiểm tra', solution: '', cost: 0, testResult: '', completedDate: '', status: 'in_progress', createdAt: '2024-07-01' },
    ],
    receivingRecords: [
      { id: uuidv4(), contractId: '', equipmentId: '', quantity: 1, model: 'Voluson E10', serial: 'SN2023GE001', accessoriesChecked: true, configChecked: true, deliveryDate: '2023-06-20', installer: 'Kỹ sư GE Healthcare', testResult: 'Đạt yêu cầu kỹ thuật', acceptanceNote: 'Biên bản nghiệm thu số 01/2023', receivingDept: dept2, deliverer: 'Ông Minh - NCC Minh Anh', receiver: 'CN. Ngô Thị Hương', status: 'accepted', createdAt: '2023-06-20' },
    ],
    trainingRecords: [
      { id: uuidv4(), equipmentId: '', courseName: 'Đào tạo sử dụng máy siêu âm Voluson E10', trainer: 'Chuyên gia GE Healthcare', trainingOrg: 'GE Healthcare Việt Nam', participants: 'BS. Trần Thị Bình, KTV. Trần Văn B', trainingDate: '2023-07-05', content: 'Vận hành, bảo quản, ứng dụng lâm sàng', result: 'Đạt', documents: 'Tài liệu hướng dẫn sử dụng', retrainDate: '2024-07-05', createdAt: '2023-07-05' },
      { id: uuidv4(), equipmentId: '', courseName: 'Đào tạo vận hành máy CT 128 lát cắt', trainer: 'Kỹ sư Siemens', trainingOrg: 'Siemens Healthineers', participants: 'BS. Trần Thị Bình, KTV. Trần Văn B, KTV. Nguyễn Văn A', trainingDate: '2022-04-10', content: 'Vận hành, xử lý sự cố cơ bản, tối ưu hóa liều tia', result: 'Đạt', documents: 'Manual + Video hướng dẫn', retrainDate: '2024-04-10', createdAt: '2022-04-10' },
    ],
    transferRecords: [],
    liquidationRecords: [],
    users: [
      { id: uuidv4(), username: 'admin', fullName: 'Quản trị viên hệ thống', role: 'admin', departmentId: dept8, email: 'admin@hospital.vn', active: true, createdAt: '2024-01-01' },
      { id: uuidv4(), username: 'director', fullName: 'BS. Nguyễn Minh Tuấn - Giám đốc', role: 'director', departmentId: '', email: 'director@hospital.vn', active: true, createdAt: '2024-01-01' },
      { id: uuidv4(), username: 'supply', fullName: 'CN. Ngô Thị Hương', role: 'supply_dept', departmentId: dept8, email: 'supply@hospital.vn', active: true, createdAt: '2024-01-01' },
      { id: uuidv4(), username: 'tech', fullName: 'KTV. Nguyễn Văn A', role: 'technician', departmentId: dept8, email: 'tech@hospital.vn', active: true, createdAt: '2024-01-01' },
    ],
    activityLogs: [
      { id: uuidv4(), userId: '', action: 'Đăng nhập', module: 'Hệ thống', details: 'Đăng nhập thành công', timestamp: new Date().toISOString() },
    ],
  };
};
