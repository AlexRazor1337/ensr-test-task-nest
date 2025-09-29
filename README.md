# Payment API (NestJS)

A simple payment API built with [NestJS](https://nestjs.com/).  
This project uses PostgreSQL with TypeORM, and Docker for local database setup.

---

## Getting Started

### 0. Setup .env file
Copy `.env.example` file and rename it into `.env.development`, edit as needed

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

## Testing

### 0. Setup .env file
Copy `.env.example` file and rename it into `.env.test`, edit to include test database connection string

### 1. Run Test Database
Start the PostgreSQL database with Docker:
```bash
docker compose up -d
```

### 2. Run the e2e tests
This command will build the app, clear the database, run seeds and migrations on the test database, after which it will run the e2e tests:
```bash
npm run wrap-test:e2e
```

## Docs
After deploying the app, the docs can be accessed by visiting `http://127.0.0.1:3000/docs` url. Docs are enabled only when `NODE_ENV=development` is set in the app environment.

## Notes
* Environment variables should be set in a `.env.development` or `.env.test` file (see `.env.example` if available).
