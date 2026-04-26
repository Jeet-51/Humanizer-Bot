import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#0a0818] text-white/60 border-t border-white/5">
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                <rect width="34" height="34" rx="9" fill="url(#footerLogoGrad)" />
                <line x1="10" y1="26" x2="22" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="22,10 25,8 24,12" fill="white" opacity="0.95" />
                <path d="M26 7 L26.7 9 L29 9 L27.3 10.4 L28 12.5 L26 11.2 L24 12.5 L24.7 10.4 L23 9 L25.3 9 Z" fill="white" opacity="0.9" />
                <circle cx="9" cy="10" r="1.3" fill="white" opacity="0.6" />
              </svg>
              <span className="font-bold text-lg text-white">AI Humanizer</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Transform AI-generated content into natural, human-like writing that bypasses every AI detector.
            </p>
            <p className="text-xs text-white/30">
              Powered by Google Gemini 2.5 Flash
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <nav className="flex flex-col space-y-2.5 text-sm">
              <Link to="/"         className="hover:text-white transition-colors">Home</Link>
              <Link to="/pricing"  className="hover:text-white transition-colors">Pricing</Link>
              <Link to="/contact"  className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Account</h4>
            <nav className="flex flex-col space-y-2.5 text-sm">
              <Link to="/login"     className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup"    className="hover:text-white transition-colors">Sign Up</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} AI Humanizer. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link to="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
