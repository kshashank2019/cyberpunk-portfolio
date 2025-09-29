import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import CyberButton from "./CyberButton";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Message sent successfully! I'll get back to you soon.", {
      style: {
        background: "#000",
        border: "1px solid #00ffff",
        color: "#00ffff"
      }
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg mx-auto"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider neon-cyan mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-black/50 neon-border-cyan p-3 font-mono text-cyan-400 focus:outline-none focus:shadow-lg focus:shadow-cyan-400/50 transition-all duration-300"
          placeholder="Enter your name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider neon-pink mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-black/50 neon-border-pink p-3 font-mono text-pink-400 focus:outline-none focus:shadow-lg focus:shadow-pink-400/50 transition-all duration-300"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider neon-green mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-black/50 neon-border-green p-3 font-mono text-green-400 focus:outline-none focus:shadow-lg focus:shadow-green-400/50 transition-all duration-300 resize-none"
          placeholder="Enter your message"
        />
      </div>
      
      <CyberButton 
        variant="cyan" 
        size="lg"
        className="w-full"
        onClick={() => {}}
      >
        {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
      </CyberButton>
    </motion.form>
  );
}
