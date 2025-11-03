/**
 * Stat Card Component (Molecule)
 * Displays a statistic with label
 */

interface StatCardProps {
  value: string;
  label: string;
  suffix?: string;
}

export function StatCard({ value, label, suffix }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
        {value}
        {suffix && <span className="text-purple-400">{suffix}</span>}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}
