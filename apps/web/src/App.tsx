import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components';
import { DashboardPage, CustomersPage, JobsPage } from './pages';
import { DataProvider } from './contexts/DataContext';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </DataProvider>
  );
}

export default App;