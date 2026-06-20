import { HTMLAttributes, ElementType } from "react";

type BubblyHeaderProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Which heading tag to render. Defaults to h2. */
  as?: ElementType;
  /** Tilt direction. Defaults to a slight left lean (-rotate-1). */
  tilt?: "left" | "right";
};

/**
 * BubblyHeader — a playful, heavily-weighted section title.
 *
 * Uses the chunky heading font (Fredoka) with a slight rotation so titles
 * feel hand-placed and bouncy rather than rigid.
 */
export default function BubblyHeader({
  as: Tag = "h2",
  tilt = "left",
  className = "",
  children,
  ...props
}: BubblyHeaderProps) {
  const rotation = tilt === "right" ? "rotate-1" : "-rotate-1";

  return (
    <Tag
      className={[
        "inline-block font-heading font-bold text-ink",
        "text-4xl sm:text-5xl tracking-tight",
        rotation,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
