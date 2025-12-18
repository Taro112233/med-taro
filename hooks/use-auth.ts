// hooks/use-auth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthData {
  username: string;
  authenticated: boolean;
  timestamp: number;
}

export function useAuth() {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth='));
    
    if (authCookie) {
      try {
        const authValue = decodeURIComponent(authCookie.split('=')[1]);
        const authData: AuthData = JSON.parse(authValue);
        setUsername(authData.username || 'User');
      } catch (error) {
        console.error('Failed to parse auth cookie:', error);
        setUsername('User');
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('ออกจากระบบสำเร็จ', {
          description: 'กำลังนำคุณกลับสู่หน้าหลัก...'
        });
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        toast.error('เกิดข้อผิดพลาด', {
          description: 'ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง'
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถเชื่อมต่อกับระบบได้'
      });
    }
  };

  return { username, handleLogout };
}