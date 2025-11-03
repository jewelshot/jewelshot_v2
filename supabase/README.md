# 📊 Jewelshot V2 - Database Schema

## Overview

This directory contains Supabase migrations and database documentation for Jewelshot V2.

## 🗄️ Schema Design

### Core Tables

#### 1. **profiles**

Extends `auth.users` with additional user metadata and usage tracking.

```sql
- id (UUID, PK, FK to auth.users)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- avatar_url (TEXT)
- subscription_tier (TEXT: 'free', 'pro', 'enterprise')
- images_count (INTEGER)
- ai_generations_count (INTEGER)
- storage_used_bytes (BIGINT)
- created_at, updated_at (TIMESTAMPTZ)
```

**Relationships:**

- One-to-Many with `images`
- One-to-Many with `projects`
- One-to-Many with `ai_generations`

---

#### 2. **images**

Stores uploaded and AI-generated images.

```sql
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- storage_path (TEXT)
- url (TEXT)
- filename (TEXT)
- file_size (BIGINT)
- mime_type (TEXT)
- width, height (INTEGER)
- aspect_ratio (TEXT)
- source_type (TEXT: 'upload', 'ai_generated', 'edited')
- parent_image_id (UUID, FK to images - for edit history)
- is_favorite (BOOLEAN)
- tags (TEXT[])
- created_at, updated_at (TIMESTAMPTZ)
```

**Relationships:**

- Many-to-One with `profiles`
- Self-referencing (parent_image_id)

---

#### 3. **projects**

Canvas projects for save/load functionality.

```sql
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- name (TEXT)
- description (TEXT)
- thumbnail_url (TEXT)
- canvas_state (JSONB) -- Serialized canvas state
- is_template (BOOLEAN)
- is_public (BOOLEAN)
- view_count (INTEGER)
- created_at, updated_at, last_opened_at (TIMESTAMPTZ)
```

**Relationships:**

- Many-to-One with `profiles`

---

#### 4. **ai_generations**

AI generation history and parameters.

```sql
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- image_id (UUID, FK to images)
- prompt (TEXT)
- negative_prompt (TEXT)
- jewelry_type (TEXT: 'ring', 'necklace', 'earring', 'bracelet')
- gender (TEXT: 'women', 'men')
- aspect_ratio (TEXT)
- mode (TEXT: 'quick', 'selective', 'advanced')
- parameters (JSONB) -- Mode-specific params
- status (TEXT: 'pending', 'processing', 'completed', 'failed')
- result_url (TEXT)
- error_message (TEXT)
- cost_credits (DECIMAL)
- created_at, completed_at (TIMESTAMPTZ)
```

**Relationships:**

- Many-to-One with `profiles`
- One-to-One with `images`

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### profiles

- ✅ Users can **SELECT** own profile
- ✅ Users can **UPDATE** own profile

### images

- ✅ Users can **SELECT** own images
- ✅ Users can **INSERT** own images
- ✅ Users can **UPDATE** own images
- ✅ Users can **DELETE** own images

### projects

- ✅ Users can **SELECT** own projects OR public projects
- ✅ Users can **INSERT** own projects
- ✅ Users can **UPDATE** own projects
- ✅ Users can **DELETE** own projects

### ai_generations

- ✅ Users can **SELECT** own generations
- ✅ Users can **INSERT** own generations
- ✅ Users can **UPDATE** own generations

---

## 🪝 Triggers & Functions

### Auto-update `updated_at`

Automatically updates the `updated_at` timestamp on every record update.

**Tables:** `profiles`, `images`, `projects`

### Auto-create profile on signup

Creates a profile record automatically when a user signs up.

**Trigger:** `on_auth_user_created` on `auth.users`

### Auto-update storage usage

Tracks user storage usage when images are added/deleted.

**Trigger:** `update_user_storage` on `images`

### Auto-update AI generation count

Increments user's AI generation count when status changes to 'completed'.

**Trigger:** `update_user_ai_count` on `ai_generations`

---

## 📦 Storage Buckets

### 1. **images** (Public)

User uploaded and generated images.

**Policies:**

- Users can upload to their own folder
- All users can view
- Users can update/delete own files

### 2. **avatars** (Public)

User profile avatars.

**Policies:**

- Anyone can view
- Users can upload/update own avatar

### 3. **thumbnails** (Public)

Project and image thumbnails.

---

## 🚀 Running Migrations

### Local Development

```bash
# Start Supabase locally
supabase start

# Run migrations
supabase db reset

# Or apply specific migration
supabase migration up
```

### Production

Migrations are automatically applied when pushed to the Supabase project.

```bash
# Link to remote project
supabase link --project-ref <project-id>

# Push migrations
supabase db push
```

---

## 📈 Performance Considerations

### Indexes Created

- All foreign keys are indexed
- `created_at` columns for sorting
- `user_id` + `created_at` composite indexes
- GIN index on `tags` array
- Subscription tier and status fields

### Query Optimization

- Use `.select('*')` sparingly, specify columns
- Leverage RLS policies for security
- Use pagination with `.range()`
- Consider materialized views for complex aggregations (future)

---

## 🔮 Future Enhancements

Potential additions for Phase 3+:

- **folders** table for organization
- **tags** table for normalized tagging
- **user_settings** for preferences
- **webhooks** for event notifications
- **audit_logs** for compliance
- **file_versions** for version history

---

## 📝 Type Generation

TypeScript types are maintained in `src/lib/supabase/types.ts` and should be kept in sync with the schema.

To regenerate types from Supabase:

```bash
npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts
```

---

## 🛠️ Helper Queries

Pre-built query helpers are available in `src/lib/supabase/queries.ts`:

- `getProfile()`, `updateProfile()`
- `getUserImages()`, `createImage()`, `deleteImage()`
- `getUserProjects()`, `createProject()`, `updateProject()`
- `getUserGenerations()`, `createGeneration()`, `updateGenerationStatus()`
- `uploadImage()`, `deleteStorageFile()`

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
