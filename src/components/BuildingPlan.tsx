'''// src/components/BuildingPlan.tsx

import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Extinguisher } from '../types';
import { BuildingConfig } from '../BuildingConfig';
import * as THREE from 'three';
import ExtinguisherDetailView from './ExtinguisherDetailView';

/**
 * Extinguisher3D 컴포넌트
 * 
 * 개별 소화기를 3D 공간에 렌더링합니다.
 * 소화기의 상태(정상, 화재, 오프라인, 배터리 부족)에 따라 색상이 변경됩니다.
 * 선택되었을 때 반짝이는 효과가 나타납니다.
 * 클릭 시, 해당 소화기의 정보와 2D 화면 좌표를 부모 컴포넌트로 전달합니다.
 * 
 * @param extinguisher - 렌더링할 소화기 객체
 * @param isSelected - 현재 이 소화기가 선택되었는지 여부
 * @param onClick - 소화기 클릭 시 호출될 콜백 함수
 */
const Extinguisher3D: React.FC<{ extinguisher: Extinguisher; isSelected: boolean; onClick: (extinguisher: Extinguisher, screenPosition: { x: number; y: number }) => void; }> = ({ extinguisher, isSelected, onClick }) => {
  // 3D 메쉬에 대한 참조를 생성합니다.
  const meshRef = useRef<THREE.Mesh>(null!);
  // react-three-fiber의 훅을 사용하여 카메라와 캔버스 크기 정보를 가져옵니다.
  const { camera, size } = useThree();

  /**
   * 소화기의 상태에 따라 적절한 색상을 반환하는 함수입니다.
   * @returns {string} 16진수 색상 코드
   */
  const getStatusColor = () => {
    if (extinguisher.isFireDetected && extinguisher.isOnline) return '#FF6B6B'; // 화재 감지 시 밝은 빨간색
    if (!extinguisher.isOnline) return '#A0A0A0'; // 오프라인 시 밝은 회색
    if (extinguisher.batteryLevel < 30) return '#FFA07A'; // 배터리 부족 시 밝은 주황색
    return '#66BB6A'; // 정상 상태일 때 밝은 녹색
  };

  // useFrame 훅: 매 프레임마다 실행되는 코드를 정의합니다.
  // 선택된 소화기에 반짝이는 효과를 적용합니다.
  useFrame(({ clock }) => {
    if (isSelected) {
      // 시간의 흐름에 따라 0과 1 사이를 반복하는 값을 계산합니다.
      const intensity = (Math.sin(clock.getElapsedTime() * 4) + 1) / 2; 
      // emissive 속성을 사용하여 재질이 스스로 빛을 내도록 설정합니다.
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive.set(getStatusColor());
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    } else {
      // 선택되지 않았을 때는 빛나는 효과를 제거합니다.
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive.set('black');
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
  });

  /**
   * 소화기 메쉬 클릭 시 호출되는 핸들러입니다.
   * 3D 객체의 월드 좌표를 2D 화면 좌표로 변환하여 onClick 콜백을 호출합니다.
   */
  const handleClick = () => {
    if (meshRef.current) {
      const vector = new THREE.Vector3();
      // 메쉬의 월드 좌표를 가져옵니다.
      meshRef.current.getWorldPosition(vector);
      // 월드 좌표를 카메라 시점의 2D 좌표로 변환합니다.
      vector.project(camera);

      // 2D 좌표를 실제 픽셀 값으로 변환합니다.
      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (-vector.y * 0.5 + 0.5) * size.height;

      // 부모 컴포넌트로 소화기 정보와 계산된 화면 좌표를 전달합니다.
      onClick(extinguisher, { x, y });
    }
  };

  return (
    <mesh
      ref={meshRef}
      // 소화기 위치를 설정합니다. y축으로 살짝 띄워 바닥에 겹치지 않게 합니다.
      position={[extinguisher.position.x, extinguisher.position.y + 1, extinguisher.position.z]}
      onClick={handleClick}
    >
      {/* 소화기를 나타내는 간단한 박스 형태의 지오메트리 */}
      <boxGeometry args={[1, 2, 1]} />
      {/* 소화기 상태에 따른 색상을 가진 표준 재질 */}
      <meshStandardMaterial color={getStatusColor()} />
      {/* 소화기 이름을 표시하는 텍스트 */}
      <Text
        position={[0, 1.5, 0]} // 박스 위에 위치
        fontSize={1}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05} // 텍스트 가독성을 위한 외곽선
        outlineColor="white"
      >
        {extinguisher.name}
      </Text>
    </mesh>
  );
};

/**
 * ExtinguisherScreenPositionCalculator 컴포넌트
 * 
 * 이 컴포넌트는 UI를 렌더링하지 않는 헬퍼 컴포넌트입니다.
 * 외부(예: 소화기 목록 카드)에서 특정 소화기가 선택되었을 때,
 * 해당 소화기의 3D 위치를 2D 화면 좌표로 계산하여 부모 컴포넌트에 전달하는 역할을 합니다.
 * 이를 통해 3D 모델을 직접 클릭하지 않아도 상세 정보 팝업을 정확한 위치에 표시할 수 있습니다.
 */
const ExtinguisherScreenPositionCalculator: React.FC<{ 
  extinguishers: Extinguisher[]; 
  selectedExtinguisherId: number | null; 
  onPositionCalculated: (extinguisher: Extinguisher, position: { x: number; y: number }) => void; 
}> = ({ extinguishers, selectedExtinguisherId, onPositionCalculated }) => {
  const { camera, size } = useThree();

  // selectedExtinguisherId가 변경될 때마다 실행됩니다.
  useEffect(() => {
    if (selectedExtinguisherId !== null) {
      const extinguisher = extinguishers.find(e => e.id === selectedExtinguisherId);
      if (extinguisher) {
        // 3D 위치를 2D 화면 좌표로 변환합니다.
        const vector = new THREE.Vector3(extinguisher.position.x, extinguisher.position.y + 1, extinguisher.position.z);
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * size.width;
        const y = (-vector.y * 0.5 + 0.5) * size.height;

        // 계산된 위치를 부모 컴포넌트로 전달합니다.
        onPositionCalculated(extinguisher, { x, y });
      }
    }
  }, [selectedExtinguisherId, extinguishers, camera, size, onPositionCalculated]);

  return null; // 이 컴포넌트는 시각적인 결과물을 렌더링하지 않습니다.
};


/**
 * BuildingPlan 컴포넌트
 * 
 * 건물의 3D 평면도를 표시하는 메인 컴포넌트입니다.
 * react-three-fiber를 사용하여 3D 씬을 구성하고, 층별 평면과 소화기를 렌더링합니다.
 * 사용자는 층을 필터링하거나, 뷰를 초기화하고, 3D 소화기 모델과 상호작용할 수 있습니다.
 * 
 * @param extinguishers - 전체 소화기 목록
 * @param selectedExtinguisherId - 현재 선택된 소화기의 ID (외부에서 전달받음)
 * @param onExtinguisherClick - 소화기 클릭 시 상위 컴포넌트(App.tsx)로 선택된 소화기 정보를 전달하는 콜백
 */
interface BuildingPlanProps {
  extinguishers: Extinguisher[];
  selectedExtinguisherId: number | null;
  onExtinguisherClick: (extinguisher: Extinguisher) => void;
}

const BuildingPlan: React.FC<BuildingPlanProps> = ({ extinguishers, selectedExtinguisherId, onExtinguisherClick }) => {
  // 건물 설정 정보를 가져옵니다.
  const { floorHeight, totalFloors, floorConfigs } = BuildingConfig;
  // 선택된 층 상태. null이면 모든 층을 표시합니다.
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  // OrbitControls에 대한 참조. 뷰 리셋 등에 사용됩니다.
  const controlsRef = useRef<any>(null);
  // 상세 정보 뷰에 표시할 소화기 객체 상태.
  const [detailViewExtinguisher, setDetailViewExtinguisher] = useState<Extinguisher | null>(null);
  // 상세 정보 뷰의 화면상 위치(x, y) 상태.
  const [detailViewPosition, setDetailViewPosition] = useState<{ x: number; y: number } | null>(null);
  // Canvas를 감싸는 div에 대한 참조.
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  // ExtinguisherDetailView에 대한 참조. 팝업 외부 클릭 감지에 사용됩니다.
  const detailViewRef = useRef<HTMLDivElement>(null);

  // 총 층수에 따라 [1, 2, 3, ...] 형태의 배열을 생성합니다.
  const floors = Array.from({ length: totalFloors }, (_, i) => i + 1);

  /**
   * '뷰 초기화' 버튼 클릭 시 호출되는 핸들러입니다.
   * 카메라 위치와 타겟을 초기 상태로 되돌리고, 층 선택 및 상세 뷰를 초기화합니다.
   */
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset(); // OrbitControls의 기본 리셋 기능을 호출합니다.
      // 카메라 위치와 바라보는 지점을 명시적으로 초기값으로 설정합니다.
      controlsRef.current.object.position.set(-20, 30, 55);
      controlsRef.current.target.set(0, 7, 0);
      controlsRef.current.update(); // 변경 사항을 적용합니다.
    }
    setSelectedFloor(null); // 층 선택을 전체 보기로 변경합니다.
    setDetailViewExtinguisher(null); // 상세 정보 뷰를 닫습니다.
    setDetailViewPosition(null);
  };

  /**
   * 3D 소화기 모델이 클릭되었을 때 호출되는 콜백 함수입니다.
   * @param extinguisher - 클릭된 소화기 객체
   * @param screenPosition - 클릭된 위치의 2D 화면 좌표
   */
  const handleExtinguisherClick = useCallback((extinguisher: Extinguisher, screenPosition: { x: number; y: number }) => {
    setDetailViewExtinguisher(extinguisher);
    setDetailViewPosition(screenPosition);
    onExtinguisherClick(extinguisher); // App.tsx로 선택 정보를 전달하여 카드 목록과 상태를 동기화합니다.
  }, [onExtinguisherClick]);

  /**
   * ExtinguisherScreenPositionCalculator로부터 계산된 위치를 받는 콜백 함수입니다.
   * (카드 목록에서 소화기를 선택했을 때 호출됨)
   */
  const handleCalculatedPosition = useCallback((extinguisher: Extinguisher, position: { x: number; y: number }) => {
    // 이미 3D 모델 클릭으로 팝업이 열려있지 않은 경우에만 상태를 업데이트합니다.
    // 이는 3D 클릭과 카드 클릭 간의 상태 충돌을 방지합니다.
    if (!detailViewExtinguisher || detailViewExtinguisher.id !== extinguisher.id) {
      setDetailViewExtinguisher(extinguisher);
      setDetailViewPosition(position);
    }
  }, [detailViewExtinguisher]);

  /**
   * 상세 정보 뷰의 '닫기' 버튼 클릭 시 호출되는 핸들러입니다.
   */
  const handleCloseDetailView = useCallback(() => {
    setDetailViewExtinguisher(null);
    setDetailViewPosition(null);
    onExtinguisherClick(null as any); // App.tsx의 selectedExtinguisherId를 null로 만들어 선택을 해제합니다.
  }, [onExtinguisherClick]);

  // 상세 정보 뷰(팝업) 외부를 클릭했을 때 뷰를 닫는 로직입니다.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 팝업이 열려 있고, 클릭된 대상이 팝업(detailViewRef) 내부에 포함되지 않을 경우
      if (detailViewExtinguisher && detailViewRef.current && !detailViewRef.current.contains(event.target as Node)) {
        handleCloseDetailView();
      }
    };

    // 이벤트 리스너를 등록합니다.
    document.addEventListener('mousedown', handleClickOutside);
    // 컴포넌트가 언마운트되거나 detailViewExtinguisher가 변경되기 전에 리스너를 제거합니다.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [detailViewExtinguisher, handleCloseDetailView]);

  return (
    <div className="card h-100" style={{ overflow: 'hidden' }}>
      {/* 카드 헤더: 층 선택 버튼 그룹 */}
      <div className="card-header d-flex justify-content-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${selectedFloor === null ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedFloor(null)}
          >
            모든 층
          </button>
          {floors.map(floorNum => (
            <button
              key={floorNum}
              type="button"
              className={`btn btn-sm ${selectedFloor === floorNum ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedFloor(floorNum)}
            >
              {floorNum}F
            </button>
          ))}
        </div>
      </div>
      {/* 카드 본문: 3D 캔버스 */}
      <div ref={canvasContainerRef} className="card-body p-0" style={{ height: '600px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [-20, 30, 55], fov: 50 }}>
          {/* 조명 설정 */}
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 30, 10]} intensity={1.5} />
          
          {/* 각 층의 평면과 소화기를 렌더링합니다. */}
          {floors.map(floorNum => {
            // 층 필터링: 선택된 층이 있고 현재 층과 다르면 렌더링하지 않습니다.
            if (selectedFloor !== null && selectedFloor !== floorNum) return null;

            const floorConfig = floorConfigs[floorNum];
            if (!floorConfig) return null;

            // 정점(vertices)과 면(faces) 정보로 지오메트리를 생성합니다.
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(floorConfig.vertices);
            const indices = new Uint16Array(floorConfig.faces);

            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.computeVertexNormals(); // 조명을 올바르게 계산하기 위해 법선 벡터를 계산합니다.

            return (
              <group key={floorNum} position={[0, (floorNum - 1) * floorHeight, 0]}>
                {/* 층 평면 메쉬 */}
                <mesh geometry={geometry} receiveShadow>
                  <meshStandardMaterial color="#E0E0E0" transparent opacity={0.5} side={THREE.DoubleSide} />
                </mesh>
                {/* 층 번호 텍스트 */}
                <Text
                  position={[-BuildingConfig.floorDimensions.width / 2 - 2, 2, -BuildingConfig.floorDimensions.depth / 2 - 2]}
                  fontSize={2}
                  color="#555"
                >
                  {floorNum}F
                </Text>
              </group>
            );
          })}

          {/* 소화기들을 렌더링합니다. */}
          {extinguishers.map(extinguisher => {
            // 층 필터링: 선택된 층이 있고 해당 층의 소화기가 아니면 렌더링하지 않습니다.
            if (selectedFloor !== null && selectedFloor !== extinguisher.floor) return null;
            return (
              <Extinguisher3D
                key={extinguisher.id}
                extinguisher={extinguisher}
                isSelected={selectedExtinguisherId === extinguisher.id}
                onClick={handleExtinguisherClick}
              />
            );
          })}

          {/* 카메라 컨트롤: 사용자가 씬을 회전, 줌, 패닝할 수 있게 합니다. */}
          <OrbitControls ref={controlsRef} target={[0, 7, 0]} />

          {/* 카드 목록에서 소화기 선택 시 팝업 위치 계산을 위한 헬퍼 컴포넌트 */}
          <ExtinguisherScreenPositionCalculator
            extinguishers={extinguishers}
            selectedExtinguisherId={selectedExtinguisherId}
            onPositionCalculated={handleCalculatedPosition}
          />
        </Canvas>
        {/* 상세 정보 뷰: 선택된 소화기가 있을 때만 렌더링됩니다. */}
        {detailViewExtinguisher && detailViewPosition && (
          <ExtinguisherDetailView
            ref={detailViewRef}
            extinguisher={detailViewExtinguisher}
            onClose={handleCloseDetailView}
            position={detailViewPosition}
          />
        )}
      </div>
      {/* 카드 푸터: 뷰 초기화 버튼 */}
      <div className="card-footer d-flex justify-content-center">
        <button className="btn btn-secondary" onClick={handleResetView}>
          <i className="bi bi-arrow-counterclockwise me-2"></i>뷰 초기화
        </button>
      </div>
    </div>
  );
};

export default BuildingPlan;
''