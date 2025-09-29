import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "about", label: "ABOUT" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "projects", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b neon-border-cyan"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 -1px 0 color-mix(in oklch, var(--primary) 40%, transparent)",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--primary)]"
        style={{ width: `${progress}%` }}
        initial={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="text-xl font-bold neon-cyan glitch cursor-pointer relative"
            data-text="<DEV/>"
            onClick={() => scrollToSection("home")}
            whileHover={{ scale: 1.08, rotate: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            &lt;DEV/&gt;
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative font-mono text-sm tracking-wider transition-all duration-300 text-gray-300 hover:neon-cyan px-1"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={isActive ? "neon-pink" : ""}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px]"
                      style={{
                        background:
                          "linear-gradient(90deg, color-mix(in oklch, var(--primary) 0%, transparent), var(--primary), color-mix(in oklch, var(--primary) 0%, transparent))",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            className="md:hidden relative inline-flex items-center justify-center w-10 h-10 neon-border-cyan"
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute block h-[2px] w-5 bg-[var(--primary)]"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 0 : -4 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute block h-[2px] w-5 bg-[var(--primary)]"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute block h-[2px] w-5 bg-[var(--primary)]"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 0 : 4 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden bg-black/70 backdrop-blur-sm border-t neon-border-cyan"
        >
          <div className="px-4 py-3 flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left w-full px-2 py-2 rounded-sm font-mono text-sm ${
                    isActive ? "neon-pink" : "text-gray-300 hover:neon-cyan"
                  }`}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}