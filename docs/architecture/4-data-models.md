# **4. Data Models (โมเดลข้อมูล)**

### **Customer (ลูกค้า)**
```ts
export interface Customer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
}
```

### **Job (รายการงาน)**
```ts
export interface Job {
  id: string;
  created_at: string;
  customer_id: string;
  description: string;
  status: 'New' | 'In Progress' | 'Done';
  customers?: Customer;
}
```

---
