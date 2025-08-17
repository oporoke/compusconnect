# Database Relationships - CampusConnect Lite

This document describes the relationships between the primary data entities in the CampusConnect Lite system.

[<-- Back to Main README](../README.md)

---

## Table of Contents
1.  [Introduction](#1-introduction)
2.  [Entity Relationships](#2-entity-relationships)
    2.1. [Student to Grade](#21-student-to-grade)
    2.2. [Student to Invoice](#22-student-to-invoice)
    2.3. [Invoice to Payment](#23-invoice-to-payment)
    2.4. [Staff to PayrollRecord](#24-staff-to-payrollrecord)
    2.5. [Student to LibraryTransaction](#25-student-to-librarytransaction)

---

## 1. Introduction
Understanding the relationships between data entities is crucial for writing correct queries and maintaining data integrity.

## 2. Entity Relationships

### 2.1. Student to Grade
- **Relationship**: One-to-Many
- **Description**: A `Student` can have many `Grade` records (one for each exam taken). A `Grade` record belongs to only one `Student`.
- **Implementation**: The `grades` collection will contain documents where each document has a `studentId` field, creating a reference back to the `students` collection.

### 2.2. Student to Invoice
- **Relationship**: One-to-Many
- **Description**: A `Student` can have many `Invoice` records over their academic career. An `Invoice` belongs to only one `Student`.
- **Implementation**: The `invoices` collection will contain a `studentId` field.

### 2.3. Invoice to Payment
- **Relationship**: One-to-Many
- **Description**: An `Invoice` can have multiple partial `Payment` records made against it. A `Payment` is always associated with a single `Invoice`.
- **Implementation**: The `payments` collection will contain an `invoiceId` field.

### 2.4. Staff to PayrollRecord
- **Relationship**: One-to-Many
- **Description**: A `Staff` member will have many `PayrollRecord` entries over time (one for each month's payroll). A `PayrollRecord` belongs to a single `Staff` member.
- **Implementation**: The `payrollRecords` collection will contain a `staffId` field.

### 2.5. Student to LibraryTransaction
- **Relationship**: One-to-Many
- **Description**: A `Student` can borrow many books, creating many `LibraryTransaction` records. Each transaction is tied to one `Student` and one `Book`.
- **Implementation**: The `libraryTransactions` collection will have both a `studentId` and a `bookId` field.
