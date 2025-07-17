import { Extinguisher } from './types';

// 임의의 32x24 온도 센서 데이터 생성 함수
const generateRandomTemperatureData = (): number[][] => {
  return Array(32).fill(0).map(() => Array(24).fill(0).map(() => Math.floor(Math.random() * 10) + 20)); // 20-30도 사이 랜덤
};

export const mockExtinguishers: Extinguisher[] = [
  // 1층
  {
    id: 1,
    name: '7호관 1층 복도',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 95,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2033-01-15',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 1,
    position: { x: -10, y: 0, z: 0 },
  },
  {
    id: 2,
    name: '7호관 1층 로비',
    isOnline: true,
    isFireDetected: true, // 화재 감지
    batteryLevel: 80,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2032-03-20',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 1,
    position: { x: 0, y: 0, z: 7.5 },
  },
  {
    id: 3,
    name: '7호관 1층 계단',
    isOnline: false, // 오프라인
    isFireDetected: false,
    batteryLevel: 0,
    extinguisherStatus: 'unknown',
    serviceLifeEndDate: '2025-08-10', // 3개월 이내 만료
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 1,
    position: { x: 10, y: 0, z: 7.5 },
  },
  {
    id: 4,
    name: '7호관 1층 라운지',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 8, // 배터리 교체 필요
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2031-11-01',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 1,
    position: { x: 10, y: 0, z: -7.5 },
  },

  // 2층
  {
    id: 5,
    name: '7호관 2층 복도',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 90,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2035-05-01',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 2,
    position: { x: -10, y: 5, z: 0 },
  },
  {
    id: 6,
    name: '7호관 2층 실습실 A',
    isOnline: true,
    isFireDetected: true, // 화재 감지
    batteryLevel: 15, // 배터리 교체 필요
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2025-09-01', // 3개월 이내 만료
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 2,
    position: { x: 0, y: 5, z: 7.5 },
  },
  {
    id: 7,
    name: '7호관 2층 실습실 B',
    isOnline: false, // 오프라인
    isFireDetected: false,
    batteryLevel: 0,
    extinguisherStatus: 'unknown',
    serviceLifeEndDate: '2026-01-01',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 2,
    position: { x: 10, y: 5, z: 7.5 },
  },
  {
    id: 8,
    name: '7호관 2층 계단',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 95,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2025-07-20', // 3개월 이내 만료
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 2,
    position: { x: 10, y: 5, z: -7.5 },
  },

  // 3층
  {
    id: 9,
    name: '7호관 3층 복도',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 88,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2033-02-28',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 3,
    position: { x: -10, y: 10, z: 0 },
  },
  {
    id: 10,
    name: '7호관 3층 교수실 A',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 92,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2032-06-18',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 3,
    position: { x: 0, y: 10, z: 7.5 },
  },
  {
    id: 11,
    name: '7호관 3층 교수실 B',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 75,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2034-03-01',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 3,
    position: { x: 10, y: 10, z: 7.5 },
  },
  {
    id: 12,
    name: '7호관 3층 계단',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 98,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2031-08-25',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 3,
    position: { x: 10, y: 10, z: -7.5 },
  },

  // 4층
  {
    id: 13,
    name: '7호관 4층 복도',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 85,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2033-04-03',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 4,
    position: { x: -10, y: 15, z: 0 },
  },
  {
    id: 14,
    name: '7호관 4층 강의실 A',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 80,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2032-10-11',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 4,
    position: { x: 0, y: 15, z: 7.5 },
  },
  {
    id: 15,
    name: '7호관 4층 강의실 B',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 60,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2034-02-14',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 4,
    position: { x: 10, y: 15, z: 7.5 },
  },
  {
    id: 16,
    name: '7호관 4층 계단',
    isOnline: true,
    isFireDetected: false,
    batteryLevel: 93,
    extinguisherStatus: 'normal',
    serviceLifeEndDate: '2031-06-07',
    temperatureSensorData: generateRandomTemperatureData(),
    floor: 4,
    position: { x: 10, y: 15, z: -7.5 },
  },
];