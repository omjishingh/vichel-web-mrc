import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, ensureDb } from "@/lib/db";
import { setSession, publicUser } from "@/lib/auth";

export async function POST(req) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured. Add TURSO_DATABASE_URL on Vercel for registration." },
        { status: 503 }
      );
    }
    await ensureDb();
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const mobile = String(body.mobile || "").replace(/\D/g, "").slice(-10);
    const password = String(body.password || "");
    const vehicle = String(body.vehicle || "").trim().toUpperCase();

    if (name.length < 2) return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Valid 10-digit mobile required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password min 6 characters" }, { status: 400 });
    }

    const dup = await db.execute({
      sql: "SELECT id FROM users WHERE mobile = ? OR (? != '' AND email = ?) LIMIT 1",
      args: [mobile, email, email],
    });
    if (dup.rows.length) {
      return NextResponse.json({ error: "Mobile or email already registered" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);
    await db.execute({
      sql: `INSERT INTO users (id, name, email, mobile, password_hash, role, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'user', 'active', ?)`,
      args: [id, name, email || null, mobile, hash, new Date().toISOString()],
    });

    if (vehicle) {
      await db.execute({
        sql: `INSERT INTO vehicles (id, user_id, reg_number, model, insurance_expiry, created_at)
              VALUES (?, ?, ?, '', '', ?)`,
        args: [crypto.randomUUID(), id, vehicle, new Date().toISOString()],
      });
    }

    const user = { id, name, email: email || null, mobile, role: "user", status: "active" };
    await setSession(user);
    return NextResponse.json({ user: publicUser(user) });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Register failed" }, { status: 500 });
  }
}
