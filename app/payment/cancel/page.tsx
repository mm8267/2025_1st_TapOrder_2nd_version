"use client"

import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentCancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="w-16 h-16 text-orange-500" />
          </div>
          <CardTitle className="text-xl">결제가 취소되었습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p>결제를 취소하셨습니다.</p>
            <p>다시 주문하시려면 메뉴를 선택해주세요.</p>
          </div>

          <Button className="w-full" onClick={() => router.push("/")}>
            메뉴로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
