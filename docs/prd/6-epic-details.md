# **6. Epic Details**

### **Epic 1: Core CRM Scaffolding & Functionality**
* **Epic Goal:** สร้างโครงสร้างพื้นฐาน, หน้าตาหลัก, และฟังก์ชันที่จำเป็นต่อการจัดการ "ลูกค้า" และ "รายการงาน" ทั้งหมดให้เสร็จสิ้น โดยใช้ข้อมูลจำลอง (Dummy Data) เพื่อให้เราสามารถทดลองคลิกใช้งาน Workflow ที่สำคัญที่สุดของโปรแกรมได้ตั้งแต่ต้นจนจบ

**Story 1.1: Project Scaffolding (การตั้งค่าโปรเจกต์เริ่มต้น)**
* **As a** developer, **I want** to set up a new React project with shadcn/ui and Supabase client installed, **so that** I have a clean and ready foundation to start building the application.
* **Acceptance Criteria:**
    1.  React project ถูกสร้างขึ้นด้วย Vite หรือเครื่องมือมาตรฐานอื่น
    2.  Dependencies ที่จำเป็น (shadcn/ui, Supabase client) ถูกติดตั้งเรียบร้อย
    3.  โครงสร้างโฟลเดอร์พื้นฐานสำหรับ components, pages, services ถูกสร้างขึ้น
    4.  โปรเจกต์สามารถรันในโหมด development และแสดงหน้าจอเริ่มต้นได้

**Story 1.2: Main Layout Shell (การสร้างโครงหน้าเว็บหลัก)**
* **As a** user, **I want** to see a consistent main layout with a navigation bar on the left and a main content area, **so that** I can easily understand the application's structure.
* **Acceptance Criteria:**
    1.  หน้าจอหลักมีแถบเมนู (Sidebar) แสดงอยู่ทางด้านซ้ายอย่างถาวร
    2.  แถบเมนูมีรายการ (ที่ยังกดไม่ได้) คือ: Dashboard, ลูกค้า, รายการงาน
    3.  มีพื้นที่แสดงเนื้อหาหลัก (Main Content Area) อยู่ตรงกลาง

**Story 1.3: Customer & Job Management Pages (สร้างหน้าจัดการลูกค้าและรายการงาน)**
* **As a** user, **I want** to access pages for viewing customer lists and job lists from the navigation bar, **so that** I can begin managing my core data.
* **Acceptance Criteria:**
    1.  เมื่อคลิกเมนู "ลูกค้า" จะแสดงหน้า "รายชื่อลูกค้า" พร้อมตารางที่แสดงข้อมูลลูกค้าจำลอง
    2.  หน้า "รายชื่อลูกค้า" มีปุ่ม "เพิ่มลูกค้าใหม่"
    3.  เมื่อคลิกเมนู "รายการงาน" จะแสดงหน้า "รายการงาน" พร้อมตารางที่แสดงข้อมูลงานจำลอง
    4.  หน้า "รายการงาน" มีปุ่ม "สร้างงานใหม่"

**Story 1.4: Core Data Management Functionality (เพิ่มฟังก์ชันจัดการข้อมูลหลัก)**
* **As a** user, **I want** to be able to add new customers and new jobs, and update the status of existing jobs, **so that** I can perform the primary functions of the CRM.
* **Acceptance Criteria:**
    1.  การกดปุ่ม "เพิ่มลูกค้าใหม่" จะแสดงฟอร์มสำหรับกรอกข้อมูล และสามารถเพิ่มลูกค้าลงในข้อมูลจำลองได้
    2.  การกดปุ่ม "สร้างงานใหม่" จะแสดงฟอร์มสำหรับกรอกข้อมูล และสามารถสร้างงานใหม่ลงในข้อมูลจำลองได้
    3.  ผู้ใช้สามารถคลิกที่งานในรายการเพื่อดูรายละเอียดและสามารถ "เปลี่ยนสถานะ" ของงานนั้นได้

**Story 1.5: Dashboard Implementation (การสร้างหน้า Dashboard)**
* **As a** user, **I want** to see a dashboard that summarizes important information when I open the app, **so that** I know what to focus on immediately.
* **Acceptance Criteria:**
    1.  หน้า Dashboard แสดงข้อมูลสรุปที่ดึงมาจากข้อมูลจำลอง (เช่น จำนวนงานใหม่, งานด่วน)
    2.  ข้อมูลบน Dashboard มีความถูกต้องตรงกับข้อมูลจำลองที่มีอยู่

### **Epic 2: User Authentication**
* **Epic Goal:** นำระบบ Login ด้วย Email/Password ที่เรียบง่ายมาติดตั้ง และเชื่อมต่อการทำงานทั้งหมดที่สร้างใน Epic 1 ให้กลายเป็นระบบที่ปลอดภัยและผูกกับผู้ใช้งานแต่ละคน

**Story 2.1: Login UI Implementation (สร้างหน้าจอสำหรับ Login)**
* **As a** user, **I want** to see a simple and clear login page, **so that** I can enter my credentials to access the system.
* **Acceptance Criteria:**
    1.  มีหน้าจอ Login ที่ `/login`
    2.  หน้าจอประกอบด้วยช่องกรอก Email, ช่องกรอก Password, และปุ่ม "เข้าสู่ระบบ"
    3.  มีลิงก์ "ลืมรหัสผ่าน" แสดงอยู่บนหน้าจอ

**Story 2.2: User Authentication Logic (ติดตั้งระบบยืนยันตัวตน)**
* **As a** user, **I want** to be able to log in with my email and password, **so that** the system knows who I am and can grant me access.
* **Acceptance Criteria:**
    1.  เมื่อกรอก Email/Password ถูกต้องและกด "เข้าสู่ระบบ" จะต้องพาผู้ใช้ไปยังหน้า Dashboard
    2.  เมื่อกรอก Email/Password ผิด จะต้องแสดงข้อความแจ้งเตือนที่ชัดเจน
    3.  (เบื้องต้น) ระบบสามารถรองรับการสร้างบัญชีผู้ใช้ใหม่ได้ (อาจจะเป็นฟังก์ชันหลังบ้านก่อนสำหรับ MVP)

**Story 2.3: Protected Routes (จำกัดสิทธิ์การเข้าถึงหน้าต่างๆ)**
* **As a** system administrator, **I want** to ensure that only logged-in users can access the main application pages, **so that** our business data is secure.
* **Acceptance Criteria:**
    1.  หากผู้ใช้ที่ยังไม่ได้ Login พยายามเข้าหน้า Dashboard, Customers, หรือ Jobs จะต้องถูก redirect ไปยังหน้า Login
    2.  ผู้ใช้ที่ Login แล้วเท่านั้นจึงจะสามารถเข้าถึงหน้าต่างๆ นอกจากหน้า Login ได้

**Story 2.4: Logout Functionality (ฟังก์ชันออกจากระบบ)**
* **As a** user, **I want** a clear logout button, **so that** I can securely end my session.
* **Acceptance Criteria:**
    1.  มีปุ่ม "ออกจากระบบ" แสดงอยู่ในตำแหน่งที่หาง่าย (เช่น ในแถบเมนูด้านซ้าย)
    2.  เมื่อกดปุ่ม "ออกจากระบบ" session ของผู้ใช้จะถูกเคลียร์ และระบบจะพากลับไปยังหน้า Login

