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

export function StarVelocityChart({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const processedData = React.useMemo(() => {
    const timeWindows = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      date: new Date(2024, 0, 1, i).toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      }),
    }));

    Object.values(data.members)
      .filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .forEach((member) => {
        Object.values(member.completion_day_level).forEach((day) => {
          Object.values(day).forEach((star) => {
            const hour = new Date(star.get_star_ts * 1000).getHours();
            const windowIndex = timeWindows.findIndex((w) => w.hour === hour);
            if (windowIndex !== -1) {
              timeWindows[windowIndex][member.name] =
                (timeWindows[windowIndex][member.name] || 0) + 1;
            }
          });
        });
      });

    return timeWindows;
  }, [data, searchTerm]);

  const filteredMembers = React.useMemo(
    () =>
      Object.values(data.members).filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Velocity</CardTitle>
        <CardDescription>
          Star completion patterns throughout the day
        </CardDescription>
        <Input
          placeholder="Search members..."
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
              <XAxis dataKey="date" />
              <YAxis label={{ value: "Stars Earned", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              {filteredMembers.map((member, index) => (
                <Area
                  key={member.name}
                  type="monotone"
                  dataKey={member.name}
                  stackId="1"
                  stroke={`hsl(${(360 / filteredMembers.length) * index}, 70%, 50%)`}
                  fill={`hsl(${(360 / filteredMembers.length) * index}, 70%, 50%)`}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}