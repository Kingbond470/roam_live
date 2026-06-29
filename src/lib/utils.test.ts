import { afterEach, describe, expect, it, vi } from "vitest";
import type { City, CityVideo } from "@/types/city";
import {
  cn,
  formatViewerCount,
  getCityBySlug,
  getFeaturedVideo,
  getTimeAwareVideo,
  getMoodLabel,
} from "./utils";

/** Minimal video factory — only the fields the helpers read. */
function video(partial: Partial<CityVideo> = {}): CityVideo {
  return {
    youtubeId: "id",
    label: "label",
    timeOfDay: "day",
    type: "walk",
    isFeatured: false,
    ...partial,
  };
}

/** City with an injectable video list; other fields are stub values. */
function city(videos: CityVideo[], slug = "test"): City {
  return {
    slug,
    name: "Test",
    country: "Testland",
    countryCode: "TL",
    flagEmoji: "🏳",
    continent: "Asia",
    coordinates: { lat: 0, lng: 0 },
    timezone: "UTC",
    population: 1,
    videos,
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

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatViewerCount", () => {
  it("returns plain number below 1000", () => {
    expect(formatViewerCount(0)).toBe("0");
    expect(formatViewerCount(999)).toBe("999");
  });

  it("abbreviates thousands with one decimal at the boundary", () => {
    expect(formatViewerCount(1000)).toBe("1.0K");
    expect(formatViewerCount(1500)).toBe("1.5K");
    expect(formatViewerCount(12340)).toBe("12.3K");
  });
});

describe("getCityBySlug", () => {
  const list = [city([video()], "tokyo"), city([video()], "paris")];

  it("finds a city by slug", () => {
    expect(getCityBySlug(list, "paris")?.slug).toBe("paris");
  });

  it("returns null for an unknown slug", () => {
    expect(getCityBySlug(list, "atlantis")).toBeNull();
  });
});

describe("getFeaturedVideo", () => {
  it("returns the featured video when one exists", () => {
    const v = [video({ label: "a" }), video({ label: "feat", isFeatured: true })];
    expect(getFeaturedVideo(city(v)).label).toBe("feat");
  });

  it("falls back to the first video when none are featured", () => {
    const v = [video({ label: "first" }), video({ label: "second" })];
    expect(getFeaturedVideo(city(v)).label).toBe("first");
  });
});

describe("getTimeAwareVideo", () => {
  afterEach(() => vi.useRealTimers());

  /** Pin the user's *local* clock to a given hour. */
  function atHour(hour: number) {
    vi.useFakeTimers();
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    vi.setSystemTime(d);
  }

  const sample = [
    video({ label: "morning", timeOfDay: "morning" }),
    video({ label: "day", timeOfDay: "day" }),
    video({ label: "golden", timeOfDay: "golden-hour" }),
    video({ label: "night", timeOfDay: "night" }),
  ];

  // Boundary table straight from the doc comment in utils.ts.
  it.each([
    [4, "night"], // before morning window → night bucket
    [5, "morning"], // morning starts
    [8, "morning"], // last morning hour
    [9, "day"], // day starts
    [16, "day"], // last day hour
    [17, "golden"], // golden-hour starts
    [19, "golden"], // last golden hour
    [20, "night"], // night starts
    [23, "night"],
    [0, "night"], // midnight
  ])("hour %i selects the %s video", (hour, expected) => {
    atHour(hour);
    expect(getTimeAwareVideo(city(sample)).label).toBe(expected);
  });

  it("falls back to featured when the desired timeOfDay is absent", () => {
    atHour(12); // wants "day", none present
    const v = [
      video({ label: "x", timeOfDay: "night" }),
      video({ label: "feat", timeOfDay: "night", isFeatured: true }),
    ];
    expect(getTimeAwareVideo(city(v)).label).toBe("feat");
  });

  it("falls back to the first video when no match and none featured", () => {
    atHour(12);
    const v = [video({ label: "first", timeOfDay: "night" }), video({ label: "second", timeOfDay: "night" })];
    expect(getTimeAwareVideo(city(v)).label).toBe("first");
  });
});

describe("getMoodLabel", () => {
  it("prioritises video type over timeOfDay", () => {
    // bike/guided win even when timeOfDay would map elsewhere
    expect(getMoodLabel("night", "bike")).toBe("Adventure");
    expect(getMoodLabel("morning", "guided")).toBe("Deep Dive");
  });

  it("maps timeOfDay for plain walk videos", () => {
    expect(getMoodLabel("morning", "walk")).toBe("No Crowds");
    expect(getMoodLabel("night", "walk")).toBe("After Dark");
    expect(getMoodLabel("golden-hour", "walk")).toBe("Golden Hour");
  });

  it("labels landmark videos when timeOfDay has no special mapping", () => {
    expect(getMoodLabel("day", "landmark")).toBe("Iconic");
  });

  it("defaults to City Walk", () => {
    expect(getMoodLabel("day", "walk")).toBe("City Walk");
    expect(getMoodLabel("any", "walk")).toBe("City Walk");
  });
});
