"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Search, Share, ShoppingCart, Plus, Minus, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CallStaffButton } from "@/components/call-staff-button"
import { Toaster } from "@/components/toaster"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  popular?: boolean
  rank?: number
  reviews: number
  category: string
}

interface CartItem extends MenuItem {
  quantity: number
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "[그.유.명.한] 슈프림 양념치킨",
    description: "[순살/뼈/다리/날개/콤보 선택]\n치킨 + 치킨무 + 콜라 245ml",
    price: 24000,
    image: "/placeholder1.jpg?height=120&width=120&text=슈프림치킨",
    popular: true,
    rank: 1,
    reviews: 974,
    category: "추천 메뉴",
  },
  {
    id: 2,
    name: "[내.맘.대.로] 반반 치킨 (맛 2가지 선택)",
    description: "[순살 / 뼈 / 다리 / 날개 / 콤보 선택]\n반반 치킨 + 치킨무 + 콜라 245ml",
    price: 21000,
    image: "/placeholder2.jpg?height=120&width=120&text=반반치킨",
    popular: true,
    rank: 2,
    reviews: 557,
    category: "반 / 반치킨",
  },
  {
    id: 3,
    name: "[지.킨.의.원.조] 후라이드 치킨",
    description: "[순살/뼈/다리/날개/콤보 선택]\n치킨 + 치킨무 + 콜라 245ml",
    price: 21000,
    image: "/placeholder3.jpg?height=120&width=120&text=후라이드치킨",
    popular: true,
    rank: 3,
    reviews: 289,
    category: "추천 메뉴",
  },
  {
    id: 4,
    name: "[한.마.리.씩.골.라] 두마리 세트",
    description: "뼈 : 7호닭 2마리 + 치킨무 + 콜라 500ml\n순살 : 1.5마리 + 치킨무 + 콜라 500ml",
    price: 30000,
    image: "/placeholder4.jpg?height=120&width=120&text=두마리세트",
    rank: 4,
    reviews: 174,
    category: "두마리 세트",
  },
  {
    id: 5,
    name: "[혼.밥.골.파.왕] 순살 1인 실속세트",
    description: "순살 (반마리) +라이스 (슈프림/와락/핫슈프림 택1) + 치킨무 + 콜라 245ml",
    price: 18000,
    image: "/placeholder5.jpg?height=120&width=120&text=1인세트",
    rank: 5,
    reviews: 127,
    category: "추천 메뉴",
  },
  {
    id: 6,
    name: "[[부.위.별.로.골.라]] 두마리 세트\n부위별",
    description: "다리세트: 다리12개 + 치킨무 + 콜라 500ml\n콤보세트: 다리 8개 + 윙봉 16개 + 치킨무 + 콜라 500ml",
    price: 35000,
    image: "/placeholder4.jpg?height=120&width=120&text=두마리특가",
    reviews: 89,
    category: "두마리 세트",
  },
]

