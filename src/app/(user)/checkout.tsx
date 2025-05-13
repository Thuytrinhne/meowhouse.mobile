"use client";

import { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "@/types/cart";
import { Address } from "@/types/address";
import { ICoupon } from "@/types/coupon";
import { SHIPPING_COST } from "@/utils/variables";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  classification: string;
}

interface DiscountVoucher {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  maxAmount: string;
}
type CouponType = "Free Ship" | "Order";

export default function CheckoutScreen() {
  const router = useRouter();

  const { from_cart } = useLocalSearchParams();
  const fromCart = from_cart === "true";

  const [products, setProducts] = useState<CartItem[]>([]);

  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [orderNote, setOrderNote] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddresses] = useState<Address>();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupons, setCoupon] = useState<ICoupon[]>([]);

  const shippingFee = SHIPPING_COST; // Fixed shipping fee
  const [selectedCoupons, setSelectedCoupons] = useState<
    Record<CouponType, ICoupon | null>
  >({
    "Free Ship": null,
    Order: null,
  });

  const [address, setAddress] = useState({
    name: "Trinh",
    phone: "0389183498",
    address:
      "Thành phố Hải Phòng, Quận Lê Chân, Phường Lam Sơn, nhà tư nnnnnnnkkjk",
    isDefault: true,
  });

  const [discountVouchers, setDiscountVouchers] = useState<DiscountVoucher[]>([
    {
      id: "1",
      title: "Khuyến mãi ngày 11/1",
      description: "Siêu ưu đãi, mua ngay giá cực hời",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212022-A1StvMxnMUTeiZXPjNjb2ObJ1ENcKR.png",
      discount: "20%",
      maxAmount: "200.000đ",
    },
    {
      id: "2",
      title: "Miễn phí vận chuyển",
      description: "Miễn phí tất cả các chi phí khi vận chuyển hàng",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212022-A1StvMxnMUTeiZXPjNjb2ObJ1ENcKR.png",
      discount: "20K",
      maxAmount: "20.000đ",
    },
  ]);

  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  // Calculate order summary
  const originalPrice = products.reduce(
    (sum, product) => sum + product.variant.variant_price * product.quantity,
    0
  );

  const productDiscount = products.reduce(
    (sum, product) =>
      sum +
      (product.variant.variant_price - product.variant.variant_price) *
        product.quantity,
    0
  );

  const voucherDiscount = 0;
  const shippingDiscount = 0;

  const totalPrice =
    originalPrice -
    productDiscount +
    shippingFee -
    voucherDiscount -
    shippingDiscount;

  useEffect(() => {
    const loadCheckoutItems = async () => {
      try {
        const data = await AsyncStorage.getItem("checkoutItems");
        if (data) {
          const parsed = JSON.parse(data);
          setProducts(parsed);
        }
      } catch (err) {
        console.error("❌ Failed to load checkout items:", err);
      }
    };

    loadCheckoutItems();
  }, []);
  const handleOrder = async (): Promise<void> => {
    // if (!validateInputs()) return; // Validate user inputs

    try {
      // if (!productInfo || productInfo.length === 0) {
      //   alert("Không có sản phẩm nào để đặt hàng!");
      //   return;
      // }

      // Generate a unique order ID
      // const orderId = `DH${Date.now()}${
      //   session
      //     ? `.${session.user.id}`
      //     : `.guest${userPhone}_${Math.round(Math.random() * 1000)}`
      // }`;

      const orderId = `DH${Date.now()}${`.guest${userPhone}_${Math.round(
        Math.random() * 1000
      )}`}`;

      // Prepare order products data
      const orderProducts = products.map((product: any) => ({
        product_hashed_id: product.product_hashed_id,
        variant_id: product.product_variant._id,
        quantity: product.quantity,
        unit_price: product.product_variant.variant_price,
        discount_percent: product.product_variant.variant_discount_percent,
      }));

      // Define payment data structure
      const newPaymentData = {
        order_id: orderId,
        // user_id: session ? session.user.id : undefined,
        order_products: orderProducts,
        order_buyer: {
          name: userName,
          phone_number: userPhone,
          address: {
            province: selectedCity,
            district: selectedDistrict,
            ward: selectedWard,
            street: streetAddress,
          },
        },
        order_note: orderNote || "",
        shipping_cost: shippingFee,
        payment_method: paymentMethod,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/order-history?selectedTab=unpaid`, // Cancel URL
        return_url: `${
          process.env.NEXT_PUBLIC_FRONTEND_URL
        }/order-success?orderId=${encodeURIComponent(orderId)}`, // Success redirect
        from_cart: fromCart,
        // applied_coupons: Object.values(selectedCoupons)
        //   .filter(Boolean)
        //   .map((coupon) => coupon.coupon_hashed_id),
      };
      // console.log("dataaaaaaaaa neeeeee", newPaymentData);
      if (paymentMethod === "cod") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/payos/create-payment-link`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newPaymentData, mobile: false }),
          }
        );
        console.log("ressponse", response);
        if (response.ok) {
          // router.push({
          //   pathname: "/order-success",
          //   params: { orderId: newPaymentData.order_id },
          // });
          console.log("order success", response.formData);
          return;
        }
      }
      // Save payment data to local storage
      localStorage.setItem("paymentData", JSON.stringify(newPaymentData));
      // // Redirect to the payment page
      // router.push("/payment");
    } catch (error) {
      console.error("Error processing the order:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="light" />

      {/* Header */}
      <View className="bg-[#1E5245] p-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            className="w-10 h-10 mr-2"
          />
          <Text className="text-lg font-bold text-white">CATCORNER</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-white shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <TextInput placeholder="Bạn tìm gì..." className="flex-1 text-sm" />
          <TouchableOpacity className="bg-[#1E5245] rounded-lg p-2">
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-3">
            <Ionicons name="cart-outline" size={24} color="#1E5245" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <Text className="text-[10px] text-white font-bold">
                {products.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Products Section */}
        <View className="bg-white mb-2">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-center">
              Sản phẩm đặt mua
            </Text>
          </View>

          {products.map((product) => (
            <View
              key={product.productId}
              className="p-4 flex-row border-b border-gray-100 bg-green-50"
            >
              <Image
                source={{ uri: product.variant.variant_img }}
                className="w-16 h-16 rounded-md"
                resizeMode="contain"
              />

              <View className="flex-1 ml-3">
                <Text className="font-medium text-gray-800">
                  {product.name}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {product.variant.variant_name}
                </Text>

                <View className="flex-row justify-between items-center mt-2">
                  <View>
                    <Text className="text-xs text-gray-500 line-through">
                      {formatPrice(product.variant.variant_price)}
                    </Text>
                    <Text className="text-sm font-bold text-gray-800">
                      {formatPrice(product.variant.variant_price)}
                    </Text>
                  </View>

                  <Text className="text-gray-600">x{product.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Information */}
        <View className="bg-white mb-2">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-center">
              Thông tin nhận hàng
            </Text>
          </View>

          <View className="p-4">
            <View className="flex-row items-start">
              <Ionicons name="location-outline" size={20} color="#4B5563" />
              <Text className="font-bold text-gray-800 ml-2">
                Địa chỉ nhận hàng
              </Text>

              <View className="flex-row ml-auto">
                <View className="bg-gray-200 rounded-md px-2 py-1 mr-2">
                  <Text className="text-xs text-gray-600">Mặc định</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-sm text-blue-500">Thay Đổi</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="ml-7 mt-2">
              <Text className="text-gray-800">
                {address.name} - {address.phone}
              </Text>
              <Text className="text-gray-600 mt-1">{address.address}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white mb-2">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={20} color="#4B5563" />
              <Text className="font-bold text-gray-800 ml-2">
                Phương thức thanh toán
              </Text>
            </View>
          </View>

          <View className="p-4">
            <TouchableOpacity
              className="flex-row items-center p-3 border border-gray-200 rounded-md mb-2"
              onPress={() => setPaymentMethod("cod")}
            >
              <View className="w-6 h-6 rounded-full border border-gray-400 mr-3 items-center justify-center">
                {paymentMethod === "cod" && (
                  <View className="w-4 h-4 rounded-full bg-[#1E5245]" />
                )}
              </View>
              <Ionicons
                name="cash-outline"
                size={20}
                color="#4B5563"
                className="mr-2"
              />
              <Text className="text-gray-800">
                Thanh toán khi nhận hàng (COD)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-3 border border-gray-200 rounded-md"
              onPress={() => setPaymentMethod("online")}
            >
              <View className="w-6 h-6 rounded-full border border-gray-400 mr-3 items-center justify-center">
                {paymentMethod === "online" && (
                  <View className="w-4 h-4 rounded-full bg-[#1E5245]" />
                )}
              </View>
              <Ionicons
                name="card-outline"
                size={20}
                color="#4B5563"
                className="mr-2"
              />
              <Text className="text-gray-800">Thanh toán online</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount Vouchers */}
        <View className="bg-white mb-2">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-center">
              Phiếu giảm giá
            </Text>
          </View>

          <View className="p-4">
            <Text className="font-medium text-gray-800 mb-2">
              Giảm giá đơn hàng
            </Text>

            <TouchableOpacity className="flex-row items-center justify-between p-3 border border-gray-200 rounded-md mb-4">
              <View className="flex-row items-center">
                <Ionicons name="ticket-outline" size={20} color="#4B5563" />
                <Text className="text-gray-600 ml-2">Chọn mã giảm giá</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>

            {discountVouchers.map((voucher, index) => (
              <View key={voucher.id} className="mb-4">
                {index === 1 && (
                  <Text className="font-medium text-gray-800 mb-2">
                    Miễn phí vận chuyển
                  </Text>
                )}

                <View className="flex-row border border-gray-200 rounded-md overflow-hidden">
                  <Image
                    source={{ uri: voucher.image }}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />

                  <View className="flex-1 p-3 justify-center">
                    <Text className="font-medium text-gray-800">
                      {voucher.title}
                    </Text>
                    <Text className="text-xs text-gray-600 mt-1">
                      {voucher.description}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Tối đa: {voucher.maxAmount}
                    </Text>
                  </View>

                  <View className="w-16 bg-orange-500 items-center justify-center">
                    <Text className="text-white font-bold text-lg">
                      {voucher.discount}
                    </Text>
                  </View>
                </View>

                {index === 0 && (
                  <TouchableOpacity className="flex-row items-center justify-between p-3 border border-gray-200 rounded-md mt-4">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="ticket-outline"
                        size={20}
                        color="#4B5563"
                      />
                      <Text className="text-gray-600 ml-2">
                        Chọn mã giảm giá
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#4B5563"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white mb-4 p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giá gốc</Text>
            <Text className="font-medium">{formatPrice(originalPrice)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giảm giá</Text>
            <Text className="font-medium text-red-500">
              -{formatPrice(productDiscount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phí vận chuyển</Text>
            <Text className="font-medium">{formatPrice(shippingFee)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Mã giảm giá</Text>
            <Text className="font-medium text-red-500">
              -{formatPrice(voucherDiscount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Miễn phí vận chuyển</Text>
            <Text className="font-medium text-red-500">
              -{formatPrice(shippingDiscount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-bold">Tổng tiền</Text>
            <Text className="font-bold text-lg text-[#1E5245]">
              {formatPrice(totalPrice)}
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity className="bg-[#1E5245] py-3 rounded-md">
            <Text className="text-white font-bold text-center">Đặt hàng</Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-center mt-4">
            Bằng việc tiến hành đặt hàng, bạn đồng ý với{" "}
            <Text className="text-blue-500">Điều khoản dịch vụ</Text> và{" "}
            <Text className="text-blue-500">Chính sách bảo mật</Text> của
            CatCorner.
          </Text>
        </View>
      </ScrollView>

      {/* Chat Button */}
      <View className="absolute bottom-4 right-4">
        <TouchableOpacity className="bg-[#1E5245] w-14 h-14 rounded-full items-center justify-center shadow-md">
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
