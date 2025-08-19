import React from 'react';
import { MenuIcon } from './Icons';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600">
          <MenuIcon />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h2>
        {/* Placeholder for user profile, notifications etc. */}
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;