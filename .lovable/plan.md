
# Auto-Generated PDF Certificates Plan

## Overview
Implement a comprehensive certificate generation system that creates unique, professionally-designed PDF certificates when students complete courses. Each of the 10 courses will have a themed certificate design inspired by the reference images, with the student's name, course title, completion date, verification code, and instructor signature.

---

## Architecture Summary

```text
+-------------------+     +--------------------+     +-------------------+
|  Course Complete  | --> |   Certificate DB   | --> |  PDF Generation   |
|    Detection      |     |      Record        |     |    (jsPDF)        |
+-------------------+     +--------------------+     +-------------------+
         |                         |                         |
         v                         v                         v
   LessonViewer.tsx        certificates table          CertificateView
   detects 100%            verification_code           downloads PDF
   completion              issued_at                   with themed design
```

---

## Database Schema

### New Table: `certificates`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to user |
| course_id | uuid | Reference to completed course |
| verification_code | text | Unique 12-character code (e.g., SSA-XXXX-XXXX) |
| issued_at | timestamp | When certificate was generated |
| student_name | text | Snapshot of student name at time of issue |
| course_title | text | Snapshot of course title at time of issue |
| created_at | timestamp | Record creation time |

**RLS Policies:**
- Users can SELECT their own certificates
- INSERT allowed only when user has completed 100% of course lessons
- No UPDATE/DELETE for data integrity

---

## Certificate Design Themes

Each course will have a unique visual theme based on the provided reference designs:

| Course # | Course Title | Theme |
|----------|--------------|-------|
| 1 | The Solo Singularity | Vintage compass/navigation |
| 2 | Signal in the Noise | Nautical/ocean exploration |
| 3 | Neon Identity | Cyberpunk/neon circuit |
| 4 | The Ghost Machine | Steampunk gears |
| 5 | The Infinite Loop | Art deco/megaphone |
| 6 | Digital Gravity | Organic/nature patterns |
| 7 | Zero-Point Energy | Financial/vintage bank note |
| 8 | The Neuro-Link | Art deco/golden geometric |
| 9 | Future State | Modern strategic/timeline |
| 10 | The Final Transmission | Theater/stage curtains |

---

## Implementation Components

### 1. Database Migration
Create `certificates` table with:
- Unique constraint on (user_id, course_id) - one cert per course per user
- Verification code with unique constraint
- RLS policies for security

### 2. New Hook: `useCertificates.ts`
- `useUserCertificates(userId)` - Fetch all user certificates
- `useCourseCertificate(userId, courseId)` - Check if cert exists for specific course
- `useGenerateCertificate()` - Create new certificate record
- `useVerifyCertificate(code)` - Public verification lookup

### 3. Certificate PDF Generator: `src/lib/certificateGenerator.ts`
Using jsPDF library to create themed PDF certificates:
- Course-specific color schemes and decorative elements
- Student name prominently displayed
- Course title and completion date
- Verification code and QR placeholder area
- "SoloSuccess Academy" branding
- Instructor signature graphic

### 4. Certificate Display Component: `src/components/certificates/CertificateCard.tsx`
- Preview thumbnail of certificate
- Download PDF button
- Share/copy verification link
- Issue date display

### 5. Certificates Page: `src/pages/Certificates.tsx`
- Grid display of all earned certificates
- Empty state for users with no certificates
- Filter by phase
- Certificate count in Dashboard stats

### 6. Integration Points

**LessonViewer.tsx:**
- When course completion is detected (100%), automatically generate certificate
- Show celebratory modal with certificate preview
- Add "View Certificate" button

**CourseDetail.tsx:**
- Show certificate badge/button if course is complete
- "Download Certificate" CTA

**Dashboard.tsx:**
- Update Certificates stat counter to show actual count
- Link to certificates page

**Profile.tsx:**
- Add certificates section showing earned certificates

### 7. Public Verification Page: `src/pages/VerifyCertificate.tsx`
- Route: `/verify/:verificationCode`
- Displays certificate details publicly
- Shows student name, course, and issue date
- Confirms authenticity

---

## Certificate PDF Layout Specification

```text
+------------------------------------------+
|            [Decorative Border]           |
|                                          |
|          SoloSuccess Academy             |
|                                          |
|          [Course Title]                  |
|        Certificate of Completion         |
|                                          |
|     This is to certify that              |
|                                          |
|         [STUDENT NAME]                   |
|                                          |
|   has successfully completed all         |
|   requirements for the course            |
|                                          |
|   Issued: [Date]                         |
|                                          |
|   [Signature]        Verification:       |
|   SoloSuccess Academy    SSA-XXXX-XXXX   |
|                                          |
+------------------------------------------+
```

---

## Technical Details

### Dependencies
- `jspdf` - PDF generation library (to be added)

### Certificate Generation Flow
1. User completes final lesson of course
2. System detects 100% completion in LessonViewer
3. Check if certificate already exists for this user+course
4. If not, generate unique verification code (SSA-XXXX-XXXX format)
5. Insert certificate record in database
6. Show celebration modal with download option
7. Award XP bonus for course completion (integrate with gamification)

### Verification Code Format
`SSA-XXXX-XXXX` where X = alphanumeric characters
- Example: `SSA-4K7M-9NP2`
- 8 random characters = ~2.8 trillion combinations

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/xxx_certificates.sql` | Database schema |
| `src/hooks/useCertificates.ts` | Data fetching hooks |
| `src/lib/certificateGenerator.ts` | PDF generation logic |
| `src/lib/certificateThemes.ts` | Course-specific design themes |
| `src/components/certificates/CertificateCard.tsx` | Certificate display card |
| `src/components/certificates/CertificateModal.tsx` | Celebration modal |
| `src/pages/Certificates.tsx` | Certificates gallery page |
| `src/pages/VerifyCertificate.tsx` | Public verification page |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add certificate routes |
| `src/pages/LessonViewer.tsx` | Trigger cert generation on completion |
| `src/pages/CourseDetail.tsx` | Show certificate download if complete |
| `src/pages/Dashboard.tsx` | Show actual certificate count |
| `src/pages/Profile.tsx` | Add certificates section |
| `src/components/layout/AppSidebar.tsx` | Add certificates nav link |
| `package.json` | Add jspdf dependency |

---

## Security Considerations

1. **RLS Policy for INSERT**: Validate user has completed all lessons before allowing certificate creation
2. **Immutable Records**: No UPDATE/DELETE policies - certificates are permanent
3. **Verification Code**: Generated server-side style (in frontend but validated pattern)
4. **Student Name Snapshot**: Store name at time of issue to prevent retroactive changes
