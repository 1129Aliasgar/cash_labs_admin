# CashLabs Admin — Fintech Gateway Architecture

Industry-standard, multi-tenant administrative gateway for the CashLabs Multi-Gateway Network. This project implements a high-performance, secure, and event-driven architecture designed for fintech operations.

## 🏗 System Architecture

The project follows a decoupling strategy to ensure high availability and scalability, particularly for third-party integrations like email delivery.

### Event-Driven Email System (Kafka)

Email delivery is decoupled from the main Auth API using an asynchronous, event-driven pattern. This ensures that user signup and login flows are never blocked or failed by transient issues with the email provider (SendGrid).

#### Flow:
1. **User Signup**: API stores user in MongoDB and generates a verification token.
2. **Event Publication**: API publishes a `VERIFY_EMAIL` event to the `email.send` Kafka topic.
3. **Consumption**: The dedicated **Email Worker** microservice consumes the event.
4. **Delivery**: Worker sends the email via SendGrid SDK.
5. **Retry**: If sending fails, the worker implements an automated retry strategy.

#### Kafka Topics:
- `email.send`: Main queue for outgoing email requests.
- `email.dead`: Dead Letter Queue (DLQ) for events that failed after maximum retries.

---

## 📂 Project Organization

### 1. Backend API (`/Backend`)
The core authentication and authorization layer.
- **Architecture**: Layered Architecture (Controllers -> Services -> Repositories).
- **Core Technologies**: Node.js, Express, InversifyJS (Dependency Injection), MongoDB (Mongoose).
- **Security & Middleware**:
  - **Helmet**: Secures Express apps by setting various HTTP headers.
  - **CORS**: Configured for restricted frontend origin access.
  - **HTTP-Only Cookies**: JWT Access and Refresh tokens are stored in secure, HttpOnly cookies to prevent XSS-based token theft.
  - **Token Rotation**: Strict refresh token rotation logic (reuse detection invalidates all active sessions for that user).
  - **Account Lockout**: Automated brute-force protection (5 failed attempts = 15 min lockout).
- **Service Integration**: Acts as the primary **Kafka Producer** for system events.

### 2. Frontend Dashboard (`/Frontend`)
High-fidelity administrative interface built for Next.js 15.
- **Framework**: Next.js 15 (App Router).
- **State Management**: **TanStack Query v5** (React Query) for server state management and caching.
- **API Interaction**: **Axios** with centralized interceptors for automatic token handling.
- **Form Handling & Validation**: **React Hook Form** integrated with **Zod** for schema-based client-side validation.
- **Styling**: **Tailwind CSS** with a custom design system focusing on glassmorphism and modern aesthetics.
- **Iconography**: **Material Symbols Outlined** (Google Fonts integration).

### 3. Email Worker (`/cashlabs-email-worker`)
A dedicated, lightweight microservice for handling asynchronous tasks.
- **Core Technologies**: Node.js, TypeScript, KafkaJS, SendGrid SDK.
- **Reliability Logic**:
  - **Exponential Backoff**: Retries failures at intervals: 0s, 2s, 4s, 8s, 16s... up to 10 attempts.
  - **DLQ Routing**: Automatically moves permanently failed tasks to `email.dead` for manual inspection.
  - **Graceful Shutdown**: Handles SIGTERM/SIGINT to ensure no messages are lost during deployment.

---

## 🚀 Getting Started

### Prerequisites:
- Docker Desktop & Docker Compose
- SendGrid API Key (for email delivery)

### Local Setup:
1. Clone the repository.
2. Configure `.env` in `Backend/` and `cashlabs-email-worker/` (refer to `.env.example` in each directory).
3. Start the full stack:
   ```bash
   docker-compose up --build
   ```

## � Security Standards
- **OWASP Top 10 Compliance**: Protection against SQLi (via NoSQL), XSS (via CSP and HttpOnly), and Broken Auth.
- **Asynchronous Decoupling**: Critical flows (signup) are isolated from non-critical failures (email).
- **Microservices Isolation**: Each service runs in its own containerized environment with dedicated secrets.
