// src/features/analytics/components/time-distribution.tsx
import * as React from "react";
import {
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardData } from "@/types/members";

export function TimeDistribution({ data }: { data: LeaderboardData }) {
  const [selectedDay, setSelectedDay] = React.useState<string>("all");

  const processedData = React.useMemo(() => {
    return Object.values(data.members).flatMap(member => 
      Object.entries(member.completion_day_level)
        .filter(([day, _]) => selectedDay === "all" || day === selectedDay)
        .map(([day, stars]) => {
          const star1Time = stars["1"]?.get_star_ts;
          const star2Time = stars["2"]?.get_star_ts;
          const timeDelta = star2Time && star1Time ? (star2Time - star1Time) / 60 : 0;
          return {
            member: member.name,
            day: parseInt(day),
            timeDelta,
            x: star1Time ? new Date(star1Time * 1000).getHours() : 0,
            y: timeDelta
          };
        })
    );
  }, [data, selectedDay]);

  return (
    <Card className="border-2 border-foreground rounded-none">
      <CardHeader className="space-y-4 border-foreground pb-6">
        <div className="flex flex-col space-y-2">
          <CardTitle className="font-bold text-2xl tracking-tight">Distribution Analysis</CardTitle>
          <CardDescription className="font-medium text-sm">
            Correlation between first and second star completion times
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="h-[500px]">
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
                dataKey="timeToFirst"
                name="Time to First Star"
                label={{
                  value: "Time to First Star (min)",
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
                dataKey="timeToSecond"
                name="Time to Second Star"
                label={{
                  value: "Time to Second Star (min)",
                  angle: -90,
                  position: "insideLeft",
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
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '2px solid hsl(var(--foreground))',
                  borderRadius: 5,
                  fontSize: 12,
                  fontFamily: 'ui-monospace, monospace'
                }}
              />
              <Scatter 
                data={processedData} 
                fill="hsl(var(--foreground))"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}