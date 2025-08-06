import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
// import Settings from './pages/Settings';
import TestComponents from './pages/TestComponents';
import LoginPage from './pages/LoginPage';
import Logout from './pages/Logout';
import PasswordChange from './pages/PasswordChange';
import TestIconsPage from './pages/TestIconsPage';


const Products = () => (
  <div className="p-8">
    <h2 className="text-xl font-heading text-text-dark">Products Page</h2>
    <p className="mt-4 text-text-DEFAULT">Manage your products here.</p>
  </div>
);
const Orders = () => (
  <div className="p-8">
    <h2 className="text-xl font-heading text-text-dark">Orders Page</h2>
    <p className="mt-4 text-text-DEFAULT">View and process orders.</p>
  </div>
);
const Users = () => (
  <div className="p-8">
    <h2 className="text-xl font-heading text-text-dark">Users Page</h2>
    <p className="mt-4 text-text-DEFAULT">Manage user accounts.</p>
  </div>
);
const Settings = () => (
  <div className="p-8">
    <h2 className="text-xl font-heading text-text-dark">Settings Page</h2>
    <p className="mt-4 text-text-DEFAULT">Adjust your application settings.</p>
  </div>
);



// Icon components (replace with actual icons if needed)
const DashboardIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7m7 7v10a1 1 0 01-1 1h-3" />
  </svg>
);
const ProductsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const OrdersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h-5v-2a3 3 0 013-3h2a3 3 0 013 3v2M18 10a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
);

const navigation = [
  { name: 'Dashboard', href: '/', icon: DashboardIcon },
  { name: 'Products', href: '/products', icon: ProductsIcon },
  { name: 'Orders', href: '/orders', icon: OrdersIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
];

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  // State to control the visibility of the "hamburger" menu on small screens
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
    // Close mobile sidebar when route changes
    if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    // This toggle is used by the internal sidebar button
    setIsCollapsed(!isCollapsed);
    // When collapsing on desktop, ensure mobile sidebar is also closed if it was open
    if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
    }
  };

  const toggleMobileSidebar = () => {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Always collapsed by default on small screens
        setIsMobileSidebarOpen(false); // Ensure it's closed on resize
      } else {
        setIsCollapsed(false); // Always extended by default on larger screens
        setIsMobileSidebarOpen(false); // Ensure it's closed on desktop if resized from mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if current route should show the sidebar
  const noSidebarRoutes = ['/login', '/password-change', '/logout', '/test-icons', '/test-components'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  if (!showSidebar) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/test-icons" element={<TestIconsPage />} />
        <Route path="*" element={<LoginPage />} />
        <Route path="/test-components" element={<TestComponents />} />
        
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-DEFAULT">
      {/* Sidebar for desktop and mobile overlay */}
      <div
        className={`
          ${isCollapsed && !isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:block'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-background-default
          text-text-DEFAULT
          h-screen
          p-4
          transition-all
          duration-300
          ease-in-out
          flex
          flex-col
          shadow-card
          md:static md:translate-x-0
        `}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <Sidebar
          isCollapsed={isCollapsed && !isMobileSidebarOpen} // Pass actual collapsed state
          toggleSidebar={toggleSidebar}
          navigation={navigation}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Close button for mobile sidebar when open */}
        {isMobileSidebarOpen && (
            <button
              onClick={toggleMobileSidebar}
              className="absolute top-4 right-4 p-2 rounded-full bg-surface-dark text-text-DEFAULT md:hidden z-50"
              aria-label="Close sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}
      </div>

      {/* Overlay when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}


      <div
        className={`flex-grow p-6 transition-all duration-300 ease-in-out
          ${isCollapsed && !isMobileSidebarOpen ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'}
        `}
      >
        {/* Top bar for mobile containing toggle button and potential header */}
        <div className="flex justify-between items-center py-2 md:hidden mb-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-borderRadius-lg hover:bg-muted-light focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
            aria-label="Open sidebar"
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-text-DEFAULT"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-heading text-primary-DEFAULT">App Name</h1> {/* Or current page title */}
        </div>

        {/* This div provides padding from the top for mobile when sidebar is open */}
        {/* Removed this as the header above handles it */}
        {/* <div className="h-16 md:hidden"></div> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;