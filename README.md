# Hierarchical Office Management System

A secure, hierarchical office management and letter system built with Next.js 14.

## Features

- **Strict Hierarchy**: Users are organized in a tree structure. Visibility and permissions are strictly enforced based on the hierarchy (parent-child relationships).
- **Secure Letters**: Send letters to parents or descendants. Letters have a strict lifecycle (Draft -> Sent -> Signed/Responded).
- **Digital Signatures**: Recipients can digitally sign letters and provide responses.
- **Audit Logging**: Comprehensive audit logging for all actions.
- **Modern UI**: Built with Tailwind CSS and shadcn/ui, featuring a dark mode aesthetic.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Start the server:
    ```bash
    npm start
    ```

## Development Mode (In-Memory Database)

Currently, the application is configured to use an **in-memory database** for demonstration and testing purposes. This means:

- **Data is not persistent**: All data will be lost when the server restarts.
- **Initial User**: A root admin user is created automatically on startup.

### Default Credentials

- **Email**: `admin@company.com`
- **Password**: `admin123`

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: In-memory store (mocking Prisma/PostgreSQL)
- **Authentication**: Custom session-based auth with bcrypt
- **Validation**: Zod

## Key Directories

- `src/app`: Next.js app router pages and API routes (Server Actions)
- `src/components`: Reusable UI components
- `src/lib`: Utility functions (auth, hierarchy, validation, db)
