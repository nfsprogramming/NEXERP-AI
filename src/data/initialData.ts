import type { Product, Supplier, PurchaseOrder, SalesOrder, FinanceEntry, Activity } from '../types'

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Industrial Sensor X200', category: 'Electronics', stock: 45, reorderLevel: 20, unitPrice: 125.0 },
  { id: 'P002', name: 'Hydraulic Pump HP-50', category: 'Machinery', stock: 12, reorderLevel: 15, unitPrice: 890.0 },
  { id: 'P003', name: 'Steel Bearing Set', category: 'Components', stock: 0, reorderLevel: 50, unitPrice: 34.5 },
  { id: 'P004', name: 'Control Panel CP-300', category: 'Electronics', stock: 28, reorderLevel: 10, unitPrice: 450.0 },
  { id: 'P005', name: 'Conveyor Belt 10m', category: 'Machinery', stock: 8, reorderLevel: 5, unitPrice: 320.0 },
  { id: 'P006', name: 'Lubricant Oil 20L', category: 'Consumables', stock: 65, reorderLevel: 30, unitPrice: 48.0 },
  { id: 'P007', name: 'Safety Helmet Pro', category: 'Safety', stock: 120, reorderLevel: 40, unitPrice: 22.5 },
  { id: 'P008', name: 'PLC Module MX7', category: 'Electronics', stock: 6, reorderLevel: 12, unitPrice: 780.0 },
  { id: 'P009', name: 'Pneumatic Cylinder', category: 'Components', stock: 35, reorderLevel: 20, unitPrice: 156.0 },
  { id: 'P010', name: 'Filter Cartridge F-100', category: 'Consumables', stock: 18, reorderLevel: 25, unitPrice: 19.75 },
  { id: 'P011', name: 'Motor Drive VFD-15', category: 'Electronics', stock: 9, reorderLevel: 8, unitPrice: 1120.0 },
  { id: 'P012', name: 'Welding Electrode Box', category: 'Consumables', stock: 200, reorderLevel: 80, unitPrice: 12.0 },
  { id: 'P013', name: 'Gear Reducer GR-200', category: 'Machinery', stock: 4, reorderLevel: 6, unitPrice: 675.0 },
  { id: 'P014', name: 'Pressure Gauge PG-50', category: 'Components', stock: 55, reorderLevel: 30, unitPrice: 42.0 },
  { id: 'P015', name: 'Work Gloves (Pair)', category: 'Safety', stock: 300, reorderLevel: 100, unitPrice: 8.5 },
  { id: 'P016', name: 'Relay Module RM-8', category: 'Electronics', stock: 22, reorderLevel: 15, unitPrice: 65.0 },
  { id: 'P017', name: 'Chain Drive Kit', category: 'Machinery', stock: 14, reorderLevel: 10, unitPrice: 245.0 },
  { id: 'P018', name: 'Seal Kit Universal', category: 'Components', stock: 3, reorderLevel: 20, unitPrice: 28.0 },
  { id: 'P019', name: 'Cutting Fluid 5L', category: 'Consumables', stock: 40, reorderLevel: 20, unitPrice: 35.5 },
  { id: 'P020', name: 'Emergency Stop Button', category: 'Safety', stock: 75, reorderLevel: 25, unitPrice: 15.0 },
]

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'S001', name: 'TechParts Global', contact: 'orders@techparts.example' },
  { id: 'S002', name: 'Industrial Supply Co.', contact: 'sales@indsupply.example' },
  { id: 'S003', name: 'MechaComponents Ltd', contact: 'info@mechacomp.example' },
  { id: 'S004', name: 'SafeGear Distributors', contact: 'support@safegear.example' },
]

