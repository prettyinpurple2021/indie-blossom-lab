

# SoloSuccess Academy - AI Learning Management System

## Overview

Building a full-featured AI-powered Learning Management System (LMS) for SoloSuccess Academy. The platform will guide solo founders through 10 comprehensive courses, culminating in a professional portfolio website and 20-minute pitch presentation.

---

## Architecture

```text
+------------------------------------------+
|              Frontend (React)            |
+------------------------------------------+
|  Landing Page  |  Auth  |  Dashboard     |
|  Course View   |  Lessons  |  Projects   |
|  AI Tutor Chat |  Discussions | Progress |
+------------------------------------------+
              |
              v
+------------------------------------------+
|          Lovable Cloud Backend           |
+------------------------------------------+
|  Supabase Database (PostgreSQL)          |
|  - Users & Profiles                      |
|  - Courses, Lessons, Progress            |
|  - Projects & Submissions                |
|  - Discussions & Comments                |
|  - AI Chat History                       |
+------------------------------------------+
|  Edge Functions                          |
|  - AI Tutor (streaming chat)             |
|  - Project Feedback                      |
|  - Quiz Generation                       |
+------------------------------------------+
|  Storage (Assets & Media)                |
+------------------------------------------+
```

---

## Database Schema

### Core Tables

**profiles** - Extended user information
- id (FK to auth.users)
- display_name
- avatar_url
- bio
- current_course_id
- created_at, updated_at

**user_roles** - Role-based access control
- id, user_id (FK)
- role (enum: admin, student)

**courses** - The 10 academy courses
- id, order_number
- title, description, phase
- plug_and_play_asset
- discussion_question
- project_title, project_description
- is_published

**lessons** - Individual lessons per course
- id, course_id (FK)
- order_number, title, type (text/video/quiz/assignment)
- content (markdown), video_url
- duration_minutes

**user_progress** - Track completion
- id, user_id, lesson_id
- completed, completed_at
- quiz_score, notes

**course_projects** - Student project submissions
- id, user_id, course_id
- submission_content, file_urls
- ai_feedback, ai_feedback_at
- status (draft/submitted/reviewed)
- submitted_at

**discussions** - Course discussion threads
- id, course_id, user_id
- title, content
- is_pinned, created_at

**discussion_comments** - Replies to discussions
- id, discussion_id, user_id
- content, parent_comment_id
- created_at

**ai_chat_sessions** - AI tutor conversations
- id, user_id, course_id, lesson_id
- created_at

**ai_chat_messages** - Individual messages
- id, session_id, role (user/assistant)
- content, created_at

---

## Feature Breakdown

### Phase 1: Foundation

1. **Authentication System**
   - Email/password signup and login
   - User profile management
   - Session persistence
   - Protected routes

2. **Landing Page**
   - Hero section with value proposition
   - Course overview (10 courses, 3 phases)
   - Testimonials/social proof section
   - Call-to-action for signup

3. **Dashboard**
   - Welcome message with current progress
   - Course roadmap visualization
   - Continue where you left off
   - Overall completion percentage

### Phase 2: Course Experience

4. **Course Catalog**
   - Grid/list of all 10 courses by phase
   - Progress indicators per course
   - Lock/unlock based on prerequisites
   - Course cards with thumbnails

5. **Course Detail Page**
   - Course overview and objectives
   - Lesson list with completion status
   - Plug-and-Play asset download
   - Discussion question highlight
   - Project requirements

6. **Lesson Viewer**
   - Text content with markdown rendering
   - Embedded video player
   - Progress auto-save
   - Mark complete button
   - Previous/Next navigation

7. **Quiz System**
   - Multiple choice questions
   - AI-generated quiz content
   - Score tracking
   - Retry capability

### Phase 3: AI Features

8. **AI Tutor Chat**
   - Streaming chat interface
   - Context-aware (knows current course/lesson)
   - Conversation history
   - Suggested questions
   - Available on every lesson

9. **AI Project Feedback**
   - Submit project work
   - AI analyzes against rubric
   - Detailed feedback with suggestions
   - Iterate and resubmit

10. **AI Quiz Generation**
    - Generate practice quizzes per lesson
    - Adaptive difficulty
    - Explanations for answers

### Phase 4: Community

11. **Discussion Boards**
    - Thread per course
    - Create new discussions
    - Reply to threads
    - Upvote/like system
    - Instructor pinned posts

### Phase 5: Progress & Portfolio

12. **Progress Tracking**
    - Visual course completion
    - Time spent analytics
    - Achievement badges
    - Certificate of completion

13. **Portfolio Builder** (Course 10)
    - Aggregate all 9 project submissions
    - Generate portfolio website preview
    - Export/download capability

---

## File Structure

