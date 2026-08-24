export default function Logo() {
  return (
    <>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="44" height="44">
          <rect width="48" height="48" rx="8" fill="#c62828" />
          <path d="M10 28h28v3.5H10V28zm3-2.5l2.2-6.5h17.6l2.2 6.5H13zm4.5-8.5c0-1.2.9-2.2 2-2.2h9c1.1 0 2 1 2 2.2v1.5H17.5V17z" fill="#fff" />
          <circle cx="16" cy="31" r="3.2" fill="#fff" />
          <circle cx="16" cy="31" r="1.4" fill="#c62828" />
          <circle cx="32" cy="31" r="3.2" fill="#fff" />
          <circle cx="32" cy="31" r="1.4" fill="#c62828" />
        </svg>
      </span>
      <span className="logo-text">
        <b>Vichel</b>
        <em>A step to virtual world</em>
      </span>
    </>
  );
}
