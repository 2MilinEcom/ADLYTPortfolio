
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardDetailProps {
  cardId: number;
  onBack: () => void;
}

const CardDetail = ({ cardId, onBack }: CardDetailProps) => {
  // Sample detail data - in a real app this would come from props or API
  const cardDetails = {
    1: {
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      title: "sant*Lab Creative Studio",
      description: "A modern creative studio focused on innovative design solutions and brand development.",
      metrics: {
        views: "2.5K",
        engagement: "12%",
        clicks: "156"
      }
    },
    // Add more details for other cards as needed
  };

  const details = cardDetails[cardId as keyof typeof cardDetails] || {
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
    title: "Ad Details",
    description: "Detailed information about this advertisement.",
    metrics: {
      views: "1.2K",
      engagement: "8%",
      clicks: "98"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={details.image}
              alt={details.title}
              className="w-full h-96 object-cover"
            />
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{details.title}</h1>
              <p className="text-gray-600 text-lg mb-8">{details.description}</p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{details.metrics.views}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{details.metrics.engagement}</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{details.metrics.clicks}</div>
                  <div className="text-sm text-gray-600">Clicks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
