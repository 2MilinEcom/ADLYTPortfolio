interface SpotlightCardProps {
  image: string;
  overlayText: string;
  button: string;
}

const SpotlightCard = ({ image, overlayText, button }: SpotlightCardProps) => (
  <div className="relative w-full h-[350px] rounded-xl overflow-hidden group cursor-pointer shadow-xl" style={{background:'#181818', boxShadow:'0 4px 12px #333333'}}>
    <img src={image} alt={overlayText} className="absolute inset-0 w-full h-full object-cover object-center z-0 group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute inset-0" style={{background:'linear-gradient(rgba(20,20,20,0.7), rgba(20,20,20,0.3))'}} />
    <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">
      <span className="text-2xl font-bold mb-4" style={{fontFamily:'Inter, sans-serif', color:'#FFFFFF'}}>{overlayText}</span>
      <button className="px-8 py-2 rounded-full font-semibold shadow-lg hover:scale-110 transition-transform" style={{background:'#E50914', color:'#FFFFFF', fontFamily:'Inter, sans-serif', borderRadius:'8px', boxShadow:'0 4px 12px #333333'}}>{button}</button>
    </div>
  </div>
);

export default SpotlightCard; 