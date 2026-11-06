import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type {
  Product, PurchaseOrder, SalesOrder, FinanceEntry, Settings, Metrics, ChatMessage, PageId, Supplier,
} from '../types'
import {
  INITIAL_PRODUCTS, INITIAL_SUPPLIERS, INITIAL_POS, INITIAL_SALES, INITIAL_FINANCE,
  MONTHLY_REVENUE, ACTIVITIES,
} from '../data/initialData'
import { STORAGE_KEY, stockStatus, invValue } from '../utils/helpers'

interface AppState {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  purchaseOrders: PurchaseOrder[]
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>
  salesOrders: SalesOrder[]
  setSalesOrders: React.Dispatch<React.SetStateAction<SalesOrder[]>>
  finance: FinanceEntry[]
  setFinance: React.Dispatch<React.SetStateAction<FinanceEntry[]>>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  page: PageId
  setPage: (p: PageId) => void
  mobileNav: boolean
  setMobileNav: (v: boolean) => void
  toast: { msg: string; type: string } | null
  showToast: (msg: string, type?: string) => void
  chatMessages: ChatMessage[]
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  chatLoading: boolean
  setChatLoading: (v: boolean) => void
  metrics: Metrics
  resetDemo: () => void
  suppliers: Supplier[]
  monthlyRevenue: typeof MONTHLY_REVENUE
  activities: typeof ACTIVITIES
}

const AppContext = createContext<AppState | null>(null)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.products?.length) return p
    }
  } catch { /* ignore */ }
  return null
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = loadState()
  const [products, setProducts] = useState<Product[]>(initial?.products || INITIAL_PRODUCTS)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initial?.purchaseOrders || INITIAL_POS)
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initial?.salesOrders || INITIAL_SALES)
  const [finance, setFinance] = useState<FinanceEntry[]>(initial?.finance || INITIAL_FINANCE)
  const [settings, setSettings] = useState<Settings>(() => {
    const s = initial?.settings
    return {
      company: s?.company || 'Nexora Industries',
      currency: (!s?.currency || s?.currency === 'USD') ? 'INR' : s.currency,
      aiMode: s?.aiMode || 'demo'
    }
  })
  const [page, setPage] = useState<PageId>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, purchaseOrders, salesOrders, finance, settings }))
    } catch { /* ignore */ }
  }, [products, purchaseOrders, salesOrders, finance, settings])

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const resetDemo = () => {
    setProducts(INITIAL_PRODUCTS.map((p) => ({ ...p })))
    setPurchaseOrders(INITIAL_POS.map((p) => ({ ...p, items: p.items.map((i) => ({ ...i })) })))
    setSalesOrders(INITIAL_SALES.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) })))
    setFinance(INITIAL_FINANCE.map((f) => ({ ...f })))
    setChatMessages([])
    showToast('Demo data restored')
  }

  const metrics = useMemo<Metrics>(() => {
    const totalRevenue = salesOrders
      .filter((s: SalesOrder) => s.status === 'Completed' || s.status === 'Shipped')
      .reduce((s: number, o: SalesOrder) => s + o.total, 0)
    const income = finance.filter((f: FinanceEntry) => f.type === 'Income').reduce((s: number, f: FinanceEntry) => s + f.amount, 0)
    const expenses = finance.filter((f: FinanceEntry) => f.type === 'Expense').reduce((s: number, f: FinanceEntry) => s + f.amount, 0)
    return {
      totalRevenue,
      totalOrders: salesOrders.length,
      inventoryValue: invValue(products),
      pendingPOs: purchaseOrders.filter((p: PurchaseOrder) => p.status === 'Pending Approval' || p.status === 'Approved').length,
      lowStock: products.filter((p: Product) => stockStatus(p.stock, p.reorderLevel) === 'low').length,
      outStock: products.filter((p: Product) => stockStatus(p.stock, p.reorderLevel) === 'out').length,
      income,
      expenses,
      grossProfit: income - expenses,
    }
  }, [products, purchaseOrders, salesOrders, finance])

  const value: AppState = {
    products, setProducts, purchaseOrders, setPurchaseOrders, salesOrders, setSalesOrders,
    finance, setFinance, settings, setSettings, page, setPage, mobileNav, setMobileNav,
    toast, showToast, chatMessages, setChatMessages, chatLoading, setChatLoading,
    metrics, resetDemo, suppliers: INITIAL_SUPPLIERS, monthlyRevenue: MONTHLY_REVENUE, activities: ACTIVITIES,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
