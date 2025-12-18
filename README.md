# In-Patient Management System - MVP Instructions

## Project Overview
Hospital in-patient documentation system for tracking patient admissions, daily progress notes, and clinical data. Minimal interface with only 2 pages: dashboard overview and patient detail view using flat route structure.

## Technical Stack
- **Frontend:** Next.js 15 + TypeScript + TailwindCSS + Shadcn/UI
- **Backend:** Next.js API Routes with Prisma ORM
- **Database:** PostgreSQL
- **Hosting:** Vercel

## Database Schema

### Patient Model
- `id` (String, cuid, primary key)
- `hospitalNumber` (String, unique) - HN
- `firstName` (String)
- `lastName` (String)
- `status` (Enum: ADMIT, DISCHARGED)
- `createdAt` (DateTime, auto)
- `updatedAt` (DateTime, auto)
- Relations: `admissions[]`

### Admission Model
- `id` (String, cuid, primary key)
- `admissionNumber` (String, unique) - AN
- `patientId` (String, foreign key)
- `bedNumber` (String)
- `admissionDate` (DateTime)
- `dischargeDate` (DateTime, nullable)
- Clinical fields (all Text, nullable):
  - `chiefComplaint` - CC
  - `historyPresent` - HPI
  - `pastMedicalHx` - PHM
  - `familyHistory` - FH
  - `socialHistory` - SH
  - `allergies` - ALL
  - `medications` - MED
  - `note`
- `createdAt` (DateTime, auto)
- `updatedAt` (DateTime, auto)
- Relations: `patient`, `progressNotes[]`

### ProgressNote Model
- `id` (String, cuid, primary key)
- `admissionId` (String, foreign key)
- SOAP fields (all Text, nullable):
  - `subjective` - S
  - `objective` - O
  - `assessment` - A
  - `plan` - P
- `vitalSigns` (JSON, nullable) - structure: `{bp, hr, rr, temp, o2sat}`
- `note` (Text, nullable)
- `createdAt` (DateTime, auto with timestamp)
- `createdBy` (String) - username/identifier
- Relations: `admission`

### Enums
- `PatientStatus`: ADMIT, DISCHARGED

## Page Structure
```
app/
├── page.tsx                    # Redirect to /dashboard
├── dashboard/
│   └── page.tsx                # Overview of all patients
├── [id]/
│   └── page.tsx                # Patient detail with admission & progress notes
└── api/
    ├── patients/
    │   ├── route.ts            # GET (list with filters), POST (create)
    │   ├── [id]/
    │   │   └── route.ts        # GET (detail), PATCH (update), DELETE
    │   └── search/
    │       └── route.ts        # GET (search by HN)
    ├── admissions/
    │   ├── route.ts            # GET (list), POST (create)
    │   └── [id]/
    │       └── route.ts        # GET, PATCH, DELETE
    └── progress-notes/
        ├── route.ts            # GET (list), POST (create)
        └── [id]/
            └── route.ts        # GET, PATCH, DELETE
```

## Page Specifications

### 1. Root Page (`/`)
- Simple redirect to `/dashboard`
- No content needed

### 2. Dashboard Page (`/dashboard`)

**Purpose:** Central hub showing all in-patients at a glance

**Components:**
- Header with title "ผู้ป่วยใน - Dashboard" and "เพิ่มผู้ป่วยใหม่" button
- Filter section:
  - Search input (by HN or Name)
  - Status filter buttons: ทั้งหมด, Admit, D/C
- Patient table with columns:
  - HN
  - ชื่อ-สกุล (Full name)
  - AN (Current admission number)
  - Bed (Current bed number)
  - CC (Chief complaint - truncated)
  - Admit Date
  - Status badge
- Each row clickable → navigate to `/[id]`

**Data Loading:**
- Fetch from `/api/patients?search={query}&status={filter}`
- Include current admission data (most recent) for each patient
- Default filter: ADMIT status
- Real-time search with debounce

**Actions:**
- Click row → view patient detail
- Add new patient → open modal/dialog with form:
  - HN (required, unique validation)
  - First Name (required)
  - Last Name (required)
  - Auto-set status to ADMIT
  - POST to `/api/patients`

### 3. Patient Detail Page (`/[id]`)

**Purpose:** Complete patient record with admission history and daily progress

**Layout Structure:**
Three main sections stacked vertically:

