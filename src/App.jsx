import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import TollBooths from './pages/TollBooths';
import IotDevices from './pages/IotDevices';
import Transactions from './pages/Transaction';

/**
 * The root component of the application.
 * It manages the overall layout, routing, and state.
 * @returns {JSX.Element}
 */
export default function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    
    // Map location pathname to active page name for sidebar
    const getActivePageName = () => {
        switch (location.pathname) {
            case '/':
            case '/dashboard':
                return 'Dashboard';
            case '/vehicles':
                return 'Vehicles';
            case '/toll-booths':
                return 'Toll Booths';
            case '/iot-devices':
                return 'IoT Devices';
            default:
                return 'Dashboard';
        }
    };
    
    const activePage = getActivePageName();

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar
                activePage={activePage}
                setActivePage={() => {}} // No longer needed with React Router
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col lg:ml-64">
                <Header title={activePage} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/toll-booths" element={<TollBooths />} />
                        <Route path="/iot-devices" element={<IotDevices />} />
                        <Route path="/transactions" element={<Transactions />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
