import { Service, Project, Testimonial, TeamMember, Formation } from './types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'conseil',
    title: 'Conseil & Stratégie Digitale',
    shortDesc: 'Définissez une feuille de route technologique claire pour propulser votre entreprise vers l\'avenir.',
    longDesc: 'Nous analysons vos processus métier, auditions vos systèmes existants et concevons des architectures logicielles évolutives et adaptées à vos objectifs de croissance.',
    iconName: 'Compass',
    features: [
      'Audit d\'architecture & dette technique',
      'Cadrage et choix des stacks technologiques',
      'Accompagnement méthodologique Agile',
      'Stratégie de transformation Cloud native'
    ]
  },
  {
    id: 'dev-premium',
    title: 'Développement Web & Mobile Premium',
    shortDesc: 'Des applications sur-mesure rapides, sécurisées et centrées sur l\'expérience utilisateur.',
    longDesc: 'De l\'interface pixel-perfect aux microservices robustes, nous créons des plateformes web et applications mobiles performantes en utilisant les standards les plus exigeants de l\'industrie.',
    iconName: 'Code',
    features: [
      'Architectures Single Page & Server-Side Rendering',
      'Développement mobile hybride (iOS & Android)',
      'API RESTful & GraphQL hautement performantes',
      'Design Systems sur-mesure & UI/UX ultra soignée'
    ]
  },
  {
    id: 'ia-data',
    title: 'IA & Data Engineering',
    shortDesc: 'Exploitez la puissance de l\'intelligence artificielle pour optimiser vos opérations.',
    longDesc: 'Intégrez des modèles de langage avancés (LLM), automatisez l\'analyse de données complexes et déployez des systèmes prédictifs intelligents pour prendre des décisions stratégiques en temps réel.',
    iconName: 'Sparkles',
    features: [
      'Intégration d\'IA Générative & LLMs',
      'Pipelines de données (ETL) temps réel',
      'Modèles de Machine Learning prédictifs',
      'Visualisation de données complexes (Business Intelligence)'
    ]
  },
  {
    id: 'devops-cloud',
    title: 'Cloud, Sécurité & DevOps',
    shortDesc: 'Garantissez une haute disponibilité et une sécurité sans compromis pour vos services.',
    longDesc: 'Nous concevons des infrastructures cloud sécurisées, automatisons vos déploiements (CI/CD) et surveillons vos plateformes pour assurer une résilience totale face aux pics de charge.',
    iconName: 'ShieldCheck',
    features: [
      'Infrastructure as Code (Terraform)',
      'Conteneurisation (Docker, Kubernetes)',
      'Pipelines CI/CD automatisés & sécurisés',
      'Sécurité réseau, chiffrement & conformité RGPD'
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'nexaflow',
    title: 'Portail Collaboratif NexaFlow',
    category: 'Web',
    client: 'NexaFlow SAS',
    description: 'Conception et développement complet d\'un SaaS d\'orchestration de flux logistiques pour l\'industrie pharmaceutique.',
    results: [
      'Temps de traitement logistique réduit de 40%',
      'Interface temps réel réactive avec WebSockets',
      'Conformité stricte aux normes de sécurité médicale'
    ],
    metricValue: '+180%',
    metricLabel: 'de productivité opérationnelle',
    imageKeyword: 'workspace'
  },
  {
    id: 'elysee',
    title: 'Plateforme E-Commerce Elysée',
    category: 'Mobile',
    client: 'Elysée Luxury Group',
    description: 'Refonte complète de l\'expérience d\'achat mobile et web pour une marque de haute joaillerie internationale.',
    results: [
      'Chargement instantané (< 1.2s sur mobile)',
      'Tunnel d\'achat simplifié en 3 étapes',
      'Panier moyen augmenté de 25%'
    ],
    metricValue: '+45%',
    metricLabel: 'de taux de conversion',
    imageKeyword: 'jewelry'
  },
  {
    id: 'predicta',
    title: 'IA Prédictive Predicta',
    category: 'IA & Data',
    client: 'AeroTech Guinée',
    description: 'Mise en place d\'une IA d\'analyse acoustique pour prédire les pannes sur les turbines de production.',
    results: [
      'Anticipation des défaillances 14 jours à l\'avance',
      'Économies annuelles estimées à 2.4 milliards GNF',
      'Tableau de bord interactif pour les ingénieurs terrain'
    ],
    metricValue: '99.8%',
    metricLabel: 'de fiabilité des prédictions',
    imageKeyword: 'turbine'
  },
  {
    id: 'safecorp',
    title: 'Migration Cloud SafeCorp',
    category: 'Cloud & DevOps',
    client: 'SafeCorp Assurance',
    description: 'Transition complète d\'une infrastructure on-premise vieillissante vers un cloud hybride AWS hautement sécurisé.',
    results: [
      'Aucune interruption de service pendant la bascule',
      'Mise à l\'échelle automatique lors des pics de charge',
      'Réduction drastique des coûts d\'hébergement'
    ],
    metricValue: '-60%',
    metricLabel: 'de coûts d\'infrastructure',
    imageKeyword: 'server'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    name: 'Sophie Laurent',
    role: 'Directrice de l\'Innovation',
    company: 'NexaFlow SAS',
    content: 'WisTechnologie a su cerner nos enjeux métier complexes et les transformer en une plateforme fluide, performante et adoptée par 100% de nos équipes. Leur rigueur technique et leur accompagnement ont été irréprochables.',
    rating: 5
  },
  {
    id: 't2',
    name: 'Mamadou Diallo',
    role: 'Directeur Technique (CTO)',
    company: 'Guinée Telecom',
    content: 'Une agence qui comprend réellement ce que "premium" veut dire. Le design system créé est d\'une qualité rare et l\'architecture technique est conçue pour durer. Nous recommandons vivement WisTechnologie.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Sarah Amrani',
    role: 'VP Engineering',
    company: 'AeroTech Guinée',
    content: 'L\'expertise IA de WisTechnologie a permis de débloquer des gains d\'efficacité majeurs sur nos lignes de production. Un projet complexe mené à bien avec brio et transparence.',
    rating: 5
  }
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'm1',
    name: 'Bakary DIAKITE',
    role: 'Président Directeur Général (PDG) & Fondateur',
    bio: 'Leader visionnaire et stratège technologique, il pilote la vision globale de WisTechnologie pour concevoir des architectures informatiques d\'envergure.',
    specialty: 'Stratégie d\'Entreprise, Innovation & Gouvernance Tech'
  },
  {
    id: 'm2',
    name: 'Samaké DELAMOU',
    role: 'Directeur Général (DG)',
    bio: 'Garant de l\'excellence opérationnelle et du développement de l\'agence. Il supervise la réalisation de nos chantiers critiques et l\'accompagnement des grands comptes.',
    specialty: 'Opérations Globales, Gestion de Projets & Excellence Client'
  },
  {
    id: 'm3',
    name: 'Abdoul Karim',
    role: 'Chargé aux Ressources Humaines',
    bio: 'Dédié au recrutement des meilleurs ingénieurs, au développement continu des compétences internes et à la pérennisation d\'une culture d\'entreprise d\'élite.',
    specialty: 'Acquisition de Talents, Culture d\'Entreprise & Gestion RH'
  }
];

