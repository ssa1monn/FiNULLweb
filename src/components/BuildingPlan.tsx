import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Extinguisher } from '../types';
import { BuildingConfig } from '../BuildingConfig';
import * as THREE from 'three';
import ExtinguisherDetailView from './ExtinguisherDetailView';

// 소화기 3D 모델 컴포넌트
const Extinguisher3D: React.FC<{ extinguisher: Extinguisher; isSelected: boolean; onClick: (extinguisher: Extinguisher, screenPosition: { x: number; y: number }) => void; }> = ({ extinguisher, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera, size } = useThree();

  const getStatusColor = () => {
    if (extinguisher.isFireDetected && extinguisher.isOnline) return '#FF6B6B'; // 밝은 빨간색 (화재)
    if (!extinguisher.isOnline) return '#A0A0A0'; // 밝은 회색 (오프라인)
    if (extinguisher.batteryLevel < 30) return '#FFA07A'; // 밝은 주황색 (배터리 부족)
    return '#66BB6A'; // 밝은 녹색 (정상)
  };

  // 선택되었을 때 반짝이는 효과
  useFrame(({ clock }) => {
    if (isSelected) {
      const intensity = (Math.sin(clock.getElapsedTime() * 4) + 1) / 2; // 0에서 1 사이로 반복
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive.set(getStatusColor());
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    } else {
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive.set('black');
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
  });

  const handleClick = () => {
    if (meshRef.current) {
      const vector = new THREE.Vector3();
      meshRef.current.getWorldPosition(vector);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (-vector.y * 0.5 + 0.5) * size.height;

      onClick(extinguisher, { x, y });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[extinguisher.position.x, extinguisher.position.y + 1, extinguisher.position.z]} // 바닥에서 살짝 띄움
      onClick={handleClick}
    >
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={getStatusColor()} />
      <Text
        position={[0, 1.5, 0]}
        fontSize={1}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="white"
      >
        {extinguisher.name}
      </Text>
    </mesh>
  );
};

// 3D 씬 내에서 소화기 위치를 계산하여 부모로 전달하는 헬퍼 컴포넌트
const ExtinguisherScreenPositionCalculator: React.FC<{ 
  extinguishers: Extinguisher[]; 
  selectedExtinguisherId: number | null; 
  onPositionCalculated: (extinguisher: Extinguisher, position: { x: number; y: number }) => void; 
}> = ({ extinguishers, selectedExtinguisherId, onPositionCalculated }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (selectedExtinguisherId !== null) {
      const extinguisher = extinguishers.find(e => e.id === selectedExtinguisherId);
      if (extinguisher) {
        // 3D 위치를 2D 화면 좌표로 변환
        const vector = new THREE.Vector3(extinguisher.position.x, extinguisher.position.y + 1, extinguisher.position.z);
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * size.width;
        const y = (-vector.y * 0.5 + 0.5) * size.height;

        onPositionCalculated(extinguisher, { x, y });
      }
    }
  }, [selectedExtinguisherId, extinguishers, camera, size, onPositionCalculated]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

// 건물 3D 뷰 컴포넌트
interface BuildingPlanProps {
  extinguishers: Extinguisher[];
  selectedExtinguisherId: number | null;
  onExtinguisherClick: (extinguisher: Extinguisher) => void;
}

const BuildingPlan: React.FC<BuildingPlanProps> = ({ extinguishers, selectedExtinguisherId, onExtinguisherClick }) => {
  const { floorHeight, totalFloors, floorConfigs } = BuildingConfig;
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null); // null: 모든 층 표시
  const controlsRef = useRef<any>(null);
  const [detailViewExtinguisher, setDetailViewExtinguisher] = useState<Extinguisher | null>(null);
  const [detailViewPosition, setDetailViewPosition] = useState<{ x: number; y: number } | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null); // Canvas를 감싸는 div에 대한 ref
  const detailViewRef = useRef<HTMLDivElement>(null); // ExtinguisherDetailView에 대한 ref

  const floors = Array.from({ length: totalFloors }, (_, i) => i + 1);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset(); // 기본 리셋
      // 명시적으로 카메라 위치와 타겟 설정
      controlsRef.current.object.position.set(-20, 30, 55); // 초기 카메라 위치
      controlsRef.current.target.set(0, 7, 0); // 초기 타겟
      controlsRef.current.update(); // 변경 사항 적용
    }
    setSelectedFloor(null);
    setDetailViewExtinguisher(null); // 상세 뷰 닫기
    setDetailViewPosition(null);
  };

  // 3D 모델 클릭 시 호출
  const handleExtinguisherClick = useCallback((extinguisher: Extinguisher, screenPosition: { x: number; y: number }) => {
    setDetailViewExtinguisher(extinguisher);
    setDetailViewPosition(screenPosition);
    onExtinguisherClick(extinguisher); // App.tsx로 전달 (카드 목록 선택 상태 업데이트용)
  }, [onExtinguisherClick]);

  // ExtinguisherScreenPositionCalculator에서 호출될 콜백
  const handleCalculatedPosition = useCallback((extinguisher: Extinguisher, position: { x: number; y: number }) => {
    // 이미 3D 클릭으로 팝업이 열려있지 않은 경우에만 업데이트
    if (!detailViewExtinguisher || detailViewExtinguisher.id !== extinguisher.id) {
      setDetailViewExtinguisher(extinguisher);
      setDetailViewPosition(position);
    }
  }, [detailViewExtinguisher]);

  // 팝업 닫기
  const handleCloseDetailView = useCallback(() => {
    setDetailViewExtinguisher(null);
    setDetailViewPosition(null);
    onExtinguisherClick(null as any); // App.tsx의 selectedExtinguisherId 초기화
  }, [onExtinguisherClick]);

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailViewExtinguisher && detailViewRef.current && !detailViewRef.current.contains(event.target as Node)) {
        // 팝업이 열려있고, 클릭된 요소가 상세 뷰 내부에 없으면 닫기
        handleCloseDetailView();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [detailViewExtinguisher, handleCloseDetailView]);

  return (
    <div className="card h-100" style={{ overflow: 'hidden' }}>
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
      <div ref={canvasContainerRef} className="card-body p-0" style={{ height: '600px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [-20, 30, 55], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 30, 10]} intensity={1.5} />
          
          {/* 각 층 평면과 소화기 렌더링 */}
          {floors.map(floorNum => {
            if (selectedFloor !== null && selectedFloor !== floorNum) return null; // 선택된 층만 표시

            const floorConfig = floorConfigs[floorNum];
            if (!floorConfig) return null;

            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(floorConfig.vertices);
            const indices = new Uint16Array(floorConfig.faces);

            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.computeVertexNormals();

            return (
              <group key={floorNum} position={[0, (floorNum - 1) * floorHeight, 0]}>
                <mesh geometry={geometry} receiveShadow>
                  <meshStandardMaterial color="#E0E0E0" transparent opacity={0.5} side={THREE.DoubleSide} />
                </mesh>
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

          {extinguishers.map(extinguisher => {
            if (selectedFloor !== null && selectedFloor !== extinguisher.floor) return null; // 선택된 층의 소화기만 표시
            return (
              <Extinguisher3D
                key={extinguisher.id}
                extinguisher={extinguisher}
                isSelected={selectedExtinguisherId === extinguisher.id}
                onClick={handleExtinguisherClick} // 클릭 핸들러 변경
              />
            );
          })}

          <OrbitControls ref={controlsRef} target={[0, 7, 0]} />

          {/* 카드 목록에서 선택 시 팝업 위치 계산을 위한 헬퍼 컴포넌트 */}
          <ExtinguisherScreenPositionCalculator
            extinguishers={extinguishers}
            selectedExtinguisherId={selectedExtinguisherId}
            onPositionCalculated={handleCalculatedPosition}
          />
        </Canvas>
        {detailViewExtinguisher && detailViewPosition && (
          <ExtinguisherDetailView
            ref={detailViewRef}
            extinguisher={detailViewExtinguisher}
            onClose={handleCloseDetailView}
            position={detailViewPosition}
          />
        )}
      </div>
      <div className="card-footer d-flex justify-content-center">
        <button className="btn btn-secondary" onClick={handleResetView}>
          <i className="bi bi-arrow-counterclockwise me-2"></i>뷰 초기화
        </button>
      </div>
    </div>
  );
};

export default BuildingPlan;