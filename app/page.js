import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="home">
          <div className="hero-rays" aria-hidden="true" />
          <div className="hero-skyline" aria-hidden="true" />
          <div className="wrap hero-row">
            <div className="hero-left">
              <div className="pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10V5l7-3zm-1.2 13.3l5.5-5.5-1.4-1.4-4.1 4.1-2-2-1.4 1.4 3.4 3.4z" />
                </svg>
                Trusted App
              </div>
              <h1>Vichel App</h1>
              <p className="lead">Your One-stop Solution for Vehicle &amp; Transport Services</p>
              <ul className="bullets">
                <li>
                  <span className="b-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
                      <path d="M5 16h14v2H5v-2zm1.5-2l2-6h7l2 6h-11zM8 8h8" />
                      <circle cx="8" cy="18.5" r="1.5" />
                      <circle cx="16" cy="18.5" r="1.5" />
                    </svg>
                  </span>
                  Access your vehicle information
                </li>
                <li>
                  <span className="b-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
                      <path d="M8 6h11M8 12h11M8 18h11M4 6h.01M4 12h.01M4 18h.01" />
                    </svg>
                  </span>
                  Check challan status &amp; pay online
                </li>
                <li>
                  <span className="b-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
                      <path d="M4 6a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                      <path d="M13 4v5h5" />
                    </svg>
                  </span>
                  Access Digital Documents
                </li>
                <li>
                  <span className="b-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
                      <path d="M6 9a6 6 0 1 1 12 0c0 4 1 5 2 6H4c1-1 2-2 2-6z" />
                      <path d="M10 19a2 2 0 0 0 4 0" />
                    </svg>
                  </span>
                  Get timely notifications &amp; alerts
                </li>
              </ul>

              <div className="dl-box">
                <div className="dl-title">Login to Vichel Account</div>
                <div className="stores">
                  <Link className="store play" href="/login">
                    <span>
                      <small>EXISTING USER</small>
                      <b>Login</b>
                    </span>
                  </Link>
                  <Link className="store apple" href="/register">
                    <span>
                      <small>NEW USER</small>
                      <b>Register</b>
                    </span>
                  </Link>
                </div>
                <div className="dl-meta">Secure · Official · Reliable</div>
              </div>
            </div>

            <div className="hero-right">
              <div className="phone">
                <div className="phone-body">
                  <div className="phone-speaker" />
                  <div className="phone-screen">
                    <div className="scr-top">
                      <span className="scr-logo" />
                      <b>Vichel</b>
                    </div>
                    <div className="veh-card">
                      <div className="veh-label">Vehicle Overview</div>
                      <div className="veh-plate">DL01AB1234</div>
                      <div className="veh-art">
                        <svg viewBox="0 0 160 70" width="100%" height="70">
                          <ellipse cx="80" cy="58" rx="55" ry="6" fill="#c5d8f0" opacity=".7" />
                          <path d="M28 48h104c2 0 4-1 5-3l6-14c1-3-1-5-4-5H111l-10-12H59L49 26H25c-3 0-5 2-4 5l6 14c1 2 3 3 5 3z" fill="#1e5bb8" />
                          <path d="M59 26l10 12h32L111 26H59z" fill="#7eb6ef" />
                          <rect x="62" y="28" width="16" height="8" rx="1" fill="#dbeafe" />
                          <rect x="84" y="28" width="16" height="8" rx="1" fill="#dbeafe" />
                          <circle cx="48" cy="48" r="9" fill="#1a1a1a" />
                          <circle cx="48" cy="48" r="4" fill="#94a3b8" />
                          <circle cx="112" cy="48" r="9" fill="#1a1a1a" />
                          <circle cx="112" cy="48" r="4" fill="#94a3b8" />
                        </svg>
                      </div>
                    </div>
                    <div className="svc-grid">
                      <div className="svc">
                        <i>RC</i>
                        <small>Vehicle RC</small>
                      </div>
                      <div className="svc">
                        <i>Challan</i>
                        <small>Check &amp; Pay</small>
                      </div>
                      <div className="svc">
                        <i>DL</i>
                        <small>Driving License</small>
                      </div>
                      <div className="svc">
                        <i>Insurance</i>
                        <small>Policy Details</small>
                      </div>
                      <div className="svc">
                        <i>PUCC</i>
                        <small>Certificate</small>
                      </div>
                      <div className="svc">
                        <i>More</i>
                        <small>Services</small>
                      </div>
                    </div>
                  </div>
                  <div className="phone-bar" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why" id="about">
          <div className="wrap">
            <h2>Why Choose Vichel App?</h2>
            <div className="uline" />
            <div className="why-grid">
              <article>
                <div className="wico">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.5">
                    <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
                    <path d="M9 12l2.2 2.2L15.5 10" />
                  </svg>
                </div>
                <h3>Official &amp; Secure</h3>
                <p>Trusted vehicle service platform with secure handling of your RC, insurance and contact details.</p>
              </article>
              <article>
                <div className="wico">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <h3>Save Time</h3>
                <p>Access vehicle services anytime, anywhere — skip queues and get information in seconds.</p>
              </article>
              <article>
                <div className="wico">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.5">
                    <path d="M8 4h7l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    <path d="M15 4v5h5M9 13h6M9 17h4" />
                  </svg>
                </div>
                <h3>Go Paperless</h3>
                <p>Keep digital copies of RC, DL, insurance and PUCC ready on your phone whenever needed.</p>
              </article>
              <article>
                <div className="wico">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.5">
                    <path d="M6 9a6 6 0 1 1 12 0c0 4 1 5.5 2 6.5H4C5 14.5 6 13 6 9z" />
                    <path d="M10 19a2 2 0 0 0 4 0" />
                  </svg>
                </div>
                <h3>Stay Updated</h3>
                <p>Receive timely alerts for insurance expiry, challans, PUCC renewal and important deadlines.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="sec-wrap" id="security">
          <div className="wrap">
            <div className="sec-card">
              <div className="sec-badge">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 10C7.5 19.5 4 16 4 11V5l8-3zm-1.1 13.2l5.6-5.6-1.4-1.4-4.2 4.2-2.1-2.1-1.4 1.4 3.5 3.5z" />
                </svg>
              </div>
              <div className="sec-copy">
                <h3>Your Data is Safe with Us</h3>
                <p>
                  We follow high security standards. Your vehicle and personal information is encrypted and never shared
                  with unauthorized parties.
                </p>
              </div>
              <div className="sec-illus" aria-hidden="true">
                <div className="mini-phone" />
                <div className="mini-lock">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1a73e8">
                    <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8 0V7a3 3 0 0 1 6 0v2H9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="disclaimer" id="help">
          <div className="wrap">
            <span>
              Disclaimer: This page provides vehicle &amp; insurance service information for users. Always verify
              critical documents through official government portals when required.
            </span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
