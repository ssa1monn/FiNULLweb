import React from 'react';
import { Extinguisher } from '../types';

interface Props {
  extinguishers: Extinguisher[];
}

const ExtinguisherSummary: React.FC<Props> = ({ extinguishers }) => {
  const totalExtinguishers = extinguishers.length;
  const onlineCount = extinguishers.filter((e) => e.isOnline).length;
  const offlineCount = totalExtinguishers - onlineCount;
  const fireDetectedCount = extinguishers.filter((e) => e.isFireDetected).length;
  const normalCount = extinguishers.filter((e) => e.extinguisherStatus === 'normal').length;
  const usedCount = extinguishers.filter((e) => e.extinguisherStatus === 'used').length;

  return (
    <div className="card mb-2 bg-primary text-white border-primary mx-auto" style={{ width: 'calc(100% - 20px)' }}>
      <div className="card-body">
        <h4 className="card-title mb-2 text-white">전체 소화기 현황</h4>
        <div className="row">
          <div className="col-6">
            <p className="mb-1">총 소화기: <strong>{totalExtinguishers}</strong>대</p>
            <p className="mb-1">온라인: <strong>{onlineCount}</strong>대</p>
            <p className="mb-1">오프라인: <strong>{offlineCount}</strong>대</p>
          </div>
          <div className="col-6">
            <p className="mb-1">화재 감지: <strong>{fireDetectedCount}</strong>대</p>
            <p className="mb-1">소화기 정상: <strong>{normalCount}</strong>대</p>
            <p className="mb-1">소화기 사용됨: <strong>{usedCount}</strong>대</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtinguisherSummary;
