import { db, ensureDb } from "./db";

const g = globalThis;
if (!g.__vichelWaSessions) g.__vichelWaSessions = [];

function mem() {
  return g.__vichelWaSessions;
}

export async function listSessions() {
  if (db) {
    await ensureDb();
    const r = await db.execute("SELECT * FROM wa_sessions ORDER BY id ASC");
    return r.rows;
  }
  return mem();
}

export async function upsertSession(row) {
  const rec = {
    id: String(row.id),
    label: String(row.label || row.id),
    phone: String(row.phone || ""),
    status: String(row.status || "disconnected"),
    claim_code: row.claim_code || "",
    assigned_to: String(row.assigned_to || ""),
    host: String(row.host || ""),
    updated_at: new Date().toISOString(),
  };
  if (db) {
    await ensureDb();
    await db.execute({
      sql: `INSERT INTO wa_sessions (id, label, phone, status, claim_code, assigned_to, host, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              label=excluded.label,
              phone=excluded.phone,
              status=excluded.status,
              host=excluded.host,
              updated_at=excluded.updated_at`,
      args: [rec.id, rec.label, rec.phone, rec.status, rec.claim_code, rec.assigned_to, rec.host, rec.updated_at],
    });
    return rec;
  }
  const i = mem().findIndex((s) => s.id === rec.id);
  if (i >= 0) mem()[i] = { ...mem()[i], ...rec };
  else mem().push(rec);
  return rec;
}

export async function createSessionSlot(label) {
  const list = await listSessions();
  const nums = list.map((s) => parseInt(String(s.id).replace("wa-", ""), 10) || 0);
  const next = Math.max(0, ...nums) + 1;
  const id = `wa-${next}`;
  const claim_code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return upsertSession({
    id,
    label: label || `WhatsApp ${next}`,
    status: "issued",
    claim_code,
  });
}

export async function removeSession(id) {
  if (db) {
    await ensureDb();
    await db.execute({ sql: "DELETE FROM wa_sessions WHERE id = ?", args: [id] });
    return;
  }
  g.__vichelWaSessions = mem().filter((s) => s.id !== id);
}
