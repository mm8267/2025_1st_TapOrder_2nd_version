"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface CallStaffButtonProps {
  className?: string
  fixed?: boolean
}

export function CallStaffButton({ className, fixed = true }: CallStaffButtonProps) {
  const [status, setStatus] = useState<"idle" | "calling" | "called">("idle")
  const [cooldown, setCooldown] = useState(0)

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setStatus("idle")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleCallStaff = () => {
    if (status !== "idle") return

    // 호출 상태로 변경
    setStatus("calling")

    // 서버에 직원 호출 요청을 보내는 API 호출 (실제로는 서버와 통신)
    // 여기서는 시뮬레이션만 구현
    setTimeout(() => {
      setStatus("called")
      setCooldown(60) // 60초 쿨다운

      // 토스트 메시지로 알림
      toast({
        title: "직원 호출 완료",
        description: "곧 직원이 도착할 예정입니다.",
        duration: 3000,
      })

      // 진동 효과 (지원하는 기기에서만)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }, 1500)
  }

  // 버튼 텍스트 및 아이콘 결정
  const getButtonContent = () => {
    switch (status) {
      case "calling":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            직원 호출 중...
          </>
        )
      case "called":
        return (
          <>
            <Check className="mr-2 h-4 w-4" />
            {cooldown > 0 ? `${cooldown}초 후 재호출 가능` : "직원 호출 완료"}
          </>
        )
      default:
        return (
          <>
            <Bell className="mr-2 h-4 w-4" />
            직원 호출
          </>
        )
    }
  }

  // 버튼 스타일 결정
  const getButtonStyle = () => {
    switch (status) {
      case "calling":
        return "bg-yellow-400 hover:bg-yellow-400 text-black"
      case "called":
        return "bg-green-500 hover:bg-green-500 text-white"
      default:
        return "bg-orange-500 hover:bg-orange-600 text-white"
    }
  }

  if (fixed) {
    return (
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          onClick={handleCallStaff}
          disabled={status !== "idle"}
          className={cn("shadow-lg", getButtonStyle(), className)}
          size="lg"
        >
          {getButtonContent()}
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleCallStaff} disabled={status !== "idle"} className={cn(getButtonStyle(), className)}>
      {getButtonContent()}
    </Button>
  )
}
