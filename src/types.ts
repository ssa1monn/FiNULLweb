export interface Extinguisher {
  id: number;
  name: string;
  isOnline: boolean;
  isFireDetected: boolean;
  batteryLevel: number;
  extinguisherStatus: 'normal' | 'used' | 'unknown';
  serviceLifeEndDate: string; // 사용기한 만료일 (YYYY-MM-DD 형식)
  temperatureSensorData: number[][]; // 32x24 온도 센서 데이터
  floor: number; // 층 정보
  position: { x: number; y: number; z: number }; // 3D 좌표
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

export interface FloorConfig {
  vertices: number[]; // [x1, y1, z1, x2, y2, z2, ...]
  faces: number[]; // [a1, b1, c1, a2, b2, c2, ...]
}

export interface BuildingData {
  floorHeight: number; // 층간 높이
  floorDimensions: { width: number; depth: number }; // 각 층의 가로, 세로 크기
  totalFloors: number; // 총 층수
  floorConfigs: { [key: number]: FloorConfig }; // 층별 기하학적 모양 설정
}

