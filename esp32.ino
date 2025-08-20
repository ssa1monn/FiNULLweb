#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32_AP";
const char* password = "12345678";

WebServer server(80);

void handleRoot() {
  server.send(200, "text/html; charset=utf-8", R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head><title>ESP32 AP Mode</title></head>
    <body>
      <h1>Hello from ESP32 AP Mode!</h1>
      <p>ESP32가 호스팅 중인 웹페이지입니다.</p>
    </body>
    </html>
  )rawliteral");
}

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  Serial.println("AP 모드로 전환됨.");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.softAPIP());

  // 🔹 요청에 대한 핸들러 등록은 여기에만!
  server.on("/", handleRoot);
  
  // 🔸 JSON 데이터 응답 핸들러
  server.on("/status", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"fire\": true}");
  });

  server.begin();
  Serial.println("웹 서버 시작됨.");
}

void loop() {
  server.handleClient();  // 클라이언트 요청 처리만!
}