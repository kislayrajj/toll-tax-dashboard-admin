import React from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, DashboardIcon, VehicleIcon, TollBoothIcon, IotDeviceIcon } from './Icons';

const Sidebar = ({ activePage, isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Vehicles', path: '/vehicles', icon: <VehicleIcon /> },
    { name: 'Toll Booths', path: '/toll-booths', icon: <TollBoothIcon /> },
    { name: 'IoT Devices', path: '/iot-devices', icon: <IotDeviceIcon /> },
  ];

  // Map active page name to path for highlighting
  const getActivePath = () => {
    switch (activePage) {
      case 'Dashboard':
        return '/dashboard';
      case 'Vehicles':
        return '/vehicles';
      case 'Toll Booths':
        return '/toll-booths';
      case 'IoT Devices':
        return '/iot-devices';
      default:
        return '/dashboard';
    }
  };

  const activePath = getActivePath();

  return (
    <>
      {/* Overlay for mobile */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      
      <aside className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 z-40`}>
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button className="lg:hidden text-white" onClick={() => setIsOpen(false)}><CloseIcon /></button>
        </div>
        <nav className="mt-4">
          <ul>
            {/* Add a link to the root path that redirects to dashboard */}
            <li className="px-2">
              <Link
                to="/"
                className="flex items-center p-3 my-1 rounded-lg transition-colors duration-200 hover:bg-gray-700"
              >
                <span className="font-medium">Home</span>
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.name} className="px-2">
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${activePath === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;