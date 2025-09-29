import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay?: number;
  color?: "cyan" | "pink" | "green";
}

export default function SkillBar({ skill, percentage, delay = 0, color = "cyan" }: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    cyan: "bg-cyan-400 shadow-cyan-400/50",
    pink: "bg-pink-400 shadow-pink-400/50",
    green: "bg-green-400 shadow-green-400/50"
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-mono uppercase tracking-wider neon-cyan">
          {skill}
        </span>
        <span className="text-sm font-mono neon-pink">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-none h-2 neon-border-cyan">
        <motion.div
          className={`h-full rounded-none ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${percentage}%` : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 10px ${color === 'cyan' ? '#00ffff' : color === 'pink' ? '#ff0080' : '#00ff00'}`
          }}
        />
      </div>
    </div>
  );
}
