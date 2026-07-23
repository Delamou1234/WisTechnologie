import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Formation } from '../types';
import { BookOpen, Clock, Award, Star, ArrowRight, CheckCircle2, User, HelpCircle, X } from 'lucide-react';

interface FormationsProps {
  formations: Formation[];
}

export const Formations: React.FC<FormationsProps> = ({ formations }) => {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermédiaire':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Avancé':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-brand-50 text-brand-700 border-brand-100';
    }
  };

  const getThemeBg = (keyword: string) => {
    switch (keyword) {
      case 'server':
        return 'from-blue-900 to-indigo-950';
      case 'turbine':
        return 'from-slate-900 to-teal-950';
      case 'workspace':
        return 'from-cyan-950 to-brand-950';
      default:
        return 'from-slate-900 to-brand-900';
    }
  };

  return (
    <section id="formations" className="py-24 bg-white relative">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000002_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-50 px-3.5 py-1.5 rounded-full inline-block">
            Formations & Transfert de Compétences
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">
            Montez en compétences avec nos experts
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed">
            Nous transmettons notre savoir-faire technique pragmatique aux équipes d'ingénieurs à travers des sessions intensives de formation et de pair-programming.
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formations.map((form, index) => (
            <motion.div
              id={`formation-card-${form.id}`}
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 border border-slate-100 hover:border-brand-200 rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-all hover:shadow-md cursor-pointer group"
              onClick={() => setSelectedFormation(form)}
            >
              <div className="space-y-6">
                {/* Visual Header */}
                <div className={`h-36 bg-gradient-to-br ${getThemeBg(form.imageKeyword)} rounded-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden`}>
                  <BookOpen className="absolute -bottom-4 -right-4 text-white/5" size={100} />
                  
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 border rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold ${getLevelBadgeColor(form.level)}`}>
                      Niveau {form.level}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 flex items-center space-x-1 bg-black/20 px-2 py-0.5 rounded">
                      <Clock size={10} className="text-gold-500" />
                      <span>{form.duration}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg leading-snug tracking-tight">
                    {form.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 font-sans text-sm leading-relaxed text-left line-clamp-3">
                  {form.description}
                </p>

                {/* Highlighted Syllabus Bullet Points (Preview) */}
                <div className="space-y-2 text-left">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Aperçu du Syllabus</span>
                  <ul className="space-y-1.5">
                    {form.syllabus.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-500 font-medium">
                        <CheckCircle2 size={13} className="text-gold-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono">
                <div className="text-left">
                  <span className="block text-slate-400 font-semibold">Tarif de référence</span>
                  <span className="text-sm font-bold text-brand-900">{form.price}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-brand-700 font-bold group-hover:text-brand-900 group-hover:underline">
                  <span>Syllabus complet</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Syllabus Modal Detail View */}
      <AnimatePresence>
        {selectedFormation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              id="formation-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFormation(null)}
              className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              id="formation-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-slate-100"
            >
              {/* Graphic Header banner */}
              <div className={`bg-gradient-to-r ${getThemeBg(selectedFormation.imageKeyword)} p-8 text-white relative text-left`}>
                <button
                  id="close-formation-modal"
                  onClick={() => setSelectedFormation(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>

                <span className="px-2.5 py-1 bg-white/15 border border-white/10 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold">
                  Niveau {selectedFormation.level}
                </span>

                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-3">
                  {selectedFormation.title}
                </h3>

                <div className="flex items-center space-x-6 mt-4 font-mono text-xs text-slate-200">
                  <span className="flex items-center space-x-1">
                    <Clock size={13} className="text-gold-500" />
                    <span>Durée : {selectedFormation.duration}</span>
                  </span>
                  <span>•</span>
                  <span>Instructeur : {selectedFormation.instructor}</span>
                </div>
              </div>

              {/* Syllabus Scroll Area */}
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto text-left">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Objectif de la formation</h4>
                  <p className="text-slate-700 font-sans text-base leading-relaxed">
                    {selectedFormation.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Programme & Chapitres clés</h4>
                  <div className="space-y-2.5">
                    {selectedFormation.syllabus.map((chapter, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="w-6 h-6 rounded-full bg-brand-800 text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-800 font-sans leading-relaxed">{chapter}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Registration quote panel */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left font-mono">
                    <span className="block text-xs font-semibold text-slate-500">Tarification standard</span>
                    <span className="text-base font-extrabold text-brand-900">{selectedFormation.price} / apprenant</span>
                  </div>
                  
                  <button
                    id="register-formation-btn"
                    onClick={() => {
                      setSelectedFormation(null);
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Demander une convention</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
