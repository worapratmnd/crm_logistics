// Shared types for the Logistics CRM MVP

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
}

export interface Job {
  id: string;
  created_at: string;
  customer_id: string;
  description: string;
  status: 'New' | 'In Progress' | 'Done';
  customers?: Customer;
}

export interface Shipment {
  id: string;
  customerId: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  origin: string;
  destination: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ShipmentStatus = Shipment['status'];
export type UserRole = User['role'];