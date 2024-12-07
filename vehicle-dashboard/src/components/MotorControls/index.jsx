import React, { memo, useCallback } from 'react';
import * as Slider from '@radix-ui/react-slider';

const MotorControls = memo(({ speed = 0, onSpeedChange, disabled = false }) => {
  const speeds = ['OFF', '1', '2', '3', '4'];
  
  const handleSpeedChange = useCallback(([value]) => {
    onSpeedChange(value);
  }, [onSpeedChange]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-white text-sm">MOTOR SPEED SETTING</div>
      <div className="relative pt-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[speed]}
          max={4}
          step={1}
          onValueChange={handleSpeedChange}
          disabled={disabled}
        >
          <Slider.Track className="bg-[#1f2937] relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-6 h-6 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            aria-label="Motor speed"
          />
        </Slider.Root>
        <div className="flex justify-between mt-2">
          {speeds.map((label, index) => (
            <div
              key={label}
              className={`text-sm ${
                speed === index ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

MotorControls.displayName = 'MotorControls';
export default MotorControls;