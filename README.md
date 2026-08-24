# Vichel Web (Vercel)

User login + dashboard + admin panel. WhatsApp broadcast panel is **not** included — it needs a normal Node server (Puppeteer cannot run on Vercel).

## Local

```
cd vichel-web
npm install
npm run dev
```

Open http://localhost:3000

- User: Register / Login
- Admin: http://localhost:3000/admin/login  
  Email: `admin@vichel.app`  
  Password: `Admin@12345`

## Deploy on Vercel (free)

1. Create a free DB on [Turso](https://app.turso.tech) (Vercel file storage is not persistent).
2. Push this `vichel-web` folder to GitHub.
3. Import the repo on [vercel.com](https://vercel.com) — Root Directory = `vichel-web`.
4. Add environment variables:

```
AUTH_SECRET=<long random string>
ADMIN_EMAIL=admin@vichel.app
ADMIN_PASSWORD=<strong password>
ADMIN_MOBILE=9999999999
TURSO_DATABASE_URL=libsql://xxxx.turso.io
TURSO_AUTH_TOKEN=<turso token>
```

5. Deploy. Live URL will be `https://your-project.vercel.app`
