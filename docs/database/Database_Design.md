# Database Design - CampusConnect Lite

This document outlines the high-level design principles, architecture, and normalization strategy for the CampusConnect Lite database.

[<-- Back to Main README](../README.md)

---

## Table of Contents
1.  [Introduction](#1-introduction)
2.  [Database Choice](#2-database-choice)
3.  [Schema Design Principles](#3-schema-design-principles)
4.  [Normalization](#4-normalization)
5.  [Indexing Strategy](#5-indexing-strategy)

---

## 1. Introduction
A well-designed database is critical for the performance, scalability, and maintainability of the application. This document details the choices made to ensure the database meets these requirements.

## 2. Database Choice
- **Database System**: **Firebase Firestore (NoSQL)**
- **Justification**:
    - **Scalability**: Firestore is a serverless, NoSQL database that scales automatically to handle massive datasets and high traffic loads without manual intervention.
    - **Flexibility**: Its document-based model allows for flexible schemas, making it easier to evolve the application and add new features without complex migrations.
    - **Real-time Capabilities**: Firestore's real-time listeners are ideal for features like in-app messaging and live notifications.
    - **Managed Service**: As a fully managed service, it reduces operational overhead for backups, maintenance, and security.

## 3. Schema Design Principles
- **Data Duplication for Read Performance**: For frequently accessed data, some denormalization will be applied. For example, a student's name might be stored on an invoice record to avoid an extra database join when displaying a list of invoices.
- **Use of Subcollections**: Nested data will be stored in subcollections to keep the data model organized and queries efficient. For example, a student's grades will be in a `grades` subcollection under the `students/{studentId}` document.
- **Consistent Naming Conventions**: All collection and field names will use camelCase for consistency.

## 4. Normalization
The database will be designed to achieve a balance between normalization and performance. While aiming for Third Normal Form (3NF) to reduce data redundancy, we will strategically denormalize data where it significantly improves read performance for common queries.

- **Example of Normalization**: Student and Staff information are kept in separate collections (`students`, `staff`) to avoid redundancy.
- **Example of Denormalization**: Storing `studentName` on an `invoice` record.

## 5. Indexing Strategy
Firestore automatically creates single-field indexes. For more complex queries (e.g., filtering students by grade and section), composite indexes will be created. The Firebase console will be used to create and manage these indexes as needed based on application query patterns.
