import { type NextRequest, NextResponse } from "next/server"

// 카카오페이 결제 취소 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tid, cancel_amount, cancel_tax_free_amount } = body

    const kakaoPayData = {
      cid: "TC0ONETIME", // 테스트용 CID
      tid: tid,
      cancel_amount: cancel_amount.toString(),
      cancel_tax_free_amount: (cancel_tax_free_amount || 0).toString(),
    }

    // SECRET KEY 사용
    const secretKey = process.env.KAKAO_SECRET_KEY_DEV || "DEVFEDAE1C73B9CBDE0C0FC65B7AD27D2A2C61E8"

    if (!secretKey) {
      return NextResponse.json(
        {
          error: "카카오페이 설정 오류",
          details: "SECRET KEY가 설정되지 않았습니다.",
        },
        { status: 500 },
      )
    }

    console.log("결제취소 요청 데이터:", kakaoPayData)

    // 카카오페이 결제 취소 API 호출 (open-api.kakaopay.com 사용)
    const response = await fetch("https://open-api.kakaopay.com/online/v1/payment/cancel", {
      method: "POST",
      headers: {
        Authorization: `SECRET_KEY ${secretKey}`, // SECRET_KEY 방식 사용
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kakaoPayData),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("결제취소 응답객체:", result)
      return NextResponse.json(result)
    } else {
      console.error("카카오페이 취소 API 오류:", result)
      return NextResponse.json(
        {
          error: "카카오페이 결제 취소 실패",
          details: result,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment Cancel API Error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
