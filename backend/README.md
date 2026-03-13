# Supermarket Backend

## Overview
This is the backend service for the Supermarket application, built with **NestJS** and **PostgreSQL**. It provides APIs and business logic for managing supermarket operations.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

## Project Structure
```
backend/
├── database/
├── src/
│   ├── catalog/
│       ├── shared/
├── tests/
├── package.json
└── README.md
```

## API Features
- Product management
- Inventory tracking
- Order processing
- User authentication

## Environment Variables
Create a `.env` file in the root directory with required configuration.
```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_HOST=
POSTGRES_PORT=
```
## Testing
```bash
npm test
```