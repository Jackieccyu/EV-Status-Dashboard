import React from 'react';
import { ParkingCircle, AlertTriangle, Gauge, Battery } from 'lucide-react';

const StatusIndicators = ({ data }) => {
  const indicators = [
    {
      id: 'parkingBrake',
      Icon: ParkingCircle,  
      activeColor: 'text-red-500',
      inactiveColor: 'text-gray-600'
    },
    {
      id: 'checkEngine',
      Icon: AlertTriangle,  
      activeColor: 'text-yellow-500',
      inactiveColor: 'text-gray-600'
    },
    {
      id: 'motorWarning',
      Icon: Gauge,  
      activeColor: 'text-blue-500',
      inactiveColor: 'text-gray-600'
    },
    {
      id: 'batteryLow',
      Icon: Battery,  
      activeColor: 'text-orange-500',
      inactiveColor: 'text-gray-600'
    }
  ];

  return (
    <div className="flex justify-start space-x-8 mb-6 p-2">
      {indicators.map(({ id, Icon, activeColor, inactiveColor }) => (
        <div 
          key={id}
          className={`
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-gray-800
            transition-all duration-300
            shadow-lg
          `}
        >
          <Icon 
            className={`w-6 h-6 ${data[id] ? `${activeColor} animate-pulse` : inactiveColor}`}
            strokeWidth={2}
          />
        </div>
      ))}
    </div>
  );
};

export default StatusIndicators;