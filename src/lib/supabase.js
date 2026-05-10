import { SB_URL, SB_KEY } from './constants'

function headers() {
  return {
    apikey: SB_KEY,
    Authorization: 'Bearer ' + SB_KEY,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  }
}

export async function sbGet(table, params = '') {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, { headers: headers() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function sbPost(table, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST', headers: headers(), body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function sbDelete(table, id) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE', headers: headers(),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function sbUpsert(table, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
}
