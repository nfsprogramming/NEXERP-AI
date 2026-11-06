/** NEXERP AI - Main application (Vite + React) */
import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import * as Lucide from 'lucide-react'

const ICON_ALIASES = {
  'layout-dashboard': 'LayoutDashboard',
  'shopping-cart': 'ShoppingCart',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
  'file-text': 'FileText',
  'flask-conical': 'FlaskConical',
  'dollar-sign': 'IndianRupee',
  'currency': 'IndianRupee',
  'indian-rupee': 'IndianRupee',
  'shopping-bag': 'ShoppingBag',
  'clipboard-list': 'ClipboardList',
  'alert-circle': 'AlertCircle',
  'pie-chart': 'PieChart',
  'alert-triangle': 'AlertTriangle',
  'check-circle': 'CheckCircle',
  'package-check': 'PackageCheck',
  'x-circle': 'XCircle',
  'plus-minus': 'PlusMinus',
  'trash-2': 'Trash2',
}
const Icon = ({ name, size = 18, className = '' }) => {
  const pascal = ICON_ALIASES[name] || name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
  const Comp = Lucide[pascal] || Lucide.Circle
  return <Comp size={size} className={className} />
}


const INITIAL_PRODUCTS = [
  { id: 'P001', name: 'Industrial Sensor X200', category: 'Electronics', stock: 45, reorderLevel: 20, unitPrice: 125.00 },
  { id: 'P002', name: 'Hydraulic Pump HP-50', category: 'Machinery', stock: 12, reorderLevel: 15, unitPrice: 890.00 },
  { id: 'P003', name: 'Steel Bearing Set', category: 'Components', stock: 0, reorderLevel: 50, unitPrice: 34.50 },
  { id: 'P004', name: 'Control Panel CP-300', category: 'Electronics', stock: 28, reorderLevel: 10, unitPrice: 450.00 },
  { id: 'P005', name: 'Conveyor Belt 10m', category: 'Machinery', stock: 8, reorderLevel: 5, unitPrice: 320.00 },
  { id: 'P006', name: 'Lubricant Oil 20L', category: 'Consumables', stock: 65, reorderLevel: 30, unitPrice: 48.00 },
  { id: 'P007', name: 'Safety Helmet Pro', category: 'Safety', stock: 120, reorderLevel: 40, unitPrice: 22.50 },
  { id: 'P008', name: 'PLC Module MX7', category: 'Electronics', stock: 6, reorderLevel: 12, unitPrice: 780.00 },
  { id: 'P009', name: 'Pneumatic Cylinder', category: 'Components', stock: 35, reorderLevel: 20, unitPrice: 156.00 },
  { id: 'P010', name: 'Filter Cartridge F-100', category: 'Consumables', stock: 18, reorderLevel: 25, unitPrice: 19.75 },
  { id: 'P011', name: 'Motor Drive VFD-15', category: 'Electronics', stock: 9, reorderLevel: 8, unitPrice: 1120.00 },
  { id: 'P012', name: 'Welding Electrode Box', category: 'Consumables', stock: 200, reorderLevel: 80, unitPrice: 12.00 },
  { id: 'P013', name: 'Gear Reducer GR-200', category: 'Machinery', stock: 4, reorderLevel: 6, unitPrice: 675.00 },
  { id: 'P014', name: 'Pressure Gauge PG-50', category: 'Components', stock: 55, reorderLevel: 30, unitPrice: 42.00 },
  { id: 'P015', name: 'Work Gloves (Pair)', category: 'Safety', stock: 300, reorderLevel: 100, unitPrice: 8.50 },
  { id: 'P016', name: 'Relay Module RM-8', category: 'Electronics', stock: 22, reorderLevel: 15, unitPrice: 65.00 },
  { id: 'P017', name: 'Chain Drive Kit', category: 'Machinery', stock: 14, reorderLevel: 10, unitPrice: 245.00 },
  { id: 'P018', name: 'Seal Kit Universal', category: 'Components', stock: 3, reorderLevel: 20, unitPrice: 28.00 },
  { id: 'P019', name: 'Cutting Fluid 5L', category: 'Consumables', stock: 40, reorderLevel: 20, unitPrice: 35.50 },
  { id: 'P020', name: 'Emergency Stop Button', category: 'Safety', stock: 75, reorderLevel: 25, unitPrice: 15.00 },
];

const INITIAL_SUPPLIERS = [
  { id: 'S001', name: 'TechParts Global' },
  { id: 'S002', name: 'Industrial Supply Co.' },
  { id: 'S003', name: 'MechaComponents Ltd' },
  { id: 'S004', name: 'SafeGear Distributors' },
];

const INITIAL_POS = [
  { id: 'PO-2024-001', supplierId: 'S001', orderDate: '2024-09-12', expectedDate: '2024-10-05', status: 'Received', items: [{ productId: 'P001', qty: 30, unitPrice: 125 }, { productId: 'P008', qty: 10, unitPrice: 780 }], received: true },
  { id: 'PO-2024-002', supplierId: 'S002', orderDate: '2024-09-20', expectedDate: '2024-10-15', status: 'Approved', items: [{ productId: 'P002', qty: 5, unitPrice: 890 }, { productId: 'P013', qty: 4, unitPrice: 675 }], received: false },
  { id: 'PO-2024-003', supplierId: 'S003', orderDate: '2024-09-28', expectedDate: '2024-10-20', status: 'Pending Approval', items: [{ productId: 'P003', qty: 100, unitPrice: 34.50 }, { productId: 'P018', qty: 40, unitPrice: 28 }], received: false },
  { id: 'PO-2024-004', supplierId: 'S001', orderDate: '2024-10-02', expectedDate: '2024-10-25', status: 'Pending Approval', items: [{ productId: 'P010', qty: 50, unitPrice: 19.75 }], received: false },
  { id: 'PO-2024-005', supplierId: 'S004', orderDate: '2024-10-05', expectedDate: '2024-10-18', status: 'Draft', items: [{ productId: 'P007', qty: 50, unitPrice: 22.50 }, { productId: 'P015', qty: 100, unitPrice: 8.50 }], received: false },
  { id: 'PO-2024-006', supplierId: 'S002', orderDate: '2024-08-15', expectedDate: '2024-09-01', status: 'Received', items: [{ productId: 'P006', qty: 40, unitPrice: 48 }], received: true },
  { id: 'PO-2024-007', supplierId: 'S003', orderDate: '2024-10-08', expectedDate: '2024-11-01', status: 'Approved', items: [{ productId: 'P009', qty: 20, unitPrice: 156 }], received: false },
  { id: 'PO-2024-008', supplierId: 'S001', orderDate: '2024-09-05', expectedDate: '2024-09-25', status: 'Cancelled', items: [{ productId: 'P011', qty: 3, unitPrice: 1120 }], received: false },
  { id: 'PO-2024-009', supplierId: 'S004', orderDate: '2024-10-10', expectedDate: '2024-10-28', status: 'Pending Approval', items: [{ productId: 'P020', qty: 40, unitPrice: 15 }], received: false },
  { id: 'PO-2024-010', supplierId: 'S002', orderDate: '2024-07-20', expectedDate: '2024-08-10', status: 'Received', items: [{ productId: 'P005', qty: 6, unitPrice: 320 }], received: true },
];

const INITIAL_SALES = [
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
];

const INITIAL_FINANCE = [
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
];

const MONTHLY_REVENUE = [
  { month: 'May', revenue: 18500 }, { month: 'Jun', revenue: 21200 }, { month: 'Jul', revenue: 19800 },
  { month: 'Aug', revenue: 24100 }, { month: 'Sep', revenue: 26700 }, { month: 'Oct', revenue: 9739 },
];

const ACTIVITIES = [
  { id: 1, text: 'PO-2024-003 awaiting approval', type: 'procurement', time: '2h ago' },
  { id: 2, text: 'Steel Bearing Set stock at zero', type: 'inventory', time: '4h ago' },
  { id: 3, text: 'SO-4509 created for NovaTech', type: 'sales', time: '6h ago' },
  { id: 4, text: 'PO-2024-002 approved', type: 'procurement', time: '1d ago' },
  { id: 5, text: 'Seal Kit Universal below reorder', type: 'inventory', time: '1d ago' },
  { id: 6, text: 'Sales receipt SO-4505 posted', type: 'finance', time: '2d ago' },
];

const STORAGE_KEY = 'nexerp_ai_demo_v1';
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const p = JSON.parse(raw); if (p?.products?.length) return p; }
  } catch (e) {}
  return null;
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      products: state.products, purchaseOrders: state.purchaseOrders,
      salesOrders: state.salesOrders, finance: state.finance, settings: state.settings,
    }));
  } catch (e) {}
}
function stockStatus(stock, reorder) {
  if (stock <= 0) return 'out';
  if (stock <= reorder) return 'low';
  return 'ok';
}
let currentAppCurrency = 'INR';

function formatCurrency(n, currency) {
  const curr = currency || currentAppCurrency || 'INR';
  const locale = curr === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(n);
}
function formatNum(n) { return new Intl.NumberFormat('en-IN').format(n); }
function poTotal(po) { return po.items.reduce((s, i) => s + i.qty * i.unitPrice, 0); }
function invValue(products) { return products.reduce((s, p) => s + p.stock * p.unitPrice, 0); }

