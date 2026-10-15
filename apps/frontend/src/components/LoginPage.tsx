import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login_schema } from "@/zod/login_schema";
import { supabase } from "@/utils/supabase_client";
import SlowScrollDashboardPreview from "./SlowScrollDashboardPreview";

// Color tokens
const COLORS = {
  background:      "#424341",
  surface:         "#AAAFaf",
  surfaceHover:    "#AFA9B4",
  primary:         "#D1D7D7",
  primaryHover:    "#AFA9B4",
  border:          "#D1D7D7",
  text:            "#D1D7D7",
  textMuted:       "#AFA9B4",
  overlayHero:     "rgba(66,67,65,0.18)",
};

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!formRef.current) return;
      if (e.key !== "Tab") return;
      const focusable = formRef.current.querySelectorAll<HTMLElement>(
        'input, button, a[href], textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const node = formRef.current;
    if (node) node.addEventListener("keydown", handleKeyDown);
    return () => { if (node) node.removeEventListener("keydown", handleKeyDown); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const credentials = login_schema.parse({ email, password });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        setError(error.message);
      } else {
        setError(null);
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid input");
    }
  };

  return (
    <div className="relative min-h-screen w-full font-inter text-[color:var(--text)] bg-[#18181b] overflow-hidden">
      {/* Fullscreen Preview Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SlowScrollDashboardPreview />
      </div>
      {/* Optional: Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" aria-hidden="true" />
      {/* Centered Login Form */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <form
          ref={formRef}
          onSubmit={handleLogin}
          className="bg-[color:var(--surface)]/20 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-[color:var(--border)]/30 max-w-[420px] w-full flex flex-col items-center p-8"
          style={{
            backgroundColor: `${COLORS.surface}33`, // 20% opacity
            boxShadow: "0 8px 32px 0 rgba(66,67,65,0.18)",
            borderRadius: "1rem",
          }}
          aria-label="Login form"
        >
          <img
            src="/clear_logo.png"
            alt="Adlyt logo"
            className="mx-auto mb-6"
            style={{ width: 250, height: 250, objectFit: 'contain' }}
            draggable={false}
          />
          <input
            ref={firstInputRef}
            type="email"
            aria-label="Email address"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 placeholder-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.04] ease-out duration-150"
            style={{
              backgroundColor: `${COLORS.surface}4D`, // 30% opacity
              borderColor: `${COLORS.border}66`, // 40% opacity
              color: COLORS.text,
            }}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            aria-label="Password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 placeholder-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.04] ease-out duration-150"
            style={{
              backgroundColor: `${COLORS.surface}4D`,
              borderColor: `${COLORS.border}66`,
              color: COLORS.text,
            }}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            aria-label="Sign in"
            className="mt-2 w-full py-3 rounded-lg bg-[color:var(--primary)] text-[color:var(--background)] font-bold text-lg shadow-md hover:bg-[color:var(--primaryHover)] transition-colors duration-150"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
              fontWeight: 700,
              fontSize: '1.125rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px 0 rgba(66,67,65,0.12)',
            }}
          >
            Sign in
          </button>
          <a
            href="#"
            className="text-[color:var(--text-muted)] hover:text-[color:var(--primary)] text-sm mt-4 inline-block transition"
            style={{ color: COLORS.textMuted }}
          >
            Forgot Password?
          </a>
          {error && (
            <div
              className="text-red-500 text-sm mt-4 w-full text-center"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
