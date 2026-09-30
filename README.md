# MeetX

MeetX is a mobile-first professional and social discovery app for meeting interesting people nearby. It includes an Expo user app, a React/Vite admin dashboard, an Express API, shared TypeScript types, seeded profiles, requests, chats, meetups, offers, and reports.

## Quick Start

Requirements: Node.js 20+, npm 10+, and Expo Go for native mobile testing.

```bash
npm install
npm run dev
```

Open the admin dashboard at `http://localhost:5173`.

Run the user app separately:

```bash
npm run mobile
```

For browser testing, start Expo web from `apps/mobile` and open `http://localhost:8082`.

The API runs at `http://localhost:4000`. Health check: `http://localhost:4000/api/health`.

## Demo Accounts

| Account | Password | MeetX ID | Use |
| --- | --- | --- | --- |
| `raghav` | `password` | `MX-0001` | Owner/admin demo account |
| `meetxtest` | `MeetXtest123` | `MX-0006` | User flow test account |

New accounts use a unique account name and email. MeetX IDs are generated for database indexing and shown on profile/detail surfaces.

## Workspace Commands

```bash
npm run dev       # API and admin together
npm run server    # API only
npm run admin     # Admin dashboard only
npm run mobile    # Expo user app
npm run build     # Production build for API and admin
npm run seed      # Print seed status
```

Copy `.env.example` to `.env` before configuring a deployment. Never commit `.env` or credentials.

## Product Flows

- Account signup and login with unique account names
- Professional and Social discovery modes with separate live presence
- Stacked profile discovery and full profile detail pages
- Meeting requests with accept/decline states
- Temporary and connected chats with messages
- Profile editing, Professional/Social cards, availability, and visibility controls
- Separate Meetups and Offers pages
- Admin users, requests, reports, meetups, offers, and settings surfaces

See [TECHNICAL.md](TECHNICAL.md) for architecture, API routes, data contracts, and deployment notes.
