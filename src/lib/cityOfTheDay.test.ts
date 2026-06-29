import { afterEach, describe, expect, it, vi } from "vitest";
import type { City } from "@/types/city";
import { getCityOfTheDay } from "./cityOfTheDay";

/** Stub city carrying only a recognisable slug. */
function stub(slug: string): City {
  return {
    slug,
    name: slug,
    country: "X",
    countryCode: "X",
    flagEmoji: "🏳",
    continent: "Asia",
    coordinates: { lat: 0, lng: 0 },
    timezone: "UTC",
    population: 1,
    videos: [],
    culture: {
      greeting: "",
      currency: "",
      bestSeason: "",
      mustEat: [],
      localTip: "",
      funFact: "",
      culturalDos: [],
      culturalDonts: [],
    },
    tags: [],
  };
}

const list: City[] = Array.from({ length: 10 }, (_, i) => stub(`c${i}`));

/** Mirror of the production index formula, for expectation cross-checks. */
function expectedSlug(y: number, m: number, d: number, len: number): string {
  const dayIndex = y * 10000 + m * 100 + d; // m is 1-based here
  return `c${dayIndex % len}`;
}

/** Pin the system clock to a UTC calendar day. */
function atUTC(y: number, month1: number, d: number, hour = 12) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(Date.UTC(y, month1 - 1, d, hour, 0, 0)));
}

describe("getCityOfTheDay", () => {
  afterEach(() => vi.useRealTimers());

  it("returns the same city for every call on the same UTC day", () => {
    atUTC(2026, 6, 29);
    const a = getCityOfTheDay(list);
    const b = getCityOfTheDay(list);
    expect(a.slug).toBe(b.slug);
  });

  it("matches the documented index formula", () => {
    atUTC(2026, 6, 29);
    expect(getCityOfTheDay(list).slug).toBe(expectedSlug(2026, 6, 29, list.length));
  });

  it("changes selection across consecutive days", () => {
    atUTC(2026, 6, 29);
    const day1 = getCityOfTheDay(list).slug;
    atUTC(2026, 6, 30);
    const day2 = getCityOfTheDay(list).slug;
    expect(day1).not.toBe(day2);
  });

  it("rolls over at midnight UTC, not local midnight", () => {
    // 23:59 UTC on the 29th and 00:01 UTC on the 30th are different days.
    atUTC(2026, 6, 29, 23);
    const late = getCityOfTheDay(list).slug;
    atUTC(2026, 6, 30, 0);
    const early = getCityOfTheDay(list).slug;
    expect(late).toBe(expectedSlug(2026, 6, 29, list.length));
    expect(early).toBe(expectedSlug(2026, 6, 30, list.length));
  });

  it("stays within bounds for a wide date sweep", () => {
    for (let d = 1; d <= 28; d++) {
      atUTC(2026, 2, d);
      const city = getCityOfTheDay(list);
      expect(list).toContain(city);
    }
  });

  it("handles a single-city list", () => {
    atUTC(2026, 6, 29);
    const one = [stub("solo")];
    expect(getCityOfTheDay(one).slug).toBe("solo");
  });
});
