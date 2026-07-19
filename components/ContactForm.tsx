"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-black p-6">
        <Check className="text-[var(--blue)]" aria-hidden="true" />
        <h3 className="display mt-4 text-4xl">Message received.</h3>
        <p className="mt-2">The studio will reply by email.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div><label htmlFor="contact-name" className="font-bold uppercase">Name</label><input id="contact-name" name="name" required autoComplete="name" className="mt-2 w-full border border-black bg-transparent p-4" /></div>
      <div><label htmlFor="contact-email" className="font-bold uppercase">Email</label><input id="contact-email" name="email" required type="email" inputMode="email" autoComplete="email" className="mt-2 w-full border border-black bg-transparent p-4" /></div>
      <div><label htmlFor="contact-message" className="font-bold uppercase">Message</label><textarea id="contact-message" name="message" required className="mt-2 min-h-36 w-full border border-black bg-transparent p-4" /></div>
      <button disabled={status === "submitting"} className="flex items-center justify-between bg-black p-4 font-bold uppercase text-white disabled:cursor-wait disabled:opacity-70">
        {status === "submitting" ? <><span>Sending…</span><LoaderCircle className="animate-spin" aria-hidden="true" /></> : <><span>Send message</span><ArrowUpRight aria-hidden="true" /></>}
      </button>
    </form>
  );
}
