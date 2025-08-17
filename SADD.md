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
    -   Make authenticated API calls to the backend.
-   **Dependencies**: The entire frontend depends on the backend API for data persistence and business logic.
-   **Key Interfaces**:
    -   **React Hooks (`src/hooks/*.tsx`)**: Each hook (e.g., `useStudents`, `useFinance`) encapsulates the logic for fetching and manipulating data for a specific domain. These hooks now contain the `fetch` calls to the API and are dependent on the `useAuth` hook to ensure a user is authenticated before making requests.
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
The primary data entities are defined in `prisma/schema.prisma`:
-   `Student`, `Staff`, `User`, `Role`
-   `Exam`, `Grade`, `AttendanceRecord`
-   `Invoice`, `Payment`, `Expense`, `FeeStructure`
-   `Book`, `LibraryTransaction`
-   `Asset`, `Vehicle`, `Driver`, `Route`
-   `Hostel`, `Room`
-   `CanteenAccount`, `CanteenTransaction`, `CanteenMenuItem`
-   `AlumniProfile`, `Donation`, `Campaign`, `Pledge`, `Mentorship`
-   `HealthRecord`, `ClinicVisit`

### 4.2. Entity-Relationship Description
-   A **Student** has one-to-many **Grades**, **Invoices**, and **Attendance Records**.
-   An **Invoice** has one-to-many **Payments**.
-   A **Staff** member has one-to-many **Payroll Records**.
-   A **Campaign** has one-to-many **Pledges** and **Donations**.
-   A **LibraryTransaction** links one **Student** to one **Book**.

### 4.3. Storage Strategy
-   **Primary Data Store**: **SQLite** (via Prisma) for local development. This can be swapped for a production database like PostgreSQL or MySQL.
-   **File Storage**: A cloud-based solution like Firebase Storage or AWS S3 would be used for storing user-uploaded files like admission documents.

---

## 5. Security & Infrastructure

### 5.1. Authentication Flow
1.  User enters credentials in the Next.js frontend.
2.  Frontend calls the `/api/auth/login` endpoint.
3.  The backend verifies credentials and, if successful, creates a session.
4.  The backend returns a secure, HTTP-only cookie to the client to manage the session.
5.  All subsequent API requests from the client automatically include this cookie, which the backend uses to identify the user and their session.

### 5.2. Authorization Strategy
-   Authorization is handled on the backend via middleware in the API routes.
-   This middleware inspects the user's session (retrieved from the cookie) to determine their role.
-   Access to specific API endpoints or actions is then granted or denied based on this role, ensuring a user can only perform actions they are permitted to.

### 5.3. Data Encryption
-   **In Transit**: All communication between the client and backend is encrypted with HTTPS/TLS.
-   **At Rest**: The production database (e.g., PostgreSQL on a managed service) should be configured to encrypt all data at rest.

### 5.4. Backup & Recovery
-   Production databases should have automated backup and point-in-time recovery (PITR) features enabled.
-   For archival purposes, scheduled jobs can be created to export the database to a separate, long-term storage solution.
