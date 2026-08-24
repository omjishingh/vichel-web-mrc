"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const fd = new FormData(e.target);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: fd.get("login"), password: fd.get("password") }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setErr(d.error || "Login failed");
      return;
    }
    if (d.user?.role !== "admin") {
      setErr("This login is not an admin account");
      await fetch("/api/auth/logout", { method: "POST" });
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="auth-page admin-auth">
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="logo" style={{ marginBottom: 16, justifyContent: "center" }}>
          <Logo />
        </div>
        <h1>Admin Panel</h1>
        <p className="auth-sub">Sign in with admin email or mobile.</p>
        {err ? <div className="auth-err">{err}</div> : null}
        <label>Email or mobile</label>
        <input name="login" required placeholder="admin@vichel.app" />
        <label>Password</label>
        <input name="password" type="password" required />
        <button className="btn-primary-block" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Admin login"}
        </button>
        <p className="auth-switch">
          <Link href="/">Back to website</Link>
        </p>
      </form>
    </main>
  );
}
