"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  RiHome5Line,
  RiHome5Fill,
  RiGridLine,
  RiGridFill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiInformationLine,
  RiInformationFill,
} from "react-icons/ri";

const NAV_ITEMS = [
  { name: "Home", href: "/", IconOutline: RiHome5Line, IconFill: RiHome5Fill },
  { name: "Collections", href: "/collections", IconOutline: RiGridLine, IconFill: RiGridFill },
  { name: "Saved", href: "/saved", IconOutline: RiBookmarkLine, IconFill: RiBookmarkFill },
  { name: "About", href: "/about", IconOutline: RiInformationLine, IconFill: RiInformationFill },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop top nav ─────────────────────────────────────────── */}
      <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/outsy_logo.svg"
              alt="Outsy"
              width={94}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {isActive ? (
                    <item.IconFill className="h-4 w-4" />
                  ) : (
                    <item.IconOutline className="h-4 w-4" />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile floating bottom nav ──────────────────────────────── */}
      <div className="md:hidden fixed bottom-5 left-0 right-0 z-50 flex justify-center px-6">
        <nav className="flex items-center gap-1 bg-background border border-border rounded-full shadow-xl px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive ? (
                  <item.IconFill className="h-5 w-5" />
                ) : (
                  <item.IconOutline className="h-5 w-5" />
                )}
                <span className="text-[9px] font-semibold leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
