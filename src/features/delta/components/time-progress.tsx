// src/features/analytics/components/time-progress.tsx
import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export function TimeProgress({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const members = Object.values(data.members)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const memberTimes = members.reduce((acc, member) => {
        let totalTime = 0;
        for (let d = 1; d <= day; d++) {
          const stars = member.completion_day_level[d];
          if (stars?.["1"] && stars?.["2"]) {
            totalTime += (stars["2"].get_star_ts - stars["1"].get_star_ts) / 60;
          }
        }
        acc[member.name] = totalTime;
        return acc;
      }, {} as Record<string, number>);

      return {
        day,
        ...memberTimes
      };
    });
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Time Progress</CardTitle>
        <CardDescription>
          Total time spent solving challenges over days
        </CardDescription>
        <Input
          placeholder="Filter members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: "Total Minutes", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              {Object.values(data.members)
                .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((member, index) => (
                  <Area
                    key={member.name}
                    type="monotone"
                    dataKey={member.name}
                    stackId="1"
                    stroke={`hsl(${(360 / Object.keys(data.members).length) * index}, 70%, 50%)`}
                    fill={`hsl(${(360 / Object.keys(data.members).length) * index}, 70%, 50%)`}
                    fillOpacity={0.2}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}