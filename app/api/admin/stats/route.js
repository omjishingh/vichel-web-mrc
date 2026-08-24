import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listSessions } from "@/lib/wa-store";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const waSessions = await listSessions();
  const online = waSessions.filter((s) => s.status === "ready").length;

  if (!db) {
    return NextResponse.json({
      users: 0,
      active: 0,
      blocked: 0,
      vehicles: 0,
      week: 0,
      waSessions: waSessions.length,
      waOnline: online,
      mode: "env",
    });
  }

  await ensureDb();
  const users = await db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'user'");
  const active = await db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'user' AND status = 'active'");
  const blocked = await db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'user' AND status = 'blocked'");
  const vehicles = await db.execute("SELECT COUNT(*) AS c FROM vehicles");
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const recent = await db.execute({
    sql: "SELECT COUNT(*) AS c FROM users WHERE role = 'user' AND created_at >= ?",
    args: [weekAgo],
  });
  return NextResponse.json({
    users: Number(users.rows[0].c || 0),
    active: Number(active.rows[0].c || 0),
    blocked: Number(blocked.rows[0].c || 0),
    vehicles: Number(vehicles.rows[0].c || 0),
    week: Number(recent.rows[0].c || 0),
    waSessions: waSessions.length,
    waOnline: online,
    mode: "db",
  });
}
