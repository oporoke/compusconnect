
# CampusConnect Lite - API Documentation

This document outlines the conceptual RESTful API for the CampusConnect Lite system. It serves as a blueprint for backend development.

---

## **Authentication**

- **Method**: All API requests must include a `Bearer Token` in the `Authorization` header.
- **Token**: The token is a JSON Web Token (JWT) obtained upon successful login via the `/api/auth/login` endpoint. The JWT will contain the user's ID and role.
- **Base URL**: `/api`

---

## **Students**

### 1. Get All Students

- **Endpoint**: `GET /students`
- **Description**: Retrieves a list of all students. Supports filtering by grade.
- **Authentication**: `admin`, `teacher`, `super-admin`
- **Query Parameters**:
    - `grade` (optional, string): Filter students by their grade (e.g., `?grade=10`).
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "S001",
        "name": "Alice Johnson",
        "grade": "10",
        "section": "A"
      },
      ...
    ]
    ```
- **Error Responses**:
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.

### 2. Get Student by ID

- **Endpoint**: `GET /students/{id}`
- **Description**: Retrieves a single student's complete profile.
- **Authentication**: `admin`, `teacher`, `super-admin`
- **Path Parameters**:
    - `id` (required, string): The unique ID of the student (e.g., `S001`).
- **Success Response (200 OK)**:
    ```json
    {
      "id": "S001",
      "name": "Alice Johnson",
      "grade": "10",
      "section": "A",
      "discipline": [
        { "id": "D01", "date": "2024-09-15", "reason": "Late Submission", "actionTaken": "Warning" }
      ]
    }
    ```
- **Error Responses**:
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.
    - `404 Not Found`: No student found with the given ID.

### 3. Create Student

- **Endpoint**: `POST /students`
- **Description**: Creates a new student record.
- **Authentication**: `admin`, `super-admin`
- **Request Body**:
    ```json
    {
      "name": "Gary Wilson",
      "grade": "9",
      "section": "B"
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "id": "S008",
      "name": "Gary Wilson",
      "grade": "9",
      "section": "B"
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: Invalid or missing data in the request body.
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.

---

## **Finance**

### 1. Get All Invoices

- **Endpoint**: `GET /invoices`
- **Description**: Retrieves all invoices, with optional filtering.
- **Authentication**: `admin`, `super-admin`
- **Query Parameters**:
    - `studentId` (optional, string): Filter invoices for a specific student.
    - `status` (optional, string): Filter by status (`Paid`, `Unpaid`, `Overdue`).
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "INV-S001-1672531200000",
        "studentId": "S001",
        "date": "2024-08-01",
        "dueDate": "2024-09-01",
        "total": 5000,
        "status": "Unpaid"
      }
    ]
    ```
- **Error Responses**:
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.

### 2. Create Payment for Invoice

- **Endpoint**: `POST /invoices/{id}/payments`
- **Description**: Records a payment against a specific invoice.
- **Authentication**: `admin`, `super-admin`
- **Path Parameters**:
    - `id` (required, string): The ID of the invoice being paid.
- **Request Body**:
    ```json
    {
      "amount": 5000,
      "method": "Card"
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "id": "PAY-1672531200001",
      "invoiceId": "INV-S001-1672531200000",
      "amount": 5000,
      "date": "2024-09-12",
      "method": "Card"
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: Invalid data or payment exceeds amount due.
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.
    - `404 Not Found`: Invoice not found.

### 3. Run Payroll

- **Endpoint**: `POST /payroll`
- **Description**: Executes the payroll process for a given month for all staff.
- **Authentication**: `admin`, `super-admin`
- **Request Body**:
    ```json
    {
      "month": "2024-10"
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "status": "Success",
      "message": "Payroll for 2024-10 has been processed for 4 staff members.",
      "recordsCreated": 4
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: Payroll for the month has already been run.
    - `401 Unauthorized`: Missing or invalid JWT.
    - `403 Forbidden`: User role does not have permission.

---

## **AI Flows**

### 1. Generate Timetable

- **Endpoint**: `POST /ai/generate-timetable`
- **Description**: Calls the AI assistant to generate a timetable.
- **Authentication**: `admin`, `teacher`, `super-admin`
- **Request Body**:
    ```json
    {
      "courseSchedules": "- Math 101: 3 hours, Mon/Wed/Fri...",
      "instructorAvailability": "- Dr. Smith: Mon-Fri 9am-5pm..."
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "timetable": "Monday:\n  9:00 AM - 10:00 AM: Math 101 (Dr. Smith)\n..."
    }
    ```
- **Error Responses**:
    - `401 Unauthorized`: Missing or invalid JWT.
    - `500 Internal Server Error`: AI service failed to generate a response.
