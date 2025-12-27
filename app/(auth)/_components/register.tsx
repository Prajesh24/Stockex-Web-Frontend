"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "./schema";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // router.push("/login");
    });

    console.log("register", values);
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
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

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
          <div className="space-y-1 relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[35px] text-sm text-gray-400 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password?.message && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 relative">
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[35px] text-sm text-gray-400 hover:text-white"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword?.message && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

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
