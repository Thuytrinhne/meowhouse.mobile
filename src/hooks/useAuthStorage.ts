import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStorage = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        const tokenString = await AsyncStorage.getItem("token");

        if (userString) {
          setUser(JSON.parse(userString));
        }
        if (tokenString) {
          setToken(tokenString);
        }
      } catch (error) {
        console.error("Failed to load auth data from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  return { user, token, loading };
};
