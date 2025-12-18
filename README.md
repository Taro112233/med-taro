# Asthma & COPD Clinical Documentation System

ระบบบันทึกและติดตามผลการรักษาผู้ป่วยโรคหืดและปอดอุดกั้นเรื้อรัง

> ⚡ **Ready to Use**: โปรเจคนี้มี Database และ Credentials พร้อมใช้งาน  
> Clone ลงมา → ติดตั้ง dependencies → รันได้เลย!  
> **Login**: Username อะไรก็ได้ | Password: `123456`

---

## 📋 Table of Contents

- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [Tech Stack](#tech-stack)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า Database](#การตั้งค่า-database)
- [การรันโปรเจค](#การรันโปรเจค)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การใช้งาน](#การใช้งาน)
- [คำสั่งที่สำคัญ](#คำสั่งที่สำคัญ)
- [Troubleshooting](#troubleshooting)

---

## 🎯 ภาพรวมระบบ

ระบบนี้พัฒนาขึ้นเพื่อใช้ในคลินิกโรคทางเดินหายใจ มีฟีเจอร์หลัก:

- ✅ บันทึกข้อมูลการประเมินผู้ป่วย (Assessment Form)
- ✅ รายงานสรุปผลการรักษา (Reports)
- ✅ จัดการข้อมูลผู้ป่วยและประวัติการรักษา (Data Management)
- ✅ ระบบ Authentication แบบ Cookie-based
- ✅ Export ข้อมูลเป็น Excel

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React Framework (App Router)
- **React 19.1.0** - UI Library
- **TypeScript 5** - Type Safety
- **TailwindCSS 4** - Utility-first CSS Framework
- **Shadcn/UI** - Component Library (based on Radix UI)
- **Sarabun Font** - Thai language support

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma ORM 6.15.0** - Database ORM with TypeScript
- **PostgreSQL** - Database (Neon Serverless)

### Development Tools
- **pnpm** - Package Manager
- **ESLint** - Code Linting
- **TypeScript** - Static Type Checking

### Key Libraries
- `react-hook-form` + `zod` - Form validation
- `recharts` - Data visualization
- `sonner` - Toast notifications
- `xlsx` - Excel export
- `date-fns` - Date manipulation

---

## 💻 ความต้องการของระบบ

ก่อนเริ่มติดตั้ง ต้องมีโปรแกรมเหล่านี้ติดตั้งในเครื่อง:

### ✅ Required Software

1. **Node.js** (version 18.17 หรือสูงกว่า)
   - ดาวน์โหลดได้ที่: https://nodejs.org/
   - แนะนำให้ใช้ LTS version
   - ตรวจสอบการติดตั้ง: `node --version`

2. **pnpm** (Package Manager)
   - ติดตั้งผ่าน npm: `npm install -g pnpm`
   - ตรวจสอบการติดตั้ง: `pnpm --version`

3. **Git**
   - ดาวน์โหลดได้ที่: https://git-scm.com/
   - ตรวจสอบการติดตั้ง: `git --version`

### 📝 Optional (แนะนำ)

- **VS Code** - Code Editor
  - ดาวน์โหลดได้ที่: https://code.visualstudio.com/
  - Extensions แนะนำ:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - Prisma

---

## 📦 การติดตั้ง

### Step 1: Clone Repository

```bash
# Clone โปรเจคจาก GitHub
git clone https://github.com/Taro112233/Asthma-COPD.git

# หรือ Use This Template (ถ้าเป็น template repository)
# คลิกปุ่ม "Use this template" บน GitHub

# เข้าไปในโฟลเดอร์โปรเจค
cd Asthma-COPD
```

### Step 2: ติดตั้ง Dependencies

```bash
# ติดตั้งแพ็คเกจทั้งหมด (ใช้เวลาประมาณ 2-3 นาที)
pnpm install
```

### Step 3: สร้างไฟล์ Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก (root) โดยคัดลอกจาก `.env.example`

```bash
# สำหรับ macOS/Linux
cp .env.example .env

# สำหรับ Windows (Command Prompt)
copy .env.example .env

# สำหรับ Windows (PowerShell)
Copy-Item .env.example .env
```

**หรือสร้างไฟล์ `.env` ใหม่ด้วยตัวเอง:**

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_9IPaXnKsY3UW@ep-dark-smoke-a1u448zz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Authentication
SYSTEM_PASSWORD="123456"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

> ⚠️ **สำคัญ**: ไฟล์ `.env` มี DATABASE_URL และ PASSWORD จริง ที่พร้อมใช้งานได้เลย  
> อย่า commit ไฟล์นี้ขึ้น GitHub (มีใน .gitignore อยู่แล้ว)

---

## 🗄 การตั้งค่า Database

โปรเจคนี้ใช้ **PostgreSQL** ผ่าน **Neon** (Serverless Postgres)

### Option 1: ใช้ Neon (แนะนำ - Database พร้อมใช้งาน)

**Database ถูกตั้งค่าไว้แล้ว!** 

ไม่ต้องสร้าง Database ใหม่ สามารถใช้ `DATABASE_URL` ที่อยู่ในไฟล์ `.env` ได้เลย

หาก**ต้องการสร้าง Database ของตัวเอง**:
1. สมัครบัญชีที่ https://neon.tech (ฟรี)
2. สร้าง Project ใหม่
3. คัดลอก Connection String
4. แทนที่ค่า `DATABASE_URL` ในไฟล์ `.env`

### Option 2: ใช้ Local PostgreSQL

1. ติดตั้ง PostgreSQL: https://www.postgresql.org/download/
2. สร้าง Database ใหม่
3. ตั้งค่า Connection String ในไฟล์ `.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/asthma_copd_db"
```

### สร้าง Database Schema

หลังจากตั้งค่า `DATABASE_URL` แล้ว รันคำสั่ง:

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (สร้างตารางทั้งหมด)
pnpm db:push

# (Optional) Seed ข้อมูลตัวอย่าง
pnpm db:seed
```

**คำสั่งที่เกี่ยวกับ Database:**

```bash
# ดู Database ผ่าน Prisma Studio (Web UI)
pnpm db:studio

# Reset Database (ลบข้อมูลทั้งหมด + สร้างใหม่)
pnpm db:reset

# สร้าง Migration (เมื่อเปลี่ยน schema)
pnpm db:migrate

# ดู merged schema
pnpm schema:check
```

---

## 🚀 การรันโปรเจค

### Development Mode

```bash
# รันโปรเจค (development mode)
pnpm dev
```

เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

### Production Build

```bash
# Build โปรเจค
pnpm build

# รัน Production server
pnpm start
```

---

## 📁 โครงสร้างโปรเจค

```
project-root/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (Backend)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── assessments/     # Assessment CRUD
│   │   ├── patients/        # Patient search
│   │   └── reports/         # Report statistics
│   ├── dashboard/           # Dashboard page
│   ├── form/                # Assessment form page
│   ├── manage/              # Data management page
│   ├── report/              # Reports page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing/Login page
│
├── components/              # React Components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── forms/              # Form components
│   │   └── sections/       # Form sections
│   ├── manage/             # Data management components
│   ├── reports/            # Report/chart components
│   └── ui/                 # Shadcn UI components
│
├── hooks/                   # Custom React Hooks
│   ├── use-auth.ts         # Authentication hook
│   └── use-mobile.ts       # Mobile detection hook
│
├── lib/                     # Utility libraries
│   ├── db.ts               # Prisma client instance
│   └── utils.ts            # Helper functions
│
├── prisma/                  # Database
│   └── schema.prisma       # Database schema
│
├── public/                  # Static files
│
├── .env                     # Environment variables (สร้างเอง)
├── .env.example            # ตัวอย่าง env file
├── middleware.ts           # Next.js middleware (auth)
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🎮 การใช้งาน

### 1. Login

- เปิด http://localhost:3000
- ใส่ Username (อะไรก็ได้)
- ใส่ Password ตาม `SYSTEM_PASSWORD` ใน `.env`

### 2. เมนูหลัก (Dashboard)

หลัง Login จะเห็น 3 เมนู:

- **แบบประเมิน** - บันทึกข้อมูลผู้ป่วย
- **รายงาน** - ดูสรุปสถิติและกราฟ
- **จัดการข้อมูล** - ค้นหา/แก้ไข/ลบข้อมูล

### 3. Default Login Credentials

```
Username: ใส่อะไรก็ได้ (เช่น admin, pharmacist, หรือชื่อของคุณ)
Password: 123456
```

> 💡 **หมายเหตุ**: Username จะถูกบันทึกเป็นชื่อผู้ประเมินในระบบ ดังนั้นควรใส่ชื่อจริงหรือ username ที่สามารถระบุตัวตนได้

**ต้องการเปลี่ยน Password?**
แก้ไขค่า `SYSTEM_PASSWORD` ในไฟล์ `.env`

---

## 📌 คำสั่งที่สำคัญ

### Development

```bash
pnpm dev              # รันโปรเจค development mode
pnpm build            # Build สำหรับ production
pnpm start            # รัน production server
pnpm lint             # ตรวจสอบ code quality
pnpm type-check       # ตรวจสอบ TypeScript errors
```

### Database

```bash
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio (Database UI)
pnpm db:seed          # Seed ข้อมูลตัวอย่าง
pnpm db:reset         # Reset database
```

### Code Quality

```bash
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

---

## 🔧 Troubleshooting

### ปัญหา: `pnpm: command not found`

**วิธีแก้:**
```bash
npm install -g pnpm
```

### ปัญหา: Database connection error

**วิธีแก้:**
1. ตรวจสอบว่า `DATABASE_URL` ใน `.env` ถูกต้อง
2. ตรวจสอบว่า Database ทำงานอยู่ (ถ้าเป็น local PostgreSQL)
3. ลอง `pnpm db:push` ใหม่

### ปัญหา: Prisma Client not found

**วิธีแก้:**
```bash
pnpm db:generate
```

### ปัญหา: Port 3000 is already in use

**วิธีแก้:**
```bash
# เปลี่ยน port ใน package.json หรือ
# Kill process ที่ใช้ port 3000

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### ปัญหา: TypeScript errors

**วิธีแก้:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### ปัญหา: Prisma schema errors

**วิธีแก้:**
```bash
# Reset database และสร้างใหม่
pnpm db:reset
```

---

## 📚 เอกสารเพิ่มเติม

### Tech Stack Documentation

- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Shadcn/UI**: https://ui.shadcn.com/

### Package Documentation

- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **Recharts**: https://recharts.org/
- **date-fns**: https://date-fns.org/

---

## 🤝 การพัฒนาต่อ

### Branch Strategy

```bash
# สร้าง branch ใหม่สำหรับ feature
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### Code Style

โปรเจคนี้ใช้:
- **ESLint** สำหรับ code linting
- **Prettier** สำหรับ code formatting
- **TypeScript** สำหรับ type safety

รัน `pnpm lint` ก่อน commit ทุกครั้ง

---

## ⚠️ สิ่งที่ต้องระวัง

1. **อย่า commit ไฟล์ `.env`** - มี sensitive data
2. **ตรวจสอบ TypeScript errors** - รัน `pnpm type-check`
3. **Test ก่อน push** - รัน `pnpm build` ให้ผ่าน
4. **Database backup** - Backup ก่อน `pnpm db:reset`

---

## 📞 ติดต่อ/สอบถาม

หากมีปัญหาหรือข้อสงสัย:

1. เปิด Issue ใน GitHub Repository
2. ติดต่อผู้พัฒนาโปรเจค
3. ดู Troubleshooting section ด้านบน

---

## 📝 License

[ระบุ License ของโปรเจค]

---

## 🎉 Quick Start Guide

```bash
# 1. Clone โปรเจค
git clone https://github.com/Taro112233/Asthma-COPD.git
cd Asthma-COPD

# 2. ติดตั้ง dependencies
pnpm install

# 3. ตั้งค่า environment variables
cp .env.example .env
# หรือสร้างไฟล์ .env ใหม่และคัดลอกค่าจากด้านบน

# 4. ตั้งค่า database schema
pnpm db:push

# 5. (Optional) Seed ข้อมูลตัวอย่าง
pnpm db:seed

# 6. รันโปรเจค
pnpm dev

# 7. เปิดเบราว์เซอร์ที่ http://localhost:3000
#    Username: อะไรก็ได้
#    Password: 123456
```

**Happy Coding! 🚀**