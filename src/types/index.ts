export interface Product {
  id: string
  name: string
  category: string
  stock: number
  reorderLevel: number
  unitPrice: number
}

export interface Supplier {
  id: string
  name: string
  contact?: string
}

export interface POItem {
  productId: string
  qty: number
  unitPrice: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  orderDate: string
  expectedDate: string
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Received' | 'Cancelled'
  items: POItem[]
  received: boolean
}

export interface SalesItem {
  productId: string
  qty: number
  unitPrice: number
}

export interface SalesOrder {
  id: string
  date: string
  customer: string
  items: SalesItem[]
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed'
  total: number
}

export interface FinanceEntry {
  id: string
  date: string
  description: string
  category: string
  type: 'Income' | 'Expense'
  amount: number
}

export interface Settings {
  company: string
  currency: string
  aiMode: 'demo' | 'gemini'
  geminiApiKey?: string
  geminiModel?: string
}

export interface Metrics {
  totalRevenue: number
  totalOrders: number
  inventoryValue: number
  pendingPOs: number
  lowStock: number
  outStock: number
  income: number
  expenses: number
  grossProfit: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content?: string
  answer?: string
  findings?: string[]
  figures?: Record<string, string | number>
  recommendations?: string[]
  actions?: { label: string; page: string; followUp?: string }[]
  modelUsed?: string
}

export interface Activity {
  id: number
  text: string
  type: string
  time: string
}

export type PageId =
  | 'dashboard'
  | 'ai'
  | 'inventory'
  | 'procurement'
  | 'sales'
  | 'finance'
  | 'reports'
  | 'settings'

export type StockStatus = 'ok' | 'low' | 'out'
