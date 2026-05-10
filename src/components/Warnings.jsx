import { fmtFull } from '../lib/utils'
import { Alert, AlertTitle, AlertDesc } from './ui'

export default function Warnings({ totalSpend, extras, salary, threshold }) {
  if (!salary) return null
  const tp = Math.round((totalSpend / salary) * 100)
  const ep = Math.round((extras / salary) * 100)

  const budgetVariant = totalSpend > salary ? 'bad' : tp >= 90 ? 'mid' : 'ok'
  const budgetIcon = totalSpend > salary ? '🚨' : tp >= 90 ? '⚠️' : '✅'
  const budgetTitle = totalSpend > salary ? 'Over budget!' : tp >= 90 ? 'Almost at limit' : 'Within budget'
  const budgetMsg = totalSpend > salary
    ? `You've spent ${fmtFull(totalSpend)} against a salary of ${fmtFull(salary)} — that's ${fmtFull(totalSpend - salary)} over.`
    : tp >= 90
    ? `${tp}% of your salary is spent. Only ${fmtFull(salary - totalSpend)} left this month.`
    : `${fmtFull(totalSpend)} spent (${tp}%). ${fmtFull(salary - totalSpend)} remaining.`

  return (
    <div className="flex flex-col gap-2 px-4 pt-3">
      <Alert variant={budgetVariant}>
        <span className="text-base mt-0.5">{budgetIcon}</span>
        <div>
          <AlertTitle variant={budgetVariant}>{budgetTitle}</AlertTitle>
          <AlertDesc variant={budgetVariant}>{budgetMsg}</AlertDesc>
        </div>
      </Alert>
      {extras > 0 && ep > threshold && (
        <Alert variant="mid">
          <span className="text-base mt-0.5">📊</span>
          <div>
            <AlertTitle variant="mid">High extra spending</AlertTitle>
            <AlertDesc variant="mid">
              Non-essential spending is {fmtFull(extras)} ({ep}% of salary) — above your {threshold}% limit.
            </AlertDesc>
          </div>
        </Alert>
      )}
    </div>
  )
}
