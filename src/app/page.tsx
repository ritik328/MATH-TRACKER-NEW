'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trophy, 
  Flame, 
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WeekModule, Topic } from '@/types';
import { INITIAL_DATA } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';
import Card from '@/components/Card';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ThemeToggle from '@/components/ThemeToggle';
import JourneyControls from '@/components/JourneyControls';
import { useJourney } from '@/contexts/JourneyContext';

export default function MathStudyTracker() {
  // --- State ---
  const [modules, setModules] = useState<WeekModule[]>(INITIAL_DATA);
  const [examDate, setExamDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const { journey } = useJourney();

  // --- Persistence ---
  
  useEffect(() => {
    setMounted(true);
    const savedModules = localStorage.getItem('math_modules');
    const savedExamDate = localStorage.getItem('math_exam_date');
    
    if (savedModules) setModules(JSON.parse(savedModules));
    if (savedExamDate) setExamDate(savedExamDate);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('math_modules', JSON.stringify(modules));
    }
  }, [modules, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('math_exam_date', examDate);
    }
  }, [examDate, mounted]);

  // --- Logic & Computations ---

  const totalTopics = useMemo(() => modules.reduce((acc, m) => acc + m.topics.length, 0), [modules]);
  const completedTopics = useMemo(() => modules.reduce((acc, m) => acc + m.topics.filter(t => t.completed).length, 0), [modules]);
  const progressPercentage = Math.round((completedTopics / totalTopics) * 100);

  const streak = useMemo(() => {
    // If journey not started, return 0
    if (journey.status === 'not-started') return 0;

    // Collect all completion dates
    const dates = new Set<string>();
    modules.forEach(m => m.topics.forEach(t => {
      if (t.completed && t.completedAt) {
        dates.add(t.completedAt.split('T')[0]);
      }
    }));

    let currentStreak = 0;
    const today = new Date();
    
    // Get paused date range if journey is paused
    const pausedStart = journey.pausedAt ? new Date(journey.pausedAt) : null;
    const pausedEnd = journey.resumedAt ? new Date(journey.resumedAt) : null;
    
    // Check backwards from today (allow for today not being done yet)
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d);
      
      // Skip days during pause period (streak doesn't break during pause)
      if (pausedStart && pausedEnd) {
        if (d >= pausedStart && d < pausedEnd) {
          continue; // Skip paused days, don't break streak
        }
      } else if (pausedStart && journey.status === 'paused') {
        // Currently paused - skip days from pause date onwards
        if (d >= pausedStart) {
          continue; // Skip paused days, don't break streak
        }
      }
      
      if (dates.has(dateStr)) {
        currentStreak++;
      } else if (i === 0) {
        // If today is not done, don't break streak yet, just continue to check yesterday
        continue;
      } else {
        // Only break streak if journey is active (not paused)
        if (journey.status === 'active') {
          break;
        }
      }
    }
    return currentStreak;
  }, [modules, journey]);

  const toggleTopic = (moduleId: number, topicId: string) => {
    // Only allow toggling if journey is active
    if (journey.status !== 'active') {
      return;
    }
    
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        topics: m.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined
          };
        })
      };
    }));
  };

  const assignDateToTopic = (moduleId: number, topicId: string, date: string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        topics: m.topics.map(t => {
          if (t.id !== topicId) return t;
          return { ...t, plannedDate: date };
        })
      };
    }));
  };

  const remainingDays = useMemo(() => {
    if (!examDate) return null;
    const end = new Date(examDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }, [examDate]);

  const topicsForSelectedDate = useMemo(() => {
    const list: { moduleTitle: string; topic: Topic; moduleId: number }[] = [];
    modules.forEach(m => {
      m.topics.forEach(t => {
        if (t.plannedDate === selectedDate) {
          list.push({ moduleTitle: m.title, topic: t, moduleId: m.id });
        }
      });
    });
    return list;
  }, [modules, selectedDate]);

  const getCalendarDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Math Mastery Plan</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">1.5 Month Intensive Study Track</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 text-sm font-medium">
              <span className="text-slate-400 dark:text-slate-500">Current Focus:</span>
              <span className="text-indigo-600 dark:text-indigo-400">Calculus & Integrals</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Journey Controls */}
        <JourneyControls />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Progress Card (Span 2 on Desktop) */}
          <Card className="lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={120} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
                  Total Progress
                </h2>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{progressPercentage}%</span>
              </div>
              <ProgressBar percentage={progressPercentage} />
              <div className="flex justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
                <span>{completedTopics} topics completed</span>
                <span>{totalTopics - completedTopics} remaining</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Next Milestone</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Finish Week {Math.min(6, Math.floor(completedTopics / 5) + 1)}</span>
              </div>
            </div>
          </Card>

          {/* 2. Exam Countdown */}
          <Card className="flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-transparent">
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <Clock size={18} />
                <span className="text-sm font-medium uppercase tracking-wider">Countdown</span>
              </div>
              <div className="mt-2">
                {remainingDays !== null ? (
                  <>
                    <div className="text-4xl font-bold">{Math.max(0, remainingDays)}</div>
                    <div className="text-indigo-100 text-sm">Days until exam</div>
                  </>
                ) : (
                  <div className="text-indigo-100 text-sm italic">Set a date below</div>
                )}
              </div>
            </div>
            <div className="mt-4">
               <label className="text-xs text-indigo-200 block mb-1">Target Date</label>
               <input 
                type="date" 
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="bg-white/20 border-none text-white text-sm rounded px-2 py-1 w-full focus:ring-2 focus:ring-white/50 outline-none placeholder-indigo-200"
              />
            </div>
          </Card>

          {/* 3. Study Streak */}
          <Card className="flex flex-col justify-center items-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-orange-50/50 dark:bg-orange-900/20 -z-10"></div>
             <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3 text-orange-600 dark:text-orange-400">
               <Flame size={24} fill="currentColor" />
             </div>
             <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{streak}</div>
             <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Day Streak</div>
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-4">Consistency is key to mastery.</p>
          </Card>

          {/* 4. Calendar View (Span 2 on medium, 1 on large) */}
          <Card className="md:col-span-2 lg:col-span-1 min-h-[300px] flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <CalendarIcon size={20} className="text-indigo-600 dark:text-indigo-400"/>
              Calendar
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 dark:text-slate-500 mb-2">
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 flex-1 content-start">
              {getCalendarDays().map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dateStr = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), day));
                const isToday = dateStr === formatDate(new Date());
                const isSelected = dateStr === selectedDate;
                
                // Check if any topic is planned for this date
                const hasPlan = modules.some(m => m.topics.some(t => t.plannedDate === dateStr));
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all
                      ${isSelected ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md scale-105 z-10' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}
                      ${isToday && !isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800' : ''}
                    `}
                  >
                    {day}
                    {hasPlan && !isSelected && (
                      <div className="absolute bottom-1 w-1 h-1 bg-indigo-400 dark:bg-indigo-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Daily tasks preview */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
               <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-2">
                 Planned for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
               </div>
               <div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                 {topicsForSelectedDate.length > 0 ? (
                   topicsForSelectedDate.map(({ topic, moduleTitle }, idx) => (
                     <div key={idx} className="text-xs flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                       <div className={`w-1.5 h-1.5 rounded-full ${topic.completed ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
                       <span className="truncate flex-1 text-slate-700 dark:text-slate-300">{topic.title}</span>
                       {topic.completed && <CheckCircle2 size={10} className="text-green-500" />}
                     </div>
                   ))
                 ) : (
                   <div className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-2">No topics planned</div>
                 )}
               </div>
            </div>
          </Card>

          {/* 5. Weekly Modules (Span Full) */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Study Modules</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">Week 1 - 6</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => {
                const moduleProgress = module.topics.filter(t => t.completed).length;
                const isComplete = moduleProgress === module.topics.length;
                
                return (
                  <Card key={module.id} className={`flex flex-col h-full border-t-4 ${isComplete ? 'border-t-green-500' : 'border-t-indigo-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{module.title}</h3>
                      {isComplete && <div className="text-green-500"><CheckCircle2 size={18} /></div>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 h-8">{module.description}</p>
                    
                    <div className="space-y-3 flex-1">
                      {module.topics.map((topic) => (
                        <div key={topic.id} className="group flex items-start gap-3 text-sm">
                          <button
                            onClick={() => toggleTopic(module.id, topic.id)}
                            className={`
                              mt-0.5 flex-shrink-0 transition-colors duration-200
                              ${topic.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-indigo-400'}
                            `}
                          >
                            {topic.completed ? <CheckCircle2 size={18} fill="currentColor" className="text-white" /> : <Circle size={18} />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <span 
                              className={`
                                block truncate transition-all cursor-pointer select-none
                                ${topic.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}
                              `}
                              onClick={() => toggleTopic(module.id, topic.id)}
                            >
                              {topic.title}
                            </span>
                            
                            <div className="flex items-center gap-2 mt-1">
                                {topic.plannedDate && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${topic.completed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                                    <CalendarIcon size={8} />
                                    {new Date(topic.plannedDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                  </span>
                                )}
                                {!topic.completed && (
                                   <button 
                                      onClick={() => assignDateToTopic(module.id, topic.id, selectedDate)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                                      title={`Move to ${new Date(selectedDate).toLocaleDateString()}`}
                                   >
                                     Assign to {new Date(selectedDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                   </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span>{moduleProgress}/{module.topics.length} Done</span>
                      <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all" style={{ width: `${(moduleProgress / module.topics.length) * 100}%` }}></div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        
        </div>

        {/* Analytics Dashboard */}
        <div className="mt-8">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BarChart3 size={20} />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance Analytics</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">View detailed insights and charts</p>
              </div>
            </div>
            {showAnalytics ? (
              <ChevronUp className="text-slate-400 dark:text-slate-500" size={20} />
            ) : (
              <ChevronDown className="text-slate-400 dark:text-slate-500" size={20} />
            )}
          </button>
          
          {showAnalytics && (
            <div className="mt-4">
              <AnalyticsDashboard modules={modules} />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">
          <p>Stay consistent. Good luck with your exam!</p>
        </div>

      </div>
    </div>
  );
}
