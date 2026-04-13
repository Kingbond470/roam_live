"use client";

import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";
import type { City } from "@/types/city";
import type { Journey } from "@/data/journeys";
import { useAppStore } from "@/store/appStore";

type GlobeArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
};

interface Props {
  cities: City[];
  activeTag?: string | null;
  cityOfTheDay?: City | null;
  activePath?: Journey | null;
}

type GlobePoint = {
  lat: number;
  lng: number;
  size: number;
  color: string;
  citySlug: string;
  label: string;
  videoCount: number;
};

/** Pin size + colour tier based on how many videos a city has. */
function videoTier(count: number): { size: number; color: string } {
  if (count >= 10) return { size: 0.60, color: "#fcd34d" }; // gold
  if (count >= 3)  return { size: 0.48, color: "#fbbf24" }; // bright amber
  if (count >= 2)  return { size: 0.38, color: "#f59e0b" }; // amber
  return              { size: 0.30, color: "#f59e0b" };      // base — 1 video
}

// Dimmed appearance — near-invisible on the night-earth texture
// Contrast comes from colour + size only. No altitude extrusion (looks like bar chart spikes).
const DIMMED_COLOR = "#111827";  // near-black with faint blue tint
const DIMMED_SIZE  = 0.07;       // dust-speck, not a dot

