'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import NumberFlow from '@number-flow/react'
import { ParentSize } from '@visx/responsive'
import { AreaClosed, LinePath } from '@visx/shape'
import { scaleLinear, scalePoint } from '@visx/scale'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'
import { AxisBottom } from '@visx/axis'
import { GridRows } from '@visx/grid'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Users, Bot, Zap, CreditCard, FileText, Files, DollarSign,
  TrendingUp, FlaskConical, Sparkles, Monitor, LayoutGrid, CircleUser,
  Key, Bell, Settings, PanelLeft, Plus, ArrowRight, MoreHorizontal,
  ChevronDown, ChevronLeft, Search, LogOut, Building2, RefreshCw,
  AlertTriangle, X, Eye, Trash2, Download, Mail, Phone, Globe,
  CheckCircle2, Clock, ArrowUpRight, Activity, Receipt, Package,
  Calendar, Layers, BarChart3, ExternalLink,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

type NavItem = { label: string; icon: LucideIcon }
type NavGroup = { title: string; collapsible: boolean; items: NavItem[] }
type UsagePoint = { month: string; value: number }

type Customer = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  website: string
  plan: 'Starter' | 'Growth' | 'Enterprise'
  mrr: number
  totalPaid: number
  status: 'active' | 'inactive' | 'trial'
  joined: string
  usage: number
  avatar: string
  location: string
}

type Invoice = {
  id: string
  amount: string
  status: 'paid' | 'issued' | 'overdue' | 'void'
  date: string
  period: string
}

type UsageMetric = {
  name: string
  events: number
  unitPrice: string
  subtotal: string
}

type TimelineEvent = {
  text: string
  time: string
  color: string
  icon: LucideIcon
}

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

const CUSTOMERS_DB: Record<string, Customer> = {
  '1': {
    id: '1', name: 'Alex Chen', company: 'Acme Corp', email: 'alex@acmecorp.ai',
    phone: '+1 (415) 555-0182', website: 'acmecorp.ai', plan: 'Enterprise',
    mrr: 2400, totalPaid: 14400, status: 'active', joined: 'Oct 12, 2024',
    usage: 87, avatar: 'AC', location: 'San Francisco, CA',
  },
  '2': {
    id: '2', name: 'Sarah Kim', company: 'TechFlow AI', email: 'sarah@techflow.ai',
    phone: '+1 (628) 555-0147', website: 'techflow.ai', plan: 'Growth',
    mrr: 890, totalPaid: 3560, status: 'active', joined: 'Nov 3, 2024',
    usage: 62, avatar: 'TF', location: 'Austin, TX',
  },
  '3': {
    id: '3', name: 'Marcus Webb', company: 'DataSync Labs', email: 'marcus@datasynclabs.io',
    phone: '+1 (312) 555-0293', website: 'datasynclabs.io', plan: 'Growth',
    mrr: 1100, totalPaid: 0, status: 'trial', joined: 'Jan 28, 2025',
    usage: 34, avatar: 'DS', location: 'Chicago, IL',
  },
  '4': {
    id: '4', name: 'Priya Patel', company: 'NeuralBase', email: 'priya@neuralbase.dev',
    phone: '+1 (212) 555-0374', website: 'neuralbase.dev', plan: 'Starter',
    mrr: 299, totalPaid: 897, status: 'active', joined: 'Dec 15, 2024',
    usage: 91, avatar: 'NB', location: 'New York, NY',
  },
  '5': {
    id: '5', name: 'Jordan Lee', company: 'Cognify Inc', email: 'jordan@cognify.ai',
    phone: '+1 (650) 555-0418', website: 'cognify.ai', plan: 'Enterprise',
    mrr: 3200, totalPaid: 19200, status: 'inactive', joined: 'Sep 5, 2024',
    usage: 0, avatar: 'CI', location: 'Palo Alto, CA',
  },
}

const USAGE_DATA: Record<string, UsagePoint[]> = {
  '1': [
    { month: 'Aug', value: 12400 }, { month: 'Sep', value: 18200 }, { month: 'Oct', value: 15800 },
    { month: 'Nov', value: 22100 }, { month: 'Dec', value: 24600 }, { month: 'Jan', value: 28900 }, { month: 'Feb', value: 31200 },
  ],
  '2': [
    { month: 'Aug', value: 3200 }, { month: 'Sep', value: 5400 }, { month: 'Oct', value: 4800 },
    { month: 'Nov', value: 7100 }, { month: 'Dec', value: 8200 }, { month: 'Jan', value: 9400 }, { month: 'Feb', value: 11600 },
  ],
  '3': [
    { month: 'Aug', value: 0 }, { month: 'Sep', value: 0 }, { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 }, { month: 'Dec', value: 0 }, { month: 'Jan', value: 1200 }, { month: 'Feb', value: 4800 },
  ],
  '4': [
    { month: 'Aug', value: 1800 }, { month: 'Sep', value: 2100 }, { month: 'Oct', value: 1900 },
    { month: 'Nov', value: 2800 }, { month: 'Dec', value: 3100 }, { month: 'Jan', value: 3600 }, { month: 'Feb', value: 4200 },
  ],
  '5': [
    { month: 'Aug', value: 28000 }, { month: 'Sep', value: 31000 }, { month: 'Oct', value: 26000 },
    { month: 'Nov', value: 18000 }, { month: 'Dec', value: 9000 }, { month: 'Jan', value: 2000 }, { month: 'Feb', value: 0 },
  ],
}

