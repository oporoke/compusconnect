
# CampusConnect Lite - API Documentation

This document outlines the RESTful API for the CampusConnect Lite system. It serves as a blueprint for backend development and frontend integration.

---

## **Authentication**

- **Method**: The API uses a session-based authentication model with secure, HTTP-only cookies. A successful login returns a `session` cookie that must be included in all subsequent requests to protected endpoints.
- **Base URL**: `/api`

### 1. Start Session

- **Endpoint**: `POST /auth/login`
- **Description**: Initiates a user session. In the current MFA flow, this is called after the user provides their credentials and MFA code.
- **Authentication**: Public
- **Request Body**:
    ```json
    {
      "name": "Admin User",
      "role": "admin"
    }
    ```
- **Success Response (200 OK)**:
    - Sets an HTTP-only `session` cookie.
    - Response Body:
    ```json
    {
      "user": {
        "name": "Admin User",
        "role": "admin"
      }
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: Invalid role or name.

### 2. Get Session

- **Endpoint**: `GET /auth/session`
- **Description**: Retrieves the current authenticated user's session data.
- **Authentication**: Cookie-based
- **Success Response (200 OK)**:
    ```json
    {
      "user": {
        "name": "Admin User",
        "role": "admin"
      }
    }
    ```
- **Error Responses**:
    - Returns `{"user": null}` if no active session is found.

### 3. End Session

- **Endpoint**: `POST /auth/logout`
- **Description**: Logs the user out by clearing the session cookie.
- **Authentication**: Cookie-based
- **Success Response (200 OK)**:
    ```json
    {
      "message": "Logged out"
    }
    ```

---

## **Students**

### 1. Get All Students

- **Endpoint**: `GET /students`
- **Description**: Retrieves a list of all students, including their discipline records.
- **Authentication**: `admin`, `teacher`, `super-admin`
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "S001",
        "name": "Alice Johnson",
        "grade": "10",
        "section": "A",
        "discipline": [
            { "id": "D01", "date": "2024-09-15T00:00:00.000Z", "reason": "Late Submission", "actionTaken": "Warning" }
        ]
      },
      ...
    ]
    ```
- **Error Responses**:
    - `500 Internal Server Error`: If the database query fails.

### 2. Create Student

- **Endpoint**: `POST /students`
- **Description**: Creates a new student record.
- **Authentication**: `admin`, `super-admin`
- **Request Body**:
    ```json
    {
      "id": "S123",
      "name": "Gary Wilson",
      "grade": "9",
      "section": "B"
    }
    ```
- **Success Response (201 Created)**: Returns the newly created student object.
- **Error Responses**:
    - `500 Internal Server Error`: If the database query fails.

### 3. Delete Student

- **Endpoint**: `DELETE /students/{id}`
- **Description**: Deletes a student record.
- **Authentication**: `admin`, `super-admin`
- **Path Parameters**:
    - `id` (required, string): The unique ID of the student.
- **Success Response (200 OK)**:
    ```json
    {
        "message": "Student deleted successfully"
    }
    ```
- **Error Responses**:
    - `500 Internal Server Error`: If the database query fails.

---

## **Finance**

### 1. Get All Invoices

- **Endpoint**: `GET /finance/invoices`
- **Description**: Retrieves all invoices.
- **Authentication**: `admin`, `super-admin`
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "INV-S001-1672531200000",
        "studentId": "S001",
        "date": "2024-08-01T00:00:00.000Z",
        "dueDate": "2024-09-01T00:00:00.000Z",
        "total": 5000,
        "status": "Unpaid"
      }
    ]
    ```

### 2. Get All Payments

- **Endpoint**: `GET /finance/payments`
- **Description**: Retrieves all recorded payments.
- **Authentication**: `admin`, `super-admin`
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "PAY-1",
        "invoiceId": "INV-S001-1672531200000",
        "amount": 5000,
        "date": "2024-09-12T00:00:00.000Z",
        "method": "Card"
      }
    ]
    ```

### 3. Get All Payroll Records

- **Endpoint**: `GET /finance/payroll`
- **Description**: Retrieves the history of all payroll runs.
- **Authentication**: `admin`, `super-admin`
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "PAYROLL-2024-10-T01",
        "staffId": "T01",
        "month": "2024-10",
        "grossSalary": 6000,
        "deductions": 1200,
        "netSalary": 4800
      }
    ]
    ```

---

## **Admissions**

### 1. Get All Applications

- **Endpoint**: `GET /admissions`
- **Description**: Retrieves all student admission applications.
- **Authentication**: `admin`, `super-admin`
- **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "APP001",
        "name": "John Doe",
        "age": 14,
        "previousSchool": "Greenwood High",
        "grade": "9",
        "date": "2024-09-01T00:00:00.000Z",
        "status": "Pending"
      }
    ]
    ```

### 2. Create Application

- **Endpoint**: `POST /admissions`
- **Description**: Submits a new student application.
- **Authentication**: Public
- **Request Body**:
    ```json
    {
      "name": "Jane Smith",
      "age": 15,
      "previousSchool": "Oakridge Academy",
      "grade": "10",
      "parentName": "Robert Smith",
      "parentEmail": "robert.smith@example.com"
    }
    ```
- **Success Response (201 Created)**: Returns the newly created application object.

### 3. Update Application Status

- **Endpoint**: `PUT /admissions`
- **Description**: Updates the status of an existing application.
- **Authentication**: `admin`, `super-admin`
- **Request Body**:
    ```json
    {
      "id": "APP001",
      "status": "Approved"
    }
    ```
- **Success Response (200 OK)**: Returns the updated application object.

---

## **AI Flows**

### 1. Chatbot Interaction

- **Endpoint**: `POST /chatbot`
- **Description**: Sends a user question to the AI chatbot and gets a response.
- **Authentication**: `student`, `parent`
- **Request Body**:
    ```json
    {
      "studentId": "S001",
      "question": "What were my grades in the last exam?"
    }
    ```
- **Success Response (200 OK)**:
    ```json
    {
      "answer": "In the Final Exam, you scored: Math: 85, Science: 92, English: 78, History: 88, Art: 95, Physical Education: 89."
    }
    ```
- **Error Responses**:
    - `400 Bad Request`: Missing `studentId` or `question`.
    - `500 Internal Server Error`: AI service failed to generate a response.
