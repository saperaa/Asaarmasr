import { forwardRef, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "./ui/utils";

type Ripple = { x: number; y: number; id: number };

export const LuxuryRippleButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  function LuxuryRippleButton(
    {
      className,
      children,
      onPointerDown: onPointerDownProp,
      type = "button",
      ...rest
    },
    forwardedRef
  ) {
    const localRef = useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const setRefs = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDownProp?.(e);
      if (e.button !== 0) return;
      const el = localRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const id = performance.now();
      setRipples((prev) => [...prev, { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((rip) => rip.id !== id));
      }, 700);
    };

    return (
      <button
        ref={setRefs}
        type={type}
        className={cn("relative overflow-hidden", className)}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {ripples.map((rip) => (
          <span
            key={rip.id}
            className="luxury-ripple-elem pointer-events-none absolute rounded-full"
            style={{ left: rip.x, top: rip.y }}
            aria-hidden
          />
        ))}
        <span className="relative z-[1] inline-flex items-center justify-center">{children}</span>
      </button>
    );
  }
);
