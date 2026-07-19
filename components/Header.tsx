"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import OpenStatus from "@/components/OpenStatus";

const links = [
  ["Cuts", "/cuts"],
  ["Crew", "/crew"],
  ["Lookbook", "/lookbook"],
  ["Studio", "/studio"],
] as const;

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function closeMenu({ restoreFocus = false } = {}) {
    setOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  const panelVariants = reduceMotion
    ? undefined
    : {
        closed: { opacity: 0, y: -12 },
        open: { opacity: 1, y: 0, transition: { duration: 0.16, staggerChildren: 0.035 } },
        exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
      };
  const linkVariants = reduceMotion
    ? undefined
    : {
        closed: { opacity: 0, x: -12 },
        open: { opacity: 1, x: 0, transition: { duration: 0.14 } },
      };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-black bg-[var(--paper)] transition-[padding] ${scrolled ? "py-0" : "md:py-2"}`}
      >
        <div className="grid h-16 grid-cols-[1fr_auto] md:grid-cols-[200px_1fr_auto_auto]">
          <Link
            href="/"
            className="display flex items-center border-r border-black px-4 text-3xl"
            onClick={() => closeMenu()}
          >
            CUT<span className="blue">/</span>CTRL
          </Link>
          <nav className="hidden items-stretch md:flex" aria-label="Primary">
            {links.map(([label, href], index) => (
              <Link
                key={href}
                href={href}
                aria-current={isActiveRoute(pathname, href) ? "page" : undefined}
                className={`group relative flex min-w-28 items-center border-r border-black px-4 text-sm font-bold uppercase ${isActiveRoute(pathname, href) ? "bg-black text-white" : ""}`}
              >
                <small className="blue mr-2">0{index + 1}</small>
                {label}
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--blue)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 border-r border-black px-4 lg:flex">
            <OpenStatus className="meta" />
            <MapPin className="size-4" aria-hidden="true" />
          </div>
          <Link
            href="/book"
            aria-current={isActiveRoute(pathname, "/book") ? "page" : undefined}
            className="group hidden min-w-48 items-center justify-between bg-[var(--blue)] px-5 font-bold uppercase text-white md:flex"
          >
            Book an appointment
            <ArrowUpRight className="arrow" aria-hidden="true" />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            className="flex size-16 items-center justify-center md:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 top-16 z-40 flex flex-col bg-black p-4 text-white md:hidden"
            initial={reduceMotion ? false : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
            variants={panelVariants}
          >
            <motion.nav className="mt-8" aria-label="Mobile">
              {links.map(([label, href], index) => (
                <motion.div key={href} variants={linkVariants}>
                  <Link
                    href={href}
                    aria-current={isActiveRoute(pathname, href) ? "page" : undefined}
                    onClick={() => closeMenu()}
                    className="display flex items-center justify-between border-b border-white/30 py-5 text-5xl"
                  >
                    <span>
                      <small className="mr-4 text-base text-[var(--blue)]">0{index + 1}</small>
                      {label}
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <motion.div variants={linkVariants} className="mt-auto">
              <Link
                href="/book"
                onClick={() => closeMenu()}
                className="flex items-center justify-between bg-[var(--blue)] p-5 text-xl font-bold uppercase"
              >
                Book an appointment
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