export const INITIAL_POS: PurchaseOrder[] = [
  { id: 'PO-2024-001', supplierId: 'S001', orderDate: '2024-09-12', expectedDate: '2024-10-05', status: 'Received', items: [{ productId: 'P001', qty: 30, unitPrice: 125 }, { productId: 'P008', qty: 10, unitPrice: 780 }], received: true },
  { id: 'PO-2024-002', supplierId: 'S002', orderDate: '2024-09-20', expectedDate: '2024-10-15', status: 'Approved', items: [{ productId: 'P002', qty: 5, unitPrice: 890 }, { productId: 'P013', qty: 4, unitPrice: 675 }], received: false },
  { id: 'PO-2024-003', supplierId: 'S003', orderDate: '2024-09-28', expectedDate: '2024-10-20', status: 'Pending Approval', items: [{ productId: 'P003', qty: 100, unitPrice: 34.5 }, { productId: 'P018', qty: 40, unitPrice: 28 }], received: false },
  { id: 'PO-2024-004', supplierId: 'S001', orderDate: '2024-10-02', expectedDate: '2024-10-25', status: 'Pending Approval', items: [{ productId: 'P010', qty: 50, unitPrice: 19.75 }], received: false },
  { id: 'PO-2024-005', supplierId: 'S004', orderDate: '2024-10-05', expectedDate: '2024-10-18', status: 'Draft', items: [{ productId: 'P007', qty: 50, unitPrice: 22.5 }, { productId: 'P015', qty: 100, unitPrice: 8.5 }], received: false },
  { id: 'PO-2024-006', supplierId: 'S002', orderDate: '2024-08-15', expectedDate: '2024-09-01', status: 'Received', items: [{ productId: 'P006', qty: 40, unitPrice: 48 }], received: true },
  { id: 'PO-2024-007', supplierId: 'S003', orderDate: '2024-10-08', expectedDate: '2024-11-01', status: 'Approved', items: [{ productId: 'P009', qty: 20, unitPrice: 156 }], received: false },
  { id: 'PO-2024-008', supplierId: 'S001', orderDate: '2024-09-05', expectedDate: '2024-09-25', status: 'Cancelled', items: [{ productId: 'P011', qty: 3, unitPrice: 1120 }], received: false },
  { id: 'PO-2024-009', supplierId: 'S004', orderDate: '2024-10-10', expectedDate: '2024-10-28', status: 'Pending Approval', items: [{ productId: 'P020', qty: 40, unitPrice: 15 }], received: false },
  { id: 'PO-2024-010', supplierId: 'S002', orderDate: '2024-07-20', expectedDate: '2024-08-10', status: 'Received', items: [{ productId: 'P005', qty: 6, unitPrice: 320 }], received: true },
]

export const INITIAL_SALES: SalesOrder[] = [
  { id: 'SO-4501', date: '2024-10-01', customer: 'Apex Manufacturing', items: [{ productId: 'P001', qty: 5, unitPrice: 145 }, { productId: 'P004', qty: 2, unitPrice: 520 }], status: 'Completed', total: 1765 },
  { id: 'SO-4502', date: '2024-10-03', customer: 'BuildRight Corp', items: [{ productId: 'P007', qty: 20, unitPrice: 28 }, { productId: 'P015', qty: 50, unitPrice: 11 }], status: 'Completed', total: 1110 },
  { id: 'SO-4503', date: '2024-10-05', customer: 'NovaTech Systems', items: [{ productId: 'P008', qty: 2, unitPrice: 890 }, { productId: 'P016', qty: 8, unitPrice: 78 }], status: 'Shipped', total: 2404 },
  { id: 'SO-4504', date: '2024-10-07', customer: 'Horizon Industries', items: [{ productId: 'P002', qty: 1, unitPrice: 980 }], status: 'Processing', total: 980 },
  { id: 'SO-4505', date: '2024-10-08', customer: 'Precision Works', items: [{ productId: 'P006', qty: 10, unitPrice: 55 }, { productId: 'P019', qty: 5, unitPrice: 42 }], status: 'Completed', total: 760 },
  { id: 'SO-4506', date: '2024-09-15', customer: 'Apex Manufacturing', items: [{ productId: 'P011', qty: 2, unitPrice: 1250 }], status: 'Completed', total: 2500 },
  { id: 'SO-4507', date: '2024-09-20', customer: 'MegaFab Ltd', items: [{ productId: 'P005', qty: 3, unitPrice: 380 }, { productId: 'P017', qty: 2, unitPrice: 290 }], status: 'Completed', total: 1720 },
  { id: 'SO-4508', date: '2024-09-25', customer: 'BuildRight Corp', items: [{ productId: 'P012', qty: 30, unitPrice: 15 }], status: 'Completed', total: 450 },
  { id: 'SO-4509', date: '2024-10-12', customer: 'NovaTech Systems', items: [{ productId: 'P004', qty: 3, unitPrice: 520 }, { productId: 'P001', qty: 8, unitPrice: 145 }], status: 'Processing', total: 2720 },
  { id: 'SO-4510', date: '2024-10-14', customer: 'Horizon Industries', items: [{ productId: 'P009', qty: 6, unitPrice: 180 }], status: 'Pending', total: 1080 },
  { id: 'SO-4511', date: '2024-08-10', customer: 'Precision Works', items: [{ productId: 'P013', qty: 2, unitPrice: 750 }], status: 'Completed', total: 1500 },
  { id: 'SO-4512', date: '2024-08-22', customer: 'MegaFab Ltd', items: [{ productId: 'P003', qty: 40, unitPrice: 42 }], status: 'Completed', total: 1680 },
]

