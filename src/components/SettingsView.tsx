import React, { useState } from 'react';

interface Props {
  siteName: string;
  setSiteName: (name: string) => void;
}

const SettingsView: React.FC<Props> = ({ siteName, setSiteName }) => {
  const [inputSiteName, setInputSiteName] = useState(siteName);

  const handleSave = () => {
    setSiteName(inputSiteName);
    alert('사이트 이름이 저장되었습니다!');
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
              value={inputSiteName}
              onChange={(e) => setInputSiteName(e.target.value)}
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
