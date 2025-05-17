import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "https://meowhouse-api.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    // Lưu token và user info vào AsyncStorage
    await AsyncStorage.setItem("token", data.data.token);
    await AsyncStorage.setItem("refreshToken", data.data.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(data.data.user));

    return data; // trả về dữ liệu để component có thể sử dụng
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.multiRemove(["token", "refreshToken", "user"]);
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    throw error;
  }
};