const USAGE_METRICS: Record<string, UsageMetric[]> = {
  '1': [
    { name: 'LLM API Calls', events: 142840, unitPrice: '$0.012', subtotal: '$1,714.08' },
    { name: 'Embeddings', events: 38200, unitPrice: '$0.008', subtotal: '$305.60' },
    { name: 'Image Generation', events: 1820, unitPrice: '$0.042', subtotal: '$76.44' },
    { name: 'Storage (GB)', events: 124, unitPrice: '$0.025', subtotal: '$3.10' },
  ],
  '2': [
    { name: 'LLM API Calls', events: 64200, unitPrice: '$0.012', subtotal: '$770.40' },
    { name: 'Embeddings', events: 12800, unitPrice: '$0.008', subtotal: '$102.40' },
    { name: 'Function Calls', events: 8400, unitPrice: '$0.002', subtotal: '$16.80' },
  ],
  '3': [
    { name: 'LLM API Calls', events: 18400, unitPrice: '$0.012', subtotal: '$220.80' },
    { name: 'Embeddings', events: 4200, unitPrice: '$0.008', subtotal: '$33.60' },
  ],
  '4': [
    { name: 'LLM API Calls', events: 22100, unitPrice: '$0.010', subtotal: '$221.00' },
    { name: 'Embeddings', events: 6200, unitPrice: '$0.008', subtotal: '$49.60' },
    { name: 'Storage (GB)', events: 18, unitPrice: '$0.025', subtotal: '$0.45' },
  ],
  '5': [],
}

const INVOICES: Record<string, Invoice[]> = {
  '1': [
    { id: 'INV-0048', amount: '$2,400.00', status: 'paid', date: 'Feb 1, 2025', period: 'Jan 2025' },
    { id: 'INV-0041', amount: '$2,400.00', status: 'paid', date: 'Jan 1, 2025', period: 'Dec 2024' },
    { id: 'INV-0034', amount: '$2,100.00', status: 'paid', date: 'Dec 1, 2024', period: 'Nov 2024' },
    { id: 'INV-0026', amount: '$1,980.00', status: 'paid', date: 'Nov 1, 2024', period: 'Oct 2024' },
    { id: 'INV-0019', amount: '$1,800.00', status: 'paid', date: 'Oct 1, 2024', period: 'Sep 2024' },
  ],
  '2': [
    { id: 'INV-0050', amount: '$890.00', status: 'issued', date: 'Feb 1, 2025', period: 'Jan 2025' },
    { id: 'INV-0043', amount: '$890.00', status: 'paid', date: 'Jan 1, 2025', period: 'Dec 2024' },
    { id: 'INV-0036', amount: '$820.00', status: 'paid', date: 'Dec 1, 2024', period: 'Nov 2024' },
    { id: 'INV-0029', amount: '$960.00', status: 'paid', date: 'Nov 1, 2024', period: 'Oct 2024' },
  ],
  '3': [
    { id: 'INV-0052', amount: '$0.00', status: 'void', date: 'Feb 1, 2025', period: 'Trial — Jan 2025' },
  ],
  '4': [
    { id: 'INV-0046', amount: '$299.00', status: 'paid', date: 'Feb 1, 2025', period: 'Jan 2025' },
    { id: 'INV-0039', amount: '$299.00', status: 'paid', date: 'Jan 1, 2025', period: 'Dec 2024' },
    { id: 'INV-0032', amount: '$299.00', status: 'paid', date: 'Dec 1, 2024', period: 'Nov 2024' },
  ],
  '5': [
    { id: 'INV-0022', amount: '$3,200.00', status: 'paid', date: 'Jan 1, 2025', period: 'Dec 2024' },
    { id: 'INV-0015', amount: '$3,200.00', status: 'paid', date: 'Dec 1, 2024', period: 'Nov 2024' },
    { id: 'INV-0008', amount: '$3,200.00', status: 'paid', date: 'Nov 1, 2024', period: 'Oct 2024' },
    { id: 'INV-0002', amount: '$3,200.00', status: 'paid', date: 'Oct 1, 2024', period: 'Sep 2024' },
    { id: 'INV-0001', amount: '$3,200.00', status: 'overdue', date: 'Feb 1, 2025', period: 'Jan 2025' },
  ],
}

