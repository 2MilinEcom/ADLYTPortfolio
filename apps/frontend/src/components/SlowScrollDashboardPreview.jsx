import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const featuredProducts = [
  { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80' }
];
const newArrivals = [
  { image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=500&q=80' },
  { image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80' }
];

// Helper to create random liked states for N cards
function useRandomLikes(cardCount) {
  const [liked, setLiked] = useState(() => Array(cardCount).fill(false));
  useEffect(() => {
    const intervals = liked.map((_, i) => setInterval(() => {
      setLiked(v => {
        const next = v.slice();
        // 30% chance to toggle
        if (Math.random() < 0.10) next[i] = !next[i];
        return next;
      });
    }, 2000 + Math.random() * 3000));
    return () => intervals.forEach(clearInterval);
  }, [cardCount]);
  return liked;
}

const SlowScrollDashboardPreview = () => {
  // For each row, double the cards for seamless scroll
  const row1 = featuredProducts.concat(featuredProducts);
  const row2 = newArrivals.concat(newArrivals);
  const likes1 = useRandomLikes(row1.length);
  const likes2 = useRandomLikes(row2.length);

  return (
    <div
      className="relative w-full h-full overflow-hidden ring-1 ring-[color:var(--border)]/20 rounded-none lg:rounded-r-3xl bg-[#18181b]"
      aria-hidden="true"
      style={{ pointerEvents: 'none', minHeight: 400 }}
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[rgba(66,67,65,0.18)] backdrop-blur-[2px] z-10"
        style={{ background: 'rgba(66,67,65,0.18)', WebkitBackdropFilter: 'blur(2px)', backdropFilter: 'blur(2px)' }}
      />
      <div className="relative z-20 flex flex-col gap-8 py-12 h-full justify-center">
        {/* Row 1: left to right */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-6 animate-scroll-x-ltr preview-blur" style={{width:'max-content'}}>
            {row1.map((p, i) => (
              <ProductCard key={i} image={p.image} previewMode liked={likes1[i]} />
            ))}
          </div>
        </div>
        {/* Row 2: right to left */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-6 animate-scroll-x-rtl preview-blur" style={{width:'max-content'}}>
            {row2.map((p, i) => (
              <ProductCard key={i} image={p.image} previewMode liked={likes2[i]} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll-x-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes scroll-x-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x-ltr {
          animation: scroll-x-ltr 60s linear infinite alternate;
        }
        .animate-scroll-x-rtl {
          animation: scroll-x-rtl 60s linear infinite alternate;
        }
        .preview-blur > * {
          filter: blur(2px);
          transition: filter 0.3s;
        }
      `}</style>
    </div>
  );
};

export default SlowScrollDashboardPreview; 