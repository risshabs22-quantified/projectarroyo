import { HTMLAttributes, forwardRef } from "react";

type CartoonCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Use the larger p-8 padding instead of the default p-6. */
  roomy?: boolean;
};

/**
 * CartoonCard — a white content panel in the cartoon-brutalist style.
 *
 * rounded-2xl · 4px solid black border · shadow-bouncy · white background ·
 * thick padding (p-6, or p-8 when `roomy`).
 */
const CartoonCard = forwardRef<HTMLDivElement, CartoonCardProps>(
  ({ className = "", roomy = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-2xl border-4 border-ink bg-white text-ink",
          roomy ? "p-8" : "p-6",
          "shadow-bouncy",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CartoonCard.displayName = "CartoonCard";

export default CartoonCard;
