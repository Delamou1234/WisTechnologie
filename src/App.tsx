import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Realizations } from './components/Realizations';
import { Formations } from './components/Formations';
import { About } from './components/About';
import { ProjectEstimator } from './components/ProjectEstimator';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel, AdminLaunchButton } from './components/AdminPanel';
import { 
  SERVICES_DATA, 
  PROJECTS_DATA, 
  TESTIMONIALS_DATA, 
  TEAM_DATA, 
  BENEFITS_DATA, 
  FORMATIONS_DATA 
} from './data';
import { Service, Project, Testimonial, TeamMember, Formation, Benefit } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Terminal, Shield, Cpu } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState('');
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Persistent Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'guinea'>(() => {
    const saved = localStorage.getItem('wistech_theme');
    return (saved as 'light' | 'dark' | 'guinea') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('wistech_theme', theme);
  }, [theme]);

  // Unified persistent State for all Home Page sections (database-driven)
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);

  // Load all home page sections from Backend API with LocalStorage/Static Fallback
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servRes, projRes, testRes, teamRes, beneRes, formRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/projects'),
          fetch('/api/testimonials'),
          fetch('/api/team'),
          fetch('/api/benefits'),
          fetch('/api/formations')
        ]);
        
        if (servRes.ok) {
          const servData = await servRes.json();
          setServices(servData);
          localStorage.setItem('wistech_services', JSON.stringify(servData));
        }
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData);
          localStorage.setItem('wistech_projects', JSON.stringify(projData));
        }
        if (testRes.ok) {
          const testData = await testRes.json();
          setTestimonials(testData);
          localStorage.setItem('wistech_testimonials', JSON.stringify(testData));
        }
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeam(teamData);
          localStorage.setItem('wistech_team', JSON.stringify(teamData));
        }
        if (beneRes.ok) {
          const beneData = await beneRes.json();
          setBenefits(beneData);
          localStorage.setItem('wistech_benefits', JSON.stringify(beneData));
        }
        if (formRes.ok) {
          const formData = await formRes.json();
          setFormations(formData);
          localStorage.setItem('wistech_formations', JSON.stringify(formData));
        }
      } catch (err) {
        console.warn('Backend connection failed, falling back to local storage or defaults', err);
        
        const storedServices = localStorage.getItem('wistech_services');
        setServices(storedServices ? JSON.parse(storedServices) : SERVICES_DATA);

        const storedProjects = localStorage.getItem('wistech_projects');
        setProjects(storedProjects ? JSON.parse(storedProjects) : PROJECTS_DATA);

        const storedTestimonials = localStorage.getItem('wistech_testimonials');
        setTestimonials(storedTestimonials ? JSON.parse(storedTestimonials) : TESTIMONIALS_DATA);

        const storedTeam = localStorage.getItem('wistech_team');
        setTeam(storedTeam ? JSON.parse(storedTeam) : TEAM_DATA);

        const storedBenefits = localStorage.getItem('wistech_benefits');
        setBenefits(storedBenefits ? JSON.parse(storedBenefits) : BENEFITS_DATA);

        const storedFormations = localStorage.getItem('wistech_formations');
        setFormations(storedFormations ? JSON.parse(storedFormations) : FORMATIONS_DATA);
      }
    };

    fetchInitialData();
  }, []);

  const updateServices = async (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('wistech_services', JSON.stringify(newServices));
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServices)
      });
    } catch (e) {
      console.error('Failed to sync services with backend server', e);
    }
  };

  const updateProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('wistech_projects', JSON.stringify(newProjects));
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjects)
      });
    } catch (e) {
      console.error('Failed to sync projects with backend server', e);
    }
  };

  const updateTestimonials = async (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem('wistech_testimonials', JSON.stringify(newTestimonials));
    try {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonials)
      });
    } catch (e) {
      console.error('Failed to sync testimonials with backend server', e);
    }
  };

  const updateTeam = async (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem('wistech_team', JSON.stringify(newTeam));
    try {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      });
    } catch (e) {
      console.error('Failed to sync team with backend server', e);
    }
  };

  const updateBenefits = async (newBenefits: Benefit[]) => {
    setBenefits(newBenefits);
    localStorage.setItem('wistech_benefits', JSON.stringify(newBenefits));
    try {
      await fetch('/api/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenefits)
      });
    } catch (e) {
      console.error('Failed to sync benefits with backend server', e);
    }
  };

  const updateFormations = async (newFormations: Formation[]) => {
    setFormations(newFormations);
    localStorage.setItem('wistech_formations', JSON.stringify(newFormations));
    try {
      await fetch('/api/formations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormations)
      });
    } catch (e) {
      console.error('Failed to sync formations with backend server', e);
    }
  };

  const resetAllToDefault = async () => {
    setServices(SERVICES_DATA);
    setProjects(PROJECTS_DATA);
    setTestimonials(TESTIMONIALS_DATA);
    setTeam(TEAM_DATA);
    setBenefits(BENEFITS_DATA);
    setFormations(FORMATIONS_DATA);

    localStorage.setItem('wistech_services', JSON.stringify(SERVICES_DATA));
    localStorage.setItem('wistech_projects', JSON.stringify(PROJECTS_DATA));
    localStorage.setItem('wistech_testimonials', JSON.stringify(TESTIMONIALS_DATA));
    localStorage.setItem('wistech_team', JSON.stringify(TEAM_DATA));
    localStorage.setItem('wistech_benefits', JSON.stringify(BENEFITS_DATA));
    localStorage.setItem('wistech_formations', JSON.stringify(FORMATIONS_DATA));

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.error('Failed to reset backend data', e);
    }
  };

  // Monitor scroll for Scroll-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set up intersection observer to detect current section
  useEffect(() => {
    const sections = ['home', 'services', 'realizations', 'formations', 'about', 'estimator', 'faq', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies center of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [projects, formations]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminPanel
        services={services}
        setServices={updateServices}
        projects={projects}
        setProjects={updateProjects}
        testimonials={testimonials}
        setTestimonials={updateTestimonials}
        team={team}
        setTeam={updateTeam}
        benefits={benefits}
        setBenefits={updateBenefits}
        formations={formations}
        setFormations={updateFormations}
        resetAllToDefault={resetAllToDefault}
      />
    );
  }

  return (
    <div className={`min-h-screen theme-${theme} bg-slate-50 text-slate-900 font-sans selection:bg-brand-800/10 selection:text-brand-950 flex flex-col justify-between transition-colors duration-300`}>
      {/* Navbar */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        scrollToSection={scrollToSection} 
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero scrollToSection={scrollToSection} theme={theme} />

        {/* Dynamic Business Presentation Ticker Bar (Results focus) */}
        <div className="bg-brand-900 text-brand-100 py-6 overflow-hidden border-y border-brand-800 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap justify-center md:justify-between items-center gap-6">
            <div className="flex items-center space-x-3 text-sm font-mono tracking-wider">
              <Terminal size={16} className="text-gold-500" />
              <span>STACKS : REACT • TYPESCRIPT • NODE • PYTHON</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-mono tracking-wider">
              <Shield size={16} className="text-gold-500" />
              <span>SÉCURITÉ : AUDIT OWASP • SÉCURISATION API • RGPD</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-mono tracking-wider">
              <Cpu size={16} className="text-gold-500" />
              <span>INNOVATION : INTELLIGENCE ARTIFICIELLE • SAAS</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <Services services={services} />

        {/* Realizations Section */}
        <Realizations projects={projects} />

        {/* Formations Section */}
        <Formations formations={formations} />

        {/* About Section */}
        <About team={team} benefits={benefits} testimonials={testimonials} />

        {/* Dynamic Project Estimator Section */}
        <ProjectEstimator 
          theme={theme} 
          onSendEstimate={(msg, sub) => {
            setPrefilledMessage(msg);
            setPrefilledSubject(sub);
            scrollToSection('contact');
          }} 
        />

        {/* Frequently Asked Questions Section */}
        <Faq theme={theme} />

        {/* Contact Section */}
        <Contact 
          prefilledMessage={prefilledMessage}
          prefilledSubject={prefilledSubject}
          onClearPrefill={() => {
            setPrefilledMessage('');
            setPrefilledSubject('');
          }}
        />
      </main>

      {/* Admin Console Launch Button — links to the dedicated /admin page */}
      <AdminLaunchButton />

      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />

      {/* Scroll to Top Micro-Interaction */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3.5 bg-brand-800 hover:bg-brand-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            aria-label="Retour en haut"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
