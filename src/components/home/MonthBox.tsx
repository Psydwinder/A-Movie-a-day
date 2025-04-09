'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface MonthBoxProps {
  month: string;
  index: number;
}

export default function MonthBox({ month, index }: MonthBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group aspect-square"
    >
      <Link href={`/month/${month.toLowerCase()}`}>
        <div className="absolute inset-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:-translate-y-1 flex flex-col items-center justify-center p-4">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
            {month}
          </h3>
          <div className="text-sm text-gray-500">Click to view movies</div>
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300" />
        </div>
      </Link>
    </motion.div>
  );
} 