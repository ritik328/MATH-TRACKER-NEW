'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Journey, JourneyStatus } from '@/types/journey';
import { formatDate } from '@/lib/utils';

interface JourneyContextType {
  journey: Journey;
  startJourney: () => void;
  pauseJourney: () => void;
  resumeJourney: () => void;
  getDaysSinceStart: () => number;
  getCurrentDay: () => number;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

// Get Monday's date for the current week
function getMondayDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  return formatDate(monday);
}

const INITIAL_JOURNEY: Journey = {
  status: 'not-started',
  startDate: null,
};

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [journey, setJourney] = useState<Journey>(INITIAL_JOURNEY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedJourney = localStorage.getItem('math_journey');
    if (savedJourney) {
      try {
        const parsed = JSON.parse(savedJourney);
        setJourney(parsed);
      } catch (e) {
        console.error('Failed to parse journey data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('math_journey', JSON.stringify(journey));
    }
  }, [journey, mounted]);

  const startJourney = () => {
    const mondayDate = getMondayDate();
    setJourney({
      status: 'active',
      startDate: mondayDate,
    });
  };

  const pauseJourney = () => {
    if (journey.status === 'active') {
      setJourney({
        ...journey,
        status: 'paused',
        pausedAt: new Date().toISOString(),
      });
    }
  };

  const resumeJourney = () => {
    if (journey.status === 'paused') {
      setJourney({
        ...journey,
        status: 'active',
        resumedAt: new Date().toISOString(),
      });
    }
  };

  const getDaysSinceStart = (): number => {
    if (!journey.startDate) return 0;
    
    const start = new Date(journey.startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCurrentDay = (): number => {
    if (!journey.startDate) return 0;
    
    if (journey.status === 'paused' && journey.pausedAt) {
      // Calculate days from start to pause
      const start = new Date(journey.startDate);
      const paused = new Date(journey.pausedAt);
      const diffTime = paused.getTime() - start.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    
    return getDaysSinceStart() + 1;
  };

  return (
    <JourneyContext.Provider
      value={{
        journey,
        startJourney,
        pauseJourney,
        resumeJourney,
        getDaysSinceStart,
        getCurrentDay,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
