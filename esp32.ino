#include <WiFi.h>
#include <WebServer.h>

// WiFi AP 설정
const char* ssid = "ESP32_AP";
const char* password = "12345678";

// 웹 서버 객체 생성
WebServer server(80);

// 🔹 웹페이지에 동적으로 표시될 내용을 저장할 전역 변수
String dynamicContent = "평소 상태입니다.";

// 루트("/") 경로 요청 시 실행될 함수
void handleRoot() {
  // HTML 페이지를 String 객체로 동적으로 생성
  String page = R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>ESP32 AP Mode</title>
    </head>
    <body>
      <h1>Hello from ESP32 AP Mode!</h1>
      <p>현재 상태: )rawliteral";
  
  // 🔹 전역 변수의 현재 값을 HTML에 추가
  page += dynamicContent;

  // 나머지 HTML 코드 추가
  page += R"rawliteral(
      </p>
    </body>
    </html>
  )rawliteral";

  // 완성된 HTML 페이지를 클라이언트에 전송
  server.send(200, "text/html", page.c_str());
}

void setup() {
  Serial.begin(115200);

  // ESP32를 Access Point 모드로 설정
  WiFi.softAP(ssid, password);
  Serial.println("AP 모드로 전환됨.");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.softAPIP());

  // 요청 URL에 따른 핸들러 등록
  server.on("/", handleRoot);
  
  // JSON 데이터 응답 핸들러
  server.on("/status", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"fire\": true}");
  });

  // 웹 서버 시작
  server.begin();
  Serial.println("웹 서버 시작됨.");
}

// loop() 함수에서 사용할 카운터 변수
int cnt = 0;

void loop() {
  // 클라이언트의 요청을 계속 확인하고 처리
  server.handleClient();

  // 5번에 한 번씩 (약 2.5초마다) 특정 상황마다 바꾸기
  if (cnt % 10 < 5) {
    // 여기서 내용 변경
    dynamicContent = "!!! 특별 상태 발생 !!!";
  } else {
    dynamicContent = "평소 상태입니다.";
  }

  // 카운터 증가 및 약간의 지연
  cnt++;
  delay(500);
}