const TIMELINE: Record<string, TimelineEvent[]> = {
  '1': [
    { text: 'Usage alert: 87% of monthly limit reached', time: '2h ago', color: 'bg-amber-400', icon: AlertTriangle },
    { text: 'Invoice INV-0048 paid — $2,400', time: '2d ago', color: 'bg-emerald-400', icon: CheckCircle2 },
    { text: 'Seat added: David Park (developer@acmecorp.ai)', time: '5d ago', color: 'bg-blue-400', icon: Users },
    { text: 'Plan upgraded: Growth → Enterprise', time: 'Dec 5, 2024', color: 'bg-violet-400', icon: ArrowUpRight },
    { text: 'Customer onboarded', time: 'Oct 12, 2024', color: 'bg-gray-400', icon: CircleUser },
  ],
  '2': [
    { text: 'Invoice INV-0050 sent — $890', time: '3d ago', color: 'bg-blue-400', icon: FileText },
    { text: 'API key rotated', time: '1w ago', color: 'bg-gray-400', icon: Key },
    { text: 'Customer onboarded', time: 'Nov 3, 2024', color: 'bg-gray-400', icon: CircleUser },
  ],
  '3': [
    { text: 'Trial started — 14 days remaining', time: 'Jan 28, 2025', color: 'bg-blue-400', icon: Clock },
    { text: 'Welcome email sent', time: 'Jan 28, 2025', color: 'bg-emerald-400', icon: Mail },
  ],
  '4': [
    { text: 'Usage alert: 91% of monthly limit reached', time: '1h ago', color: 'bg-red-400', icon: AlertTriangle },
    { text: 'Invoice INV-0046 paid — $299', time: '3d ago', color: 'bg-emerald-400', icon: CheckCircle2 },
    { text: 'Customer onboarded', time: 'Dec 15, 2024', color: 'bg-gray-400', icon: CircleUser },
  ],
  '5': [
    { text: 'Invoice INV-0001 overdue — $3,200', time: '1w ago', color: 'bg-red-400', icon: AlertTriangle },
    { text: 'Subscription paused', time: 'Jan 12, 2025', color: 'bg-red-400', icon: X },
    { text: 'Last activity recorded', time: 'Jan 2, 2025', color: 'bg-gray-400', icon: Activity },
    { text: 'Customer onboarded', time: 'Sep 5, 2024', color: 'bg-gray-400', icon: CircleUser },
  ],
}

const PLAN_LIMITS: Record<string, { feature: string; limit: string; used: string; pct: number }[]> = {
  Enterprise: [
    { feature: 'API Calls / month', limit: '5,000,000', used: '4,350,000', pct: 87 },
    { feature: 'Embeddings / month', limit: '500,000', used: '435,000', pct: 87 },
    { feature: 'Team Seats', limit: 'Unlimited', used: '12', pct: 0 },
    { feature: 'Storage (GB)', limit: '500', used: '124', pct: 25 },
  ],
  Growth: [
    { feature: 'API Calls / month', limit: '500,000', used: '310,000', pct: 62 },
    { feature: 'Embeddings / month', limit: '100,000', used: '62,000', pct: 62 },
    { feature: 'Team Seats', limit: '10', used: '4', pct: 40 },
    { feature: 'Storage (GB)', limit: '50', used: '12', pct: 24 },
  ],
  Starter: [
    { feature: 'API Calls / month', limit: '50,000', used: '45,500', pct: 91 },
    { feature: 'Embeddings / month', limit: '20,000', used: '18,200', pct: 91 },
    { feature: 'Team Seats', limit: '3', used: '2', pct: 67 },
    { feature: 'Storage (GB)', limit: '10', used: '3.2', pct: 32 },
  ],
}

const AVATAR_COLORS: Record<string, string> = {
  AC: 'from-rose-400 to-pink-500',
  TF: 'from-blue-400 to-indigo-500',
  DS: 'from-teal-400 to-cyan-500',
  NB: 'from-violet-400 to-purple-500',
  CI: 'from-amber-400 to-orange-500',
}

const PLAN_COLORS: Record<string, string> = {
  Starter: 'bg-white text-gray-500 border-gray-200',
  Growth: 'bg-white text-gray-500 border-gray-200',
  Enterprise: 'bg-white text-gray-500 border-gray-200',
}

const INVOICE_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  paid: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Paid' },
  issued: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Issued' },
  overdue: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Overdue' },
  void: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', label: 'Void' },
}

