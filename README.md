# Sistema de Transacciones "TRUE TALENT" (Fullstack + RPA + AI)

Este proyecto es una Prueba Técnica para **True Talent**, implementando una solución completa que integra Frontend (ReactJS), Backend (Python/FastAPI), Integraciones Asíncronas y Automatización RPA.

---

## 🚀 Características Principales


-   **🎨 Dashboard Profesional**: Interfaz moderna ("TRUE TALENT") con monitoreo en tiempo real de transacciones.
-   **🔐 Seguridad Robusta**: Autenticación JWT y Autorización en todos los endpoints protegidos.
-   **📝 Logs Detallados**: Implementación de decoradores personalizados para el registro exhaustivo de ejecuciones en cada endpoint.
-   **🤖 RPA Inteligente (Punto 4)**: Bot automatizado que navega en Wikipedia, maneja redirecciones, extrae contenido y lo procesa.
-   **🧠 Integración con IA**: Endpoint dedicado `/assistant/summarize` que utiliza OpenAI (GPT-3.5) para generar resúmenes inteligentes.
-   **📡 WebSockets en Tiempo Real**: Actualizaciones instantáneas del estado de las transacciones (Pendiente -> Procesado) sin recargar la página.
-   **⚡ Arquitectura Orientada a Eventos**: Uso de Redis y Workers en segundo plano para el procesamiento asíncrono y desacoplado de tareas pesadas (DAG).

---

## 🏗 Arquitectura del Sistema

Se eligió una arquitectura orientada a eventos con procesamiento asíncrono para garantizar escalabilidad y respuesta inmediata al usuario.

El sistema se compone de 6 microservicios orquestados con Docker Compose:

1.  **Backend (FastAPI)**: API RESTful central. Gestiona la lógica de negocio, autenticación y orquestación de servicios.
2.  **Frontend (React + Vite + Nginx)**: Single Page Application (SPA) moderna con TailwindCSS. Consume la API REST y se conecta vía WebSockets.
3.  **RPA Service (Python + Playwright)**: Microservicio aislado encargado exclusivamente de la automatización del navegador y scraping.
4.  **Worker (Python)**: Proceso en segundo plano que consume tareas de la cola para procesamiento pesado.
5.  **Redis**: Broker de mensajería utilizado para colas de tareas (Celery/RQ style) y canales Pub/Sub para eventos en vivo.
6.  **PostgreSQL**: Base de datos relacional para la persistencia robusta y transaccional de los datos.

---

## 📦 Instalación y Despliegue

### Prerrequisitos
-   Docker y Docker Compose instalados.
-   Git.

### Pasos de Ejecución

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-repo>
    cd PruebaTecnicaPython
    ```

2.  **Configurar Entorno**:
    Crea un archivo llamado `.env` en la raíz del proyecto y copia el siguiente contenido. 
    *(Nota: La variable `OPENAI_API_KEY` es opcional; si no se provee, el sistema usará un modo de simulación automático).*

    ```env
    # Database
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres123
    POSTGRES_DB=transactions_db
    POSTGRES_HOST=postgres
    POSTGRES_PORT=5432
    DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/transactions_db

    # Redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_URL=redis://redis:6379

    # Backend
    SECRET_KEY=supersecretkey
    # Pon tu API Key real aquí para mejores resultados (opcional)
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    CORS_ORIGINS=http://localhost:3000,http://localhost:5173

    # Frontend
    VITE_API_URL=http://localhost:8000
    VITE_WS_URL=ws://localhost:8000/transactions/stream

    # RPA
    RPA_API_BASE_URL=http://backend:8000
    ```

3.  **Iniciar Servicios**:
    ```bash
    docker compose up --build
    ```

4.  **Acceder a la Aplicación**:
    -   **Frontend (Dashboard)**: [http://localhost:3000](http://localhost:3000)
    -   **Backend (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Credenciales de Acceso

El sistema cuenta con un módulo de Login para proteger el acceso. Utiliza las siguientes credenciales por defecto:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `TRUE` | `TALENT` |

---

## 📚 Documentación API (Endpoints)

A continuación, se listan los endpoints principales disponibles en la API:

| Método | Endpoint | Descripción | Auth Requerida |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Autenticación y obtención de Token JWT | ❌ No |
| `GET` | `/transactions/` | Listar transacciones con paginación | ✅ Sí |
| `POST` | `/transactions/create` | Crear nueva transacción (Síncrona) | ✅ Sí |
| `POST` | `/transactions/async-process` | Procesamiento asíncrono (Cola) | ✅ Sí |
| `POST` | `/rpa/trigger` | Disparar Bot RPA (Búsqueda Wiki) | ✅ Sí |
| `POST` | `/assistant/summarize` | Generar resumen con IA | ✅ Sí |
| `WS` | `/transactions/stream` | Canal WebSocket de eventos | ❌ No |

---

## 🧪 Pruebas y Colección Postman

Para facilitar las pruebas, se incluye la colección de Postman **`TrueTalent_Postman_Collection.json`** en la raíz del proyecto.

**Instrucciones de uso:**
1.  Importa el archivo JSON en tu Postman.
2.  Ejecuta primero la petición **"Login"** (dentro de la carpeta Auth). Esto guardará automáticamente el token en las variables de la colección.
3.  Una vez autenticado, puedes ejecutar libremente **"Trigger RPA"**, **"Create Transaction"** u otras peticiones.

> **Nota**: Se han generado también contratos de API en formatos `API_CONTRACT.md` y `openapi.yaml` para un mayor entendimiento de las especificaciones.

---

## 🖥️ Nota sobre la Interfaz (Frontend)

Para facilitar la revisión y el manejo de la prueba técnica, se han incluido **etiquetas visuales** en el Dashboard (ej. "Parte 1", "Parte 2") que identifican claramente cada punto del examen. Esto hace que la correlación entre los requerimientos y la implementación sea visual, intuitiva y fácil de entender.

### 👨‍💻 Equipo de Desarrollo

**Desarrollador**: Ricardo Altamirano Sanchez
*True Talent Technical Test - 2026*
