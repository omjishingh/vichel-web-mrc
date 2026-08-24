"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [q, setQ] = useState("");
  const [newLabel, setNewLabel] = useState("");

  async function load(query = "") {
    const [st, us, sess] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch(`/api/admin/users?q=${encodeURIComponent(query)}`).then((r) => r.json()),
      fetch("/api/wa/sessions").then((r) => r.json()),
    ]);
    if (st.error) {
      router.push("/admin/login");
      return;
    }
    setStats(st);
    setUsers(us.users || []);
    setSessions(sess.sessions || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(() => load(q), 15000);
    return () => clearInterval(t);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function createSession() {
    const r = await fetch("/api/wa/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel }),
    });
    const d = await r.json();
    if (!r.ok) return alert(d.error || "Failed");
    setNewLabel("");
    setSessions(d.sessions || []);
    if (d.session) alert(`Session created: ${d.session.id}\nGive this ID to the PC panel.`);
  }

  async function deleteSession(id) {
    if (!confirm(`Delete ${id}?`)) return;
    const r = await fetch(`/api/wa/sessions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const d = await r.json();
    setSessions(d.sessions || []);
  }

  async function setStatus(id, status) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load(q);
  }

  async function remove(id) {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    load(q);
  }

  return (
    <div className="dash admin">
      <aside className="dash-side">
        <Link href="/" className="logo dash-logo">
          <Logo />
        </Link>
        <p className="dash-user">
          <strong>Admin</strong>
          <span>Vichel control</span>
        </p>
        <nav>
          <span className="is-on">Users</span>
          <Link href="/">Website</Link>
        </nav>
        <button type="button" className="btn-out" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="dash-main">
        <h1>Admin panel</h1>
        <p className="muted">Registered users, vehicles and account status.</p>

        <div className="stat-row">
          <div className="mini-stat">
            <span>Users</span>
            <b>{stats?.users ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>Active</span>
            <b>{stats?.active ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>Blocked</span>
            <b>{stats?.blocked ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>Vehicles</span>
            <b>{stats?.vehicles ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>New (7d)</span>
            <b>{stats?.week ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>WA Sessions</span>
            <b>{stats?.waSessions ?? "—"}</b>
          </div>
          <div className="mini-stat">
            <span>WA Online</span>
            <b>{stats?.waOnline ?? "—"}</b>
          </div>
        </div>

        <section className="panel-card">
          <div className="table-head">
            <h2>WhatsApp session IDs</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createSession();
              }}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label (e.g. Office WA)"
              />
              <button className="btn-primary-block sm" type="submit">
                Create ID
              </button>
            </form>
          </div>
          <p className="muted" style={{ marginBottom: 12 }}>
            Admin yahan ID banata hai. Local WP panel 20s mein sync karke yeh session le leta hai. QR/login Chrome profile PC pe rehta hai.
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Label</th>
                <th>Phone</th>
                <th>Status</th>
                <th>PC</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!sessions.length ? (
                <tr>
                  <td colSpan={7} className="muted">
                    No sessions yet — Create ID, then open WP panel
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.id}</strong>
                      {s.claim_code ? (
                        <div className="muted" style={{ fontSize: 11 }}>
                          code {s.claim_code}
                        </div>
                      ) : null}
                    </td>
                    <td>{s.label}</td>
                    <td>{s.phone ? `+${s.phone}` : "—"}</td>
                    <td>
                      <span className={`pill-status ${s.status === "ready" ? "active" : "blocked"}`}>{s.status}</span>
                    </td>
                    <td>{s.host || "—"}</td>
                    <td>{String(s.updated_at || "").replace("T", " ").slice(0, 16)}</td>
                    <td>
                      <button type="button" className="link-btn" onClick={() => navigator.clipboard.writeText(s.id)}>
                        Copy ID
                      </button>
                      <button type="button" className="link-btn danger" onClick={() => deleteSession(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="panel-card">
          <div className="table-head">
            <h2>Users</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                load(q);
              }}
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, mobile, email"
              />
            </form>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Vehicles</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!users.length ? (
                <tr>
                  <td colSpan={7} className="muted">
                    No users yet
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.mobile}</td>
                    <td>{u.email || "—"}</td>
                    <td>{u.vehicle_count}</td>
                    <td>
                      <span className={`pill-status ${u.status}`}>{u.status}</span>
                    </td>
                    <td>{String(u.created_at || "").slice(0, 10)}</td>
                    <td className="row-actions">
                      {u.status === "active" ? (
                        <button type="button" className="link-btn" onClick={() => setStatus(u.id, "blocked")}>
                          Block
                        </button>
                      ) : (
                        <button type="button" className="link-btn" onClick={() => setStatus(u.id, "active")}>
                          Unblock
                        </button>
                      )}
                      <button type="button" className="link-btn danger" onClick={() => remove(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
