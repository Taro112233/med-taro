// components/reports/asthma-control-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AsthmaControlData {
  wellControlled: number;
  partlyControlled: number;
  uncontrolled: number;
  notApplicable: number;
}

interface AsthmaControlChartProps {
  data: AsthmaControlData;
}

const COLORS = {
  wellControlled: '#10b981',    // green-500
  partlyControlled: '#f59e0b',  // amber-500
  uncontrolled: '#ef4444',      // red-500
};

export function AsthmaControlChart({ data }: AsthmaControlChartProps) {
  const chartData = [
    { 
      name: 'Well Controlled', 
      value: data.wellControlled || 0,
      color: COLORS.wellControlled,
      description: '0 ข้อ'
    },
    { 
      name: 'Partly Controlled', 
      value: data.partlyControlled || 0,
      color: COLORS.partlyControlled,
      description: '1-2 ข้อ'
    },
    { 
      name: 'Uncontrolled', 
      value: data.uncontrolled || 0,
      color: COLORS.uncontrolled,
      description: '3-4 ข้อ'
    },
  ];

  const total = data.wellControlled + data.partlyControlled + data.uncontrolled;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asthma Control Level</CardTitle>
          <CardDescription>ระดับการควบคุมอาการหอบหืด</CardDescription>
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
        <CardTitle>Asthma Control Level</CardTitle>
        <CardDescription>
          ระดับการควบคุมอาการหอบหืด (n={total})
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold text-lg">{data.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                      <p className="font-medium mt-2 text-blue-600">
                        {data.value} รายการ ({percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}