// ─────────────────────────────────────────────────────────────────────
// RADIX HELPERS
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
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">All clear</span>
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
// STABLE SIDEBAR COMPONENTS
// ─────────────────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.05]">
      <div className="w-7 h-7 rounded-lg bg-[#16a34a] flex items-center justify-center shrink-0">
        <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-[13px] font-semibold leading-none tracking-tight">UnitPay</p>
        <p className="text-[#4a4a4a] text-[10px] mt-[3px] truncate">Linq App</p>
      </div>
      <DropMenu trigger={
        <button className="rounded-md p-0.5 text-[#3a3a3a] transition-colors hover:bg-white/[0.08] hover:text-[#888]">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      } align="end">
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
    <div className="px-3 py-3 border-t border-white/[0.05] shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">A</div>
        <div className="min-w-0 flex-1">
          <p className="text-[#d0d0d0] text-[12px] font-medium leading-none truncate">Anshuman Atrey</p>
          <p className="text-[#4a4a4a] text-[10px] mt-[3px] truncate">anshuman@useunitpay.com</p>
        </div>
        <DropMenu trigger={
          <button className="rounded-md p-0.5 text-[#3a3a3a] transition-colors hover:bg-white/[0.08] hover:text-[#888]">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        } align="end">
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
// VISX USAGE CHART
// ─────────────────────────────────────────────────────────────────────

