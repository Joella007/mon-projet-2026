import { motion } from 'framer-motion';
import {
  TrendingUp,
  Flame,
  Clock,
  Target,
  Trophy,
  Star,
  BookOpen,
  Brain,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

// Mock data
const weeklyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 2.8 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 1.5 },
];

const subjectProgress = [
  { subject: 'Mathematics', progress: 78, color: 'bg-blue-500' },
  { subject: 'Physics', progress: 62, color: 'bg-purple-500' },
  { subject: 'Chemistry', progress: 45, color: 'bg-green-500' },
  { subject: 'Biology', progress: 85, color: 'bg-pink-500' },
  { subject: 'Computer Science', progress: 55, color: 'bg-cyan-500' },
];

const recentQuizzes = [
  { title: 'Calculus Test 3', score: 92, total: 100, date: 'Today' },
  { title: 'Physics Quiz', score: 85, total: 100, date: 'Yesterday' },
  { title: 'Chemistry Lab', score: 78, total: 100, date: '2 days ago' },
];

const achievements = [
  { icon: '🔥', title: '7-Day Streak', unlocked: true },
  { icon: '📚', title: 'Bookworm', unlocked: true },
  { icon: '🎯', title: 'Quiz Master', unlocked: true },
  { icon: '⭐', title: 'Perfect Score', unlocked: false },
  { icon: '🏆', title: 'Champion', unlocked: false },
  { icon: '🌟', title: 'All-Star', unlocked: false },
];

export default function ProgressPage() {
  const { userStats } = useAuth();

  const maxHours = Math.max(...weeklyData.map(d => d.hours));
  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);

  const stats = [
    {
      label: 'Study Streak',
      value: userStats?.studyStreak || 0,
      unit: 'days',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      label: 'This Week',
      value: totalHours.toFixed(1),
      unit: 'hours',
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: 'Quizzes',
      value: userStats?.quizzesCompleted || 0,
      unit: 'completed',
      icon: Target,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      label: 'Level',
      value: userStats?.currentLevel || 1,
      unit: 'rank',
      icon: Trophy,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="mt-1 text-muted-foreground">
          Track your learning journey and see how far you've come.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className={`inline-flex rounded-xl p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.unit}</div>
            </div>
            <div className="mt-1 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Level {userStats?.currentLevel || 1}</h2>
            <p className="text-sm text-muted-foreground">Keep learning to level up!</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-white">
            {userStats?.currentLevel || 1}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>{userStats?.xp || 0} XP</span>
            <span>{userStats?.xpToNextLevel || 1000} XP</span>
          </div>
          <Progress
            value={((userStats?.xp || 0) / (userStats?.xpToNextLevel || 1000)) * 100}
            className="mt-2 h-3"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {(userStats?.xpToNextLevel || 1000) - (userStats?.xp || 0)} XP until next level
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Weekly Study Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Study Time</h2>
            <span className="text-sm text-muted-foreground">{totalHours.toFixed(1)} hrs total</span>
          </div>
          <div className="mt-6 flex items-end justify-between gap-2" style={{ height: '200px' }}>
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full rounded-t-lg gradient-primary min-h-[20px]"
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold">Subject Proficiency</h2>
          <div className="mt-6 space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-muted-foreground">{subject.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${subject.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Quizzes */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold">Recent Quizzes</h2>
          <div className="mt-4 space-y-3">
            {recentQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{quiz.title}</p>
                    <p className="text-xs text-muted-foreground">{quiz.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{quiz.score}%</p>
                  <p className="text-xs text-muted-foreground">{quiz.score}/{quiz.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-primary/10'
                    : 'bg-muted/50 opacity-50 grayscale'
                }`}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <p className="mt-2 text-xs font-medium">{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
