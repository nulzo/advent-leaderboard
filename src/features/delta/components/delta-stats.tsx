import { LeaderboardData, Member } from "@/types/members";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function DeltaFocusedStats({ data }: { data: LeaderboardData }) {
  const members = Object.values(data.members);
  const totalMembers = members.length;

  const chartData = Object.values(data.members).map((member: Member) => {
    const deltaStats = Object.keys(member.completion_day_level).map((day) => {
      const dayData = member.completion_day_level[day];
      const star1Time = dayData["1"]?.get_star_ts;
      const star2Time = dayData["2"]?.get_star_ts;
      const timeDelta =
        star2Time && star1Time ? (star2Time - star1Time) / 60 : 0; // Convert to minutes

      return {
        day: `Day ${day}`,
        timeDelta,
      };
    });

    return {
      name: member.name,
      data: deltaStats,
    };
  });

  const getPrimaryHSLValues = () => {
    // Get computed styles from :root to resolve the --primary variable
    const root = document.documentElement;
    const primaryValue = getComputedStyle(root)
      .getPropertyValue("--primary")
      .trim();
    return primaryValue; // Returns something like "222.2 47.4% 11.2%"
  };

  const getPrimaryColorWithOpacity = (index: number) => {
    const opacity = Math.max(0.1, 1 - (index / (totalMembers - 1)) * 0.9);
    const opacityFormatted = Math.round(opacity * 100) / 100;
    const hslValues = getPrimaryHSLValues();
    return `hsl(${hslValues} / ${opacityFormatted})`;
  };

  const chartConfig = chartData.reduce((acc, member, index) => {
    const hslValues = getPrimaryHSLValues();
    const opacity = Math.max(0.1, 1 - (index / (totalMembers - 1)) * 0.9);
    acc[member.name] = {
      label: member.name,
      color: `hsl(${hslValues} / ${opacity})`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delta Focused Stats</CardTitle>
        <CardDescription>
          Time difference between first and second star for each day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              type="category"
              allowDuplicatedCategory={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              label={{
                value: "Time (minutes)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <defs>
              {chartData.map((member, index) => (
                <linearGradient
                  key={member.name}
                  id={`gradient-${member.name}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[member.name].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[member.name].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            {chartData.map((member) => (
              <Area
                key={member.name}
                data={member.data}
                type="monotone"
                dataKey="timeDelta"
                name={member.name}
                stroke={chartConfig[member.name].color}
                fill={chartConfig[member.name].color}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
