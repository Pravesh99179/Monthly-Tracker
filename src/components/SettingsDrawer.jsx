import { useState, useEffect } from 'react'
import { Drawer, Button, Input, Label } from './ui'

export default function SettingsDrawer({ open, onClose, settings, onSave }) {
  const [salary, setSalary] = useState('')
  const [threshold, setThreshold] = useState(40)

  useEffect(() => {
    if (open) {
      setSalary(settings.salary || '')
      setThreshold(settings.threshold || 40)
    }
  }, [open, settings])

  function handleSave() {
    onSave({ salary: parseFloat(salary) || 0, threshold: parseFloat(threshold) || 40 })
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title="Settings">
      <div className="mb-3">
        <Label>Monthly take-home salary (₹)</Label>
        <Input type="number" inputMode="decimal" placeholder="e.g. 75000" value={salary} onChange={e => setSalary(e.target.value)}/>
      </div>
      <div className="mb-5">
        <Label>Extra spend warning threshold (%)</Label>
        <Input type="number" min="1" max="100" placeholder="e.g. 40" value={threshold} onChange={e => setThreshold(e.target.value)}/>
        <p className="text-[11px] text-[hsl(240_3.8%_46%)] mt-1">Warn when non-essential spending exceeds this % of salary</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save settings</Button>
      </div>
    </Drawer>
  )
}
