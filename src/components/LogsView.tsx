import React from 'react';
import { LogEntry } from '../types';

interface Props {
  logs: LogEntry[];
}

const LogsView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="mt-4">
      <h2><i className="bi bi-journal-text me-2"></i>시스템 로그</h2>
      <div className="card">
        <div className="card-body" style={{ maxHeight: '1000px', overflowY: 'auto' }}>
          <ul className="list-group list-group-flush">
            {logs.map((log) => (
              <li key={log.id} className="list-group-item">
                <small className="text-muted">{log.timestamp}</small><br />
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
