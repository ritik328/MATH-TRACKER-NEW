export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
      <div 
        className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
