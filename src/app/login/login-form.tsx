"use client";

import { useActionState } from "react";
import { authenticate, sendOtp } from "@/app/login/actions";

const initialState = { error: undefined as string | undefined };
const otpInitialState = { sent: false, error: undefined as string | undefined };

export function LoginForm() {
  const [state, action, pending] = useActionState(authenticate, initialState);
  const [otpState, otpAction, otpPending] = useActionState(sendOtp, otpInitialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-zinc-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-orange-200 transition focus:ring-2"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-orange-200 transition focus:ring-2"
          autoComplete="current-password"
        />
      </div>

      <div>
        <label htmlFor="otp" className="mb-1 block text-sm font-medium text-zinc-700">
          OTP / Authenticator Code
        </label>
        <input
          id="otp"
          name="otp"
          inputMode="numeric"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-orange-200 transition focus:ring-2"
          placeholder="Enter 6-digit code"
          autoComplete="one-time-code"
        />
        <p className="mt-1 text-xs text-zinc-500">Use authenticator app code, or click Send OTP to receive email code.</p>
      </div>

      <button
        type="submit"
        formAction={otpAction}
        disabled={otpPending}
        className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-70"
      >
        {otpPending ? "Sending OTP..." : "Send OTP to Admin Email"}
      </button>
      <p className="-mt-2 text-xs text-zinc-500">If you already use Google Authenticator/Authy, skip this button and click Sign in directly.</p>

      {otpState?.sent ? <p className="text-sm text-emerald-700">OTP sent. Check admin email and enter code above.</p> : null}
      {otpState?.error ? <p className="text-sm text-red-600">{otpState.error}</p> : null}

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
