import type { Metadata } from "next";
import { BookingWizard } from "@/components/BookingWizard";
import { PageHero } from "@/components/ui";
import { getNextBusinessDays } from "@/lib/hours";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book your CUT/CTRL service, barber, date and time in a few quick steps.",
};

export default function Book() {
  const dates = getNextBusinessDays(new Date(), 7);

  return (
    <>
      <PageHero
        number="05"
        title="Book / appointment"
        copy="Choose your service, barber and preferred appointment time."
      />
      <section className="section">
        <BookingWizard initialDates={dates} />
      </section>
    </>
  );
}
