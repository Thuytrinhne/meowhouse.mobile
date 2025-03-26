"use client";

import type React from "react";
import { useState, useRef } from "react";
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
} from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Product {
  id: string;
  category: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  originalPrice: string;
  salePrice: string;
  discount: number;
  tags?: string[];
  colors?: string[];
  isNew?: boolean;
  isHotSale?: boolean;
}

const products: Product[] = [
  {
    id: "1",
    category: "Pate",
    name: "Pate cho mèo Neko Jelly đủ vị - Thái Lan",
    image:
      "https://meowhouse-web-six.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdmjwq3ebx%2Fimage%2Fupload%2Fv1735321851%2Fcatcorner%2Fproducts%2Fs2usitxqbwmkwqtlulyd.png&w=256&q=75",
    rating: 5,
    reviews: 251,
    originalPrice: "27.999đ",
    salePrice: "25.200đ",
    discount: 10,
    tags: ["Cá hồi", "Cá trắp", "Phô mai"],
    isNew: true,
  },
  {
    id: "2",
    category: "Đồ vệ sinh",
    name: "Lược chải lông mèo Pawbby",
    image:
      "https://meowhouse-web-six.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdmjwq3ebx%2Fimage%2Fupload%2Fv1735324284%2Fcatcorner%2Fproducts%2Fcv5zp5oivv50ifyrrb5d.webp&w=256&q=75",
    rating: 5,
    reviews: 492,
    originalPrice: "451.999đ",
    salePrice: "406.800đ",
    discount: 10,
    isHotSale: true,
  },
  {
    id: "3",
    category: "Cỏ mèo",
    name: "Cỏ mèo đàn tương Catnip",
    image:
      "https://meowhouse-web-six.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdmjwq3ebx%2Fimage%2Fupload%2Fv1735324284%2Fcatcorner%2Fproducts%2Fcv5zp5oivv50ifyrrb5d.webp&w=256&q=75",
    rating: 5,
    reviews: 327,
    originalPrice: "53.000đ",
    salePrice: "47.700đ",
    discount: 10,
    isNew: true,
  },
  {
    id: "4",
    category: "Cỏ mèo",
    name: "Cỏ bạc hà cho mèo Catnip",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20202038-OvBWpAUpKShWdSZr0j0nzWfHPl9548.png",
    rating: 5,
    reviews: 741,
    originalPrice: "51.999đ",
    salePrice: "46.199đ",
    discount: 10,
    isHotSale: true,
  },
  {
    id: "5",
    category: "Balo, Lồng",
    name: "Lồng mèo nan ống 3 tầng FORCAT",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-26%20202038-OvBWpAUpKShWdSZr0j0nzWfHPl9548.png",
    rating: 5,
    reviews: 331,
    originalPrice: "12.000đ",
    salePrice: "10.000đ",
    discount: 15,
    colors: ["Trắng sữa", "Đen sữa", "Xanh sữa"],
    isHotSale: true,
  },
  {
    id: "6",
    category: "Đồ chơi",
    name: "Đồ chơi cần câu mèo lông vũ",
    image:
      "https://meowhouse-web-six.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdmjwq3ebx%2Fimage%2Fupload%2Fv1735324284%2Fcatcorner%2Fproducts%2Fcv5zp5oivv50ifyrrb5d.webp&w=256&q=75",
    rating: 4,
    reviews: 127,
    originalPrice: "35.000đ",
    salePrice: "29.750đ",
    discount: 15,
    isNew: true,
  },
  {
    id: "7",
    category: "Thức ăn",
    name: "Thức ăn hạt Me-O cho mèo trưởng thành",
    image:
      "https://meowhouse-web-six.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdmjwq3ebx%2Fimage%2Fupload%2Fv1735324284%2Fcatcorner%2Fproducts%2Fcv5zp5oivv50ifyrrb5d.webp&w=256&q=75",
    rating: 5,
    reviews: 421,
    originalPrice: "175.000đ",
    salePrice: "148.750đ",
    discount: 15,
    isNew: true,
  },
];

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

interface ColorOptionProps {
  label: string;
}

const ColorOption: React.FC<ColorOptionProps> = ({ label }) => {
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
  const cardWidth = horizontal ? width - 80 : (width - 48) / 2;

  return (
    <View
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
      style={{
        width: cardWidth,
        marginRight: horizontal ? (index === products.length - 1 ? 0 : 16) : 0,
        marginBottom: horizontal ? 0 : 16,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: product.image }}
          className="w-full h-[160px]"
          resizeMode="contain"
        />
        {product.discount > 0 && (
          <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded">
            <Text className="text-white text-xs font-bold">
              -{product.discount}%
            </Text>
          </View>
        )}
      </View>

      <View className="p-3">
        <CategoryBadge category={product.category} />

        <Text className="text-base font-bold my-2 h-10">{product.name}</Text>

        <StarRating rating={product.rating} reviews={product.reviews} />

        {product.colors && (
          <View className="flex-row flex-wrap mt-2">
            {product.colors.map((color, idx) => (
              <ColorOption key={idx} label={color} />
            ))}
          </View>
        )}

        {product.tags && horizontal && (
          <View className="flex-row flex-wrap mt-2">
            {product.tags.map((tag, idx) => (
              <TagButton key={idx} label={tag} />
            ))}
          </View>
        )}

        <View className="flex-row justify-between items-center mt-2">
          {product.discount > 0 ? (
            <>
              <Text className="text-sm text-gray-400 line-through">
                {product.originalPrice}
              </Text>
              <Text className="text-lg font-bold text-red-600">
                {product.salePrice}
              </Text>
            </>
          ) : (
            <Text className="text-lg font-bold text-red-600">
              {product.originalPrice}
            </Text>
          )}
        </View>
      </View>
    </View>
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Product>>(null);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < products.length) {
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

  const hotSaleProducts = products.filter((product) => product.isHotSale);
  const newProducts = products.filter((product) => product.isNew);

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
            <TouchableOpacity className="ml-3">
              <Ionicons name="cart-outline" size={24} color="#1E5245" />
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
                data={products}
                renderItem={({ item, index }) => (
                  <ProductCard product={item} index={index} horizontal={true} />
                )}
                keyExtractor={(item) => item.id}
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

              {currentIndex < products.length - 1 && (
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
                  key={product.id}
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
                  key={product.id}
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
