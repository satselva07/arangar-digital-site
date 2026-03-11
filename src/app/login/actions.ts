"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { issueAdminEmailOtp, isAdmin2faRequired } from "@/lib/admin-2fa";
import { canSendEmail } from "@/lib/mailer";

export async function authenticate(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      otp: formData.get("otp"),
      redirectTo: "/admin",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid username or password." };
      }
      return { error: "Unable to sign in right now." };
    }

    throw error;
  }
}

export async function sendOtp(
  _prevState: { sent?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ sent?: boolean; error?: string }> {
  if (!isAdmin2faRequired()) {
    return { sent: false, error: "2FA is not required in current environment." };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const adminUser = process.env.ADMIN_USERNAME ?? "";
  const adminPass = process.env.ADMIN_PASSWORD ?? "";

  if (!username || !password || username !== adminUser || password !== adminPass) {
    return { sent: false, error: "Enter valid admin username and password first." };
  }

  if (!canSendEmail()) {
    return {
      sent: false,
      error: "Email OTP is not configured. Use authenticator code in OTP field and click Sign in.",
    };
  }

  try {
    await issueAdminEmailOtp();
    return { sent: true };
  } catch (error) {
    console.error("Unable to send admin OTP", error);
    return { sent: false, error: "Unable to send OTP right now." };
  }
}
