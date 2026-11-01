"use client";

import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { refreshToken } from "@/lib/api";
import { signIn } from "@/lib/auth-client";
import ConfirmInfoModal from "./InfoModal";
import GoogleButton from "./GoogleButton";

const DEMO = [
  { label: "Demo creator", email: "creator@studiospace.demo", password: "Reel-Creator-4827" },
  { label: "Demo host", email: "host@studiospace.demo", password: "Reel-Host-6193" },
];

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await signIn.email({ email, password });
    if (signInError) {
      const message = signInError.status === 401 ? "That email or password is not correct." : signInError.message ?? "Login failed. Please try again.";
      setError(message);
      toast.error(message);
      setBusy(false);
      return;
    }
    await refreshToken();
    toast.success("Welcome back.");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="page-shell grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-200 p-6 sm:p-8">
        <p className="eyebrow">Welcome back</p>
        <h1 className="section-title">Login</h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input w-full" />
          </label>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-primary underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <input id="password" type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="input w-full pr-11" />
              <button type="button" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 z-10 -translate-y-1/2 p-2 text-base-content/70">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="flex items-start gap-2 text-sm text-error"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-xs" />} Login</button>
        </form>

        <div className="divider text-xs text-base-content/60">OR</div>
        <GoogleButton callbackURL={redirectTo} />

        <div className="mt-5 rounded-field border border-dashed border-base-300 p-3">
          <p className="text-xs text-base-content/70">Reviewing the project? Fill in a demo account:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO.map((account) => (
              <button key={account.email} type="button" onClick={() => { setEmail(account.email); setPassword(account.password); setError(""); }} className="btn btn-outline btn-xs">{account.label}</button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-sm">New to StudioSpace? <Link href="/register" className="font-medium text-primary underline">Register</Link></p>
      </div>

      <ConfirmInfoModal open={forgotOpen} title="Password reset is turned off" onClose={() => setForgotOpen(false)}>
        This project keeps password reset turned off so it stays simple to review. Please use a demo account or register a new one.
      </ConfirmInfoModal>
    </div>
  );
}
