# CampusConnect Lite - Code Documentation

This document provides a detailed overview of the CampusConnect Lite application's codebase, architecture, and functionality.

## 1. Entry Point

- **Main Entry File**: `src/app/page.tsx`
- **Initial Execution**: When a user first visits the application's root URL, `src/app/page.tsx` is loaded. It contains a React component that immediately calls `redirect('/login')`. This redirects all users to the login page, making authentication the first step of the user journey. The root layout `src/app/layout.tsx` wraps the entire application, sets up global styles, fonts, the `AuthProvider`, and the `Toaster` for notifications.

## 2. Function / API Documentation

### AI Flows (Genkit)

These server-side functions handle AI-powered features using Genkit.

#### `getChatbotResponse`
- **Name**: `getChatbotResponse`
- **Parameters**: `input: ChatbotInput` containing `studentId` and `question`.
- **Calls**: `chatbotPrompt` which uses `getLatestGrades` and `getAttendanceSummary` tools.
- **Returns**: `Promise<ChatbotOutput>` with a string `answer`.
- **Purpose**: Provides conversational answers to parent/student questions by using AI-powered tools to query the database for academic information.

#### `generateWeeklyDigest`
- **Name**: `generateWeeklyDigest`
- **Parameters**: `input: WeeklyDigestInput` containing `studentName` and a string of `logEntries`.
- **Calls**: `weeklyDigestPrompt`.
- **Returns**: `Promise<WeeklyDigestOutput>` with `kudos` and `concerns` string arrays.
- **Purpose**: Analyzes a student's weekly activity log to create a concise, categorized summary for parents, highlighting achievements and areas for attention.

#### `differentiateContent`
- **Name**: `differentiateContent`
- **Parameters**: `input: DifferentiatorInput` containing `originalText` and `targetLevel`.
- **Calls**: `differentiationPrompt`.
- **Returns**: `Promise<DifferentiatorOutput>` with the `differentiatedText`.
- **Purpose**: Adapts a piece of educational text to be simpler or more advanced, helping teachers cater to diverse learning needs.

#### `generateLessonPlan`
- **Name**: `generateLessonPlan`
- **Parameters**: `input: LessonPlanInput` containing `topic`, `gradeLevel`, and `duration`.
- **Calls**: `lessonPlannerPrompt`.
- **Returns**: `Promise<LessonPlanOutput>` with a Markdown-formatted `lessonPlan`.
- **Purpose**: Assists teachers by generating a detailed, week-long lesson plan based on a given topic and grade level.

#### `generateCareerPathways`
- **Name**: `generateCareerPathways`
- **Parameters**: `input: CareerPathwayInput` containing `studentInterests` and a `targetCareer`.
- **Calls**: `careerPathwayPrompt`.
- **Returns**: `Promise<CareerPathwayOutput>` containing a structured `pathway` object.
- **Purpose**: Generates a high-level career roadmap for students, including key milestones from high school to career entry.

#### `setAcademicGoals`
- **Name**: `setAcademicGoals`
- **Parameters**: `input: AcademicGoalInput` containing `currentScores` and a `targetCareer`.
- **Calls**: `academicGoalPrompt`.
- **Returns**: `Promise<AcademicGoalOutput>` with a list of actionable academic `recommendations`.
- **Purpose**: Provides students with specific academic goals to help them achieve their career aspirations.

### Core React Components

#### `ParentDashboard`
- **Name**: `ParentDashboard`
- **Parameters**: `studentId: string`.
- **Calls**: `useStudents()`, `generateWeeklyDigest()`.
- **Purpose**: Serves as the main landing page for parents and students. It features a **Live Feed** of recent academic events and an **AI Weekly Digest** tab that provides an intelligent summary of the student's week.
- **Dependencies**: `@/hooks/use-students`, `@/ai/flows/ai-weekly-digest`.

#### `ChatbotWidget`
- **Name**: `ChatbotWidget`
- **Parameters**: `studentId: string`.
- **Calls**: `getChatbotResponse()` API endpoint.
- **Purpose**: A floating chat widget available on the parent/student dashboard that allows users to ask natural language questions about their grades and attendance.
- **Dependencies**: `@/ai/flows/ai-chatbot`.

#### `AutomatedMarkingPage`
- **Name**: `AutomatedMarkingPage`
- **Parameters**: None.
- **Calls**: `useStudents().updateGrades()`.
- **Purpose**: Provides a UI for teachers to input correct exam solutions and then enter student answers for automated grading. It also includes a "Print Results" feature.
- **Dependencies**: `@/hooks/use-students`, `@/components/ui/*`.

### Custom Hooks

#### `useAuth`
- **Name**: `useAuth`
- **Parameters**: None.
- **Returns**: An object with `user`, `authState`, `login`, `logout`, `submitMfa`, and `isLoading`.
- **Purpose**: Manages the application's authentication state. It handles a multi-step login process (credentials then MFA) and persists the user session via an HTTP-only cookie by calling Next.js API endpoints (`/api/auth/session`, `/api/auth/login`, `/api/auth/logout`).
- **Dependencies**: `react`, `next/navigation`, `@/hooks/use-audit-log`.

#### API-Driven Data Hooks (`useStudents`, `useFinance`, etc.)
- **Name**: e.g., `useStudents`
- **Parameters**: None.
- **Returns**: State variables (e.g., `students`, `grades`, `isLoading`) and action functions (e.g., `addStudent`).
- **Purpose**: These hooks are now responsible for fetching data from the backend. Each hook makes `fetch` requests to its corresponding API route (e.g., `/api/students`). Crucially, they depend on `useAuth` and only trigger API calls when the `authState` is `'authenticated'`.
- **Dependencies**: `react`, `@/hooks/use-auth`, `@/hooks/use-toast`.

## 3. Flow / Execution Order

1.  **Initial Load & Redirect**: User accesses the site, `src/app/page.tsx` redirects them to `/login`.
2.  **Authentication**: The `LoginPage` is displayed. The user fills the `LoginForm`.
3.  **MFA Step**: The `login` function from `useAuth` updates the state to `awaitingMfa`. The `MfaForm` is displayed.
4.  **Session Creation**: The `submitMfa` function calls the `/api/auth/login` endpoint. The backend creates a session and returns a secure, HTTP-only cookie. The `useAuth` hook then updates its state to `authenticated`.
5.  **Redirection to Dashboard**: The `LoginPage` detects the `authenticated` state and redirects the user to `/dashboard`.
6.  **Authenticated Layout**: `AppLayout` takes over. It confirms authentication via `useAuth` and renders the main application interface.
7.  **Data Fetching**: All data provider hooks (e.g., `StudentProvider`, `FinanceProvider`), now detecting that `authState` is `authenticated`, trigger their `fetch` requests to the backend APIs (e.g., `/api/students`).
8.  **Page Rendering**: Once data is loaded, the requested page component (e.g., `StudentsPage`) renders with live data from the backend.
9.  **AI Feature Interaction**: On pages like "AI Weekly Digest", the user interacts with a component that calls a server-side Genkit flow (e.g., `generateWeeklyDigest`) to get an AI-generated result.

## 4. Backend Integration Strategy

The application has been refactored from a mock, `localStorage`-based prototype to a full-stack application with a Next.js API backend and a Prisma/SQLite database. All data is now fetched and persisted via API routes.

## 5. Dependencies / External Modules

- **next**: The core React framework for server-side rendering, routing, and API development.
- **react** & **react-dom**: Libraries for building the user interface.
- **@prisma/client**: The ORM used to interact with the SQLite database from the backend API routes.
- **genkit** & **@genkit-ai/googleai**: Used for all Generative AI functionality, including defining AI flows and interacting with Google's Gemini models.
- **zod**: Used for schema declaration and validation, particularly for defining the input and output structures of AI flows.
- **tailwindcss**: A utility-first CSS framework for styling the application.
- **shadcn/ui** (via `@radix-ui` and `lucide-react`): A collection of beautifully designed, accessible, and reusable UI components (Buttons, Cards, Dialogs, etc.).
- **recharts**: A composable charting library used for displaying graphs.
- **jspdf** & **xlsx**: Libraries used for generating PDF and Excel report exports.

## 6. Usage Guide (Local Development)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Set up Database**: Apply database migrations and seed it with initial data.
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
3.  **Start the Genkit Server**: (For AI features)
    ```bash
    npm run genkit:dev
    ```
4.  **Start the Next.js Development Server**: (Main App & API)
    ```bash
    npm run dev
    ```
5.  **Access the App**:
    Open your browser and navigate to `http://localhost:9002`.