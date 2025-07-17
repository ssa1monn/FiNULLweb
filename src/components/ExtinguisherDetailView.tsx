import React from 'react';
import { Extinguisher } from '../types';

interface Props {
  extinguisher: Extinguisher;
  onClose: () => void;
  position: { x: number; y: number }; // 팝업 위치를 위한 prop 추가
}

const ExtinguisherDetailView: React.FC<Props> = ({ extinguisher, onClose, position }) => {
  // 온도 값을 색상으로 매핑하는 함수 (예시: 20도 -> 파랑, 40도 -> 빨강)
  const getTemperatureColor = (temp: number): string => {
    const minTemp = 20; // 최소 온도
    const maxTemp = 40; // 최대 온도

    // 0-1 사이의 값으로 정규화
    const normalizedTemp = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));

    // 색상 보간 (파랑 -> 초록 -> 노랑 -> 주황 -> 빨강)
    const r = normalizedTemp < 0.5 ? 0 : Math.floor(255 * (normalizedTemp - 0.5) * 2);
    const g = normalizedTemp < 0.5 ? Math.floor(255 * normalizedTemp * 2) : Math.floor(255 * (1 - (normalizedTemp - 0.5) * 2));
    const b = normalizedTemp > 0.5 ? 0 : Math.floor(255 * (1 - normalizedTemp * 2));

    return `rgb(${r},${g},${b})`;
  };

  return (
    <div 
      className="card shadow-lg p-2 bg-white rounded"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)', // 소화기 위에 표시되도록 조정
        zIndex: 1000,
        width: '180px', // 더 작게
        height: '180px', // 정사각형
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="mb-0">{extinguisher.name}</h6>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${extinguisher.temperatureSensorData[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${extinguisher.temperatureSensorData.length}, 1fr)`,
        gap: '0.5px',
        border: '1px solid #ccc',
        width: '100%',
        flexGrow: 1,
        overflow: 'hidden'
      }}>
        {extinguisher.temperatureSensorData.map((row, rowIndex) => (
          row.map((temp, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: getTemperatureColor(temp),
                width: '100%',
                height: '100%',
              }}
              title={`온도: ${temp}°C`}
            ></div>
          ))
        ))}
      </div>
    </div>
  );
};

export default ExtinguisherDetailView;