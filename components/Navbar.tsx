"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BouncyButton from "@/components/BouncyButton";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/maps", label: "Maps" },
  { href: "/methodology", label: "Methodology" },
  { href: "/remote-sensing", label: "Remote Sensing" },
  { href: "/fieldwork", label: "Fieldwork" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Navbar — persistent, sticky top navigation in the Bouncy Cartoon Brutalist
 * theme: cream background, a thick black bottom border, chunky links with a
 * playful lift-and-recolor hover, and an active-route highlight.
 *
 * Responsive: on md+ the full link row shows inline; below md the links are
 * hidden behind a chunky "Menu" BouncyButton that toggles a dropdown panel.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[1000] border-b-4 border-ink bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-x-6 px-6 py-4">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 font-heading text-2xl font-bold text-ink transition-transform ease-bouncy duration-bouncy hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Project Arroyo logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border-2 border-ink object-cover"
          />
          <span className="-rotate-1">Arroyo Seco</span>
        </Link>

        {/* Desktop links — inline from md up. */}
        <ul className="hidden flex-wrap items-center gap-x-5 gap-y-1 md:flex">
          {LINKS.map(({ href, label }) => {
            const isActive = isActiveRoute(pathname, href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-block font-heading text-lg font-bold",
                    "transition-transform ease-bouncy duration-bouncy",
                    "hover:-translate-y-1 hover:text-[#34D399]",
                    isActive
                      ? "text-[#34D399] underline decoration-4 underline-offset-4"
                      : "text-ink",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu toggle — hidden from md up. */}
        <BouncyButton
          type="button"
          className="px-4 py-2 text-base md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu <span aria-hidden="true">{open ? "▴" : "▾"}</span>
        </BouncyButton>
      </nav>

      {/* Mobile dropdown panel. */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t-4 border-ink bg-paper md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {LINKS.map(({ href, label }) => {
              const isActive = isActiveRoute(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-xl px-3 py-2 font-heading text-lg font-bold",
                      "transition-transform ease-bouncy duration-bouncy hover:translate-x-1",
                      isActive
                        ? "bg-white text-[#34D399] underline decoration-4 underline-offset-4"
                        : "text-ink hover:text-[#34D399]",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
