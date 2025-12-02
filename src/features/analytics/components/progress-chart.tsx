import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LeaderboardData } from "@/types/members";

interface ProgressChartProps {
  data: LeaderboardData;
  figureNumber?: string;
}

export function ProgressChart({ data, figureNumber = "1.1" }: ProgressChartProps) {
  const { chartData, members } = React.useMemo(() => {
    const allEvents: { time: number; member: string }[] = [];

    Object.values(data.members).forEach((member) => {
      Object.values(member.completion_day_level).forEach((day) => {
        if (day["1"]) allEvents.push({ time: day["1"].get_star_ts, member: member.name });
        if (day["2"]) allEvents.push({ time: day["2"].get_star_ts, member: member.name });
      });
    });

    allEvents.sort((a, b) => a.time - b.time);

    const memberPoints: Record<string, number> = {};
    const memberList = Object.values(data.members)
      .filter(m => m.stars > 0)
      .sort((a, b) => b.local_score - a.local_score)
      .slice(0, 8)
      .map(m => m.name);

    memberList.forEach(name => { memberPoints[name] = 0; });

    const processed = allEvents
      .filter(e => memberList.includes(e.member))
      .map((event) => {
        memberPoints[event.member] = (memberPoints[event.member] || 0) + 1;
        return {
          timestamp: event.time,
          date: new Date(event.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          ...{ ...memberPoints },
        };
      });

    return {
      chartData: [
        { timestamp: allEvents[0]?.time - 1, ...Object.fromEntries(memberList.map(m => [m, 0])) },
        ...processed,
      ],
      members: memberList,
    };
  }, [data]);

  const colors = [
    'var(--color-foreground)',
    'var(--color-muted-foreground)',
    'hsl(220, 70%, 50%)',
    'hsl(160, 60%, 45%)',
    'hsl(30, 80%, 55%)',
    'hsl(280, 65%, 60%)',
    'hsl(340, 75%, 55%)',
    'hsl(200, 70%, 50%)',
  ];

  return (
    <div className="space-y-6">
      <div className="h-[500px] border-l-2 border-b-2 border-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="1 1" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              tickFormatter={(value) => new Date(value * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              className="fill-muted-foreground"
              label={{
                value: "Stars",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fontWeight: 600 },
                className: "fill-foreground"
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-foreground)',
                borderWidth: 2,
                borderRadius: 0,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-foreground)',
              }}
              labelStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--color-foreground)' }}
              labelFormatter={(value) => new Date(value * 1000).toLocaleString()}
            />
            {members.map((memberName, index) => (
              <Line
                key={memberName}
                type="stepAfter"
                dataKey={memberName}
                stroke={colors[index]}
                strokeWidth={index === 0 ? 3 : 1.5}
                dot={false}
                strokeOpacity={index === 0 ? 1 : 0.7}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {members.map((name, index) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ backgroundColor: colors[index], opacity: index === 0 ? 1 : 0.7 }} />
            <span className={index === 0 ? 'font-bold' : 'text-muted-foreground'}>{name}</span>
          </div>
        ))}
      </div>

      {/* Figure caption */}
      <p className="text-sm text-muted-foreground max-w-2xl">
        <span className="font-bold text-foreground">Figure {figureNumber}.</span> Step chart showing cumulative star count 
        over time for the top 8 participants. The leader is emphasized with a heavier stroke weight.
      </p>
    </div>
  );
}
