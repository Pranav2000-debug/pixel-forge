# PixelForge

A modern video management and media processing platform built with Next.js 16.

## Overview

PixelForge is a SaaS-style web application that enables users to upload, compress, manage, and share video content. It leverages Cloudinary for cloud-based media storage and processing, with Clerk handling authentication.

## Features

- **Video Upload & Management** — Upload videos to Cloudinary, view them in a responsive gallery, download or delete as needed
- **Video Compression** — Automatic tracking of original vs. compressed file sizes
- **Social Sharing** — Share media content across social platforms
- **User Authentication** — Secure sign-in/sign-up powered by Clerk

## Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| **Frontend**       | Next.js 16, React 19, TypeScript |
| **Styling**        | TailwindCSS 4, DaisyUI 5         |
| **Database**       | PostgreSQL with Prisma ORM       |
| **Media Storage**  | Cloudinary                       |
| **Authentication** | Clerk                            |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Clerk account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pixelforge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following:

   ```env
   DATABASE_URL="postgresql://..."

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pixelforge/
├── app/
│   ├── (app)/           # Authenticated app routes
│   │   ├── home/        # Video gallery dashboard
│   │   ├── social-share/# Social sharing module
│   │   └── videoupload/ # Video upload page
│   ├── (auth)/          # Authentication routes
│   └── api/             # API endpoints
├── components/          # Reusable UI components
├── lib/                 # Utility functions
├── prisma/              # Database schema
└── types/               # TypeScript type definitions
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## License

MIT
