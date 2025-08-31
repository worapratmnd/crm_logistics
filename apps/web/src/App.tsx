import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components';
import { DashboardPage, CustomersPage, JobsPage, LoginPage } from './pages';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RouteGuards } from './components/auth/RouteGuards';
import './App.css';

// App Routes component (needs to be inside AuthProvider)
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <RouteGuards>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <CustomersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <JobsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback for unknown routes */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </RouteGuards>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;