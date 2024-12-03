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
import { Input } from "@/components/ui/input";
import { LeaderboardData } from "@/types/members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StarVelocityHeatmap({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"speed" | "time">("speed");

  const processedData = React.useMemo(() => {
    return Object.values(data.members)
      .filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .flatMap(member =>
        Object.entries(member.completion_day_level).map(([day, stars]) => {
          const star1Time = stars["1"]?.get_star_ts;
          const star2Time = stars["2"]?.get_star_ts;
          if (!star1Time || !star2Time) return null;

          const timeDelta = (star2Time - star1Time) / 60; // minutes
          const completionHour = new Date(star2Time * 1000).getHours();

          return {
            member: member.name,
            day: parseInt(day),
            timeDelta,
            completionHour,
            value: sortBy === "speed" ? timeDelta : completionHour,
          };
        })
      )
      .filter(Boolean);
  }, [data, searchTerm, sortBy]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Velocity Heatmap</CardTitle>
        <CardDescription>
          Visualizing completion speed patterns across days
        </CardDescription>
        <div className="flex gap-4">
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "speed" | "time")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speed">Sort by Speed</SelectItem>
              <SelectItem value="time">Sort by Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="day"
                domain={[1, 25]}
                label={{ value: "Day", position: "bottom" }}
              />
              <YAxis
                type="number"
                dataKey="value"
                label={{
                  value: sortBy === "speed" ? "Minutes" : "Hour",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis type="number" range={[50, 400]} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "value") {
                    return sortBy === "speed"
                      ? `${Math.round(Number(value))} minutes`
                      : `${value}:00`;
                  }
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