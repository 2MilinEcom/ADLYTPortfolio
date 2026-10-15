interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  delta: string;
  deltaPositive?: boolean;
}

const MetricCard = ({ icon, title, value, delta, deltaPositive }: MetricCardProps) => (
  <div className="bg-[#1F2A37] rounded-lg shadow-lg p-4 flex items-center gap-4 hover:shadow-2xl transition-shadow min-w-[200px] text-white">
    <div className="text-[#3B82F6] text-3xl">{icon}</div>
    <div className="flex-1">
      <div className="font-medium text-lg">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <span className={`px-2 py-1 rounded text-xs font-semibold ${deltaPositive ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"}`}>
      {delta}
    </span>
  </div>
);

export default MetricCard; 