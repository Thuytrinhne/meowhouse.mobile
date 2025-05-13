"use client";

import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStorage } from "@/hooks/useAuthStorage";

export default function MePage() {
  const { user, token, loading } = useAuthStorage();
  const router = useRouter();

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

        {/* Profile Section */}
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text className="text-xl font-bold text-[#1E5245] mb-4">
              Profile
            </Text>

            {/* User Info */}
            {user && (
              <View className="mb-6">
                <Text className="text-lg font-semibold">{user.name}</Text>
                <Text className="text-sm text-gray-600">{user.email}</Text>
                <Text className="text-sm text-gray-600 mt-2">
                  Joined: {user.joined}
                </Text>
              </View>
            )}

            {/* Orders History */}
            <Text className="text-xl font-bold text-[#1E5245] mb-4">
              Order History
            </Text>
            <View>
              {/* Example list of orders */}
              {user.orders && user.orders.length > 0 ? (
                user.orders.map((order, index) => (
                  <View
                    key={index}
                    className="p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <Text className="font-semibold">{`Order #${order.id}`}</Text>
                    <Text className="text-sm text-gray-600">
                      Total: {order.total}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Status: {order.status}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push(`/order-detail/${order.id}`)}
                      className="mt-2 bg-[#1E5245] py-2 px-4 rounded text-white text-center"
                    >
                      View Details
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No orders yet.</Text>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={() => {
                // Handle logout logic
              }}
              className="mt-6 bg-red-600 py-3 px-4 rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
