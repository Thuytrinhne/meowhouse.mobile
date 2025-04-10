import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="checkout"
        options={{
          title: "Thanh toán",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#1E5245",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#1E5245",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