1. **Patient Header Card**
   - Patient name (large, prominent)
   - HN display
   - Current status badge (ADMIT/DISCHARGED)
   - "กลับ" button (back to dashboard)
   - "Discharge" button (if status = ADMIT)
   - Basic info editable inline

2. **Admission Information Card**
   - Dropdown selector if multiple admissions exist (show AN)
   - Display selected admission details:
     - AN, Bed Number, Admit Date, Discharge Date (if exists)
   - Clinical fields (all as textarea, editable):
     - CC - Chief Complaint
     - HPI - History of Present Illness
     - PHM - Past Medical History
     - FH - Family History
     - SH - Social History
     - ALL - Allergies
     - MED - Medications
     - Note
   - Edit/Save toggle button
   - "เพิ่ม Admission ใหม่" button

3. **Progress Notes Card**
   - Header with "Progress Notes" title
   - "Add Note" button
   - Timeline of notes (newest first)
   - Each note card displays:
     - Timestamp (วัน/เดือน/ปี เวลา)
     - Created by (username)
     - Vital signs section (if exists): BP, HR, RR, Temp, O2 Sat
     - SOAP sections:
       - S - Subjective
       - O - Objective
       - A - Assessment
       - P - Plan
     - Additional note
     - Delete button (icon)

**Data Loading:**
- Fetch from `/api/patients/[id]`
- Include all admissions with nested progress notes
- Auto-select most recent admission
- Sort progress notes by `createdAt` descending

**Key Actions:**

*Discharge Patient:*
- Confirm dialog
- Update patient status to DISCHARGED
- Set current admission's `dischargeDate` to now
- PATCH `/api/patients/[id]` and `/api/admissions/[admissionId]`

*Add Admission:*
- Open modal/dialog with form:
  - AN (required, unique)
  - Bed Number (required)
  - Admission Date (default: today)
  - All clinical fields (optional)
- POST to `/api/admissions`
- Refresh patient data

*Add Progress Note:*
- Open modal/dialog with form:
  - Vital Signs (optional): BP, HR, RR, Temp, O2 Sat
  - S - Subjective (textarea)
  - O - Objective (textarea)
  - A - Assessment (textarea)
  - P - Plan (textarea)
  - Additional Note (textarea)
  - Created By (input, required)
- POST to `/api/progress-notes`
- Auto-add timestamp
- Refresh admission data

*Edit Admission:*
- Toggle edit mode for all clinical fields
- Save button → PATCH `/api/admissions/[id]`
- Cancel button → revert changes

*Delete Progress Note:*
- Confirm dialog
- DELETE `/api/progress-notes/[id]`
- Refresh admission data

## API Endpoints Specification

### Patients API

**GET /api/patients**
- Query params: `search` (optional), `status` (optional: ALL, ADMIT, DISCHARGED)
- Returns: Array of patients with current admission embedded
- Include only most recent admission per patient
- Order by `updatedAt` DESC

**POST /api/patients**
- Body: `{hospitalNumber, firstName, lastName}`
- Validation: HN must be unique
- Auto-set status to ADMIT
- Returns: Created patient object

**GET /api/patients/[id]**
- Returns: Patient with all admissions and nested progress notes
- Admissions ordered by `admissionDate` DESC
- Progress notes ordered by `createdAt` DESC

**PATCH /api/patients/[id]**
- Body: Any patient field to update
- Common use: Update status to DISCHARGED
- Returns: Updated patient object

**DELETE /api/patients/[id]**
- Cascade delete all admissions and progress notes
- Returns: Success response

**GET /api/patients/search**
- Query param: `hn` (hospital number)
- Returns: Patient if found, null if not
- Used for HN autocomplete/validation

### Admissions API

**GET /api/admissions**
- Query params: `patientId` (optional)
- Returns: Array of admissions with nested progress notes
- Order by `admissionDate` DESC

**POST /api/admissions**
- Body: `{admissionNumber, patientId, bedNumber, admissionDate, ...clinicalFields}`
- Validation: AN must be unique
- Returns: Created admission object

**GET /api/admissions/[id]**
- Returns: Admission with nested progress notes
- Progress notes ordered by `createdAt` DESC

**PATCH /api/admissions/[id]**
- Body: Any admission field to update
- Common use: Update clinical fields or set `dischargeDate`
- Auto-update `updatedAt` timestamp
- Returns: Updated admission object

**DELETE /api/admissions/[id]**
- Cascade delete all progress notes
- Returns: Success response

### Progress Notes API

**GET /api/progress-notes**
- Query params: `admissionId` (optional)
- Returns: Array of progress notes
- Order by `createdAt` DESC

