import { motion, useScroll, useTransform } from "framer-motion";
import { Download, Github, Linkedin, Mail, MapPin, ChevronDown, Briefcase, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import ContactForm from "@/components/ContactForm";
import CyberButton from "@/components/CyberButton";
import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import SkillBar from "@/components/SkillBar";
import VariableProximity from "@/components/VariableProximity";
import ThreeScene from "@/components/ThreeScene";
import Spline from "@splinetool/react-spline";
import ProjectsCarousel from "@/components/ProjectsCarousel";

export default function Landing() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Add: aggressively hide Spline watermark and force transparent background at runtime (hardened with MutationObserver + shadow DOM scan)
  useEffect(() => {
    const hideEl = (el: Element) => {
      const elh = el as HTMLElement;
      elh.style.setProperty("display", "none", "important");
      elh.style.setProperty("pointer-events", "none", "important");
      elh.style.setProperty("opacity", "0", "important");
      elh.setAttribute("aria-hidden", "true");
    };

    const makeTransparent = (el: Element) => {
      const elh = el as HTMLElement;
      elh.style.setProperty("background", "transparent", "important");
      elh.style.setProperty("background-color", "transparent", "important");
    };

    const runOnce = (root: ParentNode) => {
      const selectors = [
        ".spline-watermark",
        '[class*="watermark"]',
        '[aria-label*="Spline"]',
        'a[href*="spline.design"]',
      ];
      selectors.forEach((sel) => {
        root.querySelectorAll(sel).forEach(hideEl);
      });
      root.querySelectorAll(".spline-wrapper canvas, canvas").forEach(makeTransparent);
      root.querySelectorAll(".spline-wrapper, .spline-wrapper *").forEach(makeTransparent);
    };

    // Scan regular DOM
    const hideAll = () => {
      runOnce(document);

      // Scan shadow roots as well
      const allWithShadow = document.querySelectorAll<HTMLElement>("*");
      allWithShadow.forEach((el) => {
        const sr = (el as any).shadowRoot as ShadowRoot | undefined;
        if (sr) runOnce(sr);
      });
    };

    hideAll();

    // Keep enforcing for a while in case of delayed injection
    const intervalId = window.setInterval(hideAll, 300);

    // Observe DOM mutations to react instantly
    const observer = new MutationObserver(hideAll);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Run longer to catch deferred loads; clear on unmount
    const timeoutId = window.setTimeout(() => {
      clearInterval(intervalId);
      observer.disconnect();
    }, 30000); // 30s

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const skills = [
    { name: "React.js", percentage: 90, color: "pink" as const },
    { name: "Angular", percentage: 80, color: "cyan" as const },
    { name: "TypeScript / JavaScript (ES6+)", percentage: 90, color: "cyan" as const },
    { name: "REST API Integration", percentage: 88, color: "pink" as const },
    { name: "DevOps: AWS, Docker, CI/CD", percentage: 85, color: "green" as const },
    { name: "Microservices & Cloud-aware Architectures", percentage: 80, color: "green" as const },
  ];

  const projects = [
    {
      title: "Jai Balaji Promoters (Freelance)",
      description: "Designed and delivered a fast, SEO-friendly real estate website with clean IA, responsive layouts, and optimized assets. Focused on discoverability, performance, and clear lead capture.",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop",
      demoUrl: "https://www.jaibalajipromoters.com/",
      technologies: ["React", "TypeScript", "Tailwind", "SEO", "Responsive"]
    },
    {
      title: "Cyberpunk Portfolio",
      description: "A modern, dark-only portfolio showcasing projects, skills, and animations. Built with React 19, TypeScript, Tailwind v4, Shadcn UI, and Framer Motion—focused on performance, accessibility, and cohesive theming.",
      image: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=600&h=400&fit=crop",
      demoUrl: "/",
      technologies: ["React", "TypeScript", "Tailwind", "Shadcn UI", "Framer Motion", "AWS"]
    },
    {
      title: "CNN (Warner Bros Discovery) – Platform Contributions",
      description: "Contributed small UI improvements and performance tweaks to cnn.com via my role at Cognizant. Focused on incremental front-end refinements within established patterns and reviews.",
      image: "https://images.pexels.com/photos/54278/pexels-photo-54278.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
      demoUrl: "https://www.cnn.com/",
      technologies: ["React", "TypeScript", "Performance", "Accessibility", "CI/CD"]
    }
  ];

  // Extend project data with phase/progress/tags required by the carousel (non-breaking defaults)
  const mappedProjects = projects.map((p, i) => {
    const defaultPhases: Array<string> = ["PHASE I", "PHASE II", "PHASE III", "PHASE II", "PHASE I"];
    const defaultProgress: Array<number> = [65, 42, 89, 51, 78];
    return {
      title: p.title,
      description: p.description,
      image: p.image,
      phase: defaultPhases[i % defaultPhases.length],
      progress: defaultProgress[i % defaultProgress.length],
      techTags: p.technologies,
      demoUrl: p.demoUrl, // Add: pass through link
    };
  });

  // Add: Scroll-stacking card component and data just before the Experience section render
  const experienceItems = [
    {
      title: "Cognizant — Internship (Campus Placement)",
      subtitle: "Domain: Angular | Feb 2023 – Jul 2023 (Training)",
      description:
        "Completed a rigorous 6-month training program covering modern frontend fundamentals, structured problem-solving, and delivery etiquette. Cleared multiple internal assessments to secure a full-time role.",
      highlights: [
        "Built 3 mini-projects: dashboard UI, form flows, and API-driven lists with pagination",
        "Learned component composition, state management patterns, and semantic HTML",
        "Shipped clean, testable code with attention to accessibility and performance",
      ],
      tools: ["Angular", "TypeScript", "RxJS", "CSS", "REST"],
    },
    {
      title: "Cognizant — Software Engineer Trainee",
      subtitle: "Shifted Domain: React | Sep 2023 – Now",
      description:
        "Transitioned from Angular to React to align with product needs, focusing on scalable frontends, predictable CI/CD, and API integration that's easy to maintain.",
      highlights: [
        "Migrated legacy UI modules to React with improved structure and reusability",
        "Established shared UI primitives and patterns to reduce code duplication",
        "Collaborated with backend to harden contracts and reduce integration bugs",
      ],
      tools: ["React", "TypeScript", "Vite", "Tailwind", "REST", "Jest"],
    },
    {
      title: "Promotion — Software Engineer",
      subtitle: "After 1 Year",
      description:
        "Promoted based on delivery quality, ownership, and consistent collaboration. Led UI slices end-to-end with strong code reviews and developer experience improvements.",
      highlights: [
        "Owned feature delivery from spec to release with tight feedback loops",
        "Improved DX with lint rules, PR templates, and module conventions",
        "Mentored peers on component patterns and performance best practices",
      ],
      tools: ["React", "TypeScript", "ESLint/Prettier", "CI/CD", "Storybook"],
    },
    {
      title: "Project — Warner Bros (CNN US)",
      subtitle: "Stack: React.js, AWS",
      description:
        "Contributed to a high-traffic news experience for CNN US under the Warner Bros account, focusing on reliable UI performance and clean data flows.",
      highlights: [
        "Implemented performant article and feed views with predictable rendering",
        "Optimized assets and interactions for fast, accessible reading experiences",
        "Partnered with platform and QA teams to keep releases stable and on-time",
      ],
      tools: ["React", "TypeScript", "AWS", "CI/CD", "Accessibility", "Perf"],
    },
  ];

  function ExperienceCard({
    item,
    index,
  }: {
    item: {
      title: string;
      subtitle: string;
      description: string;
      highlights: string[];
      tools: string[];
    };
    index: number;
  }) {
    return (
      <motion.div
        style={{ zIndex: index + 1, willChange: "transform, opacity", filter: "none" }}
        className="sticky top-20 will-change-transform neon-border-cyan bg-black p-5 md:p-6 noise"
        initial={{ opacity: 0, y: 50, scale: 0.985, filter: "blur(1px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.7 }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 22,
          mass: 0.6,
          filter: { duration: 0.5, ease: "easeOut" },
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-xl font-bold">{item.title}</h3>
        </div>
        <p className="text-sm text-gray-400 font-mono mb-3">{item.subtitle}</p>

        <p className="text-gray-300 font-mono leading-relaxed mb-4">
          {item.description}
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h4 className="text-sm font-bold tracking-wider neon-cyan mb-2">Key Contributions</h4>
            <motion.ul
              className="space-y-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {item.highlights.map((point, i) => (
                <motion.li
                  key={i}
                  className="text-[13px] text-gray-300 font-mono leading-relaxed flex gap-2"
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                >
                  <span
                    className="mt-[7px] h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "color-mix(in oklch, var(--primary) 70%, transparent)" }}
                  />
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-wider neon-cyan mb-2">Stack</h4>
            <div className="flex flex-wrap gap-2">
              {item.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-1 text-xs font-mono neon-border-cyan neon-cyan"
                  style={{ backgroundColor: "color-mix(in oklch, var(--primary) 10%, transparent)" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Add: scroll-triggered parallax for hero text and model
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroModelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start end", "end start"],
  });
  const textY = useTransform(heroProgress, [0, 1], [0, -60]);
  const modelY = useTransform(heroProgress, [0, 1], [0, 60]);
  const textOpacity = useTransform(heroProgress, [0, 0.2, 1], [1, 0.9, 0.7]);
  const modelOpacity = useTransform(heroProgress, [0, 0.2, 1], [1, 0.9, 0.7]);

  return (
    <div className={`min-h-screen`}>
      <div className="cyber-grid noise">
        <Navigation />
        
        {/* Hero Section */}
        <section
          id="home"
          ref={heroSectionRef}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="scan-lines absolute inset-0" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 items-center lg:grid-cols-2">
            {/* Text column */}
            <motion.div
              ref={heroTextRef}
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                y: textY,
                opacity: textOpacity,
                willChange: "transform, opacity",
              }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 chromatic glitch"
                data-text="SHASHANK K"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="neon-cyan">SHASHANK</span>{" "}
                <span className="neon-pink">K</span>
              </motion.h1>
              
              <motion.h2
                className="text-2xl md:text-3xl font-mono mb-4 neon-green"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                &gt; SOFTWARE ENGINEER_
              </motion.h2>
              
              <motion.p
                className="text-lg text-gray-300 mb-8 font-mono leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                I design and ship frontends that feel fast, read clean, and scale well.
                <br />
                Strong in React + TypeScript, AWS, integrations over REST, and delivery via CI/CD.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <CyberButton 
                  variant="cyan" 
                  size="lg"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                >
                  VIEW PROJECTS
                </CyberButton>
                <CyberButton 
                  variant="pink" 
                  size="lg"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  CONTACT ME
                </CyberButton>
              </motion.div>
            </motion.div>

            {/* 3D Spline Model */}
            <motion.div
              ref={heroModelRef}
              className="relative h-[320px] sm:h-[380px] lg:h-[460px] overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                y: modelY,
                opacity: modelOpacity,
                willChange: "transform, opacity",
              }}
            >
              <div className="absolute inset-0 spline-wrapper" style={{ background: "transparent" }}>
                <Spline scene="https://prod.spline.design/gRKAcNab5pso6f9S/scene.splinecode" />
              </div>
            </motion.div>
          </div>

          {/* Add scroll down indicator */}
          <motion.button
            aria-label="Scroll to About"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulsing halo */}
            <motion.div
              className="absolute w-16 h-16 rounded-full"
              style={{ boxShadow: "0 0 0 2px color-mix(in oklch, var(--primary) 40%, transparent)" }}
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.35, 0.15, 0.35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Rotating dashed ring */}
            <motion.div
              className="relative w-14 h-14 rounded-full"
              style={{
                border: "1px dashed color-mix(in oklch, var(--primary) 55%, transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* Chevrons container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <motion.div
                initial={{ y: -6, opacity: 0.2 }}
                animate={{ y: [ -6, 4, 10 ], opacity: [0.2, 0.85, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-muted-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
              <motion.div
                initial={{ y: -4, opacity: 0.15 }}
                animate={{ y: [ -4, 6, 12 ], opacity: [0.15, 0.75, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
              <motion.div
                initial={{ y: -2, opacity: 0.1 }}
                animate={{ y: [ -2, 8, 14 ], opacity: [0.1, 0.65, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
            {/* Optional hint (desktop only) */}
            <motion.span
              className="absolute -bottom-6 text-[10px] tracking-widest uppercase text-muted-foreground hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll
            </motion.span>
          </motion.button>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 neon-cyan glitch"
              data-text="ABOUT.EXE"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              ABOUT.EXE
            </motion.h2>
            
            <div className="grid grid-cols-1 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {(() => {
                  const proximityRef = useRef<HTMLDivElement>(null);
                  return (
                    <div ref={proximityRef}>
                      <p className="text-lg text-gray-300 mb-8 font-mono leading-relaxed">
                        <VariableProximity
                          label={"I build product-focused frontends that optimize for clarity, speed, and maintainability. My work often involves shaping component systems, hardening API edges, and streamlining delivery pipelines."}
                          className={"[font-variation-settings:'wght'_400,'opsz'_9]"}
                          fromFontVariationSettings="'wght' 400, 'opsz' 9"
                          toFontVariationSettings="'wght' 900, 'opsz' 36'"
                          containerRef={proximityRef}
                          radius={140}
                          falloff="linear"
                        />
                      </p>

                      <p className="text-lg text-gray-300 mb-8 font-mono leading-relaxed">
                        <VariableProximity
                          label={"Recent focus: React micro-frontends, TypeScript-first codebases, and resilient REST integrations—paired with CI/CD and basic infra to keep releases predictable."}
                          className={"[font-variation-settings:'wght'_400,'opsz'_9]"}
                          fromFontVariationSettings="'wght' 400, 'opsz' 9"
                          toFontVariationSettings="'wght' 900, 'opsz' 36'"
                          containerRef={proximityRef}
                          radius={140}
                          falloff="linear"
                        />
                      </p>
                    </div>
                  );
                })()}
                
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill.name}
                      percentage={skill.percentage}
                      delay={index * 200}
                      color={skill.color}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center lg:text-left">
                  <CyberButton 
                    variant="green" 
                    size="md"
                    href="/resume.pdf"
                    target="_blank"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD RESUME
                  </CyberButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 neon-cyan glitch"
              data-text="EXPERIENCE.LOG"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              EXPERIENCE.LOG
            </motion.h2>

            {/* One-at-a-time stacked sticky cards */}
            <div className="relative">
              {experienceItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`${index === 0 ? 'pt-0' : '-mt-40'} h-[90vh]`}
                >
                  <ExperienceCard item={item} index={index} />
                </div>
              ))}
              {/* Spacer so last sticky card can scroll off */}
              <div className="h-[40vh]" />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 neon-pink glitch"
              data-text="PROJECTS.DIR"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              PROJECTS.DIR
            </motion.h2>

            {/* Replace grid with the new carousel */}
            <ProjectsCarousel items={mappedProjects} />
          </div>
        </section>

        {/* Hire Me Section (replaces Contact) */}
        <section id="hire" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 neon-cyan glitch"
              data-text="HIRE_ME.SYS"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              HIRE_ME.SYS
            </motion.h2>

            {/* Styled floating panel */}
            <div
              className="relative mx-auto w-full max-w-5xl rounded-2xl border neon-border-cyan bg-[#070707]/80 p-0 overflow-hidden"
              style={{
                boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Decorative header strip */}
              <div className="relative h-10 border-b neon-border-cyan">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklch, var(--primary) 10%, transparent), transparent)",
                  }}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-mono tracking-widest text-gray-400">
                  ENIGMA://HIRE_WINDOW
                </div>
              </div>

              {/* Subtle grid background overlay */}
              <div className="relative">
                <div className="cyber-grid absolute inset-0 opacity-[0.08] pointer-events-none" />
                <div className="relative p-5 sm:p-6 md:p-8 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
                    {/* Left column: Let's collaborate & contacts */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="w-full"
                    >
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 neon-pink">
                        Let's collaborate
                      </h3>

                      <p className="text-gray-300 mb-6 sm:mb-8 font-mono leading-relaxed text-sm sm:text-base">
                        Have a product idea or a feature that needs to be shipped with quality?
                        I work end-to-end on frontend delivery—architecture, integration, and polish.
                      </p>

                      <div className="space-y-3 sm:space-y-4">
                        <motion.a
                          href="mailto:kshashank2019@gmail.com"
                          className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg border neon-border-cyan px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/5"
                          whileHover={{ x: 6 }}
                        >
                          <span className="flex min-w-0 items-center gap-2 sm:gap-3 text-[var(--primary)]">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <span className="font-mono truncate text-sm sm:text-base">kshashank2019@gmail.com</span>
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-90 opacity-70 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                        </motion.a>

                        <motion.a
                          href="tel:+917993460466"
                          className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg border neon-border-cyan px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/5"
                          whileHover={{ x: 6 }}
                        >
                          <span className="flex min-w-0 items-center gap-2 sm:gap-3 text-[var(--primary)]">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <span className="font-mono truncate text-sm sm:text-base">+91 7993460466</span>
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-90 opacity-70 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                        </motion.a>

                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                          <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg border neon-border-cyan px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/5"
                            whileHover={{ x: 6 }}
                          >
                            <span className="flex min-w-0 items-center gap-2 sm:gap-3 text-[var(--primary)]">
                              <Github className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                              <span className="font-mono truncate text-sm sm:text-base">github.com</span>
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-90 opacity-70 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                          </motion.a>

                          <motion.a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg border neon-border-cyan px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:bg-white/5"
                            whileHover={{ x: 6 }}
                          >
                            <span className="flex min-w-0 items-center gap-2 sm:gap-3 text-[var(--primary)]">
                              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                              <span className="font-mono truncate text-sm sm:text-base">linkedin.com</span>
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 -rotate-90 opacity-70 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                          </motion.a>
                        </div>

                        <motion.div
                          className="flex items-center gap-2 sm:gap-3 text-gray-400"
                          whileHover={{ x: 6 }}
                        >
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span className="font-mono text-sm sm:text-base">India</span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Right column: Why/Availability/CTA */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-4 sm:space-y-5 w-full"
                    >
                      <div className="rounded-lg neon-border-cyan p-4 sm:p-5 bg-black/30">
                        <h4 className="text-base sm:text-lg font-bold mb-2 neon-cyan">Why Hire Me</h4>
                        <ul className="list-disc list-inside text-gray-300 font-mono space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                          <li>React + TypeScript expert with performance-first mindset</li>
                          <li>Clean, scalable UI architecture and reusable component systems</li>
                          <li>Strong REST integrations and CI/CD delivery discipline</li>
                        </ul>
                      </div>

                      <div className="rounded-lg neon-border-cyan p-4 sm:p-5 bg-black/30">
                        <h4 className="text-base sm:text-lg font-bold mb-2 neon-cyan">Availability</h4>
                        <p className="text-gray-300 font-mono text-sm sm:text-base">
                          Open to freelance and full-time opportunities. Let's discuss scope, timelines, and outcomes.
                        </p>
                      </div>

                      <div className="pt-0.5">
                        <CyberButton
                          variant="cyan"
                          size="md"
                          href="mailto:kshashank2019@gmail.com"
                          className="w-full md:w-auto"
                        >
                          CONTACT VIA EMAIL
                        </CyberButton>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t neon-border-cyan">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400 font-mono text-sm">
                © 2024 Shashank K. Coded in the cyberpunk future.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}