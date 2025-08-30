import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components';
import { CustomersPage, JobsPage } from './pages';
import './App.css';

// Dashboard component (placeholder for existing dashboard)
const Dashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Logistics CRM MVP
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          ยินดีต้อนรับสู่ระบบ CRM สำหรับธุรกิจขนส่งและโลจิสติกส์
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">12</h3>
              <p className="text-gray-600">ลูกค้าทั้งหมด</p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-2xl font-bold text-green-600 mb-2">8</h3>
              <p className="text-gray-600">งานทั้งหมด</p>
            </div>
            <div className="text-center p-4">
              <h3 className="text-2xl font-bold text-orange-600 mb-2">3</h3>
              <p className="text-gray-600">งานที่กำลังดำเนินการ</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;