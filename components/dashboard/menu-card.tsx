// components/dashboard/menu-card.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MenuCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
}

const colorClasses = {
  blue: {
    border: 'hover:border-blue-500',
    bg: 'bg-blue-100',
    hoverBg: 'group-hover:bg-blue-200',
    text: 'text-blue-600'
  },
  green: {
    border: 'hover:border-green-500',
    bg: 'bg-green-100',
    hoverBg: 'group-hover:bg-green-200',
    text: 'text-green-600'
  },
  purple: {
    border: 'hover:border-purple-500',
    bg: 'bg-purple-100',
    hoverBg: 'group-hover:bg-purple-200',
    text: 'text-purple-600'
  }
};

export function MenuCard({ 
  href, 
  icon: Icon, 
  title, 
  subtitle, 
  description,
  color 
}: MenuCardProps) {
  const colors = colorClasses[color];

  return (
    <Link href={href} className="group">
      <Card className={`h-full border-2 ${colors.border} hover:shadow-xl transition-all duration-200 cursor-pointer`}>
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className={`${colors.bg} p-6 rounded-full ${colors.hoverBg} transition-colors`}>
              <Icon className={`w-12 h-12 ${colors.text}`} />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl mb-2">{title}</CardTitle>
            <CardDescription className="text-base">
              {subtitle}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p 
            className="text-sm text-gray-600" 
            dangerouslySetInnerHTML={{ __html: description }} 
          />
        </CardContent>
      </Card>
    </Link>
  );
}