export default function ChickenRestaurant() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("추천 메뉴")
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showKakaoGuide, setShowKakaoGuide] = useState(false)

  // 재주문 처리
  useEffect(() => {
    const reorderCart = localStorage.getItem("reorder_cart")
    if (reorderCart) {
      try {
        const items = JSON.parse(reorderCart)
        setCart(items)
        localStorage.removeItem("reorder_cart")
      } catch (error) {
        console.error("재주문 데이터 파싱 오류:", error)
      }
    }
  }, [])

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter((item) => item !== null) // null인 항목들을 제거
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // 필터링된 메뉴 아이템
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // 공유하기 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "처갓집양념치킨 왕십리점",
          text: "맛있는 치킨을 주문해보세요!",
          url: window.location.href,
        })
      } catch (error) {
        console.log("공유 취소됨")
      }
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("링크가 클립보드에 복사되었습니다!")
      } catch (error) {
        alert("공유 기능을 사용할 수 없습니다.")
      }
    }
  }

  const handleKakaoPayment = async () => {
    if (cart.length === 0) {
      alert("장바구니가 비어있습니다.")
      return
    }

    setPaymentError(null)
    setDebugInfo(null)
    setIsPaymentLoading(true)

    try {
      console.log("\n🚀 ===== 클라이언트 결제 프로세스 시작 =====")
      console.log("📱 환경 정보:")
      console.log("- 현재 URL:", window.location.href)
      console.log("- User Agent:", navigator.userAgent)
      console.log("- 온라인 상태:", navigator.onLine)
      console.log("- 화면 크기:", `${window.innerWidth}x${window.innerHeight}`)

      // 네트워크 상태 체크
      if (!navigator.onLine) {
        throw new Error("인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.")
      }

      // 실제 카카오페이 API 호출
      const paymentData = {
        partner_order_id: `ORDER_${Date.now()}`,
        partner_user_id: "chicken_user_001",
        item_name: cart.length > 1 ? `${cart[0].name} 외 ${cart.length - 1}건` : cart[0].name,
        quantity: getTotalItems(),
        total_amount: getTotalPrice(),
        tax_free_amount: 0,
      }

      console.log("📦 결제 요청 데이터:", JSON.stringify(paymentData, null, 2))

      // API 호출 시작 시간 기록
      const startTime = Date.now()
      console.log("⏰ API 호출 시작:", new Date(startTime).toISOString())

      let response
      let responseText

      try {
        response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        const endTime = Date.now()
        console.log("⏰ API 호출 완료:", new Date(endTime).toISOString())
        console.log("⏱️ 소요 시간:", `${endTime - startTime}ms`)

        console.log("📡 API 응답 정보:")
        console.log("- 상태 코드:", response.status)
        console.log("- 상태 텍스트:", response.statusText)
        console.log("- 응답 헤더:", Object.fromEntries(response.headers.entries()))

        responseText = await response.text()
        console.log("📄 API 원본 응답 (길이: " + responseText.length + "):")
        console.log(responseText)
      } catch (fetchError) {
        console.error("💥 API 호출 실패:", fetchError)
        throw new Error(`API 호출 실패: ${fetchError instanceof Error ? fetchError.message : "알 수 없는 오류"}`)
      }

      // 응답 파싱
      let result
      try {
        if (!responseText || responseText.trim() === "") {
          throw new Error("서버에서 빈 응답을 받았습니다.")
        }
        result = JSON.parse(responseText)
        console.log("✅ 응답 파싱 성공:", result)
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", parseError)
        console.error("원본 응답:", responseText)
        setDebugInfo({
          error: "JSON 파싱 실패",
          raw_response: responseText,
          parse_error: parseError instanceof Error ? parseError.message : String(parseError),
        })
        throw new Error("서버 응답을 해석할 수 없습니다.")
      }

      // 디버그 정보 저장
      setDebugInfo({
        request_data: paymentData,
        response_status: response.status,
        response_headers: Object.fromEntries(response.headers.entries()),
        response_data: result,
        timing: {
          start: startTime,
          end: Date.now(),
          duration: Date.now() - startTime,
        },
      })

      // 성공 응답 처리
      if (response.ok && result.next_redirect_pc_url) {
        console.log("🎉 결제 준비 성공!")
        console.log("- TID:", result.tid)
        console.log("- 리다이렉트 URL:", result.next_redirect_pc_url)

        // 결제 고유번호(tid)를 세션스토리지에 저장
        sessionStorage.setItem("tid", result.tid)
        sessionStorage.setItem("partner_order_id", paymentData.partner_order_id)
        sessionStorage.setItem("partner_user_id", paymentData.partner_user_id)
        sessionStorage.setItem("cart_data", JSON.stringify(cart))
        sessionStorage.setItem("total_amount", getTotalPrice().toString())

        console.log("💾 세션 데이터 저장 완료")
        console.log("🔗 카카오페이 결제 페이지로 이동...")

        // 카카오페이 결제 페이지로 리다이렉트 (현재 창에서)
        window.location.href = result.next_redirect_pc_url
        return
      }

      // 실패 응답 처리
      console.error("❌ 결제 준비 실패:")
      console.error("- HTTP 상태:", response.status)
      console.error("- 응답 데이터:", result)

      // 구체적인 오류 메시지 표시
      let errorMessage = "결제 준비에 실패했습니다."

      if (result.error) {
        errorMessage = result.error
      } else if (result.details?.error_message) {
        errorMessage = result.details.error_message
      } else if (result.details?.msg) {
        errorMessage = result.details.msg
      }

      // URL 관련 오류인 경우 카카오페이 설정 가이드 표시
      if (errorMessage.includes("사이트도메인") || errorMessage.includes("도메인 설정") || response.status === 400) {
        setShowKakaoGuide(true)
      }

      const suggestion = result.suggestion || "네트워크 연결을 확인하고 다시 시도해주세요."

      setPaymentError(`${errorMessage}\n\n${suggestion}`)

      // 디버그 정보가 있으면 추가 표시
      if (result.debug_info) {
        console.error("🔍 디버그 정보:", result.debug_info)
      }
    } catch (error) {
      console.error("💥 전체 결제 프로세스 오류:", error)
      console.error("오류 상세:", error instanceof Error ? error.message : "알 수 없는 오류")

      let errorMessage = "결제 요청 중 오류가 발생했습니다."
      if (error instanceof Error) {
        errorMessage = error.message
      }

      setPaymentError(`${errorMessage}\n\n인터넷 연결을 확인하고 다시 시도해주세요.`)
    } finally {
      setIsPaymentLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold text-lg">처갓집양념치킨 왕십리점</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">처갓집양념치킨 왕십리점</h2>

        {/* Payment Error Alert */}
        {paymentError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700 whitespace-pre-line">{paymentError}</AlertDescription>
          </Alert>
        )}

        {/* 카카오페이 설정 가이드 */}
        {showKakaoGuide && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <h3 className="font-bold mb-2">카카오페이 설정 가이드 (WiFi 네트워크 접속)</h3>
              <p className="mb-2">WiFi IP 주소로 접속할 때 카카오페이 설정:</p>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>
                  <a
                    href="https://developers.kakao.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    카카오 개발자 콘솔
                  </a>
                  에 로그인
                </li>
                <li>내 애플리케이션 선택 또는 새로 생성</li>
                <li>제품 설정 &gt; 카카오페이 &gt; 활성화 설정</li>
                <li>앱 설정 &gt; 플랫폼 &gt; Web 플랫폼 등록</li>
                <li>
                  사이트 도메인에 현재 접속 중인 IP 주소 추가:
                  <br />
                  <code className="bg-gray-200 px-1 rounded">{window.location.origin}</code>
                </li>
                <li>
                  카카오페이 &gt; Redirect URI에 다음 URL들 등록:
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      <code className="bg-gray-200 px-1 rounded">{window.location.origin}/payment/success</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">{window.location.origin}/payment/cancel</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">{window.location.origin}/payment/fail</code>
                    </li>
                  </ul>
                </li>
                <li>SECRET KEY 발급 및 환경변수 설정 확인</li>
              </ol>
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>참고:</strong> 현재 접속 중인 주소는 <code>{window.location.origin}</code>입니다. 이 주소를
                  카카오페이 개발자 콘솔에 등록해야 합니다.
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => setShowKakaoGuide(false)}>
                닫기
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info (개발 환경에서만) */}
        {debugInfo && process.env.NODE_ENV === "development" && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-700">
              <details>
                <summary className="cursor-pointer font-medium">디버그 정보 (개발자용)</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Menu Categories */}
      <div className="sticky top-16 z-40 bg-white border-b">
        <div className="flex items-center gap-4 p-4 overflow-x-auto">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {["추천 메뉴", "두마리 세트", "반 / 반치킨"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">{selectedCategory}</h3>

        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">해당 카테고리에 메뉴가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {item.rank && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            인기 {item.rank}위
                          </Badge>
                        )}
                        {item.popular && <Badge variant="secondary">사장님 추천</Badge>}
                      </div>

                      <h4 className="font-semibold mb-2 leading-tight">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold">{item.price.toLocaleString()}원</span>
                          <p className="text-sm text-gray-500">리뷰 {item.reviews}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {cart.find((cartItem) => cartItem.id === item.id) ? (
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {cart.find((cartItem) => cartItem.id === item.id)?.quantity}
                              </span>
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" onClick={() => addToCart(item)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-24 h-24 m-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Two Chicken Set Info */}
        {selectedCategory === "두마리 세트" && (
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">[ 두마리 세트 ]</h4>
              <p className="text-sm text-gray-600">
                한마리로 부족하고 두 마리는 부담스러울때! 부담스러울때! 부담없이 즐길수 있는 완전 구성입니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>메뉴 검색</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="메뉴명을 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {searchQuery && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {menuItems
                  .filter(
                    (item) =>
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedCategory(item.category)
                        setIsSearchOpen(false)
                        setSearchQuery("")
                      }}
                    >
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.price.toLocaleString()}원</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>장바구니</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">장바구니가 비어있습니다.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.price.toLocaleString()}원</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>총 결제금액</span>
                  <span>{getTotalPrice().toLocaleString()}원</span>
                </div>
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                  onClick={() => {
                    setIsCartOpen(false)
                    handleKakaoPayment()
                  }}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? "결제 준비 중..." : "카카오페이로 결제하기"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Bottom Sheet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">총 {getTotalItems()}개</p>
              <p className="text-lg font-bold">{getTotalPrice().toLocaleString()}원</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black" id="btn-pay-ready">
                  카카오페이로 결제
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>주문 확인</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">수량: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString()}원</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>총 결제금액</span>
                    <span>{getTotalPrice().toLocaleString()}원</span>
                  </div>

                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                    onClick={handleKakaoPayment}
                    disabled={isPaymentLoading}
                  >
                    {isPaymentLoading ? "결제 준비 중..." : "카카오페이로 결제하기"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* 직원 호출 버튼 */}
      <CallStaffButton />

      {/* 토스트 메시지 표시 */}
      <Toaster />
    </div>
  )
}
