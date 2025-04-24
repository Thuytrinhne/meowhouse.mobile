export interface Product {
  product_id_hashed: string;
  product_slug: string;
  product_img: string;
  product_name: string;
  category_name: string;
  product_sold_quantity: number;
  variant_names: string[];
  product_price: number;
  lowest_price: number;
  highest_discount: number;
  show_variants?: boolean;
  product_avg_rating: {
    rating_point: number;
    rating_count: number;
  };
}

export interface ProductVariant {
  variant_name: string;
  variant_price: number;
  variant_discount_percent: number;
  discounted_price: number;
  _id: number;
  variant_img: string;
}

export interface ProductDetail {
  _id: string;
  product_id_hashed: string;
  product_name: string;
  product_slug: string;
  category_name: string;
  product_imgs: string[]; // Đổi từ string thành string[]
  product_avg_rating: {
    // Đổi từ number thành đối tượng
    rating_point: number;
    rating_count: number;
  };
  product_sold_quantity: number;
  product_short_description: string;
  product_description: string;
  product_specifications: any[]; // Nếu có thông tin chi tiết, bạn có thể thay "any" bằng kiểu cụ thể hơn
  product_variants: ProductVariant[];
  review_count: any[]; // Cũng nên thay nếu cần chi tiết
  recent_reviews: any[]; // Tương tự như trên
  createdAt: string;
  updatedAt: string;
}
