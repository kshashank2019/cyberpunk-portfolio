import { useEffect, useMemo, useRef, useState } from "react";

type Falloff = "linear" | "quadratic";

interface VariableProximityProps {
  label: string;
  className?: string;
  fromFontVariationSettings?: string; // e.g. "'wght' 400, 'opsz' 9"
  toFontVariationSettings?: string;   // e.g. "'wght' 1000, 'opsz' 40"
  // Accept refs to either HTMLElement or HTMLDivElement (both nullable)
  containerRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLDivElement | null>;
  radius?: number; // px
  falloff?: Falloff;
}

export default function VariableProximity({
  label,
  className = "",
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings = "'wght' 1000, 'opsz' 40",
  containerRef,
  radius = 100,
  falloff = "linear",
}: VariableProximityProps) {
  const selfRef = useRef<HTMLSpanElement>(null);
  const [mix, setMix] = useState(0); // 0..1

  const parsedFrom = useMemo(() => parseSettings(fromFontVariationSettings), [fromFontVariationSettings]);
  const parsedTo = useMemo(() => parseSettings(toFontVariationSettings), [toFontVariationSettings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Change the event type to Event and cast inside to avoid TS mismatch with addEventListener
    function handleMove(evt: Event) {
      if (!selfRef.current) return;
      const e = evt as MouseEvent;
      const rect = selfRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const d = Math.sqrt(dx * dx + dy * dy);

      let proximity = 0;
      if (d <= radius) {
        const t = 1 - d / radius;
        proximity = falloff === "quadratic" ? t * t : t; // 0..1
      }
      setMix(proximity);
    }

    function handleLeave() {
      setMix(0);
    }

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, radius, falloff]);

  const interpolatedSettings = useMemo(() => {
    // Interpolate matching axes
    const keys = new Set([...Object.keys(parsedFrom), ...Object.keys(parsedTo)]);
    const parts: string[] = [];
    keys.forEach((k) => {
      const a = parsedFrom[k] ?? 0;
      const b = parsedTo[k] ?? a;
      const v = a + (b - a) * mix;
      parts.push(`'${k}' ${Number.isFinite(v) ? v.toFixed(2) : v}`);
    });
    return parts.join(", ");
  }, [parsedFrom, parsedTo, mix]);

  return (
    <span
      ref={selfRef}
      className={className}
      style={{
        display: "inline-block",
        transition: "font-variation-settings 120ms ease, transform 120ms ease",
        fontVariationSettings: interpolatedSettings,
      }}
    >
      {label}
    </span>
  );
}

function parseSettings(str: string): Record<string, number> {
  // Very small parser for "'wght' 400, 'opsz' 40" -> { wght: 400, opsz: 40 }
  const result: Record<string, number> = {};
  const parts = str.split(",").map((p) => p.trim());
  for (const p of parts) {
    const m = p.match(/'([^']+)'\s+([0-9.]+)/);
    if (m) {
      result[m[1]] = parseFloat(m[2]);
    }
  }
  return result;
}