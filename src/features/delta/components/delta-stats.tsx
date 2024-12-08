import { LeaderboardData, Member } from "@/types/members";
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

    <div className="pt-12 h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground))" opacity={0.1} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
            stroke='hsl(var(--foreground))'
            tickFormatter={(value) => value.slice(0, 3)}
            fontSize={12}
            fontWeight={500}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
            stroke='hsl(var(--foreground))'
            fontSize={12}
            fontWeight={500}
            label={{
              value: "Time (minutes)",
              angle: -90,
              position: "insideLeft",
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
          {chartData.map((member) => (
            <Area
              key={member.name}
              data={member.data}
              type="monotone"
              dataKey="timeDelta"
              name={member.name}
              stroke={chartConfig[member.name].color}
              fill={chartConfig[member.name].color}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
