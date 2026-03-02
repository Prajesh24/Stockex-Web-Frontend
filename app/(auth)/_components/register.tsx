"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: { role: "user" },
  });

  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: RegisterData) => {
    setError(null);
    setTransition(async () => {
      try {
        const response = await handleRegister(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        router.push("/login");
      } catch (err: Error | any) {
        setError(err.message || "Registration failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8 shadow-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Stockex</h1>
          <p className="mt-1 text-sm text-gray-400">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Your Fullname"
              {...register("name")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            {errors.name?.message && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            {errors.email?.message && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            {errors.password?.message && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            {errors.confirmPassword?.message && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Account Type</label>
            <div className="grid grid-cols-2 gap-3">

              {/* User */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  {...register("role")}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-2 h-11 rounded-lg border
                                border-white/10 bg-black/40 text-sm text-gray-400
                                peer-checked:border-green-500 peer-checked:text-green-400
                                peer-checked:bg-green-500/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User
                </div>
              </label>

              {/* Admin */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="admin"
                  {...register("role")}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-2 h-11 rounded-lg border
                                border-white/10 bg-black/40 text-sm text-gray-400
                                peer-checked:border-yellow-500 peer-checked:text-yellow-400
                                peer-checked:bg-yellow-500/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                         11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29
                         9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </div>
              </label>

            </div>
            {errors.role?.message && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Global error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-11 w-full rounded-lg bg-green-500 text-black
                       font-semibold text-sm hover:bg-green-600
                       transition disabled:opacity-60"
          >
            {isSubmitting || pending ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