export const BENEFITS_DATA = [
  {
    title: 'Excellence Technique',
    desc: 'Nous n\'écrivons pas seulement du code. Nous façonnons des architectures logicielles fiables, documentées, hautement scalables et sécurisées.',
    icon: 'Terminal'
  },
  {
    title: 'Design Haut de Gamme',
    desc: 'Chaque pixel compte. Nous concevons des interfaces épurées, modernes et parfaitement adaptées à l\'image de marque de nos clients.',
    icon: 'Layers'
  },
  {
    title: 'Transparence & Agilité',
    desc: 'Des sprints clairs, des livraisons régulières et des canaux de communication directs pour un suivi de projet serein et sans surprise.',
    icon: 'MessageSquareShare'
  },
  {
    title: 'Approche Sur-Mesure',
    desc: 'Pas de template générique ou de solution préconçue. Nous analysons vos contraintes uniques pour concevoir LA solution parfaite.',
    icon: 'Settings'
  }
];

export const FORMATIONS_DATA: Formation[] = [
  {
    id: 'f1',
    title: 'Architecte Cloud, DevOps & Kubernetes',
    description: 'Une immersion complète pour maîtriser l\'Infrastructure as Code, Docker et le déploiement d\'applications hautement disponibles sur Kubernetes.',
    duration: '5 jours (35h)',
    price: '24 500 000 GNF HT',
    level: 'Avancé',
    syllabus: [
      'Fondamentaux de la conteneurisation avec Docker',
      'Architecture & déploiement de clusters Kubernetes',
      'Automatisation de pipelines CI/CD (GitHub Actions)',
      'Infrastructure as Code (IaC) avec Terraform & Ansible'
    ],
    instructor: 'Bakary DIAKITE',
    imageKeyword: 'server'
  },
  {
    id: 'f2',
    title: 'Intégration d\'IA Générative & LLMs',
    description: 'Apprenez à concevoir et intégrer des agents conversationnels internes et des pipelines RAG performants au sein de vos systèmes existants.',
    duration: '3 jours (21h)',
    price: '18 500 000 GNF HT',
    level: 'Intermédiaire',
    syllabus: [
      'Introduction aux LLM et Prompt Engineering',
      'Mise en place d\'une architecture RAG (Retrieval-Augmented Generation)',
      'Développement avec l\'API Gemini et LangChain',
      'Sécurité, filtrage et optimisation des coûts d\'API'
    ],
    instructor: 'Samaké DELAMOU',
    imageKeyword: 'turbine'
  },
  {
    id: 'f3',
    title: 'Clean Architecture & TypeScript Moderne',
    description: 'Maîtrisez les design patterns avancés, la Clean Architecture et le typage strict pour concevoir des applications web robustes et testables.',
    duration: '3 jours (21h)',
    price: '16 000 000 GNF HT',
    level: 'Intermédiaire',
    syllabus: [
      'Principes SOLID et programmation orientée objet',
      'Découpage en couches (Domain, Use Cases, Infrastructure)',
      'Patterns avancés de TypeScript (Generics, Decorators)',
      'Mise en place de tests unitaires et d\'intégration (Vitest)'
    ],
    instructor: 'Samaké DELAMOU',
    imageKeyword: 'workspace'
  }
];

