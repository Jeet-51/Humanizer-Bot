import { HumanizerTool } from "@/components/HumanizerTool";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Zap, FileText, Lock,
  Users, Sliders, Star, CheckCircle2, Sparkles
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const gradientText: React.CSSProperties = {
  background: "linear-gradient(90deg, #8B5CF6, #4F46E5)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f0a1e 0%, #1a1040 50%, #0d0b22 100%)",
};

const darkSectionStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #0f0a1e 0%, #130d35 100%)",
};

const stats = [
  { value: "10M+", label: "Words Humanized" },
  { value: "98%",  label: "AI Bypass Rate"  },
  { value: "50K+", label: "Active Users"    },
  { value: "4.9★", label: "User Rating"     },
];

const steps = [
  { n: "01", title: "Paste Your Text",   desc: "Drop in any AI-generated content — essays, articles, emails, or reports." },
  { n: "02", title: "Pick Your Style",   desc: "Choose readability level, writing purpose, and humanization strength." },
  { n: "03", title: "Humanize & Export", desc: "Get natural-sounding output in seconds, complete with AI Detection Score." },
];

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-violet-600" />,
    bg: "#f5f3ff",
    title: "Bypass AI Detectors",
    desc: "Passes GPTZero, Turnitin, Originality.ai, and more — consistently.",
    tags: ["GPTZero", "Turnitin", "Originality.ai", "Copyleaks"],
    wide: true,
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
    bg: "#eef2ff",
    title: "Powered by Gemini 2.5",
    desc: "State-of-the-art Google AI for the most natural rewrites.",
    tags: [],
    wide: false,
  },
  {
    icon: <Sliders className="h-6 w-6 text-pink-600" />,
    bg: "#fdf2f8",
    title: "Full Customisation",
    desc: "5 styles × 5 readability levels × strength slider (0.1–0.9).",
    tags: [],
    wide: false,
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-600" />,
    bg: "#f0fdf4",
    title: "Document Upload",
    desc: "Process entire .txt, .docx, and .pdf files in one click.",
    tags: [],
    wide: false,
  },
  {
    icon: <Lock className="h-6 w-6 text-amber-600" />,
    bg: "#fffbeb",
    title: "Privacy First",
    desc: "Your content is never stored or shared without consent.",
    tags: [],
    wide: false,
  },
  {
    icon: <Users className="h-6 w-6 text-sky-600" />,
    bg: "#f0f9ff",
    title: "Team Collaboration",
    desc: "Enterprise plans include shared credits and full team history.",
    tags: [],
    wide: true,
  },
];

const testimonials = [
  {
    name: "Sarah J.", role: "Content Marketer", stars: 5,
    text: "This tool saves me hours every week. AI drafts → polished human content in seconds.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&q=80&fit=crop",
  },
  {
    name: "Michael T.", role: "Freelance Writer", stars: 5,
    text: "The AI Detection Score alone is worth it — I can actually see how much the text improved.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80&fit=crop",
  },
  {
    name: "Elena K.", role: "SEO Specialist", stars: 5,
    text: "Processes full blog posts in one shot and passes every AI checker I've tested.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80&fit=crop",
  },
];

const Index = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">

    {/* ── HERO ─────────────────────────────────────────────────── */}
    <section className="relative py-20 md:py-32 overflow-hidden" style={heroStyle}>
      {/* Orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)" }} />

      <div className="container px-4 md:px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-white/80"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Powered by Google Gemini 2.5 Flash
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.1)}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Make AI Text Sound{" "}
          <span style={gradientText}>Genuinely Human</span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.2)} className="mx-auto max-w-2xl text-lg mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
          Transform robotic AI-generated content into natural, flowing writing that bypasses every AI detector
          — with a live Detection Score to prove it.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/signup">
            <Button size="lg" className="px-8 gap-2 text-base text-white border-0"
              style={{ background: "linear-gradient(90deg, #7C3AED, #4338CA)", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}>
              Start for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="px-8 text-base text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}>
              View Pricing
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.4)} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl px-4 py-4 text-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="container px-4 md:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#8B5CF6" }}>How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white">
            Three steps to{" "}
            <span style={gradientText}>human-quality</span>
            {" "}writing
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, #8B5CF6, #4F46E5, transparent)" }} />

          {steps.map((step, i) => (
            <motion.div key={step.n} {...fadeUp(0.1 * i)}
              className="relative rounded-2xl p-7 border border-violet-100 dark:border-violet-900 dark:bg-slate-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              style={{ background: i === 1 ? "linear-gradient(145deg, #faf5ff, #ede9fe)" : "white" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm mb-5 shadow-md"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #4F46E5)" }}>
                {step.n}
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── LIVE DEMO ─────────────────────────────────────────────── */}
    <section className="py-16 md:py-24 dark:bg-slate-900"
      style={{ background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)" }}>
      <div className="container px-4 md:px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#8B5CF6" }}>Live Demo</p>
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white">
            Try It <span style={gradientText}>Right Now</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground mt-4">
            No account needed. Paste AI text, click humanize, and watch the Detection Score drop.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.2)}
          className="bg-white dark:bg-slate-950 rounded-3xl p-6 md:p-10"
          style={{ boxShadow: "0 8px 48px rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <HumanizerTool />
        </motion.div>
      </div>
    </section>

    {/* ── FEATURES BENTO ────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="container px-4 md:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#8B5CF6" }}>Features</p>
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white">
            Everything you need to{" "}
            <span style={gradientText}>stay undetected</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(0.07 * i)}
              className={`rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 dark:border-slate-800 dark:bg-slate-900 ${f.wide ? "sm:col-span-2 lg:col-span-2" : ""}`}
              style={{ backgroundColor: f.bg }}>
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              {f.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {f.tags.map(tag => (
                    <span key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: "rgba(139,92,246,0.1)", color: "#7C3AED", border: "1px solid rgba(139,92,246,0.2)" }}>
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
    <section className="py-16 md:py-24 relative overflow-hidden" style={darkSectionStyle}>
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-violet-400">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Loved by{" "}
            <span style={gradientText}>50,000+ creators</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(0.1 * i)}
              className="rounded-2xl p-7 transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="text-5xl font-serif mb-3 select-none" style={{ color: "rgba(139,92,246,0.4)", lineHeight: 1 }}>"</div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ outline: "2px solid rgba(139,92,246,0.4)" }} />
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────────────── */}
    <section className="py-20 md:py-28 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)" }} />

      <div className="container px-4 md:px-6 relative z-10 text-center">
        <motion.div {...fadeUp()} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "#EDE9FE", color: "#7C3AED" }}>
            <CheckCircle2 className="h-4 w-4" /> No credit card required
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 dark:text-white">
            Ready to make your AI text
            <br />
            <span style={gradientText}>completely undetectable?</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ writers, students, and marketers who trust AI Humanizer every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-10 gap-2 text-base rounded-full text-white border-0"
                style={{ background: "linear-gradient(90deg, #7C3AED, #4338CA)", boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}>
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-10 rounded-full text-base"
                style={{ borderColor: "#C4B5FD", color: "#7C3AED" }}>
                See Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Free plan includes 10 credits · No credit card needed · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Index;
