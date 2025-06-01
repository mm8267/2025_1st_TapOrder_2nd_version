# 치킨 주문 웹사이트

카카오페이 결제가 가능한 치킨 주문 웹사이트입니다.

## 개발 환경 설정

### 로컬 개발 (컴퓨터에서만 접근)
\`\`\`bash
npm run dev
\`\`\`
http://localhost:3000 에서 접근 가능

### 네트워크 개발 (스마트폰에서도 접근 가능)
\`\`\`bash
npm run dev
\`\`\`

개발 서버가 시작되면 다음과 같은 메시지가 표시됩니다:
\`\`\`
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000
\`\`\`

스마트폰에서 접근하려면:
1. 컴퓨터와 스마트폰이 같은 WiFi 네트워크에 연결되어 있어야 합니다
2. 스마트폰 브라우저에서 Network 주소로 접근합니다 (예: http://192.168.1.100:3000)

### 방화벽 설정 (Windows)
Windows에서 방화벽이 연결을 차단하는 경우:
1. Windows 방화벽 설정 열기
2. "앱 또는 기능이 Windows Defender 방화벽을 통과하도록 허용" 클릭
3. "설정 변경" 클릭
4. "Node.js" 찾아서 "개인" 및 "공용" 체크박스 모두 체크
5. 확인 클릭

### IP 주소 확인 방법
컴퓨터의 IP 주소를 확인하려면:

**Windows:**
\`\`\`cmd
ipconfig
\`\`\`

**Mac/Linux:**
\`\`\`bash
ifconfig
\`\`\`

또는
\`\`\`bash
ip addr show
\`\`\`

## 카카오페이 설정

카카오 개발자 콘솔에서 다음 URL들을 등록해야 합니다:
- 개발 환경: http://[YOUR_IP]:3000
- Redirect URI: http://[YOUR_IP]:3000/payment/success
- Cancel URI: http://[YOUR_IP]:3000/payment/cancel
- Fail URI: http://[YOUR_IP]:3000/payment/fail

## 문제 해결

### 스마트폰에서 접근이 안 되는 경우
1. 컴퓨터와 스마트폰이 같은 WiFi에 연결되어 있는지 확인
2. 컴퓨터의 방화벽 설정 확인
3. IP 주소가 올바른지 확인
4. 포트 3000이 열려있는지 확인

### 카카오페이 결제 후 페이지 오류
1. 카카오 개발자 콘솔에서 Redirect URI가 올바르게 설정되어 있는지 확인
2. 스마트폰과 컴퓨터가 같은 네트워크에 있는지 확인
3. 개발 서버가 0.0.0.0으로 바인딩되어 있는지 확인 (npm run dev 사용)
