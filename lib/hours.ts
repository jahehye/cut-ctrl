import { siteConfig, weeklyHours } from "@/config/site";

export type BusinessDate = {
  iso: string;
  weekday: string;
  day: string;
  month: string;
};

type DateParts = {
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
};

function zonedDateParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: siteConfig.timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayIndex = weeklyHours.findIndex((entry) => entry.shortDay === values.weekday);

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    weekdayIndex,
  };
}

function isoFromUtcDate(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function getNextBusinessDays(from = new Date(), count = 7): BusinessDate[] {
  const londonToday = zonedDateParts(from);
  const cursor = new Date(
    Date.UTC(londonToday.year, londonToday.month - 1, londonToday.day + 1, 12),
  );
  const dates: BusinessDate[] = [];

  while (dates.length < count) {
    const weekdayIndex = cursor.getUTCDay();
    const hours = weeklyHours[weekdayIndex];

    if (hours.open && hours.close) {
      dates.push({
        iso: isoFromUtcDate(cursor),
        weekday: hours.shortDay,
        day: String(cursor.getUTCDate()).padStart(2, "0"),
        month: new Intl.DateTimeFormat("en-GB", {
          month: "short",
          timeZone: "UTC",
        }).format(cursor),
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatOpening(dayIndex: number, time: string) {
  return `${weeklyHours[dayIndex].shortDay} ${time}`;
}

export function getStudioStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: siteConfig.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const dayIndex = weeklyHours.findIndex((entry) => entry.shortDay === values.weekday);
  const minutesNow = Number(values.hour) * 60 + Number(values.minute);
  const today = weeklyHours[dayIndex];
  const isOpen = Boolean(
    today.open &&
      today.close &&
      minutesNow >= timeToMinutes(today.open) &&
      minutesNow < timeToMinutes(today.close),
  );

  if (isOpen && today.close) {
    return {
      isOpen: true,
      label: "Open now",
      detail: `Until ${today.close}`,
      nextOpening: null,
    };
  }

  for (let offset = 0; offset <= 7; offset += 1) {
    const candidateIndex = (dayIndex + offset) % 7;
    const candidate = weeklyHours[candidateIndex];
    const opensLaterToday =
      offset === 0 && candidate.open && minutesNow < timeToMinutes(candidate.open);

    if (candidate.open && (offset > 0 || opensLaterToday)) {
      return {
        isOpen: false,
        label: "Closed now",
        detail: `Next: ${formatOpening(candidateIndex, candidate.open)}`,
        nextOpening: formatOpening(candidateIndex, candidate.open),
      };
    }
  }

  return { isOpen: false, label: "Closed now", detail: "Hours unavailable", nextOpening: null };
}

export function groupedHours() {
  const groups: Array<{ label: string; value: string }> = [];

  weeklyHours.forEach((entry, index) => {
    const value = entry.open && entry.close ? `${entry.open}—${entry.close}` : "Closed";
    const previous = groups.at(-1);
    const previousEntry = weeklyHours[index - 1];

    if (previous && previous.value === value && previousEntry) {
      const start = previous.label.split("—")[0];
      previous.label = `${start}—${entry.shortDay}`;
    } else {
      groups.push({ label: entry.shortDay, value });
    }
  });

  return groups;
}
