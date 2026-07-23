import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES_DATA } from '../data';
import { Service } from '../types';
import { LucideIcon } from './LucideIcon';
import { X, ArrowRight, Check } from 'lucide-react';

interface ServicesProps {
  services?: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const activeServices = services && services.length > 0 ? services : SERVICES_DATA;

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-50 px-3.5 py-1.5 rounded-full inline-block">
            Nos Domaines d'Expertise
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">
            Des services technologiques sur-mesure d'excellence
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed">
            Nous combinons conseil stratégique, maîtrise de l'ingénierie et design haut de gamme pour propulser votre entreprise dans sa transformation digitale.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {activeServices.map((service, index) => (
            <motion.div
              id={`service-card-${service.id}`}
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-slate-50 border border-slate-100 hover:border-brand-200 p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedService(service)}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-50/0 via-brand-50/0 to-brand-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Header Icon */}
                <div className="w-14 h-14 rounded-2xl bg-brand-800 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-800/10 group-hover:bg-brand-900 transition-colors">
                  <LucideIcon name={service.iconName} size={24} />
                </div>

                {/* Service Title */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-900 mb-3 group-hover:text-brand-800 transition-colors">
                  {service.title}
                </h3>

                {/* Service Short Desc */}
                <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed mb-6">
                  {service.shortDesc}
                </p>

                {/* Bullets Sneak-Peek */}
                <ul className="space-y-2 mb-8">
                  {service.features.slice(0, 2).map((feature, i) => (
                    <li key={i} className="flex items-center text-xs font-medium text-slate-500 space-x-2">
                      <Check size={14} className="text-gold-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="text-xs text-brand-600 font-semibold group-hover:underline flex items-center space-x-1 pt-1">
                    <span>Et plus encore...</span>
                  </li>
                </ul>
              </div>

              {/* Action Link */}
              <div className="relative z-10 pt-4 border-t border-slate-200/60 flex items-center justify-between text-brand-800 font-semibold text-sm group-hover:text-brand-950">
                <span>En savoir plus</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Accessible Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              id="service-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              id="service-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-slate-100"
            >
              {/* Top Graphic Accent Banner */}
              <div className="bg-gradient-to-r from-brand-900 to-brand-800 p-8 text-white relative">
                <button
                  id="close-service-modal"
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500 text-brand-950 flex items-center justify-center shadow-lg">
                    <LucideIcon name={selectedService.iconName} size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-gold-100 font-mono uppercase font-semibold">
                      Spécialité WisTechnologie
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-0.5">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Présentation du service
                  </h4>
                  <p className="text-slate-700 font-sans text-base leading-relaxed">
                    {selectedService.longDesc}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Ce que nous prenons en charge
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust and Call to Action */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="block text-xs font-semibold text-slate-500">Besoin d'évaluer votre projet ?</span>
                    <span className="text-sm font-bold text-brand-800">Échangez gratuitement avec un architecte</span>
                  </div>
                  <button
                    id="service-modal-contact"
                    onClick={() => {
                      setSelectedService(null);
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Lancer l'échange</span>
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
