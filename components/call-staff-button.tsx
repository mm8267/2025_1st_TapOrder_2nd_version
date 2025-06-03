"use client"

import { useState, useEffect } from "react"
<<<<<<< HEAD
import { Bell, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
=======
import { Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182

interface CallStaffButtonProps {
  className?: string
  fixed?: boolean
}

export function CallStaffButton({ className, fixed = true }: CallStaffButtonProps) {
<<<<<<< HEAD
  const [status, setStatus] = useState<"idle" | "calling" | "called" | "error">("idle")
  const [cooldown, setCooldown] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tableId, setTableId] = useState("")
  const [message, setMessage] = useState("")
  const [reason, setReason] = useState("help")
  const [customerName, setCustomerName] = useState("")
=======
  const [status, setStatus] = useState<"idle" | "calling" | "called">("idle")
  const [cooldown, setCooldown] = useState(0)
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182

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

<<<<<<< HEAD
  // 테이블 ID 자동 생성 (실제로는 QR 코드나 다른 방법으로 설정할 수 있음)
  useEffect(() => {
    // 랜덤 테이블 번호 생성 (1~20)
    const randomTable = Math.floor(Math.random() * 20) + 1
    setTableId(`T${randomTable}`)
  }, [])

  const handleCallStaff = async () => {
    if (status !== "idle") return
    setIsDialogOpen(false)
=======
  const handleCallStaff = () => {
    if (status !== "idle") return
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182

    // 호출 상태로 변경
    setStatus("calling")

<<<<<<< HEAD
    // 호출 사유에 따른 메시지 설정
    let finalMessage = message
    if (!finalMessage.trim()) {
      switch (reason) {
        case "water":
          finalMessage = "물이 필요합니다."
          break
        case "utensils":
          finalMessage = "수저가 필요합니다."
          break
        case "order":
          finalMessage = "추가 주문을 하고 싶습니다."
          break
        case "bill":
          finalMessage = "계산서를 요청합니다."
          break
        default:
          finalMessage = "도움이 필요합니다."
      }
    }

    try {
      // 서버에 직원 호출 요청을 보내는 API 호출
      const response = await fetch("/api/call-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId,
          message: finalMessage,
          customerName: customerName || "고객",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // 성공적으로 호출됨
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
      } else {
        // API 호출은 성공했지만 서버에서 오류 반환
        throw new Error(data.message || "직원 호출에 실패했습니다.")
      }
    } catch (error) {
      console.error("직원 호출 오류:", error)
      setStatus("error")

      // 오류 토스트 메시지
      toast({
        title: "직원 호출 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
        duration: 5000,
      })

      // 3초 후 다시 idle 상태로
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    }
  }

  // 간단 호출 (다이얼로그 없이)
  const handleQuickCall = () => {
    if (status !== "idle") return
    handleCallStaff()
=======
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
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182
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
<<<<<<< HEAD
      case "error":
        return (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            호출 실패
          </>
        )
=======
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182
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
<<<<<<< HEAD
      case "error":
        return "bg-red-500 hover:bg-red-500 text-white"
=======
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182
      default:
        return "bg-orange-500 hover:bg-orange-600 text-white"
    }
  }

<<<<<<< HEAD
  const callButton = (
    <Button
      onClick={status === "idle" ? (fixed ? handleQuickCall : () => setIsDialogOpen(true)) : undefined}
      disabled={status !== "idle"}
      className={cn("shadow-lg", getButtonStyle(), className)}
      size="lg"
    >
      {getButtonContent()}
    </Button>
  )

  if (fixed) {
    return (
      <>
        <div className="fixed bottom-24 right-4 z-50">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{callButton}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>직원 호출</DialogTitle>
                <DialogDescription>필요한 사항을 선택하거나 입력해주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    테이블
                  </Label>
                  <Input
                    id="table"
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    className="col-span-3"
                    placeholder="테이블 번호"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    이름
                  </Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="col-span-3"
                    placeholder="(선택) 이름을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    요청사항
                  </Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="도움이 필요합니다" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="help">도움이 필요합니다</SelectItem>
                      <SelectItem value="water">물 요청</SelectItem>
                      <SelectItem value="utensils">수저 요청</SelectItem>
                      <SelectItem value="order">추가 주문</SelectItem>
                      <SelectItem value="bill">계산서 요청</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {reason === "other" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right">
                      메시지
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="col-span-3"
                      placeholder="필요한 사항을 입력하세요"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCallStaff}>
                  직원 호출하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* 빠른 호출 버튼 (다이얼로그 없이) */}
        <div className="fixed bottom-24 right-4 z-50">{callButton}</div>
      </>
=======
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
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182
    )
  }

  return (
<<<<<<< HEAD
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{callButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>직원 호출</DialogTitle>
          <DialogDescription>필요한 사항을 선택하거나 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="table" className="text-right">
              테이블
            </Label>
            <Input
              id="table"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="col-span-3"
              placeholder="테이블 번호"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3"
              placeholder="(선택) 이름을 입력하세요"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              요청사항
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="도움이 필요합니다" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="help">도움이 필요합니다</SelectItem>
                <SelectItem value="water">물 요청</SelectItem>
                <SelectItem value="utensils">수저 요청</SelectItem>
                <SelectItem value="order">추가 주문</SelectItem>
                <SelectItem value="bill">계산서 요청</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {reason === "other" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                메시지
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
                placeholder="필요한 사항을 입력하세요"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCallStaff}>
            직원 호출하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
=======
    <Button onClick={handleCallStaff} disabled={status !== "idle"} className={cn(getButtonStyle(), className)}>
      {getButtonContent()}
    </Button>
>>>>>>> ca61e5b912acbe0896a4830d165271adaf335182
  )
}
