import { NextResponse } from "next/server";
import { db, ensureDb, envAdminUser } from "@/lib/db";
import { getSession, publicUser } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  if (session.id === "env-admin") {
    return NextResponse.json({ user: publicUser(envAdminUser()) });
  }
  if (!db) return NextResponse.json({ user: null });
  await ensureDb();
  const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ? LIMIT 1", args: [session.id] });
  const row = r.rows[0];
  if (!row) return NextResponse.json({ user: null });
  return NextResponse.json({ user: publicUser(row) });
}
