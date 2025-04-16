"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e9dfc1]">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-tight text-[#1a3329]">
          <span className="text-[#1a3329] font-serif italic text-4xl md:text-3xl tracking-tight">
                sub<span className="text-[#264135]">*</span>
              </span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your subscriptions and save money
          </p>
        </div>

        <div className="mt-8 space-y-6 flex justify-center">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="max-w-xs px-6 flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>Sign in with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 