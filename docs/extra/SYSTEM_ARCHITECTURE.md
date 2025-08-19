# CampusConnect Lite - System Architecture Document

## 1. High-Level Architecture Overview

This document provides a detailed overview of the technical architecture of the CampusConnect Lite system. It is designed for developers, architects, and technical stakeholders.

### 1.1. Architecture Diagram (Text/ASCII)

The system employs a modern, full-stack, client-server architecture built on the Next.js framework.

```bash
+-------------------------------------------------------------------------+
|                              User's Browser                             |
| +---------------------------------------------------------------------+ |
| |                    Next.js Frontend (React App)                     | |
| | (UI Components, Pages, State Management Hooks)                      | |
| +---------------------------------------------------------------------+ |
+---------------------------------|-----------------------------------------+
                                  | (HTTP Requests: API Calls, Server Actions)
                                  v
+-------------------------------------------------------------------------+
|                                  Server                                   |
| +--------------------------+   +--------------------------------------+ |
| | Next.js Backend          |   |        Genkit AI Subsystem           | |
| | (API Routes in /api)     |<->|  (Flows & Tools in /ai/flows)        | |
| | - Handles business logic |   |  - Interacts with Google AI Platform | |
| | - Validates data         |   +--------------------------------------+ |
| +-----------|--------------+                                            |
|             | (Prisma Client)                                           |
|             v                                                           |
| +-----------|--------------+                                            |
| |  Prisma ORM              |                                            |
| |  (Manages DB queries)    |                                            |
| +-----------|--------------+                                            |
|             | (SQL)                                                     |
|             v                                                           |
| +-----------|--------------+                                            |
| |   SQLite Database        |                                            |
| |   (dev.db file)          |                                            |
| +--------------------------+                                            |
+-------------------------------------------------------------------------+
```

### 1.2. Technology Stack

- **Framework**: **Next.js (App Router)** - Used for both the frontend (React) and the backend (API Routes), providing a seamless full-stack development experience.
- **Language**: **TypeScript** - Ensures type safety and improves code quality across the entire codebase.
- **UI Library**: **React** with **ShadCN UI** - A collection of reusable and accessible components built on Radix UI and Tailwind CSS.
- **Styling**: **Tailwind CSS** - A utility-first CSS framework for rapid and consistent styling.
- **Database ORM**: **Prisma** - A next-generation ORM that provides a type-safe database client.
- **Database**: **SQLite** - A lightweight, file-based SQL database used for local development.
- **Generative AI**: **Google Genkit** - A framework for building production-ready AI flows, integrated with Google's Gemini models.
- **Schema Validation**: **Zod** - Used extensively within Genkit to define and validate the schemas for AI flow inputs and outputs.

### 1.3. Design Patterns & Architectural Decisions

- **Full-Stack Framework (Next.js)**: The decision to use Next.js for both frontend and backend simplifies the development process, reduces context switching, and allows for tight integration between UI components and their corresponding API endpoints.
- **Serverless Functions (API Routes)**: All backend logic is encapsulated in serverless API routes within the `/src/app/api` directory. This is a cost-effective and highly scalable approach, as functions are executed on demand.
- **Provider Pattern (React Context)**: The application heavily uses the React Context API to manage global state and data fetching logic. Custom hooks (e.g., `useStudents`, `useAuth`) provide clean, reusable interfaces for components to access and manipulate data without prop drilling. This is evident in `src/app/layout.tsx` where all providers are wrapped around the application.
- **AI Abstraction Layer (Genkit)**: Instead of making direct calls to the Google AI Platform, all AI interactions are routed through Genkit flows. This is a key architectural decision that makes AI features more robust, maintainable, and testable by decoupling the application logic from the specific AI model provider.
- **ORM for Database Interaction (Prisma)**: Direct database queries are abstracted away by the Prisma ORM. This provides type safety, simplifies database operations (queries, migrations, seeding), and makes it easy to swap the underlying database (e.g., from SQLite to PostgreSQL) in the future.

## 2. Component Structure

### 2.1. Main Modules & Responsibilities

- **Frontend UI (`/src/app/(app)/**`)\*\*: Contains all the pages and UI components that the user interacts with. Its primary responsibilities are to render the user interface, handle user events (clicks, form submissions), and call the custom data hooks to fetch or update data.
- **Backend API (`/src/app/api/**`)**: This is the server-side logic layer. Each subdirectory corresponds to a data model (e.g., `/api/students`). Its responsibility is to receive HTTP requests from the frontend, use the Prisma client to perform database operations (CRUD), and return a JSON response.
- **AI Subsystem (`/src/ai/**`)\*\*: This module contains all generative AI logic. It defines AI flows using Genkit, including prompts, input/output schemas (with Zod), and tools that the AI can use to interact with the database.
- **Data Hooks (`/src/hooks/**`)**: These custom hooks act as the bridge between the frontend UI and the backend API. Each hook (e.g., `useStudents`) is responsible for fetching data from its corresponding API endpoint, managing the loading and error states, and providing functions for components to create, update, or delete data.
- **Database Schema & Client (`/prisma` & `/src/lib/db.ts`)**: Defines the source of truth for the application's data structure (`schema.prisma`), manages database migrations, and provides a singleton instance of the Prisma client for use in the API routes.

