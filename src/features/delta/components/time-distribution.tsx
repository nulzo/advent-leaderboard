// src/features/analytics/components/time-distribution.tsx
import * as React from "react";
import {
  BoxPlot,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  ResponsiveContainer,
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
    <Card>
      <CardHeader>
        <CardTitle>Solve Time Distribution</CardTitle>
        <CardDescription>
          Time patterns across days and members
        </CardDescription>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {Array.from({ length: 25 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Day {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Hour of Day" 
                domain={[0, 24]}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Time Between Stars"
                label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${Math.round(Number(value))} minutes`, 
                  name === "x" ? "Hour" : "Delta"
                ]}
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