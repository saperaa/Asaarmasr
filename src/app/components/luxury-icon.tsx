import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";

const glowBase =
  "[filter:drop-shadow(0_0_5px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(255,215,0,0.22))]";
const glowHoverIcon =
  "group-hover/icon:[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.72))_drop-shadow(0_0_22px_rgba(212,175,55,0.38))]";

export type LuxuryIconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
  /** When true, scale + glow intensify when hovering the icon. When false, use e.g. `group-hover/card:` utilities via className. */
  interactive?: boolean;
};

export function LuxuryIcon({
  icon: Icon,
  size = 20,
  className,
  interactive = true,
}: LuxuryIconProps) {
  const uid = useId().replace(/:/g, "");
  const gid = `lux-gold-${uid}`;

  const svg = (
    <Icon
      size={size}
      strokeWidth={1.25}
      color={`url(#${gid})`}
      className={cn(
        "shrink-0 transition-[transform,filter] duration-[400ms] ease-out",
        glowBase,
        interactive && ["group-hover/icon:scale-[1.1]", glowHoverIcon],
        className
      )}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </Icon>
  );

  if (interactive) {
    return <span className="inline-flex group/icon items-center justify-center">{svg}</span>;
  }

  return svg;
}
