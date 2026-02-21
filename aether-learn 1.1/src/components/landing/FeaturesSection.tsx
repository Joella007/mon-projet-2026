import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Route, 
  BarChart3, 
  BookOpen, 
  BrainCircuit, 
  Clock 
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Chat IA',
      description: 'Obtenez des explications instantanées et personnalisées sur n\'importe quel sujet. Notre IA comprend le contexte et s\'adapte à votre style d\'apprentissage.',
      color: 'from-primary to-accent',
    },
    {
      icon: Route,
      title: 'Apprentissage personnalisé',
      description: 'L\'IA analyse vos forces et faiblesses pour créer un parcours d\'étude personnalisé rien que pour vous.',
      color: 'from-accent to-secondary',
    },
    {
      icon: BarChart3,
      title: 'Suivi des progrès',
      description: 'Visualisez votre amélioration avec des analyses détaillées, des séries d\'études et des aperçus de performance.',
      color: 'from-secondary to-success',
    },
    {
      icon: BookOpen,
      title: 'Multi-matières',
      description: 'Des mathématiques à la littérature, obtenez une aide experte dans toutes les principales matières académiques.',
      color: 'from-success to-primary',
    },
    {
      icon: BrainCircuit,
      title: 'Quiz interactifs',
      description: 'Testez vos connaissances avec des quiz adaptatifs qui ajustent la difficulté selon vos performances.',
      color: 'from-primary to-secondary',
    },
    {
      icon: Clock,
      title: 'Disponible 24h/24',
      description: 'Apprenez quand l\'inspiration vous vient. Votre tuteur IA est toujours prêt à vous aider, jour et nuit.',
      color: 'from-accent to-primary',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Fonctionnalités
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Tout ce dont vous avez besoin pour{' '}
            <span className="gradient-text">réussir</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Notre plateforme alimentée par l'IA combine une technologie de pointe avec des méthodes d'apprentissage éprouvées pour vous aider à atteindre vos objectifs académiques.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group glass-card-hover p-6"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
