import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { listSessions, createSessionSlot, upsertSession, removeSession } from "@/lib/wa-store";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req) {
  const admin = await requireAdminApi(req);
  if (!admin) return cors(NextResponse.json({ error: "Admin only" }, { status: 403 }));
  const sessions = await listSessions();
  return cors(NextResponse.json({ sessions }));
}

export async function POST(req) {
  const admin = await requireAdminApi(req);
  if (!admin) return cors(NextResponse.json({ error: "Admin only" }, { status: 403 }));
  const body = await req.json().catch(() => ({}));
  const slot = await createSessionSlot(body.label);
  return cors(NextResponse.json({ session: slot, sessions: await listSessions() }));
}

export async function PATCH(req) {
  const admin = await requireAdminApi(req);
  if (!admin) return cors(NextResponse.json({ error: "Admin only" }, { status: 403 }));
  const body = await req.json();
  if (!body.id) return cors(NextResponse.json({ error: "id required" }, { status: 400 }));
  await upsertSession(body);
  return cors(NextResponse.json({ sessions: await listSessions() }));
}

export async function DELETE(req) {
  const admin = await requireAdminApi(req);
  if (!admin) return cors(NextResponse.json({ error: "Admin only" }, { status: 403 }));
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return cors(NextResponse.json({ error: "id required" }, { status: 400 }));
  await removeSession(id);
  return cors(NextResponse.json({ sessions: await listSessions() }));
}
