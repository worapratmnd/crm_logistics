# **6. Database Schema (โครงสร้างฐานข้อมูล)**
```sql
-- Table for Customers
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT
);

-- Table for Jobs
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'New'::text NOT NULL
);
```

---
