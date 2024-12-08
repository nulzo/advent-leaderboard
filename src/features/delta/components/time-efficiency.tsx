// src/features/analytics/components/time-efficiency.tsx
import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { LeaderboardData } from "@/types/members";

export function TimeEfficiency({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const members = Object.values(data.members)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return Array.from({ length: 25 }, (_, i) => {
      const day = i + 1;
      const dayStats = members.reduce((acc, member) => {
        const stars = member.completion_day_level[day];
        if (stars?.["1"]) {
          acc.attempts++;
          if (stars["2"]) {
            acc.successes++;
            acc.totalTime += (stars["2"].get_star_ts - stars["1"].get_star_ts) / 60;
          }
        }
        return acc;
      }, { attempts: 0, successes: 0, totalTime: 0 });

      return {
        day,
        successRate: dayStats.attempts ? (dayStats.successes / dayStats.attempts) * 100 : 0,
        avgTime: dayStats.successes ? dayStats.totalTime / dayStats.successes : 0
      };
    });
  }, [data, searchTerm]);

  return (
    <>
      <Input
        placeholder="Filter members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-foreground focus-visible:border-foreground border rounded focus-visible:ring-0 max-w-sm"
      />
      <div className="mt-12 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground))" opacity={0.1} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
              stroke='hsl(var(--foreground))'
              fontSize={12}
              fontWeight={500}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
              label={{
                value: "Success Rate (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fontWeight: 600, fill: 'hsl(var(--foreground))' }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
              label={{
                value: "Avg Time (min)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 14, fontWeight: 600, fill: 'hsl(var(--foreground))' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '2px solid hsl(var(--foreground))',
                borderRadius: 5,
                fontSize: 12
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="plainline"
              iconSize={18}
              wrapperStyle={{
                fontSize: 12,
                fontWeight: 500
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="successRate"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              name="Success Rate"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTime"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              name="Average Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}