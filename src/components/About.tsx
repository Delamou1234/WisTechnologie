import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TEAM_DATA, BENEFITS_DATA, TESTIMONIALS_DATA } from '../data';
import { TeamMember, Benefit, Testimonial } from '../types';
import { LucideIcon } from './LucideIcon';
import { Star, ChevronLeft, ChevronRight, Quote, Award, ShieldAlert, Target } from 'lucide-react';

interface AboutProps {
  team?: TeamMember[];
  benefits?: Benefit[];
  testimonials?: Testimonial[];
}

export const About: React.FC<AboutProps> = ({ team, benefits, testimonials }) => {
  const activeTeam = team && team.length > 0 ? team : TEAM_DATA;
  const activeBenefits = benefits && benefits.length > 0 ? benefits : BENEFITS_DATA;
  const activeTestimonials = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS_DATA;

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? activeTestimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === activeTestimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonialIndex = activeTestimonial >= activeTestimonials.length ? 0 : activeTestimonial;
  const testimonial = activeTestimonials[currentTestimonialIndex] || TESTIMONIALS_DATA[0];


  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur Accent */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-24">
        
        {/* 1. Presentation & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-50 px-3.5 py-1.5 rounded-full inline-block">
              Qui Sommes-Nous ?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight">
              L'excellence d'une agence de conseil, l'agilité d'un studio technologique
            </h2>
            <div className="w-12 h-1 bg-gold-500 rounded-full my-4" />
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              L'histoire de WisTechnologie est guidée par une conviction profonde : la technologie doit être un moteur de souveraineté et de croissance pour les acteurs économiques en Afrique. Notre aventure a commencé avec la volonté simple d'offrir des architectures informatiques d'excellence, éliminant les compromis sur la qualité pour propulser l'écosystème local vers les standards mondiaux.
            </p>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              Notre vocation majeure est d'accompagner pas à pas les entreprises, PME et institutions dans la numérisation complète de leurs activités. En transformant des processus manuels ou complexes en solutions logicielles fluides, sécurisées et performantes, nous créons l'élan technologique nécessaire pour libérer le potentiel de croissance de chaque partenaire.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-700">
                  <Award size={20} />
                </div>
                <div>
                  <span className="block font-bold text-brand-900 text-sm">Standards Premium</span>
                  <span className="text-xs text-slate-500 font-sans">Code propre, documenté & évolutif.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-700">
                  <Target size={20} />
                </div>
                <div>
                  <span className="block font-bold text-brand-900 text-sm">Approche Orientée ROI</span>
                  <span className="text-xs text-slate-500 font-sans">Des résultats chiffrés et mesurables.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Elegant visual box outlining stats */}
            <div className="w-full max-w-md p-8 bg-brand-900 text-white rounded-3xl relative overflow-hidden shadow-xl border border-brand-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
              <h3 className="font-display font-semibold text-lg text-gold-500 mb-6">Notre Manifeste</h3>
              <ul className="space-y-4 font-sans text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="font-mono text-gold-500 font-bold">01/</span>
                  <span><strong>Simplicité :</strong> Dissoudre la complexité technique derrière des interfaces fluides.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="font-mono text-gold-500 font-bold">02/</span>
                  <span><strong>Rigueur :</strong> Aucun raccourci sur la sécurité, le chiffrement et la conformité RGPD.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="font-mono text-gold-500 font-bold">03/</span>
                  <span><strong>Indépendance :</strong> Choix de stacks technologiques ouverts et sans vendor lock-in.</span>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-brand-800 flex items-center justify-between text-xs font-mono text-brand-300">
                <span>WisTechnologie Engineering Core</span>
                <span>v3.2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Core Benefits Grid */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-900">Pourquoi nous choisir ?</h3>
            <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
              Nous nous engageons à offrir le plus haut niveau d'exigence professionnelle pour chacun de nos projets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeBenefits.map((benefit, i) => (
              <motion.div
                id={`benefit-card-${i}`}
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left hover:bg-white hover:border-brand-100 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center mb-4">
                  <LucideIcon name={benefit.icon} size={18} />
                </div>
                <h4 className="font-display font-bold text-base text-brand-900 mb-2">{benefit.title}</h4>
                <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Team Profiles */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">Nos Experts</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-900">Un encadrement d'excellence</h3>
            <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
              Des profils seniors engagés à mener vos chantiers technologiques vers la réussite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTeam.map((member, i) => (
              <motion.div
                id={`team-card-${member.id}`}
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors"
              >
                <div className="text-left space-y-4">
                  {/* Avatar Initials Placeholder styled extremely beautifully */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-brand-900">{member.name}</h4>
                    <span className="text-xs font-mono font-semibold text-gold-600 uppercase">{member.role}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-sm leading-relaxed">{member.bio}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-left">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Spécialité :</span>
                  <span className="text-xs font-semibold text-brand-900">{member.specialty}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. Testimonials Section */}
        <div className="bg-brand-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
          {/* Visual quote icon in bg */}
          <Quote className="absolute top-8 right-8 text-white/5" size={140} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-md text-left space-y-4">
              <span className="text-xs font-mono font-bold text-gold-500 tracking-wider uppercase">Témoignages Clients</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Ils nous font confiance</h3>
              <p className="text-slate-300 font-sans text-sm leading-relaxed">
                Découvrez les retours d'expérience de nos partenaires clés après le déploiement de leurs solutions WisTechnologie.
              </p>
            </div>

            {/* Carousel display with framer motion transitions */}
            <div className="flex-grow max-w-xl bg-brand-900/50 backdrop-blur-md border border-brand-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating || 5)].map((_, idx) => (
                      <Star key={idx} size={16} className="fill-gold-500 text-gold-500" />
                    ))}
                  </div>

                  <p className="text-slate-200 font-sans text-sm italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="pt-4 border-t border-brand-800 flex items-center justify-between">
                    <div>
                      <span className="block font-semibold text-white text-sm">{testimonial.name}</span>
                      <span className="block text-xs text-slate-400 font-sans font-medium">
                        {testimonial.role} @ <strong className="text-slate-300 font-semibold">{testimonial.company}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        id="prev-testimonial"
                        onClick={handlePrevTestimonial}
                        className="p-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-white transition-colors cursor-pointer"
                        aria-label="Témoignage précédent"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        id="next-testimonial"
                        onClick={handleNextTestimonial}
                        className="p-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-white transition-colors cursor-pointer"
                        aria-label="Témoignage suivant"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
