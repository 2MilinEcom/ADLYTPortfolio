interface ChartPanelProps {
  title: string;
  children?: React.ReactNode;
}

const ChartPanel = ({ title, children }: ChartPanelProps) => (
  <div className="bg-[#1F2A37] rounded-lg p-6 shadow-lg flex flex-col min-w-[300px] min-h-[260px] text-white">
    <div className="font-semibold text-lg mb-4">{title}</div>
    <div className="flex-1 flex items-center justify-center w-full h-full">
      {children || (
        <svg width="180" height="80" className="block" style={{background:'none'}}>
          <line x1="40" y1="10" x2="40" y2="70" stroke="#374151" strokeWidth="2" />
          <line x1="40" y1="70" x2="160" y2="70" stroke="#374151" strokeWidth="2" />
          <circle cx="60" cy="50" r="4" fill="#3B82F6" />
          <circle cx="100" cy="30" r="4" fill="#3B82F6" />
          <circle cx="140" cy="60" r="4" fill="#3B82F6" />
        </svg>
      )}
    </div>
  </div>
);

export default ChartPanel; 