**POST /api/progress-notes**
- Body: `{admissionId, subjective, objective, assessment, plan, vitalSigns, note, createdBy}`
- Auto-set `createdAt` to current timestamp
- Vital signs as JSON: `{bp: "120/80", hr: 72, rr: 16, temp: 37.0, o2sat: 98}`
- Returns: Created progress note object

**GET /api/progress-notes/[id]**
- Returns: Single progress note object

**PATCH /api/progress-notes/[id]**
- Body: Any progress note field to update
- Note: `createdAt` and `createdBy` should NOT be updatable
- Returns: Updated progress note object

**DELETE /api/progress-notes/[id]**
- Hard delete
- Returns: Success response

## UI/UX Guidelines

### Design Principles
- Clean, clinical interface - no unnecessary decorations
- High information density without clutter
- Fast data entry - minimal clicks
- Clear visual hierarchy
- Responsive but optimized for desktop (clinical workstation use)

### Component Usage (Shadcn/UI)
- `Card` - All major sections
- `Table` - Patient list on dashboard
- `Badge` - Status indicators (ADMIT/DISCHARGED)
- `Button` - Actions (variants: default, outline, ghost, destructive)
- `Input` - Short text fields
- `Textarea` - Clinical notes and long-form text
- `Dialog` - Modals for add/edit forms
- `Separator` - Visual breaks between sections
- `Select` - Admission selector dropdown

### Color Coding
- ADMIT status: Blue badge
- DISCHARGED status: Gray badge
- Delete actions: Red (destructive variant)
- Progress note cards: Blue left border
- Edit mode: Yellow/amber highlight

### Typography
- Patient name: 2xl, bold
- Section titles: xl, bold
- Field labels: sm, medium
- Clinical text: sm, regular
- Timestamps: sm, text-gray-500

### Spacing
- Page padding: py-8 px-4
- Card spacing: mb-6
- Form field spacing: space-y-4
- Grid gaps: gap-4

## Data Flow Examples

### Creating New Patient
1. User clicks "เพิ่มผู้ป่วยใหม่" on dashboard
2. Dialog opens with form
3. User enters HN, First Name, Last Name
4. On submit: POST `/api/patients`
5. Backend creates patient with status ADMIT
6. Dialog closes, dashboard refreshes
7. New patient appears in list

### Adding Progress Note
1. User on patient detail page
2. Clicks "Add Note" button
3. Dialog opens with SOAP form
4. User fills in sections + vital signs
5. User enters their name in "Created By"
6. On submit: POST `/api/progress-notes` with `admissionId`
7. Backend creates note with current timestamp
8. Dialog closes, progress notes section refreshes
9. New note appears at top of timeline

### Discharging Patient
1. User on patient detail page, patient status = ADMIT
2. Clicks "Discharge" button
3. Confirm dialog appears
4. On confirm:
   - PATCH `/api/patients/[id]` with `{status: "DISCHARGED"}`
   - PATCH `/api/admissions/[currentAdmissionId]` with `{dischargeDate: now()}`
5. Page refreshes
6. Status badge changes to "DISCHARGED"
7. Discharge button hidden
8. Discharge date appears in admission section

