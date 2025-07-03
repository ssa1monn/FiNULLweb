import { LogEntry } from './types';
import { mockExtinguishers } from './mockData';

const generateMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  let logId = 1;
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const getRandomTimestamp = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const logTypes: LogEntry['type'][] = ['fire_detected', 'extinguisher_used', 'battery_low', 'offline', 'online', 'normal'];

  for (let i = 0; i < 500; i++) { // 500개의 로그 생성
    const randomExtinguisher = mockExtinguishers[Math.floor(Math.random() * mockExtinguishers.length)];
    const randomLogType = logTypes[Math.floor(Math.random() * logTypes.length)];
    const timestamp = getRandomTimestamp(sixMonthsAgo, now);

    let message = '';
    switch (randomLogType) {
      case 'fire_detected':
        message = `${randomExtinguisher.name}에서 화재가 감지되었습니다.`;
        break;
      case 'extinguisher_used':
        message = `${randomExtinguisher.name}의 소화기가 분사되었습니다.`;
        break;
      case 'battery_low':
        const batteryLevel = Math.floor(Math.random() * 20) + 5; // 5-24%
        message = `${randomExtinguisher.name}의 배터리 잔량이 낮습니다 (${batteryLevel}%).`;
        break;
      case 'offline':
        message = `${randomExtinguisher.name}이(가) 오프라인 상태입니다.`;
        break;
      case 'online':
        message = `${randomExtinguisher.name}이(가) 다시 온라인 상태가 되었습니다.`;
        break;
      case 'normal':
        message = `${randomExtinguisher.name}의 상태가 정상으로 확인되었습니다.`;
        break;
    }

    logs.push({
      id: logId++,
      timestamp,
      extinguisherId: randomExtinguisher.id,
      extinguisherName: randomExtinguisher.name,
      type: randomLogType,
      message,
    });
  }

  // 시간순으로 정렬 (최신순)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockLogs: LogEntry[] = generateMockLogs();