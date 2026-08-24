import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

export const hasTurso = Boolean(process.env.TURSO_DATABASE_URL);

function makeClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url) {
    return createClient({ url, authToken });
  }
  // Local only — Vercel filesystem is read-only / ephemeral
  if (process.env.VERCEL) {
    return null;
  }
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "vichel.db").replace(/\\/g, "/");
  return createClient({ url: `file:${file}` });
}

export const db = makeClient();

let ready = null;

export function envAdminUser() {
  return {
    id: "env-admin",
    name: process.env.ADMIN_NAME || "Vichel Admin",
    email: (process.env.ADMIN_EMAIL || "admin@vichel.app").toLowerCase(),
    mobile: process.env.ADMIN_MOBILE || "9999999999",
    role: "admin",
    status: "active",
    created_at: new Date().toISOString(),
  };
}

export async function verifyEnvAdmin(login, password) {
  const admin = envAdminUser();
  const okLogin =
    login === admin.email ||
    login === admin.mobile ||
    login === "admin";
  if (!okLogin) return null;
  const expected = process.env.ADMIN_PASSWORD || "Admin@12345";
  if (password !== expected) return null;
  return admin;
}

export async function ensureDb() {
  if (!db) return null;
  if (ready) return ready;
  ready = (async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        mobile TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS wa_sessions (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        phone TEXT DEFAULT '',
        status TEXT DEFAULT 'disconnected',
        claim_code TEXT,
        assigned_to TEXT DEFAULT '',
        host TEXT DEFAULT '',
        updated_at TEXT NOT NULL
      )
    `);
    const email = (process.env.ADMIN_EMAIL || "admin@vichel.app").toLowerCase();
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE role = 'admin' LIMIT 1",
      args: [],
    });
    if (!existing.rows.length) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 10);
      await db.execute({
        sql: `INSERT INTO users (id, name, email, mobile, password_hash, role, status, created_at)
              VALUES (?, ?, ?, ?, ?, 'admin', 'active', ?)`,
        args: [
          crypto.randomUUID(),
          process.env.ADMIN_NAME || "Vichel Admin",
          email,
          process.env.ADMIN_MOBILE || "9999999999",
          hash,
          new Date().toISOString(),
        ],
      });
    }
  })();
  return ready;
}
