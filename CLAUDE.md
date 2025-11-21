# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 (App Router) driving school management system for managing events (classes and tests), assets (vehicles), customers, instructors, locations, and payments. It uses PostgreSQL via Prisma ORM and Auth0 for authentication.

## Development Commands

### Development Server
```bash
pnpm dev          # Start Next.js dev server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Commands
```bash
pnpm db:generate  # Generate Prisma Client (run after schema changes)
pnpm db:push      # Push schema changes to database without migration
pnpm migrate      # Create and apply migration in development
pnpm migrate:create  # Create migration file without applying
pnpm migrate:prod    # Apply migrations in production
pnpm db:studio    # Open Prisma Studio GUI for database browsing
pnpm db:reset     # Reset database (WARNING: deletes all data)
```

**Important**: Always run `pnpm db:generate` after modifying `schema.prisma` before starting the dev server.

## Architecture Overview

### Directory Structure

- **`src/app/`** - Next.js App Router pages and API routes
  - `api/[resource]/` - RESTful API endpoints
  - `[feature]/` - Feature-based pages (events, assets, licenses, etc.)
  - Each feature typically has: `page.tsx` (list view), `new/page.tsx` (create), `[id]/page.tsx` (edit)
- **`src/services/`** - Server-side business logic (event operations, logging, queries)
- **`src/lib/`** - Utilities and configurations
  - `prisma.ts` - Prisma client singleton
  - `definitions.ts` - TypeScript interfaces and enums
  - `clientApi.ts` - Axios instance for client-side API calls
- **`src/components/`** - Reusable UI components
  - `Forms/` - Form field components (Input, Dropdown, Calendar, etc.)
  - `ui/` - Radix UI wrapped components
- **`src/context/`** - React Context providers (LogsContext for audit trail)
- **`src/hooks/`** - Custom React hooks
- **`schema.prisma`** - Database schema

### Key Architectural Patterns

#### 1. Server Components with Suspense
Pages are async server components that:
- Call `getSession()` from Auth0 for authentication
- Fetch user info for role-based rendering
- Wrap interactive components in `<Suspense>` with skeleton loaders

#### 2. API Route Structure
```
/api/[resource]/route.ts        → GET (list), POST (create)
/api/[resource]/[id]/route.ts   → GET (fetch), PATCH (update), DELETE
/api/[resource]/[id]/[action]/route.ts → Specific state transitions
```

All mutation routes call `revalidatePath()` to invalidate ISR cache.

#### 3. Business Logic in Services
Complex operations live in `src/services/[feature]/`:
- Multi-step record creation uses Prisma transactions
- Event state transitions (pending → practicing → completed)
- Payment processing with cash advance tracking
- All changes logged via `logEvent()` for audit trail

Example pattern:
```typescript
await prisma.$transaction(async (prisma) => {
  const schedule = await prisma.schedule.create(...)
  const customer = await prisma.customer.create(...)
  const payment = await prisma.payment.create(...)
  await logEvent(...)
})
```

#### 4. Client-Side State with React Query
Each feature has a `services/client.ts` file with React Query hooks:
```typescript
export const useGetEventById = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ['event-by-id', id],
    queryFn: () => getEventById(id),
  });
};
```

#### 5. Form Management
Forms use `react-final-form` (not Formik or React Hook Form):
- Field-level validation with Yup
- Custom form components in `components/Forms/`
- Input masking via IMask for phone numbers and IDs

#### 6. Authentication & Authorization
- `src/middleware.ts` protects routes via Auth0
- Role-based access control: admin, instructor, receptionist
- User info fetched in layouts via `getSession()` and `fetchUserInfo()`

#### 7. Audit Logging
Every data modification must call `logEvent()`:
- Records who changed what and when
- Links to event, asset, or task
- Viewed via `LogsContext` floating dialog

### Important Data Models

#### Event
Core entity representing a class or driving test:
- Has status: `PENDING`, `PRACTICING`, `COMPLETED`, `NO_SHOW`, `DELETED`
- Links to: customer, instructor, asset (vehicle), location, license type, payment
- Two types via `EventType`: classes and tests (identified by `typeId`)

#### Payment
Sophisticated payment tracking:
- `price` - Total price
- `cashAdvance` - Initial deposit
- `paid` - Boolean completion flag
- `CashPaymentsAdvance[]` - Multiple partial payments by type (CASH, CARD, SINPE)

#### Asset
Vehicles with:
- Location assignment
- License type compatibility
- Maintenance tracking (coolant, oil, inspection dates)
- Schedule (availability windows)

### Event State Machine

Events follow this state flow:
1. `PENDING` - Created but not started
2. `PRACTICING` - In progress (via `/api/event/[id]/practicing`)
3. `COMPLETED` - Finished (via `/api/event/[id]/complete`)
4. `NO_SHOW` - Customer didn't attend (via `/api/event/[id]/no-show`)

Each transition has dedicated service function in `src/services/events/`.

### URL-Based Filtering

List views (events, assets, etc.) use Base64-encoded filter params:
- Enables bookmarking/sharing filtered views
- Decoded on server in API routes
- Supports date ranges, location, instructor, license type, search text

## Development Guidelines

### Adding a New Feature

1. Create database model in `schema.prisma`
2. Run `pnpm migrate` to create migration
3. Add TypeScript types to `src/lib/definitions.ts`
4. Create API routes in `src/app/api/[feature]/`
5. Create service functions in `src/services/[feature]/`
6. Create page components in `src/app/[feature]/`
7. Create client hooks in `src/app/[feature]/services/client.ts`
8. Add audit logging via `logEvent()` for all mutations

### Working with Forms

Forms must:
- Use `react-final-form` with `<Form>` wrapper
- Validate with Yup schemas
- Use custom form components from `components/Forms/`
- Handle submission errors with toast notifications
- Call React Query mutations, not direct fetch

### Database Changes

1. Modify `schema.prisma`
2. Run `pnpm migrate` (creates migration file + applies it)
3. Run `pnpm db:generate` (regenerates Prisma Client)
4. Update TypeScript types in `definitions.ts`
5. Update affected services and API routes

### API Route Pattern

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Business logic or service call
  const result = await createSomething(body);

  // Invalidate cache
  revalidatePath('/feature-path');

  return NextResponse.json(result);
}
```

### Testing Locally

1. Ensure `.env` has valid `POSTGRES_PRISMA_URL` and Auth0 credentials
2. Run `pnpm db:push` to sync schema to database
3. Run `pnpm dev` to start development server
4. Access http://localhost:3000 (will redirect to Auth0 login)

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript 5
- **Database**: PostgreSQL (Vercel Postgres), Prisma 5.22
- **Authentication**: Auth0 (`@auth0/nextjs-auth0`)
- **State Management**: React Query 3.39, React Context
- **Forms**: React Final Form + Yup validation
- **Tables**: TanStack React Table 8
- **UI**: Radix UI, Tailwind CSS, Lucide Icons, IMask
- **Package Manager**: pnpm 9.13
