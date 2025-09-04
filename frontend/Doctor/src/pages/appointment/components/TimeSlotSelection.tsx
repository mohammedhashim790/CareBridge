import React from 'react';
import TimeSlot from './TimeSlot';

interface TimeSlotSectionProps {
  title: string;
  timeRange: string;
  icon: React.ReactNode;
  slots: string[];
  selectedSlot: string | null;
  bookedSlots: string[];
  onSlotSelect: (slot: string) => void;
  onAddSlots: () => void;
}

const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  title,
  timeRange,
  icon,
  slots,
  selectedSlot,
  bookedSlots,
  onSlotSelect,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {icon}
          <div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{timeRange}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {slots.map((slot) => (
          <TimeSlot
            key={slot}
            time={slot}
            isSelected={selectedSlot === slot}
            isBooked={bookedSlots.includes(slot)}
            onClick={() => onSlotSelect(slot)}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSection;