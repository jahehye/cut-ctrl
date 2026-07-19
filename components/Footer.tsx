import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatStudioAddress, siteConfig } from "@/config/site";
import { groupedHours } from "@/lib/hours";

const navigation = ["Cuts", "Crew", "Lookbook", "Studio", "Book"];

export function Footer() {
  return (
    <footer className="border-t border-black">
      <div className="grid md:grid-cols-4">
        <div className="border-b border-black p-6 md:border-r md:border-b-0">
          <div className="display text-5xl">
            CUT<span className="blue">/</span>CTRL
          </div>
          <p className="mt-10 max-w-52">Precision cuts, direct advice, no over-selling.</p>
        </div>
        <div className="border-b border-black p-6 md:border-r md:border-b-0">
          <p className="meta mb-6">Navigate</p>
          {navigation.map((label) => (
            <Link
              className="block py-1 font-bold uppercase hover:text-[var(--blue)]"
              key={label}
              href={`/${label.toLowerCase()}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="border-b border-black p-6 md:border-r md:border-b-0">
          <p className="meta mb-6">Find us</p>
          <a className="hover:text-[var(--blue)]" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
            {formatStudioAddress()}
          </a>
          <div className="mt-6">
            {groupedHours().map((group) => (
              <p key={group.label}>
                {group.label} {group.value}
              </p>
            ))}
          </div>
          <a className="mt-5 block hover:text-[var(--blue)]" href={`tel:${siteConfig.phone.href}`}>
            {siteConfig.phone.display}
          </a>
          <a className="hover:text-[var(--blue)]" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <div className="p-6">
          <p className="meta mb-6">Start here</p>
          <Link
            href="/book"
            className="group flex min-h-24 items-end justify-between bg-[var(--blue)] p-4 text-2xl font-bold uppercase text-white"
          >
            Book an appointment
            <ArrowUpRight className="arrow" aria-hidden="true" />
          </Link>
          <p className="meta mt-5">Social links coming soon</p>
          <p>{siteConfig.socialPlaceholders.join(" / ")} — placeholders</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4 border-t border-black px-6 py-4">
        <span className="meta">© {new Date().getFullYear()} CUT/CTRL</span>
        <span className="meta">Independent barbershop / London E2</span>
      </div>
    </footer>
  );
}
