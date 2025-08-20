// src/components/ExtinguisherSummary.tsx

import { Extinguisher } from '../types';

/**
 * Props 인터페이스
 * 
 * ExtinguisherSummary 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property extinguishers - 전체 소화기 데이터 배열
 * @property className - 추가적인 CSS 클래스를 적용하기 위한 속성
 */
interface Props {
  extinguishers: Extinguisher[];
  className?: string;
}

/**
 * ExtinguisherSummary 컴포넌트
 * 
 * 전체 소화기 상태에 대한 요약 정보를 제공하는 대시보드 카드입니다.
 * 총 소화기 수, 온라인/오프라인 수, 화재 감지 수, 교체 필요 소화기 및 배터리 수를
 * 계산하여 간결하게 표시합니다.
 */
const ExtinguisherSummary: React.FC<Props> = ({ extinguishers, className }) => {

  /**
   * 소화기의 내용연수 만료일까지 남은 개월 수를 계산합니다.
   * @param serviceLifeEndDate - 내용연수 만료일 (YYYY-MM-DD 형식의 문자열)
   * @returns {number} 남은 개월 수 (내림 처리), 만료되었으면 0을 반환
   */
  const calculateRemainingLifespan = (serviceLifeEndDate: string): number => {
    const today = new Date();
    const [year, month, day] = serviceLifeEndDate.split('-').map(Number);
    const endDate = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1

    const diffTime = endDate.getTime() - today.getTime();
    // 밀리초 단위의 시간 차이를 월 단위로 변환합니다.
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths > 0 ? diffMonths : 0;
  };

  // 전체 소화기 수
  const totalExtinguishers = extinguishers.length;
  // 화재 감지 수 (온라인 상태인 경우만 집계)
  const fireDetectedCount = extinguishers.filter((e) => e.isFireDetected && e.isOnline).length;
  // 온라인 상태인 소화기 수
  const onlineCount = extinguishers.filter((e) => e.isOnline).length;
  // 오프라인 상태인 소화기 수
  const offlineCount = totalExtinguishers - onlineCount;
  // 내용연수 3개월 이하로 교체가 필요한 소화기 수
  const extinguisherNeedsReplacementCount = extinguishers.filter((e) => calculateRemainingLifespan(e.serviceLifeEndDate) <= 3).length;
  // 배터리 잔량 10% 이하로 교체가 필요한 소화기 수
  const batteryNeedsReplacementCount = extinguishers.filter((e) => e.batteryLevel <= 10).length;

  return (
    // 부모로부터 받은 className을 추가하여 유연한 스타일링을 지원합니다.
    <div className={`card mb-2 bg-primary text-white border-primary mx-auto ${className || ''}`} style={{ width: 'calc(100% - 20px)' }}>
      <div className="card-body">
        <h4 className="card-title mb-2 text-white">전체 소화기 현황</h4>
        <div className="row">
          {/* 요약 정보를 2열로 나누어 표시합니다. */}
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
