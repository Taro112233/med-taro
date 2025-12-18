// components/reports/technique-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TechniqueData {
  correct: number;
  incorrect: number;
  notAssessed: number;
}

interface TechniqueChartProps {
  data: TechniqueData;
}

const COLORS = {
  correct: '#10b981',      // green-500
  incorrect: '#ef4444',    // red-500
  notAssessed: '#9ca3af',  // gray-400
};

export function TechniqueChart({ data }: TechniqueChartProps) {
  const chartData = [
    { 
      name: 'ถูกต้อง', 
      value: data.correct,
      color: COLORS.correct
    },
    { 
      name: 'ไม่ถูกต้อง', 
      value: data.incorrect,
      color: COLORS.incorrect
    },
    { 
      name: 'ไม่ได้ประเมิน', 
      value: data.notAssessed,
      color: COLORS.notAssessed
    },
  ].filter(item => item.value > 0);

  const total = data.correct + data.incorrect + data.notAssessed;
  const assessed = data.correct + data.incorrect;
  const correctRate = assessed > 0 ? ((data.correct / assessed) * 100).toFixed(1) : 0;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inhaler Technique</CardTitle>
          <CardDescription>ความถูกต้องของเทคนิคการพ่นยา</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">ไม่มีข้อมูล</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inhaler Technique</CardTitle>
        <CardDescription>
          ความถูกต้องของเทคนิคการพ่นยา (อัตราถูกต้อง: {correctRate}%)
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => 
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => {
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return [`${value} รายการ (${percentage}%)`, name];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}