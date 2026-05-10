import { CATS } from '../lib/constants'
import { fmt } from '../lib/utils'
import { Card, CardTitle } from './ui'

export default function DonutChart({ ct, total }) {
  const R = 40, CX = 55, CY = 55, CIRC = 2 * Math.PI * R
  const items = Object.entries(CATS)
    .map(([k, c]) => ({ k, c, v: ct[k] || 0 }))
    .filter(x => x.v > 0 && !x.c.isSaving)
    .sort((a, b) => b.v - a.v)

  let offset = 0
  const arcs = items.map(item => {
    const dash = (item.v / (total || 1)) * CIRC
    const arc = { item, dash, offset }
    offset += dash
    return arc
  })

  return (
    <Card>
      <CardTitle>Spending breakdown</CardTitle>
      <div className="flex items-center gap-4">
        <svg width="108" height="108" viewBox="0 0 110 110" className="flex-shrink-0">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="hsl(240 4.8% 93%)" strokeWidth="16"/>
          {arcs.map(({ item, dash, offset }) => (
            <circle key={item.k} cx={CX} cy={CY} r={R} fill="none"
              stroke={item.c.color} strokeWidth="16"
              strokeDasharray={`${dash.toFixed(2)} ${CIRC.toFixed(2)}`}
              strokeDashoffset={`${(-offset).toFixed(2)}`}
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          ))}
          <text x={CX} y="51" textAnchor="middle" fontFamily="Geist Mono,monospace" fontSize="11" fontWeight="600" fill="hsl(240 10% 3.9%)">{fmt(total)}</text>
          <text x={CX} y="64" textAnchor="middle" fontFamily="Geist,sans-serif" fontSize="9" fill="hsl(240 3.8% 46.1%)">total spent</text>
        </svg>
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {items.length === 0 && <span className="text-xs text-[hsl(240_3.8%_55%)]">No expenses yet</span>}
          {items.slice(0, 7).map(item => {
            const pct = Math.round((item.v / (total || 1)) * 100)
            return (
              <div key={item.k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.c.color }}/>
                <span className="text-[11px] text-[hsl(240_3.8%_46%)] flex-1 truncate">{item.c.label}</span>
                <span className="text-[11px] font-mono font-medium">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
