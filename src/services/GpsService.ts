import axios from 'axios';
import { GpsData } from '../types/GpsData';
import { DeviceStatus } from '../types/DeviceStatus';

const API_URL = 'http://localhost:8080/api';

class GpsService {
    async getCurrentPositions(): Promise<GpsData[]> {
        const response = await axios.get(`${API_URL}/devices/positions`);
        return response.data;
    }

    async getDevicesStatus(): Promise<Record<string, DeviceStatus>> {
        const response = await axios.get(`${API_URL}/devices/status`);
        return response.data;
    }
}

export const gpsService = new GpsService();
