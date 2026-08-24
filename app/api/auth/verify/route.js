import { NextResponse } from "next/server";
import { db, ensureDb, envAdminUser } from "@/lib/db";
import { verifyToken, publicUser } from "@/lib/auth";

export async function GET(req) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return NextResponse.json({ user: null }, { status: 401 });
  try {
    const session = await verifyToken(token);
    if (session.id === "env-admin") {
      return NextResponse.json({ user: publicUser(envAdminUser()) });
    }
    if (!db) return NextResponse.json({ user: null }, { status: 401 });
    await ensureDb();
    const r = await db.execute({ sql: "SELECT * FROM users WHERE id = ? LIMIT 1", args: [session.id] });
    const row = r.rows[0];
    if (!row || row.status !== "active") return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: publicUser(row) });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
