import { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  image: string;
}

interface CarouselRowProps {
  products: Product[];
  autoScroll?: boolean;
  onCardClick?: (card: Product, index: number) => void;
  spacing?: 'tight' | 'normal' | 'loose';
}

const CarouselRow = ({ products, autoScroll = false, onCardClick, spacing = 'normal' }: CarouselRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Define spacing classes based on the spacing prop
  const spacingClasses = {
    tight: 'py-2',    // 8px top/bottom
    normal: 'py-6',   // 24px top/bottom (default)
    loose: 'py-10'    // 40px top/bottom
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const container = scrollRef.current;
      const totalWidth = container.scrollWidth;
      const visibleWidth = container.offsetWidth;
      const maxScroll = Math.max(0, totalWidth - visibleWidth);
      setScrollDistance(maxScroll);
    }
  }, [autoScroll, products.length]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -width : width, behavior: 'smooth' });
    }
  };
  return (
    <section className={`w-full ${spacingClasses[spacing]}`}>
      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto overflow-visible px-1 snap-x snap-mandatory no-scrollbar items-center h-[520px]${autoScroll ? ' pointer-events-none auto-scroll-x' : ''}`}
        style={{
          scrollSnapType: 'x mandatory',
          pointerEvents: autoScroll ? 'none' : 'auto',
          animation: autoScroll && scrollDistance > 0 ? `carouselScroll ${Math.max(20, scrollDistance/10)}s linear infinite alternate` : undefined,
          animationPlayState: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'paused' : undefined,
        }}
        aria-hidden={autoScroll ? 'true' : undefined}
        onWheel={e => autoScroll ? e.preventDefault() : undefined}
        onTouchMove={e => autoScroll ? e.preventDefault() : undefined}
      >
        {products.map((p, i) => (
          <div key={i} className="snap-start">
            <ProductCard image={p.image} previewMode={autoScroll} onClick={onCardClick && !autoScroll ? () => onCardClick(p, i) : undefined} />
          </div>
        ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes carouselScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-var(--carousel-scroll-distance, 0px)); }
        }
        .auto-scroll-x {
          will-change: transform;
        }
      `}</style>
      {autoScroll && scrollDistance > 0 && (
        <style>{`:where(.auto-scroll-x) { --carousel-scroll-distance: ${scrollDistance}px; }`}</style>
      )}
    </section>
  );
};

export default CarouselRow; 