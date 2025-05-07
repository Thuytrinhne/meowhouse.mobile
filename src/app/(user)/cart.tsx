"use client";

import { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "@/types/cart";

export default function CartScreen() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleSelectItem = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.productId === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const incrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== id));
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalOriginalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.variant?.variant_price ?? 0) * item.quantity,
    0
  );

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.variant?.variant_price ?? 0) * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await AsyncStorage.getItem("cart");
        if (data) {
          const parsed = JSON.parse(data);
          const formatted = parsed.map((item: any) => ({
            ...item,
            selected: true, // default select all
          }));
          setCartItems(formatted);
        }
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      }
    };

    loadCart();
  }, []);
  const handleCheckout = async () => {
    try {
      await AsyncStorage.setItem(
        "checkoutItems",
        JSON.stringify(selectedItems)
      );
      router.push("/checkout");
    } catch (err) {
      console.error("❌ Failed to store checkout items:", err);
    }
  };
  const handleQuickDelete = async () => {
    try {
      const updatedCart = cartItems.filter((item) => !item.selected);
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (err) {
      console.error("❌ Failed to delete selected items:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Configure the system status bar appearance (top bar with time, battery, etc.)  */}
      {/* 'dark' style shows dark icons and text (recommended for light backgrounds) */}
      <StatusBar style="dark" />
      <View className="flex-1">
        {/* Quick Delete Button */}
        <View className="px-4 py-2 flex-row justify-end border-b border-gray-200">
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-md flex-row items-center"
            onPress={handleQuickDelete}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text className="text-white font-medium ml-1">Xóa nhanh</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Header */}
        <View className="flex-row px-4 py-3 border-b border-gray-200 bg-white">
          <View className="w-6"></View>
          <Text className="flex-1 font-semibold text-gray-800">Sản phẩm</Text>
          <Text className="w-24 text-center font-semibold text-gray-800">
            Số lượng
          </Text>
          <Text className="w-24 text-right font-semibold text-gray-800">
            Tổng tiền
          </Text>
        </View>

        {/* Cart Items */}
        <ScrollView className="flex-1">
          {cartItems.map((item) => (
            <View
              key={item.productId}
              className={`p-4 border-b border-gray-200 ${
                item.productId === "1" ? "bg-teal-50" : "bg-white"
              }`}
            >
              <View className="flex-row">
                {/* Checkbox */}
                <TouchableOpacity
                  className="mr-2 mt-1"
                  onPress={() => toggleSelectItem(item.productId)}
                >
                  <View
                    className={`w-5 h-5 rounded border ${
                      item.selected
                        ? "bg-[#1E5245] border-[#1E5245]"
                        : "border-gray-400"
                    } justify-center items-center`}
                  >
                    {item.selected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Column 1: Product Image - LARGER */}
                <View className="w-28 h-28 mr-3">
                  <Image
                    source={{ uri: item.variant?.variant_img }}
                    className="w-full h-full rounded-md"
                    resizeMode="contain"
                  />
                </View>

                {/* Column 2: Product Information */}
                <View className="flex-1">
                  {/* Product Name */}
                  <Text className="font-medium text-gray-800">{item.name}</Text>

                  {/* Category/Variant */}
                  <View className="mt-1">
                    <View className="bg-gray-200 rounded-full px-2 py-0.5 self-start">
                      <Text className="text-xs text-gray-600">
                        {item.variant?.variant_name}
                      </Text>
                    </View>
                  </View>

                  {/* Price */}
                  <View className="flex-row items-center mt-2">
                    <Text className="text-xs text-gray-500 line-through mr-2">
                      {formatPrice(item.variant?.variant_price ?? 0)}
                    </Text>
                    <Text className="text-sm font-bold text-gray-800">
                      {formatPrice(item.variant?.variant_price ?? 0)}
                    </Text>
                  </View>

                  {/* Quantity Controls and Total */}
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        className="w-8 h-8 bg-gray-200 rounded-md justify-center items-center"
                        onPress={() => decrementQuantity(item.productId)}
                      >
                        <Ionicons name="remove" size={18} color="#4B5563" />
                      </TouchableOpacity>
                      <TextInput
                        className="w-10 h-8 mx-1 text-center border border-gray-300 rounded-md"
                        value={item.quantity.toString()}
                        keyboardType="number-pad"
                      />
                      <TouchableOpacity
                        className="w-8 h-8 bg-gray-200 rounded-md justify-center items-center"
                        onPress={() => incrementQuantity(item.productId)}
                      >
                        <Ionicons name="add" size={18} color="#4B5563" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="font-bold text-gray-800 mr-2">
                        {formatPrice(
                          item.variant?.variant_price ?? 0 * item.quantity
                        )}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeItem(item.productId)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Order Summary */}
        <View className="bg-white p-4 border-t border-gray-200">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giá gốc</Text>
            <Text className="font-medium">
              {formatPrice(totalOriginalPrice)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giảm giá</Text>
            <Text className="font-medium text-red-500">
              {formatPrice(totalDiscount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Tổng tiền</Text>
            <Text className="font-bold text-lg text-[#1E5245]">
              {formatPrice(totalPrice)}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-[#1E5245] py-3 rounded-md"
            onPress={handleCheckout}
          >
            <Text className="text-white font-bold text-center">
              Đặt hàng ({selectedItems.length})
            </Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-center mt-4">
            Bằng việc tiến hành đặt hàng, bạn đồng ý với{" "}
            <Text className="text-blue-500">Điều khoản dịch vụ</Text> và{" "}
            <Text className="text-blue-500">Chính sách bảo mật</Text> của
            CatCorner.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
