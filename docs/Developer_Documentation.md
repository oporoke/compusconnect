# CampusConnect Lite - Code Documentation

This document provides a detailed overview of the CampusConnect Lite application's codebase, architecture, and functionality.

## 1. Entry Point

- **Main Entry File**: `src/app/page.tsx`
- **Initial Execution**: When a user first visits the application's root URL, `src/app/page.tsx` is loaded. It contains a React component that immediately calls `redirect('/login')`. This redirects all users to the login page, making authentication the first step of the user journey. The root layout `src/app/layout.tsx` wraps the entire application, sets up global styles, fonts, the `AuthProvider`, and the `Toaster` for notifications.

## 2. Function / API Documentation

### AI Flows (Genkit)

These server-side functions handle AI-powered features using Genkit.

#### `generateReportCard`
- **Name**: `generateReportCard`
- **Parameters**: `input: ReportCardInput` which is an object containing `studentName: string` and `grades: string`.
- **Calls**: `generateReportCardFlow` (internal Genkit flow).
- **Returns**: `Promise<ReportCardOutput>` which is an object containing `summary: string` and `reportCard: string`.
- **Purpose**: Takes a student's name and grades as input and uses an AI model to generate a personalized, encouraging summary and a fully formatted report card text.
- **Dependencies**: `genkit`, `zod`.

#### `generateTimetable`
- **Name**: `generateTimetable`
- **Parameters**: `input: TimetableInput` which is an object containing `courseSchedules: string` and `instructorAvailability: string`.
- **Calls**: `generateTimetableFlow` (internal Genkit flow).
- **Returns**: `Promise<TimetableOutput>` which is an object containing `timetable: string`.
- **Purpose**: Generates a conflict-free timetable based on the provided course schedules and instructor availability, using an AI model to resolve scheduling complexities.
- **Dependencies**: `genkit`, `zod`.

### Core React Components

#### `LoginForm`
- **Name**: `LoginForm`
- **Parameters**: None.
- **Calls**: `useAuth().login(role)`.
- **Purpose**: Provides a user interface for users to select their role (Admin, Teacher, Student, Parent) and sign in. It uses the `useAuth` hook to trigger the login process.
- **Dependencies**: `@/hooks/use-auth`, `@/lib/auth`, `@/components/ui/*`.

#### `AppLayout`
- **Name**: `AppLayout`
- **Parameters**: `children: React.ReactNode`.
- **Calls**: `useAuth()`, `useRouter()`.
- **Purpose**: This is the main layout for authenticated users. It protects routes by checking for a valid user session. If no user is logged in, it redirects to `/login`. It renders the `AppSidebar` for navigation and the main content area for the specific page.
- **Dependencies**: `@/hooks/use-auth`, `next/navigation`, `@/components/layout/app-sidebar`.

#### `AppSidebar`
- **Name**: `AppSidebar`
- **Parameters**: `user: User`.
- **Calls**: `useAuth().logout()`.
- **Purpose**: Renders the main navigation sidebar. It dynamically displays navigation links based on the logged-in user's role. It also shows user information and a logout button.
- **Dependencies**: `@/hooks/use-auth`, `@/lib/auth`, `next/link`, `next/navigation`.

#### `StudentProfilePage`
- **Name**: `StudentProfilePage`
- **Parameters**: `params: { id: string }`.
- **Calls**: None directly, but renders various UI components.
- **Purpose**: Displays the detailed profile of a single student, identified by the ID in the URL. It shows personal details, academic performance charts, attendance, and contact information.
- **Dependencies**: `@/lib/data`, `next/navigation`, `recharts`, `@/components/ui/*`.

#### `GradebookTable`
- **Name**: `GradebookTable`
- **Parameters**: None.
- **Calls**: `useToast()`.
- **Purpose**: Displays a table of all students and their grades in Math, Science, and English. It allows users (teachers/admins) to edit the grades directly in the input fields and save the changes.
- **Dependencies**: `@/lib/data`, `@/hooks/use-toast`, `@/components/ui/*`.

### Custom Hooks

#### `useAuth`
- **Name**: `useAuth`
- **Parameters**: None.
- **Returns**: An object with `user: User | null`, `login: (role: Role) => void`, `logout: () => void`, and `isLoading: boolean`.
- **Purpose**: Manages the application's authentication state. It handles logging in, logging out, and persisting the user session using `localStorage`. It provides the user's data and auth status to any component that consumes it.
- **Dependencies**: `react`, `next/navigation`, `@/lib/auth`.

## 3. Flow / Execution Order

