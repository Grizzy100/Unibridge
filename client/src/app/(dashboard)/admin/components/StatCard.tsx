import { Card, CardContent } from '../../../../../components/ui/card';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { cn } from '../../../../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? HiTrendingUp : HiTrendingDown;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center gap-1.5">
              {trend !== 'neutral' && (
                <TrendIcon
                  className={`w-4 h-4 ${
                    trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === 'up'
                    ? 'text-emerald-600'
                    : trend === 'down'
                    ? 'text-rose-600'
                    : 'text-gray-600'
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={`${iconBg} p-3 rounded-xl`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
