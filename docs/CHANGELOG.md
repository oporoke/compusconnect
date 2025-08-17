
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - YYYY-MM-DD

### Added
- **Full-Stack Backend**: Migrated from a `localStorage`-based mock to a full-stack application using Next.js API Routes and a Prisma/SQLite database.
- **AI-Powered Parent Co-Pilot**: A dynamic parent/student dashboard with a live feed of activities and an AI-powered weekly digest.
- **Automated Marking & Grading**: New module for teachers to input exam solutions and have student answers automatically graded. Includes support for question-level marking for high schools.
- **AI Life Path Simulator**: A career co-pilot for students to explore career paths and receive AI-generated academic goals.
- **Interactive AI Chatbot**: A conversational widget for parents/students to query real-time data about grades and attendance.
- **Advanced Competitive Features**: Implemented a wide range of features across all modules based on competitive analysis, including:
  - **Academics**: Adaptive Learning, Gamification, and LMS Discussion Forums.
  - **Admin**: Multi-School UI, Asset Tracking, and an Alumni Mentorship program.
  - **Finance**: M-Pesa & BNPL payment mocks, and predictive analytics widgets.
  - **Analytics**: Predictive student risk analysis and an AI natural language query tool.
  - **Extensions**: Canteen Management with AI nutrition advice, expanded Alumni portal, and Health Center with vaccination tracking.
  - **Security**: GDPR data request UI and a comprehensive Audit Log.

### Changed
- **Authentication**: Updated from a simple role-based login to a multi-step process including separate sign-up and login forms, a password field, and Multi-Factor Authentication (MFA) simulation. Session management is now handled via secure, HTTP-only cookies.
- **Data Hooks**: All data provider hooks (`useStudents`, `useFinance`, etc.) were refactored to fetch data from the live backend API instead of `localStorage`.
- **Documentation**: All documentation (`README.md`, `SRS`, `SADD`, `USER_MANUAL`, etc.) has been extensively updated to reflect the new full-stack architecture and all added features.

## [1.0.0] - Initial Release

### Added
- Initial project setup with Next.js, React, and TypeScript.
- Core modules for Academics, Administration, Finance, Communication, and more, all using mocked `localStorage` data.
- Foundational AI-powered features for timetable and report card generation.
- Full suite of UI components from ShadCN.
- Comprehensive documentation, including SRS, SADD, and user manuals.

[Unreleased]: https://github.com/your-repo/your-project/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/your-repo/your-project/compare/v1.0.0...v1.1.0
