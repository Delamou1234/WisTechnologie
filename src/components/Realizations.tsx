import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, CheckCircle2, TrendingUp, Cpu, Server, Laptop, Smartphone } from 'lucide-react';

interface RealizationsProps {
  projects: Project[];
}

export const Realizations: React.FC<RealizationsProps> = ({ projects }) => {
  const [filter, setFilter] = useState<string>('Tout');

  const categories = ['Tout', 'Web', 'Mobile', 'Cloud & DevOps', 'IA & Data'];

  const filteredProjects = filter === 'Tout' 
    ? projects 
    : projects.filter(project => project.category === filter);

  // Helper to render type of icon for visual cards
  const getCategoryIcon = (category: string, className = '') => {
    switch (category) {
      case 'Web':
        return <Laptop className={className} size={20} />;
      case 'Mobile':
        return <Smartphone className={className} size={20} />;
      case 'Cloud & DevOps':
        return <Server className={className} size={20} />;
      case 'IA & Data':
        return <Cpu className={className} size={20} />;
      default:
        return <TrendingUp className={className} size={20} />;
    }
  };

  // Helper to get visual theme based on project imageKeyword
  const getProjectBg = (keyword: string) => {
    switch (keyword) {
      case 'workspace':
        return 'from-blue-900 to-indigo-950';
      case 'jewelry':
        return 'from-amber-950 to-stone-900';
      case 'turbine':
        return 'from-slate-900 to-teal-950';
      case 'server':
        return 'from-cyan-950 to-brand-950';
      default:
        return 'from-brand-900 to-brand-950';
    }
  };

  return (
    <section id="realizations" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-100 px-3.5 py-1.5 rounded-full inline-block">
              Études de Cas & Succès
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">
              Nos réalisations à fort impact
            </h2>
            <div className="w-12 h-1 bg-gold-500 rounded-full my-4" />
            <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
              Découvrez comment nous aidons nos clients à franchir des paliers technologiques majeurs grâce à des architectures sur-mesure et soignées.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 self-start md:self-end">
            {categories.map((cat) => (
              <button
                id={`filter-btn-${cat}`}
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  filter === cat 
                    ? 'bg-brand-800 text-white shadow-sm font-semibold' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                id={`project-card-${project.id}`}
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Visual Graphic Representation instead of broken image URLs */}
                <div className={`h-52 bg-gradient-to-br ${getProjectBg(project.imageKeyword)} p-8 relative flex flex-col justify-between text-white overflow-hidden`}>
                  {/* Absolute subtle mesh grids overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                  
                  {/* Decorative big background letters */}
                  <span className="absolute -bottom-8 -right-4 font-display font-extrabold text-9xl text-white/5 select-none uppercase tracking-tighter">
                    {project.category.split(' ')[0]}
                  </span>

                  <div className="flex justify-between items-start relative z-10">
                    <span className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-xs font-medium font-sans">
                      {getCategoryIcon(project.category, "text-gold-500")}
                      <span>{project.category}</span>
                    </span>

                    <span className="text-xs font-mono text-slate-300 bg-black/20 px-2.5 py-1 rounded-md border border-white/5 uppercase">
                      Client : {project.client}
                    </span>
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                        {project.title}
                      </h3>
                    </div>
                    
                    {/* Circle Pulse Metric */}
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 text-center shadow-lg transform group-hover:scale-105 transition-transform">
                      <span className="font-display font-extrabold text-xs text-gold-100">{project.metricValue}</span>
                    </div>
                  </div>
                </div>

                {/* Info and Results */}
                <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                      {project.description}
                    </p>

                    {/* Bold metric summary indicator */}
                    <div className="inline-flex items-center space-x-2.5 p-3 rounded-2xl bg-brand-50 border border-brand-100 text-brand-900 w-full">
                      <TrendingUp className="text-brand-600 flex-shrink-0" size={18} />
                      <div className="text-left">
                        <span className="block text-xs text-slate-500 font-medium leading-none">Indicateur Clé :</span>
                        <span className="text-sm font-bold font-sans">
                          <strong className="text-brand-800 text-base">{project.metricValue}</strong> {project.metricLabel}
                        </span>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Résultats Opérationnels
                      </h4>
                      <ul className="space-y-1.5">
                        {project.results.map((res, i) => (
                          <li key={i} className="flex items-start text-xs sm:text-sm text-slate-600 space-x-2">
                            <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="font-sans leading-tight">{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-slate-400">WisTechnologie Case Study</span>
                    <button
                      id={`project-cta-${project.id}`}
                      onClick={() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-800 hover:text-brand-950 hover:underline transition-all cursor-pointer"
                    >
                      <span>En savoir plus sur ce projet</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
