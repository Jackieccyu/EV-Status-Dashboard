import React, { useCallback, memo } from 'react';
import StatusIndicators from './components/StatusIndicators';
import PowerGauge from './components/PowerGauge';
import RPMGauge from './components/RPMGauge';
import BatteryInfo from './components/BatteryInfo';
import MotorControls from './components/MotorControls';
import DashboardButtons from './components/DashboardButtons';
import useVehicleData from './hooks/useVehicleData';

const ErrorMessage = memo(({ message }) => (
  <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
    Error: {message}
  </div>
));

const LoadingOverlay = memo(() => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
    <div className="text-white">Loading...</div>
  </div>
));

function App() {
  const { data, error, isLoading, updateMotorSpeed, toggleCharging } = useVehicleData();

  const handleSpeedChange = useCallback(async (speed) => {
    await updateMotorSpeed(speed);
  }, [updateMotorSpeed]);

  const handleChargingToggle = useCallback(async () => {
    await toggleCharging();
  }, [toggleCharging]);

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
      <main className="relative w-full max-w-4xl bg-[#1a2234] rounded-lg shadow-lg p-6">
        {error && <ErrorMessage message={error} />}
        
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">EV Vehicle Status Dashboard</h1>
          </div>
          
          <StatusIndicators data={data.indicators} />
          
          <div className="grid grid-cols-2 gap-6">
            <PowerGauge value={data.power} />
            <RPMGauge value={data.rpm} />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-gray-400 text-sm">Gear Ratio</div>
              <div className="text-white text-xl">{data.gearRatio}</div>
            </div>
            
            <BatteryInfo 
              percentage={data.battery.percentage}
              temperature={data.battery.temperature}
            />
            
            <div className="text-center">
              <div className="text-gray-400 text-sm">RPM</div>
              <div className="text-white text-xl">{data.rpm}</div>
            </div>
            
            <MotorControls 
              speed={data.motorSpeed}
              onSpeedChange={handleSpeedChange}
              disabled={data.isCharging || isLoading}
            />
          </div>
          
          <DashboardButtons 
            isCharging={data.isCharging}
            onChargingToggle={handleChargingToggle}
            disabled={isLoading}
          />
        </div>

        {isLoading && <LoadingOverlay />}
      </main>
    </div>
  );
}

export default App;