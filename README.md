# Payment API (NestJS)

A simple payment API built with [NestJS](https://nestjs.com/).  
This project uses PostgreSQL with TypeORM, and Docker for local database setup.

---

## Getting Started

### 1. Run Development Database
Start the PostgreSQL database with Docker:
```bash
docker compose up -d
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Seed Initial Data

Seeds the system configuration:

```bash
npm run seed:run
```

### 6. Start the Application

```bash
npm run start
```

---

## Notes
* Environment variables should be set in a `.env` file (see `.env.example` if available).