const AppContext = createContext(null);
function AppProvider({ children }) {
  const initial = loadState();
  const [products, setProducts] = useState(initial?.products || INITIAL_PRODUCTS);
  const [purchaseOrders, setPurchaseOrders] = useState(initial?.purchaseOrders || INITIAL_POS);
  const [salesOrders, setSalesOrders] = useState(initial?.salesOrders || INITIAL_SALES);
  const [finance, setFinance] = useState(initial?.finance || INITIAL_FINANCE);
  const [settings, setSettings] = useState(() => {
    const s = initial?.settings;
    const curr = (!s?.currency || s?.currency === 'USD') ? 'INR' : s.currency;
    currentAppCurrency = curr;
    return {
      company: s?.company || 'Nexora Industries',
      currency: curr,
      aiMode: s?.aiMode || 'demo',
      geminiApiKey: s?.geminiApiKey || '',
      geminiModel: s?.geminiModel || 'gemini-1.5-flash',
    };
  });
  const [page, setPage] = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    currentAppCurrency = settings.currency || 'INR';
    saveState({ products, purchaseOrders, salesOrders, finance, settings });
  }, [products, purchaseOrders, salesOrders, finance, settings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };
  const resetDemo = () => {
    setProducts(INITIAL_PRODUCTS.map(p => ({ ...p })));
    setPurchaseOrders(INITIAL_POS.map(p => ({ ...p, items: p.items.map(i => ({ ...i })) })));
    setSalesOrders(INITIAL_SALES.map(s => ({ ...s, items: s.items.map(i => ({ ...i })) })));
    setFinance(INITIAL_FINANCE.map(f => ({ ...f })));
    setChatMessages([]);
    showToast('Demo data restored');
  };
  const metrics = useMemo(() => {
    const totalRevenue = salesOrders.filter(s => s.status === 'Completed' || s.status === 'Shipped').reduce((s, o) => s + o.total, 0);
    const totalOrders = salesOrders.length;
    const inventoryValue = invValue(products);
    const pendingPOs = purchaseOrders.filter(p => p.status === 'Pending Approval' || p.status === 'Approved').length;
    const lowStock = products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'low').length;
    const outStock = products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'out').length;
    const income = finance.filter(f => f.type === 'Income').reduce((s, f) => s + f.amount, 0);
    const expenses = finance.filter(f => f.type === 'Expense').reduce((s, f) => s + f.amount, 0);
    return { totalRevenue, totalOrders, inventoryValue, pendingPOs, lowStock, outStock, income, expenses, grossProfit: income - expenses };
  }, [products, purchaseOrders, salesOrders, finance]);

  const value = {
    products, setProducts, purchaseOrders, setPurchaseOrders, salesOrders, setSalesOrders,
    finance, setFinance, settings, setSettings, page, setPage, mobileNav, setMobileNav,
    toast, showToast, chatMessages, setChatMessages, chatLoading, setChatLoading,
    metrics, resetDemo, suppliers: INITIAL_SUPPLIERS, monthlyRevenue: MONTHLY_REVENUE, activities: ACTIVITIES,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
const useApp = () => useContext(AppContext);

function generateAIResponse(question, ctx) {
  const q = question.toLowerCase();
  const { products, purchaseOrders, salesOrders, metrics, suppliers } = ctx;
  const low = products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'low');
  const out = products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'out');
  const pending = purchaseOrders.filter(p => p.status === 'Pending Approval');
  const approved = purchaseOrders.filter(p => p.status === 'Approved' && !p.received);

  if (q.includes('low') || q.includes('running low') || q.includes('stock level') || q.includes('out of stock') || q.includes('find low')) {
    const lines = [...out.map(p => `• **${p.name}** (${p.id}): OUT OF STOCK — reorder level ${p.reorderLevel}`),
      ...low.map(p => `• **${p.name}** (${p.id}): ${p.stock} units (reorder at ${p.reorderLevel})`)];
    return {
      answer: `I found **${out.length + low.length}** products that need attention right now.`,
      findings: lines.length ? lines : ['No low-stock or out-of-stock items currently.'],
      figures: { 'Out of stock': out.length, 'Low stock': low.length, 'Total products': products.length },
      actions: [{ label: 'View Inventory', page: 'inventory' }, { label: 'Recommend Reorders', page: 'ai', followUp: 'Which products should we reorder?' }],
      recommendations: out.length || low.length ? ['Prioritize purchase orders for out-of-stock items first.', 'Review reorder levels for frequently depleted SKUs.'] : ['Inventory levels look healthy.'],
    };
  }
  if (q.includes('reorder') || q.includes('replenish') || q.includes('which products should we')) {
    const candidates = [...out, ...low].slice(0, 8);
    const recs = candidates.map(p => {
      const suggested = Math.max(p.reorderLevel * 2 - p.stock, p.reorderLevel);
      return `• **${p.name}**: order ~${suggested} units (current ${p.stock}, target above ${p.reorderLevel})`;
    });
    return {
      answer: candidates.length ? `Based on current stock vs reorder levels, I recommend replenishing **${candidates.length}** products.` : 'No products currently require reorder based on thresholds.',
      findings: recs.length ? recs : ['All products above reorder thresholds.'],
      figures: { 'Products to reorder': candidates.length },
      actions: [{ label: 'Open Procurement', page: 'procurement' }, { label: 'View Inventory', page: 'inventory' }],
      recommendations: ['Create purchase orders for out-of-stock items immediately.', 'Consolidate orders with the same supplier to reduce shipping cost.'],
    };
  }
  if (q.includes('performance') || q.includes('summarize') || q.includes('this month') || q.includes('business') || q.includes('overview') || q.includes('analyze')) {
    return {
      answer: `Here is a concise performance snapshot for **Nexora Industries** (demo data).`,
      findings: [
        `• Recorded income: **${formatCurrency(metrics.income)}**`,
        `• Recorded expenses: **${formatCurrency(metrics.expenses)}**`,
        `• Estimated gross profit: **${formatCurrency(metrics.grossProfit)}**`,
        `• Sales orders: **${metrics.totalOrders}**`,
        `• Inventory value: **${formatCurrency(metrics.inventoryValue)}**`,
        `• Low/out stock SKUs: **${metrics.lowStock + metrics.outStock}**`,
        `• Pending/approved POs: **${metrics.pendingPOs}**`,
      ],
      figures: { Income: formatCurrency(metrics.income), Expenses: formatCurrency(metrics.expenses), 'Gross Profit': formatCurrency(metrics.grossProfit) },
      actions: [{ label: 'Open Dashboard', page: 'dashboard' }, { label: 'Generate Report', page: 'reports' }],
      recommendations: [metrics.outStock > 0 ? 'Address out-of-stock items to avoid lost sales.' : null, pending.length > 0 ? `Review ${pending.length} pending purchase order(s).` : null, 'Monitor October revenue against prior months for seasonality.'].filter(Boolean),
    };
  }
  if (q.includes('pending') || q.includes('purchase order') || q.includes('procurement') || q.includes('summarize pending')) {
    const list = purchaseOrders.filter(p => ['Pending Approval', 'Approved', 'Draft'].includes(p.status));
    return {
      answer: `There are **${list.length}** open purchase orders (Draft / Pending / Approved).`,
      findings: list.map(p => {
        const sup = suppliers.find(s => s.id === p.supplierId);
        return `• **${p.id}** — ${sup?.name || p.supplierId} · ${p.status} · ${formatCurrency(poTotal(p))}`;
      }),
      figures: { 'Pending Approval': pending.length, 'Approved (not received)': approved.length, Draft: purchaseOrders.filter(p => p.status === 'Draft').length },
      actions: [{ label: 'Open Procurement', page: 'procurement' }],
      recommendations: pending.length ? ['Approve or reject pending orders to keep supply chain moving.'] : ['No orders stuck in Pending Approval.'],
    };
  }
  if (q.includes('risk') || q.includes('alert') || q.includes('attention') || q.includes('operational') || q.includes('identify')) {
    const risks = [];
    if (out.length) risks.push(`**${out.length} product(s) out of stock** — potential lost sales and production delays.`);
    if (low.length) risks.push(`**${low.length} product(s) below reorder level** — replenishment lag risk.`);
    if (pending.length) risks.push(`**${pending.length} PO(s) awaiting approval** — supply bottleneck.`);
    if (!risks.length) risks.push('No critical operational risks detected from current demo data.');
    return {
      answer: 'Main operational risks derived from live demo data:',
      findings: risks.map(r => `• ${r}`),
      figures: { 'Out of stock': out.length, 'Low stock': low.length, 'Pending POs': pending.length },
      actions: [{ label: 'View Inventory', page: 'inventory' }, { label: 'Open Procurement', page: 'procurement' }],
      recommendations: ['Set automated alerts for stock ≤ reorder level.', 'Establish SLA for purchase-order approval cycle.'],
    };
  }
  if (q.includes('report') || q.includes('weekly') || q.includes('inventory report') || q.includes('generate')) {
    return {
      answer: 'Weekly inventory snapshot (generated from current demo dataset):',
      findings: [
        `• Total SKUs: **${products.length}**`,
        `• Total units on hand: **${formatNum(products.reduce((s, p) => s + p.stock, 0))}**`,
        `• Inventory value: **${formatCurrency(metrics.inventoryValue)}**`,
        `• Low stock: **${metrics.lowStock}** · Out of stock: **${metrics.outStock}**`,
        `• Categories: **${[...new Set(products.map(p => p.category))].join(', ')}**`,
      ],
      figures: { 'Inventory Value': formatCurrency(metrics.inventoryValue), 'Low + Out': metrics.lowStock + metrics.outStock },
      actions: [{ label: 'Generate Full Report', page: 'reports' }, { label: 'View Inventory', page: 'inventory' }],
      recommendations: ['Export Low-Stock Report for procurement team.', 'Review Seal Kit and Steel Bearing Set urgently.'],
    };
  }
  if (q.includes('highest sales') || q.includes('best-selling') || q.includes('top product') || (q.includes('sales') && !q.includes('purchase'))) {
    const productSales = {};
    salesOrders.forEach(so => so.items.forEach(it => { productSales[it.productId] = (productSales[it.productId] || 0) + it.qty * it.unitPrice; }));
    const ranked = Object.entries(productSales).map(([id, val]) => ({ id, val, name: products.find(p => p.id === id)?.name || id })).sort((a, b) => b.val - a.val).slice(0, 5);
    return {
      answer: 'Top products by sales value in the demo sales orders:',
      findings: ranked.map((r, i) => `• #${i + 1} **${r.name}** — ${formatCurrency(r.val)}`),
      figures: { 'Top product revenue': ranked[0] ? formatCurrency(ranked[0].val) : '—' },
      actions: [{ label: 'Open Sales', page: 'sales' }],
      recommendations: ['Ensure adequate stock for top sellers.', 'Consider volume discounts for high-velocity SKUs.'],
    };
  }
  if (q.includes('recommend') || q.includes('improve inventory') || q.includes('three recommendation')) {
    return {
      answer: 'Three practical recommendations to improve inventory management (based on current data):',
      findings: [
        '1. **Raise reorder points** for Seal Kit Universal and PLC Module MX7 — they frequently sit near or below threshold.',
        '2. **Consolidate supplier orders** — multiple open POs with TechParts Global and Industrial Supply Co. could be combined.',
        '3. **Clear out-of-stock SKUs first** — Steel Bearing Set is at zero; prioritize PO-2024-003 which already contains this item.',
      ],
      figures: { 'Low/Out SKUs': metrics.lowStock + metrics.outStock, 'Open POs': metrics.pendingPOs },
      actions: [{ label: 'View Inventory', page: 'inventory' }, { label: 'Open Procurement', page: 'procurement' }],
      recommendations: ['Track stock-out frequency weekly.', 'Add safety stock for high-margin electronics.'],
    };
  }
  return {
    answer: 'I can help with inventory, procurement, sales, finance, and operational questions using the live demo dataset.',
    findings: ['Try asking:', '• Which products are running low on stock?', '• Summarize this month\'s business performance.', '• Which products should we reorder?', '• Explain our pending purchase orders.', '• What are the main operational risks right now?', '• Generate a weekly inventory report.', '• Which products have the highest sales?'],
    figures: {},
    actions: [{ label: 'Open Dashboard', page: 'dashboard' }],
    recommendations: [],
  };
}

