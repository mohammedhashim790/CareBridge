import React from 'react';
import { Calendar } from 'lucide-react';
import { getCurrentUser } from 'shared-modules/src/user_auth/user_auth';

interface HeaderProps {
  doctorName: string;
}

const Header: React.FC<HeaderProps> = ({ doctorName }) => {
  const user = getCurrentUser()
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-primary px-3 sm:px-4 py-2 rounded-lg font-bold text-base sm:text-lg">
            CareBridge
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center">
            </div>
            <div className="hidden sm:block">
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">{doctorName}</h2>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base hidden sm:inline">Appointments</span>
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;