# PokeTeams!

## About this Submission

The app is written in Nest and React, with a dockerized PostgreSQL database. A small, composable design system was
also implemented in EmotionCSS.

### Use of AI

Windsurf was used to generate the initial code for the project, which was refined by hand, typically feature-by-feature.
On greenfield projects, my use of AI tends towards generating code which would typically take me hours to write by and iterating once the
technical aspects are in place and I can fous on feature development. By contrast, I tend to use AI in established projects more to understand
the code as is and strategize about how to make iterations without regression or spurious complexity.

## Getting started

Install dependencies:

```bash
pnpm install
```

Spin up docker

```bash
docker compose up -d
```

Run migrations

```bash
pnpm db:migrate
```

Seed Pokemon data

```bash
pnpm db:seed
```

Start the app:

```bash
pnpm start
```

Register an account at http://localhost:4200 and enjoy!
