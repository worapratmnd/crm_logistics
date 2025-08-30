### **เอกสาร: Product Requirements Document (PRD) - ฉบับสมบูรณ์**
### **โครงการ: Logistics CRM (MVP)**

### **1. Goals and Background Context (เป้าหมายและที่มา)**

**Goals (เป้าหมายหลัก):**
* ลดเวลาในการทำงานซ้ำซ้อนของพนักงาน
* ลดความผิดพลาดที่เกิดจากการใช้โปรแกรมที่ซับซ้อน
* ทำให้พนักงานใหม่สามารถเรียนรู้และใช้งานโปรแกรมได้เอง โดยไม่จำเป็นต้องมีการสอนที่ซับซ้อน
* ส่งมอบ MVP ที่ใช้งานได้จริงให้เร็วที่สุด เพื่อเก็บ Feedback มาพัฒนาต่อยอด

**Background Context (ที่มาและความสำคัญ):**
โปรแกรม CRM และระบบจัดการ Logistics ที่มีอยู่ทั่วไปมักจะถูกออกแบบมาให้มีฟังก์ชันที่ครอบคลุม แต่ก็แลกมาด้วยความซับซ้อนที่มากเกินไปสำหรับพนักงานระดับปฏิบัติการ ทำให้เกิดปัญหาในการใช้งาน สิ้นเปลืองเวลา และสร้างความหงุดหงิดใจ โครงการนี้จึงถูกสร้างขึ้นเพื่อแก้ไขปัญหานี้โดยตรง โดยการสร้างเว็บแอปพลิเคชันที่เน้นความเรียบง่ายสูงสุด มีเฉพาะฟังก์ชันที่จำเป็นจริงๆ และออกแบบโดยยึดผู้ใช้งานเป็นศูนย์กลาง เพื่อให้พนักงานสามารถทำงานได้อย่างราบรื่นและมีประสิทธิภาพ

**Change Log (ประวัติการแก้ไข):**
| วันที่ | เวอร์ชัน | รายละเอียด | ผู้จัดทำ |
| :--- | :--- | :--- | :--- |
| 30/08/2025 | 1.0 | จัดทำเอกสารฉบับร่างแรก | John (PM) |

### **2. Requirements (ข้อกำหนดของระบบ)**

**Functional Requirements (สิ่งที่ระบบต้องทำได้):**
* **FR1:** ผู้ใช้ต้องสามารถ Login เข้าสู่ระบบด้วย Email และ Password ได้
* **FR2:** ระบบต้องมีฟังก์ชัน "ลืมรหัสผ่าน"
* **FR3:** หลังจาก Login จะต้องแสดงหน้า Dashboard เป็นหน้าแรก
* **FR4:** Dashboard ต้องแสดงข้อมูลสำคัญทางธุรกิจ (เบื้องต้นคือ: รายการงานใหม่, งานที่ต้องติดตามด่วน)
* **FR5:** ต้องมีแถบเมนูหลักแสดงผลอยู่ทางด้านซ้ายของจอ
* **FR6:** เมนูหลักต้องประกอบด้วยลิงก์ไปยัง: Dashboard, ลูกค้า (Customers), และ รายการงาน (Jobs)
* **FR7:** ผู้ใช้ต้องสามารถดูรายการข้อมูลลูกค้าทั้งหมดได้
* **FR8:** ผู้ใช้ต้องสามารถเพิ่มข้อมูลลูกค้าใหม่ได้ (เฉพาะข้อมูลพื้นฐานสำหรับ MVP)
* **FR9:** ผู้ใช้ต้องสามารถดูรายการงานทั้งหมดได้
* **FR10:** ผู้ใช้ต้องสามารถสร้างงานใหม่ได้ (เฉพาะข้อมูลพื้นฐานสำหรับ MVP)
* **FR11:** ผู้ใช้ต้องสามารถอัปเดต "สถานะ" ของงานได้

**Non-Functional Requirements (ข้อกำหนดอื่นๆ):**
* **NFR1:** หน้าตาโปรแกรม (UI) ต้องเรียบง่าย สะอาดตา และใช้งานง่ายสำหรับผู้ที่ไม่เชี่ยวชาญคอมพิวเตอร์
* **NFR2:** Frontend ต้องพัฒนาด้วย **React** และ **shadcn/ui**
* **NFR3:** Backend และฐานข้อมูลต้องใช้ **Supabase**
* **NFR4:** ข้อมูลสำคัญ (Keys/Credentials) ทั้งหมดต้องถูกจัดเก็บและเรียกใช้จากไฟล์ **`.env`**
* **NFR5:** ในเวอร์ชัน MVP นี้ ระบบจะใช้ข้อมูลจำลอง (Dummy Data) ก่อน เพื่อให้เห็นภาพรวมและทดสอบการใช้งาน
* **NFR6:** โปรแกรมต้องเป็น Responsive Web Application ที่ใช้งานบนเบราว์เซอร์มาตรฐานได้

