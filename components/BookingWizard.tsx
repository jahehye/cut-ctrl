"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Check,
  LoaderCircle,
} from "lucide-react";
import { barbers, services } from "@/data/site";
import { formatStudioAddress, siteConfig } from "@/config/site";
import type { BusinessDate } from "@/lib/hours";

type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  notes: string;
  reminder: "SMS" | "Email" | "Both";
};

type FieldName = "name" | "phone" | "email";
type FieldErrors = Partial<Record<FieldName, string>>;
type SubmissionState = "idle" | "submitting" | "error" | "success";

const times = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
const unavailableTimes = new Set(["11:30"]);
const stepLabels = ["Service", "Barber", "Date", "Time", "Your details", "Review"];
const stepTitles = [
  "Choose a service.",
  "Choose your barber.",
  "Choose a date.",
  "Choose a time.",
  "Your details.",
  "Review your booking.",
];

function validateCustomer(info: CustomerInfo): { info: CustomerInfo; errors: FieldErrors } {
  const trimmed = Object.fromEntries(
    Object.entries(info).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
  ) as CustomerInfo;
  const errors: FieldErrors = {};
  const nameParts = trimmed.name.split(/\s+/).filter(Boolean);
  const validNameCharacters = /^[\p{L}\p{M}'’ -]+$/u.test(trimmed.name);
  const phoneDigits = trimmed.phone.replace(/\D/g, "");

  if (nameParts.length < 2 || !validNameCharacters) {
    errors.name = "Enter your first and last name.";
  }
  if (!/^\+?[0-9\s().-]+$/.test(trimmed.phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email)) {
    errors.email = "Enter a valid email address.";
  }

  return { info: trimmed, errors };
}

function formatIcsLocal(date: string, time: string, additionalMinutes = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day, hour, minute + additionalMinutes));
  return [
    value.getUTCFullYear(),
    String(value.getUTCMonth() + 1).padStart(2, "0"),
    String(value.getUTCDate()).padStart(2, "0"),
    "T",
    String(value.getUTCHours()).padStart(2, "0"),
    String(value.getUTCMinutes()).padStart(2, "0"),
    "00",
  ].join("");
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function BookingWizard({ initialDates }: { initialDates: BusinessDate[] }) {
  const [step, setStep] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [barberIndex, setBarberIndex] = useState(-1);
  const [dateIso, setDateIso] = useState(initialDates[0]?.iso ?? "");
  const [time, setTime] = useState("14:30");
  const [info, setInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    notes: "",
    reminder: "SMS",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>("idle");
  const [submissionError, setSubmissionError] = useState("");
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});
  const reduceMotion = useReducedMotion();

  const service = services[serviceIndex];
  const barber = barberIndex < 0 ? null : barbers[barberIndex];
  const selectedDate = initialDates.find((date) => date.iso === dateIso) ?? initialDates[0];
  const isSubmitting = submission === "submitting";

  function updateInfo<K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) {
    setInfo((current) => ({ ...current, [key]: value }));
    if (key === "name" || key === "phone" || key === "email") {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function goNext() {
    if (step === 4) {
      const validation = validateCustomer(info);
      setInfo(validation.info);
      setFieldErrors(validation.errors);
      const firstInvalid = (Object.keys(validation.errors) as FieldName[])[0];
      if (firstInvalid) {
        window.requestAnimationFrame(() => fieldRefs.current[firstInvalid]?.focus());
        return;
      }
    }
    setSubmissionError("");
    setStep((current) => Math.min(5, current + 1));
  }

  async function confirmBooking() {
    setSubmission("submitting");
    setSubmissionError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      if (new URLSearchParams(window.location.search).get("simulateError") === "1") {
        throw new Error("Simulated booking service failure");
      }
      setSubmission("success");
      setStep(6);
    } catch {
      setSubmission("error");
      setSubmissionError(
        "We could not confirm the appointment. Your choices are saved—please try again.",
      );
    }
  }

  function downloadCalendar() {
    if (!selectedDate) return;
    const barberName = barber?.name ?? "CUT/CTRL barber";
    const title = `CUT/CTRL — ${service.name} with ${barberName}`;
    const dtStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CUT CTRL//Booking//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@cutctrl.studio`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=${siteConfig.timezone}:${formatIcsLocal(selectedDate.iso, time)}`,
      `DTEND;TZID=${siteConfig.timezone}:${formatIcsLocal(selectedDate.iso, time, service.duration)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(`${service.name}, ${service.duration} minutes.`)}`,
      `LOCATION:${escapeIcs(formatStudioAddress())}`,
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cut-ctrl-${service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedDate.iso}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  if (submission === "success" && selectedDate) {
    return (
      <div className="border border-black p-8 md:p-16">
        <div className="flex size-16 items-center justify-center bg-[var(--blue)] text-white">
          <Check aria-hidden="true" />
        </div>
        <h1 className="display mt-8 text-6xl md:text-8xl">Appointment booked.</h1>
        <p className="mt-4 text-xl">
          {selectedDate.weekday} {selectedDate.day} {selectedDate.month} at {time}. Your confirmation
          is on its way.
        </p>
        <button
          type="button"
          onClick={downloadCalendar}
          className="mt-8 inline-flex items-center gap-3 border border-black p-4 font-bold uppercase"
        >
          <CalendarPlus aria-hidden="true" />
          Add to calendar
        </button>
        <p className="meta mt-10 max-w-md">
          Cancel or move your appointment up to 12 hours before. Late cancellations may be charged
          50%.
        </p>
      </div>
    );
  }

  return (
    <div className="grid border border-black lg:grid-cols-[220px_1fr_300px]">
      <aside className="border-b border-black p-5 lg:border-r lg:border-b-0">
        <span className="meta blue">Booking progress</span>
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={`mt-4 border-t pt-3 ${index === step ? "text-[var(--blue)]" : ""}`}
          >
            <span className="meta">0{index + 1}</span>
            <br />
            <b className="uppercase">{label}</b>
          </div>
        ))}
      </aside>

      <section className="min-h-[600px] p-5 md:p-8">
        <div className="mb-8 h-1 bg-black/10" aria-hidden="true">
          <div
            className="h-full bg-[var(--blue)] transition-all"
            style={{ width: `${((step + 1) / 6) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? false : { x: 25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { x: -25, opacity: 0 }}
          >
            <span className="meta">Step {step + 1} / 6</span>
            <h2 className="display mt-2 mb-8 text-5xl md:text-7xl">{stepTitles[step]}</h2>

            {step === 0 && (
              <div className="grid sm:grid-cols-2">
                {services.slice(0, 8).map((item, index) => (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => setServiceIndex(index)}
                    aria-pressed={serviceIndex === index}
                    className={`border border-black p-4 text-left ${serviceIndex === index ? "bg-black text-white" : ""}`}
                  >
                    <span className="meta">{item.duration} min</span>
                    <strong className="display block text-2xl">{item.name}</strong>
                    <span>£{item.price}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setBarberIndex(-1)}
                  aria-pressed={barberIndex === -1}
                  className={`border border-black p-5 text-left ${barberIndex === -1 ? "bg-black text-white" : ""}`}
                >
                  <strong className="display text-2xl">First available</strong>
                  <p>Get the earliest appointment.</p>
                </button>
                {barbers.map((item, index) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setBarberIndex(index)}
                    aria-pressed={barberIndex === index}
                    className={`border border-black p-5 text-left ${barberIndex === index ? "bg-black text-white" : ""}`}
                  >
                    <strong className="display text-2xl">{item.name}</strong>
                    <p>{item.specialty}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {initialDates.map((date) => (
                  <button
                    type="button"
                    key={date.iso}
                    onClick={() => setDateIso(date.iso)}
                    aria-pressed={selectedDate?.iso === date.iso}
                    className={`min-h-24 border border-black p-3 uppercase ${selectedDate?.iso === date.iso ? "bg-black text-white" : ""}`}
                  >
                    <span className="meta block">{date.weekday}</span>
                    <strong className="display text-3xl">{date.day}</strong>
                    <span className="ml-1 text-sm font-bold">{date.month}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 sm:grid-cols-3">
                {times.map((item) => {
                  const unavailable = unavailableTimes.has(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      disabled={unavailable}
                      onClick={() => setTime(item)}
                      aria-pressed={time === item}
                      className={`min-h-20 border border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-30 ${time === item ? "bg-black text-white" : ""}`}
                    >
                      {item}
                      {unavailable && <small className="block">Unavailable</small>}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="booking-name"
                  label="Full name"
                  autoComplete="name"
                  value={info.name}
                  error={fieldErrors.name}
                  inputRef={(node) => {
                    fieldRefs.current.name = node;
                  }}
                  onChange={(value) => updateInfo("name", value)}
                />
                <FormField
                  id="booking-phone"
                  label="Mobile number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={info.phone}
                  error={fieldErrors.phone}
                  inputRef={(node) => {
                    fieldRefs.current.phone = node;
                  }}
                  onChange={(value) => updateInfo("phone", value)}
                />
                <FormField
                  id="booking-email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={info.email}
                  error={fieldErrors.email}
                  inputRef={(node) => {
                    fieldRefs.current.email = node;
                  }}
                  onChange={(value) => updateInfo("email", value)}
                />
                <FormField
                  id="booking-instagram"
                  label="Instagram handle (optional)"
                  autoComplete="off"
                  required={false}
                  value={info.instagram}
                  onChange={(value) => updateInfo("instagram", value)}
                />
                <div className="sm:col-span-2">
                  <label htmlFor="booking-notes" className="font-bold uppercase">
                    Notes (optional)
                  </label>
                  <textarea
                    id="booking-notes"
                    autoComplete="off"
                    className="mt-2 min-h-24 w-full border border-black bg-transparent p-3 font-normal normal-case"
                    value={info.notes}
                    onChange={(event) => updateInfo("notes", event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="booking-reminder" className="font-bold uppercase">
                    Reminder preference
                  </label>
                  <select
                    id="booking-reminder"
                    className="mt-2 min-h-12 w-full border border-black bg-transparent p-3"
                    value={info.reminder}
                    onChange={(event) =>
                      updateInfo("reminder", event.target.value as CustomerInfo["reminder"])
                    }
                  >
                    <option>SMS</option>
                    <option>Email</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
            )}

            {step === 5 && selectedDate && (
              <>
                <dl className="grid gap-px border border-black bg-black sm:grid-cols-2">
                  {[
                    ["Service", service.name],
                    ["Barber", barber?.name ?? "First available"],
                    ["Date", `${selectedDate.weekday} ${selectedDate.day} ${selectedDate.month}`],
                    ["Time", time],
                    ["Price", `£${service.price}`],
                    ["Duration", `${service.duration} min`],
                  ].map(([term, value]) => (
                    <div key={term} className="bg-[var(--paper)] p-5">
                      <dt className="meta">{term}</dt>
                      <dd className="display mt-1 text-3xl">{value}</dd>
                    </div>
                  ))}
                </dl>
                {submissionError && (
                  <p role="alert" aria-live="assertive" className="mt-5 border-l-4 border-red-700 p-3 text-red-800">
                    {submissionError}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-between gap-4">
          <button
            type="button"
            disabled={step === 0 || isSubmitting}
            onClick={() => setStep((current) => current - 1)}
            className="inline-flex items-center gap-2 border border-black p-4 font-bold uppercase disabled:opacity-30"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={step === 5 ? confirmBooking : goNext}
            className="inline-flex items-center gap-4 bg-[var(--blue)] p-4 font-bold uppercase text-white disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Confirming appointment…
              </>
            ) : (
              <>
                {step === 5 ? (submission === "error" ? "Try again" : "Confirm appointment") : "Next"}
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </section>

      <aside className="border-t border-black bg-black p-5 text-white lg:border-t-0 lg:border-l">
        <span className="meta text-white/60">Your booking</span>
        <h3 className="display mt-5 text-4xl">{service.name}</h3>
        <p className="mt-3">{barber?.name ?? "First available"}</p>
        {selectedDate && (
          <p className="mt-3 text-white/70">
            {selectedDate.weekday} {selectedDate.day} {selectedDate.month} / {time}
          </p>
        )}
        <div className="mt-8 border-t border-white/30 pt-4">
          <b className="display text-5xl">£{service.price}</b>
          <br />
          <span className="meta">{service.duration} minutes</span>
        </div>
      </aside>
    </div>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel";
  autoComplete: string;
  required?: boolean;
  inputRef?: (node: HTMLInputElement | null) => void;
  onChange: (value: string) => void;
};

function FormField({
  id,
  label,
  value,
  error,
  type = "text",
  inputMode = "text",
  autoComplete,
  required = true,
  inputRef,
  onChange,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="font-bold uppercase">
        {label}{required ? "*" : ""}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 min-h-12 w-full border border-black bg-transparent p-3 font-normal normal-case aria-invalid:border-red-700 aria-invalid:outline-red-700"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
