import { CATS } from '../lib/constants'
import { fmtFull } from '../lib/utils'
import { Badge } from './ui'

export default function EntriesList({ entries, onDelete }) {
  if (!entries.length) {
    return <p className="text-center text-[13px] text-[hsl(240_3.8%_46%)] py-8 leading-relaxed">No entries this month.<br/>Tap "Add expense" to start tracking.</p>
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  let lastDay = ''

  return (
    <div>
      {sorted.map(e => {
        const d = new Date(e.date)
        const ds = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
        const c = CATS[e.cat] || { label: e.cat, emoji: '•', color: '#888' }
        const hasBill = e.hasFile === true || e.hasFile === 'true'
        const showDay = ds !== lastDay
        lastDay = ds
        return (
          <div key={e.id}>
            {showDay && (
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(240_3.8%_55%)] pt-3 pb-1">{ds}</div>
            )}
            <div className="flex items-center gap-2.5 py-2.5 border-b border-[hsl(240_5.9%_93%)] last:border-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }}/>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{e.note || c.label}</div>
                <div className="text-[11px] text-[hsl(240_3.8%_55%)] mt-px">{c.emoji} {c.label}{hasBill ? ' · 📎 Bill' : ''}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasBill && <Badge variant="info">Bill</Badge>}
                <span className="text-[13px] font-bold font-mono">{fmtFull(Number(e.amt))}</span>
                <button
                  onClick={() => { if (window.confirm('Delete this entry?')) onDelete(e.id) }}
                  className="text-[hsl(240_3.8%_55%)] hover:text-red-500 hover:bg-red-50 rounded p-0.5 text-sm leading-none transition-colors"
                >✕</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
