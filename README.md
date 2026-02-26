# Arangar Digital Trust Website

Production-ready Next.js website for annadhanam, volunteer booking, feedback collection, chatbot support, and notification delivery (Email + optional SMS).

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

4. Start dev server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

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

### Optional for SMS Notifications (Twilio)

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `NOTIFY_PHONE` (default: `+919363616263`)

If email and Twilio are both configured, form submissions send both email and SMS.

## Deployment on Another Machine

1. Copy project folder.
2. Install Docker.
3. Create `.env.local` from `.env.example`.
4. Run either:
	 - `docker build ...` + `docker run ...`, or
	 - `docker compose up -d --build`.

Your site will run with all required runtime packages inside the container.
