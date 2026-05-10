import { useState, useMemo } from 'react'
import { Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useExpenses } from './hooks/useExpenses'
import { CATS, MONTHS } from './lib/constants'
import { catTotals, fmtFull } from './lib/utils'
import { Button, Card, SyncIndicator } from './components/ui'
import Warnings from './components/Warnings'
import DonutChart from './components/DonutChart'
import TrendChart from './components/TrendChart'
import ExtraSpend from './components/ExtraSpend'
import CategoryGrid from './components/CategoryGrid'
import EntriesList from './components/EntriesList'
import AddExpenseDrawer from './components/AddExpenseDrawer'
import SettingsDrawer from './components/SettingsDrawer'

export default function App() {
  const { entries, settings, syncState, syncLabel, addEntry, removeEntry, saveSettings } = useExpenses()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  function changeMonth(dir) {
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + dir, 1))
  }

  const monthEntries = useMemo(() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth()
    return entries.filter(e => {
      const ed = new Date(e.date)
      return ed.getFullYear() === y && ed.getMonth() === m
    })
  }, [entries, currentMonth])

  const ct = useMemo(() => catTotals(monthEntries, CATS), [monthEntries])

  const totalSpend = useMemo(() =>
    Object.entries(ct).filter(([k]) => !CATS[k].isSaving).reduce((s, [, v]) => s + v, 0),
    [ct]
  )
  const totalSave = ct.saving || 0
  const essentials = (ct.rent || 0) + (ct.electricity || 0) + (ct.credit_card || 0)
  const extras = totalSpend - essentials
  const sal = Number(settings.salary) || 0

  const left = sal > 0 ? sal - totalSpend : null
  const budgetPct = sal > 0 ? Math.round((totalSpend / sal) * 100) : 0
  const gaugeColor = budgetPct > 100 ? 'hsl(0 84% 55%)' : budgetPct > 80 ? 'hsl(38 92% 50%)' : 'hsl(142 76% 36%)'

  return (
    <div className="app max-w-[430px] mx-auto pb-16 bg-[hsl(240_4.8%_97%)] min-h-screen">

      {/* HEADER */}
      <header className="bg-white border-b border-[hsl(240_5.9%_90%)] px-4 py-3.5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">💸 Expense Tracker</h1>
            <SyncIndicator state={syncState} label={syncLabel}/>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings size={13}/> Settings
          </Button>
        </div>
      </header>

      {/* MONTH NAV */}
      <div className="flex items-center justify-between px-4 pt-3">
        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft size={16}/>
        </Button>
        <span className="text-[15px] font-semibold tracking-tight">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight size={16}/>
        </Button>
      </div>

      {/* ADD BUTTON */}
      <div className="px-4 pt-3">
        <Button className="w-full h-10" onClick={() => setShowAdd(true)}>
          <Plus size={15}/> Add expense
        </Button>
      </div>

      {/* SALARY NUDGE */}
      {sal === 0 && (
        <div className="mx-4 mt-3 bg-[hsl(214_100%_96%)] border border-[hsl(214_100%_80%)] rounded-xl p-3 flex items-center gap-2.5">
          <span className="text-lg">💼</span>
          <p className="text-[12px] text-[hsl(214_100%_37%)] flex-1 leading-snug">Set your monthly salary in Settings to enable budget tracking.</p>
          <Button size="sm" style={{background:'hsl(214 100% 37%)',color:'#fff',borderColor:'hsl(214 100% 37%)'}} onClick={() => setShowSettings(true)}>Set</Button>
        </div>
      )}

      {/* WARNINGS */}
      <Warnings totalSpend={totalSpend} extras={extras} salary={sal} threshold={settings.threshold}/>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        {[
          { label: 'Spent', value: fmtFull(totalSpend), color: 'text-red-500', sub: 'this month' },
          { label: 'Saved', value: fmtFull(totalSave), color: 'text-emerald-600', sub: 'intentional' },
          {
            label: 'Left',
            value: left !== null ? fmtFull(Math.abs(left)) : '—',
            color: left === null ? 'text-[hsl(214_100%_37%)]' : left < 0 ? 'text-red-500' : 'text-[hsl(214_100%_37%)]',
            sub: left === null ? 'set salary' : left < 0 ? 'overspent' : 'remaining'
          },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[hsl(240_5.9%_90%)] rounded-xl p-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(240_3.8%_46%)] mb-1">{s.label}</div>
            <div className={`text-[16px] font-bold font-mono tracking-tight ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-[hsl(240_3.8%_55%)] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* GAUGE */}
      {sal > 0 && (
        <div className="px-4 pt-3">
          <Card>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium">Budget used</span>
              <span className="text-[12px] font-bold font-mono" style={{ color: gaugeColor }}>{budgetPct}%</span>
            </div>
            <div className="h-2 bg-[hsl(240_4.8%_93%)] rounded-full overflow-hidden">
              <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(budgetPct, 100)}%`, background: gaugeColor }}/>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] font-mono text-[hsl(240_3.8%_46%)]">₹0</span>
              <span className="text-[10px] font-mono text-[hsl(240_3.8%_46%)]">{fmtFull(sal)}</span>
            </div>
          </Card>
        </div>
      )}

      {/* CHARTS */}
      <div className="px-4 pt-3 flex flex-col gap-3">
        <DonutChart ct={ct} total={totalSpend}/>
        <ExtraSpend ct={ct} salary={sal} threshold={settings.threshold}/>
        <TrendChart allEntries={entries} currentMonth={currentMonth} salary={sal}/>
      </div>

      {/* CATEGORY GRID */}
      <div className="px-4 pt-4">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(240_3.8%_46%)] mb-2">By category</div>
        <CategoryGrid ct={ct} entries={monthEntries}/>
      </div>

      {/* ENTRIES */}
      <div className="px-4 pt-4">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(240_3.8%_46%)] mb-1">Entries</div>
        <EntriesList entries={monthEntries} onDelete={removeEntry}/>
      </div>

      {/* DRAWERS */}
      <AddExpenseDrawer open={showAdd} onClose={() => setShowAdd(false)} onSave={addEntry}/>
      <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSave={saveSettings}/>

    </div>
  )
}
