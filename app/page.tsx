// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <Activity className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900">
              ระบบคลินิก Asthma & COPD
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ระบบบันทึกและติดตามผลการรักษาผู้ป่วยโรคหืดและปอดอุดกั้นเรื้อรัง
              <br />
              Clinical Documentation System for Respiratory Disease Management
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                เข้าสู่ระบบ
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}