import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Project, Testimonial, TeamMember, Formation, Benefit } from '../types';

const adminLoginImg = "/src/assets/images/admin_login_datacenter_1580106815433.jpg";
import { 
  Lock, 
  Unlock, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  RefreshCw, 
  FolderOpen, 
  BookOpen, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Cpu,
  MessageSquare,
  Users,
  Award,
  ChevronRight,
  LayoutDashboard,
  Database,
  ShieldAlert,
  Sliders,
  LogOut,
  Clock,
  Activity,
  Terminal,
  Search,
  Bell,
  Layers,
  Sparkles,
  TrendingUp,
  Server,
  Mail,
  Loader2,
  Send,
  Menu
} from 'lucide-react';

interface AdminPanelProps {
  services: Service[];
  setServices: (services: Service[]) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  team: TeamMember[];
  setTeam: (team: TeamMember[]) => void;
  benefits: Benefit[];
  setBenefits: (benefits: Benefit[]) => void;
  formations: Formation[];
  setFormations: (formations: Formation[]) => void;
  resetAllToDefault: () => void;
}

type TabType = 'overview' | 'services' | 'projets' | 'formations' | 'temoignages' | 'equipe' | 'avantages' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  services,
  setServices,
  projects,
  setProjects,
  testimonials,
  setTestimonials,
  team,
  setTeam,
  benefits,
  setBenefits,
  formations,
  setFormations,
  resetAllToDefault
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Restore an existing server-side session on page load/refresh so admins
  // aren't forced to re-enter the passcode every time they reload /admin.
  useEffect(() => {
    fetch('/api/admin/session')
      .then(res => res.json())
      .then(data => setIsAuthenticated(!!data.authenticated))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states for Service
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    id: '',
    title: '',
    shortDesc: '',
    longDesc: '',
    iconName: 'Cpu',
    features: ['', '', '']
  });

  // Form states for Project
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    category: 'Web',
    client: '',
    description: '',
    results: ['', '', ''],
    metricValue: '',
    metricLabel: '',
    imageKeyword: 'workspace'
  });

  // Form states for Testimonial
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    id: '',
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5
  });

  // Form states for Team Member
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    id: '',
    name: '',
    role: '',
    bio: '',
    specialty: ''
  });

  // Form states for Benefit
  const [benefitForm, setBenefitForm] = useState<Partial<Benefit>>({
    title: '',
    desc: '',
    icon: 'Award'
  });
  
  // Form states for Formation
  const [formationForm, setFormationForm] = useState<Partial<Formation>>({
    id: '',
    title: '',
    description: '',
    duration: '',
    price: '',
    level: 'Intermédiaire',
    syllabus: ['', '', '', ''],
    instructor: 'William S.',
    imageKeyword: 'workspace'
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // SMTP Settings State and Handlers
  const [smtpForm, setSmtpForm] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    toEmail: 'samakedelamou858@gmail.com',
    enabled: false
  });
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpSaving, setSmtpSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'settings' && isAuthenticated) {
      fetch('/api/settings/smtp')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Impossible de charger les paramètres SMTP');
        })
        .then(data => {
          if (data) {
            setSmtpForm({
              host: data.host || '',
              port: Number(data.port) || 587,
              secure: !!data.secure,
              user: data.user || '',
              pass: data.pass || '',
              toEmail: data.toEmail || 'samakedelamou858@gmail.com',
              enabled: !!data.enabled
            });
          }
        })
        .catch(err => {
          console.error('Erreur lors du chargement SMTP:', err);
        });
    }
  }, [activeTab, isAuthenticated]);

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpSaving(true);
    try {
      const response = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm)
      });
      if (response.ok) {
        triggerNotification('Configuration SMTP sauvegardée avec succès !');
      } else {
        const errData = await response.json().catch(() => ({}));
        triggerNotification(errData.error || 'Erreur lors de la sauvegarde.', 'error');
      }
    } catch (err: any) {
      triggerNotification(err.message || 'Erreur de connexion avec le serveur.', 'error');
    } finally {
      setSmtpSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    try {
      const response = await fetch('/api/settings/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm)
      });
      const data = await response.json();
      if (response.ok) {
        triggerNotification(data.message || 'Test SMTP réussi !');
      } else {
        triggerNotification(data.error || 'Échec du test SMTP.', 'error');
      }
    } catch (err: any) {
      triggerNotification(err.message || 'Erreur réseau lors du test SMTP.', 'error');
    } finally {
      setSmtpTesting(false);
    }
  };

  const triggerNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);

    // Keep the site owner informed by email of connections and actions
    // taken in the admin console. Fire-and-forget: never blocks the UI.
    if (type === 'success') {
      fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }).catch(() => {});
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setPasscode(''); // Clear the passcode immediately so it is never visible
        triggerNotification('Connexion réussie en tant qu\'administrateur');
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || 'Code de sécurité incorrect. Veuillez contacter l\'administrateur système.');
      }
    } catch {
      setAuthError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    }
  };

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setIsAuthenticated(false);
    setPasscode('');
    setActiveTab('overview');
    triggerNotification('Session administrateur fermée');
  };

  // --- SERVICE ACTIONS ---
  const handleAddServiceClick = () => {
    setEditingId(null);
    setServiceForm({
      id: 'serv_' + Date.now(),
      title: '',
      shortDesc: '',
      longDesc: '',
      iconName: 'Cpu',
      features: ['', '', '']
    });
    setShowFormModal(true);
  };

  const handleEditServiceClick = (serv: Service) => {
    setEditingId(serv.id);
    setServiceForm({
      ...serv,
      features: serv.features.length >= 3 ? serv.features : [...serv.features, '', ''].slice(0, 3)
    });
    setShowFormModal(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      triggerNotification('Service supprimé avec succès');
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDesc || !serviceForm.longDesc) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    const cleanFeatures = (serviceForm.features || []).filter(f => f.trim() !== '');
    const finalService: Service = {
      id: serviceForm.id || 'serv_' + Date.now(),
      title: serviceForm.title,
      shortDesc: serviceForm.shortDesc,
      longDesc: serviceForm.longDesc,
      iconName: serviceForm.iconName || 'Cpu',
      features: cleanFeatures.length > 0 ? cleanFeatures : ['Qualité de service assurée']
    };

    if (editingId) {
      setServices(services.map(s => s.id === editingId ? finalService : s));
      triggerNotification('Service mis à jour avec succès');
    } else {
      setServices([...services, finalService]);
      triggerNotification('Service ajouté avec succès');
    }
    setShowFormModal(false);
  };

  // --- PROJECT ACTIONS ---
  const handleAddProjectClick = () => {
    setEditingId(null);
    setProjectForm({
      id: 'proj_' + Date.now(),
      title: '',
      category: 'Web',
      client: '',
      description: '',
      results: ['', '', ''],
      metricValue: '',
      metricLabel: '',
      imageKeyword: 'workspace'
    });
    setShowFormModal(true);
  };

  const handleEditProjectClick = (proj: Project) => {
    setEditingId(proj.id);
    setProjectForm({
      ...proj,
      results: proj.results.length >= 3 ? proj.results : [...proj.results, '', ''].slice(0, 3)
    });
    setShowFormModal(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      triggerNotification('Projet supprimé avec succès');
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.client || !projectForm.description) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    const cleanResults = (projectForm.results || []).filter(r => r.trim() !== '');
    const finalProject: Project = {
      id: projectForm.id || 'proj_' + Date.now(),
      title: projectForm.title,
      category: (projectForm.category as any) || 'Web',
      client: projectForm.client,
      description: projectForm.description,
      results: cleanResults.length > 0 ? cleanResults : ['Performance optimisée'],
      metricValue: projectForm.metricValue || '+100%',
      metricLabel: projectForm.metricLabel || 'de satisfaction',
      imageKeyword: projectForm.imageKeyword || 'workspace'
    };

    if (editingId) {
      setProjects(projects.map(p => p.id === editingId ? finalProject : p));
      triggerNotification('Projet mis à jour avec succès');
    } else {
      setProjects([finalProject, ...projects]);
      triggerNotification('Projet ajouté avec succès');
    }

    setShowFormModal(false);
  };

  // --- TESTIMONIAL ACTIONS ---
  const handleAddTestimonialClick = () => {
    setEditingId(null);
    setTestimonialForm({
      id: 'test_' + Date.now(),
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5
    });
    setShowFormModal(true);
  };

  const handleEditTestimonialClick = (test: Testimonial) => {
    setEditingId(test.id);
    setTestimonialForm(test);
    setShowFormModal(true);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce témoignage ?')) {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      triggerNotification('Témoignage supprimé avec succès');
    }
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.company || !testimonialForm.content) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    const finalTestimonial: Testimonial = {
      id: testimonialForm.id || 'test_' + Date.now(),
      name: testimonialForm.name,
      role: testimonialForm.role || 'Directeur',
      company: testimonialForm.company,
      content: testimonialForm.content,
      rating: Number(testimonialForm.rating) || 5
    };

    if (editingId) {
      setTestimonials(testimonials.map(t => t.id === editingId ? finalTestimonial : t));
      triggerNotification('Témoignage mis à jour avec succès');
    } else {
      setTestimonials([finalTestimonial, ...testimonials]);
      triggerNotification('Témoignage ajouté avec succès');
    }
    setShowFormModal(false);
  };

  // --- TEAM ACTIONS ---
  const handleAddTeamClick = () => {
    setEditingId(null);
    setTeamForm({
      id: 'team_' + Date.now(),
      name: '',
      role: '',
      bio: '',
      specialty: ''
    });
    setShowFormModal(true);
  };

  const handleEditTeamClick = (member: TeamMember) => {
    setEditingId(member.id);
    setTeamForm(member);
    setShowFormModal(true);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce membre de l\'équipe ?')) {
      const updated = team.filter(t => t.id !== id);
      setTeam(updated);
      triggerNotification('Membre de l\'équipe supprimé');
    }
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role || !teamForm.bio) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    const finalMember: TeamMember = {
      id: teamForm.id || 'team_' + Date.now(),
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio,
      specialty: teamForm.specialty || 'Ingénieur Conseil'
    };

    if (editingId) {
      setTeam(team.map(t => t.id === editingId ? finalMember : t));
      triggerNotification('Membre de l\'équipe mis à jour');
    } else {
      setTeam([...team, finalMember]);
      triggerNotification('Membre d\'équipe ajouté');
    }
    setShowFormModal(false);
  };

  // --- BENEFIT ACTIONS ---
  const handleAddBenefitClick = () => {
    setEditingIndex(null);
    setBenefitForm({
      title: '',
      desc: '',
      icon: 'Award'
    });
    setShowFormModal(true);
  };

  const handleEditBenefitClick = (bene: Benefit, index: number) => {
    setEditingIndex(index);
    setBenefitForm(bene);
    setShowFormModal(true);
  };

  const handleDeleteBenefit = (index: number) => {
    if (confirm('Voulez-vous vraiment supprimer cet avantage ?')) {
      const updated = benefits.filter((_, idx) => idx !== index);
      setBenefits(updated);
      triggerNotification('Avantage supprimé avec succès');
    }
  };

  const handleSaveBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!benefitForm.title || !benefitForm.desc) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    const finalBenefit: Benefit = {
      title: benefitForm.title,
      desc: benefitForm.desc,
      icon: benefitForm.icon || 'Award'
    };

    if (editingIndex !== null) {
      setBenefits(benefits.map((b, idx) => idx === editingIndex ? finalBenefit : b));
      triggerNotification('Avantage mis à jour');
    } else {
      setBenefits([...benefits, finalBenefit]);
      triggerNotification('Avantage ajouté');
    }
    setShowFormModal(false);
  };

  // --- FORMATION ACTIONS ---
  const handleAddFormationClick = () => {
    setEditingId(null);
    setFormationForm({
      id: 'form_' + Date.now(),
      title: '',
      description: '',
      duration: '',
      price: '',
      level: 'Intermédiaire',
      syllabus: ['', '', '', ''],
      instructor: 'William S.',
      imageKeyword: 'workspace'
    });
    setShowFormModal(true);
  };

  const handleEditFormationClick = (form: Formation) => {
    setEditingId(form.id);
    setFormationForm({
      ...form,
      syllabus: form.syllabus.length >= 4 ? form.syllabus : [...form.syllabus, '', '', ''].slice(0, 4)
    });
    setShowFormModal(true);
  };

  const handleDeleteFormation = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      const updated = formations.filter(f => f.id !== id);
      setFormations(updated);
      triggerNotification('Formation supprimée avec succès');
    }
  };

  const handleSaveFormation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formationForm.title || !formationForm.description || !formationForm.duration) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    const cleanSyllabus = (formationForm.syllabus || []).filter(s => s.trim() !== '');
    const finalFormation: Formation = {
      id: formationForm.id || 'form_' + Date.now(),
      title: formationForm.title,
      description: formationForm.description,
      duration: formationForm.duration,
      price: formationForm.price || 'Sur devis',
      level: (formationForm.level as any) || 'Intermédiaire',
      syllabus: cleanSyllabus.length > 0 ? cleanSyllabus : ['Introduction technique'],
      instructor: formationForm.instructor || 'William S.',
      imageKeyword: formationForm.imageKeyword || 'workspace'
    };

    if (editingId) {
      setFormations(formations.map(f => f.id === editingId ? finalFormation : f));
      triggerNotification('Formation mise à jour avec succès');
    } else {
      setFormations([finalFormation, ...formations]);
      triggerNotification('Formation ajoutée avec succès');
    }

    setShowFormModal(false);
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données de démonstration ? Vos modifications locales seront perdues.')) {
      resetAllToDefault();
      triggerNotification('Données d\'usine restaurées avec succès', 'success');
    }
  };

  // Helper to filter elements by searchQuery
  const filterBySearch = (list: any[]): any[] => {
    if (!searchQuery) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(item => {
      const matchTitle = item.title?.toLowerCase().includes(query) || item.name?.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query) || 
                        item.shortDesc?.toLowerCase().includes(query) || 
                        item.content?.toLowerCase().includes(query) ||
                        item.bio?.toLowerCase().includes(query) ||
                        item.desc?.toLowerCase().includes(query);
      return !!(matchTitle || matchDesc);
    });
  };

  // Sidebar navigation options
  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'services', label: 'Offres & Services', icon: Cpu, count: services.length },
    { id: 'projets', label: 'Projets & Réalisations', icon: FolderOpen, count: projects.length },
    { id: 'formations', label: 'Formations Pro', icon: BookOpen, count: formations.length },
    { id: 'temoignages', label: 'Témoignages Clients', icon: MessageSquare, count: testimonials.length },
    { id: 'equipe', label: 'Équipe d\'Experts', icon: Users, count: team.length },
    { id: 'avantages', label: 'Atouts d\'Excellence', icon: Award, count: benefits.length },
    { id: 'settings', label: 'Paramètres Système', icon: Sliders }
  ];

  if (checkingSession) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    );
  }

  return (
    <div
      className={!isAuthenticated
        ? "min-h-screen w-full bg-slate-950 flex flex-col md:flex-row relative"
        : "h-screen w-full bg-slate-900 flex flex-col md:flex-row overflow-hidden relative"
      }
    >
              {!isAuthenticated ? (
                <>
                  <a
                    href="/"
                    className="fixed top-4 right-4 z-20 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-colors flex items-center space-x-1.5 text-xs font-mono border border-slate-800 cursor-pointer backdrop-blur-sm"
                  >
                    <X size={14} />
                    <span className="hidden sm:inline">Fermer / Retour au site</span>
                  </a>

                  <div className="hidden md:flex md:w-1/2 relative overflow-hidden shrink-0">
                    <img
                      src={adminLoginImg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-950/50" />
                    <div className="absolute inset-0 bg-gold-500/5" />

                    <div className="relative z-10 flex flex-col justify-between w-full h-full p-10 lg:p-12">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center backdrop-blur-sm">
                          <Terminal className="text-gold-500" size={18} />
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">WisTech CMS</h2>
                          <p className="text-[10px] font-mono text-slate-400">Console de contrôle</p>
                        </div>
                      </div>

                      <div className="space-y-6 max-w-sm">
                        <h3 className="font-display font-black text-3xl lg:text-4xl text-slate-100 tracking-tight leading-tight">
                          Gérez votre présence digitale depuis une vraie console d’administration.
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Publiez vos services, projets, formations et réponses clients en quelques clics depuis un espace dédié, sécurisé et moderne.
                        </p>
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
                            <Database size={14} className="text-gold-500 shrink-0" />
                            <span>Contenu synchronisé en temps réel</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
                            <Activity size={14} className="text-gold-500 shrink-0" />
                            <span>Suivi des messages & statistiques</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
                            <ShieldAlert size={14} className="text-gold-500 shrink-0" />
                            <span>Accès restreint par clé d'habilitation</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-slate-500">
                        WisTechnologie Secure Admin Portal &copy; 2026
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center overflow-y-auto p-6 md:p-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full max-w-md mx-auto space-y-8 my-auto relative z-10 flex flex-col justify-center py-6">
                      <div className="text-center space-y-3 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-gold-500 shadow-2xl shadow-gold-500/5 relative">
                          <div className="absolute inset-0 rounded-3xl bg-gold-500/5 animate-pulse" />
                          <Lock size={32} className="relative z-10 animate-pulse" />
                        </div>

                        <div className="space-y-1">
                          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-[9px] font-mono text-gold-500 uppercase tracking-widest">
                            Accès réservé
                          </div>
                          <h3 className="font-display font-black text-2xl text-slate-100 tracking-tight">Connexion administrateur</h3>
                        </div>

                        <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">
                          Connectez-vous pour accéder à la console de gestion du site et piloter votre contenu.
                        </p>
                      </div>

                      <div className="p-8 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl space-y-6 shadow-2xl relative z-10">
                        <form onSubmit={handleAuth} className="space-y-4">
                          <div className="space-y-2 text-left">
                            <label htmlFor="admin-passcode-input" className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">
                              Clé d’accès admin
                            </label>
                            <div className="relative">
                              <input
                                id="admin-passcode-input"
                                type={showPassword ? 'text' : 'password'}
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="Saisissez votre clé..."
                                className="w-full px-4 py-3.5 pr-12 bg-slate-950 rounded-xl border border-slate-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-sm text-slate-100 outline-none transition-all font-mono placeholder-slate-600"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                                aria-label="Afficher ou masquer le mot de passe"
                              >
                                {showPassword ? <Eye size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          {authError && (
                            <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl text-rose-400 flex items-center space-x-2 text-xs animate-fadeIn">
                              <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
                              <span className="font-medium text-left">{authError}</span>
                            </div>
                          )}

                          <button
                            id="submit-auth-btn"
                            type="submit"
                            className="w-full py-3.5 bg-gold-600 hover:bg-gold-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-gold-600/10 hover:shadow-gold-600/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                          >
                            <span>Se connecter</span>
                            <Unlock size={14} />
                          </button>
                        </form>
                      </div>

                      <p className="text-[10px] font-mono text-slate-600 text-center md:hidden">
                        WisTechnologie Secure Admin Portal &copy; 2026
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile backdrop for sidebar drawer */}
                  {isMobileSidebarOpen && (
                    <div 
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs z-35 md:hidden transition-all duration-300"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    />
                  )}

                  {/* 1. LEFT SIDEBAR PANEL */}
                  <div className={`absolute md:relative inset-y-0 left-0 z-40 w-72 h-full bg-brand-950 border-r border-slate-800 flex flex-col shrink-0 transform transition-transform duration-300 md:transform-none ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                  }`}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                          <Terminal className="text-gold-500" size={18} />
                        </div>
                        <div className="text-left">
                          <h2 className="font-display font-bold text-sm text-slate-100 uppercase tracking-wider">WisTech CMS</h2>
                          <p className="text-[10px] font-mono text-slate-400">v2.4 - Console de contrôle</p>
                        </div>
                      </div>
                      
                      {/* Close button for mobile sidebar */}
                      <button 
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Sidebar Menu Options */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
                      {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as TabType);
                              setSearchQuery('');
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all group cursor-pointer ${
                              isActive 
                                ? 'bg-slate-800/70 text-gold-500 font-bold border border-slate-700/50 shadow-inner' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent size={16} className={isActive ? 'text-gold-500' : 'text-slate-400 group-hover:text-slate-200 transition-colors'} />
                              <span className="text-xs font-medium">{item.label}</span>
                            </div>
                            {item.count !== undefined && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-gold-500/10 text-gold-500' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sidebar Footer with tailored credentials */}
                    <div className="p-4 border-t border-slate-800 bg-brand-950/50 text-left">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800/50">
                          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center font-bold text-xs text-gold-500 border border-gold-500/30">
                            BD
                          </div>
                          <div className="overflow-hidden">
                            <span className="block text-xs font-semibold text-slate-200 truncate">Bakary Diakité</span>
                            <span className="block text-[9px] font-mono text-slate-500 truncate">bakarydiakite365@gmail.com</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={handleLogout}
                            className="flex-1 py-1.5 px-3 bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <LogOut size={12} />
                            <span>Déconnecter</span>
                          </button>
                          
                          <a
                            href="/"
                            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                            <span>Fermer</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. RIGHT WORKSPACE / DISPLAY AREA */}
                  <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden w-full">
                    
                    {/* Workspace Header Status Bar */}
                    <div className="px-6 py-4 border-b border-slate-800/80 bg-brand-950/60 flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Mobile menu toggle button */}
                        <button
                          onClick={() => setIsMobileSidebarOpen(true)}
                          className="md:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white mr-1 border border-slate-700/50 cursor-pointer flex-shrink-0"
                          aria-label="Ouvrir le menu"
                        >
                          <Menu size={16} />
                        </button>

                        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                          <Activity size={14} className="text-emerald-500 animate-pulse" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-sm text-slate-100 flex items-center space-x-2 truncate">
                            <span>Console Administrateur</span>
                            <span className="text-xs text-gold-500 font-mono font-normal">/ {navItems.find(i => i.id === activeTab)?.label}</span>
                          </h3>
                          <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 flex items-center space-x-1 truncate max-w-[220px] sm:max-w-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            <span>SERVEUR SYNC CONNECTÉ (POSTGRES & AUTO-PERSISTENCE ACTIVÉE)</span>
                          </p>
                        </div>
                      </div>

                      {/* Right side notification badge & time */}
                      <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-[10px] font-mono text-slate-400">
                          <Clock size={12} className="text-gold-500" />
                          <span>UTC-7 | 13:50</span>
                        </div>

                        <a
                          href="/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono border border-slate-700 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Aperçu du Site</span>
                        </a>
                      </div>
                    </div>

                    {/* Internal Notifications alerts */}
                    {notification && (
                      <div className={`py-2.5 px-6 text-xs font-semibold ${
                        notification.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800' : 'bg-rose-950/80 text-rose-300 border-b border-rose-800'
                      } flex items-center space-x-2 animate-fadeIn`}>
                        <CheckCircle size={14} className="shrink-0" />
                        <span>{notification.text}</span>
                      </div>
                    )}

                    {/* Main Content Pane */}
                    <div className="flex-1 overflow-y-auto p-6 text-left scrollbar-thin">
                      
                      {/* AUTHENTICATED WORKSPACE GUTS */}
                      <div className="space-y-6">
                      
                      {/* Search Bar filter (visible on content lists tabs) */}
                      {activeTab !== 'overview' && activeTab !== 'settings' && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                          <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={`Rechercher un élément...`}
                              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-slate-700"
                            />
                            {searchQuery && (
                              <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                              >
                                Effacer
                              </button>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-500 font-mono">
                            Résultat: <span className="text-gold-500 font-bold">{filterBySearch(
                              activeTab === 'services' ? services :
                              activeTab === 'projets' ? projects :
                              activeTab === 'formations' ? formations :
                              activeTab === 'temoignages' ? testimonials :
                              activeTab === 'equipe' ? team : benefits
                            ).length}</span> trouvé(s)
                          </div>
                        </div>
                      )}


                      {/* A. TABS WORKSPACE: OVERVIEW (TAB_DASHBOARD_HOME) */}
                      {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fadeIn">
                          
                          {/* Welcome Hero Banner with Admin Avatar */}
                          <div className="p-6 md:p-8 rounded-3xl bg-radial from-slate-900 via-brand-950 to-brand-950 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-800/10 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="space-y-2 relative z-10">
                              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[10px] font-mono text-gold-500">
                                <Sparkles size={10} />
                                <span className="uppercase">SYSTÈME OPÉRATIONNEL</span>
                              </div>
                              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                                Bonjour, <span className="text-gradient-gold font-extrabold">Bakary Diakité</span> 👋
                              </h2>
                              <p className="text-xs text-slate-400 max-w-lg">
                                Bienvenue sur votre console de gestion d'infrastructure de marque. Contrôlez l'intégralité du contenu, des modules de formation, des avis clients et des offres techniques de la plateforme.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5 shrink-0 relative z-10">
                              <button
                                onClick={handleResetData}
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                              >
                                <RefreshCw size={12} className="text-slate-400" />
                                <span>Reset Démo</span>
                              </button>
                              
                              <button
                                onClick={handleAddProjectClick}
                                className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer hover:shadow-lg hover:shadow-gold-500/10"
                              >
                                <Plus size={14} />
                                <span>Ajouter un Projet</span>
                              </button>
                            </div>
                          </div>

                          {/* 6 Grid Metrics Overview Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            
                            {/* Card 1: Services */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Services Techniques</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{services.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                  <Cpu size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span>Offre de prestations</span>
                                <button onClick={() => setActiveTab('services')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card 2: Projets */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Projets Réalisés</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{projects.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                  <FolderOpen size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span className="text-emerald-400 font-mono">Performance: +180% kpi</span>
                                <button onClick={() => setActiveTab('projets')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card 3: Formations */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Catalogue Formations</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{formations.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                  <BookOpen size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span>William S. lead</span>
                                <button onClick={() => setActiveTab('formations')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card 4: Témoignages */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Avis & Évaluations</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{testimonials.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                  <MessageSquare size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span className="text-gold-500 font-bold">★ 4.9 Note Moyenne</span>
                                <button onClick={() => setActiveTab('temoignages')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card 5: Équipe */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Experts Conseils</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{team.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                  <Users size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span>Pôle d'ingénierie</span>
                                <button onClick={() => setActiveTab('equipe')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Card 6: Avantages */}
                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className="block text-xs font-mono uppercase text-slate-500 tracking-wider">Atouts de Marque</span>
                                  <span className="block text-3xl font-display font-extrabold text-white group-hover:text-gold-500 transition-colors">{benefits.length}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                  <Award size={20} />
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[11px] text-slate-400">
                                <span>Garantie de service</span>
                                <button onClick={() => setActiveTab('avantages')} className="text-gold-500 font-semibold hover:underline flex items-center">
                                  <span>Gérer</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section: Custom visual Content distribution and health logs */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Mini Distribution Chart (Custom CSS percentage bars) */}
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                              <h4 className="font-display font-bold text-sm text-slate-200">Volume de la base de données</h4>
                              <p className="text-xs text-slate-400">Pourcentage relatif du contenu configuré sur la plateforme</p>
                              
                              <div className="space-y-3.5 pt-2">
                                {/* Services volume */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Services Prestations</span>
                                    <span>{services.length * 10}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(services.length * 10, 100)}%` }} />
                                  </div>
                                </div>

                                {/* Projects volume */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Portfolio Réalisations</span>
                                    <span>{projects.length * 15}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(projects.length * 15, 100)}%` }} />
                                  </div>
                                </div>

                                {/* Formations volume */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Formations Catalogue</span>
                                    <span>{formations.length * 20}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(formations.length * 20, 100)}%` }} />
                                  </div>
                                </div>

                                {/* Testimonials volume */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Évaluations & Feedback</span>
                                    <span>{testimonials.length * 12}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(testimonials.length * 12, 100)}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* System Health Logs Component */}
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display font-bold text-sm text-slate-200">État de santé & Certifications</h4>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-full">ACTIVE</span>
                              </div>
                              <p className="text-xs text-slate-400">Diagnostics de sécurité et d'hébergement</p>

                              <div className="space-y-2.5 pt-2">
                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                                    <Server size={14} className="text-indigo-400" />
                                    <span>Moteur de base de données</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">PostgreSQL Sync (JSON local)</span>
                                </div>

                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                                    <Lock size={14} className="text-gold-500" />
                                    <span>Niveau de sécurité d'API</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">SSL & OWASP Sec-Lvl 2</span>
                                </div>

                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                                    <Database size={14} className="text-cyan-400" />
                                    <span>Intégrité des fichiers</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">100% Conforme</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}


                      {/* B. TAB WORKSPACE: SERVICES LIST */}
                      {activeTab === 'services' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Catalogue des offres de Services</h3>
                              <p className="text-xs text-slate-400">Gérez les prestations et piliers techniques affichés en page d'accueil.</p>
                            </div>
                            <button
                              onClick={handleAddServiceClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter un Service</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(services).map((serv) => (
                              <div key={serv.id} className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">
                                      <Cpu size={14} />
                                    </div>
                                    <h4 className="font-display font-bold text-sm text-slate-100">{serv.title}</h4>
                                  </div>
                                  <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">{serv.shortDesc}</p>
                                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                                    {serv.features?.map((feat, idx) => (
                                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-full">
                                        {feat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    onClick={() => handleEditServiceClick(serv)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier le service"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(serv.id)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer le service"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* C. TAB WORKSPACE: PROJECTS LIST */}
                      {activeTab === 'projets' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Portfolio des Réalisations de l'Entreprise</h3>
                              <p className="text-xs text-slate-400">Gérez vos études de cas et KPI d'impact client.</p>
                            </div>
                            <button
                              id="add-project-cms-btn"
                              onClick={handleAddProjectClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter un Projet</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(projects).map((proj) => (
                              <div 
                                key={proj.id}
                                className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                                      {proj.category}
                                    </span>
                                    <span className="text-[11px] text-slate-400">• Client: <strong className="font-semibold text-slate-300">{proj.client}</strong></span>
                                  </div>
                                  <h4 className="font-display font-bold text-sm text-slate-100">{proj.title}</h4>
                                  <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{proj.description}</p>
                                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                                    <span className="text-gold-500 font-mono font-bold">{proj.metricValue}</span>
                                    <span className="text-slate-500 text-[10px]">{proj.metricLabel}</span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    id={`edit-proj-${proj.id}`}
                                    onClick={() => handleEditProjectClick(proj)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier le projet"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    id={`delete-proj-${proj.id}`}
                                    onClick={() => handleDeleteProject(proj.id)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer le projet"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* D. TAB WORKSPACE: FORMATIONS LIST */}
                      {activeTab === 'formations' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Catalogue des Formations Professionnelles</h3>
                              <p className="text-xs text-slate-400">Configurez les modules d'enseignement et de certification.</p>
                            </div>
                            <button
                              id="add-formation-cms-btn"
                              onClick={handleAddFormationClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter une Formation</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(formations).map((form) => (
                              <div 
                                key={form.id}
                                className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                                      {form.level}
                                    </span>
                                    <span className="text-[11px] text-slate-400">• Durée: <strong className="font-semibold text-slate-300">{form.duration}</strong></span>
                                    <span className="text-[11px] text-slate-400">• Instructeur: <strong className="font-semibold text-slate-300">{form.instructor}</strong></span>
                                  </div>
                                  <h4 className="font-display font-bold text-sm text-slate-100">{form.title}</h4>
                                  <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{form.description}</p>
                                  <div className="text-xs font-mono font-bold text-slate-300">
                                    Tarif: <span className="text-gold-500">{form.price}</span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    id={`edit-form-${form.id}`}
                                    onClick={() => handleEditFormationClick(form)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier la formation"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    id={`delete-form-${form.id}`}
                                    onClick={() => handleDeleteFormation(form.id)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer la formation"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* E. TAB WORKSPACE: TESTIMONIALS LIST */}
                      {activeTab === 'temoignages' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Recommandations & Témoignages Clients</h3>
                              <p className="text-xs text-slate-400">Gérez les verbatims et notes de satisfaction clients.</p>
                            </div>
                            <button
                              onClick={handleAddTestimonialClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter un Témoignage</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(testimonials).map((test) => (
                              <div key={test.id} className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                                <div className="space-y-1 max-w-2xl text-left">
                                  <h4 className="font-display font-bold text-sm text-slate-100">{test.name}</h4>
                                  <p className="text-xs text-slate-400">{test.role} @ <strong className="font-semibold text-slate-300">{test.company}</strong></p>
                                  <p className="text-xs text-slate-400 italic">"{test.content}"</p>
                                  <div className="text-xs text-gold-500 pt-0.5">
                                    {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)} ({test.rating}/5)
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    onClick={() => handleEditTestimonialClick(test)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier le témoignage"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTestimonial(test.id)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer le témoignage"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* F. TAB WORKSPACE: TEAM MEMBER LIST */}
                      {activeTab === 'equipe' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Pôle d'Experts & Consultants</h3>
                              <p className="text-xs text-slate-400">Gérez l'équipe technique et stratégique de WisTechnologie.</p>
                            </div>
                            <button
                              onClick={handleAddTeamClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter un Membre</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(team).map((member) => (
                              <div key={member.id} className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                                <div className="space-y-1.5 text-left">
                                  <h4 className="font-display font-bold text-sm text-slate-100">{member.name}</h4>
                                  <p className="text-xs text-slate-400">{member.role} • <strong className="text-gold-500">{member.specialty}</strong></p>
                                  <p className="text-xs text-slate-400 max-w-2xl">{member.bio}</p>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    onClick={() => handleEditTeamClick(member)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier le membre d'équipe"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeam(member.id)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer le membre d'équipe"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* G. TAB WORKSPACE: BENEFITS / ATOUTS LIST */}
                      {activeTab === 'avantages' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-display font-bold text-base text-slate-200">Atouts & Avantages Concurrentiels</h3>
                              <p className="text-xs text-slate-400">Définissez vos valeurs d'excellence et de fiabilité.</p>
                            </div>
                            <button
                              onClick={handleAddBenefitClick}
                              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Ajouter un Atout</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3.5">
                            {filterBySearch(benefits).map((bene, idx) => (
                              <div key={idx} className="p-4.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                                      <Award size={14} />
                                    </div>
                                    <h4 className="font-display font-bold text-sm text-slate-100">{bene.title}</h4>
                                  </div>
                                  <p className="text-xs text-slate-400 max-w-2xl">{bene.desc}</p>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    onClick={() => handleEditBenefitClick(bene, idx)}
                                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-gold-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Modifier l'atout"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBenefit(idx)}
                                    className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 border border-slate-800 rounded-xl transition-all cursor-pointer"
                                    title="Supprimer l'atout"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* H. TAB WORKSPACE: SYSTEM SETTINGS AND DATA TOOLS */}
                      {activeTab === 'settings' && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          
                          <div>
                            <h3 className="font-display font-bold text-base text-slate-200">Configuration Système & Maintenance</h3>
                            <p className="text-xs text-slate-400">Outils d'intégrité de la plateforme WisTechnologie.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Maintenance / Factories reset widget */}
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                              <h4 className="font-display font-bold text-sm text-slate-200 flex items-center space-x-2">
                                <Sliders size={16} className="text-gold-500" />
                                <span>Restauration Usine & Démo</span>
                              </h4>
                              <p className="text-xs text-slate-400">
                                Réinitialisez toutes les données dynamiques du site d'accueil en écrasant les entrées persistantes (local storage et base de données Express). Cette action est irréversible.
                              </p>
                              <div className="pt-2">
                                <button
                                  onClick={handleResetData}
                                  className="px-4 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                                >
                                  <RefreshCw size={12} className="animate-spin-slow" />
                                  <span>Restaurer la base d'origine</span>
                                </button>
                              </div>
                            </div>

                            {/* Secure authentication options widget */}
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                              <h4 className="font-display font-bold text-sm text-slate-200 flex items-center space-x-2">
                                <Lock size={16} className="text-gold-500" />
                                <span>Informations de session d'accès</span>
                              </h4>
                              <p className="text-xs text-slate-400">
                                Votre clé d'accès administrateur est active et sécurisée. Les requêtes de synchronisation HTTP POST de vos modifications se font de manière transparente.
                              </p>
                              
                              <div className="space-y-2 text-xs font-mono text-slate-400">
                                <p>Administrateur : <strong className="text-slate-200">Bakary Diakité</strong></p>
                                <p>E-mail : <strong className="text-slate-200">bakarydiakite365@gmail.com</strong></p>
                                <p>Rôle d'habilitation : <strong className="text-emerald-400">Super Admin (Niveau 1)</strong></p>
                              </div>
                            </div>

                            {/* SMTP configuration options widget */}
                            <div className="md:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h4 className="font-display font-bold text-sm text-slate-200 flex items-center space-x-2">
                                  <Mail size={16} className="text-gold-500" />
                                  <span>Configuration du Serveur de Messagerie SMTP</span>
                                </h4>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={smtpForm.enabled}
                                    onChange={(e) => setSmtpForm({...smtpForm, enabled: e.target.checked})}
                                  />
                                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white border border-slate-700"></div>
                                  <span className="ml-2 text-xs font-mono text-slate-400 uppercase">Activer l'envoi d'e-mails</span>
                                </label>
                              </div>
                              <p className="text-xs text-slate-400">
                                Configurez vos identifiants de messagerie SMTP (ex: Gmail, Brevo, Outlook ou votre SMTP d'entreprise). Les demandes d'estimation et messages de contact soumis par les clients y seront automatiquement réacheminés.
                              </p>

                              <form onSubmit={handleSaveSmtp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Hôte SMTP *</label>
                                  <input
                                    type="text"
                                    required={smtpForm.enabled}
                                    value={smtpForm.host}
                                    onChange={(e) => setSmtpForm({...smtpForm, host: e.target.value})}
                                    placeholder="Ex : smtp.gmail.com"
                                    className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-700 font-mono"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Port SMTP *</label>
                                    <input
                                      type="number"
                                      required={smtpForm.enabled}
                                      value={smtpForm.port}
                                      onChange={(e) => setSmtpForm({...smtpForm, port: parseInt(e.target.value) || 587})}
                                      placeholder="587"
                                      className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-700 font-mono"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Sécurité SSL/TLS</label>
                                    <select
                                      value={smtpForm.secure ? 'true' : 'false'}
                                      onChange={(e) => setSmtpForm({...smtpForm, secure: e.target.value === 'true'})}
                                      className="w-full px-3 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 outline-none focus:border-slate-700 cursor-pointer"
                                    >
                                      <option value="false">Non (STARTTLS / Port 587)</option>
                                      <option value="true">Oui (SSL / Port 465)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Nom d'utilisateur SMTP / Expéditeur *</label>
                                  <input
                                    type="text"
                                    required={smtpForm.enabled}
                                    value={smtpForm.user}
                                    onChange={(e) => setSmtpForm({...smtpForm, user: e.target.value})}
                                    placeholder="Ex : contact@wistechnologie.com"
                                    className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-700 font-mono"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Mot de passe SMTP *</label>
                                  <input
                                    type="password"
                                    required={smtpForm.enabled}
                                    value={smtpForm.pass}
                                    onChange={(e) => setSmtpForm({...smtpForm, pass: e.target.value})}
                                    placeholder="Mot de passe ou clé d'application"
                                    className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-700 font-mono"
                                  />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Adresse e-mail de réception des messages de contact *</label>
                                  <input
                                    type="email"
                                    required={smtpForm.enabled}
                                    value={smtpForm.toEmail}
                                    onChange={(e) => setSmtpForm({...smtpForm, toEmail: e.target.value})}
                                    placeholder="Ex : samakedelamou858@gmail.com"
                                    className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-slate-700 font-mono"
                                  />
                                </div>

                                <div className="sm:col-span-2 pt-3 flex flex-wrap gap-3 justify-end border-t border-slate-800/60 mt-2">
                                  <button
                                    type="button"
                                    disabled={smtpTesting || !smtpForm.host || !smtpForm.user || !smtpForm.pass}
                                    onClick={handleTestSmtp}
                                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 disabled:opacity-50 border border-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                                  >
                                    {smtpTesting ? (
                                      <>
                                        <Loader2 size={12} className="animate-spin text-gold-500" />
                                        <span>Test en cours...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Send size={12} className="text-gold-500" />
                                        <span>Tester la connexion</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="submit"
                                    disabled={smtpSaving}
                                    className="px-5 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                                  >
                                    {smtpSaving ? (
                                      <>
                                        <Loader2 size={12} className="animate-spin text-slate-950" />
                                        <span>Sauvegarde...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Save size={12} />
                                        <span>Enregistrer la configuration</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>

                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              </>
            )}

      {/* MODAL WINDOWS FOR EDIT / ADD ACTIONS */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            {/* Dark glass backdrop overlay */}
            <div 
              onClick={() => setShowFormModal(false)}
              className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" 
            />

            {/* Form modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-slate-900 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-slate-850 text-left"
            >
              {/* Form Modal Header */}
              <div className="p-6 bg-brand-950 border-b border-slate-800 text-slate-100 flex justify-between items-center">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gold-500">
                  {editingId !== null || editingIndex !== null ? 'Modifier' : 'Ajouter'} - {activeTab.toUpperCase()}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 rounded-xl bg-slate-850/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Form parameters body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                
                {/* 1. SERVICES FORM PARAMS */}
                {activeTab === 'services' && (
                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Titre du Service *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.title || ''}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                        placeholder="Ex : Architecture Cloud & Sécurité"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Description courte *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.shortDesc || ''}
                        onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                        placeholder="Ex : Infrastructures cloud hautement disponibles."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Description complète *</label>
                      <textarea
                        required
                        rows={3}
                        value={serviceForm.longDesc || ''}
                        onChange={(e) => setServiceForm({ ...serviceForm, longDesc: e.target.value })}
                        placeholder="Détails complets de votre méthodologie, technologies et bénéfices..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Nom de l'Icône Lucide</label>
                      <select
                        value={serviceForm.iconName || 'Cpu'}
                        onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                      >
                        <option value="Cpu">Cpu (Ingénierie & Dev)</option>
                        <option value="Layers">Layers (Fullstack / DevOps)</option>
                        <option value="ShieldCheck">Shield (Sécurité & Audit)</option>
                        <option value="Terminal">Terminal (Scripting / Cloud)</option>
                        <option value="Users">Users (Conseil / Mentorat)</option>
                        <option value="Smartphone">Smartphone (Mobile)</option>
                        <option value="LineChart">LineChart (IA & Data Analytics)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase text-slate-400">Piliers techniques (Optionnels)</label>
                      {[0, 1, 2].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={(serviceForm.features || [])[idx] || ''}
                          onChange={(e) => {
                            const newFeatures = [...(serviceForm.features || ['', '', ''])];
                            newFeatures[idx] = e.target.value;
                            setServiceForm({ ...serviceForm, features: newFeatures });
                          }}
                          placeholder={`Pilier #${idx + 1}`}
                          className="w-full px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700 mb-1"
                        />
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}


                {/* 2. PROJECTS FORM PARAMS */}
                {activeTab === 'projets' && (
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Titre du Projet *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="Ex : Refonte SaaS NexaFlow"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Client *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.client || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                          placeholder="Ex : NexaFlow SAS"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Catégorie</label>
                        <select
                          value={projectForm.category || 'Web'}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Cloud & DevOps">Cloud & DevOps</option>
                          <option value="IA & Data">IA & Data</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Description synthétique *</label>
                      <textarea
                        required
                        rows={3}
                        value={projectForm.description || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Description succincte et objectifs..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Métrique KPI</label>
                        <input
                          type="text"
                          value={projectForm.metricValue || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, metricValue: e.target.value })}
                          placeholder="Ex : +180%"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Label de métrique</label>
                        <input
                          type="text"
                          value={projectForm.metricLabel || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, metricLabel: e.target.value })}
                          placeholder="Ex : satisfaction globale"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Thème Visuel d'illustration</label>
                      <select
                        value={projectForm.imageKeyword || 'workspace'}
                        onChange={(e) => setProjectForm({ ...projectForm, imageKeyword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                      >
                        <option value="workspace">Espace de travail / SaaS (Bleu nuit)</option>
                        <option value="jewelry">Bijouterie de Luxe (Bronze / Gold)</option>
                        <option value="turbine">Industrie & IA (Teal / Forêt)</option>
                        <option value="server">Cloud & Serveurs (Cyan / Tech)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase text-slate-400">Bullet points des résultats clés (Optionnels)</label>
                      {[0, 1, 2].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={(projectForm.results || [])[idx] || ''}
                          onChange={(e) => {
                            const newResults = [...(projectForm.results || ['', '', ''])];
                            newResults[idx] = e.target.value;
                            setProjectForm({ ...projectForm, results: newResults });
                          }}
                          placeholder={`KPI point #${idx + 1}`}
                          className="w-full px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700 mb-1"
                        />
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}


                {/* 3. FORMATIONS FORM PARAMS */}
                {activeTab === 'formations' && (
                  <form onSubmit={handleSaveFormation} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Titre de la Formation *</label>
                      <input
                        type="text"
                        required
                        value={formationForm.title || ''}
                        onChange={(e) => setFormationForm({ ...formationForm, title: e.target.value })}
                        placeholder="Ex : Architecte Kubernetes & DevOps"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Durée *</label>
                        <input
                          type="text"
                          required
                          value={formationForm.duration || ''}
                          onChange={(e) => setFormationForm({ ...formationForm, duration: e.target.value })}
                          placeholder="Ex : 5 jours (35h)"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Tarif HT</label>
                        <input
                          type="text"
                          value={formationForm.price || ''}
                          onChange={(e) => setFormationForm({ ...formationForm, price: e.target.value })}
                          placeholder="Ex : 2 450 € HT"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Niveau de difficulté</label>
                        <select
                          value={formationForm.level || 'Intermédiaire'}
                          onChange={(e) => setFormationForm({ ...formationForm, level: e.target.value as any })}
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                        >
                          <option value="Débutant">Débutant</option>
                          <option value="Intermédiaire">Intermédiaire</option>
                          <option value="Avancé">Avancé</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Instructeur Principal</label>
                        <input
                          type="text"
                          value={formationForm.instructor || ''}
                          onChange={(e) => setFormationForm({ ...formationForm, instructor: e.target.value })}
                          placeholder="Ex : William S."
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Objectif Pédagogique *</label>
                      <textarea
                        required
                        rows={3}
                        value={formationForm.description || ''}
                        onChange={(e) => setFormationForm({ ...formationForm, description: e.target.value })}
                        placeholder="Quels sont les objectifs clés..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Thème Visuel</label>
                      <select
                        value={formationForm.imageKeyword || 'workspace'}
                        onChange={(e) => setFormationForm({ ...formationForm, imageKeyword: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                      >
                        <option value="workspace">Espace de travail / SaaS (Bleu nuit)</option>
                        <option value="turbine">Industrie & IA (Teal / Forêt)</option>
                        <option value="server">Cloud & Serveurs (Cyan / Tech)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase text-slate-400">Programme / Chapitres principaux</label>
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={(formationForm.syllabus || [])[idx] || ''}
                          onChange={(e) => {
                            const newSyllabus = [...(formationForm.syllabus || ['', '', '', ''])];
                            newSyllabus[idx] = e.target.value;
                            setFormationForm({ ...formationForm, syllabus: newSyllabus });
                          }}
                          placeholder={`Chapitre #${idx + 1}`}
                          className="w-full px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700 mb-1"
                        />
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}


                {/* 4. TESTIMONIALS FORM PARAMS */}
                {activeTab === 'temoignages' && (
                  <form onSubmit={handleSaveTestimonial} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Nom Complet *</label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.name || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        placeholder="Ex : Jean-François Moreau"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Rôle / Poste</label>
                        <input
                          type="text"
                          value={testimonialForm.role || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                          placeholder="Ex : CTO"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Entreprise *</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.company || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                          placeholder="Ex : TechCorp SAS"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Note Globale</label>
                      <select
                        value={testimonialForm.rating || 5}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                      >
                        <option value={5}>5 Étoiles (Excellent)</option>
                        <option value={4}>4 Étoiles (Très bon)</option>
                        <option value={3}>3 Étoiles (Moyen)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Message d'avis client *</label>
                      <textarea
                        required
                        rows={4}
                        value={testimonialForm.content || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                        placeholder="Évaluation ou commentaire de votre client..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}


                {/* 5. TEAM MEMBERS FORM PARAMS */}
                {activeTab === 'equipe' && (
                  <form onSubmit={handleSaveTeam} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Nom Complet *</label>
                      <input
                        type="text"
                        required
                        value={teamForm.name || ''}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        placeholder="Ex : Dr. Sarah Diakité"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Poste / Rôle *</label>
                        <input
                          type="text"
                          required
                          value={teamForm.role || ''}
                          onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                          placeholder="Ex : Directrice Associée"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-slate-400">Spécialité Technique</label>
                        <input
                          type="text"
                          value={teamForm.specialty || ''}
                          onChange={(e) => setTeamForm({ ...teamForm, specialty: e.target.value })}
                          placeholder="Ex : Cloud Sec, DevOps, Audit"
                          className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Biographie d'expertise *</label>
                      <textarea
                        required
                        rows={3}
                        value={teamForm.bio || ''}
                        onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                        placeholder="Courte description de sa formation, ses spécialités et réalisations..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}


                {/* 6. BENEFITS FORM PARAMS */}
                {activeTab === 'avantages' && (
                  <form onSubmit={handleSaveBenefit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Titre de l'Atout *</label>
                      <input
                        type="text"
                        required
                        value={benefitForm.title || ''}
                        onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
                        placeholder="Ex : Disponibilité 24/7"
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Description de l'Atout *</label>
                      <textarea
                        required
                        rows={3}
                        value={benefitForm.desc || ''}
                        onChange={(e) => setBenefitForm({ ...benefitForm, desc: e.target.value })}
                        placeholder="Décrivez en quoi consiste cette garantie de valeur..."
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 outline-none resize-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">Icône illustrative</label>
                      <select
                        value={benefitForm.icon || 'Award'}
                        onChange={(e) => setBenefitForm({ ...benefitForm, icon: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 outline-none focus:border-slate-700"
                      >
                        <option value="Award">Award (Certifié / Excellence)</option>
                        <option value="Target">Target (Précision / Stratégie)</option>
                        <option value="Clock">Clock (Rapidité / Support)</option>
                        <option value="ShieldCheck">Shield (Sécurité / Garantie)</option>
                        <option value="Cpu">Cpu (Technologie / Innovation)</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                      <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 text-xs font-bold cursor-pointer">Annuler</button>
                      <button type="submit" className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"><Save size={14} /><span>Enregistrer</span></button>
                    </div>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminLaunchButton: React.FC = () => (
  <div className="fixed bottom-24 right-8 z-40">
    <a
      href="/admin"
      id="admin-panel-toggle"
      className="flex items-center space-x-2 px-4 py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-full shadow-xl border border-slate-800 transition-all cursor-pointer group hover:scale-105 active:scale-95"
    >
      <Settings size={16} className="animate-spin-slow group-hover:rotate-45 transition-transform text-gold-500" />
      <span className="text-xs font-semibold font-mono tracking-wider">CMS Administrateur</span>
      <span className="w-2.5 h-2.5 rounded-full bg-gold-500 border border-slate-900" />
    </a>
  </div>
);
