'use client'

import { useState } from 'react'
import NumberFlow from '@number-flow/react'
import { motion, AnimatePresence } from 'motion/react'
import { ParentSize } from '@visx/responsive'
import { AreaClosed, LinePath } from '@visx/shape'
import { scaleLinear, scalePoint } from '@visx/scale'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'
import { AxisBottom } from '@visx/axis'
import { GridRows } from '@visx/grid'
// ── Radix UI ─────────────────────────────────────────────────────────
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as PopoverPrimitive from '@radix-ui/react-popover'
// ── Lucide icons ──────────────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react'
import {
  Home, Users, Bot, Zap, CreditCard, FileText, Files, DollarSign,
  TrendingUp, FlaskConical, Sparkles, Monitor, LayoutGrid, CircleUser,
  Key, RefreshCw, AlertTriangle, Bell, Settings, PanelLeft, Plus,
  ArrowRight, MoreHorizontal, CheckCircle2, ChevronDown, ChevronLeft,
  Search, X, LogOut, Building2, Download, Eye, Check, Trash2,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

type NavItem = { label: string; icon: LucideIcon }
type NavGroup = { title: string; collapsible: boolean; items: NavItem[] }
type RevenuePoint = { month: string; value: number }

// ─────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'General',
    collapsible: false,
    items: [
      { label: 'Home', icon: Home },
      { label: 'Customers', icon: Users },
      { label: 'AI Products', icon: Bot },
      { label: 'Metric Events', icon: Zap },
      { label: 'Subscriptions', icon: CreditCard },
      { label: 'Invoices', icon: FileText },
      { label: 'Contracts', icon: Files },
      { label: 'Cost Management', icon: DollarSign },
      { label: 'Margins', icon: TrendingUp },
      { label: 'Simulations', icon: FlaskConical },
      { label: 'Revenue Intel', icon: Sparkles },
    ],
  },
  {
    title: 'Developer Zone',
    collapsible: true,
    items: [
      { label: 'Getting Started', icon: Monitor },
      { label: 'Components', icon: LayoutGrid },
      { label: 'Customer Portal', icon: CircleUser },
      { label: 'API Keys', icon: Key },
    ],
  },
]

const SETTINGS_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Organization', icon: Settings },
      { label: 'Billing', icon: CreditCard },
      { label: 'Team', icon: Users },
      { label: 'Integrations', icon: LayoutGrid },
      { label: 'Preferences', icon: Sparkles },
    ],
  },
  {
    title: 'Developer',
    items: [
      { label: 'API Keys', icon: Key },
      { label: 'Customer Portal', icon: CircleUser },
      { label: 'Components', icon: Monitor },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: CircleUser },
      { label: 'Notifications', icon: Bell },
    ],
  },
]

const KPI_TOP = [
  { label: 'MRR', value: 4820, prefix: '$', sub: '18 active subscriptions', trend: '+12.4%', up: true as boolean | null, icon: RefreshCw, tip: 'Monthly Recurring Revenue' },
  { label: 'Total Revenue', value: 15340, prefix: '$', sub: 'All time', trend: '+47.8%', up: true as boolean | null, icon: DollarSign, tip: 'All-time collected revenue' },
  { label: 'Active Customers', value: 24, prefix: '', sub: '4 total segments', trend: '+3 this month', up: true as boolean | null, icon: Users, tip: 'Customers with active subscriptions' },
  { label: 'Overdue', value: 0, prefix: '$', sub: '0 invoices', trend: null as string | null, up: null as boolean | null, icon: AlertTriangle, tip: 'Outstanding unpaid invoices' },
]

const KPI_BOTTOM = [
  { label: 'ARPU', value: 379 as number | null, prefix: '$', display: null as string | null, sub: 'Avg revenue per user' },
  { label: 'Churn Rate', value: null as number | null, prefix: '', display: '0.0%', sub: 'Inactive customers' },
  { label: 'Quick Ratio', value: null as number | null, prefix: '', display: 'N/A', sub: 'Growth efficiency' },
  { label: 'ARR', value: 57840 as number | null, prefix: '$', display: null as string | null, sub: 'Annual recurring' },
]

const REVENUE_DATA: RevenuePoint[] = [
  { month: 'Aug', value: 3200 },
  { month: 'Sep', value: 3800 },
  { month: 'Oct', value: 3400 },
  { month: 'Nov', value: 4100 },
  { month: 'Dec', value: 3900 },
  { month: 'Jan', value: 4500 },
  { month: 'Feb', value: 4820 },
]

