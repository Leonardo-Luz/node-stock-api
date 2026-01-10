<div 
  align="center"
>

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

## Database Model

```
User(
  _id,
  name,
  email,
  password,
  role,

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
