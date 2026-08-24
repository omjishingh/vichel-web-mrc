"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    const me = await (await fetch("/api/auth/me")).json();
    if (!me.user) {
      router.push("/login");
      return;
    }
    setUser(me.user);
    const v = await (await fetch("/api/vehicles")).json();
    setVehicles(v.vehicles || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function addVehicle(e) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.target);
    const r = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reg_number: fd.get("reg_number"),
        model: fd.get("model"),
        insurance_expiry: fd.get("insurance_expiry"),
      }),
    });
    const d = await r.json();
    if (!r.ok) {
      setErr(d.error || "Failed");
      return;
    }
    setVehicles(d.vehicles);
    e.target.reset();
  }

  async function removeVehicle(id) {
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    setVehicles((list) => list.filter((v) => v.id !== id));
  }

  if (!user) return <div className="dash-loading">Loading account…</div>;

  return (
    <div className="dash">
      <aside className="dash-side">
        <Link href="/" className="logo dash-logo">
          <Logo />
        </Link>
        <p className="dash-user">
          <strong>{user.name}</strong>
          <span>+91 {user.mobile}</span>
        </p>
        <nav>
          <span className="is-on">Dashboard</span>
          <Link href="/">Home</Link>
        </nav>
        <button type="button" className="btn-out" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="dash-main">
        <h1>My Account</h1>
        <p className="muted">Manage vehicles linked to your Vichel account.</p>

        <div className="stat-row">
          <div className="mini-stat">
            <span>Vehicles</span>
            <b>{vehicles.length}</b>
          </div>
          <div className="mini-stat">
            <span>Status</span>
            <b>{user.status}</b>
          </div>
        </div>

        <section className="panel-card">
          <h2>Add vehicle</h2>
          {err ? <div className="auth-err">{err}</div> : null}
          <form className="inline-form" onSubmit={addVehicle}>
            <input name="reg_number" required placeholder="Reg. no. DL01AB1234" />
            <input name="model" placeholder="Model (e.g. Swift)" />
            <input name="insurance_expiry" type="date" />
            <button type="submit" className="btn-primary-block sm">
              Add
            </button>
          </form>
        </section>

        <section className="panel-card">
          <h2>Your vehicles</h2>
          {!vehicles.length ? (
            <p className="muted">No vehicles yet. Add your registration number.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Model</th>
                  <th>Insurance expiry</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <strong>{v.reg_number}</strong>
                    </td>
                    <td>{v.model || "—"}</td>
                    <td>{v.insurance_expiry || "—"}</td>
                    <td>
                      <button type="button" className="link-btn" onClick={() => removeVehicle(v.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
