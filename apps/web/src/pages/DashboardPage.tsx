import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Clock, 
  CheckCircle 
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { useDashboardData } from '../hooks/useDashboardData';

export const DashboardPage: React.FC = () => {
  const { stats, loading, isDataAvailable } = useDashboardData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          แดชบอร์ด
        </h1>
        <p className="text-gray-600">
          ภาพรวมของระบบ CRM สำหรับธุรกิจขนส่งและโลจิสติกส์
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="จำนวนลูกค้าทั้งหมด"
          value={stats.totalCustomers}
          icon={Users}
          loading={loading}
          className="lg:col-span-1"
        />
        <StatCard
          title="จำนวนงานทั้งหมด"
          value={stats.totalJobs}
          icon={Briefcase}
          loading={loading}
          className="lg:col-span-1"
        />
        <StatCard
          title="งานใหม่"
          value={stats.newJobs}
          icon={FileText}
          loading={loading}
          className="lg:col-span-1"
        />
        <StatCard
          title="งานที่กำลังดำเนินการ"
          value={stats.inProgressJobs}
          icon={Clock}
          loading={loading}
          className="lg:col-span-1"
        />
        <StatCard
          title="งานเสร็จสิ้น"
          value={stats.completedJobs}
          icon={CheckCircle}
          loading={loading}
          className="lg:col-span-1"
        />
      </div>

      {/* Additional Information */}
      {!loading && isDataAvailable && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900">
                ข้อมูลสถิติล่าสุด
              </h3>
              <p className="text-blue-700 mt-1">
                ข้อมูลทั้งหมดถูกอัพเดทแบบเรียลไทม์ เมื่อมีการเพิ่ม แก้ไข หรือลบข้อมูลในระบบ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !isDataAvailable && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ยังไม่มีข้อมูล
          </h3>
          <p className="text-gray-500">
            เริ่มต้นโดยการเพิ่มลูกค้าและงานในระบบเพื่อดูสстатистิก
          </p>
        </div>
      )}
    </div>
  );
};