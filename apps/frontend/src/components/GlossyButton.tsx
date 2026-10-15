import React from "react";

// Brand colors from logo palette
const BRAND = {
  top: "#FFD59E",      // peach/orange from logo top
  bottom: "#4BE3E6",   // cyan/teal from logo bottom
  border: "#FFE0B2",   // lighter orange for border
  accent: "#43E7AD",   // logo accent/teal
  contrast: "#232323", // dark text for contrast
};

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return `${r},${g},${b}`;
}

type GlossyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  gradientFrom?: string;
  gradientTo?: string;
};

export const GlossyButton: React.FC<GlossyButtonProps> = ({
  children,
  size = "md",
  gradientFrom,
  gradientTo,
  style,
  ...props
}) => {
  const sizes = {
    sm: { minWidth: 120, height: 40, fontSize: "1rem" },
    md: { minWidth: 240, height: 64, fontSize: "1.25rem" },
    lg: { minWidth: 320, height: 80, fontSize: "1.5rem" },
  }[size];

  // Use logo palette for gradient and border
  const gradFrom = gradientFrom || BRAND.top;
  const gradTo = gradientTo || BRAND.bottom;
  const borderCol = BRAND.border;
  const accentRGB = hexToRgb(BRAND.accent);

  return (
    <button
      type="button"
      tabIndex={0}
      className="relative flex items-center justify-center font-semibold transition-all duration-150 select-none"
      style={{
        minWidth: sizes.minWidth,
        height: sizes.height,
        borderRadius: 9999,
        background: `linear-gradient(180deg, ${gradFrom} 0%, ${gradTo} 100%)`,
        boxShadow: "0 8px 18px rgba(0,0,0,0.12), inset 0 2px 16px 0 rgba(255,255,255,0.45)",
        border: `2px solid ${borderCol}`,
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: sizes.fontSize,
        lineHeight: 1.2,
        letterSpacing: "-0.25px",
        color: BRAND.contrast,
        outline: "none",
        transition: "all 140ms cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
      {...props}
      onFocus={e => {
        e.currentTarget.style.boxShadow =
          `0 0 0 3px rgba(${accentRGB},0.45), 0 8px 18px rgba(0,0,0,0.12), inset 0 2px 16px 0 rgba(255,255,255,0.45)`;
      }}
      onBlur={e => {
        e.currentTarget.style.boxShadow =
          "0 8px 18px rgba(0,0,0,0.12), inset 0 2px 16px 0 rgba(255,255,255,0.45)";
      }}
      onMouseOver={e => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 12px 22px rgba(0,0,0,0.15), inset 0 2px 16px 0 rgba(255,255,255,0.55)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 18px rgba(0,0,0,0.12), inset 0 2px 16px 0 rgba(255,255,255,0.45)";
      }}
      onMouseDown={e => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.20), inset 0 2px 16px 0 rgba(255,255,255,0.45)";
      }}
      onMouseUp={e => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 12px 22px rgba(0,0,0,0.15), inset 0 2px 16px 0 rgba(255,255,255,0.55)";
      }}
    >
      {/* Glass layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          zIndex: 1,
          content: '""',
          background: `linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(247,178,103,0.12) 100%)`, // subtle white/orange
          backdropFilter: "blur(14px) brightness(1.08)",
          WebkitBackdropFilter: "blur(14px) brightness(1.08)",
          borderRadius: 9999,
        }}
      />
      <span
        className="relative z-10"
        style={{
          color: BRAND.contrast,
          fontWeight: 600,
          fontSize: sizes.fontSize,
          lineHeight: 1.2,
          letterSpacing: "-0.25px",
          // Etched/glassy text effect
          textShadow: `0 1px 2px rgba(255,255,255,0.7), 0 2px 6px rgba(0,0,0,0.10), 0 -1px 1px rgba(0,0,0,0.18)`,
          mixBlendMode: 'luminosity',
        }}
      >
        {children}
      </span>
    </button>
  );
}; 