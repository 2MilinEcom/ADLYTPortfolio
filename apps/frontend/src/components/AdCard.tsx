import { useState } from "react";
import { Star } from "lucide-react";

interface AdCardProps {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  isLiked: boolean;
  onLike: () => void;
  onClick: () => void;
}

const AdCard = ({ image, title, subtitle, isLiked, onLike, onClick }: AdCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
        
        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity duration-300" />
        )}
        
        {/* Star button */}
        <button
          onClick={handleStarClick}
          className="absolute top-3 right-3 transition-all duration-200"
        >
          <Star
            size={20}
            className={isLiked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
          />
        </button>
        
        {/* Learn more button (appears on hover) */}
        {isHovered && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900">
              learn more
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default AdCard;
