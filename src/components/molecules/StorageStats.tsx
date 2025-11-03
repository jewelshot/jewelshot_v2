/**
 * Storage Stats (Molecule)
 * Display storage usage and limits
 */

'use client';

interface StorageStatsProps {
  used: number; // bytes
  limit: number; // bytes
  generationCount: number;
}

export function StorageStats({ used, limit, generationCount }: StorageStatsProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const usedPercentage = (used / limit) * 100;
  const isNearLimit = usedPercentage > 80;

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-white">Storage Used</span>
          <span className="text-gray-400">
            {formatSize(used)} / {formatSize(limit)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full transition-all duration-500 ${
              isNearLimit
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>

        {isNearLimit && (
          <p className="mt-2 text-xs text-orange-400">
            ⚠️ You&apos;re running low on storage space
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Generations */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-1 text-2xl font-bold text-white">{generationCount}</div>
          <div className="text-xs text-gray-400">AI Generations</div>
        </div>

        {/* Available Space */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-1 text-2xl font-bold text-white">{formatSize(limit - used)}</div>
          <div className="text-xs text-gray-400">Available</div>
        </div>
      </div>
    </div>
  );
}
