interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
}

export default function StatsCard({ label, value, icon, change }: StatsCardProps) {
  return (
    <div className="bg-white border border-apple-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-apple-text-secondary">{label}</span>
        <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center text-apple-blue">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold text-apple-text">{value}</div>
      {change && <p className="text-xs text-apple-text-secondary mt-1">{change}</p>}
    </div>
  );
}
