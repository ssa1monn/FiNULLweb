import { useState, useEffect } from 'react';
import ExtinguisherCard from './components/ExtinguisherCard';
import ExtinguisherSummary from './components/ExtinguisherSummary';
import BuildingPlan from './components/BuildingPlan';
import LogsView from './components/LogsView';
import SettingsView from './components/SettingsView';
// import ExtinguisherDetailView from './components/ExtinguisherDetailView'; // ExtinguisherDetailView import 제거
import { mockExtinguishers } from './mockData';
import { mockLogs } from './mockLogs';
import { Extinguisher } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'logs' | 'settings'>('dashboard');
  const [selectedExtinguisherId, setSelectedExtinguisherId] = useState<number | null>(null);
  // const [selectedExtinguisher, setSelectedExtinguisher] = useState<Extinguisher | null>(null); // 상세 정보 표시용 상태 제거
  const [siteName, setSiteName] = useState<string>('인천대학교');

  useEffect(() => {
    document.title = `${siteName} 소화기 관리 시스템`;
  }, [siteName]);

  const handleCardClick = (extinguisher: Extinguisher | null) => {
    if (extinguisher) {
      setSelectedExtinguisherId(extinguisher.id);
    } else {
      setSelectedExtinguisherId(null);
    }
  };

  // const handleCloseDetailView = () => { // 함수 제거
  //   setSelectedExtinguisher(null);
  //   setSelectedExtinguisherId(null); // 상세 뷰 닫을 때 선택 해제
  // };

  return (
    <div className="app-background">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            <small>{siteName} 소화기 관리 시스템</small>
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
                    setSelectedExtinguisherId(null);
                    // setSelectedExtinguisher(null); // 대시보드 탭으로 돌아올 때 상세 뷰 닫기 제거
                  }}
                >
                  <i className="bi bi-grid-1x2 me-1"></i> 대시보드
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'logs' ? 'active' : ''}`}
                  href="#"
                  onClick={() => {
                    setCurrentView('logs');
                    // setSelectedExtinguisher(null); // 로그 탭으로 돌아올 때 상세 뷰 닫기 제거
                  }}
                >
                  <i className="bi bi-journal-text me-1"></i> 로그
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
                  href="#"
                  onClick={() => {
                    setCurrentView('settings');
                    // setSelectedExtinguisher(null); // 설정 탭으로 돌아올 때 상세 뷰 닫기 제거
                  }}
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
            <h2><i className="bi bi-grid-1x2 me-2"></i>대시보드</h2>
            <div className="row">
              <div className="col-md-7" style={{ height: '970px' }}>
                <BuildingPlan 
                  extinguishers={mockExtinguishers} 
                  selectedExtinguisherId={selectedExtinguisherId}
                  onExtinguisherClick={handleCardClick} 
                />
              </div>
              <div className="col-md-5 d-flex flex-column">
                <ExtinguisherSummary extinguishers={mockExtinguishers} className="mb-3" />
                <div className="scrollable-cards p-3 flex-grow-1" style={{ overflowY: 'auto' }}>
                  <div className="row">
                    {mockExtinguishers.map((extinguisher) => (
                      <div className="col-lg-6" key={extinguisher.id}>
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
        {currentView === 'logs' && <LogsView logs={mockLogs} />}
        {currentView === 'settings' && <SettingsView siteName={siteName} setSiteName={setSiteName} />}

        {/* selectedExtinguisher && ( // 조건부 렌더링 제거
          <ExtinguisherDetailView 
            extinguisher={selectedExtinguisher} 
            onClose={handleCloseDetailView} 
          />
        )*/}
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