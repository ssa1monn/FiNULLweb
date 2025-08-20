// src/components/ExtinguisherDetailView.tsx

import React, { forwardRef } from 'react';
import { Extinguisher } from '../types';

/**
 * Props 인터페이스
 * 
 * ExtinguisherDetailView 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property extinguisher - 상세 정보를 표시할 소화기 데이터 객체
 * @property onClose - 팝업을 닫을 때 호출될 함수
 * @property position - 팝업이 표시될 화면상의 2D 좌표 {x, y}
 */
interface Props {
  extinguisher: Extinguisher;
  onClose: () => void;
  position: { x: number; y: number };
}

/**
 * ExtinguisherDetailView 컴포넌트
 * 
 * 선택된 소화기의 상세 정보를 보여주는 팝업(또는 툴팁) 형태의 UI 컴포넌트입니다.
 * 특히, 소화기의 다채널 온도 센서 데이터를 시각적인 그리드로 표시하여
 * 화재 발생 시 열 분포를 직관적으로 파악할 수 있게 합니다.
 * 이 컴포넌트는 forwardRef를 사용하여 부모 컴포넌트에서 DOM 요소에 접근할 수 있도록 합니다.
 * (예: 팝업 외부 클릭 감지 로직에 사용)
 */
const ExtinguisherDetailView = forwardRef<HTMLDivElement, Props>(({ extinguisher, onClose, position }, ref) => {
  
  /**
   * 온도 값에 따라 색상을 반환하는 함수입니다.
   * 특정 온도 범위를 기준으로 색상을 보간하여 시각적으로 표현합니다.
   * (예: 낮음 - 파랑, 중간 - 초록/노랑, 높음 - 빨강)
   * @param temp - 온도 값 (섭씨)
   * @returns {string} - CSS rgb 색상 문자열 (e.g., "rgb(0,255,0)")
   */
  const getTemperatureColor = (temp: number): string => {
    const minTemp = 20; // 색상 변화의 기준이 되는 최소 온도
    const maxTemp = 40; // 색상 변화의 기준이 되는 최대 온도

    // 온도를 0과 1 사이의 값으로 정규화합니다.
    const normalizedTemp = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));

    // 정규화된 값을 기반으로 파란색 -> 초록색 -> 노란색 -> 주황색 -> 빨간색 순으로 색상을 보간합니다.
    const r = normalizedTemp < 0.5 ? 0 : Math.floor(255 * (normalizedTemp - 0.5) * 2);
    const g = normalizedTemp < 0.5 ? Math.floor(255 * normalizedTemp * 2) : Math.floor(255 * (1 - (normalizedTemp - 0.5) * 2));
    const b = normalizedTemp > 0.5 ? 0 : Math.floor(255 * (1 - normalizedTemp * 2));

    return `rgb(${r},${g},${b})`;
  };

  return (
    // 팝업 컨테이너. ref를 연결하여 부모에서 DOM 노드에 접근 가능하게 합니다.
    <div 
      ref={ref}
      className="card shadow-lg p-2 bg-white rounded"
      style={{
        position: 'absolute', // 화면의 특정 위치에 고정
        left: position.x,      // 부모로부터 전달받은 x 좌표
        top: position.y,       // 부모로부터 전달받은 y 좌표
        // transform을 사용하여 팝업의 기준점을 조정합니다. (중앙 상단)
        // 이를 통해 소화기 아이콘 바로 위에 팝업이 위치하게 됩니다.
        transform: 'translate(-50%, -100%)', 
        zIndex: 1000,          // 다른 요소들보다 위에 표시되도록 z-index 설정
        width: '180px',        // 팝업 너비
        height: '180px',       // 팝업 높이
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* 팝업 헤더: 소화기 이름과 닫기 버튼 */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="mb-0">{extinguisher.name}</h6>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      
      {/* 온도 센서 데이터 시각화 그리드 */}
      <div style={{
        display: 'grid',
        // 센서 데이터의 열 개수에 맞춰 그리드 템플릿 컬럼 설정
        gridTemplateColumns: `repeat(${extinguisher.temperatureSensorData[0].length}, 1fr)`,
        // 센서 데이터의 행 개수에 맞춰 그리드 템플릿 로우 설정
        gridTemplateRows: `repeat(${extinguisher.temperatureSensorData.length}, 1fr)`,
        gap: '0.5px', // 셀 사이의 간격
        border: '1px solid #ccc', // 그리드 전체 테두리
        width: '100%',
        flexGrow: 1, // 남은 공간을 모두 차지하도록 설정
        overflow: 'hidden'
      }}>
        {/* 2차원 배열인 온도 센서 데이터를 순회하며 각 셀을 렌더링합니다. */}
        {extinguisher.temperatureSensorData.map((row, rowIndex) => (
          row.map((temp, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: getTemperatureColor(temp), // 온도에 따른 배경색 적용
                width: '100%',
                height: '100%',
              }}
              title={`온도: ${temp}°C`} // 마우스를 올렸을 때 정확한 온도 값을 툴팁으로 보여줍니다.
            ></div>
          ))
        ))}
      </div>
    </div>
  );
});

export default ExtinguisherDetailView;
