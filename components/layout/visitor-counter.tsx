"use client";

import { useEffect, useState } from "react";

const FLAG = "aci-visitor-counted";
const FLIP_MS = 180;

// One split-flap block. Starts at 0 and folds over once per number until it
// reaches its digit, like a flip clock. `delay` staggers the blocks (seconds).
function FlipDigit({ target, delay }: { target: number; delay: number }) {
  const [{ cur, prev }, setState] = useState({ cur: 0, prev: 0 });

  useEffect(() => {
    if (target === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let steps = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const step = () => {
      steps++;
      setState((s) => (s.cur >= target ? s : { prev: s.cur, cur: reduce ? target : s.cur + 1 }));
      if (reduce || steps >= target) clearInterval(interval);
    };

    const start = setTimeout(() => {
      step();
      if (!reduce && target > 1) interval = setInterval(step, FLIP_MS);
    }, delay * 1000);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [target, delay]);

  return (
    <div className="flip" aria-hidden="true">
      <div className="flip-half flip-top">
        <span>{cur}</span>
      </div>
      <div className="flip-half flip-bottom">
        <span>{prev}</span>
      </div>
      {cur !== prev && (
        <>
          <div key={`t${cur}`} className="flip-half flip-top flip-flap-top">
            <span>{prev}</span>
          </div>
          <div key={`b${cur}`} className="flip-half flip-bottom flip-flap-bottom">
            <span>{cur}</span>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Counts each browser once (localStorage flag) and shows the running total.
 * Renders nothing if the counter is unavailable so the footer is never affected.
 */
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let counted = false;
    try {
      counted = localStorage.getItem(FLAG) === "1";
    } catch {}

    fetch("/api/visitors", { method: counted ? "GET" : "POST", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.count !== "number") return;
        setCount(data.count);
        if (!counted) {
          try {
            localStorage.setItem(FLAG, "1");
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  // At least four blocks; more appear as the total grows. Keyed from the right
  // so existing blocks keep their place (and do not re-flip) when a digit is added.
  const digits = String(count).padStart(4, "0").split("");

  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary-foreground/50">
        Total visitors
      </span>
      <div role="img" aria-label={count.toLocaleString("en-IN")} className="flex gap-0.5">
        {digits.map((digit, i) => (
          <FlipDigit key={digits.length - i} target={Number(digit)} delay={i * 0.15} />
        ))}
      </div>
    </div>
  );
}
