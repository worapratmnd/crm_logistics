import React, { useState } from 'react';
import { Job } from '@shared/types';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { AddJobDialog } from '../components/dialogs/AddJobDialog';
import { JobDetailDialog } from '../components/dialogs/JobDetailDialog';

export const JobsPage: React.FC = () => {
  const { jobs, loading } = useData();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);

  const handleJobAdded = () => {
    // Data will be updated automatically through context
    console.log('Job added successfully');
  };

  const handleJobUpdated = () => {
    // Data will be updated automatically through context
    console.log('Job updated successfully');
  };

  const handleJobRowClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setJobDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Job['status']) => {
    switch (status) {
      case 'New':
        return 'ใหม่';
      case 'In Progress':
        return 'กำลังดำเนินการ';
      case 'Done':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">รายการงาน</h1>
          <p className="text-gray-600 mt-1">จัดการงานขนส่งและโลจิสติกส์</p>
        </div>
        <AddJobDialog onJobAdded={handleJobAdded}>
          <Button className="bg-green-600 hover:bg-green-700">
            สร้างงานใหม่
          </Button>
        </AddJobDialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รายละเอียดงาน</TableHead>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  ยังไม่มีข้อมูลงาน
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow 
                  key={job.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleJobRowClick(job.id)}
                >
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={job.description}>
                      {job.description}
                    </div>
                  </TableCell>
                  <TableCell>{job.customers?.name || 'ไม่พบข้อมูลลูกค้า'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusLabel(job.status)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(job.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-500">
        แสดงงานทั้งหมด {jobs.length} รายการ
      </div>

      {/* Job Detail Dialog */}
      <JobDetailDialog
        jobId={selectedJobId}
        open={jobDetailOpen}
        onOpenChange={setJobDetailOpen}
        onJobUpdated={handleJobUpdated}
      />
    </div>
  );
};