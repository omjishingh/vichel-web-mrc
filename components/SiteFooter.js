export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <div className="f-left">
          <div className="f-emblem" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="42" height="42">
              <circle cx="32" cy="32" r="30" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".5" />
              <path d="M32 12c-2 6-6 10-10 12 4 2 8 6 10 12 2-6 6-10 10-12-4-2-8-6-10-12z" fill="#fff" />
              <path d="M20 44h24M22 48h20M26 52h12" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <b>Vichel Services</b>
            <small>Vehicle Insurance &amp; Transport Solutions, India</small>
          </div>
        </div>
        <div className="f-links">
          <a href="/#security">Privacy Policy</a>
          <span>|</span>
          <a href="/#help">Terms of Use</a>
          <span>|</span>
          <a href="/login">Login</a>
        </div>
      </div>
    </footer>
  );
}
