"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { label: "Tasks", href: "/dashboard" },
  { label: "Clients", href: "/clients" },
  { label: "Bot Down", href: "/bot-down" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-violet-900 via-purple-800 to-violet-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="AgentBase Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              AgentBase
            </span>
          </div>

          {/* Center: Nav tabs */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/20 text-white shadow-inner"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-semibold uppercase">
                  {session?.user?.email?.charAt(0) ?? "U"}
                </span>
              </div>
              <span className="text-white/90 text-sm font-medium hidden sm:block">
                {session?.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-1.5 text-sm text-white/80 border border-white/20 rounded-lg hover:bg-white/10 hover:text-white transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
