<div align="center">

# Stock Manager API

![Node](https://img.shields.io/badge/node-%3E=18-green)
![NestJS](https://img.shields.io/badge/nestjs-backend-red)
![Tests](https://img.shields.io/badge/tests-jest-brightgreen)

</div>

A **Stock Management REST API** built with **NestJS**, focused on **clean code practices** and **Test-Driven Development (TDD)**.

This project demonstrates how to design a scalable backend for inventory control using **event-based stock tracking** instead of direct state mutation.

## Features

- Product catalog management
- Stock control through **stock movement events**
- Role-based user system
- Consistent RESTful routing
- Fully documented API with Swagger
- Strong validation and error handling
- Automated tests with Jest
- Authentication with Refresh token
- Single Sessions
- Role Based protection

## Architectural Decisions

- **Stock is not mutated directly**  
  Inventory changes are represented as **Stock Movements** (`IN`, `OUT`, `ADJUSTMENT`), ensuring:
  - Full audit history
  - Easier debugging
  - Clear separation of stock-related rules

- **API-first design**
  - Clear REST conventions
  - Swagger as a first-class citizen

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** class-validator
- **Testing:** Jest (TDD approach)
- **Linting & Formatting:** ESLint + Prettier
- **Documentation:** Swagger (OpenAPI)

## Swagger Demo

<div align="center">
  <video src="assets/videos/swagger.mp4" controls autoplay loop muted></video>
</div>

## Project Structure

```txt

  stock-api
  ├── assets
  │   └── videos
  │       └── swagger.mp4
  ├── docker-compose.yml
  ├── Dockerfile
  ├── docs
  │   └── ISSUES.md
  ├── eslint.config.mjs
  ├── Jenkinsfile
  ├── jest.config.ts
  ├── nest-cli.json
  ├── package.json
  ├── package-lock.json
  ├── README.md
  ├── src
  │   ├── app.controller.ts
  │   ├── app.module.ts
  │   ├── common
  │   │   └── enums
  │   │       ├── product-status.enum.ts
  │   │       ├── stock-movement-reason.enum.ts
  │   │       ├── stock-movement-type.enum.ts
  │   │       └── user-role.enum.ts
  │   ├── config
  │   │   └── validation.config.ts
  │   ├── database
  │   ├── main.ts
  │   └── modules
  │       ├── auth
  │       │   ├── auth.controller.ts
  │       │   ├── auth.cookies.ts
  │       │   ├── auth.module.ts
  │       │   ├── auth.service.ts
  │       │   ├── decorators
  │       │   │   ├── api-roles.decorator.ts
  │       │   │   ├── public.decorator.ts
  │       │   │   └── roles.decorator.ts
  │       │   ├── dtos
  │       │   │   ├── sign-in.dto.ts
  │       │   │   └── sign-up.dto.ts
  │       │   ├── guards
  │       │   │   ├── jwt-auth.guard.ts
  │       │   │   ├── local-auth.guard.ts
  │       │   │   ├── refresh.guard.ts
  │       │   │   └── roles.guard.ts
  │       │   ├── interfaces
  │       │   │   ├── jwt-payload.interface.ts
  │       │   │   └── jwt-user-payload.interface.ts
  │       │   └── strategies
  │       │       ├── access.strategy.ts
  │       │       ├── local.strategy.ts
  │       │       └── refresh.strategy.ts
  │       ├── products
  │       │   ├── dtos
  │       │   │   ├── create-product.dto.ts
  │       │   │   ├── find-products-query.dto.ts
  │       │   │   ├── get-product.dto.ts
  │       │   │   └── update-product.dto.ts
  │       │   ├── product.schema.ts
  │       │   ├── products.controller.spec.ts
  │       │   ├── products.controller.ts
  │       │   ├── products.module.ts
  │       │   ├── products.service.spec.ts
  │       │   └── products.service.ts
  │       ├── stock-movements
  │       │   ├── dtos
  │       │   │   ├── create-stock-movement.dto.ts
  │       │   │   ├── find-stock-movement-query.dto.ts
  │       │   │   ├── get-stock-movement.dto.ts
  │       │   │   └── update-stock-movement.dto.ts
  │       │   ├── stock-movement.schema.ts
  │       │   ├── stock-movements.controller.spec.ts
  │       │   ├── stock-movements.controller.ts
  │       │   ├── stock-movements.module.ts
  │       │   ├── stock-movements.service.spec.ts
  │       │   └── stock-movements.service.ts
  │       └── users
  │           ├── dtos
  │           │   ├── create-user.dto.ts
  │           │   ├── get-password-user.dto.ts
  │           │   ├── get-refresh-user.dto.ts
  │           │   ├── get-user.dto.ts
  │           │   └── update-user.dto.ts
  │           ├── interfaces
  │           │   └── raw-user.interface.ts
  │           ├── user.schema.ts
  │           ├── users.controller.spec.ts
  │           ├── users.controller.ts
  │           ├── users.module.ts
  │           ├── users.service.spec.ts
  │           └── users.service.ts
  ├── test
  │   ├── app.e2e-spec.ts
  │   └── jest-e2e.json
  ├── tsconfig.build.json
  └── tsconfig.json

```

## Database Model

```
User(
  _id,
  name,
  email,
  password,
  role,
  hashedRefreshToken?,

  createdAt,
  updatedAt
)
```

```
Product(
  _id,
  name,
  description?,
  price,
  currentStock,
  category,
  status,

  createdAt,
  updatedAt
)
```

```
StockMovement (
  _id,
  productId,
  type,
  quantity,
  reason,

  createdBy,
  createdAt,
  updatedAt
)
```

```
Enum Role(
  'ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER'
)
```

```
Enum Status(
  'ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'
)
```

```
Enum Reason(
  'PURCHASE', 'SALE', 'LOSS', 'MANUAL'
)
```

```
Enum Type (
  'IN', 'OUT', 'ADJUSTMENT'
)
```
