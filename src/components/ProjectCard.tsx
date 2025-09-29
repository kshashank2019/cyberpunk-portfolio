import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import CyberButton from "./CyberButton";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  index: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  githubUrl,
  demoUrl,
  technologies,
  index
}: ProjectCardProps) {
  return (
    <motion.div
      className="relative group neon-border-cyan bg-black/50 overflow-hidden noise"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="scan-lines absolute inset-0 z-10" />
      
      <div className="relative z-20 p-6">
        <div className="aspect-video mb-4 overflow-hidden neon-border-pink">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <h3 className="text-xl font-bold mb-2 neon-cyan glitch" data-text={title}>
          {title}
        </h3>
        
        <p className="text-gray-300 mb-4 font-mono text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, i) => (
            <span 
              key={i}
              className="px-2 py-1 text-xs font-mono neon-border-green neon-green bg-green-500/10"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {githubUrl && (
            <CyberButton 
              variant="cyan" 
              size="sm"
              href={githubUrl}
              target="_blank"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </CyberButton>
          )}
          {demoUrl && (
            <CyberButton 
              variant="pink" 
              size="sm"
              href={demoUrl}
              target="_blank"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Demo
            </CyberButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
