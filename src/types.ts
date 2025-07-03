export interface Extinguisher {
  id: number;
  name: string;
  isOnline: boolean;
  isFireDetected: boolean;
  batteryLevel: number;
  extinguisherStatus: 'normal' | 'used' | 'unknown';
  latitude: number;
  longitude: number;
  region: string; // Add region property
}

export interface LogEntry {
  id: number;
  timestamp: string;
  extinguisherId: number;
  extinguisherName: string;
  type: 'fire_detected' | 'extinguisher_used' | 'online' | 'offline' | 'battery_low' | 'normal';
  message: string;
}

export interface ExtinguisherSummaryData {
  total: number;
  online: number;
  offline: number;
  fireDetected: number;
  normal: number;
  used: number;
}

export interface RegionalSummary {
  region: string;
  total: number;
  normal: number;
  fireDetected: number;
  offline: number;
}
