# **8. Development Workflow (ขั้นตอนการพัฒนา)**
1. **ติดตั้ง Dependencies:** `npm install`
2. **ตั้งค่า Environment:** สร้าง `.env` และใส่ Supabase URL + Anon Key
3. **รัน Development Server:** `npm run dev --workspace=web`

---

## **9. Deployment Architecture (สถาปัตยกรรมสำหรับการ Deploy)**
- **Frontend:** Deploy ผ่าน **Vercel** (เชื่อม GitHub repo)
- **Backend:** จัดการโดย Supabase, deploy schema changes ผ่าน **Supabase CLI**

---

## **10. Coding Standards (มาตรฐานการเขียนโค้ด)**
- **Data Access:** ต้องใช้ Supabase Client Library
- **Type Sharing:** Type ทั้งหมดอยู่ใน `packages/shared`
- **Environment Variables:** เรียกใช้ค่าผ่าน `import.meta.env.VITE_*`

---

