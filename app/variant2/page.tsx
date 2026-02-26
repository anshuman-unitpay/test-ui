'use client'

import { useState, useEffect } from 'react'
import NumberFlow from '@number-flow/react'
import { motion, AnimatePresence } from 'motion/react'
import { ParentSize } from '@visx/responsive'
import { AreaClosed, LinePath } from '@visx/shape'
import { scaleLinear, scalePoint } from '@visx/scale'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'
import { GridRows } from '@visx/grid'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Users, Bot, Zap, CreditCard, FileText, Files, DollarSign,
  TrendingUp, FlaskConical, Sparkles, Monitor, LayoutGrid, CircleUser,
  Key, RefreshCw, AlertTriangle, Bell, Settings,
  ArrowRight, MoreHorizontal, ChevronDown,
  LogOut, Building2, Plus,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type NavItem = { label: string; icon: LucideIcon }
type NavGroup = { title: string; collapsible: boolean; items: NavItem[] }
type DataPoint = { month: string; value: number }

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (all hardcoded — same source of truth as variant 1)
// ─────────────────────────────────────────────────────────────────────────────

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

const KPI_TOP = [
  { label: 'MRR',              value: 4820,  prefix: '$', sub: '18 active subscriptions', trend: '+12.4%', up: true as boolean | null,  icon: RefreshCw   },
  { label: 'Total Revenue',    value: 15340, prefix: '$', sub: 'All time',                trend: '+47.8%', up: true as boolean | null,  icon: DollarSign  },
  { label: 'Active Customers', value: 24,    prefix: '',  sub: '4 total segments',        trend: '+3 this month', up: true as boolean | null, icon: Users },
  { label: 'Overdue',          value: 0,     prefix: '$', sub: '0 invoices',             trend: null as string | null, up: null as boolean | null, icon: AlertTriangle },
]

const KPI_BOTTOM = [
  { label: 'ARPU',        value: 379 as number | null,   prefix: '$', display: null as string | null, sub: 'Avg revenue / user' },
  { label: 'Churn Rate',  value: null as number | null,  prefix: '',  display: '0.0%',               sub: 'Inactive customers' },
  { label: 'Quick Ratio', value: null as number | null,  prefix: '',  display: 'N/A',                sub: 'Growth efficiency'  },
  { label: 'ARR',         value: 57840 as number | null, prefix: '$', display: null as string | null, sub: 'Annual recurring'   },
]

const REVENUE_DATA: DataPoint[] = [
  { month: 'Aug', value: 3200  },
  { month: 'Sep', value: 3800  },
  { month: 'Oct', value: 3400  },
  { month: 'Nov', value: 4100  },
  { month: 'Dec', value: 3900  },
  { month: 'Jan', value: 4500  },
  { month: 'Feb', value: 4820  },
]

const EVENTS_DATA: DataPoint[] = [
  { month: 'Aug', value: 8400  },
  { month: 'Sep', value: 12100 },
  { month: 'Oct', value: 9800  },
  { month: 'Nov', value: 15600 },
  { month: 'Dec', value: 18200 },
  { month: 'Jan', value: 22400 },
  { month: 'Feb', value: 27800 },
]

const RECENT_INVOICES = [
  { id: 'INV-001', customer: 'Acme Corp',      amount: '$1,240', status: 'paid',   date: 'Feb 20' },
  { id: 'INV-002', customer: 'TechFlow AI',    amount: '$890',   status: 'paid',   date: 'Feb 18' },
  { id: 'INV-003', customer: 'DataSync Labs',  amount: '$2,100', status: 'issued', date: 'Feb 15' },
  { id: 'INV-004', customer: 'NeuralBase',     amount: '$450',   status: 'paid',   date: 'Feb 12' },
  { id: 'INV-005', customer: 'Cognify Inc',    amount: '$3,200', status: 'issued', date: 'Feb 10' },
]

const ACTIVITY = [
  { text: 'TechFlow AI upgraded to Pro',             time: '2h ago', type: 'upgrade'  },
  { text: 'Invoice #INV-001 paid — $1,240',          time: '4h ago', type: 'payment'  },
  { text: 'New customer: NeuralBase onboarded',      time: '1d ago', type: 'customer' },
  { text: '12.4K metric events processed',           time: '1d ago', type: 'event'    },
  { text: 'Invoice #INV-003 sent to DataSync Labs',  time: '2d ago', type: 'invoice'  },
]

const ACTIVITY_DOT: Record<string, string> = {
  upgrade:  '#22C55E',
  payment:  '#4ADE80',
  customer: '#22C55E',
  event:    '#C0C0BA',
  invoice:  '#4ADE80',
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP  — sharp, monospace, amber
// ─────────────────────────────────────────────────────────────────────────────

function Tip({ children, content, side = 'bottom' }: {
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
          className="z-[9999] select-none bg-[#1A1A18] border border-white/[0.10] px-2 py-1 text-[10px] font-mono tracking-widest uppercase text-[#22C55E] shadow-none outline-none"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-[#1A1A18]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DROPDOWN  — dark, monospace
// ─────────────────────────────────────────────────────────────────────────────

function DropMenu({ trigger, children, align = 'end' }: {
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
          className="z-[9999] min-w-[180px] bg-[#111110] border border-white/[0.08] py-1 shadow-none outline-none"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

function MenuItem({ icon: Icon, label, danger }: {
  icon: LucideIcon
  label: string
  danger?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={`mx-1 flex cursor-pointer items-center gap-2.5 px-3 py-2 text-[11px] font-mono tracking-wide outline-none transition-colors ${
        danger
          ? 'text-[#E8564A] focus:bg-[#E8564A]/10 hover:bg-[#E8564A]/10'
          : 'text-[#D4D4CE] focus:bg-white/[0.05] hover:bg-white/[0.05] hover:text-[#F0F0EA]'
      }`}
    >
      <Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} />
      {label}
    </DropdownMenuPrimitive.Item>
  )
}

function MenuSep() {
  return <DropdownMenuPrimitive.Separator className="mx-1 my-1 h-px bg-white/[0.06]" />
}

// ─────────────────────────────────────────────────────────────────────────────
// TERMINAL CHART  — amber line, square data points, dark grid
// ─────────────────────────────────────────────────────────────────────────────

function TerminalChart({ width, height, data }: {
  width: number
  height: number
  data: DataPoint[]
}) {
  const [tooltip, setTooltip] = useState<{ point: DataPoint; x: number; y: number } | null>(null)

  const GREEN = '#22C55E'
  const pad  = { top: 14, right: 10, bottom: 30, left: 6 }
  const iW   = Math.max(0, width  - pad.left - pad.right)
  const iH   = Math.max(0, height - pad.top  - pad.bottom)

  const xScale = scalePoint<string>({
    domain: data.map(d => d.month),
    range: [0, iW],
    padding: 0,
  })

  const yMin = Math.min(...data.map(d => d.value)) * 0.72
  const yMax = Math.max(...data.map(d => d.value)) * 1.12

  const yScale = scaleLinear<number>({
    domain: [yMin, yMax],
    range: [iH, 0],
    nice: true,
  })

  const gX = (d: DataPoint) => xScale(d.month) ?? 0
  const gY = (d: DataPoint) => yScale(d.value)

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const rect  = e.currentTarget.getBoundingClientRect()
    const mX    = e.clientX - rect.left
    const step  = iW / (data.length - 1)
    const idx   = Math.max(0, Math.min(data.length - 1, Math.round(mX / step)))
    const point = data[idx]
    setTooltip({ point, x: pad.left + (xScale(point.month) ?? 0), y: pad.top + yScale(point.value) })
  }

  if (width < 10) return null

  return (
    <div className="relative select-none" style={{ width, height }}>
      <svg width={width} height={height}>
        <defs>
          <LinearGradient id="v2-green-fill" from={GREEN} to={GREEN} fromOpacity={0.10} toOpacity={0} vertical />
        </defs>

        <g transform={`translate(${pad.left},${pad.top})`}>
          {/* subtle horizontal grid */}
          <GridRows
            scale={yScale}
            width={iW}
            numTicks={4}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
            strokeDasharray="3 5"
          />

          {/* area fill */}
          <AreaClosed<DataPoint>
            data={data}
            x={gX}
            y={gY}
            yScale={yScale}
            curve={curveMonotoneX}
            fill="url(#v2-green-fill)"
          />

          {/* amber line — square linecap for terminal feel */}
          <LinePath<DataPoint>
            data={data}
            x={gX}
            y={gY}
            curve={curveMonotoneX}
            stroke={GREEN}
            strokeWidth={1.5}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* vertical crosshair */}
          {tooltip && (
            <line
              x1={tooltip.x - pad.left}
              y1={0}
              x2={tooltip.x - pad.left}
              y2={iH}
              stroke={GREEN}
              strokeWidth={1}
              strokeDasharray="2 5"
              opacity={0.45}
            />
          )}

          {/* square data points (not circles — differentiates from variant 1) */}
          {data.map(d => {
            const active = tooltip?.point.month === d.month
            const sz = active ? 5 : 3.5
            return (
              <rect
                key={d.month}
                x={gX(d) - sz / 2}
                y={gY(d) - sz / 2}
                width={sz}
                height={sz}
                fill={active ? GREEN : '#0A0A08'}
                stroke={GREEN}
                strokeWidth={1.25}
                style={{ transition: 'all 70ms ease' }}
              />
            )
          })}

          {/* monospace x-axis labels */}
          {data.map(d => (
            <text
              key={`lbl-${d.month}`}
              x={gX(d)}
              y={iH + 20}
              textAnchor="middle"
              fontSize={9}
              fontFamily="ui-monospace, 'Geist Mono', monospace"
              letterSpacing="0.08em"
              fill="#ACACAA"
            >
              {d.month.toUpperCase()}
            </text>
          ))}

          {/* invisible hit area */}
          <rect
            x={0} y={0}
            width={iW} height={iH}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setTooltip(null)}
          />
        </g>
      </svg>

      {/* tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10"
          style={{ left: tooltip.x, top: tooltip.y - 46, transform: 'translateX(-50%)' }}
        >
          <div className="whitespace-nowrap bg-[#111110] border border-[#22C55E]/25 px-2.5 py-1.5">
            <p className="text-[9px] font-mono tracking-widest uppercase text-[#C0C0BA] leading-none mb-1">
              {tooltip.point.month}
            </p>
            <p className="text-[13px] font-mono font-bold leading-none text-[#22C55E] tabular-nums">
              {tooltip.point.value.toLocaleString()}
            </p>
          </div>
          <div className="mx-auto h-2 w-px bg-[#22C55E]/25" />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE CLOCK  — ticks every second, terminal feel
// ─────────────────────────────────────────────────────────────────────────────

function LiveClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setT(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-[11px] text-[#ACACAA] tabular-nums tracking-widest">{t}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }: {
  active: string
  setActive: (v: string) => void
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Developer Zone': false })
  const toggle = (t: string) => setOpenGroups(p => ({ ...p, [t]: !p[t] }))

  return (
    <aside className="w-[216px] shrink-0 flex flex-col h-full bg-[#0C0C0A] border-r border-white/[0.05]">

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-[13px] border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          {/* square logo mark — no rounded corners */}
          <div className="w-[18px] h-[18px] border border-[#22C55E] flex items-center justify-center shrink-0">
            <span className="text-[#22C55E] text-[8px] font-mono font-bold leading-none tracking-tighter">UP</span>
          </div>
          <span className="text-[#22C55E] text-[11px] font-mono font-bold tracking-[0.22em] uppercase">
            UnitPay
          </span>
        </div>
        <DropMenu
          trigger={
            <button className="text-[#8A8A84] hover:text-[#D4D4CE] transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          }
        >
          <MenuItem icon={Building2} label="Workspace settings" />
          <MenuItem icon={Plus}      label="New workspace"       />
          <MenuSep />
          <MenuItem icon={ArrowRight} label="Switch workspace"  />
        </DropMenu>
      </div>

      {/* ── Search  (styled as a terminal prompt) ─────────────────────── */}
      <div className="px-4 py-2 border-b border-white/[0.03]">
        <div className="flex items-center gap-1.5 text-[#ACACAA] cursor-text py-1">
          <span className="text-[11px] font-mono text-[#22C55E]/40">›_</span>
          <span className="text-[10px] font-mono tracking-widest">search...</span>
          <span className="ml-auto text-[9px] font-mono bg-white/[0.04] text-[#8A8A84] px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-none space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {group.collapsible ? (
              <button
                onClick={() => toggle(group.title)}
                className="w-full flex items-center justify-between mb-1.5 group"
              >
                <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#8A8A84] group-hover:text-[#C0C0BA] transition-colors">
                  {group.title}
                </span>
                <motion.span
                  animate={{ rotate: openGroups[group.title] ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-2.5 h-2.5 text-[#8A8A84]" strokeWidth={1.5} />
                </motion.span>
              </button>
            ) : (
              <p className="mb-1.5 text-[9px] font-mono tracking-[0.20em] uppercase text-[#8A8A84]">
                {group.title}
              </p>
            )}

            <AnimatePresence initial={false}>
              {(!group.collapsible || openGroups[group.title]) && (
                <motion.div
                  initial={group.collapsible ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-px">
                    {group.items.map(item => {
                      const isActive = active === item.label
                      const NavIcon  = item.icon
                      return (
                        <button
                          key={item.label}
                          onClick={() => setActive(item.label)}
                          className={`w-full flex items-center gap-2 py-[5px] text-left text-[11px] font-mono transition-all duration-100 ${
                            isActive
                              ? 'border-l-2 border-[#22C55E] pl-[14px] text-[#22C55E]'
                              : 'pl-4 border-l-2 border-transparent text-[#ACACAA] hover:text-[#D4D4CE] hover:border-[#8A8A84]'
                          }`}
                        >
                          <NavIcon
                            className="w-3 h-3 shrink-0"
                            strokeWidth={isActive ? 2 : 1.5}
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

      {/* ── User ──────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 border border-[#22C55E]/35 bg-[#22C55E]/08 flex items-center justify-center shrink-0">
            <span className="text-[#22C55E] text-[8px] font-mono font-bold">AA</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-mono text-[#D4D4CE] leading-none truncate">Anshuman Atrey</p>
            <p className="text-[9px] font-mono text-[#ACACAA] mt-[3px] truncate">anshuman@useunitpay.com</p>
          </div>
          <DropMenu
            trigger={
              <button className="text-[#8A8A84] hover:text-[#D4D4CE] transition-colors">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            }
          >
            <MenuItem icon={CircleUser} label="Profile"   />
            <MenuItem icon={Settings}   label="Settings"  />
            <MenuSep />
            <MenuItem icon={LogOut}     label="Sign out"  danger />
          </DropMenu>
        </div>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Variant2Home() {
  const [active,   setActive]   = useState('Home')
  const [chartTab, setChartTab] = useState<'mrr' | 'events'>('mrr')

  const chartData = chartTab === 'mrr' ? REVENUE_DATA : EVENTS_DATA
  const chartCurrent = chartTab === 'mrr' ? '$4,820' : '27,800'

  return (
    <TooltipPrimitive.Provider delayDuration={400}>
      <div
        className="flex h-screen overflow-hidden bg-[#0A0A08] text-[#E8E8E2]"
        style={{ fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif" }}
      >
        <Sidebar active={active} setActive={setActive} />

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Topbar ──────────────────────────────────────────────────── */}
          <header className="shrink-0 h-10 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#0A0A08]">
            {/* breadcrumb */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#8A8A84]">General</span>
              <span className="text-[9px] font-mono text-[#4A4A46]">/</span>
              <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#C8C8C2]">Home</span>
            </div>

            {/* right cluster */}
            <div className="flex items-center gap-5">
              <LiveClock />
              <Tip content="Notifications" side="bottom">
                <button className="text-[#ACACAA] hover:text-[#D4D4CE] transition-colors">
                  <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </Tip>
              {/* square avatar — not a circle */}
              <div className="w-5 h-5 border border-[#22C55E]/40 bg-[#22C55E]/08 flex items-center justify-center">
                <span className="text-[#22C55E] text-[8px] font-mono font-bold">AA</span>
              </div>
            </div>
          </header>

          {/* ── Scrollable content ────────────────────────────────────── */}
          <main
            className="flex-1 overflow-y-auto scrollbar-none"
            style={{
              /* subtle scanline texture — terminal feel */
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.004) 2px, rgba(255,255,255,0.004) 4px)',
            }}
          >

            {/* ── HERO METRICS ── big monospace numbers, no card wrappers ─ */}
            <div className="border-b border-white/[0.05] px-6 py-5">
              <div className="flex items-end gap-0">
                {KPI_TOP.map((kpi, i) => {
                  const KpiIcon = kpi.icon
                  const isHero  = i === 0   // MRR is the primary metric
                  return (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      className={`flex flex-col ${
                        isHero ? 'pr-8' : 'px-8'
                      } ${i < KPI_TOP.length - 1 ? 'border-r border-white/[0.06]' : ''}`}
                    >
                      {/* label row */}
                      <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#C0C0BA] mb-2 flex items-center gap-1.5">
                        <KpiIcon className="w-2.5 h-2.5" strokeWidth={1.5} />
                        {kpi.label}
                      </span>

                      {/* number */}
                      <div className="flex items-baseline gap-0.5">
                        {kpi.prefix && (
                          <span className={`font-mono font-bold leading-none ${
                            isHero
                              ? 'text-[28px] text-[#22C55E]'
                              : 'text-[18px] text-[#F0F0EA]'
                          }`}>
                            {kpi.prefix}
                          </span>
                        )}
                        <span
                          className={`font-mono font-bold leading-none tabular-nums ${
                            isHero
                              ? 'text-[52px] text-[#22C55E]'
                              : 'text-[28px] text-[#F0F0EA]'
                          }`}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          <NumberFlow value={kpi.value} />
                        </span>
                      </div>

                      {/* sub-label + trend */}
                      <div className="mt-1.5 flex items-center gap-2">
                        {kpi.trend !== null && (
                          <span className={`text-[10px] font-mono ${kpi.up ? 'text-[#4ADE80]' : 'text-[#E8564A]'}`}>
                            {kpi.up ? '↑' : '↓'} {kpi.trend}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#ACACAA]">{kpi.sub}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── SECONDARY KPI STRIP ── inline, divider-separated ──────── */}
            <div className="border-b border-white/[0.04] px-6 py-2.5">
              <div className="flex items-center gap-0">
                {KPI_BOTTOM.map((kpi, i) => {
                  const val = kpi.display !== null
                    ? kpi.display
                    : kpi.value !== null
                      ? `${kpi.prefix}${kpi.value.toLocaleString()}`
                      : '—'

                  return (
                    <div
                      key={kpi.label}
                      className={`flex items-center gap-2.5 ${
                        i < KPI_BOTTOM.length - 1 ? 'pr-6 mr-6 border-r border-white/[0.05]' : ''
                      }`}
                    >
                      <span className="text-[9px] font-mono tracking-[0.14em] uppercase text-[#ACACAA]">
                        {kpi.label}
                      </span>
                      <span className="text-[13px] font-mono font-bold text-[#F0F0EA] tabular-nums">
                        {val}
                      </span>
                      <span className="text-[9px] font-mono text-[#8A8A84]">{kpi.sub}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── CHART + ACTIVITY ROW ──────────────────────────────────── */}
            <div className="flex border-b border-white/[0.05]" style={{ minHeight: '310px' }}>

              {/* Chart panel */}
              <div className="flex-1 border-r border-white/[0.05] flex flex-col min-w-0">
                {/* chart header */}
                <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/[0.03]">
                  <div className="flex items-center gap-5">
                    {(['mrr', 'events'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setChartTab(tab)}
                        className={`text-[9px] font-mono tracking-[0.20em] uppercase transition-colors ${
                          chartTab === tab
                            ? 'text-[#22C55E] underline underline-offset-4 decoration-[#22C55E]/50'
                            : 'text-[#ACACAA] hover:text-[#D4D4CE]'
                        }`}
                      >
                        {tab === 'mrr' ? 'MRR' : 'Events'}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#ACACAA]">Current</span>
                    <span className="text-[14px] font-mono font-bold text-[#22C55E] tabular-nums">
                      {chartCurrent}
                    </span>
                  </div>
                </div>

                {/* visx chart */}
                <div className="flex-1 px-4 py-3">
                  <ParentSize>
                    {({ width, height }) => (
                      <TerminalChart width={width} height={height} data={chartData} />
                    )}
                  </ParentSize>
                </div>
              </div>

              {/* Activity feed panel */}
              <div className="w-[272px] shrink-0 flex flex-col">
                <div className="shrink-0 px-5 py-3 border-b border-white/[0.03]">
                  <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#ACACAA]">
                    Activity Feed
                  </span>
                </div>

                {/* timeline */}
                <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4">
                  <div className="relative pl-4">
                    {/* vertical timeline rail */}
                    <div className="absolute left-[4px] top-0 bottom-0 w-px bg-white/[0.04]" />

                    <div className="space-y-4">
                      {ACTIVITY.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.22 + i * 0.05, duration: 0.22 }}
                          className="relative"
                        >
                          {/* square dot on the timeline — not a circle */}
                          <div
                            className="absolute left-[-12px] top-[4px] w-[5px] h-[5px]"
                            style={{ backgroundColor: ACTIVITY_DOT[item.type] || '#C0C0BA' }}
                          />
                          <p className="text-[11px] font-mono text-[#C8C8C2] leading-relaxed">
                            {item.text}
                          </p>
                          <p className="text-[9px] font-mono text-[#8A8A84] mt-0.5 tracking-widest">
                            {item.time.toUpperCase()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RECENT INVOICES ───────────────────────────────────────── */}
            <div>
              {/* section header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.03]">
                <span className="text-[9px] font-mono tracking-[0.20em] uppercase text-[#ACACAA]">
                  Recent Invoices
                </span>
                <button className="text-[9px] font-mono text-[#22C55E]/40 hover:text-[#22C55E] transition-colors tracking-[0.14em] uppercase">
                  View All ›
                </button>
              </div>

              {/* column headers */}
              <div
                className="grid px-6 py-2 border-b border-white/[0.04]"
                style={{ gridTemplateColumns: '90px 1fr 90px 80px 72px' }}
              >
                {['ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <span key={h} className="text-[9px] font-mono tracking-[0.14em] uppercase text-[#8A8A84]">
                    {h}
                  </span>
                ))}
              </div>

              {/* rows */}
              {RECENT_INVOICES.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.30 + i * 0.04 }}
                  className="grid px-6 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors cursor-default group"
                  style={{ gridTemplateColumns: '90px 1fr 90px 80px 72px' }}
                >
                  <span className="text-[11px] font-mono text-[#C0C0BA] tracking-wide group-hover:text-[#C8C8C2] transition-colors">
                    {inv.id}
                  </span>
                  <span className="text-[11px] font-mono text-[#D4D4CE] group-hover:text-[#A8A49C] transition-colors">
                    {inv.customer}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#F0F0EA] tabular-nums">
                    {inv.amount}
                  </span>

                  {/* status — small square dot + text, no badge pill */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-[5px] h-[5px] shrink-0"
                      style={{ backgroundColor: inv.status === 'paid' ? '#4ADE80' : '#F59E0B' }}
                    />
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase ${
                        inv.status === 'paid' ? 'text-[#4ADE80]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#ACACAA]">{inv.date}</span>
                </motion.div>
              ))}

              {/* terminal cursor blink at the end — distinctive flourish */}
              <div className="px-6 py-3 flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-[#22C55E]/40 tracking-widest">›</span>
                <span
                  className="inline-block w-[6px] h-[12px] bg-[#22C55E]/25"
                  style={{ animation: 'blink 1.2s step-end infinite' }}
                />
                <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
              </div>
            </div>

          </main>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}
