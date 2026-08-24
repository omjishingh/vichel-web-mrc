"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isReg = mode === "register";
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const fd = new FormData(e.target);
    const body = isReg
      ? {
          name: fd.get("name"),
          email: fd.get("email"),
          mobile: fd.get("mobile"),
          password: fd.get("password"),
          vehicle: fd.get("vehicle"),
        }
      : { login: fd.get("login"), password: fd.get("password") };

    const r = await fetch(isReg ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) {
      setErr(d.error || "Failed");
      return;
    }
    router.push(d.user?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1>{isReg ? "Create your account" : "Login to Vichel"}</h1>
      <p className="auth-sub">
        {isReg ? "Register with mobile to access vehicle services." : "Use your mobile number or email."}
      </p>
      {err ? <div className="auth-err">{err}</div> : null}

      {isReg ? (
        <>
          <label>Full name</label>
          <input name="name" required placeholder="Your name" />
          <label>Mobile number</label>
          <input name="mobile" required inputMode="numeric" placeholder="9876543210" />
          <label>Email (optional)</label>
          <input name="email" type="email" placeholder="you@email.com" />
          <label>Vehicle number (optional)</label>
          <input name="vehicle" placeholder="DL01AB1234" />
          <label>Password</label>
          <input name="password" type="password" required minLength={6} placeholder="Min 6 characters" />
        </>
      ) : (
        <>
          <label>Mobile or email</label>
          <input name="login" required placeholder="9876543210" />
          <label>Password</label>
          <input name="password" type="password" required placeholder="Password" />
        </>
      )}

      <button className="btn-primary-block" type="submit" disabled={busy}>
        {busy ? "Please wait…" : isReg ? "Register" : "Login"}
      </button>

      <p className="auth-switch">
        {isReg ? (
          <>
            Already have an account? <Link href="/login">Login</Link>
          </>
        ) : (
          <>
            New user? <Link href="/register">Create account</Link>
          </>
        )}
      </p>
    </form>
  );
}
