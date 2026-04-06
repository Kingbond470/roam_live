"use client";

import { useEffect, useState } from "react";

export function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      try {
        const t = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setTime(t);
      } catch {
        setTime("");
      }
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [timezone]);

  return time;
}
