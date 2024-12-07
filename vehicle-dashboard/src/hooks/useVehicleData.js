import { useState, useEffect } from 'react';

// Update this to use relative path
const API_BASE_URL = 'https://vehicle-dashboard-179965013028.asia-east1.run.app/api/vehicle';

const useVehicleData = () => {
  const [data, setData] = useState({
    indicators: {
      parkingBrake: false,
      checkEngine: false,
      motorWarning: false,
      batteryLow: false
    },
    power: 0,
    rpm: 0,
    gearRatio: 'N/N',
    battery: {
      percentage: 100,
      temperature: 25
    },
    motorSpeed: 0,
    isCharging: false
  });

  const fetchVehicleState = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/state`);
      const vehicleState = await response.json();
      
      // Transform backend data to match frontend structure
      setData({
        indicators: {
          parkingBrake: vehicleState.parking_brake,
          checkEngine: vehicleState.check_engine,
          motorWarning: vehicleState.motor_status,
          batteryLow: vehicleState.battery_low
        },
        power: vehicleState.power,
        rpm: vehicleState.motor_rpm,
        gearRatio: vehicleState.gear_ratio,
        battery: {
          percentage: vehicleState.battery_percentage,
          temperature: vehicleState.battery_temperature
        },
        motorSpeed: vehicleState.motor_speed_setting,
        isCharging: vehicleState.is_charging
      });
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchVehicleState();

    // Set up polling interval
    const interval = setInterval(fetchVehicleState, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateMotorSpeed = async (speed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/motor-speed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ speed }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error updating motor speed:', error);
        return;
      }
      
      await fetchVehicleState();
    } catch (error) {
      console.error('Error updating motor speed:', error);
    }
  };

  const toggleCharging = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/charging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ charging: !data.isCharging }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error toggling charging:', error);
        return;
      }

      await fetchVehicleState();
    } catch (error) {
      console.error('Error toggling charging:', error);
    }
  };

  const resetVehicle = async () => {
    try {
      await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
      });
      await fetchVehicleState();
    } catch (error) {
      console.error('Error resetting vehicle:', error);
    }
  };

  return {
    data,
    updateMotorSpeed,
    toggleCharging,
    resetVehicle,
  };
};

export default useVehicleData;