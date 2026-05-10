import { useState } from 'react'
import { Drawer, Button, Input, Select, Label } from './ui'

const CATEGORY_OPTIONS = [
  { group: 'Daily', options: [
    { value: 'food', label: '🍜 Food' },
    { value: 'grocery', label: '🛒 Grocery' },
    { value: 'dinner', label: '🍽️ Dinner / Eating out' },
    { value: 'fuel', label: '⛽ Fuel' },
  ]},
  { group: 'Lifestyle', options: [
    { value: 'travel', label: '🚇 Travel' },
    { value: 'entertainment', label: '🎬 Entertainment' },
  ]},
  { group: 'Bills & Essentials', options: [
    { value: 'rent', label: '🏠 Rent' },
    { value: 'electricity', label: '⚡ Electricity bill' },
    { value: 'credit_card', label: '💳 Credit card bill' },
  ]},
  { group: 'Finance', options: [
    { value: 'saving', label: '💰 Savings' },
  ]},
]

export default function AddExpenseDrawer({ open, onClose, onSave }) {
  const [amt, setAmt] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [cat, setCat] = useState('')
  const [note, setNote] = useState('')
  const [fileName, setFileName] = useState('')
  const [saving, setSaving] = useState(false)

  function reset() { setAmt(''); setCat(''); setNote(''); setFileName('') }

  async function handleSave() {
    if (!amt || Number(amt) <= 0) { alert('Enter a valid amount.'); return }
    if (!cat) { alert('Select a category.'); return }
    if (!date) { alert('Select a date.'); return }
    setSaving(true)
    await onSave({ amt: Number(amt), cat, date, note: note.trim(), fileName })
    reset()
    onClose()
    setSaving(false)
  }

  return (
    <Drawer open={open} onClose={() => { reset(); onClose() }} title="New expense">
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <Label>Amount (₹)</Label>
          <Input type="number" placeholder="0" min="0" inputMode="decimal" value={amt} onChange={e => setAmt(e.target.value)}/>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)}/>
        </div>
      </div>
      <div className="mb-3">
        <Label>Category</Label>
        <Select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
        </Select>
      </div>
      <div className="mb-3">
        <Label>Note <span className="text-[hsl(240_3.8%_46%)] font-normal">(optional)</span></Label>
        <Input type="text" placeholder="e.g. Swiggy, Metro, Netflix…" value={note} onChange={e => setNote(e.target.value)}/>
      </div>
      <div className="mb-4">
        <Label>Attach bill / receipt</Label>
        <div
          className="border border-dashed border-[hsl(240_5.9%_82%)] rounded-lg p-3.5 text-center cursor-pointer bg-[hsl(240_4.8%_95.9%)] hover:border-[hsl(240_5.9%_10%)] hover:bg-white transition-all"
          onClick={() => document.getElementById('fFile').click()}
        >
          <div className="text-[13px] font-medium text-[hsl(240_3.8%_46%)]">📎 Tap to attach</div>
          <div className="text-[11px] text-[hsl(240_3.8%_55%)] mt-0.5">JPG · PNG · PDF</div>
        </div>
        <input type="file" id="fFile" accept="image/*,.pdf" className="hidden" onChange={e => setFileName(e.target.files[0]?.name || '')}/>
        {fileName && (
          <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 bg-[hsl(214_100%_96%)] border border-[hsl(214_100%_80%)] rounded-lg">
            <span className="text-[12px] text-[hsl(214_100%_37%)] flex-1 truncate">{fileName}</span>
            <button className="text-[hsl(214_100%_37%)] text-sm" onClick={() => setFileName('')}>✕</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" onClick={() => { reset(); onClose() }}>Cancel</Button>
        <Button disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save expense'}</Button>
      </div>
    </Drawer>
  )
}
