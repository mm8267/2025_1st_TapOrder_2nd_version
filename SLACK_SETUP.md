# Slack 웹훅 설정 가이드

이 가이드는 Slack 웹훅을 설정하여 직원 호출 알림을 받는 방법을 설명합니다.

## 1. Slack 앱 생성하기

1. [Slack API 웹사이트](https://api.slack.com/apps)에 접속합니다.
2. "Create New App" 버튼을 클릭합니다.
3. "From scratch" 옵션을 선택합니다.
4. 앱 이름(예: "직원호출알림")과 워크스페이스를 선택합니다.
5. "Create App" 버튼을 클릭합니다.

## 2. Incoming Webhook 활성화하기

1. 왼쪽 메뉴에서 "Incoming Webhooks"를 클릭합니다.
2. "Activate Incoming Webhooks" 토글을 켭니다.
3. 페이지 하단의 "Add New Webhook to Workspace" 버튼을 클릭합니다.
4. 알림을 받을 채널을 선택하고 "Allow" 버튼을 클릭합니다.
5. 생성된 Webhook URL을 복사합니다. 이 URL은 다음 단계에서 필요합니다.

## 3. 환경 변수 설정하기

1. 프로젝트의 `.env.local` 파일을 열거나 생성합니다.
2. 다음 줄을 추가합니다:

\`\`\`
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
\`\`\`

3. `YOUR/WEBHOOK/URL` 부분을 앞서 복사한 Webhook URL로 바꿉니다.
4. 파일을 저장하고 서버를 재시작합니다.

## 4. 테스트하기

1. 웹사이트에서 직원 호출 버튼을 클릭합니다.
2. Slack 채널에 알림이 표시되는지 확인합니다.

## 문제 해결

- **알림이 오지 않는 경우**: 환경 변수가 올바르게 설정되었는지 확인하세요.
- **오류 메시지가 표시되는 경우**: 서버 로그를 확인하여 자세한 오류 정보를 확인하세요.
- **Webhook URL이 만료된 경우**: Slack API 웹사이트에서 새 Webhook URL을 생성하세요.
\`\`\`

```plaintext file=".env.local.example"
# 카카오페이 API 키 (개발용)
KAKAO_ADMIN_KEY=D7647CC40D542CCBC1CD
KAKAO_CLIENT_ID=908F7152469473398BA1
KAKAO_CLIENT_SECRET=D7647CC40D542CCBC1CD
KAKAO_SECRET_KEY_DEV=DEVFEDAE1C73B9CBDE0C0FC65B7AD27D2A2C61E8
KAKAO_SECRET_KEY_PROD=PRD50E79C082095D3EE0D409548F064EBDD35E33

# 개발 환경에서 동적 URL 사용을 위한 설정
NEXT_PUBLIC_SITE_URL=auto

# Slack 웹훅 URL (직원 호출 알림용)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
