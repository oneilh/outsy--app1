"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  RiHome5Line, 
  RiHome5Fill,
  RiGridLine,
  RiGridFill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiInformationLine,
  RiInformationFill
} from "react-icons/ri";

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/",
    IconOutline: RiHome5Line,
    IconFill: RiHome5Fill,
  },
  {
    name: "Collections",
    href: "/collections",
    IconOutline: RiGridLine,
    IconFill: RiGridFill,
  },
  {
    name: "Saved",
    href: "/saved",
    IconOutline: RiBookmarkLine,
    IconFill: RiBookmarkFill,
  },
  {
    name: "About",
    href: "/about",
    IconOutline: RiInformationLine,
    IconFill: RiInformationFill,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-primary mr-6">
              Outsy
            </Link>
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {isActive ? <item.IconFill className="h-5 w-5" /> : <item.IconOutline className="h-5 w-5" />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background pb-safe pt-2 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center w-16 gap-1"
              >
                <div
                  className={`flex items-center justify-center h-8 w-16 rounded-full transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive ? (
                    <item.IconFill className="h-6 w-6" />
                  ) : (
                    <item.IconOutline className="h-6 w-6" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