const EVENTS_DATA: RevenuePoint[] = [
  { month: 'Aug', value: 8400 },
  { month: 'Sep', value: 12100 },
  { month: 'Oct', value: 9800 },
  { month: 'Nov', value: 15600 },
  { month: 'Dec', value: 18200 },
  { month: 'Jan', value: 22400 },
  { month: 'Feb', value: 27800 },
]

const RECENT_INVOICES = [
  { id: 'INV-001', customer: 'Acme Corp', amount: '$1,240', status: 'paid', date: 'Feb 20' },
  { id: 'INV-002', customer: 'TechFlow AI', amount: '$890', status: 'paid', date: 'Feb 18' },
  { id: 'INV-003', customer: 'DataSync Labs', amount: '$2,100', status: 'issued', date: 'Feb 15' },
  { id: 'INV-004', customer: 'NeuralBase', amount: '$450', status: 'paid', date: 'Feb 12' },
  { id: 'INV-005', customer: 'Cognify Inc', amount: '$3,200', status: 'issued', date: 'Feb 10' },
]

const ACTIVITY = [
  { text: 'TechFlow AI upgraded to Pro', time: '2h ago', color: 'bg-blue-400' },
  { text: 'Invoice #INV-001 paid — $1,240', time: '4h ago', color: 'bg-emerald-400' },
  { text: 'New customer: NeuralBase onboarded', time: '1d ago', color: 'bg-violet-400' },
  { text: '12.4K metric events processed', time: '1d ago', color: 'bg-amber-400' },
  { text: 'Invoice #INV-003 sent to DataSync Labs', time: '2d ago', color: 'bg-emerald-400' },
]

// ─────────────────────────────────────────────────────────────────────
// RADIX: TOOLTIP wrapper
// ─────────────────────────────────────────────────────────────────────

