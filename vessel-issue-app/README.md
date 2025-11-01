## Candidate Assessment Task

# Vessel Issue Reporting System – Technical Assignment (3-Hour Assessment)

## Objective

Build a full-stack web application called “Vessel Issue Reporting System” using Next.js, Node.js,
and a database of your choice (SQLite preferred for simplicity). This exercise assesses your
ability to design, develop, and structure a scalable full-stack application under time
constraints.

## Tech Stack

- Frontend: Next.js (App Router) + TypeScript
- Styling: TailwindCSS or Bootstrap
- Backend: Next.js API Routes (Node.js )
- Database: SQLite (via Prisma ORM)
- Auth: JWT-based authentication
- Data Fetching: React Query or SWR
- Caching: In-memory (bonus: Redis)

## User Roles

1. Fleet Admin

- Can add, update, and manage vessels.
- Can view and update issues.
- Can run a maintenance check.

2. Crew Member

- Can log in to view their assigned vessels.
- Can report issues for those vessels.
- Can view their reported issues and recommendations.

## Core Requirements (Must Have)

Auth & RBAC

- Login page → Receive JWT.
- Middleware/guarded routes: Fleet Admin vs Crew Member.
  Models
- Vessel: id, name, imo, flag, type, status, lastInspectionDate
- Issue: id, vesselId, category, description, priority (Low/Med/High), status (Open/Resolved),
  createdAt

- User: id, email, passwordHash, role, assignedVesselIds[] (can be join table)
  Rules
- Crew: can view their assigned vessels, create issues on them.
- Admin: CRUD vessels, update issue status.
- Constraint: A vessel cannot have > 3 Open issues (reject creates beyond 3).
  Auto-check
- Implement an idempotent API endpoint /api/jobs/maintenance-scan that:
- Marks vessels with >= 3 Open issues as Under Maintenance, else Active.
- (Bonus: wire an in-process setInterval(10m) only if they have time; endpoint is enough for
  core.)
- Recommendations endpoint (with cache)
- /api/issues/recommend?category=...&vesselType=...
- Returns last 5 similar Resolved issues by category OR vessel.type.
- Cache results in-memory with TTL (e.g., 5 min). (Bonus: Redis.)
  Frontend pages
- Vessels list (Crew): Only assigned vessels; view open issue count & status badge.
- Report Issue: Form with validation; fails cleanly when >3 open issues.
- My Issues (Crew): List with status; link to recommendations.
- Vessel admin (Admin): Minimal CRUD for vessels; run “Maintenance Scan” button (calls job
  endpoint).
  Quality
- Basic validation (server + client), clean error messages, 401/403 where appropriate.
- Seed script that creates: 1 admin, 1 crew, 3 vessels, 6 issues mixed.

## Nice-to-Have (Bonus)

- Unit tests for key business rules.
- Dockerfile and/or Redis integration.
- Optimistic UI updates.
- Pagination and search on list pages.

## Deliverables

- GitHub or GitLab repository with clear README.md containing setup instructions,
  credentials, and time log.
- Optional Postman collection or curl commands for key endpoints.

## Submission Guidelines

- Submit a Git repository link (public or with access granted).
- Ensure `npm run dev` launches a working app.
- Include seed users for testing (Admin and Crew).
- Add a short note (1–2 paragraphs) on what you’d improve if given more time.

## Expected Duration

3 hours maximum. Focus on correctness, structure, and clarity rather than UI polish.

Summary:

Build a full-stack web application called “Vessel Issue Reporting System” using Node.js, Next.js,
and database. The system should allow user authentication with two roles: Fleet Admin and
Crew Member. Fleet Admins can add, update, and manage vessels, while Crew Members can
view their assigned vessels and report issues. Each vessel should have details such as name,
IMO number, flag, type, status, and last inspection date. Crew Members can report issues for
their vessels with details like category, description, priority, and status. A vessel cannot have
more than three unresolved issues at a time. The system should automatically check every 10
minutes for vessels with three or more open issues and mark them as “Under Maintenance.”
There should be an endpoint that recommends similar past issues based on category or vessel
type, using caching (in-memory or Redis) for optimization. The frontend should be built with
Next.js and include pages to view vessels, report issues, see assigned issues, and view
recommended issues. You may use TailwindCSS or Bootstrap for styling and React Query or
SWR for data fetching. Include basic validation, JWT-based authentication, and proper error
handling

# Vessel Issue Reporting System [Implemented System Details]

A full-stack web application built with Next.js, TypeScript, and SQLite for managing vessel issues and maintenance.

## Features

