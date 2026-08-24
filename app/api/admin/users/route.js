import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { getSession, publicUser } from "@/lib/auth";

export async function GET(req) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  if (!db) return NextResponse.json({ users: [] });
  await ensureDb();
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  let result;
  if (q) {
    const like = `%${q}%`;
    result = await db.execute({
      sql: `SELECT u.*,
            (SELECT COUNT(*) FROM vehicles v WHERE v.user_id = u.id) AS vehicle_count
            FROM users u
            WHERE u.role = 'user' AND (u.name LIKE ? OR u.mobile LIKE ? OR IFNULL(u.email,'') LIKE ?)
            ORDER BY u.created_at DESC LIMIT 200`,
      args: [like, like, like],
    });
  } else {
    result = await db.execute(`
      SELECT u.*,
        (SELECT COUNT(*) FROM vehicles v WHERE v.user_id = u.id) AS vehicle_count
      FROM users u
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC LIMIT 200
    `);
  }
  return NextResponse.json({
    users: result.rows.map((row) => ({ ...publicUser(row), vehicle_count: Number(row.vehicle_count || 0) })),
  });
}
