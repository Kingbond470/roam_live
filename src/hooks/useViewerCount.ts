"use client";

import { useEffect, useState } from "react";

// Simulates a realistic live viewer count with drift
export function useViewerCount(base: number = 847) {
  const [count, setCount] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10; // -10 to +10
        return Math.max(50, prev + delta);
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return count;
}
