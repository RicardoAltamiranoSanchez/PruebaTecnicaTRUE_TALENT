# Contrato de API - Sistema de Transacciones True Talent

## URL Base
`http://localhost:8000`

## Autenticación
Todos los endpoints (excepto Login y Health Check) requieren un Token Bearer.
**Header:** `Authorization: Bearer <tu_token_de_acceso>`

---

## 1. Autenticación

### **Login (Iniciar Sesión)**
Obtiene un token de acceso para autenticar futuras solicitudes.

- **Endpoint:** `POST /auth/login`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Cuerpo (Body):**
  - `username`: "TRUE"
  - `password`: "TALENT"

**Respuesta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "bearer"
}
```

---

## 2. Transacciones

### **Listar Transacciones (Paginado)**
Obtiene una lista paginada de transacciones.

- **Endpoint:** `GET /transactions/`
- **Parámetros de Consulta (Query Params):**
  - `page`: Número de página (por defecto: 1)
  - `size`: Elementos por página (por defecto: 10)

**Respuesta (200 OK):**
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

### **Crear Transacción (Síncrona)**
Crea una nueva transacción inmediatamente. Requiere una clave de idempotencia para prevenir duplicados.

- **Endpoint:** `POST /transactions/create`
- **Cuerpo (JSON):**
```json
{
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "monto": 100.00,
  "tipo": "compra",
  "idempotency_key": "unique-key-123"
}
```

**Respuesta (200 OK):**
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

### **Procesar Transacción Asíncrona**
Envía una transacción para ser procesada asíncronamente a través de una cola de trabajo (Redis).

- **Endpoint:** `POST /transactions/async-process`
- **Cuerpo (JSON):**
```json
{
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "monto": 500.00,
  "tipo": "venta"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "generated-uuid",
  "status": "pendiente",
  "created_at": "..."
}
```

---

## 3. Asistente (Integración de Terceros)

### **Resumir Texto**
Genera un resumen del texto proporcionado utilizando OpenAI (o modo simulación si falta la API Key). Registra la solicitud y la respuesta en la base de datos.

- **Endpoint:** `POST /assistant/summarize`
- **Cuerpo (JSON):**
```json
{
  "text": "Texto largo para ser resumido..."
}
```

**Respuesta (200 OK):**
```json
{
  "summary": "Este es el resumen generado..."
}
```

---

## 4. Actualizaciones en Tiempo Real

### **Stream WebSocket**
Escucha actualizaciones de estado de transacciones en tiempo real.

- **URL:** `ws://localhost:8000/transactions/stream`
- **Formato de Mensaje (Recibido):**
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
