# Software Requirements Specification (SRS)

## CampusConnect Lite

---

## Table of Contents

1. [**Introduction**](#1-introduction)
   1.1. [Purpose](#11-purpose)
   1.2. [Scope](#12-scope)
   1.3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   1.4. [References](#14-references)
2. [**Overall Description**](#2-overall-description)
   2.1. [Product Perspective](#21-product-perspective)
   2.2. [High-Level Features](#22-high-level-features)
   2.3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
   2.4. [Operating Environment](#24-operating-environment)
   2.5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
3. [**System Features**](#3-system-features)
   3.1. [Academic Module](#31-academic-module)
   3.2. [Administrative Module](#32-administrative-module)
   3.3. [Financial Module](#33-financial-module)
   3.4. [Communication Module](#34-communication-module)
   3.5. [Analytics & Reporting Module](#35-analytics--reporting-module)
   3.6. [Extension Modules](#36-extension-modules)
4. [**Non-Functional Requirements**](#4-non-functional-requirements)
   4.1. [Security](#41-security)
   4.2. [Scalability](#42-scalability)
   4.3. [Usability](#43-usability)
   4.4. [Performance](#44-performance)
   4.5. [Compliance](#45-compliance)

---

## 1. Introduction

### 1.1. Purpose

This Software Requirements Specification (SRS) document provides a detailed description of the requirements for the **CampusConnect Lite** School Management System. Its purpose is to serve as a foundational guide for project stakeholders, including developers, designers, testers, and project managers, ensuring a shared understanding of the system's intended functionality, features, constraints, and quality attributes.

### 1.2. Scope

The CampusConnect Lite system is a comprehensive, web-based platform designed to manage and streamline the academic, administrative, and financial operations of educational institutions. The scope of the system encompasses:

- **Student Lifecycle Management**: From admissions and enrollment to academic tracking and graduation.
- **Staff Management**: Handling profiles, payroll, and performance evaluations for all school staff.
- **Academic Operations**: Including timetable scheduling, examination management, and gradebook maintenance.
- **Financial Management**: Covering fee collection, invoice generation, payroll processing, and expense tracking.
- **Stakeholder Communication**: Facilitating messaging, announcements, and event management for all user roles.
- **Data Analytics**: Providing insightful reports on academic, financial, and administrative performance.
- **Extensibility**: Offering optional modules for canteen, library, health, and alumni management.

### 1.3. Definitions, Acronyms, and Abbreviations

- **AI**: Artificial Intelligence
- **API**: Application Programming Interface
- **BNPL**: Buy Now, Pay Later
- **CBC**: Competency-Based Curriculum
- **CRM**: Customer Relationship Management
- **CRUD**: Create, Read, Update, Delete
- **CSV**: Comma-Separated Values
- **GDPR**: General Data Protection Regulation
- **LMS**: Learning Management System
- **MFA**: Multi-Factor Authentication
- **PII**: Personally Identifiable Information
- **PWA**: Progressive Web App
- **SRS**: Software Requirements Specification

### 1.4. References

- `DOCUMENTATION.md`: High-level code and architecture documentation.
- `*_competitive_checklist.md`: Feature verification checklists for each module.

---

## 2. Overall Description

### 2.1. Product Perspective

CampusConnect Lite is a self-contained, cloud-native web application designed to operate as a Software as a Service (SaaS) platform. It will replace fragmented or manual systems with a single, integrated, and modern solution. The application uses a Next.js frontend, a Next.js API Routes backend, and a Prisma ORM connected to a database.

### 2.2. High-Level Features

- **Academic Module**: Student profiles, attendance, timetabling, exams, automated grading, LMS, adaptive learning, and gamification.
- **Administrative Module**: AI-powered admissions, multi-school management, inventory, staff profiles, and alumni fundraising.
- **Financial Module**: Fee structures, invoicing, integrated payments (M-Pesa, BNPL mocks), payroll with anomaly detection, and expense tracking.
- **Communication Module**: Messaging, announcements, and event calendar with sync-to-calendar mocks.
- **Analytics & Reporting Module**: Predictive analytics, AI-powered natural language queries, cross-school benchmarking, and exportable reports.
- **Extension Modules**: Canteen with AI nutrition advice, Alumni portal with mentorship, Health center with vaccination tracking.
- **Parent Co-Pilot**: A dedicated parent dashboard with a live feed of student activities and an AI-powered weekly digest.

### 2.3. User Classes and Characteristics

- **Super Admin**: Technical administrator with full system access, including security and permissions management.
- **Admin**: Manages the day-to-day operations of the school, with access to all modules except super-admin functions.
- **Teacher**: Manages academic tasks for their assigned students, including attendance, grading, and LMS content.
- **Student**: Accesses their academic information, timetable, assignments, and school announcements.
- **Parent**: Views their child's academic progress via the Parent Co-Pilot dashboard.

### 2.4. Operating Environment

The system is a web-based application and will operate on all modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices. As a Progressive Web App (PWA), it can be "installed" on user devices for an app-like experience.

### 2.5. Design and Implementation Constraints

- **Technology Stack**: The application must be implemented using Next.js, React, and TypeScript, with a Prisma/SQLite backend.
- **AI Services**: All generative AI features must be implemented using Google's Genkit framework.
- **UI/UX**: The user interface must adhere to the style guidelines specified, using ShadCN UI components and Tailwind CSS.
- **Data Storage**: All application data is persisted through the backend API into a database.

---

## 3. System Features

### 3.1. Academic Module

- **Description**: Manages all student-centric academic activities.
- **Features**:
  - **Automated Marking**: Teachers can input exam solutions, then input student answers for automated grading and printable reports.
  - **Adaptive Learning**: An AI-powered quiz that adjusts question difficulty based on student performance.
  - **Gamification**: A system of badges and leaderboards to encourage student engagement.
  - **LMS Discussions**: A forum for peer-to-peer and student-teacher collaboration.
  - **Life Path Simulator**: An AI tool to help students explore career paths and set academic goals.
- **Dependencies**: `useStudents`, `useLMS`, AI Flows.

### 3.2. Administrative Module

- **Description**: Manages school-wide administrative tasks and assets.
- **Features**:
  - **AI-Powered Admissions**: Includes mock AI analysis for fraud detection and applicant scoring.
  - **Multi-School Management**: UI to switch between different school branches (mock).
  - **Asset & Inventory Management**: Track and assign school assets like devices and furniture.
  - **Alumni Fundraising**: A toolkit for creating campaigns, and tracking pledges and donations.
- **Dependencies**: `useAdmissions`, `useStaff`, `useInventory`, `useAlumni`.

### 3.3. Financial Module

- **Description**: Manages all financial operations of the institution.
- **Features**:
  - **Integrated Payments**: Mock payment gateway for M-Pesa, Card, and Fee Financing (BNPL).
  - **Predictive Analytics**: Mock dashboard widgets for fee default risk prediction.
  - **AI Payroll Anomaly Detection**: A mock alert system to flag potential issues in payroll runs.
- **Dependencies**: `useFinance`, `useStudents`, `useStaff`.

### 3.4. Communication Module

- **Description**: Facilitates communication between all stakeholders.
- **Features**:
  - **Parent Co-Pilot**: A dedicated dashboard for parents featuring a live feed of their child's activities and an AI-powered weekly digest.
  - **Chatbot**: An AI-powered chatbot for parents and students to query academic data.
  - **Calendar Sync**: Mock functionality to add school events to Google or Outlook calendars.
- **Dependencies**: `useCommunication`, `useAuth`, `useStudents`, AI Flows.

### 3.5. Analytics & Reporting Module

- **Description**: Provides data-driven insights into school operations.
- **Features**:
  - **Predictive Analytics**: A dedicated dashboard to identify at-risk students and forecast performance trends (mock).
  - **AI Query**: Natural language interface to generate custom reports from a Genkit flow.
  - **Cross-School Benchmarking**: A dashboard for comparing metrics across different schools in a group (mock).
- **Dependencies**: All data hooks, AI Flows.

### 3.6. Extension Modules

- **Description**: Optional modules for specialized functions.
- **Features**:
  - **Canteen**: Manage prepaid student accounts, menus, and stock, with an AI advisor for nutritional suggestions.
  - **Alumni**: An alumni database with networking, donation tracking, and a mentorship program.
  - **Health Center**: Maintain student medical records, log clinic visits, and track vaccinations.
- **Dependencies**: `useCanteen`, `useAlumni`, `useHealth`.

---

## 4. Non-Functional Requirements

### 4.1. Security

- The system shall enforce role-based access control (RBAC).
- User authentication must be secure, incorporating password protection and Multi-Factor Authentication (MFA).
- The system shall provide UI for GDPR-like data export and erasure requests.
- All data in transit must be encrypted using HTTPS/TLS.
- An immutable audit log of all sensitive actions shall be maintained.

### 4.2. Scalability

- The system architecture must be able to support a growing number of users and schools.
- It should handle at least 1,000 concurrent users and manage data for up to 5,000 students per school.

### 4.3. Usability

- The user interface must be intuitive, responsive, and accessible across all modern desktop and mobile browsers.
- The system shall be a Progressive Web App (PWA), allowing for an installable, app-like experience.

### 4.4. Performance

- Initial page loads should complete within 3 seconds on a standard broadband connection.
- UI interactions and data filtering should respond in under 500 milliseconds.
- AI-powered features (e.g., report generation) should provide a response within 10 seconds.

### 4.5. Compliance

- The system must be designed to comply with data protection regulations such as GDPR.
