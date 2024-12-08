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
  CartesianGrid,
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

export function StarDensityHeatmap({ data }: { data: LeaderboardData }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [timeWindow, setTimeWindow] = React.useState<"hour" | "day" | "week">("day");

  const processedData = React.useMemo(() => {
    const densityMap = [];
    const filteredMembers = Object.values(data.members).filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredMembers.forEach(member => {
      Object.entries(member.completion_day_level).forEach(([day, stars]) => {
        Object.values(stars).forEach(star => {
          const date = new Date(star.get_star_ts * 1000);
          const timeSlot = timeWindow === "hour" ? date.getHours() :
                          timeWindow === "day" ? date.getDay() :
                          Math.floor(parseInt(day) / 7);
          
          const existingPoint = densityMap.find(p => 
            p.x === parseInt(day) && p.timeSlot === timeSlot
          );

          if (existingPoint) {
            existingPoint.value++;
          } else {
            densityMap.push({
              x: parseInt(day),
              timeSlot,
              value: 1
            });
          }
        });
      });
    });

    return densityMap;
  }, [data, searchTerm, timeWindow]);

  const getTimeSlotLabel = (value: number) => {
    if (timeWindow === "hour") return `${value}:00`;
    if (timeWindow === "day") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return days[value];
    }
    return `Week ${value + 1}`;
  };

  const maxDensity = Math.max(...processedData.map(d => d.value));

  return (
    <div className="pt-12">
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-foreground focus-visible:border-foreground rounded-none focus-visible:ring-0 max-w-sm"
        />
        <Select value={timeWindow} onValueChange={(v) => setTimeWindow(v as any)}>
          <SelectTrigger className="border-2 border-foreground rounded-none w-[180px]">
            <SelectValue placeholder="Time window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">By Hour</SelectItem>
            <SelectItem value="day">By Day of Week</SelectItem>
            <SelectItem value="week">By Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--foreground))"
              opacity={0.1}
            />
            <XAxis
              type="number"
              dataKey="x"
              domain={[1, 25]}
              label={{
                value: "Day Number",
                position: "bottom",
                offset: 20,
                style: {
                  fontSize: 14,
                  fontWeight: 600,
                  fill: 'hsl(var(--foreground))',
                  fontFamily: 'ui-monospace, monospace'
                }
              }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
            />
            <YAxis
              type="number"
              dataKey="timeSlot"
              domain={timeWindow === "hour" ? [0, 23] : 
                     timeWindow === "day" ? [0, 6] : [0, 3]}
              tickFormatter={getTimeSlotLabel}
              label={{
                value: "Time Period",
                angle: -90,
                position: "insideLeft",
                style: {
                  fontSize: 14,
                  fontWeight: 600,
                  fill: 'hsl(var(--foreground))',
                  fontFamily: 'ui-monospace, monospace'
                }
              }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2 }}
            />
            <ZAxis type="number" dataKey="value" range={[50, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '2px solid hsl(var(--foreground))',
                borderRadius: 5,
                fontSize: 12,
                fontFamily: 'ui-monospace, monospace'
              }}
              formatter={(value, name, props) => {
                if (name === "timeSlot") return getTimeSlotLabel(Number(value));
                if (name === "value") return `${value} completions`;
                return value;
              }}
            />
            <Scatter data={processedData}>
              {processedData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={`hsl(${(entry.value / maxDensity) * 120}, 70%, 50%)`}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}