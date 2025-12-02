import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from "recharts";
import { LeaderboardData } from "@/types/members";

interface PerformanceScatterProps {
  data: LeaderboardData;
  figureNumber?: string;
}

export function PerformanceScatter({ data, figureNumber = "1.2" }: PerformanceScatterProps) {
  const processedData = React.useMemo(() => {
    return Object.values(data.members)
      .filter(m => m.stars > 0)
      .map(member => {
        const completedDays = Object.values(member.completion_day_level).filter(
          day => day['1']?.get_star_ts && day['2']?.get_star_ts
        );
        
        const avgSolveTime = completedDays.length > 0
          ? completedDays.reduce((sum, day) => sum + (day['2'].get_star_ts - day['1'].get_star_ts), 0) / completedDays.length / 60
          : 0;

        return {
          name: member.name,
          stars: member.stars,
          score: member.local_score,
          avgSolveTime: Math.round(avgSolveTime),
          completionRate: (member.stars / 50) * 100,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [data]);

  const maxScore = Math.max(...processedData.map(d => d.score));

  return (
    <div className="space-y-6">
      <div className="h-[450px] border-l-2 border-b-2 border-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="1 1" className="stroke-border" />
            <XAxis
              type="number"
              dataKey="stars"
              name="Stars"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Total Stars",
                position: "bottom",
                offset: 0,
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Score"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Local Score",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <ZAxis type="number" dataKey="avgSolveTime" range={[60, 400]} name="Avg Solve Time" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
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
                if (name === 'Avg Solve Time') return [`${value} min`, name];
                return [value, name];
              }}
              labelFormatter={(_, payload) => payload[0]?.payload?.name || ''}
            />
            <Scatter data={processedData} shape="circle">
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.score === maxScore ? 'var(--color-foreground)' : 'var(--color-muted-foreground)'}
                  fillOpacity={entry.score === maxScore ? 1 : 0.5}
                  stroke={entry.score === maxScore ? 'var(--color-foreground)' : 'none'}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Figure caption */}
      <p className="text-sm text-muted-foreground max-w-2xl">
        <span className="font-bold text-foreground">Figure {figureNumber}.</span> Scatter plot showing the relationship between total stars earned 
        and local score. Bubble size represents average solve time (time between first and second star). 
        The leader is highlighted in solid.
      </p>
    </div>
  );
}
