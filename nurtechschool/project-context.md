# Project Context: nurtechschool

## Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS
- **State Management**: React Query (via `services/queries`)
- **Authentication**: NextAuth.js
- **Form Handling**: Likely React Hook Form (implied by `components/form`)

## Architecture

- **App Structure**: Standard Next.js App Router (`app/`).
- **Components**: Categorized into `custom`, `footer`, `form`, `layout`, `navbar`, `overlay`, and `ui`.
- **Services**: Centralized API logic in `services/`, using an interceptor pattern.
- **Types**: Centralized in `types/` using `.d.ts` files as per user rules.
- **Library**: Common utilities, constants, and hooks in `lib/`.

## Key Patterns

- **API Queries**: Custom hooks in `services/queries` (e.g., `useExtracurricular`).
- **Overlays**: Managed in `components/overlay/`, likely using a centralized overlay system (see `ov-excul.tsx`, `ov-menu.tsx`, etc.).
- **Reusable Components**: Prefix `c-` for custom components and standard Shadcn-like components in `ui/`.
- **Data Rendering**: `Mapper` component used for list rendering.

## Type Strategy

- All reusable types are in `types/` using `.d.ts`.
- One domain per file (e.g., `auth.d.ts`, `response.d.ts`).
