# Developer Documentation & Code Audit

This document provides a comprehensive review of the CampusConnect Lite codebase, organized by module. It includes file overviews, issue analysis, and recommendations for improvement.

---

## **Core Configuration & Documentation**

### **File: `next.config.ts`**

- **Overview**: Configures the Next.js application, including settings for the Progressive Web App (PWA), TypeScript/ESLint, and image optimization.
- **Issues Found**:
  - **Best Practices**: The `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` flags are enabled. While useful for rapid development, this is dangerous for production as it allows potentially broken code to be deployed.
- **Recommendations**:
  - For production builds, these flags should be set to `false`. A continuous integration (CI) pipeline should enforce type and lint checks before deployment.
- **Notes**: The PWA configuration via `next-pwa` is set up correctly. The image remote pattern for `placehold.co` is also correct.

### **File: `package.json`**

- **Overview**: Defines project metadata, scripts, and dependencies.
- **Issues Found**:
  - **Dependencies**: There are a large number of `@radix-ui/*` dependencies. While ShadCN uses them, it might be beneficial to review if all are strictly necessary. Some dependencies like `firebase` are present but not used in the current backend implementation, which relies on Prisma.
- **Recommendations**:
  - Periodically run `npx depcheck` to identify and remove unused dependencies.
  - Consolidate scripts where possible to simplify the workflow.
- **Notes**: The scripts for `genkit`, `prisma`, and `next` are well-defined and follow standard practices.

### **File: `tailwind.config.ts`**

- **Overview**: Configures Tailwind CSS, including custom fonts, colors, and animations.
- **Issues Found**: None.
- **Notes**: The configuration correctly sets up custom fonts (`Inter`, `Space Grotesk`) and a comprehensive color palette using CSS variables, which aligns perfectly with the project's styling guidelines.

### **File: `src/app/globals.css`**

- **Overview**: Defines global CSS styles and Tailwind layers, and sets up CSS variables for theming.
- **Issues Found**: None.
- **Notes**: The use of HSL values for CSS variables is a best practice, making theme adjustments easy and predictable. The setup for light and dark modes is robust.

---

## **Backend & API (`src/app/api/`)**

### **File: `src/app/api/auth/login/route.ts`**

- **Overview**: Handles the user login process by verifying credentials and setting a session cookie.
- **Issues Found**:
  - **Security**: The current implementation for student/parent login is a mock that logs in the first student found (`prisma.student.findFirst()`). This is a significant security risk if ever deployed. The staff login checks email but does not verify a password.
  - **Error Handling**: Error messages are generic. Returning "Invalid credentials" could help a user understand the issue better than a generic 500 error.
- **Recommendations**:
  - Implement a robust password verification system (e.g., using `bcrypt`) for staff login.
  - The student/parent login flow needs to be properly designed. Typically, parents/students don't register themselves but are created by an admin. Their login would need to be secured with a proper credential system.
- **Notes**: The use of `httpOnly` cookies for session management is a good security practice.

### **File: `src/app/api/students/route.ts`**

- **Overview**: Provides CRUD operations for student records.
- **Issues Found**:
  - **Validation**: The `POST` endpoint does not validate the incoming `data` object. A request with missing or malformed data could cause a server error or lead to inconsistent data in the database.
- **Recommendations**:
  - Use a library like `zod` to define a schema for the student creation payload and validate the request body against it. Return a `400 Bad Request` response if validation fails.
- **Notes**: The `GET` handler correctly includes related `discipline` records, which is efficient.

---

## **AI Flows (`src/ai/`)**

### **File: `src/ai/genkit.ts`**

- **Overview**: Initializes and configures the global Genkit instance.
- **Issues Found**: None.
- **Notes**: The configuration is clean and correctly sets up the Google AI plugin and a default model. This centralization makes it easy to swap models or add plugins globally.

### **File: `src/ai/flows/ai-chatbot.ts`**

- **Overview**: Implements the AI chatbot logic, including tools for fetching real-time student data.
- **Issues Found**:
  - **Error Handling**: The tools (`getLatestGrades`, `getAttendanceSummary`) throw a generic `Error`. This could be improved by throwing more specific, structured errors that the calling flow could potentially catch and handle differently.
  - **Security**: The flow takes a `studentId` from the client. In a production environment, it is critical to add a validation step to ensure the authenticated user (e.g., a parent) has the permission to access the data for the _specific_ `studentId` they are requesting.
- **Recommendations**:
  - Implement an authorization check within each tool to verify the caller's permissions against the requested `studentId`.
- **Notes**: The use of Genkit tools to abstract data fetching is a very strong pattern. It makes the AI prompt cleaner and the overall logic more maintainable and testable.

---

## **Frontend Hooks (`src/hooks/`)**

### **File: `src/hooks/use-auth.tsx`**

- **Overview**: Manages the entire authentication state of the application.
- **Issues Found**:
  - **Logical Complexity**: The state management (`authState`, `pendingCredentials`) is complex. While functional, it could be simplified using a state machine library or by reducing the number of states.
  - **Security**: Storing `pendingCredentials` in React state between the password and MFA steps could theoretically be vulnerable in certain sophisticated attack scenarios.
- **Recommendations**:
  - For the MFA flow, consider a server-driven approach where the server issues a temporary token after the password step, which is then exchanged along with the MFA code for a full session token. This avoids storing credentials on the client entirely.
- **Notes**: The separation of concerns (login, signup, MFA submission) into distinct functions is good. The hook effectively centralizes auth logic.

### **File: `src/hooks/use-students.tsx`**

- **Overview**: Manages all state and CRUD operations related to students, grades, and exams.
- **Issues Found**:
  - **Performance**: The `getSkillsByStudentId` function iterates over all assignments every time it's called. While acceptable for a small dataset, this could become a performance bottleneck.
- **Recommendations**:
  - Memoize the result of `getSkillsByStudentId` using `React.useMemo` to prevent re-computation on every render unless its dependencies (`grades`, `assignments`) change.
- **Notes**: The hook correctly fetches all related data (students, grades, exams, attendance) in parallel, which is efficient.

---

## **Frontend Components (`src/components/`)**

### **File: `src/components/layout/app-sidebar.tsx`**

- **Overview**: Renders the main navigation sidebar for the application.
- **Issues Found**:
  - **Maintainability**: The `navLinks` array is a large, static data structure. As the application grows, this could become difficult to manage.
- **Recommendations**:
  - For a larger application, consider breaking the `navLinks` configuration into separate files by module or role to improve organization.
- **Notes**: The logic to filter links based on user roles is implemented correctly and is essential for the application's role-based access control.

### **File: `src/components/gradebook/gradebook-table.tsx`**

- **Overview**: The main interface for teachers to enter and manage student grades.
- **Issues Found**:
  - **User Experience (UX)**: The `Accordion` for entering question-level scores in the High School mode is functional but can be slightly cumbersome for bulk data entry.
- **Recommendations**:
  - Consider an alternative UI for question-level entry, such as a popover or a modal dialog that shows all questions for a single subject at once, which might streamline the data entry process for teachers.
- **Notes**: The component correctly handles the rendering logic for both "Primary" and "High School" grading models, which is a good example of building flexible components.
