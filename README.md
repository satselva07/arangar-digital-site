# Arangar Digital Trust Website

Production-ready Next.js website for annadhanam, volunteer booking, feedback collection, chatbot support, and notification delivery (Email + optional SMS).

## Dynamic Backend (Phase 1 and 2)

This project now includes:

- Prisma + PostgreSQL persistence for volunteer bookings, enquiries, FAQ data, and chat logs.
- NextAuth admin authentication with role-based route protection.
- Protected admin dashboard at `/admin` (not available to public users).
- Notification status tracking (`SENT`/`FAILED`/`SKIPPED`) with retry actions in admin.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create env file from template:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` values.

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev --name init
```

6. Start dev server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000).

## Admin Access

- Login URL: `/login`
- Dashboard URL: `/admin`
- Credentials come from `.env.local`:
	- `ADMIN_USERNAME`
	- `ADMIN_PASSWORD`

Only authenticated admin users can access `/admin`. Middleware blocks public access.

## Admin 2FA (Email OTP + Authenticator)

Admin login now supports two-factor authentication.

- Set `ADMIN_2FA_REQUIRED=true` to enforce OTP.
- Use `Send OTP to Admin Email` button on `/login` to receive email OTP.
- Optionally set `ADMIN_TOTP_SECRET` to accept authenticator app codes as well.

When both are enabled, either valid email OTP or authenticator code can complete login.

## Docker (Single Container)

### Build image

```bash
docker build -t arangar-digital:latest .
```

### Run container

```bash
docker run --name arangar-digital \
	--env-file .env.local \
	-p 3000:3000 \
	arangar-digital:latest
```

Then open [http://localhost:3000](http://localhost:3000).

## Docker Compose

```bash
docker compose up -d --build
```

This uses `docker-compose.yml` and reads environment values from `.env.local`.

## GitHub Pages (Free Static Hosting)

This repo includes a workflow at `.github/workflows/deploy-github-pages.yml` to deploy automatically to GitHub Pages.

### Steps

1. Push this project to a GitHub repository.
2. Ensure your default branch is `main` (or update the workflow branch).
3. In GitHub repository settings:
	- Open `Settings` → `Pages`
	- Set source to `GitHub Actions`
4. Push to `main` (or run the workflow manually from Actions).

### Static-mode limitations (important)

When deployed on GitHub Pages, the app runs in static mode and these features are disabled:

- Chatbot API replies
- Volunteer booking submission API
- Feedback submission API
- Email and SMS notification triggers

The UI now shows a clear static-mode notice and disables those server-dependent actions.

## One-Click Deploy Scripts

### Windows (PowerShell)

```powershell
./scripts/deploy.ps1
```

Optional args:

```powershell
./scripts/deploy.ps1 -HostPort 3001 -EnvFile .env.local -ImageName arangar-digital:latest
```

Build only:

```powershell
./scripts/deploy.ps1 -BuildOnly
```

### Linux/macOS

```bash
chmod +x ./scripts/deploy.sh
./scripts/deploy.sh
```

Optional args:

```bash
./scripts/deploy.sh --port 3001 --env-file .env.local --image arangar-digital:latest
```

Build only:

```bash
./scripts/deploy.sh --build-only
```

## Environment Variables

### Required for Email Notifications

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NOTIFY_EMAIL` (default: `reachsatselva@gmail.com`)

### Required for Database + Admin Authentication

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL` (optional but recommended)

### Admin 2FA Variables

- `ADMIN_2FA_REQUIRED` (`true`/`false`)
- `ADMIN_OTP_TTL_MINUTES` (default `10`)
- `ADMIN_TOTP_SECRET` (optional for authenticator apps)

### Optional for SMS Notifications (Twilio)

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `NOTIFY_PHONE` (default: `+919363616263`)

### Optional for Telegram Notifications (Free Mobile Alerts)

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

If email and Twilio are both configured, form submissions send both email and SMS.
If Telegram is configured, notifications are also pushed to Telegram.

## Deployment on Another Machine

1. Copy project folder.
2. Install Docker.
3. Create `.env.local` from `.env.example`.
4. Run either:
	 - `docker build ...` + `docker run ...`, or
	 - `docker compose up -d --build`.

Your site will run with all required runtime packages inside the container.