## Environment Variables
```
DATABASE_URL="postgresql://neondb_owner:npg_9IPaXnKsY3UW@ep-dark-smoke-a1u448zz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## MVP Scope Definition

### ✅ Included
- Dashboard with patient list and filters
- Patient detail page with full clinical data
- Multiple admissions per patient
- SOAP-formatted progress notes with vital signs
- Add/Edit/Delete operations for all entities
- Discharge workflow
- Search by HN or name
- Automatic timestamps on all entries
- Responsive layout (desktop-optimized)

### ❌ Excluded (Future Phases)
- User authentication system
- Role-based access control (doctor, nurse, pharmacist)
- Medication ordering/management
- Lab results integration
- Vital signs charting/graphs
- Export to PDF/Excel
- Print-friendly views
- Advanced analytics/reports
- Medication administration records (MAR)
- Image uploads (X-rays, documents)
- Multi-language support (Thai only)
- Audit logs
- Data archiving

## Development Priorities

### Phase 1 (Current MVP)
1. Database schema setup with Prisma
2. API routes for all CRUD operations
3. Dashboard page with search/filter
4. Patient detail page with admission data
5. Progress notes timeline with add/delete
6. Basic form validation
7. Deploy to Vercel

### Phase 2 (Next Iteration)
1. Edit functionality for progress notes
2. Vital signs trend visualization
3. Admission history timeline view
4. Enhanced search (by AN, bed number)
5. Bulk operations
6. Data export features

### Phase 3 (Advanced Features)
1. User authentication
2. Role-based permissions
3. Medication reconciliation
4. Lab results display
5. Clinical decision support
6. Analytics dashboard

## Technical Considerations

### Performance
- Implement pagination if patient list > 100
- Use React Query or SWR for data fetching and caching
- Debounce search input (300ms)
- Lazy load progress notes if > 50 per admission

### Data Integrity
- Unique constraints on HN and AN
- Cascade deletes properly configured
- Validate date ranges (admission date ≤ discharge date)
- Prevent editing discharged admissions

### Error Handling
- Display user-friendly error messages in Thai
- Network error handling with retry logic
- Form validation before API calls
- Loading states for all async operations

### Accessibility
- Proper semantic HTML
- Keyboard navigation support
- Focus management in dialogs
- ARIA labels where needed
- Sufficient color contrast

## Code Quality & Linting

### ESLint Configuration
- Follow Next.js 15 + TypeScript strict mode
- Enable all recommended rules from `@typescript-eslint`
- Enforce consistent import ordering
- No unused variables or imports
- Proper TypeScript type annotations (no `any` types)

### Mandatory Linting Rules
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always"
    }],
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

### Code Generation Requirements
When AI generates code, it MUST:

1. **Type Safety:**
   - Define proper TypeScript interfaces/types for all data structures
   - Never use `any` type - use proper types or `unknown` with type guards
   - Include return types for all functions
   - Use generic types where appropriate

2. **Import Organization:**
   - React/Next.js imports first
   - Third-party library imports second
   - Local component imports third
   - Type imports last
   - Alphabetically sorted within each group

3. **Error Handling:**
   - Wrap all async operations in try-catch
   - Type error objects properly
   - Provide meaningful error messages
   - No silent failures

4. **Component Structure:**
   - Use functional components with proper typing
   - Destructure props with TypeScript interface
   - Extract complex logic into custom hooks
   - Memoize expensive operations with `useMemo`/`useCallback`

5. **API Routes:**
   - Proper HTTP status codes (200, 201, 400, 404, 409, 500)
   - Type request body and response
   - Validate input before processing
   - Return consistent error format: `{error: string, details?: any}`

### Pre-commit Checklist
Before delivering any code file, AI must verify:
- [ ] No ESLint errors or warnings
- [ ] All imports are used
- [ ] No `console.log` statements (except in error handling)
- [ ] Proper TypeScript types throughout
- [ ] Consistent code formatting (Prettier compatible)
- [ ] No deprecated Next.js patterns (e.g., legacy API route syntax)

### Common Lint Fixes
- Replace `Response` with `NextResponse` in API routes
- Use `NextRequest` instead of generic `Request`
- Import types explicitly: `import type { Patient } from '@/types'`
- Avoid default exports in utility functions
- Use template literals for multi-line strings
- Prefer `const` over `let` where possible

### Example of Clean API Route
```typescript
// ✅ CORRECT - Fully typed, no lint errors
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Patient } from '@/lib/types';

const prisma = new PrismaClient();

interface CreatePatientBody {
  hospitalNumber: string;
  firstName: string;
  lastName: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<Patient | { error: string }>> {
  try {
    const body = await request.json() as CreatePatientBody;
    
    if (!body.hospitalNumber || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        hospitalNumber: body.hospitalNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        status: 'ADMIT',
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างข้อมูลผู้ป่วยได้' },
      { status: 500 }
    );
  }
}
```

### AI Code Generation Instruction
When writing code for this project, the AI MUST:
1. Run mental lint check on all generated code
2. Fix all type errors before presenting code
3. Ensure imports are properly organized
4. Remove all unused variables/imports
5. Add proper TypeScript types to all functions, props, and variables
6. Use Next.js 15 best practices (App Router conventions)
7. Present code that would pass `npm run lint` without errors

### Verification Command
After generating files, AI should remind user to run:
```bash
npm run lint        # Check for errors
npm run lint:fix    # Auto-fix where possible
npm run type-check  # TypeScript validation
```

## Success Metrics
- Page load time < 2 seconds
- API response time < 500ms
- Zero data loss on form submissions
- 100% uptime on Vercel
- Mobile-usable (though not optimized)
- Zero ESLint errors in production code