# Taskify

Taskify is a project management app. Teams sign in, create a **workspace** (organization), and organize their work on **boards** made of **lists** and **cards** that can be reordered with drag and drop.

Built with Next.js (App Router), TypeScript, Prisma, PostgreSQL and Clerk.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Known Limitations](#known-limitations)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## Overview

Managing work across emails, chats and notes is hard to follow. Taskify gives a team one visual place to plan it:

- Every team gets its own **workspace**, powered by Clerk Organizations.
- Each workspace holds any number of **boards**, each with its own background photo.
- Boards contain **lists** (for example "To do", "Doing", "Done"), and lists contain **cards** (tasks).
- Data is isolated per workspace: every database query is scoped to the active organization ID, so one workspace cannot read or change another workspace's boards.

## Features

**Authentication and workspaces**
- Sign up and sign in with Clerk.
- Create a workspace or select an existing one after signing in (personal accounts are hidden, so every user works inside an organization).
- Switch between workspaces from the navbar or the sidebar.
- Workspace settings page using Clerk's organization profile (members, name, and so on).
- Route protection through middleware: signed-out visitors can only see the landing page and the sign-in and sign-up pages.

**Boards**
- Create a board with a title and a background image. Images come from Unsplash (a random selection of 9 from one collection). If Unsplash cannot be reached, a bundled set of default images is used instead.
- View all boards of the active workspace.
- Rename a board inline.
- Delete a board (its lists and cards are deleted with it).

**Lists**
- Create lists on a board.
- Rename a list inline.
- Copy a list, including its cards.
- Delete a list.
- Reorder lists with drag and drop.

**Cards**
- Add cards to a list.
- Open a card in a modal and rename it.
- Reorder cards inside a list, or drag them between lists. The new order is saved to the database in a single transaction.

**Interface**
- Landing page with links to sign up and log in.
- Responsive layout with a collapsible workspace sidebar (remembered in the browser's local storage) and a mobile sidebar drawer.
- Toast notifications and loading skeletons.
- Server-side validation of all inputs with Zod.

## Known Limitations

These are visible in the code today and are not implemented yet:

- The sidebar shows **Activity** and **Billing** links, but those pages do not exist, so they lead to a 404 page.
- The workspace page shows a "Free" label and a "5 remaining" boards message. Both are static text. No board limit or billing logic exists.


## Tech Stack

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 14 (App Router, Server Actions), [React](https://react.dev) 18 |
| Language | [TypeScript](https://www.typescriptlang.org) 5 |
| Authentication | [Clerk](https://clerk.com) (`@clerk/nextjs` 6) with Organizations |
| Database | [PostgreSQL](https://www.postgresql.org) |
| ORM | [Prisma](https://www.prisma.io) 5 |
| Validation | [Zod](https://zod.dev) 4 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3, [shadcn/ui](https://ui.shadcn.com) (new-york style), [Radix UI](https://www.radix-ui.com), `lucide-react` icons |
| Client state and data | [TanStack Query](https://tanstack.com/query) 5, [Zustand](https://zustand-demo.pmnd.rs) 5 |
| Drag and drop | [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd) 18 |
| Background images | [`unsplash-js`](https://github.com/unsplash/unsplash-js) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Utilities | `lodash`, `usehooks-ts`, `clsx`, `tailwind-merge`, `class-variance-authority` |
| Linting | ESLint 8 with `next/core-web-vitals` and `next/typescript` |
| Fonts | Geist (local files) and Poppins (Google Fonts, landing page) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or newer (the minimum for Next.js 14) and npm
- A PostgreSQL database (local, Docker or hosted)
- A free [Clerk](https://clerk.com) account
- Recommended: a free [Unsplash developer](https://unsplash.com/developers) account for board background photos

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

The project uses npm (a `package-lock.json` is included).

```bash
npm install
```

### 3. Set up Clerk

1. Create an application in the [Clerk Dashboard](https://dashboard.clerk.com).
2. Enable **Organizations** for the application. Taskify depends on them: users must create or join an organization to use the app.
3. Copy the **Publishable key** and **Secret key** from the API keys page.

### 4. Create your environment file

Create a file named `.env` in the project root (it is already listed in `.gitignore`, so it will not be committed). Use the template in [Environment Variables](#environment-variables).

### 5. Set up the database

Make sure your PostgreSQL database is running and `DATABASE_URL` is correct, then:

```bash
npx prisma generate
npx prisma db push
```

See [Database Setup](#database-setup) for details.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Try it out

1. Click **Get Taskify for free** and create an account.
2. Create a workspace (organization) when prompted.
3. Click **Create** in the navbar, pick a background and a title to create your first board.
4. Add lists and cards, then drag them around.

## Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection string used by Prisma
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskify"

# Clerk (Dashboard > API keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxx"

# Unsplash (https://unsplash.com/developers > your app > Access Key)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your_unsplash_access_key"
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Read by Prisma (`prisma/schema.prisma`). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key. It is read automatically by `@clerk/nextjs` and is safe to expose to the browser. |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key, used on the server. Never commit it or expose it publicly. |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Recommended | Unsplash access key used in `lib/unsplash.ts` to fetch board background photos. If the request fails, the board picker falls back to the images bundled in `constants/images.ts`. |

## Database Setup

Taskify uses **PostgreSQL** through **Prisma**. The schema lives in `prisma/schema.prisma` and defines three models:

| Model | Purpose | Key fields |
|---|---|---|
| `Board` | A board that belongs to a Clerk organization | `orgId`, `title`, background image fields (`imageId`, `imageThumbUrl`, `imageFullUrl`, `imageUserName`, `imageLinkHTML`) |
| `List` | A column on a board | `title`, `order`, `boardId` |
| `Card` | A task inside a list | `title`, `order`, `description` (optional), `listId` |

All models use UUID string IDs and have `createdAt` and `updatedAt` timestamps.

```mermaid
erDiagram
    Board ||--o{ List : contains
    List ||--o{ Card : contains
```

- Deleting a board deletes its lists, and deleting a list deletes its cards (`onDelete: Cascade`).
- `List.boardId` and `Card.listId` are indexed.
- Boards are tied to a workspace through `orgId`, which stores the Clerk organization ID.

### Commands

| Command | What it does |
|---|---|
| `npx prisma generate` | Generates the Prisma Client used by the app. |
| `npx prisma db push` | Creates or updates the database tables to match `schema.prisma`. |
| `npx prisma studio` | Opens a browser UI to view and edit your data. |

The repository does not contain a `prisma/migrations` folder, so the setup uses `db push` to sync the schema. If you prefer versioned migrations, use `npx prisma migrate dev` instead.

## Project Structure

```text
taskify/
├── actions/                  # Server Actions, one folder per action
│   ├── create-board/         #   index.ts (logic), schema.ts (Zod), types.ts
│   ├── update-board/
│   ├── delete-board/
│   ├── create-list/  update-list/  copy-list/  delete-list/  update-list-order/
│   └── create-card/  update-card/  update-card-order/
├── app/
│   ├── (marketing)/          # Public landing page
│   ├── (platform)/
│   │   ├── (clerk)/          # Sign-in, sign-up, select-org pages
│   │   └── (dashboard)/      # Authenticated app
│   │       ├── _components/  #   Navbar, sidebar, mobile sidebar
│   │       ├── board/[boardId]/          # Board page: lists, cards, drag and drop
│   │       └── organization/[organizationId]/   # Boards list and settings
│   ├── api/cards/[cardId]/   # GET route used by the card modal
│   ├── fonts/                # Local Geist fonts
│   ├── globals.css
│   └── layout.tsx            # Root layout and metadata
├── components/
│   ├── form/                 # Reusable form inputs, popover, image picker
│   ├── modals/card-modal/    # Card details modal
│   ├── providers/            # React Query and modal providers
│   └── ui/                   # shadcn/ui components
├── config/site.ts            # Site name and description
├── constants/images.ts       # Fallback background images
├── hooks/                    # useAction, card modal and mobile sidebar stores
├── lib/
│   ├── create-safe-action.ts # Zod validation wrapper for Server Actions
│   ├── db.ts                 # Prisma Client singleton
│   ├── fetcher.ts            # Fetch helper for React Query
│   ├── unsplash.ts           # Unsplash client
│   └── utils.ts
├── prisma/schema.prisma      # Database schema
├── public/                   # Static assets
├── middleware.ts             # Clerk auth and organization redirects
├── next.config.mjs           # Allowed remote image hosts (Clerk, Unsplash)
├── tailwind.config.ts
└── types.ts                  # Shared types (ListWithCards, CardWithList)
```

### How data changes work

Every mutation is a Server Action built with `createSafeAction`:

1. The input is validated with a Zod schema.
2. The user's `userId` and `orgId` are read from Clerk. If either is missing, the action returns `Unauthorized`.
3. A Prisma query runs with the organization ID in its `where` clause, so users can only touch their own workspace's data.
4. `revalidatePath` refreshes the page data.

On the client, the `useAction` hook calls an action and exposes loading state, field errors and success and error callbacks.

## Available Scripts

Run these from the project root:

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server at `http://localhost:3000` with hot reload. |
| `npm run build` | Creates an optimized production build. |
| `npm start` | Runs the production build (run `npm run build` first). |
| `npm run lint` | Runs ESLint with the Next.js configuration. |

There is no `test` script yet.

