import React from 'react';
import { Customer } from '@shared/types';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// Mock customer data
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

export const CustomersPage: React.FC = () => {
  const handleAddCustomer = () => {
    // Placeholder for future implementation
    console.log('Add customer clicked');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">รายชื่อลูกค้า</h1>
          <p className="text-gray-600 mt-1">จัดการข้อมูลลูกค้าทั้งหมด</p>
        </div>
        <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700">
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อบริษัท</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead>วันที่เพิ่มข้อมูล</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{formatDate(customer.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-500">
        แสดงลูกค้าทั้งหมด {mockCustomers.length} รายการ
      </div>
    </div>
  );
};