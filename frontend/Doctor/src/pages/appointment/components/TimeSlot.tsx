import React from 'react';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isBooked: boolean;
  onClick: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, isSelected, isBooked, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      className={`w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
        isBooked
          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
          : isSelected
          ? 'border-blue-400 bg-primary text-white shadow-md'
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 active:scale-95'
      }`}
    >
      {time}
    </button>
  );
};

export default TimeSlot;