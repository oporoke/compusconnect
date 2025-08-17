# 🏫 CampusConnect Lite - School Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CampusConnect Lite** is a modern, feature-rich, and AI-powered school management system designed to streamline the academic, administrative, and financial operations of educational institutions. This repository contains the complete frontend application, built as a high-fidelity, interactive prototype using Next.js and React.

The system is designed to be a comprehensive, all-in-one solution, replacing fragmented manual systems with an integrated and intuitive platform for administrators, teachers, students, and parents.

---

## ✨ System Modules

The application is organized into 7 core modules, each packed with features to serve the diverse needs of a modern school.

| Module | Key Features |
| :--- | :--- |
| 🎓 **Academic** | Student Information, Attendance Tracking, AI-powered Timetable Generation, Examination & Grading, Integrated LMS (Assignments, Materials, etc.), Adaptive Learning & Gamification. |
| 🏛️ **Administrative** | AI Applicant Scoring, Staff & Faculty Profiles, Multi-School Management, Asset & Inventory Tracking, E-Library with Plagiarism Check Mocks. |
| 💰 **Financial** | Configurable Fee Structures, Batch Invoicing, Integrated Payment Gateway Mocks (Card, M-Pesa, BNPL), Payroll Processing, Expense Tracking, AI Anomaly Detection. |
| 📣 **Communication** | Secure In-App Messaging, School-wide Announcements, Event Calendar with Google/Outlook Sync Mocks. |
| 🔒 **Security** | Role-Based Access Control (RBAC), Multi-Factor Authentication (MFA) Flows, GDPR Compliance Tools, Comprehensive Audit Logging. |
| 📊 **Analytics & Reporting** | Role-specific Dashboards, AI-powered Natural Language Query Tool, Predictive Analytics (At-Risk Students, Fee Defaults), Cross-School Benchmarking, PDF & Excel Exports. |
| 🧩 **Extensions** | Canteen Management (Prepaid Accounts, Stock), Alumni Portal (Donations, Networking), Health Center (Medical Records, Vaccination Tracking). |

---

## 📚 Documentation Index

This repository contains extensive documentation covering every aspect of the project. All documentation files are located in the `/docs` directory.

| Document | Description |
| :--- | :--- |
| 📄 **[Software Requirements Specification (SRS)](./docs/srs.md)** | Detailed breakdown of all functional and non-functional requirements. |
| 🏗️ **[System Architecture & Design (SADD)](./docs/System_Architecture_Design.md)** | Overview of the system architecture, technology stack, and module design. |
| 💻 **[Developer Documentation](./docs/Developer_Documentation.md)** | In-depth guide to the codebase, component structure, and development flow. |
| 🔗 **[API Documentation](./docs/API_DOCUMENTATION.md)** | Conceptual blueprint for the backend RESTful API. |
| 🧑‍🏫 **[User Manual](./docs/User_Manual.md)** | A user-friendly guide for end-users (admins, teachers, parents). |
| ⚙️ **[Admin & Deployment Guide](./docs/Admin_Deployment.md)** | Instructions for system administrators and DevOps engineers. |
| 📈 **[Analytics & Reporting Guide](./docs/analytics_reporting_guide.md)** | A guide for decision-makers on using the analytics features. |
| 🧪 **[Test Plan & QA Strategy](./docs/TestPlan_QA.md)** | The strategy for testing and quality assurance. |
| 🔄 **[Changelog](./docs/CHANGELOG.md)** | A log of all notable changes to the project. |


---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   **Node.js**: Version 18.x or later
-   **npm** (or yarn/pnpm)
-   **(Optional)** **Google Cloud SDK**: Required for running the Genkit AI flows. Ensure you are authenticated via `gcloud auth application-default login`.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd [repository-directory]
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Variables

1.  Create a `.env` file in the root of the project:
    ```bash
    touch .env
    ```
2.  To enable the AI-powered features, you must add your Google AI API key to the `.env` file:
    ```
    GEMINI_API_KEY=your_google_ai_studio_api_key
    ```
    If you leave this empty, the application will still run, but all AI features will fail.

### Running the Application

The application requires two processes to be run in separate terminals for full functionality.

1.  **Start the Genkit Server** (for AI features):
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development UI, typically on `http://localhost:4000`.

2.  **Start the Next.js Frontend Server**:
    ```bash
    npm run dev
    ```
    The main application will be accessible at **http://localhost:9002**.

---

## 🤝 Contributors

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
