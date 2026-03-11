import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,theme(colors.amber.100),theme(colors.orange.50)_40%,theme(colors.emerald.50)_100%)] px-4">
      <section className="w-full max-w-md rounded-2xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-orange-950">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-600">Sign in to access bookings, enquiries, and chatbot FAQ management.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
