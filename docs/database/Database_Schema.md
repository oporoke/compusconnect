# Database Schema - CampusConnect Lite

This document provides a detailed description of the database schema, including collections (tables), fields (columns), data types, and constraints.

[<-- Back to Main README](../README.md)

---

## Table of Contents
1.  [Introduction](#1-introduction)
2.  [Collection Schemas](#2-collection-schemas)
    2.1. [Students Collection](#21-students-collection)
    2.2. [Staff Collection](#22-staff-collection)
    2.3. [Invoices Collection](#23-invoices-collection)
    2.4. [Grades Collection](#24-grades-collection)
    2.5. [Library Transactions Collection](#25-library-transactions-collection)

---

## 1. Introduction
The schema is designed for a NoSQL database (Firestore), using collections and documents.

## 2. Collection Schemas

### 2.1. `students` Collection
Stores core information for each student.

- **Document ID**: `studentId` (e.g., "S001")
- **Fields**:
    - `name`: `string`
    - `grade`: `string`
    - `section`: `string`
    - `discipline`: `array` of `DisciplinaryRecord` objects
        - `id`: `string`
        - `date`: `string` (YYYY-MM-DD)
        - `reason`: `string`
        - `actionTaken`: `string`

### 2.2. `staff` Collection
Stores information for each staff member.

- **Document ID**: `staffId` (e.g., "T01")
- **Fields**:
    - `name`: `string`
    - `role`: `string`
    - `department`: `string`
    - `email`: `string`
    - `phone`: `string`
    - `joiningDate`: `string` (YYYY-MM-DD)
    - `salary`: `number`

### 2.3. `invoices` Collection
Stores financial invoices for students.

- **Document ID**: Auto-generated
- **Fields**:
    - `studentId`: `string` (Reference to `students` collection)
    - `date`: `string` (YYYY-MM-DD)
    - `dueDate`: `string` (YYYY-MM-DD)
    - `items`: `array` of `InvoiceItem` objects
        - `description`: `string`
        - `amount`: `number`
    - `total`: `number`
    - `status`: `string` (`"Paid"`, `"Unpaid"`, `"Overdue"`)

### 2.4. `grades` Collection
Stores student grades for specific exams.

- **Document ID**: Auto-generated
- **Fields**:
    - `studentId`: `string` (Reference to `students` collection)
    - `examId`: `string` (Reference to `exams` collection)
    - `scores`: `map` (Object where keys are subjects and values are scores)
        - `Math`: `number`
        - `Science`: `number`

### 2.5. `libraryTransactions` Collection
Stores records of borrowed books.

- **Document ID**: Auto-generated
- **Fields**:
    - `studentId`: `string`
    - `bookId`: `string`
    - `type`: `string` (`"borrow"`, `"return"`)
    - `date`: `string` (YYYY-MM-DD)
    - `dueDate`: `string` (YYYY-MM-DD)
