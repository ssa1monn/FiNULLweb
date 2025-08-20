// src/components/LogsView.tsx

import { LogEntry } from '../types';

/**
 * Props 인터페이스
 * 
 * LogsView 컴포넌트가 받는 속성(props)을 정의합니다.
 * @property logs - 표시할 로그 항목 데이터의 배열
 */
interface Props {
  logs: LogEntry[];
}

/**
 * LogsView 컴포넌트
 * 
 * 시스템에서 발생한 모든 로그를 시간순으로 보여주는 UI 컴포넌트입니다.
 * 각 로그 항목은 발생 시각, 관련 소화기 이름, 그리고 로그 메시지로 구성됩니다.
 * 로그 목록이 길어질 경우를 대비해 스크롤 기능을 제공합니다.
 */
const LogsView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="mt-4">
      <h2><i className="bi bi-journal-text me-2"></i>시스템 로그</h2>
      <div className="card">
        {/* 카드 본문에 최대 높이와 자동 스크롤을 적용하여 내용이 많아져도 UI가 깨지지 않도록 합니다. */}
        <div className="card-body" style={{ maxHeight: '1000px', overflowY: 'auto' }}>
          <ul className="list-group list-group-flush">
            {/* logs 배열을 순회하며 각 로그 항목을 리스트 아이템으로 렌더링합니다. */}
            {/* React에서 배열을 렌더링할 때는 각 요소에 고유한 `key` prop을 제공해야 합니다. */}
            {logs.map((log) => (
              <li key={log.id} className="list-group-item">
                {/* 로그 타임스탬프 */}
                <small className="text-muted">{log.timestamp}</small><br />
                {/* 로그 출처(소화기 이름)와 메시지 */}
                <strong>[{log.extinguisherName}]</strong> {log.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogsView;