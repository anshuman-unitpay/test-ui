# UnitPay UI Revamp

UI prototyping sandbox for the UnitPay dashboard — two design variants side by side.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — utility-first styling
- **Motion** v12 (formerly Framer Motion) — page entrance animations, hover/tap effects, AnimatePresence
- **@visx** (by Airbnb) — low-level SVG charting primitives (AreaClosed, LinePath, scales, axes, grid, gradients)
- **d3-array** — data helpers used under the hood by visx
- **@number-flow/react** — animated number counters for KPI values
- **@radix-ui** — headless UI primitives: Dialog, DropdownMenu, Popover, Tabs, Tooltip
- **lucide-react** — icon set
- **ESLint** + **eslint-config-next** — linting

## Variants

| Route | Description |
|-------|-------------|
| `/variant1` | Light theme — white sidebar (dub.co style), green active state |
| `/variant2` | Dark theme — Terminal Finance aesthetic, monospace numbers |

> No Redux — state is local React `useState` only. No API calls, all data is hardcoded.

---

## Key Components Needed

These are the critical UI building blocks for UnitPay. Listed by priority.

### 1. Advanced Filter System
Inspired by Sequence (demo.sequencehq.com) — built on Chakra UI Popover but the logic is fully custom.
- **Two-level command palette**: "Filters" button → searchable list of filterable fields (with icons) → click a field → searchable checkbox list of values
- Filter applies instantly (real-time) — URL params update, table re-renders
- Each active filter becomes a **chip** showing `Field is Value ×` in the toolbar
- Clicking a chip re-opens the value selector for editing
- "Save filter" + "Clear" buttons appear when filters are active
- **For us**: Build on top of **Radix Popover** (already installed). No extra library needed.
- **Bug in Sequence**: Selecting a value updates the table but leaves the dropdown open — avoid this by closing the popover on selection.

### 2. Charts / Graphs
- **Area chart** — revenue over time (already built with @visx)
- **Bar chart** — usage breakdown per metric
- **Sparklines** — tiny inline trend indicators in tables
- **Donut / pie** — plan distribution
- All using **@visx** (already installed).

### 3. Tabs
- Already using **Radix Tabs** — clean, accessible, zero style lock-in.
- Pattern: `Overview | Usage | Invoices | Subscriptions` on detail pages.

### 4. Collapsible / Accordion
- Already partially built — sidebar `Developer Zone` group collapses with Motion AnimatePresence.
- For page content (e.g. expandable invoice line items): use **Radix Collapsible** (not yet installed) or same Motion pattern.

### 5. Timeline / Activity Feed
- Inspired by paid.ai (app.paid.ai) — **100% custom Tailwind, no library**.
- Pattern: left icon column + vertical connector line + content column.
- The line trick: `[&:not(:last-child)_[data-timeline-line]]:block` — Tailwind arbitrary selector hides the line on the last item automatically.
- Events show: icon · event text · expandable diff · user · timestamp.

### 6. Popover / Dropdown
- Already using **Radix Popover** (notifications) and **Radix DropdownMenu** (user menu, workspace switcher).

### 7. Dialog / Modal
- Already using **Radix Dialog** — New Invoice modal.

### 8. Switch / Toggle
- **Radix Switch** (not yet installed) — for yes/no settings, feature flags, active/inactive toggles.
- Add: `@radix-ui/react-switch`

### 9. Toast / Notifications
- Not yet built. Recommend **Sonner** (`sonner` npm package) — minimal, non-blocking, stacks nicely.
- Used by shadcn/ui ecosystem, works great with Tailwind.

### 10. Data Table
- Currently hand-rolled. Fine for now.
- If it gets complex (sorting, pagination, column visibility): add **TanStack Table** (`@tanstack/react-table`).

### 11. Command Palette (⌘K)
- The `Go to...` search in the sidebar is currently a fake button.
- To make it real: **cmdk** (`cmdk` package) — the standard for React command palettes.
- Used by Linear, Vercel, Raycast-style UIs.

### 12. Date Range Picker
- Needed for filter "Due date", "Invoice date" fields.
- Recommend **React Day Picker** (`react-day-picker`) — lightweight, composable with Radix Popover.

### 13. Progress Bar
- Simple custom Tailwind — `<div>` with dynamic width percentage. No library needed.
- Used for usage % on customer rows.

### 14. Status Badge
- Custom — small pill with dot indicator. Already coded in both variants.

---

## Dev

```bash
npm run dev   # starts on http://localhost:3000
```
