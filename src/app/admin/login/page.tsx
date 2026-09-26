"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Database,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password state
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [requestingOtp, setRequestingOtp] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Access denied. Invalid admin email or password.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setRequestingOtp(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp" }),
      });
      const data = await res.json();
      if (data.success && data.otp) {
        setGeneratedOtp(data.otp);
        setOtpCode(data.otp); // Pre-fill for convenience
        setSuccessMsg(`Your One-Time Password (OTP) has been generated! Code: ${data.otp}`);
      } else {
        setError(data.error || "Failed to generate OTP.");
      }
    } catch (err: any) {
      setError("Server error while generating OTP.");
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "reset",
          code: otpCode.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Password reset successfully! You can now log in with your new password.");
        setPassword(newPassword);
        setMode("login");
        setGeneratedOtp(null);
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Password reset failed. Invalid OTP or PIN.");
      }
    } catch (err) {
      setError("Server error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] ai-background ai-grid flex items-center justify-center p-4">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="text-xs font-mono text-gray-500">Owner Access</span>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow mb-3">
              {mode === "login" ? <ShieldCheck className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mode === "login" ? "Admin Authentication" : "Password Recovery & OTP"}
            </h1>
            <p className="text-xs text-gray-400">
              {mode === "login" 
                ? "Private access strictly restricted to the portfolio owner." 
                : "Reset your password with an instant One-Time Password (OTP) or Master PIN."}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border bg-cyan-950/40 border-cyan-500/30 text-cyan-300">
              <Database className="w-3 h-3" />
              <span>Owner Vault Protected</span>
            </span>
          </div>

          {/* Success Notice */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>{successMsg}</span>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === "login" ? (
            /* Standard Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-gray-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:underline"
                  >
                    Forgot Password / Get OTP?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Forgot Password / OTP Recovery Form */
            <div className="space-y-4">
              
              {/* Step 1: Generate OTP Box */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Step 1: Get Instant OTP
                  </span>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={requestingOtp}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1"
                  >
                    {requestingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    <span>{generatedOtp ? "Generate New OTP" : "Click to Get OTP"}</span>
                  </button>
                </div>

                {generatedOtp ? (
                  <div className="p-3 rounded-xl bg-gray-950 border border-cyan-500/40 text-center space-y-1">
                    <div className="text-[11px] font-mono text-gray-400 uppercase">Your Security OTP Code</div>
                    <div className="text-2xl font-mono font-extrabold text-cyan-300 tracking-widest">{generatedOtp}</div>
                    <div className="text-[10px] text-gray-500">Valid for 15 minutes. Automatically filled below.</div>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Click the button above to generate a 6-digit OTP code, or enter your Master Recovery PIN (<span className="text-cyan-300 font-mono">7097</span>).
                  </p>
                )}
              </div>

              {/* Step 2: Reset Form */}
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    6-Digit OTP or Recovery PIN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP or PIN"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset & Save Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    &larr; Back to Admin Sign In
                  </button>
                </div>
              </form>

            </div>
          )}

          <div className="pt-2 border-t border-white/5 text-center">
            <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
              Authorized access only. Strictly protected for site owner.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
