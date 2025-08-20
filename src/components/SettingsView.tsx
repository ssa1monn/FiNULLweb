// src/components/SettingsView.tsx

import React, { useState } from 'react';

/**
 * Props 인터페이스
 * 
 * SettingsView 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property siteName - 현재 설정된 사이트 이름
 * @property setSiteName - 사이트 이름을 변경하는 함수 (상위 컴포넌트의 상태를 업데이트)
 */
interface Props {
  siteName: string;
  setSiteName: (name: string) => void;
}

/**
 * SettingsView 컴포넌트
 * 
 * 애플리케이션의 설정을 변경할 수 있는 UI를 제공합니다.
 * 현재는 사이트의 이름을 변경하는 기능만 포함되어 있습니다.
 */
const SettingsView: React.FC<Props> = ({ siteName, setSiteName }) => {
  // 사용자가 입력 필드에 입력하는 값을 관리하기 위한 내부 상태입니다.
  // 부모로부터 받은 `siteName`으로 초기화됩니다.
  const [inputSiteName, setInputSiteName] = useState(siteName);

  /**
   * '저장' 버튼 클릭 시 호출되는 핸들러입니다.
   * 내부 입력 상태(`inputSiteName`)의 값을 상위 컴포넌트의 상태로 전달하여
   * 애플리케이션 전체의 사이트 이름을 업데이트합니다.
   */
  const handleSave = () => {
    setSiteName(inputSiteName);
    alert('사이트 이름이 저장되었습니다!'); // 사용자에게 저장 완료를 알립니다.
  };

  return (
    <div className="mt-4">
      <h2><i className="bi bi-gear me-2"></i>설정</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">사이트 이름 설정</h5>
          <div className="mb-3">
            <label htmlFor="siteNameInput" className="form-label">사이트 이름</label>
            <input
              type="text"
              className="form-control"
              id="siteNameInput"
              value={inputSiteName} // 입력 필드의 값은 내부 상태와 동기화됩니다.
              onChange={(e) => setInputSiteName(e.target.value)} // 입력 값이 변경될 때마다 내부 상태를 업데이트합니다.
              placeholder="예: 인천대학교"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;