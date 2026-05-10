import { CATS, MONTHS_SHORT } from '../lib/constants'
import { fmt } from '../lib/utils'
import { Card, CardTitle } from './ui'

export default function TrendChart({ allEntries, currentMonth, salary }) {
  const bars = []
  for (let i = -5; i <= 0; i++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1)
    const me = allEntries.filter(e => {
      const ed = new Date(e.date)
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth()
    })
    const total = me.filter(e => !CATS[e.cat]?.isSaving).reduce((s, e) => s + Number(e.amt), 0)
    bars.push({ label: MONTHS_SHORT[d.getMonth()], amt: total, cur: i === 0 })
  }
  const maxB = Math.max(1, ...bars.map(b => b.amt))

  return (
    <Card>
      <CardTitle>6-month trend</CardTitle>
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((b, i) => {
          const h = Math.max(2, Math.round((b.amt / maxB) * 72))
          const color = b.cur
            ? (salary && b.amt > salary ? 'hsl(0 84% 55%)' : 'hsl(240 5.9% 10%)')
            : 'hsl(240 5.9% 82%)'
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-mono text-[hsl(240_3.8%_46%)]">{b.amt > 0 ? fmt(b.amt) : ''}</span>
              <div className="w-full rounded-t-sm" style={{ height: `${h}px`, background: color }}/>
              <span className="text-[9px] text-[hsl(240_3.8%_55%)]">{b.label}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
