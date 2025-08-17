# Data Dictionary - CampusConnect Lite

This document provides a comprehensive, centralized catalog of data elements, their meanings, and their relationships to one another within the CampusConnect Lite system.

[<-- Back to Main README](../README.md)

---

## Table of Contents
1.  [Introduction](#1-introduction)
2.  [Data Elements](#2-data-elements)
    2.1. [Student Entity](#21-student-entity)
    2.2. [Staff Entity](#22-staff-entity)
    2.3. [Invoice Entity](#23-invoice-entity)
3.  [Enumerations](#3-enumerations)

---

## 1. Introduction
The Data Dictionary serves as a reference for all stakeholders to ensure a common understanding of the data used throughout the application.

## 2. Data Elements

### 2.1. Student Entity
- **Collection/Table**: `students`
- **Description**: Stores all information related to a student.

| Field Name      | Data Type | Description                                 | Example        | Notes                       |
| --------------- | --------- | ------------------------------------------- | -------------- | --------------------------- |
| `id`            | `string`  | Unique identifier for the student.          | "S001"         | Primary Key.                |
| `name`          | `string`  | The full name of the student.               | "Alice Johnson"|                             |
| `grade`         | `string`  | The current grade or year of the student.   | "10"           |                             |
| `section`       | `string`  | The section of the class (e.g., A, B).      | "A"            |                             |
| `discipline`    | `array`   | An array of disciplinary records.           | `[...]`        | See Discipline Record entity. |

### 2.2. Staff Entity
- **Collection/Table**: `staff`
- **Description**: Stores all information related to a staff member.

| Field Name      | Data Type | Description                                 | Example        | Notes                       |
| --------------- | --------- | ------------------------------------------- | -------------- | --------------------------- |
| `id`            | `string`  | Unique identifier for the staff member.     | "T01"          | Primary Key.                |
| `name`          | `string`  | The full name of the staff member.          | "Dr. Evelyn Reed"|                             |
| `role`          | `string`  | The role of the staff member.               | "Principal"    |                             |
| `salary`        | `number`  | The gross monthly salary.                   | 90000          |                             |

### 2.3. Invoice Entity
- **Collection/Table**: `invoices`
- **Description**: Stores financial invoices for students.

| Field Name      | Data Type | Description                                 | Example        | Notes                       |
| --------------- | --------- | ------------------------------------------- | -------------- | --------------------------- |
| `id`            | `string`  | Unique identifier for the invoice.          | "INV-S001-..." | Primary Key.                |
| `studentId`     | `string`  | Foreign key linking to the student.         | "S001"         | Links to `students.id`.     |
| `total`         | `number`  | The total amount of the invoice.            | 5000           |                             |
| `status`        | `string`  | The current status of the invoice.          | "Unpaid"       | See `InvoiceStatus` enum.   |


## 3. Enumerations

- **`InvoiceStatus`**:
    - `Paid`: The invoice has been fully paid.
    - `Unpaid`: The invoice has been generated but not yet paid.
    - `Overdue`: The invoice has passed its due date and remains unpaid.
