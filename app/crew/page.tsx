"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { PageHero } from "@/components/ui";
import { barbers, looks } from "@/data/site";

const filters = ["All", "Fades", "Scissor Cuts", "Beards", "Restyles", "Creative Cuts"];

export default function Crew() {
  const [filter, setFilter] = useState("All");
  const list = barbers.filter((barber) => filter === "All" || barber.tags.includes(filter));

  return (
    <>
      <PageHero number="02" title="The crew" copy="Different hands. Same standard. Choose by specialty or instinct." />
      <div className="sticky top-16 z-20 flex overflow-auto border-b border-black bg-[var(--paper)]">
        {filters.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setFilter(item)}
            className={`shrink-0 border-r border-black px-5 py-4 text-xs font-bold uppercase ${filter === item ? "bg-black text-white" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="section space-y-5">
        {list.map((barber, index) => (
          <motion.article layout key={barber.name} className="grid border border-black lg:grid-cols-[45%_1fr]">
            <div className="relative min-h-[520px] overflow-hidden border-b border-black lg:border-r lg:border-b-0">
              <Image src={barber.image} fill alt={`${barber.name}, barber ${barber.number}`} sizes="(max-width:1024px) 100vw,45vw" className="object-cover grayscale" />
              <span className="display absolute top-3 left-4 text-8xl text-white">{barber.number}</span>
            </div>
            <div className="flex flex-col p-5 md:p-8">
              <span className="meta blue">Barber #{barber.number}</span>
              <h2 className="display text-7xl md:text-9xl">{barber.name}</h2>
              <p className="mt-4 text-2xl">{barber.quote}</p>
              <div className="mt-10 grid gap-5 border-t border-black pt-5 sm:grid-cols-3">
                <span className="meta">Specialty<br /><b className="text-sm normal-case">{barber.specialty}</b></span>
                <span className="meta">Experience<br /><b className="text-sm normal-case">{barber.experience}</b></span>
                <span className="meta">Working<br /><b className="text-sm normal-case">{barber.days}</b></span>
              </div>
              <div className="mt-4 flex items-center gap-2"><Star className="size-4 fill-[var(--blue)] text-[var(--blue)]" /><b>{barber.rating}</b> customer rating</div>
              <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
                {looks.slice(index, index + 3).map((look) => (
                  <div key={look.id} className="relative aspect-square overflow-hidden">
                    <Image src={look.image} fill alt={`${look.cut} by ${barber.name}`} className="object-cover" sizes="(max-width:1024px) 33vw,15vw" />
                  </div>
                ))}
              </div>
              <Link href="/book" className="group mt-5 flex items-center justify-between bg-[var(--blue)] p-4 font-bold uppercase text-white">
                Book with {barber.name.split(" ")[0]}<ArrowUpRight className="arrow" aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
    </>
  );
}
