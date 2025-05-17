// src/api/productApi.ts

import { Product } from "@/types/product";
import { ProductDetail } from "@/types/product";

export const fetchNewestProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(
      "https://meowhouse-api.vercel.app/api/guest/productList/getNewestProducts"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.data; // giả sử dữ liệu trả về là một mảng các sản phẩm
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return []; // trả về mảng rỗng nếu có lỗi
  }
};

export const fetchDiscountProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(
      "https://meowhouse-api.vercel.app/api/guest/productList/getDiscountProducts"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.data; // giả sử dữ liệu trả về là một mảng các sản phẩm
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return []; // trả về mảng rỗng nếu có lỗi
  }
};
export const fetchHotSalesProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(
      "https://meowhouse-api.vercel.app/api/guest/productList/getTopRatedProducts"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.data; // giả sử dữ liệu trả về là một mảng các sản phẩm
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return []; // trả về mảng rỗng nếu có lỗi
  }
};

export const fetchProductDetail = async (
  product_id_hashed: string
): Promise<ProductDetail | null> => {
  try {
    console.log("id", product_id_hashed);
    const response = await fetch(
      `https://meowhouse-api.vercel.app/api/guest/product/${product_id_hashed}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    // Đảm bảo bạn đang lấy đúng trường từ API trả về
    console.log("product-detail", data.data.product);

    return data.data.product; // Kiểm tra đúng trường "product"
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null; // trả về null nếu có lỗi
  }
};
