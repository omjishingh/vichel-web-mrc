import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  await ensureDb();
  const r = await db.execute({
    sql: "SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC",
    args: [session.id],
  });
  return NextResponse.json({ vehicles: r.rows });
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  await ensureDb();
  const body = await req.json();
  const reg = String(body.reg_number || "").trim().toUpperCase();
  const model = String(body.model || "").trim();
  const expiry = String(body.insurance_expiry || "").trim();
  if (reg.length < 4) return NextResponse.json({ error: "Registration number required" }, { status: 400 });

  await db.execute({
    sql: `INSERT INTO vehicles (id, user_id, reg_number, model, insurance_expiry, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [crypto.randomUUID(), session.id, reg, model, expiry, new Date().toISOString()],
  });
  const r = await db.execute({
    sql: "SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC",
    args: [session.id],
  });
  return NextResponse.json({ vehicles: r.rows });
}
