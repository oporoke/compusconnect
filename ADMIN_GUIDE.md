# CampusConnect Lite - Admin & Deployment Guide

---

## 1. Introduction

This guide is intended for system administrators and DevOps engineers responsible for the installation, configuration, deployment, and maintenance of the CampusConnect Lite application. It provides technical instructions for setting up a local development environment and outlines the strategy for deploying the application to a production environment on Firebase.

---

## 2. Local Development Setup

### 2.1. Prerequisites

- **Node.js**: Version 18.x or later.
- **npm** or **yarn**: A Node.js package manager.
- **Firebase CLI**: (Optional, for future deployment) `npm install -g firebase-tools`.
- **Google Cloud SDK**: (Optional, for Genkit) Ensure you have `gcloud` installed and authenticated (`gcloud auth application-default login`).

### 2.2. Installation

1. **Clone the Repository**:

   ```bash
   git clone [repository-url]
   cd [repository-directory]
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

### 2.3. Environment Variables

The project uses an environment file for configuration.

1. Create a `.env` file in the root of the project:

   ```bash
   touch .env
   ```

2. Add the necessary environment variables. For local development with mocked data, this file can be left empty. For connecting to Google AI services with Genkit, you will need to add your API key:

   ```bash
   GEMINI_API_KEY=your_google_ai_studio_api_key
   ```

### 2.4. Running the Application

The application consists of two main parts: the Next.js frontend and the Genkit AI server. They must be run in separate terminals.

1. **Start the Genkit Server**: This server handles all AI-related tasks.

   ```bash
   npm run genkit:dev
   ```

   This will typically start the Genkit development UI on `http://localhost:4000`.

2. **Start the Next.js Development Server**: This runs the main user-facing application.

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:9002`.

---

## 3. Production Deployment Strategy (Firebase)

This section outlines the recommended strategy for deploying the application to a production environment using the Firebase ecosystem.

### 3.1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a "Web" app to your Firebase project to get the `firebaseConfig` object.
3. Enable the following Firebase services:
   - **Firestore Database**: As the primary NoSQL database.
   - **Firebase Authentication**: For user management.
   - **Cloud Functions for Firebase**: To host the backend API and Genkit flows.
   - **Firebase Hosting**: To serve the Next.js frontend.
   - **Cloud Storage for Firebase**: For file uploads (e.g., student documents).

### 3.2. Configuration

1. **Environment Variables**: In your production environment (e.g., Cloud Functions environment settings), you must set the `GEMINI_API_KEY` and any other required secrets (database credentials, API keys for third-party services like Stripe or Twilio).
2. **Firebase Configuration**: Replace the mock `firebaseConfig` object in the application with the one from your Firebase project. This is typically done in a dedicated configuration file (e.g., `src/lib/firebase/config.ts`).
3. **Security Rules**: Deploy robust **Firestore Security Rules** to control data access at the database level. These rules are critical for enforcing permissions (e.g., a student can only read their own grades).
4. **Backend API Deployment**:

   - Refactor the data hooks (`use-students`, `use-finance`, etc.) to call API endpoints instead of `localStorage`.
   - Deploy your API endpoints as Cloud Functions. These functions will contain the business logic for interacting with Firestore.
   - Deploy the Genkit flows as separate Cloud Functions.

5. **Frontend Deployment**:

   - Build the Next.js application for production:

     ```bash
     npm run build
     ```

   - Deploy the built application to Firebase Hosting:

     ```bash
     firebase deploy --only hosting
     ```

   - Configure rewrites in `firebase.json` to direct API calls (e.g., `/api/*`) to your Cloud Functions.

---

## 4. Monitoring & Maintenance

### 4.1. Logging

- **Frontend**: Monitor client-side errors using a service like Sentry or LogRocket.
- **Backend**: All Cloud Functions automatically stream logs to **Google Cloud Logging**. Set up alerts in Cloud Logging for high-severity errors (e.g., status `500`).
- **Audit Logs**: The application features a built-in audit log stored in `localStorage` for the demo. In production, the `logAction` function should be refactored to send logs to a secure, dedicated logging collection in Firestore or a third-party logging service.

### 4.2. Backups & Recovery

- **Firestore**: Enable **Point-in-Time Recovery (PITR)** in the Firebase console for your Firestore database. This provides continuous backups and allows you to restore to any point within the last 7 days.
- **Scheduled Backups**: For long-term archival, create a scheduled Cloud Function (using Cloud Scheduler) to export Firestore collections to a Google Cloud Storage bucket on a regular basis (e.g., weekly).

---

## 5. Scaling Guidelines

### 5.1. Horizontal Scaling

- **Cloud Functions**: The serverless nature of Cloud Functions allows for automatic scaling. As traffic increases, Google Cloud will automatically provision more instances of your functions to handle the load.
- **Firestore**: As a NoSQL database, Firestore is designed for massive horizontal scalability with minimal configuration.

### 5.2. Caching

- **Frontend**: Firebase Hosting automatically caches static assets at CDN edge locations worldwide, ensuring fast delivery to users.
- **Backend**: Implement caching strategies within your API functions for frequently accessed, non-sensitive data to reduce Firestore reads. Use an in-memory cache like Redis (available via Google Cloud Memorystore) for this.

---
