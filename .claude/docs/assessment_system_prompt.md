# Claude Code Prompt: Assessment Management System

## Project Context
This is a Next.js application using Prisma ORM. We're building a comprehensive assessment management system for administrators to create and manage training manuals with chapters, questions, and answers.

## System Architecture Overview

### Data Hierarchy
```
Manual/Document (top level)
  └─ Chapters (multiple per manual)
      ├─ Rich text content (with formatting + images)
      └─ Questions (multiple per chapter)
          └─ Answers (multiple per question, one marked correct)
```

## Technical Requirements

### 1. Database Schema (Prisma)

Create the following models in `prisma/schema.prisma`:

```prisma
model Manual {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      ManualStatus @default(DRAFT)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  chapters    Chapter[]
}

enum ManualStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Chapter {
  id          String    @id @default(cuid())
  manualId    String
  manual      Manual    @relation(fields: [manualId], references: [id], onDelete: Cascade)
  title       String
  order       Int
  content     String    @db.Text // Rich text content stored as HTML or JSON
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  questions   Question[]
  
  @@index([manualId])
}

model Question {
  id          String    @id @default(cuid())
  chapterId   String
  chapter     Chapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  text        String    @db.Text // Question text with formatting
  order       Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  answers     Answer[]
  
  @@index([chapterId])
}

model Answer {
  id          String    @id @default(cuid())
  questionId  String
  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  text        String
  isCorrect   Boolean   @default(false)
  order       Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([questionId])
}
```

### 2. Recommended Libraries

**Rich Text Editor:**
- **Tiptap** (Recommended) - Modern, headless rich text editor with great React support
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-image`
  - `@tiptap/extension-underline`
- Alternative: Lexical by Meta (more complex but very powerful)

**Image Upload:**
- **Cloudinary** integration:
  - `cloudinary` (server-side)
  - `next-cloudinary` (Next.js specific wrapper with components)
- You'll need: Upload widget component for direct client uploads
- Environment variables needed: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**UI Components (if not already using):**
- Shadcn/ui for consistent admin interface
- `@tanstack/react-table` for data tables
- `react-hook-form` + `zod` for form validation

### 3. Route Structure

```
/admin/assessments (or /admin/manuals)
  ├─ /admin/assessments/new (create new manual)
  ├─ /admin/assessments/[manualId]
  │   ├─ /admin/assessments/[manualId]/chapters/new
  │   └─ /admin/assessments/[manualId]/chapters/[chapterId]
```

### 4. Page Components & Features

#### Main Assessment List Page (`/admin/assessments`)
- **Purpose:** List all manuals with search/filter
- **Features:**
  - Data table with columns: Title, Status, Chapters Count, Created Date, Actions
  - "Create New Manual" button
  - Edit/Delete/View actions per row
  - Status filter (Draft/Published/Archived)

#### Manual Detail Page (`/admin/assessments/[manualId]`)
- **Purpose:** View single manual and manage its chapters
- **Features:**
  - Manual metadata display (title, description, status)
  - "Edit Manual" button
  - "Add Chapter" button
  - Chapters table with columns: Order, Title, Questions Count, Actions
  - Drag-and-drop reordering for chapters (use `@dnd-kit/core`)

#### Chapter Detail Page (`/admin/assessments/[manualId]/chapters/[chapterId]`)
- **Purpose:** Edit chapter content and manage questions
- **Features:**
  - Chapter title edit
  - **Tiptap rich text editor** for chapter content with:
    - Bold, italic, underline formatting
    - Image upload (Cloudinary integration)
    - Headings, lists, links
  - "Add Question" button (opens modal)
  - Questions table with columns: Order, Question Text Preview, Answers Count, Actions
  - Drag-and-drop reordering for questions

#### Question Modal/Form
- **Purpose:** Create/edit questions with answers
- **Features:**
  - **Tiptap editor** for question text (smaller, with image support)
  - Dynamic answer fields (minimum 2, add more with "+ Add Answer")
  - Radio button to mark correct answer
  - Order numbers for answers
  - Save/Cancel actions

### 5. API Routes Structure

```typescript
// Manuals
POST   /api/assessments/manuals          // Create manual
GET    /api/assessments/manuals          // List manuals
GET    /api/assessments/manuals/[id]     // Get manual
PATCH  /api/assessments/manuals/[id]     // Update manual
DELETE /api/assessments/manuals/[id]     // Delete manual

// Chapters
POST   /api/assessments/manuals/[id]/chapters           // Create chapter
GET    /api/assessments/manuals/[id]/chapters           // List chapters
GET    /api/assessments/chapters/[id]                   // Get chapter
PATCH  /api/assessments/chapters/[id]                   // Update chapter
PATCH  /api/assessments/chapters/[id]/reorder           // Reorder chapters
DELETE /api/assessments/chapters/[id]                   // Delete chapter

// Questions
POST   /api/assessments/chapters/[id]/questions         // Create question
GET    /api/assessments/chapters/[id]/questions         // List questions
GET    /api/assessments/questions/[id]                  // Get question
PATCH  /api/assessments/questions/[id]                  // Update question
PATCH  /api/assessments/questions/[id]/reorder          // Reorder questions
DELETE /api/assessments/questions/[id]                  // Delete question
```

### 6. Cloudinary Setup Steps

1. Create Cloudinary account at cloudinary.com
2. Get credentials from dashboard (Cloud name, API Key, API Secret)
3. Add to `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
4. Install packages: `npm install next-cloudinary`
5. Use `CldUploadWidget` component for direct uploads in Tiptap

### 7. Implementation Priority

**Phase 1: Foundation**
1. Create Prisma schema and run migration
2. Set up basic route structure
3. Create manual CRUD operations

**Phase 2: Core Features**
4. Implement chapter management
5. Integrate Tiptap editor for chapter content
6. Set up Cloudinary integration

**Phase 3: Questions**
7. Build question modal with dynamic answers
8. Implement question CRUD with Tiptap editor

**Phase 4: Polish**
9. Add drag-and-drop reordering
10. Add validation and error handling
11. Implement search/filter on list pages

## Key Implementation Notes

- **Order fields:** Use for sorting chapters/questions/answers. Update when reordering.
- **Cascade deletes:** Schema includes `onDelete: Cascade` for data integrity
- **Rich text storage:** Store Tiptap content as JSON in database for easy parsing
- **Image URLs:** Store Cloudinary URLs directly in the rich text JSON
- **Validation:** Ensure at least one correct answer per question
- **Auth:** Assume admin-only access (add middleware checks)

## Questions Answered

**Q: What should we name the main page?**
**A:** `/admin/assessments` - Clear, professional, and commonly used in LMS/training systems. Alternative: `/admin/manuals` if that fits your domain better.

**Q: Best libraries for rich text?**
**A:** Tiptap - Modern, modular, great TypeScript support, easy image integration, and perfect for both long-form content (chapters) and short-form (questions).

**Q: How to handle images?**
**A:** Cloudinary with direct client uploads using `next-cloudinary`. This avoids server bandwidth and gives you transformation options. Images embed directly in Tiptap content as URLs.

## Getting Started Command

Run this after reviewing:
```bash
# Install dependencies
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-underline next-cloudinary @tanstack/react-table @dnd-kit/core

# Create migration
npx prisma migrate dev --name add_assessment_system
```

---

**Ready to implement this step-by-step? Start with the Prisma schema migration and we'll build from there.**