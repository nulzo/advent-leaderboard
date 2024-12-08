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
  CartesianGrid,
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

    <div className="pt-12">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--foreground))"
            opacity={0.1}
          />
          <XAxis
            type="number"
            dataKey="day"
            domain={[1, 25]}
            label={{
              value: "Day Number",
              position: "bottom",
              offset: 20,
              style: {
                fontSize: 14,
                fontWeight: 600,
                fill: 'hsl(var(--foreground))',
                fontFamily: 'ui-monospace, monospace'
              }
            }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
          />
          <YAxis
            type="number"
            dataKey="hour"
            domain={[0, 23]}
            label={{
              value: "Hour of Day",
              angle: -90,
              position: "insideLeft",
              style: {
                fontSize: 14,
                fontWeight: 600,
                fill: 'hsl(var(--foreground))',
                fontFamily: 'ui-monospace, monospace'
              }
            }}
            tickFormatter={(value) => `${value}:00`}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
          />
          <ZAxis
            type="number"
            dataKey="value"
            range={[50, 400]}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '2px solid hsl(var(--foreground))',
              borderRadius: 5,
              fontSize: 12,
              fontFamily: 'ui-monospace, monospace'
            }}
            formatter={(value, name) => {
              if (name === "hour") return `${value}:00`;
              if (name === "value") return `${Math.round(Number(value))} minutes`;
              return value;
            }}
          />
          <Scatter
            data={processedData}
            fill="hsl(var(--foreground))"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}