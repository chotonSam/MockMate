"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Shown at the top of every logged-in page until the email is verified.
// Two ways to verify: type the 6-digit code from the email here, or click the link in the email.
export default function VerifyEmailBanner({ email, required }) {
  const router = useRouter();
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");
  const [dev, setDev] = useState({ code: "", link: "" });
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [done, setDone] = useState(false);
  const lastRefresh = useRef(0);

  // After verifying with the link in another tab, coming back here makes the banner disappear
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible" && Date.now() - lastRefresh.current > 5000) {
        lastRefresh.current = Date.now();
        router.refresh();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [router]);

  async function resend() {
    setState("sending");
    setMessage("");
    setCodeError("");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not send the email.");
      if (data.already) {
        router.refresh();
        return;
      }
      if (data.devCode) {
        setDev({ code: data.devCode, link: data.devLink ?? "" }); // development only: no mail server configured yet
        setMessage("Email sending isn't set up yet (development mode), so here is your code:");
      } else {
        setMessage(`Sent! Check ${email} (and your spam folder).`);
      }
      setCode("");
      setState("sent");
    } catch (err) {
      setMessage(err.message);
      setState("error");
    }
  }

  async function submitCode(e) {
    e.preventDefault();
    setCodeError("");
    setChecking(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not verify the code.");
      setDone(true);
      router.refresh(); // the banner is removed once the server says you're verified
    } catch (err) {
      setCodeError(err.message);
    } finally {
      setChecking(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 sm:px-6 lg:px-10">
        ✓ Email verified. Thank you!
      </div>
    );
  }

  return (
    <div role="status" className="border-b border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-slate-800 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="min-w-0 flex-1 basis-64 leading-relaxed">
          <span className="font-semibold text-amber-900">Verify your email.</span>{" "}
          <span className="text-slate-700">
            {required ? "You need it to post, comment and share resources." : "Please confirm your email address."} We sent a code and a link to <span className="break-all font-semibold text-slate-900">{email}</span>.
          </span>
        </p>
        <button type="button" onClick={resend} disabled={state === "sending"}
          className="focus-ring shrink-0 rounded-full border border-amber-300 bg-white px-4 py-1.5 font-medium text-amber-800 shadow-sm transition-colors hover:bg-amber-100/60 disabled:opacity-60">
          {state === "sending" ? "Sending…" : state === "sent" ? "Send again" : "Resend email"}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-xs font-medium ${state === "error" ? "text-rose-600" : "text-slate-600"}`}>
          {message}{" "}
          {dev.code && <span className="rounded bg-slate-900 px-2.5 py-0.5 font-mono text-sm tracking-[0.3em] text-white shadow-sm">{dev.code}</span>}
        </p>
      )}

      <form onSubmit={submitCode} className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor="verify-code" className="text-xs font-medium text-slate-600">Enter the 6-digit code:</label>
        <input
          id="verify-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          className="focus-ring w-32 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-center font-mono text-base tracking-[0.3em] text-slate-900 shadow-sm placeholder:tracking-normal placeholder:text-slate-400"
        />
        <button type="submit" disabled={code.length !== 6 || checking}
          className="btn-primary px-5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50">
          {checking ? "Checking…" : "Verify"}
        </button>
      </form>
      {codeError && <p role="alert" className="mt-2 text-xs font-medium text-rose-600">{codeError}</p>}
    </div>
  );
}
