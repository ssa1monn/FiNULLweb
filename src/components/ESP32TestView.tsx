import { useState, useEffect } from 'react';

const ESP32TestView = () => {
  const [espData, setEspData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.4.1/status');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEspData(JSON.stringify(data, null, 2));
        setError(null);
      } catch (e: any) {
        console.error('Failed to fetch from ESP32:', e);
        setError(`ESP32에서 데이터를 가져오는 데 실패했습니다. Wi-Fi 연결을 확인하세요. (${e.message})`);
        setEspData(null);
      }
    };

    const intervalId = setInterval(fetchData, 3000); // 3초마다 데이터 가져오기

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className="mt-4">
      <h2><i className="bi bi-wifi me-2"></i>ESP32 연동 테스트</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">ESP32 응답 데이터</h5>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {espData ? (
            <pre className="bg-light p-3 rounded"><code>{espData}</code></pre>
          ) : (
            !error && <p>ESP32에서 데이터를 기다리는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ESP32TestView;
