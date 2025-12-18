// components/reports/compliance-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

interface ComplianceData {
  excellent: number;  // 80-100%
  good: number;       // 60-79%
  fair: number;       // 40-59%
  poor: number;       // 0-39%
}

interface ComplianceChartProps {
  data: ComplianceData;
}

const COLORS = {
  excellent: '#10b981',  // green-500
  good: '#3b82f6',       // blue-500
  fair: '#f59e0b',       // amber-500
  poor: '#ef4444',       // red-500
};

export function ComplianceChart({ data }: ComplianceChartProps) {
  const chartData = [
    { 
      name: 'ดีมาก', 
      range: '80-100%',
      value: data.excellent,
      color: COLORS.excellent
    },
    { 
      name: 'ดี', 
      range: '60-79%',
      value: data.good,
      color: COLORS.good
    },
    { 
      name: 'พอใช้', 
      range: '40-59%',
      value: data.fair,
      color: COLORS.fair
    },
    { 
      name: 'ต้องปรับปรุง', 
      range: '0-39%',
      value: data.poor,
      color: COLORS.poor
    },
  ];

  const total = data.excellent + data.good + data.fair + data.poor;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Distribution</CardTitle>
          <CardDescription>การกระจายของ Patient Compliance</CardDescription>
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
        <CardTitle>Compliance Distribution</CardTitle>
        <CardDescription>
          การกระจายของ Patient Compliance (n={total})
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-gray-600">ช่วง: {data.range}</p>
                      <p className="font-medium mt-1">{data.value} รายการ ({percentage}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="value" 
                position="right"
                formatter={(value: number) => {
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                  return `${value} (${percentage}%)`;
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}