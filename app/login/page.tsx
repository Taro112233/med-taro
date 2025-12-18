// app/login/page.tsx
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-white px-4">
      <AuthCard 
        title="เข้าสู่ระบบ"
        description="ระบบคลินิก Asthma & COPD Clinical Documentation System"
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}