function Tip({
  children,
  content,
  side = 'bottom',
}: {
  children: React.ReactNode
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}) {
  return (
    <TooltipPrimitive.Root delayDuration={400}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={5}
          className="z-[9999] select-none rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

// ─────────────────────────────────────────────────────────────────────
// RADIX: DROPDOWN MENU helpers
// ─────────────────────────────────────────────────────────────────────

function DropMenu({
  trigger,
  children,
  align = 'end',
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          className="z-[9999] min-w-[180px] rounded-xl border border-gray-200 bg-white py-1 shadow-xl outline-none"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

function MenuItem({
  icon: Icon,
  label,
  danger,
}: {
  icon: LucideIcon
  label: string
  danger?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={`mx-1 flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-[12px] outline-none transition-colors ${
        danger
          ? 'text-red-600 focus:bg-red-50 hover:bg-red-50'
          : 'text-gray-700 focus:bg-gray-100 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      {label}
    </DropdownMenuPrimitive.Item>
  )
}

function MenuSep() {
  return <DropdownMenuPrimitive.Separator className="mx-1 my-1 h-px bg-gray-100" />
}

// ─────────────────────────────────────────────────────────────────────
// RADIX: DIALOG — New Invoice
// ─────────────────────────────────────────────────────────────────────

function NewInvoiceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <DialogPrimitive.Title className="text-[16px] font-semibold text-gray-900">
                New Invoice
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-0.5 text-[12px] text-gray-500">
                Create and send an invoice to your customer
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600">
              <X className="w-4 h-4" strokeWidth={1.75} />
            </DialogPrimitive.Close>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                Customer
              </label>
              <input
                type="text"
                placeholder="Select or create customer"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 py-2 pl-7 pr-3 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                Description
              </label>
              <textarea
                placeholder="Invoice description (optional)"
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
            <DialogPrimitive.Close className="rounded-lg px-4 py-2 text-[12px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900">
              Cancel
            </DialogPrimitive.Close>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 rounded-lg bg-[#16a34a] px-4 py-2 text-[12px] font-medium text-white shadow-sm transition-colors hover:bg-[#15803d]"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2} />
              Create Invoice
            </motion.button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ─────────────────────────────────────────────────────────────────────
// RADIX: POPOVER — Notifications
// ─────────────────────────────────────────────────────────────────────

function NotificationsPopover() {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <Tip content="Notifications">
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600">
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </Tip>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-[9999] w-[300px] rounded-xl border border-gray-200 bg-white shadow-xl outline-none"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-[13px] font-semibold text-gray-900">Notifications</p>
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              All clear
            </span>
          </div>
          <div className="px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Bell className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-medium text-gray-700">No new notifications</p>
            <p className="mt-1 text-[11px] text-gray-400">You&apos;re all caught up!</p>
          </div>
          <PopoverPrimitive.Arrow className="fill-white" style={{ filter: 'drop-shadow(0 -1px 0 #e5e7eb)' }} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ─────────────────────────────────────────────────────────────────────
// VISX CHART — accepts data + color as props
// ─────────────────────────────────────────────────────────────────────

function RevenueChart({
  width,
  height,
  data,
  color = '#16a34a',
}: {
  width: number
  height: number
  data: RevenuePoint[]
  color?: string
}) {
  const [tooltip, setTooltip] = useState<{ point: RevenuePoint; x: number; y: number } | null>(null)

  const margin = { top: 10, right: 8, bottom: 28, left: 4 }
  const innerW = Math.max(0, width - margin.left - margin.right)
  const innerH = Math.max(0, height - margin.top - margin.bottom)

  const xScale = scalePoint<string>({
    domain: data.map(d => d.month),
    range: [0, innerW],
    padding: 0,
  })

  const yMin = Math.min(...data.map(d => d.value)) * 0.8
  const yMax = Math.max(...data.map(d => d.value)) * 1.1

  const yScale = scaleLinear<number>({
    domain: [yMin, yMax],
    range: [innerH, 0],
    nice: true,
  })

  const getX = (d: RevenuePoint) => xScale(d.month) ?? 0
  const getY = (d: RevenuePoint) => yScale(d.value)
  const gradId = `rev-grad-${color.replace('#', '')}`

  function onMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const step = innerW / (data.length - 1)
    const idx = Math.round(mouseX / step)
    const clamped = Math.max(0, Math.min(data.length - 1, idx))
    const point = data[clamped]
    setTooltip({
      point,
      x: margin.left + (xScale(point.month) ?? 0),
      y: margin.top + yScale(point.value),
    })
  }

  if (width < 10) return null

  return (
    <div className="relative select-none" style={{ width, height }}>
      <svg width={width} height={height}>
        <defs>
          <LinearGradient id={gradId} from={color} to={color} fromOpacity={0.14} toOpacity={0} vertical />
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridRows scale={yScale} width={innerW} numTicks={4} stroke="#f1f5f9" strokeWidth={1} />
          <AreaClosed<RevenuePoint>
            data={data}
            x={getX}
            y={getY}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={`url(#${gradId})`}
          />
          <LinePath<RevenuePoint>
            data={data}
            x={getX}
            y={getY}
            curve={curveMonotoneX}
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {tooltip && (
            <line
              x1={tooltip.x - margin.left}
              y1={0}
              x2={tooltip.x - margin.left}
              y2={innerH}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.4}
            />
          )}
          {data.map((d) => (
            <circle
              key={d.month}
              cx={getX(d)}
              cy={getY(d)}
              r={tooltip?.point.month === d.month ? 4.5 : 2.8}
              fill={tooltip?.point.month === d.month ? color : 'white'}
              stroke={color}
              strokeWidth={1.8}
              style={{ transition: 'r 80ms ease, fill 80ms ease' }}
            />
          ))}
          <AxisBottom
            top={innerH}
            scale={xScale}
            hideTicks
            hideAxisLine
            tickLabelProps={{ fontSize: 10, fill: '#9ca3af', textAnchor: 'middle' as const, fontFamily: 'system-ui' }}
          />
          <rect
            x={0} y={0} width={innerW} height={innerH}
            fill="transparent"
            onMouseMove={onMouseMove}
            onMouseLeave={() => setTooltip(null)}
          />
        </g>
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10"
          style={{ left: tooltip.x, top: tooltip.y - 48, transform: 'translateX(-50%)' }}
        >
          <div className="whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 shadow-xl text-white">
            <p className="text-[10px] text-gray-400 leading-none mb-0.5">{tooltip.point.month} 2025</p>
            <p className="text-[12px] font-bold leading-none">{tooltip.point.value.toLocaleString()}</p>
          </div>
          <div className="mx-auto h-2 w-px bg-gray-700/50" />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STABLE SIDEBAR COMPONENTS (module-level = never remounted)
// ─────────────────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-[#16a34a] flex items-center justify-center shrink-0">
        <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-gray-900 text-[13px] font-semibold leading-none tracking-tight">UnitPay</p>
        <p className="text-gray-400 text-[10px] mt-[3px] truncate">Linq App</p>
      </div>
      <DropMenu
        trigger={
          <button className="rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        }
        align="end"
      >
        <MenuItem icon={Building2} label="Workspace settings" />
        <MenuItem icon={Plus} label="New workspace" />
        <MenuSep />
        <MenuItem icon={ArrowRight} label="Switch workspace" />
      </DropMenu>
    </div>
  )
}

function SidebarUser() {
  return (
    <div className="px-3 py-3 border-t border-gray-100 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          A
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-700 text-[12px] font-medium leading-none truncate">Anshuman Atrey</p>
          <p className="text-gray-400 text-[10px] mt-[3px] truncate">anshuman@useunitpay.com</p>
        </div>
        <DropMenu
          trigger={
            <button className="rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          }
          align="end"
        >
          <MenuItem icon={CircleUser} label="Profile" />
          <MenuItem icon={Settings} label="Settings" />
          <MenuSep />
          <MenuItem icon={LogOut} label="Sign out" danger />
        </DropMenu>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────

export default function Variant1Home() {
  const [active, setActive] = useState('Home')
  const [sidebarMode, setSidebarMode] = useState<'main' | 'settings'>('main')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Developer Zone': false })
  const [settingsActive, setSettingsActive] = useState('Organization')
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  function toggleGroup(title: string) {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    // TooltipProvider must wrap everything for tooltips to work
    <TooltipPrimitive.Provider delayDuration={400}>
      <div
        className="flex h-screen overflow-hidden bg-[#f5f5f4]"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* New Invoice Dialog */}
        <NewInvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} />

        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════════════ */}
        <aside className="w-[220px] shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">

          <div className="flex-1 relative overflow-hidden">

            {/* ── Panel 1: Main nav ──────────────────────────────────── */}
            <div className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-300 ${
              sidebarMode === 'main'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}>
              <SidebarLogo />

              <div className="px-3 pt-2.5 pb-1">
                <div className="flex items-center gap-2 px-2.5 py-[7px] rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-xs cursor-text hover:bg-gray-100 transition-colors">
                  <Search className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">Go to...</span>
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-[2px] rounded font-mono">⌘K</span>
                </div>
              </div>

              <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-none space-y-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title}>
                    {group.collapsible ? (
                      <button
                        onClick={() => toggleGroup(group.title)}
                        className="w-full flex items-center justify-between px-2 mb-1 group"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 group-hover:text-gray-600 transition-colors">
                          {group.title}
                        </p>
                        <motion.div
                          animate={{ rotate: openGroups[group.title] ? 180 : 0 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
                        </motion.div>
                      </button>
                    ) : (
                      <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                        {group.title}
                      </p>
                    )}

                    <AnimatePresence initial={false}>
                      {(!group.collapsible || openGroups[group.title]) && (
                        <motion.div
                          initial={group.collapsible ? { height: 0, opacity: 0 } : false}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-px">
                            {group.items.map((item) => {
                              const isActive = active === item.label
                              const NavIcon = item.icon
                              return (
                                <button
                                  key={item.label}
                                  onClick={() => setActive(item.label)}
                                  className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                                    isActive
                                      ? 'bg-green-50 text-green-700 font-medium'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                >
                                  <NavIcon
                                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-green-700' : ''}`}
                                    strokeWidth={isActive ? 2 : 1.75}
                                  />
                                  <span className="truncate">{item.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* ── Panel 2: Settings nav ──────────────────────────────── */}
            <div className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-300 ${
              sidebarMode === 'settings'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}>
              <div className="flex items-center gap-2.5 px-3 py-3.5 border-b border-gray-100">
                <button
                  onClick={() => setSidebarMode('main')}
                  className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
                <p className="text-gray-900 text-[14px] font-semibold tracking-tight">Settings</p>
              </div>

              <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-none space-y-4">
                {SETTINGS_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                      {group.title}
                    </p>
                    <div className="space-y-px">
                      {group.items.map((item) => {
                        const isActive = settingsActive === item.label
                        const SettingsIcon = item.icon
                        return (
                          <button
                            key={item.label}
                            onClick={() => setSettingsActive(item.label)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                              isActive
                                ? 'bg-green-50 text-green-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <SettingsIcon
                              className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-green-700' : ''}`}
                              strokeWidth={isActive ? 2 : 1.75}
                            />
                            <span className="truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

          </div>

          <SidebarUser />
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top bar */}
          <header className="h-11 bg-white border-b border-gray-200/80 flex items-center px-5 gap-3 shrink-0">
            <Tip content="Toggle sidebar" side="bottom">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <PanelLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </Tip>
            <span className="text-[13px] font-medium text-gray-700">Home</span>
            <div className="ml-auto flex items-center gap-1">
              {/* Notifications — Radix Popover */}
              <NotificationsPopover />
              {/* Settings — Radix Tooltip */}
              <Tip content="Settings">
                <button
                  onClick={() => setSidebarMode(sidebarMode === 'settings' ? 'main' : 'settings')}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                    sidebarMode === 'settings'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  <Settings className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </Tip>
            </div>
          </header>

          {/* Scrollable body */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-4">

              {/* Greeting row */}
              <motion.div
                className="flex items-start justify-between"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
                    Good morning, Anshuman 👋
                  </h1>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Here&apos;s your UnitPay overview for today
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setInvoiceOpen(true)}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  New Invoice
                </motion.button>
              </motion.div>

              {/* ── KPI Row 1 — Radix Tooltip on each icon ── */}
              <div className="grid grid-cols-4 gap-3">
                {KPI_TOP.map((m, i) => {
                  const KpiIcon = m.icon
                  return (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                      whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(0,0,0,0.09)', transition: { duration: 0.15 } }}
                      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{m.label}</p>
                        <Tip content={m.tip} side="top">
                          <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 cursor-default">
                            <KpiIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </div>
                        </Tip>
                      </div>
                      <div className="text-[26px] font-bold text-gray-900 tabular-nums leading-none flex items-baseline gap-0.5">
                        {m.prefix && <span>{m.prefix}</span>}
                        <NumberFlow value={m.value} />
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {m.trend && (
                          <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                            m.up ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                          }`}>
                            {m.trend}
                          </span>
                        )}
                        <p className="text-[11px] text-gray-400">{m.sub}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* ── KPI Row 2 ── */}
              <div className="grid grid-cols-4 gap-3">
                {KPI_BOTTOM.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
                    whileHover={{ y: -1, boxShadow: '0 3px 14px rgba(0,0,0,0.07)', transition: { duration: 0.15 } }}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-3 cursor-pointer"
                  >
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">{m.label}</p>
                    <div className="text-[20px] font-bold text-gray-900 tabular-nums flex items-baseline gap-0.5">
                      {m.value !== null ? (
                        <>
                          {m.prefix && <span>{m.prefix}</span>}
                          <NumberFlow value={m.value} />
                        </>
                      ) : (
                        <span>{m.display}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{m.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Charts row — Radix Tabs for Revenue / Events toggle ── */}
              <div className="grid grid-cols-5 gap-3">

                <motion.div
                  className="col-span-3 bg-white rounded-xl border border-gray-200 p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <TabsPrimitive.Root defaultValue="revenue">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-[13px] font-semibold text-gray-900">Monthly Overview</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Aug 2025 – Feb 2026</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Radix tab list — pill style */}
                        <TabsPrimitive.List className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
                          <TabsPrimitive.Trigger
                            value="revenue"
                            className="rounded-md px-2.5 py-1 text-[11px] font-medium text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                          >
                            Revenue
                          </TabsPrimitive.Trigger>
                          <TabsPrimitive.Trigger
                            value="events"
                            className="rounded-md px-2.5 py-1 text-[11px] font-medium text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                          >
                            Events
                          </TabsPrimitive.Trigger>
                        </TabsPrimitive.List>
                      </div>
                    </div>

                    <TabsPrimitive.Content value="revenue">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          +12.4% MoM
                        </span>
                        <span className="text-[11px] font-bold text-gray-900 tabular-nums">$4,820</span>
                      </div>
                      <div style={{ height: 130 }}>
                        <ParentSize debounceTime={0}>
                          {({ width, height }) => (
                            <RevenueChart width={width} height={height} data={REVENUE_DATA} color="#16a34a" />
                          )}
                        </ParentSize>
                      </div>
                    </TabsPrimitive.Content>

                    <TabsPrimitive.Content value="events">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          +24.1% MoM
                        </span>
                        <span className="text-[11px] font-bold text-gray-900 tabular-nums">27.8K events</span>
                      </div>
                      <div style={{ height: 130 }}>
                        <ParentSize debounceTime={0}>
                          {({ width, height }) => (
                            <RevenueChart width={width} height={height} data={EVENTS_DATA} color="#6366f1" />
                          )}
                        </ParentSize>
                      </div>
                    </TabsPrimitive.Content>
                  </TabsPrimitive.Root>
                </motion.div>

                {/* Invoice status */}
                <motion.div
                  className="col-span-2 bg-white rounded-xl border border-gray-200 p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-semibold text-gray-900">Invoices</h3>
                    <button className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5 transition-colors">
                      View all <ArrowRight className="w-3 h-3 mt-px" strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="rounded-lg bg-gray-50 px-3.5 py-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Collected</p>
                        <p className="text-[22px] font-bold text-gray-900 tabular-nums mt-0.5">$2,580</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">3 paid invoices</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[28px] font-bold text-[#16a34a] tabular-nums leading-none">92%</p>
                        <p className="text-[10px] text-gray-400 mt-1">collection rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {[
                      { label: 'Paid', count: 3, amount: '$2,580', color: 'bg-emerald-500' },
                      { label: 'Issued', count: 2, amount: '$5,300', color: 'bg-amber-400' },
                      { label: 'Overdue', count: 0, amount: '$0', color: 'bg-gray-200' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${row.color} shrink-0`} />
                        <span className="text-[12px] text-gray-600 flex-1">{row.label}</span>
                        <span className="text-[11px] text-gray-400 w-4 text-center">{row.count}</span>
                        <span className="text-[12px] font-semibold text-gray-900 tabular-nums w-14 text-right">{row.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-px">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-l-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '33%' }}
                      transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.div
                      className="h-full bg-amber-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '54%' }}
                      transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* ── Bottom row ── */}
              <div className="grid grid-cols-5 gap-3 pb-6">

                {/* Recent invoices — DropdownMenu on each row */}
                <motion.div
                  className="col-span-3 bg-white rounded-xl border border-gray-200 p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-semibold text-gray-900">Recent Invoices</h3>
                    <button className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5 transition-colors">
                      View all <ArrowRight className="w-3 h-3 mt-px" strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="grid grid-cols-[1.2fr_1.4fr_1fr_1.2fr_1.5rem] pb-1.5 border-b border-gray-100 gap-2">
                    {['Invoice', 'Customer', 'Amount', 'Status'].map((h) => (
                      <p key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                    ))}
                    <span />
                  </div>

                  {RECENT_INVOICES.map((inv, i) => (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.42 + i * 0.06, duration: 0.22 }}
                      className="group grid grid-cols-[1.2fr_1.4fr_1fr_1.2fr_1.5rem] gap-2 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors rounded-sm -mx-1 px-1 cursor-pointer items-center"
                    >
                      <div>
                        <p className="text-[12px] font-mono font-medium text-gray-800">{inv.id}</p>
                        <p className="text-[10px] text-gray-400">{inv.date}</p>
                      </div>
                      <p className="text-[12px] text-gray-700">{inv.customer}</p>
                      <p className="text-[12px] font-semibold text-gray-900 tabular-nums">{inv.amount}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                        inv.status === 'paid'
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}>
                        {inv.status === 'paid' && <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2} />}
                        {inv.status}
                      </span>
                      {/* Row action dropdown */}
                      <DropMenu
                        trigger={
                          <button className="flex h-5 w-5 items-center justify-center rounded-md text-gray-400 opacity-0 transition-all hover:bg-gray-200 group-hover:opacity-100">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        }
                        align="end"
                      >
                        <MenuItem icon={Eye} label="View invoice" />
                        <MenuItem icon={Download} label="Download PDF" />
                        {inv.status === 'issued' && <MenuItem icon={Check} label="Mark as paid" />}
                        <MenuSep />
                        <MenuItem icon={Trash2} label="Delete" danger />
                      </DropMenu>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Right col */}
                <div className="col-span-2 space-y-3">

                  <motion.div
                    className="bg-white rounded-xl border border-gray-200 p-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'New Invoice', icon: FileText, bg: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100', action: () => setInvoiceOpen(true) },
                        { label: 'Add Customer', icon: Users, bg: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-100', action: undefined },
                        { label: 'New Product', icon: Bot, bg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100', action: undefined },
                        { label: 'API Keys', icon: Key, bg: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100', action: undefined },
                      ].map((action) => {
                        const ActionIcon = action.icon
                        return (
                          <motion.button
                            key={action.label}
                            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                            whileTap={{ scale: 0.97 }}
                            onClick={action.action}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${action.bg}`}
                          >
                            <ActionIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                            {action.label}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl border border-gray-200 p-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {ACTIVITY.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.52 + i * 0.06, duration: 0.2 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0 mt-[5px]`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-gray-700 leading-snug">{item.text}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}
