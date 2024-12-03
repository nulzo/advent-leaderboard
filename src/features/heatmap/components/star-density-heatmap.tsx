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
    <Card>
      <CardHeader>
        <CardTitle>Star Completion Density</CardTitle>
        <CardDescription>
          Heat density of star completions across different time windows
        </CardDescription>
        <div className="flex gap-4">
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={timeWindow} onValueChange={(v) => setTimeWindow(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">By Hour</SelectItem>
              <SelectItem value="day">By Day of Week</SelectItem>
              <SelectItem value="week">By Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="x"
                domain={[1, 25]}
                label={{ value: "Day", position: "bottom" }}
              />
              <YAxis
                type="number"
                dataKey="timeSlot"
                domain={timeWindow === "hour" ? [0, 23] : 
                       timeWindow === "day" ? [0, 6] : [0, 3]}
                tickFormatter={getTimeSlotLabel}
              />
              <ZAxis type="number" dataKey="value" range={[50, 400]} />
              <Tooltip
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
      </CardContent>
    </Card>
  )
}