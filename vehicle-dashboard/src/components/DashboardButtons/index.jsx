import React from 'react';
import { Settings, Battery, Thermometer, Grid, Power } from 'lucide-react';

/**
 * DashboardButtons Component
 * Bottom row buttons including gear, motor, battery temperature, menu and charging
 */
const DashboardButtons = ({ isCharging, onChargingToggle }) => {
  // Info buttons that are not functional as per requirements
  const infoButtons = [
    { icon: Settings, label: 'Gear' },
    { icon: Battery, label: 'Motor' },
    { icon: Thermometer, label: 'Temperature' },
    { icon: Grid, label: 'Menu' },
  ];

  return (
    <div className="flex justify-between items-center">
      {/* Info buttons */}
      <div className="flex space-x-4">
        {infoButtons.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="p-2 text-gray-400 hover:text-gray-300 focus:outline-none"
            disabled
          >
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </div>

      {/* Charging button */}
      <button
        onClick={onChargingToggle}
        className={`p-2 rounded-full focus:outline-none transition-colors
          ${isCharging 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
      >
        <Power className="h-6 w-6" />
      </button>
    </div>
  );
};

export default DashboardButtons;