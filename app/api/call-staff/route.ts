import { type NextRequest, NextResponse } from "next/server"

// Slack으로 직원 호출 알림을 보내는 API
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json()
    const { tableId = "알 수 없음", message = "도움이 필요합니다", customerName = "고객" } = body

    // Slack Webhook URL 가져오기 (환경 변수에서)
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    // Webhook URL이 없으면 오류 반환
    if (!slackWebhookUrl) {
      console.error("Slack Webhook URL이 설정되지 않았습니다.")
      return NextResponse.json(
        {
          success: false,
          error: "Slack 설정 오류",
          message: "서버에 Slack Webhook URL이 설정되지 않았습니다.",
        },
        { status: 500 },
      )
    }

    // 현재 시간 포맷팅
    const now = new Date()
    const formattedTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const formattedDate = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Slack에 보낼 메시지 구성
    const slackPayload = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔔 직원 호출 알림",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*테이블:*\n${tableId}`,
            },
            {
              type: "mrkdwn",
              text: `*시간:*\n${formattedTime}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*메시지:*\n${message}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${formattedDate} | ${customerName}님이 호출했습니다.`,
            },
          ],
        },
        {
          type: "divider",
        },
      ],
    }

    console.log("Slack에 알림 전송 시도:", JSON.stringify(slackPayload, null, 2))

    // Slack Webhook으로 메시지 전송
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackPayload),
    })

    // Slack API 응답 확인
    if (slackResponse.ok) {
      console.log("Slack 알림 전송 성공")
      return NextResponse.json({
        success: true,
        message: "직원 호출 알림이 전송되었습니다.",
      })
    } else {
      const errorText = await slackResponse.text()
      console.error("Slack 알림 전송 실패:", errorText)
      return NextResponse.json(
        {
          success: false,
          error: "Slack 알림 전송 실패",
          details: errorText,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("직원 호출 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류",
        message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
