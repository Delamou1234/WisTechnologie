import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Layout, ShoppingCart, Smartphone, Cpu, Check, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface ProjectEstimatorProps {
  theme: 'light' | 'dark' | 'guinea';
  onSendEstimate: (message: string, subject: string) => void;
}

interface ProjectType {
  id: string;
  name: string;
  basePrice: number;
  icon: React.ComponentType<any>;
  description: string;
  baseDuration: string;
}

interface FeatureOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({ theme, onSendEstimate }) => {
  const isLight = theme === 'light';
  const isGuinea = theme === 'guinea';

  const projectTypes: ProjectType[] = [
    {
      id: 'vitrine',
      name: 'Site Web Vitrine',
      basePrice: 1500,
      icon: Layout,
      description: 'Idéal pour présenter vos services, votre marque et capter des clients.',
      baseDuration: '3-4 semaines'
    },
    {
      id: 'ecommerce',
      name: 'Boutique E-Commerce',
      basePrice: 3500,
      icon: ShoppingCart,
      description: 'Plateforme de vente en ligne complète avec gestion de catalogue et stock.',
      baseDuration: '5-7 semaines'
    },
    {
      id: 'mobile',
      name: 'Application Mobile',
      basePrice: 5500,
      icon: Smartphone,
      description: 'Application iOS et Android native ou hybride performante.',
      baseDuration: '6-10 semaines'
    },
    {
      id: 'saas',
      name: 'SaaS / Logiciel Métier',
      basePrice: 7500,
      icon: Cpu,
      description: 'Solution sur-mesure pour numériser vos processus internes complexes.',
      baseDuration: '8-12 semaines'
    }
  ];

  const featuresList: FeatureOption[] = [
    {
      id: 'custom_design',
      name: 'Design UI/UX Sur-Mesure',
      price: 600,
      description: 'Charte graphique unique et prototypage interactif de vos maquettes.'
    },
    {
      id: 'auth',
      name: 'Espace Membres / Connexion',
      price: 800,
      description: 'Création de comptes utilisateurs, profils sécurisés et rôles.'
    },
    {
      id: 'payment',
      name: 'Paiement en ligne sécurisé',
      price: 1000,
      description: 'Intégration d’un processeur de paiement (Stripe, PayPal, Orange Money).'
    },
    {
      id: 'multilingual',
      name: 'Support Multi-langues',
      price: 450,
      description: 'Traduction complète du site dans d’autres langues (Anglais, etc.).'
    },
    {
      id: 'admin_panel',
      name: 'Panneau d’Administration (CMS)',
      price: 1200,
      description: 'Interface d’administration complète pour modifier vos contenus en autonomie.'
    }
  ];

