import { Extinguisher } from '../types';

interface Props {
  extinguishers: Extinguisher[];
  className?: string; // className prop 추가
}

const ExtinguisherSummary: React.FC<Props> = ({ extinguishers, className }) => {
  // 소화기 남은 연한 계산 함수 (ExtinguisherCard와 동일하게 재정의)
  const calculateRemainingLifespan = (serviceLifeEndDate: string): number => {
    const today = new Date();
    const [year, month, day] = serviceLifeEndDate.split('-').map(Number);
    const endDate = new Date(year, month - 1, day);

    const diffTime = endDate.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // 평균 한 달 일수
    return diffMonths > 0 ? diffMonths : 0;
  };

  const totalExtinguishers = extinguishers.length;
  const fireDetectedCount = extinguishers.filter((e) => e.isFireDetected && e.isOnline).length; // 온라인 상태에서 화재 감지
  const onlineCount = extinguishers.filter((e) => e.isOnline).length;
  const offlineCount = totalExtinguishers - onlineCount;
  const extinguisherNeedsReplacementCount = extinguishers.filter((e) => calculateRemainingLifespan(e.serviceLifeEndDate) <= 3).length; // 남은 연한 3개월 이하
  const batteryNeedsReplacementCount = extinguishers.filter((e) => e.batteryLevel <= 10).length; // isOnline 조건 제거

  return (
    <div className={`card mb-2 bg-primary text-white border-primary mx-auto ${className || ''}`} style={{ width: 'calc(100% - 20px)' }}>
      <div className="card-body">
        <h4 className="card-title mb-2 text-white">전체 소화기 현황</h4>
        <div className="row">
          <div className="col-6">
            <p className="mb-1">총 소화기: <strong>{totalExtinguishers}</strong>대</p>
            <p className="mb-1">온라인: <strong>{onlineCount}</strong>대</p>
            <p className="mb-1">소화기 교체 필요: <strong>{extinguisherNeedsReplacementCount}</strong>대</p>
          </div>
          <div className="col-6">
            <p className="mb-1">화재 감지: <strong>{fireDetectedCount}</strong>대</p>
            <p className="mb-1">오프라인: <strong>{offlineCount}</strong>대</p>
            <p className="mb-1">배터리 교체 필요: <strong>{batteryNeedsReplacementCount}</strong>대</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherSummary;