# API Contract - True Talent Transaction System

## Base URL
`http://localhost:8000`

## Authentication
All endpoints (except Login and Health Check) require a Bearer Token.
**Header:** `Authorization: Bearer <your_access_token>`

---

## 1. Authentication

### **Login**
Obtain an access token to authenticate future requests.

- **Endpoint:** `POST /auth/login`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Body:**
  - `username`: "TRUE"
  - `password`: "TALENT"

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "bearer"
}
```

---

## 2. Transactions

### **List Transactions (Paginated)**
Retrieve a paginated list of transactions.

- **Endpoint:** `GET /transactions/`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `size`: Items per page (default: 10)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "monto": 150.50,
      "tipo": "compra",
      "status": "procesado",
      "created_at": "2024-02-10T12:00:00.000Z",
      "processed_at": "2024-02-10T12:00:02.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "size": 10,
  "pages": 5
}
```

### **Create Transaction (Synchronous)**
Create a new transaction immediately. Requires an idempotency key to prevent duplicates.

- **Endpoint:** `POST /transactions/create`
- **Body (JSON):**
```json
{
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "monto": 100.00,
  "tipo": "compra",
  "idempotency_key": "unique-key-123"
}
```

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "monto": 100.00,
  "tipo": "compra",
  "status": "pendiente",
  "created_at": "2024-02-10T12:00:00.000Z",
  "processed_at": null
}
```

### **Async Process Transaction**
Submit a transaction to be processed asynchronously via a worker queue (Redis).

- **Endpoint:** `POST /transactions/async-process`
- **Body (JSON):**
```json
{
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "monto": 500.00,
  "tipo": "venta"
}
```

**Response (200 OK):**
```json
{
  "id": "generated-uuid",
  "status": "pendiente",
  "created_at": "..."
}
```

---

## 3. Assistant (Third-Party Integration)

### **Summarize Text**
Generates a summary of the provided text using OpenAI (or simulation mode if API Key is missing). Logs the request and response in the database.

- **Endpoint:** `POST /assistant/summarize`
- **Body (JSON):**
```json
{
  "text": "Long text to be summarized..."
}
```

**Response (200 OK):**
```json
{
  "summary": "This is the generated summary..."
}
```

---

## 4. Real-Time Updates

### **WebSocket Stream**
Listen for real-time transaction status updates.

- **URL:** `ws://localhost:8000/transactions/stream`
- **Message Format (Received):**
```json
{
  "type": "transaction_update",
  "data": {
    "transaction_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "procesado",
    "updated_at": "2024-02-10T12:00:05.000Z"
  }
}
```
