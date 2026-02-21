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

const levelIcons: { [key: string]: string } = {
  'Collège': '📚',
  'Lycée': '🎓',
  'Université': '🏛️',
  'Professionnel': '💼',
};

const subjects = [
  { id: 1, name: 'Mathematics', icon: '🔢' },
  { id: 2, name: 'Physics', icon: '⚛️' },
  { id: 3, name: 'Chemistry', icon: '🧪' },
  { id: 4, name: 'Biology', icon: '🧬' },
  { id: 5, name: 'Computer Science', icon: '💻' },
  { id: 6, name: 'Languages', icon: '🌍' },
  { id: 7, name: 'History', icon: '📜' },
  { id: 8, name: 'Economics', icon: '📈' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    educationLevel: null as number | null,
    selectedSubjects: [] as number[],
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const data = await getNiveaux();
        setNiveaux(data);
      } catch (error) {
        console.error("Failed to fetch niveaux", error);
        toast({
          title: 'Error',
          description: 'Could not load education levels.',
          variant: 'destructive',
        });
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

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await register({
        email: formData.email,
        mot_de_passe: formData.password,
        prenom: formData.firstName,
        nom: formData.lastName,
        id_niveau: formData.educationLevel,
      });
      toast({
        title: 'Account created!',
        description: 'Bienvenue sur TutorAI. Commençons à apprendre !',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la création du compte. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.password === formData.confirmPassword;
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
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Create your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and create a password
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-destructive">Passwords don't match</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Tell us about yourself</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This helps us personalize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Your learning preferences</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your education level and subjects of interest
              </p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education Level
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {niveaux.map((level) => (
                  <button
                    key={level.id_niveau}
                    type="button"
                    onClick={() => updateFormData('educationLevel', level.id_niveau)}
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

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subjects of Interest
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map((subject) => (
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
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-4 top-4 sm:left-8 sm:top-8"
        >
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step > 1 ? 'Back' : 'Home'}
          </Button>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </Link>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-all ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Form Steps */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                disabled={!canProceed() || isLoading}
                className="flex-1 gradient-primary text-white"
              >
                {step < 3 ? (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : isLoading ? (
                  'Création du compte...'
                ) : (
                  'Créer un compte'
                )}
              </Button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
