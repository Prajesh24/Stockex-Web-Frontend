"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { z } from "zod";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast } from "react-toastify";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    setError(null);
    setSuccess(false);
    setSubmittedEmail(data.email);

    startTransition(async () => {
      try {
        const response = await requestPasswordReset(data.email);

        if (response.success) {
          setSuccess(true);
          reset(); // clear the input field
          toast.success("Reset link sent! Check your email (including spam)", {
            position: "top-center",
            autoClose: 6000,
          });
        } else {
          throw new Error(response.message || "Something went wrong");
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Failed to send reset link";

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
            <p className="mt-1 text-sm text-gray-400">Reset your password</p>
          </div>

          <div className="rounded-md bg-green-500/10 p-5 text-center border border-green-500/30 mb-6">
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              Reset link sent!
            </h2>
            <p className="text-sm text-gray-300">
              We sent instructions to <strong>{submittedEmail}</strong>
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Check your inbox (and spam/junk folder).
            </p>
          </div>

          <div className="text-center text-sm space-y-3">
            <Link
              href="/login"
              className="text-green-400 font-medium hover:underline block"
            >
              Back to login
            </Link>

            <p className="text-gray-500">
              Want to try again?{" "}
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="text-green-400 hover:underline"
              >
                Send new link
              </button>
            </p>
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
            Reset your password
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
            <label className="text-sm text-gray-300">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              disabled={pending || isSubmitting}
              className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                         border border-white/10 focus:border-green-500
                         focus:ring-1 focus:ring-green-500 outline-none
                         placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email?.message && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
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
            {isSubmitting || pending ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm space-y-2">
          <Link
            href="/login"
            className="text-green-400 font-medium hover:underline block"
          >
            Back to login
          </Link>

          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}