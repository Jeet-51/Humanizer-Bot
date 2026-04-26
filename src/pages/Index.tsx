import { HumanizerTool } from "@/components/HumanizerTool";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Zap, FileText, Lock,
  Users, Sliders, Star, CheckCircle2, Sparkles
} from "lucide-react";

/* ─── Animation helpers ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

/* ─── Data ───────────────────────────────────────────────────────── */
const stats = [
  { value: "10M+",  label: "Words Humanized" },
  { value: "98%",   label: "AI Bypass Rate"  },
  { value: "50K+",  label: "Active Users"    },
  { value: "4.9★",  label: "User Rating"     },
];

const steps = [
  { n: "01", title: "Paste Your Text",    desc: "Drop in any AI-generated content — essays, articles, emails, or reports." },
  { n: "02", title: "Pick Your Style",    desc: "Choose readability level, writing purpose, and humanization strength." },
  { n: "03", title: "Humanize & Export",  desc: "Get natural-sounding output in seconds, complete with AI Detection Score." },
];

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-violet-500" />,
    title: "Bypass AI Detectors",
    desc:  "Passes GPTZero, Turnitin, Originality.ai, and more — consistently.",
    size:  "lg", // spans 2 cols on large screens
    gradient: "from-violet-50 to-purple-50",
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-500" />,
    title: "Powered by Gemini 2.5",
    desc:  "State-of-the-art Google AI for the most natural rewrites.",
    size:  "sm",
    gradient: "from-indigo-50 to-blue-50",
  },
  {
    icon: <Sliders className="h-6 w-6 text-pink-500" />,
    title: "Full Customisation",
    desc:  "Academic, Business, Creative, Technical — 5 styles × 5 readability levels × strength slider.",
    size:  "sm",
    gradient: "from-pink-50 to-rose-50",
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-500" />,
    title: "Document Upload",
    desc:  "Process entire .txt, .docx, and .pdf files in one click.",
    size:  "sm",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: <Lock className="h-6 w-6 text-amber-500" />,
    title: "Privacy First",
    desc:  "Your content is never stored or shared without consent.",
    size:  "sm",
    gradient: "from-amber-50 to-yellow-50",
  },
  {
    icon: <Users className="h-6 w-6 text-sky-500" />,
    title: "Team Collaboration",
    desc:  "Enterprise plans include shared credits and team history.",
    size:  "lg",
    gradient: "from-sky-50 to-cyan-50",
  },
];

const testimonials = [
  {
    name: "Sarah J.",    role: "Content Marketer",  stars: 5,
    text: "This tool saves me hours every week. AI drafts → polished human content in seconds.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&q=80&fit=crop",
  },
  {
    name: "Michael T.", role: "Freelance Writer",   stars: 5,
    text: "The AI Detection Score alone is worth it — I can actually see how much the text improved.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80&fit=crop",
  },
  {
    name: "Elena K.",   role: "SEO Specialist",     stars: 5,
    text: "Processes full blog posts in one shot and passes every AI checker I've tested.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80&fit=crop",
  },
];

/* ─── Page ───────────────────────────────────────────────────────── */
const Index = () => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">

    {/* ── HERO ────────────────────────────────────────────────────── */}
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0f0a1e] via-[#1a1040] to-[#0d0b22] overflow-hidden">

      {/* Background orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-700/10 blur-[100px] pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10 text-center">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Powered by Google Gemini 2.5 Flash
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.1)}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Make AI Text Sound{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Genuinely Human
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.2)}
          className="mx-auto max-w-2xl text-lg text-white/60 mb-10">
          Transform robotic AI-generated content into natural, flowing writing that bypasses every AI detector — with a live Detection Score to prove it.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/signup">
            <Button size="lg"
              className="px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-900/40 gap-2 text-base">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline"
              className="px-8 border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm text-base">
              View Pricing
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div {...fadeUp(0.4)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 text-center">
              <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold">Three steps to <span className="gradient-text">human-quality</span> writing</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.5%+1rem)] right-[calc(16.5%+1rem)] h-px bg-gradient-to-r from-violet-200 via-indigo-300 to-violet-200" />

          {steps.map((step, i) => (
            <motion.div key={step.n} {...fadeUp(0.1 * i)}
              className="relative bg-gradient-to-b from-white to-violet-50/50 border border-violet-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm mb-5 shadow-md shadow-violet-200">
                {step.n}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── LIVE DEMO ───────────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-gradient-to-b from-violet-50/60 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/50 via-transparent to-transparent pointer-events-none" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Live Demo</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Try It <span className="gradient-text">Right Now</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground mt-4">
            No account needed. Paste AI text, click humanize, and watch the Detection Score drop.
          </p>
        </motion.div>
        <motion.div {...fadeUp(0.2)}
          className="bg-white rounded-3xl shadow-xl shadow-violet-100 border border-violet-100 p-6 md:p-10">
          <HumanizerTool />
        </motion.div>
      </div>
    </section>

    {/* ── FEATURES BENTO ──────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Everything you need to <span className="gradient-text">stay undetected</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(0.08 * i)}
              className={`
                relative bg-gradient-to-br ${f.gradient} border border-white
                rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all group
                ${f.size === "lg" ? "sm:col-span-2 lg:col-span-2" : ""}
              `}>
              {/* Glow dot */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-current opacity-30 group-hover:opacity-60 transition-opacity" style={{color: "inherit"}} />
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              {f.size === "lg" && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {["GPTZero", "Turnitin", "Originality.ai", "Copyleaks"].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/70 border border-white text-muted-foreground font-medium">
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

    {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0f0a1e] to-[#1a1040] relative overflow-hidden">
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-violet-700/20 blur-[100px] pointer-events-none" />
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Loved by <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">50,000+ creators</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(0.1 * i)}
              className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-7 hover:bg-white/8 transition-all">
              {/* Big quote mark */}
              <div className="text-6xl font-serif text-violet-400/30 leading-none mb-3 select-none">"</div>
              <p className="text-white/75 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40" />
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
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

    {/* ── CTA ─────────────────────────────────────────────────────── */}
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

      <div className="container px-4 md:px-6 relative z-10 text-center">
        <motion.div {...fadeUp()} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
            <CheckCircle2 className="h-4 w-4" /> No credit card required
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Ready to make your<br />
            <span className="gradient-text">AI text undetectable?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join 50,000+ writers, students, and marketers who trust AI Humanizer every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg"
                className="px-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200 gap-2 text-base rounded-full">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline"
                className="px-10 rounded-full border-violet-200 text-violet-700 hover:bg-violet-50 text-base">
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
