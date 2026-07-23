import React from 'react';
import { 
  Compass, 
  Code, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  FileText, 
  Users, 
  Award, 
  Activity, 
  Terminal, 
  Layers, 
  MessageSquareShare, 
  Settings 
} from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, className = '', size }) => {
  const icons: Record<string, any> = {
    Compass,
    Code,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Check,
    ChevronRight,
    Menu,
    X,
    Star,
    Send,
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowUpRight,
    FileText,
    Users,
    Award,
    Activity,
    Terminal,
    Layers,
    MessageSquareShare,
    Settings
  };

  const IconComponent = icons[name];
  if (!IconComponent) {
    // Fallback icon
    return <Settings className={className} size={size} id={`icon-fallback-${name}`} />;
  }

  return <IconComponent className={className} size={size} id={`icon-${name}`} />;
};
