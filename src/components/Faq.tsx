import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface FaqProps {
  theme: 'light' | 'dark' | 'guinea';
}

interface FaqItem {
  question: string;
  answer: string;
}

export const Faq: React.FC<FaqProps> = ({ theme }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FaqItem[] = [
    {
      question: 'Quels types de projets pouvez-vous réaliser pour mon entreprise ?',
      answer: 'WisTechnologie est experte dans la conception et le développement de solutions numériques complètes : sites vitrines modernes, boutiques e-commerce hautement performantes, applications mobiles natives ou hybrides (iOS & Android), ainsi que des logiciels métiers ou SaaS sur-mesure (E-learning, ERP, gestion de stocks, CRM) parfaitement adaptés à vos processus d’affaires.'
    },
    {
      question: 'Comment déterminez-vous le coût global d’un projet ?',
      answer: 'Le tarif dépend principalement de la complexité technique, du nombre de pages ou d’écrans, et des fonctionnalités spécifiques à intégrer (système de paiement en ligne, espace membre avec authentification, intégration d’API tierces, etc.). Nous travaillons en toute transparence avec des tarifs basés sur des forfaits ou des régies agiles. Vous pouvez utiliser notre simulateur de devis ci-dessus pour estimer un budget instantané.'
    },
    {
      question: 'Combien de temps faut-il pour livrer un site web ou une application ?',
      answer: 'Un site vitrine standard est généralement conçu et mis en ligne sous 3 à 4 semaines. Une plateforme e-commerce prend 5 à 7 semaines. Les applications mobiles et logiciels métiers plus complexes nécessitent un délai allant de 2 à 3 mois. Dès le lancement, nous établissons un calendrier de livraison précis par tranches (Sprints) pour que vous puissiez suivre l’avancée en temps réel.'
    },
    {
      question: 'Est-ce que je pourrai mettre à jour mon site de manière autonome ?',
      answer: 'Absolument. Nous privilégions la création de panneaux d’administration (CMS sur-mesure ou interfaces de gestion de contenu comme WordPress sans code, Strapi, ou Payload) très simples d’utilisation. De plus, une formation pratique d’une heure est dispensée à vos équipes lors de la livraison du projet pour garantir une totale autonomie.'
    },
    {
      question: 'Proposez-vous un service de maintenance et de support après la livraison ?',
      answer: 'Oui, nous proposons des forfaits d’accompagnement et de maintenance (corrective, préventive et évolutive) pour garantir que vos outils numériques restent rapides, sécurisés, compatibles avec les dernières mises à jour de navigateurs et de systèmes d’exploitation (iOS/Android), et prêts à évoluer selon vos futurs besoins.'
    },
    {
      question: 'Vos solutions intègrent-elles de l’Intelligence Artificielle ou des automatisations ?',
      answer: 'C’est l’une de nos grandes forces. Nous pouvons intégrer des modèles d’IA (comme les API de Google Gemini ou OpenAI) pour automatiser vos tâches, créer des chatbots intelligents de service client, faire de l’analyse prédictive de données ou générer des comptes-rendus automatiques d’activité.'
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-left">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-100 px-3.5 py-1.5 rounded-full inline-block">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight text-center">
            Questions Fréquentes
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed text-center">
            Vous avez des questions sur la numérisation de votre activité ou sur nos méthodes ? Voici nos réponses claires.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-brand-600 bg-brand-50/5 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                }`}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full py-5 px-6 flex items-center justify-between space-x-4 cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3.5">
                    <HelpCircle className={`flex-shrink-0 ${isOpen ? 'text-brand-600' : 'text-slate-400'}`} size={20} />
                    <span className="font-display font-bold text-base text-brand-900 leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-full ${isOpen ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 font-sans text-sm leading-relaxed border-t border-slate-100/50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <h4 className="font-display font-bold text-lg flex items-center gap-2">
              <MessageSquare className="text-gold-500" size={18} />
              <span>Vous avez une question spécifique ?</span>
            </h4>
            <p className="text-slate-300 text-xs max-w-lg leading-relaxed font-normal">
              Nos experts en transformation numérique sont disponibles pour répondre à toutes vos interrogations techniques ou fonctionnelles lors d’un entretien personnalisé.
            </p>
          </div>
          <button
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-white hover:bg-slate-100 text-brand-950 font-semibold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Poser une question
          </button>
        </div>

      </div>
    </section>
  );
};
