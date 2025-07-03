import React, { useState } from 'react';
import ExtinguisherCard from './components/ExtinguisherCard';
import ExtinguisherSummary from './components/ExtinguisherSummary';
import ExtinguisherMap from './components/ExtinguisherMap';
import RegionalStatusView from './components/RegionalStatusView';
import LogsView from './components/LogsView'; // Import LogsView
import { mockExtinguishers } from './mockData';
import { mockLogs } from './mockLogs'; // Import mockLogs
import { Extinguisher } from './types'; // Import Extinguisher type

const SettingsView: React.FC = () => {
  return (
    <div className="mt-4">
      <h2><i className="bi bi-gear me-2"></i>설정 (준비 중)</h2>
      <p>여기에 시스템 설정 옵션이 표시될 예정입니다.</p>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'logs' | 'settings' | 'regional'>('dashboard');
  const [selectedExtinguisherId, setSelectedExtinguisherId] = useState<number | null>(null);

  const handleCardClick = (extinguisher: Extinguisher) => {
    setSelectedExtinguisherId(extinguisher.id);
  };

  const handleMapReset = () => {
    setSelectedExtinguisherId(null);
  };

  return (
    <div className="app-background">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            <small>산불 자동 소화기 관리 시스템</small>
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                  aria-current="page"
                  href="#"
                  onClick={() => {
                    setCurrentView('dashboard');
                    setSelectedExtinguisherId(null); // 대시보드 탭으로 돌아올 때 선택 해제
                  }}
                >
                  <i className="bi bi-grid-1x2 me-1"></i> 현황 카드
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'regional' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentView('regional')}
                >
                  <i className="bi bi-geo-alt me-1"></i> 지역별 현황
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'logs' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentView('logs')}
                >
                  <i className="bi bi-journal-text me-1"></i> 로그
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentView('settings')}
                >
                  <i className="bi bi-gear me-1"></i> 설정
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4 flex-grow-1">
        {currentView === 'dashboard' && (
          <div className="mt-4">
            <h2><i className="bi bi-grid-1x2 me-2"></i>현황 카드</h2>
            <div className="row">
              <div className="col-md-6">
                <ExtinguisherMap extinguishers={mockExtinguishers} selectedExtinguisherId={selectedExtinguisherId} onMapReset={handleMapReset} />
              </div>
              <div className="col-md-6">
                <ExtinguisherSummary extinguishers={mockExtinguishers} />
                <div className="scrollable-cards p-3" style={{ maxHeight: '820px', overflowY: 'auto', overflowX: 'hidden' }}>
                  <div className="row">
                    {mockExtinguishers.map((extinguisher) => (
                      <div className="col-md-6 col-lg-6" key={extinguisher.id}>
                        <ExtinguisherCard
                          extinguisher={extinguisher}
                          onClick={handleCardClick}
                          isSelected={selectedExtinguisherId === extinguisher.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'regional' && <RegionalStatusView extinguishers={mockExtinguishers} />}
        {currentView === 'logs' && <LogsView logs={mockLogs} />}
        {currentView === 'settings' && <SettingsView />}
      </div>

      <footer className="footer mt-auto py-3 bg-dark text-white-50">
        <div className="container text-center">
          <small>&copy; 2025 인천대학교 FiNULL 팀. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default App;