import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import type { StockStatus } from '../types'

export function Toast({ toast }: { toast: { msg: string; type: string } | null }) {
  if (!toast) return null
  const bg = toast.type === 'error' ? 'bg-danger' : toast.type === 'warning' ? 'bg-warning' : 'bg-success'
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm`}>
      {toast.msg}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface focus-ring" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ok: 'bg-green-100 text-success',
    low: 'bg-amber-100 text-warning',
    out: 'bg-red-100 text-danger',
    'In Stock': 'bg-green-100 text-success',
    'Low Stock': 'bg-amber-100 text-warning',
    'Out of Stock': 'bg-red-100 text-danger',
    Draft: 'bg-slate-100 text-muted',
    'Pending Approval': 'bg-amber-100 text-warning',
    Approved: 'bg-blue-100 text-blue-700',
    Received: 'bg-green-100 text-success',
    Cancelled: 'bg-red-100 text-danger',
    Completed: 'bg-green-100 text-success',
    Shipped: 'bg-blue-100 text-blue-700',
    Processing: 'bg-amber-100 text-warning',
    Pending: 'bg-slate-100 text-muted',
    Income: 'bg-green-100 text-success',
    Expense: 'bg-red-100 text-danger',
  }
  const label =
    status === 'ok' ? 'In Stock' : status === 'low' ? 'Low Stock' : status === 'out' ? 'Out of Stock' : status
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map[label] || 'bg-slate-100 text-muted'}`}>
      {label}
    </span>
  )
}

export function KPI({
  title,
  value,
  sub,
  icon: IconComp,
}: {
  title: string
  value: string | number
  sub?: string
  icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
          <IconComp size={16} />
        </div>
      </div>
      <div className="font-display text-2xl font-semibold text-ink">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}

export function stockLabel(s: StockStatus): string {
  return s === 'ok' ? 'In Stock' : s === 'low' ? 'Low Stock' : 'Out of Stock'
}
