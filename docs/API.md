# API Documentation

## Authentication Endpoints

### POST `/api/auth/sign-up`
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user"
  }
}
```

### POST `/api/auth/sign-in`
Authenticate a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "session": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Events Endpoints

### GET `/api/events`
Get all events.

**Query Parameters:**
- `query` (optional): Search term
- `date` (optional): Filter by date
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "short_description": "string",
      "date": "string",
      "price": "number",
      "image_url": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### POST `/api/events`
Create a new event. Requires admin role.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "short_description": "string",
  "date": "string",
  "price": "number",
  "image_url": "string"
}
```

### PUT `/api/events/:id`
Update an event. Requires admin role.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "short_description": "string",
  "date": "string",
  "price": "number",
  "image_url": "string"
}
```

### DELETE `/api/events/:id`
Delete an event. Requires admin role.

## Items Endpoints

### GET `/api/items`
Get all items.

**Query Parameters:**
- `query` (optional): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "image_url": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### POST `/api/items`
Create a new item. Requires admin role.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "image_url": "string"
}
```

### PUT `/api/items/:id`
Update an item. Requires admin role.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "image_url": "string"
}
```

### DELETE `/api/items/:id`
Delete an item. Requires admin role.

## Stock Endpoints

### GET `/api/stocks`
Get all stocks. Requires admin role.

**Response:**
```json
{
  "stocks": [
    {
      "id": "string",
      "item_id": "string",
      "quantity": "number",
      "name": "string",
      "cost": "number"
    }
  ]
}
```

### POST `/api/stocks`
Create a new stock entry. Requires admin role.

**Request Body:**
```json
{
  "item_id": "string",
  "quantity": "number",
  "name": "string",
  "cost": "number"
}
```

## Cart Endpoints

### GET `/api/cart`
Get user's cart.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "quantity": "number",
      "item": {
        "id": "string",
        "title": "string",
        "price": "number"
      }
    }
  ],
  "total": "number"
}
```

### POST `/api/cart`
Add item to cart.

**Request Body:**
```json
{
  "item_id": "string",
  "quantity": "number"
}
```

### DELETE `/api/cart/:id`
Remove item from cart.

## Payment Endpoints

### POST `/api/checkout`
Create a checkout session.

**Request Body:**
```json
{
  "items": [
    {
      "id": "string",
      "quantity": "number"
    }
  ]
}
```

**Response:**
```json
{
  "checkout_url": "string",
  "preference_id": "string"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```