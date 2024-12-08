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
        acc[member.name] = Math.round(totalTime);
        return acc;
      }, {} as Record<string, number>);

      return {
        day,
        ...memberTimes
      };
    });
  }, [data, searchTerm]);

  const filteredMembers = React.useMemo(() => 
    Object.values(data.members)
      .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(m => m.name),
    [data, searchTerm]
  );

  return (
    <Card className="border-2 border-foreground rounded-sm">
      <CardHeader className="space-y-4 border-foreground pb-6">
        <div className="flex flex-col space-y-2">
          <CardTitle className="font-bold text-2xl tracking-tight">Cumulative Time Analysis</CardTitle>
          <CardDescription className="font-medium text-sm">
            Progressive accumulation of solving duration across challenges
          </CardDescription>
        </div>
        <Input
          placeholder="Filter members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-foreground focus-visible:border-foreground rounded-none focus-visible:ring-0 max-w-sm"
        />
      </CardHeader>
      <CardContent className="p-8">
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#000" 
                opacity={0.1}
              />
              <XAxis 
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace'
                }}
                label={{
                  value: "Day Number",
                  position: "bottom",
                  offset: 40,
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    fill: '#000',
                    fontFamily: 'ui-monospace, monospace'
                  }
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace'
                }}
                label={{
                  value: "Cumulative Minutes",
                  angle: -90,
                  position: "insideLeft",
                  offset: -40,
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    fill: '#000',
                    fontFamily: 'ui-monospace, monospace'
                  }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #000',
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: 'ui-monospace, monospace'
                }}
                formatter={(value) => [`${value} minutes`, ""]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="plainline"
                iconSize={18}
                wrapperStyle={{
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace'
                }}
              />
              {filteredMembers.map((member, index) => (
                <Line
                  key={member}
                  type="monotone"
                  dataKey={member}
                  stroke={`hsl(${(360 / filteredMembers.length) * index}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}