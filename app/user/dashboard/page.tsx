// app/dashboard/page.tsx
"use client";

import { dummyMarketSummary } from "@/app/data/dummy-nepse";

export default function DashboardPage() {
  const { nepse } = dummyMarketSummary;
  const isPositive = nepse.isPositive;

  return (
    <div className="min-h-screen bg-[#f6f7f3] px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* NEPSE – Left */}
        <div className="bg-[#fbf8f3] rounded-3xl p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">NEPSE</h3>
          <div className="flex items-end gap-3">
            <h1 className="text-4xl font-bold text-gray-900">
              {nepse.value.toFixed(2)}
            </h1>
            <span className="px-2 py-1 rounded-full text-xs bg-white border">
              {nepse.pointChange.toFixed(2)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isPositive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {nepse.percentChange.toFixed(2)}%
            </span>
          </div>

          <div className="mt-6 h-40 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 text-sm">
            NEPSE chart
          </div>

          <p className="mt-4 text-sm text-gray-500">
            The market is in <span className="text-red-500 font-medium">Fear Zone</span>
          </p>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          {/* CTA */}
          <div className="bg-yellow-300 rounded-3xl p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                Start tracking your investments
              </h3>
              <button className="mt-4 px-4 py-2 rounded-full bg-black text-white text-sm">
                Create Portfolio
              </button>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>

          {/* Watchlist */}
          <div className="bg-[#ecece6] rounded-3xl p-6">
            <h3 className="font-semibold mb-2">Create your watchlist</h3>
            <p className="text-sm text-gray-600 mb-3">
              Some suggestions for you
            </p>
            <div className="flex flex-wrap gap-2">
              {["MBJC", "RHPL", "KKHC", "SAIL", "SJCL"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full border bg-white text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {s} +
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Trending */}
          <div className="bg-white rounded-3xl p-6">
            <h3 className="font-semibold mb-3">Trending</h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {["MLBLPO", "TPC", "KKHC", "RIDI", "HURJA", "AKJCL"].map((s) => (
                <span key={s} className="hover:underline cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-3xl p-6 text-center">
            <h3 className="font-semibold mb-3">Today’s Events</h3>
            <div className="h-24 flex items-center justify-center text-gray-400">
              No events for today
            </div>
            <button className="mt-4 px-4 py-2 border rounded-full text-sm hover:bg-gray-100">
              Go to Recent Announcements
            </button>
          </div>
        </div>

        {/* Bottom – Full Width */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 mt-2">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <h3 className="font-semibold">View Market Summary</h3>
            <p className="text-sm text-gray-500">
              At Close, {dummyMarketSummary.date}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "Close to 52W High",
              "Close to 52W Low",
              "New 52W High",
              "New 52W Low",
              "Up Trending",
              "Down Trending",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