```text
src/
  components/
    layout/
      Header.tsx
      Sidebar.tsx
      Footer.tsx
      ProtectedRoute.tsx
    landing/
      Hero.tsx
      CoursePreview.tsx
      Testimonials.tsx
    dashboard/
      ProgressOverview.tsx
      CourseRoadmap.tsx
      RecentActivity.tsx
    courses/
      CourseCard.tsx
      CourseList.tsx
      LessonList.tsx
      LessonContent.tsx
      VideoPlayer.tsx
    ai/
      AiTutor.tsx
      ChatMessage.tsx
      ChatInput.tsx
      ProjectFeedback.tsx
      QuizGenerator.tsx
    discussions/
      DiscussionList.tsx
      DiscussionThread.tsx
      CommentForm.tsx
    projects/
      ProjectSubmission.tsx
      ProjectList.tsx
      FeedbackDisplay.tsx
    ui/
      (existing shadcn components)
  pages/
    Index.tsx (Landing)
    Auth.tsx
    Dashboard.tsx
    Courses.tsx
    CourseDetail.tsx
    Lesson.tsx
    Projects.tsx
    Discussions.tsx
    Profile.tsx
  hooks/
    useAuth.ts
    useCourses.ts
    useProgress.ts
    useAiChat.ts
    useDiscussions.ts
  lib/
    courseData.ts (curriculum content)
    utils.ts
  integrations/
    supabase/
      client.ts
      types.ts

supabase/
  functions/
    ai-tutor/index.ts
    ai-project-feedback/index.ts
    ai-quiz-generator/index.ts
  config.toml
```

---

## Course Data Structure

All 10 courses from your curriculum will be seeded:

**Phase 1: Initialization (Identity and Intel)**
1. The Solo Singularity - Mindset and Vision (6 lessons)
2. Signal in the Noise - AI Market Intelligence (7 lessons)
3. Neon Identity - AI-Powered Branding (8 lessons)

**Phase 2: Orchestration (Building the Machine)**
4. The Ghost Machine - Workflow Automation (9 lessons)
5. The Infinite Loop - Content Multiplier (8 lessons)
6. Digital Gravity - Attracting Your Audience (7 lessons)
7. Zero-Point Energy - Financial Bootstrapping (6 lessons)

**Phase 3: Launch Sequence (Sales and Future)**
8. The Neuro-Link - Psychology of Sales (8 lessons)
9. Future State - Strategic Roadmapping (7 lessons)
10. The Final Transmission - Storytelling and Pitch (11 lessons)

Each course includes:
- Lesson content (text and video placeholders)
- Plug-and-Play downloadable asset
- Discussion question
- Course project with AI feedback

---

## Edge Functions

### ai-tutor
- Streaming chat using Lovable AI Gateway
- System prompt with course context
- Maintains conversation history
- Answers questions about lesson material

### ai-project-feedback
- Analyzes project submissions
- Returns structured feedback
- Scores against rubric
- Provides improvement suggestions

### ai-quiz-generator
- Generates quiz questions from lesson content
- Multiple choice format
- Returns correct answers with explanations

---

## UI/UX Design

**Theme**: Cyberpunk/tech aesthetic matching "SoloSuccess" branding
- Dark mode primary with neon accents
- Purple/cyan color palette
- Modern typography
- Animated progress indicators

**Responsive Design**
- Mobile-first approach
- Collapsible sidebar on tablet/mobile
- Touch-friendly interactions

---

## Technical Considerations

### RLS Policies
All tables will have Row Level Security:
- Users can only see their own progress/submissions
- Public read access for courses and lessons
- Discussions visible to all authenticated users
- Admin role for content management

### Performance
- Lazy load video content
- Paginate discussions
- Cache course data with React Query
- Optimistic updates for progress

### Security
- JWT validation on edge functions
- Input sanitization on submissions
- Rate limiting on AI endpoints

---

## Implementation Order

1. Enable Lovable Cloud
2. Set up database schema with migrations
3. Implement authentication flow
4. Build landing page
5. Create dashboard with progress tracking
6. Build course catalog and detail pages
7. Implement lesson viewer (text + video)
8. Add AI tutor chat (streaming)
9. Build project submission system
10. Add AI project feedback
11. Implement quiz system with AI generation
12. Build discussion boards
13. Add portfolio builder for Course 10
14. Polish UI and add animations
15. Seed all curriculum content

---

## Estimated Scope

- **Pages**: 10 main pages
- **Components**: 30+ custom components
- **Database Tables**: 11 tables
- **Edge Functions**: 3 AI-powered functions
- **Lessons to Seed**: 77 lessons across 10 courses

This will be a comprehensive, production-ready LMS that guides solo founders from mindset to portfolio.

