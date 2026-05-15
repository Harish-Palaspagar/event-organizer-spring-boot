# Event Ticket Platform

A full-stack event ticketing application for publishing events, selling tickets, generating QR codes, and validating attendees. The project uses a React/Vite frontend, a Spring Boot backend, PostgreSQL for persistence, and Keycloak for authentication and role-based access.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Services](#local-services)
- [Keycloak Setup](#keycloak-setup)
- [Run the Application](#run-the-application)
- [Frontend Routes](#frontend-routes)
- [Backend API](#backend-api)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database](#database)
- [Development Commands](#development-commands)
- [Troubleshooting](#troubleshooting)

## Features

### Attendees

- Browse published events.
- Search published events.
- View event details and ticket types.
- Log in with Keycloak.
- Purchase tickets.
- View purchased tickets.
- View ticket QR codes.

### Organizers

- Log in from the organizer landing page.
- Go directly to the create-event page after organizer login.
- Create events.
- List organizer-owned events.
- Edit existing events.
- Delete events.
- Manage ticket types as part of event creation/update.

### Staff

- Validate tickets manually.
- Validate tickets by scanning QR codes.

### Platform

- Keycloak-backed OIDC login.
- JWT bearer-token API security.
- Automatic user provisioning from authenticated JWTs.
- PostgreSQL persistence.
- Adminer database UI.
- Vite development proxy from `/api` to Spring Boot.

## Architecture

```text
Browser
  |
  | http://localhost:5173
  v
React + Vite frontend
  |
  | /api/* proxied by Vite
  v
Spring Boot API
  |
  | JWT issuer validation
  v
Keycloak realm: event-ticket-platform
  |
  | JPA
  v
PostgreSQL
```

Default local ports:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8080` |
| PostgreSQL | `localhost:5433` |
| Adminer | `http://localhost:8888` |
| Keycloak | `http://localhost:9090` |

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- `react-oidc-context` and `oidc-client-ts`
- Tailwind CSS
- Radix UI components
- Lucide icons
- QR scanner support via `@yudiel/react-qr-scanner`

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Security
- Spring OAuth2 Resource Server
- Spring Data JPA
- PostgreSQL
- H2 dependency available for testing/dev extension
- MapStruct
- Lombok
- ZXing for QR code generation

### Infrastructure

- Docker Compose
- PostgreSQL
- Adminer
- Keycloak

## Project Structure

```text
.
├── frontend/                 # React/Vite frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Shared UI and route guards
│   │   ├── domain/           # Frontend TypeScript domain types
│   │   ├── hooks/            # Auth/role helpers
│   │   ├── lib/              # API client helpers
│   │   └── pages/            # Route pages
│   ├── package.json
│   └── vite.config.ts
│
├── ticket-app/               # Spring Boot backend
│   ├── docker-compose.yml    # Postgres, Adminer, Keycloak
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/harish/tickets/
│       │   ├── configs/      # Security/JWT config
│       │   ├── controllers/  # REST endpoints
│       │   ├── domains/      # Requests, DTOs, entities
│       │   ├── filters/      # User provisioning filter
│       │   ├── mappers/      # MapStruct mappers
│       │   ├── repositories/ # JPA repositories
│       │   ├── services/     # Business logic
│       │   └── utils/        # JWT utilities
│       └── resources/
│           └── application.properties
│
└── README.md
```

## Prerequisites

Install these before running the project:

- Java 21
- Node.js 20 or newer
- npm
- Docker Desktop
- Git Bash, PowerShell, or another terminal

The backend uses Maven Wrapper, so a separate Maven installation is not required.

## Local Services

The backend folder contains Docker Compose for PostgreSQL, Adminer, and Keycloak.

Start local infrastructure:

```powershell
cd ticket-app
docker compose up -d
```

Stop local infrastructure:

```powershell
cd ticket-app
docker compose down
```

Reset all local service data, including the database and Keycloak data:

```powershell
cd ticket-app
docker compose down -v
```

## Keycloak Setup

Keycloak runs at:

```text
http://localhost:9090
```

Default admin credentials from `docker-compose.yml`:

```text
Username: admin
Password: admin
```

### 1. Create Realm

Create a realm named:

```text
event-ticket-platform
```

The frontend and backend are configured to use this issuer:

```text
http://localhost:9090/realms/event-ticket-platform
```

### 2. Create Client

Create a client named:

```text
event-ticket-platform-app
```

Recommended client settings for local development:

| Setting | Value |
| --- | --- |
| Client type | OpenID Connect |
| Client authentication | Off |
| Authorization | Off |
| Standard flow | On |
| Direct access grants | Optional |
| Valid redirect URIs | `http://localhost:5173/callback` |
| Valid post logout redirect URIs | `http://localhost:5173/*` |
| Web origins | `http://localhost:5173` |

The frontend OIDC config is in `frontend/src/main.tsx`:

```ts
const oidcConfig = {
  authority: "http://localhost:9090/realms/event-ticket-platform",
  client_id: "event-ticket-platform-app",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "openid profile email",
};
```

### 3. Create Realm Roles

Create these realm roles:

```text
ROLE_ORGANIZER
ROLE_STAFF
```

The backend reads roles from the JWT `realm_access.roles` claim and only maps roles that start with `ROLE_`.

### 4. Create Users

Create users for testing, set passwords, and assign roles.

Suggested local users:

| User | Roles | Purpose |
| --- | --- | --- |
| organizer user | `ROLE_ORGANIZER` | Create and manage events |
| staff user | `ROLE_STAFF` | Validate tickets |
| attendee user | none required | Browse and buy tickets |

Make sure each user has a password set under Keycloak credentials.

## Run the Application

### 1. Start Infrastructure

```powershell
cd ticket-app
docker compose up -d
```

### 2. Start Backend

In a new terminal:

```powershell
cd ticket-app
.\mvnw.cmd spring-boot:run
```

The API starts on:

```text
http://localhost:8080
```

### 3. Install Frontend Dependencies

In a new terminal:

```powershell
cd frontend
npm ci --legacy-peer-deps
```

`--legacy-peer-deps` is currently needed because `react-day-picker@8.10.1` declares React 16/17/18 peer support while this app uses React 19.

### 4. Start Frontend

```powershell
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Frontend Routes

| Route | Purpose | Auth Required |
| --- | --- | --- |
| `/` | Attendee landing page and published event browsing | No |
| `/organizers` | Organizer landing page | No |
| `/login` | Starts Keycloak login | No |
| `/callback` | OIDC callback route | No |
| `/events/:id` | Public published event details | No |
| `/events/:eventId/purchase/:ticketTypeId` | Purchase selected ticket type | Yes |
| `/dashboard` | User dashboard | Yes |
| `/dashboard/events` | Organizer event list | Yes |
| `/dashboard/events/create` | Create event page | Yes |
| `/dashboard/events/update/:id` | Update event page | Yes |
| `/dashboard/tickets` | Purchased tickets list | Yes |
| `/dashboard/tickets/:id` | Ticket details and QR code | Yes |
| `/dashboard/validate-qr` | Staff QR/manual validation page | Yes |

Organizer login from `/organizers` redirects to:

```text
/dashboard/events/create
```

The browser will briefly visit `/callback` after Keycloak login. That is expected. The callback route completes OIDC processing and then redirects to the saved target route.

## Backend API

The frontend calls the backend through relative `/api` URLs. Vite proxies these calls to `http://localhost:8080`.

### Public Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/published-events?page={page}&size={size}` | List published events |
| `GET` | `/api/v1/published-events?q={query}&page={page}&size={size}` | Search published events |
| `GET` | `/api/v1/published-events/{eventId}` | Get public event details |

### Authenticated Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/events` | Create an event |
| `GET` | `/api/v1/events?page={page}&size={size}` | List events owned by current organizer |
| `GET` | `/api/v1/events/{eventId}` | Get organizer event details |
| `PUT` | `/api/v1/events/{eventId}` | Update organizer event |
| `DELETE` | `/api/v1/events/{eventId}` | Delete organizer event |
| `POST` | `/api/v1/events/{eventId}/ticket-types/{ticketTypeId}/tickets` | Purchase a ticket |
| `GET` | `/api/v1/tickets?page={page}&size={size}` | List current user's tickets |
| `GET` | `/api/v1/tickets/{ticketId}` | Get ticket details |
| `GET` | `/api/v1/tickets/{ticketId}/qr-codes` | Get ticket QR code as PNG |
| `POST` | `/api/v1/ticket-validations` | Validate a ticket manually or by QR |

## Authentication and Authorization

### Frontend Login Flow

1. User opens a protected route or clicks a login button.
2. Frontend saves the intended redirect path in `localStorage.redirectPath`.
3. Frontend redirects to Keycloak.
4. Keycloak authenticates the user.
5. Keycloak redirects to `http://localhost:5173/callback`.
6. `react-oidc-context` processes the authorization code.
7. The callback page redirects to the saved route.

Important files:

- `frontend/src/main.tsx` - OIDC provider config.
- `frontend/src/pages/login-page.tsx` - login redirect handling.
- `frontend/src/pages/callback-page.tsx` - callback redirect handling.
- `frontend/src/components/protected-route.tsx` - protected route guard.
- `frontend/src/pages/organizers-landing-page.tsx` - organizer login target.

### Backend Security

The backend is a stateless OAuth2 resource server. It expects JWT bearer tokens from Keycloak.

Important files:

- `ticket-app/src/main/java/com/harish/tickets/configs/SecurityConfig.java`
- `ticket-app/src/main/java/com/harish/tickets/configs/JwtAuthenticationConverter.java`
- `ticket-app/src/main/java/com/harish/tickets/filters/UserProvisioningFilter.java`

Role mapping rules:

- Roles are read from `realm_access.roles`.
- Only roles beginning with `ROLE_` are converted to Spring authorities.
- Spring `hasRole("ORGANIZER")` expects an authority named `ROLE_ORGANIZER`.
- Spring `hasRole("STAFF")` expects an authority named `ROLE_STAFF`.

## Database

PostgreSQL settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/mydb?options=-c%20TimeZone=UTC
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```

Adminer is available at:

```text
http://localhost:8888
```

Adminer login:

| Field | Value |
| --- | --- |
| System | PostgreSQL |
| Server | `db` if using Docker network, or `localhost:5433` from host |
| Username | `postgres` |
| Password | `password` |
| Database | `mydb` |

The application pins JVM and JDBC timezone behavior to UTC because some PostgreSQL versions reject `Asia/Calcutta` as a startup timezone parameter.

## Development Commands

### Frontend

Run dev server:

```powershell
cd frontend
npm run dev
```

Build:

```powershell
cd frontend
npm run build
```

Lint:

```powershell
cd frontend
npm run lint
```

Format:

```powershell
cd frontend
npm run format
```

Run JSON mock server, if you want to use `db.json`:

```powershell
cd frontend
npm run mocks
```

### Backend

Run tests:

```powershell
cd ticket-app
.\mvnw.cmd test
```

Run backend:

```powershell
cd ticket-app
.\mvnw.cmd spring-boot:run
```

Build package:

```powershell
cd ticket-app
.\mvnw.cmd package
```

### Docker

Start services:

```powershell
cd ticket-app
docker compose up -d
```

View logs:

```powershell
cd ticket-app
docker compose logs -f
```

Stop services:

```powershell
cd ticket-app
docker compose down
```

## Verification

Use these commands before committing or handing off changes:

```powershell
cd frontend
npm run build
```

```powershell
cd ticket-app
.\mvnw.cmd test
```

Expected result:

- Frontend TypeScript and Vite build succeeds.
- Backend Spring context test succeeds.

## Troubleshooting

### Keycloak returns to `/callback` and stays there

Check these items:

- Keycloak client has `http://localhost:5173/callback` in valid redirect URIs.
- Keycloak client has `http://localhost:5173` in web origins.
- Frontend is running on port `5173`.
- Browser local storage for `localhost:5173` does not contain stale OIDC state.
- The Keycloak realm is exactly `event-ticket-platform`.
- The Keycloak client is exactly `event-ticket-platform-app`.

To clear stale browser state, clear site data for `localhost:5173` and try again.

### Organizer login does not open create-event page

Organizer login target is defined in:

```text
frontend/src/pages/organizers-landing-page.tsx
```

It should save and request:

```text
/dashboard/events/create
```

Remember that `/callback` will still appear briefly during login. That is normal.

### Backend says JWT issuer is invalid

The backend issuer must match Keycloak exactly:

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:9090/realms/event-ticket-platform
```

Also make sure Keycloak is running and the realm exists.

### User gets 403 Forbidden

Check realm role assignment in Keycloak.

Required roles:

```text
ROLE_ORGANIZER
ROLE_STAFF
```

The backend only maps roles from `realm_access.roles` if they start with `ROLE_`.

### PostgreSQL timezone error

If you see an error like:

```text
FATAL: invalid value for parameter "TimeZone": "Asia/Calcutta"
```

The project includes fixes for this:

- JDBC URL includes `TimeZone=UTC`.
- Application startup sets default JVM timezone to UTC.
- Maven Surefire uses `-Duser.timezone=UTC`.

Run backend tests again:

```powershell
cd ticket-app
.\mvnw.cmd test
```

### `npm ci` fails with peer dependency conflicts

Use:

```powershell
cd frontend
npm ci --legacy-peer-deps
```

This is needed because the current React 19 setup conflicts with the peer dependency range declared by `react-day-picker@8.10.1`.

### Vite cannot reach the backend

Check that Spring Boot is running on port `8080`.

Vite proxy config is in:

```text
frontend/vite.config.ts
```

The proxy forwards:

```text
/api -> http://localhost:8080
```

### Port already in use

Common ports:

- `5173` - frontend
- `8080` - backend
- `5433` - PostgreSQL
- `8888` - Adminer
- `9090` - Keycloak

Stop the process using the port or configure the service to use a different port.

## Notes for Future Work

- Move local URLs and Keycloak settings into environment variables.
- Add a Keycloak realm export to make setup repeatable.
- Add backend integration tests for secured endpoints.
- Add frontend tests for login redirect behavior.
- Consider upgrading or replacing `react-day-picker` to remove the need for `--legacy-peer-deps`.
- Add API documentation with OpenAPI/Swagger.
- Add production deployment profiles for frontend, backend, database, and Keycloak.
