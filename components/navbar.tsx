"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="bg-[#e9dfc1] py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-[#1a3329] font-serif italic text-2xl tracking-tight">
              sub<span className="text-[#264135]">*</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-[#1a3329] hover:text-[#0e1c15] transition-colors font-medium"
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-[#1a3329] hover:text-[#0e1c15] transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[#1a3329] hidden md:inline">
                {session?.user?.email}
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="text-[#1a3329] border-[#1a3329] hover:bg-[#1a3329] hover:text-white"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button className="bg-[#1a3329] hover:bg-[#0e1c15] text-[#f0e9d8]">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}