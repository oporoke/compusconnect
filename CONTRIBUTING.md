# Contributing to CampusConnect Lite

First off, thank you for considering contributing to CampusConnect Lite! Your help is invaluable in making this project the best it can be.

This document provides guidelines for contributing to the project. Please read it carefully to ensure a smooth and effective contribution process.

## How to Contribute

### 1. Setting Up the Project

Before you start, make sure you have followed the local development setup instructions in the [Admin & Deployment Guide](./ADMIN_GUIDE.md). This includes installing dependencies, setting up the database, and configuring environment variables.

### 2. Finding an Issue

You can start by looking for existing issues in the project's issue tracker. If you have a new idea or have found a bug, please open a new issue first to discuss it with the team.

### 3. Branching Strategy

We use a simple feature-branching strategy based on `main`.

1. **Create a New Branch**: Create your feature branch from the `main` branch. Please use a descriptive name.

   ```bash
   # Example for a new feature
   git checkout -b feature/add-student-report-card

   # Example for a bug fix
   git checkout -b fix/login-form-validation
   ```

2. **Make Your Changes**: Commit your changes to your feature branch. Write clear, concise commit messages.

### 4. Submitting a Pull Request

1. **Push Your Branch**: Push your feature branch to the repository.
2. **Open a Pull Request**: Create a new Pull Request from your feature branch to the `main` branch.
3. **Describe Your Changes**: Fill out the pull request template with a clear title and a detailed description of the changes you have made. Link to the issue you are addressing.
4. **Code Review**: At least one other developer will review your code. They may request changes. Please address the feedback and push your changes to the same branch. The pull request will be updated automatically.
5. **Merging**: Once the pull request is approved and all checks have passed, it will be merged into the `main` branch.

## Coding Standards

### Code Style

- The project uses **Prettier** for automated code formatting and **ESLint** for code quality checks.
- Please ensure you have the appropriate editor extensions installed to automatically format your code on save.
- Run `npm run lint` before committing to catch any linting errors.

### Naming Conventions

- **Components**: Use PascalCase for React components (e.g., `StudentProfilePage`, `CreateStudentDialog`).
- **Functions/Variables**: Use camelCase (e.g., `getStudentById`, `addStudent`).
- **Files**: Use kebab-case for most files (e.g., `use-students.tsx`, `ai-chatbot.ts`), except for React components which should use PascalCase (e.g., `AppSidebar.tsx`).

### Documentation

- **JSDoc**: For complex functions, especially in AI flows and custom hooks, please add JSDoc comments to explain the purpose, parameters, and return values.
- **Inline Comments**: Use inline comments sparingly, only to explain particularly complex or non-obvious parts of the code.

### Code Organization

- Follow the existing directory structure. Place new components, hooks, and API routes in their respective domain-specific folders.
- Keep components small and focused on a single responsibility.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.
