# **3. Tech Stack**

| Category             | Technology             | Version | Purpose                          | Rationale                                   |
| -------------------- | --------------------- | ------- | -------------------------------- | ------------------------------------------- |
| Frontend Language    | TypeScript            | ~5.x    | พัฒนา Frontend                 | เพิ่มความแม่นยำ ลดข้อผิดพลาด            |
| Frontend Framework   | React                | ~18.x   | สร้าง UI                       | เป็นที่นิยม มี Ecosystem ดี               |
| UI Component Lib    | shadcn/ui             | latest  | คลัง Component สำเร็จรูป       | สวยงาม ปรับแต่งง่าย                      |
| State Management     | React Context API    | built-in| จัดการ State                    | มาพร้อม React เหมาะกับ MVP               |
| Backend Language     | TypeScript           | ~5.x    | Edge Functions                  | ใช้ภาษาเดียวกับ Frontend                  |
| Backend Framework    | Supabase Edge Funcs  | latest  | Business Logic                  | Integrated กับ Supabase                   |
| API Style            | PostgREST            | built-in| CRUD API                        | Supabase สร้างให้โดยอัตโนมัติ            |
| Database             | PostgreSQL           | 15.x    | ฐานข้อมูลหลัก                  | ทรงพลัง มาพร้อม Supabase                 |
| Authentication       | Supabase Auth        | built-in| ระบบยืนยันตัวตน                | จัดการ User ได้ง่าย                       |
| Frontend Testing     | Vitest + RTL         | latest  | Unit & Integration Test         | เหมาะกับ React + Vite                     |
| Build Tool           | Vite                 | ~5.x    | Build โปรเจกต์                 | เร็วทันสมัย                                |
| IaC Tool             | Supabase CLI         | latest  | Database Migrations             | เครื่องมือทางการ Supabase                 |
| CI/CD                | GitHub Actions       | latest  | Deploy อัตโนมัติ               | ฟรีและมาตรฐาน                             |
| CSS Framework        | Tailwind CSS         | ~3.x    | Styling                         | ใช้ร่วมกับ shadcn/ui                       |

---
