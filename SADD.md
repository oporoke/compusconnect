# System Architecture & Design Document (SADD)
# CampusConnect Lite

---

## Table of Contents
1.  [**Introduction**](#1-introduction)
    1.1. [Purpose](#11-purpose)
    1.2. [Design Goals](#12-design-goals)
2.  [**System Overview**](#2-system-overview)
    2.1. [Architecture Diagram Description](#21-architecture-diagram-description)
    2.2. [Technology Stack](#22-technology-stack)
    2.3. [Justifications](#23-justifications)
3.  [**Module Architecture**](#3-module-architecture)
    3.1. [Frontend (Client-Side)](#31-frontend-client-side)
    3.2. [Backend (Server-Side)](#32-backend-server-side)
    3.3. [AI Subsystem (Genkit)](#33-ai-subsystem-genkit)
4.  [**Data Design**](#4-data-design)
    4.1. [Data Models/Entities](#41-data-modelsentities)
    4.2. [Entity-Relationship Description](#42-entity-relationship-description)
    4.3. [Storage Strategy](#43-storage-strategy)
5.  [**Security & Infrastructure**](#5-security--infrastructure)
    5.1. [Authentication Flow](#51-authentication-flow)
    5.2. [Authorization Strategy](#52-authorization-strategy)
    5.3. [Data Encryption](#53-data-encryption)
    5.4. [Backup & Recovery](#54-backup--recovery)

---

## 1. Introduction

### 1.1. Purpose
This document provides a comprehensive overview of the system architecture and technical design for the **CampusConnect Lite** application. It is intended for developers, system architects, and technical project managers to understand the system's structure, technology choices, module responsibilities, and data flow.

### 1.2. Design Goals
The architecture is designed to meet the following key objectives:
-   **Scalability**: The system must support a growing number of users and schools without performance degradation.
-   **Maintainability**: A modular architecture with clear separation of concerns to simplify updates and bug fixes.
-   **Security**: Robust security measures to protect sensitive student and financial data.
-   **Usability**: A fast, responsive, and intuitive user experience across all supported devices.
-   **Extensibility**: The ability to easily add new modules and features in the future.

---

## 2. System Overview

### 2.1. Architecture Diagram Description
The system follows a modern, serverless, client-server architecture composed of three main layers:

1.  **Client (Frontend)**: A Next.js Progressive Web App (PWA) that runs in the user's browser. It is responsible for rendering the UI, managing local state, and making API calls to the backend. It is a "fat client" in the sense that it contains all the UI logic and static assets.
2.  **Backend (Serverless API Layer)**: A set of serverless functions (e.g., Firebase Functions) that expose a RESTful API. This layer handles all business logic, data validation, authentication/authorization, and communication with the database and third-party services. The Genkit AI flows also operate within this layer.
3.  **Database & Third-Party Services**: A managed NoSQL database (Firestore) serves as the primary data store. The backend also integrates with external services for payments (Stripe, M-Pesa), notifications (Twilio), and AI (Google AI Platform).

This decoupled architecture allows the frontend and backend to be developed, deployed, and scaled independently.

### 2.2. Technology Stack
-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS, ShadCN UI
-   **Backend**: Node.js, Firebase Functions, Genkit
-   **Database**: Firebase Firestore (NoSQL)
-   **Authentication**: Firebase Authentication (supports email/password, OAuth, MFA)
-   **AI**: Google AI Platform via Genkit
-   **Deployment**: Firebase Hosting (for frontend) and Firebase Functions (for backend)

### 2.3. Justifications
-   **Next.js**: Chosen for its hybrid rendering capabilities (Server-Side Rendering and Static Site Generation), which improve performance and SEO, and its integrated API routes for building the backend layer.
-   **Firebase Suite**: Provides a fully-managed, scalable backend infrastructure (Auth, Firestore, Functions) that significantly reduces development and operational overhead. Its real-time database capabilities are a bonus for live features like messaging.
-   **Genkit**: A dedicated framework for building production-ready AI features, offering robust tools for defining prompts, flows, and structured outputs.
-   **TypeScript**: Ensures type safety and improves code quality, which is crucial for a large, complex application.

---

## 3. Module Architecture

### 3.1. Frontend (Client-Side)
The frontend is organized by features and data domains.

-   **Responsibilities**:
    -   Render all UI components.
    -   Manage UI state (e.g., open dialogs, selected tabs).
    -   Manage client-side data caching (`localStorage` for session, React hooks for app data).
    -   Perform initial data validation on forms before API submission.
    -   Make authenticated API calls to the backend.
-   **Dependencies**: The entire frontend depends on the backend API for data persistence and business logic.
-   **Key Interfaces**:
    -   **React Hooks (`src/hooks/*.tsx`)**: Each hook (e.g., `useStudents`, `useFinance`) encapsulates the logic for fetching and manipulating data for a specific domain. These hooks are the primary interface between UI components and the data layer. In a backend-integrated app, these hooks would contain the `fetch` calls to the API.
    -   **UI Components (`src/components/*`)**: Reusable and page-specific components responsible for rendering data.
    -   **AI Flows (`src/ai/flows/*.ts`)**: While running on the server, these are directly callable from server-side React components, acting as a direct interface to the AI subsystem.

### 3.2. Backend (Server-Side)
The backend is a collection of serverless functions organized by data model.

-   **Responsibilities**:
    -   Provide a secure REST/RPC API for all CRUD operations.
    -   Enforce all business logic and data validation rules.
    -   Authenticate API requests and authorize user actions based on their role.
    -   Interact directly with the Firestore database.
    -   Interface with third-party APIs (e.g., Stripe for payments).
-   **Dependencies**: Depends on the database schema and third-party service contracts.
-   **Key APIs/Interfaces**:
    -   `GET /api/students`: Fetch all students.
    -   `POST /api/students`: Create a new student.
    -   `POST /api/invoices`: Generate a new invoice.
    -   `POST /api/payments`: Process a payment via a third-party gateway.
    -   `POST /api/notifications`: Trigger a notification (email/SMS).

### 3.3. AI Subsystem (Genkit)
This system operates within the backend layer.

-   **Responsibilities**:
    -   Execute generative AI tasks based on prompts and context.
    -   Structure the output from the AI model into a predictable format (JSON).
    -   (In production) Securely fetch necessary data from the database to provide context to the AI.
-   **Dependencies**: Google AI Platform API.
-   **Key Interfaces**: The exported functions in `src/ai/flows/*.ts` (e.g., `generateReportCard`, `getAnalyticsQuery`) are the public interface for this subsystem.

---

## 4. Data Design

### 4.1. Data Models/Entities
The primary data entities are defined in `src/lib/data.ts`:
-   `Student`: Core student information.
-   `Staff`: Staff information, including payroll details.
-   `Exam`, `Grade`: Academic performance records.
-   `Invoice`, `Payment`, `Expense`: Financial records.
-   `Book`, `LibraryTransaction`: Library management data.
-   `Asset`: School inventory.
-   `User`, `Role`: Authentication and authorization data.

### 4.2. Entity-Relationship Description
-   A **Student** has one-to-many **Grades**, **Invoices**, and **Attendance Records**.
-   An **Invoice** has one-to-many **Payments**.
-   A **Staff** member has one-to-many **Payroll Records**.
-   A **Route** has one **Vehicle** and one **Driver**.
-   A **LibraryTransaction** links one **Student** to one **Book**.

### 4.3. Storage Strategy
-   **Primary Data Store**: **Firebase Firestore**. It's a NoSQL, document-based database. Data will be organized into top-level collections (e.g., `students`, `staff`, `invoices`). This choice supports flexible schemas and scales automatically.
-   **Client-Side Cache**: **`localStorage`**. Used in the current mock implementation for all data persistence. In the production system, it will be used only for storing the user's session token and non-sensitive UI preferences.
-   **File Storage**: **Firebase Storage**. Used for storing user-uploaded files like admission documents or assignment submissions.

---

## 5. Security & Infrastructure

### 5.1. Authentication Flow
1.  User enters credentials in the Next.js frontend.
2.  Frontend sends credentials to the **Firebase Authentication** service.
3.  Firebase Auth verifies credentials and, if successful, returns a JSON Web Token (JWT) to the client.
4.  The client stores the JWT securely (e.g., in `localStorage` or a secure cookie).
5.  For every subsequent API request to the backend (Firebase Functions), the client includes the JWT in the `Authorization` header.
6.  The backend API uses a middleware to verify the JWT's signature and extract the user's ID and role, ensuring the request is authentic.

### 5.2. Authorization Strategy
-   Authorization will be handled on the backend using **Firestore Security Rules** and middleware in the API functions.
-   **Firestore Security Rules** provide granular, database-level protection (e.g., a student can only read their own grades; a teacher can only write grades for their students).
-   API middleware will check the user's role (decoded from the JWT) before allowing access to certain endpoints (e.g., only an 'admin' can run payroll).

### 5.3. Data Encryption
-   **In Transit**: All communication between the client, backend, and Firebase services is automatically encrypted with HTTPS/TLS.
-   **At Rest**: Firestore automatically encrypts all data at rest on Google's servers. No additional configuration is needed.

### 5.4. Backup & Recovery
-   Firestore provides point-in-time recovery (PITR) features, allowing for automated, continuous backups. The database can be restored to any point in the last 7 days.
-   For archival purposes, scheduled backend functions will be created to export collections from Firestore to a separate, long-term storage solution like Google Cloud Storage on a weekly or monthly basis.