export function GlobeScene({ cities, activeTag, cityOfTheDay, activePath }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  // BUG-01 FIX: use a ref instead of state so pointColor callback always reads latest value
  const hoveredSlugRef = useRef<string | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  // Track current points so hover re-eval always uses latest path-filtered set
  const pointsRef = useRef<GlobePoint[]>([]);
  const { selectCity, phase } = useAppStore();

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import("globe.gl").then((GlobeModule) => {
      if (cancelled || !containerRef.current) return;

      const Globe = GlobeModule.default;

      // Dim non-matching pins when a filter is active (continent or favorites)
      const CONTINENTS = new Set(["Asia", "Europe", "Americas", "Africa", "Oceania"]);
      const tagFilter = activeTag && activeTag !== "__favorites__" ? activeTag : null;
      const pathSlugs = activePath ? new Set(activePath.citySlugOrder) : null;
      const points: GlobePoint[] = cities.map((city) => {
        const matches = !tagFilter || (CONTINENTS.has(tagFilter) ? city.continent === tagFilter : city.tags.includes(tagFilter));
        const isToday = city.slug === cityOfTheDay?.slug;
        const isOnPath = !pathSlugs || pathSlugs.has(city.slug);
        const active = isOnPath && matches;
        const tier = videoTier(city.videos.length);
        return {
          lat: city.coordinates.lat,
          lng: city.coordinates.lng,
          size:  isToday ? 0.68 : active ? tier.size : DIMMED_SIZE,
          color: isToday ? "#f43f5e" : active ? tier.color : DIMMED_COLOR,
          citySlug: city.slug,
          label: isToday ? `${city.name} ★ Today's Walk` : city.name,
          videoCount: city.videos.length,
        };
      });
      pointsRef.current = points;

      const globe = new Globe(containerRef.current)
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundImageUrl(null)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#60a5fa")
        .atmosphereAltitude(0.14)
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
          const videoPill = `<span style="
            margin-left:7px;
            padding:1px 7px;
            border-radius:999px;
            background:rgba(245,158,11,0.18);
            border:1px solid rgba(245,158,11,0.35);
            color:#fbbf24;
            font-size:11px;
            font-weight:500;
            vertical-align:middle;
          ">${p.videoCount} video${p.videoCount === 1 ? "" : "s"}</span>`;
          return `<div style="
            background:rgba(5,5,8,0.92);
            border:1px solid rgba(245,158,11,0.5);
            border-radius:9px;
            padding:5px 12px;
            color:#fff;
            font-family:system-ui,sans-serif;
            font-size:13px;
            font-weight:600;
            letter-spacing:0.04em;
            white-space:nowrap;
            display:flex;
            align-items:center;
          ">${p.label}${videoPill}</div>`;
        })
        .onPointClick((point: object) => {
          const p = point as GlobePoint;
          const city = cities.find((c) => c.slug === p.citySlug);
          if (city) {
            // BUG-04 FIX: exit journey when user explicitly clicks a city outside the active path
            const { activePath: ap, setActivePath } = useAppStore.getState();
            if (ap && !ap.citySlugOrder.includes(p.citySlug)) {
              setActivePath(null);
            }
            selectCity(city);
          }
        })
        .onPointHover((point: object | null) => {
          const p = point as GlobePoint | null;
          // BUG-01 FIX: update ref, then refresh pointsData to re-evaluate color
          hoveredSlugRef.current = p ? p.citySlug : null;
          globe.pointsData([...pointsRef.current]); // force color re-evaluation using latest points
          if (containerRef.current) {
            containerRef.current.style.cursor = p ? "pointer" : "grab";
          }
        })
        // Animated arcs for journey paths
        .arcsData([])
        .arcStartLat((d: object) => (d as GlobeArc).startLat)
        .arcStartLng((d: object) => (d as GlobeArc).startLng)
        .arcEndLat((d: object) => (d as GlobeArc).endLat)
        .arcEndLng((d: object) => (d as GlobeArc).endLng)
        .arcColor((d: object) => (d as GlobeArc).color)
        .arcDashLength(0.4)
        .arcDashGap(0.15)
        .arcDashAnimateTime(2500)
        .arcAltitudeAutoScale(0.4)
        .arcStroke(() => 0.5);

      globe.pointOfView({ lat: 20, lng: 15, altitude: 2.2 });
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.22;
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

  // Update arcs + pin dimming whenever the active journey path changes
  useEffect(() => {
    if (!globeRef.current) return;

    const CONTINENTS = new Set(["Asia", "Europe", "Americas", "Africa", "Oceania"]);
    const pathSlugs = activePath ? new Set(activePath.citySlugOrder) : null;
    const tagFilter = activeTag && activeTag !== "__favorites__" ? activeTag : null;

    const newPoints: GlobePoint[] = cities.map((city) => {
      const matches = !tagFilter || (CONTINENTS.has(tagFilter) ? city.continent === tagFilter : city.tags.includes(tagFilter));
      const isToday = city.slug === cityOfTheDay?.slug;
      const isOnPath = !pathSlugs || pathSlugs.has(city.slug);
      const active = isOnPath && matches;
      const tier = videoTier(city.videos.length);
      return {
        lat: city.coordinates.lat,
        lng: city.coordinates.lng,
        size:  isToday ? 0.68 : active ? tier.size : DIMMED_SIZE,
        color: isToday ? "#f43f5e" : active ? tier.color : DIMMED_COLOR,
        citySlug: city.slug,
        label: isToday ? `${city.name} ★ Today's Walk` : city.name,
        videoCount: city.videos.length,
      };
    });

    pointsRef.current = newPoints;
    globeRef.current.pointsData([...newPoints]);

    // Build arc pairs between consecutive path cities
    const arcs: GlobeArc[] = [];
    if (activePath) {
      for (let i = 0; i < activePath.citySlugOrder.length - 1; i++) {
        const from = cities.find((c) => c.slug === activePath.citySlugOrder[i]);
        const to   = cities.find((c) => c.slug === activePath.citySlugOrder[i + 1]);
        if (from && to) {
          arcs.push({
            startLat: from.coordinates.lat,
            startLng: from.coordinates.lng,
            endLat:   to.coordinates.lat,
            endLng:   to.coordinates.lng,
            color: activePath.accentColor + "cc", // BUG-05 FIX: 80% opacity so arcs don't overwhelm dimmed pins
          });
        }
      }
    }
    globeRef.current.arcsData(arcs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath, activeTag, cities]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ cursor: "grab" }} />
  );
}
