"use client";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, YAxis, LineChart, Line, ReferenceLine, TooltipProps } from "recharts";
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


export interface DistanceDataPoint {
  time: string;
  distance: number;
}

interface DistanceChartProps {
  data: DistanceDataPoint[];
  alertThreshold: number;
}

const chartConfig = {
  distance: {
    label: "V2V Distance (m)",
    color: "hsl(var(--chart-1))", // Cyan
  },
} satisfies ChartConfig;

export default function DistanceChart({ data, alertThreshold }: DistanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Waiting for data...
      </div>
    );
  }
  
  const CustomTooltipContent = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Time
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Distance
              </span>
              <span className="font-bold" style={{ color: chartConfig.distance.color }}>
                {payload[0].value}m
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 10, // Adjusted right margin for better label visibility
          left: -10, // Adjusted left margin
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(-3)} // Show last 3 chars of time, e.g., T23 -> 23
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 'dataMax + 5']} // Auto scale Y-axis with some padding
          className="text-xs"
        />
        <ChartTooltip
            cursor={false}
            content={<CustomTooltipContent />}
        />
        <Line
          dataKey="distance"
          type="monotone"
          stroke={chartConfig.distance.color}
          strokeWidth={2.5}
          dot={false}
          name="V2V Distance"
        />
        <ReferenceLine 
          y={alertThreshold} 
          label={{ value: "Alert Zone", position: "insideTopRight", fill: "hsl(var(--destructive))", fontSize: 10, dy: -5, dx: -5 }}
          stroke="hsl(var(--destructive))" 
          strokeDasharray="4 4" 
          strokeWidth={1.5}
        />
      </LineChart>
    </ChartContainer>
  );
}
