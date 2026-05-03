import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Fade-in + slide-up when entering viewport; ease-out; skips work when reduced motion is preferred. */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px -28px 0px", amount: 0.1 });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{
        duration: 0.78,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
