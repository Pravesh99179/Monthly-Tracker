import { CATS } from '../lib/constants'
import { fmtFull } from '../lib/utils'

export default function CategoryGrid({ ct, entries }) {
  const maxC = Math.max(1, ...Object.values(ct))
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(CATS).map(([k, c]) => {
        const count = entries.filter(e => e.cat === k).length
        const pct = Math.round((ct[k] / maxC) * 100)
        return (
          <div key={k} className="bg-white border border-[hsl(240_5.9%_90%)] rounded-xl p-3 hover:border-[hsl(240_5.9%_10%)]/20 transition-colors">
            <div className="text-lg mb-1.5 leading-none">{c.emoji}</div>
            <div className="text-[11px] font-medium text-[hsl(240_3.8%_46%)] mb-0.5">{c.label}</div>
            <div className="text-[14px] font-bold font-mono tracking-tight">{fmtFull(ct[k])}</div>
            <div className="h-0.5 bg-[hsl(240_4.8%_93%)] rounded-full mt-2">
              <div className="h-0.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: c.color }}/>
            </div>
            <div className="text-[10px] text-[hsl(240_3.8%_55%)] mt-1">{count} entr{count === 1 ? 'y' : 'ies'}</div>
          </div>
        )
      })}
    </div>
  )
}
