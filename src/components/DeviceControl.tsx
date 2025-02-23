import { useState } from 'react';
import { gpsService } from '../services/GpsService';

interface DeviceControlProps {
    onDeviceUpdate: () => void;
}

export const DeviceControl = ({ onDeviceUpdate }: DeviceControlProps) => {
    const [deviceId, setDeviceId] = useState('');
    const [error, setError] = useState('');

    const handleStartMonitoring = async () => {
        if (!deviceId.trim()) {
            setError('Please enter a device ID');
            return;
        }

        try {
            await gpsService.startMonitoring(deviceId, () => {
                onDeviceUpdate();
            });
            setError('');
        } catch (err) {
            setError('Failed to start monitoring');
            console.error(err);
        }
    };

    const handleStopMonitoring = async () => {
        if (!deviceId.trim()) {
            setError('Please enter a device ID');
            return;
        }

        try {
            await gpsService.stopMonitoring(deviceId);
            setError('');
            onDeviceUpdate();
        } catch (err) {
            setError('Failed to stop monitoring');
            console.error(err);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Device Control</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Device ID
                    </label>
                    <input
                        type="text"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter device ID"
                    />
                </div>
                
                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-x-4">
                    <button
                        onClick={handleStartMonitoring}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Start Monitoring
                    </button>
                    <button
                        onClick={handleStopMonitoring}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Stop Monitoring
                    </button>
                </div>
            </div>
        </div>
    );
};
