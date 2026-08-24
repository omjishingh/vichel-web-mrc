import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  await ensureDb();
  await db.execute({
    sql: "DELETE FROM vehicles WHERE id = ? AND user_id = ?",
    args: [id, session.id],
  });
  return NextResponse.json({ ok: true });
}