export const INITIAL_FINANCE: FinanceEntry[] = [
  { id: 'TXN-1001', date: '2024-10-01', description: 'Sales receipt SO-4501', category: 'Sales Revenue', type: 'Income', amount: 1765 },
  { id: 'TXN-1002', date: '2024-10-02', description: 'Supplier payment PO-2024-001', category: 'Procurement', type: 'Expense', amount: 11550 },
  { id: 'TXN-1003', date: '2024-10-03', description: 'Sales receipt SO-4502', category: 'Sales Revenue', type: 'Income', amount: 1110 },
  { id: 'TXN-1004', date: '2024-10-04', description: 'Warehouse utilities', category: 'Utilities', type: 'Expense', amount: 420 },
  { id: 'TXN-1005', date: '2024-10-05', description: 'Sales receipt SO-4503', category: 'Sales Revenue', type: 'Income', amount: 2404 },
  { id: 'TXN-1006', date: '2024-10-06', description: 'Staff salaries (partial)', category: 'Payroll', type: 'Expense', amount: 8500 },
  { id: 'TXN-1007', date: '2024-10-07', description: 'Sales receipt SO-4504', category: 'Sales Revenue', type: 'Income', amount: 980 },
  { id: 'TXN-1008', date: '2024-10-08', description: 'Sales receipt SO-4505', category: 'Sales Revenue', type: 'Income', amount: 760 },
  { id: 'TXN-1009', date: '2024-09-15', description: 'Sales receipt SO-4506', category: 'Sales Revenue', type: 'Income', amount: 2500 },
  { id: 'TXN-1010', date: '2024-09-18', description: 'Equipment maintenance', category: 'Maintenance', type: 'Expense', amount: 1250 },
  { id: 'TXN-1011', date: '2024-09-20', description: 'Sales receipt SO-4507', category: 'Sales Revenue', type: 'Income', amount: 1720 },
  { id: 'TXN-1012', date: '2024-09-22', description: 'Office rent Q3', category: 'Rent', type: 'Expense', amount: 3200 },
  { id: 'TXN-1013', date: '2024-09-25', description: 'Sales receipt SO-4508', category: 'Sales Revenue', type: 'Income', amount: 450 },
  { id: 'TXN-1014', date: '2024-08-10', description: 'Sales receipt SO-4511', category: 'Sales Revenue', type: 'Income', amount: 1500 },
  { id: 'TXN-1015', date: '2024-08-15', description: 'Supplier payment PO-2024-006', category: 'Procurement', type: 'Expense', amount: 1920 },
  { id: 'TXN-1016', date: '2024-08-22', description: 'Sales receipt SO-4512', category: 'Sales Revenue', type: 'Income', amount: 1680 },
  { id: 'TXN-1017', date: '2024-10-10', description: 'Insurance premium', category: 'Insurance', type: 'Expense', amount: 680 },
  { id: 'TXN-1018', date: '2024-10-12', description: 'Logistics & shipping', category: 'Logistics', type: 'Expense', amount: 540 },
  { id: 'TXN-1019', date: '2024-09-05', description: 'Marketing campaign', category: 'Marketing', type: 'Expense', amount: 1100 },
  { id: 'TXN-1020', date: '2024-07-30', description: 'Q2 tax provision', category: 'Taxes', type: 'Expense', amount: 2400 },
  { id: 'TXN-1021', date: '2024-10-14', description: 'Consulting services', category: 'Professional Services', type: 'Expense', amount: 900 },
  { id: 'TXN-1022', date: '2024-09-28', description: 'Software licenses', category: 'Software', type: 'Expense', amount: 350 },
]

export const MONTHLY_REVENUE = [
  { month: 'May', revenue: 18500 },
  { month: 'Jun', revenue: 21200 },
  { month: 'Jul', revenue: 19800 },
  { month: 'Aug', revenue: 24100 },
  { month: 'Sep', revenue: 26700 },
  { month: 'Oct', revenue: 9739 },
]

export const ACTIVITIES: Activity[] = [
  { id: 1, text: 'PO-2024-003 awaiting approval', type: 'procurement', time: '2h ago' },
  { id: 2, text: 'Steel Bearing Set stock at zero', type: 'inventory', time: '4h ago' },
  { id: 3, text: 'SO-4509 created for NovaTech', type: 'sales', time: '6h ago' },
  { id: 4, text: 'PO-2024-002 approved', type: 'procurement', time: '1d ago' },
  { id: 5, text: 'Seal Kit Universal below reorder', type: 'inventory', time: '1d ago' },
  { id: 6, text: 'Sales receipt SO-4505 posted', type: 'finance', time: '2d ago' },
]
