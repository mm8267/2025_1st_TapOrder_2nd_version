"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle, Utensils, Server, Star, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  orderDate: string
  status: "preparing" | "cooking" | "served" | "completed" | "cancelled"
  estimatedTime?: string
  deliveryAddress?: string
  phoneNumber?: string
  cardInfo?: {
    issuer: string
    cardType: string
  }
  review?: {
    rating: number
    comment: string
    date: string
  }
}

const getStatusInfo = (status: Order["status"]) => {
  switch (status) {
    case "preparing":
      return {
        label: "주문접수",
        color: "bg-blue-100 text-blue-700",
        icon: <Clock className="w-4 h-4" />,
      }
    case "cooking":
      return {
        label: "조리중",
        color: "bg-orange-100 text-orange-700",
        icon: <Utensils className="w-4 h-4" />,
      }
    case "served":
      return {
        label: "서빙완료",
        color: "bg-purple-100 text-purple-700",
        icon: <Server className="w-4 h-4" />,
      }
    case "completed":
      return {
        label: "완료",
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
      }
    case "cancelled":
      return {
        label: "주문취소",
        color: "bg-gray-100 text-gray-700",
        icon: <Clock className="w-4 h-4" />,
      }
    default:
      return {
        label: "알 수 없음",
        color: "bg-gray-100 text-gray-700",
        icon: <Clock className="w-4 h-4" />,
      }
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  useEffect(() => {
    // localStorage에서 실제 결제된 주문 내역만 가져옵니다
    // 기존 주문 내역을 삭제하는 코드 제거
    const savedOrders = localStorage.getItem("user_orders")
    let userOrders: Order[] = []

    if (savedOrders) {
      try {
        userOrders = JSON.parse(savedOrders)
        console.log("불러온 주문 내역:", userOrders)
      } catch (error) {
        console.error("주문 내역 파싱 오류:", error)
      }
    } else {
      console.log("저장된 주문 내역이 없습니다.")
    }

    // 날짜순으로 정렬 (최신순)
    userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

    setOrders(userOrders)
  }, [])

  const handleReviewSubmit = (orderId: string) => {
    if (!reviewComment.trim()) {
      alert("리뷰 내용을 입력해주세요.")
      return
    }

    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          review: {
            rating: reviewRating,
            comment: reviewComment,
            date: new Date().toISOString(),
          },
        }
      }
      return order
    })

    setOrders(updatedOrders)
    setReviewRating(5)
    setReviewComment("")

    // localStorage에 업데이트된 주문 저장
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders))

    alert("리뷰가 등록되었습니다!")
  }

  const handleReorder = (order: Order) => {
    // 장바구니에 주문 항목들을 다시 추가
    const cartItems = order.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: "",
      price: item.price,
      image: `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(item.name)}`,
      quantity: item.quantity,
      reviews: 0,
    }))

    localStorage.setItem("reorder_cart", JSON.stringify(cartItems))
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="font-semibold text-lg">주문 내역</h1>
            <div className="w-6" />
          </div>
        </header>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
          <Utensils className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">주문 내역이 없습니다</h2>
          <p className="text-gray-500 text-center mb-6">
            아직 주문하신 내역이 없어요.
            <br />
            맛있는 치킨을 주문해보세요!
          </p>
          <Button onClick={() => router.push("/")} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            메뉴 보러가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold text-lg">주문 내역</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status)

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={statusInfo.color}>
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                    {order.estimatedTime && (
                      <span className="text-sm text-gray-600">약 {order.estimatedTime} 소요</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-600">{order.orderNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    상세보기
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total Amount */}
                  <div className="flex justify-between items-center font-bold">
                    <span>총 결제금액</span>
                    <span className="text-lg">{order.totalAmount.toLocaleString()}원</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleReorder(order)}>
                      재주문
                    </Button>
                    {order.status === "served" && !order.review && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">리뷰 작성</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>리뷰 작성</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>별점</Label>
                              <div className="mt-2">{renderStars(reviewRating, true, setReviewRating)}</div>
                            </div>
                            <div>
                              <Label htmlFor="review">리뷰 내용</Label>
                              <Textarea
                                id="review"
                                placeholder="음식은 어떠셨나요? 솔직한 리뷰를 남겨주세요."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="mt-2"
                              />
                            </div>
                            <Button
                              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                              onClick={() => handleReviewSubmit(order.id)}
                            >
                              리뷰 등록
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {order.review && (
                      <div className="flex-1 text-center py-2">
                        <span className="text-sm text-green-600">✓ 리뷰 작성 완료</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>주문 상세 정보</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Order Status */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getStatusInfo(selectedOrder.status).icon}
                  <span className="font-semibold">{getStatusInfo(selectedOrder.status).label}</span>
                </div>
                {selectedOrder.estimatedTime && (
                  <p className="text-sm text-gray-600">예상 소요시간: {selectedOrder.estimatedTime}</p>
                )}
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">주문번호</Label>
                  <p className="font-mono text-sm">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">주문일시</Label>
                  <p className="text-sm">{formatDate(selectedOrder.orderDate)}</p>
                </div>
                {selectedOrder.deliveryAddress && (
                  <div>
                    <Label className="text-sm font-medium">주소</Label>
                    <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}
                {selectedOrder.phoneNumber && (
                  <div>
                    <Label className="text-sm font-medium">연락처</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedOrder.phoneNumber}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => (window.location.href = `tel:${selectedOrder.phoneNumber}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <Label className="text-sm font-medium">주문 메뉴</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>결제방법</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.cardInfo && (
                  <div className="flex justify-between">
                    <span>카드정보</span>
                    <span>
                      {selectedOrder.cardInfo.issuer} ({selectedOrder.cardInfo.cardType})
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제금액</span>
                  <span>{selectedOrder.totalAmount.toLocaleString()}원</span>
                </div>
              </div>

              {/* Review Section */}
              {selectedOrder.review && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">내가 작성한 리뷰</Label>
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(selectedOrder.review.rating)}
                        <span className="text-sm text-gray-500">{formatDate(selectedOrder.review.date)}</span>
                      </div>
                      <p className="text-sm">{selectedOrder.review.comment}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
