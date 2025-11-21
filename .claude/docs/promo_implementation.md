# Promo Navideña Feature Implementation Guide

This document outlines the step-by-step implementation plan for adding a promotional raffle feature to the events management system.

---

## **Step 1: Database Schema & Type Updates**

**Context:** We're adding a new `hasPromo` boolean flag to track customers participating in a promotional campaign.

**Tasks:**
1. Update `schema.prisma`:
   - Add `hasPromo Boolean @default(false)` field to the Event model
   - Make it optional so existing events aren't affected
   
2. Generate Prisma migration:
   - Run `npx prisma migrate dev --name add_has_promo_to_events`
   - Update Prisma client types

3. Update TypeScript types/interfaces:
   - Find and update any Event type definitions to include the new `hasPromo` field

**Validation:** Confirm the migration runs successfully and types are updated.

---

## **Step 2: Event Form UI Enhancement**

**Context:** Add a visually distinctive "hasPromo" toggle to the event creation/edit form.

**File to modify:** `src/app/events/forms/EventsForm.tsx`

**Tasks:**
1. Add a new Switch component for `hasPromo` next to the `hasMedical` switch
2. Style it to be "shiny" and eye-catching (consider using a gold/yellow accent color or subtle glow effect)
3. Label it clearly as "Promo Participant" or similar
4. Ensure it's properly connected to form state and validation
5. Set default value to `false`

**Design considerations:**
- Use a distinctive color (gold/yellow/green) to differentiate from hasMedical
- Consider adding a small badge icon (🎁 or ✨) or tooltip explaining the promo

---

## **Step 3: Events Table Visual Indicators**

**Context:** Add visual indicators in both event tables to quickly identify promo participants.

**Files to modify:** 
- `src/app/events/eventsTable/EventsTable.tsx`
- `src/app/events/referredTable/ReferredTable.tsx`

**Tasks:**
1. In both tables, under the `customer.name` row:
   - Add a conditional render that shows ONLY when `hasPromo === true`
   - Use Lucide's `Bike` (motorbike) icon
   - Style it with the app's red color
   - Wrap it in a Popover component with text like "Participating in Promo" or "Promo Entry"

2. Ensure the icon is properly aligned and doesn't break table layout

**Implementation note:** Check the current table structure and cell rendering patterns to maintain consistency.

---

## **Step 4: Promo API Endpoint**

**Context:** Create a backend API endpoint to fetch promo participants who have paid.

**Reference:** Study existing API patterns in the project (check `/assets` page API)

**Tasks:**
1. Create new API route: `src/app/api/promo-participants/route.ts` (or similar based on project structure)

2. Implement GET endpoint with filters:
   - Filter 1: `hasPromo === true`
   - Filter 2: Payment validation (hasPaid check)
     ```typescript
     const hasPaid = (price - cashAdvance) <= 0
     ```

3. Return data structure:
   ```typescript
   {
     id: string,
     customerName: string,
     customerPhone: string,
     assetName: string,
     eventDate: Date
   }
   ```

4. Include proper error handling and pagination if needed

---

## **Step 5: Promo Page UI**

**Context:** Create a simple, clean page to display promo participants.

**Reference page:** `/assets` page for UI patterns

**Tasks:**
1. Create new page: `src/app/promo-navidena/page.tsx`
2. Add navigation/routing as needed
3. Implement simple table with columns:
   - Customer Full Name
   - Asset Name  
   - Event Date

4. Add two action buttons in the header:
   - "Export to Excel" button
   - "Generate Raffle" button

5. Fetch data from the API endpoint created in Step 4
6. No filters needed - just display the data

**UI considerations:** Keep it clean and straightforward, matching the app's existing design patterns.

---

## **Step 6: Excel Export Functionality**

**Context:** Allow exporting promo participant data to Excel.

**Tasks:**
1. Install necessary package if not present: `xlsx` or similar
2. Implement export function that:
   - Takes the current table data
   - Converts to Excel format
   - Triggers download with filename like `promo-navidena-{date}.xlsx`

3. Wire up to the "Export to Excel" button

**Data to include:** All visible columns (Customer Name, Asset Name, Event Date)

---

## **Step 7: Raffle Generator API Endpoint**

**Context:** Backend logic to randomly select one winner from eligible participants.

**Tasks:**
1. Create API endpoint: `src/app/api/promo-raffle/generate/route.ts` (or similar)

2. Implement POST endpoint that:
   - Applies same filters as the list (hasPromo=true, hasPaid=true)
   - Randomly selects ONE participant from the pool
   - Uses cryptographically secure random selection if possible
   - Returns winner data:
     ```typescript
     {
       id: string,
       customerName: string,
       customerPhone: string,
       assetName: string
     }
     ```

3. Add proper error handling (no participants, database errors, etc.)

**Important:** Ensure randomness is truly random and fair.

---

## **Step 8: Raffle Modal UI with Animation**

**Context:** Create an engaging, animated raffle experience.

**Tasks:**
1. Create a modal/dialog component that opens when "Generate Raffle" is clicked

2. Implement animation sequence (minimum 5 seconds):
   - Show animated loading/spinning effect
   - Display random names cycling through quickly (creates suspense)
   - Gradually slow down to reveal winner
   - Use canvas-confetti: https://www.kirilv.com/canvas-confetti/

3. After animation completes:
   - Show confetti celebration
   - Display winner's name prominently
   - Show phone number in a "hidden" way with copy-to-clipboard functionality
     - Perhaps use a blur effect with "Click to reveal" or show as `***-***-1234` with copy icon

4. Call the API endpoint from Step 7 when "Generate" button is clicked

5. Handle edge cases:
   - No eligible participants
   - API errors
   - Loading states

**UI/UX considerations:**
- Study the app's existing modal/dialog patterns
- Make it feel celebratory and exciting
- Ensure the phone number privacy feature is intuitive
- Add proper loading states and error messages

---

## **Execution Order Summary**

Follow these steps in order for smooth implementation:

1. ✅ **Database Schema (Step 1)** - Foundation for all features
2. ✅ **Form UI (Step 2)** - Enable data entry for new field
3. ✅ **Table Indicators (Step 3)** - Visual feedback for promo participants
4. ✅ **Promo API (Step 4)** - Backend data fetching logic
5. ✅ **Promo Page (Step 5)** - Main user interface
6. ✅ **Excel Export (Step 6)** - Data export functionality
7. ✅ **Raffle API (Step 7)** - Winner selection logic
8. ✅ **Raffle Modal (Step 8)** - Engaging user experience

Each step is self-contained and can be tested independently before moving to the next one.

---

## **Testing Checklist**

After completing all steps, verify:

- [ ] `hasPromo` field saves correctly in database
- [ ] Form toggle works in both create and edit modes
- [ ] Table icons appear only for promo participants
- [ ] Promo participants list shows correct filtered data
- [ ] Excel export downloads with correct data
- [ ] Raffle selection is random and fair
- [ ] Raffle animation runs smoothly for 5+ seconds
- [ ] Confetti displays on winner selection
- [ ] Phone number can be copied to clipboard
- [ ] All error states are handled gracefully