"use client";

import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  fetchNewestProducts,
  fetchDiscountProducts,
  fetchHotSalesProducts,
} from "@/api/productApi";
import { Product } from "@/types/product";
import { useAuthStorage } from "@/hooks/useAuthStorage";

const { width } = Dimensions.get("window");

interface StarRatingProps {
  rating: number;
  reviews: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviews }) => {
  return (
    <View className="flex-row items-center">
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={14}
          color={i < rating ? "#FFD700" : "#C4C4C4"}
        />
      ))}
      <Text className="text-xs text-gray-500 ml-1">({reviews})</Text>
    </View>
  );
};

interface TagButtonProps {
  label: string;
}

const TagButton: React.FC<TagButtonProps> = ({ label }) => {
  return (
    <TouchableOpacity className="px-3 py-1.5 rounded-2xl border border-teal-600 mr-2 mb-2">
      <Text className="text-xs text-teal-600">{label}</Text>
    </TouchableOpacity>
  );
};

interface VariantOptionProps {
  label: string;
}

const VariantOption: React.FC<VariantOptionProps> = ({ label }) => {
  if (label == "Original") return null;

  return (
    <TouchableOpacity className="px-3 py-1 rounded-full border border-teal-600 mr-2">
      <Text className="text-xs text-teal-600">{label}</Text>
    </TouchableOpacity>
  );
};

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <View className="bg-gray-100 rounded-full px-2 py-1 self-start">
      <Text className="text-xs text-gray-600">{category}</Text>
    </View>
  );
};

interface ProductCardProps {
  product: Product;
  index: number;
  horizontal?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  horizontal = true,
}) => {
  const router = useRouter();
  const cardWidth = horizontal ? width - 80 : (width - 48) / 2;

  return (
    <TouchableOpacity
      onPress={() => {
        console.log(product.product_id_hashed);
        router.push({
          pathname: "/product-detail",
          params: {
            id: encodeURIComponent(product.product_id_hashed),
          },
        });
      }}
    >
      <View
        className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
        style={{
          width: cardWidth,
          marginRight: horizontal ? (index === 16 ? 0 : 16) : 0,
          marginBottom: horizontal ? 0 : 16,
        }}
      >
        <View className="relative">
          <Image
            source={{ uri: product.product_img }}
            className="w-full h-[160px]"
            resizeMode="contain"
          />
          {product.highest_discount > 0 && (
            <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">
                -{product.highest_discount}%
              </Text>
            </View>
          )}
        </View>

        <View className="p-3">
          <CategoryBadge category={product.category_name} />
          <Text className="text-base font-bold my-2 h-10">
            {product.product_name}
          </Text>
          <StarRating
            rating={product.product_avg_rating.rating_point}
            reviews={product.product_sold_quantity}
          />
          {/* product variant */}
          {product.variant_names && (
            <View className="flex-row flex-wrap mt-2">
              {product.variant_names.map((name) => (
                <VariantOption key={name} label={name} />
              ))}
            </View>
          )}
          {/* {product.variant_name && horizontal && (
            <View className="flex-row flex-wrap mt-2">
              {product.tags.map((tag, idx) => (
                <TagButton key={idx} label={tag} />
              ))}
            </View>
          )} */}
          <View className="flex-row justify-between items-center mt-2">
            {product.highest_discount > 0 ? (
              <>
                <Text className="text-sm text-gray-400 line-through">
                  {product.product_price}
                </Text>
                <Text className="text-lg font-bold text-red-600">
                  {product.lowest_price}
                </Text>
              </>
            ) : (
              <Text className="text-lg font-bold text-red-600">
                {product.product_price}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface CarouselNavButtonProps {
  direction: "left" | "right";
  onPress: () => void;
}

const CarouselNavButton: React.FC<CarouselNavButtonProps> = ({
  direction,
  onPress,
}) => {
  const positionStyle = {
    [direction === "left" ? "left" : "right"]: 0,
    transform: [{ translateY: -20 }],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute top-1/2 bg-white w-10 h-10 rounded-full justify-center items-center shadow-sm z-10"
      style={positionStyle}
    >
      <Ionicons
        name={direction === "left" ? "chevron-back" : "chevron-forward"}
        size={24}
        color="#14B8A6"
      />
    </TouchableOpacity>
  );
};

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <Text className="text-xl font-bold text-center text-[#1E5245] mb-6">
      {title}
    </Text>
  );
};

export default function App() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Product>>(null);
  const [hotSaleProducts, sethotSaleProducts] = useState<Product[]>([]);
  const [newProducts, setnewProducts] = useState<Product[]>([]);
  const [todayProducts, setTodayProducts] = useState<Product[]>([]);
  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < hotSaleProducts.length) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedNewestProducts = await fetchNewestProducts();
      const fetchedHotSalesProducts = await fetchHotSalesProducts();
      const fetchedDiscountProducts = await fetchDiscountProducts();

      setnewProducts(fetchedNewestProducts);
      sethotSaleProducts(fetchedHotSalesProducts);
      setTodayProducts(fetchedDiscountProducts);
    };
    loadProducts();
  }, []);
  const { user, token, loading } = useAuthStorage();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GluestackUIProvider config={config}>
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
        <View className="p-4 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <TextInput placeholder="Bạn tìm gì..." className="flex-1 text-sm" />
            <TouchableOpacity className="bg-[#1E5245] rounded-lg p-2">
              <Ionicons name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-3"
              onPress={() => router.push("/cart")}
            >
              <Ionicons name="cart-outline" size={26} color="#1E5245" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-3">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1E5245"
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Hero Banner */}
          <View className="relative">
            <Image
              source={{
                uri: "https://via.placeholder.com/800x300/1E5245/FFFFFF",
              }}
              className="w-full h-[150px]"
              resizeMode="cover"
            />
            <View className="absolute inset-0 justify-center items-center">
              <Text className="text-2xl font-bold text-white text-center">
                Everything for your cat!
              </Text>
              <Text className="text-base text-white text-center mt-2">
                Satisfy your cat
              </Text>
            </View>
          </View>

          {/* Today's Products Section */}
          <View className="p-4">
            <SectionTitle title="Hôm nay tại CatCorner" />

            <View className="relative">
              {currentIndex > 0 && (
                <CarouselNavButton direction="left" onPress={handlePrev} />
              )}

              <FlatList
                ref={flatListRef}
                data={todayProducts}
                renderItem={({ item, index }) => (
                  <ProductCard product={item} index={index} horizontal={true} />
                )}
                keyExtractor={(item) => item.product_id_hashed}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 64}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 16 }}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (width - 64)
                  );
                  setCurrentIndex(newIndex);
                }}
              />

              {currentIndex < newProducts.length - 1 && (
                <CarouselNavButton direction="right" onPress={handleNext} />
              )}
            </View>
          </View>

          {/* Hot Sales Section */}
          <View className="px-4 pt-6 pb-2 bg-gray-50">
            <SectionTitle title="Hot Sales" />

            <View className="flex-row flex-wrap justify-between">
              {hotSaleProducts.map((product, index) => (
                <ProductCard
                  key={product.product_id_hashed}
                  product={product}
                  index={index}
                  horizontal={false}
                />
              ))}
            </View>
          </View>

          {/* New Products Section */}
          <View className="px-4 pt-6 pb-4">
            <SectionTitle title="Sản phẩm mới" />

            <View className="flex-row flex-wrap justify-between">
              {newProducts.map((product, index) => (
                <ProductCard
                  key={product.product_id_hashed}
                  product={product}
                  index={index}
                  horizontal={false}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Chat Button */}
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-md">
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
