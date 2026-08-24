"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const onHome = pathname === "/";

  return (
    <header className="header">
      <div className="wrap header-row">
        <Link className="logo" href="/">
          <Logo />
        </Link>
        <nav className={`nav ${open ? "open" : ""}`}>
          <Link href={onHome ? "#home" : "/#home"} className={onHome ? "is-active" : ""} onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/#about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/#security" onClick={() => setOpen(false)}>
            Security
          </Link>
          <Link href="/#help" onClick={() => setOpen(false)}>
            Help
          </Link>
          {user ? (
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-nav solid" onClick={() => setOpen(false)}>
              {user.role === "admin" ? "Admin" : "My Account"}
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-nav" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn-nav solid" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>
        <button className="menu-btn" type="button" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          ☰
        </button>
      </div>
    </header>
  );
}
