import { useEffect } from "react";

export function useArrowKeySnap(containerRef, cardRefs) {
  useEffect(() => {
    function onKeyDown(e) {
      const container = containerRef.current;
      if (!container) return;
      const cards = cardRefs.map((r) => r.current).filter(Boolean);
      if (!cards.length) return;

      const containerTop = container.getBoundingClientRect().top;
      const distances = cards.map((c) =>
        Math.abs(c.getBoundingClientRect().top - containerTop)
      );
      const minDist = Math.min(...distances);
      let currentIndex = distances.indexOf(minDist);
      if (currentIndex === -1) currentIndex = 0;

      const scrollToIndex = (idx) => {
        const el = cards[idx];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, cards.length - 1);
        scrollToIndex(nextIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToIndex(prevIndex);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [containerRef, cardRefs]);
}