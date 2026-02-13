"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        if (response.success) {
          if (response.data?.role === "admin") {
            return router.replace("/admin/users");
          }
          if (response.data?.role === "user") {
            return router.replace("/user/profile");
          }
          return router.replace("/home");
        } else {
          setError("Login failed");
        }
      } catch (err: any) {
        setError(err.message || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8 shadow-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Stockex</h1>
          <p className="mt-1 text-sm text-gray-400">Log in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email?.message && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
              {...register("password")}
              placeholder="••••••"
            />
            {errors.password?.message && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/request-reset-password"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-11 w-full rounded-lg bg-green-500 text-black
                       font-semibold text-sm hover:bg-green-600
                       transition disabled:opacity-60"
          >
            {isSubmitting || pending ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}