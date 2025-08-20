// src/components/ESP32TestView.tsx

import { useState, useEffect } from 'react';

/**
 * ESP32TestView 컴포넌트
 * 
 * ESP32 장치와의 통신을 테스트하고 그 상태를 화면에 표시하는 역할을 합니다.
 * 주기적으로 ESP32의 '/status' 엔드포인트로 HTTP GET 요청을 보내어 데이터를 가져옵니다.
 * 통신 성공 시 받은 JSON 데이터를 예쁘게 포맷하여 보여주고,
 * 실패 시 에러 메시지를 사용자에게 표시합니다.
 */
const ESP32TestView = () => {
  // espData 상태: ESP32로부터 받은 원시 데이터를 저장합니다. 초기값은 null입니다.
  const [espData, setEspData] = useState<string | null>(null);
  // error 상태: 통신 중 발생한 에러 메시지를 저장합니다. 초기값은 null입니다.
  const [error, setError] = useState<string | null>(null);

  // useEffect 훅: 컴포넌트가 마운트될 때 한 번 실행됩니다.
  useEffect(() => {
    /**
     * fetchData 함수
     * 
     * ESP32의 '/status' 엔드포인트에 비동기적으로 데이터를 요청합니다.
     * fetch API를 사용하여 HTTP GET 요청을 보냅니다.
     */
    const fetchData = async () => {
      try {
        // ESP32의 'http://192.168.4.1/status' 주소로 데이터를 요청합니다.
        const response = await fetch('http://192.168.4.1/status');
        
        // 응답이 성공적이지 않으면 에러를 발생시킵니다.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 응답 본문을 JSON 형태로 파싱합니다.
        const data = await response.json();
        
        // 받은 데이터를 JSON 문자열로 변환하여 espData 상태를 업데이트합니다. (null, 2는 가독성을 위한 들여쓰기)
        setEspData(JSON.stringify(data, null, 2));
        // 에러가 없으므로 error 상태를 null로 설정합니다.
        setError(null);
      } catch (e: any) {
        // 데이터 요청 중 에러가 발생한 경우
        console.error('Failed to fetch from ESP32:', e);
        // 사용자에게 보여줄 에러 메시지를 설정합니다.
        setError(`ESP32에서 데이터를 가져오는 데 실패했습니다. Wi-Fi 연결을 확인하세요. (${e.message})`);
        // espData 상태를 null로 초기화합니다.
        setEspData(null);
      }
    };

    // 3초(3000ms)마다 fetchData 함수를 반복적으로 호출하는 인터벌을 설정합니다.
    const intervalId = setInterval(fetchData, 3000);

    // 컴포넌트가 언마운트될 때(사라질 때) 인터벌을 정리(제거)하여 메모리 누수를 방지합니다.
    return () => clearInterval(intervalId);
  }, []); // 빈 배열을 의존성으로 전달하여 컴포넌트가 처음 마운트될 때만 이 효과가 실행되도록 합니다.

  // 컴포넌트의 UI를 렌더링합니다.
  return (
    <div className="mt-4">
      <h2><i className="bi bi-wifi me-2"></i>ESP32 연동 테스트</h2>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">ESP32 응답 데이터</h5>
          {/* error 상태에 값이 있으면 경고창을 표시합니다. */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {/* espData 상태에 값이 있으면 데이터를 코드 블록으로 표시합니다. */}
          {espData ? (
            <pre className="bg-light p-3 rounded"><code>{espData}</code></pre>
          ) : (
            // espData가 없고 error도 없을 때 로딩 메시지를 표시합니다.
            !error && <p>ESP32에서 데이터를 기다리는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ESP32TestView;