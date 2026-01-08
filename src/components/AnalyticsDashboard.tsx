'use client';

import { WeekModule } from '@/types';
import { getWeeklyCompletion, getStreakHistory, getRevisionFrequency } from '@/lib/analytics';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import Card from './Card';

interface AnalyticsDashboardProps {
  modules: WeekModule[];
}

export default function AnalyticsDashboard({ modules }: AnalyticsDashboardProps) {
  const { theme } = useTheme();
  const weeklyData = getWeeklyCompletion(modules);
  const streakData = getStreakHistory(modules);
  const revisionData = getRevisionFrequency(modules);

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#cbd5e1' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#475569' : '#e2e8f0';
  const tooltipText = isDark ? '#f1f5f9' : '#0f172a';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics Completed Per Week */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Topics Completed Per Week
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="week" 
                stroke={textColor}
                style={{ fontSize: '12px' }}
                tick={{ fill: textColor }}
              />
              <YAxis 
                stroke={textColor}
                style={{ fontSize: '12px' }}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText
                }}
                formatter={(value: number | undefined, name: string) => {
                  const val = value ?? 0;
                  if (name === 'completed') return [val, 'Completed'];
                  if (name === 'total') return [val, 'Total'];
                  return [val, name];
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Bar 
                dataKey="completed" 
                fill="#4f46e5" 
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="total" 
                fill={isDark ? '#475569' : '#cbd5e1'} 
                name="Total"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Streak History */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Study Streak History (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                stroke={textColor}
                style={{ fontSize: '12px' }}
                tick={{ fill: textColor }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                stroke={textColor}
                style={{ fontSize: '12px' }}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                }}
                formatter={(value: number | undefined) => [`${value ?? 0} days`, 'Streak']}
              />
              <Line 
                type="monotone" 
                dataKey="streak" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Streak"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revision Frequency */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Revision Frequency (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revisionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              stroke={textColor}
              style={{ fontSize: '12px' }}
              tick={{ fill: textColor }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke={textColor}
              style={{ fontSize: '12px' }}
              tick={{ fill: textColor }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipText
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              }}
              formatter={(value: number | undefined) => [`${value ?? 0} topics`, 'Completed']}
            />
            <Bar 
              dataKey="revisions" 
              fill="#10b981" 
              name="Topics Completed"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
