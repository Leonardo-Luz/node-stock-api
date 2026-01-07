## Stock Manager API

*A NestJs TDD backend project*

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
