

## Plan: Create 5 New Student-Facing Pages

### Task 1: Help Center / FAQ Page (`/help`)
- Create `src/pages/HelpCenter.tsx` as a public route
- Include all FAQ content from `docs/FAQ.md` in accordion format
- Add a search bar to filter FAQ items
- Add a "Contact Support" section at the bottom with a simple contact form (name, email, message) that uses `mailto:` or a toast confirmation (no backend needed initially)
- Categories: General, Learning Experience, Gamification, Account & Access, Legal & Permissions
- Style: matches existing cyberpunk EdTech aesthetic with glass cards

### Task 2: Notifications Page (`/notifications`)
- Create `src/pages/Notifications.tsx` as a protected route
- Full-page version of the existing `NotificationBell` popover content
- Reuses `useNotifications`, `useMarkAsRead`, `useMarkAllAsRead`, `useDeleteNotification` hooks
- Shows all notifications with read/unread filtering tabs, bulk actions
- Add a "View All" link in the `NotificationBell` popover that navigates to `/notifications`

### Task 3: About Us Page (`/about`)
- Create `src/pages/About.tsx` as a public route
- Mission statement, platform vision, "Who is this for?" section
- Platform stats (10 courses, 3 phases, AI-powered)
- Style consistent with landing page sections

### Task 4: Contact Us Page (`/contact`)
- Create `src/pages/Contact.tsx` as a public route
- Contact form (name, email, subject, message) with toast confirmation
- Links to Help Center/FAQ, social media, and email
- No backend needed — form submits via `mailto:` link or shows a success toast

### Task 5: Student Transcript Page (`/transcript`)
- Create `src/pages/Transcript.tsx` as a protected route
- Reuses data from existing hooks: `useOverallProgress`, `useCourses`, `useUserProgress`, `useUserCertificates`, `useGradeSettings`
- Uses `calculateCombinedGrade` from `useGradebook.ts` for grade calculations
- Shows per-course: completion %, quiz/activity/worksheet scores, letter grade, certificate status
- Overall GPA summary at the top
- Printable/downloadable layout consideration

### Route & Navigation Changes
- **`App.tsx`**: Add 6 new lazy imports and routes:
  - Public: `/help`, `/about`, `/contact` inside `PublicLayout`
  - Protected: `/notifications`, `/transcript` inside `AppLayout`
- **`AppSidebar.tsx`**: Add "Transcript" to main nav items, add "Help" link
- **`NotificationBell.tsx`**: Add "View All" link pointing to `/notifications`
- **`Footer.tsx`**: Add Help Center, About, and Contact links to the Resources column
- **`PublicHeader.tsx`**: Add "About" and "Help" links to desktop/mobile nav

### No database changes needed
All pages use existing tables and hooks. No new migrations required.

