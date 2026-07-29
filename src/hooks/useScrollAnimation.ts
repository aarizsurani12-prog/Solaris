"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  onUpdate?: (progress: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Hook for scroll-driven animations.
 * Tied to GSAP ScrollTrigger — never mix with continuous idle animations in the same tween.
 */
export const useScrollAnimation = (
  config: ScrollAnimationConfig,
  deps: unknown[] = []
) => {
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: config.trigger,
      start: config.start ?? "top bottom",
      end: config.end ?? "bottom top",
      scrub: config.scrub ?? true,
      onUpdate: config.onUpdate
        ? (self) => config.onUpdate!(self.progress)
        : undefined,
      onEnter: config.onEnter,
      onLeave: config.onLeave,
      onEnterBack: config.onEnterBack,
      onLeaveBack: config.onLeaveBack,
    });

    stRef.current = st;

    return () => {
      st.kill();
      stRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export { ScrollTrigger, gsap };
