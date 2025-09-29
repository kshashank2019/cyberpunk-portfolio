import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "cyan" | "pink" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export default function CyberButton({
  children,
  onClick,
  variant = "cyan",
  size = "md",
  className = "",
  href,
  target,
  rel,
}: CyberButtonProps) {
  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer";
  
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

  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Use whichever element is rendered
    const root = (anchorRef.current ?? buttonRef.current) as HTMLElement | null;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.borderRadius = "9999px";
    ripple.style.background =
      "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.20) 30%, rgba(56,189,248,0.08) 60%, rgba(56,189,248,0.0) 70%)";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "scale(0.2)";
    ripple.style.opacity = "0.8";
    ripple.style.transition = "transform 500ms ease, opacity 600ms ease";
    ripple.style.zIndex = "0";

    root.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = "scale(1)";
      ripple.style.opacity = "0";
    });

    setTimeout(() => {
      root.contains(ripple) && root.removeChild(ripple);
    }, 650);
  };

  // Use explicit branching for anchor/button to satisfy strict ref typing

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        ref={anchorRef}
        onMouseDown={handleMouseDown}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, y: 1 }}
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
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, y: 1 }}
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
    </motion.button>
  );
}