<div align="center">
  <img src="./src/assets/branding/logo.png" width="80" alt="Rin AI Logo" />
  <h1>Rin AI</h1>
  <p><strong>A fast, private, and elegant AI chat assistant — powered by Mistral AI and Supabase.</strong></p>

  <p>
    <a href="https://rinx-ai.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-rinx--ai.vercel.app-c0392b?style=flat-square&logo=vercel" /></a>
    <a href="https://github.com/sowmiyan-s/rinx-ai"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-sowmiyan--s%2Frinx--ai-181717?style=flat-square&logo=github" /></a>
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
    <img alt="Stack" src="https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Supabase-646cff?style=flat-square" />
  </p>

  <img src="./src/assets/branding/banner.png" alt="Rin AI Banner" width="100%" style="border-radius: 12px; margin-top: 12px;" />
</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Mistral AI** | Powered by `mistral-large-latest` for state-of-the-art responses |
| 💬 **Persistent Chat** | Conversations saved per-user via Supabase PostgreSQL |
| ⚡ **Real-time Streaming** | Token-by-token streaming from Edge Functions |
| 🔐 **Auth System** | Secure email/password sign-up, sign-in, and password reset |
| 🛡️ **Row Level Security** | Every user sees only their own data |
| 👑 **Admin Panel** | Monitor all users and activity (role-gated) |
| 📱 **Responsive Design** | Works beautifully on desktop and mobile |
| 🚀 **Vercel Ready** | Deploy in minutes with `vercel.json` pre-configured |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────┐
│                    React + Vite                   │
│  /auth   →  Login / Signup / Forgot Password      │
│  /       →  Chat Interface (Index)                │
│  /admin  →  Admin Dashboard (role-gated)          │
│  /reset-password  →  Password Reset Flow          │
└───────────────────┬───────────────────────────────┘
                    │ HTTPS
┌───────────────────▼───────────────────────────────┐
│              Supabase Edge Function                │
│         supabase/functions/chat/index.ts          │
│    Deno runtime · validates session · streams      │
└───────────────────┬───────────────────────────────┘
                    │ REST
┌───────────────────▼───────────────────────────────┐
│                  Mistral AI API                   │
│           mistral-large-latest · streaming        │
└───────────────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────┐
│            Supabase PostgreSQL Database           │
│  Tables: profiles · conversations · messages      │
│          user_roles                               │
│  Security: Row Level Security (RLS) enabled       │
└───────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Supabase Edge Functions (Deno runtime) |
| **Database** | Supabase / PostgreSQL with RLS |
| **Auth** | Supabase Auth (email/password + password reset) |
| **AI Model** | Mistral AI — `mistral-large-latest` |
| **Hosting** | Vercel (frontend) + Supabase (backend) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Supabase account](https://supabase.com) (free tier works)
- [Mistral AI API key](https://console.mistral.ai/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for Edge Functions)

---

### 1. Clone the Repository

```bash
git clone https://github.com/sowmiyan-s/rinx-ai.git
cd rinx-ai
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Once created, go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://xyzxyz.supabase.co`)
   - **Anon/Public key**
3. Go to **SQL Editor** and run the migration files in order:

```bash
# Apply all migrations automatically
npx supabase db push
```

Or manually run the SQL files in `supabase/migrations/` via the Supabase SQL Editor.

---

### 4. Configure Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Supabase — get from: supabase.com → Settings → API
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"

# Mistral API key — set this in Supabase Edge Function secrets (NOT in .env)
# See Step 5 below
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

---

### 5. Set Up Mistral API Key (Edge Function Secret)

The Mistral API key is used by the Supabase Edge Function and must be stored as a **Supabase secret** — not in your frontend `.env`:

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-id

# Set the Mistral API key as a secret
npx supabase secrets set MISTRAL_API_KEY=your-mistral-api-key
```

Or via the Supabase Dashboard:
**Project → Settings → Edge Functions → Add secret** → `MISTRAL_API_KEY`

---

### 6. Deploy the Edge Function

```bash
npx supabase functions deploy chat
```

---

### 7. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

---

## ☁️ Deploying to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sowmiyan-s/rinx-ai)

### Manual Deploy

1. Push your repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set the following **Environment Variables** in Vercel:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID |

4. Set **Framework Preset** to `Vite`
5. Click **Deploy**

> The `vercel.json` in this repo already handles SPA routing so routes like `/auth` and `/reset-password` work correctly.

---

## 🔐 Authentication & Password Reset Flow

Rin AI uses Supabase Auth for all authentication:

```
/auth  →  Sign In / Sign Up
       →  "Forgot password?" → Enter email → Supabase sends reset email
       
(User clicks link in email)

/reset-password  →  New password form → Password updated → Redirect to /auth
```

### Required: Add Redirect URL in Supabase

For password reset emails to work on your deployed domain:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   https://your-domain.vercel.app/reset-password
   ```

---

## 👑 Admin Panel

The admin panel is available at `/admin` and is **role-gated** — only users with the `admin` role can access it.

### Granting Admin Access

Run the following SQL in your **Supabase SQL Editor**, replacing the email with the admin user's email:

```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-admin-email@example.com';
```

> 🔒 **Do not share or hardcode admin credentials anywhere.** Admin access is managed entirely through the database role system, not passwords.

---

## 📁 Project Structure

```
rinx-ai/
├── src/
│   ├── assets/            # Branding images (logo, banner, backgrounds)
│   ├── components/        # Reusable UI components
│   │   ├── ChatArea.tsx   # Main chat interface
│   │   ├── ChatInput.tsx  # Message input bar
│   │   ├── ChatMessage.tsx  # Message bubble renderer
│   │   ├── Sidebar.tsx    # Conversation list sidebar
│   │   └── WelcomeScreen.tsx
│   ├── hooks/
│   │   ├── useAuth.ts     # Auth state & actions
│   │   ├── useChat.ts     # Chat streaming logic
│   │   └── useConversations.ts
│   ├── integrations/
│   │   └── supabase/      # Supabase client & generated types
│   ├── pages/
│   │   ├── Auth.tsx       # Login / Signup / Forgot password
│   │   ├── Index.tsx      # Main chat page
│   │   ├── Admin.tsx      # Admin dashboard
│   │   ├── ResetPassword.tsx  # Password reset page
│   │   └── NotFound.tsx
│   └── App.tsx            # Routes
├── supabase/
│   ├── functions/chat/    # Mistral AI Edge Function
│   └── migrations/        # Database schema migrations
├── vercel.json            # Vercel SPA rewrite rules
├── .env.example           # Environment variable template
└── vite.config.ts         # Vite configuration
```

---

## 🔧 Environment Variables Reference

| Variable | Where | Required | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `.env` + Vercel | ✅ | Supabase project REST URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` + Vercel | ✅ | Supabase public/anon key |
| `VITE_SUPABASE_PROJECT_ID` | `.env` + Vercel | ✅ | Supabase project reference ID |
| `MISTRAL_API_KEY` | Supabase Secrets only | ✅ | Mistral AI API key (never in frontend) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/sowmiyan-s">Sowmiyan-S</a>
</div>
