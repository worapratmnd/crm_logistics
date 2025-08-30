import React from 'react';
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
import { AddCustomerDialog } from '../components/dialogs/AddCustomerDialog';

export const CustomersPage: React.FC = () => {
  const { customers, loading } = useData();

  const handleCustomerAdded = () => {
    // Data will be updated automatically through context
    console.log('Customer added successfully');
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
        <AddCustomerDialog onCustomerAdded={handleCustomerAdded}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            เพิ่มลูกค้าใหม่
          </Button>
        </AddCustomerDialog>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  ยังไม่มีข้อมูลลูกค้า
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <div className="text-sm text-gray-500">
        แสดงลูกค้าทั้งหมด {customers.length} รายการ
      </div>
    </div>
  );
};