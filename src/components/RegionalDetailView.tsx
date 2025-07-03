import React from 'react';
import { Extinguisher, RegionalSummary } from '../types';

interface Props {
  selectedRegionSummary: RegionalSummary | null;
  selectedRegionExtinguishers: Extinguisher[];
}

const RegionalDetailView: React.FC<Props> = ({ selectedRegionSummary, selectedRegionExtinguishers }) => {
  if (!selectedRegionSummary) {
    return (
      <div className="card h-100">
        <div className="card-body d-flex align-items-center justify-content-center">
          <p className="text-muted">지역을 선택하여 상세 현황을 확인하세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">{selectedRegionSummary.region} 상세 현황</h5>
      </div>
      <div className="card-body d-flex flex-column" style={{ overflow: 'hidden' }}>
        <div>
          <p>총 소화기: <strong>{selectedRegionSummary.total}</strong>대</p>
          <p>정상: <strong className="text-success">{selectedRegionSummary.normal}</strong>대</p>
          <p>화재 감지: <strong className="text-danger">{selectedRegionSummary.fireDetected}</strong>대</p>
          <p>오프라인: <strong className="text-secondary">{selectedRegionSummary.offline}</strong>대</p>
          <h6 className="mt-4">소화기 목록:</h6>
        </div>
        <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
          <ul className="list-group list-group-flush">
            {selectedRegionExtinguishers.length > 0 ? (
              selectedRegionExtinguishers.map((extinguisher) => (
                <li key={extinguisher.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {extinguisher.name}
                  {extinguisher.isFireDetected ? (
                    <span className="badge bg-danger">화재 감지</span>
                  ) : extinguisher.isOnline ? (
                    <span className="badge bg-success">온라인</span>
                  ) : (
                    <span className="badge bg-secondary">오프라인</span>
                  )}
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">해당 지역에 소화기가 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegionalDetailView;
