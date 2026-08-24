import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { listSessions, upsertSession } from "@/lib/wa-store";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req) {
  const admin = await requireAdminApi(req);
  if (!admin) return cors(NextResponse.json({ error: "Admin only" }, { status: 403 }));
  const body = await req.json();
  const accounts = Array.isArray(body.accounts) ? body.accounts : [];
  const host = String(body.host || "");
  for (const a of accounts) {
    if (!a?.id) continue;
    await upsertSession({
      id: a.id,
      label: a.label,
      phone: a.phone,
      status: a.status,
      host,
    });
  }
  return cors(NextResponse.json({ ok: true, sessions: await listSessions() }));
}
