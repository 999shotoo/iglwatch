"use client";

import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        animate(
          "#page-transition-wrapper",
          { opacity: 0, y: 10, filter: "blur(4px)" },
          { duration: 0.3, ease: "easeIn", onComplete: next }
        );
      }}
      enter={(next) => {
        animate(
          "#page-transition-wrapper",
          { opacity: 1, y: 0, filter: "blur(0px)" },
          { duration: 0.4, ease: "easeOut", onComplete: next }
        );
      }}
    >
      <div id="page-transition-wrapper" style={{ opacity: 1, y: 0, filter: "blur(0px)" }}>
        {children}
      </div>
    </TransitionRouter>
  );
}
