import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { DeviceControl } from './components/DeviceControl';
import { DeviceTable } from './components/DeviceTable';
import { gpsService } from './services/GpsService';
import { GpsData } from './types/GpsData';
import { DeviceStatus } from './types/DeviceStatus';
import './App.css';

function App() {
  const [devices, setDevices] = useState<GpsData[]>([]);
  const [devicesStatus, setDevicesStatus] = useState<Record<string, DeviceStatus>>({});

  const updateDevices = async () => {
    try {
      const [positions, status] = await Promise.all([
        gpsService.getCurrentPositions(),
        gpsService.getDevicesStatus()
      ]);
      setDevices(positions);
      setDevicesStatus(status);
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    updateDevices();

    // Update every 3 seconds
    const interval = setInterval(updateDevices, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Traccar GPS Monitoring</h1>
      </header>

      <div className="flex-1 flex">
        <div className="w-1/4 p-4 bg-gray-100">
          <DeviceControl onDeviceUpdate={updateDevices} />
          <DeviceTable devices={devicesStatus} />
        </div>
        
        <div className="w-3/4">
          <Map devices={devices} />
        </div>
      </div>
    </div>
  );
}

export default App;
