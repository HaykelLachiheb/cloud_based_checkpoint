# ClinicFlow — Cloud-Based Clinic Management System

A modern, cloud-native clinic management system for small healthcare facilities. Built with the MERN stack and deployed on Render.

## Features

- **Role-based Authentication** (Admin, Doctor, Receptionist)
- **Patient Management** (CRUD with search, pagination)
- **Appointment Scheduling** with status tracking
- **Medical Records** with diagnosis and prescriptions
- **Dashboard** with key metrics
- **Responsive UI** built with React + Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Deployment | Render (PaaS) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

## Quick Start

```bash
# Install dependencies
npm run install:all

# Set up environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# Start development
npm run dev
```

The server runs on `http://localhost:5000` and client on `http://localhost:3000`.

## Docker

```bash
docker compose up -d
```

## Seed Data

```bash
npm run seed --prefix server
```

## Deployment

Deploy on Render by connecting your GitHub repository. Set the following environment variables:

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — Token expiry (default: 7d)
