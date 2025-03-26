import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, Image, View } from "react-native";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Button,
  ButtonText,
  Divider,
  VStack,
  HStack,
  Box,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "@gluestack-ui/themed";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // Chuyển hướng đến (tabs)/home
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <VStack space="lg" className="mt-10">
          {/* Header */}

          <Box>
            <Text className="text-3xl font-bold text-[#1a1a1a]">
              Chào mừng bạn quay lại!
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Chào mừng bạn đã quay lại với CatCorner. Hãy đăng nhập ngay để
              nhận nhiều ưu đãi từ CatCorner nhé!
            </Text>
          </Box>

          {/* Form */}
          <VStack space="md" className="mt-6 gap-3">
            {/* Email Input */}
            <Box>
              <Text className="text-base mb-2 text-gray-600">Email</Text>
              <Input
                variant="outline"
                size="lg"
                className="border border-gray-300 rounded-md"
              >
                <InputField
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  className="py-3 ml-2"
                />
              </Input>
            </Box>

            {/* Password Input */}
            <Box>
              <Text className="text-base mb-2 text-gray-600">Mật khẩu</Text>
              <Input
                variant="outline"
                size="lg"
                className="border border-gray-300 rounded-md flex flex-row justify-between"
              >
                <InputField
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChangeText={setPassword}
                  className="py-3 flex-1 ml-2"
                />
                <InputSlot
                  onPress={handleTogglePassword}
                  className="pr-3 h-10 w-10 "
                >
                  <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                </InputSlot>
              </Input>
            </Box>

            {/* Login Button */}
            <Button
              size="lg"
              className="bg-[#1d4b4b] rounded-md mt-4 py-3"
              onPress={handleLogin}
            >
              <ButtonText className="text-white font-medium text-center">
                Đăng nhập
              </ButtonText>
            </Button>

            {/* Forgot Password */}
            <TouchableOpacity className="self-center mt-2">
              <Text className="text-gray-500">Bạn quên mật khẩu ư?</Text>
            </TouchableOpacity>
          </VStack>

          {/* Divider */}
          <HStack space="sm" className="items-center my-6">
            <Divider className="w-full bg-gray-300 h-[1px] mb-4" />
            <Text className="text-gray-500 px-2">Hoặc đăng nhập với</Text>
          </HStack>

          {/* Social Login */}
          <HStack space="md" className="justify-center gap-4">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
                }}
                className="w-5 h-5 mr-2"
              />
              <Text className="text-[#1877F2] font-medium">Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-300 rounded-full py-3 px-4">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                }}
                className="w-5 h-5 mr-2"
              />
              <Text className="text-gray-700 font-medium">Google</Text>
            </TouchableOpacity>
          </HStack>

          {/* Non-member message */}
          <Text className="text-center text-gray-500 mt-6">
            Not a member? Get exclusive access to exhibitions and events, free
            admission every day, and much more
          </Text>
        </VStack>
      </ScrollView>
    </View>
  );
}
