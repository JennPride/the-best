This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

This repo has a separate **API server** (Fastify) and this **Next.js docs app**.

### 1. Start the API server

From the repo root:

```bash
cd apps/api
pnpm install   # or npm install / yarn
pnpm dev       # or npm run dev / yarn dev
```

By default the API listens on `http://localhost:3000` and exposes:

- `POST /auth/register`
- `POST /auth/login`

The docs app uses `NEXT_PUBLIC_API_URL` to talk to this API. If your API runs on a different URL, set:

```bash
export NEXT_PUBLIC_API_URL="http://localhost:3000"
```

before starting the docs app.

### 2. Start the Next.js docs app

In another terminal, from the repo root:

```bash
cd apps/docs
pnpm install   # or npm install / yarn
pnpm dev       # or npm run dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
