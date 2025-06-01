"use client"

import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentFail() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-xl">결제에 실패했습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p>결제 처리 중 오류가 발생했습니다.</p>
            <p>다시 시도해주세요.</p>
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/")}>
              다시 주문하기
            </Button>
            <Button variant="outline" className="w-full" onClick={() => (window.location.href = "tel:1588-0000")}>
              고객센터 문의
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
