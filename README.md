## Project Overview: "TaskFlow"
A collaborative task management app where users can:
- Create and manage personal tasks
- Share tasks with team members
- Add comments to tasks
- Filter and search tasks
-Real-time updates when others make changes

## Components
Next.js: Server-side rendering for the task dashboard, file-based routing for different views
React: Component-based UI with forms, lists, and modals
TanStack Query: Caching task lists, optimistic updates when creating/editing tasks
tRPC: Type-safe API routes for CRUD operations on tasks, users, and comments
Zod: Input validation for task creation, user registration, comment submission
Prisma: Database schema for Users, Tasks, Comments with relationships

## Core Features 
Authentication (simple email/password)
Task CRUD (create, read, update, delete tasks)
Task Assignment (assign tasks to team members)
Comments System (add comments to tasks)
Real-time Updates (using tRPC subscriptions)
Search/Filter (by status, assignee, due date)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
