import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData, CustomerFormData } from '../../contexts/DataContext';
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
import { Input } from '../ui/input';
import { Button } from '../ui/button';

// Form validation function
const validateForm = (data: CustomerFormData) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'ชื่อบริษัทห้ามเป็นค่าว่าง';
  } else if (data.name.length > 100) {
    errors.name = 'ชื่อบริษัทต้องไม่เกิน 100 ตัวอักษร';
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'อีเมลห้ามเป็นค่าว่าง';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
  }
  
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'เบอร์โทรศัพท์ห้ามเป็นค่าว่าง';
  } else if (!/^[0-9\-\s]+$/.test(data.phone)) {
    errors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น';
  }
  
  return errors;
};

interface AddCustomerDialogProps {
  children: React.ReactNode;
  onCustomerAdded?: () => void;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  children,
  onCustomerAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCustomer } = useData();

  const form = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    // Validate form data
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      // Set form errors
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(field as keyof CustomerFormData, { message });
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addCustomer(data);
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
      
      // Notify parent component
      onCustomerAdded?.();
      
      // Show success feedback (could be enhanced with toast notifications)
      console.log('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
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
          <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลลูกค้าใหม่ เมื่อเสร็จแล้วคลิก "บันทึก" เพื่อเพิ่มลูกค้าลงในระบบ
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อบริษัท *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรอกชื่อบริษัท เช่น บริษัท ABC จำกัด"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="กรอกอีเมล เช่น contact@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรอกเบอร์โทรศัพท์ เช่น 02-123-4567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                className="bg-blue-600 hover:bg-blue-700"
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