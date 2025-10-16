# PokeTeams!

A full-stack Pokemon team management application built with NestJS, React, and PostgreSQL.

## About this Submission

The app is written in Nest and React, with a dockerized PostgreSQL database. A small, composable design system was
also implemented in EmotionCSS.

### Use of AI

Windsurf was used to generate the initial code for the project, which was refined by hand, typically feature-by-feature.
On greenfield projects, my use of AI tends towards generating code which would typically take me hours to write by and iterating once the
technical aspects are in place and I can focus on feature development. By contrast, I tend to use AI in established projects more to understand
the code as is and strategize about how to make iterations without regression or spurious complexity.

## Tech Stack

### Frontend

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Emotion 11.11.5** - CSS-in-JS styling
- **TanStack React Query 5.90.3** - Data fetching and caching
- **React Router 6.25.1** - Client-side routing
- **Vite** - Build tooling

### Backend

- **NestJS 11.1.6** - Node.js framework
- **TypeScript** - Type safety
- **Drizzle ORM 0.30.6** - Database ORM
- **PostgreSQL** - Database
- **Passport JWT** - Authentication
- **class-validator** - DTO validation
- **Swagger/OpenAPI** - API documentation

### Infrastructure

- **Docker** - Database containerization
- **NX 19.5.7** - Monorepo management
- **pnpm** - Package management

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker

### Installation

1. **Install dependencies:**

```bash
pnpm install
```

2. **Start the database:**

```bash
pnpm db:up
```

3. **Run database migrations:**

```bash
pnpm db:migrate
```

4. **Seed Pokemon data:**

```bash
pnpm db:seed
```

5. **Start the application:**

```bash
pnpm start
```

6. **Access the app:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000/api
   - API Documentation: http://localhost:3000/api/docs

Register an account and start building your Pokemon teams!

## Available Scripts

### Development

| Script                            | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `pnpm start`                      | Start both frontend and backend in development mode |
| `pnpm pokemon-ui:serve`           | Start only the frontend (port 4200)                 |
| `pnpm pokemon-user-backend:serve` | Start only the backend (port 3000)                  |
| `pnpm pokemon-user-backend:build` | Build the backend for production                    |

### Database Management

| Script             | Description                                   |
| ------------------ | --------------------------------------------- |
| `pnpm db:up`       | Start PostgreSQL database in Docker           |
| `pnpm db:down`     | Stop and remove database container            |
| `pnpm db:logs`     | View database logs                            |
| `pnpm db:psql`     | Connect to database via psql CLI              |
| `pnpm db:generate` | Generate new migration from schema changes    |
| `pnpm db:migrate`  | Apply pending migrations to database          |
| `pnpm db:push`     | Push schema changes directly (dev only)       |
| `pnpm db:seed`     | Seed database with Pokemon data (151 Pokemon) |
| `pnpm db:studio`   | Open Drizzle Studio database GUI              |

### Testing

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `pnpm test:unit`          | Run backend unit tests                   |
| `pnpm test:unit:coverage` | Run unit tests with coverage report      |
| `pnpm test:unit:watch`    | Run unit tests in watch mode             |
| `pnpm test:e2e`           | Run end-to-end API tests                 |
| `pnpm test:all`           | Run all tests with coverage (unit + e2e) |

## Features

### User Management

- User registration with email/password
- JWT-based authentication
- User profile management

### Pokemon Data

- Browse 151 Pokemon with infinite scroll
- View detailed Pokemon information
- Sprites and stats for each Pokemon

### Team Management

- Create multiple teams
- Add up to 6 Pokemon per team
- Remove Pokemon from teams
- Delete teams
- View team rosters with Pokemon details

## Testing

### Unit Tests

- **78 tests** covering services, controllers, and utilities
- Type-safe mocking with `jest-mock-extended`
- Comprehensive test fixtures and helpers
- Run with: `pnpm test:unit` or `pnpm test:unit:coverage`

### E2E Tests

- **53 tests** covering all API endpoints
- NestJS Testing Module with Supertest
- Real database integration
- Run with: `pnpm test:e2e`

**Prerequisites for E2E tests:**

```bash
pnpm db:up      # Database must be running
pnpm db:migrate # Migrations must be applied
pnpm db:seed    # Pokemon data must be seeded
```

## API Documentation

Interactive API documentation is available via Swagger UI:

- **URL:** http://localhost:3000/api/docs
- **Format:** OpenAPI 3.0

### Main Endpoints

**Authentication**

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with credentials

**Pokemon**

- `GET /api/pokemon` - List Pokemon (paginated)
- `GET /api/pokemon/:id` - Get Pokemon details

**Teams** (Protected)

- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id` - Get team details
- `PATCH /api/teams/:id` - Update team name
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/:id/roster` - Get team roster
- `POST /api/teams/:id/pokemon` - Add Pokemon to team
- `DELETE /api/teams/:id/pokemon/:pokemonId` - Remove Pokemon

**Profiles**

- `GET /api/profiles/:id` - Get user profile
- `PATCH /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

## Development Notes

### Database Schema

The application uses Drizzle ORM with PostgreSQL. Schema is defined in:

- `packages/pokemon-user-backend/src/modules/database/schema.ts`

### Environment Variables

Default configuration works out of the box. For production, set:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 3000)

### Code Quality

- TypeScript strict mode enabled
- ESLint configured for both frontend and backend
- Comprehensive test coverage
- Type-safe database queries with Drizzle

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker ps

# View database logs
pnpm db:logs

# Restart database
pnpm db:down && pnpm db:up
```

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
pnpm db:down
pnpm db:up
pnpm db:migrate
pnpm db:seed
```

### Test Failures

```bash
# Ensure database is set up for e2e tests
pnpm db:up
pnpm db:migrate
pnpm db:seed

# Run tests with verbose output
pnpm test:e2e --verbose
```
