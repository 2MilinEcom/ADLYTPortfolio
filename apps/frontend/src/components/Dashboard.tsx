import React, { useState, useRef, useEffect } from "react";
import { TypingText } from "./ui/TypingText";
import ProductCard from "./ProductCard";
import CarouselRow from "./CarouselRow";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

// --- NavBar ---
const LOGO_COLORS = [
  'linear-gradient(135deg, #F7B267 0%, #F7B267 100%)', // A
  'linear-gradient(135deg, #A389F4 0%, #A389F4 100%)', // D
  'linear-gradient(135deg, #43E7AD 0%, #43E7AD 100%)', // L
  'linear-gradient(135deg, #F7B267 0%, #A389F4 100%)', // Y
  'linear-gradient(135deg, #A389F4 0%, #43E7AD 100%)', // T
];
const LOGO_LETTERS = ['A', 'D', 'L', 'Y', 'T'];

const NavBar = ({ previewMode = false }: { previewMode?: boolean }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <nav className={previewMode ? "absolute top-0 left-0 w-full z-50 h-16 flex items-center px-8" : "sticky top-0 z-50 w-full h-16 flex items-center px-8"} style={{background: '#181818', boxShadow:'0 2px 8px #333333', height: '64px', padding: '0 32px'}}>
      <div className="flex-1 flex items-center">
        {/* Morphing logo: image to ADLYT text */}
        <button
          type="button"
          aria-pressed={expanded}
          tabIndex={0}
          onClick={() => setExpanded(e => !e)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpanded(v => !v); }}
          style={{
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            minWidth: 40,
            height: 40,
            userSelect: 'none',
            fontFamily: 'Bebas Neue, Inter, sans-serif',
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: 2,
            transition: 'width 0.5s cubic-bezier(.4,2,.6,1)',
            overflow: 'hidden',
            width: expanded ? 140 : 40,
            background: 'none',
            border: 'none',
            padding: 0,
            position: 'relative',
          }}
        >
          <img
            src="/clear_logo.png"
            alt="ADLYT logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              objectFit: 'cover',
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: expanded ? 0 : 1,
              transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)',
              zIndex: 1,
            }}
          />
          <span
            style={{
              marginLeft: 0,
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)',
              background: 'linear-gradient(90deg, #F7B267 0%, #A389F4 50%, #43E7AD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              zIndex: 2,
              position: 'relative',
              paddingLeft: expanded ? 8 : 0,
              letterSpacing: 2,
              fontFamily: 'sans-serif',
              fontWeight: 900,
              fontSize: 28,
              display: 'inline-block',
            }}
          >
            ADLYT
          </span>
        </button>
      </div>
      <div className="flex-1 flex justify-end gap-6 items-center">
        {/* Home */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Home">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-8 9 8" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Metrics */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Metrics">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="9" y="8" width="4" height="12" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
        </button>
        {/* Library */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Library">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16"/><path d="M16 4v16"/></svg>
        </button>
        {/* Favorites */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Favorites">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" strokeLinejoin="round" strokeLinecap="round"/></svg>
        </button>
        {/* Cart */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Cart">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Account */}
        <button style={{transition: 'transform 0.2s ease'}} aria-label="Account">
          <svg width="24" height="24" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
        </button>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;700&display=swap');
        nav button:hover svg { transform: scale(1.1); }
        nav button svg { transition: transform 0.2s ease; }
      `}</style>
    </nav>
  );
};

// --- HeroSection ---
const HeroSection = () => {
  const [resetKey, setResetKey] = React.useState(0);
  return (
    <section className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{filter:'brightness(0.7)'}}
      />
      <div className="absolute inset-0" style={{background: 'linear-gradient(rgba(20,20,20,0.85), rgba(20,20,20,0.5))'}} />
      <div className="relative z-20 flex flex-col items-center text-center w-full">
        <TypingText
          key={resetKey}
          text="Premium ads curated for you"
          className="text-5xl font-bold mb-6"
          style={{fontFamily:'Inter, sans-serif', fontWeight:700, color:'#FFFFFF'}}
          onClick={() => setResetKey(k => k + 1)}
        />
        {/* <p className="text-[#B3B3B3] text-xl mb-8" style={{fontFamily:'Inter, sans-serif'}}>Premium ads curated for you</p> */}
      </div>
    </section>
  );
};

// --- Demo Data ---
const featuredProducts = [
  { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' }, // nature
  { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80' }, // forest
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80' }, // mountain
  { image: 'https://images.unsplash.com/photo-1519121782439-2f3c1b60a8a7?auto=format&fit=crop&w=500&q=80' }, // night sky
  { image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=500&q=80' }, // city
  { image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80' }, // desert
];
const newArrivals = [
  { image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=500&q=80' }, // abstract
  { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80' }, // forest (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=500&q=80' }, // city (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' }, // nature (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80' }, // mountain (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1519121782439-2f3c1b60a8a7?auto=format&fit=crop&w=500&q=80' }, // night sky (repeat for variety)
];
const trendingNow = [
  { image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80' }, // desert (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=500&q=80' }, // abstract (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80' }, // forest (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' }, // nature (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80' }, // mountain (repeat for variety)
  { image: 'https://images.unsplash.com/photo-1519121782439-2f3c1b60a8a7?auto=format&fit=crop&w=500&q=80' }, // night sky (repeat for variety)
];

// CardOverlay modal with animation, focus trap, and accessibility
function CardOverlay({ card, onClose }: { card: any, onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.body.style.overflow = 'hidden';
    backBtnRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1D4D]"
        aria-modal="true"
        role="dialog"
        ref={overlayRef}
      >
        <motion.div
          layoutId={`card-${card.id}`}
          className="flex bg-transparent rounded-xl shadow-2xl w-[90vw] max-w-5xl h-[90vh] max-h-[700px]"
          style={{ width: '50vw', minWidth: 320, height: '80vh', minHeight: 400 }}
        >
          <div className="relative w-1/2 h-full flex items-center justify-center">
            <ProductCard image={card.image} previewMode />
            <button
              ref={backBtnRef}
              onClick={onClose}
              aria-label="Back to dashboard"
              className="absolute top-4 left-4 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
            >
              &#8592; Back
            </button>
          </div>
          <div className="w-1/2 h-full bg-[#101828] rounded-r-xl overflow-y-auto flex flex-col justify-center items-start p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Card Details</h2>
            <p className="text-lg">Details for card: <span className="font-mono">{card?.id}</span></p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main Dashboard ---
interface DashboardProps {
  previewMode?: boolean;
}

const Dashboard = ({ previewMode = false }: DashboardProps) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const handleCardClick = (card: any) => setSelectedCard(card);
  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#141414',
        pointerEvents: previewMode ? 'none' : undefined,
      }}
      aria-hidden={previewMode ? 'true' : undefined}
    >
      <NavBar previewMode={previewMode} />
      <HeroSection />
      <main className={previewMode ? "w-full px-0" : "max-w-[1400px] mx-auto px-12"}>
        {/* Only horizontal carousel animation in preview mode */}
        <div className="mb-[0px]">
          <CarouselRow products={featuredProducts} autoScroll={previewMode} onCardClick={!previewMode ? handleCardClick : undefined} />
        </div>
        <div className="mb-[0px]">
          <CarouselRow products={newArrivals} autoScroll={previewMode} onCardClick={!previewMode ? handleCardClick : undefined} />
        </div>
        <div>
          <CarouselRow products={trendingNow} autoScroll={previewMode} onCardClick={!previewMode ? handleCardClick : undefined} />
        </div>
      </main>
      <Footer />
      {/* Overlay only in non-preview mode */}
      {!previewMode && (
        <AnimatePresence>
          {selectedCard && (
            <CardOverlay card={selectedCard} onClose={() => setSelectedCard(null)} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Dashboard;
