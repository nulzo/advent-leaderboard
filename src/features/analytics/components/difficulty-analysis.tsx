import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LeaderboardData } from "@/types/members";

interface DifficultyAnalysisProps {
  data: LeaderboardData;
  figureNumber?: string;
}

export function DifficultyAnalysis({ data, figureNumber = "1.3" }: DifficultyAnalysisProps) {
  const processedData = React.useMemo(() => {
    const totalMembers = Object.keys(data.members).length;
    
    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const completions = Object.values(data.members).filter(
        m => m.completion_day_level[day]?.["2"]
      );
      
      const solveTimes = completions
        .map(m => {
          const dayData = m.completion_day_level[day];
          return dayData["2"] && dayData["1"] 
            ? (dayData["2"].get_star_ts - dayData["1"].get_star_ts) / 60 
            : null;
        })
        .filter((t): t is number => t !== null)
        .sort((a, b) => a - b);

      const medianTime = solveTimes.length > 0 
        ? solveTimes[Math.floor(solveTimes.length / 2)] 
        : 0;

      const completionRate = (completions.length / totalMembers) * 100;

      return {
        day: `${day}`,
        completionRate,
        medianSolveTime: Math.round(medianTime),
        participantCount: completions.length,
        difficultyScore: completionRate > 0 ? (medianTime / completionRate) * 10 : 0,
      };
    }).filter(d => d.participantCount > 0);
  }, [data]);

  const maxDifficulty = Math.max(...processedData.map(d => d.difficultyScore));

  return (
    <div className="space-y-6">
      <div className="h-[400px] border-l-2 border-b-2 border-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="1 1" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Day",
                position: "bottom",
                offset: 0,
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Median Solve Time (min)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-muted)', opacity: 0.3 }}
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-foreground)',
                borderWidth: 2,
                borderRadius: 0,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-foreground)',
              }}
              labelStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--color-foreground)' }}
              formatter={(value: number, name: string) => {
                if (name === 'medianSolveTime') return [`${value} min`, 'Median Time'];
                return [value, name];
              }}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Bar dataKey="medianSolveTime" radius={[0, 0, 0, 0]}>
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.difficultyScore === maxDifficulty ? 'var(--color-foreground)' : 'var(--color-muted-foreground)'}
                  fillOpacity={0.3 + (entry.difficultyScore / maxDifficulty) * 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Figure caption */}
      <p className="text-sm text-muted-foreground max-w-2xl">
        <span className="font-bold text-foreground">Figure {figureNumber}.</span> Median solve time per day (time between first and second star). 
        Bar opacity indicates relative difficulty—darker bars represent more challenging puzzles 
        based on a composite score of completion rate and solve time.
      </p>
    </div>
  );
}
