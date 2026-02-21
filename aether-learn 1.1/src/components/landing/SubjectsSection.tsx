import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  Languages, 
  Code2, 
  Landmark, 
  TrendingUp,
  LucideIcon,
  Music,
  Palette,
  Globe,
  BookOpen
} from 'lucide-react';
import { getMatieres, Matiere } from '@/api/matieres.api';

// Map des icônes basées sur le nom de la matière
const iconMap: Record<string, LucideIcon> = {
  'Mathematics': Calculator,
  'Mathématiques': Calculator,
  'Physics': Atom,
  'Physique': Atom,
  'Chemistry': FlaskConical,
  'Chimie': FlaskConical,
  'Biology': Dna,
  'Biologie': Dna,
  'Languages': Languages,
  'Langues': Languages,
  'Computer Science': Code2,
  'Informatique': Code2,
  'History': Landmark,
  'Histoire': Landmark,
  'Geography': Globe,
  'Géographie': Globe,
  'Economics': TrendingUp,
  'Économie': TrendingUp,
  'Literature': BookOpen,
  'Littérature': BookOpen,
  'Music': Music,
  'Musique': Music,
  'Art': Palette,
};

// Map des couleurs basées sur le nom de la matière
const colorMap: Record<string, string> = {
  'Mathematics': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Mathématiques': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Physics': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Physique': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Chemistry': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Chimie': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Biology': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'Biologie': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'Languages': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Langues': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Computer Science': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'Informatique': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'History': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Histoire': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Geography': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Géographie': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Economics': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  'Économie': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  'Literature': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  'Littérature': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  'Music': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  'Musique': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  'Art': 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
};

// Couleurs par défaut pour les matières non mappées
const defaultColors = [
  'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'bg-green-500/10 text-green-500 border-green-500/20',
  'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
];

interface SubjectWithIcon extends Matiere {
  icon: LucideIcon;
  color: string;
}

export function SubjectsSection() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatieres = async () => {
      try {
        setLoading(true);
        const matieres = await getMatieres();
        
        // Mapper les matières avec les icônes et couleurs
        const subjectsWithIcons: SubjectWithIcon[] = matieres.map((matiere, index) => ({
          ...matiere,
          icon: iconMap[matiere.name] || Calculator,
          color: colorMap[matiere.name] || defaultColors[index % defaultColors.length],
        }));
        
        setSubjects(subjectsWithIcons);
        setError(null);
      } catch (err: any) {
        console.error('Erreur lors du chargement des matières:', err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Erreur inconnue';
        console.error('Détails de l\'erreur:', {
          status: err?.response?.status,
          data: err?.response?.data,
          message: errorMessage
        });
        setError(`Impossible de charger les matières: ${errorMessage}`);
        // Fallback avec les matières par défaut en cas d'erreur
        const defaultSubjects = [
          { id: 1, name: 'Mathématiques', icon: Calculator, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
          { id: 2, name: 'Physique', icon: Atom, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
          { id: 3, name: 'Chimie', icon: FlaskConical, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
          { id: 4, name: 'Biologie', icon: Dna, color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
          { id: 5, name: 'Informatique', icon: Code2, color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
          { id: 6, name: 'Langues', icon: Languages, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
        ];
        setSubjects(defaultSubjects);
      } finally {
        setLoading(false);
      }
    };

    loadMatieres();
  }, []);

  const handleSubjectClick = (matiereId: number) => {
    navigate(`/courses?matiere=${matiereId}`);
  }

  return (
    <section id="subjects" className="py-20 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            Matières
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Maîtrisez n'importe quelle{' '}
            <span className="gradient-text">matière</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Des sciences aux lettres, notre tuteur IA couvre toutes les principales matières académiques avec une expertise de niveau professionnel.
          </p>
        </motion.div>

        {/* Subjects Grid */}
        {loading && (
          <div className="mt-16 flex items-center justify-center">
            <p className="text-muted-foreground">Chargement des matières...</p>
          </div>
        )}

        {error && (
          <div className="mt-16 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && subjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSubjectClick(subject.id)}
                className={`group cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-lg ${subject.color}`}
              >
                <subject.icon className="h-8 w-8" />
                <p className="mt-3 font-semibold text-foreground">{subject.name}</p>
                {subject.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{subject.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
