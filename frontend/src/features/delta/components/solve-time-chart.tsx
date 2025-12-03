import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LeaderboardData } from "@/types/members";

interface SolveTimeChartProps {
  data: LeaderboardData;
  figureNumber?: string;
}

export function SolveTimeChart({ data, figureNumber = "3.1" }: SolveTimeChartProps) {
  const { chartData, members, colors } = React.useMemo(() => {
    const sortedMembers = Object.values(data.members)
      .filter(m => m.stars > 0)
      .sort((a, b) => b.local_score - a.local_score)
      .slice(0, 6);

    const memberNames = sortedMembers.map(m => m.name);
    
    const allDays = new Set<number>();
    sortedMembers.forEach(member => {
      Object.keys(member.completion_day_level).forEach(day => {
        allDays.add(parseInt(day));
      });
    });

    const processed = Array.from(allDays).sort((a, b) => a - b).map(day => {
      const dayData: Record<string, number | string> = { day: `Day ${day}` };
      
      sortedMembers.forEach(member => {
        const completion = member.completion_day_level[day];
        if (completion?.["1"] && completion?.["2"]) {
          const delta = (completion["2"].get_star_ts - completion["1"].get_star_ts) / 60;
          dayData[member.name] = Math.round(delta);
        } else {
          dayData[member.name] = 0;
        }
      });
      
      return dayData;
    });

    const colorPalette = [
      'var(--color-foreground)',
      'hsl(220, 70%, 50%)',
      'hsl(160, 60%, 45%)',
      'hsl(30, 80%, 55%)',
      'hsl(280, 65%, 60%)',
      'hsl(340, 75%, 55%)',
    ];

    return {
      chartData: processed,
      members: memberNames,
      colors: colorPalette,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="h-[450px] border-l-2 border-b-2 border-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="1 1" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Minutes",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <Tooltip
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
              formatter={(value: number) => [`${value} min`, '']}
            />
            {members.map((name, index) => (
              <Area
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={index === 0 ? 0.3 : 0.1}
                strokeWidth={index === 0 ? 2 : 1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {members.map((name, index) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: colors[index], opacity: index === 0 ? 0.8 : 0.5 }} />
            <span className={index === 0 ? 'font-bold' : 'text-muted-foreground'}>{name}</span>
          </div>
        ))}
      </div>

      {/* Figure caption */}
      <p className="text-sm text-muted-foreground max-w-2xl">
        <span className="font-bold text-foreground">Figure {figureNumber}.</span> Area chart showing solve time 
        deltas for top 6 participants. Higher values indicate more time spent on part two of each puzzle.
      </p>
    </div>
  );
}
