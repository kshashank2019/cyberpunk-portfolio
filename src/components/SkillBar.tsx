import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay?: number;
  color?: "cyan" | "pink" | "green";
}

export default function SkillBar({ skill, percentage, delay = 0 }: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-mono uppercase tracking-wider neon-cyan">
          {skill}
        </span>
        <span className="text-sm font-mono neon-cyan">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-none h-2 neon-border-cyan">
        <motion.div
          className={`h-full rounded-none bg-[var(--primary)]`}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 10px color-mix(in oklch, var(--primary) 45%, transparent)",
          }}
        />
      </div>
    </div>
  );
}