import React, { useState, useEffect } from 'react';
import { Job } from '@shared/types';
import { useData } from '../../contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface JobDetailDialogProps {
  jobId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobUpdated?: () => void;
}

export const JobDetailDialog: React.FC<JobDetailDialogProps> = ({
  jobId,
  open,
  onOpenChange,
  onJobUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Job['status']>('New');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { getJobWithCustomer, updateJobStatus } = useData();
  
  const job = jobId ? getJobWithCustomer(jobId) : null;

  // Reset state when dialog opens/closes or job changes
  useEffect(() => {
    if (open && job) {
      setSelectedStatus(job.status);
      setShowConfirmation(false);
    }
  }, [open, job]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleStatusChange = (newStatus: Job['status']) => {
    setSelectedStatus(newStatus);
    if (newStatus !== job?.status) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!job || selectedStatus === job.status) return;

    try {
      setIsUpdating(true);
      await updateJobStatus(job.id, selectedStatus);
      
      // Notify parent component
      onJobUpdated?.();
      setShowConfirmation(false);
      
      // Show success feedback
      console.log('Job status updated successfully');
    } catch (error) {
      console.error('Error updating job status:', error);
      // Reset to original status on error
      setSelectedStatus(job.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (job) {
      setSelectedStatus(job.status);
    }
    setShowConfirmation(false);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>รายละเอียดงาน</DialogTitle>
          <DialogDescription>
            ดูข้อมูลและจัดการสถานะของงาน
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Information */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">รหัสงาน</Label>
              <p className="text-sm text-gray-900 mt-1">{job.id}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">รายละเอียดงาน</Label>
              <p className="text-sm text-gray-900 mt-1 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">ลูกค้า</Label>
              <p className="text-sm text-gray-900 mt-1">{job.customers.name}</p>
              <p className="text-xs text-gray-500">
                {job.customers.email} • {job.customers.phone}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">วันที่สร้าง</Label>
              <p className="text-sm text-gray-900 mt-1">
                {formatDate(job.created_at)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">สถานะปัจจุบัน</Label>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}
                >
                  {getStatusLabel(job.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                เปลี่ยนสถานะ
              </Label>
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">ใหม่</SelectItem>
                  <SelectItem value="In Progress">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="Done">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>

              {/* Confirmation Message */}
              {showConfirmation && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm text-amber-800">
                    คุณต้องการเปลี่ยนสถานะจาก "{getStatusLabel(job.status)}" 
                    เป็น "{getStatusLabel(selectedStatus)}" หรือไม่?
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            ปิด
          </Button>
          
          {showConfirmation && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                ยกเลิก
              </Button>
              <Button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'กำลังอัปเดต...' : 'ยืนยัน'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};