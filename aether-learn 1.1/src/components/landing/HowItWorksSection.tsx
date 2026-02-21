import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Créez votre compte',
      description: 'Inscrivez-vous en quelques secondes avec votre email ou vos comptes sociaux. Aucune carte de crédit requise.',
    },
    {
      number: '02',
      icon: MessageCircle,
      title: 'Choisissez vos matières',
      description: 'Sélectionnez les matières que vous souhaitez maîtriser. Notre IA personnalisera votre parcours d\'apprentissage.',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Commencez à apprendre',
      description: 'Discutez avec votre tuteur IA, complétez des exercices et regardez vos connaissances grandir.',
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Comment ça marche
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Commencez à apprendre en{' '}
            <span className="gradient-text">trois étapes simples</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Démarrer avec votre tuteur IA est rapide et facile. Suivez ces étapes pour commencer votre parcours d'apprentissage personnalisé.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Number Badge */}
                <div className="absolute -top-4 right-0 lg:right-auto lg:left-0 text-6xl font-bold text-muted/50">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 max-w-xs text-muted-foreground">{step.description}</p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <ArrowRight className="mt-6 h-6 w-6 text-primary lg:hidden" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
