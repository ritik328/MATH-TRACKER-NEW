'use client';

import { Play, Pause } from 'lucide-react';
import { useJourney } from '@/contexts/JourneyContext';
import Card from './Card';

export default function JourneyControls() {
  const { journey, startJourney, pauseJourney, resumeJourney, getDaysSinceStart, getCurrentDay } = useJourney();

  const daysSinceStart = getDaysSinceStart();
  const currentDay = getCurrentDay();

  if (journey.status === 'not-started') {
    return (
      <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-transparent">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-white/20 rounded-full mb-4">
            <Play size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ready to Start Your Journey?</h3>
          <p className="text-sm text-indigo-100 mb-4">
            Begin your 1.5 month intensive math study plan
          </p>
          <button
            onClick={startJourney}
            className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Start Journey
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-indigo-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              journey.status === 'active' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            }`}>
              {journey.status === 'active' ? '● Active' : '⏸ Paused'}
            </div>
            {journey.startDate && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Started: {new Date(journey.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Day </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">{currentDay}</span>
              <span className="text-slate-500 dark:text-slate-400"> of 42</span>
            </div>
            {journey.status === 'paused' && journey.pausedAt && (
              <div className="text-slate-500 dark:text-slate-400">
                Paused: {new Date(journey.pausedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {journey.status === 'active' ? (
            <button
              onClick={pauseJourney}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <Pause size={16} />
              Pause
            </button>
          ) : (
            <button
              onClick={resumeJourney}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Play size={16} />
              Resume
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
