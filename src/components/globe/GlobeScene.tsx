"use client";

import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";
import type { City } from "@/types/city";
import { useAppStore } from "@/store/appStore";

interface Props {
  cities: City[];
  activeTag?: string | null;
  cityOfTheDay?: City | null;
}

type GlobePoint = {
  lat: number;
  lng: number;
  size: number;
  color: string;
  citySlug: string;
  label: string;
};

export function GlobeScene({ cities, activeTag, cityOfTheDay }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  // BUG-01 FIX: use a ref instead of state so pointColor callback always reads latest value
  const hoveredSlugRef = useRef<string | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const { selectCity, phase } = useAppStore();

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import("globe.gl").then((GlobeModule) => {
      if (cancelled || !containerRef.current) return;

      const Globe = GlobeModule.default;

      // Sprint 2B: dim non-matching pins when a tag filter is active
      const tagFilter = activeTag && activeTag !== "__favorites__" ? activeTag : null;
      const points: GlobePoint[] = cities.map((city) => {
        const matches = !tagFilter || city.tags.includes(tagFilter);
        const isToday = city.slug === cityOfTheDay?.slug;
        return {
          lat: city.coordinates.lat,
          lng: city.coordinates.lng,
          size: isToday ? 0.6 : matches ? 0.45 : 0.25,
          color: isToday ? "#f43f5e" : matches ? "#f59e0b" : "#444444",
          citySlug: city.slug,
          label: isToday ? `${city.name} ★ Today's Walk` : city.name,
        };
      });

      const globe = new Globe(containerRef.current)
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundImageUrl(null)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#1a4a8a")
        .atmosphereAltitude(0.18)
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointAltitude(0.01)
        .pointRadius((d: object) => (d as GlobePoint).size)
        // BUG-01 FIX: reads hoveredSlugRef.current at call time — never stale
        .pointColor((d: object) =>
          (d as GlobePoint).citySlug === hoveredSlugRef.current
            ? "#fbbf24"
            : (d as GlobePoint).color
        )
        .pointsMerge(false)
        .pointLabel((d: object) => {
          const p = d as GlobePoint;
          return `<div style="
            background:rgba(5,5,8,0.9);
            border:1px solid rgba(245,158,11,0.6);
            border-radius:8px;
            padding:5px 12px;
            color:#fff;
            font-family:system-ui,sans-serif;
            font-size:13px;
            font-weight:600;
            letter-spacing:0.04em;
            white-space:nowrap;
          ">${p.label}</div>`;
        })
        .onPointClick((point: object) => {
          const p = point as GlobePoint;
          const city = cities.find((c) => c.slug === p.citySlug);
          if (city) selectCity(city);
        })
        .onPointHover((point: object | null) => {
          const p = point as GlobePoint | null;
          // BUG-01 FIX: update ref, then refresh pointsData to re-evaluate color
          hoveredSlugRef.current = p ? p.citySlug : null;
          globe.pointsData(points); // force color re-evaluation
          if (containerRef.current) {
            containerRef.current.style.cursor = p ? "pointer" : "grab";
          }
        });

      globe.pointOfView({ lat: 20, lng: 15, altitude: 2.2 });
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.controls().minPolarAngle = Math.PI * 0.2;
      globe.controls().maxPolarAngle = Math.PI * 0.8;

      globeRef.current = globe;

      // BUG-02 FIX: store ro in a ref so the outer cleanup can disconnect it
      const ro = new ResizeObserver(() => {
        if (containerRef.current) {
          globe.width(containerRef.current.clientWidth);
          globe.height(containerRef.current.clientHeight);
        }
      });
      ro.observe(containerRef.current);
      roRef.current = ro;
    });

    return () => {
      cancelled = true;
      // BUG-02 FIX: disconnect ResizeObserver on cleanup
      roRef.current?.disconnect();
      roRef.current = null;
      // BUG-03 FIX: dispose the globe/Three.js renderer to free WebGL context
      if (globeRef.current) {
        try {
          globeRef.current.renderer().dispose();
        } catch { /* renderer may already be gone */ }
        globeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom toward selected city when phase becomes "zooming"
  useEffect(() => {
    const { selectedCity } = useAppStore.getState();

    if (phase === "zooming" && selectedCity && globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView(
        { lat: selectedCity.coordinates.lat, lng: selectedCity.coordinates.lng, altitude: 0.6 },
        1200
      );
      setTimeout(() => {
        useAppStore.getState().advanceToVideo();
      }, 1200);
    }

    if ((phase === "idle" || phase === "globe-return") && globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointOfView({ lat: 20, lng: 15, altitude: 2.2 }, 1000);
    }
  }, [phase]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ cursor: "grab" }} />
  );
}
