"use client";

import { AlertCircle, Check, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { signOut, signUp } from "@/lib/auth-client";
import { passwordProblem } from "@/lib/validation";
import GoogleButton from "./GoogleButton";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rules = [
    { label: "An uppercase letter", met: /[A-Z]/.test(password) },
    { label: "A lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least 6 characters", met: password.length >= 6 },
  ];

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const problem = passwordProblem(password);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    const { error: signUpError } = await signUp.email({ name: name.trim(), email, password, image: photo.trim() || undefined });
    if (signUpError) {
      const message = signUpError.status === 422 ? "An account with this email already exists." : signUpError.message ?? "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
      setBusy(false);
      return;
    }
    // Sign up starts a session, but the assignment sends new users to the login page
    await signOut();
    toast.success("Account created. Please log in.");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="page-shell grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-200 p-6 sm:p-8">
        <p className="eyebrow">Join the crew</p>
        <h1 className="section-title">Register</h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="input w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Photo URL</span>
            <input type="url" value={photo} onChange={(event) => setPhoto(event.target.value)} placeholder="https://..." className="input w-full" />
          </label>
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input id="new-password" type={show ? "text" : "password"} required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="input w-full pr-11" />
              <button type="button" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 z-10 -translate-y-1/2 p-2 text-base-content/70">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              {rules.map((rule) => (
                <li key={rule.label} className={`flex items-center gap-1.5 ${rule.met ? "text-success" : "text-base-content/65"}`}>
                  {rule.met ? <Check className="size-3.5" /> : <X className="size-3.5" />} {rule.label}
                </li>
              ))}
            </ul>
          </div>
          {error && <p role="alert" className="flex items-start gap-2 text-sm text-error"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-xs" />} Register</button>
        </form>

        <div className="divider text-xs text-base-content/60">OR</div>
        <GoogleButton callbackURL="/" />

        <p className="mt-5 text-center text-sm">Already have an account? <Link href="/login" className="font-medium text-primary underline">Login</Link></p>
      </div>
    </div>
  );
}
