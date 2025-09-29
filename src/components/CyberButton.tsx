import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "pink" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  target?: string;
}

export default function CyberButton({
  children,
  onClick,
  variant = "cyan",
  size = "md",
  className = "",
  href,
  target,
}: CyberButtonProps) {
  const baseClasses = "relative overflow-hidden font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variantClasses = {
    cyan: "neon-border-cyan neon-cyan hover:bg-cyan-500/10",
    pink: "neon-border-pink neon-pink hover:bg-pink-500/10",
    green: "neon-border-green neon-green hover:bg-green-500/10"
  };

  const Component = href ? motion.a : motion.button;
  const props = href ? { href, target } : { onClick };

  return (
    <Component
      {...props}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    </Component>
  );
}
