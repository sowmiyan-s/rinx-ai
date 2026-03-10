# 🌌 Rin AI - Intelligent Cloud Assistant

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral%20AI-FD5521?style=for-the-badge&logo=mistralai&logoColor=white)](https://mistral.ai/)

**Rin AI** is a premium, high-performance intelligent assistant platform. Powered by **Mistral Large** and built on a secure **Supabase** foundation, it provides real-time streaming conversations, persistent history, and robust user authentication.

---

## ✨ Key Features

-   **⚡ Real-time Streaming**: Instant conversational responses with smooth UI transitions.
-   **🔐 Secure Authentication**: Integrated user login and profile management via Supabase Auth.
-   **💾 Persistent Memory**: Automatically saves conversation history, allowing you to pick up exactly where you left off.
-   **🛡️ Enterprise RLS**: Row Level Security ensures data isolation and privacy for every user.
-   **📈 Admin Dashboard**: Comprehensive oversight of user activity and message analytics.
-   **🎨 Premium UI**: A modern, sleek interface with glassmorphism and specialized animations.

---

## 🛠️ Architecture & Workflow

Rin AI leverages a specialized cloud-edge architecture. For a deep dive into the AI streaming flow and technical diagrams, please refer to:

👉 **[View ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18.x or higher)
-   **npm** / **bun**
-   **Supabase Account** (for database & auth)
-   **Mistral API Key**

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Rin-ai

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Source |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings > API |
| `MISTRAL_API_KEY` | Mistral Console |

### 3. Database Setup

Deploy the migrations included in the `/supabase/migrations` folder to your project using the Supabase CLI:

```bash
npx supabase migration up
```

### 4. Local Development

Start the development server:

```bash
npm run dev
```

---

## 🛠️ Troubleshooting AI Responses

If the AI is not responding, follow these steps:

1.  **Check Supabase Secrets**: The AI logic runs in a Supabase Edge Function. You **MUST** set your `MISTRAL_API_KEY` in the Supabase project secrets:
    ```bash
    npx supabase secrets set MISTRAL_API_KEY=tGHPNWARnRyNWWrsb7DDj0YHMQclbDlt
    ```
2.  **Verify Edge Function Deployment**: Ensure the function is deployed:
    ```bash
    npx supabase functions deploy chat --no-verify-jwt
    ```
    *(Note: Using `--no-verify-jwt` if you handle auth manually in the function logic)*.
3.  **Check Edge Function Logs**: Visit your Supabase Dashboard > Edge Functions > `chat` > Logs to see any specific errors (e.g., 401 for invalid API key).

---

## 🏗️ Tech Stack

-   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui.
-   **Backend**: Supabase Edge Functions (Deno).
-   **Database**: PostgreSQL with Row Level Security.
-   **AI Model**: Mistral Large via API.

---

## 🚢 Deployment

1.  **Host the Frontend**: Use Vercel, Netlify, or **Lovable** for static deployment.
2.  **Deploy Edge Functions**:
    ```bash
    npx supabase functions deploy chat
    ```
3.  **Configure Secrets**:
    ```bash
    npx supabase secrets set MISTRAL_API_KEY=your_key
    ```

---

## 📄 License & Attributions

Designed and built by [Sowmiyan-S](https://github.com/sowmiyan-s).  
*Rin AI - Intelligence Optimized.*
