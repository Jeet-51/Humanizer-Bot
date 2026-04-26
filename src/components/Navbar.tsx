
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo icon */}
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
              {/* Rounded background */}
              <rect width="34" height="34" rx="9" fill="url(#navLogoGrad)" />
              {/* Pen / wand body */}
              <line x1="10" y1="26" x2="22" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              {/* Pen tip */}
              <polygon points="22,10 25,8 24,12" fill="white" opacity="0.95" />
              {/* Sparkle top-right */}
              <path d="M26 7 L26.7 9 L29 9 L27.3 10.4 L28 12.5 L26 11.2 L24 12.5 L24.7 10.4 L23 9 L25.3 9 Z" fill="white" opacity="0.9" />
              {/* Small dots */}
              <circle cx="9" cy="10" r="1.3" fill="white" opacity="0.6" />
              <circle cx="27" cy="22" r="1" fill="white" opacity="0.5" />
            </svg>
            <span className="font-bold text-xl gradient-text">AI Humanizer</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                isActive("/") 
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                isActive("/pricing") 
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
                  : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                isActive("/contact") 
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full" 
                  : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark
              ? <Sun className="h-4 w-4 text-yellow-500" />
              : <Moon className="h-4 w-4 text-slate-600" />
            }
          </button>

          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full">Dashboard</Button>
              </Link>
              <Button onClick={() => signOut()} className="rounded-full shadow-button">Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-full">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full shadow-button">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          fixed inset-x-0 top-16 bg-background/95 backdrop-blur-md border-b shadow-md z-40
          transition-all duration-300 ease-in-out transform
          ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
          md:hidden
        `}
      >
        <div className="space-y-1 p-6">
          <Link
            to="/"
            className={`block text-sm font-medium p-3 rounded-lg transition-colors ${
              isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className={`block text-sm font-medium p-3 rounded-lg transition-colors ${
              isActive("/pricing") ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className={`block text-sm font-medium p-3 rounded-lg transition-colors ${
              isActive("/contact") ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`block text-sm font-medium p-3 rounded-lg transition-colors ${
                  isActive("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium p-3 rounded-lg hover:bg-muted transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-sm font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block text-sm font-medium p-3 rounded-lg bg-primary/10 text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
