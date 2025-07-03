import React from 'react';
import { Extinguisher } from '../types';

interface Props {
  extinguisher: Extinguisher;
  onClick?: (extinguisher: Extinguisher) => void;
  isSelected?: boolean; // Add isSelected prop
}

const ExtinguisherCard: React.FC<Props> = ({ extinguisher, onClick, isSelected }) => {
  const cardClass = `card mb-4 ${!extinguisher.isOnline ? 'border-secondary' : (extinguisher.isFireDetected ? 'border-danger card-pulse-fire' : '')} ${isSelected ? 'card-selected-border' : ''}`;

  const cardTitleClass = !extinguisher.isOnline ? 'text-secondary' : (extinguisher.isFireDetected ? 'text-danger' : '');

  return (
    <div className={cardClass} style={{ height: '250px', cursor: 'pointer' }} onClick={() => onClick && onClick(extinguisher)}>
      <div className="card-body d-flex flex-column justify-content-between overflow-hidden">
        <h5 className={`card-title ${cardTitleClass}`}>{extinguisher.name}</h5>
        <hr />
        <div className="mb-2">
          <strong className={!extinguisher.isOnline ? 'text-secondary' : ''}>상태:</strong>
          {extinguisher.isOnline ? (
            <span className="badge bg-success ms-2">온라인</span>
          ) : (
            <span className="badge bg-danger ms-2">오프라인</span>
          )}
        </div>
        <div className="mb-2">
          <strong className={!extinguisher.isOnline ? 'text-secondary' : ''}>화재 상태:</strong>
          {extinguisher.isOnline ? (
            extinguisher.isFireDetected ? (
              <span className="badge bg-danger ms-2">화재 감지!</span>
            ) : (
              <span className="badge bg-success ms-2">정상</span>
            )
          ) : (
            <span className="badge bg-secondary ms-2">알 수 없음</span>
          )}
        </div>
        <div className="mb-2">
          <strong className={!extinguisher.isOnline ? 'text-secondary' : ''}>소화기 상태:</strong>
          {extinguisher.isOnline ? (
            extinguisher.extinguisherStatus === 'normal' ? (
              <span className="badge bg-success ms-2">정상</span>
            ) : (
              <span className="badge bg-warning text-dark ms-2">사용됨</span>
            )
          ) : (
            <span className="badge bg-secondary ms-2">알 수 없음</span>
          )}
        </div>
        <div className="mb-2">
          <strong className={!extinguisher.isOnline ? 'text-secondary' : ''}>배터리 잔량:</strong>
          <div className="progress mt-1">
            <div
              className={`progress-bar ${
                extinguisher.isOnline ? (
                  extinguisher.batteryLevel < 25 ? 'bg-danger' :
                  extinguisher.batteryLevel < 50 ? 'bg-warning' :
                  'bg-info'
                ) : 'bg-secondary'
              }`}
              role="progressbar"
              style={{ width: `${extinguisher.batteryLevel}%` }}
              aria-valuenow={extinguisher.batteryLevel}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {`${extinguisher.batteryLevel}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherCard;
