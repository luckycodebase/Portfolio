# Lucky Portfolio (React + Vite)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Luckyraj9295%2FPortfolio-181717?logo=github)](https://github.com/Luckyraj9295/Portfolio)
[![Last Commit](https://img.shields.io/github/last-commit/Luckyraj9295/Portfolio)](https://github.com/Luckyraj9295/Portfolio/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/Luckyraj9295/Portfolio)](https://github.com/Luckyraj9295/Portfolio)
[![Stars](https://img.shields.io/github/stars/Luckyraj9295/Portfolio?style=social)](https://github.com/Luckyraj9295/Portfolio/stargazers)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.thatsluckyy.netlify.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)

Modern personal portfolio website with project/certificate showcase, Firebase-powered comments, Cloudinary profile image upload, and a Netlify Function contact form powered by Resend.

## Features

- Responsive portfolio UI built with React + Tailwind CSS
- Project and certificate sections
- Comment system using Firestore (with optional profile image upload)
- Contact form that sends emails via Netlify Functions + Resend
- AOS animations and polished UI components

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS
- Firebase (Firestore)
- Cloudinary
- Netlify Functions
- Resend
- SweetAlert2
- Material UI / Lucide React

## Project Structure

```text
src/
  components/
  data/
  Pages/
  firebase.js
netlify/
  functions/
    send-email.js
```

## Prerequisites

- Node.js 18+ (recommended: 18.x)
- npm

## Getting Started

1. Clone repository

```bash
git clone https://github.com/Luckyraj9295/Portfolio.git
cd "Portofolio Update 2"
```

2. Install dependencies

```bash
npm install --legacy-peer-deps
```

3. Create local env file

```bash
cp .env.example .env.local
```

4. Fill all values in `.env.local`

5. Run development server

```bash
npm run dev
```

6. Build for production

```bash
npm run build
```

## Environment Variables

Use these variables in `.env.local` and in Netlify environment settings:

```dotenv
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name_here
RESEND_API_KEY=your_resend_key_here
```

## Netlify Deployment

This project is configured for Netlify using `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Build env flag: `NPM_FLAGS=--legacy-peer-deps`

### Deploy steps

1. Connect this GitHub repo to Netlify
2. Add all environment variables in Netlify dashboard
3. Trigger deploy
4. Test contact form and comments on production URL

## Security Notes

- Never commit `.env`, `.env.local`, or API keys
- Keep only placeholder values in `.env.example`
- `dist/` and `.netlify/` are ignored to avoid committing build artifacts

## Common Troubleshooting

### Contact form returns 500/502

- Check Netlify Function logs (`send-email`)
- Verify `RESEND_API_KEY` is set in Netlify
- Confirm request body includes `name`, `email`, and `message`

### Build issues with dependencies

Use:

```bash
npm install --legacy-peer-deps
```

Then rebuild:

```bash
npm run build
```

## License

This project is for personal portfolio use. Please keep attribution if you reuse substantial parts.

