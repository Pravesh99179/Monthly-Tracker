import { CATS } from '../lib/constants'
import { fmtFull } from '../lib/utils'
import { Card, CardTitle } from './ui'

export default function ExtraSpend({ ct, salary, threshold }) {
  const extraCats = Object.entries(CATS).filter(([, c]) => !c.essential && !c.isSaving)
  const extrasTotal = extraCats.reduce((s, [k]) => s + (ct[k] || 0), 0)
  const maxA = Math.max(1, ...extraCats.map(([k]) => ct[k] || 0))
  const pct = salary > 0 ? Math.round((extrasTotal / salary) * 100) : 0
  const overLimit = pct > threshold

  return (
    <Card>
      <CardTitle>
        Extra expenditure{' '}
        <span className="text-[11px] font-normal text-[hsl(240_3.8%_46%)]">excl. essentials</span>
      </CardTitle>
      <div className="flex flex-col gap-2">
        {extraCats.map(([k, c]) => {
          const v = ct[k] || 0
          const barPct = Math.round((v / maxA) * 100)
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center flex-shrink-0">{c.emoji}</span>
              <span className="text-[12px] text-[hsl(240_3.8%_46%)] flex-1">{c.label}</span>
              <div className="w-[72px] h-1 bg-[hsl(240_4.8%_93%)] rounded-full flex-shrink-0">
                <div className="h-1 rounded-full" style={{ width: `${barPct}%`, background: c.color }}/>
              </div>
              <span className="text-[12px] font-mono font-medium min-w-[52px] text-right">{fmtFull(v)}</span>
            </div>
          )
        })}
        {salary > 0 && (
          <div className="pt-2 mt-1 border-t border-[hsl(240_5.9%_90%)] flex justify-between items-center">
            <span className="text-[12px] font-medium text-[hsl(240_3.8%_46%)]">Total extra</span>
            <span className={`text-[13px] font-bold font-mono ${overLimit ? 'text-red-500' : 'text-[hsl(240_10%_3.9%)]'}`}>
              {fmtFull(extrasTotal)}{' '}
              <span className="text-[11px] font-normal text-[hsl(240_3.8%_46%)]">{pct}% of salary</span>
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
