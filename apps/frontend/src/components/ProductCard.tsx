import { useState, useEffect } from 'react';

interface ProductCardProps {
  image: string;
  previewMode?: boolean;
  onClick?: () => void;
  liked?: boolean;
  imgHeight?: number; // px value for image height
  imgWidth?: number;  // px value for image width
}

// LikeHeart component
function LikeHeart({ liked: likedProp }: { liked?: boolean }) {
  const [internalLiked, setInternalLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const liked = likedProp !== undefined ? likedProp : internalLiked;
  const handleClick = () => {
    if (likedProp === undefined) {
      setInternalLiked(l => !l);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }
  };
  useEffect(() => {
    if (likedProp !== undefined) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(t);
    }
  }, [likedProp]);
  return (
    <button
      aria-label={liked ? 'Unlike' : 'Like'}
      onClick={handleClick}
      className="absolute top-2 right-2 z-10 focus:outline-none"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      tabIndex={0}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill={liked ? '#e53e3e' : '#bbb'}
        stroke={liked ? '#e53e3e' : '#bbb'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'like-heart-animate' : ''}
        style={{ filter: liked ? 'drop-shadow(0 2px 8px #e53e3e88)' : 'none', transition: 'fill 0.2s, stroke 0.2s' }}
      >
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
      </svg>
      <style>{`
        .like-heart-animate {
          animation: pop-heart 0.4s cubic-bezier(.4,2,.6,1);
        }
        @keyframes pop-heart {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}

export default function ProductCard({ image, previewMode, onClick, liked, imgHeight, imgWidth }: ProductCardProps) {
  // TikTok video dimensions: 9:16 aspect ratio
  // Using a reasonable size that fits well in carousel
  const cardWidth = imgWidth || 270; // 270px width
  const cardHeight = imgHeight || 480; // 480px height (9:16 ratio)

  return (
    <div
      className="relative group shadow-lg bg-[#232323] focus:outline-none transition-transform duration-300 hover:scale-105"
      style={{ 
        width: cardWidth, 
        height: cardHeight,
        minWidth: cardWidth,
        minHeight: cardHeight
      }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      <LikeHeart liked={liked} />
      <img
        src={image}
        alt="Product"
        className="absolute inset-0 object-cover object-center z-0 transition-transform duration-300"
        style={{
          filter: previewMode ? 'brightness(0.85)' : 'brightness(0.85)',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
      />
      <div className="absolute inset-0" style={{background:'linear-gradient(to top, #141414cc 60%, transparent 100%)'}} />
    </div>
  );
} 