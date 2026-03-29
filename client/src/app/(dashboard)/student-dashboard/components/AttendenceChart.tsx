'use client';

import { useEffect, useState, useMemo } from 'react';
import { getToken } from '../../../../../lib/auth';
import { TrendingUp, Activity } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../../../../components/ui/chart';

interface AttendanceRecord {
  id: string;
  status: 'PRESENT' | 'ABSENT';
  session: {
    sessionStartTime: string;
  };
}

const chartConfig = {
  present: {
    label: "Attended",
    color: "#22c55e", // green-500
  },
  absent: {
    label: "Missed",
    color: "#ef4444", // red-500
  },
} satisfies ChartConfig;

export default function AttendenceChart() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const url = `${process.env.NEXT_PUBLIC_ATTENDANCE_API || 'http://localhost:3005'}/api/attendance/my`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const json = await res.json();
          setRecords(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load attendance chart', err);
      }
    };

    fetchAttendance();
  }, []);

  const chartData = useMemo(() => {
    // Generate the last 7 days including today
    const daysMap: Record<string, { present: number; absent: number; date: Date }> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysMap[dayName] = { present: 0, absent: 0, date: d };
    }

    records.forEach(record => {
      if (!record.session?.sessionStartTime) return;
      const sessionDate = new Date(record.session.sessionStartTime);
      const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Only count if it falls in the last 7 days window
      if (daysMap[dayName]) {
        if (record.status === 'PRESENT') daysMap[dayName].present += 1;
        if (record.status === 'ABSENT') daysMap[dayName].absent += 1;
      }
    });

    return Object.keys(daysMap).map(day => ({
      day,
      present: daysMap[day].present,
      absent: daysMap[day].absent,
    }));
  }, [records]);

  const totalClasses = records.length;
  const attendedClasses = records.filter(r => r.status === 'PRESENT').length;
  const attendanceRate = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  return (
    <Card className="h-full border-gray-200 shadow-none">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
        <CardDescription>Classes attended in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pb-6">
        <div className="flex gap-2 leading-none font-medium">
          Overall Attendance Rate: {attendanceRate}% <Activity className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="leading-none text-muted-foreground">
           Based on {totalClasses} recent sessions recorded
        </div>
      </CardFooter>
    </Card>
  );
}



