import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Sparkles, Mail, Lock, User, ArrowLeft, 
  ArrowRight, Check, GraduationCap, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getNiveaux } from '@/api/niveaux.api';
import { Niveau } from '@/types/niveau.types';

// ── Icônes par niveau ────────────────────────────────────────────────────────
const levelIcons: { [key: string]: string } = {
  'Collège':             '📚',
  'Lycée':               '🎓',
  'Université':          '🏛️',
  'Vie professionnelle': '💼',
};

// ── Matières par niveau ───────────────────────────────────────────────────────
// Clé = nom_niveau exact dans Supabase
const subjectsByLevel: { [key: string]: { id: number; name: string; icon: string }[] } = {
  'Collège': [
    { id: 1, name: 'Mathématiques', icon: '🔢' },
    { id: 2, name: 'Français',      icon: '📖' },
    { id: 3, name: 'Histoire-Géo',  icon: '🗺️' },
    { id: 4, name: 'Sciences',      icon: '🔬' },
    { id: 5, name: 'Anglais',       icon: '🌍' },
    { id: 6, name: 'Arts',          icon: '🎨' },
  ],
  'Lycée': [
    { id: 1,  name: 'Mathématiques', icon: '🔢' },
    { id: 2,  name: 'Physique',      icon: '⚛️' },
    { id: 3,  name: 'Chimie',        icon: '🧪' },
    { id: 4,  name: 'Biologie',      icon: '🧬' },
    { id: 5,  name: 'Histoire',      icon: '📜' },
    { id: 6,  name: 'Philosophie',   icon: '🤔' },
    { id: 7,  name: 'Langues',       icon: '🌍' },
    { id: 8,  name: 'Économie',      icon: '📈' },
  ],
  'Université': [
    { id: 1,  name: 'Mathematics',     icon: '🔢' },
    { id: 2,  name: 'Physics',         icon: '⚛️' },
    { id: 3,  name: 'Chemistry',       icon: '🧪' },
    { id: 4,  name: 'Biology',         icon: '🧬' },
    { id: 5,  name: 'Computer Science',icon: '💻' },
    { id: 6,  name: 'Languages',       icon: '🌍' },
    { id: 7,  name: 'History',         icon: '📜' },
    { id: 8,  name: 'Economics',       icon: '📈' },
  ],
  'Vie professionnelle': [
    { id: 1,  name: 'Management',      icon: '🏢' },
    { id: 2,  name: 'Marketing',       icon: '📣' },
    { id: 3,  name: 'Finance',         icon: '💰' },
    { id: 4,  name: 'Informatique',    icon: '💻' },
    { id: 5,  name: 'Communication',   icon: '🗣️' },
    { id: 6,  name: 'Langues',         icon: '🌍' },
  ],
};

