This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Package

```json
"dependencies": {
    "mongodb": "^6.2.0",
    "next": "14.0.2",
    "react": "^18",
    "react-dom": "^18"
}

"devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.2",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
```

First, make sure you has mongodb as database on your PC/SERVER
then install and run the development server:

```bash
yan

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## FOLDER

```
app (doc root)
--- src (we work here)
------ app (pages and api)
------ components (all components stored here)
------ lib (database connection and queries)
```