import axios from 'axios';
import { Client } from '@stomp/stompjs';
import { GpsData } from '../types/GpsData';

const API_URL = 'http://localhost:8080/api';
const WS_URL = 'ws://localhost:8080/ws';

class GpsService {
    private stompClient: Client | null = null;
    private subscribers: Map<string, (data: GpsData) => void> = new Map();

    constructor() {
        this.initializeWebSocket();
    }

    private initializeWebSocket() {
        this.stompClient = new Client({
            brokerURL: WS_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('STOMP:', str);
            },
        });

        this.stompClient.onConnect = () => {
            console.log('Connected to WebSocket');
            this.subscribers.forEach((callback, deviceId) => {
                this.subscribeToDevice(deviceId, callback);
            });
        };

        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        this.stompClient.activate();
    }

    private subscribeToDevice(deviceId: string, callback: (data: GpsData) => void) {
        if (!this.stompClient?.connected) return;

        console.log(`Subscribing to device ${deviceId}`);
        this.stompClient.subscribe(`/topic/gps/${deviceId}`, (message) => {
            console.log(`Received position update for device ${deviceId}:`, message.body);
            const data: GpsData = JSON.parse(message.body);
            callback(data);
        });
    }

    async startMonitoring(deviceId: string, callback: (data: GpsData) => void) {
        try {
            await axios.post(`${API_URL}/devices/${deviceId}/start`);
            this.subscribers.set(deviceId, callback);
            if (this.stompClient?.connected) {
                this.subscribeToDevice(deviceId, callback);
            }
        } catch (error) {
            console.error('Error starting monitoring:', error);
            throw error;
        }
    }

    async stopMonitoring(deviceId: string) {
        try {
            await axios.post(`${API_URL}/devices/${deviceId}/stop`);
            this.subscribers.delete(deviceId);
        } catch (error) {
            console.error('Error stopping monitoring:', error);
            throw error;
        }
    }

    async getDevicesStatus() {
        try {
            const response = await axios.get(`${API_URL}/devices/status`);
            return response.data;
        } catch (error) {
            console.error('Error getting devices status:', error);
            throw error;
        }
    }

    async getCurrentPositions() {
        try {
            const response = await axios.get(`${API_URL}/devices/positions`);
            return response.data as GpsData[];
        } catch (error) {
            console.error('Error getting current positions:', error);
            throw error;
        }
    }
}

export const gpsService = new GpsService();
