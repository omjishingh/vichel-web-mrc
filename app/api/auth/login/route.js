import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureDb, verifyEnvAdmin, hasTurso } from "@/lib/db";
import { setSession, publicUser, signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const login = String(body.login || body.username || body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!login || !password) {
      return NextResponse.json({ error: "Login and password required" }, { status: 400 });
    }

    // Vercel without Turso: env admin works immediately
    if (!db) {
      const admin = await verifyEnvAdmin(login, password);
      if (!admin) return NextResponse.json({ error: "Wrong login or password" }, { status: 401 });
      const token = await signToken({ id: admin.id, role: admin.role, name: admin.name });
      const res = NextResponse.json({ user: publicUser(admin), token, mode: "env" });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    await ensureDb();
    const mobile = login.replace(/\D/g, "").slice(-10);
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE lower(email) = ? OR mobile = ? LIMIT 1",
      args: [login, mobile],
    });
    let row = result.rows[0];

    if (!row) {
      const admin = await verifyEnvAdmin(login, password);
      if (admin) {
        const token = await signToken({ id: admin.id, role: admin.role, name: admin.name });
        const res = NextResponse.json({ user: publicUser(admin), token, mode: "env" });
        res.headers.set("Access-Control-Allow-Origin", "*");
        return res;
      }
      return NextResponse.json({ error: "Account not found" }, { status: 401 });
    }

    if (row.status !== "active") {
      return NextResponse.json({ error: "Account blocked. Contact support." }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

    const token = await signToken({
      id: row.id,
      role: row.role,
      name: row.name,
    });
    await setSession(row);
    const res = NextResponse.json({
      user: publicUser(row),
      token,
      mode: hasTurso ? "turso" : "local",
    });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