- **Role-based Authentication**: JWT-based auth with Admin and Crew roles
- **Vessel Management**: CRUD operations for vessels (Admin only)
- **Issue Reporting**: Crew members can report issues for assigned vessels
- **Maintenance Scanning**: Automatic vessel status updates based on open issues
- **Issue Recommendations**: Cached recommendations based on similar resolved issues
- **Responsive UI**: Clean interface built with TailwindCSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Data Fetching**: Native fetch API
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma db push
npm run db:seed
```

4. **Test Credentials**:

   - **Admin**: admin@maritime.com / admin123
   - **Crew Members**:
     - john.smith@maritime.com / crew123
     - maria.garcia@maritime.com / crew123
     - david.johnson@maritime.com / crew123
     - sarah.wilson@maritime.com / crew123
     - michael.brown@maritime.com / crew123

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Vessels

- `GET /api/vessels` - Get all vessels (Admin only)
- `POST /api/vessels` - Create vessel (Admin only)
- `GET /api/vessels/my` - Get assigned vessels (Crew)
- `GET /api/vessels/[id]` - Get vessel details (Admin)
- `PUT /api/vessels/[id]` - Update vessel (Admin)
- `DELETE /api/vessels/[id]` - Delete vessel (Admin)

### Issues

- `GET /api/issues` - Get user's issues (Crew)
- `POST /api/issues` - Create issue (Crew)
- `PUT /api/issues/[id]` - Update issue status (Admin)
- `GET /api/issues/recommend` - Get recommendations (Crew)

### Jobs

- `POST /api/jobs/maintenance-scan` - Run maintenance scan (Admin)

## Business Rules

1. **Issue Limit**: Vessels cannot have more than 3 open issues
2. **Vessel Status**: Automatically updated based on open issue count
   - 3+ open issues → UNDER_MAINTENANCE
   - <3 open issues → ACTIVE
3. **Role Permissions**:
   - Admins: Full CRUD on vessels, can update issue status
   - Crew: Can only report issues for assigned vessels
4. **Recommendations**: Cached for 5 minutes, shows last 5 similar resolved issues

## Database Schema

- **Users**: id, email, passwordHash, role, assignedVesselIds[], assignedVessels[]
- **Vessels**: id, name, imo, flag, type, status, lastInspectionDate, assignedToUserId
- **Issues**: id, vesselId, category, description, priority, status, createdAt, updatedAt

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
vessel-issue-app/
├── app/                           # Next.js app directory (App Router)
│   ├── admin/                     # Admin-only pages
│   │   ├── maintenance/
│   │   │   └── page.tsx          # Maintenance scan page
│   │   └── vessels/
│   │       ├── new/
│   │       │   └── page.tsx      # Create new vessel
│   │       └── page.tsx          # Vessels management
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts      # Login endpoint
│   │   │   └── me/
│   │   │       └── route.ts      # Current user info
│   │   ├── issues/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # Update issue by ID
│   │   │   ├── recommend/
│   │   │   │   └── route.ts      # Issue recommendations
│   │   │   └── route.ts          # Create/get issues
│   │   ├── jobs/
│   │   │   └── maintenance-scan/
│   │   │       └── route.ts      # Maintenance scan job
│   │   ├── users/
│   │   │   └── crew/
│   │   │       └── route.ts      # Crew members endpoint
│   │   └── vessels/
│   │       ├── [id]/
│   │       │   └── route.ts      # Vessel CRUD by ID
│   │       ├── my/
│   │       │   └── route.ts      # Assigned vessels
│   │       └── route.ts          # Vessels CRUD
│   ├── crew/                      # Crew member pages
│   │   ├── issues/
│   │   │   └── page.tsx          # My issues
│   │   ├── recommendations/
│   │   │   └── page.tsx          # Issue recommendations
│   │   ├── report/
│   │   │   └── page.tsx          # Report new issue
│   │   └── vessels/
│   │       └── page.tsx          # Assigned vessels
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── DashboardLayout.tsx        # Shared layout component
├── contexts/
│   └── auth-context.tsx          # Authentication context
├── lib/
│   ├── auth.ts                   # Authentication utilities
│   ├── middleware.ts             # Next.js middleware
│   └── prisma.ts                 # Prisma client
├── prisma/
│   ├── dev.db                    # SQLite database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seed script
├── next-env.d.ts                 # Next.js type definitions
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.cjs            # PostCSS configuration
├── tailwind.config.js            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Future Improvements

1. **Unit Tests**: Add comprehensive test coverage for business logic
2. **Redis Integration**: Replace in-memory cache with Redis for better scalability
3. **Real-time Updates**: WebSocket integration for live issue updates
4. **File Uploads**: Allow crew to attach photos to issues
5. **Advanced Filtering**: Search and pagination for large datasets
6. **Email Notifications**: Alert admins of high-priority issues
7. **Audit Logging**: Track all changes for compliance
8. **Docker Support**: Containerization for easy deployment
9. **Performance Optimization**: Implement React Query for better caching
10. **Mobile App**: React Native version for field use
