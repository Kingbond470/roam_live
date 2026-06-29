import { describe, expect, it } from "vitest";
import {
  cities,
  getCityBySlug,
  countryToSlug,
  getCitiesByCountry,
  getCitiesByContinent,
  getUniqueCountries,
} from "./cities";

describe("cities dataset", () => {
  it("loads a non-empty city list", () => {
    expect(cities.length).toBeGreaterThan(0);
  });

  // KNOWN-RED (tracking): cities.json has two distinct Ahmedabad entries
  // sharing slug "ahmedabad" (idx 92 unreachable via getCityBySlug/routing).
  // This test intentionally fails until the duplicate is resolved in data.
  it("has unique slugs", () => {
    const slugs = cities.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getCityBySlug", () => {
  it("finds an existing city", () => {
    const known = cities[0].slug;
    expect(getCityBySlug(known)?.slug).toBe(known);
  });

  it("returns null for an unknown slug", () => {
    expect(getCityBySlug("definitely-not-a-city")).toBeNull();
  });
});

describe("countryToSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(countryToSlug("United States")).toBe("united-states");
    expect(countryToSlug("South Korea")).toBe("south-korea");
  });

  it("collapses runs of whitespace into a single hyphen", () => {
    expect(countryToSlug("New   Zealand")).toBe("new-zealand");
  });

  it("leaves a single word untouched", () => {
    expect(countryToSlug("Japan")).toBe("japan");
  });
});

describe("getCitiesByCountry", () => {
  it("returns only cities whose country matches the slug", () => {
    const sampleCountry = cities[0].country;
    const slug = countryToSlug(sampleCountry);
    const result = getCitiesByCountry(slug);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => countryToSlug(c.country) === slug)).toBe(true);
  });

  it("returns an empty array for an unknown country", () => {
    expect(getCitiesByCountry("narnia")).toEqual([]);
  });
});

describe("getCitiesByContinent", () => {
  it("matches case-insensitively", () => {
    const continent = cities[0].continent;
    const lower = getCitiesByContinent(continent.toLowerCase());
    const upper = getCitiesByContinent(continent.toUpperCase());
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.length).toBe(upper.length);
    expect(lower.every((c) => c.continent === continent)).toBe(true);
  });

  it("returns an empty array for an unknown continent", () => {
    expect(getCitiesByContinent("mars")).toEqual([]);
  });
});

describe("getUniqueCountries", () => {
  const unique = getUniqueCountries();

  it("dedupes countries by slug", () => {
    const slugs = unique.map((u) => u.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("is sorted alphabetically by country name", () => {
    const names = unique.map((u) => u.country);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("covers every country present in the dataset", () => {
    const datasetSlugs = new Set(cities.map((c) => countryToSlug(c.country)));
    expect(unique.length).toBe(datasetSlugs.size);
  });

  it("carries flagEmoji and continent for each country", () => {
    for (const u of unique) {
      expect(u.flagEmoji).toBeTruthy();
      expect(u.continent).toBeTruthy();
    }
  });
});
