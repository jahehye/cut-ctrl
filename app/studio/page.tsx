import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageHero, SectionHead } from "@/components/ui";
import { formatStudioAddress, siteConfig } from "@/config/site";
import { groupedHours } from "@/lib/hours";
import { photos } from "@/data/site";

export const metadata: Metadata = { title: "Studio", description: "Visit CUT/CTRL at 65 Redchurch Street, Shoreditch. Hours, directions and studio information." };

const faqs = [
  ["Do I need an appointment?", "Booking is the safest route. Walk-ins are welcome when a barber is free."],
  ["Can I bring a reference?", "Yes. Save it in the lookbook or bring your own. We will adapt it to your hair."],
  ["What if I am late?", "Call us. After 10 minutes we may need to shorten or move the appointment."],
  ["What payments do you take?", "Card, contactless, Apple Pay and cash."],
  ["Is the studio accessible?", "Step-free entrance, wide chair spacing and an accessible ground-floor restroom."],
];

export default function Studio() {
  return <>
    <PageHero number="04" title="Studio / E2" copy="A working room in Shoreditch. Built for focused cuts, good music and no rush." />
    <section className="grid border-b border-black lg:grid-cols-2">
      <div className="relative min-h-[70vh] border-b border-black lg:border-r lg:border-b-0"><Image src={photos[7]} fill alt="CUT/CTRL studio interior" className="object-cover grayscale" sizes="(max-width:1024px) 100vw,50vw" /></div>
      <div className="p-5 md:p-10">
        <span className="meta blue">{formatStudioAddress()}</span><h2 className="display mt-5 text-6xl md:text-8xl">Come through.</h2>
        <div className="mt-10 grid gap-px border border-black bg-black sm:grid-cols-2">
          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="bg-[var(--paper)] p-4 hover:bg-white"><MapPin aria-hidden="true" /><p className="meta mt-5">Directions</p><p>Open in Google Maps</p></a>
          <a href={`tel:${siteConfig.phone.href}`} className="bg-[var(--paper)] p-4 hover:bg-white"><Phone aria-hidden="true" /><p className="meta mt-5">Phone</p><p>{siteConfig.phone.display}</p></a>
          <a href={`mailto:${siteConfig.email}`} className="bg-[var(--paper)] p-4 hover:bg-white sm:col-span-2"><Mail aria-hidden="true" /><p className="meta mt-5">Email</p><p>{siteConfig.email}</p></a>
        </div>
        <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="group mt-5 flex items-center justify-between bg-[var(--blue)] p-5 font-bold uppercase text-white">Get directions<ArrowUpRight className="arrow" aria-hidden="true" /></a>
      </div>
    </section>
    <section className="section">
      <SectionHead number="01" title="Before you arrive" aside="The useful details, without the small print." />
      <div className="grid gap-px border border-black bg-black md:grid-cols-3">
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Hours</h3><div className="mt-5">{groupedHours().map((group) => <p key={group.label}>{group.label} / {group.value}</p>)}</div></div>
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Parking / transport</h3><p className="mt-5">Paid bays on Chance Street. Bike rail outside. Overground and buses nearby.</p></div>
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Studio standard</h3><p className="mt-5">Tools disinfected after every cut. Fresh capes. Single-use neck strips. Clean chair between clients.</p></div>
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Landmarks</h3><p className="mt-5">Two doors east of Brick Lane Books, opposite the blue mural.</p></div>
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Walk-ins</h3><p className="mt-5">Welcome when available. Fridays and Saturdays usually fill by midday.</p></div>
        <div className="bg-[var(--paper)] p-5"><h3 className="display text-3xl">Payments</h3><p className="mt-5">Visa, Mastercard, Amex, cash, Apple Pay and Google Pay.</p></div>
      </div>
    </section>
    <section className="section grid border-t border-black lg:grid-cols-2">
      <div><SectionHead number="02" title="Ask the studio" /><ContactForm /></div>
      <div className="mt-12 lg:mt-0 lg:border-l lg:border-black lg:pl-10"><h2 className="display text-5xl">Quick answers</h2>{faqs.map(([question, answer]) => <details key={question} className="border-b border-black py-5"><summary className="cursor-pointer font-bold uppercase">{question}</summary><p className="mt-3 max-w-xl">{answer}</p></details>)}</div>
    </section>
  </>;
}
