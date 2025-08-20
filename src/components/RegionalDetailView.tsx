// src/components/RegionalDetailView.tsx

import React from 'react';
import { Extinguisher, RegionalSummary } from '../types';

/**
 * Props 인터페이스
 * 
 * RegionalDetailView 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property selectedRegionSummary - 선택된 지역의 요약 정보 객체. 선택되지 않은 경우 null.
 * @property selectedRegionExtinguishers - 선택된 지역에 속한 소화기 목록 배열.
 */
interface Props {
  selectedRegionSummary: RegionalSummary | null;
  selectedRegionExtinguishers: Extinguisher[];
}

/**
 * RegionalDetailView 컴포넌트
 * 
 * 사용자가 특정 지역(예: 층)을 선택했을 때, 해당 지역의 상세 정보를 보여주는 UI 컴포넌트입니다.
 * 지역 내 소화기들의 상태 요약(총 개수, 정상, 화재, 오프라인)과
 * 해당 지역에 속한 개별 소화기들의 목록 및 상태를 표시합니다.
 */
const RegionalDetailView: React.FC<Props> = ({ selectedRegionSummary, selectedRegionExtinguishers }) => {
  // 선택된 지역이 없을 경우, 사용자에게 안내 메시지를 표시합니다.
  if (!selectedRegionSummary) {
    return (
      <div className="card h-100">
        <div className="card-body d-flex align-items-center justify-content-center">
          <p className="text-muted">지역을 선택하여 상세 현황을 확인하세요.</p>
        </div>
      </div>
    );
  }

  // 선택된 지역이 있을 경우, 상세 정보를 렌더링합니다.
  return (
    <div className="card h-100 d-flex flex-column">
      {/* 카드 헤더: 선택된 지역의 이름을 표시합니다. */}
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">{selectedRegionSummary.region} 상세 현황</h5>
      </div>
      <div className="card-body d-flex flex-column" style={{ overflow: 'hidden' }}>
        {/* 상단: 지역별 소화기 상태 요약 정보 */}
        <div>
          <p>총 소화기: <strong>{selectedRegionSummary.total}</strong>대</p>
          <p>정상: <strong className="text-success">{selectedRegionSummary.normal}</strong>대</p>
          <p>화재 감지: <strong className="text-danger">{selectedRegionSummary.fireDetected}</strong>대</p>
          <p>오프라인: <strong className="text-secondary">{selectedRegionSummary.offline}</strong>대</p>
          <h6 className="mt-4">소화기 목록:</h6>
        </div>
        {/* 하단: 지역 내 소화기 목록 (스크롤 가능) */}
        <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
          <ul className="list-group list-group-flush">
            {/* 소화기 목록이 비어있지 않으면 목록을 렌더링합니다. */}
            {selectedRegionExtinguishers.length > 0 ? (
              selectedRegionExtinguishers.map((extinguisher) => (
                <li key={extinguisher.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {extinguisher.name}
                  {/* 각 소화기의 상태(화재, 온라인, 오프라인)를 배지로 표시합니다. */}
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
              // 소화기 목록이 비어있을 경우 안내 메시지를 표시합니다.
              <li className="list-group-item text-muted">해당 지역에 소화기가 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegionalDetailView;