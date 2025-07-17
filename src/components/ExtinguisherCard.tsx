import { Extinguisher } from '../types';

interface Props {
  extinguisher: Extinguisher;
  onClick?: (extinguisher: Extinguisher) => void;
  isSelected?: boolean; // Add isSelected prop
}

const ExtinguisherCard: React.FC<Props> = ({ extinguisher, onClick, isSelected }) => {
  const cardClass = `card mb-2 ${!extinguisher.isOnline ? 'border-secondary' : (extinguisher.isFireDetected ? 'border-danger card-pulse-fire' : '')} ${isSelected ? 'card-selected-border' : ''}`;

  const calculateRemainingLifespan = (serviceLifeEndDate: string): number => {
    const today = new Date();
    const [year, month, day] = serviceLifeEndDate.split('-').map(Number);
    const endDate = new Date(year, month - 1, day);

    const diffTime = endDate.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // 평균 한 달 일수
    return diffMonths > 0 ? diffMonths : 0;
  };

  const remainingLifespan = calculateRemainingLifespan(extinguisher.serviceLifeEndDate);

  return (
    <div className={cardClass} style={{ height: '150px', cursor: 'pointer' }} onClick={() => onClick && onClick(extinguisher)}>
      <div className="card-body d-flex flex-column justify-content-between overflow-hidden">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className={`card-title mb-0 ${!extinguisher.isOnline ? 'text-secondary' : (extinguisher.isFireDetected ? 'text-danger' : '')}`}>{extinguisher.name}</h6>
          <div className="d-flex align-items-center battery-indicator">
            <div className="battery-outline">
              <div 
                className="battery-fill"
                style={{
                  width: `${extinguisher.batteryLevel}%`,
                  backgroundColor: extinguisher.batteryLevel > 50 ? '#28a745' : extinguisher.batteryLevel > 20 ? '#ffc107' : '#dc3545'
                }}
              ></div>
            </div>
            <small className="ms-1">{extinguisher.batteryLevel}%</small>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {/* 화재 상태 태그 */}
          {extinguisher.isFireDetected && extinguisher.isOnline && (
            <span className="badge bg-danger">화재 감지</span>
          )}

          {/* 상태 태그 */}
          {extinguisher.isOnline ? (
            <span className="badge bg-success">온라인</span>
          ) : (
            <span className="badge bg-secondary">오프라인</span>
          )}

          {/* 소화기 상태 태그 */}
          {remainingLifespan <= 3 ? (
            <span className="badge bg-warning text-dark">소화기 교체 필요</span>
          ) : extinguisher.extinguisherStatus === 'normal' ? (
            <span className="badge bg-success">소화기 정상</span>
          ) : null}

          {/* 배터리 상태 태그 */}
          {extinguisher.batteryLevel <= 10 && (
            <span className="badge bg-warning text-dark">배터리 교체 필요</span>
          )}
        </div>

        <div>
          <small className="text-muted">소화기 연한: {extinguisher.serviceLifeEndDate} ({remainingLifespan})</small>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherCard;