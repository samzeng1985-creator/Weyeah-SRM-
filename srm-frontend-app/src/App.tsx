import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Materials from './pages/Materials';
import Contracts from './pages/Contracts';
import Pricing from './pages/Pricing';
import Organization from './pages/Organization';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import LogisticsPage from './pages/Logistics';
import ContractTemplates from './pages/ContractTemplates';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <AppRoutes onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

function AppRoutes({ onLogout }: { onLogout: () => void }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard onLogout={onLogout} />} />
      <Route path="/suppliers" element={<Suppliers onLogout={onLogout} />} />
      <Route path="/materials" element={<Materials onLogout={onLogout} />} />
      <Route path="/categories" element={<Categories onLogout={onLogout} />} />
      <Route path="/contracts" element={<Contracts onLogout={onLogout} />} />
      <Route path="/contract-templates" element={<ContractTemplates onLogout={onLogout} />} />
      <Route path="/pricing" element={<Pricing onLogout={onLogout} />} />
      <Route path="/logistics" element={<LogisticsPage onLogout={onLogout} />} />
      <Route path="/organization" element={<Organization onLogout={onLogout} />} />
      <Route path="/settings" element={<Settings onLogout={onLogout} />} />
    </Routes>
  );
}

export default App;