async function queryGemini(question, ctx, apiKey, model = 'gemini-1.5-flash') {
  const { products, purchaseOrders, salesOrders, metrics, settings } = ctx;
  const contextSummary = {
    company: settings.company || 'Nexora Industries',
    currency: settings.currency || 'INR',
    financialSnapshot: {
      recordedRevenue: metrics.totalRevenue,
      recordedIncome: metrics.income,
      recordedExpenses: metrics.expenses,
      estimatedGrossProfit: metrics.grossProfit,
      totalInventoryValuation: metrics.inventoryValue,
    },
    operationalMetrics: {
      totalProductsCount: products.length,
      outOfStockCount: metrics.outStock,
      lowStockCount: metrics.lowStock,
      pendingApprovalPOsCount: metrics.pendingPOs,
      salesOrdersCount: salesOrders.length,
    },
    criticalInventory: products
      .filter(p => stockStatus(p.stock, p.reorderLevel) !== 'ok')
      .map(p => ({ id: p.id, name: p.name, stock: p.stock, reorder: p.reorderLevel, category: p.category })),
    openPurchaseOrders: purchaseOrders
      .filter(p => ['Draft', 'Pending Approval', 'Approved'].includes(p.status))
      .map(p => ({ id: p.id, status: p.status, total: poTotal(p) })),
    recentSalesOrders: salesOrders.slice(-5).map(s => ({ id: s.id, customer: s.customer, total: s.total, status: s.status })),
  };

  const systemPrompt = `You are NEXERP AI Copilot, an enterprise ERP intelligence assistant.
Answer the user's question with precise, data-grounded insights strictly based on the live ERP dataset provided.
Never fabricate unlisted SKUs, inventory amounts, or suppliers.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "answer": "A concise executive answer (1-2 sentences)",
  "findings": ["Detailed observation 1 with **bold keywords**", "Detailed observation 2"],
  "figures": { "Metric Name": "Value" },
  "recommendations": ["Actionable step 1", "Actionable step 2"],
  "actions": [{ "label": "Button Label", "page": "dashboard" }]
}
Valid pages for actions: dashboard, inventory, procurement, sales, finance, reports.`;

  const userPrompt = `LIVE ERP SYSTEM STATE:
${JSON.stringify(contextSummary, null, 2)}

USER QUESTION:
"${question}"

Return ONLY the raw JSON object. Do not wrap in markdown quotes if possible.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 120)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content returned from model');

  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(clean);
  return {
    answer: parsed.answer || 'Analysis complete.',
    findings: Array.isArray(parsed.findings) ? parsed.findings : [],
    figures: parsed.figures && typeof parsed.figures === 'object' ? parsed.figures : {},
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    modelUsed: model,
  };
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const bg = toast.type === 'error' ? 'bg-danger' : toast.type === 'warning' ? 'bg-warning' : 'bg-success';
  return <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm`}>{toast.msg}</div>;
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  const modalContent = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/60 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start sm:items-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} my-auto border border-slate-100 flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="font-display font-semibold text-lg text-slate-900 truncate pr-3">{title}</h3>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-ring"
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

function StatusBadge({ status }) {
  const map = {
    ok: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    low: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    out: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    'In Stock': 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    'Low Stock': 'bg-amber-50 text-amber-700 border border-amber-200/80',
    'Out of Stock': 'bg-rose-50 text-rose-700 border border-rose-200/80',
    Draft: 'bg-slate-100 text-slate-600 border border-slate-200',
    'Pending Approval': 'bg-amber-50 text-amber-700 border border-amber-200/80',
    Approved: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    Received: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    Processing: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    Pending: 'bg-slate-100 text-slate-600 border border-slate-200',
    Income: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    Expense: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  };
  const label = status === 'ok' ? 'In Stock' : status === 'low' ? 'Low Stock' : status === 'out' ? 'Out of Stock' : status;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || map[label] || 'bg-slate-100 text-slate-600'}`}>{label}</span>;
}

function KPI({ title, value, sub, icon }) {
  const getIconStyle = (ic) => {
    switch (ic) {
      case 'dollar-sign':
      case 'indian-rupee':
      case 'currency':
      case 'trending-up':
      case 'wallet':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/70';
      case 'boxes':
      case 'package':
      case 'layers':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200/70';
      case 'shopping-bag':
      case 'shopping-cart':
      case 'clipboard-list':
        return 'bg-blue-50 text-blue-600 border-blue-200/70';
      case 'alert-circle':
      case 'alert-triangle':
      case 'x-circle':
        return 'bg-amber-50 text-amber-600 border-amber-200/70';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/70';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-cardHover hover:border-indigo-200 transition-all duration-200 p-5 flex flex-col justify-between gap-3 h-full">
      <div className="flex items-center justify-between gap-2.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate" title={title}>{title}</span>
        <div className={`w-8 h-8 shrink-0 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${getIconStyle(icon)}`}>
          <Icon name={icon} size={16} />
        </div>
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">{value}</div>
        {sub ? (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-slate-300"></span>
            <span className="truncate">{sub}</span>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>
    </div>
  );
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'ai', label: 'AI Assistant', icon: 'bot' },
  { id: 'inventory', label: 'Inventory', icon: 'package' },
  { id: 'procurement', label: 'Procurement', icon: 'shopping-cart' },
  { id: 'sales', label: 'Sales', icon: 'trending-up' },
  { id: 'finance', label: 'Finance', icon: 'wallet' },
  { id: 'reports', label: 'Reports', icon: 'file-text' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function Sidebar({ mobile }) {
  const { page, setPage, setMobileNav, settings } = useApp();
  const isReal = settings.aiMode === 'gemini';
  return (
    <aside className={`${mobile ? 'mobile-drawer fixed inset-y-0 left-0 z-40 w-64' : 'sidebar-desktop hidden md:flex'} flex-col bg-[#0B1120] text-slate-200 border-r border-slate-800/80`}>
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Icon name="sparkles" size={17} />
          </div>
          <div>
            <div className="font-display font-bold text-lg text-white tracking-tight leading-tight flex items-center gap-1.5">
              NEXERP <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-extrabold uppercase tracking-wide">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Enterprise AI Copilot</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map(n => {
          const isActive = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); setMobileNav(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all focus-ring ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-blue-600/10 text-indigo-300 font-semibold border-l-2 border-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon name={n.icon} size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{n.label}</span>
              {n.id === 'ai' && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isReal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isReal ? 'Real AI' : 'Demo'}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-[11px]">System Status</span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isReal ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isReal ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isReal ? 'Real AI (Live)' : 'Demo Engine'}
            </span>
          </div>
          <div className="font-semibold text-slate-200 truncate">{settings.company}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Academic Prototype v1.2</div>
        </div>
      </div>
    </aside>
  );
}

