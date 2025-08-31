import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  loading = false,
  className = "",
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
          ) : (
            value.toLocaleString('th-TH')
          )}
        </div>
      </CardContent>
    </Card>
  );
};