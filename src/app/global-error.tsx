"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: "#050508",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "clamp(72px, 20vw, 120px)",
            fontWeight: 900,
            lineHeight: 1,
            color: "rgba(245,158,11,0.10)",
            marginBottom: "-0.2em",
            userSelect: "none",
          }}
        >
          :(
        </div>

        <h1 style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
          Something broke badly.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", maxWidth: "22rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          The app hit a critical error. Try reloading — this is usually temporary.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f59e0b",
              color: "#000",
              fontWeight: 700,
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            <RefreshCw style={{ width: 16, height: 16 }} />
            Try again
          </button>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.10)",
              cursor: "pointer",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Back to Globe
          </a>
        </div>
      </body>
    </html>
  );
}
