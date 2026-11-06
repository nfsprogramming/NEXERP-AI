import type { Product, PurchaseOrder, StockStatus } from '../types'

export const STORAGE_KEY = 'nexerp_ai_demo_v1'

export function stockStatus(stock: number, reorder: number): StockStatus {
  if (stock <= 0) return 'out'
  if (stock <= reorder) return 'low'
  return 'ok'
}

export function formatCurrency(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatNum(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function poTotal(po: PurchaseOrder): number {
  return po.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
}

export function invValue(products: Product[]): number {
  return products.reduce((s, p) => s + p.stock * p.unitPrice, 0)
}
