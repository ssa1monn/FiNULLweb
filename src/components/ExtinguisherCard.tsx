// src/components/ExtinguisherCard.tsx

import { Extinguisher } from '../types';

/**
 * Props 인터페이스
 * 
 * ExtinguisherCard 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property extinguisher - 표시할 소화기 데이터 객체
 * @property onClick - 카드가 클릭되었을 때 호출될 함수
 * @property isSelected - 카드의 선택 여부
 */
interface Props {
  extinguisher: Extinguisher;
  onClick?: (extinguisher: Extinguisher) => void;
  isSelected?: boolean;
}

/**
 * ExtinguisherCard 컴포넌트
 * 
 * 개별 소화기의 요약 정보를 보여주는 카드 형태의 UI 컴포넌트입니다.
 * 소화기의 이름, 온라인/오프라인 상태, 화재 감지 여부, 배터리 잔량, 내용연수 등
 * 주요 상태를 시각적으로 표시합니다.
 * 카드가 선택되거나 특정 상태(화재, 오프라인)일 때 시각적 피드백(테두리 색, 애니메이션)을 제공합니다.
 */
const ExtinguisherCard: React.FC<Props> = ({ extinguisher, onClick, isSelected }) => {
  
  // 카드의 동적 CSS 클래스를 결정합니다.
  // 오프라인, 화재 감지, 선택 상태에 따라 다른 클래스를 적용합니다.
  const cardClass = `card mb-2 ${!extinguisher.isOnline ? 'border-secondary' : (extinguisher.isFireDetected ? 'border-danger card-pulse-fire' : '')} ${isSelected ? 'card-selected-border' : ''}`;

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
    // 밀리초 단위의 시간 차이를 월 단위로 변환합니다. (1000 * 60 * 60 * 24 * 30.44)
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); 
    return diffMonths > 0 ? diffMonths : 0;
  };

  // 계산된 남은 내용연수(개월).
  const remainingLifespan = calculateRemainingLifespan(extinguisher.serviceLifeEndDate);

  return (
    // 계산된 클래스와 스타일을 적용하고, 클릭 이벤트를 연결합니다.
    <div className={cardClass} style={{ height: '150px', cursor: 'pointer' }} onClick={() => onClick && onClick(extinguisher)}>
      <div className="card-body d-flex flex-column justify-content-between overflow-hidden">
        {/* 상단: 소화기 이름 및 배터리 상태 */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className={`card-title mb-0 ${!extinguisher.isOnline ? 'text-secondary' : (extinguisher.isFireDetected ? 'text-danger' : '')}`}>{extinguisher.name}</h6>
          {/* 배터리 아이콘 및 잔량 표시 */}
          <div className="d-flex align-items-center battery-indicator">
            <div className="battery-outline">
              <div 
                className="battery-fill"
                style={{
                  width: `${extinguisher.batteryLevel}%`, // 배터리 잔량에 따라 너비 조절
                  // 배터리 잔량에 따라 색상 변경 (50% 초과: 녹색, 20% 초과: 노란색, 그 외: 빨간색)
                  backgroundColor: extinguisher.batteryLevel > 50 ? '#28a745' : extinguisher.batteryLevel > 20 ? '#ffc107' : '#dc3545'
                }}
              ></div>
            </div>
            <small className="ms-1">{extinguisher.batteryLevel}%</small>
          </div>
        </div>
        
        {/* 중단: 상태 태그(배지) 목록 */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          {/* 화재 감지 태그: 온라인 상태에서만 표시 */}
          {extinguisher.isFireDetected && extinguisher.isOnline && (
            <span className="badge bg-danger">화재 감지</span>
          )}

          {/* 온라인/오프라인 상태 태그 */}
          {extinguisher.isOnline ? (
            <span className="badge bg-success">온라인</span>
          ) : (
            <span className="badge bg-secondary">오프라인</span>
          )}

          {/* 소화기 교체 필요 또는 정상 상태 태그 */}
          {remainingLifespan <= 3 ? (
            <span className="badge bg-warning text-dark">소화기 교체 필요</span>
          ) : extinguisher.extinguisherStatus === 'normal' ? (
            <span className="badge bg-success">소화기 정상</span>
          ) : null}

          {/* 배터리 교체 필요 태그: 10% 이하일 때 표시 */}
          {extinguisher.batteryLevel <= 10 && (
            <span className="badge bg-warning text-dark">배터리 교체 필요</span>
          )}
        </div>

        {/* 하단: 내용연수 정보 */}
        <div>
          <small className="text-muted">소화기 연한: {extinguisher.serviceLifeEndDate} ({remainingLifespan}개월 남음)</small>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherCard;
