'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import NumberFlow from '@number-flow/react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Users, Bot, Zap, CreditCard, FileText, Files, DollarSign,
  TrendingUp, FlaskConical, Sparkles, Monitor, LayoutGrid, CircleUser,
  Key, Bell, Settings, PanelLeft, Plus, ArrowRight, MoreHorizontal,
  ChevronDown, ChevronLeft, Search, LogOut, Building2,
  X, Eye, Trash2, Copy, Filter, Package, Layers, Cpu, Wrench,
  Maximize2, Edit2, ExternalLink,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

type NavItem = { label: string; icon: LucideIcon }
type NavGroup = { title: string; collapsible: boolean; items: NavItem[] }

type Product = {
  id: string
  name: string
  description: string
  pricingModel: 'Per Token' | 'Tiered' | 'Flat Rate' | 'Usage-Based'
  rate: string
  subscribers: number
  mrr: number
  status: 'live' | 'draft' | 'archived'
  created: string
  icon: LucideIcon
  iconGradient: string
}

// ─────────────────────────────────────────────────────────────────────
// NAV DATA
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

// ─────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'LLM API Access',
    description: 'Core language model completions',
    pricingModel: 'Per Token',
    rate: '$0.002 / 1k tokens',
    subscribers: 28,
    mrr: 5200,
    status: 'live',
    created: 'Jan 12, 2024',
    icon: Cpu,
    iconGradient: 'from-violet-400 to-purple-600',
  },
  {
    id: '2',
    name: 'Token Bundle Pro',
    description: 'Monthly prepaid token allocation',
    pricingModel: 'Tiered',
    rate: 'from $299 / mo',
    subscribers: 14,
    mrr: 4186,
    status: 'live',
    created: 'Mar 5, 2024',
    icon: Package,
    iconGradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: '3',
    name: 'Embeddings API',
    description: 'High-dimensional vector embeddings',
    pricingModel: 'Per Token',
    rate: '$0.0001 / 1k tokens',
    subscribers: 41,
    mrr: 1230,
    status: 'live',
    created: 'Feb 18, 2024',
    icon: Layers,
    iconGradient: 'from-teal-400 to-cyan-500',
  },
  {
    id: '4',
    name: 'Fine-Tuning Suite',
    description: 'Custom model training on your data',
    pricingModel: 'Usage-Based',
    rate: '$8.00 / GPU-hr',
    subscribers: 6,
    mrr: 2880,
    status: 'live',
    created: 'Aug 20, 2024',
    icon: Wrench,
    iconGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: '5',
    name: 'Context Window XL',
    description: '128k extended context add-on',
    pricingModel: 'Flat Rate',
    rate: '$49 / mo / seat',
    subscribers: 0,
    mrr: 0,
    status: 'draft',
    created: 'Nov 3, 2024',
    icon: Maximize2,
    iconGradient: 'from-rose-400 to-pink-500',
  },
]

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
// SIDEBAR COMPONENTS
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
      <DropMenu
        trigger={
          <button className="rounded-md p-0.5 text-[#3a3a3a] transition-colors hover:bg-white/[0.08] hover:text-[#888]">
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
    <div className="px-3 py-3 border-t border-white/[0.05] shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          A
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[#d0d0d0] text-[12px] font-medium leading-none truncate">Anshuman Atrey</p>
          <p className="text-[#4a4a4a] text-[10px] mt-[3px] truncate">anshuman@useunitpay.com</p>
        </div>
        <DropMenu
          trigger={
            <button className="rounded-md p-0.5 text-[#3a3a3a] transition-colors hover:bg-white/[0.08] hover:text-[#888]">
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
// PRODUCT STATUS BADGE
// ─────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Product['status'] }) {
  const configs = {
    live: { dot: 'bg-emerald-500', label: 'Live' },
    draft: { dot: 'bg-amber-400', label: 'Draft' },
    archived: { dot: 'bg-gray-300', label: 'Archived' },
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
// PRICING MODEL BADGE
// ─────────────────────────────────────────────────────────────────────

function PricingBadge({ model }: { model: Product['pricingModel'] }) {
  return (
    <span className="inline-flex px-2 py-[3px] rounded-md border border-gray-200 bg-white text-[11px] font-medium text-gray-500 w-fit">
      {model}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [sidebarMode, setSidebarMode] = useState<'main' | 'settings'>('main')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Developer Zone': false })
  const [settingsActive, setSettingsActive] = useState('Organization')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft' | 'archived'>('all')

  function toggleGroup(title: string) {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const filtered = PRODUCTS.filter(p => {
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const liveCount = PRODUCTS.filter(p => p.status === 'live').length
  const totalSubs = PRODUCTS.filter(p => p.status === 'live').reduce((s, p) => s + p.subscribers, 0)
  const totalMRR = PRODUCTS.filter(p => p.status === 'live').reduce((s, p) => s + p.mrr, 0)

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
                      <button
                        onClick={() => toggleGroup(group.title)}
                        className="w-full flex items-center justify-between px-2 mb-1 group"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3a3a3a] group-hover:text-[#666] transition-colors">
                          {group.title}
                        </p>
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
                              const isActive = item.label === 'AI Products'
                              const NavIcon = item.icon
                              return (
                                <Link
                                  key={item.label}
                                  href={
                                    item.label === 'Home' ? '/variant1' :
                                    item.label === 'Customers' ? '/variant1/customers' :
                                    item.label === 'AI Products' ? '/variant1/products' :
                                    '#'
                                  }
                                  className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                                    isActive
                                      ? 'bg-white text-[#0f0f0f] font-medium shadow-sm'
                                      : 'text-[#7a7a7a] hover:text-[#d0d0d0] hover:bg-white/[0.05]'
                                  }`}
                                >
                                  <NavIcon
                                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0f0f0f]' : ''}`}
                                    strokeWidth={isActive ? 2 : 1.75}
                                  />
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
                <button
                  onClick={() => setSidebarMode('main')}
                  className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/[0.12] transition-all shrink-0"
                >
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
                          <button
                            key={item.label}
                            onClick={() => setSettingsActive(item.label)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] text-left transition-all duration-100 ${
                              isActive
                                ? 'bg-white text-[#0f0f0f] font-medium shadow-sm'
                                : 'text-[#7a7a7a] hover:text-[#d0d0d0] hover:bg-white/[0.05]'
                            }`}
                          >
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
              <span className="font-medium text-gray-700">AI Products</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <NotificationsPopover />
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

              {/* Page header */}
              <motion.div
                className="flex items-start justify-between"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">AI Products</h1>
                  <p className="text-[13px] text-gray-500 mt-0.5">{liveCount} live products · {totalSubs} active subscriptions</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  New Product
                </motion.button>
              </motion.div>

              {/* Stats bar */}
              <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {[
                  { label: 'Total Products', value: PRODUCTS.length, prefix: '', sub: `${liveCount} live, ${PRODUCTS.filter(p => p.status === 'draft').length} draft`, icon: Bot },
                  { label: 'Active Subscriptions', value: totalSubs, prefix: '', sub: 'across all live products', icon: Users },
                  { label: 'Monthly Revenue', value: totalMRR, prefix: '$', sub: 'from active subscriptions', icon: TrendingUp },
                ].map((stat, i) => {
                  const StatIcon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                      whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{stat.label}</p>
                        <StatIcon className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        {stat.prefix && <span className="text-[20px] font-semibold text-gray-900">{stat.prefix}</span>}
                        <NumberFlow value={stat.value} className="text-[24px] font-semibold text-gray-900 tabular-nums" />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</p>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Filters row */}
              <motion.div
                className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
              >
                {/* Search */}
                <div className="relative flex-1 max-w-[280px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300 focus:bg-white transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Status tabs */}
                <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
                  {(['all', 'live', 'draft', 'archived'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all capitalize ${
                        statusFilter === s
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                      {s !== 'all' && (
                        <span className="ml-1 text-[10px] text-gray-400">
                          {PRODUCTS.filter(p => p.status === s).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <Tip content="More filters" side="top">
                  <button className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-200">
                    <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </Tip>
              </motion.div>

              {/* Products table */}
              <motion.div
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
              >
                {/* Table header */}
                <div
                  className="grid gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60"
                  style={{ gridTemplateColumns: '2.4fr 1.1fr 1.2fr 0.6fr 1fr 0.8fr 1rem' }}
                >
                  {['Product', 'Pricing Model', 'Rate', 'Subs', 'MRR', 'Status', ''].map(h => (
                    <span key={h} className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">{h}</span>
                  ))}
                </div>

                {/* Rows */}
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <Bot className="w-8 h-8 text-gray-200 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] font-medium text-gray-500">No products match your filters</p>
                      <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                    </motion.div>
                  ) : (
                    filtered.map((product, i) => {
                      const ProductIcon = product.icon
                      return (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.22, delay: i * 0.04 }}
                          className="group grid gap-3 px-4 py-3 border-b border-gray-50 last:border-0 items-center cursor-default hover:bg-[#fafaf9] transition-colors duration-100"
                          style={{ gridTemplateColumns: '2.4fr 1.1fr 1.2fr 0.6fr 1fr 0.8fr 1rem' }}
                        >
                          {/* Product */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${product.iconGradient} flex items-center justify-center shrink-0 shadow-sm`}>
                              <ProductIcon className="w-4 h-4 text-white" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 truncate leading-none">{product.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{product.description}</p>
                            </div>
                          </div>

                          {/* Pricing Model */}
                          <PricingBadge model={product.pricingModel} />

                          {/* Rate */}
                          <span className="text-[12px] text-gray-600 font-medium tabular-nums">{product.rate}</span>

                          {/* Subs */}
                          <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{product.subscribers}</span>

                          {/* MRR */}
                          <div className="flex items-baseline gap-0.5">
                            {product.mrr > 0 ? (
                              <>
                                <span className="text-[12px] text-gray-400">$</span>
                                <span className="text-[13px] font-semibold text-gray-900 tabular-nums">
                                  {product.mrr.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-gray-400">/mo</span>
                              </>
                            ) : (
                              <span className="text-[12px] text-gray-400">—</span>
                            )}
                          </div>

                          {/* Status */}
                          <StatusBadge status={product.status} />

                          {/* Actions */}
                          <DropMenu
                            trigger={
                              <button className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            }
                            align="end"
                          >
                            <MenuItem icon={Eye} label="View product" />
                            <MenuItem icon={Edit2} label="Edit product" />
                            <MenuItem icon={Copy} label="Duplicate" />
                            <MenuItem icon={ExternalLink} label="Share link" />
                            <MenuSep />
                            <MenuItem icon={Trash2} label="Delete product" danger />
                          </DropMenu>
                        </motion.div>
                      )
                    })
                  )}
                </AnimatePresence>

                {/* Footer */}
                {filtered.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">
                      Showing {filtered.length} of {PRODUCTS.length} products
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <span className="text-[11px] text-emerald-600 font-medium">
                        ${filtered.filter(p => p.status === 'live').reduce((s, p) => s + p.mrr, 0).toLocaleString()}/mo
                      </span>
                      <span>from filtered selection</span>
                    </div>
                  </div>
                )}
              </motion.div>

            </div>
          </main>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}
