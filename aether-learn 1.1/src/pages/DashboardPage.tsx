import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

// Mock data for demo
const recentCourses = [
  { id: 1, title: 'Introduction to Calculus', subject: 'Mathematics', progress: 75, thumbnail: '🔢' },
  { id: 2, title: 'Quantum Mechanics Basics', subject: 'Physics', progress: 45, thumbnail: '⚛️' },
  { id: 3, title: 'Organic Chemistry', subject: 'Chemistry', progress: 30, thumbnail: '🧪' },
];

const recentChats = [
  { id: 1, title: 'Derivatives and Integrals', subject: 'Mathematics', time: '2 hours ago' },
  { id: 2, title: 'Newton\'s Laws of Motion', subject: 'Physics', time: '5 hours ago' },
  { id: 3, title: 'Chemical Bonds', subject: 'Chemistry', time: 'Yesterday' },
];

const recommendations = [
  { id: 1, title: 'Linear Algebra', reason: 'Based on your calculus progress', icon: '📐' },
  { id: 2, title: 'Thermodynamics', reason: 'Popular in your level', icon: '🌡️' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, userStats } = useAuth();

  const stats = [
    {
      label: 'Study Streak',
      value: userStats?.studyStreak || 0,
      unit: 'jours',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      label: 'Heures d\'étude',
      value: userStats?.totalStudyHours || 0,
      unit: 'h cette semaine',
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: 'Quiz terminés',
      value: userStats?.quizzesCompleted || 0,
      unit: 'terminés',
      icon: Target,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      label: 'Niveau',
      value: userStats?.currentLevel || 1,
      unit: `${userStats?.xp || 0}/${userStats?.xpToNextLevel || 1000} XP`,
      icon: TrendingUp,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl gradient-primary p-6 text-white lg:p-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              Bon retour, {user?.prenom} ! 👋
            </h1>
            <p className="mt-2 text-white/80">
              Prêt à continuer votre parcours d'apprentissage ? Vous êtes sur une série de {userStats?.studyStreak} jours !
            </p>
          </div>
          <Link to="/chat">
            <Button className="bg-white text-primary hover:bg-white/90 gap-2">
              <Sparkles className="h-4 w-4" />
              Commencer à apprendre
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-card p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.unit}</div>
            </div>
            <div className="mt-1 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Continue Learning */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Continuer l'apprentissage</h2>
            <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="glass-card-hover group p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                    {course.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.subject}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="mt-2 h-2" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Play className="h-4 w-4" />
                  Continuer
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent AI Chats */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Conversations récentes</h2>
            <Link to="/chat" className="text-sm text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                to="/chat"
                className="glass-card-hover flex items-center gap-3 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{chat.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{chat.subject}</span>
                    <span>•</span>
                    <span>{chat.time}</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/chat">
              <Button variant="outline" className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommandé pour vous</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((rec) => (
            <Link
              key={rec.id}
              to={`/courses`}
              className="glass-card-hover flex items-center gap-4 p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                {rec.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{rec.title}</h3>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
              </div>
            </Link>
          ))}
          <Link
            to="/courses"
            className="glass-card-hover flex items-center justify-center gap-2 p-4 text-primary"
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Explorer tous les cours</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
