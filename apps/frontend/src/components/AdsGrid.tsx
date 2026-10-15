
import { useState } from "react";
import AdCard from "@/components/AdCard";

interface AdsGridProps {
  onCardClick: (cardId: number) => void;
}

const AdsGrid = ({ onCardClick }: AdsGridProps) => {
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());

  const toggleLike = (cardId: number) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Sample ad data
  const ads = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop",
      title: "sant*Lab",
      subtitle: "ESTUDIO CREATIVO"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop",
      title: "girl's room is like a MUSEUM",
      subtitle: "of its own"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop",
      title: "happy weekend",
      subtitle: "enjoy your time"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=600&fit=crop",
      title: "PROCESS YOUR EMOTIONS",
      subtitle: "mindful living"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop",
      title: "Creative Portrait",
      subtitle: "artistic vision"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop",
      title: "day in my life",
      subtitle: "7am-3pm"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop",
      title: "NEXT LEVEL",
      subtitle: "push beyond limits"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ads.map((ad) => (
        <AdCard
          key={ad.id}
          id={ad.id}
          image={ad.image}
          title={ad.title}
          subtitle={ad.subtitle}
          isLiked={likedCards.has(ad.id)}
          onLike={() => toggleLike(ad.id)}
          onClick={() => onCardClick(ad.id)}
        />
      ))}
    </div>
  );
};

export default AdsGrid;
