// components/reports/copd-stage-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface COPDStageData {
  stageA: number;
  stageB: number;
  stageE: number;
  notApplicable: number;
}

interface COPDStageChartProps {
  data: COPDStageData;
}

const COLORS = {
  stageA: '#10b981',   // green-500
  stageB: '#f59e0b',   // amber-500
  stageE: '#ef4444',   // red-500
};

export function COPDStageChart({ data }: COPDStageChartProps) {
  const chartData = [
    { 
      name: 'Stage A', 
      value: data.stageA || 0,
      color: COLORS.stageA,
      description: 'mMRC 0-1, CAT <10, 0-1 exacerbation'
    },
    { 
      name: 'Stage B', 
      value: data.stageB || 0,
      color: COLORS.stageB,
      description: 'mMRC ≥2, CAT ≥10, 0-1 exacerbation'
    },
    { 
      name: 'Stage E', 
      value: data.stageE || 0,
      color: COLORS.stageE,
      description: '≥2 moderate exacerbation or ≥1 leading to hospitalization'
    },
  ];

  const total = data.stageA + data.stageB + data.stageE;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>COPD Stage Distribution</CardTitle>
          <CardDescription>การแบ่งระดับความรุนแรง COPD</CardDescription>
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
        <CardTitle>COPD Stage Distribution</CardTitle>
        <CardDescription>
          การแบ่งระดับความรุนแรง COPD (n={total})
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