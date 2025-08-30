# **4. Technical Assumptions (ข้อสมมติฐานทางเทคนิค)**

**Repository Structure (โครงสร้างของที่เก็บโค้ด): Monorepo**
* **Rationale (เหตุผล):** การเก็บโค้ดทั้ง Frontend และ Backend (ส่วนของ Supabase Functions) ไว้ในที่เดียวกัน (Monorepo) จะช่วยให้การจัดการง่ายขึ้น โดยเฉพาะการแชร์โค้ดหรือ Type ต่างๆ ระหว่างกัน

**Service Architecture (สถาปัตยกรรมของเซอร์วิส): Serverless**
* **Rationale (เหตุผล):** การเลือกใช้ Supabase เป็น Backend หลัก ทำให้สถาปัตยกรรมของเราเป็นแบบ Serverless โดยธรรมชาติ ซึ่งช่วยลดภาระการดูแลจัดการ Server และสามารถสเกลได้ตามการใช้งานจริง ตอบโจทย์ MVP ที่ต้องการความรวดเร็ว

**Testing Requirements (ข้อกำหนดในการทดสอบ): Unit + Integration**
* **Rationale (เหตุผล):** สำหรับ MVP เราจะเน้นการทดสอบ 2 ระดับ คือ Unit Test เพื่อทดสอบการทำงานของแต่ละส่วนเล็กๆ และ Integration Test เพื่อให้มั่นใจว่าเมื่อนำส่วนต่างๆ มาประกอบกันแล้วยังทำงานได้ถูกต้อง

**Additional Technical Assumptions and Requests (ข้อสมมติฐานและข้อกำหนดอื่นๆ):**
* **Frontend Framework:** **React**
* **UI Component Library:** **shadcn/ui**
* **Backend & Database:** **Supabase**
* **Configuration:** ข้อมูล Key และ Credentials ที่สำคัญทั้งหมดจะถูกจัดเก็บและเรียกใช้ผ่านไฟล์ **`.env`** เท่านั้น
* **MVP Data Strategy:** ในเวอร์ชันแรกสุด ระบบจะใช้ **ข้อมูลจำลอง (Dummy Data)** เพื่อให้สามารถพัฒนาและทดสอบหน้าจอ (UI) ได้อย่างรวดเร็ว โดยยังไม่ต้องเชื่อมต่อกับ Supabase จริง
