import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Job } from '@shared/types';

// Initial mock data
const initialCustomers: Customer[] = [
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

const initialJobs: Job[] = [
  {
    id: 'job-1',
    created_at: '2025-08-30T08:00:00.000Z',
    customer_id: '1',
    description: 'ขนส่งสินค้าจากกรุงเทพฯ ไปยังเชียงใหม่',
    status: 'New',
  },
  {
    id: 'job-2',
    created_at: '2025-08-29T14:30:00.000Z',
    customer_id: '2',
    description: 'นำเข้าสินค้าจากต่างประเทศ - ผ่านพิธีการศุลกากร',
    status: 'In Progress',
  },
  {
    id: 'job-3',
    created_at: '2025-08-29T10:15:00.000Z',
    customer_id: '1',
    description: 'จัดส่งสินค้าทางเรือ กรุงเทพฯ-ภูเก็ต',
    status: 'Done',
  },
  {
    id: 'job-4',
    created_at: '2025-08-28T16:45:00.000Z',
    customer_id: '3',
    description: 'ขนส่งสินค้าอุตสาหกรรม - รายการพิเศษ',
    status: 'In Progress',
  },
  {
    id: 'job-5',
    created_at: '2025-08-28T09:30:00.000Z',
    customer_id: '4',
    description: 'บริการจัดเก็บและกระจายสินค้า',
    status: 'New',
  },
  {
    id: 'job-6',
    created_at: '2025-08-27T13:20:00.000Z',
    customer_id: '2',
    description: 'ขนส่งด่วนพิเศษ - Same Day Delivery',
    status: 'Done',
  },
  {
    id: 'job-7',
    created_at: '2025-08-26T11:00:00.000Z',
    customer_id: '3',
    description: 'บริการขนส่งระหว่างประเทศ ไทย-มาเลเซีย',
    status: 'In Progress',
  },
  {
    id: 'job-8',
    created_at: '2025-08-25T15:15:00.000Z',
    customer_id: '4',
    description: 'จัดส่งสินค้าเกษตร - ต้องคงความเย็น',
    status: 'Done',
  },
];

// Form data types for creating new records
export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
}

export interface JobFormData {
  description: string;
  customer_id: string;
}

// Context interface
interface DataContextType {
  customers: Customer[];
  jobs: Job[];
  loading: boolean;
  
  // Customer operations
  addCustomer: (customerData: CustomerFormData) => Promise<Customer>;
  getCustomers: () => Customer[];
  
  // Job operations
  addJob: (jobData: JobFormData) => Promise<Job>;
  getJobs: () => Job[];
  getJobWithCustomer: (jobId: string) => Job & { customers: Customer } | null;
  updateJobStatus: (jobId: string, status: Job['status']) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  customers: 'crm_customers',
  jobs: 'crm_jobs',
} as const;

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from localStorage or use initial mock data
  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem(STORAGE_KEYS.customers);
      const storedJobs = localStorage.getItem(STORAGE_KEYS.jobs);

      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        setCustomers(initialCustomers);
        localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(initialCustomers));
      }

      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      } else {
        setJobs(initialJobs);
        localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(initialJobs));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Fall back to initial data if localStorage fails
      setCustomers(initialCustomers);
      setJobs(initialJobs);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save customers to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    }
  }, [customers, loading]);

  // Save jobs to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobs));
    }
  }, [jobs, loading]);

  // Generate unique ID
  const generateId = (prefix: string = ''): string => {
    return `${prefix}${crypto.randomUUID()}`;
  };

  // Customer operations
  const addCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
    return new Promise((resolve) => {
      const newCustomer: Customer = {
        id: generateId(),
        created_at: new Date().toISOString(),
        ...customerData,
      };

      setCustomers(prev => [newCustomer, ...prev]);
      resolve(newCustomer);
    });
  };

  const getCustomers = (): Customer[] => {
    return [...customers];
  };

  // Job operations
  const addJob = async (jobData: JobFormData): Promise<Job> => {
    return new Promise((resolve) => {
      const newJob: Job = {
        id: generateId('job-'),
        created_at: new Date().toISOString(),
        status: 'New',
        ...jobData,
      };

      setJobs(prev => [newJob, ...prev]);
      resolve(newJob);
    });
  };

  const getJobs = (): Job[] => {
    return jobs.map(job => ({
      ...job,
      customers: customers.find(c => c.id === job.customer_id),
    }));
  };

  const getJobWithCustomer = (jobId: string): Job & { customers: Customer } | null => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return null;

    const customer = customers.find(c => c.id === job.customer_id);
    if (!customer) return null;

    return { ...job, customers: customer };
  };

  const updateJobStatus = async (jobId: string, status: Job['status']): Promise<void> => {
    return new Promise((resolve) => {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      ));
      resolve();
    });
  };

  const contextValue: DataContextType = {
    customers,
    jobs: getJobs(),
    loading,
    addCustomer,
    getCustomers,
    addJob,
    getJobs,
    getJobWithCustomer,
    updateJobStatus,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};