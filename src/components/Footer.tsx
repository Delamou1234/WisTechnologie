import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-brand-950 text-white pt-20 pb-8 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-900 text-left">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center">
            <Logo 
              height={44} 
              showText={true} 
              showSubtitle={true} 
              onDarkBackground={true} 
            />
          </div>
          <p className="text-slate-400 font-sans text-sm leading-relaxed">
            Conseil en architecture, développement d'applications haut de gamme et intégrations d'intelligence artificielle sur-mesure. Nous façonnons le futur numérique des leaders de demain.
          </p>

          <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
            <ShieldCheck size={16} className="text-gold-500" />
            <span>Certifié Clean Code & RGPD</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-display font-semibold text-sm text-gold-500 uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2.5 font-sans text-sm text-slate-400">
            <li>
              <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                Accueil
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                Services & Expertises
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('realizations')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                Réalisations & Case Studies
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                À propos de l'Agence
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">
                Nous Contacter
              </button>
            </li>
          </ul>
        </div>

        {/* Services mapping */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-display font-semibold text-sm text-gold-500 uppercase tracking-wider">Expertises Clés</h4>
          <ul className="space-y-2.5 font-sans text-sm text-slate-400">
            <li><span className="hover:text-white transition-colors cursor-default">Conseil Architectural & Audit</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">SaaS & Applications Web Premium</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Applications Mobiles d'Exception</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">IA Générative & Data Engineering</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Infrastructures Cloud & DevOps</span></li>
          </ul>
        </div>

        {/* Quick Contact */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-display font-semibold text-sm text-gold-500 uppercase tracking-wider">Prendre Contact</h4>
          <ul className="space-y-3 font-sans text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <Mail size={14} className="text-slate-500" />
              <a href="mailto:samakedelamou858@gmail.com" className="hover:text-white transition-colors">
                samakedelamou858@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={14} className="text-slate-500" />
              <a href="tel:+224629403019" className="hover:text-white transition-colors">
                +224 629 40 30 19
              </a>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs">Conakry, Guinée</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Underbar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          <span>© {currentYear} WisTechnologie. Tous droits réservés.</span>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#about" className="hover:text-slate-300 transition-colors">Mentions Légales</a>
          <span>•</span>
          <a href="#contact" className="hover:text-slate-300 transition-colors">Politique RGPD</a>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>Conçu avec</span>
            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>par WisTech Team</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
