"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleResetPassword } from "@/lib/actions/auth-action";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordDTO) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const response = await handleResetPassword(token, data.password);

        if (response.success) {
          setSuccess(true);
          reset();
          toast.success("Password reset successfully! Redirecting to login...", {
            position: "top-center",
            autoClose: 4000,
          });

          // Optional: delay redirect slightly so user sees success message
          setTimeout(() => {
            router.replace("/login");
          }, 1800);
        } else {
          throw new Error(response.message || "Failed to reset password");
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred";

        setError(message);
        toast.error(message, { position: "top-center" });
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white">Stockex</h1>
            <p className="mt-1 text-sm text-gray-400">Password reset</p>
          </div>

          <div className="rounded-md bg-green-500/10 p-5 text-center border border-green-500/30 mb-6">
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              Password updated successfully!
            </h2>
            <p className="text-sm text-gray-300">
              You can now log in with your new password.
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Redirecting to login page...
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-green-400 font-medium hover:underline"
            >
              Go to login now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8 shadow-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Stockex</h1>
          <p className="mt-1 text-sm text-gray-400">
            Set your new password
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="space-y-1">
            <label className="text-sm text-gray-300">New Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={pending || isSubmitting}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none
                         placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={pending || isSubmitting}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none
                         placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("confirmPassword")}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-11 w-full rounded-lg bg-green-500 text-black
                       font-semibold text-sm hover:bg-green-600
                       transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting || pending ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm space-y-3">
          <Link
            href="/login"
            className="text-green-400 font-medium hover:underline block"
          >
            Back to login
          </Link>

          <Link
            href="/request-password-reset"
            className="text-green-400 font-medium hover:underline block"
          >
            Request another reset email
          </Link>
        </div>
      </div>
    </div>
  );
}