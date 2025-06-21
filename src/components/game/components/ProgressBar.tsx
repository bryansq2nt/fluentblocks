import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 a 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-green-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      />
    </div>
  );
} 