import * as React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardData } from "@/types/members";

export function StarsTreemap({ data }: { data: LeaderboardData }) {
  const processedData = React.useMemo(() => ({
    name: "Stars",
    children: Object.values(data.members)
      .filter(m => m.stars > 0)
      .map(member => ({
        name: member.name,
        size: member.stars,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      })),
  }), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stars Distribution</CardTitle>
        <CardDescription>
          Visualizing the proportion of stars earned by each member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={[processedData]}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
              content={({ root, depth, x, y, width, height, name, color }) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                      fill: color,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  {width > 50 && height > 30 && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={12}
                    >
                      {name}
                    </text>
                  )}
                </g>
              )}
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}