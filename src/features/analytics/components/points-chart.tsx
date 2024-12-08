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

export function PointsChart({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    // Get all star completion timestamps
    const allEvents: { time: number; member: string; points: number }[] = [];

    Object.values(data.members).forEach((member) => {
      Object.values(member.completion_day_level).forEach((day) => {
        if (day["1"]) {
          allEvents.push({
            time: day["1"].get_star_ts,
            member: member.name,
            points: 1,
          });
        }
        if (day["2"]) {
          allEvents.push({
            time: day["2"].get_star_ts,
            member: member.name,
            points: 1,
          });
        }
      });
    });

    // Sort events chronologically
    allEvents.sort((a, b) => a.time - b.time);

    // Initialize member points
    const memberPoints: Record<string, number> = {};
    Object.values(data.members).forEach((member) => {
      memberPoints[member.name] = 0;
    });

    // Create data points including state at each star completion
    const chartData = allEvents.map((event) => {
      memberPoints[event.member] += event.points;
      return {
        timestamp: event.time,
        ...memberPoints,
      };
    });

    // Add starting point with everyone at 0
    return [
      {
        timestamp: allEvents[0]?.time - 1,
        ...Object.fromEntries(
          Object.values(data.members).map((m) => [m.name, 0])
        ),
      },
      ...chartData,
    ];
  }, [data]);

  const filteredMembers = React.useMemo(() => {
    return Object.values(data.members)
      .filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((member) => member.name);
  }, [data, searchTerm]);

  return (
    <Card className="border-2 border-foreground my-12 rounded-none">
      <CardHeader className="space-y-4 border-foreground pb-6 border-b-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-bold text-2xl tracking-tight">Progress Overview</CardTitle>
          <Input
            placeholder="Filter members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-foreground focus-visible:border-foreground rounded-none focus-visible:ring-0 max-w-[200px]"
          />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#000"
                opacity={0.1}
              />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                tickFormatter={(value) => {
                  return new Date(value * 1000).toLocaleDateString();
                }}
                stroke="#000"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                stroke="#000"
                fontSize={12}
                fontWeight={500}
                label={{
                  value: "Stars",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    fill: '#000'
                  }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #000',
                  borderRadius: 0,
                  fontSize: 12
                }}
                labelStyle={{ fontWeight: 600 }}
                labelFormatter={(value) => 
                  new Date(value * 1000).toLocaleString()
                }
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
              {filteredMembers.map((memberName, index) => (
                <Line
                  key={memberName}
                  type="monotone"
                  dataKey={memberName}
                  stroke={`hsl(${(360 / filteredMembers.length) * index}, 70%, 45%)`}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ 
                    stroke: '#000',
                    strokeWidth: 2,
                    fill: '#fff',
                    r: 4
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
