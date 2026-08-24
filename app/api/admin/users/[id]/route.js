import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { getSession, publicUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const status = body.status === "blocked" ? "blocked" : "active";
  await ensureDb();
  await db.execute({ sql: "UPDATE users SET status = ? WHERE id = ? AND role = 'user'", args: [status, id] });
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [id] });
  return NextResponse.json({ user: r.rows[0] ? publicUser(r.rows[0]) : null });
}

export async function DELETE(_req, { params }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const { id } = await params;
  await ensureDb();
  await db.execute({ sql: "DELETE FROM vehicles WHERE user_id = ?", args: [id] });
  await db.execute({ sql: "DELETE FROM users WHERE id = ? AND role = 'user'", args: [id] });
  return NextResponse.json({ ok: true });
}
