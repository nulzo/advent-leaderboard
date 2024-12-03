// src/features/analytics/components/time-heatmap.tsx
import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";

export function TimeHeatmap({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => {
    const timeData = Object.values(data.members).flatMap(member =>
      Object.entries(member.completion_day_level).map(([day, stars]) => {
        const star1Time = stars["1"]?.get_star_ts;
        const star2Time = stars["2"]?.get_star_ts;
        if (!star1Time || !star2Time) return null;

        const hourOfDay = new Date(star1Time * 1000).getHours();
        const timeDelta = (star2Time - star1Time) / 60;

        return {
          day: parseInt(day),
          hour: hourOfDay,
          value: timeDelta,
          name: member.name
        };
      }).filter(Boolean)
    );

    return timeData;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Completion Heatmap</CardTitle>
        <CardDescription>
          Visualizing completion patterns by hour and day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="day" 
                name="Day" 
                domain={[1, 25]}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis 
                type="number" 
                dataKey="hour" 
                name="Hour" 
                domain={[0, 23]}
                tickFormatter={(value) => `${value}:00`}
              />
              <ZAxis 
                type="number" 
                dataKey="value" 
                range={[50, 400]} 
                name="Time Delta"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => {
                  if (name === "Hour") return `${value}:00`;
                  if (name === "Time Delta") return `${Math.round(Number(value))} minutes`;
                  return value;
                }}
              />
              <Scatter 
                data={processedData} 
                fill="hsl(var(--primary))"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}