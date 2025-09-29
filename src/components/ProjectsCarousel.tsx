import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import CyberButton from "@/components/CyberButton";

type Item = {
  title: string;
  description: string;
  image: string;
  phase: string; // e.g. "PHASE II"
  progress: number; // 0..100
  techTags: string[];
  demoUrl?: string; // Add: website link
};

interface ProjectsCarouselProps {
  items: Array<Item>;
  initialIndex?: number;
}

export default function ProjectsCarousel({ items, initialIndex = 0 }: ProjectsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(Math.min(Math.max(initialIndex, 0), items.length - 1));
  const [cardWidth, setCardWidth] = useState(320);
  const [cardMarginX, setCardMarginX] = useState(50);

  // pointer drag
  const dragging = useRef(false);
  const startX = useRef(0);
  const prevTranslate = useRef(0);
  const currentTranslate = useRef(0);
  const rafId = useRef<number | null>(null);

  const clampIndex = useCallback((idx: number) => Math.max(0, Math.min(items.length - 1, idx)), [items.length]);

  const recalcMetrics = useCallback(() => {
    const first = cardsRef.current[0];
    if (!first || !containerRef.current) return;
    const rect = first.getBoundingClientRect();
    setCardWidth(Math.round(rect.width));
    // approximate total horizontal margin from computed styles
    const style = window.getComputedStyle(first);
    const mx = parseInt(style.marginLeft || "25", 10) + parseInt(style.marginRight || "25", 10);
    setCardMarginX(mx || 50);
  }, []);

  const translateForIndex = useCallback(
    (idx: number) => {
      if (!containerRef.current) return 0;
      const containerCenter = containerRef.current.clientWidth / 2;
      const cardCenter = cardWidth / 2;
      const step = cardWidth + cardMarginX;
      const amountToMove = idx * step;
      const target = containerCenter - cardCenter - amountToMove;
      return target;
    },
    [cardWidth, cardMarginX],
  );

  const applyTranslate = useCallback((tx: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${tx}px)`;
    }
  }, []);

  const moveTo = useCallback(
    (idx: number) => {
      const targetIdx = clampIndex(idx);
      const tx = translateForIndex(targetIdx);
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
      }
      applyTranslate(tx);
      currentTranslate.current = tx;
      prevTranslate.current = tx;
      setCurrentIndex(targetIdx);
      // flash effect
      if (!containerRef.current) return;
      const flash = document.createElement("div");
      flash.style.cssText =
        "position:absolute;inset:0;background-color:rgba(56,189,248,0.10);z-index:30;pointer-events:none;opacity:0;transition:opacity .2s ease";
      containerRef.current.appendChild(flash);
      setTimeout(() => {
        flash.style.opacity = "0.3";
        setTimeout(() => {
          flash.style.opacity = "0";
          setTimeout(() => {
            containerRef.current?.removeChild(flash);
          }, 200);
        }, 100);
      }, 10);
    },
    [applyTranslate, clampIndex, translateForIndex],
  );

  // Initial layout and on resize
  useEffect(() => {
    recalcMetrics();
    const onResize = () => {
      recalcMetrics();
      // realign to current card
      const tx = translateForIndex(currentIndex);
      if (trackRef.current) {
        trackRef.current.style.transition = "none";
      }
      applyTranslate(tx);
      currentTranslate.current = tx;
      prevTranslate.current = tx;
    };
    const debounced = debounce(onResize, 200);
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, [recalcMetrics, translateForIndex, currentIndex, applyTranslate]);

  // Align after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => moveTo(currentIndex));
    return () => cancelAnimationFrame(id);
  }, [moveTo, currentIndex]);

  // Helpers
  const isActive = (i: number) => i === currentIndex;
  const isPrev = (i: number) => i === currentIndex - 1;
  const isNext = (i: number) => i === currentIndex + 1;
  const isFarPrev = (i: number) => i < currentIndex - 1;
  const isFarNext = (i: number) => i > currentIndex + 1;

  // Drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    if (trackRef.current) {
      const m = window.getComputedStyle(trackRef.current).transform;
      if (m !== "none") {
        const parts = m.split(","); // matrix(a,b,c,d,tx,ty)
        const tx = parseFloat(parts[4]) || 0;
        currentTranslate.current = tx;
      } else {
        currentTranslate.current = 0;
      }
      prevTranslate.current = currentTranslate.current;
      trackRef.current.style.transition = "none";
      if (rafId.current) cancelAnimationFrame(rafId.current);
      const loop = () => {
        applyTranslate(currentTranslate.current);
        rafId.current = requestAnimationFrame(loop);
      };
      rafId.current = requestAnimationFrame(loop);
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    currentTranslate.current = prevTranslate.current + dx;
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
      trackRef.current.style.cursor = "grab";
    }
    const movedBy = currentTranslate.current - prevTranslate.current;
    const threshold = cardWidth / 3.5;
    if (movedBy < -threshold) {
      moveTo(currentIndex + 1);
    } else if (movedBy > threshold) {
      moveTo(currentIndex - 1);
    } else {
      moveTo(currentIndex);
    }
  };

  const next = () => moveTo(currentIndex + 1);
  const prev = () => moveTo(currentIndex - 1);

  return (
    <div className="relative w-full">
      {/* Inline CSS for special effects translated from your design */}
      <style>{`
        @keyframes borderGlow {
          0% { opacity: 0.3; background-position: 0% 50%; }
          50% { opacity: 0.5; background-position: 100% 50%; }
          100% { opacity: 0.3; background-position: 0% 50%; }
        }
        .pc-card::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, transparent 0%, rgba(59,130,246,.8) 25%, rgba(16,185,129,.8) 50%, rgba(236,72,153,.8) 75%, transparent 100%);
          z-index: -1;
          border-radius: 1rem;
          filter: blur(8px);
          opacity: 0;
          transition: opacity .5s ease;
          animation: borderGlow 6s linear infinite;
          background-size: 300% 300%;
        }
        .pc-card.active::before { opacity: 1; }

        .pc-image-overlay::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(120deg, rgba(56,189,248,0.10), transparent 70%),
                      radial-gradient(circle at 80% 20%, rgba(94,234,212,0.15), transparent 50%);
          pointer-events: none;
        }
        .pc-image-overlay::before {
          content: "";
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, rgba(6,182,212,.05) 0px, rgba(6,182,212,.05) 1px, transparent 1px, transparent 4px);
          pointer-events: none;
          opacity: .5;
          z-index: 5;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[1100px] px-0 py-6"
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const stateClass = [
              isActive(i) ? "active" : "",
              isPrev(i) ? "is-prev" : "",
              isNext(i) ? "is-next" : "",
              isFarPrev(i) ? "is-far-prev" : "",
              isFarNext(i) ? "is-far-next" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <motion.div
                key={item.title + i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className={`pc-card ${stateClass} relative mx-[25px] min-w-[320px] max-w-[320px] rounded-xl overflow-hidden backdrop-blur-md border border-[color:rgba(94,234,212,0.2)]`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30,41,59,0.85), rgba(15,23,42,0.9))",
                  boxShadow:
                    "0 15px 25px rgba(0,0,0,0.5), 0 0 30px rgba(56,189,248,0.2)",
                  transformOrigin: "center center",
                  transform:
                    isActive(i)
                      ? "scale(1) rotateY(0) translateZ(0)"
                      : isPrev(i)
                      ? "scale(0.75) rotateY(45deg) translateX(-80px) translateZ(-150px)"
                      : isNext(i)
                      ? "scale(0.75) rotateY(-45deg) translateX(80px) translateZ(-150px)"
                      : isFarNext(i)
                      ? "scale(0.8) rotateY(-45deg) translateZ(-100px)"
                      : "scale(0.8) rotateY(35deg) translateZ(-100px)",
                  opacity: isActive(i) ? 1 : 0.45,
                  filter: isActive(i)
                    ? "saturate(1.2) brightness(1.1)"
                    : "saturate(0.6) brightness(0.7)",
                  transition: "all 0.6s cubic-bezier(0.21,0.61,0.35,1)",
                  zIndex: isActive(i) ? 20 : 10,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="pc-image-overlay relative h-[200px] overflow-hidden border-b border-[color:rgba(94,234,212,0.3)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out"
                    style={{ transform: isActive(i) ? "scale(1.05)" : "scale(1)" }}
                  />
                </div>

                <div className="p-7 text-slate-100">
                  <h3
                    className="text-xl font-bold font-sans tracking-wide inline-block relative"
                    data-text={item.title}
                    style={{ letterSpacing: "1px" }}
                  >
                    <span className="neon-cyan">{item.title}</span>
                  </h3>
                  <p className="mt-3 text-[0.92rem] leading-6 text-slate-200/80 font-light">
                    {item.description}
                  </p>

                  <div className="mt-5 flex justify-end">
                    {item.demoUrl && (
                      <CyberButton
                        variant="cyan"
                        size="sm"
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative gap-2 rounded-md transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.25)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5 hover:brightness-110 ring-1 ring-sky-400/30 hover:ring-sky-400/60"
                      >
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:-rotate-12" />
                        <span className="transition-colors duration-300">Visit Site</span>
                        {/* Hover shimmer underlay */}
                        <span className="pointer-events-none absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </CyberButton>
                    )}
                  </div>
                </div>

                {/* Tech overlay only reveals for active card on hover */}
                <div
                  className={`absolute left-0 right-0 bottom-0 border-t border-[color:rgba(94,234,212,0.3)] backdrop-blur-md px-3 py-2 transition-transform duration-300 ${
                    isActive(i) ? "hover:translate-y-0 translate-y-full" : "translate-y-full"
                  }`}
                  style={{ background: "rgba(15,23,42,0.85)", zIndex: 25 }}
                >
                  <div className="flex flex-wrap">
                    {item.techTags.map((t) => (
                      <span
                        key={t}
                        className="mr-2 mb-2 inline-block rounded border border-[color:rgba(56,189,248,0.3)] bg-[color:rgba(56,189,248,0.15)] px-2 py-[2px] text-[0.7rem] text-sky-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Buttons */}
        <button
          aria-label="Previous"
          onClick={prev}
          className="carousel-btn-prev absolute left-[-12px] top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border neon-border-cyan text-sky-400 bg-[color:rgba(12,74,110,0.3)] backdrop-blur-sm"
          style={{ boxShadow: "0 0 15px rgba(56,189,248,0.2)" }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="carousel-btn-next absolute right-[-12px] top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border neon-border-cyan text-sky-400 bg-[color:rgba(12,74,110,0.3)] backdrop-blur-sm"
          style={{ boxShadow: "0 0 15px rgba(56,189,248,0.2)" }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => moveTo(i)}
              className={`h-1 w-6 rounded ${
                i === currentIndex
                  ? "bg-sky-400 shadow-[0_0_10px_#38bdf8]"
                  : "bg-[color:rgba(56,189,248,0.2)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 200) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}