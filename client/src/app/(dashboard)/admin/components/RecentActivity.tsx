//client/src/app/(dashboard)/admin/components/RecentActivity.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../components/ui/avatar';

const recentActivities = [
  {
    user: 'Prof. Sarah Miller',
    action: 'added new student',
    details: 'John Doe to Computer Science',
    time: '5 minutes ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    user: 'Warden Mark Johnson',
    action: 'approved outpass',
    details: 'for Emma Wilson - Weekend Leave',
    time: '12 minutes ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    user: 'Dr. Robert Chen',
    action: 'updated attendance',
    details: 'for Class 12-A Mathematics',
    time: '1 hour ago',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    user: 'Admin Lisa Park',
    action: 'processed fee payment',
    details: 'Student ID: ST-2024-456',
    time: '2 hours ago',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    user: 'Prof. James Wilson',
    action: 'scheduled exam',
    details: 'Physics Final - June 25th',
    time: '3 hours ago',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export function RecentActivity() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your institution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="w-9 h-9 mt-0.5">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}{' '}
                  <span className="text-gray-900 font-medium">
                    {activity.details}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
