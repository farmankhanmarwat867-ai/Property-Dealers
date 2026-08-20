import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';

// Public Components & Pages
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { ListPropertyModal } from './components/public/ListPropertyModal';
import { HomePage } from './components/public/HomePage';
import { PropertiesPage } from './components/public/PropertiesPage';
import { PropertyDetailsPage } from './components/public/PropertyDetailsPage';
import { BuyPage } from './components/public/BuyPage';
import { RentPage } from './components/public/RentPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';

// Admin Components & Pages
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './components/admin/DashboardPage';
import { PropertiesListPage } from './components/admin/PropertiesListPage';
import { PropertyFormPage } from './components/admin/PropertyFormPage';
import { CustomersCRMPage } from './components/admin/CustomersCRMPage';
import { LeadPipelinePage } from './components/admin/LeadPipelinePage';
import { FollowUpsPage } from './components/admin/FollowUpsPage';
import { DealsPage } from './components/admin/DealsPage';
import { ReportsPage } from './components/admin/ReportsPage';
import { SettingsPage } from './components/admin/SettingsPage';

// Public Layout Wrapper with List Property Modal trigger
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 font-sans selection:bg-blue-600 selection:text-white">
      <PublicNavbar onOpenListModal={() => setIsListModalOpen(true)} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <ListPropertyModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
};

// Protected Admin Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Portal Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/properties"
            element={
              <PublicLayout>
                <PropertiesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/properties/:slugOrId"
            element={
              <PublicLayout>
                <PropertyDetailsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/buy"
            element={
              <PublicLayout>
                <BuyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/rent"
            element={
              <PublicLayout>
                <RentPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin CRM Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <DashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <DashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedAdminRoute>
                <PropertiesListPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/properties/new"
            element={
              <ProtectedAdminRoute>
                <PropertyFormPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/properties/edit/:id"
            element={
              <ProtectedAdminRoute>
                <PropertyFormPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedAdminRoute>
                <CustomersCRMPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedAdminRoute>
                <LeadPipelinePage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/followups"
            element={
              <ProtectedAdminRoute>
                <FollowUpsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/deals"
            element={
              <ProtectedAdminRoute>
                <DealsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedAdminRoute>
                <ReportsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedAdminRoute>
                <SettingsPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notification System */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