function UsageChart({
  width,
  height,
  data,
  color = '#16a34a',
}: {
  width: number
  height: number
  data: UsagePoint[]
  color?: string
}) {
  const [tooltip, setTooltip] = useState<{ point: UsagePoint; x: number; y: number } | null>(null)

  const margin = { top: 12, right: 8, bottom: 28, left: 4 }
  const innerW = Math.max(0, width - margin.left - margin.right)
  const innerH = Math.max(0, height - margin.top - margin.bottom)

  const allZero = data.every(d => d.value === 0)
  const xScale = scalePoint<string>({ domain: data.map(d => d.month), range: [0, innerW], padding: 0 })
  const yMin = allZero ? 0 : Math.min(...data.map(d => d.value)) * 0.75
  const yMax = allZero ? 1000 : Math.max(...data.map(d => d.value)) * 1.12
  const yScale = scaleLinear<number>({ domain: [yMin, yMax], range: [innerH, 0], nice: true })

  const getX = (d: UsagePoint) => xScale(d.month) ?? 0
  const getY = (d: UsagePoint) => yScale(d.value)
  const gradId = `usage-grad-${color.replace('#', '')}`

  function onMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const step = innerW / (data.length - 1)
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(mouseX / step)))
    const point = data[idx]
    setTooltip({ point, x: margin.left + (xScale(point.month) ?? 0), y: margin.top + yScale(point.value) })
  }

  if (width < 10) return null

  return (
    <div className="relative select-none" style={{ width, height }}>
      <svg width={width} height={height}>
        <defs>
          <LinearGradient id={gradId} from={color} to={color} fromOpacity={0.15} toOpacity={0} vertical />
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridRows scale={yScale} width={innerW} numTicks={4} stroke="#f1f5f9" strokeWidth={1} />
          {!allZero && (
            <>
              <AreaClosed<UsagePoint>
                data={data} x={getX} y={getY} yScale={yScale}
                curve={curveMonotoneX} fill={`url(#${gradId})`}
              />
              <LinePath<UsagePoint>
                data={data} x={getX} y={getY}
                curve={curveMonotoneX} stroke={color}
                strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
              />
            </>
          )}
          {tooltip && (
            <line x1={tooltip.x - margin.left} y1={0} x2={tooltip.x - margin.left} y2={innerH}
              stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
          )}
          {!allZero && data.map((d) => (
            <circle key={d.month}
              cx={getX(d)} cy={getY(d)}
              r={tooltip?.point.month === d.month ? 4.5 : 2.8}
              fill={tooltip?.point.month === d.month ? color : 'white'}
              stroke={color} strokeWidth={1.8}
              style={{ transition: 'r 80ms ease, fill 80ms ease' }}
            />
          ))}
          <AxisBottom top={innerH} scale={xScale} hideTicks hideAxisLine
            tickLabelProps={{ fontSize: 10, fill: '#9ca3af', textAnchor: 'middle' as const, fontFamily: 'system-ui' }}
          />
          <rect x={0} y={0} width={innerW} height={innerH} fill="transparent"
            onMouseMove={onMouseMove} onMouseLeave={() => setTooltip(null)} />
        </g>
      </svg>
      {tooltip && (
        <div className="pointer-events-none absolute z-10"
          style={{ left: tooltip.x, top: tooltip.y - 52, transform: 'translateX(-50%)' }}>
          <div className="whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 shadow-xl text-white">
            <p className="text-[10px] text-gray-400 leading-none mb-0.5">{tooltip.point.month} 2025</p>
            <p className="text-[12px] font-bold leading-none">{tooltip.point.value.toLocaleString()} events</p>
          </div>
          <div className="mx-auto h-2 w-px bg-gray-700/50" />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Customer['status'] }) {
  const configs = {
    active: { dot: 'bg-emerald-500', label: 'Active' },
    trial: { dot: 'bg-blue-400', label: 'Trial' },
    inactive: { dot: 'bg-gray-300', label: 'Inactive' },
  }
  const c = configs[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md border border-gray-200 bg-white text-[11px] font-medium text-gray-600">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────

export default function CustomerDetailPage() {
  const params = useParams()
  const id: string = (Array.isArray(params.id) ? params.id[0] : params.id) ?? '1'

  const [sidebarMode, setSidebarMode] = useState<'main' | 'settings'>('main')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Developer Zone': false })
  const [settingsActive, setSettingsActive] = useState('Organization')

  function toggleGroup(title: string) {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const customer = CUSTOMERS_DB[id] ?? CUSTOMERS_DB['1']
  const usageData = USAGE_DATA[id] ?? USAGE_DATA['1']
  const usageMetrics = USAGE_METRICS[id] ?? []
  const invoices = INVOICES[id] ?? []
  const timeline = TIMELINE[id] ?? []
  const planLimits = PLAN_LIMITS[customer.plan] ?? []

  const chartColor = customer.status === 'inactive' ? '#9ca3af'
    : customer.usage >= 90 ? '#ef4444'
    : '#16a34a'

  const nextRenewal = customer.status === 'inactive' ? '—'
    : customer.status === 'trial' ? 'Feb 11, 2025'
    : 'Mar 1, 2025'

  return (
    <TooltipPrimitive.Provider delayDuration={400}>
      <div
        className="flex h-screen overflow-hidden bg-[#f5f5f4]"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════════════ */}
        <aside className="w-[220px] shrink-0 bg-[#0f0f0f] flex flex-col h-full">
          <div className="flex-1 relative overflow-hidden">

            {/* Main nav panel */}
            <div className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-300 ${
              sidebarMode === 'main'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 -translate-x-full pointer-events-none'
            }`}>
              <SidebarLogo />
              <div className="px-3 pt-2.5 pb-1">
                <div className="flex items-center gap-2 px-2.5 py-[7px] rounded-md bg-white/[0.04] text-[#4a4a4a] text-xs cursor-text hover:bg-white/[0.07] transition-colors">
                  <Search className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">Go to...</span>
                  <span className="text-[10px] bg-white/[0.06] text-[#3a3a3a] px-1.5 py-[2px] rounded font-mono">⌘K</span>
                </div>
              </div>
              <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-none space-y-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title}>
                    {group.collapsible ? (
                      <button onClick={() => toggleGroup(group.title)} className="w-full flex items-center justify-between px-2 mb-1 group">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3a3a3a] group-hover:text-[#666] transition-colors">{group.title}</p>
                        <motion.div animate={{ rotate: openGroups[group.title] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-3 h-3 text-[#3a3a3a]" strokeWidth={2} />
                        </motion.div>
                      </button>
                    ) : (
                      <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3a3a3a]">{group.title}</p>
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
                              const isActive = item.label === 'Customers'
                              const NavIcon = item.icon
                              return (
                                <Link
                                  key={item.label}
                                  href={item.label === 'Home' ? '/variant1' : item.label === 'Customers' ? '/variant1/customers' : '#'}
                                  className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                                    isActive
                                      ? 'bg-white/[0.1] text-[#d0d0d0] font-medium'
                                      : 'text-[#7a7a7a] hover:text-[#d0d0d0] hover:bg-white/[0.05]'
                                  }`}
                                >
                                  <NavIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#d0d0d0]' : ''}`} strokeWidth={isActive ? 2 : 1.75} />
                                  <span className="truncate">{item.label}</span>
                                </Link>
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

            {/* Settings panel */}
            <div className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-300 ${
              sidebarMode === 'settings'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}>
              <div className="flex items-center gap-2.5 px-3 py-3.5 border-b border-white/[0.05]">
                <button onClick={() => setSidebarMode('main')}
                  className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/[0.12] transition-all shrink-0">
                  <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
                <p className="text-white text-[14px] font-semibold tracking-tight">Settings</p>
              </div>
              <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-none space-y-4">
                {SETTINGS_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3a3a3a]">{group.title}</p>
                    <div className="space-y-px">
                      {group.items.map((item) => {
                        const isActive = settingsActive === item.label
                        const SettingsIcon = item.icon
                        return (
                          <button key={item.label} onClick={() => setSettingsActive(item.label)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                              isActive ? 'bg-white text-[#0f0f0f] font-medium shadow-sm' : 'text-[#7a7a7a] hover:text-[#d0d0d0] hover:bg-white/[0.05]'
                            }`}>
                            <SettingsIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0f0f0f]' : ''}`} strokeWidth={isActive ? 2 : 1.75} />
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
            <div className="flex items-center gap-1.5 text-[13px]">
              <Link href="/variant1" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/variant1/customers" className="text-gray-400 hover:text-gray-600 transition-colors">Customers</Link>
              <span className="text-gray-300">/</span>
              <span className="font-medium text-gray-700">{customer.company}</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <NotificationsPopover />
              <Tip content="Settings">
                <button
                  onClick={() => setSidebarMode(sidebarMode === 'settings' ? 'main' : 'settings')}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                    sidebarMode === 'settings' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
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

              {/* ── Hero section ──────────────────────────────────── */}
              <motion.div
                className="bg-white rounded-xl border border-gray-200 px-5 py-4"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top row: avatar + name + badges · buttons */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[customer.avatar]} flex items-center justify-center text-white text-[12px] font-bold shadow-sm shrink-0`}>
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-[17px] font-semibold text-gray-900 tracking-tight leading-none">{customer.name}</h1>
                      <span className="text-gray-300 text-[13px]">·</span>
                      <span className="text-[13px] text-gray-500 leading-none">{customer.company}</span>
                      <StatusBadge status={customer.status} />
                      <span className={`px-2 py-[3px] rounded-md border text-[11px] font-medium ${PLAN_COLORS[customer.plan]}`}>
                        {customer.plan}
                      </span>
                    </div>
                  </div>
                  {/* Actions — right-aligned, same vertical height as name */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      New Invoice
                    </motion.button>
                    <DropMenu trigger={
                      <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                        Actions
                        <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
                      </button>
                    } align="end">
                      <MenuItem icon={Mail} label="Send email" />
                      <MenuItem icon={FileText} label="View invoices" />
                      <MenuItem icon={Download} label="Export data" />
                      <MenuSep />
                      <MenuItem icon={Trash2} label="Delete customer" danger />
                    </DropMenu>
                  </div>
                </div>

                {/* Bottom row: contact metadata chips */}
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 pl-[52px]">
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="w-3 h-3" strokeWidth={1.75} />
                    {customer.email}
                  </a>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Phone className="w-3 h-3" strokeWidth={1.75} />
                    {customer.phone}
                  </span>
                  <a href={`https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                    <Globe className="w-3 h-3" strokeWidth={1.75} />
                    {customer.website}
                  </a>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Building2 className="w-3 h-3" strokeWidth={1.75} />
                    {customer.location}
                  </span>
                </div>
              </motion.div>

              {/* ── Tabs ────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 }}
              >
                <TabsPrimitive.Root defaultValue="overview">
                  <TabsPrimitive.List className="flex items-center gap-0.5 rounded-xl bg-white border border-gray-200 p-1 mb-4 w-fit">
                    {[
                      { value: 'overview', icon: LayoutGrid, label: 'Overview' },
                      { value: 'usage', icon: BarChart3, label: 'Usage' },
                      { value: 'invoices', icon: Receipt, label: 'Invoices' },
                      { value: 'subscriptions', icon: Package, label: 'Subscriptions' },
                    ].map(tab => {
                      const TabIcon = tab.icon
                      return (
                        <TabsPrimitive.Trigger
                          key={tab.value}
                          value={tab.value}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-gray-500 transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-gray-700"
                        >
                          <TabIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                          {tab.label}
                        </TabsPrimitive.Trigger>
                      )
                    })}
                  </TabsPrimitive.List>

                  {/* ── OVERVIEW TAB ── */}
                  <TabsPrimitive.Content value="overview">
                    <div className="space-y-4">
                      {/* KPI row */}
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'MRR', prefix: '$', value: customer.mrr, sub: customer.plan + ' plan', icon: RefreshCw },
                          { label: 'Usage This Month', prefix: '', value: customer.usage, suffix: '%', sub: 'of monthly limit', icon: Activity },
                          { label: 'Total Paid', prefix: '$', value: customer.totalPaid, sub: 'lifetime revenue', icon: DollarSign },
                          { label: 'Active Since', prefix: '', value: null, display: customer.joined, sub: 'customer since', icon: Calendar },
                        ].map((kpi, i) => {
                          const KpiIcon = kpi.icon
                          return (
                            <motion.div
                              key={kpi.label}
                              className="bg-white rounded-xl border border-gray-200 p-4"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, delay: i * 0.05 }}
                              whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{kpi.label}</p>
                                <KpiIcon className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                              </div>
                              {kpi.display ? (
                                <p className="text-[17px] font-semibold text-gray-900">{kpi.display}</p>
                              ) : (
                                <div className="flex items-baseline gap-0.5">
                                  {kpi.prefix && <span className="text-[17px] font-bold text-gray-900">{kpi.prefix}</span>}
                                  <NumberFlow value={kpi.value ?? 0} className="text-[20px] font-bold text-gray-900 tabular-nums" />
                                  {kpi.suffix && <span className="text-[14px] font-bold text-gray-900">{kpi.suffix}</span>}
                                </div>
                              )}
                              <p className="text-[11px] text-gray-400 mt-0.5">{kpi.sub}</p>
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Activity + Quick Actions */}
                      <div className="grid grid-cols-[1fr_280px] gap-4">
                        {/* Activity timeline */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                          <h3 className="text-[13px] font-semibold text-gray-900 mb-4">Activity</h3>
                          <div className="space-y-0">
                            {timeline.map((event: TimelineEvent, i: number) => {
                              const EventIcon = event.icon
                              return (
                                <motion.div
                                  key={i}
                                  className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.22, delay: i * 0.05 }}
                                >
                                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <EventIcon className="w-2.5 h-2.5 text-gray-400" strokeWidth={2} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-gray-700">{event.text}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{event.time}</p>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Quick actions */}
                        <div className="space-y-3">
                          <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Quick Actions</h3>
                            <div className="space-y-1.5">
                              {[
                                { icon: FileText, label: 'Create Invoice', sub: 'Bill for current usage' },
                                { icon: Mail, label: 'Send Email', sub: 'Contact customer' },
                                { icon: CreditCard, label: 'Manage Plan', sub: `Currently on ${customer.plan}` },
                                { icon: Download, label: 'Export Data', sub: 'Download CSV report' },
                              ].map((action) => {
                                const ActionIcon = action.icon
                                return (
                                  <motion.button
                                    key={action.label}
                                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-colors duration-100 text-left border border-transparent hover:bg-[#f9fafb] hover:border-gray-100"
                                  >
                                    <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                                      <ActionIcon className="w-3 h-3 text-gray-500" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                      <p className="text-[12px] font-medium text-gray-700">{action.label}</p>
                                      <p className="text-[10px] text-gray-400">{action.sub}</p>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" strokeWidth={1.75} />
                                  </motion.button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Contact card */}
                          <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Contact</h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
                                <span className="text-[12px] text-gray-600 truncate">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
                                <span className="text-[12px] text-gray-600">{customer.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
                                <a href={`https://${customer.website}`} className="text-[12px] text-blue-600 hover:underline">{customer.website}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsPrimitive.Content>

                  {/* ── USAGE TAB ── */}
                  <TabsPrimitive.Content value="usage">
                    <div className="space-y-4">
                      {/* Chart card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-[13px] font-semibold text-gray-900">API Events</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">Total events processed over the last 7 months</p>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[22px] font-bold text-gray-900 tabular-nums">
                              {usageData[usageData.length - 1]?.value.toLocaleString() ?? '0'}
                            </span>
                            <span className="text-[12px] text-gray-400">events this month</span>
                          </div>
                        </div>
                        <div style={{ height: 200 }}>
                          <ParentSize debounceTime={0}>
                            {({ width }) => (
                              <UsageChart width={width} height={200} data={usageData} color={chartColor} />
                            )}
                          </ParentSize>
                        </div>
                      </div>

                      {/* Usage breakdown table */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <h3 className="text-[13px] font-semibold text-gray-900">Usage Breakdown</h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">Current billing period — Feb 2025</p>
                        </div>
                        <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] px-4 py-2.5 bg-gray-50/60 border-b border-gray-100">
                          {['Metric', 'Events', 'Unit Price', 'Subtotal'].map(h => (
                            <span key={h} className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">{h}</span>
                          ))}
                        </div>
                        {usageMetrics.length === 0 ? (
                          <div className="py-10 text-center">
                            <BarChart3 className="w-7 h-7 text-gray-200 mx-auto mb-2" strokeWidth={1.5} />
                            <p className="text-[13px] text-gray-400">No usage this period</p>
                          </div>
                        ) : (
                          <>
                            {usageMetrics.map((metric: UsageMetric, i: number) => (
                              <motion.div
                                key={metric.name}
                                className="grid grid-cols-[1.8fr_1fr_1fr_1fr] px-4 py-3 border-b border-gray-50 last:border-0 items-center"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.04 }}
                              >
                                <span className="text-[13px] font-medium text-gray-800">{metric.name}</span>
                                <span className="text-[13px] text-gray-600 tabular-nums">{metric.events.toLocaleString()}</span>
                                <span className="text-[13px] text-gray-600 tabular-nums">{metric.unitPrice}</span>
                                <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{metric.subtotal}</span>
                              </motion.div>
                            ))}
                            <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] px-4 py-3 bg-gray-50/60 border-t border-gray-100">
                              <span className="text-[12px] font-semibold text-gray-700 col-span-3">Total this period</span>
                              <span className="text-[14px] font-bold text-gray-900 tabular-nums">
                                ${usageMetrics.reduce((s: number, m: UsageMetric) => s + parseFloat(m.subtotal.replace(/[$,]/g, '')), 0).toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsPrimitive.Content>

                  {/* ── INVOICES TAB ── */}
                  <TabsPrimitive.Content value="invoices">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div>
                          <h3 className="text-[13px] font-semibold text-gray-900">Invoice History</h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">{invoices.length} invoices total</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" strokeWidth={2.5} />
                          New Invoice
                        </motion.button>
                      </div>
                      <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1fr_1.5rem] px-4 py-2.5 bg-gray-50/60 border-b border-gray-100">
                        {['Invoice', 'Period', 'Amount', 'Status', 'Date', ''].map(h => (
                          <span key={h} className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">{h}</span>
                        ))}
                      </div>
                      {invoices.length === 0 ? (
                        <div className="py-12 text-center">
                          <Receipt className="w-7 h-7 text-gray-200 mx-auto mb-2" strokeWidth={1.5} />
                          <p className="text-[13px] text-gray-400">No invoices yet</p>
                        </div>
                      ) : invoices.map((inv: Invoice, i: number) => {
                        const s = INVOICE_STATUS[inv.status]
                        return (
                          <motion.div
                            key={inv.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.04 }}
                            className="group grid grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1fr_1.5rem] px-4 py-3 border-b border-gray-50 last:border-0 items-center hover:bg-[#fafaf9] transition-colors duration-100"
                          >
                            <span className="text-[12px] font-mono font-medium text-gray-700">{inv.id}</span>
                            <span className="text-[12px] text-gray-600">{inv.period}</span>
                            <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{inv.amount}</span>
                            <span className={`inline-flex items-center px-2 py-[3px] rounded-full border text-[11px] font-medium w-fit ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                            <span className="text-[12px] text-gray-500">{inv.date}</span>
                            <DropMenu trigger={
                              <button className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            } align="end">
                              <MenuItem icon={Eye} label="View invoice" />
                              <MenuItem icon={Download} label="Download PDF" />
                              {inv.status === 'issued' && <MenuItem icon={CheckCircle2} label="Mark as paid" />}
                              <MenuSep />
                              <MenuItem icon={Trash2} label="Delete" danger />
                            </DropMenu>
                          </motion.div>
                        )
                      })}
                    </div>
                  </TabsPrimitive.Content>

                  {/* ── SUBSCRIPTIONS TAB ── */}
                  <TabsPrimitive.Content value="subscriptions">
                    <div className="space-y-4">
                      {/* Active subscription card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between mb-5">
                          <div>
                            <h3 className="text-[14px] font-semibold text-gray-900">{customer.plan} Plan</h3>
                            <p className="text-[12px] text-gray-500 mt-0.5">Subscription details and limits</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md border text-[11px] font-medium ${PLAN_COLORS[customer.plan]}`}>
                              {customer.plan}
                            </span>
                            <StatusBadge status={customer.status} />
                          </div>
                        </div>

                        {/* Subscription meta */}
                        <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
                          {[
                            { label: 'Billing Cycle', value: 'Monthly', icon: RefreshCw },
                            { label: 'Next Renewal', value: nextRenewal, icon: Calendar },
                            { label: 'Monthly Price', value: `$${customer.mrr.toLocaleString()}`, icon: DollarSign },
                          ].map(item => {
                            const MetaIcon = item.icon
                            return (
                              <div key={item.label} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                  <MetaIcon className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{item.label}</p>
                                  <p className="text-[13px] font-semibold text-gray-800">{item.value}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Plan limits */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[12px] font-semibold text-gray-700">Included Limits</h4>
                            <span className="text-[11px] text-gray-400">
                              Overall usage: <span className="font-semibold text-gray-700">{customer.usage}%</span>
                            </span>
                          </div>
                          <div className="space-y-3">
                            {planLimits.map((limit) => (
                              <div key={limit.feature}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[12px] text-gray-600 flex items-center gap-1.5">
                                    <Layers className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
                                    {limit.feature}
                                  </span>
                                  <span className="text-[11px] text-gray-500 tabular-nums">
                                    {limit.limit === 'Unlimited' ? (
                                      <span className="text-gray-500 font-medium">Unlimited</span>
                                    ) : (
                                      <>{limit.used} <span className="text-gray-300">/</span> {limit.limit}</>
                                    )}
                                  </span>
                                </div>
                                {limit.limit !== 'Unlimited' && (
                                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: limit.pct >= 90 ? '#ef4444' : limit.pct >= 70 ? '#f59e0b' : '#16a34a' }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${limit.pct}%` }}
                                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Upgrade CTA (show if not Enterprise) */}
                      {customer.plan !== 'Enterprise' && customer.status !== 'inactive' && (
                        <motion.div
                          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 flex items-center justify-between"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div>
                            <p className="text-[13px] font-semibold text-white">Approaching usage limits?</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">
                              {customer.plan === 'Starter' ? 'Upgrade to Growth for 10× more capacity' : 'Upgrade to Enterprise for unlimited seats & priority support'}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-900 bg-white px-3.5 py-2 rounded-lg transition-all hover:bg-gray-100 shrink-0"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                            Upgrade Plan
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </TabsPrimitive.Content>
                </TabsPrimitive.Root>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}
