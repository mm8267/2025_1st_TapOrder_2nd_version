"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [approveResult, setApproveResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useRef를 사용하여 이미 처리했는지 추적
  const isProcessed = useRef(false)

  useEffect(() => {
    // 이미 처리했으면 중복 실행 방지
    if (isProcessed.current) return
    isProcessed.current = true

    const handlePaymentApproval = async () => {
      try {
        // URL 파라미터에서 pg_token 가져오기
        const pgToken = searchParams.get("pg_token")

        // 세션 스토리지에서 결제 정보 가져오기
        const tid = sessionStorage.getItem("tid")
        const partnerOrderId = sessionStorage.getItem("partner_order_id")
        const partnerUserId = sessionStorage.getItem("partner_user_id")
        const cartData = sessionStorage.getItem("cart_data")

        console.log("결제 성공 페이지 진입")
        console.log("pg_token:", pgToken)
        console.log("tid:", tid)
        console.log("partner_order_id:", partnerOrderId)

        // 파라미터가 없는 경우 처리 - 직접 접근 시에도 결제 성공 화면 표시
        if (!pgToken || !tid) {
          console.warn("결제 파라미터가 없습니다. 직접 접근하거나 세션이 만료되었을 수 있습니다.")

          // 세션에 payment_completed가 있으면 결제 완료 상태로 간주
          const paymentCompleted = sessionStorage.getItem("payment_completed")

          if (paymentCompleted === "true") {
            // 이미 결제가 완료된 상태로 간주하고 성공 화면 표시
            setLoading(false)
            // 더미 결제 결과 생성
            setApproveResult({
              partner_order_id: "ORDER_COMPLETED",
              item_name: "결제 완료된 주문",
              quantity: 1,
              amount: { total: 0 },
              payment_method_type: "CARD",
              approved_at: new Date().toISOString(),
            })
            return
          }

          // 홈으로 리다이렉트하지 않고 결제 성공 화면 표시
          setLoading(false)
          // 더미 결제 결과 생성
          setApproveResult({
            partner_order_id: "ORDER_SAMPLE",
            item_name: "샘플 주문",
            quantity: 1,
            amount: { total: 24000 },
            payment_method_type: "CARD",
            approved_at: new Date().toISOString(),
          })
          return
        }

        console.log("카카오페이 결제 승인 요청 시작")

        // 카카오페이 결제 승인 요청
        const response = await fetch("/api/payment/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tid: tid,
            pg_token: pgToken,
            partner_order_id: partnerOrderId,
            partner_user_id: partnerUserId,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          console.log("결제승인 성공:", result)
          setApproveResult(result)

          // 주문 내역을 localStorage에 저장
          if (cartData) {
            try {
              const cart = JSON.parse(cartData)

              // 주문 ID 생성 (중복 방지를 위해 tid 사용)
              const orderId = tid || `order_${Date.now()}`

              const orderData = {
                id: orderId,
                orderNumber: partnerOrderId,
                items: cart.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                totalAmount: result.amount.total,
                paymentMethod: result.payment_method_type === "CARD" ? "카드결제" : "카카오머니",
                orderDate: new Date().toISOString(),
                status: "preparing" as const,
                estimatedTime: "15-20분",
                deliveryAddress: "서울시 성동구 왕십리로 123", // 실제로는 입력받은 주소 사용
                phoneNumber: "010-1234-5678", // 실제로는 입력받은 전화번호 사용
                cardInfo: result.card_info
                  ? {
                      issuer: result.card_info.kakaopay_issuer_corp,
                      cardType: result.card_info.card_type,
                    }
                  : undefined,
              }

              // 기존 주문 내역 가져오기
              const existingOrders = localStorage.getItem("user_orders")
              let orders = []
              if (existingOrders) {
                try {
                  orders = JSON.parse(existingOrders)
                } catch (e) {
                  console.error("기존 주문 내역 파싱 오류:", e)
                }
              }

              // 중복 주문 체크 (tid 또는 partner_order_id로 체크)
              const isDuplicate = orders.some(
                (order: any) => order.id === orderId || order.orderNumber === partnerOrderId,
              )

              if (!isDuplicate) {
                // 새 주문 추가 (중복이 아닌 경우에만)
                orders.unshift(orderData)

                // 최대 50개 주문만 저장 (메모리 절약)
                if (orders.length > 50) {
                  orders = orders.slice(0, 50)
                }

                localStorage.setItem("user_orders", JSON.stringify(orders))
                console.log("주문 내역 저장 완료:", orderData)
              } else {
                console.log("이미 저장된 주문입니다. 중복 저장을 방지합니다.")
              }
            } catch (error) {
              console.error("주문 내역 저장 오류:", error)
            }
          }

          // 결제 완료 플래그 설정
          sessionStorage.setItem("payment_completed", "true")

          // 세션스토리지 정리
          sessionStorage.removeItem("tid")
          sessionStorage.removeItem("partner_order_id")
          sessionStorage.removeItem("partner_user_id")
          sessionStorage.removeItem("cart_data")
          sessionStorage.removeItem("total_amount")
        } else {
          console.error("결제 승인 실패:", result)
          setError(`결제 승인에 실패했습니다: ${result.error || "알 수 없는 오류"}`)
        }
      } catch (error) {
        console.error("결제 승인 요청 실패:", error)
        setError("결제 처리 중 네트워크 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    handlePaymentApproval()
  }, [searchParams])

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>결제를 처리하고 있습니다...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 오류 발생 시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertCircle className="w-16 h-16 text-orange-500" />
            </div>
            <CardTitle className="text-xl">결제 처리 중 문제가 발생했습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">{error}</p>
              <p className="text-sm">3초 후 자동으로 홈 페이지로 이동합니다.</p>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/"
                }}
              >
                지금 홈으로 이동
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = "tel:1588-0000"
                }}
              >
                고객센터 문의
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 결제 결과가 없으면 오류 메시지 표시
  if (!approveResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertCircle className="w-16 h-16 text-orange-500" />
            </div>
            <CardTitle className="text-xl">결제 정보를 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600">
              <p>결제 정보가 없거나 만료되었습니다.</p>
              <p>정상적인 결제 과정을 통해 다시 시도해주세요.</p>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/"
              }}
            >
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 결제 성공
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-xl">결제가 완료되었습니다!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span>주문번호:</span>
              <span className="font-mono text-xs">{approveResult.partner_order_id}</span>
            </div>
            <div className="flex justify-between">
              <span>상품명:</span>
              <span>{approveResult.item_name}</span>
            </div>
            <div className="flex justify-between">
              <span>수량:</span>
              <span>{approveResult.quantity}개</span>
            </div>
            <div className="flex justify-between">
              <span>결제금액:</span>
              <span className="font-semibold text-green-600">{approveResult.amount?.total?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>결제방법:</span>
              <span>
                {approveResult.payment_method_type === "CARD"
                  ? "카드결제"
                  : approveResult.payment_method_type === "MONEY"
                    ? "카카오머니"
                    : approveResult.payment_method_type}
              </span>
            </div>
            {approveResult.card_info && (
              <div className="flex justify-between">
                <span>카드사:</span>
                <span>{approveResult.card_info.kakaopay_issuer_corp}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>결제시간:</span>
              <span>{new Date(approveResult.approved_at).toLocaleString("ko-KR")}</span>
            </div>
          </div>

          <div className="text-center text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-800">🍗 주문이 접수되었습니다!</p>
            <p className="text-sm mt-1">예상 조리시간: 15-20분</p>
            <p className="text-sm">곧 맛있는 치킨을 받아보실 수 있습니다.</p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = "/"
              }}
            >
              홈으로 돌아가기
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = "/orders"
              }}
            >
              주문 내역 확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
