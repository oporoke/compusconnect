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
This document provides a high-level overview of the system architecture and technical design for the **CampusConnect Lite** application. It is intended for project managers and stakeholders. For a more detailed technical breakdown, please refer to the **[System Architecture Document](./SYSTEM_ARCHITECTURE.md)**.

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

1.  **Client (Frontend)**: A Next.js Progressive Web App (PWA) that runs in the user's browser. It is responsible for rendering the UI, managing local state, and making API calls to the backend.
2.  **Backend (Serverless API Layer)**: A set of serverless functions within the Next.js framework that expose a RESTful API. This layer handles all business logic, data validation, authentication/authorization, and communication with the database. The Genkit AI flows also operate within this layer.
3.  **Database & AI Services**: A managed database (via Prisma) serves as the primary data store. The backend also integrates with Google AI Platform for all generative AI features.

This decoupled architecture allows the frontend and backend to be developed, deployed, and scaled independently.

### 2.2. Technology Stack
-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS, ShadCN UI
-   **Backend**: Node.js, Next.js API Routes, Genkit
-   **Database**: SQLite (via Prisma)
-   **Authentication**: Custom session-based auth with secure cookies.
-   **AI**: Google AI Platform via Genkit
-   **Deployment**: Can be deployed on any modern Node.js hosting platform (Vercel, Firebase, etc.).

### 2.3. Justifications
-   **Next.js**: Chosen for its hybrid rendering capabilities and integrated API routes, which provide a powerful and streamlined full-stack development experience.
-   **Prisma**: Provides a type-safe and easy-to-use ORM for database interactions, making it easy to swap databases in the future.
-   **Genkit**: A dedicated framework for building production-ready AI features, offering robust tools for defining prompts, flows, and structured outputs.
-   **TypeScript**: Ensures type safety and improves code quality, which is crucial for a large, complex application.

---

## 3. Module Architecture

### 3.1. Frontend (Client-Side)
-   **Responsibilities**: Renders all UI, manages UI state, and makes authenticated API calls to the backend.
-   **Key Interfaces**: React Hooks (`src/hooks/*.tsx`) encapsulate the logic for fetching and manipulating data for specific domains.

### 3.2. Backend (Server-Side)
-   **Responsibilities**: Provides a secure REST API for all CRUD operations, enforces business logic, and interacts directly with the database.
-   **Key APIs/Interfaces**: Endpoints like `/api/students`, `/api/finance/invoices`, etc., which are documented in the **[API Documentation](./API_DOCUMENTATION.md)**.

### 3.3. AI Subsystem (Genkit)
-   **Responsibilities**: Executes generative AI tasks (e.g., timetable generation, chatbot responses) and structures the output from the AI model.
-   **Key Interfaces**: The exported functions in `src/ai/flows/*.ts`.

---

## 4. Data Design

### 4.1. Data Models/Entities
The primary data entities are defined in `prisma/schema.prisma`. Please refer to the **[Database Documentation](./docs/database/Database_Schema.md)** for a full list of entities.

### 4.2. Entity-Relationship Description
-   A **Student** has one-to-many **Grades**, **Invoices**, and **Attendance Records**.
-   An **Invoice** has one-to-many **Payments**.
-   See the **[Database Relationships](./docs/database/Database_Relationships.md)** document for more details.

### 4.3. Storage Strategy
-   **Primary Data Store**: **SQLite** (via Prisma) for local development. This can be swapped for a production database like PostgreSQL or MySQL.
-   **File Storage**: A cloud-based solution like Firebase Storage or AWS S3 would be used in production for storing user-uploaded files.

---

## 5. Security & Infrastructure

### 5.1. Authentication Flow
1.  User enters credentials in the Next.js frontend.
2.  Frontend calls the `/api/auth/login` endpoint.
3.  The backend verifies credentials and, if successful, creates a session.
4.  The backend returns a secure, HTTP-only cookie to the client to manage the session.

### 5.2. Authorization Strategy
-   Authorization is handled on the backend via middleware in the API routes.
-   The middleware inspects the user's session (retrieved from the cookie) to determine their role and grant or deny access accordingly.

### 5.3. Data Encryption
-   **In Transit**: All communication is encrypted with HTTPS/TLS in a production environment.
-   **At Rest**: The production database should be configured to encrypt all data at rest.

### 5.4. Backup & Recovery
-   Production databases should have automated backup and point-in-time recovery (PITR) features enabled.
-   For archival, scheduled jobs can be created to export the database to a separate long-term storage solution.
