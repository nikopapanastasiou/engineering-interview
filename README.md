# Chorus Interview

## About this Interview

Welcome to Chorus Engineering's Interview project!

We're looking for engineers who are experienced, passionate, and obsessed with strong systems and high productivity.

In order to facilitate this, we are providing an interview project that mirrors the technical stack that used
here at Chorus.

**You, the interviewee, have the power to decide if this is the technology that you want to work on!**

The goal of this interview is to identify strengths through a take home project, followed by
a 1 hour pairing session that will extend your work by creating features together.

## Tech Stack

- React UI
- Emotion CSS
- Typescript
- Node/NestJS Backend
- NX Monorepo
- Github Actions CI
- PostgreSQL Database
- Docker / Docker Desktop

## Prerequisites

Package Manager: pnpm 8.15.8

Node: 20.14.0 (LTS)

Docker

## Instructions

### Install Preqresuites
1. [Install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

Use this command to install node and npm comes with it.
```bash
nvm install --lts 
```

2. Install pnpm
```bash
npm i -g pnpm@8.15.8
```
3. [Install Docker / Docker Desktop](https://www.docker.com/products/docker-desktop/)


### Getting and Running the Repository

**The Hiring Manager will send you a link to this repository.**

Clone this repository, and run the commands below to get started.

1. Run `pnpm install`
2. Run `pm2 start`

> Note: The API and React server will automatically watch for changes.

You can manage start/stop using `pm2`.

Use `pm2 logs` to see the logs from all processes.

Use `pm2 stop all` to stop the servers.

Use `pm2 delete all` to delete the entry from the pm2 process list.

### Connecting to the Database
Use whatever tool you'd like to connect to the database.

[We recommend DataGrip.](https://www.jetbrains.com/datagrip/)

Here are the connection details below.

- **Database**: pokemon
- **Username**: admin
- **Password**: admin
- **Host**: localhost
- **Port**: 5432

## ✅ Completed Features

### 🎯 Core Functionality
- ✅ **Pokemon Team Builder** - Create and manage multiple teams of 6 Pokemon
- ✅ **User Authentication** - JWT-based signup/login system
- ✅ **Pokemon Search** - Browse all 150 Gen 1 Pokemon with infinite scroll
- ✅ **Team Management** - Add/remove Pokemon from teams, delete teams
- ✅ **Rich Pokemon Data** - Descriptions, types, stats, abilities, legendary status

### 🗄️ Database
- ✅ **Users Table** - User profiles with authentication
- ✅ **Pokemon Table** - Enhanced with 20+ fields from PokeAPI
- ✅ **Teams Table** - User-owned teams
- ✅ **Team Members** - Many-to-many relationship between teams and Pokemon
- ✅ **Migrations** - Professional database versioning system

### 🔧 Backend API
- ✅ **OpenAPI Documentation** - Full Swagger docs at `/docs`
- ✅ **Pagination** - Efficient data loading with metadata
- ✅ **Authentication** - JWT tokens, protected routes
- ✅ **Data Validation** - class-validator decorators
- ✅ **Error Handling** - Consistent error responses
- ✅ **Data Seeding** - Automated Pokemon data import from PokeAPI

### 🎨 Frontend UI
- ✅ **Modern Design** - Emotion CSS, responsive layout
- ✅ **Infinite Scroll** - Smooth Pokemon browsing experience
- ✅ **Modal Details** - Rich Pokemon information display
- ✅ **Team Builder** - Drag-and-drop style team management
- ✅ **Search & Filter** - Find Pokemon by name or ID
- ✅ **Authentication Flow** - Login/signup with persistent sessions

### 📊 Enhanced Pokemon Data
- ✅ **Descriptions** - Flavor text from Pokemon species
- ✅ **Categories** - Genus (e.g., "Seed Pokemon", "Mouse Pokemon")
- ✅ **Special Status** - Legendary ⭐ and Mythical ✨ indicators
- ✅ **Game Data** - Generation, habitat, capture rate, growth rate
- ✅ **Evolution Info** - Evolution chain relationships
- ✅ **Complete Stats** - All base stats with visual bars

## 🚀 Getting Started

### Quick Start
```bash
# Install dependencies
pnpm install

# Start database
pnpm db:up

# Run migrations
pnpm db:migrate

# Seed Pokemon data (1-150)
pnpm db:seed

# Start both frontend and backend
pnpm start
```

### Database Management
```bash
# View database in browser
pnpm drizzle:studio

# Connect via CLI
pnpm db:psql

# View logs
pnpm db:logs
```

## 📱 Usage

1. **Sign Up** - Create an account at `/signup`
2. **Browse Pokemon** - Infinite scroll through all 150 Pokemon
3. **View Details** - Click any Pokemon for detailed information
4. **Create Teams** - Go to `/teams` and create your first team
5. **Add Pokemon** - Click "Add Pokemon" to build your team of 6
6. **Manage Teams** - Create multiple teams, rename, or delete them

## 🏗️ Architecture

### Backend (NestJS)
- **Modular Design** - Separate modules for auth, pokemon, teams, profile
- **Database Layer** - Drizzle ORM with PostgreSQL
- **Type Safety** - TypeScript throughout with strict validation
- **Professional Patterns** - DTOs, guards, interceptors, exception filters

### Frontend (React)
- **State Management** - Context providers for auth and teams
- **UI Components** - Reusable styled components
- **Type Safety** - Shared TypeScript interfaces
- **Modern Patterns** - Hooks, async/await, intersection observer

## Submission Criteria

All of your work should be located in a Github Repo.

Ensure your repo is public, and submit the URL back to the hiring manager.

### Troubleshooting

> I can't execute pm2!

pm2 is part of the devDependencies, so when you install the dependencies, you should be able to
execute the binary from node_modules.

Either use `pnpm pm2` or add `node_modules/.bin` to your `PATH`.

> The requirements are confusing. I'm stuck.

Contact the hiring manager, and inform them of the situation. Be specific and clear about your concerns or issues.

