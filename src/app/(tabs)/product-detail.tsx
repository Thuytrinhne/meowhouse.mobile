"use client";

import { useState, useRef } from "react";
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

const { width } = Dimensions.get("window");

interface ProductImage {
  id: string;
  uri: string;
}

interface ProductVariant {
  id: string;
  name: string;
  image: string;
}

export default function ProductDetailScreen() {
  const [activeTab, setActiveTab] = useState("info");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const productImages: ProductImage[] = [
    {
      id: "1",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
    {
      id: "2",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
    {
      id: "3",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
    {
      id: "4",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
    {
      id: "5",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
    {
      id: "6",
      uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212421-JiTJXWwX54mIafth5fka4kcvHWJGHF.png",
    },
  ];

  const productVariants: ProductVariant[] = [
    {
      id: "1",
      name: "Original",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20212437-iEFt6pzbFRL46hQAQL9D6YFCRSGO7G.png",
    },
  ];

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      scrollToIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
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
            data={productImages}
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
                  source={{ uri: item.uri }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
                <View className="absolute top-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded">
                  <Text className="text-white text-xs">
                    {currentImageIndex + 1}/{productImages.length}
                  </Text>
                </View>

                {/* Overlay text */}
                <View className="absolute top-1/4 left-8 right-8">
                  <Text className="text-[#C77C52] text-xl font-bold text-center mb-2">
                    FORCAT
                  </Text>
                  <Text className="text-[#C77C52] text-center mb-2">
                    Gỡ lông bằng một nút bấm
                  </Text>
                  <Text className="text-[#C77C52] text-center">
                    Không làm tổn hại đến da
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
          {productImages.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              className={`mr-2 border-2 ${
                index === currentImageIndex
                  ? "border-[#1E5245]"
                  : "border-gray-200"
              } rounded-md overflow-hidden`}
              onPress={() => scrollToIndex(index)}
            >
              <Image
                source={{ uri: image.uri }}
                className="w-14 h-14"
                resizeMode="cover"
              />
              {index === productImages.length - 1 && (
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
            Lược chải lông mèo Pawbby
          </Text>

          <Text className="text-gray-600 mt-1">
            Lược chải lông mèo Pawbby được thiết kế để loại bỏ hiệu quả lông
            rụng và lớp lông tơ khỏi mèo của bạn
          </Text>

          <View className="flex-row items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={16} color="#FFD700" />
            ))}
            <Text className="text-gray-500 ml-1">(492 đánh giá)</Text>
          </View>

          <View className="mt-4">
            <Text className="font-medium text-gray-800 mb-2">
              Chọn phân loại:
            </Text>
            <View className="flex-row">
              {productVariants.map((variant) => (
                <TouchableOpacity
                  key={variant.id}
                  className="mr-3 border-2 border-[#1E5245] rounded-md overflow-hidden"
                >
                  <Image
                    source={{ uri: variant.image }}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                  <View className="bg-gray-100 p-1">
                    <Text className="text-xs text-center">{variant.name}</Text>
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
            <Text className="text-gray-500 line-through mr-3">
              {formatPrice(451999)}
            </Text>
            <Text className="text-xl font-bold text-[#14B8A6]">
              {formatPrice(406799)}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="border-t border-gray-200 mt-4">
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
              <Text className="font-bold text-gray-800 mb-2">
                Tính năng sản phẩm:
              </Text>
              <Text className="text-gray-700 mb-1">
                • Thiết kế lưới giúp chải sâu vào lớp lông
              </Text>
              <Text className="text-gray-700 mb-1">
                • Phù hợp với nhiều giống vật nuôi và kích cỡ khác nhau
              </Text>
              <Text className="text-gray-700 mb-1">
                • Các cạnh được bo tròn an toàn
              </Text>
              <Text className="text-gray-700 mb-1">
                • Bàn chải giúp giảm rụng lông
              </Text>
              <Text className="text-gray-700 mb-1">
                • Gỡ lông bằng một nút bấm, thích hợp cho mọi loại lông
              </Text>

              <Text className="font-bold text-gray-800 mt-4 mb-2">
                Thông số kỹ thuật:
              </Text>
              <Text className="text-gray-700 mb-1">
                • Chất liệu: Nhựa, thép không gỉ
              </Text>
              <Text className="text-gray-700 mb-1">• Màu sắc: Trắng</Text>
              <Text className="text-gray-700 mb-1">
                • Kích thước: 149*70*49mm
              </Text>

              <TouchableOpacity className="items-center mt-4">
                <Text className="text-[#14B8A6]">Xem thêm ▼</Text>
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
        <TouchableOpacity className="flex-1 mr-2 border border-[#1E5245] rounded-md py-3 items-center">
          <Text className="text-[#1E5245] font-medium">Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 ml-2 bg-[#1E5245] rounded-md py-3 items-center">
          <Text className="text-white font-medium">Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
