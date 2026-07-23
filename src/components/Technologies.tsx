import React from 'react';
import { motion } from 'motion/react';
import {
  Atom,
  FileCode2,
  Server,
  Terminal,
  Database,
  Container,
  Boxes,
  Webhook,
  Palette,
  BrainCircuit,
  Cloud,
  GitBranch
} from 'lucide-react';

const TECHNOLOGIES = [
  { name: 'React', icon: Atom },
  { name: 'TypeScript', icon: FileCode2 },
  { name: 'Node.js', icon: Server },
  { name: 'Python', icon: Terminal },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Docker', icon: Container },
  { name: 'Kubernetes', icon: Boxes },
  { name: 'REST & GraphQL', icon: Webhook },
  { name: 'Tailwind CSS', icon: Palette },
  { name: 'IA & LLM', icon: BrainCircuit },
  { name: 'Cloud (AWS/GCP)', icon: Cloud },
  { name: 'Git & CI/CD', icon: GitBranch }
];

export const Technologies: React.FC = () => {
  return (
    <section id="technologies" className="py-24 bg-brand-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-gold-500 uppercase bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full inline-block">
            Notre Stack Technique
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Les technologies qui propulsent vos projets
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed">
            Nous choisissons des outils modernes, robustes et éprouvés en production pour livrer des solutions performantes, sécurisées et évolutives.
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {TECHNOLOGIES.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 group-hover:scale-110 group-hover:bg-gold-500/10 transition-all duration-300">
                <tech.icon size={22} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 text-center leading-tight">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
