import React, { useState, useRef, useEffect } from "react";
import { TypingText } from "./ui/TypingText";
import ProductCard from "./ProductCard";
import CarouselRow from "./CarouselRow";
import Footer from "./Footer";
import Navigation from "./Navigation";
import UploadPage from "./UploadPage";
import { motion, AnimatePresence } from "framer-motion";

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
      </div>
    </section>
  );
};

// --- Demo Data ---
const featuredProducts = [
  { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&q=80' }, // coffee
  { image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&q=80' }, // laptop
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80' }, // team
  { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=80' }, // office
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80' }, // coding
  { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' }, // analytics
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80' }, // team
  { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=80' }, // office
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80' }, // coding
  { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' }, // analytics
];
const newArrivals = [
  { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80' }, // data
  { image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&q=80' }, // startup
  { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80' }, // meeting
  { image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=500&q=80' }, // creative
  { image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&q=80' }, // innovation
  { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80' }, // collaboration
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80' }, // team
  { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=80' }, // office
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80' }, // coding
  { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' }, // analytics
];
const trendingNow = [
  { image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&q=80' }, // growth
  { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80' }, // success
  { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80' }, // strategy
  { image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=500&q=80' }, // design
  { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&q=80' }, // productivity
  { image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&q=80' }, // technology
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80' }, // team
  { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=80' }, // office
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80' }, // coding
  { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' }, // analytics
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
const DashboardWithNavigation = () => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'metrics' | 'stars' | 'upload'>('home');
  
  const handleCardClick = (card: any) => setSelectedCard(card);

  const renderPageContent = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <main className="max-w-[1400px] mx-auto px-12">
              <div className="mb-[0px]">
                <CarouselRow products={featuredProducts} autoScroll={false} onCardClick={handleCardClick} />
              </div>
              <div className="mb-[0px]">
                <CarouselRow products={newArrivals} autoScroll={false} onCardClick={handleCardClick} />
              </div>
              <div>
                <CarouselRow products={trendingNow} autoScroll={false} onCardClick={handleCardClick} />
              </div>
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#141414',
      }}
    >
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPageContent()}
      
      {/* Overlay only for home page */}
      {currentPage === 'home' && (
        <AnimatePresence>
          {selectedCard && (
            <CardOverlay card={selectedCard} onClose={() => setSelectedCard(null)} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DashboardWithNavigation; 