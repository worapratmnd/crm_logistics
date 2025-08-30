import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData, JobFormData } from '../../contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';

// Form validation function
const validateForm = (data: JobFormData) => {
  const errors: Record<string, string> = {};
  
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'รายละเอียดงานห้ามเป็นค่าว่าง';
  } else if (data.description.length > 500) {
    errors.description = 'รายละเอียดงานต้องไม่เกิน 500 ตัวอักษร';
  }
  
  if (!data.customer_id || data.customer_id.trim().length === 0) {
    errors.customer_id = 'กรุณาเลือกลูกค้า';
  }
  
  return errors;
};

interface AddJobDialogProps {
  children: React.ReactNode;
  onJobAdded?: () => void;
}

export const AddJobDialog: React.FC<AddJobDialogProps> = ({
  children,
  onJobAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addJob, getCustomers } = useData();
  const customers = getCustomers();

  const form = useForm<JobFormData>({
    defaultValues: {
      description: '',
      customer_id: '',
    },
  });

  const onSubmit = async (data: JobFormData) => {
    // Validate form data
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      // Set form errors
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(field as keyof JobFormData, { message });
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addJob(data);
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
      
      // Notify parent component
      onJobAdded?.();
      
      // Show success feedback (could be enhanced with toast notifications)
      console.log('Job added successfully');
    } catch (error) {
      console.error('Error adding job:', error);
      // In a real app, you'd show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>สร้างงานใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลงานใหม่ เมื่อเสร็จแล้วคลิก "บันทึก" เพื่อสร้างงานในระบบ
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลือกลูกค้า *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกลูกค้าสำหรับงานนี้" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียดงาน *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="กรอกรายละเอียดของงาน เช่น ขนส่งสินค้าจากกรุงเทพฯ ไปยังเชียงใหม่"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm text-gray-600">
              <p>• งานใหม่จะเริ่มต้นด้วยสถานะ "ใหม่"</p>
              <p>• สามารถเปลี่ยนสถานะได้ภายหลังจากการสร้างงาน</p>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};