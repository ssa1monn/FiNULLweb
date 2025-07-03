import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Extinguisher } from '../types';
import 'leaflet/dist/leaflet.css';
import L, { LatLngBoundsExpression } from 'leaflet';

interface Props {
  extinguishers: Extinguisher[];
  center?: [number, number];
  zoom?: number;
  bounds?: LatLngBoundsExpression | null;
  selectedExtinguisherId?: number | null; // 추가
  resetMapBounds?: () => void; // 추가
  onMapReset?: () => void; // 추가
}

const ExtinguisherMap: React.FC<Props> = ({ extinguishers, center: propCenter, zoom: propZoom, bounds, selectedExtinguisherId, resetMapBounds, onMapReset }) => {
  const defaultCenter: [number, number] = [36.0, 127.8]; // 남한 중심 근처
  const defaultZoom = 7;

  const center = propCenter || defaultCenter;
  const zoom = propZoom || defaultZoom;

  const markerRefs = useRef<{ [key: number]: L.Marker }>({});

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (propCenter && propZoom) {
        map.setView(propCenter, propZoom);
      }
    }, [map, bounds, propCenter, propZoom]);

    useEffect(() => {
      map.invalidateSize();
    }, [map]);

    // 선택된 소화기로 이동 및 줌인, 팝업 열기
    useEffect(() => {
      if (selectedExtinguisherId !== null) {
        const selectedExtinguisher = extinguishers.find(e => e.id === selectedExtinguisherId);
        if (selectedExtinguisher) {
          map.setView([selectedExtinguisher.latitude, selectedExtinguisher.longitude], 13); // 줌 레벨 13으로 확대 정도 줄임
          const marker = markerRefs.current[selectedExtinguisher.id];
          if (marker) {
            marker.openPopup();
          }
        }
      }
    }, [map, selectedExtinguisherId, extinguishers]);

    return null;
  };

  // 기본 원형 마커 아이콘 (파란색)
  const defaultDivIcon = L.divIcon({
    className: 'custom-marker default-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  // 화재 감지 원형 마커 아이콘 (빨간색)
  const fireDivIcon = L.divIcon({
    className: 'custom-marker fire-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  // 오프라인 원형 마커 아이콘 (회색)
  const offlineDivIcon = L.divIcon({
    className: 'custom-marker offline-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  // 강조된 마커 아이콘 (테두리만)
  const highlightClass = 'highlight-marker';

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '10px', overflow: 'hidden' }}> {/* This div ensures MapContainer gets height */}
      <MapContainer
        center={center as any}
        zoom={zoom as any}
        scrollWheelZoom={true as any}
        style={{ height: '100%', width: '100%' } as any}
      >
        <MapUpdater />
        <TileLayer
          attribution={'&copy; <a href="https://carto.com/attributions">CARTO</a>' as any}
          url={'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' as any}
        />
        {extinguishers.map((extinguisher) => {
          let baseClassName;
          if (!extinguisher.isOnline) {
            baseClassName = 'custom-marker offline-marker';
          } else if (extinguisher.isFireDetected) {
            baseClassName = 'custom-marker fire-marker';
          }
          else {
            baseClassName = 'custom-marker default-marker';
          }

          const finalClassName = selectedExtinguisherId !== null && extinguisher.id === selectedExtinguisherId
            ? `${baseClassName} ${highlightClass}`
            : baseClassName;

          const finalIcon = L.divIcon({
            className: finalClassName,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });

          return (
            <Marker
              key={extinguisher.id}
              position={[extinguisher.latitude, extinguisher.longitude] as any}
              icon={finalIcon}
              zIndexOffset={selectedExtinguisherId === extinguisher.id ? 2000 : (extinguisher.isFireDetected ? 1000 : !extinguisher.isOnline ? 500 : 0)} // z-index 설정
              ref={(marker) => {
                if (marker) {
                  markerRefs.current[extinguisher.id] = marker;
                }
              }}
            >
              <Popup>
                <strong>{extinguisher.name}</strong><br />
                상태: {extinguisher.isOnline ? '온라인' : '오프라인'}<br />
                화재: {extinguisher.isFireDetected ? '감지됨' : '정상'}<br />
                배터리: {extinguisher.batteryLevel}%<br />
                소화기: {extinguisher.extinguisherStatus === 'normal' ? '정상' : '사용됨'}
              </Popup>
            </Marker>
          );
        })}
        <MapResetButton defaultCenter={propCenter || defaultCenter} defaultZoom={propZoom || defaultZoom} resetMapBounds={resetMapBounds} onMapReset={onMapReset} />
      </MapContainer>
    </div>
  );
};

// 지도 초기화 버튼 컴포넌트
const MapResetButton: React.FC<{ defaultCenter: [number, number], defaultZoom: number, resetMapBounds?: () => void, onMapReset?: () => void }> = ({ defaultCenter, defaultZoom, resetMapBounds, onMapReset }) => {
  const map = useMap();

  const handleReset = () => {
    map.setView(defaultCenter, defaultZoom);
    if (resetMapBounds) {
      resetMapBounds();
    }
    if (onMapReset) {
      onMapReset();
    }
  };

  return (
    <button
      className="btn btn-light"
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 1000,
        boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
        border: '1px solid rgba(0,0,0,0.2)',
      }}
      onClick={handleReset}
    >
      <i className="bi bi-arrow-counterclockwise me-1"></i> 초기화
    </button>
  );
};

export default ExtinguisherMap;
