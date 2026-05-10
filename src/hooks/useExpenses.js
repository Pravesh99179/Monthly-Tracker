import { useState, useEffect, useCallback, useRef } from 'react'
import { sbGet, sbPost, sbDelete, sbUpsert } from '../lib/supabase'
import { genId } from '../lib/utils'

const CACHE_KEY = 'exp_cache'
const SETTINGS_KEY = 'exp_settings'
const QUEUE_KEY = 'exp_queue'

function loadCache(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

export function useExpenses() {
  const [entries, setEntries] = useState(() => loadCache(CACHE_KEY, []))
  const [settings, setSettings] = useState(() => loadCache(SETTINGS_KEY, { salary: 0, threshold: 40 }))
  const [syncState, setSyncState] = useState('idle') // idle | busy | ok | err
  const [syncLabel, setSyncLabel] = useState('Connecting…')
  const queueRef = useRef(loadCache(QUEUE_KEY, []))

  function setSync(state, label) {
    setSyncState(state)
    setSyncLabel(label)
  }

  function saveQueue(q) {
    queueRef.current = q
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
  }

  async function flushQueue() {
    if (!navigator.onLine || !queueRef.current.length) return
    const pending = [...queueRef.current]
    for (const op of pending) {
      try {
        if (op.type === 'add') await sbPost('expenses', op.data)
        else if (op.type === 'delete') await sbDelete('expenses', op.id)
        else if (op.type === 'settings') await sbUpsert('settings', op.data)
        saveQueue(queueRef.current.filter(q => q.qid !== op.qid))
      } catch { break }
    }
  }

  const loadAll = useCallback(async () => {
    setSync('busy', 'Syncing…')
    try {
      const [rawEntries, settingsRows] = await Promise.all([
        sbGet('expenses', 'order=date.desc'),
        sbGet('settings'),
      ])
      const parsed = rawEntries.map(r => ({
        id: r.id, date: r.date, amt: Number(r.amt), cat: r.cat,
        note: r.note || '', hasFile: r.has_file || false, fileName: r.file_name || '',
      }))
      setEntries(parsed)
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))

      const sm = {}
      settingsRows.forEach(r => sm[r.key] = r.value)
      const newSettings = {
        salary: sm.salary !== undefined ? Number(sm.salary) : settings.salary,
        threshold: sm.threshold !== undefined ? Number(sm.threshold) : settings.threshold,
      }
      setSettings(newSettings)
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      setSync('ok', 'Synced · Supabase')
    } catch (e) {
      setSync('err', 'Sync failed — showing cached data')
      console.error(e)
    }
  }, [])

  useEffect(() => {
    async function init() {
      if (navigator.onLine) {
        await flushQueue()
        await loadAll()
      } else {
        setSync('err', 'Offline — showing cached data')
      }
    }
    init()

    function onOnline() {
      setSync('busy', 'Back online — syncing…')
      flushQueue().then(() => loadAll())
    }
    function onOffline() { setSync('err', 'Offline — changes saved locally') }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [loadAll])

  async function addEntry(data) {
    const entry = { id: genId(), ...data, hasFile: !!data.fileName, fileName: data.fileName || '' }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated))

    const sbEntry = { id: entry.id, date: entry.date, amt: entry.amt, cat: entry.cat, note: entry.note, has_file: entry.hasFile, file_name: entry.fileName }
    if (!navigator.onLine) {
      saveQueue([...queueRef.current, { qid: entry.id, type: 'add', data: sbEntry }])
      setSync('err', 'Offline — will sync when back online')
    } else {
      setSync('busy', 'Saving…')
      try { await sbPost('expenses', sbEntry); setSync('ok', 'Saved · Supabase') }
      catch (e) { saveQueue([...queueRef.current, { qid: entry.id, type: 'add', data: sbEntry }]); setSync('err', 'Queued for retry'); console.error(e) }
    }
  }

  async function removeEntry(id) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated))

    if (!navigator.onLine) {
      saveQueue([...queueRef.current, { qid: 'del_' + id, type: 'delete', id }])
      setSync('err', 'Offline — will sync when back online')
    } else {
      setSync('busy', 'Deleting…')
      try { await sbDelete('expenses', id); setSync('ok', 'Deleted · Supabase') }
      catch (e) { saveQueue([...queueRef.current, { qid: 'del_' + id, type: 'delete', id }]); setSync('err', 'Queued for retry'); console.error(e) }
    }
  }

  async function saveSettings(newSettings) {
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
    const data = [
      { key: 'salary', value: String(newSettings.salary) },
      { key: 'threshold', value: String(newSettings.threshold) },
    ]
    if (!navigator.onLine) {
      saveQueue([...queueRef.current, { qid: 'settings', type: 'settings', data }])
      setSync('err', 'Offline — settings queued')
    } else {
      setSync('busy', 'Saving settings…')
      try { await sbUpsert('settings', data); setSync('ok', 'Settings saved · Supabase') }
      catch (e) { saveQueue([...queueRef.current, { qid: 'settings', type: 'settings', data }]); setSync('err', 'Settings queued'); console.error(e) }
    }
  }

  return { entries, settings, syncState, syncLabel, addEntry, removeEntry, saveSettings, reload: loadAll }
}