### 2.2. Data Flow Example (Fetching Students)

1. A user navigates to the `/students` page.
2. The `StudentsPage` component in `src/app/(app)/students/page.tsx` is rendered.
3. Inside the component, the `useStudents()` hook is called.
4. The `useEffect` within the `useStudents` hook in `src/hooks/use-students.tsx` triggers a `fetch('/api/students')` request.
5. The request hits the `GET` function in `src/app/api/students/route.ts`.
6. This `GET` function uses the Prisma client (`prisma.student.findMany()`) to query the SQLite database.
7. The database returns a list of students to the API route.
8. The API route sends this list back to the frontend as a JSON response.
9. The `useStudents` hook receives the JSON, updates its state with the list of students, and sets `isLoading` to `false`.
10. The `StudentsPage` component re-renders with the fetched data, displaying the list of students in the UI.

### 2.3. Separation of Concerns

- **Presentation vs. Logic**: UI components are kept clean and focused on rendering. All data fetching, state management, and side effects are handled within the custom hooks in `/src/hooks`.
- **Frontend vs. Backend**: There is a clear separation between the client-side code (in `/src/app/(app)`) and server-side code (in `/src/app/api`). The frontend does not and cannot access the database directly; it must go through the API layer.
- **AI vs. Business Logic**: AI prompts and model interactions are isolated within Genkit flows. The main application backend calls these flows like any other service, keeping the core business logic separate from the complexities of generative AI.

## 3. Directory Structure

- **`/prisma`**: Contains all database-related files.

  - `schema.prisma`: The master file that defines all data models, relations, and fields.
  - `seed.ts`: A script to populate the database with initial mock data.
  - `/migrations`: Automatically generated files that track the history of database schema changes.

- **`/src/ai`**: The heart of the AI subsystem.

  - `genkit.ts`: Configures and initializes the global Genkit instance.
  - `/flows`: Contains all the Genkit AI flows (e.g., `ai-chatbot.ts`, `ai-timetable-assistant.ts`). Each file defines a specific AI capability.

- **`/src/app`**: The core of the Next.js application.

  - `layout.tsx`: The root layout for the entire application. It sets up global styles, fonts, and wraps the application in all the necessary context providers from `/src/hooks`.
  - `login/page.tsx`: The public-facing login page.
  - `/(app)`: A route group for all authenticated pages.
    - `layout.tsx`: The main layout for the authenticated app, including the sidebar and header.
    - `/**/page.tsx`: The actual page components for each route (e.g., `/dashboard`, `/students`).
  - `/api`: Contains all backend API routes.
    - `/**/route.ts`: The server-side handlers for `GET`, `POST`, `PUT`, `DELETE` requests for each data model.

- **`/src/components`**: Contains all reusable React components.

  - `/auth`, `/dashboard`, `/gradebook`, etc.: Components are organized by feature or domain.
  - `/ui`: Contains the low-level, generic UI components from ShadCN (Button, Card, Input, etc.).

- **`/src/hooks`**: Contains all custom React hooks, which are the core of the application's state management and data fetching logic (e.g., `useAuth.tsx`, `useStudents.tsx`).

- **`/src/lib`**: A folder for utility functions, library configurations, and data definitions.
  - `auth.ts`: Defines user roles and mock user data.
  - `data.ts`: Defines shared data types and initial mock data used for seeding.
  - `db.ts`: Exports the singleton instance of the Prisma client.
  - `utils.ts`: Contains utility functions like `cn` for combining CSS classes.

## 4. System Dependencies

- **`next`**: The core framework for the application.
- **`react`**: The UI library for building components.
- **`@prisma/client`**: The Prisma client used to interact with the database.
- **`genkit` & `@genkit-ai/googleai`**: The toolkit for all generative AI features.
- **`zod`**: Used for data schema validation, especially in AI flows.
- **`tailwindcss`**: For utility-first CSS styling.
- **`shadcn-ui` (various `@radix-ui/*` packages & `lucide-react`)**: Provides the core set of UI components.
- **`recharts`**: Used for rendering charts and graphs in the analytics dashboards.
- **`jspdf` & `xlsx`**: Used for exporting reports to PDF and Excel formats.
- **`next-pwa`**: Enables Progressive Web App features, making the application installable on mobile devices.
