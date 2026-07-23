import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage } from '../types';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactProps {
  prefilledMessage?: string;
  prefilledSubject?: string;
  onClearPrefill?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ 
  prefilledMessage, 
  prefilledSubject, 
  onClearPrefill 
}) => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: 'Développement Web / Mobile',
    message: ''
  });

  useEffect(() => {
    if (prefilledMessage) {
      setFormData(prev => ({
        ...prev,
        message: prefilledMessage,
        subject: prefilledSubject || 'Développement Web / Mobile'
      }));
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledMessage, prefilledSubject, onClearPrefill]);

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subjects = [
    'Conseil & Audit d\'architecture',
    'Développement Web / Mobile',
    'Intégration Intelligence Artificielle',
    'DevOps, Cloud & Sécurité',
    'Autre demande stratégique'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Veuillez renseigner votre nom.');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Veuillez fournir une adresse email valide.');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Veuillez rédiger un message détaillant votre besoin.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setFormState('error');
      return;
    }

    setFormState('loading');

    // Real backend API submission
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur serveur lors de la soumission.');
      }

      setFormState('success');
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: 'Conseil & Audit d\'architecture',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-600 uppercase bg-brand-100 px-3.5 py-1.5 rounded-full inline-block">
            Prendre Contact
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">
            Discutons de votre prochain défi technologique
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto rounded-full my-4" />
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed">
            Que vous ayez un cahier des charges précis ou une simple idée à explorer, nos architectes sont à votre écoute pour concevoir la solution idéale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Coordinates */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
              <h3 className="font-display font-bold text-xl text-brand-900">Coordonnées de l'Agence</h3>
              <p className="text-slate-600 font-sans text-sm leading-relaxed">
                Notre siège social est situé au cœur de l'écosystème numérique. N'hésitez pas à planifier une visite ou un appel de cadrage technique.
              </p>

              <div className="space-y-6">
                {/* Mail */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Email Direct</span>
                    <a href="mailto:samakedelamou858@gmail.com" className="text-sm font-semibold text-brand-900 hover:text-brand-700 transition-colors">
                      samakedelamou858@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Téléphone</span>
                    <a href="tel:+224629403019" className="text-sm font-semibold text-brand-900 hover:text-brand-700 transition-colors">
                      +224 629 40 30 19
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Siège Social</span>
                    <address className="not-italic text-sm font-semibold text-brand-900 font-sans">
                      Immeuble Kaloum, Quartier Almamya, Conakry, Guinée
                    </address>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Heures d'ouverture</span>
                    <span className="text-sm font-semibold text-brand-900">
                      Du lundi au vendredi : 9h00 – 18h30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-notice indicating security & response SLA */}
            <div className="p-6 bg-brand-900 text-white rounded-3xl text-left border border-brand-800 flex items-center space-x-4 shadow-sm">
              <CheckCircle size={24} className="text-gold-500 flex-shrink-0" />
              <div>
                <span className="block text-xs font-mono text-slate-300 uppercase">Engagement de réponse</span>
                <span className="text-xs sm:text-sm font-medium">Un consultant vous contactera sous 24h ouvrées.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm text-left">
            <h3 className="font-display font-bold text-xl text-brand-900 mb-6">Soumettre votre Projet</h3>

            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                    <CheckCircle size={36} />
                  </div>
                  <h4 className="font-display font-bold text-xl text-brand-900">Message envoyé avec succès !</h4>
                  <p className="text-slate-600 max-w-md text-sm leading-relaxed">
                    Nous vous remercions pour l'intérêt que vous portez à WisTechnologie. Un architecte conseil va analyser votre demande et vous recontactera d'ici quelques heures.
                  </p>
                  <button
                    id="reset-form-btn"
                    onClick={() => setFormState('idle')}
                    className="mt-4 px-5 py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Envoyer un nouveau message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  id="contact-form"
                  key="form-state"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name and email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                        Votre Nom <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex : Jean Dupont"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none transition-all font-sans"
                        disabled={formState === 'loading'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                        Votre Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ex : jean@entreprise.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none transition-all font-sans"
                        disabled={formState === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Company and phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="company" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                        Entreprise / Organisation
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Ex : NexaFlow SAS"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none transition-all font-sans"
                        disabled={formState === 'loading'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ex : 01 84 60 59 20"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none transition-all font-sans"
                        disabled={formState === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Subject selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                      Sujet Principal de votre demande
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none bg-white transition-all font-sans cursor-pointer"
                      disabled={formState === 'loading'}
                    >
                      {subjects.map((subj, idx) => (
                        <option key={idx} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-mono uppercase text-slate-400 font-bold">
                      Détails de votre besoin <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre projet, vos objectifs techniques et vos contraintes..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm outline-none transition-all font-sans resize-none"
                      disabled={formState === 'loading'}
                    />
                  </div>

                  {/* Error Notification Banner */}
                  {errorMessage && (
                    <motion.div
                      id="form-error-banner"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 flex items-center space-x-2 text-xs"
                    >
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    id="submit-contact-btn"
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full flex items-center justify-center space-x-2 bg-brand-800 hover:bg-brand-900 text-white font-semibold py-4 rounded-xl shadow-md transition-all duration-300 disabled:opacity-80 cursor-pointer"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmettre ma demande</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
