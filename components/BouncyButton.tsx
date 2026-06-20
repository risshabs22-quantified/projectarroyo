import { ButtonHTMLAttributes, forwardRef } from "react";

type BouncyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Hover background color. Defaults to mint green (#34D399). */
  hoverColor?: "mint" | "amber";
};

/**
 * BouncyButton — pill-shaped, chunky, cartoon-brutalist button.
 *
 * rounded-full · 4px solid black border · shadow-bouncy · heading font.
 * On hover it scales up, swaps its background to a bright accent, and the
 * hard shadow shrinks from 6px → 2px so the button appears to "press down".
 */
const BouncyButton = forwardRef<HTMLButtonElement, BouncyButtonProps>(
  ({ className = "", hoverColor = "mint", children, ...props }, ref) => {
    const hoverBg =
      hoverColor === "amber" ? "hover:bg-[#FBBF24]" : "hover:bg-[#34D399]";

    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2",
          "rounded-full border-4 border-ink bg-white",
          "px-6 py-3 font-heading text-lg font-bold text-ink",
          "shadow-bouncy",
          "ease-bouncy duration-bouncy",
          "hover:scale-105 hover:shadow-[2px_2px_0px_0px_#000000]",
          hoverBg,
          "active:scale-100 active:shadow-[2px_2px_0px_0px_#000000]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/20",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BouncyButton.displayName = "BouncyButton";

export default BouncyButton;
