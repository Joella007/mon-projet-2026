import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Mock courses data
const mockCourses = [
  {
    id: 1,
    title: 'Calculus Fundamentals',
    description: 'Master derivatives, integrals, and limits with step-by-step explanations.',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    difficulty: 'Intermediate',
    duration: '12 hours',
    lessons: 24,
    rating: 4.8,
    enrolledCount: 1250,
    progress: 75,
    isEnrolled: true,
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Quantum Mechanics Introduction',
    description: 'Explore the fascinating world of quantum physics and wave functions.',
    subject: 'Physics',
    subjectIcon: '⚛️',
    difficulty: 'Advanced',
    duration: '18 hours',
    lessons: 32,
    rating: 4.9,
    enrolledCount: 890,
    progress: 45,
    isEnrolled: true,
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: 'Organic Chemistry Basics',
    description: 'Learn about carbon compounds, reactions, and molecular structures.',
    subject: 'Chemistry',
    subjectIcon: '🧪',
    difficulty: 'Beginner',
    duration: '10 hours',
    lessons: 20,
    rating: 4.7,
    enrolledCount: 2100,
    progress: 0,
    isEnrolled: false,
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 4,
    title: 'Molecular Biology',
    description: 'Understand DNA, RNA, proteins, and cellular processes.',
    subject: 'Biology',
    subjectIcon: '🧬',
    difficulty: 'Intermediate',
    duration: '15 hours',
    lessons: 28,
    rating: 4.6,
    enrolledCount: 1500,
    progress: 0,
    isEnrolled: false,
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    id: 5,
    title: 'Python Programming',
    description: 'Learn Python from scratch with hands-on coding exercises.',
    subject: 'Computer Science',
    subjectIcon: '💻',
    difficulty: 'Beginner',
    duration: '20 hours',
    lessons: 40,
    rating: 4.9,
    enrolledCount: 5000,
    progress: 30,
    isEnrolled: true,
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 6,
    title: 'Linear Algebra',
    description: 'Master vectors, matrices, and linear transformations.',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    difficulty: 'Advanced',
    duration: '14 hours',
    lessons: 26,
    rating: 4.7,
    enrolledCount: 980,
    progress: 0,
    isEnrolled: false,
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Languages',
];

const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || course.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All Levels' || course.difficulty === selectedDifficulty;
    const matchesEnrolled = !showEnrolledOnly || course.isEnrolled;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesEnrolled;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Explore our catalog of AI-powered courses and start learning today.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Subject Filter */}
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          {/* Enrolled Only Toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="enrolled"
              checked={showEnrolledOnly}
              onCheckedChange={(checked) => setShowEnrolledOnly(checked as boolean)}
            />
            <label htmlFor="enrolled" className="text-sm">My courses</label>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn('h-8 w-8', viewMode === 'grid' && 'bg-muted')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn('h-8 w-8', viewMode === 'list' && 'bg-muted')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
      </p>

      {/* Courses Grid/List */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
      )}>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {viewMode === 'grid' ? (
              <Link to={`/courses/${course.id}`} className="block">
                <div className="glass-card-hover group overflow-hidden">
                  {/* Thumbnail */}
                  <div
                    className="relative h-40"
                    style={{ background: course.thumbnail }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button className="gap-2 bg-white/90 text-primary hover:bg-white">
                        <Play className="h-4 w-4" />
                        {course.isEnrolled ? 'Continue' : 'Preview'}
                      </Button>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {course.subjectIcon} {course.subject}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                      <Badge variant={
                        course.difficulty === 'Beginner' ? 'default' :
                        course.difficulty === 'Intermediate' ? 'secondary' : 'outline'
                      }>
                        {course.difficulty}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>

                    {/* Progress */}
                    {course.isEnrolled && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="mt-2 h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <Link to={`/courses/${course.id}`} className="block">
                <div className="glass-card-hover flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div
                    className="h-24 w-32 shrink-0 rounded-xl"
                    style={{ background: course.thumbnail }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                      <Badge variant={
                        course.difficulty === 'Beginner' ? 'default' :
                        course.difficulty === 'Intermediate' ? 'secondary' : 'outline'
                      }>
                        {course.difficulty}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>{course.subjectIcon}</span>
                        {course.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.enrolledCount.toLocaleString()}
                      </div>
                    </div>

                    {/* Progress */}
                    {course.isEnrolled && (
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center">
                    <Button className="gap-2">
                      <Play className="h-4 w-4" />
                      {course.isEnrolled ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