function ModeSwitch({ compact = false }) {
  const { settings, setSettings, showToast } = useApp();
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(settings.geminiApiKey || '');
  const [tempModel, setTempModel] = useState(settings.geminiModel || 'gemini-2.0-flash');
  const [showKey, setShowKey] = useState(false);

  const isReal = settings.aiMode === 'gemini';

  const handleToggle = (targetMode) => {
    if (targetMode === 'demo') {
      setSettings(s => ({ ...s, aiMode: 'demo' }));
      showToast('Switched to Demo Engine (Zero config, offline)', 'info');
      return;
    }
    // Target is 'gemini' (Real AI)
    const currentKey = (settings.geminiApiKey || '').trim();
    if (!currentKey) {
      setTempKey('');
      setKeyModalOpen(true);
    } else {
      setSettings(s => ({ ...s, aiMode: 'gemini' }));
      showToast(`Real AI Mode Active (${settings.geminiModel || 'gemini-2.0-flash'})`, 'success');
    }
  };

  const handleSaveKey = () => {
    const key = tempKey.trim();
    if (!key) {
      showToast('Please paste a Gemini API key or stay in Demo', 'warning');
      return;
    }
    setSettings(s => ({
      ...s,
      geminiApiKey: key,
      geminiModel: tempModel,
      aiMode: 'gemini',
    }));
    setKeyModalOpen(false);
    showToast('Gemini API key saved! Real AI Mode active.', 'success');
  };

  return (
    <>
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/90 shadow-inner ${compact ? 'text-xs' : 'text-sm'}`}>
        <button
          type="button"
          onClick={() => handleToggle('demo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            !isReal
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="flask-conical" size={compact ? 13 : 15} className={!isReal ? 'text-amber-500' : 'text-slate-400'} />
          <span>Demo Mode</span>
          {!isReal && <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold leading-none">Instant</span>}
        </button>

        <button
          type="button"
          onClick={() => handleToggle('gemini')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            isReal
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="sparkles" size={compact ? 13 : 15} className={isReal ? 'text-yellow-300' : 'text-slate-400'} />
          <span>Real AI</span>
          {isReal ? (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          ) : (
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 leading-none font-medium">Gemini</span>
          )}
        </button>
      </div>

      <Modal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} title="Activate Real AI Mode">
        <div className="space-y-4 text-sm">
          <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-indigo-950 text-xs leading-relaxed flex items-start gap-2.5">
            <Icon name="sparkles" size={18} className="text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <strong>Live Gemini Reasoning:</strong> Real AI mode sends your questions alongside live ERP operational tables directly to Google Gemini for generative analysis and unscripted insights.
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Google Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                Get free key at Google AI Studio <Icon name="external-link" size={12} />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
                placeholder="AIzaSy... (Paste your Google Gemini API Key here)"
                className="w-full pr-10 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name={showKey ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              For demo mode, no key is needed. For real live AI, paste your free Gemini API key above. It is stored securely only in your browser's localStorage.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Select Gemini Model</label>
            <select
              value={tempModel}
              onChange={e => setTempModel(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended — fastest & free tier)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep enterprise reasoning)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setKeyModalOpen(false);
                setSettings(s => ({ ...s, aiMode: 'demo' }));
                showToast('Staying in Demo Mode', 'info');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-2 rounded-lg"
            >
              Stay in Demo Mode
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setKeyModalOpen(false)}
                className="text-sm px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="text-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Icon name="check" size={16} /> Save & Activate Real AI
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function TopBar() {
  const { setPage, setMobileNav, page, settings } = useApp();
  const title = NAV.find(n => n.id === page)?.label || 'Dashboard';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <header className="sticky top-0 z-20 bg-white/95 border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 focus-ring" onClick={() => setMobileNav(true)} aria-label="Open menu"><Icon name="menu" size={20} /></button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-lg text-slate-900 tracking-tight">{title}</h1>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">/ {settings.company}</span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">{today}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ModeSwitch compact />
        <button onClick={() => setPage('ai')} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-semibold px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow transition focus-ring">
          <Icon name="sparkles" size={15} /><span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
}

function Dashboard() {
  const { metrics, products, salesOrders, purchaseOrders, monthlyRevenue, activities, setPage } = useApp();
  const catSales = useMemo(() => {
    const map = {};
    salesOrders.forEach(so => so.items.forEach(it => {
      const p = products.find(x => x.id === it.productId);
      const cat = p?.category || 'Other';
      map[cat] = (map[cat] || 0) + it.qty * it.unitPrice;
    }));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [salesOrders, products]);
  const invHealth = useMemo(() => {
    const cats = {};
    products.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { ok: 0, low: 0, out: 0 };
      cats[p.category][stockStatus(p.stock, p.reorderLevel)]++;
    });
    return Object.entries(cats).map(([name, v]) => ({ name, ...v }));
  }, [products]);
  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const insights = useMemo(() => {
    const low = products.filter(p => stockStatus(p.stock, p.reorderLevel) !== 'ok');
    const pending = purchaseOrders.filter(p => p.status === 'Pending Approval');
    const list = [];
    if (low[0]) list.push({ title: 'Stock Alert', text: `${low[0].name} is ${low[0].stock === 0 ? 'out of stock' : 'below reorder level'} (${low[0].stock} units).`, page: 'inventory', icon: 'alert-triangle' });
    if (pending[0]) list.push({ title: 'Procurement', text: `${pending.length} purchase order(s) awaiting approval.`, page: 'procurement', icon: 'clock' });
    list.push({ title: 'Sales Trend', text: 'October revenue is partial; prior months show upward trajectory.', page: 'sales', icon: 'trending-up' });
    list.push({ title: 'Recommendation', text: 'Consolidate open POs with the same suppliers to reduce freight cost.', page: 'procurement', icon: 'lightbulb' });
    if (low[1]) list.push({ title: 'Inventory', text: `${low.length} SKUs need replenishment attention.`, page: 'inventory', icon: 'package' });
    return list.slice(0, 5);
  }, [products, purchaseOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Nexora Industries · Live enterprise metrics & operational telemetry</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-5">
        <KPI title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon="dollar-sign" sub="Completed + shipped orders" />
        <KPI title="Total Orders" value={formatNum(metrics.totalOrders)} icon="shopping-bag" sub="Sales orders" />
        <KPI title="Inventory Value" value={formatCurrency(metrics.inventoryValue)} icon="boxes" sub="At unit cost" />
        <KPI title="Pending POs" value={metrics.pendingPOs} icon="clipboard-list" sub="Awaiting action" />
        <KPI title="Low-Stock" value={metrics.lowStock + metrics.outStock} icon="alert-circle" sub={`${metrics.outStock} out of stock`} />
        <KPI title="Est. Gross Profit" value={formatCurrency(metrics.grossProfit)} icon="pie-chart" sub="Income − expenses" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Revenue Overview</h3>
              <p className="text-xs text-slate-500">Monthly trajectory & recognized billing</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">Live Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={v => `₹${v / 1000}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="url(#revGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Sales by Category</h3>
              <p className="text-xs text-slate-500">Revenue contribution per line</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={catSales} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {catSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#FFFFFF" strokeWidth={2} />)}
              </Pie>
              <Tooltip formatter={v => [formatCurrency(v), 'Sales']} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Inventory Health by Category</h3>
              <p className="text-xs text-slate-500">Distribution across stock levels</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={invHealth} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="ok" name="In Stock" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="low" name="Low" stackId="a" fill="#F59E0B" />
              <Bar dataKey="out" name="Out" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">AI Copilot Insights</h3>
              <p className="text-xs text-slate-500">Proactive system recommendations</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="space-y-2.5">
            {insights.map((ins, i) => (
              <button key={i} onClick={() => setPage(ins.page)} className="w-full text-left p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/25 transition group focus-ring">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                    <Icon name={ins.icon} size={15} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">{ins.title}</div>
                    <div className="text-xs text-slate-800 font-medium mt-0.5 leading-snug">{ins.text}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-slate-900 text-base">Recent Sales Orders</h3>
            <button onClick={() => setPage('sales')} className="text-xs text-indigo-600 font-semibold hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="pb-2 pr-3 font-semibold">Order</th><th className="pb-2 pr-3 font-semibold">Customer</th>
                <th className="pb-2 pr-3 font-semibold">Total</th><th className="pb-2 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {salesOrders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition">
                    <td className="py-2.5 pr-3 font-semibold text-slate-900">{o.id}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{o.customer}</td>
                    <td className="py-2.5 pr-3 font-medium text-slate-900">{formatCurrency(o.total)}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-slate-900 text-base">Operational Activity</h3>
            <span className="text-xs text-slate-400">Live feed</span>
          </div>
          <ul className="space-y-3">
            {activities.map(a => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === 'inventory' ? 'bg-amber-400' : a.type === 'procurement' ? 'bg-indigo-500' : a.type === 'sales' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="text-slate-800 text-xs font-medium">{a.text}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AIAssistant() {
  const ctx = useApp();
  const { chatMessages, setChatMessages, chatLoading, setChatLoading, setPage, showToast, settings } = ctx;
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, chatLoading]);
  const chips = ['Analyze Business Performance', 'Find Low-Stock Products', 'Recommend Reorders', 'Summarize Pending Orders', 'Generate Weekly Report', 'Identify Operational Risks'];
  const isGemini = settings.aiMode === 'gemini';

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || chatLoading) return;
    setInput('');
    setChatMessages(m => [...m, { role: 'user', content: q }]);
    setChatLoading(true);

    const apiKey = (settings.geminiApiKey || '').trim() || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
    if (isGemini) {
      if (!apiKey) {
        showToast('No Gemini API key in Settings. Using Demo Mode.', 'warning');
      } else {
        try {
          const resp = await queryGemini(q, ctx, apiKey, settings.geminiModel || 'gemini-1.5-flash');
          setChatMessages(m => [...m, { role: 'assistant', ...resp }]);
          setChatLoading(false);
          return;
        } catch (err) {
          console.error('Gemini error:', err);
          showToast(`Gemini API call failed: ${err.message || 'error'}. Using Demo Mode fallback.`, 'error');
        }
      }
    }

    // Deterministic Demo Engine
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const resp = generateAIResponse(q, ctx);
    setChatMessages(m => [...m, { role: 'assistant', ...resp, modelUsed: 'Demo Engine' }]);
    setChatLoading(false);
  };
  const clearChat = () => { setChatMessages([]); showToast('Conversation cleared'); };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[850px]">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col flex-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
                <Icon name="bot" size={16} />
              </span>
              AI ERP Copilot
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask natural-language questions about inventory, sales, procurement & finance.
            </p>
          </div>
          <button onClick={clearChat} className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1.5 focus-ring rounded-lg px-2.5 py-1.5 border border-slate-200/80 hover:bg-slate-50 transition">
            <Icon name="trash-2" size={13} /> Clear Chat
          </button>
        </div>

        {/* Real / Demo Mode Banner */}
        <div className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isGemini
            ? (settings.geminiApiKey?.trim() ? 'bg-indigo-50/70 border-indigo-100 text-indigo-950' : 'bg-amber-50/80 border-amber-200 text-amber-950')
            : 'bg-slate-50/90 border-slate-200/80 text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            {isGemini ? (
              settings.geminiApiKey?.trim() ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-indigo-950">Real AI Connected:</span>
                  <span className="text-indigo-700">Live Gemini ({settings.geminiModel || 'gemini-2.0-flash'}) with real-time ERP schema grounding.</span>
                </>
              ) : (
                <>
                  <Icon name="alert-triangle" size={14} className="text-amber-600" />
                  <span className="font-semibold text-amber-900">Real Mode Selected:</span>
                  <span className="text-amber-800">No API key entered yet. Fallback to Demo Mode until key is provided.</span>
                </>
              )
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="font-semibold text-slate-800">Demo Engine:</span>
                <span className="text-slate-500">Instant offline responses grounded in live demo tables (zero setup required).</span>
              </>
            )}
          </div>
          <ModeSwitch compact />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
          {chatMessages.length === 0 && (
            <div className="text-center py-12 px-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                <Icon name="sparkles" size={26} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">Enterprise ERP Copilot</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                {isGemini
                  ? 'Ask complex analytical questions about your supply chain, reorder risks, and profitability — powered live by Google Gemini.'
                  : 'Grounded intelligence over your live operational dataset. Toggle to Real AI above anytime to connect Google Gemini.'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {chips.map(c => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="chip text-xs border border-slate-200 bg-white px-3.5 py-2 rounded-xl text-slate-700 font-medium shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition focus-ring"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] sm:max-w-[80%] ${m.role === 'user' ? 'msg-user px-4 py-3' : 'msg-ai p-5'} text-sm`}>
                {m.role === 'user' ? <div className="font-medium">{m.content}</div> : (
                  <div className="space-y-3.5">
                    <p className="font-semibold text-slate-900 leading-relaxed text-sm sm:text-base">{m.answer}</p>
                    {m.findings?.length > 0 && (
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Findings</div>
                        <div className="space-y-1 text-slate-800 text-xs sm:text-sm">
                          {m.findings.map((f, j) => <div key={j} dangerouslySetInnerHTML={{ __html: f.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-950 font-semibold">$1</strong>') }} />)}
                        </div>
                      </div>
                    )}
                    {m.figures && Object.keys(m.figures).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(m.figures).map(([k, v]) => (
                          <div key={k} className="bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{k}</div>
                            <div className="font-bold text-slate-900 text-sm">{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {m.recommendations?.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Actions</div>
                        <ul className="list-disc list-inside text-slate-700 text-xs sm:text-sm space-y-0.5">{m.recommendations.map((r, j) => <li key={j}>{r}</li>)}</ul>
                      </div>
                    )}
                    {m.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.actions.map((a, j) => (
                          <button key={j} onClick={() => { if (a.page === 'ai' && a.followUp) send(a.followUp); else setPage(a.page); }}
                            className="text-xs font-semibold bg-slate-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800 focus-ring shadow-sm transition">{a.label}</button>
                        ))}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>Generated via {m.modelUsed || (isGemini ? 'Google Gemini' : 'Demo Engine')}</span>
                      <span className="font-medium text-slate-500">Live Telemetry Grounded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="msg-ai px-4 py-3 text-sm text-slate-500 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span className="animate-pulse-soft font-medium text-xs">
                  {isGemini ? 'Synthesizing with Google Gemini Generative Model…' : 'Analyzing in-memory demo dataset…'}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {chatMessages.length > 0 && (
          <div className="px-5 pt-2.5 flex flex-wrap gap-1.5 bg-white border-t border-slate-100">
            {chips.slice(0, 4).map(c => (
              <button key={c} onClick={() => send(c)} disabled={chatLoading} className="chip text-[11px] border border-slate-200 bg-white px-3 py-1 rounded-full text-slate-600 font-medium disabled:opacity-50 focus-ring">{c}</button>
            ))}
          </div>
        )}
        <div className="p-4 border-t border-slate-200/80 bg-white">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1} placeholder={isGemini ? "Ask Gemini anything about your live inventory, margins, reorder risks…" : "Ask about inventory, orders, performance (Demo Mode)…"}
              className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              disabled={chatLoading} />
            <button type="submit" disabled={chatLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white px-5 rounded-xl focus-ring flex items-center gap-2 font-semibold text-sm shadow-sm transition">
              <Icon name="send" size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Inventory() {
  const { products, setProducts, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => {
    let list = [...products];
    if (search) { const s = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)); }
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter);
    if (statusFilter !== 'all') list = list.filter(p => stockStatus(p.stock, p.reorderLevel) === statusFilter);
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'stock') return a.stock - b.stock;
      if (sort === 'value') return (b.stock * b.unitPrice) - (a.stock * a.unitPrice);
      return 0;
    });
    return list;
  }, [products, search, catFilter, statusFilter, sort]);
  const summary = useMemo(() => ({
    total: products.length,
    units: products.reduce((s, p) => s + p.stock, 0),
    value: invValue(products),
    low: products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'low').length,
    out: products.filter(p => stockStatus(p.stock, p.reorderLevel) === 'out').length,
  }), [products]);

  const openAdd = () => { setForm({ id: '', name: '', category: 'Electronics', stock: 0, reorderLevel: 10, unitPrice: 0 }); setErrors({}); setModal({ type: 'add' }); };
  const openEdit = (p) => { setForm({ ...p }); setErrors({}); setModal({ type: 'edit', product: p }); };
  const openAdjust = (p) => { setForm({ id: p.id, delta: 0 }); setErrors({}); setModal({ type: 'adjust', product: p }); };
  const openDetail = (p) => setModal({ type: 'detail', product: p });
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Required';
    if (form.stock < 0 || isNaN(Number(form.stock))) e.stock = 'Invalid';
    if (form.reorderLevel < 0 || isNaN(Number(form.reorderLevel))) e.reorderLevel = 'Invalid';
    if (form.unitPrice < 0 || isNaN(Number(form.unitPrice))) e.unitPrice = 'Invalid';
    if (modal.type === 'add' && products.some(p => p.id === form.id)) e.id = 'ID exists';
    if (modal.type === 'add' && !form.id?.trim()) e.id = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const saveProduct = () => {
    if (!validate()) return;
    if (modal.type === 'add') {
      setProducts(ps => [...ps, { ...form, stock: Number(form.stock), reorderLevel: Number(form.reorderLevel), unitPrice: Number(form.unitPrice) }]);
      showToast('Product added');
    } else {
      setProducts(ps => ps.map(p => p.id === form.id ? { ...form, stock: Number(form.stock), reorderLevel: Number(form.reorderLevel), unitPrice: Number(form.unitPrice) } : p));
      showToast('Product updated');
    }
    setModal(null);
  };
  const adjustStock = () => {
    const delta = Number(form.delta);
    if (isNaN(delta)) { setErrors({ delta: 'Invalid number' }); return; }
    const p = modal.product;
    const next = p.stock + delta;
    if (next < 0) { setErrors({ delta: 'Resulting stock cannot be negative' }); return; }
    setProducts(ps => ps.map(x => x.id === p.id ? { ...x, stock: next } : x));
    showToast(`Stock adjusted by ${delta > 0 ? '+' : ''}${delta}`);
    setModal(null);
  };
  const deleteProduct = (p) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    setProducts(ps => ps.filter(x => x.id !== p.id));
    showToast('Product deleted');
    setModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPI title="Products" value={summary.total} icon="package" />
        <KPI title="Total Units" value={formatNum(summary.units)} icon="layers" />
        <KPI title="Inventory Value" value={formatCurrency(summary.value)} icon="dollar-sign" />
        <KPI title="Low Stock" value={summary.low} icon="alert-triangle" />
        <KPI title="Out of Stock" value={summary.out} icon="x-circle" />
      </div>
      <div className="bg-white rounded-xl border border-border shadow-card">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-border">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…" className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40">
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            <option value="ok">In Stock</option><option value="low">Low Stock</option><option value="out">Out of Stock</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
            <option value="name">Sort: Name</option><option value="stock">Sort: Stock</option><option value="value">Sort: Value</option>
          </select>
          <button onClick={openAdd} className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal/90 focus-ring flex items-center gap-1.5 whitespace-nowrap">
            <Icon name="plus" size={16} /> Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Reorder</th><th className="px-4 py-3 font-medium">Unit Price</th>
                <th className="px-4 py-3 font-medium">Value</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted">No products match your filters.</td></tr>}
              {filtered.map(p => {
                const st = stockStatus(p.stock, p.reorderLevel);
                return (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-surface/50">
                    <td className="px-4 py-2.5 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-2.5 font-medium">{p.name}</td>
                    <td className="px-4 py-2.5 text-muted">{p.category}</td>
                    <td className="px-4 py-2.5">{p.stock}</td>
                    <td className="px-4 py-2.5 text-muted">{p.reorderLevel}</td>
                    <td className="px-4 py-2.5">{formatCurrency(p.unitPrice)}</td>
                    <td className="px-4 py-2.5">{formatCurrency(p.stock * p.unitPrice)}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={st} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(p)} className="p-1.5 rounded hover:bg-surface text-muted hover:text-ink focus-ring" title="View"><Icon name="eye" size={15} /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-surface text-muted hover:text-ink focus-ring" title="Edit"><Icon name="pencil" size={15} /></button>
                        <button onClick={() => openAdjust(p)} className="p-1.5 rounded hover:bg-surface text-muted hover:text-ink focus-ring" title="Adjust"><Icon name="plus-minus" size={15} /></button>
                        <button onClick={() => deleteProduct(p)} className="p-1.5 rounded hover:bg-red-50 text-muted hover:text-danger focus-ring" title="Delete"><Icon name="trash-2" size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modal?.type === 'add' || modal?.type === 'edit'} onClose={() => setModal(null)} title={modal?.type === 'add' ? 'Add Product' : 'Edit Product'}>
        <div className="space-y-3">
          {modal?.type === 'add' && (
            <div>
              <label className="text-xs font-medium text-muted">Product ID</label>
              <input value={form.id || ''} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
              {errors.id && <p className="text-xs text-danger mt-0.5">{errors.id}</p>}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-muted">Name</label>
            <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
            {errors.name && <p className="text-xs text-danger mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Category</label>
            <select value={form.category || 'Electronics'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm">
              {['Electronics', 'Machinery', 'Components', 'Consumables', 'Safety'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Stock</label>
              <input type="number" min="0" value={form.stock ?? 0} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
              {errors.stock && <p className="text-xs text-danger mt-0.5">{errors.stock}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Reorder Level</label>
              <input type="number" min="0" value={form.reorderLevel ?? 0} onChange={e => setForm(f => ({ ...f, reorderLevel: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
              {errors.reorderLevel && <p className="text-xs text-danger mt-0.5">{errors.reorderLevel}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Unit Price</label>
              <input type="number" min="0" step="0.01" value={form.unitPrice ?? 0} onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
              {errors.unitPrice && <p className="text-xs text-danger mt-0.5">{errors.unitPrice}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-surface">Cancel</button>
            <button onClick={saveProduct} className="px-4 py-2 text-sm bg-teal text-white rounded-lg hover:bg-teal/90">Save</button>
          </div>
        </div>
      </Modal>
      <Modal open={modal?.type === 'adjust'} onClose={() => setModal(null)} title={`Adjust Stock — ${modal?.product?.name}`}>
        <div className="space-y-3">
          <p className="text-sm text-muted">Current stock: <strong className="text-ink">{modal?.product?.stock}</strong></p>
          <div>
            <label className="text-xs font-medium text-muted">Adjustment (+/−)</label>
            <input type="number" value={form.delta ?? 0} onChange={e => setForm(f => ({ ...f, delta: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
            {errors.delta && <p className="text-xs text-danger mt-0.5">{errors.delta}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-border rounded-lg">Cancel</button>
            <button onClick={adjustStock} className="px-4 py-2 text-sm bg-teal text-white rounded-lg">Apply</button>
          </div>
        </div>
      </Modal>
      <Modal open={modal?.type === 'detail'} onClose={() => setModal(null)} title={modal?.product?.name}>
        {modal?.product && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-muted">ID</span><div className="font-medium">{modal.product.id}</div></div>
              <div><span className="text-muted">Category</span><div className="font-medium">{modal.product.category}</div></div>
              <div><span className="text-muted">Stock</span><div className="font-medium">{modal.product.stock}</div></div>
              <div><span className="text-muted">Reorder Level</span><div className="font-medium">{modal.product.reorderLevel}</div></div>
              <div><span className="text-muted">Unit Price</span><div className="font-medium">{formatCurrency(modal.product.unitPrice)}</div></div>
              <div><span className="text-muted">Inventory Value</span><div className="font-medium">{formatCurrency(modal.product.stock * modal.product.unitPrice)}</div></div>
            </div>
            <div className="pt-2"><StatusBadge status={stockStatus(modal.product.stock, modal.product.reorderLevel)} /></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Procurement() {
  const { purchaseOrders, setPurchaseOrders, products, setProducts, suppliers, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ supplierId: 'S001', expectedDate: '', items: [{ productId: 'P001', qty: 10, unitPrice: 125 }] });
  const filtered = useMemo(() => {
    let list = [...purchaseOrders];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.id.toLowerCase().includes(s) || (suppliers.find(x => x.id === p.supplierId)?.name || '').toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    return list.sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  }, [purchaseOrders, search, statusFilter, suppliers]);
  const summary = useMemo(() => {
    const counts = { total: purchaseOrders.length, Draft: 0, 'Pending Approval': 0, Approved: 0, Received: 0, Cancelled: 0 };
    let value = 0;
    purchaseOrders.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; if (p.status !== 'Cancelled') value += poTotal(p); });
    return { ...counts, value };
  }, [purchaseOrders]);

  const updateStatus = (id, status) => {
    setPurchaseOrders(pos => pos.map(p => {
      if (p.id !== id) return p;
      if (status === 'Received' && p.received) { showToast('Order already received — inventory not double-counted', 'warning'); return p; }
      if (status === 'Received' && !p.received) {
        setProducts(prods => prods.map(pr => {
          const item = p.items.find(i => i.productId === pr.id);
          if (!item) return pr;
          return { ...pr, stock: pr.stock + item.qty };
        }));
        showToast(`PO ${id} received — inventory updated`);
        return { ...p, status: 'Received', received: true };
      }
      showToast(`PO ${id} → ${status}`);
      return { ...p, status };
    }));
  };
  const createPO = () => {
    if (!form.expectedDate || !form.items.length) { showToast('Fill expected date and items', 'error'); return; }
    const id = `PO-2024-${String(purchaseOrders.length + 11).padStart(3, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    setPurchaseOrders(pos => [...pos, {
      id, supplierId: form.supplierId, orderDate: today, expectedDate: form.expectedDate, status: 'Draft',
      items: form.items.map(i => ({ ...i, qty: Number(i.qty), unitPrice: Number(i.unitPrice) })), received: false,
    }]);
    setCreateOpen(false);
    showToast(`Created ${id}`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI title="Total POs" value={summary.total} icon="clipboard-list" />
        <KPI title="Draft" value={summary.Draft} icon="file" />
        <KPI title="Pending" value={summary['Pending Approval']} icon="clock" />
        <KPI title="Approved" value={summary.Approved} icon="check-circle" />
        <KPI title="Received" value={summary.Received} icon="package-check" />
        <KPI title="PO Value" value={formatCurrency(summary.value)} icon="dollar-sign" />
      </div>
      <div className="bg-white rounded-xl border border-border shadow-card">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-border">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PO or supplier…" className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {['Draft', 'Pending Approval', 'Approved', 'Received', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setCreateOpen(true)} className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal/90 focus-ring flex items-center gap-1.5">
            <Icon name="plus" size={16} /> New PO
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">PO ID</th><th className="px-4 py-3 font-medium">Supplier</th><th className="px-4 py-3 font-medium">Order Date</th>
                <th className="px-4 py-3 font-medium">Expected</th><th className="px-4 py-3 font-medium">Items</th><th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const sup = suppliers.find(s => s.id === p.supplierId);
                return (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-surface/50">
                    <td className="px-4 py-2.5 font-medium">{p.id}</td>
                    <td className="px-4 py-2.5 text-muted">{sup?.name || p.supplierId}</td>
                    <td className="px-4 py-2.5">{p.orderDate}</td>
                    <td className="px-4 py-2.5">{p.expectedDate}</td>
                    <td className="px-4 py-2.5">{p.items.length}</td>
                    <td className="px-4 py-2.5">{formatCurrency(poTotal(p))}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        <button onClick={() => setDetail(p)} className="text-xs px-2 py-1 border border-border rounded hover:bg-surface focus-ring">View</button>
                        {p.status === 'Draft' && <button onClick={() => updateStatus(p.id, 'Pending Approval')} className="text-xs px-2 py-1 bg-amber-50 text-warning border border-amber-200 rounded focus-ring">Submit</button>}
                        {p.status === 'Pending Approval' && <button onClick={() => updateStatus(p.id, 'Approved')} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded focus-ring">Approve</button>}
                        {p.status === 'Approved' && !p.received && <button onClick={() => updateStatus(p.id, 'Received')} className="text-xs px-2 py-1 bg-green-50 text-success border border-green-200 rounded focus-ring">Receive</button>}
                        {['Draft', 'Pending Approval', 'Approved'].includes(p.status) && (
                          <button onClick={() => { if (confirm('Cancel this PO?')) updateStatus(p.id, 'Cancelled'); }} className="text-xs px-2 py-1 text-danger hover:bg-red-50 rounded focus-ring">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.id} wide>
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted">Supplier</span><div className="font-medium">{suppliers.find(s => s.id === detail.supplierId)?.name}</div></div>
              <div><span className="text-muted">Status</span><div><StatusBadge status={detail.status} /></div></div>
              <div><span className="text-muted">Order Date</span><div className="font-medium">{detail.orderDate}</div></div>
              <div><span className="text-muted">Expected</span><div className="font-medium">{detail.expectedDate}</div></div>
            </div>
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-surface"><tr className="text-left text-xs text-muted">
                <th className="px-3 py-2">Product</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2">Unit Price</th><th className="px-3 py-2">Line Total</th>
              </tr></thead>
              <tbody>
                {detail.items.map((it, i) => {
                  const pr = products.find(p => p.id === it.productId);
                  return (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2">{pr?.name || it.productId}</td>
                      <td className="px-3 py-2">{it.qty}</td>
                      <td className="px-3 py-2">{formatCurrency(it.unitPrice)}</td>
                      <td className="px-3 py-2">{formatCurrency(it.qty * it.unitPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-right font-semibold">Total: {formatCurrency(poTotal(detail))}</div>
          </div>
        )}
      </Modal>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Purchase Order" wide>
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium text-muted">Supplier</label>
            <select value={form.supplierId} onChange={e => setForm(f => ({ ...f, supplierId: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2">
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Expected Delivery</label>
            <input type="date" value={form.expectedDate} onChange={e => setForm(f => ({ ...f, expectedDate: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Line Items</label>
            {form.items.map((it, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <select value={it.productId} onChange={e => {
                  const pr = products.find(p => p.id === e.target.value);
                  setForm(f => { const items = [...f.items]; items[i] = { ...items[i], productId: e.target.value, unitPrice: pr?.unitPrice || 0 }; return { ...f, items }; });
                }} className="flex-1 border border-border rounded-lg px-2 py-1.5">
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="number" min="1" value={it.qty} onChange={e => setForm(f => { const items = [...f.items]; items[i] = { ...items[i], qty: e.target.value }; return { ...f, items }; })} className="w-20 border border-border rounded-lg px-2 py-1.5" placeholder="Qty" />
                <input type="number" min="0" step="0.01" value={it.unitPrice} onChange={e => setForm(f => { const items = [...f.items]; items[i] = { ...items[i], unitPrice: e.target.value }; return { ...f, items }; })} className="w-24 border border-border rounded-lg px-2 py-1.5" placeholder="Price" />
              </div>
            ))}
            <button onClick={() => setForm(f => ({ ...f, items: [...f.items, { productId: products[0]?.id, qty: 1, unitPrice: products[0]?.unitPrice || 0 }] }))} className="text-xs text-teal mt-2 font-medium">+ Add line</button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 border border-border rounded-lg">Cancel</button>
            <button onClick={createPO} className="px-4 py-2 bg-teal text-white rounded-lg">Create Draft</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Sales() {
  const { salesOrders, setSalesOrders, products, metrics, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    customer: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending',
    items: [{ productId: products[0]?.id || 'P001', qty: 1, unitPrice: products[0]?.unitPrice || 0 }]
  });
  const filtered = useMemo(() => {
    let list = [...salesOrders];
    if (search) { const s = search.toLowerCase(); list = list.filter(o => o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s)); }
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [salesOrders, search, statusFilter]);
  const bestSellers = useMemo(() => {
    const map = {};
    salesOrders.forEach(so => so.items.forEach(it => { map[it.productId] = (map[it.productId] || 0) + it.qty; }));
    return Object.entries(map).map(([id, qty]) => ({ id, qty, name: products.find(p => p.id === id)?.name || id })).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [salesOrders, products]);
  const completed = salesOrders.filter(s => ['Completed', 'Shipped'].includes(s.status));
  const avgOrder = completed.length ? metrics.totalRevenue / completed.length : 0;
  const changeStatus = (id, status) => { setSalesOrders(sos => sos.map(s => s.id === id ? { ...s, status } : s)); showToast(`${id} → ${status}`); };

  const createOrder = () => {
    if (!form.customer.trim()) { showToast('Please enter a customer name', 'error'); return; }
    if (!form.items.length) { showToast('Add at least one line item', 'error'); return; }
    const id = `SO-${4500 + salesOrders.length + 1}`;
    const total = form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
    const newOrder = {
      id,
      date: form.date || new Date().toISOString().slice(0, 10),
      customer: form.customer.trim(),
      items: form.items.map(it => ({ ...it, qty: Number(it.qty) || 1, unitPrice: Number(it.unitPrice) || 0 })),
      status: form.status || 'Pending',
      total
    };
    setSalesOrders(sos => [newOrder, ...sos]);
    setCreateOpen(false);
    setForm({
      customer: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      items: [{ productId: products[0]?.id || 'P001', qty: 1, unitPrice: products[0]?.unitPrice || 0 }]
    });
    showToast(`Created order ${id}`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Sales Revenue" value={formatCurrency(metrics.totalRevenue)} icon="dollar-sign" sub="Completed + shipped" />
        <KPI title="Sales Orders" value={salesOrders.length} icon="shopping-bag" />
        <KPI title="Avg Order Value" value={formatCurrency(avgOrder || 0)} icon="calculator" />
        <KPI title="Best Seller" value={bestSellers[0]?.name?.split(' ').slice(0, 2).join(' ') || '—'} icon="award" sub={`${bestSellers[0]?.qty || 0} units`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-card">
          <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-border items-center">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order or customer…" className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              {['Pending', 'Processing', 'Shipped', 'Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => setCreateOpen(true)} className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal/90 focus-ring flex items-center gap-1.5 whitespace-nowrap">
              <Icon name="plus" size={16} /> New Order
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Order</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-border/60 hover:bg-surface/50">
                    <td className="px-4 py-2.5 font-medium">{o.id}</td>
                    <td className="px-4 py-2.5 text-muted">{o.date}</td>
                    <td className="px-4 py-2.5">{o.customer}</td>
                    <td className="px-4 py-2.5">{o.items.length}</td>
                    <td className="px-4 py-2.5">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => setDetail(o)} className="text-xs px-2 py-1 border border-border rounded hover:bg-surface focus-ring">View</button>
                        {o.status === 'Pending' && <button onClick={() => changeStatus(o.id, 'Processing')} className="text-xs px-2 py-1 bg-amber-50 text-warning rounded focus-ring">Process</button>}
                        {o.status === 'Processing' && <button onClick={() => changeStatus(o.id, 'Shipped')} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded focus-ring">Ship</button>}
                        {o.status === 'Shipped' && <button onClick={() => changeStatus(o.id, 'Completed')} className="text-xs px-2 py-1 bg-green-50 text-success rounded focus-ring">Complete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-card p-4">
          <h3 className="font-display font-semibold text-ink mb-3">Best-Selling Products</h3>
          <ul className="space-y-2">
            {bestSellers.map((b, i) => (
              <li key={b.id} className="flex items-center justify-between text-sm">
                <span className="text-muted w-5">{i + 1}.</span>
                <span className="flex-1 font-medium truncate">{b.name}</span>
                <span className="text-muted">{b.qty} u</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Sales Order" wide>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Customer Name</label>
              <input value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="e.g. Apex Manufacturing" className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Order Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted">Order Line Items</label>
              <button type="button" onClick={() => setForm(f => ({ ...f, items: [...f.items, { productId: products[0]?.id || 'P001', qty: 1, unitPrice: products[0]?.unitPrice || 0 }] }))} className="text-xs text-teal font-medium hover:underline flex items-center gap-1">
                <Icon name="plus" size={12} /> Add Item
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.items.map((it, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={it.productId} onChange={e => {
                    const pid = e.target.value;
                    const prod = products.find(p => p.id === pid);
                    setForm(f => {
                      const items = [...f.items];
                      items[i] = { ...items[i], productId: pid, unitPrice: prod?.unitPrice || items[i].unitPrice };
                      return { ...f, items };
                    });
                  }} className="flex-1 border border-border rounded-lg px-2 py-1.5 text-xs">
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.unitPrice)})</option>)}
                  </select>
                  <input type="number" min="1" value={it.qty} onChange={e => setForm(f => {
                    const items = [...f.items];
                    items[i] = { ...items[i], qty: Math.max(1, parseInt(e.target.value) || 1) };
                    return { ...f, items };
                  })} className="w-16 border border-border rounded-lg px-2 py-1.5 text-xs" placeholder="Qty" />
                  <input type="number" min="0" step="0.01" value={it.unitPrice} onChange={e => setForm(f => {
                    const items = [...f.items];
                    items[i] = { ...items[i], unitPrice: parseFloat(e.target.value) || 0 };
                    return { ...f, items };
                  })} className="w-24 border border-border rounded-lg px-2 py-1.5 text-xs" placeholder="Price" />
                  <span className="w-20 text-xs text-ink font-medium text-right">
                    {formatCurrency((Number(it.qty) || 0) * (Number(it.unitPrice) || 0))}
                  </span>
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))} className="p-1 text-danger hover:bg-red-50 rounded">
                      <Icon name="trash-2" size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted">Estimated Total: </span>
              <strong className="text-ink font-display text-base">
                {formatCurrency(form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0))}
              </strong>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreateOpen(false)} className="text-sm px-4 py-2 border border-border rounded-lg hover:bg-surface">Cancel</button>
              <button onClick={createOrder} className="text-sm px-4 py-2 bg-teal text-white font-medium rounded-lg hover:bg-teal/90">Create Order</button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.id} wide>
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-muted">Customer</span><div className="font-medium">{detail.customer}</div></div>
              <div><span className="text-muted">Date</span><div className="font-medium">{detail.date}</div></div>
              <div><span className="text-muted">Status</span><div><StatusBadge status={detail.status} /></div></div>
              <div><span className="text-muted">Total</span><div className="font-medium">{formatCurrency(detail.total)}</div></div>
            </div>
            <table className="w-full border border-border rounded-lg overflow-hidden">
              <thead className="bg-surface text-xs text-muted">
                <tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">Qty</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Line</th></tr>
              </thead>
              <tbody>
                {detail.items.map((it, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2">{products.find(p => p.id === it.productId)?.name || it.productId}</td>
                    <td className="px-3 py-2">{it.qty}</td>
                    <td className="px-3 py-2">{formatCurrency(it.unitPrice)}</td>
                    <td className="px-3 py-2">{formatCurrency(it.qty * it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Finance() {
  const { finance, setFinance, metrics, showToast } = useApp();
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    category: 'Sales Revenue',
    type: 'Income',
    amount: ''
  });
  const categories = useMemo(() => [...new Set(finance.map(f => f.category))], [finance]);
  const filtered = useMemo(() => {
    let list = [...finance];
    if (typeFilter !== 'all') list = list.filter(f => f.type === typeFilter);
    if (catFilter !== 'all') list = list.filter(f => f.category === catFilter);
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [finance, typeFilter, catFilter]);
  const expenseByCat = useMemo(() => {
    const map = {};
    finance.filter(f => f.type === 'Expense').forEach(f => { map[f.category] = (map[f.category] || 0) + f.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [finance]);
  const COLORS = ['#00BFA6', '#142B45', '#6485A6', '#F59E0B', '#16A34A', '#DC2626', '#8B5CF6'];

  const createTransaction = () => {
    if (!form.description.trim()) { showToast('Please enter description', 'error'); return; }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) { showToast('Please enter an amount greater than 0', 'error'); return; }
    const id = `TXN-${1000 + finance.length + 1}`;
    const newEntry = {
      id,
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      amount: amt
    };
    setFinance(f => [newEntry, ...f]);
    setCreateOpen(false);
    setForm({ date: new Date().toISOString().slice(0, 10), description: '', category: 'Sales Revenue', type: 'Income', amount: '' });
    showToast(`Transaction ${id} recorded`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5 rounded-lg">
        All financial data is illustrative sample data for academic demonstration only. Not audited accounting.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KPI title="Recorded Revenue" value={formatCurrency(metrics.income)} icon="trending-up" />
        <KPI title="Recorded Expenses" value={formatCurrency(metrics.expenses)} icon="trending-down" />
        <KPI title="Est. Gross Profit" value={formatCurrency(metrics.grossProfit)} icon="wallet" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-card p-4">
          <h3 className="font-display font-semibold text-ink mb-3">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={expenseByCat} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {expenseByCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-card p-4">
          <h3 className="font-display font-semibold text-ink mb-3">Revenue Trend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#00BFA6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border shadow-card">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-border items-center justify-between">
          <div className="flex gap-3">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
              <option value="all">All types</option><option value="Income">Income</option><option value="Expense">Expense</option>
            </select>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm">
              <option value="all">All categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => setCreateOpen(true)} className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal/90 focus-ring flex items-center gap-1.5 whitespace-nowrap">
            <Icon name="plus" size={16} /> New Transaction
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-border/60 hover:bg-surface/50">
                  <td className="px-4 py-2.5 font-mono text-xs">{f.id}</td>
                  <td className="px-4 py-2.5 text-muted">{f.date}</td>
                  <td className="px-4 py-2.5">{f.description}</td>
                  <td className="px-4 py-2.5 text-muted">{f.category}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={f.type} /></td>
                  <td className={`px-4 py-2.5 font-medium ${f.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                    {f.type === 'Income' ? '+' : '−'}{formatCurrency(f.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Transaction">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Transaction Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm">
                <option value="Income">Income (+)</option>
                <option value="Expense">Expense (-)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Utility bill, Equipment maintenance, Customer payment" className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm">
                {['Sales Revenue', 'Procurement', 'Payroll', 'Rent', 'Utilities', 'Maintenance', 'Software', 'Logistics', 'Marketing', 'Professional Services', 'Taxes', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Amount (₹)</label>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal/40" />
            </div>
          </div>
          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button onClick={() => setCreateOpen(false)} className="text-sm px-4 py-2 border border-border rounded-lg hover:bg-surface">Cancel</button>
            <button onClick={createTransaction} className="text-sm px-4 py-2 bg-teal text-white font-medium rounded-lg hover:bg-teal/90">Record Transaction</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Reports() {
  const { products, purchaseOrders, salesOrders, finance, metrics, suppliers, showToast } = useApp();
  const [reportType, setReportType] = useState('inventory');
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const types = [
    { id: 'performance', label: 'Business Performance Summary' },
    { id: 'inventory', label: 'Inventory Status Report' },
    { id: 'lowstock', label: 'Low-Stock Report' },
    { id: 'procurement', label: 'Procurement Summary' },
    { id: 'sales', label: 'Sales Performance Report' },
    { id: 'finance', label: 'Financial Overview' },
  ];

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ts = new Date().toLocaleString();
    let report = { type: reportType, title: types.find(t => t.id === reportType)?.label, ts, metrics: {}, rows: [], commentary: '' };
    if (reportType === 'inventory' || reportType === 'lowstock') {
      const list = reportType === 'lowstock' ? products.filter(p => stockStatus(p.stock, p.reorderLevel) !== 'ok') : products;
      report.rows = list.map(p => ({ ID: p.id, Name: p.name, Category: p.category, Stock: p.stock, Reorder: p.reorderLevel, Value: (p.stock * p.unitPrice).toFixed(2), Status: stockStatus(p.stock, p.reorderLevel) }));
      report.metrics = { 'Total SKUs': list.length, 'Inventory Value': formatCurrency(list.reduce((s, p) => s + p.stock * p.unitPrice, 0)), 'Low / Out': products.filter(p => stockStatus(p.stock, p.reorderLevel) !== 'ok').length };
      report.commentary = reportType === 'lowstock' ? `AI observation: ${list.length} SKUs require replenishment. Prioritize out-of-stock items.` : `AI observation: Inventory spans ${[...new Set(products.map(p => p.category))].length} categories. Overall value ${formatCurrency(metrics.inventoryValue)}.`;
    } else if (reportType === 'procurement') {
      report.rows = purchaseOrders.map(p => ({ ID: p.id, Supplier: suppliers.find(s => s.id === p.supplierId)?.name, Status: p.status, Amount: poTotal(p).toFixed(2), Items: p.items.length, Expected: p.expectedDate }));
      report.metrics = { 'Total POs': purchaseOrders.length, 'Pending Approval': purchaseOrders.filter(p => p.status === 'Pending Approval').length, 'Open Value': formatCurrency(purchaseOrders.filter(p => !['Received', 'Cancelled'].includes(p.status)).reduce((s, p) => s + poTotal(p), 0)) };
      report.commentary = 'AI observation: Focus approval queue on high-value and out-of-stock-related orders.';
    } else if (reportType === 'sales') {
      report.rows = salesOrders.map(o => ({ ID: o.id, Date: o.date, Customer: o.customer, Total: o.total.toFixed(2), Status: o.status, Items: o.items.length }));
      report.metrics = { Orders: salesOrders.length, Revenue: formatCurrency(metrics.totalRevenue), 'Avg Order': formatCurrency(metrics.totalRevenue / Math.max(1, salesOrders.filter(s => ['Completed', 'Shipped'].includes(s.status)).length)) };
      report.commentary = 'AI observation: Completed and shipped orders drive recognized revenue.';
    } else if (reportType === 'finance') {
      report.rows = finance.map(f => ({ ID: f.id, Date: f.date, Description: f.description, Category: f.category, Type: f.type, Amount: f.amount.toFixed(2) }));
      report.metrics = { Income: formatCurrency(metrics.income), Expenses: formatCurrency(metrics.expenses), 'Gross Profit': formatCurrency(metrics.grossProfit) };
      report.commentary = 'AI observation: Sample data only. Gross profit is illustrative.';
    } else {
      report.rows = [
        { Metric: 'Total Revenue (sales)', Value: formatCurrency(metrics.totalRevenue) },
        { Metric: 'Recorded Income', Value: formatCurrency(metrics.income) },
        { Metric: 'Recorded Expenses', Value: formatCurrency(metrics.expenses) },
        { Metric: 'Est. Gross Profit', Value: formatCurrency(metrics.grossProfit) },
        { Metric: 'Inventory Value', Value: formatCurrency(metrics.inventoryValue) },
        { Metric: 'Low + Out Stock SKUs', Value: metrics.lowStock + metrics.outStock },
        { Metric: 'Pending / Approved POs', Value: metrics.pendingPOs },
      ];
      report.metrics = report.rows.reduce((a, r) => ({ ...a, [r.Metric]: r.Value }), {});
      report.commentary = 'AI observation: Focus on stock-outs and pending procurement approvals.';
    }
    setGenerated(report);
    setLoading(false);
    showToast('Report generated');
  };

  const exportCSV = () => {
    if (!generated?.rows?.length) return;
    const keys = Object.keys(generated.rows[0]);
    const csv = [keys.join(','), ...generated.rows.map(r => keys.map(k => `"${r[k]}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${generated.type}-report.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded');
  };

  const forecastData = [
    ...MONTHLY_REVENUE,
    { month: 'Nov*', revenue: Math.round(MONTHLY_REVENUE.slice(-3).reduce((s, m) => s + m.revenue, 0) / 3) },
    { month: 'Dec*', revenue: Math.round((MONTHLY_REVENUE.slice(-2).reduce((s, m) => s + m.revenue, 0) + Math.round(MONTHLY_REVENUE.slice(-3).reduce((s, m) => s + m.revenue, 0) / 3)) / 3) },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-border shadow-card p-5">
        <h2 className="font-display font-semibold text-ink mb-1">Report Generator</h2>
        <p className="text-sm text-muted mb-4">Generate reports from the current demo dataset. AI commentary is clearly labelled.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={reportType} onChange={e => setReportType(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm">
            {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button onClick={generate} disabled={loading} className="bg-teal text-white font-medium px-5 py-2 rounded-lg hover:bg-teal/90 disabled:opacity-50 focus-ring flex items-center gap-2">
            {loading ? 'Generating…' : <><Icon name="file-text" size={16} /> Generate Report</>}
          </button>
        </div>
      </div>
      {generated && (
        <div className="bg-white rounded-xl border border-border shadow-card p-5" id="report-print">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">{generated.title}</h3>
              <p className="text-xs text-muted mt-1">Generated {generated.ts} · Nexora Industries (Demo)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="text-sm border border-border px-3 py-1.5 rounded-lg hover:bg-surface focus-ring flex items-center gap-1.5"><Icon name="download" size={14} /> CSV</button>
              <button onClick={() => window.print()} className="text-sm border border-border px-3 py-1.5 rounded-lg hover:bg-surface focus-ring flex items-center gap-1.5"><Icon name="printer" size={14} /> Print</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(generated.metrics).map(([k, v]) => (
              <div key={k} className="bg-surface rounded-lg px-3 py-2 border border-border">
                <div className="text-[10px] text-muted uppercase">{k}</div>
                <div className="font-semibold text-ink">{v}</div>
              </div>
            ))}
          </div>
          {generated.commentary && (
            <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mb-4 text-sm">
              <div className="text-xs font-semibold text-teal uppercase mb-1">AI Commentary (Demo Mode)</div>
              <p className="text-ink">{generated.commentary}</p>
            </div>
          )}
          {generated.rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted border-b border-border">
                    {Object.keys(generated.rows[0]).map(k => <th key={k} className="px-3 py-2 font-medium">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {generated.rows.map((r, i) => (
                    <tr key={i} className="border-b border-border/60">
                      {Object.values(r).map((v, j) => <td key={j} className="px-3 py-2">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <div className="bg-white rounded-xl border border-border shadow-card p-5">
        <h3 className="font-display font-semibold text-ink mb-1">Illustrative Demand Forecast</h3>
        <p className="text-xs text-muted mb-3">Simple moving-average estimate over sample monthly revenue (not a trained ML model).</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
            <Tooltip formatter={v => formatCurrency(v)} />
            <Line type="monotone" dataKey="revenue" stroke="#00BFA6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted mt-2">* Estimated values (3-month moving average). Historical months are actual sample data.</p>
      </div>
    </div>
  );
}

function Settings() {
  const { settings, setSettings, resetDemo, showToast } = useApp();
  const [testingKey, setTestingKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [showKey, setShowKey] = useState(false);

  const testApiKey = async () => {
    const key = (settings.geminiApiKey || '').trim();
    if (!key) {
      showToast('Please enter a Gemini API key first', 'warning');
      return;
    }
    setTestingKey(true);
    setTestStatus(null);
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.geminiModel || 'gemini-1.5-flash'}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Respond with: OK' }] }] })
      });
      if (resp.ok) {
        setTestStatus('success');
        showToast('Gemini API key verified successfully!');
      } else {
        const err = await resp.text();
        setTestStatus('error');
        showToast(`Verification failed (${resp.status}): ${err.slice(0, 100)}`, 'error');
      }
    } catch (e) {
      setTestStatus('error');
      showToast('Verification failed: Network error or CORS issue', 'error');
    }
    setTestingKey(false);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
        <h2 className="font-display font-semibold text-ink text-lg">System Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted">Demo Company Name</label>
            <input value={settings.company} onChange={e => setSettings(s => ({ ...s, company: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Currency</label>
            <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm">
              <option value="INR">INR (₹) — Indian Rupee (Default)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">AI Copilot Engine</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, aiMode: 'demo' }))}
              className={`p-4 rounded-xl border text-left transition focus-ring ${settings.aiMode === 'demo' ? 'border-teal bg-teal/5 ring-1 ring-teal' : 'border-border hover:bg-surface'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-ink flex items-center gap-1.5">
                  <Icon name="flask-conical" size={16} className={settings.aiMode === 'demo' ? 'text-teal' : 'text-muted'} /> Deterministic Demo Engine
                </span>
                {settings.aiMode === 'demo' && <span className="w-2 h-2 rounded-full bg-teal" />}
              </div>
              <p className="text-xs text-muted">Instant, rule-grounded responses without requiring any API keys or network latency.</p>
            </button>

            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, aiMode: 'gemini' }))}
              className={`p-4 rounded-xl border text-left transition focus-ring ${settings.aiMode === 'gemini' ? 'border-teal bg-teal/5 ring-1 ring-teal' : 'border-border hover:bg-surface'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-ink flex items-center gap-1.5">
                  <Icon name="sparkles" size={16} className={settings.aiMode === 'gemini' ? 'text-teal' : 'text-muted'} /> Google Gemini Generative AI
                </span>
                {settings.aiMode === 'gemini' && <span className="w-2 h-2 rounded-full bg-teal" />}
              </div>
              <p className="text-xs text-muted">Real live generative LLM synthesis with full ERP metrics and inventory schema context.</p>
            </button>
          </div>

          {settings.aiMode === 'gemini' && (
            <div className="bg-surface/80 rounded-xl p-4 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-ink">Google Gemini API Key</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-teal hover:underline flex items-center gap-1">
                  Get a free key at Google AI Studio <Icon name="external-link" size={12} />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.geminiApiKey || ''}
                  onChange={e => { setTestStatus(null); setSettings(s => ({ ...s, geminiApiKey: e.target.value })); }}
                  placeholder="AIzaSy... (Paste your Google Gemini API key here)"
                  className="w-full pr-10 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Icon name={showKey ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Model Selection</label>
                  <select
                    value={settings.geminiModel || 'gemini-2.0-flash'}
                    onChange={e => setSettings(s => ({ ...s, geminiModel: e.target.value }))}
                    className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended — fastest & free tier)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep enterprise reasoning)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={testApiKey}
                    disabled={testingKey || !settings.geminiApiKey}
                    className="w-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-semibold text-sm py-2 px-3 rounded-xl focus-ring flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-sm"
                  >
                    {testingKey ? <Icon name="loader-2" size={14} className="animate-spin text-indigo-600" /> : <Icon name="check-circle" size={14} className="text-emerald-500" />}
                    {testingKey ? 'Verifying with Google…' : 'Test API Connection'}
                  </button>
                </div>
              </div>

              {testStatus === 'success' && (
                <div className="text-xs text-success flex items-center gap-1.5 pt-1">
                  <Icon name="check-circle" size={14} /> Connection verified! Copilot will now call Gemini live with ERP context.
                </div>
              )}
              {testStatus === 'error' && (
                <div className="text-xs text-danger flex items-center gap-1.5 pt-1">
                  <Icon name="alert-circle" size={14} /> Connection test failed. Check your API key.
                </div>
              )}
              <p className="text-[11px] text-muted">
                Note: Your key is saved strictly in your local browser storage and dispatched directly to Google's API from your browser.
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-ink">Restore Factory Sample Data</div>
            <div className="text-xs text-muted">Reset all products, POs, sales orders, and financials to original demo defaults.</div>
          </div>
          <button
            onClick={() => { if (confirm('Reset all demo data to the original sample dataset? This cannot be undone.')) resetDemo(); }}
            className="text-sm text-danger border border-danger/30 hover:bg-red-50 px-4 py-2 rounded-lg focus-ring font-medium"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-2 text-sm">
        <h3 className="font-display font-semibold text-ink">About this prototype</h3>
        <p className="text-muted leading-relaxed">
          <strong className="text-ink">NEXERP AI</strong> is a prototype exploring how generative AI transforms enterprise ERP workflows —
          featuring natural-language data extraction, inventory reorder recommendations, and multi-module operational intelligence for Nexora Industries.
        </p>
        <p className="text-muted leading-relaxed">
          Project: <em>AI-Driven ERP Systems Using Generative AI Models</em>. Data changes persist in browser localStorage until reset.
        </p>
      </div>
    </div>
  );
}

function App() {
  const { page, mobileNav, setMobileNav } = useApp();
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      {mobileNav && (
        <>
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileNav(false)} />
          <div className="md:hidden mobile-drawer open fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-navy text-white">
            <Sidebar mobile />
          </div>
        </>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {page === 'dashboard' && <Dashboard />}
          {page === 'ai' && <AIAssistant />}
          {page === 'inventory' && <Inventory />}
          {page === 'procurement' && <Procurement />}
          {page === 'sales' && <Sales />}
          {page === 'finance' && <Finance />}
          {page === 'reports' && <Reports />}
          {page === 'settings' && <Settings />}
        </main>
      </div>
      <Toast />
    </div>
  );
}

function Root() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

export default function Application() {
  return <Root />;
}
