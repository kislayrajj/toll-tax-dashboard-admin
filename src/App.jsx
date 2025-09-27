import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import TollBooths from "./pages/TollBooths";
import IotDevices from "./pages/IotDevices";
import Transactions from "./pages/Transaction";
import DisputesPage from "./pages/Disputes"; 
export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // This could be simplified, but for now we'll add to it
  const getActivePageName = () => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/vehicles":
        return "Vehicles";
      case "/toll-booths":
        return "Toll Booths";
      case "/iot-devices":
        return "IoT Devices";
      case "/transactions":
        return "Transactions";
      case "/disputes": // 2. Add the case for the new page
        return "Disputes";
      default:
        return "Dashboard";
    }
  };

  const activePage = getActivePageName();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
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
            <Route path="/disputes" element={<DisputesPage />} />{" "}
            {/* 3. Add the new Route */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
