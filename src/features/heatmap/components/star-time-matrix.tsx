import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

export function StarTimeMatrix({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const timeMatrix = [];
    const filteredMembers = Object.values(data.members).filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    for (let hour = 0; hour < 24; hour++) {
      for (let day = 1; day <= 25; day++) {
        let count = 0;
        filteredMembers.forEach(member => {
          const dayData = member.completion_day_level[day];
          if (dayData) {
            Object.values(dayData).forEach(star => {
              const starHour = new Date(star.get_star_ts * 1000).getHours();
              if (starHour === hour) {
                count++;
              }
            });
          }
        });
        if (count > 0) {
          timeMatrix.push({ hour, day, count });
        }
      }
    }
    return timeMatrix;
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Time Matrix</CardTitle>
        <CardDescription>
          Distribution of star completions across hours and days
        </CardDescription>
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="day"
                domain={[1, 25]}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                type="number"
                dataKey="hour"
                domain={[0, 23]}
                tickFormatter={(value) => `${value}:00`}
              />
              <ZAxis type="number" dataKey="count" range={[50, 400]} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "hour") return `${value}:00`;
                  if (name === "count") return `${value} stars`;
                  return value;
                }}
              />
              <Scatter data={processedData}>
                {processedData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${(entry.count * 30) % 360}, 70%, 50%)`}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}