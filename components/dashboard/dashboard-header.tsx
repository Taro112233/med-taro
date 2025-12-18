// components/dashboard/dashboard-header.tsx
import { Button } from '@/components/ui/button';
import { Activity, LogOut, User } from 'lucide-react';

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

export function DashboardHeader({ username, onLogout }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                ระบบคลินิก Asthma & COPD
              </h1>
              <p className="text-sm text-gray-500">
                Clinical Documentation System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">{username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}