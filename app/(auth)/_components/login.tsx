"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { LoginData,loginSchema } from "./schema";

export default function LoginForm() {
  const router = useRouter();
    const [error,setError] = useState()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, setTransition] = useTransition();

const onSubmit = async (data: LoginData) => {
    try{
      const response = await handleLogin(data);
      if(!response.success){
        throw new Error(response.message || "Login failed")
      }
      startTransition(() => router.push("/dashboard"))
    }catch(err: any){
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8 shadow-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white-500">Stockex</h1>
          <p className="mt-1 text-sm text-gray-400">
            Sign in to your trading account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="
                h-11 w-full rounded-lg
                bg-black/40 px-4 text-sm text-white
                border border-white/10
                focus:border-green-500 focus:ring-1 focus:ring-green-500
                outline-none transition
              "
            />
            {errors.email?.message && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="
                h-11 w-full rounded-lg
                bg-black/40 px-4 text-sm text-white
                border border-white/10
                focus:border-green-500 focus:ring-1 focus:ring-green-500
                outline-none transition
              "
            />
            {errors.password?.message && (
              <p className="text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-green-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="
              h-11 w-full rounded-lg
              bg-green-500 text-black font-semibold text-sm
              hover:bg-green-600 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isSubmitting || pending ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-green-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