### **3. User Interface Design Goals (เป้าหมายการออกแบบหน้าจอ)**

**Overall UX Vision (วิสัยทัศน์ด้านประสบการณ์ผู้ใช้):**
สร้างประสบการณ์ที่ **"ไม่ต้องคิดเยอะ" (Effortless)** ทุกอย่างต้องชัดเจนและตรงไปตรงมา ผู้ใช้ที่ไม่คุ้นเคยกับคอมพิวเตอร์สามารถเริ่มทำงานได้ทันทีโดยไม่ต้องมีการสอน ลดขั้นตอนที่ไม่จำเป็นออกทั้งหมด และเน้นที่การทำงานหลักให้เสร็จเร็วที่สุด

**Key Interaction Paradigms (รูปแบบการใช้งานหลัก):**
* **โครงสร้างหลัก:** ใช้โครงสร้างแบบ "แถบเมนูด้านซ้าย + พื้นที่ทำงานตรงกลาง" ที่คงที่และไม่เปลี่ยนแปลง เพื่อให้ผู้ใช้คุ้นเคยได้อย่างรวดเร็ว
* **การกระทำ:** เน้นการใช้ปุ่มและฟอร์มกรอกข้อมูลที่ชัดเจน หลีกเลี่ยงการใช้งานที่ซับซ้อนเช่น การลากและวาง (Drag-and-Drop) หรือเมนูที่ซ้อนกันหลายชั้นในเวอร์ชัน MVP

**Core Screens and Views (หน้าจอหลักที่จำเป็น):**
1.  **Login Screen:** สำหรับการเข้าสู่ระบบ
2.  **Dashboard:** หน้าแรกหลัง Login แสดงข้อมูลสรุปที่สำคัญ
3.  **Customer List Page:** หน้าแสดงรายชื่อลูกค้าทั้งหมด
4.  **Add Customer Form:** ฟอร์มสำหรับเพิ่มลูกค้าใหม่
5.  **Job List Page:** หน้าแสดงรายการงานทั้งหมด
6.  **Add Job Form:** ฟอร์มสำหรับสร้างงานใหม่
7.  **Job Detail Page:** หน้าแสดงรายละเอียดของงานและสำหรับอัปเดตสถานะ

**Accessibility (การเข้าถึงสำหรับทุกคน):**
* **เป้าหมาย:** WCAG AA ซึ่งเป็นมาตรฐานสากลเพื่อให้มั่นใจว่าผู้ใช้ทุกคน รวมถึงผู้พิการ สามารถใช้งานโปรแกรมได้

**Branding (เอกลักษณ์องค์กร):**
* **เบื้องต้น:** ยังไม่มีการกำหนด Branding ที่ชัดเจน ในเวอร์ชัน MVP จะใช้ดีไซน์ตั้งต้นของ **shadcn/ui** เพื่อความสวยงามและสะอาดตา

**Target Device and Platforms (อุปกรณ์และแพลตฟอร์มเป้าหมาย):**
* **เป้าหมาย:** **Web Responsive** สามารถใช้งานได้ดีบนเบราว์เซอร์ของคอมพิวเตอร์เดสก์ท็อปเป็นหลัก

### **4. Technical Assumptions (ข้อสมมติฐานทางเทคนิค)**

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

### **5. Epic List (รายการ Epic)**

**Epic 1: Core CRM Scaffolding & Functionality (สร้างโครงและฟังก์ชัน CRM หลัก)**
* **Goal:** สร้างฟังก์ชันหลักที่จำเป็นต่อการทำงานทั้งหมด คือ **การจัดการข้อมูลลูกค้าและรายการงาน** บนโครงสร้างหน้าเว็บที่ใช้งานได้จริง (โดยยังไม่มีระบบ Login) เพื่อให้สามารถทดลองใช้งาน Workflow ที่สำคัญที่สุดได้ทันที

**Epic 2: User Authentication (ระบบ Login และเชื่อมต่อผู้ใช้)**
* **Goal:** นำระบบ Login ด้วย Email/Password ที่เรียบง่ายมาติดตั้ง และเชื่อมต่อการทำงานทั้งหมดใน Epic 1 ให้ผูกกับผู้ใช้งานแต่ละคน เพื่อเตรียมความพร้อมก่อนการใช้งานจริง

### **6. Epic Details**

#### **Epic 1: Core CRM Scaffolding & Functionality**
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

#### **Epic 2: User Authentication**
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

