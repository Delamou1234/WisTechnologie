export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string; // Used to dynamically map Lucide icons
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Web' | 'Mobile' | 'Cloud & DevOps' | 'IA & Data';
  client: string;
  description: string;
  results: string[];
  metricValue: string;
  metricLabel: string;
  imageKeyword: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialty: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  syllabus: string[];
  instructor: string;
  imageKeyword: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export interface Benefit {
  title: string;
  desc: string;
  icon: string;
}

