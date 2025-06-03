import { type NextRequest, NextResponse } from "next/server"

// 동적으로 호스트 URL을 가져오는 함수
function getBaseUrl(request: NextRequest) {
  const host = request.headers.get("host")
  const protocol = request.headers.get("x-forwarded-proto") || "http"

  console.log("=== 호스트 정보 분석 ===")
  console.log("- host:", host)
  console.log("- x-forwarded-proto:", request.headers.get("x-forwarded-proto"))
  console.log("- user-agent:", request.headers.get("user-agent"))

  if (host) {
    const baseUrl = `${protocol}://${host}`
    console.log("- 생성된 baseUrl:", baseUrl)
    return baseUrl
  }

  console.log("- fallback baseUrl 사용: http://localhost:3000")
  return "http://localhost:3000"
}

// 카카오페이 결제 준비 API
export async function POST(request: NextRequest) {
  console.log("\n🚀 ===== 카카오페이 결제 준비 API 시작 =====")

  // 변수들을 함수 최상위에서 선언
  let response: Response | undefined
  let responseText = ""
  let result: any

  try {
    // 환경변수 체크
    const secretKey = process.env.KAKAO_SECRET_KEY_DEV
    console.log("🔑 환경변수 체크:")
    console.log("- KAKAO_SECRET_KEY_DEV 존재:", !!secretKey)
    console.log("- SECRET KEY 앞 10자리:", secretKey?.substring(0, 10) + "...")

    if (!secretKey) {
      console.error("❌ KAKAO_SECRET_KEY_DEV 환경변수가 설정되지 않았습니다.")
      return NextResponse.json(
        {
          error: "카카오페이 설정 오류",
          details: "SECRET KEY가 설정되지 않았습니다.",
          code: "MISSING_SECRET_KEY",
        },
        { status: 500 },
      )
    }

    // 요청 본문 파싱
    let body
    try {
      body = await request.json()
      console.log("📦 요청 본문 파싱 성공:", body)
    } catch (parseError) {
      console.error("❌ 요청 본문 파싱 실패:", parseError)
      return NextResponse.json(
        {
          error: "잘못된 요청 형식",
          details: "JSON 파싱에 실패했습니다.",
          code: "INVALID_JSON",
        },
        { status: 400 },
      )
    }

    // 필수 필드 검증
    const requiredFields = ["partner_order_id", "partner_user_id", "item_name", "quantity", "total_amount"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.error("❌ 필수 필드 누락:", missingFields)
      return NextResponse.json(
        {
          error: "필수 필드가 누락되었습니다",
          details: `누락된 필드: ${missingFields.join(", ")}`,
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      )
    }

    // 동적으로 베이스 URL 가져오기
    const baseUrl = getBaseUrl(request)

    const kakaoPayData = {
      cid: "TC0ONETIME", // 테스트용 CID
      partner_order_id: body.partner_order_id,
      partner_user_id: body.partner_user_id,
      item_name: body.item_name,
      quantity: body.quantity,
      total_amount: body.total_amount,
      tax_free_amount: body.tax_free_amount || 0,
      approval_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      fail_url: `${baseUrl}/payment/fail`,
    }

    console.log("📋 카카오페이 요청 데이터:")
    console.log(JSON.stringify(kakaoPayData, null, 2))

    // 카카오페이 API 호출
    console.log("🌐 카카오페이 API 호출 시작...")
    console.log("- URL: https://open-api.kakaopay.com/online/v1/payment/ready")
    console.log("- Method: POST")
    console.log("- Authorization: SECRET_KEY " + secretKey.substring(0, 10) + "...")

    try {
      response = await fetch("https://open-api.kakaopay.com/online/v1/payment/ready", {
        method: "POST",
        headers: {
          Authorization: `SECRET_KEY ${secretKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "chicken-restaurant/1.0",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(kakaoPayData),
      })

      console.log("📡 카카오페이 API 응답:")
      console.log("- 상태 코드:", response?.status)
      console.log("- 상태 텍스트:", response?.statusText)

      if (response?.headers) {
        console.log("- 응답 헤더:", Object.fromEntries(response.headers.entries()))
      }

      responseText = await response.text()
      console.log("📄 카카오페이 API 원본 응답:")
      console.log(responseText)
    } catch (fetchError) {
      console.error("💥 카카오페이 API 호출 실패:", fetchError)
      return NextResponse.json(
        {
          error: "카카오페이 서버 연결 실패",
          details: fetchError instanceof Error ? fetchError.message : "네트워크 오류",
          code: "NETWORK_ERROR",
          debug_info: {
            error_type: fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError,
            error_message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          },
        },
        { status: 503 },
      )
    }

    // 응답 파싱
    try {
      if (!responseText || responseText.trim() === "") {
        throw new Error("빈 응답")
      }
      result = JSON.parse(responseText)
      console.log("✅ 응답 파싱 성공:", result)
    } catch (parseError) {
      console.error("❌ 카카오페이 응답 파싱 실패:", parseError)
      return NextResponse.json(
        {
          error: "카카오페이 응답 파싱 실패",
          details: "서버 응답을 해석할 수 없습니다.",
          code: "PARSE_ERROR",
          debug_info: {
            raw_response: responseText,
            response_length: responseText?.length || 0,
            parse_error: parseError instanceof Error ? parseError.message : String(parseError),
          },
        },
        { status: 500 },
      )
    }

    // 성공 응답 처리 (response가 정의되어 있는지 확인)
    if (response && response.ok && result && result.next_redirect_pc_url) {
      console.log("🎉 결제준비 성공!")
      console.log("- TID:", result.tid)
      console.log("- 리다이렉트 URL:", result.next_redirect_pc_url)
      return NextResponse.json(result)
    }

    // 실패 응답 처리
    console.error("❌ 카카오페이 API 오류 응답:")
    console.error("- HTTP 상태:", response?.status || "알 수 없음")
    console.error("- 응답 내용:", result)

    // 구체적인 오류 메시지 생성
    let errorMessage = "카카오페이 결제 준비 실패"
    const errorCode = result?.code || "UNKNOWN_ERROR"

    if (result?.msg) {
      errorMessage = result.msg
    } else if (result?.message) {
      errorMessage = result.message
    } else if (result?.error_message) {
      errorMessage = result.error_message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: result,
        code: errorCode,
        suggestion: "카카오페이 개발자 콘솔에서 도메인 설정을 확인해주세요.",
        debug_info: {
          http_status: response?.status || "unknown",
          kakao_error_code: result?.code,
          kakao_error_message: result?.msg || result?.message || result?.error_message,
          request_data: kakaoPayData,
        },
      },
      { status: response?.status || 400 },
    )
  } catch (error) {
    console.error("💥 전체 프로세스 오류:", error)
    console.error("오류 스택:", error instanceof Error ? error.stack : "스택 정보 없음")

    return NextResponse.json(
      {
        error: "서버 내부 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        code: "INTERNAL_ERROR",
        suggestion: "잠시 후 다시 시도해주세요.",
        debug_info: {
          error_type: error instanceof Error ? error.constructor.name : typeof error,
          error_message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
          response_status: response?.status || "unknown",
          response_text_length: responseText?.length || 0,
        },
      },
      { status: 500 },
    )
  }
}
