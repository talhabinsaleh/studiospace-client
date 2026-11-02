"use client";

import { BookMarked, Building2, LayoutDashboard, LogOut, Menu, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import AuthLink from "./AuthLink";
import Avatar from "./Avatar";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

const USER_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: BookMarked },
];

const PRIVATE_PAGES = ["/dashboard", "/add-studio", "/my-listings", "/my-bookings", "/wishlist", "/studios/edit"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session?.user;
  const isPrivatePage = PRIVATE_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function logout() {
    setMenuOpen(false);
    setMobileOpen(false);
    await Promise.all([signOut(), fetch("/api/session-token", { method: "DELETE" })]);
    toast.success("You have logged out.");
    // Public pages stay open after logout. Private pages need a login, so those go home.
    if (isPrivatePage) router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="page-shell flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative block px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {isPending ? (
            <span className="skeleton size-9 rounded-full" aria-label="Loading account" />
          ) : user ? (
            <div
              ref={menuRef}
              className="relative"
              onPointerEnter={(event) => event.pointerType === "mouse" && setMenuOpen(true)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setMenuOpen(false)}
            >
              <button type="button" onPointerUp={(event) => event.pointerType !== "mouse" && setMenuOpen((open) => !open)} onClick={(event) => event.detail === 0 && setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Open account menu" className="block rounded-full ring-2 ring-transparent transition hover:ring-primary">
                <Avatar name={user.name} src={user.image} className="size-9 text-xs" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full w-64 pt-2">
                  <div className="rounded-box border border-base-300 bg-base-200 p-2 shadow-xl">
                    <div className="border-b border-base-300 px-3 pb-3 pt-2">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-base-content/65">{user.email}</p>
                    </div>
                    <ul className="mt-1">
                      {USER_LINKS.map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                          <Link href={href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-field px-3 py-2 text-sm hover:bg-base-300 ${isActive(href) ? "text-primary" : ""}`}>
                            <Icon className="size-4" /> {label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-sm text-error hover:bg-base-300">
                          <LogOut className="size-4" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <AuthLink href="/login" className="btn btn-ghost btn-sm">Login</AuthLink>
              <AuthLink href="/register" className="btn btn-primary btn-sm">Register</AuthLink>
            </div>
          )}
          <button type="button" className="btn btn-ghost btn-square btn-sm lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <ul className="page-shell py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMobileOpen(false)} className={`block rounded-field px-3 py-2.5 font-medium ${isActive(link.href) ? "bg-base-200 text-primary" : ""}`}>
                  {link.label}
                </Link>
              </li>
            ))}
            {!user && !isPending && (
              <li className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                <AuthLink href="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-sm">Login</AuthLink>
                <AuthLink href="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm">Register</AuthLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
