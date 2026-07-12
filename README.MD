# Classroom

Frontend for the Classroom management app — a Google-Classroom-style admin panel
built with React, Refine and shadcn/ui. It manages subjects, faculty, classes and
student enrollments, with authentication and a stats dashboard.

## Tech stack

- **React 19** + **Vite**
- **Refine** (data/auth providers, hooks, routing)
- **shadcn/ui** + **Tailwind CSS v4**
- **react-hook-form** + **zod** for forms
- **Recharts** for the dashboard chart

## Getting started

Make sure the [Classroom API](https://github.com/kanishk-singh19/classroom-backend)
is running first (default `http://localhost:8000`).

```bash
npm install
cp .env.example .env    # set VITE_BACKEND_BASE_URL (note the trailing slash)
npm run dev             # starts the app on http://localhost:5173
```

### Environment variables

See [.env.example](.env.example):

- `VITE_BACKEND_BASE_URL` — base URL of the backend API, e.g. `http://localhost:8000/api/`

## Features

- **Auth** — email/password login and signup, protected routes, JWT stored client-side
- **Subjects** — list, search, filter by department, create / edit / view
- **Faculty** — manage teachers, students and admins (list, filter by role, CRUD)
- **Classes** — create classes with a subject and teacher, auto-generated invite codes
- **Enrollments** — enroll and remove students from a class roster (respects capacity)
- **Dashboard** — stat cards, a subjects-by-department chart and recent classes

## Available scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run start` — preview the production build

## Demo accounts

After seeding the backend you can log in with `admin@classroom.test` /
`password123` (also `teacher@` and `student@`).

## License

MIT
