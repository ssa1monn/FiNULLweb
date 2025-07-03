import React, { useState } from 'react';
import { Extinguisher, RegionalSummary } from '../types';
import ExtinguisherMap from './ExtinguisherMap';
import RegionalDetailView from './RegionalDetailView';
import L from 'leaflet';

interface Props {
  extinguishers: Extinguisher[];
}

const RegionalStatusView: React.FC<Props> = ({ extinguishers }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);

  const resetMapBounds = () => {
    setMapBounds(null);
  };

  const regionalData: { [key: string]: Extinguisher[] } = {};

  extinguishers.forEach((extinguisher) => {
    if (!regionalData[extinguisher.region]) {
      regionalData[extinguisher.region] = [];
    }
    regionalData[extinguisher.region].push(extinguisher);
  });

  const regionOrder = ['서울', '경기', '강원', '충북', '충남', '대전', '경북', '전북', '대구', '경남', '광주', '전남', '부산', '제주', '기타'];

  const regionalSummaries: RegionalSummary[] = Object.keys(regionalData).sort((a, b) => {
    const indexA = regionOrder.indexOf(a);
    const indexB = regionOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }).map((region) => {
    const regionExtinguishers = regionalData[region];
    const normalCount = regionExtinguishers.filter(e => e.extinguisherStatus === 'normal' && !e.isFireDetected && e.isOnline).length;
    const fireDetectedCount = regionExtinguishers.filter(e => e.isFireDetected).length;
    const offlineCount = regionExtinguishers.filter(e => !e.isOnline).length;

    return {
      region,
      total: regionExtinguishers.length,
      normal: normalCount,
      fireDetected: fireDetectedCount,
      offline: offlineCount,
    };
  });

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    const regionExtinguishers = regionalData[region];
    if (regionExtinguishers && regionExtinguishers.length > 0) {
      const latLngs = regionExtinguishers.map(e => [e.latitude, e.longitude] as L.LatLngTuple);
      const bounds = L.latLngBounds(latLngs);
      setMapBounds(bounds.isValid() ? bounds : null);
    } else {
      setMapBounds(null);
    }
  };

  const selectedRegionSummary = regionalSummaries.find(summary => summary.region === selectedRegion) || null;
  const selectedRegionExtinguishers = selectedRegion ? regionalData[selectedRegion] : [];

  const handleMapReset = () => {
    setSelectedRegion(null);
    resetMapBounds();
  };

  return (
    <div className="mt-4">
      <h2><i className="bi bi-geo-alt me-2"></i>지역별 현황</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 map-card" style={{ height: '500px' }}>
            <div className="card-body p-0">
              <ExtinguisherMap
                extinguishers={selectedRegion ? selectedRegionExtinguishers : extinguishers}
                center={[36.0, 127.8]}
                zoom={6}
                bounds={mapBounds}
                resetMapBounds={resetMapBounds}
                onMapReset={handleMapReset}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6" style={{ height: '500px' }}>
          <RegionalDetailView
            selectedRegionSummary={selectedRegionSummary}
            selectedRegionExtinguishers={selectedRegionExtinguishers}
          />
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-5 g-3 mt-2">
        {regionalSummaries.map((summary) => (
          <div key={summary.region} className="col" onClick={() => handleRegionClick(summary.region)} style={{ cursor: 'pointer' }}>
            <div className={`card h-100 ${selectedRegion === summary.region ? 'border-primary shadow' : ''}`}>
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{summary.region} ({summary.total}대)</h5>
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="row text-center">
                  <div className="col-4">
                    <p className="mb-0 text-success">정상</p>
                    <h4 className="text-success">{summary.normal}</h4>
                  </div>
                  <div className="col-4">
                    <p className="mb-0 text-danger">화재</p>
                    <h4 className="text-danger">{summary.fireDetected}</h4>
                  </div>
                  <div className="col-4">
                    <p className="mb-0 text-secondary">OFF</p>
                    <h4 className="text-secondary">{summary.offline}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalStatusView;