1.  **Initial Load & Redirect**: User accesses the site, `src/app/page.tsx` redirects them to `/login`.
2.  **Authentication**: The `LoginPage` is displayed. The user selects a role from the `LoginForm` and clicks "Sign In".
3.  **Login Process**: The `login` function from `useAuth` is called. It finds the corresponding user object from `USERS` in `src/lib/auth.ts`, saves it to `localStorage`, and updates the state.
4.  **Redirection to Dashboard**: The `useEffect` in `LoginPage` detects the user is now logged in and redirects them to `/dashboard`.
5.  **Authenticated Layout**: `AppLayout` takes over. It confirms the user is authenticated via `useAuth` and renders the main application interface, including the `AppSidebar` and the content for the `/dashboard` route.
6.  **Navigation**: The `AppSidebar` displays links accessible to the user's role. Clicking a link (e.g., "Students") navigates the user to the corresponding page (`/students`).
7.  **Page Rendering**: The requested page component (e.g., `StudentsPage`) renders. It fetches its data from the mock data file (`src/lib/data.ts`) and displays it using reusable UI components from `@/components/ui`.
8.  **AI Feature Interaction**: On pages like "Timetable" or "Report Cards", the user interacts with a generator component (e.g., `TimetableGenerator`). This component collects input and calls the relevant server-side Genkit flow (e.g., `generateTimetable`) to get an AI-generated result, which is then displayed to the user.
9.  **Logout**: The user clicks the logout button in the `AppSidebar`. The `logout` function from `useAuth` is called, clearing `localStorage` and redirecting the user back to the `/login` page.

## 4. Backend Integration Strategy (Next Steps)

The current implementation uses `localStorage` and mocked data to simulate a fully functional application. The next phase of development would involve replacing these mocks with a real backend. Here is a recommended strategy:

1.  **Database Setup**:
    *   **Action**: Choose and configure a production-grade database (e.g., Firebase Firestore, Supabase/PostgreSQL).
    *   **Purpose**: To replace `localStorage` and provide a persistent, scalable, and secure data store for all application data (students, staff, grades, invoices, etc.).

2.  **API Layer Development**:
    *   **Action**: Create API endpoints using Next.js API Routes or Server Actions for each data model. For example:
        *   `GET /api/students`
        *   `POST /api/students`
        *   `PUT /api/students/[id]`
        *   `DELETE /api/students/[id]`
    *   **Purpose**: These endpoints will serve as the bridge between the frontend and the database, handling all data manipulation (CRUD) operations.

3.  **Refactor Frontend Hooks**:
    *   **Action**: Modify the custom hooks in `src/hooks/*.tsx` (e.g., `useStudents`, `useFinance`) to replace `localStorage` calls with `fetch` requests to the new API endpoints.
    *   **Purpose**: This will connect the frontend components to the live backend data, making the application data-dynamic. The `isLoading` states in these hooks will now reflect real network request statuses.

4.  **Implement Real Authentication**:
    *   **Action**: Replace the mocked `useAuth` logic with a real authentication provider (e.g., Firebase Authentication, NextAuth.js).
    *   **Purpose**: To handle secure user sign-up, sign-in, session management, and password/MFA verification.

5.  **Integrate Third-Party Services**:
    *   **Action**: Connect the backend to external APIs for services that cannot be handled on the client-side.
        *   **Payments**: Integrate Stripe, PayPal, or M-Pesa APIs within your backend. The frontend payment dialogs would trigger calls to your API, which then securely communicates with the payment gateway.
        *   **Notifications**: Use services like Twilio (for SMS) or SendGrid (for email) to send automated notifications. A backend cron job could trigger these (e.g., for daily attendance alerts or weekly fee reminders).
    *   **Purpose**: To enable real-world transactions and communications.

6.  **Enhance AI Flows**:
    *   **Action**: Modify the Genkit flows in `src/ai/flows/*.ts` to query the live database for context.
    *   **Purpose**: To move from generating plausible mock data to providing real, data-driven AI insights. For example, the `getAnalyticsQuery` flow would execute a real database query based on the user's natural language question.

By following this strategy, the fully mocked frontend can be systematically connected to a robust and scalable backend architecture.

## 5. Dependencies / External Modules

- **next**: The core React framework for server-side rendering, routing, and application structure.
- **react** & **react-dom**: Libraries for building the user interface.
- **genkit** & **@genkit-ai/googleai**: Used for all Generative AI functionality, including defining AI flows and interacting with Google's Gemini models.
- **zod**: Used for schema declaration and validation, particularly for defining the input and output structures of AI flows.
- **tailwindcss**: A utility-first CSS framework for styling the application.
- **shadcn/ui** (via `@radix-ui` and `lucide-react`): A collection of beautifully designed, accessible, and reusable UI components (Buttons, Cards, Dialogs, etc.) that form the foundation of the app's design system.
- **recharts**: A composable charting library used to display academic performance graphs on the student profile page.
- **react-hook-form**: Used for managing form state and validation, although its usage is minimal in the current implementation.
- **clsx** & **tailwind-merge**: Utility libraries for conditionally combining Tailwind CSS classes without style conflicts.

## 6. Usage Guide (Local Development)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the Genkit Server**:
    For AI features to work, you need to run the Genkit development server.
    ```bash
    npm run genkit:dev
    ```
3.  **Start the Next.js Development Server**:
    In a separate terminal, run the main application server.
    ```bash
    npm run dev
    ```
4.  **Access the App**:
    Open your browser and navigate to `http://localhost:9002`. You will be redirected to the login page. Select a role and click "Sign In" to explore the application.