// ── Validation mot de passe ───────────────────────────────────────────────────
const passwordRules = [
  { label: 'Au moins 8 caractères',      test: (p: string) => p.length >= 8 },
  { label: 'Une lettre majuscule',        test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Une lettre minuscule',        test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un chiffre',                  test: (p: string) => /\d/.test(p) },
  { label: 'Un caractère spécial (@$!%*?&_-#)', test: (p: string) => /[@$!%*?&_\-#]/.test(p) },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email:            '',
    password:         '',
    confirmPassword:  '',
    firstName:        '',
    lastName:         '',
    educationLevel:   null as number | null,
    educationLevelName: '' as string,
    selectedSubjects: [] as number[],
    acceptTerms:      false,
  });
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading]                 = useState(false);
  const [niveaux, setNiveaux]                     = useState<Niveau[]>([]);

  const { register } = useAuth();
  const navigate     = useNavigate();
  const { toast }    = useToast();

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const data = await getNiveaux();
        setNiveaux(data);
      } catch (error) {
        console.error('Failed to fetch niveaux', error);
        toast({ title: 'Erreur', description: 'Impossible de charger les niveaux.', variant: 'destructive' });
      }
    };
    fetchNiveaux();
  }, [toast]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subjectId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter(id => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  };

  // Matières disponibles selon le niveau sélectionné
  const currentSubjects = formData.educationLevelName
    ? (subjectsByLevel[formData.educationLevelName] ?? [])
    : [];

  const passwordValid = passwordRules.every(r => r.test(formData.password));

  const handleSubmit = async () => {
    if (!passwordValid) {
      toast({ title: 'Mot de passe invalide', description: 'Veuillez respecter toutes les règles du mot de passe.', variant: 'destructive' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email:                      formData.email,
        mot_de_passe:               formData.password,
        mot_de_passe_confirmation:  formData.confirmPassword, // ✅ AJOUTÉ
        prenom:                     formData.firstName,
        nom:                        formData.lastName,
        id_niveau:                  formData.educationLevel,
      });
      toast({ title: 'Compte créé !', description: 'Bienvenue sur TutorAI. Commençons à apprendre !' });
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error?.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : 'Échec de la création du compte. Veuillez réessayer.';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.email && passwordValid && formData.password === formData.confirmPassword;
      case 2:
        return formData.firstName && formData.lastName;
      case 3:
        return formData.educationLevel && formData.acceptTerms;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      // ── Étape 1 : Email + Mot de passe ──────────────────────────────────
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Créer votre compte</h2>
              <p className="mt-1 text-sm text-muted-foreground">Entrez votre email et créez un mot de passe</p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="vous@exemple.com" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={(e) => updateFormData('password', e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Indicateur de règles */}
                {formData.password && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
                    {passwordRules.map((rule, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs ${rule.test(formData.password) ? 'text-green-500' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${rule.test(formData.password) ? 'opacity-100' : 'opacity-30'}`} />
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => updateFormData('confirmPassword', e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-destructive">Les mots de passe ne correspondent pas</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                  <p className="text-sm text-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> Les mots de passe correspondent</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      // ── Étape 2 : Prénom + Nom ───────────────────────────────────────────
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Parlez-nous de vous</h2>
              <p className="mt-1 text-sm text-muted-foreground">Cela nous aide à personnaliser votre expérience</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="firstName" type="text" placeholder="Marie" value={formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="lastName" type="text" placeholder="Dupont" value={formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)} className="pl-10" required />
                </div>
              </div>
            </div>
          </motion.div>
        );

      // ── Étape 3 : Niveau + Matières ──────────────────────────────────────
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Vos préférences d'apprentissage</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sélectionnez votre niveau et vos matières</p>
            </div>

            {/* Niveau d'éducation */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Niveau d'éducation
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {niveaux.map((level) => (
                  <button
                    key={level.id_niveau}
                    type="button"
                    onClick={() => {
                      updateFormData('educationLevel', level.id_niveau);
                      updateFormData('educationLevelName', level.nom_niveau);
                      updateFormData('selectedSubjects', []); // reset matières
                    }}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                      formData.educationLevel === level.id_niveau
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xl">{levelIcons[level.nom_niveau] || '📚'}</span>
                    <span className="text-sm font-medium">{level.nom_niveau}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Matières — affichées seulement si un niveau est sélectionné */}
            {formData.educationLevel && currentSubjects.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Matières qui vous intéressent
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {currentSubjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => toggleSubject(subject.id)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                        formData.selectedSubjects.includes(subject.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl">{subject.icon}</span>
                      <span className="text-sm font-medium">{subject.name}</span>
                      {formData.selectedSubjects.includes(subject.id) && (
                        <Check className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CGU */}
            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={(checked) => updateFormData('acceptTerms', checked)} />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                J'accepte les{' '}
                <a href="#" className="text-primary hover:underline">Conditions d'utilisation</a>
                {' '}et la{' '}
                <a href="#" className="text-primary hover:underline">Politique de confidentialité</a>
              </Label>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute left-4 top-4 sm:left-8 sm:top-8">
          <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {step > 1 ? 'Retour' : 'Accueil'}
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="flex flex-col items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </Link>
            </div>

            {/* Indicateur de progression */}
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-12 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Précédent
                </Button>
              )}
              <Button
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                disabled={!canProceed() || isLoading}
                className="flex-1 gradient-primary text-white"
              >
                {step < 3 ? (
                  <><span>Continuer</span><ArrowRight className="ml-2 h-4 w-4" /></>
                ) : isLoading ? (
                  'Création du compte...'
                ) : (
                  'Créer un compte'
                )}
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}