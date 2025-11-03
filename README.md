# Jewelshot V2 💎

AI-powered jewelry photography platform built with Next.js, Supabase, and FAL.AI.

## 🚀 Features

- **AI Generation**: Transform jewelry photos with AI (3 modes: Quick, Selective, Advanced)
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Gallery**: Manage and organize generated images
- **Profile & Settings**: User profile, avatar upload, storage management
- **Responsive Design**: Mobile-first, optimized for all devices
- **Type-Safe**: 100% TypeScript
- **Production-Ready**: Auth protection, rate limiting, error boundaries

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI**: FAL.AI (Flux Pro Model)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- FAL.AI account

## 🔧 Setup

1. **Clone and install**:

   ```bash
   git clone <repo-url>
   cd jewelshot_v2
   npm install
   ```

2. **Environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FAL_KEY`
   - `NEXT_PUBLIC_APP_URL`

3. **Database setup**:
   - Go to Supabase Dashboard
   - Run SQL from `supabase/migrations/20241103000001_initial_schema.sql`
   - Verify tables and policies are created

4. **Run development server**:

   ```bash
   npm run dev
   ```

5. **Open**: http://localhost:3000

## 📁 Project Structure

```
jewelshot_v2/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components (Atomic Design)
│   │   ├── atoms/          # Basic UI elements
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex components
│   │   └── templates/      # Page layouts
│   ├── lib/                # Utilities and configurations
│   │   ├── ai/            # AI generation logic
│   │   ├── auth/          # Authentication
│   │   ├── gallery/       # Gallery queries
│   │   ├── profile/       # Profile management
│   │   ├── storage/       # File uploads
│   │   └── supabase/      # Supabase client
│   ├── store/             # State management (Zustand)
│   └── types/             # TypeScript types
├── public/                # Static assets
└── supabase/             # Supabase configurations

```

## 🎨 Key Features

### AI Generation (3 Modes)

1. **Quick Mode**: 6 professional presets
   - White Background
   - Still Life
   - On Model
   - Lifestyle
   - Luxury
   - Close Up

2. **Selective Mode**: Custom combinations
   - Model style (4 options)
   - Location (4 options)
   - Mood (4 options)
   - Lighting (4 options)
   - Camera angle (4 options)
   - Pose (4 options)

3. **Advanced Mode**: Full control
   - Custom prompts
   - Negative prompts
   - Transformation strength
   - Guidance scale

### Authentication

- Email/password login
- OAuth (Google, GitHub)
- Password reset
- Protected routes

### Gallery

- Image grid (responsive)
- Filters (jewelry type, mode, date)
- Search
- Detail modal
- Download/Delete actions

### Profile & Settings

- Avatar upload
- Profile editing
- Password change
- Storage usage display
- Account deletion

## 🔒 Security

- Rate limiting (10 generations/hour)
- Auth protection on all sensitive routes
- RLS policies on Supabase
- File validation (type, size)
- Environment validation

## 🚀 Deployment

### Vercel

1. **Connect repository**:
   - Import project to Vercel
   - Connect to GitHub

2. **Environment variables**:
   - Add all env vars from `.env.local`
   - Use Vercel Environment Variables UI

3. **Deploy**:
   - Push to main branch
   - Vercel auto-deploys

### Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=<your_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key>
SUPABASE_SERVICE_ROLE_KEY=<your_key>
FAL_KEY=<your_key>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📊 Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Image Optimization**: Next/Image
- **Code Splitting**: Automatic
- **Caching**: Aggressive

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build check
npm run build
```

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@jewelshot.com

## 🎉 Credits

Built with ❤️ using:

- Next.js
- Supabase
- FAL.AI
- Tailwind CSS
- TypeScript
