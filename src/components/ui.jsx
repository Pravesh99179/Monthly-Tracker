import { cn } from '../lib/utils'

export function Button({ children, variant = 'default', size = 'default', className, ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-md font-medium font-sans cursor-pointer transition-all border whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    default: 'bg-[hsl(240_5.9%_10%)] text-[hsl(0_0%_98%)] border-[hsl(240_5.9%_10%)] hover:bg-[hsl(240_5.9%_18%)]',
    outline: 'bg-transparent text-[hsl(240_10%_3.9%)] border-[hsl(240_5.9%_90%)] hover:bg-[hsl(240_4.8%_95.9%)]',
    ghost:   'bg-transparent text-[hsl(240_3.8%_46%)] border-transparent hover:bg-[hsl(240_4.8%_95.9%)] hover:text-[hsl(240_10%_3.9%)]',
    destructive: 'bg-[hsl(0_84.2%_60.2%)] text-white border-[hsl(0_84.2%_60.2%)] hover:opacity-90',
  }
  const sizes = {
    default: 'h-10 px-4 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-11 px-6 text-base',
    icon: 'h-8 w-8 p-0',
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>
}

export function Card({ children, className, ...props }) {
  return <div className={cn('bg-white border border-[hsl(240_5.9%_90%)] rounded-xl p-4', className)} {...props}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <div className={cn('text-[13px] font-semibold text-[hsl(240_10%_3.9%)] tracking-tight mb-3', className)}>{children}</div>
}

export function Badge({ children, variant = 'secondary', className }) {
  const variants = {
    secondary: 'bg-[hsl(240_4.8%_95.9%)] text-[hsl(240_5.9%_10%)] border-[hsl(240_5.9%_90%)]',
    success:   'bg-[hsl(142_76%_95%)] text-[hsl(142_76%_26%)] border-[hsl(142_76%_80%)]',
    warning:   'bg-[hsl(38_92%_95%)] text-[hsl(32_95%_30%)] border-[hsl(38_92%_75%)]',
    danger:    'bg-[hsl(0_84%_96%)] text-[hsl(0_84%_40%)] border-[hsl(0_84%_80%)]',
    info:      'bg-[hsl(214_100%_96%)] text-[hsl(214_100%_37%)] border-[hsl(214_100%_80%)]',
  }
  return <span className={cn('inline-flex items-center rounded-full text-[11px] font-medium px-2 py-0.5 border', variants[variant], className)}>{children}</span>
}

export function Alert({ children, variant = 'ok', className }) {
  const variants = {
    ok:  'bg-[hsl(142_76%_95%)] border-[hsl(142_76%_80%)]',
    mid: 'bg-[hsl(38_92%_95%)] border-[hsl(38_92%_75%)]',
    bad: 'bg-[hsl(0_84%_96%)] border-[hsl(0_84%_80%)]',
  }
  return <div className={cn('rounded-xl border p-3 flex gap-2.5', variants[variant], className)}>{children}</div>
}

export function AlertTitle({ children, variant = 'ok' }) {
  const colors = { ok: 'text-[hsl(142_76%_26%)]', mid: 'text-[hsl(32_95%_30%)]', bad: 'text-[hsl(0_84%_40%)]' }
  return <div className={cn('text-[12px] font-semibold mb-0.5', colors[variant])}>{children}</div>
}

export function AlertDesc({ children, variant = 'ok' }) {
  const colors = { ok: 'text-[hsl(142_50%_35%)]', mid: 'text-[hsl(32_80%_35%)]', bad: 'text-[hsl(0_70%_45%)]' }
  return <div className={cn('text-[11px] leading-relaxed', colors[variant])}>{children}</div>
}

export function Input({ className, ...props }) {
  return <input className={cn('w-full h-10 px-3 bg-white border border-[hsl(240_5.9%_90%)] rounded-md text-sm font-sans text-[hsl(240_10%_3.9%)] outline-none transition-all placeholder:text-[hsl(240_3.8%_60%)] focus:border-[hsl(240_5.9%_10%)] focus:ring-2 focus:ring-[hsl(240_5.9%_10%)]/10', className)} {...props}/>
}

export function Select({ className, children, ...props }) {
  return <select className={cn('w-full h-10 px-3 bg-white border border-[hsl(240_5.9%_90%)] rounded-md text-sm font-sans text-[hsl(240_10%_3.9%)] outline-none transition-all focus:border-[hsl(240_5.9%_10%)] focus:ring-2 focus:ring-[hsl(240_5.9%_10%)]/10 appearance-none', className)} {...props}>{children}</select>
}

export function Label({ children, className, ...props }) {
  return <label className={cn('text-[12px] font-medium text-[hsl(240_10%_3.9%)] block mb-1.5', className)} {...props}>{children}</label>
}

export function Separator({ className }) {
  return <div className={cn('h-px bg-[hsl(240_5.9%_90%)] my-3', className)}/>
}

export function Drawer({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl p-5 pb-10 w-full max-w-[430px] max-h-[92vh] overflow-y-auto animate-slide-up">
        <div className="w-8 h-[3px] bg-[hsl(240_5.9%_90%)] rounded-full mx-auto mb-4"/>
        <h2 className="text-base font-semibold tracking-tight mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function SyncIndicator({ state, label }) {
  const dotColor = { ok: 'bg-green-600', busy: 'bg-amber-500 animate-pulse-dot', err: 'bg-red-500', idle: 'bg-gray-400' }
  const lblColor = { ok: 'text-green-700', busy: 'text-amber-600', err: 'text-red-600', idle: 'text-gray-400' }
  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor[state] || dotColor.idle)}/>
      <span className={cn('text-[11px]', lblColor[state] || lblColor.idle)}>{label}</span>
    </div>
  )
}
