# Auth App - NestJS Authentication API

A simple authentication API built with NestJS, MongoDB, and JWT tokens.

## Features

- User signup and signin with JWT tokens
- Password hashing with bcrypt
- One protected endpoint
- Input validation
- API documentation with Swagger
- Comprehensive logging system

## Tech Stack

- NestJS (Node.js framework)
- MongoDB with Mongoose
- JWT authentication
- TypeScript

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (make sure it's running on localhost:27017)

3. Run the application:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
  - Validation: Name (min 3 chars), Email (valid format), Password (8+ chars, letter, number, special char)
- `POST /auth/signin` - Sign in user
  - Validation: Email (valid format), Password (required)
- `POST /auth/logout` - Logout user

### Users
- `GET /users` - Get all users (public)
- `GET /users/profile` - Get user profile (requires JWT token)

### App
- `GET /` - Welcome message

## Usage

### Signup
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "Password123!"}'
```

### Signin
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "Password123!"}'
```

### Logout
```bash
curl -X POST http://localhost:3000/auth/logout
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
