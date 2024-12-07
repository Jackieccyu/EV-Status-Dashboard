import React, { memo } from 'react';
import { Battery, Thermometer } from 'lucide-react';

const BatteryInfo = memo(({ percentage = 0, temperature = 0 }) => {
  // Round numbers to 1 decimal place
  const formattedPercentage = Number(percentage).toFixed(1);
  const formattedTemperature = Number(temperature).toFixed(1);

  // Calculate battery color based on percentage
  const getBatteryColor = () => {
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  // Calculate temperature color based on value
  const getTemperatureColor = () => {
    if (temperature >= 50) return 'text-red-500';
    if (temperature >= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <Battery className={`h-6 w-6 ${getBatteryColor()}`} />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Battery Level</span>
          <span className={`text-lg font-bold ${getBatteryColor()}`}>
            {formattedPercentage}%
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Thermometer className={`h-6 w-6 ${getTemperatureColor()}`} />
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Temperature</span>
          <span className={`text-lg font-bold ${getTemperatureColor()}`}>
            {formattedTemperature}°C
          </span>
        </div>
      </div>
    </div>
  );
});

BatteryInfo.displayName = 'BatteryInfo';
export default BatteryInfo;