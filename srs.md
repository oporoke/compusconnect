
# Software Requirements Specification (SRS)
# CampusConnect Lite

---

## Table of Contents
1.  [**Introduction**](#1-introduction)
    1.1. [Purpose](#11-purpose)
    1.2. [Scope](#12-scope)
    1.3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    1.4. [References](#14-references)
2.  [**Overall Description**](#2-overall-description)
    2.1. [Product Perspective](#21-product-perspective)
    2.2. [High-Level Features](#22-high-level-features)
    2.3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4. [Operating Environment](#24-operating-environment)
    2.5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
3.  [**System Features**](#3-system-features)
    3.1. [Academic Module](#31-academic-module)
    3.2. [Administrative Module](#32-administrative-module)
    3.3. [Financial Module](#33-financial-module)
    3.4. [Communication Module](#34-communication-module)
    3.5. [Analytics & Reporting Module](#35-analytics--reporting-module)
    3.6. [Extension Modules](#36-extension-modules)
4.  [**Non-Functional Requirements**](#4-non-functional-requirements)
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
-   **Student Lifecycle Management**: From admissions and enrollment to academic tracking and graduation.
-   **Staff Management**: Handling profiles, payroll, and performance evaluations for all school staff.
-   **Academic Operations**: Including timetable scheduling, examination management, and gradebook maintenance.
-   **Financial Management**: Covering fee collection, invoice generation, payroll processing, and expense tracking.
-   **Stakeholder Communication**: Facilitating messaging, announcements, and event management for all user roles.
-   **Data Analytics**: Providing insightful reports on academic, financial, and administrative performance.
-   **Extensibility**: Offering optional modules for canteen, library, health, and alumni management.

### 1.3. Definitions, Acronyms, and Abbreviations
-   **AI**: Artificial Intelligence
-   **API**: Application Programming Interface
-   **BNPL**: Buy Now, Pay Later
-   **CRM**: Customer Relationship Management
-   **CRUD**: Create, Read, Update, Delete
-   **CSV**: Comma-Separated Values
-   **GDPR**: General Data Protection Regulation
-   **LMS**: Learning Management System
-   **MFA**: Multi-Factor Authentication
-   **PII**: Personally Identifiable Information
-   **PWA**: Progressive Web App
-   **SRS**: Software Requirements Specification

### 1.4. References
-   `DOCUMENTATION.md`: High-level code and architecture documentation.
-   `module_*.md` & `*_competitive_checklist.md`: Feature verification checklists for each module.

---

## 2. Overall Description

### 2.1. Product Perspective
CampusConnect Lite is a self-contained, cloud-native web application designed to operate as a Software as a Service (SaaS) platform. It will replace fragmented or manual systems with a single, integrated, and modern solution. The frontend is built using Next.js and React, while the backend (to be implemented) will handle business logic, database interactions, and third-party service integrations.

### 2.2. High-Level Features
-   **Academic Module**: Student profiles, attendance, timetabling, exams, grading, and an LMS.
-   **Administrative Module**: Admissions, multi-school management, inventory, and staff profiles.
-   **Financial Module**: Fee structures, invoicing, payments, payroll, and expense tracking.
-   **Communication Module**: Messaging, announcements, and event calendar.
-   **Analytics & Reporting Module**: Dashboards and exportable reports for all key operational areas.
-   **Extension Modules**: Optional add-ons for canteen, alumni, health, library, and transport management.
-   **AI-Powered Assistance**: Features like AI-generated report cards, timetables, and analytics queries are integrated throughout the system.

### 2.3. User Classes and Characteristics
-   **Super Admin**: Technical administrator with full system access, including security and permissions management.
-   **Admin**: Manages the day-to-day operations of the school, with access to all modules except super-admin functions.
-   **Teacher**: Manages academic tasks for their assigned students, including attendance, grading, and LMS content.
-   **Student**: Accesses their academic information, timetable, assignments, and school announcements.
-   **Parent**: Views their child's academic progress, attendance, financial status, and communicates with the school.

### 2.4. Operating Environment
The system is a web-based application and will operate on all modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices. As a Progressive Web App (PWA), it can be "installed" on user devices for an app-like experience and offline access to cached data.

### 2.5. Design and Implementation Constraints
-   **Technology Stack**: The frontend must be implemented using Next.js, React, and TypeScript. The backend will use Node.js.
-   **AI Services**: All generative AI features must be implemented using Google's Genkit framework.
-   **UI/UX**: The user interface must adhere to the style guidelines specified, using ShadCN UI components and Tailwind CSS.
-   **Data Storage**: All application data must be persisted in a secure, cloud-based database (e.g., Firestore). `localStorage` is for frontend state caching only.

---

## 3. System Features

### 3.1. Academic Module
-   **Description**: Manages all student-centric academic activities.
-   **Features**:
    -   **Student Profiles**: Maintain detailed records for each student.
        -   *Inputs*: Student name, grade, section.
        -   *Outputs*: Student profile page with all associated academic data.
    -   **Attendance Tracking**: Log daily attendance.
        -   *Inputs*: Class, student list, present/absent status.
        -   *Outputs*: Updated attendance percentage on student profiles.
    -   **Timetable Generation**: AI-powered, conflict-free scheduling.
        -   *Inputs*: Course details, instructor availability.
        -   *Outputs*: A formatted timetable view.
    -   **Gradebook & Exams**: Create exams and record student grades.
        -   *Inputs*: Exam name, date, subjects, student scores.
        -   *Outputs*: A gradebook table and academic history on student profiles.
    -   **LMS**: Manage assignments, course materials, and online classes.
        -   *Inputs*: Assignment details, material uploads, class schedules.
        -   *Outputs*: Lists of assignments and materials for students.
-   **Dependencies**: `useStudents`, `useLMS`, AI Flows.

### 3.2. Administrative Module
-   **Description**: Manages school-wide administrative tasks and assets.
-   **Features**:
    -   **Admissions**: Handle new student applications with AI-powered scoring.
        -   *Inputs*: Applicant details, documents.
        -   *Outputs*: A dashboard to review and update application statuses.
    -   **Staff Management**: Manage staff profiles, payroll info, and performance reviews.
        -   *Inputs*: Staff details, salary, performance notes.
        -   *Outputs*: A detailed staff directory and individual profile pages.
    -   **Inventory Management**: Track school assets like devices and furniture.
        -   *Inputs*: Asset name, type.
        -   *Outputs*: A searchable inventory table with asset status and assignment.
-   **Dependencies**: `useAdmissions`, `useStaff`, `useInventory`.

### 3.3. Financial Module
-   **Description**: Manages all financial operations of the institution.
-   **Features**:
    -   **Fee Management**: Create configurable fee structures.
        -   *Inputs*: Fee name, amount, applicable grades.
        -   *Outputs*: A list of available fee types for invoicing.
    -   **Invoicing & Payments**: Generate batch invoices and record payments.
        -   *Inputs*: Grade, fee types, payment details.
        -   *Outputs*: A list of all invoices with their payment status.
    -   **Payroll Processing**: Run monthly payroll for all staff.
        -   *Inputs*: Month/year.
        -   *Outputs*: A history of all payroll runs and downloadable payslips.
-   **Dependencies**: `useFinance`, `useStudents`, `useStaff`.

### 3.4. Communication Module
-   **Description**: Facilitates communication between all stakeholders.
-   **Features**:
    -   **Messaging**: Real-time, one-on-one chat between users.
        -   *Inputs*: Message content.
        -   *Outputs*: A conversation view.
    -   **Announcements**: Broadcast school-wide notices.
        -   *Inputs*: Announcement title, content.
        -   *Outputs*: A public list of all announcements.
    -   **Event Calendar**: Schedule and display school events.
        -   *Inputs*: Event title, date, description.
        -   *Outputs*: A calendar view and a list of upcoming events.
-   **Dependencies**: `useCommunication`, `useAuth`.

### 3.5. Analytics & Reporting Module
-   **Description**: Provides data-driven insights into school operations.
-   **Features**:
    -   **Dashboards**: Role-specific dashboards with key metrics.
    -   **Reports**: Detailed reports on student performance, staff evaluation, admissions, and finances.
    -   **AI Query**: Natural language interface to generate custom reports.
        -   *Inputs*: A text-based query.
        -   *Outputs*: A formatted text response with the requested information.
    -   **Data Export**: Export reports to PDF and Excel formats.
        -   *Inputs*: A button click on a report page.
        -   *Outputs*: A downloaded PDF or XLSX file.
-   **Dependencies**: All data hooks (`useStudents`, `useFinance`, etc.), AI Flows.

### 3.6. Extension Modules
-   **Description**: Optional modules for specialized functions.
-   **Features**:
    -   **Canteen**: Manage prepaid student accounts, daily menus, and stock.
    -   **Library**: Catalog books and manage borrowing/return transactions.
    -   **Health Center**: Maintain student medical records and log clinic visits.
    -   **Alumni**: Manage an alumni database, track donations, and facilitate networking.
-   **Dependencies**: `useCanteen`, `useLibrary`, `useHealth`, `useAlumni`.

---

## 4. Non-Functional Requirements

### 4.1. Security
-   The system shall enforce role-based access control (RBAC), ensuring users can only access data and features appropriate for their role.
-   User authentication must be secure, incorporating password protection and Multi-Factor Authentication (MFA).
-   All data in transit must be encrypted using industry-standard protocols (HTTPS/TLS).
-   Sensitive Personally Identifiable Information (PII) must be encrypted at rest in the database.
-   The system shall maintain an immutable audit log of all sensitive actions.

### 4.2. Scalability
-   The system architecture must be able to support a growing number of users and schools without degradation in performance.
-   It should handle at least 1,000 concurrent users and manage data for up to 5,000 students per school.

### 4.3. Usability
-   The user interface must be intuitive, responsive, and accessible across all modern desktop and mobile browsers.
-   The design shall be clean and uncluttered, following the specified style guide.
-   The system shall be a Progressive Web App (PWA), allowing for an installable, app-like experience.

### 4.4. Performance
-   Initial page loads should complete within 3 seconds on a standard broadband connection.
-   UI interactions and data filtering should respond in under 500 milliseconds.
-   AI-powered features (e.g., report generation) should provide a response within 10 seconds.

### 4.5. Compliance
-   The system must be designed to comply with data protection regulations such as GDPR, including workflows for data export and erasure.
