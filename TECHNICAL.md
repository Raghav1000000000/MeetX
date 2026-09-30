# MeetX Technical Documentation

## Architecture

```text
apps/mobile      Expo Router + React Native user app
apps/admin       React + Vite desktop admin dashboard
server           Express + TypeScript API
packages/shared  Shared TypeScript domain types
```

The current development API uses an in-memory repository seeded from `server/src/data.ts`. This keeps local development fast and deterministic. The repository boundary is isolated in the API data module so MongoDB persistence can be introduced without changing the clients.

## Runtime

| Service | Default URL | Responsibility |
| --- | --- | --- |
| Mobile web / Expo | `http://localhost:8082` | User experience |
| Admin | `http://localhost:5173` | Owner operations |
| API | `http://localhost:4000` | Auth, discovery, requests, chats, meetups, offers |

## Authentication

`POST /api/auth/signup` accepts `accountName`, `name`, `email`, and `password`. Account names and emails are unique. New passwords use Node `scrypt` with a random salt. Seeded development credentials use a marked demo hash format so the local test accounts remain easy to use.

`POST /api/auth/login` accepts `accountName` and `password`. Public user responses are created with a password-stripping serializer; `passwordHash` is never returned to clients.

The current token is a development token. Production deployment must replace it with signed sessions or JWTs, add refresh/revocation behavior, and enforce authorization middleware on private and admin routes.

## MeetX Identity

- `meetxId` is the user-facing MeetX identifier for profiles and detail views.
- `dbIndexKey` is the canonical cross-record database index key. The owner seed uses `MX-YR-0000`.
- Database IDs must not be rendered in the UI.

## API Routes

### Auth and users

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/demo`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`

### Discovery and social graph

- `GET /api/discover?userId=&mode=professional|social`
- `GET /api/requests?userId=`
- `POST /api/requests`
- `PATCH /api/requests/:id`
- `GET /api/chats`
- `GET /api/chats/:id/messages`
- `POST /api/chats/:id/messages`

Discovery filters by active status, request history, and the selected profile live flag (`liveProfessional` or `liveSocial`).

### Local activity

- `GET /api/meetups`
- `POST /api/meetups/:id/join`
- `POST /api/meetups/:id/leave`
- `GET /api/offers`
- `POST /api/offers/:id/use`

### Admin operations

- `GET /api/admin/overview`
- `GET /api/reports`
- `PATCH /api/reports/:id`
- `POST /api/meetups`
- `DELETE /api/meetups/:id`
- `POST /api/offers`
- `DELETE /api/offers/:id`

## Environment

See `.env.example`:

- `PORT`: API port
- `MONGODB_URI`: reserved for the MongoDB repository adapter
- `VITE_API_URL`: admin API base URL
- `EXPO_PUBLIC_API_URL`: mobile API base URL

For a physical phone, `EXPO_PUBLIC_API_URL` must use the computer's LAN IP instead of `localhost`.

## Production Follow-up

1. Replace the in-memory repository with MongoDB collections and indexes.
2. Add signed authentication tokens and server-side admin authorization.
3. Move password hashing and secrets to a dedicated auth service or hardened repository layer.
4. Add request ownership checks, block/report enforcement, rate limits, and audit logs.
5. Add automated API tests and native Android/iOS integration tests.