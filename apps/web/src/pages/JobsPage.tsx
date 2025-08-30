import React from 'react';
import { Job, Customer } from '@shared/types';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// Mock customer data for relationships
const mockCustomers: Customer[] = [
  {
    id: '1',
    created_at: '2025-08-28T10:00:00.000Z',
    name: 'บริษัท อาบีซี จำกัด',
    email: 'contact@abc.co.th',
    phone: '02-123-4567',
  },
  {
    id: '2',
    created_at: '2025-08-27T14:30:00.000Z',
    name: 'ห้างหุ้นส่วนจำกัด เอ็กซ์วายแซด',
    email: 'info@xyz.com',
    phone: '02-987-6543',
  },
  {
    id: '3',
    created_at: '2025-08-26T09:15:00.000Z',
    name: 'บริษัท เดฟ อิมปอร์ต-เอ็กซ์ปอร์ต จำกัด',
    email: 'sales@dev-import.co.th',
    phone: '02-555-1234',
  },
  {
    id: '4',
    created_at: '2025-08-25T16:45:00.000Z',
    name: 'โลจิสติกส์ พลัส จำกัด',
    email: 'hello@logisticplus.th',
    phone: '02-777-8888',
  },
];

// Mock job data with customer relationships
const mockJobs: Job[] = [
  {
    id: 'job-1',
    created_at: '2025-08-30T08:00:00.000Z',
    customer_id: '1',
    description: 'ขนส่งสินค้าจากกรุงเทพฯ ไปยังเชียงใหม่',
    status: 'New',
    customers: mockCustomers.find(c => c.id === '1'),
  },
  {
    id: 'job-2',
    created_at: '2025-08-29T14:30:00.000Z',
    customer_id: '2',
    description: 'นำเข้าสินค้าจากต่างประเทศ - ผ่านพิธีการศุลกากร',
    status: 'In Progress',
    customers: mockCustomers.find(c => c.id === '2'),
  },
  {
    id: 'job-3',
    created_at: '2025-08-29T10:15:00.000Z',
    customer_id: '1',
    description: 'จัดส่งสินค้าทางเรือ กรุงเทพฯ-ภูเก็ต',
    status: 'Done',
    customers: mockCustomers.find(c => c.id === '1'),
  },
  {
    id: 'job-4',
    created_at: '2025-08-28T16:45:00.000Z',
    customer_id: '3',
    description: 'ขนส่งสินค้าอุตสาหกรรม - รายการพิเศษ',
    status: 'In Progress',
    customers: mockCustomers.find(c => c.id === '3'),
  },
  {
    id: 'job-5',
    created_at: '2025-08-28T09:30:00.000Z',
    customer_id: '4',
    description: 'บริการจัดเก็บและกระจายสินค้า',
    status: 'New',
    customers: mockCustomers.find(c => c.id === '4'),
  },
  {
    id: 'job-6',
    created_at: '2025-08-27T13:20:00.000Z',
    customer_id: '2',
    description: 'ขนส่งด่วนพิเศษ - Same Day Delivery',
    status: 'Done',
    customers: mockCustomers.find(c => c.id === '2'),
  },
  {
    id: 'job-7',
    created_at: '2025-08-26T11:00:00.000Z',
    customer_id: '3',
    description: 'บริการขนส่งระหว่างประเทศ ไทย-มาเลเซีย',
    status: 'In Progress',
    customers: mockCustomers.find(c => c.id === '3'),
  },
  {
    id: 'job-8',
    created_at: '2025-08-25T15:15:00.000Z',
    customer_id: '4',
    description: 'จัดส่งสินค้าเกษตร - ต้องคงความเย็น',
    status: 'Done',
    customers: mockCustomers.find(c => c.id === '4'),
  },
];

export const JobsPage: React.FC = () => {
  const handleAddJob = () => {
    // Placeholder for future implementation
    console.log('Add job clicked');
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
        <Button onClick={handleAddJob} className="bg-green-600 hover:bg-green-700">
          สร้างงานใหม่
        </Button>
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
            {mockJobs.map((job) => (
              <TableRow key={job.id}>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-500">
        แสดงงานทั้งหมด {mockJobs.length} รายการ
      </div>
    </div>
  );
};