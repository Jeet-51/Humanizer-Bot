<div align="center">

<img src="https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-8B5CF6?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Built%20with-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white" />

<br /><br />

# 🖊️ AI Humanizer

### Transform robotic AI text into natural, human-sounding writing — instantly.

**[🚀 Live Demo](https://jeet-51.github.io/Humanizer-Bot/)** &nbsp;·&nbsp; **[Report Bug](https://github.com/Jeet-51/Humanizer-Bot/issues)** &nbsp;·&nbsp; **[Request Feature](https://github.com/Jeet-51/Humanizer-Bot/issues)**

</div>

---

## 📖 What is AI Humanizer?

AI Humanizer is a full-stack web application that rewrites AI-generated text (from ChatGPT, Claude, Gemini, etc.) to sound naturally human-written. It bypasses AI detection tools like GPTZero, Turnitin, Originality.ai, and Copyleaks — and shows you a live **AI Detection Score** before and after, plus a **word-level Diff View** so you can see exactly what changed.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖→👤 **AI Text Humanization** | Powered by Google Gemini 2.5 Flash for natural, fluent rewrites |
| 📊 **AI Detection Score Meter** | Live before/after score with animated bars (heuristic-based, no external API) |
| 🔍 **Sentence-Level Diff View** | Word-by-word color-coded diff — green = added, red = removed |
| 📄 **Document Upload** | Process `.txt`, `.docx`, and `.pdf` files directly |
| 🎛️ **Full Customisation** | 5 readability levels × 5 writing styles × strength slider (0.1–0.9) |
| 🔐 **Auth & Profiles** | Secure sign up / sign in via Supabase Auth |
| 💳 **Credit System** | Per-user credits (10 free, upgradeable) with live usage display |
| 📜 **History** | Browse and revisit all past humanizations with pagination |
| 📱 **Responsive** | Works great on desktop, tablet, and mobile |

---

## 🖥️ Screenshots

> **Hero** — Dark gradient with live stats

> **Dashboard** — AI Score Meter + Diff View after humanization

> **Features** — Bento grid with individual gradient cards

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui (60+ components) | Component library |
| Framer Motion | Animations |
| React Router DOM | Routing |
| TanStack Query | Server state |
| React Hook Form + Zod | Forms & validation |

### Backend
| Technology | Purpose |
|---|---|
| Supabase (PostgreSQL) | Database |
| Supabase Auth | Authentication |
| Supabase Edge Functions (Deno) | Serverless API |
| Supabase Storage | File uploads |
| Google Gemini 2.5 Flash | AI text humanization |

### DevOps
| Technology | Purpose |
|---|---|
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (free)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for edge function deployment)

### 1. Clone the repository

```bash
git clone https://github.com/Jeet-51/Humanizer-Bot.git
cd Humanizer-Bot
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Once ready, go to **Settings → API Keys** and copy:
   - **Project URL** → `https://xxxxxx.supabase.co`
   - **Publishable key** → `sb_publishable_...`

### 3. Set up the database

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Profiles table
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 10,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Humanizations history
CREATE TABLE humanizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  humanized_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment records
CREATE TABLE payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"    ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"  ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile"  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own humanizations"   ON humanizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own humanizations" ON humanizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own documents"   ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own contact messages" ON contact_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments"   ON payment_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payment_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, username, credits, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    10, 'free'
  ) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4. Create Storage bucket

In Supabase → **Storage** → New bucket → name it `documents` → Private.

### 5. Update Supabase credentials

Edit `src/integrations/supabase/client.ts`:

```ts
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YOUR_KEY";
```

### 6. Deploy the Edge Function

```bash
# Download Supabase CLI (Windows)
# Or: brew install supabase/tap/supabase (macOS)

# Login and link project
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# Set your Gemini API key as a secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Deploy the edge function
supabase functions deploy humanize-text --no-verify-jwt
```

### 7. Run locally

```bash
npm run dev
# Open http://localhost:5173
```

---

## 📁 Project Structure

```
Humanizer-Bot/
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components (60+)
│   │   ├── humanizer/
│   │   │   ├── AIScoreMeter.tsx # AI Detection Score with before/after bars
│   │   │   ├── DiffView.tsx     # Word-level color-coded diff
│   │   │   ├── InputSection.tsx
│   │   │   ├── OutputSection.tsx
│   │   │   └── HumanizerOptions.tsx
│   │   ├── dashboard/           # Dashboard tabs and credit usage
│   │   ├── contact/             # Contact form components
│   │   ├── HumanizerTool.tsx    # Main tool (orchestrates all sub-components)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Index.tsx            # Landing page
│   │   ├── Dashboard.tsx        # Main app dashboard
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Pricing.tsx
│   │   ├── Payment.tsx
│   │   └── Contact.tsx
│   ├── hooks/
│   │   ├── useTextHumanization.ts   # Core Gemini API integration
│   │   ├── useDocumentExtraction.ts # PDF/DOCX/TXT extraction
│   │   └── useHumanizerForm.ts      # Form state management
│   ├── context/
│   │   └── AuthContext.tsx      # Global auth state
│   ├── lib/supabase/            # DB layer (profile, humanizations, docs...)
│   └── integrations/supabase/  # Auto-generated Supabase client & types
├── supabase/
│   ├── functions/
│   │   └── humanize-text/
│   │       └── index.ts        # Deno edge function → Gemini 2.5 Flash
│   └── migrations/             # SQL migration files
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions → GitHub Pages
```

---

## 🧩 How the AI Score Works

The **AI Detection Score** is calculated client-side using 4 heuristics — no external API needed:

| Signal | Weight | Logic |
|---|---|---|
| **Burstiness** | 35% | AI writes very uniform sentence lengths (low variance = high score) |
| **AI buzzwords** | 35% | Detects words like *furthermore, utilize, leverage, paradigm, robust* |
| **Vocabulary richness** | 15% | Type-token ratio — AI reuses words more than humans |
| **Avg sentence length** | 15% | AI tends to write longer sentences (>22 words = flagged) |

Score ranges: 🔴 70–100% = Likely AI · 🟡 40–70% = Mixed · 🟢 0–40% = Human-like

---

## 🔧 Available Scripts

```bash
npm run dev        # Start development server (port 5173)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 🚢 Deployment

The project auto-deploys to GitHub Pages on every push to `main`:

```bash
git push origin main
# GitHub Actions builds and deploys automatically
# Live at: https://jeet-51.github.io/Humanizer-Bot/
```

To enable GitHub Pages manually:
1. Go to **Settings → Pages**
2. Set source to **GitHub Actions**
3. Go to **Settings → Actions → General → Workflow permissions** → Read and write

---

## 🗺️ Roadmap

- [x] Core text humanization (Gemini 2.5 Flash)
- [x] AI Detection Score Meter
- [x] Sentence-Level Diff View
- [x] Document upload (.txt, .docx, .pdf)
- [x] User auth + credit system
- [x] Humanization history
- [x] GitHub Pages deployment
- [ ] Bypass Mode Selector (tuned for GPTZero / Turnitin / Originality.ai)
- [ ] Writing Fingerprint Match (mirror user's own style)
- [ ] Real payment integration (Stripe)
- [ ] Dark mode
- [ ] Browser extension

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI text humanization
- [Supabase](https://supabase.com/) — Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
- [Tailwind CSS](https://tailwindcss.com/) — Styling framework
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide](https://lucide.dev/) — Icons

---

<div align="center">

**Built with ❤️ by [Jeet Patel](https://github.com/Jeet-51)**

⭐ Star this repo if you find it useful!

</div>