  const [selectedType, setSelectedType] = useState<string>('vitrine');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['custom_design']);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [estimatePrice, setEstimatePrice] = useState<number>(1500);

  // Recalculate cost
  useEffect(() => {
    const typeObj = projectTypes.find(t => t.id === selectedType);
    if (!typeObj) return;

    let base = typeObj.basePrice;

    // Add selected features
    selectedFeatures.forEach(featId => {
      const featObj = featuresList.find(f => f.id === featId);
      if (featObj) {
        base += featObj.price;
      }
    });

    // Urgency multiplier
    if (isUrgent) {
      base = Math.round(base * 1.2);
    }

    setEstimatePrice(base);
  }, [selectedType, selectedFeatures, isUrgent]);

  const handleFeatureToggle = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSendEstimate = () => {
    const typeObj = projectTypes.find(t => t.id === selectedType);
    const activeFeats = selectedFeatures
      .map(fid => featuresList.find(f => f.id === fid)?.name)
      .filter(Boolean);

    const formattedMessage = `Bonjour l'équipe WisTechnologie,

Je viens d'estimer mon projet sur votre site et j'aimerais en discuter avec vous !

Voici les détails de ma configuration :
• Type de projet : ${typeObj?.name}
• Fonctionnalités choisies : ${activeFeats.length > 0 ? activeFeats.join(', ') : 'Aucune option additionnelle'}
• Délai souhaité : ${isUrgent ? 'Prioritaire (2-4 semaines, rapide)' : 'Standard'}
• Estimation du budget : entre ${Math.round(estimatePrice * 0.9).toLocaleString()} € et ${Math.round(estimatePrice * 1.1).toLocaleString()} € (TTC)

Merci de me recontacter pour un audit gratuit et l'établissement d'un devis officiel.`;

    onSendEstimate(formattedMessage, 'Développement Web / Mobile');
  };

  const selectedTypeObj = projectTypes.find(t => t.id === selectedType) || projectTypes[0];

  return (
    <section id="estimator" className="py-24 bg-slate-100/50 border-t border-slate-200/50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-left">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-100 px-3.5 py-1.5 rounded-full inline-block">
            Simulateur de Devis
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">
            Estimez le budget de votre projet
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed text-center">
            Sélectionnez vos besoins ci-dessous pour obtenir une approximation instantanée. C'est simple, transparent et sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Configurator Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Type de Projet */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-mono text-sm font-bold flex items-center justify-center">1</span>
                <h3 className="font-display font-bold text-xl text-brand-900">Quel type de produit souhaitez-vous concevoir ?</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-44 cursor-pointer focus:outline-none ${
                        isSelected
                          ? (isGuinea
                              ? 'border-gold-500 bg-[#00a859]/5 shadow-md shadow-[#00a859]/5'
                              : 'border-blue-500 bg-blue-50/20 shadow-md shadow-blue-500/5')
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className={`p-3 rounded-xl ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon size={20} />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                            <Check size={12} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-brand-900 leading-tight mb-1">{type.name}</h4>
                        <p className="text-slate-500 text-xs font-normal line-clamp-2 leading-relaxed">{type.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Options / Fonctionnalités */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-mono text-sm font-bold flex items-center justify-center">2</span>
                <h3 className="font-display font-bold text-xl text-brand-900">Quelles fonctionnalités souhaitez-vous inclure ?</h3>
              </div>

              <div className="space-y-3">
                {featuresList.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      onClick={() => handleFeatureToggle(feat.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start space-x-4 transition-all duration-200 cursor-pointer focus:outline-none ${
                        isChecked
                          ? (isGuinea ? 'border-gold-500/60 bg-[#00a859]/5' : 'border-blue-500/50 bg-blue-50/10')
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-sans font-semibold text-sm text-brand-900">{feat.name}</h4>
                          <span className="text-xs font-mono font-bold text-brand-600 ml-2">+{feat.price.toLocaleString()} €</span>
                        </div>
                        <p className="text-slate-500 text-xs font-normal mt-0.5 leading-relaxed">{feat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Délai / Priorité */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-mono text-sm font-bold flex items-center justify-center">3</span>
                <h3 className="font-display font-bold text-xl text-brand-900">Quel est votre calendrier de déploiement ?</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setIsUrgent(false)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 cursor-pointer focus:outline-none transition-all ${
                    !isUrgent
                      ? 'border-brand-600 bg-brand-600/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${!isUrgent ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Standard</span>
                    {!isUrgent && <div className="w-4 h-4 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-brand-900 leading-tight mb-0.5">Délai standard</h4>
                    <p className="text-slate-500 text-[11px] leading-snug font-normal">Rythme de livraison classique selon le planning de l'équipe.</p>
                  </div>
                </button>

                <button
                  onClick={() => setIsUrgent(true)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 cursor-pointer focus:outline-none transition-all ${
                    isUrgent
                      ? 'border-brand-600 bg-brand-600/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isUrgent ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Sparkles size={10} /> Urgent (+20%)
                    </span>
                    {isUrgent && <div className="w-4 h-4 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-brand-900 leading-tight mb-0.5">Livraison prioritaire</h4>
                    <p className="text-slate-500 text-[11px] leading-snug font-normal">Mise en place d'une équipe dédiée pour accélérer la livraison.</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-brand-950 text-white rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="font-display font-bold text-xl flex items-center space-x-2 relative z-10 border-b border-white/10 pb-4">
                <Calculator className="text-gold-500" size={20} />
                <span>Récapitulatif de l’estimation</span>
              </h3>

              <div className="space-y-4 relative z-10">
                <div>
                  <span className="block text-xs text-slate-400 font-mono uppercase tracking-wider">Solution sélectionnée</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-base font-bold text-white">{selectedTypeObj.name}</span>
                    <span className="font-mono text-sm font-semibold text-slate-300">{selectedTypeObj.basePrice.toLocaleString()} €</span>
                  </div>
                </div>

                {selectedFeatures.length > 0 && (
                  <div>
                    <span className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Options choisies</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedFeatures.map(featId => {
                        const feat = featuresList.find(f => f.id === featId);
                        if (!feat) return null;
                        return (
                          <div key={featId} className="flex justify-between text-xs text-slate-300">
                            <span className="font-sans flex items-center gap-1">
                              <Check size={12} className="text-[#00a859] flex-shrink-0" />
                              {feat.name}
                            </span>
                            <span className="font-mono text-slate-400">+{feat.price.toLocaleString()} €</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <div>
                    <span className="block text-xs text-slate-400 font-mono uppercase tracking-wider">Délai estimé</span>
                    <span className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                      <Clock size={14} className="text-gold-500" />
                      {isUrgent ? '2 à 4 semaines (Rapide)' : selectedTypeObj.baseDuration}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 font-mono uppercase tracking-wider">Méthodologie</span>
                    <span className="text-xs text-slate-300 font-semibold mt-1">Agile (Scrum / Sprints)</span>
                  </div>
                </div>

                {/* Final Cost Box */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center mt-6 space-y-1">
                  <span className="block text-xs text-slate-400 font-mono uppercase tracking-widest">Fourchette budgétaire estimée</span>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {Math.round(estimatePrice * 0.9).toLocaleString()} € - {Math.round(estimatePrice * 1.1).toLocaleString()} €
                  </div>
                  <span className="block text-[10px] text-slate-400">TVA incluse • Ajustable selon vos spécifications finales</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSendEstimate}
                  className="w-full bg-brand-800 hover:bg-brand-700 text-white font-semibold text-sm py-4 px-6 rounded-2xl flex items-center justify-center space-x-2.5 transition-all duration-300 hover:scale-[1.01] transform cursor-pointer shadow-md shadow-brand-950/40 relative z-10"
                >
                  <span>Envoyer cette configuration</span>
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-start space-x-2.5 text-[10px] text-slate-400 leading-normal pt-2">
                  <ShieldCheck size={14} className="text-[#00a859] flex-shrink-0 mt-0.5" />
                  <span>Cette estimation est indicative. Un audit technique complet de 45 minutes vous sera offert pour valider l'architecture et les tarifs définitifs.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
