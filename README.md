# Taskrix Backend

Multi-user task orchestration system with queue-based processing and escalation logic.

## Tech Stack
- **Node.js & Express**
- **TypeScript**
- **PostgreSQL (Prisma ORM)**
- **Redis (BullMQ)**

## Key Features
- **Queue-driven Task Management**: Tasks are scheduled for escalation checks.
- **Priority Escalation**: Automatic priority increase for overdue tasks.
- **Role-based Access**: Admin (Senior Dev) and User (Developer).
- **Task Logging**: Every action on a task is logged for auditing.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Create a `.env` file with:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET`

3. **Database Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## API Routes

### Auth
- `POST /api/auth/register`: Create a new user.
- `POST /api/auth/login`: Authenticate and get JWT.

### Tasks
- `GET /api/tasks`: List tasks (Admin sees all, User sees assigned).
- `POST /api/tasks`: Create a task (Admin only).
- `PATCH /api/tasks/:id/status`: Update task status (User/Admin).
