"use client";

import { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { ProductDetail, ProductVariant } from "@/types/product";
import { fetchProductDetail } from "@/api/productApi";
import HTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
type ProductDescriptionProps = {
  product_description: string;
};

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product_description,
}) => {
  // Chuyển đổi dữ liệu HTML mã hóa (có dạng unicode) thành chuỗi HTML bình thường
  const decodedDescription = product_description
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\n/g, "\n"); // Optional: thay đổi ký tự newline nếu cần

  return (
    <ScrollView style={{ padding: 10 }}>
      <HTML source={{ html: decodedDescription }} />
    </ScrollView>
  );
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  console.log("ID nhận được:", id);

  const [activeTab, setActiveTab] = useState("info");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    // Làm tròn đến số nguyên
    const roundedPrice = Math.round(price);

    // Sử dụng Intl.NumberFormat với định dạng "vi-VN" nhưng bỏ phần thập phân
    return (
      new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
        roundedPrice
      ) + " đ"
    );
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      scrollToIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (product && currentImageIndex < product.product_imgs.length - 1) {
      scrollToIndex(currentImageIndex + 1);
    }
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setCurrentImageIndex(index);
  };

  const handleToggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  useEffect(() => {
    const loadProduct = async () => {
      const productId = Array.isArray(id) ? id[0] : id;
      const fetchedProduct = await fetchProductDetail(productId);
      setProduct(fetchedProduct);
      console.log("fetch", fetchedProduct);
      setLoading(false);
    };
    loadProduct();
  }, [id]);
  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const productId = product?._id;
      const selectedVariant = product?.product_variants[0]; // Tùy chọn variant

      const newItem = {
        productId,
        name: product?.product_name,
        quantity,
        variant: selectedVariant,
      };

      console.log("🛒 New item to add:", newItem);

      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];

      console.log("📦 Current cart data:", cart);

      const index = cart.findIndex(
        (item: any) =>
          item.productId === newItem.productId &&
          item.variant?._id === newItem.variant?._id
      );

      console.log("🔍 Found index in cart:", index);

      if (index !== -1) {
        cart[index].quantity += quantity;
        console.log("✏️ Updated quantity:", cart[index].quantity);
      } else {
        cart.push(newItem);
        console.log("➕ Added new item to cart.");
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log("✅ Cart saved:", cart);

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              <Text className="text-[10px] text-white font-bold">2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Image Slider */}
        <View className="relative">
          <FlatList
            ref={flatListRef}
            data={product?.product_imgs}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentImageIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={{ width, height: 400 }}>
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                <View className="absolute top-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded">
                  <Text className="text-white text-xs">
                    {currentImageIndex + 1}/{product?.product_imgs.length}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Navigation Arrows */}
          <TouchableOpacity
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md"
            onPress={handlePrevImage}
          >
            <Ionicons name="chevron-back" size={24} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full items-center justify-center shadow-md"
            onPress={handleNextImage}
          >
            <Ionicons name="chevron-forward" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        <View className="flex-row p-2 bg-white">
          {product?.product_imgs.map((image, index) => (
            <TouchableOpacity
              key={index}
              className={`mr-2 border-2 ${
                index === currentImageIndex
                  ? "border-[#1E5245]"
                  : "border-gray-200"
              } rounded-md overflow-hidden`}
              onPress={() => scrollToIndex(index)}
            >
              <Image
                source={{ uri: image }}
                className="w-14 h-14"
                resizeMode="cover"
              />
              {index === product.product_imgs.length - 1 && (
                <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
                  <Text className="text-white font-bold">+2</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800">
            {product?.product_name}
          </Text>

          <Text className="text-gray-600 mt-1">
            {product?.product_short_description}
          </Text>

          <View className="flex-row items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={16} color="#FFD700" />
            ))}
            <Text className="text-gray-500 ml-1">
              ( {product?.product_avg_rating.rating_count} đánh giá)
            </Text>
          </View>

          <View className="mt-4">
            <Text className="font-medium text-gray-800 mb-2">
              Chọn phân loại:
            </Text>
            <View className="flex-row">
              {product?.product_variants.map((variant) => (
                <TouchableOpacity
                  key={variant._id}
                  className="mr-3 border-2 border-[#1E5245] rounded-md overflow-hidden"
                >
                  <Image
                    source={{ uri: variant.variant_img }}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                  <View className="bg-gray-100 p-1">
                    <Text className="text-xs text-center">
                      {variant.variant_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mt-4">
            <Text className="font-medium text-gray-800 mb-2">
              Chọn số lượng:
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 bg-gray-200 rounded-md justify-center items-center"
                onPress={decrementQuantity}
              >
                <Ionicons name="remove" size={18} color="#4B5563" />
              </TouchableOpacity>
              <View className="w-10 h-8 mx-1 border border-gray-300 rounded-md justify-center items-center">
                <Text>{quantity}</Text>
              </View>
              <TouchableOpacity
                className="w-8 h-8 bg-gray-200 rounded-md justify-center items-center"
                onPress={incrementQuantity}
              >
                <Ionicons name="add" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center mt-4">
            {product?.product_variants[0]?.variant_price && (
              <Text className="text-gray-500 line-through mr-3">
                {formatPrice(product?.product_variants[0]?.variant_price)}
              </Text>
            )}
            {product?.product_variants[0]?.variant_discount_percent && (
              <Text className="text-xl font-bold text-[#14B8A6]">
                {formatPrice(
                  product.product_variants[0].variant_price *
                    (1 -
                      product.product_variants[0].variant_discount_percent /
                        100)
                )}
              </Text>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View className="border-t border-gray-200 mt-4 mb-36">
          <View className="flex-row border-b border-gray-200">
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "info" ? "border-b-2 border-[#14B8A6]" : ""
              }`}
              onPress={() => setActiveTab("info")}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "info" ? "text-[#14B8A6]" : "text-gray-600"
                }`}
              >
                Thông tin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "reviews" ? "border-b-2 border-[#14B8A6]" : ""
              }`}
              onPress={() => setActiveTab("reviews")}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "reviews" ? "text-[#14B8A6]" : "text-gray-600"
                }`}
              >
                Đánh giá
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "info" && (
            <View className="p-4">
              {product?.product_description && (
                <ProductDescription
                  product_description={
                    showFullDescription
                      ? product?.product_description
                      : product?.product_description.slice(0, 200) + "..."
                  }
                />
              )}

              <TouchableOpacity
                className="items-center mt-4"
                onPress={handleToggleDescription}
              >
                <Text className="text-[#14B8A6]">
                  {showFullDescription ? "Thu gọn ▲" : "Xem thêm ▼"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "reviews" && (
            <View className="p-4">
              <Text className="text-gray-700">Chưa có đánh giá nào.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Fixed bottom buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex-row">
        <TouchableOpacity
          className="flex-1 mr-2 border border-[#1E5245] rounded-md py-3 items-center"
          onPress={handleAddToCart}
        >
          <Text className="text-[#1E5245] font-medium">Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 ml-2 bg-[#1E5245] rounded-md py-3 items-center">
          <Text className="text-white font-medium">Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
