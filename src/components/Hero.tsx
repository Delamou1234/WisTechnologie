import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Code, Database, Cloud, Sparkles, CheckCircle } from 'lucide-react';

const heroDevicesImg = "/src/assets/images/hero_device_mockups_1784483521474.jpg";

interface HeroProps {
  scrollToSection: (id: string) => void;
  theme: 'light' | 'dark' | 'guinea';
}

export const Hero: React.FC<HeroProps> = ({ scrollToSection, theme }) => {
  const isLight = theme === 'light';
  const isGuinea = theme === 'guinea';

  // Section Background
  const sectionBgClass = isLight 
    ? "relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-brand-50 text-slate-900 transition-all duration-300" 
    : isGuinea
      ? "relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center overflow-hidden bg-gradient-to-b from-[#020603] via-[#051408] to-[#020603] text-white transition-all duration-300"
      : "relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 text-white transition-all duration-300";

  // Grid pattern
  const gridPatternClass = isLight
    ? "absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none"
    : "absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none";

  // Orbs styling
  const orb1Class = isLight
    ? "absolute top-1/4 left-5 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
    : isGuinea
      ? "absolute top-1/4 left-5 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
      : "absolute top-1/4 left-5 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse";

  const orb2Class = isLight
    ? "absolute bottom-1/4 right-5 w-[30rem] h-[30rem] bg-gold-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
    : isGuinea
      ? "absolute bottom-1/4 right-5 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
      : "absolute bottom-1/4 right-5 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse";

  // Typography
  const h1Class = isLight
    ? "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.18] text-slate-900"
    : "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.18] text-white";

  const pClass = isLight
    ? "text-slate-600 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed font-sans"
    : "text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed font-sans";

  // Button 2
  const btn2Class = isLight
    ? "bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-medium text-sm px-8 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
    : "bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-medium text-sm px-8 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur";

  // Border & Social Proof
  const borderClass = isLight ? "border-slate-200" : "border-white/10";
  const textWhiteToDarkClass = isLight ? "text-slate-900" : "text-white";
  const avatarBorderClass = isLight ? "border-white bg-slate-100" : "border-brand-950 bg-brand-900";

  // Right column mockup container
  const mockupContainerClass = isLight
    ? "relative w-full max-w-xl aspect-[16/10] rounded-2xl overflow-hidden group border border-slate-200 shadow-2xl bg-white/40 backdrop-blur"
    : isGuinea
      ? "relative w-full max-w-xl aspect-[16/10] rounded-2xl overflow-hidden group border border-[#122c17]/30 shadow-2xl bg-black/40 backdrop-blur"
      : "relative w-full max-w-xl aspect-[16/10] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl bg-brand-950/40 backdrop-blur";

  // Beautiful real placeholder avatars for the clients satisfied section
  const clientAvatars = [
    { name: 'A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80' },
    { name: 'B', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80' },
    { name: 'C', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80' },
    { name: 'D', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80' },
  ];

  return (
    <section id="home" className={sectionBgClass}>
      {/* Decorative Grid Pattern */}
      <div className={gridPatternClass} />

      {/* Decorative Glowing Orbs */}
      <div className={orb1Class} style={{ animationDuration: '8s' }} />
      <div className={orb2Class} style={{ animationDuration: '12s' }} />

      {/* Third Guinea Flag Orb if syli theme */}
      {isGuinea && (
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy, Actions & Social Proof */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-8 text-left">
          
          {/* Main Heading with exactly the same highlights as the screenshot */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={h1Class}
          >
            Nous créons des{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold">
              sites web
            </span>
            , des{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold">
              applications mobiles
            </span>{' '}
            et des{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold">
              solutions numériques
            </span>{' '}
            qui font grandir votre entreprise.
          </motion.h1>

          {/* Subtitle / Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={pClass}
          >
            Chez WisTechnologie, nous accompagnons les entreprises, les startups et les particuliers dans leur transformation numérique grâce à des solutions modernes, performantes et sécurisées.
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
          >
            <button
              id="hero-cta-contact-screenshot"
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-8 py-4 rounded-xl flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Demander un devis</span>
              <ArrowRight size={16} />
            </button>
            <button
              id="hero-cta-realisations-screenshot"
              onClick={() => scrollToSection('realizations')}
              className={btn2Class}
            >
              <span>Voir nos réalisations</span>
            </button>
          </motion.div>

          {/* Combined Social Proof Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t ${borderClass} w-full`}
          >
            {/* Satisfied Clients Avatars */}
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2.5">
                {clientAvatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar.url}
                    alt={avatar.name}
                    referrerPolicy="no-referrer"
                    className={`w-9 h-9 rounded-full border-2 ${avatarBorderClass} object-cover`}
                  />
                ))}
              </div>
              <div>
                <span className={`block text-sm font-bold ${textWhiteToDarkClass}`}>+30</span>
                <span className="block text-[11px] text-slate-400 font-medium">Clients satisfaits</span>
              </div>
            </div>

            {/* Google Stars Rating */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium leading-none">
                Noté <strong className={`${textWhiteToDarkClass} font-semibold`}>4.9/5</strong> sur Google
              </span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: High-tech Visual Mockups (Laptop + Smartphone + Floating Glass Tech Icons) */}
        <div className="lg:col-span-6 flex justify-center items-center relative w-full pt-8 lg:pt-0">
          
          {/* Main Showcase Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={mockupContainerClass}
          >
            {/* The Custom Mockups Image */}
            <img
              src={heroDevicesImg}
              alt="WisTechnologie Responsive Mockups Laptop and Smartphone"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-1000 group-hover:scale-[1.03]"
            />

            {/* Subtle Interactive Tech Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent pointer-events-none" />

            {/* Simulated Floating Glass Tech Badges from screenshot */}
            {/* Left Tag Badge: Code Tag */}
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute top-[15%] left-[6%] bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-cyan-400 shadow-xl"
            >
              <Code size={20} className="stroke-[2.5]" />
            </motion.div>

            {/* Middle Badge: Database Tag */}
            <motion.div
              animate={{ y: [0, 8, 0], x: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-[35%] left-[4%] bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-blue-400 shadow-xl"
            >
              <Database size={20} className="stroke-[2.5]" />
            </motion.div>

            {/* Right Badge: Cloud Server Tag */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
              className="absolute top-[25%] right-[6%] bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-indigo-400 shadow-xl"
            >
              <Cloud size={20} className="stroke-[2.5]" />
            </motion.div>

            {/* Far Right Badge: Extra Code Tag */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.2 }}
              className="absolute bottom-[28%] right-[4%] bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-purple-400 shadow-xl"
            >
              <Code size={20} className="stroke-[2.5]" />
            </motion.div>

            {/* Live Status indicator */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-mono font-medium tracking-wide text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SITES & APPS CONNECTÉS</span>
            </div>

          </motion.div>

          {/* Visual glow backdrop */}
          <div className="absolute -z-10 w-80 h-80 rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

