import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';

export interface DashboardStats {
  totalCustomers: number;
  totalJobs: number;
  newJobs: number;
  inProgressJobs: number;
  completedJobs: number;
}

export const useDashboardData = () => {
  const { customers, jobs, loading } = useData();

  const stats: DashboardStats = useMemo(() => {
    if (loading || !jobs) {
      return {
        totalCustomers: 0,
        totalJobs: 0,
        newJobs: 0,
        inProgressJobs: 0,
        completedJobs: 0,
      };
    }

    // Calculate statistics
    const totalCustomers = customers.length;
    const totalJobs = jobs.length;
    
    // Count jobs by status
    const jobsByStatus = jobs.reduce(
      (acc, job) => {
        switch (job.status) {
          case 'New':
            acc.newJobs++;
            break;
          case 'In Progress':
            acc.inProgressJobs++;
            break;
          case 'Done':
            acc.completedJobs++;
            break;
        }
        return acc;
      },
      {
        newJobs: 0,
        inProgressJobs: 0,
        completedJobs: 0,
      }
    );

    return {
      totalCustomers,
      totalJobs,
      ...jobsByStatus,
    };
  }, [customers, jobs, loading]);

  return {
    stats,
    loading,
    isDataAvailable: !loading && customers.length > 0,
  };
};