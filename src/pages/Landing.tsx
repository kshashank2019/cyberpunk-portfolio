import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, MapPin, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import ContactForm from "@/components/ContactForm";
import CyberButton from "@/components/CyberButton";
import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import SkillBar from "@/components/SkillBar";
import VariableProximity from "@/components/VariableProximity";

export default function Landing() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

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
      title: "Cyberpunk Dashboard",
      description: "A futuristic admin dashboard with real-time data visualization and neon aesthetics.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      technologies: ["React", "TypeScript", "Three.js", "Tailwind"]
    },
    {
      title: "Neural Network Visualizer",
      description: "Interactive 3D visualization of neural networks with real-time training data.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      technologies: ["Python", "TensorFlow", "WebGL", "D3.js"]
    },
    {
      title: "Blockchain Explorer",
      description: "Decentralized application for exploring blockchain transactions with cyberpunk UI.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      technologies: ["Solidity", "Web3.js", "React", "Ethereum"]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="cyber-grid noise">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="scan-lines absolute inset-0" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
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
                Software Engineer at Cognizant with 2+ years building scalable enterprise web apps and microservices.
                <br />
                React-focused, with strong REST integrations, CI/CD, and cloud-aware architecture experience.
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
          </div>

          {/* Add scroll down indicator */}
          <motion.button
            aria-label="Scroll to About"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center p-3 rounded-full neon-border-cyan text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown className="w-6 h-6" />
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
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="aspect-square neon-border-pink overflow-hidden mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Shashank K"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="scan-lines absolute inset-0" />
                </div>
                
                <div className="text-center">
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
                          label={"I'm a Software Engineer at Cognizant with 2+ years of experience delivering scalable, enterprise-grade web applications and microservices. I've led React.js development for a real-time news platform, integrated robust REST APIs, and worked hands-on with CI/CD and containerization."}
                          className={"[font-variation-settings:'wght'_400,'opsz'_9]"}
                          fromFontVariationSettings="'wght' 400, 'opsz' 9"
                          toFontVariationSettings="'wght' 900, 'opsz' 36"
                          containerRef={proximityRef}
                          radius={140}
                          falloff="linear"
                        />
                      </p>

                      <p className="text-lg text-gray-300 mb-8 font-mono leading-relaxed">
                        <VariableProximity
                          label={"Previously a Frontend Intern (Angular), I transitioned into React full-time. I value clean, maintainable code, secure systems design, and collaborative delivery across teams."}
                          className={"[font-variation-settings:'wght'_400,'opsz'_9]"}
                          fromFontVariationSettings="'wght' 400, 'opsz' 9"
                          toFontVariationSettings="'wght' 900, 'opsz' 36"
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
              </motion.div>
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  {...project}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 neon-cyan glitch"
              data-text="CONTACT.SYS"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              CONTACT.SYS
            </motion.h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-8 neon-pink">
                  Let's Connect in Cyberspace
                </h3>
                
                <p className="text-gray-300 mb-8 font-mono leading-relaxed">
                  Ready to build something impactful? Reach out and let's discuss opportunities.
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="mailto:kshashank2019@gmail.com"
                    className="flex items-center space-x-3 text-cyan-400 hover:neon-cyan transition-all duration-300"
                    whileHover={{ x: 10 }}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-mono">kshashank2019@gmail.com</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    className="flex items-center space-x-3 text-pink-400 hover:neon-pink transition-all duration-300"
                    whileHover={{ x: 10 }}
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-mono">github.com</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    className="flex items-center space-x-3 text-green-400 hover:neon-green transition-all duration-300"
                    whileHover={{ x: 10 }}
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-mono">linkedin.com</span>
                  </motion.a>
                  
                  <motion.div
                    className="flex items-center space-x-3 text-gray-400"
                    whileHover={{ x: 10 }}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-mono">India</span>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <ContactForm />
              </motion.div>
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