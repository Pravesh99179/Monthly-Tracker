export function fmt(n) {
  n = Math.round(n)
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return '₹' + (Math.round(n / 100) / 10) + 'k'
  return '₹' + n
}

export function fmtFull(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

export function catTotals(entries, CATS) {
  const t = {}
  Object.keys(CATS).forEach(k => t[k] = 0)
  entries.forEach(e => {
    if (CATS[e.cat]) t[e.cat] = (t[e.cat] || 0) + Number(e.amt)
  })
  return t
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
