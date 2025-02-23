import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { DeviceControl } from './components/DeviceControl';
import { gpsService } from './services/GpsService';
import { GpsData } from './types/GpsData';
import './App.css';

function App() {
  const [devices, setDevices] = useState<GpsData[]>([]);

  const updateDevices = async () => {
    try {
      const positions = await gpsService.getCurrentPositions();
      setDevices(positions);
    } catch (error) {
      console.error('Error fetching device positions:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    updateDevices();

    // Update every 5 seconds
    const interval = setInterval(updateDevices, 5000);

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
        </div>
        
        <div className="w-3/4">
          <Map devices={devices} />
        </div>
      </div>
    </div>
  );
}

export default App;
