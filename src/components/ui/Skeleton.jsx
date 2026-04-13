export default function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'w-full h-4',
    circle: 'w-10 h-10 rounded-full',
    card: 'w-full h-32',
    chart: 'w-full h-64',
    text: 'w-3/4 h-3',
  };

  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="!w-20 !h-3" />
        <Skeleton variant="circle" className="!w-8 !h-8" />
      </div>
      <Skeleton className="!w-32 !h-7" />
      <Skeleton variant="text" className="!w-24" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-5 space-y-4">
      <Skeleton className="!w-28 !h-4" />
      <Skeleton variant="chart" />
    </div>
  );
}
